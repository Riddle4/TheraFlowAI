import { ClientForm } from "@/components/clients/ClientForm";

export default function NewClientPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay">Client</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Nouveau client</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
          Les informations d'identification restent en base et ne sont jamais envoyées telles quelles à l'IA.
        </p>
      </div>
      <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
        <ClientForm />
      </section>
    </div>
  );
}
