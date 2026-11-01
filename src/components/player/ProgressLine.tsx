import type { Track } from "../../content/types";
import { useSongTime } from "../../hooks/useSongTime";

type Props = { track: Track; className?: string };

// The current row's rule fills with a thin rose line as the song goes on.
export default function ProgressLine({ track, className = "" }: Props) {
  const time = useSongTime();
  const progress = Math.min(time / track.durationSec, 1);
  return (
    <span
      aria-hidden="true"
      style={{ scale: `${progress} 1` }}
      className={`pointer-events-none block h-px origin-left bg-rose-300 shadow-[0_0_6px_1px_color-mix(in_oklab,var(--color-rose-400)_55%,transparent)] motion-ok:transition-[scale] motion-ok:duration-300 motion-ok:ease-linear ${className}`}
    />
  );
}
