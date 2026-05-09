"use client";

import { deleteSessionAction } from "@/server/actions/sessions";

export function DeleteSessionButton({ clientId, sessionId }: { clientId: string; sessionId: string }) {
  return (
    <button
      className="rounded-md border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
      onClick={() => {
        if (confirm("Supprimer cette séance ?")) {
          void deleteSessionAction(clientId, sessionId);
        }
      }}
    >
      Supprimer la séance
    </button>
  );
}
