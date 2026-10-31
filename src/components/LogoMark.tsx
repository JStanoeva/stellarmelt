type Props = { className?: string };

// The constellation heart (DR-08): one line joins a star on every corner of a faceted heart.
const outline =
  "M32 15 36.8 9.2 45.5 6.5 54 10 58 18.5 56.5 27 46 38.5 32 50.5 18 38.5 7.5 27 6 18.5 10 10 18.5 6.5 27.2 9.2Z";

// Their sizes vary like magnitudes on a star chart.
const stars = [
  { id: "cleft", x: 32, y: 15, r: 1.9 },
  { id: "right-inner", x: 36.8, y: 9.2, r: 1.4 },
  { id: "right-top", x: 45.5, y: 6.5, r: 1.7 },
  { id: "right-side", x: 58, y: 18.5, r: 1.5 },
  { id: "right-waist", x: 56.5, y: 27, r: 1.3 },
  { id: "right-lower", x: 46, y: 38.5, r: 1.8 },
  { id: "tip", x: 32, y: 50.5, r: 2 },
  { id: "left-lower", x: 18, y: 38.5, r: 1.5 },
  { id: "left-waist", x: 7.5, y: 27, r: 1.3 },
  { id: "left-side", x: 6, y: 18.5, r: 1.6 },
  { id: "left-shoulder", x: 10, y: 10, r: 1.4 },
  { id: "left-top", x: 18.5, y: 6.5, r: 2.2 },
  { id: "left-inner", x: 27.2, y: 9.2, r: 1.5 },
] as const;

// A four-point sparkle on the right shoulder.
const brightStar =
  "M54 4C54.6 7.9 56.1 9.4 60 10 56.1 10.6 54.6 12.1 54 16 53.4 12.1 51.9 10.6 48 10 51.9 9.4 53.4 7.9 54 4Z";

// Decorative: the link around it names the site. The line stays 1.75 px at every size (non-scaling stroke).
export default function LogoMark({ className }: Props) {
  return (
    <svg viewBox="4 2.5 56 52" aria-hidden="true" className={className}>
      <path
        d={outline}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <g fill="currentColor">
        {stars.map((star) => (
          <circle key={star.id} cx={star.x} cy={star.y} r={star.r} />
        ))}
      </g>
      <path d={brightStar} className="fill-rose-300" />
    </svg>
  );
}
