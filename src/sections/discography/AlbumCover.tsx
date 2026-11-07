import { useId } from "react";
import { album, tracks } from "../../content/album";
import { kana } from "../../content/homeSections";
import type { Track } from "../../content/types";
import { seeded } from "./seed";
import { magnitude, segments, singerFill, starPoint, trimmed } from "./sky";

// The dome of sixteen stars, scaled into the cover above the planet's limb.
const dome = { width: 330, height: 98 } as const;
function at(track: Track) {
  const point = starPoint(track, dome);
  return { x: point.x + 35, y: point.y + 216 };
}

// Snow drifting through the sky above the planet: fixed, seeded dots.
const random = seeded("snow-and-the-ai-mind");
const snow = Array.from({ length: 46 }, (_, id) => ({
  id,
  x: 18 + random() * 364,
  y: 20 + random() * 300,
  r: 0.5 + random() * 1.3,
  opacity: 0.25 + random() * 0.6,
}));


type Props = { className?: string };

// The album cover in the site's poster style: the two constellations over a backlit planetrise, snow, the title.
export default function AlbumCover({ className = "" }: Props) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 400 400"
      role="img"
      aria-label={`${album.title} album cover`}
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-night-950)" }} />
          <stop offset="0.7" style={{ stopColor: "var(--color-night-800)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-plum-800)" }} />
        </linearGradient>
        <radialGradient id={`${id}-planet`} cx="0.5" cy="0" r="0.75">
          <stop offset="0" style={{ stopColor: "var(--color-plum-800)" }} />
          <stop offset="0.4" style={{ stopColor: "var(--color-night-800)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-night-950)" }} />
        </radialGradient>
        <pattern
          id={`${id}-dots`}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="4" cy="4" r="1" className="fill-mauve-400" />
        </pattern>
        <radialGradient id={`${id}-fade`} cx="0.5" cy="0.85" r="0.6">
          <stop offset="0" stopColor="white" stopOpacity="0.75" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-halftone`}>
          <rect width="400" height="400" fill={`url(#${id}-fade)`} />
        </mask>
        <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <rect width="400" height="400" fill={`url(#${id}-sky)`} />
      <rect
        width="400"
        height="400"
        fill={`url(#${id}-dots)`}
        mask={`url(#${id}-halftone)`}
        opacity="0.55"
      />

      {snow.map((flake) => (
        <circle
          key={flake.id}
          cx={flake.x}
          cy={flake.y}
          r={flake.r}
          opacity={flake.opacity}
          className="fill-starlight-100"
        />
      ))}

      {/* The planet rising, lit from behind: a dark face under a glowing rose limb. */}
      <circle cx="200" cy="660" r="340" fill={`url(#${id}-planet)`} />
      <circle
        cx="200"
        cy="660"
        r="340"
        fill="none"
        strokeWidth="14"
        filter={`url(#${id}-blur)`}
        className="stroke-rose-400"
        opacity="0.75"
      />
      <circle
        cx="200"
        cy="660"
        r="340"
        fill="none"
        strokeWidth="1.6"
        className="stroke-rose-200"
      />

      {segments.map((segment) => (
        <line
          key={segment.id}
          {...trimmed(at(segment.from), at(segment.to), 5)}
          strokeDasharray={segment.dotted ? "0 4" : undefined}
          strokeLinecap="round"
          strokeWidth={segment.dotted ? 1.4 : 0.9}
          className={
            segment.dotted ? "stroke-mauve-300/80" : "stroke-mauve-200/55"
          }
        />
      ))}
      {tracks.map((track) => {
        const point = at(track);
        return (
          <g key={track.slug}>
            <circle
              cx={point.x}
              cy={point.y}
              r={magnitude(track) * 4.5}
              opacity="0.22"
              className={singerFill[track.singer]}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r={magnitude(track) * 1.8}
              className={singerFill[track.singer]}
            />
          </g>
        );
      })}

      <g
        className="fill-stardust-50 font-display font-extrabold"
        style={{ fontSize: 46, letterSpacing: "-0.03em" }}
      >
        <text x="28" y="74">
          Snow
        </text>
        <text x="28" y="118">
          and the
        </text>
        <text x="28" y="162">
          AI Mind
        </text>
      </g>
      <text
        x="30"
        y="192"
        className="fill-rose-300 font-mono"
        style={{ fontSize: 11, letterSpacing: "0.32em" }}
      >
        {album.artist.toUpperCase()}
      </text>
      <text
        x="370"
        y="32"
        lang="ja"
        className="fill-rose-300 font-kana"
        style={{ fontSize: 17, writingMode: "vertical-rl", letterSpacing: "0.12em" }}
        opacity="0.85"
      >
        {kana}
      </text>
      <rect
        x="11.5"
        y="11.5"
        width="377"
        height="377"
        rx="3"
        fill="none"
        strokeWidth="1"
        className="stroke-starlight-300/25"
      />
    </svg>
  );
}
