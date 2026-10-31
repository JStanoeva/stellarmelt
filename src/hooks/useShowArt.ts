import { use, useLayoutEffect, type RefObject } from "react";
import { Site } from "../app/site";
import { noAnchors, type Anchors } from "../art/anchors";
import type { DustBurst } from "../art/dust";
import type { PoseName } from "../art/poses";

// The planet lives in the layout and outlasts pages; each page tells it where to fly before the first paint.
export function useShowArt(
  pose: PoseName,
  anchors: Anchors = noAnchors,
  dust?: RefObject<DustBurst | null>,
) {
  const { showArt } = use(Site);
  useLayoutEffect(() => {
    showArt({ pose, anchors, dust });
  }, [showArt, pose, anchors, dust]);
}
