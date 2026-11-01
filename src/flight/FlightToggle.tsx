import PlayGlyph from "../components/player/PlayGlyph";
import { useFlight } from "../hooks/useFlight";

// The Listening Room's flight never ends on its own, so the visitor can freeze it and fly on again.
export default function FlightToggle() {
  const { paused, setPaused } = useFlight();
  return (
    <button
      type="button"
      onClick={() => setPaused(!paused)}
      className="-ml-2 inline-flex min-h-11 items-center gap-2.5 rounded-full px-2 font-mono text-[0.6875rem] tracking-[0.2em] text-mauve-200 uppercase transition-colors duration-300 hover:text-starlight-100"
    >
      <PlayGlyph
        icon={paused ? "play" : "pause"}
        className={`text-rose-300 ${paused ? "size-2.5" : "size-2"}`}
      />
      {paused ? "Fly on" : "Pause the flight"}
    </button>
  );
}
