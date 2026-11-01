import type { Track } from "../../content/types";
import { usePlayer } from "../../hooks/usePlayer";
import { sunoSongUrl } from "../../lib/tracks";
import PlayGlyph from "./PlayGlyph";
import ProgressRing from "./ProgressRing";
import SongDuration from "./SongDuration";

type Props = { track: Track };

const ORB = 84;

// The song page's player: a rose orb in a dotted orbit that fills as a ring for the current song; a Suno link until hosted.
export default function BigPlayButton({ track }: Props) {
  const { current, status, canPlay, toggle } = usePlayer();
  const active = current?.slug === track.slug;
  const pausable = active && status !== "paused";
  let verb = "Play";
  if (active) verb = pausable ? "Pause" : "Resume";
  const classes =
    "group inline-flex items-center gap-5 rounded-full pr-5 text-left";

  const content = (
    <>
      <span className="relative grid size-[5.25rem] shrink-0 place-items-center">
        {active ? (
          <ProgressRing track={track} size={ORB} stroke={2} />
        ) : (
          <svg
            viewBox={`0 0 ${ORB} ${ORB}`}
            aria-hidden="true"
            className="absolute inset-0 overflow-visible fill-none stroke-rose-300/70"
          >
            <circle
              cx={ORB / 2}
              cy={ORB / 2}
              r={ORB / 2 - 1}
              strokeWidth="1.6"
              strokeDasharray="0 6"
              strokeLinecap="round"
            />
          </svg>
        )}
        <span className="absolute inset-[11px] rounded-full bg-rose-300 shadow-[0_0_30px_-4px_color-mix(in_oklab,var(--color-rose-400)_75%,transparent)] transition-colors duration-300 group-hover:bg-rose-200" />
        <PlayGlyph
          icon={pausable ? "pause" : "play"}
          className={`relative text-night-950 ${pausable ? "size-4" : "ml-1 size-5"}`}
        />
      </span>
      <span className="flex flex-col gap-2">
        <span className="font-display text-[1.625rem] leading-none font-extrabold tracking-[-0.01em] text-stardust-50 transition-colors duration-300 group-hover:text-rose-200">
          {verb}
        </span>
        <SongDuration
          track={track}
          className="font-mono text-[0.75rem] tracking-[0.14em] text-mauve-200"
        />
      </span>
    </>
  );

  if (!canPlay) {
    return (
      <a
        href={sunoSongUrl(track)}
        target="_blank"
        rel="noreferrer"
        data-play={track.slug}
        aria-label={`Play ${track.title} on Suno, opens in a new tab`}
        className={classes}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      type="button"
      data-play={track.slug}
      aria-label={`${verb} ${track.title}`}
      onClick={() => toggle(track)}
      className={classes}
    >
      {content}
    </button>
  );
}
