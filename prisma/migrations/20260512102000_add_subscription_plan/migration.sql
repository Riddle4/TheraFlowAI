-- Add explicit subscription plans so feature limits can be enforced server-side.
CREATE TYPE "SubscriptionPlan" AS ENUM ('TRIAL', 'ESSENTIAL', 'PRO');

ALTER TABLE "User"
ADD COLUMN "subscriptionPlan" "SubscriptionPlan" NOT NULL DEFAULT 'TRIAL';
