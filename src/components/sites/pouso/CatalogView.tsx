"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { lots, origins } from "@/lib/pouso/data";
import { Shelf } from "./Shelf";

/** /cafes — every lot standing on the shelf, filtered by `?origem=`. */
export function CatalogView() {
  const params = useSearchParams();
  const active = params.get("origem");
  const current = origins.find((o) => o.slug === active);
  const items = lots.filter((l) => !current || l.origin === current.slug);

  const chip = (href: string, label: string, on: boolean) => (
    <Link
      key={href}
      href={href}
      scroll={false}
      aria-current={on ? "page" : undefined}
      className={`label rounded-piece border px-3 py-2 transition-colors ${
        on ? "border-terra bg-terra text-cream" : "border-leaf/40 text-ink hover:border-terra hover:text-terra"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <div className="flex flex-col gap-6 border-b border-ink/15 pb-7 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label text-leaf">{current ? `Origem · ${current.name}` : "Safra 2026"}</p>
          <h1 className="mt-3 max-w-[13em] text-title text-ink">
            Cafés de origem, <span className="italic-accent">torrados toda semana.</span>
          </h1>
        </div>
        <nav aria-label="Origens" className="flex flex-wrap gap-2">
          {chip("/cafes", "Todos", !current)}
          {origins.map((o) => chip(`/cafes?origem=${o.slug}`, o.name, current?.slug === o.slug))}
        </nav>
      </div>
      <p className="mt-6 text-caption text-ink/70">
        {current ? current.description : "Pacotes de 250 g, em grãos ou moídos na hora do envio. Cada um traz o sítio, a altitude e a data da torra."}
      </p>
      <div className="mt-14" key={current?.slug ?? "all"}>
        <Shelf items={items} cols="md:grid-cols-2 lg:grid-cols-3" />
      </div>
    </>
  );
}
