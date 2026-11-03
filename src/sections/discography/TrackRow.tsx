import type { CSSProperties } from "react";
import { Link } from "react-router";
import PlayButton from "../../components/player/PlayButton";
import PlayingHalo from "../../components/player/PlayingHalo";
import ProgressLine from "../../components/player/ProgressLine";
import SongDuration from "../../components/player/SongDuration";
import type { Track } from "../../content/types";
import { usePlayer } from "../../hooks/usePlayer";
import { sunoSongUrl } from "../../lib/tracks";
import { magnitude, pad2 } from "./sky";
import SingerMark from "./SingerMark";
import StarDot from "./StarDot";
import SunoLink from "./SunoLink";

type Props = { track: Track };

// Three bars that bob while the song plays (still when paused or under reduced motion); each keeps its own slow beat.
const bars = [
  { id: "low", x: 0, height: 5, beat: "0.95s" },
  { id: "high", x: 4, height: 9, beat: "1.2s" },
  { id: "mid", x: 8, height: 7, beat: "0.8s" },
] as const;

// One song of the tracklist; the current row's star breathes, its time counts up and a rose line fills its rule.
export default function TrackRow({ track }: Props) {
  const { current, status } = usePlayer();
  const active = current?.slug === track.slug;
  const playing = active && status === "playing";

  return (
    <li
      aria-current={active ? "true" : undefined}
      className="sky-rule relative grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-x-3 py-4 [grid-template-areas:'number_main_play'_'number_suno_suno'] wide:grid-cols-[3.75rem_minmax(0,1fr)_auto_auto] wide:gap-x-5 wide:py-5 wide:[grid-template-areas:'number_main_suno_play']"
    >
      <span className="relative flex items-center gap-2.5 self-start pt-1.5 [grid-area:number] wide:self-center wide:pt-0">
        <span
          className={`font-mono text-[0.75rem] tracking-[0.1em] ${active ? "text-rose-200" : "text-mauve-200"}`}
        >
          {pad2(track.n)}
        </span>
        <span className="relative grid size-5 place-items-center">
          {active && <PlayingHalo singer={track.singer} className="size-10" />}
          <StarDot
            singer={track.singer}
            magnitude={Math.min(magnitude(track), 1.2)}
            scale={5}
          />
        </span>
      </span>

      <div className="min-w-0 text-balance [grid-area:main]">
        <Link
          to={`/discography/${track.slug}`}
          className={`font-display text-[1.25rem] leading-tight font-bold decoration-rose-300/70 decoration-1 underline-offset-[0.2em] transition-colors duration-300 hover:text-rose-200 hover:underline wide:text-[1.5rem] ${active ? "text-rose-100" : "text-stardust-50"}`}
        >
          {track.title}
        </Link>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.625rem] tracking-[0.18em] text-mauve-200 uppercase">
          <SingerMark singer={track.singer} />
          <span aria-hidden="true">·</span>
          <SongDuration
            track={track}
            className={active ? "text-starlight-100" : ""}
          />
          {active && (
            <span className="inline-flex items-center gap-2 text-rose-300">
              <svg
                viewBox="0 0 10 9"
                aria-hidden="true"
                className={`h-2.5 w-3 fill-current ${playing ? "" : "opacity-50"}`}
              >
                {bars.map((bar) => (
                  <rect
                    key={bar.id}
                    x={bar.x}
                    y={9 - bar.height}
                    width="2"
                    height={bar.height}
                    rx="1"
                    className={playing ? "sound-bar" : ""}
                    style={{ "--beat": bar.beat } as CSSProperties}
                  />
                ))}
              </svg>
              {status === "paused" ? "Paused" : "Now playing"}
            </span>
          )}
        </p>
      </div>

      <SunoLink
        href={sunoSongUrl(track)}
        className="justify-self-start [grid-area:suno] narrow:min-h-9"
      />
      <PlayButton track={track} look="round" className="[grid-area:play]" />
      {active && (
        <ProgressLine track={track} className="absolute inset-x-0 bottom-px" />
      )}
    </li>
  );
}
