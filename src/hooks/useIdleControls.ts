import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

const IDLE_MS = 3500;

// Mouse: any movement wakes the controls, and they stay while hovered or focused from the keyboard. Touch: a tap on the scene toggles them, like a video player.
export function useIdleControls(armed: boolean) {
  const [awake, setAwake] = useState(true);
  const held = useRef(false);
  const timer = useRef(0);
  const awakeNow = useRef(true);
  const swallowClick = useRef(false);

  const arm = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(function rest() {
      if (held.current) return;
      const focused = document.activeElement;
      if (focused?.matches("a:focus-visible, button:focus-visible")) {
        timer.current = window.setTimeout(rest, IDLE_MS);
        return;
      }
      awakeNow.current = false;
      setAwake(false);
    }, IDLE_MS);
  }, []);

  useEffect(() => {
    if (!armed) return;
    const wake = () => {
      awakeNow.current = true;
      setAwake(true);
      arm();
    };
    const onMove = (event: PointerEvent) => {
      const moved = event.movementX !== 0 || event.movementY !== 0;
      if (event.pointerType === "mouse" && moved) wake();
    };
    const onDown = (event: PointerEvent) => {
      // A tap on sleeping controls only wakes them: waking makes the buttons live before the tap's click lands.
      swallowClick.current =
        event.pointerType !== "mouse" && !awakeNow.current;
      if (event.pointerType === "mouse") held.current = false;
      const onControl =
        event.target instanceof Element &&
        event.target.closest("a, button") !== null;
      if (event.pointerType !== "mouse" && awakeNow.current && !onControl) {
        window.clearTimeout(timer.current);
        awakeNow.current = false;
        setAwake(false);
        return;
      }
      wake();
    };
    const onClick = (event: MouseEvent) => {
      if (!swallowClick.current) return;
      swallowClick.current = false;
      event.preventDefault();
      event.stopPropagation();
    };
    wake();
    window.addEventListener("click", onClick, { capture: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("keydown", wake);
    return () => {
      window.clearTimeout(timer.current);
      window.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", wake);
    };
  }, [armed, arm]);

  // Pointer events still run while it isn't armed, so the timer they start ends with the room too.
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onPointerEnter = useCallback((event: ReactPointerEvent) => {
    if (event.pointerType === "mouse") held.current = true;
  }, []);
  const onPointerLeave = useCallback(
    (event: ReactPointerEvent) => {
      if (event.pointerType !== "mouse") return;
      held.current = false;
      arm();
    },
    [arm],
  );

  return { visible: !armed || awake, onPointerEnter, onPointerLeave };
}
