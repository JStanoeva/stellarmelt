import { use, useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { Site } from "../../app/site";
import PlayButton from "../../components/player/PlayButton";
import SongDuration from "../../components/player/SongDuration";
import { album, tracks } from "../../content/album";
import type { Track } from "../../content/types";
import FlightToggle from "../../flight/FlightToggle";
import { useFlight } from "../../hooks/useFlight";
import { useIsTall } from "../../hooks/useIsTall";
import { usePlayer } from "../../hooks/usePlayer";
import { usePlayerView } from "../../hooks/usePlayerView";
import { useShowArt } from "../../hooks/useShowArt";
import { sunoSongUrl } from "../../lib/tracks";
import SingerMark from "./SingerMark";
import { pad2 } from "./sky";
import SunoLink from "./SunoLink";

// Three bars that bob while the song plays and hold still while it's paused; each keeps its own slow beat.
const bars = [
  { id: "low", x: 0, height: 5, beat: "0.95s" },
  { id: "high", x: 4, height: 9, beat: "1.2s" },
  { id: "mid", x: 8, height: 7, beat: "0.8s" },
] as const;

// The song room's own song; undefined in the album room.
type Props = { track: Track | undefined };

// The Listening Room over the endless flight (FlightLayer): the whole album, or one song.
export default function ListeningRoom({ track }: Props) {
  const tall = useIsTall();
  // The flight covers the planet, so it waits small and out of the way for the next page.
  useShowArt(tall ? "contact" : "timeline");
  usePlayerView();
  const { reduced } = use(Site);
  const { dive, canFly, registerCruise } = useFlight();
  const { current, status } = usePlayer();
  // Arriving by a dive, the copy condenses in as the camera comes through the galaxy.
  const [arrived] = useState(() => dive !== null && !reduced);

  useEffect(() => registerCruise(), [registerCruise]);

  // The album room shows the song that's on (or the album's first); the song room shows its own song.
  const song = track ?? current ?? tracks[0];
  const isCurrent = current?.slug === song.slug;
  let state: "Now playing" | "Paused" | null = null;
  if (isCurrent) state = status === "paused" ? "Paused" : "Now playing";

  return (
    <div className="relative flex min-h-dvh flex-col justify-end px-5 pt-28 pb-8 wide:px-[clamp(1.25rem,3.4vw,3.5rem)] wide:pb-[clamp(2.25rem,7dvh,4.5rem)]">
      <title>
        {track
          ? `${track.title} · Listening Room · Stellarmelt`
          : "Listening Room · Stellarmelt"}
      </title>
      <div
        aria-hidden="true"
        className="listen-shade pointer-events-none absolute inset-0"
      />

      <div
        className={`relative max-w-[26rem] wide:max-w-[32rem] [text-shadow:0_0_14px_var(--color-night-950),0_0_4px_var(--color-night-950)] ${arrived ? "flight-arrive" : ""}`}
      >
        <p className="font-mono text-[0.6875rem] tracking-[0.24em] text-rose-300 uppercase">
          {track ? (
            <>
              Star {pad2(track.n)} / {tracks.length} · Side {track.side}
            </>
          ) : (
            <>
              Album · <span className="text-starlight-200">{album.title}</span>
            </>
          )}
        </p>
        <h1
          tabIndex={-1}
          className="mt-3 font-display text-[clamp(2.5rem,12vw,3.25rem)] leading-[0.9] font-extrabold tracking-[-0.035em] text-stardust-50 wide:text-[clamp(2.75rem,4.6vw,4.5rem)]"
        >
          <span className="block">Listening</span>{" "}
          <span className="block">Room</span>
        </h1>

        <div className="mt-8">
          <p className="flex min-h-4 items-center gap-2 font-mono text-[0.625rem] tracking-[0.24em] text-starlight-200 uppercase">
            {isCurrent && (
              <svg
                viewBox="0 0 10 9"
                aria-hidden="true"
                className={`h-2.5 w-3 fill-rose-300 ${status === "playing" ? "" : "opacity-50"}`}
              >
                {bars.map((bar) => (
                  <rect
                    key={bar.id}
                    x={bar.x}
                    y={9 - bar.height}
                    width="2"
                    height={bar.height}
                    rx="1"
                    className={status === "playing" ? "sound-bar" : ""}
                    style={{ "--beat": bar.beat } as CSSProperties}
                  />
                ))}
              </svg>
            )}
            {!track && `Star ${pad2(song.n)} / ${tracks.length}`}
            {!track && state && " · "}
            {state}
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] leading-[1.05] font-bold text-balance text-stardust-50 wide:text-[2rem]">
            {song.title}
          </h2>
          <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.625rem] tracking-[0.18em] text-mauve-200 uppercase">
            <SingerMark singer={song.singer} prefix="Sung by " />
            <span aria-hidden="true">·</span>
            <SongDuration
              track={song}
              className={isCurrent ? "text-starlight-100" : ""}
            />
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <PlayButton
              track={song}
              named
              mode={track ? "single" : "album"}
              className="[text-shadow:none]"
            />
            <SunoLink href={sunoSongUrl(song)} />
            {/* Another song is on (Back or Forward led here, or the album moved on): it pauses from here too. */}
            {current && !isCurrent && (
              <PlayButton track={current} named look="ghost" />
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            to={track ? `/discography/${track.slug}` : "/discography"}
            className="group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-starlight-200/45 px-5 text-[0.9rem] font-semibold text-starlight-100 transition-colors duration-300 hover:border-starlight-100 hover:text-stardust-50"
          >
            <span
              aria-hidden="true"
              className="text-rose-300 motion-ok:transition-transform motion-ok:duration-300 motion-ok:group-hover:-translate-x-1"
            >
              ←
            </span>
            {track ? "Back to the song" : "Back to the discography"}
          </Link>
          {/* Reduced motion (or no WebGL) shows a still sky, so there's nothing to pause. */}
          {canFly && !reduced && <FlightToggle />}
        </div>
      </div>
    </div>
  );
}
