import { AnimatePresence } from "motion/react";
import { use, useRef, type RefObject } from "react";
import { Link } from "react-router";
import { Site } from "../../app/site";
import BigPlayButton from "../../components/player/BigPlayButton";
import PlayButton from "../../components/player/PlayButton";
import PlayingHalo from "../../components/player/PlayingHalo";
import { album, sides, tracks } from "../../content/album";
import { songWords } from "../../content/songWords";
import type { Track } from "../../content/types";
import { usePlayer } from "../../hooks/usePlayer";
import { useTitleFit } from "../../hooks/useTitleFit";
import type { WordsSwap } from "../../hooks/useWordsSwap";
import { formatDuration, isoDuration, sunoSongUrl } from "../../lib/tracks";
import Dissolve from "../Dissolve";
import { StageMotion } from "../stageMotion";
import LyricsToggle from "./LyricsToggle";
import NebulaCue from "./NebulaCue";
import NeighbourLink from "./NeighbourLink";
import { pad2 } from "./sky";
import SingerMark from "./SingerMark";
import SongStar from "./SongStar";
import SunoLink from "./SunoLink";
import SwapPane from "./SwapPane";
import WordsScroll from "./WordsScroll";

const NAVBAR_PX = 64;

type Props = {
  track: Track;
  heading: RefObject<HTMLHeadingElement | null>;
  swap: WordsSwap;
};

// One song as a close-up of its star; it plays here, or alone in the Listening Room from its galaxy. Pressing Lyrics turns the star into the words in the very same place.
export default function SongLayout({ track, heading, swap }: Props) {
  const { current } = usePlayer();
  const { reduced, motionReady } = use(Site);
  const words = songWords[track.slug];
  const open = swap.open && words !== undefined;
  const place = useRef<HTMLDivElement>(null);
  const titleFit = useTitleFit(heading, place, open);
  const index = tracks.indexOf(track);
  const side = sides.find((entry) => entry.id === track.side);
  const direction = open ? 1 : -1;

  // The words sit at the top of the page, so opening them from further down goes up to them.
  function beforePress() {
    const top = place.current?.getBoundingClientRect().top ?? 0;
    if (!open && top < NAVBAR_PX) window.scrollTo(0, 0);
  }

  return (
    <StageMotion value={{ reduced, direction, motionReady }}>
      {/* Wide screens keep room for the longest title (four lines), so the navigation sits in the same place for every song; the others do it in the h1. Below 96rem song 16's longest title and description can meet, so they keep more. */}
      <div className="mx-auto mb-16 grid w-full max-w-[78rem] grid-cols-[minmax(0,1fr)] content-start [--song-room:32.5rem] [grid-template-areas:'head'_'art'_'body'] min-[96rem]:[--song-room:30rem] wide:mb-20 wide:min-h-[calc(var(--song-title)*3.68+var(--song-room))] wide:grid-cols-[minmax(0,1fr)_minmax(0,min(36rem,44vw))] wide:grid-rows-[auto_1fr] wide:gap-x-[clamp(2rem,5vw,5rem)] wide:[grid-template-areas:'head_art'_'body_art'] short:min-h-0 short:grid-cols-[minmax(0,1fr)_min(42vw,calc(100dvh-4rem))] short:grid-rows-[auto_1fr] short:gap-x-[clamp(1.5rem,4vw,3rem)] short:[grid-template-areas:'head_art'_'body_art']">
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
          <p className="mt-6 font-mono text-[0.6875rem] tracking-[0.24em] text-rose-300 uppercase wide:mt-[clamp(1rem,4dvh,2.5rem)] short:mt-1">
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
            style={{ scale: titleFit.scale }}
            className={`mt-3 origin-top-left font-display text-[length:var(--song-title)] leading-[0.92] font-extrabold tracking-[-0.03em] text-balance text-stardust-50 narrow:min-h-[calc(var(--song-title)*2.76)] short:mt-1.5 short:min-h-[calc(var(--song-title)*1.84)] ${titleFit.animates ? "motion-ok:transition-[scale] motion-ok:duration-700 motion-ok:ease-(--ease-condense)" : ""}`}
          >
            {track.title}
          </h1>
        </header>

        {/* The star and the words take turns in this one place; its size comes from the grid, so the swap can't move anything. On narrow screens the art shrinks with the screen height so the orb reaches the first screen, and the body tucks under its faded edge. */}
        <div
          ref={place}
          className="relative -mx-2 mt-4 aspect-square @container [grid-area:art] narrow:-mb-[10%] narrow:w-[min(calc(100%+1rem),max(14rem,calc(100dvh-27rem-10vw)))] narrow:justify-self-end wide:mx-0 wide:mt-0 wide:aspect-auto wide:self-stretch short:mx-0 short:mt-0 short:mb-0 short:aspect-square short:w-auto short:justify-self-stretch short:self-start"
        >
          <AnimatePresence custom={direction} initial={false}>
            {open && words ? (
              // Beside the title, the words fade out just above the planet's rim (its top is at 79dvh in this pose), so they never cross it. On narrow screens they keep the star's height, clear of the body tucked under its edge, take the whole width, and scroll over the planet on a soft band of night.
              <SwapPane
                key="words"
                dust
                className="absolute inset-x-0 top-0 h-full narrow:right-0 narrow:left-auto narrow:h-[calc(100%-5rem)] narrow:w-[calc(100vw-2.75rem)] wide:max-h-[calc(78dvh-clamp(5.5rem,12dvh,7.5rem))] short:right-0 short:left-0 short:h-full short:max-h-[calc(78dvh-4rem)] short:w-auto"
              >
                <Dissolve
                  order={0}
                  className="absolute -inset-y-6 -right-3 -left-8 hidden narrow:block short:hidden"
                >
                  <div className="words-veil size-full" />
                </Dissolve>
                <WordsScroll
                  title={track.title}
                  words={words}
                  swap={swap}
                  className="relative h-full has-[[data-words]:focus-visible]:outline-offset-2"
                  scrollerClassName="pt-3 pr-4 pb-8 narrow:[--words-fade-bottom:2rem] narrow:[--words-fade-top:1.5rem]"
                />
              </SwapPane>
            ) : (
              <SwapPane
                key="star"
                dust
                className="absolute inset-x-0 top-0 aspect-square"
              >
                <Dissolve order={1} className="absolute inset-0">
                  <span
                    aria-hidden="true"
                    className="song-numeral pointer-events-none absolute top-[2%] left-[2%] font-display text-[34cqw] leading-none font-extrabold tracking-[-0.04em] wide:text-[clamp(9rem,15vw,15rem)] short:text-[34cqw]"
                  >
                    {pad2(track.n)}
                  </span>
                </Dissolve>
                <Dissolve order={0} blur className="absolute inset-0">
                  <span data-dust-box className="absolute inset-[28%]" />
                  {current?.slug === track.slug && (
                    <PlayingHalo singer={track.singer} className="size-[46%]" />
                  )}
                  <SongStar track={track} className="relative block w-full" />
                </Dissolve>
              </SwapPane>
            )}
          </AnimatePresence>
        </div>

        {/* Narrow and short screens move the credits below the orb, and keep room for the longest description, so the navigation sits in the same place for every song. */}
        <div className="relative mt-2 flex flex-col [grid-area:body] narrow:min-h-[27rem] wide:mt-6 short:mt-3 short:min-h-[27rem]">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.18em] text-mauve-200 uppercase">
            <SingerMark singer={track.singer} prefix="Sung by " />
            <span aria-hidden="true">·</span>
            <time dateTime={isoDuration(track.durationSec)}>
              {formatDuration(track.durationSec)}
            </time>
          </p>

          <p className="mt-2 font-mono text-[0.625rem] tracking-[0.18em] text-mauve-300 uppercase narrow:order-1 narrow:mt-6 short:order-1 short:mt-6">
            {album.credits} · From the album{" "}
            <span className="text-starlight-200">{album.title}</span>
          </p>

          {words && (
            <p className="mt-3 text-[0.9375rem] leading-[1.5] text-mauve-100 [text-shadow:0_0_10px_var(--color-night-950),0_0_3px_var(--color-night-950)]">
              {words.description.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          )}

          {/* Two ways to listen: right here, or alone in the Listening Room. */}
          <div className="mt-4 flex flex-col items-start gap-2 short:mt-3">
            <div className="flex flex-wrap items-center">
              {/* Wide enough for "Resume", so the word beside it holds still while the song plays. */}
              <div className="min-w-[17.5rem] [&>button]:pr-0">
                <BigPlayButton track={track} />
              </div>
              {words && <LyricsToggle swap={swap} onBeforePress={beforePress} />}
            </div>
            {/* The galaxy lines up under the orb and its label under "Play". */}
            <NebulaCue
              track={track}
              artClassName="mr-4 w-[5.25rem]"
              className="-ml-1 flex-row-reverse"
            />
          </div>
          <p className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
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
    </StageMotion>
  );
}
