import { afterEach, describe, expect, it, vi } from "vitest";
import { eventStatus, formatDate, localTodayIso } from "./dates";

describe("eventStatus", () => {
  const today = "2026-11-07";

  it("calls yesterday's event past", () => {
    expect(eventStatus("2026-11-06", today)).toBe("past");
  });

  it("calls today's event upcoming", () => {
    expect(eventStatus(today, today)).toBe("upcoming");
  });

  it("calls tomorrow's event upcoming", () => {
    expect(eventStatus("2026-11-08", today)).toBe("upcoming");
  });

  it("still works across a new year", () => {
    expect(eventStatus("2026-12-31", "2027-01-01")).toBe("past");
    expect(eventStatus("2027-01-01", "2026-12-31")).toBe("upcoming");
  });
});

describe("formatDate", () => {
  it("writes the date out in full", () => {
    expect(formatDate("2026-11-01")).toBe("November 1, 2026");
  });
});

describe("localTodayIso", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("pads the month and the day", () => {
    vi.useFakeTimers();
    // In local time, like localTodayIso, so this passes in every time zone.
    vi.setSystemTime(new Date(2026, 0, 5));

    expect(localTodayIso()).toBe("2026-01-05");
  });
});
