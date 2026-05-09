import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientTabs } from "@/components/clients/ClientTabs";
import { requireUser } from "@/lib/auth";
import { cleanAiText } from "@/lib/aiText";
import { prisma } from "@/lib/db";

export default async function ClientDocumentsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const user = await requireUser();
  const { clientId } = await params;
  const client = await prisma.client.findFirst({
    where: { id: clientId, therapistId: user.id },
    include: {
      sessions: {
        where: { status: "FINALIZED" },
        orderBy: { sessionDate: "desc" }
      },
      aiPlans: { orderBy: { createdAt: "desc" }, take: 10 }
    }
  });
  if (!client) notFound();

  return (
    <div className="grid gap-6">
      <div>
        <Link href={`/clients/${client.id}`} className="text-sm font-semibold text-sage">
          Retour à la fiche
        </Link>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Documents</h1>
        <p className="mt-2 text-sm text-ink/60">
          Exports et contenus sauvegardés pour {client.pseudonym}. Les documents utilisent le pseudonyme client.
        </p>
      </div>

      <ClientTabs clientId={client.id} active="documents" />

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h2 className="text-lg font-semibold">Séances finalisées exportables</h2>
          <div className="mt-4 grid gap-3">
            {client.sessions.map((session) => (
              <article key={session.id} className="rounded-md border border-ink/10 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{session.sessionDate.toLocaleDateString("fr-CH")}</p>
                    <p className="mt-1 text-sm text-ink/60">{session.objective ?? "Séance finalisée"}</p>
                  </div>
                  <a
                    href={`/api/sessions/${session.id}/export`}
                    className="rounded-md bg-sage px-3 py-2 text-sm font-semibold text-white"
                  >
                    Export Word
                  </a>
                </div>
              </article>
            ))}
            {!client.sessions.length ? (
              <p className="text-sm text-ink/55">Aucune séance finalisée exportable pour le moment.</p>
            ) : null}
          </div>
        </section>

        <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h2 className="text-lg font-semibold">Propositions IA sauvegardées</h2>
          <div className="mt-4 grid gap-3">
            {client.aiPlans.map((plan) => (
              <details key={plan.id} className="rounded-md border border-ink/10 bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-sage">
                  {plan.createdAt.toLocaleDateString("fr-CH")} - {plan.dayObjective ?? "Proposition IA"}
                </summary>
                <div className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap text-sm leading-6 text-ink/65">
                  {cleanAiText(plan.generatedContent)}
                </div>
              </details>
            ))}
            {!client.aiPlans.length ? <p className="text-sm text-ink/55">Aucune proposition IA sauvegardée.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
