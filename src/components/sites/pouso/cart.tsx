"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { formatBRL, getGrind, getLot, whatsappUrl } from "@/lib/pouso/data";
import { CartIcon, CloseIcon, TrashIcon } from "./icons";
import { RoastSwatch } from "./RoastSwatch";

export type CartLine = { slug: string; grind: string; qty: number };
type Ctx = {
  lines: CartLine[];
  count: number;
  add: (slug: string, grind: string, qty: number) => void;
  setQty: (slug: string, grind: string, qty: number) => void;
  remove: (slug: string, grind: string) => void;
  open: () => void;
  close: () => void;
  isOpen: boolean;
  bump: number;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "pouso:cart";
const same = (l: CartLine, slug: string, grind: string) => l.slug === slug && l.grind === grind;

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  // `ready` flips only after the stored cart is read, so the save effect can never overwrite it
  // with the initial empty list (StrictMode runs mount effects twice in development).
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage after mount
      if (raw) setLines((JSON.parse(raw) as CartLine[]).filter((l) => getLot(l.slug)));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback((slug: string, grind: string, qty: number) => {
    setLines((ls) => {
      const i = ls.findIndex((l) => same(l, slug, grind));
      if (i < 0) return [...ls, { slug, grind, qty }];
      const next = [...ls];
      next[i] = { ...next[i], qty: next[i].qty + qty };
      return next;
    });
    setBump((b) => b + 1);
  }, []);
  const setQty = useCallback((slug: string, grind: string, qty: number) => {
    setLines((ls) => (qty <= 0 ? ls.filter((l) => !same(l, slug, grind)) : ls.map((l) => (same(l, slug, grind) ? { ...l, qty } : l))));
  }, []);
  const remove = useCallback((slug: string, grind: string) => setQty(slug, grind, 0), [setQty]);

  const value = useMemo<Ctx>(
    () => ({
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      add,
      setQty,
      remove,
      open: () => setOpen(true),
      close: () => setOpen(false),
      isOpen,
      bump,
    }),
    [lines, add, setQty, remove, isOpen, bump],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDialog />
    </CartContext.Provider>
  );
}

const plural = (n: number) => `${n} ${n === 1 ? "pacote" : "pacotes"}`;

export function CartButton() {
  const { count, open, bump } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={count ? `Abrir a sacola · ${plural(count)}` : "Abrir a sacola · vazia"}
      className="group relative grid h-10 w-10 place-items-center rounded-piece text-ink transition-colors duration-300 hover:bg-terra/10 hover:text-terra"
    >
      <span key={bump} className={bump ? "cart-kick" : ""}>
        <CartIcon />
      </span>
      {count > 0 && (
        <span className="absolute -top-0.5 right-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-terra px-1 text-[0.62rem] font-semibold leading-none text-cream [animation:badge-in_.4s_var(--ease-thread)]">
          {count}
        </span>
      )}
    </button>
  );
}

function CartDialog() {
  const { lines, count, isOpen, close, setQty, remove } = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  const [coupon, setCoupon] = useState<string | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (isOpen && !d.open) d.showModal();
    if (!isOpen && d.open) d.close();
  }, [isOpen]);

  const items = lines.flatMap((line) => {
    const lot = getLot(line.slug);
    return lot ? [{ line, lot, grind: getGrind(line.grind) }] : [];
  });
  const total = items.reduce((s, x) => s + x.lot.priceCents * x.line.qty, 0);

  const message = () =>
    [
      "Olá! Quero pedir:",
      ...items.map((x) => `• ${x.line.qty}× ${x.lot.name} ${x.lot.weight} — ${x.grind.name} (${formatBRL(x.lot.priceCents * x.line.qty)})`),
      "",
      `Total: ${formatBRL(total)} + frete`,
      coupon ? `Cupom: ${coupon}` : "",
    ]
      .filter((r, i) => r !== "" || i === items.length + 1)
      .join("\n")
      .trim();

  return (
    <dialog
      ref={ref}
      className="sheet cart-sheet"
      aria-label="Sacola"
      onClose={close}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
    >
      <div className="sheet-paper scallop relative max-h-[calc(100dvh-4rem)] overflow-y-auto rounded-b-[14px] bg-paper px-6 pb-8 pt-10 shadow-[0_40px_80px_-30px_#140b07] sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-terra">
              <CartIcon className="h-8 w-8" />
            </span>
            <div>
              <p className="font-display text-[1.6rem] font-medium leading-tight text-ink">Sua sacola</p>
              <p className="label mt-1 text-[0.7rem] text-ink">{count ? plural(count) : "vazia"}</p>
            </div>
          </div>
          <button type="button" onClick={close} aria-label="Fechar a sacola" className="-mr-2 grid h-10 w-10 place-items-center rounded-piece text-ink/60 transition-colors hover:bg-terra/10 hover:text-terra">
            <CloseIcon />
          </button>
        </div>
        <span aria-hidden="true" className="cart-seam mt-6 block" />

        {items.length === 0 ? (
          <div className="py-10 text-center">
            <p className="font-display text-[1.5rem] italic text-ink">Nenhum grão por aqui ainda.</p>
            <p className="mt-2 text-caption text-ink/60">Torramos toda segunda. Escolha o seu.</p>
            <Link href="/cafes" onClick={close} className="label mt-6 inline-block border-b border-terra/40 pb-1 text-terra">
              Ver cafés
            </Link>
          </div>
        ) : (
          <>
            <ul>
              {items.map(({ line, lot, grind }) => (
                <li key={line.slug + line.grind} className="flex gap-4 py-6 [&+&]:border-t [&+&]:border-dashed [&+&]:border-leaf/40">
                  <Link href={`/cafes/${lot.slug}?v=${grind.slug}`} onClick={close} className="relative block w-24 shrink-0">
                    <span className="block aspect-[4/5] overflow-hidden rounded-[6px_6px_2px_2px] bg-kraft shadow-[0_1px_1px_#231a150d,0_2px_6px_#231a151a,0_10px_20px_-12px_#231a154d]">
                      <Image src={lot.image} alt={lot.imageAlt} width={192} height={240} className="h-full w-full object-cover" />
                    </span>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-display text-[1.15rem] font-medium leading-tight text-ink">{lot.name}</p>
                      <p className="shrink-0 text-[0.95rem] font-medium tabular-nums text-terra">{formatBRL(lot.priceCents * line.qty)}</p>
                    </div>
                    <p className="mt-1 text-caption text-ink/70">
                      {lot.weight} · {grind.name}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-caption text-ink/70">
                      <RoastSwatch hex={lot.roastHex} size={18} /> Torra {lot.roast.toLowerCase()}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex h-9 items-stretch border border-leaf/50">
                        <button type="button" aria-label="Diminuir" onClick={() => setQty(line.slug, line.grind, line.qty - 1)} className="grid w-9 place-items-center text-ink hover:bg-terra/10">
                          {line.qty === 1 ? <TrashIcon /> : "−"}
                        </button>
                        <span className="grid w-9 place-items-center border-x border-leaf/50 text-caption tabular-nums">{line.qty}</span>
                        <button type="button" aria-label="Aumentar" onClick={() => setQty(line.slug, line.grind, line.qty + 1)} className="grid w-9 place-items-center text-ink hover:bg-terra/10">
                          +
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(line.slug, line.grind)} className="text-caption text-ink/60 underline underline-offset-4 hover:text-terra">
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <span aria-hidden="true" className="cart-seam block" />
            {coupon === null ? (
              <button type="button" onClick={() => setCoupon("")} className="label mt-7 text-[0.7rem] text-ink/70 hover:text-terra">
                Tenho um cupom
              </button>
            ) : (
              <label className="mt-6 block">
                <span className="label text-[0.7rem] text-ink/70">Cupom</span>
                <input
                  autoFocus
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  className="mt-2 block w-full border border-leaf/50 bg-transparent px-3 py-2 text-caption uppercase tracking-[0.2em] outline-none focus:border-terra"
                  placeholder="Digite o código"
                />
              </label>
            )}
            <div className="mt-5 flex items-center justify-between rounded-piece bg-kraft/70 px-4 py-4">
              <div>
                <p className="label text-[0.7rem] text-ink">Total</p>
                <p className="mt-1.5 text-caption text-ink/70">{plural(count)} · frete à parte</p>
              </div>
              <p className="text-[1.5rem] font-semibold tabular-nums text-terra">{formatBRL(total)}</p>
            </div>
            <a
              href={whatsappUrl(message())}
              target="_blank"
              rel="noreferrer"
              className="group relative mt-4 flex min-h-12 w-full items-center justify-center bg-terra px-6 label text-cream transition-colors hover:bg-roast"
            >
              Finalizar pelo WhatsApp
            </a>
            <button type="button" onClick={close} className="label mt-5 block w-full text-center text-[0.7rem] text-ink/70 hover:text-terra">
              Continuar escolhendo
            </button>
            <p className="mt-5 text-caption text-ink/60">
              O pedido vai pronto para a conversa. Nada é cobrado aqui — pagamento e frete são combinados com a torrefação.
            </p>
          </>
        )}
      </div>
    </dialog>
  );
}
