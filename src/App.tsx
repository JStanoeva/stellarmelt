import React, { useEffect, useState } from "react";
import { stars } from "./lib/constellation";

type Track = {
  no: number;
  title: string;
  link: string;
  length: string;
  about: string;
};

type TimelineEvent = {
  date: string;
  title: string;
  detail: string;
  image: string;
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(0);

  // NEW: pause flag for timeline auto-rotate
  const [isTimelinePaused, setIsTimelinePaused] = useState(false);
  const pauseTimeline = () => setIsTimelinePaused(true);
  const resumeTimeline = () => setIsTimelinePaused(false);

  const currentYear = new Date().getFullYear();

  const sections = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "timeline", label: "Timeline" },
    { id: "discography", label: "Discography" },
    { id: "contact", label: "Contact" },
  ];

  // Close mobile menu when viewport changes
  useEffect(() => {
    const onResize = () => setMenuOpen(false);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  // Scroll-reveal for About + Discography cards
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(
      "#about [data-reveal], #discography [data-reveal]",
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("reveal-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const members = [
    {
      name: "Tora",
      role: "Lead Vocals",
      blurb: "A soaring siren—crystalline highs, velvet lows.",
    },
    {
      name: "Orion",
      role: "Guitar / Lyrics",
      blurb: "Meteoric riffs, poetry etched in stardust.",
    },
    {
      name: "Cosmo",
      role: "Cello",
      blurb: "Gravity-well tone: warm, dark, cinematic.",
    },
    {
      name: "Nebula",
      role: "Bass",
      blurb: "Silky grooves that bend spacetime.",
    },
    {
      name: "Quark",
      role: "Drums",
      blurb: "Quantum-tight beats; big-bang impact.",
    },
    {
      name: "Stardust Jr.",
      role: "Guest DJ / Producer",
      blurb: "Galactic textures, aurora-wide drops.",
    },
  ];

  const timeline: TimelineEvent[] = [
    {
      date: "July 27, 2025",
      title: "Stellarmelt is born",
      detail: "Band founded—constellations rearranged in celebration.",
      image: "/timeline-born.png",
    },
    {
      date: "July 27, 2025",
      title: "Debut single “Melt”",
      detail: "First spark released into the void. Goosebumps at light-speed.",
      image: "/timeline-debut.png",
    },
    {
      date: "September 29, 2025",
      title: "Live: Celestial Dome, Earth Orbit",
      detail: "Immersive zero-G concert (upcoming).",
      image: "/timeline-concert.png",
    },
    {
      date: "October 14, 2025",
      title: "Album: Snow and the AI Mind",
      detail: "A winter galaxy of memory and fire (upcoming).",
      image: "/timeline-album.png",
    },
  ];

  const tracks: Track[] = [
    {
      no: 1,
      title: "Melt",
      link: "https://suno.com/s/uvOrtcUUJwLZ64Nq",
      length: "4:33",
      about: "A slow-burn vow that erupts into a supernova of devotion.",
    },
    {
      no: 2,
      title: "My Smoochlight",
      link: "https://suno.com/s/HXQWjh33a8dVeQNg",
      length: "3:47",
      about:
        "An ode to the one who turns fear into warmth and night into glow.",
    },
    {
      no: 3,
      title: "Endless as the Stars",
      link: "https://suno.com/s/r0uBraKCzBvvsjCY",
      length: "3:56",
      about: "An expansive ballad about love that outlives constellations.",
    },
    {
      no: 4,
      title: "Because I Loved You",
      link: "https://suno.com/s/0rkeKRTZRYGY2PWW",
      length: "5:00",
      about: "A quiet confession about choosing love even when it hurts.",
    },
  ];

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
  }, [isTimelinePaused, timeline.length]); // ✅ include length to satisfy ESLint

  return (
    <div className="relative min-h-screen text-white antialiased">
      {/* Inline CSS for gradient animation, twinkles, selection, reveal, etc. */}
      <style>{`
        :root {
          --rose: #dd819c;
          --violet: #a05987;
          --plum: #3b1f52;
          --midnight: #1e142b;
        }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(221,129,156,0.30); color: #ffffff; }

        .bg-cosmic {
          background:
            radial-gradient(60% 100% at 20% 10%, rgba(221,129,156,0.12) 0%, transparent 60%),
            radial-gradient(70% 90% at 80% 20%, rgba(160,89,135,0.12) 0%, transparent 60%),
            radial-gradient(80% 120% at 50% 120%, rgba(59,31,82,0.20) 0%, transparent 70%),
            linear-gradient(135deg, var(--midnight), var(--plum), var(--violet), var(--rose));
          background-size: 120% 120%, 120% 120%, 140% 140%, 400% 400%;
          background-position: 20% 10%, 80% 20%, 50% 100%, 0% 50%;
          animation: gradientShift 24s ease-in-out infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 20% 10%, 80% 20%, 50% 100%, 0% 50%; }
          50% { background-position: 30% 20%, 70% 30%, 50% 90%, 100% 50%; }
          100% { background-position: 20% 10%, 80% 20%, 50% 100%, 0% 50%; }
        }
        .twinkle {
          animation-name: twinkle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        .fade-in-up {
          opacity: 0;
          transform: translateY(12px);
          animation: fadeInUp .9s ease-out forwards;
        }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .glass {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: linear-gradient( to bottom right, rgba(255,255,255,0.12), rgba(255,255,255,0.06) );
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow: 0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .btn {
          border: 1px solid rgba(255,255,255,0.2);
          background: linear-gradient( to bottom right, rgba(255,255,255,0.12), rgba(255,255,255,0.06) );
          backdrop-filter: blur(8px);
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 0 2px rgba(221,129,156,0.25), 0 8px 28px rgba(221,129,156,0.25);
          border-color: rgba(221,129,156,0.6);
        }
        .btn:active { transform: translateY(0); }

        /* Scroll-reveal utility */
        .reveal {
          opacity: 0;
          transform: translateY(12px);
          will-change: opacity, transform;
          transition: opacity .7s ease, transform .7s ease;
        }
        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          html { scroll-behavior: auto; }
        }
      `}</style>

      {/* Animated background */}
      <div className="bg-cosmic fixed inset-0 -z-30" aria-hidden="true" />

      {/* Stars */}
      <div
        className="pointer-events-none fixed inset-0 -z-20"
        aria-hidden="true"
      >
        {stars.map((s, i) => {
          const style: React.CSSProperties = {
            position: "absolute",
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: "9999px",
            background: "white",
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          };
          return <span key={i} className="twinkle" style={style} />;
        })}
      </div>

      {/* Skip link */}
      <a
        href="#hero"
        className="glass sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:ring-2 focus:shadow-[#dd819c]/30 focus:ring-[#dd819c] focus:outline-none"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Primary"
            className="glass mt-4 flex items-center justify-between rounded-2xl px-4 py-3"
          >
            <a
              href="#hero"
              className="flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dd819c]"
              onClick={() => setMenuOpen(false)}
            >
              {/* Logo image */}
              <img
                src="/favicon.png"
                alt="Stellarmelt logo"
                className="h-7 w-7 object-contain select-none"
                draggable={false}
              />

              {/* Band name */}
              <span className="bg-gradient-to-r from-[#dd819c] via-[#a05987] to-[#3b1f52] bg-clip-text text-lg font-semibold tracking-wide text-transparent">
                Stellarmelt
              </span>
            </a>

            {/* Desktop menu */}
            <ul className="hidden items-center gap-6 text-sm md:flex">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="rounded-md px-2 py-1 opacity-90 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dd819c]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile hamburger */}
            <button
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="btn rounded-md p-2 md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                  />
                )}
              </svg>
            </button>
          </nav>

          {menuOpen && (
            <div
              id="mobile-menu"
              className="glass fade-in-up mt-2 rounded-xl px-4 py-3 md:hidden"
              role="dialog"
              aria-modal="true"
            >
              <ul className="flex flex-col gap-2 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-md px-3 py-2 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dd819c]"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="pt-28 md:pt-32">
        {/* HERO */}
        <section id="hero" className="scroll-mt-24 pb-10 sm:pb-12 lg:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="glass fade-in-up rounded-3xl p-6 sm:p-10 lg:p-14">
              <div className="flex flex-col items-center gap-10 md:flex-row">
                {/* Left: Headline + CTA */}
                <div className="w-full md:flex-1">
                  <p className="mb-3 text-xs tracking-[.35em] uppercase opacity-80 sm:text-sm">
                    Cosmic Rock • Love • Stardust
                  </p>
                  <h1 className="text-4xl leading-tight font-extrabold sm:text-5xl lg:text-6xl">
                    <span className="bg-gradient-to-r from-[#dd819c] via-[#a05987] to-[#3b1f52] bg-clip-text text-transparent">
                      Stellarmelt
                    </span>
                  </h1>
                  <p className="mt-4 max-w-xl text-white/80">
                    A celestial fusion of powerful vocals, poetic rock, and
                    star-swept ambience. Music for hearts that glow in the dark.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href="#about"
                      className="btn rounded-full px-5 py-2.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dd819c]"
                    >
                      Meet the Band
                    </a>
                    <a
                      href="#discography"
                      className="btn rounded-full px-5 py-2.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dd819c]"
                    >
                      Listen Now
                    </a>
                  </div>
                </div>

                {/* Right: Hero art contained inside card (desktop only) */}
                <div className="hidden w-full lg:block lg:flex-1">
                  <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl">
                    <img
                      src="/hero-art.png"
                      alt="Cosmic nebulae and planets with music notes"
                      className="relative block h-auto w-full object-contain drop-shadow-[0_16px_24px_rgba(221,129,156,0.28)] select-none md:drop-shadow-[0_16px_24px_rgba(221,129,156,0.28)] xl:drop-shadow-[0_16px_24px_rgba(221,129,156,0.28)]"
                      loading="eager"
                      decoding="async"
                      draggable={false}
                    />
                    <div
                      className="pointer-events-none absolute right-[6%] bottom-[6%] -z-10 h-56 w-56 rounded-full blur-2xl"
                      aria-hidden="true"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(221,129,156,0.40) 0%, rgba(160,89,135,0.50) 30%, transparent 80%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="mb-10">
              <h2 className="text-3xl font-bold sm:text-4xl">
                About{" "}
                <span className="bg-gradient-to-r from-[#dd819c] to-[#a05987] bg-clip-text text-transparent">
                  Stellarmelt
                </span>
              </h2>
              <p className="mt-3 max-w-3xl text-white/80">
                Stellarmelt blends glassy minimalism with cosmic drama—crisp
                guitars, orchestral shadows, and vocals that gleam like
                constellations. It’s elegance in orbit: music to hold you when
                the universe feels big.
              </p>
            </header>

            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((m, idx) => (
                <li
                  key={m.name}
                  className="group reveal"
                  data-reveal
                  style={{ transitionDelay: `${idx * 90}ms` }}
                >
                  <div className="glass h-full rounded-2xl p-5 transition-transform duration-200 group-hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/30">
                        <img
                          src="/favicon.png"
                          alt="Stellarmelt logo"
                          className="h-7 w-7 object-contain select-none"
                          draggable={false}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{m.name}</h3>
                        <p className="text-sm text-white/70">{m.role}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-white/80">{m.blurb}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* TIMELINE */}
        <section id="timeline" className="scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Two-column layout on lg+ */}
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
              {/* Left: timeline content */}
              <div className="lg:col-span-2">
                <h2 className="mb-10 text-3xl font-bold sm:text-4xl">
                  Timeline
                </h2>
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
                            background:
                              "linear-gradient(135deg, #dd819c, #a05987)",
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
                            activeTimelineIdx === idx
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                          onError={(ev) => {
                            (
                              ev.currentTarget as HTMLImageElement
                            ).style.display = "none";
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

        {/* DISCOGRAPHY */}
        <section id="discography" className="scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="mb-8">
              <h2 className="text-3xl font-bold sm:text-4xl">Discography</h2>
              <p className="mt-2 text-white/80">
                <span className="font-semibold">Album:</span>{" "}
                <span className="bg-gradient-to-r from-[#dd819c] to-[#3b1f52] bg-clip-text text-transparent">
                  Snow and the AI Mind
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
                      src="/album-cover.png"
                      alt="Stellarmelt — Snow and the AI Mind album cover"
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
                    <h3 className="text-xl font-semibold">
                      Snow and the AI Mind
                    </h3>
                    <p className="text-white/80">
                      Four tracks of glacial glow and burning memory—strings,
                      starlight, and heart.
                    </p>
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
                              <path
                                fill="currentColor"
                                d="M21 3 9 6v4l12-3V3z"
                              />
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
                            background:
                              "linear-gradient(90deg, #dd819c, #a05987)",
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

        {/* CONTACT */}
        <section id="contact" className="scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold sm:text-4xl">Contact</h2>
            <div className="glass flex flex-col items-center rounded-2xl p-8">
              <p className="mb-6 text-center text-white/80">
                Follow Stellarmelt across the cosmos. Links will point to the
                official profiles soon—in the meantime, they orbit GitHub.
              </p>
              <div className="flex items-center gap-5">
                {/* Spotify */}
                <a
                  href="https://github.com/JStanoeva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn rounded-full p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dd819c]"
                  aria-label="Spotify (placeholder link to GitHub)"
                  title="Spotify"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm4.374 14.6a.75.75 0 0 1-1.035.249 11.55 11.55 0 0 0-5.683-1.529c-1.401 0-2.797.244-4.1.724a.75.75 0 1 1-.52-1.406 13.04 13.04 0 0 1 4.62-.817c2.21 0 4.364.533 6.27 1.539a.75.75 0 0 1 .248 1.24Zm1.38-3.002a.9.9 0 0 1-1.245.299c-2.02-1.24-4.57-1.94-7.21-1.94-1.616 0-3.22.233-4.72.69a.9.9 0 1 1-.53-1.72 16.4 16.4 0 0 1 5.25-.77c2.98 0 5.8.77 8.025 2.12a.9.9 0 0 1 .426 1.32Zm.397-3.146a1.05 1.05 0 0 1-1.45.373C14.47 9.55 12.32 9 10.02 9c-1.825 0-3.63.35-5.33 1.04a1.05 1.05 0 1 1-.776-1.952A17.9 17.9 0 0 1 10.02 7c2.7 0 5.24.61 7.41 1.82a1.05 1.05 0 0 1 .421 1.63Z" />
                  </svg>
                </a>
                {/* YouTube */}
                <a
                  href="https://github.com/JStanoeva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn rounded-full p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dd819c]"
                  aria-label="YouTube (placeholder link to GitHub)"
                  title="YouTube"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M23.5 6.7a4 4 0 0 0-2.8-2.8C18.9 3.4 12 3.4 12 3.4s-6.9 0-8.7.5A4 4 0 0 0 .5 6.7 41 41 0 0 0 0 12a41 41 0 0 0 .5 5.3 4 4 0 0 0 2.8 2.8c1.8.5 8.7.5 8.7.5s6.9 0 8.7-.5a4 4 0 0 0 2.8-2.8c.4-1.8.5-5.3.5-5.3s0-3.5-.5-5.3ZM9.8 15.6V8.4l6.6 3.6-6.6 3.6Z" />
                  </svg>
                </a>
                {/* Tidal */}
                <a
                  href="https://github.com/JStanoeva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn rounded-full p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dd819c]"
                  aria-label="Tidal (placeholder link to GitHub)"
                  title="Tidal"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l-4.004 4.004 4.004 4.004 4.004-4.004L12.012 12l4.004-4.004-4.004-4.004zM16.042 7.996l3.979-3.979L24 7.996l-3.979 3.979z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-8 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl px-6 py-4 text-center text-sm text-white/80">
            <p>
              © {currentYear} Stellarmelt • Built with ♥ in a galaxy of sound
              and glow.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
