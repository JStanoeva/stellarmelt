import type { Song } from "../../content/types";
import { useInView } from "../../hooks/useInView";
import { formatDuration } from "../../lib/dates";

type TrackCardProps = {
  song: Song;
  index: number;
};

export default function TrackCard({ song, index }: TrackCardProps) {
  const { ref, inView } = useInView<HTMLLIElement>();
  const length = formatDuration(song.durationSec);

  return (
    <li
      ref={ref}
      className={inView ? "group reveal reveal-visible" : "group reveal"}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="glass flex h-full flex-col justify-between rounded-2xl p-5 transition-transform duration-200 group-hover:-translate-y-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="glass relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl">
              <div
                className="pointer-events-none absolute inset-0 rounded-xl"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(80% 80% at 20% 20%, rgba(221,129,156,0.14) 0%, transparent 60%), radial-gradient(80% 80% at 80% 80%, rgba(160,89,135,0.14) 0%, transparent 60%)",
                }}
              />
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                <circle
                  cx="6"
                  cy="18"
                  r="3"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <circle
                  cx="18"
                  cy="17"
                  r="3"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path fill="currentColor" d="M21 3 9 6v4l12-3V3z" />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 18v-8m12 7V7M9 10V6l12-3v4M9 10l12-3"
                />
              </svg>
            </div>

            <div>
              <p className="text-xs tracking-widest text-white/70 uppercase">
                Track {song.trackNo}
              </p>
              <h4 className="mt-1 text-lg font-semibold">{song.title}</h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium ring-1 ring-white/20"
              title="Track length"
            >
              {length}
            </span>
            <a
              href={song.sunoShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Play ${song.title} (${length}) on Suno (opens in a new tab)`}
              className="btn rounded-full p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-v1-rose"
              title="Play on Suno"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </a>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-white/80">
          {song.blurb}
        </p>

        <div
          className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10"
          aria-hidden="true"
        >
          <div
            className="h-full"
            style={{
              width: `${40 + song.trackNo * 12}%`,
              background:
                "linear-gradient(90deg, var(--color-v1-rose), var(--color-v1-violet))",
            }}
          />
        </div>
      </div>
    </li>
  );
}
