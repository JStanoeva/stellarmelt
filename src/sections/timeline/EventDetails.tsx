import { m, useIsPresent } from "motion/react";
import { use } from "react";
import type { TimelineEvent } from "../../content/types";
import { formatDate, type EventStatus } from "../../lib/dates";
import { StageMotion } from "../stageMotion";
import CopyLine from "./CopyLine";

type Props = { event: TimelineEvent; status: EventStatus; swap: boolean; direction: 1 | -1 };

const cascade = { hidden: {}, shown: {}, gone: {} };

// The leaving event and the arriving one share the panel's grid cells while one dissolves and the other condenses
// (display: contents, so each line lands in its own cell).
export default function EventDetails({ event, status, swap, direction }: Props) {
  const isPresent = useIsPresent();
  const { motionReady } = use(StageMotion);
  return (
    <m.div
      variants={cascade}
      initial={motionReady ? "hidden" : false}
      animate="shown"
      exit="gone"
      inert={!isPresent}
      className="contents"
    >
      <CopyLine order={0} swap={swap} direction={direction} className="col-start-1 row-start-1">
        {/* On a small phone "Upcoming" drops under the date instead of running into the dots. */}
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.22em] text-rose-300 uppercase wide:text-[clamp(0.6875rem,0.78vw,0.8125rem)]">
          <time dateTime={event.date} className="whitespace-nowrap">
            {formatDate(event.date)}
          </time>
          {/* Only upcoming events say so; a past date speaks for itself. */}
          {status === "upcoming" && (
            <span className="flex items-center gap-3 whitespace-nowrap text-starlight-200">
              <span aria-hidden="true" className="h-px w-7 shrink-0 bg-rose-300/45" />
              Upcoming
            </span>
          )}
        </p>
      </CopyLine>
      <CopyLine order={1} swap={swap} direction={direction} blur className="col-start-1 row-start-2 mt-4 wide:mt-5">
        <h3 className="max-w-[18ch] font-display text-[clamp(1.75rem,5vw,2.6rem)] leading-[1.08] font-bold tracking-[-0.01em] text-balance text-stardust-50 wide:text-[clamp(1.75rem,2.5vw,2.6rem)]">
          {event.title}
        </h3>
      </CopyLine>
      {/* An event without a summary yet leaves the line out. */}
      {event.summary && (
        <CopyLine order={2} swap={swap} direction={direction} className="col-start-1 row-start-3 mt-3 wide:mt-4">
          <p className="max-w-[34ch] text-[clamp(1.0625rem,2.6vw,1.25rem)] leading-[1.6] text-pretty text-mauve-100 wide:text-[clamp(1rem,1.2vw,1.2rem)]">
            {event.summary}
          </p>
        </CopyLine>
      )}
    </m.div>
  );
}
