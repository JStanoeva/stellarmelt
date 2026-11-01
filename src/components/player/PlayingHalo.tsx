import type { Singer } from "../../content/types";
import { usePlayer } from "../../hooks/usePlayer";

type Props = { singer: Singer; className?: string };

const glow: Record<Singer, string> = { Tora: "halo-tora", Orion: "halo-orion" };
const ring: Record<Singer, string> = {
  Tora: "border-rose-200",
  Orion: "border-starlight-100",
};

// The current song's star breathes while it plays; paused or with reduced motion it wears a still ring. Size it with className.
export default function PlayingHalo({ singer, className = "" }: Props) {
  const { status } = usePlayer();
  const paused = status === "paused";
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 left-1/2 -translate-1/2 ${className}`}
    >
      {!paused && (
        <>
          <span
            className={`halo-breathe absolute inset-0 rounded-full motion-off:hidden ${glow[singer]}`}
          />
          <span
            className={`halo-ripple absolute inset-[30%] rounded-full border opacity-0 motion-off:hidden ${ring[singer]}`}
          />
        </>
      )}
      <span
        className={`absolute inset-[27%] rounded-full border opacity-80 ${paused ? "" : "motion-ok:hidden"} ${ring[singer]}`}
      />
    </span>
  );
}
