"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { clamp, useFrame } from "./client-utils";

/**
 * A trail of roasted coffee beans laid along a path computed from its container (and named anchors
 * inside it). As you scroll, the beans appear one after another — as if spilled along the way — each
 * dropping in with a small bounce and its own angle.
 */

export type Rect = { x: number; y: number; w: number; h: number };
export type PathFn = (box: { w: number; h: number }, anchors: Record<string, Rect>) => string | null;

type Props = {
  path: PathFn;
  /** progress = (0.6·vh − top − start) / (length / speed) */
  start?: number;
  speed?: number;
  /** distance between beans, in px */
  spacing?: number;
  size?: number;
  className?: string;
};

type Seed = { x: number; y: number; rot: number; s: number; at: number };

function measureAnchors(root: HTMLElement) {
  const base = root.getBoundingClientRect();
  const out: Record<string, Rect> = {};
  root.querySelectorAll<HTMLElement>("[data-yarn-anchor]").forEach((el) => {
    const r = el.getBoundingClientRect();
    out[el.dataset.yarnAnchor!] = { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height };
  });
  return out;
}

// deterministic jitter, so server and client agree and beans don't reshuffle on resize
const rand = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export function BeanTrail({ path, start = 0, speed = 1.6, spacing = 30, size = 22, className = "" }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const measureRef = useRef<SVGPathElement>(null);
  const beanRefs = useRef<(SVGGElement | null)[]>([]);
  const [geo, setGeo] = useState<{ w: number; h: number; d: string } | null>(null);
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const state = useRef({ p: 0, L: 1, shown: -1 });
  const pathFn = useRef(path);
  useLayoutEffect(() => {
    pathFn.current = path;
  });

  useEffect(() => {
    const host = svgRef.current?.parentElement;
    if (!host) return;
    const compute = () => {
      const r = host.getBoundingClientRect();
      const d = pathFn.current({ w: r.width, h: r.height }, measureAnchors(host));
      setGeo(d ? { w: r.width, h: r.height, d } : null);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(host);
    document.fonts?.ready.then(compute);
    return () => ro.disconnect();
  }, []);

  // lay the beans along the path: alternate sides a little, each with its own angle and size
  useEffect(() => {
    const p = measureRef.current;
    if (!p || !geo) return;
    const L = p.getTotalLength();
    state.current.L = L;
    state.current.shown = -1;
    const out: Seed[] = [];
    for (let i = 0, at = spacing * 0.5; at < L; i++, at += spacing * (0.8 + rand(i) * 0.45)) {
      const a = p.getPointAtLength(at);
      const b = p.getPointAtLength(Math.min(L, at + 1));
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      const off = (rand(i + 7) - 0.5) * size * 0.9;
      out.push({
        x: a.x - Math.sin(ang) * off,
        y: a.y + Math.cos(ang) * off,
        rot: (ang * 180) / Math.PI + 90 + (rand(i + 3) - 0.5) * 70,
        s: 0.82 + rand(i + 11) * 0.36,
        at,
      });
    }
    setSeeds(out);
  }, [geo, spacing, size]);

  useFrame(() => {
    const svg = svgRef.current;
    if (!svg || !seeds.length) return;
    const s = state.current;
    const top = svg.getBoundingClientRect().top;
    const target = clamp((window.innerHeight * 0.6 - top - start) / (s.L / speed));
    s.p += (target - s.p) * 0.12;
    const len = s.L * s.p;
    let shown = -1;
    for (let i = 0; i < seeds.length && seeds[i].at <= len; i++) shown = i;
    if (shown === s.shown) return;
    s.shown = shown;
    beanRefs.current.forEach((el, i) => el?.setAttribute("data-on", i <= shown ? "1" : "0"));
  });

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible ${className}`}
      viewBox={geo ? `0 0 ${geo.w} ${geo.h}` : undefined}
    >
      {geo && (
        <>
          <defs>
            <BeanDefs id="trail" />
          </defs>
          <path ref={measureRef} d={geo.d} fill="none" stroke="none" />
          {seeds.map((b, i) => (
            <g key={i} transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`}>
              <g ref={(el) => void (beanRefs.current[i] = el)} className="trail-bean" data-on="0">
                <g transform={`rotate(${b.rot.toFixed(1)}) scale(${b.s.toFixed(2)})`}>
                  <Bean id="trail" size={size} />
                </g>
              </g>
            </g>
          ))}
        </>
      )}
    </svg>
  );
}

export function BeanDefs({ id }: { id: string }) {
  return (
    <>
      <radialGradient id={`bg${id}`} cx="36%" cy="30%" r="75%">
        <stop offset="0" stopColor="#8a5634" />
        <stop offset="0.55" stopColor="#4a2a17" />
        <stop offset="1" stopColor="#1c0f08" />
      </radialGradient>
      <radialGradient id={`bs${id}`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#231a15" stopOpacity="0.34" />
        <stop offset="1" stopColor="#231a15" stopOpacity="0" />
      </radialGradient>
    </>
  );
}

/** A roasted coffee bean: glossy oval with its S-shaped centre crease. Drawn around (0,0). */
export function Bean({ id, size }: { id: string; size: number }) {
  const r = size / 2;
  return (
    <g>
      <ellipse cx={r * 0.2} cy={r * 0.95} rx={r * 0.95} ry={r * 0.32} fill={`url(#bs${id})`} />
      <g transform={`scale(${r}) rotate(-28)`}>
        <ellipse rx="0.7" ry="0.95" fill={`url(#bg${id})`} />
        <path d="M0 -0.93 C -0.36 -0.2, 0.36 0.2, 0 0.93" fill="none" stroke="#120804" strokeWidth="0.11" strokeLinecap="round" />
        <path d="M0.05 -0.85 C -0.28 -0.2, 0.42 0.18, 0.08 0.85" fill="none" stroke="#a8724a" strokeOpacity="0.45" strokeWidth="0.04" />
        <ellipse cx="-0.3" cy="-0.42" rx="0.16" ry="0.28" fill="#fff" opacity="0.18" />
      </g>
    </g>
  );
}
