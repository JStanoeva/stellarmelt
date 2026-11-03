import { m, useIsPresent } from "motion/react";
import { use, type ReactNode, type Ref } from "react";
import { StageMotion } from "../stageMotion";

// The stage's labels pass straight through, so the copy's lines dissolve and condense like any section's.
const cascade = { hidden: {}, shown: {}, gone: {} };

// ref: AnimatePresence's popLayout measures the leaving copy through it, to hold it in place while it dissolves.
type Props = { children: ReactNode; ref?: Ref<HTMLDivElement> };

// One text in the moons' panel.
export default function CopySwap({ children, ref }: Props) {
  const isPresent = useIsPresent();
  const { motionReady } = use(StageMotion);
  // Its own labels (an exit label alone would cut it off from the section's cascade).
  return (
    <m.div
      ref={ref}
      data-about-copy
      variants={cascade}
      initial={motionReady ? "hidden" : false}
      animate="shown"
      exit="gone"
      inert={!isPresent}
    >
      {/* The clip keeps the lines' drift out of the scroll height, so no scrollbar flashes mid-swap. */}
      <div className="overflow-clip [overflow-clip-margin:2rem]">{children}</div>
    </m.div>
  );
}
