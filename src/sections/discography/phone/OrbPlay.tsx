import PlayGlyph from "../../../components/player/PlayGlyph";
import ProgressRing from "../../../components/player/ProgressRing";
import type { Track } from "../../../content/types";
import { usePlayState } from "../../../hooks/usePlayState";

type Props = {
  track: Track;
  // Outer diameter in px, the dotted orbit included.
  size: number;
  // The Discography's button: it names the album until a song is on, and it keeps the width of a 64 px orb and the word Play, so longer words shrink and what sits beside it never moves.
  album?: boolean;
};

// The rose orb in its dotted orbit, with one word beside it; the orbit fills as a ring while its song is on.
export default function OrbPlay({ track, size, album = false }: Props) {
  const { active, pausable, verb, toggle } = usePlayState(track);
  const inset = Math.round(size * 0.13);

  return (
    <button
      type="button"
      aria-label={`${verb} ${album && !active ? "the album" : track.title}`}
      onClick={toggle}
      className={`group inline-flex shrink-0 items-center gap-[3.6vw] rounded-full pr-2 text-left ${album ? "w-[calc(4.5rem+24.5vw)]" : ""}`}
    >
      <span
        className="relative grid shrink-0 place-items-center"
        style={{ width: size, height: size }}
      >
        {active ? (
          <ProgressRing track={track} size={size} stroke={2} />
        ) : (
          <svg
            viewBox={`0 0 ${size} ${size}`}
            aria-hidden="true"
            className="absolute inset-0 overflow-visible fill-none stroke-rose-300/70"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 1}
              strokeWidth="1.6"
              strokeDasharray="0 6"
              strokeLinecap="round"
            />
          </svg>
        )}
        <span
          className="absolute rounded-full bg-rose-300 shadow-[0_0_30px_-4px_color-mix(in_oklab,var(--color-rose-400)_75%,transparent)] transition-[background-color,scale] duration-300 group-hover:bg-rose-200 group-active:bg-rose-200 motion-ok:group-active:scale-95"
          style={{ inset }}
        />
        <PlayGlyph
          icon={pausable ? "pause" : "play"}
          className={`relative text-night-950 ${pausable ? "size-4" : "ml-1 size-5"}`}
        />
      </span>
      <span
        className={`font-display leading-none tracking-[-0.01em] text-stardust-50 transition-colors duration-300 group-hover:text-rose-200 ${album && active ? "text-[0.875rem] font-bold" : "text-[6.15vw] font-extrabold"}`}
      >
        {verb}
      </span>
    </button>
  );
}
