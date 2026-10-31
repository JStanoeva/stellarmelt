import { AnimatePresence } from "motion/react";
import { useLayoutEffect, useRef, useState, type ComponentType } from "react";
import {
  measureAnchors,
  noAnchors,
  sameAnchors,
  type Anchors,
} from "../art/anchors";
import ArtLayer from "../art/ArtLayer";
import { createBurst, startBurst, type DustBurst } from "../art/dust";
import DotNav from "../components/DotNav";
import { homeSectionIds, type HomeSectionId } from "../content/homeSections";
import { useHomeStage } from "../hooks/useHomeStage";
import AboutSection from "./about/AboutSection";
import ContactSection from "./contact/ContactSection";
import DiscographySection from "./discography/DiscographySection";
import HeroSection from "./hero/HeroSection";
import { REDUCED_STEP_MS, STEP_MS, StageMotion } from "./stageMotion";
import TimelineSection from "./timeline/TimelineSection";

const sectionViews: Record<HomeSectionId, ComponentType> = {
  hero: HeroSection,
  about: AboutSection,
  timeline: TimelineSection,
  discography: DiscographySection,
  contact: ContactSection,
};

type Props = { reduced: boolean; motionReady: boolean };

export default function HomeStage({ reduced, motionReady }: Props) {
  const [anchors, setAnchors] = useState<Anchors>(noAnchors);
  const stage = useHomeStage({
    sectionIds: homeSectionIds,
    transitionMs: reduced ? REDUCED_STEP_MS : STEP_MS,
    reduced,
  });
  const id = homeSectionIds[stage.index];
  const Section = sectionViews[id];

  // Once per step, the canvas turns the leaving and arriving lines into stardust.
  const dust = useRef<DustBurst | null>(null);
  const shownIndex = useRef(stage.index);
  useLayoutEffect(() => {
    if (stage.index === shownIndex.current) return;
    shownIndex.current = stage.index;
    if (reduced) return;
    dust.current ??= createBurst();
    startBurst(dust.current, stage.direction);
  }, [stage.index, stage.direction, reduced]);

  // The art pins itself to the copy, so measure when a section mounts, the stage resizes or the fonts arrive.
  useLayoutEffect(() => {
    const measure = () =>
      setAnchors((previous) => {
        const next = measureAnchors(previous);
        return sameAnchors(previous, next) ? previous : next;
      });
    measure();
    const observer = new ResizeObserver(measure);
    const section = document.getElementById(id);
    if (section) observer.observe(section);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [id]);

  return (
    <StageMotion value={{ reduced, direction: stage.direction, motionReady }}>
      <ArtLayer
        pose={id}
        anchors={anchors}
        glide={stage.stepped}
        reduced={reduced}
        dust={dust}
      />
      <main id="main" className="relative z-10 h-dvh overflow-hidden">
        {/* initial={false}: the section shown on load is visible at first paint. */}
        <AnimatePresence initial={false} custom={stage.direction}>
          <Section key={id} />
        </AnimatePresence>
      </main>
      <DotNav activeIndex={stage.index} />
    </StageMotion>
  );
}
