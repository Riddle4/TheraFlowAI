"use client";

import { useActionState } from "react";
import type { TherapySession } from "@prisma/client";
import { generateSessionPlanAction, structurePostSessionNoteAction } from "@/server/actions/ai";
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

export function StructuredNoteForm({
  clientId,
  sessions = []
}: {
  clientId: string;
  sessions?: Array<Pick<TherapySession, "id" | "sessionDate" | "objective" | "status">>;
}) {
  const [state, action] = useActionState(structurePostSessionNoteAction.bind(null, clientId), initialState);
  return (
    <form action={action} className="grid gap-4">
      <ActionMessage state={state} />
      <label className="grid gap-1.5 text-sm font-medium text-ink/80">
        Associer à une séance existante
        <select className="focus-ring rounded-md border border-ink/15 bg-white px-3 py-2.5 text-ink shadow-sm" name="sessionId" defaultValue="">
          <option value="">Créer une nouvelle séance brouillon</option>
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.sessionDate.toLocaleDateString("fr-CH")} - {session.objective ?? "Sans objectif"} - {session.status}
            </option>
          ))}
        </select>
      </label>
      <TextArea label="Note brute après séance" name="rawNote" required />
      <SubmitButton>Structurer avec l'IA</SubmitButton>
    </form>
  );
}
