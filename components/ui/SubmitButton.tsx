"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children = "Enregistrer" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Traitement..." : children}
    </button>
  );
}
