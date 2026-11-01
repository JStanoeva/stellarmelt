import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router";
import { canUseWebGL2 } from "../art/webgl";
import { isListenPath } from "../lib/tracks";
import { Flight, type DiveStart, type FlightValue } from "./flight";

type Dive = {
  start: DiveStart;
  // The history entry the nebula was pressed on (its location key, so even a link to the same page cancels the dive) and the room it flies to.
  from: string;
  to: string;
  // The scene drew its first frame: the page dissolves from here.
  ready: boolean;
  // The camera reached the landing point: time to open the Listening Room.
  landed: boolean;
};

// If the scene never reports in (slow network, lost GPU), the visitor still arrives.
const LAND_FALLBACK_MS = 2600;

type Props = { children: ReactNode };

// The star flight's shared state: it outlives the page change, so the camera keeps flying into the Listening Room.
export default function FlightProvider({ children }: Props) {
  const navigate = useNavigate();
  const { pathname, key } = useLocation();
  const [canFly] = useState(canUseWebGL2);
  const [id, setId] = useState(0);
  const [dive, setDive] = useState<Dive | null>(null);
  const [cruising, setCruising] = useState(false);
  const [paused, setPaused] = useState(false);

  // A link or Back pressed during the dive takes the visitor elsewhere, so the dive ends there.
  if (dive && key !== dive.from && !isListenPath(pathname)) setDive(null);

  const startDive = useCallback(
    (start: DiveStart, to: string) => {
      if (dive) return;
      setId((previous) => previous + 1);
      setDive({ start, from: key, to, ready: false, landed: false });
    },
    [dive, key],
  );

  const markReady = useCallback(
    () =>
      setDive((current) =>
        current && !current.ready ? { ...current, ready: true } : current,
      ),
    [],
  );
  const land = useCallback(
    () =>
      setDive((current) =>
        current && !current.landed ? { ...current, landed: true } : current,
      ),
    [],
  );

  // The dive ends once the room is open (the scene keeps its planned flight), so leaving the room never flies back.
  const registerCruise = useCallback(() => {
    setCruising(true);
    setDive(null);
    return () => {
      setCruising(false);
      setDive(null);
      setPaused(false);
    };
  }, []);

  const diving = dive !== null && key === dive.from;
  const landedAt = diving && dive.landed ? dive.to : null;
  useEffect(() => {
    if (landedAt) navigate(landedAt);
  }, [landedAt, navigate]);

  useEffect(() => {
    if (!diving) return;
    const timer = window.setTimeout(land, LAND_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [diving, land]);

  // Back or Forward ends the dive too, even onto the page it started from while the room is still opening.
  const hasDive = dive !== null;
  useEffect(() => {
    if (!hasDive) return;
    const cancel = () => setDive(null);
    window.addEventListener("popstate", cancel);
    return () => window.removeEventListener("popstate", cancel);
  }, [hasDive]);

  // The page recedes at once while the flight loads, then dissolves as the camera dives (data-flight in index.css).
  let stage: "press" | "dive" | null = null;
  if (diving) stage = dive.ready ? "dive" : "press";
  useEffect(() => {
    if (!stage) return;
    document.documentElement.dataset.flight = stage;
    return () => {
      delete document.documentElement.dataset.flight;
    };
  }, [stage]);

  const start = dive?.start ?? null;
  const value = useMemo<FlightValue>(
    () => ({
      id,
      dive: start,
      cruising,
      canFly,
      paused,
      setPaused,
      startDive,
      markReady,
      land,
      registerCruise,
    }),
    [
      id,
      start,
      cruising,
      canFly,
      paused,
      startDive,
      markReady,
      land,
      registerCruise,
    ],
  );

  return <Flight value={value}>{children}</Flight>;
}
