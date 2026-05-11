import Link from "next/link";
import { notFound } from "next/navigation";
import { AiSessionPlanForm, StructuredNoteForm } from "@/components/ai/AiForms";
import { ClientTabs } from "@/components/clients/ClientTabs";
import { cleanAiText } from "@/lib/aiText";
import { requireUser } from "@/lib/auth";
import { aiDisclaimer, riskReminder } from "@/lib/constants";
import { prisma } from "@/lib/db";

export default async function AiSessionPage({ params }: { params: Promise<{ clientId: string }> }) {
  const user = await requireUser();
  const { clientId } = await params;
  const [client, profile] = await Promise.all([
    prisma.client.findFirst({
      where: { id: clientId, therapistId: user.id },
      include: {
        aiPlans: { orderBy: { createdAt: "desc" }, take: 5 },
        sessions: { orderBy: { sessionDate: "desc" }, take: 12 }
      }
    }),
    prisma.therapistProfile.findUnique({ where: { therapistId: user.id } })
  ]);
  if (!client) notFound();

  return (
    <div className="grid gap-6">
      <div>
        <Link href={`/app/clients/${client.id}`} className="text-sm font-semibold text-clay">
          Retour à la fiche
        </Link>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Préparation IA</h1>
        <p className="mt-2 text-sm text-ink/60">
          Le contexte envoyé à l'IA utilise uniquement {client.pseudonym} et des données filtrées.
        </p>
      </div>

      <ClientTabs clientId={client.id} active="ai-session" />

      <section className="rounded-lg border border-sage/20 bg-paper p-4 text-sm leading-6 text-ink/65">
        <p>{aiDisclaimer}</p>
        <p className="mt-1">{riskReminder}</p>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold">Préparer une séance IA</h2>
          <AiSessionPlanForm clientId={client.id} defaultDuration={profile?.defaultSessionDuration} />
        </section>
        <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold">Note après séance assistée</h2>
          <StructuredNoteForm clientId={client.id} sessions={client.sessions} />
        </section>
      </div>

      <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
        <h2 className="mb-4 text-lg font-semibold">Propositions sauvegardées</h2>
        <div className="grid gap-4">
          {client.aiPlans.map((plan) => (
            <article key={plan.id} className="rounded-md border border-ink/10 p-4">
              <p className="mb-3 text-sm font-semibold text-ink/60">
                {plan.createdAt.toLocaleDateString("fr-CH")} - {plan.durationMinutes} min
              </p>
              <div className="whitespace-pre-wrap text-sm leading-6 text-ink/75">{cleanAiText(plan.generatedContent)}</div>
            </article>
          ))}
          {!client.aiPlans.length ? <p className="text-sm text-ink/55">Aucune proposition IA enregistrée.</p> : null}
        </div>
      </section>
    </div>
  );
}
