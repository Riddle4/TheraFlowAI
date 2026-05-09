import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ClientsPage() {
  const user = await requireUser();
  const clients = await prisma.client.findMany({
    where: { therapistId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { sessions: true } } }
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay">Clients</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Dossiers clients</h1>
        </div>
        <Link href="/clients/new" className="rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white">
          Nouveau client
        </Link>
      </div>
      <section className="grid gap-3">
        {clients.map((client) => (
          <Link key={client.id} href={`/clients/${client.id}`} className="rounded-lg border border-ink/10 bg-paper p-5 shadow-sm transition hover:shadow-soft">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="font-semibold">{client.firstName || client.lastName ? `${client.firstName ?? ""} ${client.lastName ?? ""}` : "Client sans nom"}</h2>
                <p className="mt-1 text-sm text-ink/55">{client.pseudonym}</p>
              </div>
              <p className="text-sm text-ink/55">{client._count.sessions} séance(s)</p>
            </div>
          </Link>
        ))}
        {!clients.length ? <p className="rounded-lg border border-ink/10 bg-paper p-5 text-sm text-ink/55">Aucun client enregistré.</p> : null}
      </section>
    </div>
  );
}
