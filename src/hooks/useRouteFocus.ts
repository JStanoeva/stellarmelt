import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

// The shown stage section's heading on the home page, the page's h1 elsewhere; a leaving (inert) section never counts.
const pageHeading =
  "[data-stage-section]:not([inert]) [data-stage-heading], main h1:not([inert] *)";

export function focusPageHeading() {
  document
    .querySelector<HTMLElement>(pageHeading)
    ?.focus({ preventScroll: true });
}

// After a move to another page, focus goes to its heading; the first load keeps the browser's own focus.
export function useRouteFocus() {
  const { pathname } = useLocation();
  const shownPathname = useRef(pathname);

  useEffect(() => {
    if (shownPathname.current === pathname) return;
    shownPathname.current = pathname;
    focusPageHeading();
  }, [pathname]);
}
