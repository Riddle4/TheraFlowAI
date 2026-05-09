import { describe, expect, it } from "vitest";
import { buildAnonymizedClientContext, redactSensitiveText } from "@/lib/anonymization";

const client = {
  id: "client-1",
  therapistId: "therapist-1",
  pseudonym: "TF-0007",
  firstName: "Alice",
  lastName: "Martin",
  email: "alice@example.test",
  phone: "+41 79 111 22 33",
  address: "Rue du Lac 1",
  birthDate: new Date("1986-01-10"),
  adminNotes: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe("pseudonymisation IA", () => {
  it("retire les identifiants directs des textes libres", () => {
    const redacted = redactSensitiveText(
      "Alice Martin alice@example.test +41 79 111 22 33 née le 10.01.1986",
      client
    );

    expect(redacted).not.toContain("Alice");
    expect(redacted).not.toContain("Martin");
    expect(redacted).not.toContain("alice@example.test");
    expect(redacted).not.toContain("+41 79 111 22 33");
    expect(redacted).not.toContain("10.01.1986");
  });

  it("construit un contexte avec pseudonyme et sans date de naissance complète", () => {
    const context = buildAnonymizedClientContext({
      client,
      anamnesis: {
        id: "a1",
        clientId: "client-1",
        consultationReason: "Stress important chez Alice",
        mainGoal: "Retrouver du calme",
        personalHistory: null,
        medicalHistory: null,
        currentTreatments: null,
        medicationSupplements: null,
        allergies: null,
        sleep: null,
        nutrition: null,
        stress: null,
        physicalActivity: null,
        painSymptoms: null,
        dominantEmotions: null,
        lifeEvents: null,
        dailyHabits: null,
        familyContext: null,
        professionalContext: null,
        expectations: null,
        contraindications: null,
        warningSignals: null,
        shortTermGoals: null,
        mediumTermGoals: null,
        freeNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      sessions: [],
      therapistProfile: null
    });

    expect(context).toContain("TF-0007");
    expect(context).toContain("Tranche d'âge");
    expect(context).not.toContain("Alice");
    expect(context).not.toContain("1986-01-10");
    expect(context).not.toContain("alice@example.test");
  });
});
