import type { Frame } from "./sky";

type Props = { frame: Frame };

// A planisphere's grid, faintly: dotted circles and meridians around a pole below the map (the planet's centre).
export default function Graticule({ frame }: Props) {
  const cx = frame.width / 2;
  const cy = frame.height * 2.35;
  const rings = [1.45, 1.75, 2.05, 2.4].map((scale) => scale * frame.height);
  const meridians = [-36, -24, -12, 0, 12, 24, 36];
  const reach = frame.height * 2.6;
  return (
    <svg
      aria-hidden="true"
      width={frame.width}
      height={frame.height}
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <g
        className="fill-none stroke-mauve-300/20"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="0 7"
      >
        {rings.map((radius) => (
          <circle key={radius} cx={cx} cy={cy} r={radius} />
        ))}
        {meridians.map((degrees) => {
          const angle = ((degrees - 90) * Math.PI) / 180;
          return (
            <line
              key={degrees}
              x1={cx + Math.cos(angle) * rings[0] * 0.8}
              y1={cy + Math.sin(angle) * rings[0] * 0.8}
              x2={cx + Math.cos(angle) * reach}
              y2={cy + Math.sin(angle) * reach}
            />
          );
        })}
      </g>
    </svg>
  );
}
