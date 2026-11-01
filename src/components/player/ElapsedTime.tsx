import { useSongTime } from "../../hooks/useSongTime";
import { formatDuration, isoDuration } from "../../lib/tracks";

// The time played of the current song; its own component, so only this re-renders as the song runs.
export default function ElapsedTime() {
  const seconds = Math.floor(useSongTime());
  return <time dateTime={isoDuration(seconds)}>{formatDuration(seconds)}</time>;
}
