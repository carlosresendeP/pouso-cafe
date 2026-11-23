"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import LAND from "@/lib/pouso/land-dots.json";
import { home, lots, testimonials, type Testimonial } from "@/lib/pouso/data";
import { useFrame } from "./client-utils";
import { RevealText } from "./RevealText";
import { Eyebrow } from "./ui";

const D2R = Math.PI / 180;
const land = LAND as [number, number][];

type View = { lam: number; phi: number };
type Proj = { x: number; y: number; z: number };

function project(lng: number, lat: number, v: View, R: number, cx: number, cy: number): Proj {
  const l = (lng - v.lam) * D2R, p = lat * D2R, p0 = v.phi * D2R;
  const z = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
  return {
    x: cx + R * Math.cos(p) * Math.sin(l),
    y: cy - R * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l)),
    z,
  };
}

const AUTO_MS = 7000;

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState(false);
  const [touch, setTouch] = useState(false);
  const t = testimonials[active];

  const section = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const globeBox = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const link = useRef<SVGPathElement>(null);
  const linkCore = useRef<SVGPathElement>(null);
  const view = useRef<View>({ lam: t.lng, phi: 10 });
  const pinScreen = useRef<{ i: number; x: number; y: number; z: number }[]>([]);

  // unique cities, each pointing at its first testimonial
  const pins = useMemo(() => {
    const seen = new Map<string, number>();
    testimonials.forEach((tt, i) => {
      const k = `${tt.lat},${tt.lng}`;
      if (!seen.has(k)) seen.set(k, i);
    });
    return [...seen.values()];
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- detect a touch-only device once mounted
    setTouch(matchMedia("(hover: none)").matches);
  }, []);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { rootMargin: "0px 0px -30% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !seen) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % testimonials.length), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, seen]);

  useFrame(() => {
    const box = globeBox.current, cv = canvas.current;
    if (!box || !cv) return;
    const size = box.clientWidth;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== Math.round(size * dpr)) {
      cv.width = cv.height = Math.round(size * dpr);
    }
    const ctx = cv.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    const R = size * 0.47, c = size / 2;

    // ease the view towards the active city, tilted so it sits a little below centre
    const v = view.current;
    let dl = t.lng + 8 - v.lam;
    dl = ((dl + 540) % 360) - 180;
    v.lam += dl * 0.05;
    v.phi += (Math.max(-25, Math.min(35, t.lat + 18)) - v.phi) * 0.05;

    // sphere: wine disc, rim light and shading
    const g = ctx.createRadialGradient(c - R * 0.35, c - R * 0.4, R * 0.1, c, c, R);
    g.addColorStop(0, "#5a3825");
    g.addColorStop(0.7, "#2f1c12");
    g.addColorStop(1, "#1a0e08");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(c, c, R, 0, Math.PI * 2);
    ctx.fill();

    // land as a dot grid
    ctx.fillStyle = "#f1dcc0";
    for (let i = 0; i < land.length; i++) {
      const pr = project(land[i][0], land[i][1], v, R, c, c);
      if (pr.z <= 0.02) continue;
      ctx.globalAlpha = 0.25 + 0.7 * pr.z;
      const r = 0.55 + 1.05 * pr.z;
      ctx.fillRect(pr.x - r / 2, pr.y - r / 2, r, r);
    }
    ctx.globalAlpha = 1;

    const rim = ctx.createRadialGradient(c, c, R * 0.82, c, c, R);
    rim.addColorStop(0, "rgba(43,26,18,0)");
    rim.addColorStop(1, "rgba(20,11,6,0.7)");
    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(c, c, R, 0, Math.PI * 2);
    ctx.fill();

    // farms of origin: terracotta diamonds
    for (const lot of lots) {
      const pr = project(lot.lng, lot.lat, v, R, c, c);
      if (pr.z <= 0.05) continue;
      ctx.save();
      ctx.translate(pr.x, pr.y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(-4, -2.5, 9, 9);
      ctx.fillStyle = "#c2603a";
      ctx.fillRect(-4.5, -4.5, 9, 9);
      ctx.fillStyle = "#f4ebdd";
      ctx.fillRect(-1.5, -1.5, 3, 3);
      ctx.restore();
    }

    // clients
    const now = performance.now();
    pinScreen.current = [];
    for (const i of pins) {
      const tt = testimonials[i];
      const pr = project(tt.lng, tt.lat, v, R, c, c);
      pinScreen.current.push({ i, ...pr });
      if (pr.z <= 0.05) continue;
      const isActive = tt.lat === t.lat && tt.lng === t.lng;
      const rr = isActive ? 7.5 : 6;
      if (isActive) {
        const pulse = (now % 1800) / 1800;
        ctx.strokeStyle = `rgba(244,235,221,${0.7 * (1 - pulse)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, rr + 4 + pulse * 14, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.arc(pr.x + 1, pr.y + 1.5, rr + 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f4ebdd";
      ctx.beginPath();
      ctx.arc(pr.x, pr.y, rr, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = isActive ? "#5b6b3a" : "#7d8c57";
      ctx.beginPath();
      ctx.arc(pr.x, pr.y, rr - 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#26301c";
      ctx.beginPath();
      ctx.arc(pr.x, pr.y, rr * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }

    // the yarn from the postcard to the active pin
    const sec = section.current, cd = card.current;
    const ap = pinScreen.current.find((p) => testimonials[p.i].lat === t.lat && testimonials[p.i].lng === t.lng);
    if (sec && cd && ap && link.current && linkCore.current) {
      const sr = sec.getBoundingClientRect(), cr = cd.getBoundingClientRect(), br = box.getBoundingClientRect();
      const x0 = cr.right - sr.left, y0 = cr.top - sr.top + cr.height * 0.62;
      const x1 = br.left - sr.left + ap.x, y1 = br.top - sr.top + ap.y;
      const d = `M ${x0} ${y0} C ${x0 + 120} ${y0 + 160}, ${x1 - 260} ${y1 + 60}, ${x1} ${y1}`;
      const vis = ap.z > 0.05 && window.innerWidth >= 768 ? "1" : "0";
      link.current.setAttribute("d", d);
      linkCore.current.setAttribute("d", d);
      link.current.style.opacity = vis;
      linkCore.current.style.opacity = vis;
    }
  });

  const pickNearest = (clientX: number, clientY: number) => {
    const box = globeBox.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const x = clientX - r.left, y = clientY - r.top;
    let best: { i: number; d: number } | null = null;
    for (const p of pinScreen.current) {
      if (p.z <= 0.05) continue;
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < 16 && (!best || d < best.d)) best = { i: p.i, d };
    }
    if (best && testimonials[best.i].lat !== t.lat) setActive(best.i);
    if (box) box.style.cursor = best ? "pointer" : "";
  };

  return (
    <section ref={section} id="recomendacoes" className="relative overflow-x-clip py-24 md:pb-32 md:pt-44">
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3] h-full w-full overflow-visible">
        <path ref={link} fill="none" stroke="#6e4f2e" strokeWidth="4" strokeLinecap="round" style={{ transition: "opacity .4s" }} />
        <path ref={linkCore} fill="none" stroke="#e2c08f" strokeWidth="1.8" strokeDasharray="2.4 2.6" strokeLinecap="round" style={{ transition: "opacity .4s" }} />
      </svg>
      <div className="container-site grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="relative z-[2] md:col-span-5">
          <Eyebrow>{home.testimonials.eyebrow}</Eyebrow>
          <h2 className="mt-6 text-title text-ink">
            <RevealText lines={home.testimonials.titleLines} />
          </h2>
          <p className="label mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.7rem] text-leaf">
            <span>Brasil · Portugal · EUA</span>
            <span className="hidden items-center gap-2 md:inline-flex">
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rotate-45 bg-[#c2603a]" />
              {home.testimonials.legend}
            </span>
          </p>
          <p className="mt-4 max-w-[34ch] text-caption text-ink/70">{touch ? home.testimonials.hintTouch : home.testimonials.hint}</p>

          <div className="relative mt-12" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <Hanger />
            <div ref={card} className="postcard relative overflow-hidden px-6 pb-7 pt-6 sm:px-7">
              <Postcard key={active} t={t} />
              <span key={`p${active}`} aria-hidden="true" className="absolute bottom-0 left-0 h-[3px] bg-leaf" style={{ animation: `progress ${AUTO_MS}ms linear both`, animationPlayState: paused || !seen ? "paused" : "running" }} />
            </div>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Cidades">
            {testimonials.map((tt, i) => (
              <li key={i}>
                <button
                  type="button"
                  aria-pressed={i === active}
                  onClick={() => setActive(i)}
                  className={`label border px-3 py-2 text-[0.66rem] transition-colors duration-300 ${
                    i === active ? "border-terra bg-terra text-cream" : "border-ink/25 text-ink/80 hover:border-terra hover:text-terra"
                  }`}
                >
                  {tt.city}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative hidden md:col-span-7 md:block md:pt-56">
          <div
            ref={globeBox}
            className="relative mx-auto aspect-square w-full max-w-[680px] md:ml-[2%] md:w-[108%]"
            onPointerMove={(e) => pickNearest(e.clientX, e.clientY)}
            onClick={(e) => pickNearest(e.clientX, e.clientY)}
          >
            <span aria-hidden="true" className="absolute inset-[3%] rounded-full shadow-[0_70px_90px_-40px_rgba(43,26,18,0.55),0_0_80px_10px_rgba(43,26,18,0.16)]" />
            <canvas ref={canvas} className="relative h-full w-full" aria-label="Globo com as cidades das clientes" role="img" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Postcard({ t }: { t: Testimonial }) {
  return (
    <div className="[animation:fade-in_.6s_var(--ease-thread)_both]">
      <svg aria-hidden="true" viewBox="0 0 40 28" className="h-7 w-10 text-[#d9b49a]" fill="currentColor">
        <path d="M0 28V17C0 7.6 4.6 1.9 13.6 0l1.8 4.1C10.6 5.6 8.4 8.7 8 13h7.6v15H0Zm22 0V17c0-9.4 4.6-15.1 13.6-17l1.8 4.1c-4.8 1.5-7 4.6-7.4 8.9H38v15H22Z" />
      </svg>
      {t.image && (
        <div className="mx-auto mt-4 w-[66%] overflow-hidden bg-kraft shadow-[0_1px_2px_#231a151a]">
          <Image src={t.image} alt={`${t.name} com um café da Pouso`} width={512} height={680} className="aspect-[3/4] h-full w-full object-cover" />
        </div>
      )}
      <p className="mt-6 whitespace-pre-line font-display text-[1.4rem] font-normal italic leading-snug text-ink">{t.text}</p>
      <p className="label mt-4 text-[0.62rem] text-terra/80">{t.lot}</p>
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-ink/15 pt-5">
        <p className="text-[1.05rem] font-medium text-terra">{t.name}</p>
        <p className="label text-[0.66rem] text-leaf">
          {t.city} · {t.country}
        </p>
      </div>
    </div>
  );
}

/** The postcard hangs from a knob by a dashed cord tied to two pins. */
function Hanger() {
  return (
    <svg aria-hidden="true" viewBox="0 0 160 44" className="absolute -top-8 left-1/2 z-[2] h-11 w-40 -translate-x-1/2 overflow-visible">
      <path d="M18 40 L80 12 L142 40" fill="none" stroke="#6e4f2e" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 40 L80 12 L142 40" fill="none" stroke="#e2c08f" strokeWidth="1.4" strokeDasharray="2.4 2.6" />
      {[18, 142].map((x) => (
        <g key={x}>
          <circle cx={x} cy={40} r={4.5} fill="#e7d5b5" />
          <circle cx={x} cy={40} r={2.4} fill="#93693f" />
        </g>
      ))}
      <circle cx="80" cy="12" r="8" fill="#b38959" />
      <circle cx="77.5" cy="9.5" r="3" fill="#caa173" />
    </svg>
  );
}
