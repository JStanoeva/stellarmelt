import { about } from "../../content/homeSections";
import type { Member } from "../../content/types";
import Dissolve from "../Dissolve";
import { memberTitleId } from "./memberIds";

type Props = { member: Member; onBack: () => void };

// A member's story, in the place of the intro; the way back sits above the role on phones and across from it on wide screens.
export default function MemberDetails({ member, onBack }: Props) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-6">
        <Dissolve order={0} tracking={0.2} className="wide:order-last">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex min-h-11 cursor-pointer items-center gap-2 font-mono text-[0.6875rem] text-mauve-200 uppercase transition-colors duration-300 hover:text-starlight-100 wide:-my-3"
          >
            <span
              aria-hidden="true"
              className="text-rose-300 motion-ok:transition-transform motion-ok:duration-300 motion-ok:group-hover:-translate-x-1"
            >
              ←
            </span>
            {about.heading}
          </button>
        </Dissolve>
        <Dissolve order={1} tracking={0.22}>
          <p className="font-mono text-[0.6875rem] text-rose-300 uppercase">{member.role}</p>
        </Dissolve>
      </div>
      <Dissolve order={2} tracking={-0.03} blur className="mt-3 wide:mt-4">
        {/* On phones the longest word, "Stardust" (6.85 em), just fits the column beside the dots. */}
        <h2
          id={memberTitleId(member.slug)}
          data-stage-heading
          tabIndex={-1}
          className="font-display text-[calc((100vw_-_4.75rem)/6.85)] leading-[0.9] font-extrabold text-stardust-50 wide:text-[clamp(2.25rem,13.5cqi,5.5rem)] narrow:short:text-[clamp(1.25rem,11cqi,1.75rem)]"
        >
          {member.name}
        </h2>
      </Dissolve>
      <Dissolve order={3} className="mt-4 wide:mt-5">
        <p className="max-w-[30ch] font-display text-[1.1875rem] leading-snug font-semibold text-starlight-200 wide:text-[clamp(1.125rem,1.5vw,1.4rem)]">
          {member.tagline}
        </p>
      </Dissolve>
      <Dissolve order={4} className="mt-5 narrow:pb-14 wide:mt-6">
        <div className="max-w-[60ch] space-y-4 text-[1rem] leading-[1.65] text-mauve-100 wide:text-[clamp(0.98rem,1.1vw,1.0625rem)]">
          {member.note.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Dissolve>
    </>
  );
}
