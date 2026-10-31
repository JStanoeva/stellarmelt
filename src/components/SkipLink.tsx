import type { MouseEvent } from "react";

// It focuses the shown section's heading and leaves the URL hash alone, because the home stage reads the hash.
export default function SkipLink() {
  const skip = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document
      .querySelector<HTMLElement>(
        "[data-stage-section]:not([inert]) [data-stage-heading]",
      )
      ?.focus();
  };

  return (
    <a
      href="#main"
      onClick={skip}
      className="sr-only rounded-full bg-night-950 font-mono text-[0.6875rem] tracking-[0.22em] text-starlight-100 uppercase focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-5 focus:py-3.5"
    >
      Skip to content
    </a>
  );
}
