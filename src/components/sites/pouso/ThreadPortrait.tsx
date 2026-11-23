"use client";

import { useEffect, useRef, useState } from "react";
import { clamp, useFrame } from "./client-utils";

/**
 * "Retrato em curvas de nível" — the producer's photo drawn as ONE line that snakes row by row.
 *
 * Luminance is normalised (1% percentiles) and sharpened against a 13px box blur (×3); each row then
 * rises where the photo is bright — like contour lines on a relief map — mixing the smooth (blurred)
 * and sharp signals so the face reads while the line stays calm. Rows alternate direction, so the
 * whole portrait is a single line, drawn with the scroll, a roasted bean riding its head.
 * Hovering opens a spotlight onto the photograph beneath.
 */

type Trail = { pts: Float32Array; weight: Float32Array; cum: Float32Array; length: number; n: number };

function buildTrail(rgba: Uint8ClampedArray, W: number, H: number, rows: number, step: number): Trail {
  const N = W * H;
  const o = new Float32Array(N);
  const hist = new Uint32Array(256);
  for (let i = 0; i < N; i++) {
    const v = (0.299 * rgba[i * 4] + 0.587 * rgba[i * 4 + 1] + 0.114 * rgba[i * 4 + 2]) / 255;
    o[i] = v;
    hist[Math.min(255, (v * 255) | 0)]++;
  }
  let lo = 0, hi = 255;
  for (let acc = 0; lo < 255 && (acc += hist[lo]) <= N * 0.01; lo++);
  for (let acc = 0; hi > 0 && (acc += hist[hi]) <= N * 0.01; hi--);
  const a = lo / 255, b = Math.max(hi / 255, a + 0.05);
  for (let i = 0; i < N; i++) o[i] = clamp((o[i] - a) / (b - a));
  // three passes of a 13px separable box blur → local contrast boost
  const f = new Float32Array(o), tmp = new Float32Array(N);
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < H; y++) {
      let s = 0;
      const r = y * W;
      for (let k = -6; k <= 6; k++) s += f[r + Math.min(W - 1, Math.max(0, k))];
      for (let x = 0; x < W; x++) {
        tmp[r + x] = s / 13;
        s += f[r + Math.min(W - 1, x + 7)] - f[r + Math.max(0, x - 6)];
      }
    }
    for (let x = 0; x < W; x++) {
      let s = 0;
      for (let k = -6; k <= 6; k++) s += tmp[Math.min(H - 1, Math.max(0, k)) * W + x];
      for (let y = 0; y < H; y++) {
        f[y * W + x] = s / 13;
        s += tmp[Math.min(H - 1, y + 7) * W + x] - tmp[Math.max(0, y - 6) * W + x];
      }
    }
  }
  for (let i = 0; i < N; i++) o[i] = clamp(o[i] + 1.4 * (o[i] - f[i]));
  const lum = (x: number, y: number) => o[Math.min(H - 1, Math.max(0, y | 0)) * W + Math.min(W - 1, Math.max(0, x | 0))];

  const rowH = H / rows;
  const per = Math.ceil(W / step) + 1;
  const total = rows * per;
  const pts = new Float32Array(total * 2), weight = new Float32Array(total), cum = new Float32Array(total);
  let n = 0, length = 0, px = 0, py = 0;
  for (let row = 0; row < rows; row++) {
    const cy = (row + 0.5) * rowH;
    const ltr = row % 2 === 0;
    for (let j = 0; j < per; j++) {
      const x = Math.min(W, (ltr ? j : per - 1 - j) * step);
      const s = lum(x, cy) ** 1.4;
      const smooth = f[Math.min(H - 1, cy | 0) * W + Math.min(W - 1, x | 0)];
      // contour: the line is lifted by brightness (mostly the smooth relief, a little of the detail)
      const y = cy - rowH * 2.1 * (0.65 * smooth + 0.35 * s);
      if (n > 0) length += Math.hypot(x - px, y - py);
      pts[n * 2] = x;
      pts[n * 2 + 1] = y;
      cum[n] = length;
      weight[n] = s;
      px = x;
      py = y;
      n++;
    }
  }
  return { pts, weight, cum, length, n };
}

const SAMPLE_W = 420;
const ROWS = 72;
const ASPECT = 1.25; // the photograph is 4:5

export function ThreadPortrait({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [trail, setTrail] = useState<{ t: Trail; W: number; H: number; img: HTMLImageElement } | null>(null);
  const st = useRef({ p: 0, mx: -1, my: -1, spot: 0, spotT: 0, lastKey: "" });
  const [touchOpen, setTouchOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      const W = SAMPLE_W, H = Math.round(SAMPLE_W * ASPECT);
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const ctx = c.getContext("2d", { willReadFrequently: true })!;
      // object-fit: cover
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      const data = ctx.getImageData(0, 0, W, H).data;
      setTrail({ t: buildTrail(data, W, H, ROWS, 2), W, H, img });
    };
  }, [src]);

  useFrame(() => {
    const el = wrap.current, cv = canvas.current;
    if (!el || !cv || !trail) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const s = st.current;
    const target = clamp((vh * 0.92 - r.top) / (r.height + vh * 0.35));
    s.p += (target - s.p) * 0.08;
    if (s.p > 0.985 !== done) setDone(s.p > 0.985);
    s.spot += ((s.mx >= 0 || touchOpen ? 1 : 0) - s.spot) * 0.12;
    const key = `${s.p.toFixed(4)}|${s.spot.toFixed(3)}|${s.mx | 0}|${s.my | 0}|${r.width | 0}|${touchOpen}`;
    if (key === s.lastKey) return;
    s.lastKey = key;
    draw(cv, r.width, r.height, trail, s.p, s.mx, s.my, s.spot, touchOpen);
  });

  return (
    <figure className="relative">
      <div className="relative">
        <span aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 border border-cream/25" />
        <div
          ref={wrap}
          className="relative aspect-[4/5] w-full touch-manipulation"
          role="img"
          aria-label={alt}
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            st.current.mx = e.clientX - r.left;
            st.current.my = e.clientY - r.top;
          }}
          onPointerLeave={() => {
            st.current.mx = -1;
            st.current.my = -1;
          }}
          onClick={(e) => {
            if ((e.nativeEvent as PointerEvent).pointerType !== "mouse") setTouchOpen((v) => !v);
          }}
        >
          <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
        </div>
      </div>
      <figcaption className="mt-5 label leading-[1.6] text-cream/45">
        {done && trail ? `Uma linha só · ${ROWS} curvas de nível` : caption}
        <br />
        <span className="hidden sm:inline">Passe o mouse para ver a foto</span>
        <span className="sm:hidden">Toque para ver a foto</span>
      </figcaption>
    </figure>
  );
}

function draw(
  cv: HTMLCanvasElement,
  w: number,
  h: number,
  { t, W, H, img }: { t: Trail; W: number; H: number; img: HTMLImageElement },
  p: number,
  mx: number,
  my: number,
  spot: number,
  full: boolean,
) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  if (cv.width !== Math.round(w * dpr)) {
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
  }
  const ctx = cv.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const sx = w / W, sy = h / H;
  const R = Math.max(110, w * 0.3);

  // the photograph, inside the spotlight (or entirely, on touch)
  if (spot > 0.01) {
    ctx.save();
    ctx.globalAlpha = spot;
    if (!full && mx >= 0) {
      ctx.beginPath();
      ctx.arc(mx, my, R, 0, Math.PI * 2);
      ctx.clip();
    }
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    if (!full && mx >= 0) {
      const g = ctx.createRadialGradient(mx, my, R * 0.45, mx, my, R);
      g.addColorStop(0, "rgba(54,14,39,0)");
      g.addColorStop(1, "rgba(54,14,39,1)");
      ctx.fillStyle = g;
      ctx.fillRect(mx - R, my - R, R * 2, R * 2);
    }
    ctx.restore();
  }

  // the thread, bucketed by width so a few strokes draw thousands of segments
  const until = t.length * p;
  const base = Math.max(1, (h / ROWS) * 0.22);
  const buckets: Path2D[] = Array.from({ length: 6 }, () => new Path2D());
  let headX = 0, headY = 0;
  for (let i = 1; i < t.n; i++) {
    if (t.cum[i] > until) {
      const k = (until - t.cum[i - 1]) / Math.max(1e-6, t.cum[i] - t.cum[i - 1]);
      headX = (t.pts[(i - 1) * 2] + (t.pts[i * 2] - t.pts[(i - 1) * 2]) * k) * sx;
      headY = (t.pts[(i - 1) * 2 + 1] + (t.pts[i * 2 + 1] - t.pts[(i - 1) * 2 + 1]) * k) * sy;
      const b = buckets[Math.min(5, (t.weight[i] * 6) | 0)];
      b.moveTo(t.pts[(i - 1) * 2] * sx, t.pts[(i - 1) * 2 + 1] * sy);
      b.lineTo(headX, headY);
      break;
    }
    const b = buckets[Math.min(5, (t.weight[i] * 6) | 0)];
    b.moveTo(t.pts[(i - 1) * 2] * sx, t.pts[(i - 1) * 2 + 1] * sy);
    b.lineTo(t.pts[i * 2] * sx, t.pts[i * 2 + 1] * sy);
    headX = t.pts[i * 2] * sx;
    headY = t.pts[i * 2 + 1] * sy;
  }
  ctx.save();
  if (spot > 0.01 && (full || mx >= 0)) {
    // the thread gives way under the pointer: fade it where the photo shows
    ctx.globalAlpha = full ? 1 - spot * 0.92 : 1;
  }
  ctx.lineCap = "round";
  buckets.forEach((path, i) => {
    const wgt = (i + 0.5) / 6;
    ctx.lineWidth = base * (0.38 + 1.05 * wgt);
    ctx.strokeStyle = `rgba(${Math.round(196 + 48 * wgt)},${Math.round(170 + 65 * wgt)},${Math.round(140 + 81 * wgt)},${0.45 + 0.55 * wgt})`;
    ctx.stroke(path);
  });
  if (!full && spot > 0.01 && mx >= 0) {
    ctx.globalCompositeOperation = "destination-out";
    const g = ctx.createRadialGradient(mx, my, 0, mx, my, R * 0.85);
    g.addColorStop(0, `rgba(0,0,0,${0.92 * spot})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(mx - R, my - R, R * 2, R * 2);
  }
  ctx.restore();

  // a roasted bean at the head of the line, until the portrait is finished
  if (p > 0.002 && p < 0.995) {
    const r = Math.max(12, w * 0.036);
    ctx.save();
    ctx.translate(headX, headY);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(r * 0.2, r * 0.95, r * 0.9, r * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.rotate(-0.5 + p * 40);
    const g = ctx.createRadialGradient(-r * 0.3, -r * 0.4, r * 0.1, 0, 0, r);
    g.addColorStop(0, "#9a6440");
    g.addColorStop(0.6, "#4a2a17");
    g.addColorStop(1, "#1c0f08");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.7, r * 0.95, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#120804";
    ctx.lineWidth = r * 0.11;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.92);
    ctx.bezierCurveTo(-r * 0.36, -r * 0.2, r * 0.36, r * 0.2, 0, r * 0.92);
    ctx.stroke();
    ctx.restore();
  }
}
