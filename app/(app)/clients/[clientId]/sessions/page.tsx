import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientTabs } from "@/components/clients/ClientTabs";
import { SessionCard } from "@/components/sessions/SessionCard";
import { SessionForm } from "@/components/sessions/SessionForm";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function SessionsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const user = await requireUser();
  const { clientId } = await params;
  const client = await prisma.client.findFirst({
    where: { id: clientId, therapistId: user.id },
    include: { sessions: { orderBy: { sessionDate: "desc" } } }
  });
  if (!client) notFound();

  return (
    <div className="grid gap-6">
      <div>
        <Link href={`/clients/${client.id}`} className="text-sm font-semibold text-clay">
          Retour à la fiche
        </Link>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Séances</h1>
        <p className="mt-2 text-sm text-ink/60">{client.pseudonym}</p>
      </div>
      <ClientTabs clientId={client.id} active="timeline" />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold">Nouvelle note manuelle</h2>
          <SessionForm clientId={client.id} />
        </section>
        <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold">Historique</h2>
          <div className="grid gap-4">
            {client.sessions.map((session) => (
              <SessionCard key={session.id} clientId={client.id} session={session} />
            ))}
            {!client.sessions.length ? <p className="text-sm text-ink/55">Aucune séance enregistrée.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
