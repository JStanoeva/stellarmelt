import {
  animate,
  m,
  useIsPresent,
  useMotionValue,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { use, useEffect, useState, type Ref } from "react";
import {
  ENTER_DELAY,
  EXIT_DURATION,
  easeCondense,
  easeDrift,
  easeFade,
  fade,
  StageMotion,
} from "../stageMotion";
import type { Member } from "../../content/types";
import { memberPanelId, memberTabId } from "./memberIds";
import MoonArt from "./MoonArt";
import { moonLooks } from "./moonLooks";
import {
  endFade,
  entryOffset,
  exitDrift,
  moonScale,
  slotPoint,
  wrapOffset,
  type Orbit,
} from "./orbit";

type Props = {
  member: Member;
  // The member's place in the band, which is also its place round the orbit.
  index: number;
  // Its slot relative to the front when the section arrives.
  slot: number;
  selected: boolean;
  orbit: Orbit;
  // How far the orbit has turned, in moons (see MoonOrbit).
  spin: MotionValue<number>;
  onSelect: (index: number) => void;
  ref: Ref<HTMLButtonElement>;
};

// The rise happens on the button's position; the content only fades as the section leaves.
const leave: Variants = {
  hidden: {},
  shown: {},
  gone: { opacity: 0, transition: { duration: EXIT_DURATION, ease: easeFade } },
};

export default function MoonTab({ member, index, slot, selected, orbit, spin, onSelect, ref }: Props) {
  const { reduced, motionReady } = use(StageMotion);
  const isPresent = useIsPresent();
  const look = moonLooks[member.slug];

  // The moons rise along the arc one after another, the farthest first, then drift on as the section leaves.
  const [start] = useState(() => entryOffset(orbit) - slot);
  const exitTo = exitDrift(orbit);
  const rise = useMotionValue(reduced || !motionReady ? 0 : start);
  useEffect(() => {
    if (reduced) {
      rise.jump(0);
      return;
    }
    const controls = isPresent
      ? animate(rise, 0, {
          delay: ENTER_DELAY + 0.2 + (5.5 - Math.abs(start)) * 0.07,
          duration: 1.05,
          ease: easeCondense,
        })
      : animate(rise, exitTo, { duration: EXIT_DURATION + 0.1, ease: easeDrift });
    return () => controls.stop();
  }, [isPresent, reduced, rise, start, exitTo]);

  const offset = useTransform(() => wrapOffset(orbit, index - spin.get()) + rise.get());
  const x = useTransform(() => slotPoint(orbit, offset.get()).x);
  const y = useTransform(() => slotPoint(orbit, offset.get()).y);
  const opacity = useTransform(() => endFade(orbit, offset.get()));
  const scale = useTransform(() => moonScale(offset.get(), look.parent));

  return (
    <m.button
      ref={ref}
      type="button"
      role="tab"
      id={memberTabId(member.slug)}
      aria-selected={selected}
      aria-controls={memberPanelId}
      tabIndex={selected ? 0 : -1}
      onClick={() => onSelect(index)}
      style={{ x, y, opacity }}
      className="group pointer-events-auto absolute top-0 left-0 -mt-5.5 rounded-full wide:-ml-5.5 wide:pr-3 narrow:-ml-7 narrow:w-14"
    >
      <m.span variants={reduced ? fade : leave} className="flex items-center narrow:flex-col">
        {/* A 44 px target round the moon; the moon itself grows past it at the front. */}
        <span className="relative size-11 shrink-0">
          <m.span
            style={{ scale }}
            className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 narrow:size-14"
          >
            {selected && (
              <span aria-hidden="true" className="absolute inset-0.5 rounded-full border border-rose-200/55">
                <span className="absolute inset-[-1px] motion-ok:animate-orbit-once">
                  <span className="absolute -top-[2.5px] left-1/2 size-1 -translate-x-1/2 rounded-full bg-starlight-100" />
                </span>
              </span>
            )}
            <MoonArt
              look={look}
              className="size-full motion-ok:transition-[scale] motion-ok:duration-300 motion-ok:ease-condense group-hover:scale-110"
            />
          </m.span>
        </span>
        <span
          className={`font-mono uppercase transition-colors duration-300 [text-shadow:0_0_12px_var(--color-night-950),0_0_3px_var(--color-night-950)] wide:pl-5 wide:text-[0.6875rem] wide:tracking-[0.22em] wide:whitespace-nowrap narrow:mt-1 narrow:w-14 narrow:text-center narrow:text-[0.625rem] narrow:leading-tight narrow:tracking-[0.06em] ${
            selected ? "text-rose-200" : "text-mauve-200 group-hover:text-starlight-100"
          }`}
        >
          {member.name}
        </span>
      </m.span>
    </m.button>
  );
}
