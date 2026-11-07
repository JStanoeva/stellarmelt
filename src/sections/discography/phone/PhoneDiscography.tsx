import { album, sides, tracks } from "../../../content/album";
import { usePlayer } from "../../../hooks/usePlayer";
import SingerMark from "../SingerMark";
import { sideTracks } from "../sky";
import AlbumFold from "./AlbumFold";
import GalaxyCue from "./GalaxyCue";
import OrbPlay from "./OrbPlay";
import QuietSky from "./QuietSky";
import SongRow from "./SongRow";

// The album on a phone: a small sky, its name, one way to play, one way into the Listening Room, then the songs.
export default function PhoneDiscography() {
  const { current } = usePlayer();

  return (
    <div className="[-webkit-tap-highlight-color:transparent]">
      <title>Discography · Stellarmelt</title>
      {/* Rows fade out under the navbar instead of running behind its words. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-20 h-[4.5rem] bg-linear-to-b from-night-950 from-65% to-transparent"
      />

      <header className="px-5 pt-[4.25rem]">
        <QuietSky className="block w-full" />
        <h1
          tabIndex={-1}
          className="mt-5 font-display text-[9.6vw] leading-[0.98] font-extrabold tracking-[-0.03em] text-stardust-50"
        >
          {album.title}
        </h1>
        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="text-[1.0625rem] text-mauve-100">{album.artist}</p>
          {/* The stars' colour key; each row names its singer to screen readers. */}
          <p
            aria-hidden="true"
            className="flex items-center gap-3.5 text-[0.8125rem] text-mauve-200"
          >
            <SingerMark singer="Tora" />
            <SingerMark singer="Orion" />
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <OrbPlay track={current ?? tracks[0]} size={64} album />
          <GalaxyCue artClassName="max-w-16" className="flex-1 justify-end" />
        </div>
      </header>

      <div className="tide mt-3 px-5 pb-16">
        <AlbumFold />
        {sides.map((side) => {
          const songs = sideTracks(side.id);
          return (
            <section
              key={side.id}
              aria-labelledby={`side-${side.id}`}
              className="mt-7"
            >
              <h2 id={`side-${side.id}`}>
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-[5.9vw] leading-tight font-extrabold tracking-[-0.02em] text-stardust-50">
                    {side.name}
                  </span>
                  <span className="pr-3.5 font-mono text-[0.6875rem] tracking-[0.16em] whitespace-nowrap text-rose-300 uppercase max-[22rem]:pr-0">
                    Side {side.id}
                  </span>
                </span>
                <span className="mt-0.5 block text-[0.9375rem] text-mauve-200 italic">
                  {side.subtitle}
                </span>
              </h2>
              <ol start={songs[0].n} className="mt-2">
                {songs.map((track) => (
                  <SongRow key={track.slug} track={track} />
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
