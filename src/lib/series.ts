import type { Series } from "./markets";

export const RANGES = ["1H", "6H", "1D", "1W", "1M", "ALL"] as const;
export type Range = (typeof RANGES)[number];

/** How many of the simulated points each range shows, and the time step between them. */
export const RANGE_WINDOW: Record<Range, { points: number; stepMinutes: number }> = {
  "1H": { points: 30, stepMinutes: 2 },
  "6H": { points: 36, stepMinutes: 10 },
  "1D": { points: 48, stepMinutes: 30 },
  "1W": { points: 56, stepMinutes: 180 },
  "1M": { points: 60, stepMinutes: 720 },
  ALL: { points: 90, stepMinutes: 1440 },
};

/** Fixed "now" so server and client render identical charts. */
export const CHART_NOW = Date.UTC(2026, 9, 21, 16, 0);

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic random walk from `start` to `end`, one series per range. */
export function simulate(series: Series, seed: number, count: number): number[] {
  const rand = mulberry32(seed);
  const out: number[] = [];
  let noise = 0;
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 1 : i / (count - 1);
    noise = noise * 0.82 + (rand() - 0.5) * 3.2;
    const base = series.start + (series.end - series.start) * t;
    // Pin the last point so the chart agrees with the outcome rows.
    const value = i === count - 1 ? series.end : base + noise * Math.sin(Math.PI * t);
    out.push(Math.max(1, Math.min(99, Math.round(value * 10) / 10)));
  }
  return out;
}

export function formatTick(ms: number, range: Range): string {
  const d = new Date(ms);
  if (range === "1H" || range === "6H" || range === "1D") {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}
