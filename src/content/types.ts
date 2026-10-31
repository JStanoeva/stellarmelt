export type IsoDate = `${number}-${number}-${number}`;

export type Member = {
  slug: string;
  name: string;
  role: string;
  blurb: string;
};

export type Song = {
  slug: string;
  title: string;
  trackNo: number;
  durationSec: number;
  sunoShareUrl: string;
  blurb: string;
};

export type Album = {
  title: string;
  blurb: string;
};

export type TimelineEvent = {
  id: string;
  date: IsoDate;
  title: string;
  summary: string;
};
