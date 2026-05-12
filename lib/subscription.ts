import "server-only";

import type { SubscriptionPlan, SubscriptionStatus, User } from "@prisma/client";
import { prisma } from "@/lib/db";

export type LimitedFeature = "CREATE_CLIENT" | "CREATE_SESSION" | "GENERATE_AI";

const ESSENTIAL_CLIENT_LIMIT = 25;
const ESSENTIAL_MONTHLY_SESSION_LIMIT = 35;
const TRIAL_DAYS = 15;

type PlanLimits = {
  clients: number | null;
  monthlySessions: number | null;
};

const limitsByPlan: Record<SubscriptionPlan, PlanLimits> = {
  TRIAL: { clients: null, monthlySessions: null },
  ESSENTIAL: { clients: ESSENTIAL_CLIENT_LIMIT, monthlySessions: ESSENTIAL_MONTHLY_SESSION_LIMIT },
  PRO: { clients: null, monthlySessions: null }
};

export class SubscriptionLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SubscriptionLimitError";
  }
}

function monthBounds(referenceDate = new Date()) {
  const periodStart = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const periodEnd = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1);
  return { periodStart, periodEnd };
}

function effectiveTrialEnd(user: Pick<User, "createdAt" | "trialEndsAt">) {
  return user.trialEndsAt ?? new Date(user.createdAt.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
}

function isWriteAccessActive(
  user: Pick<User, "subscriptionPlan" | "subscriptionStatus" | "trialEndsAt" | "createdAt" | "accountStatus">,
  now = new Date()
) {
  if (user.accountStatus !== "ACTIVE") {
    return { active: false, reason: "Votre compte est suspendu." };
  }

  if (user.subscriptionPlan === "TRIAL") {
    const trialEnd = effectiveTrialEnd(user);
    if (user.subscriptionStatus === "CANCELED" || user.subscriptionStatus === "PAST_DUE") {
      return { active: false, reason: "Votre période d'essai n'est pas active." };
    }
    if (trialEnd <= now) {
      return { active: false, reason: "Votre période d'essai gratuite de 15 jours est terminée." };
    }
    return { active: true };
  }

  if (user.subscriptionStatus !== "ACTIVE") {
    return { active: false, reason: "Votre abonnement n'est pas actif." };
  }

  return { active: true };
}

export async function getSubscriptionOverview(therapistId: string) {
  const user = await prisma.user.findUnique({
    where: { id: therapistId },
    select: {
      id: true,
      accountStatus: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
      trialEndsAt: true,
      createdAt: true
    }
  });

  if (!user) throw new SubscriptionLimitError("Compte introuvable.");

  const { periodStart, periodEnd } = monthBounds();
  const [clientCount, monthlySessionCount] = await Promise.all([
    prisma.client.count({ where: { therapistId } }),
    prisma.therapySession.count({
      where: {
        therapistId,
        createdAt: {
          gte: periodStart,
          lt: periodEnd
        }
      }
    })
  ]);

  const limits = limitsByPlan[user.subscriptionPlan];
  const access = isWriteAccessActive(user);
  const displayStatus: SubscriptionStatus =
    user.subscriptionPlan === "TRIAL" && user.subscriptionStatus === "NONE" && access.active ? "TRIALING" : user.subscriptionStatus;

  return {
    plan: user.subscriptionPlan,
    status: displayStatus,
    isWriteAccessActive: access.active,
    inactiveReason: access.reason ?? null,
    trialEndsAt: user.subscriptionPlan === "TRIAL" ? effectiveTrialEnd(user) : null,
    clients: {
      used: clientCount,
      limit: limits.clients
    },
    monthlySessions: {
      used: monthlySessionCount,
      limit: limits.monthlySessions,
      periodStart,
      periodEnd
    }
  };
}

export async function assertCanUseFeature(therapistId: string, feature: LimitedFeature) {
  const overview = await getSubscriptionOverview(therapistId);

  if (!overview.isWriteAccessActive) {
    throw new SubscriptionLimitError(overview.inactiveReason ?? "Votre abonnement ne permet pas cette action.");
  }

  if (feature === "CREATE_CLIENT" && overview.clients.limit !== null && overview.clients.used >= overview.clients.limit) {
    throw new SubscriptionLimitError(
      `Votre offre Essentiel permet jusqu'à ${overview.clients.limit} clients actifs. Passez à TheraFlow Pro pour ajouter d'autres clients.`
    );
  }

  if (
    feature === "CREATE_SESSION" &&
    overview.monthlySessions.limit !== null &&
    overview.monthlySessions.used >= overview.monthlySessions.limit
  ) {
    throw new SubscriptionLimitError(
      `Votre offre Essentiel permet jusqu'à ${overview.monthlySessions.limit} séances par mois. Passez à TheraFlow Pro pour continuer ce mois-ci.`
    );
  }

  if (feature === "GENERATE_AI") {
    return overview;
  }

  return overview;
}

export function planLabel(plan: SubscriptionPlan) {
  const labels: Record<SubscriptionPlan, string> = {
    TRIAL: "Essai gratuit",
    ESSENTIAL: "TheraFlow Essentiel",
    PRO: "TheraFlow Pro"
  };
  return labels[plan];
}

export function subscriptionStatusLabel(status: SubscriptionStatus) {
  const labels: Record<SubscriptionStatus, string> = {
    NONE: "Aucun abonnement",
    TRIALING: "Période d'essai",
    ACTIVE: "Actif",
    PAST_DUE: "Paiement en retard",
    CANCELED: "Annulé"
  };
  return labels[status];
}
