import { useEffect, useRef, useState, type RefObject } from "react";

type InView<T> = {
  ref: RefObject<T | null>;
  inView: boolean;
};

export function useInView<T extends Element>(): InView<T> {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
