import { useLayoutEffect, useRef, useState, type RefObject } from "react";

type Size = { width: number; height: number };

// The element's content size in CSS px, kept current with a ResizeObserver; 0 × 0 until the first layout.
export function useElementSize<T extends HTMLElement>(): readonly [
  RefObject<T | null>,
  Size,
] {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () =>
      setSize((previous) => {
        const width = Math.round(element.clientWidth);
        const height = Math.round(element.clientHeight);
        return previous.width === width && previous.height === height
          ? previous
          : { width, height };
      });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}
