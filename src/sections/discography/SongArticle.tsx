import { Link } from "react-router";
import BigPlayButton from "../../components/player/BigPlayButton";
import PlayButton from "../../components/player/PlayButton";
import PlayingHalo from "../../components/player/PlayingHalo";
import { album, sides, tracks } from "../../content/album";
import type { Track } from "../../content/types";
import { usePlayer } from "../../hooks/usePlayer";
import { usePlayerView } from "../../hooks/usePlayerView";
import { useShowArt } from "../../hooks/useShowArt";
import { formatDuration, isoDuration, sunoSongUrl } from "../../lib/tracks";
import NebulaCue from "./NebulaCue";
import NeighbourLink from "./NeighbourLink";
import { pad2 } from "./sky";
import SingerMark from "./SingerMark";
import SongStar from "./SongStar";
import SunoLink from "./SunoLink";

type Props = { track: Track };

// One song as a close-up of its star; it plays here, or alone in the Listening Room from its galaxy.
export default function SongArticle({ track }: Props) {
  useShowArt("contact");
  usePlayerView();
  const { current } = usePlayer();
  const index = tracks.indexOf(track);
  const side = sides.find((entry) => entry.id === track.side);

  return (
    <article className="px-5 pt-[5.25rem] pb-12 wide:px-[clamp(1.25rem,3.4vw,3.5rem)] wide:pt-[clamp(5.5rem,12dvh,7.5rem)] wide:pb-16">
      <title>{`${track.title} · Stellarmelt`}</title>
      <div className="mx-auto grid max-w-[78rem] grid-cols-[minmax(0,1fr)] [grid-template-areas:'head'_'art'_'body'] wide:grid-cols-[minmax(0,1fr)_minmax(0,min(36rem,44vw))] wide:grid-rows-[auto_1fr] wide:gap-x-[clamp(2rem,5vw,5rem)] wide:[grid-template-areas:'head_art'_'body_art']">
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
          <p className="mt-6 font-mono text-[0.6875rem] tracking-[0.24em] text-rose-300 uppercase wide:mt-10">
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
            tabIndex={-1}
            className="mt-3 font-display text-[9vw] leading-[0.92] font-extrabold tracking-[-0.03em] text-balance text-stardust-50 wide:text-[clamp(3rem,5.4vw,5.75rem)]"
          >
            {track.title}
          </h1>
        </header>

        <div className="relative -mx-2 mt-4 [grid-area:art] wide:mx-0 wide:mt-0 wide:self-start">
          <span
            aria-hidden="true"
            className="song-numeral pointer-events-none absolute top-[2%] left-[2%] font-display text-[32vw] leading-none font-extrabold tracking-[-0.04em] wide:text-[clamp(9rem,15vw,15rem)]"
          >
            {pad2(track.n)}
          </span>
          {current?.slug === track.slug && (
            <PlayingHalo singer={track.singer} className="size-[46%]" />
          )}
          <SongStar track={track} className="relative block w-full" />
        </div>

        <div className="mt-2 [grid-area:body] wide:mt-8">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.18em] text-mauve-200 uppercase">
            <SingerMark singer={track.singer} prefix="Sung by " />
            <span aria-hidden="true">·</span>
            <time dateTime={isoDuration(track.durationSec)}>
              {formatDuration(track.durationSec)}
            </time>
          </p>
          {track.blurb && (
            <p className="mt-5 max-w-[34ch] font-display text-[1.25rem] leading-[1.35] font-semibold text-starlight-100 wide:text-[1.5rem]">
              {track.blurb}
            </p>
          )}

          <p className="mt-6 font-mono text-[0.625rem] tracking-[0.18em] text-mauve-300 uppercase">
            {album.credits} · From the album{" "}
            <span className="text-starlight-200">{album.title}</span>
          </p>

          {/* Two ways to listen: right here, or alone in the Listening Room. */}
          <div className="mt-8 flex flex-col items-start gap-2">
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
        className="sky-rule mx-auto mt-16 flex max-w-[78rem] items-start justify-between gap-6 pb-1 wide:mt-20"
      >
        <NeighbourLink track={tracks[index - 1]} direction={-1} />
        <NeighbourLink track={tracks[index + 1]} direction={1} />
      </nav>
    </article>
  );
}
