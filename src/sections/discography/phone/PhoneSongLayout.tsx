import type { RefObject } from "react";
import PlayingHalo from "../../../components/player/PlayingHalo";
import SongDuration from "../../../components/player/SongDuration";
import { album, tracks } from "../../../content/album";
import type { Track } from "../../../content/types";
import { usePlayer } from "../../../hooks/usePlayer";
import { sunoSongUrl } from "../../../lib/tracks";
import SingerMark from "../SingerMark";
import { pad2 } from "../sky";
import SongStar from "../SongStar";
import SunoLink from "../SunoLink";
import GalaxyCue from "./GalaxyCue";
import OrbPlay from "./OrbPlay";
import OtherSong from "./OtherSong";
import SongNavLink from "./SongNavLink";

type Props = {
  track: Track;
  heading: RefObject<HTMLHeadingElement | null>;
};

// One song on one phone screen: a soft star, its name, one line about it, Play, then previous and next on the planet.
export default function PhoneSongLayout({ track, heading }: Props) {
  const { current } = usePlayer();
  const index = tracks.indexOf(track);

  return (
    <>
      {/* A long title fades out under the navbar instead of running behind its words. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-20 h-[4.5rem] bg-linear-to-b from-night-950 from-65% to-transparent"
      />

      {/* The star and the numeral are one soft picture, clipped at the screen's edges. */}
      <div
        aria-hidden="true"
        className="relative -mx-5 min-h-24 flex-1 overflow-hidden"
      >
        <div className="absolute top-[54%] left-[66%] aspect-square h-[92%] -translate-1/2">
          {current?.slug === track.slug && (
            <PlayingHalo singer={track.singer} className="size-[46%]" />
          )}
          <SongStar track={track} alone className="relative block size-full" />
        </div>
        <span className="song-numeral absolute bottom-1 left-5 font-display text-[22vw] leading-none font-extrabold tracking-[-0.04em] opacity-70">
          {pad2(track.n)}
        </span>
      </div>

      <h1
        ref={heading}
        tabIndex={-1}
        className="font-display text-[9vw] leading-[0.95] font-extrabold tracking-[-0.03em] text-balance text-stardust-50"
      >
        {track.title}
      </h1>
      <p className="mt-3 flex flex-wrap items-center gap-x-2 text-[0.9375rem] text-mauve-100">
        <SingerMark singer={track.singer} prefix="Sung by " />
        <span aria-hidden="true">·</span>
        <SongDuration track={track} />
      </p>
      <p className="mt-1 text-[max(0.6875rem,3.33vw)] text-mauve-200">
        {album.credits} <span className="mx-0.5">·</span> From the album{" "}
        {album.title}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <OrbPlay track={track} size={80} />
        {current && current.slug !== track.slug && (
          <OtherSong track={current} />
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <GalaxyCue track={track} artClassName="max-w-14" className="flex-1" />
        <SunoLink
          href={sunoSongUrl(track)}
          className="[text-shadow:0_0_10px_var(--color-night-950),0_0_3px_var(--color-night-950)]"
        />
      </div>

      {/* The padding above follows the planet's rim on stouter screens, so Play and the Listening Room stay clear of it. */}
      <nav
        aria-label="Previous and next song"
        className="mt-auto flex items-center justify-between gap-3 pt-[max(3rem,calc(min(95vw,95svh)_-_38svh_-_3rem))] pb-2"
      >
        <SongNavLink track={tracks[index - 1]} direction={-1} />
        <SongNavLink track={tracks[index + 1]} direction={1} />
      </nav>
    </>
  );
}
