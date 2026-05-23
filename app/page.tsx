import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

const navItems = [
  { href: "#how-it-works", label: "Comment cela fonctionne" },
  { href: "#features", label: "Fonctionnalités" },
  { href: "#pricing", label: "Prix" },
  { href: "#faq", label: "FAQ" }
];

const steps = [
  {
    title: "Préparer",
    text: "Retrouvez en un instant les informations clés de votre client: anamnèse, objectifs, notes précédentes et historique. Vous arrivez en séance avec une vision plus claire, plus ciblée et mieux structurée."
  },
  {
    title: "Accompagner",
    text: "Recevez des propositions de questions, d'exercices, de pistes de séance et de points d'attention. Vous gardez la pleine maîtrise: chaque élément peut être adapté, modifié ou supprimé selon votre approche."
  },
  {
    title: "Suivre",
    text: "Transformez vos notes brutes en synthèses lisibles et gardez un historique organisé pour chaque client. Le suivi devient plus simple, plus continu et plus facile à reprendre d'une séance à l'autre."
  }
];

const features = [
  "Listing clients et dossiers individuels",
  "Historique des séances par client",
  "Préparation de séance assistée par IA",
  "Structuration des notes après séance",
  "Anamnèse et timeline client",
  "Notes, propositions IA et exports centralisés",
  "Bibliothèque de ressources thérapeute",
  "Pseudonymisation avant appel IA"
];

const plans = [
  {
    name: "Essai gratuit",
    plan: "Essai gratuit",
    subtitle: "Pour découvrir TheraFlow AI sans engagement.",
    price: "CHF 0.-",
    detail: "15 jours gratuits",
    cta: "Demander un accès",
    items: [
      "Accès aux fonctions principales",
      "Préparation de séance",
      "Structuration des notes",
      "Suggestions de pistes d'accompagnement",
      "Test limité à quelques clients / séances"
    ]
  },
  {
    name: "TheraFlow Essentiel",
    plan: "TheraFlow Essentiel",
    subtitle: "Pour commencer avec les fonctions principales.",
    price: "CHF 39.-",
    detail: "/ mois",
    cta: "Commencer l'essai",
    items: [
      "Jusqu'à 25 clients actifs",
      "Jusqu'à 35 séances par mois",
      "Préparation de séance",
      "Synthèse et structuration des notes",
      "Suggestions de pistes d'accompagnement"
    ],
    highlight: "Annuel: CHF 348.- / année",
    popular: true
  },
  {
    name: "TheraFlow Pro",
    plan: "TheraFlow Pro",
    subtitle: "Pour intégrer TheraFlow AI dans une pratique régulière.",
    price: "CHF 59.-",
    detail: "/ mois ou CHF 588.- / année",
    cta: "Passer en Pro",
    items: [
      "Nombre de clients illimité",
      "Nombre de séances illimité",
      "Accès complet aux outils TheraFlow AI",
      "Historique étendu",
      "Support prioritaire avec prise en charge rapide, 7j/7"
    ],
    highlight: "Annuel: CHF 588.- / année"
  }
];

const faqs = [
  {
    question: "TheraFlow AI remplace-t-il le thérapeute ?",
    answer: "Non. TheraFlow AI ne pose pas de diagnostic, ne prescrit rien et ne décide pas à votre place. Il organise l'information, propose des pistes de séance et aide à structurer les notes. Le thérapeute reste responsable de l'accompagnement, des choix cliniques et de la validation finale."
  },
  {
    question: "Pour quels thérapeutes l'outil est-il pensé ?",
    answer: "L'outil est pensé pour les thérapeutes et praticiens suisses: hypnothérapeutes, naturopathes, sophrologues, nutritionnistes, réflexologues, coachs santé et autres pratiques d'accompagnement. Il reste volontairement généraliste afin de s'adapter à différentes approches."
  },
  {
    question: "Les données sont-elles envoyées telles quelles à l'IA ?",
    answer: "Non. Avant tout appel IA, l'application prépare un contexte pseudonymisé. Les noms, emails, téléphones, adresses et dates de naissance complètes ne sont pas transmis tels quels. L'objectif est de fournir à l'IA uniquement les éléments utiles à la préparation ou à la structuration."
  },
  {
    question: "Pourquoi utiliser TheraFlow AI plutôt qu'un outil de notes classique ?",
    answer: "Parce que TheraFlow AI relie préparation, anamnèse, historique, notes et propositions de séance. Le thérapeute gagne du temps, retrouve plus facilement les points importants et peut maintenir une continuité d'accompagnement entre les rendez-vous."
  }
];

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/app/dashboard");

  return (
    <main className="min-h-screen bg-linen text-ink">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" aria-label="TheraFlow AI">
            <Image
              src="/brand/theraflow-ai.png"
              alt="TheraFlow AI"
              width={170}
              height={128}
              priority
              className="h-14 w-auto object-contain"
            />
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-semibold text-ink/65 hover:text-sage">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden rounded-md border border-ink/15 px-4 py-2 text-sm font-semibold text-ink sm:inline-flex">
              Connexion
            </Link>
            <Link href="/request-access" className="rounded-md bg-sage px-4 py-2 text-sm font-semibold text-white">
              Essai gratuit
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sage">
            Développé en Suisse pour les thérapeutes suisses
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight md:text-6xl">
            Gérez vos clients, vos séances et vos notes avec l'aide de l'IA.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68">
            TheraFlow AI centralise vos dossiers clients, l'historique des séances, les anamnèses et les notes, puis vous aide à préparer, synthétiser et suivre chaque accompagnement.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/request-access" className="rounded-md bg-sage px-5 py-3 text-sm font-semibold text-white">
              Démarrer 15 jours gratuits
            </Link>
            <a href="#how-it-works" className="rounded-md border border-ink/15 px-5 py-3 text-sm font-semibold text-ink">
              Voir comment ça marche
            </a>
          </div>
        </div>

        <div className="rounded-lg border border-sage/15 bg-paper p-6 shadow-soft">
          <Image
            src="/brand/theraflow-ai.png"
            alt="Logo TheraFlow AI"
            width={620}
            height={465}
            priority
            className="mx-auto h-auto w-full max-w-lg object-contain"
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Clients", "Séances", "Notes"].map((item) => (
              <div key={item} className="rounded-md bg-mint px-4 py-3 text-center text-sm font-semibold text-ink/75">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-ink/10 bg-paper">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage">Comment cela fonctionne</p>
            <h2 className="mt-3 text-3xl font-semibold">Comment TheraFlow vous accompagne.</h2>
            <p className="mt-4 text-sm leading-7 text-ink/62">
              De la préparation au suivi, TheraFlow AI vous aide à gagner du temps sans standardiser votre pratique.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-sage">0{index + 1}</p>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/62">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage">Fonctionnalités</p>
            <h2 className="mt-3 text-3xl font-semibold">Un vrai espace de suivi, pas seulement un générateur de séance.</h2>
            <p className="mt-4 text-sm leading-7 text-ink/62">
              Chaque client dispose d'un dossier clair avec ses séances, notes, propositions IA, documents et points à reprendre. L'IA vient enrichir ce suivi sans remplacer votre discernement.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="rounded-lg border border-ink/10 bg-paper p-4 text-sm font-semibold text-ink/72 shadow-sm">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage">Confidentialité</p>
            <h2 className="mt-3 text-3xl font-semibold">Une approche prudente des données sensibles.</h2>
          </div>
          <div className="grid gap-3 text-sm leading-7 text-ink/65">
            <p className="rounded-md bg-mint/70 p-4">Stockage des données en Europe, avec un accès réservé aux comptes thérapeutes autorisés.</p>
            <p className="rounded-md bg-mint/70 p-4">Pseudonymisation du contexte transmis à l'IA.</p>
            <p className="rounded-md bg-mint/70 p-4">TheraFlow AI ne pose pas de diagnostic et ne remplace pas le jugement professionnel.</p>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-14">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage">Prix</p>
          <h2 className="mt-3 text-3xl font-semibold">Commencez avec 15 jours d'essai gratuit.</h2>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex rounded-lg border p-5 shadow-soft ${
                plan.popular ? "border-sage bg-white ring-2 ring-sage/15" : "border-ink/10 bg-paper"
              }`}
            >
              {plan.popular ? (
                <div className="absolute -top-3 left-5 rounded-full bg-sage px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                  Most Popular
                </div>
              ) : null}
              <div className="flex w-full flex-col">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-ink/62">{plan.subtitle}</p>
                <div className="mt-5">
                  <span className="text-3xl font-semibold">{plan.price}</span>
                  <span className="ml-2 text-sm text-ink/55">{plan.detail}</span>
                </div>
                {plan.highlight ? <p className="mt-2 text-sm font-semibold text-sage">{plan.highlight}</p> : null}
                <ul className="mt-5 grid gap-2 text-sm leading-6 text-ink/68">
                  {plan.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <Link
                  href={`/request-access?plan=${encodeURIComponent(plan.plan)}`}
                  className="mt-6 rounded-md bg-sage px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  {plan.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 rounded-lg border border-sage/20 bg-mint/60 p-4 text-sm leading-7 text-ink/68">
          Tarif privilégié pour les thérapeutes du Centre de Santé de la Petite Prairie. Plus d'informations sur{" "}
          <a href="https://www.lapetiteprairie.ch" className="font-semibold text-sage">
            www.lapetiteprairie.ch
          </a>
          .
        </p>
      </section>

      <section id="faq" className="border-y border-ink/10 bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold">Questions fréquentes</h2>
          <div className="mt-7 grid gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-lg border border-ink/10 bg-white p-4">
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-3 text-sm leading-7 text-ink/62">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-ink px-6 py-10 text-white">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          <div>
            <p className="font-semibold">TheraFlow AI - Powered by Cosmo</p>
            <a href="https://www.cosmoengine.ai" className="mt-2 inline-flex text-sm text-white/75">
              www.cosmoengine.ai
            </a>
          </div>
          <div className="text-sm leading-7 text-white/75 md:text-right">
            <p>TheraFlow AI</p>
            <p>E-mail : info@cosmoengine.ai</p>
            <p>Téléphone : +41 (0)76 822 09 00</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
