import { useId, useMemo, type CSSProperties } from "react";
import { tracks } from "../../content/album";
import type { Singer, Track } from "../../content/types";
import { seeded } from "./seed";
import {
  magnitude,
  pad2,
  segments,
  singerFill,
  sparklePath,
  starPoint,
  trimmed,
} from "./sky";

// The neighbourhood is drawn from the same dome, at a scale where neighbours sit 130–190 units away.
const field = { width: 1500, height: 640 } as const;
const VIEW = 300;

const stops: Record<Singer, readonly [string, string]> = {
  Tora: ["var(--color-rose-300)", "var(--color-rose-500)"],
  Orion: ["var(--color-starlight-100)", "var(--color-starlight-300)"],
};

type Spike = { id: string; angle: number; length: number; width: number };
type Ring = { id: string; radius: number; moon: number };
type Glint = { id: string; x: number; y: number; scale: number; angle: number };
type Flare = { base: number; spikes: Spike[]; rings: Ring[]; glints: Glint[] };

// Everything that makes this star its own, from a seed of its slug: spike angle and lengths, rings, glints.
function flareFor(slug: string): Flare {
  const random = seeded(slug);
  const base = random() * 45;
  const spikes: Spike[] = [0, 1, 2, 3].flatMap((index) => [
    {
      id: `long-${index}`,
      angle: base + index * 90,
      length: 150 + random() * 110,
      width: 4.5,
    },
    {
      id: `short-${index}`,
      angle: base + 45 + index * 90,
      length: 55 + random() * 70,
      width: 2.6,
    },
  ]);
  const rings: Ring[] = Array.from(
    { length: 1 + Math.floor(random() * 3) },
    (_, index) => ({
      id: `ring-${index}`,
      radius: 56 + index * 34 + random() * 12,
      moon: random() * Math.PI * 2,
    }),
  );
  const glints: Glint[] = Array.from(
    { length: 3 + Math.floor(random() * 3) },
    (_, index) => {
      const angle = random() * Math.PI * 2;
      const distance = 90 + random() * 150;
      return {
        id: `glint-${index}`,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: 0.9 + random() * 1.3,
        angle: random() * 45,
      };
    },
  );
  return { base, spikes, rings, glints };
}

type Props = {
  track: Track;
  className?: string;
  // Only the star's own flare, without its neighbours: the phone's calmer page.
  alone?: boolean;
};

// A close-up of one song's star: its own flare, the constellation line through it and its neighbouring stars.
export default function SongStar({
  track,
  className = "",
  alone = false,
}: Props) {
  const id = useId();
  const flare = useMemo(() => flareFor(track.slug), [track.slug]);
  const origin = starPoint(track, field);
  const at = (other: Track) => {
    const point = starPoint(other, field);
    return { x: point.x - origin.x, y: point.y - origin.y };
  };
  const [light, deep] = stops[track.singer];
  const neighbours = new Set([track.n - 1, track.n + 1]);

  return (
    <svg
      viewBox={`${-VIEW} ${-VIEW} ${VIEW * 2} ${VIEW * 2}`}
      aria-hidden="true"
      className={`overflow-visible ${className}`}
    >
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" style={{ stopColor: light }} stopOpacity={0.55} />
          <stop offset="0.35" style={{ stopColor: deep }} stopOpacity={0.22} />
          <stop offset="1" style={{ stopColor: deep }} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-core`}>
          <stop offset="0" style={{ stopColor: "var(--color-stardust-50)" }} />
          <stop offset="0.4" style={{ stopColor: light }} stopOpacity={0.9} />
          <stop offset="1" style={{ stopColor: deep }} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-spike`}>
          <stop offset="0" style={{ stopColor: "var(--color-stardust-50)" }} />
          <stop offset="0.25" style={{ stopColor: light }} stopOpacity={0.85} />
          <stop offset="1" style={{ stopColor: light }} stopOpacity={0} />
        </linearGradient>
        <pattern
          id={`${id}-dots`}
          width="11"
          height="11"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="5.5" cy="5.5" r="1.4" className="fill-mauve-400" />
        </pattern>
        <radialGradient id={`${id}-fade`}>
          <stop offset="0.35" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-window`}>
          <circle r={VIEW} fill={`url(#${id}-fade)`} />
        </mask>
      </defs>

      {/* The halftone field and the neighbourhood fade out at the edge of a round window. */}
      <g mask={`url(#${id}-window)`}>
        <rect
          x={-VIEW}
          y={-VIEW}
          width={VIEW * 2}
          height={VIEW * 2}
          fill={`url(#${id}-dots)`}
          opacity={alone ? 0.32 : 0.4}
        />
        {!alone &&
          segments.map((segment) => {
            const own = segment.from.side === track.side;
            const through =
              segment.from.n === track.n || segment.to.n === track.n;
            let tone = "stroke-mauve-200/20";
            if (through) tone = "stroke-rose-200/85";
            else if (own) tone = "stroke-mauve-200/45";
            let width = 1.2;
            if (segment.dotted) width = 2.6;
            else if (through) width = 1.8;
            return (
              <line
                key={segment.id}
                {...trimmed(at(segment.from), at(segment.to), through ? 34 : 12)}
                strokeDasharray={segment.dotted ? "0 9" : undefined}
                strokeLinecap="round"
                strokeWidth={width}
                className={tone}
              />
            );
          })}
        {!alone &&
          tracks
            .filter((other) => other.n !== track.n)
            .map((other) => {
              const point = at(other);
              const near = neighbours.has(other.n);
              return (
                <g key={other.slug} opacity={near ? 1 : 0.6}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={magnitude(other) * 9}
                    opacity="0.18"
                    className={singerFill[other.singer]}
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={magnitude(other) * (near ? 4 : 3)}
                    className={singerFill[other.singer]}
                  />
                  {near && (
                    <text
                      x={point.x + 14}
                      y={point.y - 12}
                      className="fill-mauve-200 font-mono"
                      style={{ fontSize: 17, letterSpacing: "0.1em" }}
                    >
                      {pad2(other.n)}
                    </text>
                  )}
                </g>
              );
            })}
      </g>

      <circle r="170" fill={`url(#${id}-glow)`} />
      {flare.rings.map((ring, order) => (
        <g
          key={ring.id}
          className="flare-ring"
          style={{ "--order": order, transformOrigin: "0px 0px" } as CSSProperties}
        >
          <circle
            r={ring.radius}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="0 9"
            className="stroke-mauve-200/60"
          />
          <circle
            cx={Math.cos(ring.moon) * ring.radius}
            cy={Math.sin(ring.moon) * ring.radius}
            r="4"
            className={singerFill[track.singer]}
          />
        </g>
      ))}
      {flare.spikes.map((spike, order) => (
        <g key={spike.id} transform={`rotate(${spike.angle})`}>
          <path
            d={`M0 ${-spike.width}L${spike.length} 0L0 ${spike.width}Z`}
            fill={`url(#${id}-spike)`}
            className="flare-spike"
            style={
              { "--order": order, transformOrigin: "0px 0px" } as CSSProperties
            }
          />
        </g>
      ))}
      {flare.glints.map((glint) => (
        <path
          key={glint.id}
          d={sparklePath}
          transform={`translate(${glint.x} ${glint.y}) rotate(${glint.angle}) scale(${glint.scale})`}
          opacity="0.75"
          className={singerFill[track.singer]}
        />
      ))}
      <g className="flare-core" style={{ transformOrigin: "0px 0px" }}>
        <circle r="34" fill={`url(#${id}-core)`} />
        <path
          d={sparklePath}
          transform={`rotate(${flare.base}) scale(5.2)`}
          className="fill-stardust-50"
          opacity="0.92"
        />
        <circle r="7" className="fill-stardust-50" />
      </g>
    </svg>
  );
}
