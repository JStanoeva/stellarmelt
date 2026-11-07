import { Link } from "react-router";
import PlayGlyph from "../../../components/player/PlayGlyph";
import PlayingHalo from "../../../components/player/PlayingHalo";
import ProgressRing from "../../../components/player/ProgressRing";
import SongDuration from "../../../components/player/SongDuration";
import type { Track } from "../../../content/types";
import { usePlayState } from "../../../hooks/usePlayState";
import { pad2, rowMagnitude } from "../sky";
import StarDot from "../StarDot";

type Props = { track: Track };

// One song: number, star, title (its page), one play button. The time shows only while it's the song that's on.
export default function SongRow({ track }: Props) {
  const { active, pausable, verb, toggle } = usePlayState(track);

  return (
    <li
      aria-current={active ? "true" : undefined}
      className="relative flex items-center"
    >
      <Link
        to={`/discography/${track.slug}`}
        className="group flex min-h-14 min-w-0 flex-1 items-center gap-2.5 rounded-md py-2 [text-shadow:0_0_10px_var(--color-night-950),0_0_3px_var(--color-night-950)]"
      >
        <span
          className={`w-6 shrink-0 font-mono text-[0.75rem] ${active ? "text-rose-200" : "text-mauve-200"}`}
        >
          {pad2(track.n)}{" "}
        </span>
        <span className="relative grid size-5 shrink-0 place-items-center">
          {active && <PlayingHalo singer={track.singer} className="size-10" />}
          <StarDot
            singer={track.singer}
            magnitude={rowMagnitude(track)}
            scale={5}
          />
        </span>
        {/* The time hangs below the title, out of the flow, so pressing Play moves nothing. */}
        <span className="relative min-w-0 pl-0.5">
          <span
            className={`block font-display text-[1.0625rem] leading-[1.15] font-bold text-balance transition-colors duration-300 group-hover:text-rose-200 group-active:text-rose-200 ${active ? "text-rose-100" : "text-stardust-50"}`}
          >
            {track.title}
            <span className="sr-only">, sung by {track.singer}</span>
          </span>
          {active && (
            <SongDuration
              track={track}
              className="absolute top-full left-0.5 font-mono text-[0.6875rem] leading-none whitespace-nowrap text-mauve-200"
            />
          )}
        </span>
      </Link>
      <button
        type="button"
        aria-label={`${verb} ${track.title}`}
        onClick={toggle}
        className="relative grid size-11 shrink-0 place-items-center rounded-full text-rose-300 transition-colors duration-300 hover:text-stardust-50 active:text-stardust-50"
      >
        {active && <ProgressRing track={track} size={36} stroke={1.5} />}
        <PlayGlyph
          icon={pausable ? "pause" : "play"}
          className={pausable ? "size-2.5" : "ml-0.5 size-3"}
        />
      </button>
    </li>
  );
}
