"use client";

import { deleteSessionAction } from "@/server/actions/sessions";

export function DeleteSessionButton({
  clientId,
  sessionId,
  compact = false
}: {
  clientId: string;
  sessionId: string;
  compact?: boolean;
}) {
  return (
    <form
      action={deleteSessionAction.bind(null, clientId, sessionId)}
      onSubmit={(event) => {
        if (!confirm("Supprimer cette séance ?")) {
          event.preventDefault();
        }
      }}
    >
      <button
        className={`rounded-md border border-red-200 font-semibold text-red-700 hover:bg-red-50 ${
          compact ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm"
        }`}
      >
        Supprimer la séance
      </button>
    </form>
  );
}
