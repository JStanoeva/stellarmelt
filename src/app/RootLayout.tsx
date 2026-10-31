import { LazyMotion, MotionConfig } from "motion/react";
import { useCallback, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import ArtLayer from "../art/ArtLayer";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import SkipLink from "../components/SkipLink";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useRouteFocus } from "../hooks/useRouteFocus";
import { Site, type PageArt } from "./site";

type ShownArt = PageArt & { glide: boolean };

// Every page renders inside this: the navbar and the planet stay mounted while pages change.
export default function RootLayout() {
  const reduced = useMotionPreference();
  const [motionReady, setMotionReady] = useState(false);
  const [art, setArt] = useState<ShownArt | null>(null);
  const { pathname } = useLocation();
  useRouteFocus();

  // Motion's animation features load in their own chunk once the page is up.
  const loadMotionFeatures = async () => {
    const { default: features } = await import("../lib/motionFeatures");
    setMotionReady(true);
    return features;
  };

  // The pose shown on load holds still; after that, each new pose glides in.
  const showArt = useCallback((next: PageArt) => {
    setArt((previous) => ({
      ...next,
      glide:
        previous !== null && (previous.glide || previous.pose !== next.pose),
    }));
  }, []);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion={reduced ? "always" : "never"}>
        <Site value={{ reduced, motionReady, showArt }}>
          <SkipLink />
          <SiteNav />
          {art && (
            <ArtLayer
              pose={art.pose}
              anchors={art.anchors}
              glide={art.glide}
              reduced={reduced}
              dust={art.dust}
            />
          )}
          <main id="main" className="relative z-10">
            <Outlet />
          </main>
          {/* On the home page the footer sits inside the contact section instead. */}
          {pathname !== "/" && (
            <div className="relative z-10 flex justify-center px-5 pb-8 tracking-[0.24em]">
              <SiteFooter />
            </div>
          )}
          <ScrollRestoration />
        </Site>
      </MotionConfig>
    </LazyMotion>
  );
}
