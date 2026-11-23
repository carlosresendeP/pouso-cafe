import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** The bean mark (same shape as /sites/pouso/brand/bean.svg), drawn in currentColor. */
export function BeanMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className} fill="currentColor">
      <g transform="rotate(-28 50 50)">
        <path d="M47 4C26 4 16 26 16 50s10 46 31 46C67 60 27 40 47 4Z" />
        <path d="M53 4C33 40 73 60 53 96c21 0 31-22 31-46S74 4 53 4Z" />
      </g>
    </svg>
  );
}

/** Wordmark: "Pouso" in Fraunces with the bean and the descriptor. Sizes: header | footer | hero. */
export function Wordmark({ size = "header" }: { size?: "header" | "footer" | "hero" }) {
  if (size === "hero")
    return (
      <span className="flex flex-col items-center">
        <span className="font-display text-[clamp(5rem,3rem+10vw,11rem)] font-medium italic leading-[0.85] tracking-[-0.04em] [font-variation-settings:'SOFT'_100,'WONK'_1,'opsz'_144]">
          Pouso
        </span>
        <span className="label mt-4 text-[0.7rem] tracking-[0.5em] text-cream/80">Cafés de origem</span>
      </span>
    );
  const big = size === "footer";
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Pouso · cafés de origem">
      <BeanMark className={big ? "h-12 w-12" : "h-7 w-7"} />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-medium italic tracking-[-0.03em] [font-variation-settings:'SOFT'_100,'WONK'_1] ${big ? "text-[3.4rem]" : "text-[1.55rem]"}`}>
          Pouso
        </span>
        <span className={`label ${big ? "mt-2 text-[0.62rem]" : "mt-0.5 text-[0.5rem]"} tracking-[0.36em] opacity-70`}>cafés de origem</span>
      </span>
    </span>
  );
}

/** The wavy dashed "stitching" rule under every eyebrow label. */
export function Stitching({ className = "", color = "#9E4424" }: { className?: string; color?: string }) {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const x = (i / 40) * 100;
    const y = 4 + Math.sin((i / 40) * Math.PI * 2 - Math.PI / 2) * -1.2;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  const d = pts.join("");
  return (
    <svg aria-hidden="true" className={`block h-[8px] w-full overflow-visible ${className}`} viewBox="0 0 100 8" preserveAspectRatio="none">
      <path d={d} fill="none" stroke="rgba(35,26,21,0.14)" strokeWidth="1.7" strokeDasharray="7 5" strokeLinecap="round" transform="translate(0.6 1.3)" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.7" strokeDasharray="7 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Eyebrow({ children, tone = "text-leaf", rule }: { children: ReactNode; tone?: string; rule?: string }) {
  return (
    <div className="relative inline-block pb-[24px]">
      <p className={`label ${tone}`}>{children}</p>
      <span className="absolute inset-x-0 bottom-0">
        <Stitching color={rule} />
      </span>
    </div>
  );
}

const btnBase =
  "group relative inline-flex items-center justify-center gap-3 rounded-piece label transition-colors duration-300 ease-thread select-none disabled:cursor-not-allowed disabled:opacity-50";
const btnVariants = {
  solid: "min-h-12 px-6 bg-terra text-cream hover:bg-roast active:bg-roast",
  outlineLight: "min-h-12 px-6 border border-cream/40 text-cream hover:border-cream hover:bg-cream/5",
};

function StitchRect() {
  return (
    <svg aria-hidden="true" className="stitching pointer-events-none absolute inset-[5px] h-[calc(100%-10px)] w-[calc(100%-10px)] overflow-visible opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
      <rect x="0.75" y="0.75" width="100%" height="100%" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="7 5" />
    </svg>
  );
}

export function ButtonLink({
  variant = "solid",
  className = "",
  children,
  ...rest
}: ComponentProps<typeof Link> & { variant?: keyof typeof btnVariants }) {
  return (
    <Link {...rest} className={`${btnBase} ${btnVariants[variant]} ${className}`}>
      {children}
      <StitchRect />
    </Link>
  );
}

export function Button({
  variant = "solid",
  className = "",
  children,
  ...rest
}: ComponentProps<"button"> & { variant?: keyof typeof btnVariants }) {
  return (
    <button type="button" {...rest} className={`${btnBase} ${btnVariants[variant]} ${className}`}>
      {children}
      <StitchRect />
    </button>
  );
}

/** "Deslize": coffee drops falling one after another, pointing to the next section. */
export function ScrollHint({ href, className = "text-cream/70 hover:text-cream" }: { href: string; className?: string }) {
  return (
    <a href={href} className={`scroll-hint group flex flex-col items-center gap-2.5 label transition-colors duration-500 ${className}`}>
      <span>Deslize</span>
      <svg className="block overflow-visible" width="16" height="52" viewBox="0 0 16 52" fill="currentColor" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <path key={i} className="scroll-drop" style={{ ["--i" as string]: i }} d="M8 4 C 8 4, 3 11, 3 14 a5 5 0 0 0 10 0 C 13 11, 8 4, 8 4 Z" />
        ))}
      </svg>
    </a>
  );
}
