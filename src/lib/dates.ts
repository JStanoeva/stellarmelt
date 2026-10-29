import type { IsoDate } from "../content/types";

// ISO dates parse as UTC midnight, so format in UTC to keep the same day.
const longDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

export function formatDate(date: IsoDate): string {
  return longDate.format(new Date(date));
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
