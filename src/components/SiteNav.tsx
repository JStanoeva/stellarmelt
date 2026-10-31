import { Link, NavLink } from "react-router";
import { hero } from "../content/homeSections";
import { navLinks } from "../content/navLinks";
import LogoMark from "./LogoMark";

// The header spans the width, but only its links take clicks, so it never covers the top dot on a short screen.
export default function SiteNav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30">
      {/* A dark halo around the letters (not a bar) keeps them legible when the planet drifts behind. */}
      <nav
        aria-label="Primary"
        className="flex items-center justify-between gap-6 px-5 pt-3 [text-shadow:0_0_14px_var(--color-night-950),0_0_4px_var(--color-night-950)] wide:px-[clamp(1.25rem,3.4vw,3.5rem)] wide:pt-[clamp(0.75rem,2.6dvh,1.75rem)]"
      >
        <Link
          to="/"
          className="pointer-events-auto inline-flex min-h-11 min-w-11 items-center gap-2.5 font-display text-[1.0625rem] font-extrabold tracking-[0.02em] text-stardust-50 uppercase transition-colors duration-300 hover:text-rose-200"
        >
          {/* text-shadow skips SVG, so the mark gets the same halo as a filter. */}
          <LogoMark className="h-7 w-auto shrink-0 drop-shadow-[0_0_4px_var(--color-night-950)]" />
          {/* On phones the heart alone leaves room for the links; the hidden name still labels the link. */}
          <span className="max-sm:sr-only">{hero.title}</span>
        </Link>
        <ul className="flex items-center gap-[clamp(1.5rem,2.6vw,2.75rem)]">
          {navLinks.map((navLink) => (
            <li key={navLink.to}>
              {/* The current page's link is underlined as well as coloured, so it doesn't rely on colour alone. */}
              <NavLink
                to={navLink.to}
                className="pointer-events-auto inline-flex min-h-11 items-center font-mono text-[0.6875rem] tracking-[0.22em] text-mauve-200 uppercase decoration-1 underline-offset-[0.7em] transition-colors duration-300 hover:text-starlight-100 aria-[current=page]:text-rose-300 aria-[current=page]:underline"
              >
                {navLink.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
