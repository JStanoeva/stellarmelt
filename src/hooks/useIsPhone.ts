import { useMediaQuery } from "./useMediaQuery";

// A phone held upright: the Discography and song pages have their own calmer layouts there. Turned sideways it's a short screen, which keeps the full layouts.
export function useIsPhone(): boolean {
  return useMediaQuery("(width <= 30rem) and (height > 30rem)");
}
