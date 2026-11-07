import { useLayoutEffect, useState, type RefObject } from "react";

// Keeps the title this far from the words.
const CLEARANCE_PX = 24;

// A title with one very wide word reaches over into the star's place. That's fine beside a star but not beside words, so while they're open it shrinks in place, just enough to clear them. A scale takes no layout, so nothing else moves. The title needs origin-top-left.
export function useTitleFit(
  title: RefObject<HTMLElement | null>,
  place: RefObject<HTMLElement | null>,
  open: boolean,
): { scale: number | undefined; animates: boolean } {
  const [scale, setScale] = useState<number>();
  // Only a press animates: a song arriving with the words open has its title already fitted.
  const [shownOpen, setShownOpen] = useState(open);
  const [animates, setAnimates] = useState(false);
  if (shownOpen !== open) {
    setShownOpen(open);
    setAnimates(true);
  }

  useLayoutEffect(() => {
    function fit() {
      const element = title.current;
      const words = place.current;
      if (!element || !words) return;
      const room =
        words.getBoundingClientRect().left -
        element.getBoundingClientRect().left -
        CLEARANCE_PX;
      // Less room than the column itself means the layout is stacked, with no words beside the title.
      const reaches = room > element.clientWidth && element.scrollWidth > room;
      setScale(open && reaches ? room / element.scrollWidth : undefined);
    }
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [title, place, open]);

  return { scale, animates };
}
