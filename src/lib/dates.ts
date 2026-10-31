import type { IsoDate } from "../content/types";

// ISO dates parse as UTC midnight, so format in UTC to keep the same day.
const longDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

export function formatDate(date: IsoDate): string {
  return longDate.format(new Date(date));
}
