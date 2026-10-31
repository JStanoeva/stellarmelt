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
  fadeVariants,
  StageMotion,
} from "../stageMotion";

type Props = {
  order: number;
  // After the first move the lines swap faster than the stage's own cascade, so a move lands inside 0.9 s.
  swap: boolean;
  // The event direction, which a swap drifts along (the section's own entrance follows the stage).
  direction: 1 | -1;
  blur?: boolean;
  className?: string;
  children: ReactNode;
};

function condense(order: number, swap: boolean, blur: boolean): Variants {
  const haze = (px: number) => (blur ? { filter: `blur(${px}px)` } : {});
  const exit = { duration: swap ? 0.26 : EXIT_DURATION, delay: order * EXIT_STAGGER };
  return {
    hidden: (way: number) => ({ opacity: 0, y: 26 * way, ...haze(8) }),
    shown: {
      opacity: 1,
      y: 0,
      ...haze(0),
      transition: {
        duration: swap ? 0.5 : ENTER_DURATION,
        delay: (swap ? 0.14 : ENTER_DELAY) + order * ENTER_STAGGER,
        ease: easeCondense,
      },
      transitionEnd: blur ? { filter: "none" } : {},
    },
    gone: (way: number) => ({
      opacity: 0,
      y: -22 * way,
      ...haze(6),
      transition: { ...exit, ease: easeFade, y: { ...exit, ease: easeDrift } },
    }),
  };
}

// One line of an event's copy, the site's Dissolve with a quicker swap between events.
export default function CopyLine({ order, swap, direction, blur = false, className, children }: Props) {
  const { reduced, direction: stageDirection } = use(StageMotion);
  return (
    <m.div
      data-dust
      custom={swap ? direction : stageDirection}
      variants={reduced ? fadeVariants({ y: 0, ...(blur ? { filter: "none" } : {}) }) : condense(order, swap, blur)}
      className={className}
    >
      {children}
    </m.div>
  );
}
