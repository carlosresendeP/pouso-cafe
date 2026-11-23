"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * The splash (pure CSS, in the root layout) owns the first ~5s of a first visit. Components that
 * play an entrance wait for it: the head script dispatches `pouso:intro` when the curtain opens.
 */
const subscribeIntro = (cb: () => void) => {
  window.addEventListener("pouso:intro", cb);
  return () => window.removeEventListener("pouso:intro", cb);
};
export function useIntroDone() {
  return useSyncExternalStore(
    subscribeIntro,
    () => !document.documentElement.classList.contains("splash-active"),
    () => false,
  );
}

/** True once the element has entered the viewport (one-shot). */
export function useInView<T extends Element>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView] as const;
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Runs `cb` on every animation frame while mounted — used by scroll-linked drawings. */
export function useFrame(cb: () => void) {
  const ref = useRef(cb);
  useEffect(() => {
    ref.current = cb;
  });
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      ref.current();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
}

/**
 * Home hero → header handshake. The scroll-driven hero reports when its reveal has finished; the
 * header stays hidden on the home until then (and hides again if you scroll back into the reveal).
 */
let heroOpen = false;
const heroSubs = new Set<() => void>();
export function setHeroOpen(v: boolean) {
  if (v === heroOpen) return;
  heroOpen = v;
  heroSubs.forEach((f) => f());
}
export function useHeroOpen() {
  return useSyncExternalStore(
    (cb) => {
      heroSubs.add(cb);
      return () => heroSubs.delete(cb);
    },
    () => heroOpen,
    () => false,
  );
}
