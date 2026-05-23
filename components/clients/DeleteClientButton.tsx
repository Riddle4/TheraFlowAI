"use client";

import { deleteClientAction } from "@/server/actions/clients";

export function DeleteClientButton({ clientId }: { clientId: string }) {
  return (
    <form
      action={deleteClientAction.bind(null, clientId)}
      onSubmit={(event) => {
        if (!confirm("Supprimer ce client et tout son historique ?")) {
          event.preventDefault();
        }
      }}
    >
      <button className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
        Supprimer
      </button>
    </form>
  );
}
