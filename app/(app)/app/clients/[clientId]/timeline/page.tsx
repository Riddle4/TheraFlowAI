import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientTabs } from "@/components/clients/ClientTabs";
import { DeleteSessionButton } from "@/components/sessions/DeleteSessionButton";
import { SessionCard } from "@/components/sessions/SessionCard";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function getClientTimeline(clientId: string, therapistId: string) {
  return prisma.client.findFirst({
    where: { id: clientId, therapistId },
    include: {
      sessions: { orderBy: { sessionDate: "desc" } }
    }
  });
}

export default async function ClientTimelinePage({ params }: { params: Promise<{ clientId: string }> }) {
  const user = await requireUser();
  const { clientId } = await params;
  const client = await getClientTimeline(clientId, user.id);
  if (!client) notFound();

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href={`/app/clients/${client.id}`} className="text-sm font-semibold text-sage">
            Retour à la fiche
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Timeline</h1>
          <p className="mt-2 text-sm text-ink/60">
            Toutes les séances de {client.pseudonym}, qu'elles soient préparées par l'IA ou créées manuellement.
          </p>
        </div>
        <Link href={`/app/clients/${client.id}/sessions`} className="rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white">
          Nouvelle séance
        </Link>
      </div>

      <ClientTabs clientId={client.id} active="timeline" />

      <section className="grid gap-4">
        {client.sessions.map((session) => (
          <div key={session.id} className="grid gap-2 md:grid-cols-[8rem_1fr]">
            <p className="pt-4 text-sm font-semibold text-sage">{session.sessionDate.toLocaleDateString("fr-CH")}</p>
            <div className="grid gap-2">
              <SessionCard clientId={client.id} session={session} />
              <div className="flex justify-end">
                <DeleteSessionButton clientId={client.id} sessionId={session.id} compact />
              </div>
            </div>
          </div>
        ))}
        {!client.sessions.length ? (
          <p className="rounded-lg border border-ink/10 bg-paper p-5 text-sm text-ink/55">
            Aucune séance pour ce client. Vous pouvez créer une séance manuellement ou demander une préparation IA.
          </p>
        ) : null}
      </section>
    </div>
  );
}
