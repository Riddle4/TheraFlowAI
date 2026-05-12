import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { aiDisclaimer } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { getSubscriptionOverview, planLabel } from "@/lib/subscription";

function usageLabel(used: number, limit: number | null) {
  return limit === null ? `${used} / illimité` : `${used} / ${limit}`;
}

export default async function DashboardPage() {
  const user = await requireUser();
  const [clients, sessions, profile, subscription] = await Promise.all([
    prisma.client.findMany({
      where: { therapistId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 5
    }),
    prisma.therapySession.findMany({
      where: { therapistId: user.id },
      orderBy: { sessionDate: "desc" },
      take: 5,
      include: { client: true }
    }),
    prisma.therapistProfile.findUnique({ where: { therapistId: user.id } }),
    getSubscriptionOverview(user.id)
  ]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Bonjour {user.name ?? user.email}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">{aiDisclaimer}</p>
        </div>
        <Link href="/app/clients/new" className="rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white">
          Nouveau client
        </Link>
      </div>

      <section className="grid gap-3 rounded-lg border border-sage/20 bg-paper p-4 shadow-soft md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">Offre</p>
          <p className="mt-1 font-semibold text-ink">{planLabel(subscription.plan)}</p>
          {subscription.trialEndsAt ? (
            <p className="text-sm text-ink/55">Essai jusqu'au {subscription.trialEndsAt.toLocaleDateString("fr-CH")}</p>
          ) : null}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">Clients actifs</p>
          <p className="mt-1 font-semibold text-ink">{usageLabel(subscription.clients.used, subscription.clients.limit)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">Séances ce mois-ci</p>
          <p className="mt-1 font-semibold text-ink">
            {usageLabel(subscription.monthlySessions.used, subscription.monthlySessions.limit)}
          </p>
        </div>
        {!subscription.isWriteAccessActive ? (
          <p className="rounded-md bg-clay/10 p-3 text-sm leading-6 text-clay md:col-span-3">
            {subscription.inactiveReason} Vous pouvez encore consulter vos données existantes.
          </p>
        ) : null}
      </section>

      {!profile ? (
        <section className="rounded-lg border border-clay/25 bg-paper p-5">
          <h2 className="font-semibold">Profil à compléter</h2>
          <p className="mt-1 text-sm text-ink/60">Ajoutez votre discipline, votre cadre et le ton IA souhaité.</p>
          <Link className="mt-4 inline-flex rounded-md bg-clay px-4 py-2 text-sm font-semibold text-white" href="/app/settings/profile">
            Compléter mon profil
          </Link>
        </section>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Clients récents</h2>
            <Link href="/app/clients" className="text-sm font-semibold text-sage">
              Voir tout
            </Link>
          </div>
          <div className="grid gap-3">
            {clients.map((client) => (
              <Link key={client.id} href={`/app/clients/${client.id}`} className="rounded-md border border-ink/10 p-4 hover:bg-mint/45">
                <p className="font-semibold">{client.firstName || client.lastName ? `${client.firstName ?? ""} ${client.lastName ?? ""}` : "Client sans nom"}</p>
                <p className="text-sm text-ink/55">{client.pseudonym}</p>
              </Link>
            ))}
            {!clients.length ? <p className="text-sm text-ink/55">Aucun client pour le moment.</p> : null}
          </div>
        </section>

        <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold">Séances récentes</h2>
          <div className="grid gap-3">
            {sessions.map((session) => (
              <Link key={session.id} href={`/app/clients/${session.clientId}/sessions/${session.id}`} className="rounded-md border border-ink/10 p-4 hover:bg-mint/45">
                <p className="font-semibold">{session.objective ?? "Séance sans objectif"}</p>
                <p className="text-sm text-ink/55">
                  {session.client.pseudonym} - {session.sessionDate.toLocaleDateString("fr-CH")} - {session.status}
                </p>
              </Link>
            ))}
            {!sessions.length ? <p className="text-sm text-ink/55">Aucune séance enregistrée.</p> : null}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-ink/10 bg-paper p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Bibliothèque</h2>
          <Link href="/app/library" className="text-sm font-semibold text-sage">
            Ouvrir
          </Link>
        </div>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          Ressources professionnelles, protocoles et rappels de prudence pour préparer vos séances.
        </p>
      </section>
    </div>
  );
}
