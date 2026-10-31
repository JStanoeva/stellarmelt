import { AnimatePresence } from "motion/react";
import { use, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { pagePosition } from "../../art/anchors";
import { about } from "../../content/homeSections";
import { members } from "../../content/members";
import { useIsTall } from "../../hooks/useIsTall";
import { useViewportSize } from "../../hooks/useViewportSize";
import Dissolve from "../Dissolve";
import StageSection from "../StageSection";
import { StageMotion } from "../stageMotion";
import MemberDetails from "./MemberDetails";
import { memberPanelId, memberTabId } from "./memberIds";
import MoonOrbit from "./MoonOrbit";
import { orbitBottom, orbitFor } from "./orbit";

// Room for the front moon's name and a gap, so the copy column always starts past it.
const LABEL_ROOM_PX = 180;
// The short: variant in index.css (max-height: 30rem): landscape phones scroll the whole column.
const SHORT_PX = 480;

// The band are the planet's moons: the selected one rests at the front of the orbit, its story beside it.
export default function AboutSection() {
  const [selected, setSelected] = useState(0);
  const tall = useIsTall();
  const { width, height } = useViewportSize();
  const [nameY, setNameY] = useState<number>();
  const orbit = orbitFor(width, height, tall, nameY);
  const { direction } = use(StageMotion);
  const member = members[selected];
  const panel = useRef<HTMLDivElement>(null);
  const story = useRef<HTMLDivElement>(null);

  // Phones and short screens scroll the whole column; other wide screens scroll only the member's story.
  const scrollsColumn = tall || height <= SHORT_PX;
  const top = orbitBottom(orbit);

  // A newly picked member's story starts at its top, with the name level with the front moon.
  useLayoutEffect(() => {
    if (!scrollsColumn && story.current) story.current.scrollTop = 0;
  }, [selected, scrollsColumn]);

  useLayoutEffect(() => {
    const measure = () => {
      const name = panel.current?.querySelector<HTMLElement>(":scope > :not([inert]) h3");
      if (name) setNameY(Math.round(pagePosition(name).top + name.offsetHeight / 2));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (panel.current) observer.observe(panel.current);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [selected]);
  // On phones the copy starts under the moons and fades out before it scrolls up under them.
  const columnStyle: CSSProperties = tall
    ? {
        paddingTop: top,
        maskImage: `linear-gradient(to bottom, transparent ${top - 40}px, black ${top}px)`,
      }
    : // The orbit's outermost point, not the front moon's, so the column doesn't shift as the front follows the name.
      ({ "--orbit-edge": `${orbit.cx + orbit.radius + LABEL_ROOM_PX}px` } as CSSProperties);

  return (
    <StageSection id="about">
      <div
        data-stage-scroll={scrollsColumn ? "" : undefined}
        style={columnStyle}
        className="absolute inset-0 narrow:overflow-y-auto narrow:overscroll-contain narrow:pr-14 narrow:pb-16 narrow:pl-5 wide:grid wide:grid-cols-[max(56vw,var(--orbit-edge))_minmax(0,1fr)_clamp(4.5rem,8vw,8rem)] wide:grid-rows-[minmax(37dvh,auto)_minmax(0,1fr)] short:grid-rows-[auto_auto] short:overflow-y-auto short:overscroll-contain short:pb-10 short:[mask-image:linear-gradient(to_bottom,transparent_3rem,black_5rem)]"
      >
        <header className="@container wide:col-start-2 wide:row-start-1 wide:self-end wide:pt-24 wide:pb-[4.5dvh] short:self-start short:pt-16">
          <Dissolve order={0} tracking={-0.025} loosen blur>
            <h2
              id="about-title"
              data-stage-heading
              tabIndex={-1}
              className="font-display text-[9.6vw] leading-[0.92] font-extrabold text-stardust-50 wide:text-[clamp(1.75rem,11cqi,4.25rem)]"
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
        </header>

        <div
          ref={story}
          data-stage-scroll={scrollsColumn ? undefined : ""}
          className="@container mt-8 wide:col-start-2 wide:row-start-2 wide:mt-0 wide:-mx-3 wide:overflow-y-auto wide:overscroll-contain wide:px-3 wide:pt-2 wide:pb-14 wide:[mask-image:linear-gradient(to_bottom,black_calc(100%-3.5rem),transparent)] short:overflow-visible short:pb-0 short:[mask-image:none]"
        >
          <div
            ref={panel}
            role="tabpanel"
            id={memberPanelId}
            aria-labelledby={memberTabId(member.slug)}
            tabIndex={0}
            className="grid rounded-md"
          >
            {/* propagate: when the section leaves, the member's lines dissolve with it. */}
            <AnimatePresence custom={direction} propagate>
              <MemberDetails
                key={member.slug}
                member={member}
                position={selected + 1}
                count={members.length}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Outside the scrolling column: the moons stay on the planet's orbit while the copy scrolls. */}
      <MoonOrbit orbit={orbit} tall={tall} selected={selected} onSelect={setSelected} />
    </StageSection>
  );
}
