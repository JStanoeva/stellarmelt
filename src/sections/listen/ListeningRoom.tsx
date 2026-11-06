import { use, useEffect, useEffectEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Site } from "../../app/site";
import { tracks } from "../../content/album";
import type { Track } from "../../content/types";
import { useFlight } from "../../hooks/useFlight";
import { useFullscreen } from "../../hooks/useFullscreen";
import { useIdleControls } from "../../hooks/useIdleControls";
import { usePlayer } from "../../hooks/usePlayer";
import { usePlayerView } from "../../hooks/usePlayerView";
import { useWakeLock } from "../../hooks/useWakeLock";
import { listenPath, neighbourTrack } from "../../lib/tracks";
import RoomGlyph from "./RoomGlyph";
import RoomTitle from "./RoomTitle";

const CONTROL =
  "grid size-11 place-items-center rounded-full text-stardust-50/60 hover:text-stardust-50 motion-ok:transition-colors motion-ok:duration-500";

// The song room's own song; undefined in the album room.
type Props = { track: Track | undefined };

// The Listening Room over the endless flight (FlightLayer): the whole album, or one song. The visuals tell the story, so its few controls fade out when idle.
export default function ListeningRoom({ track }: Props) {
  usePlayerView();
  const { reduced } = use(Site);
  const { dive, registerCruise } = useFlight();
  const { current, status, setMode, play, pause, resume, startFromCue } =
    usePlayer();
  const navigate = useNavigate();
  // Arriving by a dive, the controls condense in as the camera comes through the galaxy.
  const [arrived] = useState(() => dive !== null && !reduced);
  const started = current !== null;
  const isPlaying = status === "playing" || status === "loading";
  const { visible, onPointerEnter, onPointerLeave } = useIdleControls(started);
  const fullscreen = useFullscreen();
  useWakeLock(status === "playing");

  useEffect(() => registerCruise(), [registerCruise]);

  // The room says what happens when a song ends; once it's gone, the album stops after its last track again.
  useEffect(() => {
    setMode(track ? "single" : "endless");
    return () => setMode((mode) => (mode === "endless" ? "album" : mode));
  }, [track, setMode]);

  // Back or Forward between song rooms: the song follows the address.
  const followAddress = useEffectEvent(() => {
    if (track && current && current.slug !== track.slug) play(track, "single");
  });
  useEffect(() => followAddress(), [track]);

  function toggle() {
    if (!started) startFromCue(track ?? null);
    else if (status === "paused") resume();
    else pause();
  }

  // The album room goes round the album; a song room moves on to the next song's room.
  function move(step: 1 | -1) {
    if (!current) return;
    const next = neighbourTrack(current, step);
    if (track) navigate(listenPath(next));
    else play(next, "endless");
  }

  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (
      event.defaultPrevented ||
      event.repeat ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    )
      return;
    const onControl =
      event.target instanceof Element && event.target.closest("a, button");
    if (onControl && (event.key === " " || event.key === "Enter")) return;
    if (event.key === " ") {
      event.preventDefault();
      toggle();
    } else if (event.key === "ArrowRight") move(1);
    else if (event.key === "ArrowLeft") move(-1);
    else if (event.key === "f" && fullscreen.supported) fullscreen.toggle();
  });
  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // A faded control can't be pressed: a tap only wakes them, it never presses a button nobody can see.
  const tappable = visible ? "pointer-events-auto" : "";
  const title = track
    ? `${track.title} · Listening Room · Stellarmelt`
    : "Listening Room · Stellarmelt";

  return (
    <div
      className={`fixed inset-0 touch-manipulation overflow-hidden select-none ${visible ? "" : "cursor-none"}`}
    >
      <title>{title}</title>
      <h1 tabIndex={-1} className="sr-only">
        Listening Room
      </h1>
      <div
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        // A mouse press leaves focus on the control, and Space would press it again even once it has faded.
        onClick={(event) => {
          const focused = document.activeElement;
          if (event.detail > 0 && focused instanceof HTMLElement) focused.blur();
        }}
        className={`pointer-events-none absolute inset-0 ${visible ? "opacity-100 motion-ok:duration-300 motion-ok:ease-out" : "opacity-0 motion-ok:duration-[1400ms] motion-ok:ease-in"} motion-ok:transition-opacity`}
      >
        <div className={`absolute inset-0 ${arrived ? "flight-arrive" : ""}`}>
          {started && (
            <Link
              to="/discography"
              className={`${tappable} absolute top-[max(0.5rem,env(safe-area-inset-top))] left-[max(0.75rem,env(safe-area-inset-left))] flex h-11 items-center gap-2 rounded-full px-2 text-xs tracking-wide text-stardust-50/70 [text-shadow:0_0_12px_var(--color-night-950)] hover:text-stardust-50 motion-ok:transition-colors motion-ok:duration-500`}
            >
              <RoomGlyph icon="back" className="size-3.5" />
              Discography
            </Link>
          )}
          {started && fullscreen.supported && (
            <button
              type="button"
              aria-label={fullscreen.active ? "Leave full screen" : "Full screen"}
              onClick={fullscreen.toggle}
              className={`${CONTROL} ${tappable} absolute top-[max(0.5rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))]`}
            >
              <RoomGlyph
                icon={fullscreen.active ? "leave-fullscreen" : "fullscreen"}
                className="size-4"
              />
            </button>
          )}
          <div className="absolute inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-1">
            <RoomTitle title={(current ?? track ?? tracks[0]).title} />
            <div className="flex items-center gap-2">
              {started && (
                <button
                  type="button"
                  aria-label="Previous song"
                  onClick={() => move(-1)}
                  className={`${CONTROL} ${tappable}`}
                >
                  <RoomGlyph icon="previous" className="size-4" />
                </button>
              )}
              <button
                type="button"
                aria-label={isPlaying ? "Pause" : "Play"}
                onClick={toggle}
                className={`${CONTROL} ${tappable}`}
              >
                <RoomGlyph
                  icon={isPlaying ? "pause" : "play"}
                  className="size-5"
                />
              </button>
              {started && (
                <button
                  type="button"
                  aria-label="Next song"
                  onClick={() => move(1)}
                  className={`${CONTROL} ${tappable}`}
                >
                  <RoomGlyph icon="next" className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
