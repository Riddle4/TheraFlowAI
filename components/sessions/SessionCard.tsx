import Link from "next/link";
import type { TherapySession } from "@prisma/client";
import { cleanAiText } from "@/lib/aiText";

export function SessionCard({
  session,
  clientId,
  compact = false
}: {
  session: TherapySession;
  clientId: string;
  compact?: boolean;
}) {
  const summary =
    (session.structuredNote ? cleanAiText(session.structuredNote) : null) ||
    session.objective ||
    session.performedInterventions ||
    session.rawNote ||
    "Séance sans résumé pour le moment.";

  return (
    <article className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">
            {session.sessionDate.toLocaleDateString("fr-CH")}
            {session.durationMinutes ? ` - ${session.durationMinutes} min` : ""}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-sage">
            {session.status === "FINALIZED" ? "Finalisée" : "Brouillon"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {session.status === "FINALIZED" ? (
            <a
              href={`/api/sessions/${session.id}/export`}
              className="rounded-md border border-sage/25 px-3 py-1.5 text-xs font-semibold text-sage hover:bg-mint"
            >
              Export Word
            </a>
          ) : null}
          <Link
            href={`/clients/${clientId}/sessions/${session.id}`}
            className="rounded-md bg-ink px-3 py-1.5 text-xs font-semibold text-white"
          >
            Ouvrir
          </Link>
        </div>
      </div>
      {session.objective ? <h3 className="mt-3 font-semibold text-ink">{session.objective}</h3> : null}
      <p className={`mt-2 whitespace-pre-wrap text-sm leading-6 text-ink/65 ${compact ? "line-clamp-3" : ""}`}>
        {compact && summary.length > 260 ? `${summary.slice(0, 260)}...` : summary}
      </p>
    </article>
  );
}
