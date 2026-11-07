import { useEffect, useLayoutEffect, useRef } from "react";

type Place = { href: string; top: number };

// The navbar and the fade under it.
const COVERED = 72;

// The first song not hidden by the navbar; near the top of the page it's still too far down to hold on to.
function songInSight(): Place | null {
  const rows = document.querySelectorAll('main ol a[href^="/discography/"]');
  for (const row of rows) {
    const { top, bottom } = row.getBoundingClientRect();
    if (bottom <= COVERED) continue;
    const href = row.getAttribute("href");
    const near = top < 0.7 * Math.min(window.innerWidth, window.innerHeight);
    return href && near ? { href, top } : null;
  }
  return null;
}

// Turning a phone swaps the Discography's layouts, thousands of pixels apart in height: this keeps the same song where it was on the screen.
export function useKeepSongInSight(phone: boolean) {
  const place = useRef<Place | null>(null);
  const wasPhone = useRef(phone);

  useEffect(() => {
    const remember = () => {
      place.current = songInSight();
    };
    window.addEventListener("scroll", remember, { passive: true });
    return () => window.removeEventListener("scroll", remember);
  }, []);

  useLayoutEffect(() => {
    if (wasPhone.current === phone) return;
    wasPhone.current = phone;
    const saved = place.current;
    if (!saved) return;
    const row = document.querySelector(`main ol a[href="${saved.href}"]`);
    if (row) window.scrollBy(0, row.getBoundingClientRect().top - saved.top);
  }, [phone]);
}
