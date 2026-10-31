import { useId } from "react";
import type { MoonLook } from "./moonLooks";

type Props = { look: MoonLook; className?: string };

const bodyStops = [0, 0.3, 0.58, 0.84, 1] as const;

// A small glossy planet lit from the front left, with the same rim glow and soft sheen as the big one.
export default function MoonArt({ look, className = "" }: Props) {
  const id = useId();
  const bodyId = `${id}-body`;
  const glowId = `${id}-glow`;
  const sheenId = `${id}-sheen`;
  return (
    <svg viewBox="-32 -32 64 64" aria-hidden="true" className={`overflow-visible ${className}`}>
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0.62" style={{ stopColor: look.glow }} stopOpacity={0.55} />
          <stop offset="1" style={{ stopColor: look.glow }} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={bodyId} cx="0.34" cy="0.3" r="0.82">
          {bodyStops.map((offset, index) => (
            <stop key={offset} offset={offset} style={{ stopColor: look.body[index] }} />
          ))}
        </radialGradient>
        <radialGradient id={sheenId}>
          <stop offset="0" style={{ stopColor: "var(--color-stardust-50)" }} stopOpacity={0.55} />
          <stop offset="1" style={{ stopColor: "var(--color-stardust-50)" }} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle r="32" fill={`url(#${glowId})`} />
      <circle r="24" fill={`url(#${bodyId})`} />
      <circle r="23.4" fill="none" strokeWidth={1.2} strokeOpacity={0.32} className="stroke-rose-200" />
      <ellipse cx="-8" cy="-10" rx="9" ry="6" transform="rotate(-38 -8 -10)" fill={`url(#${sheenId})`} />
    </svg>
  );
}
