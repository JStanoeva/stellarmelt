import type { MouseEvent } from "react";
import { focusPageHeading } from "../hooks/useRouteFocus";

// It focuses the page's heading and leaves the URL alone, because the router and the home stage read it.
export default function SkipLink() {
  const skip = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    focusPageHeading();
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
