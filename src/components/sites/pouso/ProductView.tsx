"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatBRL, getGrind, getOrigin, grinds, lots, type Lot } from "@/lib/pouso/data";
import { useCart } from "./cart";
import { CloseIcon } from "./icons";
import { RevealText } from "./RevealText";
import { RoastSwatch } from "./RoastSwatch";
import { Shelf } from "./Shelf";
import { Button, Eyebrow } from "./ui";

export function ProductView({ lot }: { lot: Lot }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const grind = getGrind(params.get("v"));
  const origin = getOrigin(lot.origin);
  const { add, lines } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const zoom = useRef<HTMLDialogElement>(null);
  const inCart = lines.filter((l) => l.slug === lot.slug && l.grind === grind.slug).reduce((s, l) => s + l.qty, 0);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(t);
  }, [added]);

  const others = lots.filter((l) => l.slug !== lot.slug);

  const specs: [string, string][] = [
    ["Produtor", `${lot.producer} · ${lot.farm}`],
    ["Região", lot.region],
    ["Altitude", lot.altitude],
    ["Variedade", lot.variety],
    ["Processo", lot.process],
    ["Pontuação SCA", lot.score.toLocaleString("pt-BR")],
    ["Preparo sugerido", lot.brew],
  ];

  return (
    <>
      <section className="container-site pb-24 pt-10 md:pt-12">
        <nav aria-label="Trilha" className="label flex flex-wrap gap-x-3 text-leaf">
          <Link href="/cafes" className="hover:text-terra">
            Cafés
          </Link>
          <span aria-hidden="true">·</span>
          <Link href={`/cafes?origem=${origin.slug}`} className="hover:text-terra">
            {origin.name}
          </Link>
          <span aria-hidden="true">·</span>
          <span className="text-ink">{lot.name}</span>
        </nav>

        <div className="mt-10 grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="relative md:col-span-7 md:pr-10">
            <div className="shelf-slot mx-auto max-w-[580px] [--half-gap:28px]">
              <span aria-hidden="true" className="plank" />
              <div className="shelf-item overflow-hidden rounded-[12px_12px_2px_2px] bg-kraft shadow-[0_0_0_1px_#231a1512,0_24px_40px_-24px_#231a1599]" data-on="1">
                <button type="button" onClick={() => zoom.current?.showModal()} className="relative block w-full cursor-zoom-in" aria-label="Ampliar a foto">
                  <Image
                    src={lot.image}
                    alt={lot.imageAlt}
                    width={896}
                    height={1200}
                    priority
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="relative aspect-[4/5] w-full object-cover"
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
            <div className="flex flex-wrap gap-2">
              <span className="label bg-terra px-2.5 py-1.5 text-[0.66rem] text-cream">{origin.name}</span>
              <span className="label border border-leaf/40 bg-kraft/60 px-2.5 py-1.5 text-[0.66rem] text-leaf">Torra da semana</span>
            </div>
            <h1 className="mt-4 text-title text-ink">
              <RevealText lines={[lot.name]} />
            </h1>
            <p className="mt-3 text-[1.2rem] font-normal leading-tight text-leaf">{lot.region}</p>
            <p className="mt-4 font-display text-[1.35rem] italic text-ink/85">{lot.notes.join(", ")}.</p>
            <p className="mt-7 text-[1.55rem] font-semibold tabular-nums text-terra">
              {formatBRL(lot.priceCents)} <span className="text-[0.95rem] font-normal text-ink/60">/ {lot.weight}</span>
            </p>

            <p className="label mt-8 flex items-center gap-2 text-[0.7rem] text-ink/80">
              Torra {lot.roast.toLowerCase()} · <RoastSwatch hex={lot.roastHex} size={22} label={`Torra ${lot.roast}`} />
            </p>

            <fieldset className="mt-8">
              <legend className="label text-[0.7rem] text-ink/80">Moagem</legend>
              <div className="mt-3 grid gap-2">
                {grinds.map((g) => {
                  const on = g.slug === grind.slug;
                  return (
                    <button
                      key={g.slug}
                      type="button"
                      aria-pressed={on}
                      onClick={() => router.replace(`${pathname}?v=${g.slug}`, { scroll: false })}
                      className={`flex items-baseline justify-between gap-3 border px-4 py-3 text-left transition-colors ${
                        on ? "border-terra bg-terra/[0.06] text-ink" : "border-leaf/40 text-ink/80 hover:border-terra"
                      }`}
                    >
                      <span className="font-medium">{g.name}</span>
                      <span className="text-caption text-ink/60">{g.hint}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <p className="label text-[0.7rem] text-ink/80">Quantidade</p>
                {inCart > 0 && <p className="text-caption text-ink/60">{inCart} já na sacola</p>}
              </div>
              <div className="mt-3 inline-flex h-[50px] items-stretch border border-leaf/50">
                <button type="button" aria-label="Diminuir" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid w-12 place-items-center text-xl text-ink transition-colors hover:bg-terra/10 disabled:text-ink/30">
                  −
                </button>
                <span className="grid w-14 place-items-center border-x border-leaf/50 tabular-nums" aria-live="polite">
                  {qty}
                </span>
                <button type="button" aria-label="Aumentar" onClick={() => setQty((q) => q + 1)} className="grid w-12 place-items-center text-xl text-ink transition-colors hover:bg-terra/10">
                  +
                </button>
              </div>
            </div>

            <Button
              className={`mt-8 w-full ${added ? "outline-[1.5px] outline-dashed -outline-offset-[6px] outline-cream" : ""}`}
              onClick={() => {
                add(lot.slug, grind.slug, qty);
                setAdded(true);
                setQty(1);
              }}
            >
              {added ? "Na sacola" : "Colocar na sacola"}
            </Button>
            <p className="mt-3 max-w-[40ch] text-caption text-ink/70">Torrado na segunda, enviado até quarta. Moemos na hora do envio.</p>

            <p className="mt-12 text-body font-normal text-ink">{lot.description}</p>

            <dl className="mt-10">
              {specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 border-t border-dashed border-leaf/50 py-4">
                  <dt className="label pt-0.5 text-[0.62rem] text-ink/60">{k}</dt>
                  <dd className="text-[0.95rem] font-normal leading-snug text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="container-site pb-32 pt-10 md:pb-44">
        <Eyebrow>Também na prateleira</Eyebrow>
        <h2 className="mt-6 text-title text-ink">
          <RevealText lines={["Outros cafés da safra"]} />
        </h2>
        <div className="mt-10">
          <Shelf items={others} cols="md:grid-cols-2 lg:grid-cols-3" />
        </div>
      </section>

      <dialog
        ref={zoom}
        className="sheet m-auto h-[min(92vh,1100px)] w-[min(92vw,820px)]"
        aria-label={lot.imageAlt}
        onClick={(e) => {
          if (e.target === zoom.current) zoom.current?.close();
        }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-paper">
          <Image src={lot.image} alt={lot.imageAlt} fill sizes="92vw" className="object-contain" />
          <button type="button" onClick={() => zoom.current?.close()} aria-label="Fechar" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-cream/90 text-ink hover:text-terra">
            <CloseIcon />
          </button>
        </div>
      </dialog>
    </>
  );
}
