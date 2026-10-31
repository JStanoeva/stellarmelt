import { hero } from "../content/homeSections";
import MotionToggle from "./MotionToggle";

type Props = { reduced: boolean; onToggleMotion: () => void };

// The header spans the width, but only its controls take clicks, so it never covers the top dot on a short screen.
export default function SiteNav({ reduced, onToggleMotion }: Props) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30">
      {/* A dark halo around the letters (not a bar) keeps them legible when the planet drifts behind. */}
      <nav
        aria-label="Primary"
        className="flex items-center justify-between gap-6 px-5 pt-3 [text-shadow:0_0_14px_var(--color-night-950),0_0_4px_var(--color-night-950)] wide:px-[clamp(1.25rem,3.4vw,3.5rem)] wide:pt-[clamp(0.75rem,2.6dvh,1.75rem)]"
      >
        <a
          href="#hero"
          className="pointer-events-auto inline-flex min-h-11 items-center font-display text-[1.0625rem] font-extrabold tracking-[0.02em] text-stardust-50 uppercase transition-colors duration-300 hover:text-rose-200"
        >
          {hero.title}
        </a>
        <MotionToggle
          reduced={reduced}
          onToggle={onToggleMotion}
          className="pointer-events-auto min-h-11 text-[0.6875rem] tracking-[0.22em] text-mauve-200"
        />
      </nav>
    </header>
  );
}
