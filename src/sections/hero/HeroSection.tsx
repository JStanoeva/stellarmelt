import { m, type Variants } from "motion/react";
import { use } from "react";
import { hero } from "../../content/homeSections";
import Dissolve from "../Dissolve";
import SectionIndex from "../SectionIndex";
import StageSection from "../StageSection";
import { ENTER_DELAY, fade, StageMotion } from "../stageMotion";
import KanaColumn from "./KanaColumn";
import PosterWordmark from "./PosterWordmark";

// "Stellarmelt" stacked as STELLAR / MELT, the way the poster sets it.
const wordmarkLines = [hero.title.slice(0, 7), hero.title.slice(7)] as const;
const [meetTheBand, listenNow] = hero.ctas;

// The h1 appears with its letters, so a keyboard step never shows its focus ring around an empty box.
const heading: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { delay: ENTER_DELAY, duration: 0.25 } },
  gone: { opacity: 0, transition: { duration: 0.3 } },
};

export default function HeroSection() {
  const { reduced } = use(StageMotion);
  return (
    <StageSection
      id="hero"
      className="flex flex-col justify-end px-5 pb-[7dvh] wide:justify-start wide:pt-[clamp(4.25rem,13.5dvh,9rem)] wide:pr-24 wide:pb-0 wide:pl-[clamp(1.25rem,3.4vw,3.5rem)]"
    >
      <div className="flex items-start gap-[clamp(1.25rem,3.6vw,3.75rem)]">
        <KanaColumn className="text-[clamp(1.9rem,7.4vw,3.5rem)] tracking-[0.1em] wide:mt-[0.6vw] wide:text-[clamp(2.5rem,4.1vw,4.25rem)] narrow:absolute narrow:top-[5.25rem] narrow:left-5 short:text-[2rem]" />
        <div className="min-w-0 narrow:pr-12">
          <m.h1
            id="hero-title"
            data-stage-heading
            tabIndex={-1}
            variants={reduced ? fade : heading}
            className="font-display text-[10.9vw] leading-[0.84] font-extrabold text-stardust-50 wide:text-[min(clamp(4.5rem,9.4vw,10.25rem),17dvh)]"
          >
            <span className="sr-only">{hero.title}</span>
            <PosterWordmark lines={wordmarkLines} />
          </m.h1>
          <Dissolve
            order={2}
            tracking={0.18}
            loosen
            className="mt-5 wide:mt-8 short:mt-4"
          >
            <p
              data-dust-box
              className="inline-block bg-starlight-200 px-2.5 py-1.5 font-mono text-[min(0.625rem,2.6vw)] font-medium whitespace-nowrap text-night-950 uppercase wide:text-[0.6875rem]"
            >
              {hero.eyebrow}
            </p>
          </Dissolve>
          <Dissolve order={3} className="mt-5 wide:mt-7 short:mt-3">
            <p className="max-w-[34ch] text-[clamp(1rem,2.4vw,1.25rem)] leading-[1.55] text-mauve-100 wide:text-[clamp(1.05rem,1.35vw,1.25rem)] short:text-[0.9375rem]">
              {hero.tagline}
            </p>
          </Dissolve>
          <Dissolve order={4} className="mt-7 wide:mt-10 short:mt-5">
            <p className="flex flex-wrap items-center gap-3 wide:gap-4">
              <a
                href={meetTheBand.href}
                data-dust-box
                className="rounded-full bg-rose-300 px-6 py-3.5 text-[0.95rem] font-semibold text-night-950 transition-colors duration-300 hover:bg-rose-200 short:py-3"
              >
                {meetTheBand.label}
              </a>
              <a
                href={listenNow.href}
                data-dust-box
                className="group inline-flex items-center gap-2.5 rounded-full border border-starlight-200/45 px-6 py-[0.8125rem] text-[0.95rem] font-semibold text-starlight-100 transition-colors duration-300 hover:border-starlight-100 hover:text-stardust-50 short:py-[0.6875rem]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 10 12"
                  className="size-2.5 fill-rose-300 motion-ok:transition-transform motion-ok:duration-300 motion-ok:group-hover:translate-x-0.5"
                >
                  <path d="M0 0 10 6 0 12Z" />
                </svg>
                {listenNow.label}
              </a>
            </p>
          </Dissolve>
        </div>
      </div>
      <Dissolve
        order={4}
        tracking={0.24}
        loosen
        className="absolute bottom-[4.5dvh] left-[clamp(1.25rem,3.4vw,3.5rem)] narrow:hidden short:hidden"
      >
        <SectionIndex index={0} />
      </Dissolve>
    </StageSection>
  );
}
