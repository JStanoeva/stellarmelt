export type IsoDate = `${number}-${number}-${number}`;

export type Member = {
  slug: string;
  name: string;
  role: string;
  tagline: string;
  // One string per paragraph.
  note: readonly string[];
};

export type Singer = "Tora" | "Orion";

export type SideId = "A" | "B";

export type Side = {
  id: SideId;
  name: string;
  subtitle: string;
};

export type Track = {
  n: number;
  slug: string;
  title: string;
  singer: Singer;
  side: SideId;
  // The song's id on Suno: https://suno.com/song/<sunoId>.
  sunoId: string;
  durationSec: number;
  // The song's file name where the songs are hosted (songsUrl).
  audioFile: string;
  endsAct?: "I" | "II";
};

export type Stanza = {
  lines: readonly string[];
  chorus?: true;
};

export type SongWords = {
  // "ja" for the songs written in Japanese.
  lang: "en" | "ja";
  // One string per line.
  description: readonly string[];
  stanzas: readonly Stanza[];
};

export type Album = {
  title: string;
  artist: string;
  released: IsoDate;
  sunoUrl: string;
  credits: string;
  blurb: string;
};

// The platforms Contact links to; each has a Simple Icons glyph (src/components/BrandGlyph.tsx).
export type Brand = "suno" | "youtube" | "github";

export type Channel = {
  brand: Brand;
  name: string;
  handle: string;
  href: string;
};

export type TimelineEvent = {
  id: string;
  date: IsoDate;
  title: string;
  // Optional until Tora writes one; the timeline leaves a missing summary out.
  summary?: string;
};
