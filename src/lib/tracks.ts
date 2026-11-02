import { songsUrl, tracks } from "../content/album";
import type { Track } from "../content/types";

export function trackBySlug(slug: string | undefined): Track | undefined {
  return tracks.find((track) => track.slug === slug);
}

export function sunoSongUrl(track: Track): string {
  return `https://suno.com/song/${track.sunoId}`;
}

// encodeURI keeps commas: Vite's dev server leaves %2C undecoded.
export function songAudioUrl(track: Track): string {
  return encodeURI(`${songsUrl}/${track.audioFile}`);
}

// The Listening Room plays the whole album at /listen, or one song at /listen/<slug>.
export function listenPath(track?: Track): string {
  return track ? `/listen/${track.slug}` : "/listen";
}

export function isListenPath(pathname: string): boolean {
  return pathname === "/listen" || pathname.startsWith("/listen/");
}

// "4:33"
export function formatDuration(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// "PT4M33S", for <time dateTime>.
export function isoDuration(seconds: number): string {
  return `PT${Math.floor(seconds / 60)}M${seconds % 60}S`;
}
