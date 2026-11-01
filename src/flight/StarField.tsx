import { useMemo } from "react";
import { seeded } from "../sections/discography/seed";

const tones = [
  "bg-stardust-50",
  "bg-starlight-200",
  "bg-rose-200",
  "bg-mauve-200",
] as const;

type Props = { seed: string; count: number };

// A fixed scatter of small stars in percentages, so it fills any size; seeded, so every render is the same sky.
export default function StarField({ seed, count }: Props) {
  const stars = useMemo(() => {
    const random = seeded(seed);
    return Array.from({ length: count }, (_, id) => ({
      id,
      left: `${random() * 100}%`,
      top: `${random() * 100}%`,
      size: random() < 0.12 ? 2.5 : random() < 0.4 ? 1.6 : 1,
      opacity: 0.35 + random() * 0.6,
      tone: tones[Math.floor(random() * tones.length)],
    }));
  }, [seed, count]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {stars.map((star) => (
        <span
          key={star.id}
          className={`absolute rounded-full ${star.tone}`}
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}
