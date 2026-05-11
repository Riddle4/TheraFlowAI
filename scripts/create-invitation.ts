import { randomBytes } from "crypto";
import { PrismaClient } from "@prisma/client";
import { hashInvitationCode } from "../lib/invitations";

const prisma = new PrismaClient();

function readArg(name: string): string | null {
  const prefix = `--${name}=`;
  const value = process.argv.find((arg) => arg.startsWith(prefix));
  return value ? value.slice(prefix.length) : null;
}

async function main() {
  const code = readArg("code") ?? randomBytes(8).toString("base64url");
  const email = readArg("email");
  const label = readArg("label") ?? "Invitation thérapeute";
  const maxUses = Number(readArg("maxUses") ?? "1");

  await prisma.invitationCode.create({
    data: {
      codeHash: hashInvitationCode(code),
      email: email?.toLowerCase() ?? null,
      label,
      maxUses
    }
  });

  console.log("Invitation créée");
  console.log(`Code: ${code}`);
  if (email) console.log(`Email réservé: ${email}`);
  console.log("Conservez ce code: il n'est pas stocké en clair.");
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
