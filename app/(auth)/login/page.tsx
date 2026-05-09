import Link from "next/link";
import { LoginForm } from "@/components/ui/AuthForms";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linen px-5 py-12">
      <section className="w-full max-w-md rounded-lg border border-ink/10 bg-paper p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-ink">Connexion</h1>
        <p className="mt-2 text-sm leading-6 text-ink/60">Accédez à votre espace thérapeute sécurisé.</p>
        <div className="mt-7">
          <LoginForm />
        </div>
        <p className="mt-6 text-sm text-ink/60">
          Pas encore de compte ?{" "}
          <Link className="font-semibold text-clay" href="/register">
            Créer un compte
          </Link>
        </p>
      </section>
    </main>
  );
}
