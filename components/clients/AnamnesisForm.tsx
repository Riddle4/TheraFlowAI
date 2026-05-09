"use client";

import { useActionState } from "react";
import type { Anamnesis } from "@prisma/client";
import { upsertAnamnesisAction } from "@/server/actions/anamnesis";
import type { ActionState } from "@/server/actions/auth";
import { ActionMessage } from "@/components/ui/ActionMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { TextArea } from "@/components/ui/FormFields";

const fields: Array<[keyof Anamnesis, string]> = [
  ["consultationReason", "Motif de consultation"],
  ["mainGoal", "Objectif principal"],
  ["personalHistory", "Historique"],
  ["medicalHistory", "Historique médical pertinent"],
  ["currentTreatments", "Traitements en cours"],
  ["medicationSupplements", "Médicaments / compléments"],
  ["allergies", "Allergies"],
  ["sleep", "Sommeil"],
  ["nutrition", "Alimentation"],
  ["stress", "Stress"],
  ["physicalActivity", "Activité physique"],
  ["painSymptoms", "Douleurs / symptômes"],
  ["dominantEmotions", "Émotions"],
  ["lifeEvents", "Événements de vie"],
  ["dailyHabits", "Habitudes quotidiennes"],
  ["familyContext", "Contexte familial"],
  ["professionalContext", "Contexte professionnel"],
  ["expectations", "Attentes"],
  ["contraindications", "Contre-indications"],
  ["warningSignals", "Signaux d'alerte"],
  ["shortTermGoals", "Objectifs court terme"],
  ["mediumTermGoals", "Objectifs moyen terme"],
  ["freeNotes", "Notes libres"]
];

const initialState: ActionState = {};

export function AnamnesisForm({ clientId, anamnesis }: { clientId: string; anamnesis?: Anamnesis | null }) {
  const [state, action] = useActionState(upsertAnamnesisAction.bind(null, clientId), initialState);
  return (
    <form action={action} className="grid gap-4">
      <ActionMessage state={state} />
      <div className="grid gap-4 lg:grid-cols-2">
        {fields.map(([name, label]) => (
          <TextArea key={name} label={label} name={name} defaultValue={anamnesis?.[name] as string | null} />
        ))}
      </div>
      <SubmitButton>Enregistrer l'anamnèse</SubmitButton>
    </form>
  );
}
