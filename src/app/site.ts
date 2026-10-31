import { createContext, type RefObject } from "react";
import type { Anchors } from "../art/anchors";
import type { DustBurst } from "../art/dust";
import type { PoseName } from "../art/poses";

// What a page asks of the layout's planet: its pose, where its copy pins the art, and the home stage's stardust.
export type PageArt = {
  pose: PoseName;
  anchors?: Anchors;
  dust?: RefObject<DustBurst | null>;
};

type SiteValue = {
  reduced: boolean;
  // Until Motion's features load, sections appear without their entrance instead of waiting hidden.
  motionReady: boolean;
  showArt: (art: PageArt) => void;
};

export const Site = createContext<SiteValue>({
  reduced: false,
  motionReady: true,
  showArt: () => {},
});
