import { MathUtils } from "three";

// What the song does to the sky, worked out once a frame from the song's clock and its map; everything eases, so nothing flashes.

export type SongMap = {
  beats: number[];
  // Each beat's strength, 0 to 9.
  power: number[];
  bars: number[];
  // The song's loudness second by second, 0 to 100.
  arc: number[];
  lifts: number[];
};

export type SongPulse = {
  // 0 until the room opens with a song on, then up to 1 over 7 s: the sky unfolds on it.
  arrival: number;
  // Eases to 1 while a song plays and to 0 while it's paused.
  playing: number;
  // The song's arc: `energy` follows the map, `skyEnergy` eases it again so it never reads as a beat.
  energy: number;
  skyEnergy: number;
  // Up to 1 over the 4 s before a big lift, and how much of it the sky holds back.
  swell: number;
  breath: number;
  // 1 on a big lift, then fading; `warm` is the slow warmth it leaves in the band.
  lift: number;
  warm: number;
  // 1 on a strong beat, fading in about 0.3 s, and the counts that change with each beat and bar.
  beat: number;
  beats: number;
  bars: number;
  // How strongly a small share of the stars glints on this beat, and the share of the stars that are out.
  glint: number;
  fill: number;
  // 1 for Tora's songs (rose), 0 for Orion's (starlight).
  tone: number;
  // How the song leans on the cruise; 0 when paused.
  pace: number;
};

type SongCursors = {
  map: SongMap | null;
  lastTime: number;
  lastBeat: number;
  beat: number;
  bar: number;
  lift: number;
  arrivalClock: number;
  arrived: boolean;
  warmHold: number;
  songPace: number;
};

type SongInput = {
  map: SongMap | null;
  time: number;
  // A song is loaded, playing or paused.
  on: boolean;
  playing: boolean;
  // The room is open with a song on.
  listening: boolean;
  tone: number;
};

const ARRIVAL_SECONDS = 7;
const SWELL_SECONDS = 4;
// At most 3 beats a second, however busy the song's map is.
const MIN_BEAT_GAP = 1 / 3 - 0.002;
const WEAK_BEAT = 3;
// A frame takes about this long to reach the eye, so the map's events fire this much early.
const MAP_LEAD = 0.025;
// All the stars are out above this, so an unset fill changes nothing.
const FULL_SKY = 1.2;
// The cruise's speed from a hush to a full chorus, as a share of its usual speed.
const PACE_QUIET = 0.94;
const PACE_LOUD = 1.1;

const fillFor = (energy: number) =>
  0.55 + 0.65 * MathUtils.smoothstep(energy, 0.1, 0.8);

const ease = (current: number, target: number, dt: number, seconds: number) =>
  current + (target - current) * (1 - Math.exp(-dt / seconds));

// First index whose time is after `time`.
function indexAfter(times: number[], time: number): number {
  let low = 0;
  let high = times.length;
  while (low < high) {
    const middle = (low + high) >> 1;
    if (times[middle] <= time) low = middle + 1;
    else high = middle;
  }
  return low;
}

function arcAt(arc: number[], time: number): number {
  const place = Math.min(arc.length - 1, time);
  const low = Math.floor(place);
  const high = Math.min(arc.length - 1, low + 1);
  return (arc[low] + (arc[high] - arc[low]) * (place - low)) / 100;
}

// Under reduced motion this is the one still frame: a calm middle of a song, with the whole sky out.
export function createSongPulse(still: boolean): SongPulse {
  return {
    arrival: still ? 1 : 0,
    playing: 0,
    energy: 0.5,
    skyEnergy: 0.5,
    swell: 0,
    breath: 0,
    lift: 0,
    warm: 0,
    beat: 0,
    beats: 0,
    bars: 0,
    glint: 0,
    fill: still ? fillFor(0.5) : FULL_SKY,
    tone: 1,
    pace: 1,
  };
}

export function createSongCursors(): SongCursors {
  return {
    map: null,
    lastTime: 0,
    lastBeat: -10,
    beat: 0,
    bar: 0,
    lift: 0,
    arrivalClock: 0,
    arrived: false,
    warmHold: 0,
    songPace: 1,
  };
}

function followMap(
  pulse: SongPulse,
  cursors: SongCursors,
  map: SongMap,
  songTime: number,
  dt: number,
) {
  const time = songTime + MAP_LEAD;
  // A new song or a jump: find our place again without firing everything in between.
  if (
    map !== cursors.map ||
    time < cursors.lastTime - 0.1 ||
    time > cursors.lastTime + 1
  ) {
    cursors.map = map;
    cursors.beat = indexAfter(map.beats, time);
    cursors.bar = indexAfter(map.bars, time);
    cursors.lift = indexAfter(map.lifts, time);
    cursors.lastBeat = -10;
  }
  cursors.lastTime = time;

  while (cursors.beat < map.beats.length && map.beats[cursors.beat] <= time) {
    const power = map.power[cursors.beat];
    if (power >= WEAK_BEAT && time - cursors.lastBeat >= MIN_BEAT_GAP) {
      pulse.beat = Math.max(pulse.beat, 0.4 + (0.6 * power) / 9);
      pulse.beats += 1;
      cursors.lastBeat = time;
    }
    cursors.beat += 1;
  }
  while (cursors.bar < map.bars.length && map.bars[cursors.bar] <= time) {
    pulse.bars += 1;
    cursors.bar += 1;
  }
  while (cursors.lift < map.lifts.length && map.lifts[cursors.lift] <= time) {
    pulse.lift = 1;
    pulse.swell = 0;
    cursors.lift += 1;
  }
  const nextLift = map.lifts[cursors.lift];
  const untilLift = nextLift === undefined ? Infinity : nextLift - time;
  const swell = MathUtils.clamp(1 - untilLift / SWELL_SECONDS, 0, 1);
  pulse.swell = swell > pulse.swell ? swell : ease(pulse.swell, 0, dt, 0.2);
}

export function followSong(
  pulse: SongPulse,
  cursors: SongCursors,
  { map, time, on, playing, listening, tone }: SongInput,
  delta: number,
) {
  // Capped, so a tab coming back doesn't snap the sky.
  const dt = Math.min(delta, 0.1);

  // Back to a room whose song is paused: the flight is resting, so the sky is simply there.
  if (listening && !cursors.arrived && !playing) {
    cursors.arrivalClock = ARRIVAL_SECONDS;
  }
  if (listening) cursors.arrived = true;
  if (cursors.arrived) {
    cursors.arrivalClock = Math.min(ARRIVAL_SECONDS, cursors.arrivalClock + dt);
    pulse.arrival = MathUtils.smootherstep(
      cursors.arrivalClock,
      0,
      ARRIVAL_SECONDS,
    );
  }
  pulse.tone = ease(pulse.tone, tone, dt, 0.9);
  // Held up with no song on, so the first press doesn't brake the flight.
  pulse.playing = ease(pulse.playing, playing || !on ? 1 : 0, dt, 0.45);
  pulse.beat *= Math.exp(-dt / 0.11);
  pulse.lift *= Math.exp(-dt / 1.1);

  if (map) followMap(pulse, cursors, map, time, dt);
  // Held while paused, so the sky keeps its look until the song goes on.
  if (playing) {
    const arc = map ? arcAt(map.arc, time + MAP_LEAD) : 0.5;
    pulse.energy = ease(pulse.energy, arc, dt, 0.5);
  }
  pulse.skyEnergy = ease(pulse.skyEnergy, pulse.energy, dt, 3);
  pulse.fill = ease(
    pulse.fill,
    MathUtils.lerp(FULL_SKY, fillFor(pulse.skyEnergy), pulse.arrival),
    dt,
    3.5,
  );
  pulse.breath = ease(pulse.breath, pulse.swell, dt, 1.2);
  if (pulse.lift > 0.5) cursors.warmHold = 1;
  cursors.warmHold = ease(cursors.warmHold, 0, dt, 14);
  pulse.warm = ease(pulse.warm, cursors.warmHold, dt, 2.6);
  pulse.glint = 0.75 * pulse.beat * pulse.arrival;

  // With no song on (before the first press, after a single song ends) the flight simply runs at its usual speed.
  const songPace = PACE_QUIET + (PACE_LOUD - PACE_QUIET) * pulse.energy;
  cursors.songPace = ease(cursors.songPace, songPace, dt, 2.5);
  const target = on && pulse.arrival > 0 ? cursors.songPace * pulse.playing : 1;
  pulse.pace = ease(pulse.pace, target, dt, 0.6);
}
