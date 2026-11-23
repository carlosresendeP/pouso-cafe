/** A tiny roasted bean in the lot's roast colour — the colour key on tags, cart and product page. */
export function RoastSwatch({ hex, size = 20, label }: { hex: string; size?: number; label?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <g transform="rotate(-28 10 10)">
        <ellipse cx="10" cy="10" rx="6.6" ry="8.8" fill={hex} />
        <ellipse cx="10" cy="10" rx="6.6" ry="8.8" fill="url(#roast-sheen)" />
        <path d="M10 1.6 C 6.8 8, 13.2 12, 10 18.4" fill="none" stroke="#120804" strokeOpacity="0.75" strokeWidth="1.1" strokeLinecap="round" />
      </g>
      <defs>
        <radialGradient id="roast-sheen" cx="35%" cy="28%" r="80%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
      </defs>
    </svg>
  );
}
