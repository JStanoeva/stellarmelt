import { about } from "../../content/homeSections";
import Dissolve from "../Dissolve";

// What the section opens with, until a moon is pressed.
export default function AboutIntro() {
  return (
    <>
      <Dissolve order={0} tracking={-0.025} loosen blur>
        <h2
          id="about-title"
          data-stage-heading
          tabIndex={-1}
          className="font-display text-[9.6vw] leading-[0.92] font-extrabold text-stardust-50 wide:text-[clamp(1.75rem,11cqi,4.25rem)] narrow:short:text-[clamp(1.25rem,11cqi,1.75rem)]"
        >
          {about.heading}
        </h2>
      </Dissolve>
      {/* The band's motto, in the labels' mono caps and the logo's sparkle. */}
      <Dissolve order={1} className="mt-4 wide:mt-5">
        <p className="flex items-start gap-2.5 font-mono text-[0.6875rem] leading-[1.8] tracking-[0.2em] text-starlight-200 uppercase wide:text-[clamp(0.6875rem,0.8vw,0.8125rem)]">
          <svg viewBox="0 0 12 12" aria-hidden="true" className="mt-[0.45em] size-2.5 shrink-0 fill-rose-300">
            <path d="M6 0C6.6 3.9 8.1 5.4 12 6 8.1 6.6 6.6 8.1 6 12 5.4 8.1 3.9 6.6 0 6 3.9 5.4 5.4 3.9 6 0Z" />
          </svg>
          {about.motto}
        </p>
      </Dissolve>
      <Dissolve order={2} className="mt-4 wide:mt-5">
        <p className="max-w-[40ch] text-[1.0625rem] leading-[1.6] text-mauve-100 wide:text-[clamp(1rem,1.2vw,1.15rem)]">
          {about.line}
        </p>
      </Dissolve>
    </>
  );
}
