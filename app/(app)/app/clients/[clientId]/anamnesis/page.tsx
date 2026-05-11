import Link from "next/link";
import { notFound } from "next/navigation";
import { AnamnesisForm } from "@/components/clients/AnamnesisForm";
import { ClientTabs } from "@/components/clients/ClientTabs";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AnamnesisPage({ params }: { params: Promise<{ clientId: string }> }) {
  const user = await requireUser();
  const { clientId } = await params;
  const client = await prisma.client.findFirst({
    where: { id: clientId, therapistId: user.id },
    include: { anamnesis: true }
  });
  if (!client) notFound();

  return (
    <div className="grid gap-6">
      <div>
        <Link href={`/app/clients/${client.id}`} className="text-sm font-semibold text-clay">
          Retour à la fiche
        </Link>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Anamnèse structurée</h1>
        <p className="mt-2 text-sm text-ink/60">{client.pseudonym}</p>
      </div>
      <ClientTabs clientId={client.id} active="anamnesis" />
      <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
        <AnamnesisForm clientId={client.id} anamnesis={client.anamnesis} />
      </section>
    </div>
  );
}
