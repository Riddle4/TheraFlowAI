"use client";

import { deleteClientDocumentAction } from "@/server/actions/documents";

export function DeleteDocumentButton({ clientId, documentId }: { clientId: string; documentId: string }) {
  return (
    <button
      className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
      onClick={() => {
        if (confirm("Supprimer ce document ?")) {
          void deleteClientDocumentAction(clientId, documentId);
        }
      }}
    >
      Supprimer
    </button>
  );
}
