import { Link } from "react-router";
import PlayButton from "../../components/player/PlayButton";
import { sides, tracks } from "../../content/album";
import type { Track } from "../../content/types";
import { formatDuration, isoDuration } from "../../lib/tracks";
import { pad2 } from "./sky";
import SingerMark from "./SingerMark";

type Props = { track: Track; className?: string };

// The selected star's song, set under the dome like the legend on a star chart; its button plays, pauses and resumes it.
export default function StarCaption({ track, className = "" }: Props) {
  const side = sides.find((entry) => entry.id === track.side);
  return (
    <div aria-live="polite" className={className}>
      <p className="font-mono text-[0.625rem] tracking-[0.24em] text-rose-300 uppercase">
        Star {pad2(track.n)} / {tracks.length}
        {side && ` · Side ${side.id} · ${side.name}`}
      </p>
      <h3 className="mt-2 font-display text-[1.75rem] leading-[1.02] font-extrabold tracking-[-0.02em] text-stardust-50 wide:text-[2.25rem]">
        {track.title}
      </h3>
      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.625rem] tracking-[0.18em] text-mauve-200 uppercase wide:justify-center">
        <SingerMark singer={track.singer} prefix="Sung by " />
        <span aria-hidden="true">·</span>
        <time dateTime={isoDuration(track.durationSec)}>
          {formatDuration(track.durationSec)}
        </time>
      </p>
      {track.blurb && (
        <p className="mx-auto mt-3 max-w-[38ch] text-[1rem] leading-[1.55] text-mauve-100 wide:text-[1.0625rem]">
          {track.blurb}
        </p>
      )}
      <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 wide:justify-center">
        <PlayButton track={track} look="ghost" />
        <Link
          to={`/discography/${track.slug}`}
          className="group inline-flex min-h-11 items-center gap-2 font-mono text-[0.6875rem] tracking-[0.2em] text-starlight-100 uppercase underline-offset-[0.6em] hover:underline"
        >
          Song page
          <span
            aria-hidden="true"
            className="text-rose-300 motion-ok:transition-transform motion-ok:duration-300 motion-ok:group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </p>
    </div>
  );
}
