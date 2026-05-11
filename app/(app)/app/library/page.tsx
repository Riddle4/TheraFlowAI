import { aiDisclaimer, riskReminder } from "@/lib/constants";
import { LibraryExplorer } from "@/components/library/LibraryExplorer";

export default function LibraryPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage">Bibliothèque</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Ressources thérapeute</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
          Modèles de séances, trames de notes, questions utiles, points de vigilance et canevas IA pour des pratiques thérapeutiques variées.
        </p>
      </div>

      <section className="rounded-lg border border-sage/20 bg-paper p-4 text-sm leading-6 text-ink/65">
        <p>{aiDisclaimer}</p>
        <p className="mt-1">{riskReminder}</p>
      </section>

      <LibraryExplorer />
    </div>
  );
}
