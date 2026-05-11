import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteSessionButton } from "@/components/sessions/DeleteSessionButton";
import { SessionForm } from "@/components/sessions/SessionForm";
import { requireUser } from "@/lib/auth";
import { cleanAiText } from "@/lib/aiText";
import { prisma } from "@/lib/db";

export default async function SessionDetailPage({
  params
}: {
  params: Promise<{ clientId: string; sessionId: string }>;
}) {
  const user = await requireUser();
  const { clientId, sessionId } = await params;
  const session = await prisma.therapySession.findFirst({
    where: { id: sessionId, clientId, therapistId: user.id },
    include: { client: true }
  });
  if (!session) notFound();

  const exportHref = `/api/sessions/${session.id}/export`;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href={`/app/clients/${clientId}/sessions`} className="text-sm font-semibold text-sage">
            Retour aux séances
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-ink">
            Séance du {session.sessionDate.toLocaleDateString("fr-CH")}
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            {session.client.pseudonym} - {session.status === "FINALIZED" ? "Finalisée" : "Brouillon"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {session.status === "FINALIZED" ? (
            <a className="rounded-md bg-sage px-4 py-2.5 text-sm font-semibold text-white" href={exportHref}>
              Exporter en Word
            </a>
          ) : (
            <p className="rounded-md border border-ink/10 bg-paper px-4 py-2.5 text-sm text-ink/60">
              Export disponible une fois finalisée
            </p>
          )}
          <DeleteSessionButton clientId={clientId} sessionId={session.id} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold">Éléments importants</h2>
          <dl className="grid gap-4 text-sm leading-6 text-ink/70">
            <div>
              <dt className="font-semibold text-ink">Objectif</dt>
              <dd>{session.objective || "Non renseigné"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">État du client</dt>
              <dd>{session.clientState || "Non renseigné"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Interventions</dt>
              <dd>{session.performedInterventions || "Non renseigné"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Réactions</dt>
              <dd>{session.observedReactions || "Non renseigné"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Points à reprendre</dt>
              <dd>{session.pointsToRevisit || "Non renseigné"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Prochaine étape</dt>
              <dd>{session.nextStep || "Non renseigné"}</dd>
            </div>
            {session.structuredNote ? (
              <div>
                <dt className="font-semibold text-ink">Note IA structurée</dt>
                <dd className="whitespace-pre-wrap">{cleanAiText(session.structuredNote)}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold">Modifier la note</h2>
          <SessionForm clientId={clientId} session={session} />
        </section>
      </div>
    </div>
  );
}
