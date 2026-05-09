"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { buildAnonymizedClientContext, redactSensitiveText } from "@/lib/anonymization";
import { cleanAiText } from "@/lib/aiText";
import { aiSessionPlanSchema, structuredNoteSchema } from "@/lib/validators";
import { callOpenAI } from "@/lib/openai";
import { prisma } from "@/lib/db";
import type { ActionState } from "./auth";

const globalSystem = [
  "Tu es TheraFlow AI, un assistant professionnel pour thérapeutes.",
  "Tu aides à préparer, structurer et synthétiser des séances sans remplacer le thérapeute.",
  "Tu ne poses pas de diagnostic médical, tu ne prescris pas de traitement et tu ne recommandes jamais d'arrêter un traitement médical.",
  "Tu proposes des pistes à valider par le professionnel selon sa formation, son cadre et son jugement.",
  "Ajoute une section Point de vigilance en cas de symptômes graves, urgence médicale, idées suicidaires, violence, abus, trouble psychiatrique sévère, interaction plantes/médicaments ou demande hors cadre.",
  "Style attendu: clair, structuré, professionnel, humain, nuancé, non alarmiste.",
  "Réponds en texte simple lisible. N'utilise pas de Markdown décoratif: pas de ###, pas de **gras**, pas de tableaux Markdown."
].join("\n");

async function getAiContext(clientId: string, therapistId: string) {
  const client = await prisma.client.findFirst({
    where: { id: clientId, therapistId },
    include: {
      anamnesis: true,
      sessions: { orderBy: { sessionDate: "desc" }, take: 5 }
    }
  });
  if (!client) return null;

  const therapistProfile = await prisma.therapistProfile.findUnique({ where: { therapistId } });
  return {
    client,
    therapistProfile,
    context: buildAnonymizedClientContext({
      client,
      anamnesis: client.anamnesis,
      sessions: client.sessions,
      therapistProfile
    })
  };
}

export async function generateSessionPlanAction(
  clientId: string,
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = aiSessionPlanSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Données invalides" };

  const aiContext = await getAiContext(clientId, user.id);
  if (!aiContext) return { error: "Client introuvable" };

  const userPrompt = [
    "Contexte pseudonymisé du client:",
    aiContext.context,
    "",
    "Paramètres de la séance à préparer:",
    `- Durée: ${parsed.data.durationMinutes} minutes`,
    `- Type de séance: ${redactSensitiveText(parsed.data.sessionType, aiContext.client) ?? "non précisé"}`,
    `- Objectif du jour: ${redactSensitiveText(parsed.data.dayObjective, aiContext.client) ?? "non précisé"}`,
    `- Niveau d'intensité: ${redactSensitiveText(parsed.data.intensityLevel, aiContext.client) ?? "non précisé"}`,
    `- Style de séance: ${redactSensitiveText(parsed.data.sessionStyle, aiContext.client) ?? "non précisé"}`,
    `- Outils souhaités: ${redactSensitiveText(parsed.data.desiredTools, aiContext.client) ?? "non précisé"}`,
    `- Éléments à éviter: ${redactSensitiveText(parsed.data.avoid, aiContext.client) ?? "non précisé"}`,
    `- Notes du thérapeute: ${redactSensitiveText(parsed.data.therapistNotes, aiContext.client) ?? "non précisé"}`,
    "",
    "Génère: résumé, intention, points de vigilance, déroulé minute par minute, questions utiles, exercices, adaptations, conclusion, tâche interséance et note de suivi.",
    "Termine par: Cette proposition doit être adaptée et validée par le thérapeute."
  ].join("\n");

  try {
    const result = await callOpenAI({ system: globalSystem, user: userPrompt });
    const generatedContent = cleanAiText(result.content);
    await prisma.aiGeneratedSessionPlan.create({
      data: {
        ...parsed.data,
        sessionType: redactSensitiveText(parsed.data.sessionType, aiContext.client),
        dayObjective: redactSensitiveText(parsed.data.dayObjective, aiContext.client),
        intensityLevel: redactSensitiveText(parsed.data.intensityLevel, aiContext.client),
        sessionStyle: redactSensitiveText(parsed.data.sessionStyle, aiContext.client),
        desiredTools: redactSensitiveText(parsed.data.desiredTools, aiContext.client),
        avoid: redactSensitiveText(parsed.data.avoid, aiContext.client),
        therapistNotes: redactSensitiveText(parsed.data.therapistNotes, aiContext.client),
        generatedContent,
        clientId,
        therapistId: user.id
      }
    });
    await prisma.aiRequestLog.create({
      data: { therapistId: user.id, clientId, type: "SESSION_PLAN", status: "SUCCESS", model: result.model }
    });
    revalidatePath(`/clients/${clientId}/ai-session`);
    return { success: "Proposition IA générée et sauvegardée" };
  } catch (error) {
    await prisma.aiRequestLog.create({
      data: {
        therapistId: user.id,
        clientId,
        type: "SESSION_PLAN",
        status: "ERROR",
        error: error instanceof Error ? error.message.slice(0, 180) : "Erreur inconnue"
      }
    });
    return { error: error instanceof Error ? error.message : "Erreur IA" };
  }
}

export async function structurePostSessionNoteAction(
  clientId: string,
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = structuredNoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Données invalides" };

  const aiContext = await getAiContext(clientId, user.id);
  if (!aiContext) return { error: "Client introuvable" };

  const rawNote = redactSensitiveText(parsed.data.rawNote, aiContext.client) ?? "";
  const userPrompt = [
    "Contexte pseudonymisé du client:",
    aiContext.context,
    "",
    "Note brute du thérapeute, déjà filtrée:",
    rawNote,
    "",
    "Structure la note en: résumé, interventions, réactions, éléments importants, hypothèses à confirmer, points de vigilance, exercice donné, prochaine étape. N'ajoute aucune information absente."
  ].join("\n");

  try {
    const result = await callOpenAI({ system: globalSystem, user: userPrompt });
    const structuredNote = cleanAiText(result.content);
    const existingSessionId = parsed.data.sessionId || null;
    if (existingSessionId) {
      const session = await prisma.therapySession.findFirst({
        where: { id: existingSessionId, clientId, therapistId: user.id }
      });
      if (!session) return { error: "Séance à mettre à jour introuvable" };
      await prisma.therapySession.update({
        where: { id: session.id },
        data: { rawNote, structuredNote }
      });
    } else {
      await prisma.therapySession.create({
        data: {
          clientId,
          therapistId: user.id,
          sessionDate: new Date(),
          rawNote,
          structuredNote,
          status: "DRAFT"
        }
      });
    }
    await prisma.aiRequestLog.create({
      data: { therapistId: user.id, clientId, type: "STRUCTURED_NOTE", status: "SUCCESS", model: result.model }
    });
    revalidatePath(`/clients/${clientId}`);
    revalidatePath(`/clients/${clientId}/sessions`);
    return { success: existingSessionId ? "Note IA ajoutée à la séance" : "Note structurée créée dans l'historique" };
  } catch (error) {
    await prisma.aiRequestLog.create({
      data: {
        therapistId: user.id,
        clientId,
        type: "STRUCTURED_NOTE",
        status: "ERROR",
        error: error instanceof Error ? error.message.slice(0, 180) : "Erreur inconnue"
      }
    });
    return { error: error instanceof Error ? error.message : "Erreur IA" };
  }
}
