import { useEffect, useState } from "react";
import { timeline } from "../../content/timeline";
import { formatDate } from "../../lib/dates";

export default function TimelineSection() {
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(0);
  const [isTimelinePaused, setIsTimelinePaused] = useState(false);
  const pauseTimeline = () => setIsTimelinePaused(true);
  const resumeTimeline = () => setIsTimelinePaused(false);
  const activeEvent = timeline[activeTimelineIdx];

  useEffect(() => {
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || isTimelinePaused) return;

    const id = window.setInterval(() => {
      setActiveTimelineIdx((i) => (i + 1) % timeline.length);
    }, 5000);

    return () => window.clearInterval(id);
  }, [isTimelinePaused]);

  return (
    <section id="timeline" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-10 text-3xl font-bold sm:text-4xl">Timeline</h2>
            <ol className="relative ml-3 border-l border-white/20">
              {timeline.map((event, idx) => {
                const isActive = activeTimelineIdx === idx;
                return (
                  <li
                    key={event.id}
                    className="mb-10 ml-6"
                    onMouseEnter={() => {
                      setActiveTimelineIdx(idx);
                      pauseTimeline();
                    }}
                    onMouseLeave={resumeTimeline}
                  >
                    <span
                      className={`absolute top-0 -left-3 grid h-6 w-6 place-items-center rounded-full ring-2 ${
                        isActive ? "ring-v1-rose" : "ring-white/40"
                      }`}
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-v1-rose), var(--color-v1-violet))",
                        boxShadow: isActive
                          ? "0 0 24px rgba(221,129,156,0.35)"
                          : "none",
                      }}
                      aria-hidden="true"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    </span>
                    <time className="text-xs tracking-widest text-white/70 uppercase">
                      {formatDate(event.date)}
                    </time>
                    <h3
                      tabIndex={0}
                      className={`mt-1 text-lg font-semibold transition-colors outline-none ${
                        isActive ? "text-white" : ""
                      }`}
                      onFocus={() => {
                        setActiveTimelineIdx(idx);
                        pauseTimeline();
                      }}
                      onBlur={resumeTimeline}
                    >
                      {event.title}
                    </h3>
                    <p className="text-white/80">{event.summary}</p>
                  </li>
                );
              })}
            </ol>
          </div>

          <aside className="hidden lg:block">
            <div
              className="sticky top-28"
              onMouseEnter={pauseTimeline}
              onMouseLeave={resumeTimeline}
            >
              <figure className="glass overflow-hidden rounded-2xl">
                <div className="relative aspect-[3/4] w-full">
                  <div
                    className="absolute inset-0"
                    aria-hidden="true"
                    style={{
                      background:
                        "radial-gradient(60% 60% at 30% 30%, rgba(221,129,156,.22) 0%, transparent 70%), radial-gradient(50% 60% at 70% 70%, rgba(160,89,135,.22) 0%, transparent 70%), linear-gradient(135deg, rgba(30,20,43,.65), rgba(59,31,82,.65))",
                    }}
                  />

                  {timeline.map((event, idx) => (
                    <img
                      key={event.id}
                      src={event.image}
                      alt=""
                      aria-hidden="true"
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
                        activeTimelineIdx === idx ? "opacity-100" : "opacity-0"
                      }`}
                      onError={(ev) => {
                        (ev.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  ))}

                  <div
                    className="pointer-events-none absolute inset-0"
                    aria-hidden="true"
                    style={{
                      background:
                        "radial-gradient(70% 70% at 50% 30%, rgba(255,255,255,.10) 0%, transparent 60%), linear-gradient(0deg, rgba(0,0,0,.15), rgba(0,0,0,.15))",
                    }}
                  />
                </div>

                <figcaption
                  className="px-4 py-3 text-center text-sm text-white/80"
                  aria-live="polite"
                >
                  <span className="opacity-70">
                    {formatDate(activeEvent.date)} •{" "}
                  </span>
                  {activeEvent.title}
                </figcaption>
              </figure>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
