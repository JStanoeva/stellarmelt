// Where the copy pins the art: layout positions in CSS px from the viewport's top left (transition drift ignored).
export type Anchors = {
  width: number;
  height: number;
  // The vertical middle of the first wordmark line (STELLAR).
  wordmarkMiddle?: number;
  // The ring beside the timeline's first event, which the orbit runs through.
  ring?: { x: number; y: number };
};

// Views without pinned copy (the 404).
export const noAnchors: Anchors = { width: 1, height: 1 };

// Layout position, so transforms (a line mid-animation) and transitions don't skew it.
export function pagePosition(element: HTMLElement) {
  let left = 0;
  let top = 0;
  for (
    let node: Element | null = element;
    node instanceof HTMLElement;
    node = node.offsetParent
  ) {
    left += node.offsetLeft;
    top += node.offsetTop;
  }
  return { left, top };
}

// Reads the anchors of whichever sections are mounted and keeps the previous ones for the rest.
export function measureAnchors(previous: Anchors): Anchors {
  const line = document.querySelector<HTMLElement>(
    "#hero [data-wordmark-line]",
  );
  const ring = document.querySelector<HTMLElement>(
    "#timeline [data-orbit-anchor]",
  );
  const ringAt = ring && pagePosition(ring);
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    wordmarkMiddle: line
      ? pagePosition(line).top + line.offsetHeight / 2
      : previous.wordmarkMiddle,
    ring:
      ring && ringAt
        ? {
            x: ringAt.left + ring.offsetWidth / 2,
            y: ringAt.top + ring.offsetHeight / 2,
          }
        : previous.ring,
  };
}

export function sameAnchors(a: Anchors, b: Anchors): boolean {
  return (
    a.width === b.width &&
    a.height === b.height &&
    a.wordmarkMiddle === b.wordmarkMiddle &&
    a.ring?.x === b.ring?.x &&
    a.ring?.y === b.ring?.y
  );
}
