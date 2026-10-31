import type { TimelineEvent } from "../../content/types";

// The time ruler under the date, at true time scale, in CSS px from the ruler's left edge (the moon's ring).
export type RulerMonth = {
  key: string;
  x: number;
  month: string;
  // Shown under the first month and under each January.
  year: string | null;
  labelled: boolean;
};

// Events on the same day: one date label, and a binary star for two.
export type RulerGroup = { key: string; x: number; label: string; members: number[] };

export type RulerStop = {
  id: string;
  // Where the star sits on the axis.
  x: number;
  group: number;
  // The tab's target, never wider than 44 px and never overlapping its neighbours'.
  hitLeft: number;
  hitRight: number;
};

export type Ruler = {
  width: number;
  axisEnd: number;
  months: RulerMonth[];
  ticks: number[];
  groups: RulerGroup[];
  stops: RulerStop[];
};

// The axis sits this far down the ruler: the hover titles and the date labels live above it, the months below.
export const AXIS_Y = 46;
export const TARGET_PX = 44;
// Room before the first month (for the first date label) and after the last (the arrowhead and the last label).
const LEAD_PX = 30;
const TAIL_PX = 34;
// A binary star's two points sit this far apart on the axis, a hair either side of their day.
const BINARY_PX = 18;
// The space a date label like "SEP 29" needs, gap included.
export const LABEL_PX = 62;
const DAY_MS = 86_400_000;
const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] as const;

function monthStart(time: number, offset = 0): number {
  const date = new Date(time);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1);
}

// "2025-07-27" → "JUL 27".
function shortDate(iso: string): string {
  const [, month, day] = iso.split("-").map(Number);
  return `${monthNames[month - 1]} ${day}`;
}

export function rulerFor(events: readonly TimelineEvent[], available: number, narrow: boolean): Ruler {
  // Whole months, from the first event's month to the end of the last one's.
  const domainStart = monthStart(Date.parse(events[0].date));
  const domainEnd = monthStart(Date.parse(events[events.length - 1].date), 1);
  const span = (domainEnd - domainStart) / DAY_MS;
  const dayOf = (iso: string) => (Date.parse(iso) - domainStart) / DAY_MS;

  const dated: { date: string; members: number[] }[] = [];
  events.forEach((event, index) => {
    const group = dated.at(-1);
    if (group && group.date === event.date) group.members.push(index);
    else dated.push({ date: event.date, members: [index] });
  });

  // True scale fills the room; it only stretches (and the strip scrolls) where neighbours would crowd: phones keep
  // whole 44 px targets and a readable month, wide screens at least 26 px targets.
  const minGap = narrow ? TARGET_PX + 4 : 26;
  let scale = (available - LEAD_PX - TAIL_PX) / span;
  if (narrow) scale = Math.max(scale, 46 / 30.4);
  for (let index = 1; index < dated.length; index++) {
    const days = dayOf(dated[index].date) - dayOf(dated[index - 1].date);
    const spread = ((dated[index].members.length - 1 + dated[index - 1].members.length - 1) * TARGET_PX) / 2;
    scale = Math.max(scale, (minGap + spread) / days);
  }
  const at = (day: number) => LEAD_PX + day * scale;

  const groups: RulerGroup[] = dated.map((group) => ({
    key: group.date,
    x: at(dayOf(group.date)),
    label: shortDate(group.date),
    members: group.members,
  }));

  // Each target is centred on its star, a binary star's spread 44 px apart, then trimmed where neighbours meet.
  const centres: number[] = [];
  const stops: RulerStop[] = [];
  groups.forEach((group, groupIndex) => {
    group.members.forEach((eventIndex, member) => {
      const offset = member - (group.members.length - 1) / 2;
      centres.push(group.x + offset * TARGET_PX);
      stops.push({ id: events[eventIndex].id, x: group.x + offset * BINARY_PX, group: groupIndex, hitLeft: 0, hitRight: 0 });
    });
  });
  stops.forEach((stop, index) => {
    const centre = centres[index];
    const previous = centres[index - 1];
    const next = centres[index + 1];
    stop.hitLeft = previous === undefined ? centre - TARGET_PX / 2 : Math.max(centre - TARGET_PX / 2, (previous + centre) / 2);
    stop.hitRight = next === undefined ? centre + TARGET_PX / 2 : Math.min(centre + TARGET_PX / 2, (centre + next) / 2);
  });

  // Month starts all get a long tick; their labels thin out so they never touch.
  const monthGap = 30.4 * scale;
  const every = monthGap >= (narrow ? 36 : 52) ? 1 : monthGap >= (narrow ? 18 : 26) ? 2 : 3;
  const months: RulerMonth[] = [];
  for (let time = domainStart, index = 0; time < domainEnd; time = monthStart(time, 1), index++) {
    const date = new Date(time);
    const month = date.getUTCMonth();
    const year = date.getUTCFullYear();
    months.push({
      key: `${year}-${month}`,
      x: at((time - domainStart) / DAY_MS),
      month: monthNames[month],
      year: index === 0 || month === 0 ? String(year) : null,
      labelled: index === 0 || month % every === 0,
    });
  }

  // Fine ticks per day while they stay 6 px apart, else per week, else none.
  const tickDays = scale >= 6 ? 1 : scale * 7 >= 9 ? 7 : 0;
  const ticks: number[] = [];
  if (tickDays) {
    const starts = new Set(months.map((month) => Math.round(month.x)));
    for (let day = tickDays; day < span; day += tickDays) {
      const x = at(day);
      if (!starts.has(Math.round(x))) ticks.push(x);
    }
  }

  const axisEnd = at(span) + 16;
  return { width: axisEnd + TAIL_PX - 16, axisEnd, months, ticks, groups, stops };
}

// Which groups show their date: the selected one always, then the rest in date order wherever there's room.
export function shownLabels(ruler: Ruler, selectedGroup: number): Set<number> {
  const kept = [selectedGroup];
  ruler.groups.forEach((group, index) => {
    if (index === selectedGroup) return;
    if (kept.every((other) => Math.abs(ruler.groups[other].x - group.x) >= LABEL_PX)) kept.push(index);
  });
  return new Set(kept);
}
