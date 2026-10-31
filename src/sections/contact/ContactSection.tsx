import SiteFooter from "../../components/SiteFooter";
import { contact } from "../../content/homeSections";
import Dissolve from "../Dissolve";
import StageSection from "../StageSection";

// The planet sets below the bottom edge and leaves a glowing horizon; the page signs off above it.
export default function ContactSection() {
  return (
    <StageSection
      id="contact"
      className="flex flex-col items-start justify-center px-5 pb-[18dvh] wide:items-center wide:pb-[16dvh] wide:text-center"
    >
      <Dissolve order={0} tracking={-0.04} loosen blur>
        <h2
          id="contact-title"
          data-stage-heading
          tabIndex={-1}
          className="font-display text-[12.6vw] leading-[0.88] font-extrabold text-stardust-50 wide:text-[clamp(4rem,8.5vw,8.5rem)]"
        >
          {contact.heading}
        </h2>
      </Dissolve>
      <Dissolve order={1} className="mt-6 wide:mt-8">
        <p className="pr-10 text-[clamp(1.125rem,2.6vw,1.4rem)] leading-[1.6] text-mauve-100 wide:pr-0 wide:text-[clamp(1.15rem,1.6vw,1.5rem)]">
          {contact.line}
        </p>
      </Dissolve>
      <Dissolve order={2} tracking={0.24} loosen className="mt-12 wide:mt-16">
        <SiteFooter />
      </Dissolve>
    </StageSection>
  );
}
