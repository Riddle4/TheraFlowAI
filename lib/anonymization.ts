import type { Anamnesis, Client, TherapistProfile, TherapySession } from "@prisma/client";

type Input = {
  client: Client;
  anamnesis?: Anamnesis | null;
  sessions?: TherapySession[];
  therapistProfile?: TherapistProfile | null;
};

const REDACTED = "[masque]";

function ageBand(birthDate?: Date | null): string | null {
  if (!birthDate) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!birthdayPassed) age -= 1;
  if (age < 18) return "moins de 18 ans";
  if (age < 26) return "18-25 ans";
  if (age < 36) return "26-35 ans";
  if (age < 46) return "36-45 ans";
  if (age < 56) return "46-55 ans";
  if (age < 66) return "56-65 ans";
  return "plus de 65 ans";
}

export function redactSensitiveText(value?: string | null, client?: Client): string | null {
  if (!value) return null;
  let text = value;
  const directTokens = [
    client?.firstName,
    client?.lastName,
    client?.email,
    client?.phone,
    client?.address
  ].filter(Boolean) as string[];

  for (const token of directTokens) {
    text = text.replaceAll(token, REDACTED);
  }

  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, REDACTED)
    .replace(/(\+?\d[\d\s().-]{7,}\d)/g, REDACTED)
    .replace(/\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/g, REDACTED)
    .replace(/\b(AVS|NSS|SSN)\s*[:#]?\s*[\w.-]+/gi, REDACTED);
}

function line(label: string, value?: string | number | null): string | null {
  if (value === null || value === undefined || value === "") return null;
  return `- ${label}: ${value}`;
}

export function buildAnonymizedClientContext({
  client,
  anamnesis,
  sessions = [],
  therapistProfile
}: Input): string {
  const profileLines = [
    line("Discipline principale", therapistProfile?.mainDiscipline),
    line("Approche", redactSensitiveText(therapistProfile?.therapeuticApproach, client)),
    line("Limites professionnelles", redactSensitiveText(therapistProfile?.professionalLimits, client)),
    line("Langue", therapistProfile?.language),
    line("Ton souhaité", therapistProfile?.preferredTone)
  ].filter(Boolean);

  const anamnesisLines = anamnesis
    ? [
        line("Motif", redactSensitiveText(anamnesis.consultationReason, client)),
        line("Objectif principal", redactSensitiveText(anamnesis.mainGoal, client)),
        line("Historique", redactSensitiveText(anamnesis.personalHistory, client)),
        line("Traitements", redactSensitiveText(anamnesis.currentTreatments, client)),
        line("Allergies", redactSensitiveText(anamnesis.allergies, client)),
        line("Sommeil", redactSensitiveText(anamnesis.sleep, client)),
        line("Alimentation", redactSensitiveText(anamnesis.nutrition, client)),
        line("Stress", redactSensitiveText(anamnesis.stress, client)),
        line("Douleurs/symptômes", redactSensitiveText(anamnesis.painSymptoms, client)),
        line("Émotions", redactSensitiveText(anamnesis.dominantEmotions, client)),
        line("Contre-indications", redactSensitiveText(anamnesis.contraindications, client)),
        line("Signaux d'alerte", redactSensitiveText(anamnesis.warningSignals, client)),
        line("Objectifs court terme", redactSensitiveText(anamnesis.shortTermGoals, client)),
        line("Objectifs moyen terme", redactSensitiveText(anamnesis.mediumTermGoals, client)),
        line("Notes libres", redactSensitiveText(anamnesis.freeNotes, client))
      ].filter(Boolean)
    : ["- Aucune anamnèse structurée enregistrée"];

  const sessionLines = sessions.slice(0, 5).map((session, index) => {
    const parts = [
      `Séance ${index + 1} (${session.sessionDate.toISOString().slice(0, 10)})`,
      session.objective ? `objectif: ${redactSensitiveText(session.objective, client)}` : null,
      session.observedReactions ? `réactions: ${redactSensitiveText(session.observedReactions, client)}` : null,
      session.nextStep ? `suite: ${redactSensitiveText(session.nextStep, client)}` : null
    ].filter(Boolean);
    return `- ${parts.join(" | ")}`;
  });

  return [
    "Client pseudonymisé:",
    line("Identifiant interne", client.pseudonym),
    line("Tranche d'âge", ageBand(client.birthDate)),
    "",
    "Profil thérapeute utile:",
    ...profileLines,
    "",
    "Anamnèse synthétique:",
    ...anamnesisLines,
    "",
    "Historique récent:",
    ...(sessionLines.length ? sessionLines : ["- Aucun historique de séance"])
  ]
    .filter((value) => value !== null)
    .join("\n");
}
