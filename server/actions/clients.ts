"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { clientSchema, emptyToNull } from "@/lib/validators";
import type { ActionState } from "./auth";

function parseDate(value: unknown): Date | null {
  if (!value || typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function nextPseudonym(therapistId: string): Promise<string> {
  const count = await prisma.client.count({ where: { therapistId } });
  return `TF-${String(count + 1).padStart(4, "0")}`;
}

export async function createClientAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Données invalides" };

  const data = emptyToNull(parsed.data);
  const client = await prisma.client.create({
    data: {
      ...data,
      birthDate: parseDate(parsed.data.birthDate),
      pseudonym: await nextPseudonym(user.id),
      therapistId: user.id
    }
  });

  revalidatePath("/app/clients");
  redirect(`/app/clients/${client.id}`);
}

export async function updateClientAction(
  clientId: string,
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Données invalides" };

  const data = emptyToNull(parsed.data);
  await prisma.client.updateMany({
    where: { id: clientId, therapistId: user.id },
    data: { ...data, birthDate: parseDate(parsed.data.birthDate) }
  });

  revalidatePath(`/app/clients/${clientId}`);
  return { success: "Client mis à jour" };
}

export async function deleteClientAction(clientId: string): Promise<void> {
  const user = await requireUser();
  await prisma.client.deleteMany({ where: { id: clientId, therapistId: user.id } });
  revalidatePath("/app/clients");
  redirect("/app/clients");
}
