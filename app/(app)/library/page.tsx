import { aiDisclaimer, riskReminder } from "@/lib/constants";
import { CopyTemplateButton } from "@/components/library/CopyTemplateButton";

const templates = [
  {
    title: "Séance de régulation douce",
    discipline: "Hypnose, sophrologie, accompagnement stress",
    content:
      "Objectif: apaiser le système nerveux sans intensité excessive.\nStructure: accueil 5 min, météo interne 10 min, exercice respiratoire 10 min, exploration ressources 20 min, ancrage 10 min, clôture 5 min.\nVigilance: adapter si dissociation, anxiété forte, fatigue importante."
  },
  {
    title: "Note après séance",
    discipline: "Toutes disciplines",
    content:
      "Résumé bref:\nInterventions réalisées:\nRéactions observées:\nÉléments exprimés par le client:\nHypothèses à confirmer:\nPoints de vigilance:\nExercice donné:\nProchaine étape:"
  },
  {
    title: "Préparation première séance",
    discipline: "Pratiques complémentaires",
    content:
      "Intention: comprendre la demande, clarifier le cadre, identifier les contre-indications.\nQuestions utiles: objectif prioritaire, attentes, historique, traitements en cours, signaux d'alerte, limites du client.\nClôture: reformuler l'objectif, proposer une étape simple, rappeler le cadre professionnel."
  },
  {
    title: "Point de vigilance plantes / médicaments",
    discipline: "Naturopathie, phytothérapie",
    content:
      "Vérifier systématiquement: traitements médicaux en cours, anticoagulants, psychotropes, grossesse/allaitement, pathologies chroniques, allergies.\nFormulation prudente: ne pas recommander d'arrêt de traitement, orienter vers médecin/pharmacien en cas d'interaction potentielle."
  }
];

export default function LibraryPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage">Bibliothèque</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Ressources thérapeute</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
          Des canevas copiables pour préparer une séance, structurer une note ou alimenter une consigne IA.
        </p>
      </div>

      <section className="rounded-lg border border-sage/20 bg-paper p-4 text-sm leading-6 text-ink/65">
        <p>{aiDisclaimer}</p>
        <p className="mt-1">{riskReminder}</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <section key={template.title} className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-ink">{template.title}</h2>
                <p className="mt-1 text-sm font-medium text-sage">{template.discipline}</p>
              </div>
              <CopyTemplateButton text={template.content} />
            </div>
            <pre className="mt-4 whitespace-pre-wrap rounded-md bg-mint/50 p-4 text-sm leading-6 text-ink/70">
              {template.content}
            </pre>
          </section>
        ))}
      </div>
    </div>
  );
}
