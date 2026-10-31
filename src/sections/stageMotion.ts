import type { Target, Variants } from "motion/react";
import { createContext } from "react";

// The ethereal fade in seconds: the last line leaves by 0.48 s and lands by 1.16 s, inside a 1.18 s step.
export const STEP_MS = 1180;
export const REDUCED_STEP_MS = 200;

export const EXIT_DURATION = 0.38;
export const EXIT_STAGGER = 0.025;
export const ENTER_DELAY = 0.36;
export const ENTER_DURATION = 0.6;
export const ENTER_STAGGER = 0.04;

// The entrance curve is --ease-condense in index.css too.
export const easeCondense = [0.22, 1, 0.36, 1] as const;
// Front-loaded, so the leaving copy is mostly gone before the planet slides under it.
export const easeFade = [0.2, 0.6, 0.35, 1] as const;
// Ease-in, so the leaving copy's drift picks up speed as it dissolves.
export const easeDrift = [0.45, 0, 0.85, 0.4] as const;

type StageMotionValue = {
  reduced: boolean;
  // Motion passes AnimatePresence's custom only to exits, so entering lines read the direction from here.
  direction: 1 | -1;
  // Until Motion's features load, sections appear without their entrance instead of waiting hidden.
  motionReady: boolean;
};

export const StageMotion = createContext<StageMotionValue>({
  reduced: false,
  direction: 1,
  motionReady: true,
});

// Reduced motion: a 200 ms cross-fade. `rest` lists the element's other animated values at rest,
// because Motion sends a value missing from new variants back to its hidden state (blurred or invisible).
export function fadeVariants(rest: Target = {}): Variants {
  return {
    hidden: { opacity: 0, ...rest },
    shown: {
      opacity: 1,
      ...rest,
      transition: { duration: 0.16, delay: 0.04, ease: "linear" },
    },
    gone: { opacity: 0, transition: { duration: 0.12, ease: "linear" } },
  };
}

export const fade = fadeVariants();
