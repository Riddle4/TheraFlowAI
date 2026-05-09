"use client";

import { useActionState } from "react";
import type { TherapistProfile } from "@prisma/client";
import { upsertTherapistProfileAction } from "@/server/actions/therapistProfile";
import type { ActionState } from "@/server/actions/auth";
import { ActionMessage } from "@/components/ui/ActionMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { TextArea, TextInput } from "@/components/ui/FormFields";

const initialState: ActionState = {};

export function ProfileForm({ profile }: { profile?: TherapistProfile | null }) {
  const [state, action] = useActionState(upsertTherapistProfileAction, initialState);
  return (
    <form action={action} className="grid gap-4">
      <ActionMessage state={state} />
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Discipline principale" name="mainDiscipline" required defaultValue={profile?.mainDiscipline} />
        <TextInput label="Langue de travail" name="language" defaultValue={profile?.language ?? "fr"} />
        <TextInput
          label="Durée habituelle des séances"
          name="defaultSessionDuration"
          type="number"
          defaultValue={profile?.defaultSessionDuration ?? 60}
        />
      </div>
      <TextArea label="Disciplines secondaires" name="secondaryDisciplines" defaultValue={profile?.secondaryDisciplines} />
      <TextArea label="Approche thérapeutique" name="therapeuticApproach" defaultValue={profile?.therapeuticApproach} />
      <TextArea label="Public cible" name="targetAudience" defaultValue={profile?.targetAudience} />
      <TextArea label="Problématiques accompagnées" name="supportedIssues" defaultValue={profile?.supportedIssues} />
      <TextArea label="Style d'accompagnement" name="accompanimentStyle" defaultValue={profile?.accompanimentStyle} />
      <TextArea label="Limites professionnelles" name="professionalLimits" defaultValue={profile?.professionalLimits} />
      <TextArea label="Ton souhaité pour les propositions IA" name="preferredTone" defaultValue={profile?.preferredTone} />
      <SubmitButton>Enregistrer le profil</SubmitButton>
    </form>
  );
}
