import { m, type Variants } from "motion/react";
import { use, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { useIsTall } from "../../hooks/useIsTall";
import type { TimelineEvent } from "../../content/types";
import { easeCondense, easeFade, fade, fadeVariants, StageMotion } from "../stageMotion";
import { AXIS_Y, rulerFor, shownLabels } from "./ruler";
import RulerAxis from "./RulerAxis";
import RulerStop from "./RulerStop";
import { igniteDelay, outDelay, RULE_DELAY, RULE_DURATION, ruleEase, UNRULE_DURATION, unruleEase } from "./rulerMotion";

type Props = {
  events: readonly TimelineEvent[];
  selected: number;
  onSelect: (index: number) => void;
};

// Tall enough for the hover titles and date labels above the axis and two lines of month and year below it.
const RULER_HEIGHT = 92;

// Leaving, the ring waits for the axis to retract into it, then goes out.
const ring: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  shown: { opacity: 1, scale: 1, transition: { delay: 0.22, duration: 0.5, ease: easeCondense } },
  gone: { opacity: 0, scale: 0.6, transition: { delay: UNRULE_DURATION - 0.1, duration: 0.14, ease: easeFade } },
};

// The axis, its ticks and its months rule out of the ring left to right, and retract into it when the section leaves.
function rule(width: number): Variants {
  const closed = `inset(-48px ${width + 60}px -48px -24px)`;
  const open = "inset(-48px -60px -48px -24px)";
  return {
    hidden: { clipPath: closed },
    shown: { clipPath: open, transition: { delay: RULE_DELAY, duration: RULE_DURATION, ease: ruleEase } },
    gone: { clipPath: closed, transition: { duration: UNRULE_DURATION, ease: unruleEase } },
  };
}

// A date label or the marker turns up as the ruling edge reaches it.
function arrive(share: number, extra = 0): Variants {
  return {
    hidden: { opacity: 0, y: 4 },
    shown: { opacity: 1, y: 0, transition: { delay: igniteDelay(share) + extra, duration: 0.4, ease: easeCondense } },
    gone: { opacity: 0, transition: { delay: outDelay(share), duration: 0.12, ease: "easeIn" } },
  };
}

// The events as stars on a ruler of real time (WAI-ARIA tabs); a glowing marker glides to the one on show.
export default function TimeRuler({ events, selected, onSelect }: Props) {
  const { reduced } = use(StageMotion);
  const tall = useIsTall();
  const tabs = useRef(new Map<string, HTMLButtonElement>());
  const scroller = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(0);
  // Which ends of a sideways-scrolling ruler have more beyond them.
  const [edges, setEdges] = useState({ start: false, end: false });
  const [hovered, setHovered] = useState<number | null>(null);
  const ruler = available > 0 ? rulerFor(events, available, tall) : null;
  const contentWidth = ruler?.width ?? 0;
  const last = events.length - 1;

  useLayoutEffect(() => {
    const box = scroller.current;
    if (!box) return;
    const measure = () => {
      setAvailable(box.clientWidth);
      const start = box.scrollLeft > 1;
      const end = box.scrollLeft + box.clientWidth < box.scrollWidth - 1;
      setEdges((previous) => (previous.start === start && previous.end === end ? previous : { start, end }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    box.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      box.removeEventListener("scroll", measure);
    };
  }, [contentWidth]);

  // Keep the stop on show in view when the ruler scrolls sideways.
  useEffect(() => {
    const box = scroller.current;
    const tab = tabs.current.get(events[selected].id);
    if (!box || !tab || box.scrollWidth <= box.clientWidth) return;
    const left = tab.offsetLeft + tab.offsetWidth / 2 - box.clientWidth / 2;
    box.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
  }, [events, selected, reduced, contentWidth]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let index: number;
    if (event.key === "ArrowRight") index = Math.min(selected + 1, last);
    else if (event.key === "ArrowLeft") index = Math.max(selected - 1, 0);
    else if (event.key === "Home") index = 0;
    else if (event.key === "End") index = last;
    else return;
    // Handled here, so Home and End don't step the stage as well.
    event.preventDefault();
    onSelect(index);
    tabs.current.get(events[index].id)?.focus({ preventScroll: true });
  }

  const glide = reduced ? { duration: 0 } : { duration: 0.62, ease: easeCondense };
  // Only while it scrolls: a mask also clips what hangs outside the strip.
  const fadeMask = `linear-gradient(to right, ${edges.start ? "transparent" : "black"}, black 2.5rem, black calc(100% - 2.5rem), ${edges.end ? "transparent" : "black"})`;
  // Where the ruling edge is when it reaches x (it starts 60 px before the ring and ends 60 px past the arrow).
  const shareAt = (x: number) => (ruler ? (x + 60) / (ruler.width + 120) : 0);

  const current = ruler?.stops[selected];
  const labels = ruler && current ? shownLabels(ruler, current.group) : new Set<number>();
  const tipIndex = hovered !== null && hovered !== selected ? hovered : null;
  const hoveredStop = ruler && tipIndex !== null ? ruler.stops[tipIndex] : null;

  return (
    <div className="flex min-w-0 flex-1 items-start">
      {/* The ring the moon comes to rest in: the origin of the ruler, where the real orbit hands over to time.
          It grows with the moon, which is 1.4% of the shorter side across on wide screens and 3% on phones. */}
      <m.span
        aria-hidden="true"
        data-orbit-anchor
        variants={reduced ? fade : ring}
        style={{ marginTop: `calc(${AXIS_Y}px - var(--ring) / 2)` }}
        className="size-(--ring) shrink-0 rounded-full border border-rose-300/70 [--ring:max(1.375rem,2.45vmin)] narrow:[--ring:max(1.375rem,5.4vmin)]"
      />
      {/* Padded so the stops' focus rings aren't clipped where the ruler scrolls. */}
      <div
        ref={scroller}
        style={edges.start || edges.end ? { maskImage: fadeMask } : undefined}
        className="-my-1.5 min-w-0 flex-1 overflow-x-auto overscroll-x-contain py-1.5 [scrollbar-width:none]"
      >
        {ruler && current && (
          <div className="relative" style={{ width: ruler.width, height: RULER_HEIGHT }}>
            <m.div
              variants={reduced ? fadeVariants({ clipPath: "inset(-48px -60px -48px -24px)" }) : rule(ruler.width)}
              className="absolute inset-0"
            >
              <RulerAxis ruler={ruler} />
              {/* The progress line: lit from the ring up to the event on show. */}
              <m.span
                aria-hidden="true"
                initial={false}
                animate={{ scaleX: current.x / ruler.axisEnd }}
                transition={glide}
                style={{ top: AXIS_Y, width: ruler.axisEnd }}
                className="absolute left-0 h-px origin-left bg-linear-to-r from-rose-300/30 to-rose-300"
              />
            </m.div>

            {/* One date per day (the two July 27 events share theirs); crowded ones give way to the selected one. */}
            <div aria-hidden="true" className="pointer-events-none">
              {ruler.groups.map((group, index) => {
                const isCurrent = index === current.group;
                const visible = labels.has(index) || hoveredStop?.group === index;
                return (
                  <m.span
                    key={group.key}
                    variants={reduced ? fade : arrive(shareAt(group.x))}
                    style={{ left: group.x, top: AXIS_Y - 30 }}
                    className="absolute -translate-x-1/2"
                  >
                    <span
                      className={`block font-mono text-[0.625rem] leading-none tracking-[0.16em] whitespace-nowrap transition-[opacity,color] duration-200 ${
                        isCurrent ? "text-rose-200" : "text-mauve-200/80"
                      } ${visible ? "opacity-100" : "opacity-0"}`}
                    >
                      {group.label}
                    </span>
                  </m.span>
                );
              })}
            </div>

            {/* The glowing marker, the ruler's playhead. */}
            <m.span
              aria-hidden="true"
              variants={reduced ? fade : arrive(shareAt(current.x), 0.08)}
              className="pointer-events-none absolute top-0 left-0"
            >
              <m.span
                initial={false}
                animate={{ x: current.x }}
                transition={glide}
                style={{ top: AXIS_Y }}
                className="absolute left-0 block"
              >
                <span className="absolute top-0 left-0 grid size-5 -translate-1/2 place-items-center rounded-full border border-rose-200/80 bg-night-950 shadow-[0_0_16px_3px_color-mix(in_oklab,var(--color-rose-400)_55%,transparent)]">
                  <span className="size-1.5 rounded-full bg-starlight-100" />
                </span>
              </m.span>
            </m.span>

            <div role="tablist" aria-label="Timeline events" onKeyDown={onKeyDown}>
              {events.map((event, index) => {
                const stop = ruler.stops[index];
                return (
                  <RulerStop
                    key={event.id}
                    ref={(node) => {
                      if (node) tabs.current.set(event.id, node);
                      return () => {
                        tabs.current.delete(event.id);
                      };
                    }}
                    event={event}
                    stop={stop}
                    share={shareAt(stop.x)}
                    selected={index === selected}
                    onSelect={() => onSelect(index)}
                    onHover={(hovering) => setHovered((previous) => (hovering ? index : previous === index ? null : previous))}
                  />
                );
              })}
            </div>

            {/* Hovering another stop shows its title above its date (wide screens; phones have no hover). */}
            {hoveredStop && tipIndex !== null && (
              <span
                aria-hidden="true"
                style={{
                  left: Math.min(Math.max(hoveredStop.x, 0), ruler.width),
                  translate: hoveredStop.x < ruler.width * 0.25 ? "0 0" : hoveredStop.x > ruler.width * 0.75 ? "-100% 0" : "-50% 0",
                }}
                className="pointer-events-none absolute top-0 font-mono text-[0.625rem] leading-none tracking-[0.14em] whitespace-nowrap text-starlight-200 uppercase narrow:hidden"
              >
                {events[tipIndex].title}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
