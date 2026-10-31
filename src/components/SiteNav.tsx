import { hero } from "../content/homeSections";
import LogoMark from "./LogoMark";

// The header spans the width, but only its links take clicks, so it never covers the top dot on a short screen.
export default function SiteNav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30">
      {/* A dark halo around the letters (not a bar) keeps them legible when the planet drifts behind. */}
      <nav
        aria-label="Primary"
        className="flex items-center px-5 pt-3 [text-shadow:0_0_14px_var(--color-night-950),0_0_4px_var(--color-night-950)] wide:px-[clamp(1.25rem,3.4vw,3.5rem)] wide:pt-[clamp(0.75rem,2.6dvh,1.75rem)]"
      >
        <a
          href="#hero"
          className="pointer-events-auto inline-flex min-h-11 items-center gap-2.5 font-display text-[1.0625rem] font-extrabold tracking-[0.02em] text-stardust-50 uppercase transition-colors duration-300 hover:text-rose-200"
        >
          {/* text-shadow skips SVG, so the mark gets the same halo as a filter. */}
          <LogoMark className="h-7 w-auto shrink-0 drop-shadow-[0_0_4px_var(--color-night-950)]" />
          {hero.title}
        </a>
      </nav>
    </header>
  );
}
