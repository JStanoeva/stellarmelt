import { m, useIsPresent } from "motion/react";
import { use } from "react";
import Dissolve from "../Dissolve";
import { StageMotion } from "../stageMotion";
import type { Member } from "../../content/types";

type Props = { member: Member; position: number; count: number };

// The stage's labels pass straight through, so a member's lines dissolve and condense like any section's copy.
const cascade = { hidden: {}, shown: {}, gone: {} };

function twoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

// While the previous member dissolves it shares the panel's grid cell with the next one, and turns inert.
export default function MemberDetails({ member, position, count }: Props) {
  const isPresent = useIsPresent();
  const { motionReady } = use(StageMotion);
  // Its own labels (an exit label alone would cut it off from the section's cascade).
  return (
    <m.div
      variants={cascade}
      initial={motionReady ? "hidden" : false}
      animate="shown"
      exit="gone"
      inert={!isPresent}
      className="col-start-1 row-start-1"
    >
      <Dissolve order={3} tracking={0.22} loosen>
        <p className="flex items-center gap-3 font-mono text-[0.6875rem] text-rose-300 uppercase">
          <span aria-hidden="true" className="text-starlight-300/70">
            {twoDigits(position)}/{twoDigits(count)}
          </span>
          <span aria-hidden="true" className="h-px w-7 shrink-0 bg-rose-300/45" />
          {member.role}
        </p>
      </Dissolve>
      <Dissolve order={4} tracking={-0.03} blur className="mt-3 wide:mt-4">
        <h3 className="font-display text-[12.5vw] leading-[0.9] font-extrabold text-stardust-50 wide:text-[clamp(2.25rem,13.5cqi,5.5rem)]">
          {member.name}
        </h3>
      </Dissolve>
      <Dissolve order={5} className="mt-4 wide:mt-5">
        <p className="max-w-[30ch] font-display text-[1.1875rem] leading-snug font-semibold text-starlight-200 wide:text-[clamp(1.125rem,1.5vw,1.4rem)]">
          {member.tagline}
        </p>
      </Dissolve>
      <Dissolve order={6} className="mt-5 wide:mt-6">
        <div className="max-w-[60ch] space-y-4 text-[1rem] leading-[1.65] text-mauve-100 wide:text-[clamp(0.98rem,1.1vw,1.0625rem)]">
          {member.note.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Dissolve>
    </m.div>
  );
}
