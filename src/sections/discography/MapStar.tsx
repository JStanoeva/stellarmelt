import type { CSSProperties, KeyboardEvent, Ref } from "react";
import PlayingHalo from "../../components/player/PlayingHalo";
import type { Track } from "../../content/types";
import type { PlayerStatus } from "../../player/player";
import { magnitude, pad2, type Point } from "./sky";
import StarDot from "./StarDot";

type Props = {
  track: Track;
  point: Point;
  // Where the star sits in its frame (0–1), to keep its name label inside the map.
  unit: Point;
  order: number;
  selected: boolean;
  // The player's status while this is its song, else null.
  status: PlayerStatus | null;
  // The star's diameter in px at magnitude 1.
  size: number;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  ref: Ref<HTMLButtonElement>;
};

// One star of the sky map: a button that shows its song in the caption. The selected star wears a chart reticle.
export default function MapStar({
  track,
  point,
  unit,
  order,
  selected,
  status,
  size,
  onSelect,
  onKeyDown,
  ref,
}: Props) {
  const current = status !== null;
  let across = "left-1/2 -translate-x-1/2";
  if (unit.x < 0.3) across = "left-0";
  else if (unit.x > 0.7) across = "right-0";
  const along = unit.y < 0.45 ? "top-full mt-1" : "bottom-full mb-1";
  let statusText = "";
  if (current) statusText = status === "paused" ? ", paused" : ", now playing";

  return (
    <div
      className="sky-ignite absolute size-0"
      style={{ left: point.x, top: point.y, "--order": order } as CSSProperties}
    >
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        tabIndex={selected ? 0 : -1}
        onClick={onSelect}
        onKeyDown={onKeyDown}
        className="group absolute grid size-8 -translate-1/2 place-items-center rounded-full wide:size-9"
      >
        <span className="sr-only">{`${track.n}. ${track.title}, sung by ${track.singer}${statusText}`}</span>
        {current && (
          <PlayingHalo
            singer={track.singer}
            className="size-16 wide:size-[4.5rem]"
          />
        )}
        <span
          className={`relative motion-ok:transition-transform motion-ok:duration-300 ${selected ? "scale-150" : "group-hover:scale-125"}`}
        >
          <StarDot
            singer={track.singer}
            magnitude={magnitude(track)}
            scale={size}
          />
        </span>
        {selected && (
          <svg
            viewBox="-20 -20 40 40"
            aria-hidden="true"
            className="pointer-events-none absolute size-12 overflow-visible stroke-rose-200"
          >
            <circle r="11" fill="none" strokeWidth="1" />
            <path d="M-19 0h5M14 0h5M0 -19v5M0 14v5" strokeWidth="1.2" />
          </svg>
        )}
        {/* The chart's catalogue number sits beside the star; the title joins it when hovered or selected. */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-[calc(50%+4px)] font-mono text-[0.5625rem] tracking-[0.1em] [text-shadow:0_0_8px_var(--color-night-950)] ${unit.x > 0.7 ? "right-[calc(50%+7px)]" : "left-[calc(50%+7px)]"} ${selected ? "text-rose-200" : "text-mauve-300/85"}`}
        >
          {pad2(track.n)}
        </span>
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute ${across} ${along} font-display text-[0.875rem] font-bold whitespace-nowrap text-stardust-50 [text-shadow:0_0_10px_var(--color-night-950),0_0_3px_var(--color-night-950)] transition-opacity duration-200 ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          {track.title}
        </span>
      </button>
    </div>
  );
}
