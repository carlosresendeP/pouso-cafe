import Link from "next/link";
import { contact } from "@/lib/pouso/data";
import { socials } from "./icons";
import { Wordmark } from "./ui";

export function Footer() {
  return (
    <footer className="roast-ground relative z-[3] text-cream">
      <div className="container-site pb-14 pt-24 md:pt-28">
        <div className="grid gap-14 md:grid-cols-12 md:items-center">
          <Link href="/" aria-label="Pouso · início" className="text-cream md:col-span-5">
            <Wordmark size="footer" />
          </Link>
          <div className="md:col-span-3 md:self-start">
            <p className="label text-cream/70">Torrefação</p>
            <p className="mt-6 text-[1.15rem] font-normal">{contact.city}</p>
            <p className="mt-3 text-[1.15rem] font-normal">{contact.origin}</p>
            <p className="mt-3 text-[1.05rem] font-normal text-cream/80">{contact.email}</p>
            <ul className="-ml-3 mt-6 flex items-center gap-2">
              {socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} title={s.label} aria-label={s.label} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-piece text-cream/60 transition-colors duration-300 hover:bg-cream/10 hover:text-cream">
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3 md:col-start-9 md:self-start">
            <p className="label text-cream/70">Navegar</p>
            <Link href="/cafes" className="mt-6 block text-[1.15rem] font-normal transition-colors hover:text-cream/70">
              Cafés
            </Link>
            <Link href="/torrefacao" className="mt-3 block text-[1.15rem] font-normal transition-colors hover:text-cream/70">
              A torrefação
            </Link>
          </div>
        </div>
        <div className="mt-24 flex flex-col gap-4 border-t border-cream/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-cream/55">Pouso · cafés de origem · 2026</p>
          <p className="font-display text-[1rem] italic text-cream/60">{contact.signature}</p>
        </div>
      </div>
    </footer>
  );
}
