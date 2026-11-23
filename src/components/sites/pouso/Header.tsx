"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CartButton } from "./cart";
import { useHeroOpen, useIntroDone } from "./client-utils";
import { CloseIcon, MenuIcon, socials } from "./icons";
import { ButtonLink, Wordmark } from "./ui";

/** On the home the header waits for the scroll-driven hero to finish its reveal; elsewhere it
 * only waits for the splash. */
function useHeaderOpen(isHome: boolean) {
  const introDone = useIntroDone();
  const heroOpen = useHeroOpen();
  return introDone && (!isHome || heroOpen);
}

export function Header() {
  const path = usePathname();
  const isHome = path === "/";
  const open = useHeaderOpen(isHome);
  const [menu, setMenu] = useState(false);
  const dlg = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (menu && !d.open) d.showModal();
    if (!menu && d.open) d.close();
  }, [menu]);

  const navCls = (href: string) =>
    `hidden sm:block label transition-colors hover:text-terra ${path.startsWith(href) ? "text-terra" : "text-ink/80"}`;

  return (
    <>
      <header data-open={open ? "1" : "0"} className="header-fixed sticky top-0 z-50 bg-cream/85 backdrop-blur-md">
        <nav className="container-site flex h-14 items-center justify-between gap-6" aria-label="Principal">
          <Link href="/" aria-label="Pouso · início" className="flex items-center text-ink transition-colors duration-300 hover:text-terra">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/cafes" className={navCls("/cafes")}>
              Cafés
            </Link>
            <Link href="/torrefacao" className={navCls("/torrefacao")}>
              Torrefação
            </Link>
            <CartButton />
            <span className="hidden sm:block">
              <ButtonLink href="/cafes" className="!min-h-12 !px-6">
                Ver cafés
              </ButtonLink>
            </span>
            <button
              type="button"
              aria-label="Abrir o menu"
              aria-expanded={menu}
              onClick={() => setMenu(true)}
              className="grid h-10 w-10 place-items-center rounded-piece text-ink transition-colors duration-300 hover:bg-terra/10 hover:text-terra sm:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </nav>
      </header>

      <dialog
        ref={dlg}
        className="sheet nav-sheet"
        aria-label="Menu"
        onClose={() => setMenu(false)}
        onClick={(e) => {
          if (e.target === dlg.current) setMenu(false);
        }}
      >
        <div className="sheet-paper rounded-b-[18px] bg-cream px-6 pb-8 pt-5 shadow-[0_30px_60px_-30px_#1a0512]">
          <div className="flex items-center justify-between gap-4">
            <p className="label text-leaf">Navegar</p>
            <button type="button" aria-label="Fechar o menu" onClick={() => setMenu(false)} className="-mr-2 grid h-10 w-10 place-items-center rounded-piece text-ink/45 transition-colors duration-300 hover:bg-terra/10 hover:text-terra">
              <CloseIcon />
            </button>
          </div>
          <nav className="mt-4" aria-label="Principal">
            <Link href="/cafes" onClick={() => setMenu(false)} className="block py-3 text-title text-ink transition-colors hover:text-terra">
              Cafés
            </Link>
            <span aria-hidden="true" className="cart-seam my-1 block" />
            <Link href="/torrefacao" onClick={() => setMenu(false)} className="block py-3 text-title text-ink transition-colors hover:text-terra">
              Torrefação
            </Link>
          </nav>
          <ButtonLink href="/cafes" onClick={() => setMenu(false)} className="mt-7 w-full">
            Ver cafés
          </ButtonLink>
          <ul className="-ml-3 mt-6 flex items-center gap-2">
            {socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} title={s.label} aria-label={s.label} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-piece text-leaf transition-colors duration-300 hover:bg-terra/10 hover:text-terra">
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-caption leading-snug text-ink/55">Belo Horizonte · MG — torra toda segunda-feira.</p>
        </div>
      </dialog>
    </>
  );
}
