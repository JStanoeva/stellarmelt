import { m, type Variants } from "motion/react";
import { use, type CSSProperties } from "react";
import {
  ENTER_DELAY,
  easeCondense,
  fadeVariants,
  StageMotion,
} from "../stageMotion";
import { segments, starPoint, trimmed, type Frame } from "./sky";

type Props = {
  frame: Frame;
  // A track number whose two lines brighten (the selected or playing star).
  highlight?: number;
  // On the home stage the lines draw in and out with the section's cascade; on pages they draw once on mount.
  staged?: boolean;
};

// How far each line stops short of its stars, in px.
const GAP = 10;

function drawn(order: number, dotted: boolean): Variants {
  const full = dotted ? {} : { pathLength: 1 };
  return {
    hidden: { opacity: 0, ...(dotted ? {} : { pathLength: 0 }) },
    shown: {
      opacity: 1,
      ...full,
      transition: {
        delay: ENTER_DELAY + 0.12 + order * 0.04,
        duration: 0.42,
        ease: easeCondense,
      },
    },
    gone: {
      opacity: 0,
      ...full,
      transition: { duration: 0.28, delay: order * 0.008 },
    },
  };
}

// Solid within an act, dotted across an act's end (like the site's orbits), nothing between the two sides.
export default function ConstellationLines({
  frame,
  highlight,
  staged = false,
}: Props) {
  const { reduced } = use(StageMotion);
  return (
    <svg
      aria-hidden="true"
      width={frame.width}
      height={frame.height}
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      className="pointer-events-none absolute inset-0 overflow-visible"
    >
      {segments.map((segment, order) => {
        const line = trimmed(
          starPoint(segment.from, frame),
          starPoint(segment.to, frame),
          GAP,
        );
        const lit = segment.from.n === highlight || segment.to.n === highlight;
        const tone = segment.dotted
          ? `stroke-[1.6] ${lit ? "stroke-rose-200" : "stroke-mauve-300/70"}`
          : `stroke-1 ${lit ? "stroke-rose-200" : "stroke-mauve-200/45"}`;
        const dash = segment.dotted
          ? { strokeDasharray: "0 6", strokeLinecap: "round" as const }
          : {};
        if (staged) {
          return (
            <m.line
              key={segment.id}
              {...line}
              {...dash}
              variants={
                reduced
                  ? fadeVariants(segment.dotted ? {} : { pathLength: 1 })
                  : drawn(order, segment.dotted)
              }
              className={`fill-none transition-[stroke] duration-500 ${tone}`}
            />
          );
        }
        return (
          <line
            key={segment.id}
            {...line}
            {...dash}
            pathLength={segment.dotted ? undefined : 1}
            style={{ "--order": order } as CSSProperties}
            className={`fill-none transition-[stroke] duration-500 ${segment.dotted ? "sky-fade" : "sky-draw"} ${tone}`}
          />
        );
      })}
    </svg>
  );
}
