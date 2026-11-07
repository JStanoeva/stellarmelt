import PlayGlyph from "../../../components/player/PlayGlyph";
import ProgressRing from "../../../components/player/ProgressRing";
import type { Track } from "../../../content/types";
import { usePlayState } from "../../../hooks/usePlayState";

type Props = { track: Track };

// The song that's on while another song's page is open (the album moved on, or it started elsewhere): it pauses from here too.
export default function OtherSong({ track }: Props) {
  const { pausable, verb, toggle } = usePlayState(track);

  return (
    <button
      type="button"
      aria-label={`${verb} ${track.title}`}
      onClick={toggle}
      className="flex min-h-11 min-w-0 flex-1 basis-28 items-center gap-1.5 rounded-full text-left"
    >
      <span className="relative grid size-11 shrink-0 place-items-center text-rose-200">
        <ProgressRing track={track} size={36} stroke={1.5} />
        <PlayGlyph
          icon={pausable ? "pause" : "play"}
          className={pausable ? "size-2.5" : "ml-0.5 size-3"}
        />
      </span>
      <span className="min-w-0 text-[0.8125rem] leading-tight text-balance text-mauve-100">
        {track.title}
      </span>
    </button>
  );
}
