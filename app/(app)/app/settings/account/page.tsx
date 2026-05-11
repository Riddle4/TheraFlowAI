import Link from "next/link";
import { requireUser } from "@/lib/auth";

function subscriptionLabel(status: string) {
  const labels: Record<string, string> = {
    NONE: "Aucun abonnement",
    TRIALING: "Période d'essai",
    ACTIVE: "Actif",
    PAST_DUE: "Paiement en retard",
    CANCELED: "Annulé"
  };
  return labels[status] ?? status;
}

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage">Paramètres</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Compte et accès</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
          Informations de base de votre compte professionnel. La facturation sera connectée ici lors de l'intégration des abonnements.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h2 className="text-lg font-semibold">Utilisateur</h2>
          <dl className="mt-4 grid gap-3 text-sm leading-6 text-ink/70">
            <div>
              <dt className="font-semibold text-ink">Nom</dt>
              <dd>{user.name ?? "Non renseigné"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Statut du compte</dt>
              <dd>{user.accountStatus === "ACTIVE" ? "Actif" : "Suspendu"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h2 className="text-lg font-semibold">Abonnement</h2>
          <dl className="mt-4 grid gap-3 text-sm leading-6 text-ink/70">
            <div>
              <dt className="font-semibold text-ink">Statut</dt>
              <dd>{subscriptionLabel(user.subscriptionStatus)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Essai</dt>
              <dd>{user.trialEndsAt ? `Jusqu'au ${user.trialEndsAt.toLocaleDateString("fr-CH")}` : "Non configuré"}</dd>
            </div>
          </dl>
          <p className="mt-5 rounded-md bg-mint/60 p-3 text-sm leading-6 text-ink/65">
            La gestion Stripe sera ajoutée dans une prochaine étape: checkout, portail client et webhooks d'abonnement.
          </p>
        </section>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/app/settings/profile" className="rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white">
          Profil thérapeute
        </Link>
        <Link href="/app/dashboard" className="rounded-md border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink">
          Retour dashboard
        </Link>
      </div>
    </div>
  );
}
