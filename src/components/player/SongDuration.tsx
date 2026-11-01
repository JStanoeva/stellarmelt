import type { Track } from "../../content/types";
import { usePlayer } from "../../hooks/usePlayer";
import { formatDuration, isoDuration } from "../../lib/tracks";
import ElapsedTime from "./ElapsedTime";

type Props = { track: Track; className?: string };

// The song's length; while it's the current song, the time played stands before it: "1:23 / 4:33".
export default function SongDuration({ track, className = "" }: Props) {
  const { current } = usePlayer();
  return (
    <span className={`tabular-nums ${className}`}>
      {current?.slug === track.slug && (
        <>
          <ElapsedTime />
          <span aria-hidden="true"> / </span>
          <span className="sr-only"> of </span>
        </>
      )}
      <time dateTime={isoDuration(track.durationSec)}>
        {formatDuration(track.durationSec)}
      </time>
    </span>
  );
}
