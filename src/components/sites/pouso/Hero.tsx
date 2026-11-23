"use client";

import { useEffect, useRef, useState } from "react";
import { heroVideo, home } from "@/lib/pouso/data";
import { clamp, setHeroOpen, useFrame, useIntroDone } from "./client-utils";
import { ScrollHint, Wordmark } from "./ui";

/**
 * Scroll-driven hero: "role para tirar o seu café".
 *
 * A tall section with a full-screen sticky film. Scroll progress p (0 → 1) drives everything:
 *  · 0.00–0.62  the film is scrubbed by the scroll — the espresso pours as you go down and
 *               runs back up if you scroll back (the file is encoded with a keyframe every 2 frames
 *               so seeking stays smooth);
 *  · 0.56–0.66  the picture darkens a little; at 0.65 the wordmark is written, the tagline and the
 *               scroll hint come in and the header is released (via setHeroOpen);
 *  · 0.65–1.00  HOLD: the finished frame with the brand stays put for about one screen of scroll
 *               before the next section arrives.
 * With reduced motion the section is one screen tall and shows the final state.
 */
const FILM_START = 0;
const FILM_END = 0.62;
const SHOW_AT = 0.65;
const HIDE_AT = 0.58;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function Hero() {
  const intro = useIntroDone();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const st = useRef({ t: 0, shown: false });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read a media query once mounted
    setReduce(matchMedia("(prefers-reduced-motion: reduce)").matches);
    // iOS only lets a video seek after it has been "played" once; do it as soon as it can.
    // (Done here, not in onLoadedMetadata: the server-rendered <video> often loads its metadata
    // before React hydrates, so that React event never fires.)
    const v = video.current;
    if (v) {
      v.muted = true; // React doesn't serialise `muted`; muted is what lets play() run without a gesture
      const prime = () => v.play().then(() => v.pause(), () => {});
      if (v.readyState >= 1) prime();
      else v.addEventListener("loadedmetadata", prime, { once: true });
    }
    return () => setHeroOpen(false);
  }, []);

  useFrame(() => {
    const sec = section.current, v = video.current;
    if (!sec || !stage.current) return;
    const r = sec.getBoundingClientRect();
    const total = Math.max(1, r.height - window.innerHeight);
    const p = reduce ? 1 : intro ? clamp(-r.top / total) : 0;

    // 1 · scrub the film (duration read live: it is NaN until the metadata arrives)
    const s = st.current;
    const dur = v && Number.isFinite(v.duration) ? v.duration : 0;
    if (v && dur) {
      if (!v.paused && s.t > 0) v.pause();
      const target = clamp((p - FILM_START) / (FILM_END - FILM_START)) * (dur - 0.06);
      s.t += (target - s.t) * 0.22;
      if (!v.seeking && Math.abs(v.currentTime - s.t) > 0.025) v.currentTime = s.t;
    }

    // 2 · shade, intro hint, and the final reveal (with hysteresis so it doesn't flicker)
    if (shade.current) shade.current.style.opacity = (0.25 + easeOut(clamp((p - 0.56) / 0.1)) * 0.45).toFixed(3);
    if (hint.current) hint.current.style.opacity = (intro ? 1 - clamp(p / 0.07) : 0).toFixed(3);
    const show = s.shown ? p > HIDE_AT : p > SHOW_AT;
    if (show !== s.shown) {
      s.shown = show;
      setRevealed(show);
      setHeroOpen(show);
    }
  });

  return (
    <section ref={section} id="hero" className={`relative -mt-14 bg-roast text-cream ${reduce ? "h-svh" : "h-[360svh]"}`} aria-label="Pouso · cafés de origem">
      <div ref={stage} className="hero-stage sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0">
          <video
            ref={video}
            className="h-full w-full object-cover"
            poster={heroVideo.poster}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src={heroVideo.mp4} type="video/mp4" />
          </video>
        </div>
        <div ref={shade} aria-hidden="true" className="hero-vignette pointer-events-none absolute inset-0 opacity-25" />

        {/* before: an invitation to scroll */}
        <div ref={hint} className="pointer-events-none absolute inset-x-0 bottom-[12svh] flex flex-col items-center gap-3 text-cream opacity-0">
          <p className="font-display text-[clamp(1.4rem,1rem+1.4vw,2rem)] italic">Role para servir o seu café</p>
          <ScrollHint href="#manifesto" className="pointer-events-auto text-cream/70" />
        </div>

        {/* after: the brand */}
        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center pb-[10svh]">
          <svg aria-hidden="true" viewBox="0 0 60 70" className={`steam -mb-2 h-16 w-14 text-cream/70 transition-opacity duration-1000 ${revealed ? "opacity-100" : "opacity-0"}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {[18, 30, 42].map((x, i) => (
              <path key={x} pathLength={1} style={{ ["--i" as string]: i }} d={`M${x} 66 C ${x - 8} 52, ${x + 8} 42, ${x} 30 S ${x - 6} 12, ${x + 2} 2`} />
            ))}
          </svg>
          <h1 className="m-0">
            <span className="logo-write block px-6 text-cream" style={{ animationDuration: "1.4s" }} data-on={revealed ? "1" : "0"} key={revealed ? "on" : "off"}>
              <Wordmark size="hero" />
            </span>
          </h1>
          <p className={`hero-tagline label mt-10 normal-case text-cream/80 transition-[opacity,translate] duration-[700ms] ease-thread ${revealed ? "translate-y-0 opacity-100 delay-[350ms]" : "translate-y-3 opacity-0"}`}>
            {home.tagline}
          </p>
        </div>

        <div className={`absolute inset-x-0 bottom-0 z-[2] flex justify-center pb-[calc(2rem+env(safe-area-inset-bottom,0px))] transition-[opacity,translate] duration-[1100ms] ease-thread sm:pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] ${revealed ? "translate-y-0 opacity-100 delay-[700ms]" : "pointer-events-none translate-y-4 opacity-0"}`}>
          <ScrollHint href="#manifesto" />
        </div>
      </div>
    </section>
  );
}
