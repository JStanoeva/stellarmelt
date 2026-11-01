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
      <div
        ref={frameRef}
        role="group"
        aria-label="Song sky: select a star to show its song"
        className="relative mx-3 aspect-[340/400] wide:mx-6 wide:aspect-[1220/450]"
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
        <SideLabel
          side={sides[0]}
          className="pointer-events-none absolute top-[30%] left-0 narrow:top-auto narrow:bottom-[-3.25rem]"
        />
        <SideLabel
          side={sides[1]}
          className="pointer-events-none absolute top-[51%] right-0 text-right narrow:top-auto narrow:bottom-[-3.25rem]"
        />
        <div className="absolute top-[62%] left-1/2 -translate-1/2 wide:top-[1%] wide:right-[-1%] wide:left-auto wide:translate-0">
          <NebulaCue
            artClassName="w-[clamp(6rem,9vw,8.5rem)]"
            className="flex-col-reverse"
          />
        </div>
      </div>
      <StarCaption
        track={selected}
        className="mt-20 wide:absolute wide:bottom-0 wide:left-1/2 wide:mt-0 wide:w-[min(30rem,40%)] wide:-translate-x-1/2 wide:text-center"
      />
    </div>
  );
}
