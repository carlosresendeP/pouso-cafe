"use client";

import { BeanTrail, type PathFn } from "./BeanTrail";

/**
 * Home: the bean trail enters from the left edge at the manifesto, runs down the margin and turns right
 * just above the collection heading, beans appearing one by one as you scroll.
 */
const homePath: PathFn = ({ w, h }, a) => {
  const head = a.colhead;
  const yH = (head ? head.y : h - 140) - 46;
  if (w < 768) {
    // mobile: hug the very edge so the bean never sits on the text
    return `M -14 -40 C 4 40, -2 160, 2 260 L 2 ${yH - 160} C 2 ${yH - 60}, 24 ${yH}, 90 ${yH}`;
  }
  const xEnd = (head ? head.x : 180) + 760;
  return [
    `M -24 30`,
    `C 60 18, 120 14, 132 58`,
    `C 146 112, 70 190, 62 300`,
    `C 52 430, 120 ${yH - 260}, 118 ${yH - 90}`,
    `C 116 ${yH - 24}, 170 ${yH + 2}, 280 ${yH}`,
    `L ${xEnd} ${yH - 4}`,
  ].join(" ");
};

export function HomeThread() {
  return <BeanTrail path={homePath} start={40} speed={1.75} spacing={30} size={22} />;
}

/** Roastery: hangs from the top-left, runs down the margin past the process and turns right under the quote. */
const roasteryPath: PathFn = ({ w, h }, a) => {
  const end = a.threadEnd;
  const yE = end ? end.y : h - 80;
  const x = w < 768 ? 4 : Math.max(22, (end?.x ?? 180) - 150);
  const xEnd = w < 768 ? w * 0.7 : (end?.x ?? 180) + 1000;
  return [
    `M ${x - 34} -30`,
    `C ${x - 10} 40, ${x + 6} 110, ${x + 4} 220`,
    `L ${x} ${yE - 160}`,
    `C ${x - 2} ${yE - 40}, ${x + 30} ${yE}, ${x + 140} ${yE}`,
    `L ${xEnd} ${yE - 2}`,
  ].join(" ");
};

export function RoasteryThread() {
  return <BeanTrail path={roasteryPath} start={60} speed={1.35} spacing={30} size={22} />;
}
