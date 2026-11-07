import { m, useIsPresent } from "motion/react";
import { use, useEffectEvent, useLayoutEffect, useRef } from "react";
import { useNavigationType } from "react-router";
import { Site } from "../../app/site";
import type { Track } from "../../content/types";
import { useIsPhone } from "../../hooks/useIsPhone";
import type { WordsSwap } from "../../hooks/useWordsSwap";
import PhoneSongLayout from "./phone/PhoneSongLayout";
import SongLayout from "./SongLayout";
import { easeCondense, easeFade } from "../stageMotion";

const FADE_OUT = 0.28;
const FADE_IN = 0.6;

// `moved`: this page came from another song's, so it takes the scroll and the focus itself once it's in.
type Props = { track: Track; moved: boolean; swap: WordsSwap };

// One song's page as it fades in and out; phones have their own calmer layout of it.
export default function SongArticle({ track, moved, swap }: Props) {
  const { reduced } = use(Site);
  const isPresent = useIsPresent();
  const navigationType = useNavigationType();
  const heading = useRef<HTMLHeadingElement>(null);
  const phone = useIsPhone();

  const arrive = useEffectEvent(() => {
    if (!moved) return;
    // Back and Forward keep the scroll position the router restored.
    if (navigationType !== "POP") window.scrollTo(0, 0);
    heading.current?.focus({ preventScroll: true });
  });
  useLayoutEffect(() => arrive(), []);

  return (
    <m.article
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: reduced ? 0 : FADE_IN,
          ease: easeCondense,
        },
      }}
      exit={{
        opacity: 0,
        transition: { duration: reduced ? 0 : FADE_OUT, ease: easeFade },
      }}
      inert={!isPresent}
      className={
        phone
          ? "flex min-h-svh flex-col px-5 [-webkit-tap-highlight-color:transparent]"
          : "flex h-full flex-col px-5 pt-[5.25rem] pb-12 [--song-title:9vw] wide:px-[clamp(1.25rem,3.4vw,3.5rem)] wide:pt-[clamp(5.5rem,12dvh,7.5rem)] wide:pb-16 wide:[--song-title:clamp(3rem,min(5.4vw,11dvh),5.75rem)] short:pt-16 short:[--song-title:clamp(1.625rem,7.5dvh,2.25rem)]"
      }
    >
      <title>{`${track.title} · Stellarmelt`}</title>
      {phone ? (
        <PhoneSongLayout track={track} heading={heading} swap={swap} />
      ) : (
        <SongLayout track={track} heading={heading} swap={swap} />
      )}
    </m.article>
  );
}
