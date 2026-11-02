import { channels, contact } from "../../content/homeSections";
import Dissolve from "../Dissolve";
import StageSection from "../StageSection";
import ChannelLink from "./ChannelLink";
import SmallPrint from "./SmallPrint";

// The site's end card above the setting planet: each line condenses out of the stardust and drifts back into it.
export default function ContactSection() {
  // Phones: the bottom padding clears the planet's cap (the tall contact pose in src/art/poses.ts); under 24rem the right padding clears the dots.
  return (
    <StageSection
      id="contact"
      className="flex flex-col items-center justify-center px-5 pt-[4.25rem] pb-[max(7dvh,calc(min(95vw,95dvh)_-_38dvh_+_1.5rem))] text-center max-[24rem]:pr-[3.25rem] wide:px-24 wide:pb-[25dvh] short:pt-11 short:pb-[21dvh]"
    >
      <Dissolve order={0} tracking={-0.035} loosen blur>
        <h2
          id="contact-title"
          data-stage-heading
          tabIndex={-1}
          className="font-display text-[12vw] leading-[0.9] font-extrabold text-stardust-50 wide:text-[min(clamp(3.5rem,6.4vw,6.5rem),12dvh)] short:text-[2.5rem]"
        >
          {contact.heading}
        </h2>
      </Dissolve>
      <Dissolve order={1} className="mt-4 wide:mt-5 short:mt-2">
        <p className="max-w-[18rem] text-[clamp(1.0625rem,4.4vw,1.25rem)] leading-[1.5] text-balance text-mauve-100 wide:max-w-none wide:text-[clamp(1.1rem,1.45vw,1.35rem)] short:text-[0.9375rem]">
          {contact.line}
        </p>
      </Dissolve>
      <ul className="mt-9 flex justify-center gap-[clamp(1rem,6vw,3.5rem)] max-[24rem]:gap-4 wide:mt-[clamp(2rem,5dvh,3rem)] short:mt-3">
        {channels.map((channel, index) => (
          <li key={channel.brand}>
            <Dissolve order={2 + index}>
              <ChannelLink channel={channel} />
            </Dissolve>
          </li>
        ))}
      </ul>
      <SmallPrint />
    </StageSection>
  );
}
