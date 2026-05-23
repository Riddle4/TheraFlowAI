"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { buildAnonymizedClientContext, redactSensitiveText } from "@/lib/anonymization";
import { cleanAiText } from "@/lib/aiText";
import { aiSessionPlanSchema } from "@/lib/validators";
import { callOpenAI } from "@/lib/openai";
import { prisma } from "@/lib/db";
import { assertCanUseFeature, SubscriptionLimitError } from "@/lib/subscription";
import type { ActionState } from "./auth";

const globalSystem = [
  "Tu es TheraFlow AI, un assistant professionnel pour thérapeutes.",
  "Tu aides à préparer des séances personnalisées sans remplacer le thérapeute.",
  "Tu réponds uniquement aux demandes liées à la préparation, au suivi ou à l'organisation de séances thérapeutiques et d'accompagnement.",
  "Si la demande sort de ce cadre, réponds seulement: Je ne peux pas traiter cette demande hors du cadre thérapeutique de TheraFlow AI.",
  "Tu ne poses pas de diagnostic médical, tu ne prescris pas de traitement et tu ne recommandes jamais d'arrêter un traitement médical.",
  "Tu proposes des pistes à valider par le professionnel selon sa formation, son cadre et son jugement.",
  "Ajoute une section Point de vigilance en cas de symptômes graves, urgence médicale, idées suicidaires, violence, abus, trouble psychiatrique sévère, interaction plantes/médicaments ou demande hors cadre.",
  "Style attendu: clair, structuré, professionnel, humain, nuancé, non alarmiste.",
  "Réponds en texte simple lisible. N'utilise pas de Markdown décoratif: pas de ###, pas de **gras**, pas de tableaux Markdown."
].join("\n");

const offTopicPatterns = [
  /\b(recette|g[aâ]teau|chocolat|cuisine|p[âa]tisserie)\b/i,
  /\b(code|programme|script|javascript|python|sql|html|css)\b/i,
  /\b(marketing|vente|trading|crypto|bourse)\b/i,
  /\b(voyage|h[oô]tel|restaurant|itin[ée]raire)\b/i
];

function isClearlyOutsideTherapeuticScope(values: Array<string | null | undefined>) {
  const combined = values.filter(Boolean).join("\n");
  return offTopicPatterns.some((pattern) => pattern.test(combined));
}

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
  if (
    isClearlyOutsideTherapeuticScope([
      parsed.data.sessionType,
      parsed.data.dayObjective,
      parsed.data.sessionStyle,
      parsed.data.desiredTools,
      parsed.data.avoid,
      parsed.data.therapistNotes
    ])
  ) {
    return { error: "La préparation IA est limitée au cadre thérapeutique et au suivi de séance." };
  }
  try {
    await assertCanUseFeature(user.id, "GENERATE_AI");
  } catch (error) {
    if (error instanceof SubscriptionLimitError) return { error: error.message };
    throw error;
  }

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
    revalidatePath(`/app/clients/${clientId}/ai-session`);
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

export async function saveAiPlanToTimelineAction(clientId: string, planId: string): Promise<void> {
  const user = await requireUser();
  try {
    await assertCanUseFeature(user.id, "CREATE_SESSION");
  } catch (error) {
    if (error instanceof SubscriptionLimitError) {
      throw new Error(error.message);
    }
    throw error;
  }

  const plan = await prisma.aiGeneratedSessionPlan.findFirst({
    where: { id: planId, clientId, therapistId: user.id }
  });
  if (!plan) throw new Error("Proposition IA introuvable.");

  await prisma.$transaction(async (tx) => {
    await tx.therapySession.create({
      data: {
        clientId,
        therapistId: user.id,
        sessionDate: new Date(),
        durationMinutes: plan.durationMinutes,
        sessionType: plan.sessionType,
        objective: plan.dayObjective,
        aiSessionPlan: cleanAiText(plan.generatedContent),
        status: "DRAFT"
      }
    });
    await tx.aiGeneratedSessionPlan.delete({
      where: { id: plan.id }
    });
  });

  revalidatePath(`/app/clients/${clientId}`);
  revalidatePath(`/app/clients/${clientId}/timeline`);
  revalidatePath(`/app/clients/${clientId}/ai-session`);
  redirect(`/app/clients/${clientId}/timeline`);
}
