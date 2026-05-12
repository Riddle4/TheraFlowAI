"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";
import { sendAccessRequestEmail } from "@/lib/email";
import { hashInvitationCode, publicRegistrationEnabled } from "@/lib/invitations";
import { hashPassword, verifyPassword } from "@/lib/password";
import { accessRequestSchema, loginSchema, registerSchema } from "@/lib/validators";

export type ActionState = { error?: string; success?: string };

export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Données invalides" };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (existing) return { error: "Un compte existe déjà avec cet email" };

  let invitationCodeId: string | null = null;
  if (!publicRegistrationEnabled()) {
    if (!parsed.data.invitationCode) {
      return { error: "L'inscription est réservée aux thérapeutes invités. Saisissez votre code d'invitation." };
    }

    const invite = await prisma.invitationCode.findUnique({
      where: { codeHash: hashInvitationCode(parsed.data.invitationCode) }
    });

    if (!invite || invite.usedCount >= invite.maxUses || (invite.expiresAt && invite.expiresAt < new Date())) {
      return { error: "Code d'invitation invalide ou expiré" };
    }

    if (invite.email && invite.email.toLowerCase() !== parsed.data.email.toLowerCase()) {
      return { error: "Ce code d'invitation est réservé à un autre email" };
    }

    invitationCodeId = invite.id;
  }

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        name: parsed.data.name,
        passwordHash: hashPassword(parsed.data.password),
        invitationCodeId,
        subscriptionStatus: "TRIALING",
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    });

    if (invitationCodeId) {
      await tx.invitationCode.update({
        where: { id: invitationCodeId },
        data: { usedCount: { increment: 1 } }
      });
    }

    return created;
  });

  await createSession(user.id);
  redirect("/app/dashboard");
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Données invalides" };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return { error: "Email ou mot de passe incorrect" };
  }

  await createSession(user.id);
  redirect("/app/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}

export async function requestAccessAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = accessRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Données invalides" };

  const accessRequest = await prisma.accessRequest.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      discipline: parsed.data.discipline || null,
      message: [
        parsed.data.selectedPlan ? `Offre souhaitée: ${parsed.data.selectedPlan}` : null,
        parsed.data.message || null
      ]
        .filter(Boolean)
        .join("\n\n") || null
    }
  });

  try {
    await sendAccessRequestEmail({
      name: accessRequest.name,
      email: accessRequest.email,
      selectedPlan: parsed.data.selectedPlan || "Non renseignée",
      discipline: accessRequest.discipline,
      message: accessRequest.message,
      createdAt: accessRequest.createdAt
    });
  } catch (error) {
    console.error("Access request email failed", error);
    return {
      success:
        "Demande enregistrée. L'email de notification n'a pas pu être envoyé automatiquement, mais votre demande est bien conservée."
    };
  }

  return { success: "Demande reçue. Nous reviendrons vers vous avec les prochaines étapes." };
}
