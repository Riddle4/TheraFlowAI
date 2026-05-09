-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('DRAFT', 'FINALIZED');

-- CreateEnum
CREATE TYPE "AiRequestType" AS ENUM ('SESSION_PLAN', 'STRUCTURED_NOTE', 'SUMMARY');

-- CreateEnum
CREATE TYPE "AiRequestStatus" AS ENUM ('SUCCESS', 'ERROR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TherapistProfile" (
    "id" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "mainDiscipline" TEXT NOT NULL,
    "secondaryDisciplines" TEXT,
    "therapeuticApproach" TEXT,
    "targetAudience" TEXT,
    "supportedIssues" TEXT,
    "defaultSessionDuration" INTEGER,
    "accompanimentStyle" TEXT,
    "professionalLimits" TEXT,
    "language" TEXT NOT NULL DEFAULT 'fr',
    "preferredTone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TherapistProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "pseudonym" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "birthDate" TIMESTAMP(3),
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anamnesis" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "consultationReason" TEXT,
    "mainGoal" TEXT,
    "personalHistory" TEXT,
    "medicalHistory" TEXT,
    "currentTreatments" TEXT,
    "medicationSupplements" TEXT,
    "allergies" TEXT,
    "sleep" TEXT,
    "nutrition" TEXT,
    "stress" TEXT,
    "physicalActivity" TEXT,
    "painSymptoms" TEXT,
    "dominantEmotions" TEXT,
    "lifeEvents" TEXT,
    "dailyHabits" TEXT,
    "familyContext" TEXT,
    "professionalContext" TEXT,
    "expectations" TEXT,
    "contraindications" TEXT,
    "warningSignals" TEXT,
    "shortTermGoals" TEXT,
    "mediumTermGoals" TEXT,
    "freeNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anamnesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TherapySession" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMinutes" INTEGER,
    "sessionType" TEXT,
    "objective" TEXT,
    "clientState" TEXT,
    "performedInterventions" TEXT,
    "observedReactions" TEXT,
    "exercisesGiven" TEXT,
    "pointsToRevisit" TEXT,
    "nextStep" TEXT,
    "rawNote" TEXT,
    "structuredNote" TEXT,
    "aiSessionPlan" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TherapySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiGeneratedSessionPlan" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "sessionType" TEXT,
    "dayObjective" TEXT,
    "intensityLevel" TEXT,
    "sessionStyle" TEXT,
    "desiredTools" TEXT,
    "avoid" TEXT,
    "therapistNotes" TEXT,
    "generatedContent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiGeneratedSessionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiRequestLog" (
    "id" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "clientId" TEXT,
    "type" "AiRequestType" NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'openai',
    "model" TEXT,
    "status" "AiRequestStatus" NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiRequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AuthSession_tokenHash_key" ON "AuthSession"("tokenHash");

-- CreateIndex
CREATE INDEX "AuthSession_userId_idx" ON "AuthSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TherapistProfile_therapistId_key" ON "TherapistProfile"("therapistId");

-- CreateIndex
CREATE INDEX "Client_therapistId_idx" ON "Client"("therapistId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_therapistId_pseudonym_key" ON "Client"("therapistId", "pseudonym");

-- CreateIndex
CREATE UNIQUE INDEX "Anamnesis_clientId_key" ON "Anamnesis"("clientId");

-- CreateIndex
CREATE INDEX "TherapySession_clientId_idx" ON "TherapySession"("clientId");

-- CreateIndex
CREATE INDEX "TherapySession_therapistId_idx" ON "TherapySession"("therapistId");

-- CreateIndex
CREATE INDEX "AiGeneratedSessionPlan_clientId_idx" ON "AiGeneratedSessionPlan"("clientId");

-- CreateIndex
CREATE INDEX "AiGeneratedSessionPlan_therapistId_idx" ON "AiGeneratedSessionPlan"("therapistId");

-- CreateIndex
CREATE INDEX "AiRequestLog_therapistId_idx" ON "AiRequestLog"("therapistId");

-- CreateIndex
CREATE INDEX "AiRequestLog_clientId_idx" ON "AiRequestLog"("clientId");

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapistProfile" ADD CONSTRAINT "TherapistProfile_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anamnesis" ADD CONSTRAINT "Anamnesis_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapySession" ADD CONSTRAINT "TherapySession_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiGeneratedSessionPlan" ADD CONSTRAINT "AiGeneratedSessionPlan_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiRequestLog" ADD CONSTRAINT "AiRequestLog_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiRequestLog" ADD CONSTRAINT "AiRequestLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
