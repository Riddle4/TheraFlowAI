"use client";

import { useState } from "react";

export function CopyTemplateButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="rounded-md border border-sage/25 px-3 py-2 text-sm font-semibold text-sage hover:bg-mint"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }}
    >
      {copied ? "Copié" : "Copier le modèle"}
    </button>
  );
}
