import type { IsoDate } from "../content/types";

// ISO dates parse as UTC midnight, so format in UTC to keep the same day.
const longDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

export function formatDate(date: IsoDate): string {
  return longDate.format(new Date(date));
}

export type EventStatus = "upcoming" | "past";

// Upcoming or past is worked out from the date, never stored; an event dated today still counts as upcoming.
// ISO dates compare correctly as strings.
export function eventStatus(date: IsoDate, today: IsoDate): EventStatus {
  return date >= today ? "upcoming" : "past";
}

// The visitor's own calendar date. Read it once outside render (module scope or a useState initializer).
export function localTodayIso(): IsoDate {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  // padStart returns a string, but the padded parts are all digits.
  return `${now.getFullYear()}-${month}-${day}` as IsoDate;
}
