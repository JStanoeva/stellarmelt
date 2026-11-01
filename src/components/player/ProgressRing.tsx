import type { Track } from "../../content/types";
import { usePlayer } from "../../hooks/usePlayer";
import { useSongTime } from "../../hooks/useSongTime";

type Props = {
  track: Track;
  // Outer diameter and line width in px; the ring is centred on its positioned parent.
  size: number;
  stroke: number;
  // "night" on the filled rose buttons, "rose" on the dark ones.
  tone?: "rose" | "night";
};

const tones = {
  rose: { rail: "stroke-rose-300/20", arc: "stroke-rose-200" },
  night: { rail: "stroke-night-950/15", arc: "stroke-night-950" },
} as const;

// For the current song: an arc that goes once round over the song; while it loads, a short dash turns instead.
export default function ProgressRing({
  track,
  size,
  stroke,
  tone = "rose",
}: Props) {
  const { status } = usePlayer();
  const time = useSongTime();
  const progress = Math.min(time / track.durationSec, 1);
  const circle = {
    cx: size / 2,
    cy: size / 2,
    r: (size - stroke) / 2,
    strokeWidth: stroke,
    pathLength: 1,
  };
  const { rail, arc } = tones[tone];

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 -translate-1/2 -rotate-90 overflow-visible fill-none"
    >
      <circle {...circle} className={rail} />
      {status === "loading" ? (
        <circle
          {...circle}
          strokeDasharray="0.18 0.82"
          strokeLinecap="round"
          className={`ring-spin motion-off:hidden ${arc}`}
        />
      ) : (
        <circle
          {...circle}
          strokeDasharray="1 1"
          strokeDashoffset={1 - progress}
          strokeLinecap={progress > 0 ? "round" : "butt"}
          className={`motion-ok:transition-[stroke-dashoffset] motion-ok:duration-300 motion-ok:ease-linear ${arc}`}
        />
      )}
    </svg>
  );
}
