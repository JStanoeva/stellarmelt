import type { MouseEvent } from "react";
import { Link } from "react-router";
import type { Track } from "../../content/types";
import { usePlayer } from "../../hooks/usePlayer";
import { useWarp } from "../../hooks/useWarp";
import { listenPath } from "../../lib/tracks";
import NebulaArt from "./NebulaArt";

type Props = {
  // Without a track the cue plays the whole album; with one, only that song.
  track?: Track;
  // Includes the flex direction: the label comes first, the nebula second (flex-col puts the label on top).
  className: string;
  artClassName: string;
};

// The way into the Listening Room: a plain click starts the music and dives into the nebula (FlightLayer); a modified click only follows the link.
export default function NebulaCue({ track, className, artClassName }: Props) {
  const { canPlay, startFromCue } = usePlayer();
  const to = listenPath(track);
  const { onPointerDown, warp } = useWarp(to);

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    const modified =
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey;
    if (modified) return;
    if (canPlay) startFromCue(track ?? null);
    if (warp(event.currentTarget)) event.preventDefault();
  }

  return (
    <Link
      to={to}
      data-visualizer-cue
      onPointerDown={onPointerDown}
      onClick={onClick}
      className={`group flex items-center gap-1 rounded-2xl p-1 text-center ${className}`}
    >
      <span className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.26em] whitespace-nowrap text-starlight-200 uppercase [text-shadow:0_0_10px_var(--color-night-950),0_0_3px_var(--color-night-950)] transition-colors duration-300 group-hover:text-stardust-50">
        Listening Room
        <span
          aria-hidden="true"
          className="text-rose-300 motion-ok:transition-transform motion-ok:duration-300 motion-ok:group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
      <span data-warp-origin className={`block ${artClassName}`}>
        <NebulaArt
          className="block w-full drop-shadow-[0_0_14px_color-mix(in_oklab,var(--color-rose-400)_45%,transparent)] motion-ok:transition-transform motion-ok:duration-500 motion-ok:group-hover:scale-110 motion-ok:group-focus-visible:scale-110"
          armsClassName="nebula-arms"
        />
      </span>
    </Link>
  );
}
