"use client";

import { useActionState } from "react";
import { generateSessionPlanAction } from "@/server/actions/ai";
import type { ActionState } from "@/server/actions/auth";
import { ActionMessage } from "@/components/ui/ActionMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { TextArea, TextInput } from "@/components/ui/FormFields";

const initialState: ActionState = {};

export function AiSessionPlanForm({ clientId, defaultDuration }: { clientId: string; defaultDuration?: number | null }) {
  const [state, action] = useActionState(generateSessionPlanAction.bind(null, clientId), initialState);
  return (
    <form action={action} className="grid gap-4">
      <ActionMessage state={state} />
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Durée (minutes)" name="durationMinutes" type="number" defaultValue={defaultDuration ?? 60} required />
        <TextInput label="Type de séance" name="sessionType" placeholder="suivi, première séance, régulation..." />
        <TextInput label="Niveau d'intensité" name="intensityLevel" placeholder="doux, modéré, profond..." />
        <TextInput label="Style de séance" name="sessionStyle" placeholder="structuré, exploratoire..." />
      </div>
      <TextArea label="Objectif du jour" name="dayObjective" />
      <TextArea label="Outils souhaités" name="desiredTools" />
      <TextArea label="Choses à éviter" name="avoid" />
      <TextArea label="Notes libres" name="therapistNotes" />
      <SubmitButton>Préparer une séance IA</SubmitButton>
    </form>
  );
}
