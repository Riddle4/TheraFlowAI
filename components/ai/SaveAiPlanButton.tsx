"use client";

import { saveAiPlanToTimelineAction } from "@/server/actions/ai";

export function SaveAiPlanButton({ clientId, planId }: { clientId: string; planId: string }) {
  return (
    <button
      className="rounded-md bg-sage px-3 py-2 text-sm font-semibold text-white hover:bg-sage/90"
      onClick={() => {
        void saveAiPlanToTimelineAction(clientId, planId);
      }}
    >
      Sauvegarder dans Timeline
    </button>
  );
}
