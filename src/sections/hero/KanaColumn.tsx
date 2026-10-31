import { m, type Variants } from "motion/react";
import { use } from "react";
import { kana } from "../../content/homeSections";
import {
  ENTER_DELAY,
  easeCondense,
  easeDrift,
  easeFade,
  fade,
  StageMotion,
} from "../stageMotion";

// The column sharpens from a blur as a whole (one filter layer); its glyphs drop in top to bottom.
const column: Variants = {
  hidden: { filter: "blur(10px)" },
  shown: {
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay: ENTER_DELAY + 0.05,
      ease: easeCondense,
    },
    transitionEnd: { filter: "none" },
  },
  gone: { filter: "blur(8px)", transition: { duration: 0.4, ease: easeFade } },
};

function glyphVariants(index: number): Variants {
  const exit = { duration: 0.34, delay: index * 0.02 };
  return {
    hidden: (direction: number) => ({ opacity: 0, y: 26 * direction }),
    shown: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: ENTER_DELAY + 0.05 + index * 0.045,
        ease: easeCondense,
      },
    },
    gone: (direction: number) => ({
      opacity: 0,
      y: -20 * direction,
      transition: { ...exit, ease: easeFade, y: { ...exit, ease: easeDrift } },
    }),
  };
}

// Under reduced motion the glyphs hold still and the column just fades.
const still: Variants = { hidden: {}, shown: {}, gone: {} };

// The vertical ステラメルト beside the wordmark.
export default function KanaColumn({ className = "" }: { className?: string }) {
  const { reduced, direction } = use(StageMotion);
  return (
    <m.p
      lang="ja"
      aria-hidden="true"
      data-dust
      variants={reduced ? fade : column}
      className={`font-kana leading-none text-rose-300 [writing-mode:vertical-rl] ${className}`}
    >
      {Array.from(kana, (glyph, index) => (
        <m.span
          key={`${glyph}-${index}`}
          className="inline-block"
          custom={direction}
          variants={reduced ? still : glyphVariants(index)}
        >
          {glyph}
        </m.span>
      ))}
    </m.p>
  );
}
