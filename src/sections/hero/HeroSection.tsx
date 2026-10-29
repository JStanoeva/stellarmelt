export default function HeroSection() {
  return (
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
  );
}
