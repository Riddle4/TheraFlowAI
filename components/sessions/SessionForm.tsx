"use client";

import { useActionState } from "react";
import type { TherapySession } from "@prisma/client";
import { createSessionNoteAction, updateSessionNoteAction } from "@/server/actions/sessions";
import type { ActionState } from "@/server/actions/auth";
import { ActionMessage } from "@/components/ui/ActionMessage";
import { SelectInput, TextArea, TextInput } from "@/components/ui/FormFields";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: ActionState = {};

export function SessionForm({ clientId, session }: { clientId: string; session?: TherapySession }) {
  const formAction = session
    ? updateSessionNoteAction.bind(null, clientId, session.id)
    : createSessionNoteAction.bind(null, clientId);
  const [state, action] = useActionState(formAction, initialState);
  return (
    <form action={action} className="grid gap-4">
      <ActionMessage state={state} />
      <div className="grid gap-4 md:grid-cols-3">
        <TextInput
          label="Date"
          name="sessionDate"
          type="date"
          defaultValue={(session?.sessionDate ?? new Date()).toISOString().slice(0, 10)}
          required
        />
        <TextInput label="Durée (min)" name="durationMinutes" type="number" defaultValue={session?.durationMinutes ?? 60} />
        <SelectInput
          label="Statut"
          name="status"
          defaultValue={session?.status ?? "DRAFT"}
          options={[
            { value: "DRAFT", label: "Brouillon" },
            { value: "FINALIZED", label: "Finalisée" }
          ]}
        />
      </div>
      <TextInput label="Type de séance" name="sessionType" defaultValue={session?.sessionType} />
      <TextArea label="Objectif" name="objective" defaultValue={session?.objective} />
      <TextArea label="État du client" name="clientState" defaultValue={session?.clientState} />
      <TextArea label="Interventions réalisées" name="performedInterventions" defaultValue={session?.performedInterventions} />
      <TextArea label="Réactions observées" name="observedReactions" defaultValue={session?.observedReactions} />
      <TextArea label="Points à reprendre" name="pointsToRevisit" defaultValue={session?.pointsToRevisit} />
      <TextArea label="Exercices donnés" name="exercisesGiven" defaultValue={session?.exercisesGiven} />
      <TextArea label="Prochaine étape" name="nextStep" defaultValue={session?.nextStep} />
      <TextArea label="Notes en vrac pendant / après séance" name="rawNote" defaultValue={session?.rawNote} />
      {session?.structuredNote ? (
        <TextArea label="Ancienne note structurée" name="structuredNote" defaultValue={session.structuredNote} />
      ) : null}
      <SubmitButton>{session ? "Sauvegarder la séance" : "Créer la séance"}</SubmitButton>
    </form>
  );
}
