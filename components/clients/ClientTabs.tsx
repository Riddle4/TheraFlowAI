import Link from "next/link";

const tabs = [
  { label: "Vue d'ensemble", segment: "" },
  { label: "Timeline", segment: "timeline" },
  { label: "Anamnèse", segment: "anamnesis" },
  { label: "IA", segment: "ai-session" },
  { label: "Documents", segment: "documents" }
];

export function ClientTabs({ clientId, active }: { clientId: string; active: string }) {
  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-ink/10 pb-2" aria-label="Navigation client">
      {tabs.map((tab) => {
        const href = tab.segment ? `/clients/${clientId}/${tab.segment}` : `/clients/${clientId}`;
        const isActive = active === tab.segment;
        return (
          <Link
            key={tab.segment || "overview"}
            href={href}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition ${
              isActive ? "bg-sage text-white" : "text-ink/65 hover:bg-mint hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
