import { useId, type CSSProperties } from "react";
import { tracks } from "../../../content/album";
import { usePlayer } from "../../../hooks/usePlayer";
import {
  magnitude,
  segments,
  singerFill,
  sparklePath,
  starPoint,
  trimmed,
} from "../sky";

const frame = { width: 350, height: 96 } as const;
const ignite = { transformBox: "fill-box", transformOrigin: "center" } as const;

type Props = { className?: string };

// The album's two constellations as a picture, not a control; the star of the song that's on wears a ring.
export default function QuietSky({ className = "" }: Props) {
  const id = useId();
  const { current } = usePlayer();
  const glow = { Tora: `${id}-rose`, Orion: `${id}-starlight` } as const;

  return (
    <svg
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      aria-hidden="true"
      className={`overflow-visible ${className}`}
    >
      <defs>
        <radialGradient id={glow.Tora}>
          <stop
            offset="0"
            style={{ stopColor: "var(--color-rose-300)" }}
            stopOpacity={0.55}
          />
          <stop
            offset="1"
            style={{ stopColor: "var(--color-rose-500)" }}
            stopOpacity={0}
          />
        </radialGradient>
        <radialGradient id={glow.Orion}>
          <stop
            offset="0"
            style={{ stopColor: "var(--color-starlight-100)" }}
            stopOpacity={0.5}
          />
          <stop
            offset="1"
            style={{ stopColor: "var(--color-starlight-300)" }}
            stopOpacity={0}
          />
        </radialGradient>
      </defs>
      {segments.map((segment, order) => {
        const lit =
          segment.from.n === current?.n || segment.to.n === current?.n;
        let stroke = segment.dotted
          ? "stroke-mauve-300/70"
          : "stroke-mauve-200/45";
        if (lit) stroke = "stroke-rose-200";
        return (
          <line
            key={segment.id}
            {...trimmed(
              starPoint(segment.from, frame),
              starPoint(segment.to, frame),
              6,
            )}
            pathLength={segment.dotted ? undefined : 1}
            strokeDasharray={segment.dotted ? "0 5" : undefined}
            strokeLinecap="round"
            strokeWidth={segment.dotted ? 1.4 : 0.9}
            style={{ "--order": order } as CSSProperties}
            className={`transition-[stroke] duration-500 ${segment.dotted ? "sky-fade" : "sky-draw"} ${stroke}`}
          />
        );
      })}
      {tracks.map((track, order) => {
        const point = starPoint(track, frame);
        const size = magnitude(track);
        return (
          <g key={track.slug} transform={`translate(${point.x} ${point.y})`}>
            <g
              className="sky-ignite"
              style={{ "--order": order, ...ignite } as CSSProperties}
            >
              <circle r={size * 9} fill={`url(#${glow[track.singer]})`} />
              <circle r={size * 1.9} className={singerFill[track.singer]} />
              {size > 1.4 && (
                <path
                  d={sparklePath}
                  transform="scale(1.5)"
                  opacity="0.9"
                  className={singerFill[track.singer]}
                />
              )}
              {current?.slug === track.slug && (
                <circle
                  r="8"
                  fill="none"
                  strokeWidth="1"
                  className="stroke-rose-200"
                />
              )}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
