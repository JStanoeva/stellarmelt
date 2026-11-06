import { LazyMotion, MotionConfig } from "motion/react";
import { useCallback, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import ArtLayer from "../art/ArtLayer";
import LogoMark from "../components/LogoMark";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import SkipLink from "../components/SkipLink";
import FlightLayer from "../flight/FlightLayer";
import FlightProvider from "../flight/FlightProvider";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useRouteFocus } from "../hooks/useRouteFocus";
import { isListenPath } from "../lib/tracks";
import PlayerProvider from "../player/PlayerProvider";
import { Site, type PageArt } from "./site";

type ShownArt = PageArt & { glide: boolean };

// Every page renders inside this: the navbar and the planet stay mounted while pages change.
export default function RootLayout() {
  const reduced = useMotionPreference();
  const [motionReady, setMotionReady] = useState(false);
  const [art, setArt] = useState<ShownArt | null>(null);
  const { pathname } = useLocation();
  const inRoom = isListenPath(pathname);
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
          <PlayerProvider>
            <FlightProvider>
              {!inRoom && <SkipLink />}
              {!inRoom && <SiteNav />}
              {art && (
                <ArtLayer
                  pose={art.pose}
                  anchors={art.anchors}
                  glide={art.glide}
                  reduced={reduced}
                  paused={inRoom}
                  dust={art.dust}
                />
              )}
              <main id="main" className="relative z-10">
                <Outlet />
              </main>
              {/* On the home page the footer sits in the contact section; other pages end on a tiny end card, above the planet's rim on phones. */}
              {pathname !== "/" && !inRoom && (
                <div className="relative z-10 flex flex-col items-center gap-3 px-5 pb-8 text-[0.6875rem] tracking-[0.24em] narrow:pb-[max(2rem,calc(min(95vw,95dvh)_-_38dvh_+_3rem))] short:pb-[calc(21dvh_+_1.5rem)]">
                  <LogoMark className="h-5 w-auto text-mauve-200" />
                  <SiteFooter />
                </div>
              )}
              <FlightLayer />
              <ScrollRestoration />
            </FlightProvider>
          </PlayerProvider>
        </Site>
      </MotionConfig>
    </LazyMotion>
  );
}
