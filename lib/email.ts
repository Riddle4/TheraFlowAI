import "server-only";

type AccessRequestEmailInput = {
  name: string;
  email: string;
  discipline?: string | null;
  message?: string | null;
  createdAt: Date;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendAccessRequestEmail(input: AccessRequestEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ACCESS_REQUEST_TO_EMAIL ?? "info@cosmoengine.ai";
  const from = process.env.EMAIL_FROM ?? "TheraFlow AI <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY manquant");
  }

  const appUrl = process.env.APP_URL ?? "TheraFlow AI";
  const discipline = input.discipline || "Non renseignée";
  const message = input.message || "Aucun message";

  const text = [
    "Nouvelle demande d'accès TheraFlow AI",
    "",
    `Nom: ${input.name}`,
    `Email: ${input.email}`,
    `Discipline: ${discipline}`,
    `Date: ${input.createdAt.toLocaleString("fr-CH")}`,
    "",
    "Message:",
    message,
    "",
    `Application: ${appUrl}`
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #18351f; line-height: 1.5;">
      <h1>Nouvelle demande d'accès TheraFlow AI</h1>
      <p><strong>Nom:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Discipline:</strong> ${escapeHtml(discipline)}</p>
      <p><strong>Date:</strong> ${escapeHtml(input.createdAt.toLocaleString("fr-CH"))}</p>
      <h2>Message</h2>
      <p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>
      <p style="margin-top: 24px;"><strong>Application:</strong> ${escapeHtml(appUrl)}</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      replyTo: input.email,
      subject: `Demande d'accès TheraFlow AI - ${input.name}`,
      text,
      html
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Erreur Resend ${response.status}: ${detail.slice(0, 500)}`);
  }
}
