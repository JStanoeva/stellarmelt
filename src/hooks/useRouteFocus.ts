import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { isListenPath, isSongPath } from "../lib/tracks";

// The shown stage section's heading on the home page, the page's h1 elsewhere; anything leaving (inert) never counts.
const pageHeading =
  "[data-stage-heading]:not([inert] *), main h1:not([inert] *)";

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
    // From one song's room to another, the same room stays on screen and the pressed button keeps focus.
    const sameRoom =
      isListenPath(shownPathname.current) && isListenPath(pathname);
    // From one song's page to another, the next song takes focus itself once it's in (SongArticle).
    const songToSong =
      isSongPath(shownPathname.current) && isSongPath(pathname);
    shownPathname.current = pathname;
    if (!sameRoom && !songToSong) focusPageHeading();
  }, [pathname]);
}
