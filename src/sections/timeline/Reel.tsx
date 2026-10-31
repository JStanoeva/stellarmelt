import {
  animate,
  m,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
  type Variants,
} from "motion/react";
import { use, useEffect, useRef } from "react";
import { easeCondense, easeDrift, easeFade, fadeVariants, StageMotion } from "../stageMotion";

type Props = {
  symbols: readonly string[];
  // Index of the symbol on show.
  value: number;
  // Place in the date from the left, so the columns roll one after another.
  column: number;
  // Which way the last move went: 1 (a later event) rolls the strip up, like an odometer counting on.
  direction: 1 | -1;
  // A cell's height in em: Syne's lining figures are 0.655 em tall, Martian Mono's 0.82 em.
  cell?: number;
  className?: string;
  glyphClassName?: string;
  // An optional second layer under each glyph (the day's halftone shadow), which rolls with it.
  echoClassName?: string;
};

const ROLL_S = 0.68;
const ROLL_STAGGER = 0.028;
const ENTER_BASE = 0.34;
const ENTER_STAGGER = 0.025;
// The symbols in between show this dim, so a long roll of huge numerals never strobes (well under a 10% luminance swing).
const DIM = 0.22;

function wrap(value: number, count: number): number {
  return ((value % count) + count) % count;
}

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

// One masked column of a split-flap date: the strip of symbols rolls through every one in between to the next value.
export default function Reel({
  symbols,
  value,
  column,
  direction,
  cell = 0.8,
  className = "",
  glyphClassName = "",
  echoClassName,
}: Props) {
  const { reduced, direction: stageDirection } = use(StageMotion);
  const count = symbols.length;
  // Unwrapped, so a roll from 9 on to 0 keeps going up instead of spinning back down through 8, 7, 6…
  const target = useRef(value);
  const position = useMotionValue(value);
  const roll = useRef<AnimationPlaybackControls | null>(null);
  // The strip repeats its first symbol at the end, so 9.5 shows half a 9 and half a 0 and 10 looks exactly like 0.
  const y = useTransform(position, (p) => `${-wrap(p, count) * cell}em`);
  // Where the current roll set off and where it lands: the strip is bright only near either end.
  const rollFrom = useMotionValue(value);
  const rollTo = useMotionValue(value);
  const opacity = useTransform(() => {
    const p = position.get();
    const near = Math.min(Math.abs(p - rollFrom.get()), Math.abs(rollTo.get() - p));
    return DIM + (1 - DIM) * clamp01(1 - (near - 0.3) / 0.45);
  });

  useEffect(() => {
    const from = wrap(target.current, count);
    if (from === value) return;
    target.current += direction > 0 ? wrap(value - from, count) : -wrap(from - value, count);
    rollTo.set(target.current);
    if (reduced) {
      roll.current?.stop();
      rollFrom.set(target.current);
      position.jump(target.current);
      return;
    }
    // A reel caught mid-roll carries straight on (still dim); one at rest waits for its turn in the stagger.
    const rolling = position.isAnimating();
    if (!rolling) rollFrom.set(position.get());
    roll.current?.stop();
    roll.current = animate(position, target.current, {
      duration: ROLL_S,
      delay: rolling ? 0 : column * ROLL_STAGGER,
      ease: easeCondense,
    });
  }, [value, direction, reduced, count, column, position, rollFrom, rollTo]);

  useEffect(() => () => roll.current?.stop(), []);

  // Entering, the strip spins up out of the blank past its ends; leaving, it spins on and fades.
  const spin: Variants = reduced
    ? fadeVariants({ y: "0em" })
    : {
        hidden: (way: number) => ({
          y: `${(way > 0 ? value + 1.15 : value - count - 1.15) * cell}em`,
          opacity: DIM,
        }),
        // The spin-up is dim too, and brightens as the strip settles on its symbol.
        shown: {
          y: "0em",
          opacity: [DIM, DIM, 1],
          transition: {
            duration: 0.66,
            delay: ENTER_BASE + column * ENTER_STAGGER,
            ease: easeCondense,
            opacity: {
              duration: 0.66,
              delay: ENTER_BASE + column * ENTER_STAGGER,
              times: [0, 0.25, 1],
              ease: ["linear", "easeOut"],
            },
          },
        },
        gone: (way: number) => ({
          y: `${-way * 2.4 * cell}em`,
          opacity: 0,
          transition: {
            duration: 0.36,
            delay: column * 0.016,
            ease: easeFade,
            y: { duration: 0.36, delay: column * 0.016, ease: easeDrift },
          },
        }),
      };

  return (
    <span className={`relative block overflow-hidden ${className}`} style={{ height: `${cell}em` }}>
      <m.span custom={stageDirection} variants={spin} className="block">
        <m.span style={{ y, opacity }} className="block">
          {[...symbols, symbols[0]].map((symbol, index) => (
            <span
              key={index === count ? "wrap" : symbol}
              className="relative block whitespace-nowrap"
              style={{ height: `${cell}em`, lineHeight: `${cell}em` }}
            >
              {echoClassName && <span className={`absolute inset-0 ${echoClassName}`}>{symbol}</span>}
              <span className={`relative block ${glyphClassName}`}>{symbol}</span>
            </span>
          ))}
        </m.span>
      </m.span>
    </span>
  );
}
