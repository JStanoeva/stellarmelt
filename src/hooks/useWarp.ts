import { use } from "react";
import { Site } from "../app/site";
import { loadFlightScene } from "../flight/loadFlight";
import { useFlight } from "./useFlight";

// The cue stays a real link (new tab, no JS, reduced motion, no WebGL); a plain click flies to `to` from where the nebula is.
export function useWarp(to: string) {
  const { reduced } = use(Site);
  const { canFly, startDive } = useFlight();
  const flies = canFly && !reduced;

  // A beat before the click; a failed download shows the still sky where the scene mounts.
  function onPointerDown() {
    if (flies) loadFlightScene().catch(() => {});
  }

  // For a plain left click: true when the flight takes over from the link.
  function warp(link: HTMLAnchorElement): boolean {
    if (!flies) return false;
    const art = link.querySelector("[data-warp-origin] svg") ?? link;
    const rect = art.getBoundingClientRect();
    // The arms may be mid-turn (they spin while hovered), so the galaxy picks up at the same angle.
    const arms = link.querySelector(".nebula-arms");
    const turned = arms ? Number.parseFloat(getComputedStyle(arms).rotate) : 0;
    startDive(
      {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        size: rect.width,
        spin: Number.isFinite(turned) ? (turned * Math.PI) / 180 : 0,
      },
      to,
    );
    return true;
  }

  return { onPointerDown, warp };
}
