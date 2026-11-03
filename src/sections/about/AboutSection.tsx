import { AnimatePresence, useIsPresent } from "motion/react";
import { use, useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { members } from "../../content/members";
import { useIsShort } from "../../hooks/useIsShort";
import { useIsTall } from "../../hooks/useIsTall";
import { useViewportSize } from "../../hooks/useViewportSize";
import StageSection from "../StageSection";
import { StageDust, StageMotion } from "../stageMotion";
import AboutIntro from "./AboutIntro";
import CopySwap from "./CopySwap";
import MemberDetails from "./MemberDetails";
import { memberPanelId, memberTitleId, moonId } from "./memberIds";
import MoonOrbit from "./MoonOrbit";
import { orbitBottom, orbitFor, slotPoint, type Orbit } from "./orbit";

// Room for the front moon's name and a gap, so the copy column always starts past it.
const LABEL_ROOM_PX = 180;

function columnStyle(orbit: Orbit, tall: boolean, short: boolean): CSSProperties {
  // Landscape phones: the copy sits beside the moons, and fades out under the navbar.
  if (tall && short) {
    return {
      paddingLeft: slotPoint(orbit, 5).x + 50,
      maskImage:
        "linear-gradient(to bottom, transparent 2.5rem, black 3.5rem, black calc(100% - 1rem), transparent)",
    };
  }
  // Phones: the copy starts under the moons and fades out before it scrolls up under them.
  if (tall) {
    const top = orbitBottom(orbit);
    return {
      paddingTop: top,
      maskImage: `linear-gradient(to bottom, transparent ${top - 40}px, black ${top}px)`,
    };
  }
  return { "--orbit-edge": `${orbit.cx + orbit.radius + LABEL_ROOM_PX}px` } as CSSProperties;
}

// The band are the planet's moons: press one and its story replaces the intro, in the stage's own stardust fade.
export default function AboutSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const tall = useIsTall();
  const short = useIsShort();
  const { width, height } = useViewportSize();
  const orbit = orbitFor(width, height, tall);
  const { direction } = use(StageMotion);
  const shedDust = use(StageDust);
  const isPresent = useIsPresent();
  const member = selected === null ? null : members[selected];
  const column = useRef<HTMLDivElement>(null);
  const story = useRef<HTMLDivElement>(null);

  // Each swap starts its text at the top and sheds stardust; the copy shown on arrival already has the stage's.
  const shown = useRef(selected);
  useLayoutEffect(() => {
    if (selected === shown.current) return;
    shown.current = selected;
    // The leaving copy dissolves where it was, not where the scroll reset would take it (its inner box, because popLayout undoes any shift of the outer one).
    const scrolled = (column.current?.scrollTop ?? 0) + (story.current?.scrollTop ?? 0);
    const leaving = column.current?.querySelector<HTMLElement>("[data-about-copy][inert] > div");
    if (leaving) leaving.style.translate = `0 ${-scrolled}px`;
    column.current?.scrollTo({ top: 0 });
    story.current?.scrollTo({ top: 0 });
    shedDust("data-about-copy");
  }, [selected, shedDust]);

  // The way back is leaving with the member's copy, so focus returns to their moon.
  const showIntro = useCallback(() => {
    if (member) document.getElementById(moonId(member.slug))?.focus({ preventScroll: true });
    setSelected(null);
  }, [member]);

  // Escape goes back from anywhere on the page; the navbar and the dots keep it for themselves.
  useEffect(() => {
    if (!member || !isPresent) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (event.target instanceof Element && event.target.closest("nav")) return;
      showIntro();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [member, isPresent, showIntro]);

  return (
    <StageSection id="about" labelledBy={member ? memberTitleId(member.slug) : undefined}>
      {/* Phones scroll the whole column; wide screens only the copy, and only when it doesn't fit. */}
      <div
        ref={column}
        data-stage-scroll={tall ? "" : undefined}
        style={columnStyle(orbit, tall, short)}
        className="absolute inset-0 narrow:overflow-y-auto narrow:overscroll-contain narrow:pr-14 narrow:pl-5 narrow:[scrollbar-color:var(--color-plum-600)_transparent] narrow:[scrollbar-width:thin] wide:grid wide:grid-cols-[max(56vw,var(--orbit-edge))_minmax(0,1fr)_clamp(4.5rem,8vw,8rem)]"
      >
        <div
          ref={story}
          data-stage-scroll={tall ? undefined : ""}
          className="@container flex flex-col wide:col-start-2 wide:-mx-3 wide:overflow-y-auto wide:overscroll-contain wide:px-3 wide:pt-[clamp(4.5rem,11dvh,6rem)] wide:pb-8 wide:[scrollbar-color:var(--color-plum-600)_transparent] wide:[scrollbar-width:thin] wide:[mask-image:linear-gradient(to_bottom,transparent_3.5rem,black_4.5rem,black_calc(100%-1.5rem),transparent)] short:pt-14 short:pb-5 short:[mask-image:linear-gradient(to_bottom,transparent_2.5rem,black_3.5rem,black_calc(100%-1rem),transparent)]"
        >
          {/* polite: a screen reader hears the new text, which sits before the moons in the page's order. relative: the leaving copy stays part of what scrolls. */}
          <div id={memberPanelId} aria-live="polite" className="relative my-auto">
            {/* popLayout: the old text holds still while it dissolves. propagate: when the section leaves, its lines dissolve with it. */}
            <AnimatePresence custom={direction} mode="popLayout" propagate>
              {isPresent && (
                <CopySwap key={member?.slug ?? "intro"}>
                  {member ? <MemberDetails member={member} onBack={showIntro} /> : <AboutIntro />}
                </CopySwap>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Outside the scrolling column: the moons stay on the planet's orbit while the copy scrolls. */}
      <MoonOrbit orbit={orbit} tall={tall} selected={selected} onSelect={setSelected} />
    </StageSection>
  );
}
