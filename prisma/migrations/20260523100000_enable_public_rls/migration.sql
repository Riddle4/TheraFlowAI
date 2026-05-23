-- Supabase exposes tables in the public schema through its generated API.
-- TheraFlow reads and writes through the Next.js server with Prisma, so no
-- anonymous or browser-side Supabase policies are required for these tables.
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."InvitationCode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AccessRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AuthSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."TherapistProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Client" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Anamnesis" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."TherapySession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AiGeneratedSessionPlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AiRequestLog" ENABLE ROW LEVEL SECURITY;
