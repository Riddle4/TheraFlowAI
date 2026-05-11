"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/ui/ActionMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { TextArea, TextInput } from "@/components/ui/FormFields";
import { loginAction, registerAction, requestAccessAction, type ActionState } from "@/server/actions/auth";

const initialState: ActionState = {};

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initialState);
  return (
    <form action={action} className="grid gap-4">
      <ActionMessage state={state} />
      <TextInput label="Email" name="email" type="email" required />
      <TextInput label="Mot de passe" name="password" type="password" required />
      <SubmitButton>Connexion</SubmitButton>
    </form>
  );
}

export function RegisterForm({ requireInvitation = true }: { requireInvitation?: boolean }) {
  const [state, action] = useActionState(registerAction, initialState);
  return (
    <form action={action} className="grid gap-4">
      <ActionMessage state={state} />
      <TextInput label="Nom professionnel" name="name" required />
      <TextInput label="Email" name="email" type="email" required />
      <TextInput label="Code d'invitation" name="invitationCode" required={requireInvitation} />
      <TextInput label="Mot de passe" name="password" type="password" required />
      <p className="text-xs leading-5 text-ink/55">Minimum 10 caractères. Le mot de passe est haché côté serveur.</p>
      <SubmitButton>Créer mon espace</SubmitButton>
    </form>
  );
}

export function RequestAccessForm() {
  const [state, action] = useActionState(requestAccessAction, initialState);
  return (
    <form action={action} className="grid gap-4">
      <ActionMessage state={state} />
      <TextInput label="Nom professionnel" name="name" required />
      <TextInput label="Email" name="email" type="email" required />
      <TextInput label="Discipline principale" name="discipline" />
      <TextArea
        label="Message"
        name="message"
        placeholder="Votre pratique, votre contexte, vos besoins principaux..."
      />
      <SubmitButton>Demander un accès</SubmitButton>
    </form>
  );
}
