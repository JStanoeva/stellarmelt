import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { tracks } from "../content/album";
import type { Track } from "../content/types";
import { neighbourTrack, songAudioUrl } from "../lib/tracks";
import {
  Player,
  type PlayerStatus,
  type PlayerValue,
  type PlayMode,
} from "./player";

const LEAVE_GRACE_MS = 600;
const FADE_MS = 900;

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

type Props = { children: ReactNode };

// The site's one <audio>: songs play from the playlist and keep playing between the views that register (usePlayerView).
export default function PlayerProvider({ children }: Props) {
  const audio = useRef<HTMLAudioElement>(null);
  const [current, setCurrent] = useState<Track | null>(null);
  const [status, setStatus] = useState<PlayerStatus | null>(null);
  const [mode, setMode] = useState<PlayMode>("album");
  const views = useRef(0);
  const leaveTimer = useRef(0);
  const fadeFrame = useRef(0);

  const stop = useCallback(() => {
    cancelAnimationFrame(fadeFrame.current);
    const media = audio.current;
    if (media) {
      media.pause();
      media.removeAttribute("src");
      media.load();
      media.volume = 1;
    }
    setCurrent(null);
    setStatus(null);
  }, []);

  // A newer src or a pause() interrupts play() with an AbortError; a real failure keeps the song's place, so a press can try again.
  const start = useCallback((media: HTMLAudioElement) => {
    media.play().catch((error: unknown) => {
      if (!isAbort(error)) setStatus("paused");
    });
  }, []);

  const play = useCallback(
    (track: Track, nextMode: PlayMode = "album") => {
      const media = audio.current;
      if (!media) return;
      cancelAnimationFrame(fadeFrame.current);
      media.volume = 1;
      media.src = songAudioUrl(track);
      setCurrent(track);
      setMode(nextMode);
      setStatus("loading");
      start(media);
    },
    [start],
  );

  const pause = useCallback(() => {
    cancelAnimationFrame(fadeFrame.current);
    const media = audio.current;
    if (!media) return;
    media.pause();
    media.volume = 1;
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    cancelAnimationFrame(fadeFrame.current);
    const media = audio.current;
    if (!media) return;
    media.volume = 1;
    if (media.error) media.load();
    const ready = media.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;
    setStatus(ready ? "playing" : "loading");
    start(media);
  }, [start]);

  const toggle = useCallback(
    (track: Track) => {
      if (current?.slug !== track.slug) play(track, "album");
      else if (status === "paused") resume();
      else pause();
    },
    [current, status, play, pause, resume],
  );

  // Album cue: go on with what's on unless it's a lone song, else start track 1. Song cue: go on with that song, else play it alone.
  const startFromCue = useCallback(
    (track: Track | null) => {
      const goesOn = track
        ? current?.slug === track.slug
        : current !== null && mode !== "single";
      if (!goesOn) {
        play(track ?? tracks[0], track ? "single" : "endless");
        return;
      }
      setMode(track ? "single" : "endless");
      if (status === "paused") resume();
    },
    [current, mode, status, play, resume],
  );

  // A hidden tab runs no animation frames, so there the song pauses at once.
  const fadeOut = useCallback(() => {
    const media = audio.current;
    if (!media || media.paused) return;
    if (document.hidden) {
      pause();
      return;
    }
    const begin = performance.now();
    const step = (now: number) => {
      const left = 1 - (now - begin) / FADE_MS;
      if (left <= 0) {
        pause();
        return;
      }
      // A frame's timestamp can come from just before `begin`, and a volume above 1 throws.
      media.volume = Math.min(left, 1);
      fadeFrame.current = requestAnimationFrame(step);
    };
    fadeFrame.current = requestAnimationFrame(step);
  }, [pause]);

  // A page change unmounts one view and mounts the next in the same commit, so the leave waits a moment.
  const registerView = useCallback(() => {
    views.current += 1;
    window.clearTimeout(leaveTimer.current);
    // Back while the song was fading out: it plays on.
    cancelAnimationFrame(fadeFrame.current);
    if (audio.current) audio.current.volume = 1;
    return () => {
      views.current -= 1;
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = window.setTimeout(() => {
        if (views.current === 0) fadeOut();
      }, LEAVE_GRACE_MS);
    };
  }, [fadeOut]);

  const subscribeTime = useCallback((onChange: () => void) => {
    const media = audio.current;
    media?.addEventListener("timeupdate", onChange);
    media?.addEventListener("emptied", onChange);
    return () => {
      media?.removeEventListener("timeupdate", onChange);
      media?.removeEventListener("emptied", onChange);
    };
  }, []);

  const readTime = useCallback(() => audio.current?.currentTime ?? 0, []);

  // A tab hidden mid-fade runs no frames, so the fade would hang there: with no view left, pause at once.
  useEffect(() => {
    const onVisibilityChange = () => {
      const media = audio.current;
      if (document.hidden && views.current === 0 && media && !media.paused) {
        pause();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [pause]);

  useEffect(
    () => () => {
      cancelAnimationFrame(fadeFrame.current);
      window.clearTimeout(leaveTimer.current);
    },
    [],
  );

  function playNext() {
    // A lone song goes back to its start and rests, so its room keeps its controls.
    if (mode === "single" && audio.current) {
      audio.current.currentTime = 0;
      pause();
      return;
    }
    let next: Track | undefined;
    if (current && mode === "endless") next = neighbourTrack(current, 1);
    else if (current && mode === "album") {
      next = tracks.find((track) => track.n === current.n + 1);
    }
    if (!next) {
      stop();
      return;
    }
    play(next, mode);
    // It ended while no view was left (mid-fade): the next song waits, paused, for a control to come back.
    if (views.current === 0) pause();
  }

  const value = useMemo<PlayerValue>(
    () => ({
      current,
      status,
      setMode,
      play,
      pause,
      resume,
      toggle,
      startFromCue,
      registerView,
      subscribeTime,
      readTime,
    }),
    [
      current,
      status,
      play,
      pause,
      resume,
      toggle,
      startFromCue,
      registerView,
      subscribeTime,
      readTime,
    ],
  );

  return (
    <Player value={value}>
      {children}
      <audio
        ref={audio}
        preload="none"
        onPlaying={() => setStatus("playing")}
        onWaiting={() => setStatus("loading")}
        // Paused from outside too (media keys, the browser's own controls): the playlist shows it paused.
        onPause={(event) => {
          const media = event.currentTarget;
          if (!media.ended && media.getAttribute("src")) setStatus("paused");
        }}
        onEnded={playNext}
        // Stopping empties the element, which some browsers report as an error; only a real source counts, and it keeps its place.
        onError={(event) => {
          if (event.currentTarget.getAttribute("src")) setStatus("paused");
        }}
      />
    </Player>
  );
}
