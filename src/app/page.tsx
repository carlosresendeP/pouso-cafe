import { Hero } from "@/components/sites/pouso/Hero";
import { RevealText } from "@/components/sites/pouso/RevealText";
import { Testimonials } from "@/components/sites/pouso/Testimonials";
import { Shelf } from "@/components/sites/pouso/Shelf";
import { HomeThread } from "@/components/sites/pouso/Threads";
import { ThreadPortrait } from "@/components/sites/pouso/ThreadPortrait";
import { ButtonLink, Eyebrow } from "@/components/sites/pouso/ui";
import { home, img, lots } from "@/lib/pouso/data";

export default function HomePage() {
  const featured = lots.filter((l) => l.featured);

  return (
    <>
      <Hero />

      <div className="relative">
        <HomeThread />

        <section id="manifesto" className="container-site relative grid scroll-mt-12 gap-10 py-28 md:grid-cols-12 md:gap-8 md:py-44">
          <div className="relative z-[2] pl-6 md:col-span-4 md:pl-0">
            <Eyebrow>{home.manifesto.eyebrow}</Eyebrow>
          </div>
          <div className="relative z-[2] md:col-span-7 md:col-start-6">
            <h2 className="text-display text-ink">
              <RevealText lines={["Do pé à xícara,", "sem pressa."]} />
            </h2>
            <p className="mt-10 max-w-reading text-body text-ink">{home.manifesto.text}</p>
            <dl className="mt-14 grid gap-8 sm:grid-cols-3">
              {home.manifesto.facts.map((f) => (
                <div key={f.title}>
                  <dt className="text-subtitle text-ink">{f.title}</dt>
                  <dd className="mt-1 text-caption text-leaf">{f.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="cafes" className="container-site relative scroll-mt-14 pb-28 md:pb-40">
          <div className="relative z-[2] flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-yarn-anchor="colhead">
            <div className="pl-6 md:pl-0">
              <Eyebrow>{home.collection.eyebrow}</Eyebrow>
              <h2 className="mt-6 text-title text-ink">
                <RevealText lines={[home.collection.title]} />
              </h2>
            </div>
            <ButtonLink href="/cafes">{home.collection.cta}</ButtonLink>
          </div>
          <div className="mt-10">
            <Shelf items={featured} />
          </div>
        </section>
      </div>

      <section id="produtor" className="roast-ground relative text-cream">
        <div className="container-site grid gap-16 py-28 md:grid-cols-12 md:gap-8 md:py-36">
          <div className="md:col-span-5">
            <ThreadPortrait src={img("producer.jpg")} alt={home.producer.photoAlt} caption={home.producer.caption} />
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Eyebrow tone="text-cream/80" rule="#c2603a">
              {home.producer.eyebrow}
            </Eyebrow>
            <h2 className="mt-8 text-display text-cream">
              <RevealText lines={home.producer.titleLines} />
            </h2>
            <div className="mt-10 space-y-6 text-body font-normal text-cream/85">
              {home.producer.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ButtonLink href="/torrefacao" variant="outlineLight" className="mt-14">
              {home.producer.cta}
            </ButtonLink>
          </div>
        </div>
      </section>

      <Testimonials />
    </>
  );
}
