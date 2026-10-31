import { discography } from "../../content/homeSections";
import Dissolve from "../Dissolve";
import SectionIndex from "../SectionIndex";
import StageSection from "../StageSection";

// A huge planet rises from below, lit from behind; the copy stands above its glowing limb.
export default function DiscographySection() {
  const { heading, albumLabel, albumTitle, line } = discography;
  return (
    <StageSection
      id="discography"
      className="flex flex-col items-start px-5 pt-[19dvh] wide:items-center wide:pt-[15dvh] wide:text-center"
    >
      <Dissolve order={0} tracking={0.24} loosen>
        <SectionIndex index={3} />
      </Dissolve>
      <Dissolve order={1} tracking={-0.035} loosen blur className="mt-5">
        <h2
          id="discography-title"
          data-stage-heading
          tabIndex={-1}
          className="font-display text-[8.3vw] leading-[0.9] font-extrabold text-stardust-50 wide:text-[clamp(3.5rem,6.4vw,6.5rem)]"
        >
          {heading}
        </h2>
      </Dissolve>
      <Dissolve order={2} className="mt-8 wide:mt-10">
        <p className="flex flex-col items-start gap-2 wide:items-center">
          <span className="font-mono text-[0.75rem] tracking-[0.24em] text-rose-300 uppercase">
            {albumLabel}
          </span>{" "}
          <span className="font-display text-[1.6rem] leading-tight font-bold tracking-[-0.01em] text-stardust-50 wide:text-[clamp(1.75rem,2.7vw,2.6rem)]">
            {albumTitle}
          </span>
        </p>
      </Dissolve>
      <Dissolve order={3} className="mt-4">
        <p className="max-w-[40ch] pr-10 text-[clamp(1.0625rem,2.4vw,1.3rem)] leading-[1.6] text-mauve-100 wide:pr-0 wide:text-[clamp(1.05rem,1.35vw,1.25rem)]">
          {line}
        </p>
      </Dissolve>
    </StageSection>
  );
}
