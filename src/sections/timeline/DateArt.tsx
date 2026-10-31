import { m, type Variants } from "motion/react";
import { use } from "react";
import type { IsoDate } from "../../content/types";
import { easeCondense, easeFade, fade, StageMotion } from "../stageMotion";
import Reel from "./Reel";

type Props = { date: IsoDate; direction: 1 | -1 };

const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

// "2025-07-27" → the digits of the day and year and the month's index.
function dateParts(date: IsoDate) {
  const [year, month, day] = date.split("-");
  return {
    day: [...day].map(Number),
    month: Number(month) - 1,
    year: [...year].map(Number),
  };
}

const figures = "font-display font-extrabold lining-nums tabular-nums";

const leader: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  shown: { scaleX: 1, opacity: 1, transition: { delay: 0.5, duration: 0.6, ease: easeCondense } },
  gone: { scaleX: 0, opacity: 0, transition: { duration: 0.3, ease: easeFade } },
};

// The poster's artwork: the day in huge gradient numerals over a halftone shadow, the month and year beneath.
// Decorative: the real date is the <time> in the details.
export default function DateArt({ date, direction }: Props) {
  const { reduced } = use(StageMotion);
  const { day, month, year } = dateParts(date);
  return (
    <div
      aria-hidden="true"
      className="w-max shrink-0 text-[min(37vw,19dvh)] leading-none select-none wide:text-[min(25vw,38dvh)] short:text-[min(25vw,30dvh)]"
    >
      <div className={`flex ${figures}`}>
        {day.map((digit, index) => (
          <Reel
            key={`day-${index}`}
            symbols={digits}
            value={digit}
            column={index}
            direction={direction}
            className="-mx-[0.02em]"
            glyphClassName="date-fill"
            echoClassName="date-halftone translate-x-[0.035em] translate-y-[0.04em]"
          />
        ))}
      </div>
      <div className="mt-[0.06em] flex items-center text-[0.3em]">
        <Reel
          symbols={months}
          value={month}
          column={2}
          direction={direction}
          cell={1}
          className="font-mono text-[0.78em] font-light tracking-[0.04em] text-rose-300 uppercase"
        />
        {/* A dotted leader, like the orbit's, from the month to the year. */}
        <m.span
          variants={reduced ? fade : leader}
          className="date-leader mx-[0.3em] h-[0.1em] min-w-[0.5em] flex-1 origin-left"
        />
        <div className={`flex ${figures}`}>
          {year.map((digit, index) => (
            <Reel
              key={`year-${index}`}
              symbols={digits}
              value={digit}
              column={3 + index}
              direction={direction}
              glyphClassName="date-outline"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
