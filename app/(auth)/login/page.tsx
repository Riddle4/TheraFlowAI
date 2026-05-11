import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/ui/AuthForms";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linen px-5 py-12">
      <section className="w-full max-w-md rounded-lg border border-ink/10 bg-paper p-8 shadow-soft">
        <div className="mb-7 flex justify-center">
          <Image
            src="/brand/theraflow-ai.png"
            alt="TheraFlow AI"
            width={260}
            height={195}
            priority
            className="h-auto w-56 object-contain"
          />
        </div>
        <h1 className="text-3xl font-semibold text-ink">Connexion</h1>
        <p className="mt-2 text-sm leading-6 text-ink/60">Accédez à votre espace thérapeute sécurisé.</p>
        <div className="mt-7">
          <LoginForm />
        </div>
        <p className="mt-6 text-sm text-ink/60">
          Pas encore d'accès ?{" "}
          <Link className="font-semibold text-sage" href="/request-access">
            Demander une invitation
          </Link>
          <br />
          Code reçu ?{" "}
          <Link className="font-semibold text-clay" href="/register">
            Créer mon compte
          </Link>
        </p>
      </section>
    </main>
  );
}
