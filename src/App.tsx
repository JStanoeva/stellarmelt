import React, { useEffect, useMemo, useState } from "react";

/**
 * Single-file landing page for the cosmic rock band: Stellarmelt
 * Tech: React (TypeScript) + Tailwind CSS
 * Paste this whole file into your App.tsx. No other files required.
 */

type Star = {
  top: number; // percent of viewport height
  left: number; // percent of viewport width
  size: number; // px
  delay: number; // s
  duration: number; // s
  opacity: number; // 0..1
};

type Track = {
  no: number;
  title: string;
  link: string;
  length: string; // e.g., "4:18"
  about: string; // one sentence about the song
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const sections = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "timeline", label: "Timeline" },
    { id: "discography", label: "Discography" },
    { id: "contact", label: "Contact" },
  ];

  // Tiny starfield (twinkling)
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 120 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size:
          Math.random() < 0.8
            ? Math.floor(Math.random() * 2) + 1
            : Math.floor(Math.random() * 3) + 2,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 8,
        opacity: 0.4 + Math.random() * 0.6,
      })),
    []
  );

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

  // Scroll-reveal for Discography cards
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(
      "#discography [data-reveal]"
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
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
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

  const timeline = [
    {
      date: "July 27, 2025",
      title: "Stellarmelt is born",
      detail: "Band founded—constellations rearranged in celebration.",
    },
    {
      date: "July 27, 2025",
      title: "Debut single “Melt”",
      detail: "First spark released into the void. Goosebumps at light-speed.",
    },
    {
      date: "September 29, 2025",
      title: "Live: Celestial Dome, Earth Orbit",
      detail: "Immersive zero-G concert (upcoming).",
    },
    {
      date: "October 14, 2025",
      title: "Album: Snow and the AI Mind",
      detail: "A winter galaxy of memory and fire (upcoming).",
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
      <div className="fixed inset-0 -z-30 bg-cosmic" aria-hidden="true" />

      {/* Stars */}
      <div
        className="fixed inset-0 -z-20 pointer-events-none"
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
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:bg-black/60 focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Primary"
            className="mt-4 flex items-center justify-between rounded-2xl glass px-4 py-3"
          >
            <a
              href="#hero"
              className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dd819c] rounded-md"
              onClick={() => setMenuOpen(false)}
            >
              <span
                className="inline-block h-6 w-6 rounded-full bg-white/20 ring-1 ring-white/30"
                aria-hidden="true"
              />
              <span className="text-lg font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#dd819c] via-[#a05987] to-[#3b1f52]">
                Stellarmelt
              </span>
            </a>

            {/* Desktop menu */}
            <ul className="hidden md:flex items-center gap-6 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="opacity-90 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dd819c] rounded-md px-2 py-1"
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
              className="md:hidden rounded-md p-2 btn"
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
              className="md:hidden mt-2 rounded-xl glass px-4 py-3 fade-in-up"
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
        <section id="hero" className="scroll-mt-24 pb-10 sm:pb-12 lg:pb-26">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-3xl p-6 sm:p-10 lg:p-14 fade-in-up">
              <div className="flex flex-col md:flex-row items-center gap-10">
                {/* Left: Headline + CTA */}
                <div className="md:flex-1 w-full">
                  <p className="uppercase tracking-[.35em] text-xs sm:text-sm opacity-80 mb-3">
                    Cosmic Rock • Love • Stardust
                  </p>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#dd819c] via-[#a05987] to-[#3b1f52]">
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

                {/* Right: Breakout hero art (hidden on mobile & tablets) */}
                <div className="hidden lg:block lg:flex-1 w-full">
                  <div className="relative mx-auto max-w-lg aspect-[4/3] rounded-2xl overflow-visible">
                    {/* Breakout cutout image (transparent PNG/WebP in /public) */}
                    <img
                      src="/hero-art.png"
                      alt="Cosmic nebulae and planets with music notes" // decorative
                      aria-hidden="true" // decorative
                      className="
                      absolute z-10 pointer-events-none select-none
                      right-[-10%] bottom-[-90%]   
                      w-[500px] xl:w-[560px]
                      max-w-none
                      drop-shadow-[0_20px_90px_rgba(221,129,156,0.35)]"
                      loading="eager"
                      decoding="async"
                      draggable={false}
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
              <h2 className="text-3xl sm:text-4xl font-bold">
                About{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#dd819c] to-[#a05987]">
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

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {members.map((m) => (
                <li key={m.name} className="group">
                  <div className="glass rounded-2xl p-5 h-full transition-transform duration-200 group-hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-full ring-1 ring-white/30 bg-gradient-to-br from-white/20 to-white/5 grid place-items-center">
                        <span className="text-sm font-semibold">
                          {m.name[0]}
                        </span>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left: timeline content */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl sm:text-4xl font-bold mb-10">
                  Timeline
                </h2>
                <ol className="relative ml-3 border-l border-white/20">
                  {timeline.map((e, idx) => (
                    <li key={idx} className="mb-10 ml-6">
                      <span
                        className="absolute -left-3 top-0 grid h-6 w-6 place-items-center rounded-full ring-2 ring-white/40"
                        style={{
                          background:
                            "linear-gradient(135deg, #dd819c, #a05987)",
                        }}
                        aria-hidden="true"
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-white" />
                      </span>
                      <time className="text-xs uppercase tracking-widest text-white/70">
                        {e.date}
                      </time>
                      <h3 className="mt-1 font-semibold text-lg">{e.title}</h3>
                      <p className="text-white/80">{e.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Right: large-screen image (hidden on mobile/tablet) */}
              <aside className="hidden lg:block">
                {/* sticky keeps the image in view as you scroll the timeline */}
                <div className="sticky top-28">
                  <figure className="glass rounded-2xl overflow-hidden">
                    {/* Background-image uses a file from /public; if it doesn't exist yet, you just see the gradient */}
                    <div
                      className="relative aspect-[3/4] w-full bg-center bg-cover"
                      style={{
                        backgroundImage: "url(/stellarmelt-timeline.jpg)",
                      }}
                      aria-label="Stellarmelt timeline illustration"
                    >
                      {/* Soft cosmic overlay so text/edges look elegant regardless of the image */}
                      <div
                        className="absolute inset-0"
                        aria-hidden="true"
                        style={{
                          background:
                            "radial-gradient(60% 60% at 30% 30%, rgba(221,129,156,.25) 0%, transparent 70%), radial-gradient(50% 60% at 70% 70%, rgba(160,89,135,.25) 0%, transparent 70%), linear-gradient(135deg, rgba(30,20,43,.55), rgba(59,31,82,.55))",
                        }}
                      />
                      {/* Placeholder label shown even before you add an image */}
                      <div className="relative h-full w-full grid place-items-center">
                        <span className="text-xs uppercase tracking-widest text-white/80 px-3 py-2 rounded-md bg-black/30 ring-1 ring-white/20">
                          Timeline Visual Placeholder
                        </span>
                      </div>
                    </div>
                    <figcaption className="px-4 py-3 text-center text-sm text-white/80">
                      Drop your Sora render at{" "}
                      <code className="text-white/90">
                        /public/stellarmelt-timeline.jpg
                      </code>
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
              <h2 className="text-3xl sm:text-4xl font-bold">Discography</h2>
              <p className="mt-2 text-white/80">
                <span className="font-semibold">Album:</span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#dd819c] to-[#3b1f52]">
                  Snow and the AI Mind
                </span>
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Album Card */}
              <div className="lg:col-span-1">
                <div className="glass rounded-2xl p-6 h-full">
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden">
                    {/* Your real cover */}
                    <img
                      src="/album-cover1.png"
                      alt="Stellarmelt — Snow and the AI Mind album cover"
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                    {/* Soft brand-tint overlay to keep the site’s look consistent (optional) */}
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
              <ul className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {tracks.map((t, idx) => (
                  <li
                    key={t.no}
                    className="group reveal"
                    data-reveal
                    style={{ transitionDelay: `${idx * 90}ms` }}
                  >
                    <div className="glass rounded-2xl p-5 h-full flex flex-col justify-between transition-transform duration-200 group-hover:-translate-y-1">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-white/70">
                            Track {t.no}
                          </p>
                          <h4 className="mt-1 font-semibold text-lg">
                            {t.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Length pill */}
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-white/20 bg-white/10"
                            title="Track length"
                          >
                            {t.length}
                          </span>
                          {/* Play button */}
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
                      <p className="mt-3 text-sm text-white/80 leading-relaxed">
                        {t.about}
                      </p>

                      {/* Decorative progress bar */}
                      <div
                        className="mt-4 h-2 w-full rounded-full bg-white/10 overflow-hidden"
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">Contact</h2>
            <div className="glass rounded-2xl p-8 flex flex-col items-center">
              <p className="text-white/80 mb-6 text-center">
                Follow Stellarmelt across the cosmos. Links will point to the
                official profiles soon—in the meantime, they orbit GitHub.
              </p>
              <div className="flex items-center gap-5">
                {/* Spotify */}
                <a
                  href="https://github.com/torablaze"
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
                  href="https://github.com/torablaze"
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
                  href="https://github.com/torablaze"
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
                    <path d="M8 6 12 2l4 4-4 4-4-4Zm-6 6 4-4 4 4-4 4-4-4Zm12 0 4-4 4 4-4 4-4-4Zm-2 6 4-4 4 4-4 4-4-4Z" />
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
