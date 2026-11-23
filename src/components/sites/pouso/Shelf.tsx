"use client";

import Image from "next/image";
import Link from "next/link";
import { formatBRL, getOrigin, type Lot } from "@/lib/pouso/data";
import { useInView } from "./client-utils";
import { RoastSwatch } from "./RoastSwatch";

/**
 * Products standing on a wooden shelf. Each item carries its own stretch of plank, extended across
 * half the gap on both sides, so a row of items reads as one continuous board. Items "settle" onto
 * the shelf (a small drop with a bounce) when they come into view.
 */
export function LotCard({ lot, index, priority = false }: { lot: Lot; index: number; priority?: boolean }) {
  const [ref, inView] = useInView<HTMLAnchorElement>("0px 0px -8% 0px");
  return (
    <Link
      ref={ref}
      href={`/cafes/${lot.slug}`}
      data-on={inView ? "1" : "0"}
      className="shelf-item group relative z-[2] block"
      style={{ ["--delay" as string]: `${120 + index * 120}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[10px_10px_2px_2px] bg-kraft shadow-[0_0_0_1px_#231a1512,0_18px_30px_-20px_#231a1599]">
        <Image
          src={lot.image}
          alt={lot.imageAlt}
          width={640}
          height={800}
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 45vw, 70vw"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-thread group-hover:scale-[1.04]"
        />
        <span className="tag-stamp">{getOrigin(lot.origin).name}</span>
      </div>
      <div className="px-1 pt-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className="font-display text-[1.25rem] font-medium leading-tight text-ink transition-colors duration-500 group-hover:text-terra">{lot.name}</h3>
          <p className="ml-auto shrink-0 text-[1rem] font-semibold tabular-nums text-terra">{formatBRL(lot.priceCents)}</p>
        </div>
        <p className="mt-0.5 text-caption leading-snug text-ink/60">{lot.region}</p>
        <p className="mt-2 font-display text-[1rem] italic text-ink/80">{lot.notes.join(" · ")}</p>
        <div className="mt-2.5 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-caption text-ink/60">
            <RoastSwatch hex={lot.roastHex} label={`Torra ${lot.roast.toLowerCase()}`} />
            Torra {lot.roast.toLowerCase()}
          </span>
          <span className="text-caption tabular-nums text-ink/50">{lot.altitude}</span>
        </div>
      </div>
    </Link>
  );
}

/** Lots on shelves: a grid on desktop, a swipeable rail on mobile. */
export function Shelf({
  items,
  cols = "md:grid-cols-2 lg:grid-cols-4",
}: {
  items: Lot[];
  cols?: string;
}) {
  return (
    <div className="-mx-6 overflow-x-auto px-[14vw] pb-6 pt-4 [scrollbar-width:none] sm:px-6 md:mx-0 md:overflow-visible md:px-0">
      <div className={`flex w-max snap-x snap-mandatory gap-6 md:grid md:w-auto md:gap-x-10 md:gap-y-20 ${cols}`}>
        {items.map((lot, i) => (
          <div key={lot.slug} className="shelf-slot w-[66vw] max-w-[280px] snap-center sm:w-[42vw] md:w-auto md:max-w-none">
            {/* the board: placed at the pack's base (4:5 image → 125% of the slot width), extended
                across half the gap on each side so a row reads as one continuous plank */}
            <span aria-hidden="true" className="plank" />
            <LotCard lot={lot} index={i} priority={i < 2} />
          </div>
        ))}
      </div>
    </div>
  );
}
