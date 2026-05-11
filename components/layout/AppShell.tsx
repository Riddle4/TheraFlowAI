import Link from "next/link";
import Image from "next/image";
import { logoutAction } from "@/server/actions/auth";

const nav = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/clients", label: "Clients" },
  { href: "/app/library", label: "Bibliothèque" },
  { href: "/app/settings/profile", label: "Profil" },
  { href: "/app/settings/account", label: "Compte" }
];

export function AppShell({ children, userName }: { children: React.ReactNode; userName?: string | null }) {
  return (
    <div className="min-h-screen bg-linen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-ink/10 bg-paper px-5 py-6 lg:block">
        <div className="rounded-lg border border-sage/15 bg-white p-3 shadow-sm">
          <Link href="/app/dashboard" className="block" aria-label="TheraFlow AI dashboard">
            <Image
              src="/brand/theraflow-ai.png"
              alt="TheraFlow AI"
              width={210}
              height={158}
              priority
              className="h-auto w-full object-contain"
            />
          </Link>
          <p className="mt-2 text-center text-xs font-medium text-sage/80">Powered by Cosmo</p>
        </div>
        <nav className="mt-10 grid gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink/70 hover:bg-mint hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="absolute bottom-6 left-5 right-5">
          <p className="mb-3 text-xs text-ink/50">{userName}</p>
          <button className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm font-semibold text-ink">
            Déconnexion
          </button>
        </form>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-ink/10 bg-paper/90 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Link href="/app/dashboard" className="font-semibold">
                TheraFlow AI
              </Link>
              <p className="text-[11px] font-medium text-sage/80">Powered by Cosmo</p>
            </div>
            <form action={logoutAction}>
              <button className="rounded-md border border-ink/15 px-3 py-1.5 text-sm">Sortir</button>
            </form>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-md bg-mint px-3 py-1.5 text-sm">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
