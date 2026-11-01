import { m, type Variants } from "motion/react";
import { use, type Ref } from "react";
import { Link } from "react-router";
import PlayingHalo from "../../components/player/PlayingHalo";
import type { Track } from "../../content/types";
import type { PlayerStatus } from "../../player/player";
import {
  ENTER_DELAY,
  easeCondense,
  easeFade,
  fadeVariants,
  StageMotion,
} from "../stageMotion";
import { magnitude, pad2, type Point } from "./sky";
import StarDot from "./StarDot";

type Props = {
  track: Track;
  point: Point;
  // Where the star sits in its frame (0–1), to keep its name label inside the sky.
  unit: Point;
  order: number;
  // The star's diameter in px at magnitude 1.
  size: number;
  tabbable: boolean;
  // The player's status while this is its song, else null.
  status: PlayerStatus | null;
  onFocus: () => void;
  ref: Ref<HTMLAnchorElement>;
};

// Stars ignite one after another in track order, then go out together a beat faster.
function ignite(order: number): Variants {
  return {
    hidden: { opacity: 0, scale: 0.2 },
    shown: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: ENTER_DELAY + 0.05 + order * 0.04,
        duration: 0.5,
        ease: easeCondense,
      },
    },
    gone: {
      opacity: 0,
      scale: 0.5,
      transition: { duration: 0.3, delay: order * 0.01, ease: easeFade },
    },
  };
}

const still = fadeVariants({ scale: 1 });

// One song as a star: a link to its page, named when hovered or focused.
export default function HomeStar({
  track,
  point,
  unit,
  order,
  size,
  tabbable,
  status,
  onFocus,
  ref,
}: Props) {
  const { reduced } = use(StageMotion);
  const current = status !== null;
  let across = "left-1/2 -translate-x-1/2";
  if (unit.x < 0.3) across = "left-0";
  else if (unit.x > 0.7) across = "right-0";
  const along = unit.y < 0.45 ? "top-full mt-0.5" : "bottom-full mb-0.5";
  let statusText = "";
  if (current) statusText = status === "paused" ? ", paused" : ", now playing";

  return (
    <m.div
      variants={reduced ? still : ignite(order)}
      className="absolute size-0"
      style={{ left: point.x, top: point.y }}
    >
      <Link
        ref={ref}
        to={`/discography/${track.slug}`}
        tabIndex={tabbable ? 0 : -1}
        onFocus={onFocus}
        className="group absolute grid size-8 -translate-1/2 place-items-center rounded-full wide:size-9"
      >
        <span className="sr-only">{`Track ${track.n}: ${track.title}, sung by ${track.singer}${statusText}`}</span>
        {current && (
          <PlayingHalo singer={track.singer} className="size-14 wide:size-16" />
        )}
        <span className="relative motion-ok:transition-transform motion-ok:duration-300 motion-ok:group-hover:scale-150 motion-ok:group-focus-visible:scale-150">
          <StarDot
            singer={track.singer}
            magnitude={magnitude(track)}
            scale={size}
          />
        </span>
        {/* The chart's catalogue number, until the full name takes its place. */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-[calc(50%+3px)] font-mono text-[0.5625rem] tracking-[0.1em] transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0 ${current ? "text-rose-200" : "text-mauve-300/80"} ${unit.x > 0.7 ? "right-[calc(50%+6px)]" : "left-[calc(50%+6px)]"}`}
        >
          {pad2(track.n)}
        </span>
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute ${across} ${along} flex items-baseline gap-2 font-mono text-[0.625rem] tracking-[0.16em] whitespace-nowrap text-mauve-200 uppercase opacity-0 [text-shadow:0_0_12px_var(--color-night-950),0_0_4px_var(--color-night-950)] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100`}
        >
          <span className="text-rose-300">{pad2(track.n)}</span>
          <span className="font-display text-[1rem] font-bold tracking-normal text-stardust-50 normal-case">
            {track.title}
          </span>
          {track.singer}
        </span>
      </Link>
    </m.div>
  );
}
