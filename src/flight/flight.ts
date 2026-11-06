import { createContext } from "react";

// Where a dive starts: the pressed nebula's centre and width in CSS px, and how far its arms had turned (radians).
export type DiveStart = { x: number; y: number; size: number; spin: number };

export type FlightValue = {
  // Bumps with every dive, so each one gets a fresh scene.
  id: number;
  dive: DiveStart | null;
  // The Listening Room is on screen.
  cruising: boolean;
  // Without WebGL 2 the cue is a plain link and the room shows a still sky.
  canFly: boolean;
  // `to` is the Listening Room path the dive lands on.
  startDive: (start: DiveStart, to: string) => void;
  markReady: () => void;
  land: () => void;
  registerCruise: () => () => void;
};

export const Flight = createContext<FlightValue | null>(null);
