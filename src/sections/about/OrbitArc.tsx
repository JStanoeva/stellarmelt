import { m, useTransform, type MotionValue, type Variants } from "motion/react";
import { use, useId } from "react";
import {
  ENTER_DELAY,
  EXIT_DURATION,
  easeCondense,
  easeFade,
  fade,
  StageMotion,
} from "../stageMotion";
import { arcPath, frontGlowLength, slotPoint, type Orbit } from "./orbit";

type Props = { orbit: Orbit; spin: MotionValue<number> };

const arrive: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { delay: ENTER_DELAY + 0.25, duration: 0.9, ease: easeCondense } },
  gone: { opacity: 0, transition: { duration: EXIT_DURATION, ease: easeFade } },
};

// The dotted orbit round the planet's limb, brightest at the front where the selected moon rests.
export default function OrbitArc({ orbit, spin }: Props) {
  const { reduced } = use(StageMotion);
  const maskId = useId();
  const front = slotPoint(orbit, 0);
  // The dots turn with the moons, so the whole orbit seems to rotate.
  const rotate = useTransform(() => orbit.turn * orbit.step * spin.get());

  return (
    <svg aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
      <defs>
        <radialGradient
          id={`${maskId}-light`}
          gradientUnits="userSpaceOnUse"
          cx={front.x}
          cy={front.y}
          r={orbit.radius * 1.3}
        >
          <stop offset="0" stopColor="white" />
          <stop offset="0.55" stopColor="white" stopOpacity={0.45} />
          <stop offset="1" stopColor="white" stopOpacity={0} />
        </radialGradient>
        <radialGradient
          id={`${maskId}-front`}
          gradientUnits="userSpaceOnUse"
          cx={front.x}
          cy={front.y}
          r={frontGlowLength(orbit)}
        >
          <stop offset="0.35" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity={0} />
        </radialGradient>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill={`url(#${maskId}-light)`} />
        </mask>
        <mask id={`${maskId}-front-mask`} maskUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill={`url(#${maskId}-front)`} />
        </mask>
      </defs>
      <m.g variants={reduced ? fade : arrive}>
        <g mask={`url(#${maskId})`}>
          <circle
            cx={orbit.cx}
            cy={orbit.cy}
            r={orbit.radius + 16}
            fill="none"
            strokeWidth={1}
            strokeOpacity={0.18}
            className="stroke-mauve-300"
          />
          <m.circle
            cx={orbit.cx}
            cy={orbit.cy}
            r={orbit.radius}
            style={{ rotate }}
            fill="none"
            strokeWidth={1.7}
            strokeOpacity={0.9}
            strokeDasharray="0.1 6.5"
            strokeLinecap="round"
            className="stroke-mauve-200"
          />
        </g>
        {/* The stretch of orbit at the front glows, a soft wide stroke under a fine one. */}
        <g mask={`url(#${maskId}-front-mask)`} fill="none" strokeLinecap="round" className="stroke-rose-300">
          <path d={arcPath(orbit, -1, 1)} strokeWidth={7} strokeOpacity={0.16} />
          <path d={arcPath(orbit, -1, 1)} strokeWidth={1.5} strokeOpacity={0.85} />
        </g>
      </m.g>
    </svg>
  );
}
