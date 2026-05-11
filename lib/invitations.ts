import { createHash } from "crypto";

export function hashInvitationCode(code: string): string {
  return createHash("sha256").update(code.trim().toLowerCase()).digest("hex");
}

export function publicRegistrationEnabled(): boolean {
  return process.env.ALLOW_PUBLIC_REGISTRATION === "true";
}
