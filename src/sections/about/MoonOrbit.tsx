import { animate, useMotionValue } from "motion/react";
import { use, useEffect, useRef, type KeyboardEvent } from "react";
import { StageMotion } from "../stageMotion";
import { members } from "../../content/members";
import MoonTab from "./MoonTab";
import OrbitArc from "./OrbitArc";
import { wrapOffset, type Orbit } from "./orbit";

type Props = {
  orbit: Orbit;
  tall: boolean;
  selected: number;
  onSelect: (index: number) => void;
};

// The same curve as --ease-orbit in index.css.
const easeOrbit = [0.65, 0, 0.35, 1] as const;
const count = members.length;

// The members as moons on the planet's orbit, and the tablist that picks one: the orbit turns it to the front.
export default function MoonOrbit({ orbit, tall, selected, onSelect }: Props) {
  const { reduced } = use(StageMotion);
  // How far the orbit has turned, in moons. It counts on past the last member, so each turn takes the short way round.
  const spin = useMotionValue(selected);
  const spinTarget = useRef(selected);
  const tabs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => () => spin.stop(), [spin]);

  function select(index: number) {
    const ahead = (((index - spinTarget.current) % count) + count) % count;
    spinTarget.current += ahead > count / 2 ? ahead - count : ahead;
    if (reduced) spin.jump(spinTarget.current);
    else animate(spin, spinTarget.current, { duration: 0.9, ease: easeOrbit });
    onSelect(index);
  }

  // Wide screens stack the moons down the planet's limb; phones run them along its underside.
  const nextKey = tall ? "ArrowRight" : "ArrowDown";
  const previousKey = tall ? "ArrowLeft" : "ArrowUp";

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let index: number;
    if (event.key === nextKey) index = (selected + 1) % count;
    else if (event.key === previousKey) index = (selected - 1 + count) % count;
    else if (event.key === "Home") index = 0;
    else if (event.key === "End") index = count - 1;
    else return;
    // Handled here, so the home stage doesn't step as well.
    event.preventDefault();
    select(index);
    tabs.current.get(members[index].slug)?.focus({ preventScroll: true });
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-dvh">
      <OrbitArc orbit={orbit} spin={spin} />
      <div
        role="tablist"
        aria-label="Band members"
        aria-orientation={tall ? "horizontal" : "vertical"}
        onKeyDown={onKeyDown}
      >
        {members.map((member, index) => (
          <MoonTab
            key={member.slug}
            ref={(node) => {
              if (node) tabs.current.set(member.slug, node);
              return () => {
                tabs.current.delete(member.slug);
              };
            }}
            member={member}
            index={index}
            slot={wrapOffset(orbit, index - selected)}
            selected={index === selected}
            orbit={orbit}
            spin={spin}
            onSelect={select}
          />
        ))}
      </div>
    </div>
  );
}
