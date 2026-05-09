import { ProfileForm } from "@/components/ui/ProfileForm";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ProfilePage() {
  const user = await requireUser();
  const profile = await prisma.therapistProfile.findUnique({ where: { therapistId: user.id } });

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay">Paramètres</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Profil thérapeute</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
          Ces informations guident les propositions IA sans remplacer votre cadre professionnel.
        </p>
      </div>
      <section className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
        <ProfileForm profile={profile} />
      </section>
    </div>
  );
}
