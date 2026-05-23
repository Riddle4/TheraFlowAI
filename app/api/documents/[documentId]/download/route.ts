import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

function safeFileName(fileName: string) {
  return fileName.replaceAll('"', "").replace(/[^\w.\- ()À-ÿ]/g, "_");
}

export async function GET(_: Request, { params }: { params: Promise<{ documentId: string }> }) {
  const user = await requireUser();
  const { documentId } = await params;
  const document = await prisma.clientDocument.findFirst({
    where: { id: documentId, therapistId: user.id }
  });

  if (!document) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(document.data), {
    headers: {
      "Content-Type": document.mimeType,
      "Content-Length": String(document.sizeBytes),
      "Content-Disposition": `attachment; filename="${safeFileName(document.fileName)}"`
    }
  });
}
