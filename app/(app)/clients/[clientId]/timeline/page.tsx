import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientTabs } from "@/components/clients/ClientTabs";
import { SessionCard } from "@/components/sessions/SessionCard";
import { cleanAiText } from "@/lib/aiText";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

type TimelineItem =
  | { type: "session"; date: Date; id: string; session: NonNullable<Awaited<ReturnType<typeof getClientTimeline>>>["sessions"][number] }
  | { type: "ai"; date: Date; id: string; plan: NonNullable<Awaited<ReturnType<typeof getClientTimeline>>>["aiPlans"][number] };

async function getClientTimeline(clientId: string, therapistId: string) {
  return prisma.client.findFirst({
    where: { id: clientId, therapistId },
    include: {
      sessions: { orderBy: { sessionDate: "desc" } },
      aiPlans: { orderBy: { createdAt: "desc" } }
    }
  });
}

export default async function ClientTimelinePage({ params }: { params: Promise<{ clientId: string }> }) {
  const user = await requireUser();
  const { clientId } = await params;
  const client = await getClientTimeline(clientId, user.id);
  if (!client) notFound();

  const items: TimelineItem[] = [
    ...client.sessions.map((session) => ({ type: "session" as const, date: session.sessionDate, id: session.id, session })),
    ...client.aiPlans.map((plan) => ({ type: "ai" as const, date: plan.createdAt, id: plan.id, plan }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href={`/clients/${client.id}`} className="text-sm font-semibold text-sage">
            Retour à la fiche
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Timeline</h1>
          <p className="mt-2 text-sm text-ink/60">
            Séances, propositions IA et documents utiles pour {client.pseudonym}.
          </p>
        </div>
        <Link href={`/clients/${client.id}/sessions`} className="rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white">
          Nouvelle séance
        </Link>
      </div>

      <ClientTabs clientId={client.id} active="timeline" />

      <section className="grid gap-4">
        {items.map((item) =>
          item.type === "session" ? (
            <div key={`session-${item.id}`} className="grid gap-2 md:grid-cols-[8rem_1fr]">
              <p className="pt-4 text-sm font-semibold text-sage">{item.date.toLocaleDateString("fr-CH")}</p>
              <SessionCard clientId={client.id} session={item.session} />
            </div>
          ) : (
            <div key={`ai-${item.id}`} className="grid gap-2 md:grid-cols-[8rem_1fr]">
              <p className="pt-4 text-sm font-semibold text-sage">{item.date.toLocaleDateString("fr-CH")}</p>
              <article className="rounded-lg border border-sage/15 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">Proposition IA</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-sage">
                      {item.plan.durationMinutes} min
                    </p>
                  </div>
                  <Link
                    href={`/clients/${client.id}/ai-session`}
                    className="rounded-md border border-sage/25 px-3 py-1.5 text-xs font-semibold text-sage hover:bg-mint"
                  >
                    Ouvrir l'IA
                  </Link>
                </div>
                <p className="mt-3 text-sm font-semibold text-ink">{item.plan.dayObjective ?? "Objectif non précisé"}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink/65">
                  {cleanAiText(item.plan.generatedContent).length > 420
                    ? `${cleanAiText(item.plan.generatedContent).slice(0, 420)}...`
                    : cleanAiText(item.plan.generatedContent)}
                </p>
              </article>
            </div>
          )
        )}
        {!items.length ? (
          <p className="rounded-lg border border-ink/10 bg-paper p-5 text-sm text-ink/55">
            Aucun événement pour ce client.
          </p>
        ) : null}
      </section>
    </div>
  );
}
