import { z } from "zod";

const optionalText = z.string().trim().max(5000).optional().or(z.literal(""));
const optionalShortText = z.string().trim().max(255).optional().or(z.literal(""));

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nom requis").max(120),
  email: z.string().trim().email("Email invalide").max(255),
  password: z.string().min(10, "Le mot de passe doit contenir au moins 10 caractères"),
  invitationCode: z.string().trim().max(120).optional().or(z.literal(""))
});

export const loginSchema = z.object({
  email: z.string().trim().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis")
});

export const therapistProfileSchema = z.object({
  mainDiscipline: z.string().trim().min(2, "Discipline principale requise").max(160),
  secondaryDisciplines: optionalText,
  therapeuticApproach: optionalText,
  targetAudience: optionalText,
  supportedIssues: optionalText,
  defaultSessionDuration: z.coerce.number().int().min(15).max(240).optional().or(z.literal("")),
  accompanimentStyle: optionalText,
  professionalLimits: optionalText,
  language: z.string().trim().min(2).max(40).default("fr"),
  preferredTone: optionalText
});

export const clientSchema = z.object({
  firstName: optionalShortText,
  lastName: optionalShortText,
  email: z.string().trim().email("Email invalide").optional().or(z.literal("")),
  phone: optionalShortText,
  address: optionalText,
  birthDate: z.string().optional().or(z.literal("")),
  adminNotes: optionalText
});

export const anamnesisSchema = z.object({
  consultationReason: optionalText,
  mainGoal: optionalText,
  personalHistory: optionalText,
  medicalHistory: optionalText,
  currentTreatments: optionalText,
  medicationSupplements: optionalText,
  allergies: optionalText,
  sleep: optionalText,
  nutrition: optionalText,
  stress: optionalText,
  physicalActivity: optionalText,
  painSymptoms: optionalText,
  dominantEmotions: optionalText,
  lifeEvents: optionalText,
  dailyHabits: optionalText,
  familyContext: optionalText,
  professionalContext: optionalText,
  expectations: optionalText,
  contraindications: optionalText,
  warningSignals: optionalText,
  shortTermGoals: optionalText,
  mediumTermGoals: optionalText,
  freeNotes: optionalText
});

export const sessionSchema = z.object({
  sessionDate: z.string().min(1),
  durationMinutes: z.coerce.number().int().min(5).max(300).optional().or(z.literal("")),
  sessionType: optionalShortText,
  objective: optionalText,
  clientState: optionalText,
  performedInterventions: optionalText,
  observedReactions: optionalText,
  pointsToRevisit: optionalText,
  exercisesGiven: optionalText,
  nextStep: optionalText,
  rawNote: optionalText,
  structuredNote: optionalText,
  status: z.enum(["DRAFT", "FINALIZED"]).default("DRAFT")
});

export const aiSessionPlanSchema = z.object({
  durationMinutes: z.coerce.number().int().min(15).max(240),
  sessionType: optionalShortText,
  dayObjective: optionalText,
  intensityLevel: optionalShortText,
  sessionStyle: optionalText,
  desiredTools: optionalText,
  avoid: optionalText,
  therapistNotes: optionalText
});

export const structuredNoteSchema = z.object({
  sessionId: z.string().optional().or(z.literal("")),
  rawNote: z.string().trim().min(10, "Ajoutez une note brute suffisante").max(8000)
});

export const accessRequestSchema = z.object({
  name: z.string().trim().min(2, "Nom requis").max(120),
  email: z.string().trim().email("Email invalide").max(255),
  discipline: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal(""))
});

export function emptyToNull<T extends Record<string, unknown>>(data: T): T {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value === "" ? null : value])
  ) as T;
}
