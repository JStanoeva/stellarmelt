import { SHORT_QUERY } from "../art/poses";
import { useMediaQuery } from "./useMediaQuery";

// Landscape phones, where the planet keeps its lower contact and discography poses.
export function useIsShort(): boolean {
  return useMediaQuery(SHORT_QUERY);
}
