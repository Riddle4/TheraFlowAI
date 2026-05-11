import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientForm } from "@/components/clients/ClientForm";
import { ClientTabs } from "@/components/clients/ClientTabs";
import { DeleteClientButton } from "@/components/clients/DeleteClientButton";
import { SessionCard } from "@/components/sessions/SessionCard";
import { cleanAiText } from "@/lib/aiText";
import { requireUser } from "@/lib/auth";
import { aiDisclaimer, riskReminder } from "@/lib/constants";
import { prisma } from "@/lib/db";

export default async function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const user = await requireUser();
  const { clientId } = await params;
  const client = await prisma.client.findFirst({
    where: { id: clientId, therapistId: user.id },
    include: {
      anamnesis: true,
      sessions: { orderBy: { sessionDate: "desc" }, take: 4 },
      aiPlans: { orderBy: { createdAt: "desc" }, take: 1 }
    }
  });
  if (!client) notFound();

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay">Fiche client</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">
            {client.firstName || client.lastName ? `${client.firstName ?? ""} ${client.lastName ?? ""}` : "Client sans nom"}
          </h1>
          <p className="mt-1 text-sm text-ink/55">Identifiant IA pseudonymisé : {client.pseudonym}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/app/clients/${client.id}/sessions`} className="rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white">
            Nouvelle séance
          </Link>
          <Link href={`/app/clients/${client.id}/ai-session`} className="rounded-md border border-sage/25 px-4 py-2.5 text-sm font-semibold text-sage hover:bg-mint">
            Préparer une séance IA
          </Link>
          <DeleteClientButton clientId={client.id} />
        </div>
      </div>

      <ClientTabs clientId={client.id} active="" />

      <section className="rounded-lg border border-sage/20 bg-paper p-4 text-sm leading-6 text-ink/65">
        <p>{aiDisclaimer}</p>
        <p className="mt-1">{riskReminder}</p>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold">Identification interne</h2>
          <ClientForm client={client} />
        </section>

        <div className="grid gap-5">
          <section className="rounded-lg border border-ink/10 bg-paper p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Anamnèse</h2>
              <Link href={`/app/clients/${client.id}/anamnesis`} className="text-sm font-semibold text-clay">
                Modifier
              </Link>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink/60">
              {client.anamnesis?.mainGoal ?? client.anamnesis?.consultationReason ?? "Aucune anamnèse structurée pour ce client."}
            </p>
          </section>

          <section className="rounded-lg border border-ink/10 bg-paper p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Séances récentes</h2>
              <Link href={`/app/clients/${client.id}/timeline`} className="text-sm font-semibold text-sage">
                Timeline
              </Link>
            </div>
            <div className="mt-4 grid gap-3">
              {client.sessions.map((session) => (
                <SessionCard key={session.id} clientId={client.id} session={session} compact />
              ))}
              {!client.sessions.length ? <p className="text-sm text-ink/55">Aucune séance enregistrée.</p> : null}
            </div>
          </section>

          <section className="rounded-lg border border-ink/10 bg-paper p-5">
            <h2 className="text-lg font-semibold">Dernière proposition IA</h2>
            {client.aiPlans[0] ? (
              <details className="mt-3 rounded-md border border-ink/10 bg-white p-4" open>
                <summary className="cursor-pointer text-sm font-semibold text-sage">Afficher / masquer toute la proposition</summary>
                <div className="mt-4 max-h-[34rem] overflow-auto whitespace-pre-wrap pr-2 text-sm leading-6 text-ink/70">
                  {cleanAiText(client.aiPlans[0].generatedContent)}
                </div>
                <Link href={`/app/clients/${client.id}/ai-session`} className="mt-4 inline-flex text-sm font-semibold text-sage">
                  Voir toutes les propositions
                </Link>
              </details>
            ) : (
              <p className="mt-3 text-sm leading-6 text-ink/65">Aucune proposition sauvegardée.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
