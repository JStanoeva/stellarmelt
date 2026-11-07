import { describe, expect, it } from "vitest";
import { album, sides, tracks } from "./album";
import {
  about,
  channels,
  contact,
  hero,
  homeSections,
  kana,
  websiteCredit,
} from "./homeSections";
import { members } from "./members";
import { navLinks } from "./navLinks";
import { timeline } from "./timeline";
import type { Brand } from "./types";

const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const platformHosts: Record<Brand, string> = {
  suno: "suno.com",
  youtube: "www.youtube.com",
  github: "github.com",
};

// Lazy, so this only lists the maps and never reads them.
const songMaps = import.meta.glob("./song-maps/*.json");

function expectUnique(values: readonly string[]) {
  expect(values).toEqual([...new Set(values)]);
}

function expectUniqueKebabCase(ids: readonly string[]) {
  expectUnique(ids);
  for (const id of ids) expect(id).toMatch(KEBAB_CASE);
}

// A date that doesn't exist, like 2026-02-30, doesn't come back unchanged.
function isRealDate(date: string): boolean {
  const parsed = new Date(date);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
}

function expectHttpsOn(href: string, host: string) {
  const url = new URL(href);
  expect(url.protocol).toBe("https:");
  expect(url.hostname).toBe(host);
}

// Every string inside a piece of content, however deep it sits.
function stringsIn(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (typeof value === "object" && value !== null) {
    return Object.values(value).flatMap(stringsIn);
  }
  return [];
}

describe("ids", () => {
  it("gives every song a unique kebab-case slug", () => {
    expectUniqueKebabCase(tracks.map((track) => track.slug));
  });

  it("gives every member a unique kebab-case slug", () => {
    expectUniqueKebabCase(members.map((member) => member.slug));
  });

  it("gives every timeline event a unique kebab-case id", () => {
    expectUniqueKebabCase(timeline.map((event) => event.id));
  });

  it("gives every home section a unique kebab-case id", () => {
    expectUniqueKebabCase(homeSections.map((section) => section.id));
  });
});

describe("dates", () => {
  it("can tell a real date from one that doesn't exist", () => {
    expect(isRealDate("2026-02-28")).toBe(true);
    expect(isRealDate("2026-02-30")).toBe(false);
    expect(isRealDate("2026-13-01")).toBe(false);
    expect(isRealDate("2026-2-3")).toBe(false);
  });

  it("gives the album a real release date", () => {
    expect(isRealDate(album.released)).toBe(true);
  });

  it("gives every timeline event a real date", () => {
    for (const event of timeline) expect(isRealDate(event.date)).toBe(true);
  });

  it("keeps the timeline in chronological order", () => {
    const dates = timeline.map((event) => event.date);
    expect(dates).toEqual([...dates].sort());
  });

  it("puts the album on the timeline on its release date", () => {
    const event = timeline.find(
      (entry) => entry.id === "album-snow-and-the-ai-mind",
    );
    expect(event?.date).toBe(album.released);
  });
});

describe("songs", () => {
  // The player finds the next song by its number, so a gap would stop the album there.
  it("numbers the songs 1 to n, in order", () => {
    const expected = tracks.map((_track, index) => index + 1);
    expect(tracks.map((track) => track.n)).toEqual(expected);
  });

  it("gives every song its own Suno UUID", () => {
    const ids = tracks.map((track) => track.sunoId);
    expectUnique(ids);
    for (const id of ids) expect(id).toMatch(UUID);
  });

  it("links the album to its Suno page with a UUID", () => {
    const id = album.sunoUrl.replace("https://suno.com/album/", "");
    expect(id).toMatch(UUID);
  });

  it("gives every song a whole number of seconds, under an hour", () => {
    for (const track of tracks) {
      expect(Number.isInteger(track.durationSec)).toBe(true);
      expect(track.durationSec).toBeGreaterThan(0);
      expect(track.durationSec).toBeLessThan(3600);
    }
  });

  it("gives every song its own WAV file", () => {
    const files = tracks.map((track) => track.audioFile);
    expectUnique(files);
    for (const file of files) expect(file).toMatch(/\.wav$/);
  });

  it("gives every song a map for the Listening Room, and no others", () => {
    const expected = tracks.map((track) => `./song-maps/${track.slug}.json`);
    expect(Object.keys(songMaps).sort()).toEqual([...expected].sort());
  });
});

describe("links", () => {
  it("links every channel to its own platform over https", () => {
    for (const channel of channels) {
      expectHttpsOn(channel.href, platformHosts[channel.brand]);
    }
  });

  it("links the website credit to GitHub over https", () => {
    expectHttpsOn(websiteCredit.href, platformHosts.github);
  });
});

describe("rendered text", () => {
  const rendered = stringsIn({
    about,
    album,
    channels,
    contact,
    hero,
    homeSections,
    kana,
    members,
    navLinks,
    sides,
    timeline,
    tracks,
    websiteCredit,
  });

  it("reaches the strings nested deep in the content", () => {
    expect(rendered).toContain(members[0].note[0]);
    expect(rendered).toContain(tracks[0].title);
  });

  it("never shows a TODO", () => {
    expect(rendered.filter((text) => text.includes("TODO"))).toEqual([]);
  });
});
