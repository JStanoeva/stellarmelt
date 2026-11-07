import type { RefObject } from "react";
import { Link } from "react-router";
import BigPlayButton from "../../components/player/BigPlayButton";
import PlayButton from "../../components/player/PlayButton";
import PlayingHalo from "../../components/player/PlayingHalo";
import { album, sides, tracks } from "../../content/album";
import type { Track } from "../../content/types";
import { usePlayer } from "../../hooks/usePlayer";
import { formatDuration, isoDuration, sunoSongUrl } from "../../lib/tracks";
import NebulaCue from "./NebulaCue";
import NeighbourLink from "./NeighbourLink";
import { pad2 } from "./sky";
import SingerMark from "./SingerMark";
import SongStar from "./SongStar";
import SunoLink from "./SunoLink";

type Props = {
  track: Track;
  heading: RefObject<HTMLHeadingElement | null>;
};

// One song as a close-up of its star; it plays here, or alone in the Listening Room from its galaxy.
export default function SongLayout({ track, heading }: Props) {
  const { current } = usePlayer();
  const index = tracks.indexOf(track);
  const side = sides.find((entry) => entry.id === track.side);

  return (
    <>
      {/* Wide screens keep room for the longest title (four lines), so the navigation sits in the same place for every song; the others do it in the h1. */}
      <div className="mx-auto mb-16 grid w-full max-w-[78rem] grid-cols-[minmax(0,1fr)] content-start [grid-template-areas:'head'_'art'_'body'] wide:mb-20 wide:min-h-[calc(var(--song-title)*3.68+30rem)] wide:grid-cols-[minmax(0,1fr)_minmax(0,min(36rem,44vw))] wide:grid-rows-[auto_1fr] wide:gap-x-[clamp(2rem,5vw,5rem)] wide:[grid-template-areas:'head_art'_'body_art'] short:min-h-0 short:grid-cols-[minmax(0,1fr)_min(42vw,calc(100dvh-4rem))] short:grid-rows-[auto_1fr] short:gap-x-[clamp(1.5rem,4vw,3rem)] short:[grid-template-areas:'head_art'_'body_art']">
        <header className="[grid-area:head]">
          <Link
            to="/discography"
            className="group inline-flex min-h-11 items-center gap-2 font-mono text-[0.6875rem] tracking-[0.2em] text-mauve-200 uppercase transition-colors duration-300 hover:text-starlight-100"
          >
            <span
              aria-hidden="true"
              className="text-rose-300 motion-ok:transition-transform motion-ok:duration-300 motion-ok:group-hover:-translate-x-1"
            >
              ←
            </span>
            Back to the discography
          </Link>
          <p className="mt-6 font-mono text-[0.6875rem] tracking-[0.24em] text-rose-300 uppercase wide:mt-10 short:mt-1">
            Star {pad2(track.n)} / {tracks.length}
            {side && (
              <>
                {" "}
                · Side {side.id} ·{" "}
                <span className="text-starlight-200">{side.name}</span>
              </>
            )}
          </p>
          <h1
            ref={heading}
            tabIndex={-1}
            className="mt-3 font-display text-[length:var(--song-title)] leading-[0.92] font-extrabold tracking-[-0.03em] text-balance text-stardust-50 narrow:min-h-[calc(var(--song-title)*2.76)] short:mt-1.5 short:min-h-[calc(var(--song-title)*1.84)]"
          >
            {track.title}
          </h1>
        </header>

        {/* On narrow screens the art shrinks with the screen height so the orb reaches the first screen, and the body tucks under its faded edge. */}
        <div className="relative -mx-2 mt-4 @container [grid-area:art] narrow:-mb-[10%] narrow:w-[min(calc(100%+1rem),max(14rem,calc(100dvh-27rem-10vw)))] narrow:justify-self-end wide:mx-0 wide:mt-0 wide:self-start short:mx-0 short:mt-0 short:mb-0 short:w-auto short:justify-self-stretch short:self-start">
          <span
            aria-hidden="true"
            className="song-numeral pointer-events-none absolute top-[2%] left-[2%] font-display text-[34cqw] leading-none font-extrabold tracking-[-0.04em] wide:text-[clamp(9rem,15vw,15rem)] short:text-[34cqw]"
          >
            {pad2(track.n)}
          </span>
          {current?.slug === track.slug && (
            <PlayingHalo singer={track.singer} className="size-[46%]" />
          )}
          <SongStar track={track} className="relative block w-full" />
        </div>

        {/* Narrow and short screens move the credits below the orb. */}
        <div className="relative mt-2 flex flex-col [grid-area:body] wide:mt-8 short:mt-3">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.18em] text-mauve-200 uppercase">
            <SingerMark singer={track.singer} prefix="Sung by " />
            <span aria-hidden="true">·</span>
            <time dateTime={isoDuration(track.durationSec)}>
              {formatDuration(track.durationSec)}
            </time>
          </p>

          <p className="mt-6 font-mono text-[0.625rem] tracking-[0.18em] text-mauve-300 uppercase narrow:order-1 short:order-1">
            {album.credits} · From the album{" "}
            <span className="text-starlight-200">{album.title}</span>
          </p>

          {/* Two ways to listen: right here, or alone in the Listening Room. */}
          <div className="mt-8 flex flex-col items-start gap-2 short:mt-3">
            <BigPlayButton track={track} />
            {/* The galaxy lines up under the orb and its label under "Play". */}
            <NebulaCue
              track={track}
              artClassName="mr-4 w-[5.25rem]"
              className="-ml-1 flex-row-reverse"
            />
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            <SunoLink href={sunoSongUrl(track)} />
            {/* Another song is on (the album moved on, or it started on another page): it pauses from here too. */}
            {current && current.slug !== track.slug && (
              <PlayButton track={current} named look="ghost" />
            )}
          </p>
        </div>
      </div>

      <nav
        aria-label="Previous and next song"
        className="sky-rule mx-auto mt-auto flex w-full max-w-[78rem] flex-wrap items-start justify-between gap-x-6 pb-1"
      >
        <NeighbourLink track={tracks[index - 1]} direction={-1} />
        <NeighbourLink track={tracks[index + 1]} direction={1} />
      </nav>
    </>
  );
}
