import { m, type Variants } from "motion/react";
import { use, useRef, useState, type KeyboardEvent } from "react";
import { sides, tracks } from "../../content/album";
import { useElementSize } from "../../hooks/useElementSize";
import { usePlayer } from "../../hooks/usePlayer";
import { ENTER_DELAY, fade, StageMotion } from "../stageMotion";
import ConstellationLines from "./ConstellationLines";
import HomeStar from "./HomeStar";
import NebulaCue from "./NebulaCue";
import SideLabel from "./SideLabel";
import { starPoint } from "./sky";

// The side names and the nebula surface once the stars are mostly lit.
const late: Variants = {
  hidden: { opacity: 0 },
  shown: {
    opacity: 1,
    transition: { delay: ENTER_DELAY + 0.55, duration: 0.6 },
  },
  gone: { opacity: 0, transition: { duration: 0.25 } },
};

type Props = { className?: string };

// The album over the planet's limb: one Tab stop for all sixteen stars, ArrowLeft / ArrowRight move between them.
export default function HomeSky({ className = "" }: Props) {
  const [frameRef, frame] = useElementSize<HTMLDivElement>();
  const { current, status } = usePlayer();
  const { reduced } = use(StageMotion);
  const [focusSlug, setFocusSlug] = useState(tracks[0].slug);
  const links = useRef(new Map<string, HTMLAnchorElement>());

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = tracks.findIndex((track) => track.slug === focusSlug);
    const keys: Record<string, number> = {
      ArrowRight: Math.min(index + 1, tracks.length - 1),
      ArrowLeft: Math.max(index - 1, 0),
      Home: 0,
      End: tracks.length - 1,
    };
    if (!(event.key in keys) || !(event.target instanceof HTMLAnchorElement)) {
      return;
    }
    // Up and Down stay with the stage, so they still step between sections.
    event.preventDefault();
    const slug = tracks[keys[event.key]].slug;
    setFocusSlug(slug);
    links.current.get(slug)?.focus();
  }

  return (
    <div
      ref={frameRef}
      role="group"
      aria-label="The album’s songs as stars"
      onKeyDown={onKeyDown}
      className={className}
    >
      {frame.width > 0 && (
        <>
          <ConstellationLines frame={frame} staged highlight={current?.n} />
          {tracks.map((track, order) => {
            const point = starPoint(track, frame);
            return (
              <HomeStar
                key={track.slug}
                track={track}
                point={point}
                unit={{ x: point.x / frame.width, y: point.y / frame.height }}
                order={order}
                size={frame.width > 600 ? 7 : 6}
                tabbable={track.slug === focusSlug}
                status={current?.slug === track.slug ? status : null}
                onFocus={() => setFocusSlug(track.slug)}
                ref={(node) => {
                  if (node) links.current.set(track.slug, node);
                  else links.current.delete(track.slug);
                }}
              />
            );
          })}
        </>
      )}
      <m.div
        variants={reduced ? fade : late}
        className="pointer-events-none absolute inset-0"
      >
        <SideLabel
          side={sides[0]}
          className="absolute top-[24%] left-0 narrow:top-[100%]"
        />
        <SideLabel
          side={sides[1]}
          className="absolute top-[22%] right-0 text-right narrow:top-[100%]"
        />
      </m.div>
      <m.div
        variants={reduced ? fade : late}
        className="absolute top-[33%] left-1/2 -translate-1/2 narrow:top-[68%]"
      >
        <NebulaCue
          artClassName="w-[clamp(6.5rem,12vw,11rem)]"
          className="flex-col narrow:flex-col-reverse"
        />
      </m.div>
    </div>
  );
}
