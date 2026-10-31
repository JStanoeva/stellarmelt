import { LazyMotion, MotionConfig } from "motion/react";
import { useState } from "react";
import SiteNav from "./components/SiteNav";
import SkipLink from "./components/SkipLink";
import { useMotionPreference } from "./hooks/useMotionPreference";
import HomeStage from "./sections/HomeStage";

export default function App() {
  const reduced = useMotionPreference();
  const [motionReady, setMotionReady] = useState(false);

  // Motion's animation features load in their own chunk once the page is up.
  const loadMotionFeatures = async () => {
    const { default: features } = await import("./lib/motionFeatures");
    setMotionReady(true);
    return features;
  };

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion={reduced ? "always" : "never"}>
        <SkipLink />
        <SiteNav />
        <HomeStage reduced={reduced} motionReady={motionReady} />
      </MotionConfig>
    </LazyMotion>
  );
}
