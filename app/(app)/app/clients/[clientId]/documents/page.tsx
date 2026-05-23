import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientTabs } from "@/components/clients/ClientTabs";
import { DeleteDocumentButton } from "@/components/documents/DeleteDocumentButton";
import { DocumentUploadForm } from "@/components/documents/DocumentUploadForm";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

function formatSize(sizeBytes: number) {
  if (sizeBytes < 1024 * 1024) return `${Math.max(1, Math.round(sizeBytes / 1024))} Ko`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function previewKind(document: { fileName: string; mimeType: string }) {
  const fileName = document.fileName.toLowerCase();
  if (document.mimeType.startsWith("image/")) return "image";
  if (document.mimeType === "application/pdf" || fileName.endsWith(".pdf")) return "pdf";
  if (document.mimeType.startsWith("text/") || fileName.endsWith(".txt") || fileName.endsWith(".csv")) return "text";
  return null;
}

export default async function ClientDocumentsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const user = await requireUser();
  const { clientId } = await params;
  const client = await prisma.client.findFirst({
    where: { id: clientId, therapistId: user.id },
    include: {
      documents: { orderBy: { createdAt: "desc" } }
    }
  });
  if (!client) notFound();

  return (
    <div className="grid gap-6">
      <div>
        <Link href={`/app/clients/${client.id}`} className="text-sm font-semibold text-sage">
          Retour à la fiche
        </Link>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Documents</h1>
        <p className="mt-2 text-sm text-ink/60">
          Ajoutez les documents utiles au suivi de {client.pseudonym}: PDF, Word, images ou pièces administratives.
        </p>
      </div>

      <ClientTabs clientId={client.id} active="documents" />

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold">Importer un document</h2>
          <DocumentUploadForm clientId={client.id} />
        </section>

        <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
          <h2 className="text-lg font-semibold">Documents importés</h2>
          <div className="mt-4 grid gap-3">
            {client.documents.map((document) => (
              <article key={document.id} className="rounded-md border border-ink/10 bg-white p-4">
                {previewKind(document) === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/api/documents/${document.id}/preview`}
                    alt={document.fileName}
                    className="mb-4 max-h-80 w-full rounded-md border border-ink/10 object-contain"
                  />
                ) : null}
                {previewKind(document) === "pdf" || previewKind(document) === "text" ? (
                  <iframe
                    src={`/api/documents/${document.id}/preview`}
                    title={`Aperçu ${document.fileName}`}
                    className="mb-4 h-80 w-full rounded-md border border-ink/10 bg-white"
                  />
                ) : null}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{document.fileName}</p>
                    <p className="mt-1 text-sm text-ink/55">
                      {document.createdAt.toLocaleDateString("fr-CH")} - {formatSize(document.sizeBytes)}
                    </p>
                    {document.note ? <p className="mt-2 text-sm leading-6 text-ink/65">{document.note}</p> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`/api/documents/${document.id}/download`}
                      className="rounded-md bg-sage px-3 py-2 text-sm font-semibold text-white"
                    >
                      Télécharger
                    </a>
                    {!previewKind(document) ? (
                      <span className="rounded-md border border-ink/10 px-3 py-2 text-sm text-ink/55">
                        Aperçu non disponible
                      </span>
                    ) : null}
                    <DeleteDocumentButton clientId={client.id} documentId={document.id} />
                  </div>
                </div>
              </article>
            ))}
            {!client.documents.length ? <p className="text-sm text-ink/55">Aucun document importé pour le moment.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
