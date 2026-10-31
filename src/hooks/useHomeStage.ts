import { useCallback, useEffect, useRef, useState } from "react";

type StepSource = "wheel" | "key" | "swipe" | "link" | "hash";

type StageState = {
  index: number;
  direction: 1 | -1;
  moveFocus: boolean;
  // False until the first step, so the art can skip its glide on load.
  stepped: boolean;
};

type Options = {
  sectionIds: readonly string[];
  // Input stays locked this long after each step.
  transitionMs: number;
  reduced: boolean;
};

const WHEEL_THRESHOLD_PX = 40;
const WHEEL_QUIET_MS = 200;
const SWIPE_THRESHOLD_PX = 50;
const ARROW_SCROLL_PX = 64;

function wheelPixels(event: WheelEvent): number {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight;
  }
  return event.deltaY;
}

function canScroll(
  element: Element,
  direction: number,
  top = element.scrollTop,
): boolean {
  if (direction > 0) {
    return top + element.clientHeight < element.scrollHeight - 1;
  }
  return top > 0;
}

// The leaving section is inert, so this finds the arriving one's scroller.
function activeScroller(): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    "[data-stage-section]:not([inert]) [data-stage-scroll]",
  );
}

function isInside(element: Element, target: EventTarget | null): boolean {
  return target instanceof Node && element.contains(target);
}

// An empty hash opens the first section; a hash that isn't a section gives -1, which the stage ignores.
function indexFromHash(sectionIds: readonly string[]): number {
  const id = window.location.hash.slice(1);
  return id === "" ? 0 : sectionIds.indexOf(id);
}

// Frames need data-stage-section (inert while leaving), a data-stage-scroll scroller and a data-stage-heading.
export function useHomeStage({
  sectionIds,
  transitionMs,
  reduced,
}: Options): Omit<StageState, "moveFocus"> {
  const [stage, setStage] = useState<StageState>(() => ({
    index: Math.max(indexFromHash(sectionIds), 0),
    direction: 1,
    moveFocus: false,
    stepped: false,
  }));

  const indexRef = useRef(stage.index);
  const busyUntil = useRef(0);

  const goTo = useCallback(
    (target: number, source: StepSource) => {
      const from = indexRef.current;
      if (target < 0 || target >= sectionIds.length || target === from) return;
      if (source !== "hash" && performance.now() < busyUntil.current) return;

      const focusWasInside =
        document.activeElement?.closest("[data-stage-section]") != null;
      indexRef.current = target;
      busyUntil.current = performance.now() + transitionMs;
      setStage({
        index: target,
        direction: target > from ? 1 : -1,
        // Key and link steps (the dots are links) move focus, and so does a step that unmounts the focused element.
        moveFocus: source === "key" || source === "link" || focusWasInside,
        stepped: true,
      });
      if (window.location.hash !== `#${sectionIds[target]}`) {
        history.replaceState(history.state, "", `#${sectionIds[target]}`);
      }
    },
    [sectionIds, transitionMs],
  );

  const step = useCallback(
    (delta: 1 | -1, source: StepSource) =>
      goTo(indexRef.current + delta, source),
    [goTo],
  );

  // No pull-to-refresh or rubber-banding while the stage is mounted.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overscrollBehavior;
    root.style.overscrollBehavior = "none";
    return () => {
      root.style.overscrollBehavior = previous;
    };
  }, []);

  // A wheel gesture is a run of events less than WHEEL_QUIET_MS apart, and it steps at most once.
  useEffect(() => {
    let lastEventAt = 0;
    let gestureUsed = false;
    let gestureScrolledInside = false;
    let accumulated = 0;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return; // ctrl+wheel is pinch-zoom
      // The event's own time, so a slow frame that delays this handler can't split one gesture in two.
      if (event.timeStamp - lastEventAt > WHEEL_QUIET_MS) {
        gestureUsed = false;
        gestureScrolledInside = false;
        accumulated = 0;
      }
      lastEventAt = event.timeStamp;

      // The rest of a gesture that stepped, or one that began during a step, mustn't scroll the arriving section.
      if (gestureUsed || performance.now() < busyUntil.current) {
        gestureUsed = true;
        event.preventDefault();
        return;
      }
      const delta = wheelPixels(event);
      if (delta === 0) return;
      const scroller = activeScroller();
      if (scroller && canScroll(scroller, delta)) {
        gestureScrolledInside = true;
        // Over the navbar or the dots the browser wouldn't scroll the section, so scroll it here.
        if (!isInside(scroller, event.target)) {
          event.preventDefault();
          scroller.scrollBy({ top: delta });
        }
        return;
      }
      event.preventDefault();
      // Scrolling into the edge doesn't step; the next gesture does.
      if (gestureScrolledInside) return;
      // A mostly sideways swipe never steps.
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      accumulated += delta;
      if (Math.abs(accumulated) >= WHEEL_THRESHOLD_PX) {
        gestureUsed = true;
        step(accumulated > 0 ? 1 : -1, "wheel");
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [step]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      ) {
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      if (
        target?.closest(
          "input, textarea, select, [contenteditable]:not([contenteditable='false'])",
        )
      ) {
        return;
      }

      let delta: 1 | -1 | null = null;
      let absolute: number | null = null;
      let byPage = false;
      switch (event.key) {
        case "ArrowDown":
          delta = 1;
          break;
        case "ArrowUp":
          delta = -1;
          break;
        case "PageDown":
          delta = 1;
          byPage = true;
          break;
        case "PageUp":
          delta = -1;
          byPage = true;
          break;
        case " ":
          if (target?.closest("button, summary")) return;
          delta = event.shiftKey ? -1 : 1;
          byPage = true;
          break;
        case "Home":
          absolute = 0;
          break;
        case "End":
          absolute = sectionIds.length - 1;
          break;
        default:
          return;
      }

      // During a step the keys do nothing, so they can't scroll the arriving section.
      if (performance.now() < busyUntil.current) {
        event.preventDefault();
        return;
      }

      const scroller = activeScroller();
      if (delta !== null && scroller && canScroll(scroller, delta)) {
        // With focus inside the section the browser scrolls it; from the navbar, the dots or the page it wouldn't.
        if (!isInside(scroller, target)) {
          event.preventDefault();
          const distance = byPage
            ? scroller.clientHeight * 0.85
            : ARROW_SCROLL_PX;
          scroller.scrollBy({
            top: delta * distance,
            behavior: reduced ? "instant" : "smooth",
          });
        }
        return;
      }
      event.preventDefault();
      if (absolute === indexRef.current && scroller) {
        // Already on that section, so Home and End go to its top or bottom.
        scroller.scrollTo({
          top: absolute === 0 ? 0 : scroller.scrollHeight,
          behavior: reduced ? "instant" : "smooth",
        });
      } else if (absolute !== null) {
        goTo(absolute, "key");
      } else if (delta !== null) {
        step(delta, "key");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, step, sectionIds.length, reduced]);

  // A swipe is judged on touchend, and one that scrolled a section doesn't step.
  useEffect(() => {
    let start: {
      x: number;
      y: number;
      scroller: HTMLElement | null;
      top: number;
      outside: boolean;
    } | null = null;

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        start = null;
        return;
      }
      const touch = event.touches[0];
      const scroller = activeScroller();
      start = {
        x: touch.clientX,
        y: touch.clientY,
        scroller,
        top: scroller?.scrollTop ?? 0,
        outside: scroller !== null && !isInside(scroller, event.target),
      };
    };

    // A touch on the navbar, the dots or a gutter has nothing of its own to scroll, so it drags the section.
    const onTouchMove = (event: TouchEvent) => {
      if (!start?.outside || !start.scroller || event.touches.length !== 1) {
        return;
      }
      if (performance.now() < busyUntil.current) return;
      start.scroller.scrollTop = start.top + start.y - event.touches[0].clientY;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!start) return;
      const touch = event.changedTouches[0];
      const dy = start.y - touch.clientY;
      const dx = start.x - touch.clientX;
      const { scroller, top } = start;
      start = null;
      if (Math.abs(dy) < SWIPE_THRESHOLD_PX || Math.abs(dy) < Math.abs(dx)) {
        return;
      }
      const direction = dy > 0 ? 1 : -1;
      if (
        scroller &&
        (scroller.scrollTop !== top || canScroll(scroller, direction, top))
      ) {
        return;
      }
      step(direction, "swipe");
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [step]);

  // Handled here rather than by hashchange, so a link step moves focus and adds no history entry.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const link =
        event.target instanceof Element
          ? event.target.closest("a[href^='#']")
          : null;
      if (!link) return;
      const index = sectionIds.indexOf(
        link.getAttribute("href")?.slice(1) ?? "",
      );
      if (index < 0) return;
      event.preventDefault();
      goTo(index, "link");
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [goTo, sectionIds]);

  // Back, Forward and edited URLs change the hash without a click.
  useEffect(() => {
    const onHashChange = () => {
      const index = indexFromHash(sectionIds);
      if (index >= 0) goTo(index, "hash");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [goTo, sectionIds]);

  useEffect(() => {
    if (!stage.moveFocus) return;
    document
      .querySelector<HTMLElement>(
        `[data-stage-section="${sectionIds[stage.index]}"]:not([inert]) [data-stage-heading]`,
      )
      ?.focus({ preventScroll: true });
  }, [stage, sectionIds]);

  return {
    index: stage.index,
    direction: stage.direction,
    stepped: stage.stepped,
  };
}
