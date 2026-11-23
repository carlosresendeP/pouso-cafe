"use client";

import { useIntroDone } from "./client-utils";
import { Bean } from "./BeanTrail";

/**
 * A cup of coffee seen from above, drawn ring by ring on arrival: saucer, rim, the dark coffee, a
 * slowly turning crema spiral, the handle — and roasted beans scattered on the saucer.
 */
const TAU = Math.PI * 2;

function spiral(turns: number, r0: number, r1: number) {
  let d = "";
  const steps = 220;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * turns * TAU;
    const r = r0 + (r1 - r0) * t;
    d += `${i ? "L" : "M"}${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)} `;
  }
  return d;
}

const circle = (r: number) => `M${r} 0 A${r} ${r} 0 1 1 ${-r} 0 A${r} ${r} 0 1 1 ${r} 0`;

const BEANS: [number, number, number][] = [
  [-150, 118, 20],
  [-118, 150, -40],
  [158, -96, 70],
  [134, 138, 10],
  [-170, -60, -10],
];

export function CupRings() {
  const go = useIntroDone();
  const cls = go ? "" : "opacity-0";
  return (
    <svg viewBox="-230 -220 460 440" className="h-auto w-full overflow-visible" role="img" aria-label="Uma xícara de café vista de cima, com grãos no pires">
      <defs>
        <radialGradient id="coffee" cx="45%" cy="40%" r="65%">
          <stop offset="0" stopColor="#5a3420" />
          <stop offset="0.7" stopColor="#2b1a12" />
          <stop offset="1" stopColor="#140b07" />
        </radialGradient>
        <filter id="cup-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="6" dy="10" stdDeviation="8" floodColor="#000" floodOpacity="0.45" />
        </filter>
        <radialGradient id="bgfx" cx="36%" cy="30%" r="75%">
          <stop offset="0" stopColor="#8a5634" />
          <stop offset="0.55" stopColor="#4a2a17" />
          <stop offset="1" stopColor="#1c0f08" />
        </radialGradient>
        <radialGradient id="bsfx" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#231a15" stopOpacity="0.34" />
          <stop offset="1" stopColor="#231a15" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* saucer */}
      <g className={`cup-ring ${cls}`} style={{ ["--i" as string]: 0 }} filter="url(#cup-shadow)">
        <circle r="196" className="cup-fill" fill="#efe6d6" style={{ ["--i" as string]: 0 }} />
        <path d={circle(196)} pathLength={1} fill="none" stroke="#c9bba3" strokeWidth="3" />
        <path d={circle(150)} pathLength={1} fill="none" stroke="#d8ccb6" strokeWidth="2" style={{ ["--i" as string]: 1 }} />
      </g>
      {/* handle */}
      <g className={`cup-ring ${cls}`} style={{ ["--i" as string]: 2 }}>
        <path d="M118 -24 C 168 -30, 172 30, 118 24" pathLength={1} fill="none" stroke="#f7f1e6" strokeWidth="18" strokeLinecap="round" />
        <path d="M118 -24 C 168 -30, 172 30, 118 24" pathLength={1} fill="none" stroke="#d8ccb6" strokeWidth="2" />
      </g>
      {/* cup rim */}
      <g className={`cup-ring ${cls}`} style={{ ["--i" as string]: 2 }}>
        <circle r="124" className="cup-fill" fill="#f7f1e6" style={{ ["--i" as string]: 2 }} />
        <path d={circle(124)} pathLength={1} fill="none" stroke="#cdbfa6" strokeWidth="2.5" />
      </g>
      {/* coffee + crema */}
      <g className={`cup-ring ${cls}`} style={{ ["--i" as string]: 4 }}>
        <circle r="104" className="cup-fill" fill="url(#coffee)" style={{ ["--i" as string]: 4 }} />
        <path d={circle(104)} pathLength={1} fill="none" stroke="#b9804f" strokeWidth="5" strokeOpacity="0.85" />
        <g className="crema-spin">
          <path d={spiral(4.2, 6, 96)} pathLength={1} fill="none" stroke="#c48a57" strokeOpacity="0.55" strokeWidth="2.2" strokeLinecap="round" style={{ ["--i" as string]: 5 }} />
        </g>
        <ellipse cx="-38" cy="-46" rx="30" ry="12" transform="rotate(-35 -38 -46)" fill="#fff" opacity="0.08" />
      </g>
      {/* beans on the saucer */}
      {BEANS.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`} className={go ? "fade-late" : "opacity-0"} style={{ animationDelay: `${1.6 + i * 0.12}s` }}>
          <Bean id="fx" size={30} />
        </g>
      ))}
    </svg>
  );
}
