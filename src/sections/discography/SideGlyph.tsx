import type { SideId } from "../../content/types";
import { magnitude, segments, sideTracks, starPoint, trimmed } from "./sky";

const frame = { width: 300, height: 90 } as const;
const tone = { Tora: "fill-rose-300", Orion: "fill-starlight-100" } as const;

type Props = { side: SideId; className?: string };

// One side's constellation on its own, cropped from the dome, beside the side's heading.
export default function SideGlyph({ side, className = "" }: Props) {
  const stars = sideTracks(side);
  const points = stars.map((track) => starPoint(track, frame));
  const left = Math.min(...points.map((point) => point.x)) - 8;
  const right = Math.max(...points.map((point) => point.x)) + 8;
  return (
    <svg
      viewBox={`${left} -8 ${right - left} ${frame.height + 16}`}
      aria-hidden="true"
      className={`overflow-visible ${className}`}
    >
      {segments
        .filter((segment) => segment.from.side === side)
        .map((segment) => (
          <line
            key={segment.id}
            {...trimmed(
              starPoint(segment.from, frame),
              starPoint(segment.to, frame),
              4,
            )}
            strokeDasharray={segment.dotted ? "0 4" : undefined}
            strokeLinecap="round"
            strokeWidth={segment.dotted ? 1.4 : 0.9}
            className={
              segment.dotted ? "stroke-mauve-300/70" : "stroke-mauve-200/50"
            }
          />
        ))}
      {stars.map((track, index) => (
        <circle
          key={track.slug}
          cx={points[index].x}
          cy={points[index].y}
          r={magnitude(track) * 2}
          className={tone[track.singer]}
        />
      ))}
    </svg>
  );
}
