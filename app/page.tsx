import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { aiDisclaimer } from "@/lib/constants";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-linen">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-clay">
            TheraFlow AI
          </p>
          <h1 className="text-5xl font-semibold leading-tight text-ink md:text-7xl">
            Copilote IA sobre pour préparer et suivre vos séances.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-ink/70">
            Une plateforme locale-first pour thérapeutes indépendants en Suisse : profils,
            clients, anamnèses, notes de séance et propositions IA pseudonymisées.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link className="rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white" href="/register">
              Créer un compte
            </Link>
            <Link className="rounded-md border border-ink/15 px-5 py-3 text-sm font-semibold text-ink" href="/login">
              Se connecter
            </Link>
          </div>
          <p className="mt-10 max-w-3xl rounded-md border border-sage/20 bg-paper p-4 text-sm leading-6 text-ink/70">
            {aiDisclaimer}
          </p>
        </div>
      </section>
    </main>
  );
}
