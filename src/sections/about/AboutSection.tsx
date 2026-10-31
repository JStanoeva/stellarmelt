import { about } from "../../content/homeSections";
import Dissolve from "../Dissolve";
import SectionIndex from "../SectionIndex";
import StageSection from "../StageSection";

// The planet drifts off to the left and the copy takes the right-hand page.
export default function AboutSection() {
  return (
    <StageSection
      id="about"
      className="flex items-end px-5 pb-[11dvh] wide:items-center wide:justify-end wide:pr-[clamp(5rem,11vw,11rem)] wide:pb-0 wide:pl-[46vw]"
    >
      <div>
        <Dissolve order={0} tracking={0.24} loosen>
          <SectionIndex index={1} />
        </Dissolve>
        <Dissolve order={1} tracking={-0.025} loosen blur className="mt-6">
          <h2
            id="about-title"
            data-stage-heading
            tabIndex={-1}
            className="font-display text-[9.6vw] leading-[0.92] font-extrabold text-stardust-50 wide:text-[clamp(3.5rem,6vw,6.25rem)]"
          >
            {about.heading}
          </h2>
        </Dissolve>
        <Dissolve order={2} className="mt-6 wide:mt-8">
          <p className="max-w-[34ch] text-[clamp(1.0625rem,2.4vw,1.3rem)] leading-[1.6] text-mauve-100 wide:text-[clamp(1.1rem,1.45vw,1.35rem)]">
            {about.line}
          </p>
        </Dissolve>
      </div>
    </StageSection>
  );
}
