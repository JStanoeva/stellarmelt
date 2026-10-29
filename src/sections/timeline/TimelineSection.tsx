import { useEffect, useState } from "react";
import { timeline } from "../../content/timeline";

export default function TimelineSection() {
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(0);

  // NEW: pause flag for timeline auto-rotate
  const [isTimelinePaused, setIsTimelinePaused] = useState(false);
  const pauseTimeline = () => setIsTimelinePaused(true);
  const resumeTimeline = () => setIsTimelinePaused(false);

  // NEW: Auto-rotate timeline images every 5s (pausable + reduced motion aware)
  useEffect(() => {
    // Respect Reduced Motion
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
        {/* Two-column layout on lg+ */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {/* Left: timeline content */}
          <div className="lg:col-span-2">
            <h2 className="mb-10 text-3xl font-bold sm:text-4xl">Timeline</h2>
            <ol className="relative ml-3 border-l border-white/20">
              {timeline.map((e, idx) => {
                const isActive = activeTimelineIdx === idx;
                return (
                  <li
                    key={idx}
                    className="mb-10 ml-6"
                    // Pause when pointer is over this event; resume when leaving it
                    onMouseEnter={() => {
                      setActiveTimelineIdx(idx);
                      pauseTimeline();
                    }}
                    onMouseLeave={resumeTimeline}
                  >
                    <span
                      className={`absolute top-0 -left-3 grid h-6 w-6 place-items-center rounded-full ring-2 ${
                        isActive ? "ring-[#dd819c]" : "ring-white/40"
                      }`}
                      style={{
                        background: "linear-gradient(135deg, #dd819c, #a05987)",
                        boxShadow: isActive
                          ? "0 0 24px rgba(221,129,156,0.35)"
                          : "none",
                      }}
                      aria-hidden="true"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    </span>
                    <time className="text-xs tracking-widest text-white/70 uppercase">
                      {e.date}
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
                      {e.title}
                    </h3>
                    <p className="text-white/80">{e.detail}</p>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Right: large-screen image (hidden on mobile/tablet) */}
          <aside className="hidden lg:block">
            {/* sticky keeps the image in view as you scroll the timeline
                also pause rotation while user hovers image */}
            <div
              className="sticky top-28"
              onMouseEnter={pauseTimeline}
              onMouseLeave={resumeTimeline}
            >
              <figure className="glass overflow-hidden rounded-2xl">
                <div className="relative aspect-[3/4] w-full">
                  {/* Base cosmic tint so it looks good even with no image */}
                  <div
                    className="absolute inset-0"
                    aria-hidden="true"
                    style={{
                      background:
                        "radial-gradient(60% 60% at 30% 30%, rgba(221,129,156,.22) 0%, transparent 70%), radial-gradient(50% 60% at 70% 70%, rgba(160,89,135,.22) 0%, transparent 70%), linear-gradient(135deg, rgba(30,20,43,.65), rgba(59,31,82,.65))",
                    }}
                  />

                  {/* Cross-fade stack: one image per event */}
                  {timeline.map((e, idx) => (
                    <img
                      key={idx}
                      src={e.image}
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

                  {/* Soft overlay to unify look */}
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
                    {timeline[activeTimelineIdx].date} •{" "}
                  </span>
                  {timeline[activeTimelineIdx].title}
                </figcaption>
              </figure>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
