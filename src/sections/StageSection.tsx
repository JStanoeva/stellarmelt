import { m, useIsPresent } from "motion/react";
import { use, type ReactNode } from "react";
import type { HomeSectionId } from "../content/homeSections";
import { StageMotion } from "./stageMotion";

// The section itself doesn't animate; its lines inherit these labels and cascade.
const cascade = { hidden: {}, shown: {}, gone: {} };

type Props = { id: HomeSectionId; className?: string; children: ReactNode };

// While a section leaves it turns inert, so focus and clicks pass to the one arriving.
export default function StageSection({ id, className = "", children }: Props) {
  const isPresent = useIsPresent();
  const { motionReady } = use(StageMotion);
  return (
    <m.section
      id={id}
      data-stage-section={id}
      aria-labelledby={`${id}-title`}
      inert={!isPresent}
      variants={cascade}
      initial={motionReady ? "hidden" : false}
      animate="shown"
      exit="gone"
      className={`absolute inset-0 ${className}`}
    >
      {children}
    </m.section>
  );
}
