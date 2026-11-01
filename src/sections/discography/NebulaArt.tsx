import { useId } from "react";
import { seeded } from "./seed";

type Dot = {
  id: string;
  x: number;
  y: number;
  r: number;
  tone: string;
  opacity: number;
};

const tones = [
  "fill-starlight-100",
  "fill-rose-200",
  "fill-rose-300",
  "fill-mauve-200",
] as const;

const PER_ARM = 30;

// Two spiral arms printed as dots like the planet's halftone, plus loose dust; seeded, so it's the same nebula every time.
function spiralDots(): Dot[] {
  const random = seeded("smoochlight");
  const dots: Dot[] = [];
  for (let arm = 0; arm < 2; arm++) {
    for (let index = 0; index < PER_ARM; index++) {
      const t = index / (PER_ARM - 1);
      const angle = arm * Math.PI + t * 2.7 * Math.PI + (random() - 0.5) * 0.25;
      const radius = 5 + 39 * t ** 0.85 + (random() - 0.5) * 3;
      dots.push({
        id: `arm-${arm}-${index}`,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        r: 0.55 + (1 - t) * 1.25 + random() * 0.5,
        tone: tones[Math.floor(random() * tones.length)],
        opacity: 0.95 - t * 0.45,
      });
    }
  }
  for (let index = 0; index < PER_ARM; index++) {
    const angle = random() * Math.PI * 2;
    const radius = 6 + random() * 40;
    dots.push({
      id: `dust-${index}`,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      r: 0.35 + random() * 0.45,
      tone: tones[Math.floor(random() * tones.length)],
      opacity: 0.35 + random() * 0.35,
    });
  }
  return dots;
}

const dots = spiralDots();

type Props = {
  // The arms' group, so a parent can turn them (the cue spins them while hovered).
  armsClassName?: string;
  className?: string;
};

// A small spiral nebula seen at a tilt: a rose cloud, dotted arms and a bright core.
export default function NebulaArt({
  armsClassName = "",
  className = "",
}: Props) {
  const id = useId();
  return (
    <svg
      viewBox="-50 -50 100 100"
      aria-hidden="true"
      className={`overflow-visible ${className}`}
    >
      <defs>
        <radialGradient id={`${id}-cloud`}>
          <stop offset="0" style={{ stopColor: "var(--color-rose-400)" }} stopOpacity={0.6} />
          <stop offset="0.45" style={{ stopColor: "var(--color-mauve-500)" }} stopOpacity={0.28} />
          <stop offset="1" style={{ stopColor: "var(--color-plum-600)" }} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-core`}>
          <stop offset="0" style={{ stopColor: "var(--color-stardust-50)" }} />
          <stop offset="0.35" style={{ stopColor: "var(--color-rose-200)" }} stopOpacity={0.85} />
          <stop offset="1" style={{ stopColor: "var(--color-rose-400)" }} stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform="rotate(-22) scale(1 0.46)">
        <circle r="50" fill={`url(#${id}-cloud)`} />
        <g className={`[transform-box:fill-box] [transform-origin:center] ${armsClassName}`}>
          {dots.map((dot) => (
            <circle
              key={dot.id}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              opacity={dot.opacity}
              className={dot.tone}
            />
          ))}
        </g>
        <circle r="11" fill={`url(#${id}-core)`} />
      </g>
    </svg>
  );
}
