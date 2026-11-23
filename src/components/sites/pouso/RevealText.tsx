"use client";

import { useInView } from "./client-utils";

/** Each line rises from behind its own mask when the heading scrolls into view. */
export function RevealText({ lines, delayStep = 110 }: { lines: string[]; delayStep?: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} className="block">
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
          <span className="reveal-line block" data-in={inView ? "1" : "0"} style={{ transitionDelay: `${i * delayStep}ms` }}>
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
