import { Link } from "react-router";
import type { Track } from "../../../content/types";

type Props = { track: Track | undefined; direction: 1 | -1 };

// One end of the song page's bottom row; at either end of the album an empty space keeps the other one in place.
export default function SongNavLink({ track, direction }: Props) {
  const next = direction > 0;
  if (!track) return <span className="min-w-0 flex-1" />;
  return (
    <Link
      to={`/discography/${track.slug}`}
      // The next song scrolls to the top itself, once this one has faded out.
      preventScrollReset
      rel={next ? "next" : "prev"}
      aria-label={`${next ? "Next" : "Previous"} song: ${track.title}`}
      className={`group flex min-h-14 min-w-0 flex-1 items-center gap-2 rounded-md text-stardust-50 [text-shadow:0_0_10px_var(--color-night-950)] ${next ? "flex-row-reverse text-right" : ""}`}
    >
      <span aria-hidden="true" className="text-[1.125rem]">
        {next ? "→" : "←"}
      </span>
      <span className="min-w-0 font-display text-[0.875rem] leading-[1.15] font-bold text-balance transition-colors duration-300 group-hover:text-rose-200 group-active:text-rose-200">
        {track.title}
      </span>
    </Link>
  );
}
