"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertCanUseFeature, SubscriptionLimitError } from "@/lib/subscription";
import { emptyToNull, sessionSchema } from "@/lib/validators";
import type { ActionState } from "./auth";

export async function createSessionNoteAction(
  clientId: string,
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const client = await prisma.client.findFirst({ where: { id: clientId, therapistId: user.id } });
  if (!client) return { error: "Client introuvable" };

  const parsed = sessionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Données invalides" };
  try {
    await assertCanUseFeature(user.id, "CREATE_SESSION");
  } catch (error) {
    if (error instanceof SubscriptionLimitError) return { error: error.message };
    throw error;
  }

  const data = emptyToNull(parsed.data);
  const session = await prisma.therapySession.create({
    data: {
      ...data,
      sessionDate: new Date(parsed.data.sessionDate),
      durationMinutes: typeof data.durationMinutes === "number" ? data.durationMinutes : null,
      clientId,
      therapistId: user.id
    }
  });

  revalidatePath(`/app/clients/${clientId}`);
  revalidatePath(`/app/clients/${clientId}/sessions`);
  revalidatePath(`/app/clients/${clientId}/timeline`);
  redirect(`/app/clients/${clientId}/sessions/${session.id}`);
}

export async function updateSessionNoteAction(
  clientId: string,
  sessionId: string,
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const session = await prisma.therapySession.findFirst({
    where: { id: sessionId, clientId, therapistId: user.id }
  });
  if (!session) return { error: "Séance introuvable" };

  const parsed = sessionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Données invalides" };

  const data = emptyToNull(parsed.data);
  await prisma.therapySession.update({
    where: { id: session.id },
    data: {
      ...data,
      sessionDate: new Date(parsed.data.sessionDate),
      durationMinutes: typeof data.durationMinutes === "number" ? data.durationMinutes : null
    }
  });

  revalidatePath(`/app/clients/${clientId}`);
  revalidatePath(`/app/clients/${clientId}/sessions`);
  revalidatePath(`/app/clients/${clientId}/sessions/${sessionId}`);
  revalidatePath(`/app/clients/${clientId}/timeline`);
  redirect(`/app/clients/${clientId}/timeline`);
}

export async function deleteSessionAction(clientId: string, sessionId: string): Promise<void> {
  const user = await requireUser();
  await prisma.therapySession.deleteMany({
    where: { id: sessionId, clientId, therapistId: user.id }
  });
  revalidatePath(`/app/clients/${clientId}`);
  revalidatePath(`/app/clients/${clientId}/sessions`);
  revalidatePath(`/app/clients/${clientId}/timeline`);
  redirect(`/app/clients/${clientId}/timeline`);
}
