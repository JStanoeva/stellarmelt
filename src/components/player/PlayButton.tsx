import type { Track } from "../../content/types";
import { usePlayer } from "../../hooks/usePlayer";
import PlayGlyph from "./PlayGlyph";
import ProgressRing from "./ProgressRing";

type Props = {
  track: Track;
  // A pill that stands alone names the song too: Play “Melt”.
  named?: boolean;
  // "pill" for calls to action, "ghost" under a star's caption, "round" for the tracklist's rows.
  look?: "pill" | "ghost" | "round";
  className?: string;
};

const pill =
  "inline-flex min-h-11 min-w-0 max-w-full items-center gap-2.5 rounded-full px-5 text-[0.9375rem] font-semibold transition-colors duration-300";

const looks = {
  pill: `${pill} bg-rose-300 text-night-950 hover:bg-rose-200`,
  ghost: `${pill} border border-rose-300/55 text-rose-200 hover:border-rose-200 hover:text-stardust-50`,
  round:
    "relative grid size-11 shrink-0 place-items-center rounded-full border text-rose-200 transition-colors duration-300 hover:border-rose-200 hover:bg-rose-300/10 hover:text-stardust-50",
} as const;

// Plays, pauses and resumes the song where it's pressed.
export default function PlayButton({
  track,
  named = false,
  look = "pill",
  className = "",
}: Props) {
  const { current, status, toggle } = usePlayer();
  const active = current?.slug === track.slug;
  const pausable = active && status !== "paused";
  let verb = "Play";
  if (active) verb = pausable ? "Pause" : "Resume";
  const title = named ? `“${track.title}”` : track.title;

  if (look === "round") {
    return (
      <button
        type="button"
        data-play={track.slug}
        aria-label={`${verb} ${title}`}
        onClick={() => toggle(track)}
        className={`${looks.round} ${active ? "border-transparent bg-rose-300/10 text-stardust-50" : "border-rose-300/45"} ${className}`}
      >
        {active && <ProgressRing track={track} size={44} stroke={1.75} />}
        <PlayGlyph
          icon={pausable ? "pause" : "play"}
          className={pausable ? "size-2.5" : "ml-0.5 size-3"}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      data-play={track.slug}
      // Without the song's name in the text, the label carries it.
      aria-label={named ? undefined : `${verb} ${title}`}
      onClick={() => toggle(track)}
      className={`${looks[look]} ${className}`}
    >
      <span className="relative grid size-5 shrink-0 place-items-center">
        {active && (
          <ProgressRing
            track={track}
            size={20}
            stroke={1.5}
            tone={look === "pill" ? "night" : "rose"}
          />
        )}
        <PlayGlyph
          icon={pausable ? "pause" : "play"}
          className={pausable ? "size-2" : "size-2.5"}
        />
      </span>
      <span className="min-w-0 truncate">
        {verb}
        {named && ` ${title}`}
      </span>
    </button>
  );
}
