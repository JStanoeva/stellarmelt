import { useLayoutEffect, useRef, type RefObject } from "react";

type Spot = { x: number; y: number; size: number };

function spotOf(element: HTMLElement): Spot {
  const { left, top } = element.getBoundingClientRect();
  return {
    x: left,
    y: top,
    size: parseFloat(getComputedStyle(element).fontSize),
  };
}

// The phone's title glides from its place to the top and back (first, last, invert, play), because the site's Motion bundle has no layout animations.
// Call the returned function just before the swap; the title needs origin-top-left.
export function useTitleGlide(
  title: RefObject<HTMLElement | null>,
  open: boolean,
  reduced: boolean,
) {
  const first = useRef<Spot | null>(null);

  useLayoutEffect(() => {
    const from = first.current;
    first.current = null;
    if (!title.current || !from || reduced) return;
    const to = spotOf(title.current);
    title.current.animate(
      [
        {
          transform: `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.size / to.size})`,
        },
        { transform: "none" },
      ],
      { duration: 850, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  }, [title, open, reduced]);

  return () => {
    if (title.current) first.current = spotOf(title.current);
  };
}
