import { useRef, useState, type KeyboardEvent } from "react";
import { sides, tracks } from "../../content/album";
import { useElementSize } from "../../hooks/useElementSize";
import { usePlayer } from "../../hooks/usePlayer";
import { trackBySlug } from "../../lib/tracks";
import ConstellationLines from "./ConstellationLines";
import Graticule from "./Graticule";
import MapStar from "./MapStar";
import NebulaCue from "./NebulaCue";
import SideLabel from "./SideLabel";
import { starPoint } from "./sky";
import StarCaption from "./StarCaption";

const steps: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

// The sky map: every star is a button that shows its song in the caption; one Tab stop, the arrow keys walk the stars.
export default function SkyMap() {
  const { current, status } = usePlayer();
  const [selectedSlug, setSelectedSlug] = useState(
    () => current?.slug ?? tracks[0].slug,
  );
  const selected = trackBySlug(selectedSlug) ?? tracks[0];
  const [frameRef, frame] = useElementSize<HTMLDivElement>();
  const buttons = useRef(new Map<string, HTMLButtonElement>());

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = tracks.indexOf(selected);
    let next: number;
    if (event.key in steps) {
      next = Math.min(Math.max(index + steps[event.key], 0), tracks.length - 1);
    } else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tracks.length - 1;
    else return;
    event.preventDefault();
    const slug = tracks[next].slug;
    setSelectedSlug(slug);
    buttons.current.get(slug)?.focus();
  }

  return (
    <div className="relative">
      {/* Height caps: tall tablets flatten the arch above the planet; short screens shrink the chart to fit the first screen. */}
      <div
        ref={frameRef}
        role="group"
        aria-label="Song sky: select a star to show its song"
        className="relative mx-3 aspect-[340/400] wide:mx-6 wide:aspect-[1220/450] narrow:w-[calc(100%_-_1.5rem)] narrow:max-h-[max(24rem,100dvh_-_50vw_-_8rem)] short:mx-auto short:w-auto short:aspect-[1220/450] short:max-h-[calc((100dvh_-_13rem)/0.9)]"
      >
        {frame.width > 0 && (
          <>
            <Graticule frame={frame} />
            <ConstellationLines frame={frame} highlight={selected.n} />
            {tracks.map((track, order) => {
              const point = starPoint(track, frame);
              return (
                <MapStar
                  key={track.slug}
                  track={track}
                  point={point}
                  unit={{ x: point.x / frame.width, y: point.y / frame.height }}
                  order={order}
                  size={frame.width > 600 ? 7.5 : 6}
                  selected={track.slug === selected.slug}
                  status={track.slug === current?.slug ? status : null}
                  onSelect={() => setSelectedSlug(track.slug)}
                  onKeyDown={onKeyDown}
                  ref={(node) => {
                    if (node) buttons.current.set(track.slug, node);
                    else buttons.current.delete(track.slug);
                  }}
                />
              );
            })}
          </>
        )}
        {/* Labels, cue and caption sit among the stars from 1024px wide (lg:wide), under and inside the arch below that. */}
        <SideLabel
          side={sides[0]}
          className="pointer-events-none absolute bottom-[-3.25rem] left-0 max-[22rem]:-left-3 lg:wide:top-[30%] lg:wide:bottom-auto short:top-auto short:bottom-[-3.25rem]"
        />
        <SideLabel
          side={sides[1]}
          className="pointer-events-none absolute right-0 bottom-[-3.25rem] text-right max-[22rem]:-right-3 lg:wide:top-[51%] lg:wide:bottom-auto lg:wide:max-xl:-right-6 short:top-auto short:right-0 short:bottom-[-3.25rem]"
        />
        <div className="absolute top-[62%] left-1/2 -translate-1/2 lg:wide:top-[1%] lg:wide:right-[-1%] lg:wide:left-auto lg:wide:translate-0 short:top-[62%] short:right-auto short:left-1/2 short:-translate-1/2">
          <NebulaCue
            artClassName="w-[clamp(6rem,9vw,8.5rem)]"
            className="flex-col-reverse"
          />
        </div>
      </div>
      <StarCaption
        track={selected}
        className="mt-20 wide:mx-auto wide:max-w-[30rem] wide:text-center lg:wide:absolute lg:wide:bottom-0 lg:wide:left-1/2 lg:wide:mt-0 lg:wide:w-[min(30rem,40%)] lg:wide:-translate-x-1/2 short:static short:mx-auto short:mt-20 short:w-full short:max-w-[30rem] short:translate-x-0 short:text-center"
      />
    </div>
  );
}
