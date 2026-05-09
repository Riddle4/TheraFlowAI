"use client";

import type { ActionState } from "@/server/actions/auth";

export function ActionMessage({ state }: { state: ActionState }) {
  if (!state.error && !state.success) return null;
  return (
    <p
      className={`rounded-md border px-3 py-2 text-sm ${
        state.error
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-sage/25 bg-mint/50 text-ink"
      }`}
    >
      {state.error ?? state.success}
    </p>
  );
}
