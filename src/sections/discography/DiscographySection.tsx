import { album } from "../../content/albums";
import { tracks } from "../../content/songs";

export default function DiscographySection() {
  return (
    <section id="discography" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Discography</h2>
          <p className="mt-2 text-white/80">
            <span className="font-semibold">Album:</span>{" "}
            <span className="bg-gradient-to-r from-[#dd819c] to-[#3b1f52] bg-clip-text text-transparent">
              {album.title}
            </span>
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Album Card */}
          <div className="lg:col-span-1">
            <div className="glass h-full rounded-2xl p-6">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                {/* Your real cover */}
                <img
                  src={album.cover}
                  alt={album.coverAlt}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                {/* Soft brand-tint overlay */}
                <div
                  className="absolute inset-0"
                  aria-hidden="true"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 30% 30%, rgba(221,129,156,.15) 0%, transparent 70%), radial-gradient(50% 60% at 70% 70%, rgba(160,89,135,.12) 0%, transparent 70%), linear-gradient(135deg, rgba(30,20,43,.10), rgba(59,31,82,.10))",
                  }}
                />
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-semibold">{album.title}</h3>
                <p className="text-white/80">{album.blurb}</p>
              </div>
            </div>
          </div>

          {/* Track List */}
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2">
            {tracks.map((t, idx) => (
              <li
                key={t.no}
                className="group reveal"
                data-reveal
                style={{ transitionDelay: `${idx * 90}ms` }}
              >
                <div className="glass flex h-full flex-col justify-between rounded-2xl p-5 transition-transform duration-200 group-hover:-translate-y-1">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    {/* LEFT: icon + text */}
                    <div className="flex items-center gap-3">
                      {/* Glassy note tile */}
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
                          Track {t.no}
                        </p>
                        <h4 className="mt-1 text-lg font-semibold">
                          {t.title}
                        </h4>
                      </div>
                    </div>

                    {/* RIGHT: length pill + play button */}
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium ring-1 ring-white/20"
                        title="Track length"
                      >
                        {t.length}
                      </span>
                      <a
                        href={t.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Play ${t.title} (${t.length}) on Suno (opens in a new tab)`}
                        className="btn rounded-full p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dd819c]"
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

                  {/* One-line about */}
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    {t.about}
                  </p>

                  {/* Decorative progress bar */}
                  <div
                    className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full"
                      style={{
                        width: `${40 + t.no * 12}%`,
                        background: "linear-gradient(90deg, #dd819c, #a05987)",
                      }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
