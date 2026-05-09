"use client";

import { deleteClientAction } from "@/server/actions/clients";

export function DeleteClientButton({ clientId }: { clientId: string }) {
  return (
    <button
      className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
      onClick={() => {
        if (confirm("Supprimer ce client et tout son historique ?")) {
          void deleteClientAction(clientId);
        }
      }}
    >
      Supprimer
    </button>
  );
}
