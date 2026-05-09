"use client";

import { useActionState } from "react";
import type { Client } from "@prisma/client";
import { createClientAction, updateClientAction } from "@/server/actions/clients";
import type { ActionState } from "@/server/actions/auth";
import { ActionMessage } from "@/components/ui/ActionMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { TextArea, TextInput } from "@/components/ui/FormFields";

const initialState: ActionState = {};

export function ClientForm({ client }: { client?: Client }) {
  const action = client ? updateClientAction.bind(null, client.id) : createClientAction;
  const [state, formAction] = useActionState(action, initialState);
  const birthDate = client?.birthDate?.toISOString().slice(0, 10) ?? "";

  return (
    <form action={formAction} className="grid gap-4">
      <ActionMessage state={state} />
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Prénom" name="firstName" defaultValue={client?.firstName} />
        <TextInput label="Nom" name="lastName" defaultValue={client?.lastName} />
        <TextInput label="Email" name="email" type="email" defaultValue={client?.email} />
        <TextInput label="Téléphone" name="phone" defaultValue={client?.phone} />
        <TextInput label="Date de naissance" name="birthDate" type="date" defaultValue={birthDate} />
      </div>
      <TextArea label="Adresse" name="address" defaultValue={client?.address} />
      <TextArea label="Notes administratives internes" name="adminNotes" defaultValue={client?.adminNotes} />
      <SubmitButton>{client ? "Mettre à jour" : "Créer le client"}</SubmitButton>
    </form>
  );
}
