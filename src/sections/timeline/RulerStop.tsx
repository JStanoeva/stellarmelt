import { m, type Variants } from "motion/react";
import { use, type Ref } from "react";
import type { TimelineEvent } from "../../content/types";
import { formatDate } from "../../lib/dates";
import { fadeVariants, StageMotion } from "../stageMotion";
import { eventPanelId, eventTabId } from "./eventIds";
import { AXIS_Y, TARGET_PX, type RulerStop as Stop } from "./ruler";
import { IGNITE_DURATION, igniteDelay, outDelay } from "./rulerMotion";

type Props = {
  event: TimelineEvent;
  stop: Stop;
  // How far along the ruler the stop sits (0..1), so it ignites as the ruling edge reaches it.
  share: number;
  selected: boolean;
  onSelect: () => void;
  onHover: (hovering: boolean) => void;
  ref: Ref<HTMLButtonElement>;
};

function ignite(share: number): Variants {
  return {
    hidden: { scale: 0, opacity: 0 },
    shown: {
      scale: [0, 1.75, 1],
      opacity: [0, 1, 1],
      transition: { delay: igniteDelay(share), duration: IGNITE_DURATION, times: [0, 0.38, 1], ease: "easeOut" },
    },
    gone: { scale: 0.2, opacity: 0, transition: { delay: outDelay(share), duration: 0.12, ease: "easeIn" } },
  };
}

// One event's star on the ruler, at its real date, and its tab: tiny to the eye, up to 44 px to the hand.
export default function RulerStop({ event, stop, share, selected, onSelect, onHover, ref }: Props) {
  const { reduced } = use(StageMotion);
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={eventTabId(event.id)}
      aria-selected={selected}
      aria-controls={eventPanelId}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      style={{ left: stop.hitLeft, width: stop.hitRight - stop.hitLeft, top: AXIS_Y - TARGET_PX / 2 }}
      className="group absolute h-11 rounded-full focus-visible:outline-transparent"
    >
      <span className="sr-only">
        {formatDate(event.date)}: {event.title}
      </span>
      {/* The star sits on its day, which isn't always the middle of its target (the binary star's two aren't), so
          the focus ring is drawn round the star; the button's own outline stays, transparent, for forced colours. */}
      <m.span
        aria-hidden="true"
        variants={reduced ? fadeVariants({ scale: 1 }) : ignite(share)}
        style={{ left: stop.x - stop.hitLeft }}
        className="absolute top-1/2 size-0"
      >
        <span
          className={`absolute -inset-[14px] rounded-full bg-[radial-gradient(circle,var(--color-rose-200)_0%,transparent_68%)] transition-opacity duration-300 ${
            selected ? "opacity-0" : "opacity-30 group-hover:opacity-60"
          }`}
        />
        <svg viewBox="-11 -11 22 22" className="absolute -top-[11px] -left-[11px] size-[22px] fill-none">
          <path
            d="M0 -3.5V-9M3.5 0H9M0 3.5V9M-3.5 0H-9"
            className="stroke-starlight-100/45"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
        </svg>
        {/* Forced colours drop backgrounds but paint borders, so the transparent border keeps the star visible. */}
        <span className="absolute -top-[2.5px] -left-[2.5px] size-[5px] rounded-full border border-transparent bg-stardust-50 shadow-[0_0_6px_1px_var(--color-rose-200)] motion-ok:transition-[scale] motion-ok:duration-300 group-hover:scale-125" />
        <span className="absolute -top-3.5 -left-3.5 size-7 rounded-full group-focus-visible:outline-2 group-focus-visible:outline-solid group-focus-visible:outline-focus" />
      </m.span>
    </button>
  );
}
