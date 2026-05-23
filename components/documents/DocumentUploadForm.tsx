"use client";

import { useActionState } from "react";
import { uploadClientDocumentAction } from "@/server/actions/documents";
import type { ActionState } from "@/server/actions/auth";
import { ActionMessage } from "@/components/ui/ActionMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { TextArea } from "@/components/ui/FormFields";

const initialState: ActionState = {};

export function DocumentUploadForm({ clientId }: { clientId: string }) {
  const [state, action] = useActionState(uploadClientDocumentAction.bind(null, clientId), initialState);

  return (
    <form action={action} className="grid gap-4">
      <ActionMessage state={state} />
      <label className="grid gap-1.5 text-sm font-medium text-ink/80">
        Fichier
        <input
          className="focus-ring rounded-md border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink shadow-sm"
          name="file"
          type="file"
          required
        />
      </label>
      <TextArea label="Note interne facultative" name="note" />
      <SubmitButton>Importer le document</SubmitButton>
      <p className="text-xs leading-5 text-ink/50">Formats libres: PDF, Word, images ou autres documents utiles. Limite: 10 Mo.</p>
    </form>
  );
}
