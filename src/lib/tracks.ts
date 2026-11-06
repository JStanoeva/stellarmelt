import { matchPath } from "react-router";
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

// By the router's own matching rules; a slug that isn't on the album is the 404 page, not a room.
export function isListenPath(pathname: string): boolean {
  if (matchPath("/listen", pathname)) return true;
  const slug = matchPath("/listen/:slug", pathname)?.params.slug;
  return trackBySlug(slug) !== undefined;
}

export function isSongPath(pathname: string): boolean {
  const slug = matchPath("/discography/:slug", pathname)?.params.slug;
  return trackBySlug(slug) !== undefined;
}

// The next or previous song on the album, going round at its ends.
export function neighbourTrack(track: Track, step: 1 | -1): Track {
  const index = tracks.findIndex((other) => other.slug === track.slug);
  return tracks[(index + step + tracks.length) % tracks.length];
}

// "4:33"
export function formatDuration(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// "PT4M33S", for <time dateTime>.
export function isoDuration(seconds: number): string {
  return `PT${Math.floor(seconds / 60)}M${seconds % 60}S`;
}
