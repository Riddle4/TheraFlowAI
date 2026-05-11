"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { anamnesisSchema, emptyToNull } from "@/lib/validators";
import type { ActionState } from "./auth";

export async function upsertAnamnesisAction(
  clientId: string,
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const client = await prisma.client.findFirst({ where: { id: clientId, therapistId: user.id } });
  if (!client) return { error: "Client introuvable" };

  const parsed = anamnesisSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Données invalides" };

  await prisma.anamnesis.upsert({
    where: { clientId },
    create: { ...emptyToNull(parsed.data), clientId },
    update: emptyToNull(parsed.data)
  });

  revalidatePath(`/app/clients/${clientId}`);
  revalidatePath(`/app/clients/${clientId}/anamnesis`);
  return { success: "Anamnèse enregistrée" };
}
