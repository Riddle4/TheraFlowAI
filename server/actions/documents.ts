"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { ActionState } from "./auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function uploadClientDocumentAction(
  clientId: string,
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const client = await prisma.client.findFirst({ where: { id: clientId, therapistId: user.id } });
  if (!client) return { error: "Client introuvable" };

  const file = formData.get("file");
  const note = formData.get("note");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choisissez un fichier à importer." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "Le fichier dépasse la limite de 10 Mo." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await prisma.clientDocument.create({
    data: {
      clientId,
      therapistId: user.id,
      fileName: file.name.slice(0, 255),
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      data: buffer,
      note: typeof note === "string" && note.trim() ? note.trim().slice(0, 1000) : null
    }
  });

  revalidatePath(`/app/clients/${clientId}/documents`);
  return { success: "Document importé" };
}

export async function deleteClientDocumentAction(clientId: string, documentId: string): Promise<void> {
  const user = await requireUser();
  await prisma.clientDocument.deleteMany({
    where: { id: documentId, clientId, therapistId: user.id }
  });
  revalidatePath(`/app/clients/${clientId}/documents`);
}
