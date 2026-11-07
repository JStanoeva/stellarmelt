import type { Singer } from "../../content/types";
import { singerFill, sparklePath } from "./sky";

type Props = {
  singer: Singer;
  magnitude: number;
  // Diameter in px at magnitude 1.
  scale?: number;
};

// Tora's songs burn rose, Orion's starlight; the glow is two soft rings of the same colour.
const looks: Record<Singer, string> = {
  Tora: "bg-rose-200 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-rose-300)_70%,transparent),0_0_8px_2px_color-mix(in_oklab,var(--color-rose-400)_85%,transparent),0_0_24px_7px_color-mix(in_oklab,var(--color-rose-500)_38%,transparent)]",
  Orion:
    "bg-starlight-100 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-starlight-100)_60%,transparent),0_0_8px_2px_color-mix(in_oklab,var(--color-starlight-200)_80%,transparent),0_0_24px_7px_color-mix(in_oklab,var(--color-starlight-300)_30%,transparent)]",
};

// The brightest stars also wear the logo's sparkle.
export default function StarDot({
  singer,
  magnitude,
  scale = 5,
}: Props) {
  const size = Math.round(magnitude * scale * 10) / 10;
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`relative block shrink-0 rounded-full ${looks[singer]}`}
    >
      {magnitude > 1.4 && (
        <svg
          viewBox="-6 -6 12 12"
          className={`absolute top-1/2 left-1/2 -translate-1/2 overflow-visible opacity-90 ${singerFill[singer]}`}
          style={{ width: size * 4.2, height: size * 4.2 }}
        >
          <path d={sparklePath} />
        </svg>
      )}
    </span>
  );
}
