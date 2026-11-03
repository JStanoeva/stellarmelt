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
    <div className={`[container-type:size] ${className}`}>
      {/* Tall screens: the largest frame that fits, sat on the planet's edge; wide screens: the whole box; landscape phones: a flat frame with the side names at its feet. */}
      <div
        ref={frameRef}
        role="group"
        aria-label="The album’s songs as stars"
        onKeyDown={onKeyDown}
        className="absolute bottom-0 left-1/2 h-[min(80cqw,100cqh)] w-[min(100cqw,160cqh)] -translate-x-1/2 wide:h-full wide:w-full short:h-[min(40cqw,100cqh)] short:w-[min(100cqw-19rem,250cqh)]"
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
            className="absolute top-[20%] left-0 narrow:top-[100%] narrow:max-w-[calc(50%-0.5rem)] short:top-auto short:right-[calc(100%+1.75rem)] short:bottom-[4%] short:left-auto short:max-w-[calc((100cqw-100%)/2-1.75rem)] short:text-right"
          />
          <SideLabel
            side={sides[1]}
            className="absolute top-[min(18%,42%-3rem)] right-0 text-right narrow:top-[100%] narrow:max-w-[calc(50%-0.5rem)] short:top-auto short:right-auto short:bottom-[4%] short:left-[calc(100%+1.75rem)] short:max-w-[calc((100cqw-100%)/2-1.75rem)] short:text-left"
          />
        </m.div>
        {/* Wide and landscape screens: the cue stands just above the planet's edge (the discography pose in src/art/poses.ts), and the galaxy shrinks with the height to stay under the stars. */}
        <m.div
          variants={reduced ? fade : late}
          className="absolute bottom-[calc(var(--sky-end)_+_min(115vw,115dvh)_-_172dvh_+_0.75rem)] left-1/2 -translate-x-1/2 narrow:top-[60%] narrow:bottom-auto narrow:-translate-y-1/2 short:top-auto short:bottom-[calc(14.5dvh_-_1.5rem)] short:translate-y-0"
        >
          <NebulaCue
            artClassName="w-[clamp(4.5rem,min(12vw,14dvh),11rem)] narrow:w-[clamp(4.5rem,33cqw,9rem)] short:w-[min(6rem,40cqh)]"
            className="flex-col-reverse"
          />
        </m.div>
      </div>
    </div>
  );
}
