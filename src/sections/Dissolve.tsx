import { m, type Variants } from "motion/react";
import { use, type ReactNode } from "react";
import {
  ENTER_DELAY,
  ENTER_DURATION,
  ENTER_STAGGER,
  EXIT_DURATION,
  EXIT_STAGGER,
  easeCondense,
  easeDrift,
  easeFade,
  fade,
  StageMotion,
} from "./stageMotion";

type Props = {
  // Position in the cascade (0 first): later lines leave and land a beat after earlier ones.
  order: number;
  // Letter-spacing in em.
  tracking?: number;
  // Single-line labels and headings also condense from wider tracking; wrapping text would re-wrap, so it doesn't.
  loosen?: boolean;
  // Headings also sharpen out of a blur (each blurred line costs the GPU a render pass, so only they do).
  blur?: boolean;
  className?: string;
  children: ReactNode;
};

function condense(
  order: number,
  tracking: number,
  loosen: boolean,
  blur: boolean,
): Variants {
  const spacing = (extra: number) =>
    loosen ? { letterSpacing: `${tracking + extra}em` } : {};
  const haze = (px: number) => (blur ? { filter: `blur(${px}px)` } : {});
  const exit = { duration: EXIT_DURATION, delay: order * EXIT_STAGGER };
  return {
    hidden: (direction: number) => ({
      opacity: 0,
      y: 34 * direction,
      ...haze(10),
      ...spacing(0.16),
    }),
    shown: {
      opacity: 1,
      y: 0,
      ...haze(0),
      ...spacing(0),
      transition: {
        duration: ENTER_DURATION,
        delay: ENTER_DELAY + order * ENTER_STAGGER,
        ease: easeCondense,
      },
      transitionEnd: blur ? { filter: "none" } : {},
    },
    gone: (direction: number) => ({
      opacity: 0,
      y: -28 * direction,
      ...haze(8),
      ...spacing(0.08),
      transition: { ...exit, ease: easeFade, y: { ...exit, ease: easeDrift } },
    }),
  };
}

// One line of a section's copy: it drifts off into stardust, then condenses out of the haze.
export default function Dissolve({
  order,
  tracking = 0,
  loosen = false,
  blur = false,
  className,
  children,
}: Props) {
  const { reduced, direction } = use(StageMotion);
  return (
    <m.div
      data-dust
      custom={direction}
      variants={reduced ? fade : condense(order, tracking, loosen, blur)}
      style={{ letterSpacing: `${tracking}em` }}
      className={className}
    >
      {children}
    </m.div>
  );
}
