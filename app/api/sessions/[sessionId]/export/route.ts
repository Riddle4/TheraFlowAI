import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

function escapeHtml(value: string | null | undefined) {
  return (value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function block(title: string, value: string | null | undefined) {
  return `<h2>${escapeHtml(title)}</h2><p>${escapeHtml(value || "Non renseigné").replaceAll("\n", "<br>")}</p>`;
}

export async function GET(_: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const user = await requireUser();
  const { sessionId } = await params;
  const session = await prisma.therapySession.findFirst({
    where: { id: sessionId, therapistId: user.id },
    include: { client: true }
  });

  if (!session) {
    return NextResponse.json({ error: "Séance introuvable" }, { status: 404 });
  }

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Résumé séance ${escapeHtml(session.client.pseudonym)}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #183026; line-height: 1.5; }
    h1 { font-size: 24px; }
    h2 { font-size: 16px; margin-top: 22px; color: #3f7c63; }
    p { white-space: normal; }
    .meta { color: #4f6359; }
  </style>
</head>
<body>
  <h1>Résumé de séance</h1>
  <p class="meta">Client: ${escapeHtml(session.client.pseudonym)}<br>
  Date: ${session.sessionDate.toLocaleDateString("fr-CH")}<br>
  Durée: ${session.durationMinutes ?? "Non renseignée"} minutes</p>
  ${block("Déroulé préparé", session.aiSessionPlan)}
  ${block("Objectif", session.objective)}
  ${block("État du client", session.clientState)}
  ${block("Interventions réalisées", session.performedInterventions)}
  ${block("Réactions observées", session.observedReactions)}
  ${block("Points à reprendre", session.pointsToRevisit)}
  ${block("Exercices donnés", session.exercisesGiven)}
  ${block("Prochaine étape", session.nextStep)}
  ${session.structuredNote ? block("Ancienne note structurée", session.structuredNote) : ""}
  ${block("Notes du thérapeute", session.rawNote)}
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "application/msword; charset=utf-8",
      "Content-Disposition": `attachment; filename="seance-${session.client.pseudonym}-${session.sessionDate.toISOString().slice(0, 10)}.doc"`
    }
  });
}
