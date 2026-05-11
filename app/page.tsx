import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

const benefits = [
  "Préparer des séances structurées sans remplacer votre jugement professionnel",
  "Centraliser clients, anamnèses, notes et historique de suivi",
  "Utiliser l'IA avec un contexte pseudonymisé et des garde-fous de prudence"
];

const audiences = [
  "Hypnothérapeutes",
  "Naturopathes",
  "Sophrologues",
  "Nutritionnistes",
  "Réflexologues",
  "Coach santé"
];

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/app/dashboard");

  return (
    <main className="min-h-screen bg-linen text-ink">
      <header className="border-b border-ink/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/theraflow-ai.png"
              alt="TheraFlow AI"
              width={156}
              height={117}
              priority
              className="h-14 w-auto object-contain"
            />
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/request-access" className="hidden text-sm font-semibold text-sage sm:inline">
              Demander un accès
            </Link>
            <Link href="/login" className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">
              Connexion
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sage">Copilote IA pour thérapeutes</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight md:text-6xl">
            Préparez, structurez et suivez vos séances avec une IA prudente.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68">
            TheraFlow AI aide les thérapeutes indépendants à gagner en clarté dans leur préparation, leur suivi client et leurs notes, sans diagnostic, prescription ni remplacement du professionnel.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/request-access" className="rounded-md bg-sage px-5 py-3 text-sm font-semibold text-white">
              Demander un accès
            </Link>
            <Link href="/login" className="rounded-md border border-ink/15 px-5 py-3 text-sm font-semibold text-ink">
              Se connecter
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-sage/15 bg-paper p-5 shadow-soft">
          <div className="rounded-md bg-mint/70 p-5">
            <p className="text-sm font-semibold text-sage">Confidentialité par conception</p>
            <h2 className="mt-3 text-2xl font-semibold">Données stockées en Europe, contexte IA pseudonymisé.</h2>
            <p className="mt-4 text-sm leading-7 text-ink/65">
              Les données sensibles sont stockées dans une base PostgreSQL européenne. Les informations envoyées à l'IA sont filtrées côté serveur: noms, emails, téléphones, adresses et dates de naissance complètes ne sont pas transmis tels quels.
            </p>
          </div>
          <ul className="mt-5 grid gap-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="rounded-md border border-ink/10 bg-white px-4 py-3 text-sm leading-6 text-ink/70">
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-3">
          <div>
            <h2 className="text-2xl font-semibold">Pour qui ?</h2>
            <p className="mt-3 text-sm leading-7 text-ink/62">
              Pensé pour les pratiques d'accompagnement et de santé complémentaire, avec un cadre clair et non médicalisant.
            </p>
          </div>
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2">
              {audiences.map((audience) => (
                <span key={audience} className="rounded-full bg-mint px-4 py-2 text-sm font-semibold text-ink/72">
                  {audience}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-14 md:grid-cols-3">
        <article className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h3 className="font-semibold">Accès contrôlé</h3>
          <p className="mt-3 text-sm leading-7 text-ink/62">
            L'inscription publique est fermée. Chaque compte est créé via invitation afin de garder un environnement professionnel.
          </p>
        </article>
        <article className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h3 className="font-semibold">IA encadrée</h3>
          <p className="mt-3 text-sm leading-7 text-ink/62">
            L'application génère des propositions à valider par le thérapeute et signale les situations dépassant le cadre.
          </p>
        </article>
        <article className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h3 className="font-semibold">Suivi structuré</h3>
          <p className="mt-3 text-sm leading-7 text-ink/62">
            Anamnèse, séances, timeline, documents exportables et bibliothèque de ressources réunis dans un espace privé.
          </p>
        </article>
      </section>
    </main>
  );
}
