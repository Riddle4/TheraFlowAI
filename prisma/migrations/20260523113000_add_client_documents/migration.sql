CREATE TABLE "ClientDocument" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientDocument_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ClientDocument_clientId_idx" ON "ClientDocument"("clientId");
CREATE INDEX "ClientDocument_therapistId_idx" ON "ClientDocument"("therapistId");

ALTER TABLE "ClientDocument"
ADD CONSTRAINT "ClientDocument_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE public."ClientDocument" ENABLE ROW LEVEL SECURITY;
