import type { Metadata } from "next";
import Image from "next/image";
import { CupRings } from "@/components/sites/pouso/CupRings";
import { RevealText } from "@/components/sites/pouso/RevealText";
import { RoasteryThread } from "@/components/sites/pouso/Threads";
import { ButtonLink, Eyebrow, ScrollHint } from "@/components/sites/pouso/ui";
import { img, roastery } from "@/lib/pouso/data";

export const metadata: Metadata = { title: "A torrefação · Pouso" };

export default function RoasteryPage() {
  const { cover, about, process, quote, closing } = roastery;
  return (
    <>
      <section className="farm-ground relative -mt-14 flex min-h-svh items-center overflow-hidden text-cream">
        <div className="container-site grid items-center gap-14 pb-36 pt-28 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6">
            <Eyebrow tone="text-cream/80" rule="#c2603a">
              {cover.eyebrow}
            </Eyebrow>
            <h1 className="mt-6 text-display text-cream">
              <RevealText lines={cover.titleLines} />
            </h1>
            <p className="mt-10 max-w-[44ch] text-body font-normal text-cream/85">{cover.text}</p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <div className="mx-auto max-w-[460px] md:ml-[8%]">
              <CupRings />
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-10 sm:pb-14">
          <ScrollHint href="#torrefacao" />
        </div>
      </section>

      <div className="relative">
        <RoasteryThread />

        <section id="torrefacao" className="container-site relative grid scroll-mt-12 gap-10 py-28 md:grid-cols-12 md:gap-8 md:py-40">
          <div className="relative z-[2] pl-6 md:col-span-4 md:pl-0">
            <Eyebrow>{about.eyebrow}</Eyebrow>
            <div className="mt-10 hidden overflow-hidden rounded-[10px_10px_3px_3px] shadow-[0_24px_40px_-24px_#231a1580] md:block">
              <Image src={img("roaster.jpg")} alt="Mãos conferindo os grãos recém-torrados na bandeja de resfriamento do torrador" width={896} height={1200} className="aspect-[3/4] w-full object-cover" />
            </div>
          </div>
          <div className="relative z-[2] md:col-span-7 md:col-start-6">
            <h2 className="text-display text-ink">
              <RevealText lines={about.titleLines} />
            </h2>
            <div className="mt-10 max-w-reading space-y-5 text-body text-ink">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="container-site relative pb-24">
          <div className="relative z-[2] pl-6 md:pl-0">
            <Eyebrow>{process.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-title text-ink">
              <RevealText lines={process.titleLines} />
            </h2>
            <ol className="mt-14">
              {process.steps.map((s, i) => (
                <li key={s.title} className="grid gap-3 border-t border-dashed border-ink/40 py-10 md:grid-cols-12 md:gap-8">
                  <span className="font-display text-title font-light italic tabular-nums text-terra/50 md:col-span-2">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-subtitle text-ink md:col-span-3 md:pt-2">{s.title}</h3>
                  <p className="text-caption leading-relaxed text-ink/85 md:col-span-7 md:pt-2">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="container-site relative pb-40 pt-16">
          <figure className="relative z-[2] ml-6 max-w-[580px] border-l border-ink/30 pl-8 md:ml-0 md:pl-12">
            <blockquote className="font-display text-title italic text-ink">“{quote.text}”</blockquote>
            <figcaption className="label mt-8 text-leaf">{quote.author}</figcaption>
          </figure>
          <span aria-hidden="true" className="absolute bottom-16 left-6 block h-px w-px sm:left-10" data-yarn-anchor="threadEnd" />
        </section>
      </div>

      <section aria-label="Cafezal na Serra da Mantiqueira" className="relative h-[62svh] min-h-[360px] overflow-hidden">
        <Image src={img("farm.jpg")} alt="Fileiras de café em montanhas verdes ao amanhecer, com cerejas maduras em primeiro plano" fill sizes="100vw" className="object-cover object-[50%_38%]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-cream/0 via-transparent to-farm/80" />
        <p className="container-site label absolute inset-x-0 bottom-8 text-cream/85">Carmo de Minas · MG · 1.250 m</p>
      </section>

      <section className="farm-ground text-cream">
        <div className="container-site grid gap-12 py-28 md:grid-cols-12 md:items-center md:gap-8 md:py-36">
          <div className="md:col-span-7">
            <p className="label text-cream/75">{closing.eyebrow}</p>
            <h2 className="mt-6 text-display text-cream">
              <RevealText lines={closing.titleLines} />
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-body font-normal text-cream/85">{closing.text}</p>
            <ButtonLink href="/cafes" variant="outlineLight" className="mt-10">
              {closing.cta}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
