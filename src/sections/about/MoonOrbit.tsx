import { animate, useMotionValue } from "motion/react";
import { use, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { StageMotion } from "../stageMotion";
import { members } from "../../content/members";
import MoonButton from "./MoonButton";
import OrbitArc from "./OrbitArc";
import { wrapOffset, type Orbit } from "./orbit";

type Props = {
  orbit: Orbit;
  tall: boolean;
  selected: number | null;
  onSelect: (index: number | null) => void;
};

// The same curve as --ease-orbit in index.css.
const easeOrbit = [0.65, 0, 0.35, 1] as const;
const count = members.length;

// The members as moons on the planet's orbit. Pressing one turns it to the front; pressing it again goes back to the intro.
export default function MoonOrbit({ orbit, tall, selected, onSelect }: Props) {
  const { reduced } = use(StageMotion);
  // How far the orbit has turned, in moons. It counts on past the last member, so each turn takes the short way round.
  const spin = useMotionValue(0);
  const spinTarget = useRef(0);
  // 1 while a member is selected: their moon grows at the front and that stretch of orbit lights up.
  const lift = useMotionValue(0);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  // One Tab stop for the six moons; the arrow keys move between them.
  const [tabStop, setTabStop] = useState(0);
  const [pressedOnce, setPressedOnce] = useState(false);

  useEffect(() => () => spin.stop(), [spin]);

  useEffect(() => {
    const target = selected === null ? 0 : 1;
    if (reduced) {
      lift.jump(target);
      return;
    }
    const controls = animate(lift, target, { duration: 0.9, ease: easeOrbit });
    return () => controls.stop();
  }, [selected, reduced, lift]);

  function press(index: number) {
    setPressedOnce(true);
    if (index === selected) {
      onSelect(null);
      return;
    }
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
    if (event.key === nextKey) index = (tabStop + 1) % count;
    else if (event.key === previousKey) index = (tabStop - 1 + count) % count;
    else if (event.key === "Home") index = 0;
    else if (event.key === "End") index = count - 1;
    else return;
    // Handled here, so the home stage doesn't step as well.
    event.preventDefault();
    buttons.current.get(members[index].slug)?.focus({ preventScroll: true });
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-dvh">
      <OrbitArc orbit={orbit} spin={spin} lift={lift} />
      <div
        role="toolbar"
        aria-label="Band members"
        aria-orientation={tall ? "horizontal" : "vertical"}
        onKeyDown={onKeyDown}
      >
        {members.map((member, index) => (
          <MoonButton
            key={member.slug}
            ref={(node) => {
              if (node) buttons.current.set(member.slug, node);
              return () => {
                buttons.current.delete(member.slug);
              };
            }}
            member={member}
            index={index}
            slot={wrapOffset(orbit, index)}
            selected={index === selected}
            tabStop={index === tabStop}
            hint={!pressedOnce}
            orbit={orbit}
            spin={spin}
            lift={lift}
            onPress={press}
            onFocus={setTabStop}
          />
        ))}
      </div>
    </div>
  );
}
