import { WIDE_QUERY } from "../art/poses";
import { useMediaQuery } from "./useMediaQuery";

// Phones, portrait tablets and narrow windows get the stacked composition and the planet's tall poses.
export function useIsTall(): boolean {
  return !useMediaQuery(WIDE_QUERY);
}
