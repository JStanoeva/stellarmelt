import { m, useIsPresent } from "motion/react";
import { use, type ReactNode, type Ref } from "react";
import { StageMotion } from "../stageMotion";

// The stage's labels pass straight through, so the lines inside dissolve and condense as About's do.
const cascade = { hidden: {}, shown: {}, gone: {} };

type Props = {
  children: ReactNode;
  // This pane's lines shed and gather the stardust; only the star and the words do.
  dust?: boolean;
  className?: string;
  // AnimatePresence's popLayout measures the leaving pane through it.
  ref?: Ref<HTMLDivElement>;
};

// One side of a song's swap between its star and its words.
export default function SwapPane({
  children,
  dust = false,
  className,
  ref,
}: Props) {
  const isPresent = useIsPresent();
  const { motionReady } = use(StageMotion);
  return (
    <m.div
      ref={ref}
      data-song-swap={dust ? "" : undefined}
      variants={cascade}
      initial={motionReady ? "hidden" : false}
      animate="shown"
      exit="gone"
      inert={!isPresent}
      className={className}
    >
      {children}
    </m.div>
  );
}
