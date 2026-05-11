import Link from "next/link";
import { RegisterForm } from "@/components/ui/AuthForms";
import { publicRegistrationEnabled } from "@/lib/invitations";

export default function RegisterPage() {
  const isPublic = publicRegistrationEnabled();
  return (
    <main className="flex min-h-screen items-center justify-center bg-linen px-5 py-12">
      <section className="w-full max-w-md rounded-lg border border-ink/10 bg-paper p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-ink">Créer un compte</h1>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          {isPublic
            ? "Votre espace est séparé des autres thérapeutes."
            : "L'inscription est réservée aux thérapeutes invités. Utilisez le code reçu par email."}
        </p>
        <div className="mt-7">
          <RegisterForm requireInvitation={!isPublic} />
        </div>
        <p className="mt-6 text-sm text-ink/60">
          Pas encore de code ?{" "}
          <Link className="font-semibold text-sage" href="/request-access">
            Demander un accès
          </Link>
          <br />
          Déjà inscrit ?{" "}
          <Link className="font-semibold text-clay" href="/login">
            Se connecter
          </Link>
        </p>
      </section>
    </main>
  );
}
