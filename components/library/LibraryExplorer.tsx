"use client";

import { useMemo, useState } from "react";
import { CopyTemplateButton } from "@/components/library/CopyTemplateButton";
import { libraryCategories, libraryResources, type LibraryCategory } from "@/lib/libraryResources";

export function LibraryExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<LibraryCategory | "Tout">("Tout");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return libraryResources.filter((resource) => {
      const matchesCategory = category === "Tout" || resource.category === category;
      const haystack = `${resource.title} ${resource.category} ${resource.audience} ${resource.content}`.toLowerCase();
      return matchesCategory && (!normalized || haystack.includes(normalized));
    });
  }, [category, query]);

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-ink/10 bg-paper p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="grid gap-1.5 text-sm font-medium text-ink/75">
            Rechercher
            <input
              className="focus-ring rounded-md border border-ink/15 bg-white px-3 py-2.5 text-ink"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="stress, sommeil, note, vigilance..."
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-ink/75">
            Catégorie
            <select
              className="focus-ring min-w-60 rounded-md border border-ink/15 bg-white px-3 py-2.5 text-ink"
              value={category}
              onChange={(event) => setCategory(event.target.value as LibraryCategory | "Tout")}
            >
              {libraryCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <p className="text-sm font-medium text-ink/55">{filtered.length} ressource(s)</p>

      <div className="grid gap-4 xl:grid-cols-2">
        {filtered.map((resource) => (
          <section key={`${resource.category}-${resource.title}`} className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">{resource.category}</p>
                <h2 className="mt-2 text-lg font-semibold text-ink">{resource.title}</h2>
                <p className="mt-1 text-sm font-medium text-ink/55">{resource.audience}</p>
              </div>
              <CopyTemplateButton text={resource.content} />
            </div>
            <pre className="mt-4 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-md bg-mint/50 p-4 text-sm leading-6 text-ink/70">
              {resource.content}
            </pre>
          </section>
        ))}
      </div>
    </div>
  );
}
