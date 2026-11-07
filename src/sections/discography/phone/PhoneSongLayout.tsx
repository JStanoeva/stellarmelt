import { AnimatePresence } from "motion/react";
import { use, useEffectEvent, useLayoutEffect, type RefObject } from "react";
import { Site } from "../../../app/site";
import PlayButton from "../../../components/player/PlayButton";
import PlayingHalo from "../../../components/player/PlayingHalo";
import SongDuration from "../../../components/player/SongDuration";
import { album, tracks } from "../../../content/album";
import { songWords } from "../../../content/songWords";
import type { Track } from "../../../content/types";
import { usePlayer } from "../../../hooks/usePlayer";
import { useTitleGlide } from "../../../hooks/useTitleGlide";
import type { WordsSwap } from "../../../hooks/useWordsSwap";
import { sunoSongUrl } from "../../../lib/tracks";
import Dissolve from "../../Dissolve";
import { StageMotion } from "../../stageMotion";
import LyricsToggle from "../LyricsToggle";
import SingerMark from "../SingerMark";
import { pad2 } from "../sky";
import SongStar from "../SongStar";
import SunoLink from "../SunoLink";
import SwapPane from "../SwapPane";
import WordsScroll from "../WordsScroll";
import GalaxyCue from "./GalaxyCue";
import OrbPlay from "./OrbPlay";
import OtherSong from "./OtherSong";
import SongNavLink from "./SongNavLink";

type Props = {
  track: Track;
  heading: RefObject<HTMLHeadingElement | null>;
  swap: WordsSwap;
};

// One song on one phone screen: a soft star, its name, a little about it, Play, then previous and next on the planet. Pressing Lyrics dissolves the star and details, the title rises to meet a small Play, and the words fill the screen between them and previous and next.
export default function PhoneSongLayout({ track, heading, swap }: Props) {
  const { current } = usePlayer();
  const { reduced, motionReady } = use(Site);
  const words = songWords[track.slug];
  const open = swap.open && words !== undefined;
  const rememberTitle = useTitleGlide(heading, open, reduced);
  const index = tracks.indexOf(track);
  const other = current && current.slug !== track.slug ? current : null;
  const direction = open ? 1 : -1;

  function beforePress() {
    window.scrollTo(0, 0);
    rememberTitle();
  }

  // The reading column assumes the top of the page, however it arrived: Back, or a turn of the phone.
  const arriveReading = useEffectEvent(() => {
    if (open) window.scrollTo(0, 0);
  });
  useLayoutEffect(() => arriveReading(), []);

  return (
    <StageMotion value={{ reduced, direction, motionReady }}>
      {/* A long title fades out under the navbar instead of running behind its words. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-20 h-[4.5rem] bg-linear-to-b from-night-950 from-65% to-transparent"
      />

      {/* While reading, this column is exactly one screen, and the words scroll inside it. */}
      <div
        className={`relative flex flex-col ${open ? "h-svh flex-none" : "flex-1"}`}
      >
        <AnimatePresence custom={direction} mode="popLayout" initial={false}>
          {!open && (
            // The star and the numeral are one soft picture, clipped at the screen's edges.
            <SwapPane
              key="star"
              dust
              className="relative -mx-5 min-h-24 flex-1 overflow-hidden"
            >
              <div className="absolute top-[54%] left-[66%] aspect-square h-[92%] -translate-1/2">
                <Dissolve order={0} blur className="absolute inset-0">
                  <span data-dust-box className="absolute inset-[26%]" />
                  {current?.slug === track.slug && (
                    <PlayingHalo singer={track.singer} className="size-[46%]" />
                  )}
                  <SongStar
                    track={track}
                    alone
                    className="relative block size-full"
                  />
                </Dissolve>
              </div>
              <Dissolve order={1} className="absolute bottom-1 left-5">
                <span
                  aria-hidden="true"
                  className="song-numeral font-display text-[22vw] leading-none font-extrabold tracking-[-0.04em] opacity-70"
                >
                  {pad2(track.n)}
                </span>
              </Dissolve>
            </SwapPane>
          )}
        </AnimatePresence>

        {/* The open title has the closed one's width in ems, so its lines break the same and the glide is a pure zoom. */}
        <div
          className={
            open ? "mt-[4.5rem] flex items-start justify-between gap-0.5" : ""
          }
        >
          <h1
            ref={heading}
            tabIndex={-1}
            className={`min-w-0 flex-1 origin-top-left font-display font-extrabold tracking-[-0.03em] text-balance text-stardust-50 ${open ? "mt-2.5 max-w-[calc(100%*5.8/9)] text-[5.8vw] leading-[1.04]" : "text-[9vw] leading-[0.95]"}`}
          >
            {track.title}
          </h1>
          <AnimatePresence custom={direction} mode="popLayout" initial={false}>
            {open && (
              <SwapPane
                key="controls"
                className="flex shrink-0 items-center gap-0.5"
              >
                <Dissolve order={1}>
                  <LyricsToggle
                    swap={swap}
                    onBeforePress={beforePress}
                    iconOnly
                  />
                </Dissolve>
                <Dissolve order={2}>
                  <PlayButton track={track} look="round" />
                </Dissolve>
              </SwapPane>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence custom={direction} mode="popLayout" initial={false}>
          {open && words ? (
            <SwapPane
              key="words"
              dust
              className="-mx-5 flex min-h-0 flex-1 flex-col"
            >
              {other && (
                <Dissolve order={1} className="px-5">
                  <OtherSong track={other} />
                </Dissolve>
              )}
              <WordsScroll
                title={track.title}
                words={words}
                swap={swap}
                className="relative min-h-0 flex-1 has-[[data-words]:focus-visible]:-outline-offset-4"
                scrollerClassName="px-5 pt-3 pb-6"
              />
            </SwapPane>
          ) : (
            <SwapPane key="details">
              <Dissolve order={2} className="mt-3">
                <p className="flex flex-wrap items-center gap-x-2 text-[0.9375rem] text-mauve-100">
                  <SingerMark singer={track.singer} prefix="Sung by " />
                  <span aria-hidden="true">·</span>
                  <SongDuration track={track} />
                </p>
              </Dissolve>
              <Dissolve order={3} className="mt-1">
                <p className="text-[max(0.6875rem,3.33vw)] text-mauve-200">
                  {album.credits} <span className="mx-0.5">·</span> From the
                  album {album.title}
                </p>
              </Dissolve>
              {words && (
                <Dissolve order={4} className="mt-2">
                  <p className="text-[0.9375rem] leading-[1.4] text-mauve-100">
                    {words.description.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </Dissolve>
              )}

              <Dissolve order={5} className="mt-3">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <OrbPlay track={track} size={80} />
                  {other && <OtherSong track={other} />}
                  {words && (
                    <LyricsToggle
                      swap={swap}
                      onBeforePress={beforePress}
                      className="ml-auto"
                    />
                  )}
                </div>
              </Dissolve>

              <Dissolve order={6} className="mt-2">
                <div className="flex items-center justify-between gap-3">
                  <GalaxyCue
                    track={track}
                    artClassName="max-w-14"
                    className="flex-1"
                  />
                  <SunoLink
                    href={sunoSongUrl(track)}
                    className="[text-shadow:0_0_10px_var(--color-night-950),0_0_3px_var(--color-night-950)]"
                  />
                </div>
              </Dissolve>
            </SwapPane>
          )}
        </AnimatePresence>

        {/* The padding above follows the planet's rim on stouter screens, so Play and the Listening Room stay clear of it. */}
        <nav
          aria-label="Previous and next song"
          className="mt-auto flex items-center justify-between gap-3 pt-[max(3rem,calc(min(95vw,95svh)_-_38svh_-_3rem))] pb-2"
        >
          <SongNavLink track={tracks[index - 1]} direction={-1} />
          <SongNavLink track={tracks[index + 1]} direction={1} />
        </nav>
      </div>
    </StageMotion>
  );
}
