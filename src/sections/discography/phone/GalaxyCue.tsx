import type { MouseEvent } from "react";
import { Link } from "react-router";
import type { Track } from "../../../content/types";
import { usePlayer } from "../../../hooks/usePlayer";
import { useWarp } from "../../../hooks/useWarp";
import { isPlainClick } from "../../../lib/clicks";
import { listenPath } from "../../../lib/tracks";
import NebulaArt from "../NebulaArt";

type Props = {
  // Without a track the room plays the whole album; with one, only that song.
  track?: Track;
  artClassName: string;
  className: string;
};

// The way into the Listening Room, as on wider screens: a plain press starts the music and dives into the galaxy.
export default function GalaxyCue({ track, artClassName, className }: Props) {
  const { startFromCue } = usePlayer();
  const to = listenPath(track);
  const { onPointerDown, warp } = useWarp(to);

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!isPlainClick(event)) return;
    startFromCue(track ?? null);
    if (warp(event.currentTarget)) event.preventDefault();
  }

  return (
    <Link
      to={to}
      onPointerDown={onPointerDown}
      onClick={onClick}
      className={`galaxy-cue group flex min-h-11 min-w-0 items-center gap-2 rounded-2xl ${className}`}
    >
      <span
        data-warp-origin
        className={`block min-w-0 flex-1 motion-ok:transition-[scale] motion-ok:duration-300 motion-ok:group-active:scale-110 ${artClassName}`}
      >
        <NebulaArt
          className="block w-full drop-shadow-[0_0_14px_color-mix(in_oklab,var(--color-rose-400)_45%,transparent)]"
          armsClassName="nebula-arms"
        />
      </span>
      <span className="w-min shrink-0 font-mono text-[0.6875rem] leading-[1.5] tracking-[0.16em] text-starlight-200 uppercase transition-colors duration-300 [text-shadow:0_0_10px_var(--color-night-950)] group-hover:text-stardust-50 group-active:text-stardust-50 max-[22rem]:tracking-[0.08em]">
        Listening Room{" "}
        <span aria-hidden="true" className="text-rose-300">
          →
        </span>
      </span>
    </Link>
  );
}
