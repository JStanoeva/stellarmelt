import { Link } from "react-router";
import type { Track } from "../../content/types";
import { magnitude, pad2 } from "./sky";
import StarDot from "./StarDot";

type Props = { track: Track | undefined; direction: 1 | -1 };

// The previous or next star along the album; at either end of it, an empty space keeps the other one in place.
export default function NeighbourLink({ track, direction }: Props) {
  const next = direction > 0;
  if (!track) return <span className="flex-1" />;
  // On the narrowest phones each side takes a whole row instead of squeezing its title into one-word lines.
  return (
    <Link
      to={`/discography/${track.slug}`}
      // The next song scrolls to the top itself, once this one has faded out.
      preventScrollReset
      rel={next ? "next" : "prev"}
      className={`group block flex-1 rounded-md py-5 max-[24rem]:basis-full ${next ? "text-right" : ""}`}
    >
      <span
        className={`flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.22em] text-mauve-300 uppercase ${next ? "justify-end" : ""}`}
      >
        {!next && (
          <span aria-hidden="true" className="text-rose-300">
            ←
          </span>
        )}
        {next ? "Next star" : "Previous star"}
        {next && (
          <span aria-hidden="true" className="text-rose-300">
            →
          </span>
        )}
      </span>
      <span
        className={`mt-2 flex items-center gap-3 ${next ? "flex-row-reverse" : ""}`}
      >
        <StarDot
          singer={track.singer}
          magnitude={Math.min(magnitude(track), 1.2)}
          scale={6}
        />
        <span className="font-mono text-[0.75rem] text-mauve-200">
          {pad2(track.n)}
        </span>
        <span className="font-display text-[1.125rem] leading-tight font-bold text-stardust-50 transition-colors duration-300 group-hover:text-rose-200 wide:text-[1.5rem]">
          {track.title}
        </span>
      </span>
    </Link>
  );
}
