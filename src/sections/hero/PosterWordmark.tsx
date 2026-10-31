import { m, type Variants } from "motion/react";
import { use } from "react";
import {
  ENTER_DELAY,
  easeCondense,
  easeDrift,
  easeFade,
  fadeVariants,
  StageMotion,
} from "../stageMotion";

const tracking = "-0.035em";

// Each line drifts, sharpens from a blur and tightens its tracking (one filter layer per line, not per letter).
function lineVariants(line: number): Variants {
  const exit = { duration: 0.42 };
  return {
    hidden: (direction: number) => ({
      y: 44 * direction,
      letterSpacing: "0.07em",
      filter: "blur(10px)",
    }),
    shown: {
      opacity: 1,
      y: 0,
      letterSpacing: tracking,
      filter: "blur(0px)",
      transition: {
        duration: 0.75,
        delay: ENTER_DELAY + line * 0.05,
        ease: easeCondense,
      },
      transitionEnd: { filter: "none" },
    },
    gone: (direction: number) => ({
      y: -32 * direction,
      letterSpacing: "0.03em",
      filter: "blur(8px)",
      transition: { ...exit, ease: easeFade, y: { ...exit, ease: easeDrift } },
    }),
  };
}

// Inside a line, the letters light up one after another, so the word condenses rather than fades in.
function letterVariants(line: number, letter: number): Variants {
  return {
    hidden: { opacity: 0 },
    shown: {
      opacity: 1,
      transition: {
        duration: 0.45,
        delay: ENTER_DELAY + line * 0.05 + letter * 0.024,
        ease: easeCondense,
      },
    },
    gone: {
      opacity: 0,
      transition: { duration: 0.3, delay: letter * 0.014, ease: easeFade },
    },
  };
}

// Under reduced motion the letters hold still and the line just fades.
const lit = { opacity: 1 };
const still: Variants = { hidden: lit, shown: lit, gone: lit };
const lineFade = fadeVariants({
  y: 0,
  letterSpacing: tracking,
  filter: "none",
});

// The poster's stacked STELLAR / MELT: the h1's visual copy (aria-hidden), set in inline letter spans to keep Syne's kerning.
export default function PosterWordmark({
  lines,
}: {
  lines: readonly string[];
}) {
  const { reduced, direction } = use(StageMotion);
  return (
    <span
      aria-hidden="true"
      className="block uppercase [text-shadow:0_0.03em_0.2em_color-mix(in_oklab,var(--color-night-950)_70%,transparent)]"
    >
      {lines.map((line, lineIndex) => (
        <m.span
          key={line}
          data-dust
          data-wordmark-line
          custom={direction}
          className="block"
          variants={reduced ? lineFade : lineVariants(lineIndex)}
          style={{ letterSpacing: tracking }}
        >
          {Array.from(line, (letter, letterIndex) => (
            <m.span
              key={`${line}-${letterIndex}`}
              variants={
                reduced ? still : letterVariants(lineIndex, letterIndex)
              }
            >
              {letter}
            </m.span>
          ))}
        </m.span>
      ))}
    </span>
  );
}
