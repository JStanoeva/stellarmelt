import { AnimatePresence, m, useIsPresent } from "motion/react";
import { use, useMemo, useState, type CSSProperties } from "react";
import { timeline } from "../../content/timeline";
import type { TimelineEvent } from "../../content/types";
import { useIsTall } from "../../hooks/useIsTall";
import { eventStatus, localTodayIso } from "../../lib/dates";
import Dissolve from "../Dissolve";
import StageSection from "../StageSection";
import { fade, StageMotion } from "../stageMotion";
import ArrowButton from "./ArrowButton";
import DateArt from "./DateArt";
import EventDetails from "./EventDetails";
import { eventPanelId, eventTabId } from "./eventIds";
import { AXIS_Y, TARGET_PX } from "./ruler";
import TimeRuler from "./TimeRuler";

const events: readonly TimelineEvent[] = timeline;
const last = events.length - 1;

const buttons = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { delay: 0.7, duration: 0.4 } },
  gone: { opacity: 0, transition: { duration: 0.24 } },
};

// On wide screens the arrows sit level with the ruler's axis.
const arrowsStyle = { "--axis-gap": `${AXIS_Y - TARGET_PX / 2}px` } as CSSProperties;

// A gig poster for one milestone at a time: its date is the artwork, moving on rolls every digit like an odometer,
// and a ruler of real time underneath shows where it falls. The planet's orbit hands over to the ruler's ring.
export default function TimelineSection() {
  const [selected, setSelected] = useState(0);
  const [eventDirection, setEventDirection] = useState<1 | -1>(1);
  const [moved, setMoved] = useState(false);
  const [today] = useState(localTodayIso);
  const tall = useIsTall();
  const { direction: stageDirection, reduced } = use(StageMotion);
  const isPresent = useIsPresent();
  const event = events[selected];
  const status = eventStatus(event.date, today);
  // The same element until the event changes: Motion 14.9 duplicates a leaving child of AnimatePresence (propagate)
  // whose element is re-created while the section itself leaves.
  const details = useMemo(
    () => <EventDetails key={event.id} event={event} status={status} swap={moved} direction={eventDirection} />,
    [event, status, moved, eventDirection],
  );

  function select(index: number) {
    if (index === selected) return;
    setEventDirection(index > selected ? 1 : -1);
    setSelected(index);
    setMoved(true);
  }

  const arrows = (
    <m.div
      variants={reduced ? fade : buttons}
      style={arrowsStyle}
      className="mb-2 flex gap-2 self-end narrow:mr-9 wide:mt-(--axis-gap) wide:mb-0 wide:ml-6 wide:self-auto"
    >
      <ArrowButton direction={-1} label="Previous event" disabled={selected === 0} onClick={() => select(selected - 1)} />
      <ArrowButton direction={1} label="Next event" disabled={selected === last} onClick={() => select(selected + 1)} />
    </m.div>
  );

  return (
    <StageSection id="timeline">
      <div
        data-stage-scroll=""
        className="absolute inset-0 flex flex-col overflow-y-auto overscroll-contain pt-[5.25rem] pr-14 pb-6 pl-5 wide:pt-[clamp(5.5rem,13dvh,7rem)] wide:pr-[clamp(5rem,7vw,7rem)] wide:pb-[clamp(1.5rem,6dvh,3.5rem)] wide:pl-[clamp(2rem,7vw,8rem)] short:pt-[4.5rem]"
      >
        <Dissolve order={0} tracking={-0.03} loosen blur className="self-start">
          {/* On phones the heading sits beside the planet: at 8.2vw it ends left of the planet's edge (65vw). */}
          <h2
            id="timeline-title"
            data-stage-heading
            tabIndex={-1}
            className="font-display text-[clamp(1.625rem,8.2vw,4.25rem)] leading-[0.9] font-extrabold text-stardust-50 wide:text-[clamp(2.5rem,4.4vw,4.25rem)] short:text-[2rem]"
          >
            Timeline
          </h2>
        </Dissolve>

        <div className="narrow:my-auto narrow:pt-[clamp(1.25rem,3dvh,2.5rem)] wide:mt-auto wide:flex wide:items-start wide:gap-x-[clamp(2rem,4vw,4.5rem)]">
          <DateArt date={event.date} direction={eventDirection} />

          {/* Wide screens lift the panel out of the flow, so a longer event never nudges the date. */}
          <div className="relative mt-6 wide:mt-[0.4rem] wide:min-w-0 wide:flex-1 wide:self-stretch">
            <div
              role="tabpanel"
              id={eventPanelId}
              aria-labelledby={eventTabId(event.id)}
              tabIndex={0}
              className="grid items-start rounded-md wide:absolute wide:inset-x-0 wide:top-0"
            >
              {/* A move swaps the copy along the event direction; leaving, it drifts with the stage. */}
              <AnimatePresence custom={isPresent ? eventDirection : stageDirection} propagate>
                {details}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Phones put the arrows above the ruler (first in the tab order too), so the ruler gets the whole width;
            the dots end above it. */}
        <div className="mt-auto flex flex-col pt-[clamp(1rem,3dvh,2rem)] narrow:-mr-9 wide:mt-0 wide:flex-row wide:items-start wide:gap-2 wide:pt-[clamp(1.25rem,6dvh,3.5rem)]">
          {tall && arrows}
          <TimeRuler events={events} selected={selected} onSelect={select} />
          {!tall && arrows}
        </div>
      </div>
    </StageSection>
  );
}
