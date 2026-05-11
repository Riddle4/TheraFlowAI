import Link from "next/link";
import Image from "next/image";
import { RequestAccessForm } from "@/components/ui/AuthForms";

export default function RequestAccessPage() {
  return (
    <main className="min-h-screen bg-linen px-5 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_28rem]">
        <section>
          <Link href="/" className="inline-flex">
            <Image
              src="/brand/theraflow-ai.png"
              alt="TheraFlow AI"
              width={260}
              height={195}
              priority
              className="h-auto w-48 object-contain"
            />
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-sage">Accès professionnel</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Demander un accès à TheraFlow AI.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ink/65">
            L'inscription est contrôlée afin de protéger l'environnement de travail et de réserver l'outil aux thérapeutes et praticiens accompagnés.
          </p>
        </section>

        <section className="rounded-lg border border-ink/10 bg-paper p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-ink">Votre demande</h2>
          <p className="mt-2 text-sm leading-6 text-ink/60">
            Nous vous enverrons un code d'invitation si votre demande correspond au cadre du produit.
          </p>
          <div className="mt-6">
            <RequestAccessForm />
          </div>
          <p className="mt-5 text-sm text-ink/60">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="font-semibold text-sage">
              Connexion
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
