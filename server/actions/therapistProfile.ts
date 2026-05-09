"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { emptyToNull, therapistProfileSchema } from "@/lib/validators";
import type { ActionState } from "./auth";

export async function upsertTherapistProfileAction(
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = therapistProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Données invalides" };

  const data = emptyToNull(parsed.data);
  await prisma.therapistProfile.upsert({
    where: { therapistId: user.id },
    create: {
      ...data,
      defaultSessionDuration:
        typeof data.defaultSessionDuration === "number" ? data.defaultSessionDuration : null,
      therapistId: user.id
    },
    update: {
      ...data,
      defaultSessionDuration:
        typeof data.defaultSessionDuration === "number" ? data.defaultSessionDuration : null
    }
  });

  revalidatePath("/settings/profile");
  redirect("/dashboard");
}
