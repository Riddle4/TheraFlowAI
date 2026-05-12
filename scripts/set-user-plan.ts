import { PrismaClient, SubscriptionPlan, SubscriptionStatus } from "@prisma/client";

const prisma = new PrismaClient();

function readArg(name: string): string | null {
  const prefix = `--${name}=`;
  const value = process.argv.find((arg) => arg.startsWith(prefix));
  return value ? value.slice(prefix.length) : null;
}

function parsePlan(value: string | null): SubscriptionPlan {
  const normalized = value?.toUpperCase();
  if (normalized === "TRIAL" || normalized === "ESSENTIAL" || normalized === "PRO") return normalized;
  throw new Error("Plan invalide. Utilisez TRIAL, ESSENTIAL ou PRO.");
}

function parseStatus(value: string | null, plan: SubscriptionPlan): SubscriptionStatus {
  if (!value) return plan === "TRIAL" ? "TRIALING" : "ACTIVE";
  const normalized = value.toUpperCase();
  if (normalized === "NONE" || normalized === "TRIALING" || normalized === "ACTIVE" || normalized === "PAST_DUE" || normalized === "CANCELED") {
    return normalized;
  }
  throw new Error("Statut invalide. Utilisez NONE, TRIALING, ACTIVE, PAST_DUE ou CANCELED.");
}

async function main() {
  const email = readArg("email")?.toLowerCase();
  if (!email) throw new Error("Email requis: --email=therapeute@example.com");

  const plan = parsePlan(readArg("plan"));
  const status = parseStatus(readArg("status"), plan);
  const trialDays = Number(readArg("trialDays") ?? "15");

  const user = await prisma.user.update({
    where: { email },
    data: {
      subscriptionPlan: plan,
      subscriptionStatus: status,
      trialEndsAt: plan === "TRIAL" ? new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000) : null
    },
    select: {
      email: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
      trialEndsAt: true
    }
  });

  console.log("Plan utilisateur mis à jour");
  console.log(`Email: ${user.email}`);
  console.log(`Plan: ${user.subscriptionPlan}`);
  console.log(`Statut: ${user.subscriptionStatus}`);
  if (user.trialEndsAt) console.log(`Fin d'essai: ${user.trialEndsAt.toISOString()}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
