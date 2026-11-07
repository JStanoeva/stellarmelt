import { describe, expect, it } from "vitest";
import { songsUrl, tracks } from "../content/album";
import {
  formatDuration,
  isListenPath,
  isoDuration,
  isSongPath,
  listenPath,
  neighbourTrack,
  songAudioUrl,
  sunoSongUrl,
  trackBySlug,
} from "./tracks";

const firstTrack = tracks[0];
const secondTrack = tracks[1];
const lastTrack = tracks[tracks.length - 1];

describe("trackBySlug", () => {
  it("finds a song by its slug", () => {
    expect(trackBySlug("melt")).toBe(firstTrack);
  });

  it("finds nothing for an unknown or missing slug", () => {
    expect(trackBySlug("not-a-song")).toBeUndefined();
    expect(trackBySlug(undefined)).toBeUndefined();
  });
});

// What the player plays next when it goes round the album.
describe("neighbourTrack", () => {
  it("steps to the next and the previous song", () => {
    expect(neighbourTrack(firstTrack, 1)).toBe(secondTrack);
    expect(neighbourTrack(secondTrack, -1)).toBe(firstTrack);
  });

  it("goes round at the album's ends", () => {
    expect(neighbourTrack(lastTrack, 1)).toBe(firstTrack);
    expect(neighbourTrack(firstTrack, -1)).toBe(lastTrack);
  });
});

// Where the player's <audio> loads a song from.
describe("songAudioUrl", () => {
  it("encodes the spaces in a file name", () => {
    const track = { ...firstTrack, audioFile: "01 Melt.wav" };

    expect(songAudioUrl(track)).toBe(`${songsUrl}/01%20Melt.wav`);
  });

  it("keeps commas, which Vite's dev server wouldn't decode", () => {
    const track = { ...firstTrack, audioFile: "09 In Your Memory, I Stay.wav" };

    expect(songAudioUrl(track)).toBe(
      `${songsUrl}/09%20In%20Your%20Memory,%20I%20Stay.wav`,
    );
  });
});

describe("sunoSongUrl", () => {
  it("links to the song's page on Suno", () => {
    const track = { ...firstTrack, sunoId: "song-id" };

    expect(sunoSongUrl(track)).toBe("https://suno.com/song/song-id");
  });
});

describe("listenPath", () => {
  it("is the whole album without a song, and one room with a song", () => {
    expect(listenPath()).toBe("/listen");
    expect(listenPath(firstTrack)).toBe("/listen/melt");
  });
});

describe("isListenPath", () => {
  it("accepts the album's room and every song's room", () => {
    expect(isListenPath("/listen")).toBe(true);
    for (const track of tracks) {
      expect(isListenPath(listenPath(track))).toBe(true);
    }
  });

  it("refuses a song that isn't on the album, and other pages", () => {
    expect(isListenPath("/listen/not-a-song")).toBe(false);
    expect(isListenPath("/discography/melt")).toBe(false);
  });
});

describe("isSongPath", () => {
  it("accepts every song's page", () => {
    for (const track of tracks) {
      expect(isSongPath(`/discography/${track.slug}`)).toBe(true);
    }
  });

  it("refuses a song that isn't on the album, and other pages", () => {
    expect(isSongPath("/discography/not-a-song")).toBe(false);
    expect(isSongPath("/discography")).toBe(false);
    expect(isSongPath("/listen/melt")).toBe(false);
  });
});

describe("formatDuration", () => {
  it("writes minutes and two-digit seconds", () => {
    expect(formatDuration(273)).toBe("4:33");
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(59)).toBe("0:59");
  });
});

describe("isoDuration", () => {
  it("writes the duration for <time dateTime>", () => {
    expect(isoDuration(273)).toBe("PT4M33S");
  });
});
