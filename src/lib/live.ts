"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Simulated "live" market movement. One shared clock nudges every market's odds
// by a small, mean-reverting amount, so every component showing the same market
// moves in sync. Nothing here is real data.

const TICK_MS = 2000;
const MAX_DRIFT = 3;

const drift = new Map<string, number>();
const volumeAdds = new Map<string, number>();
const listeners = new Set<() => void>();
let version = 0;
let timer: ReturnType<typeof setInterval> | null = null;

function tick() {
  for (const key of drift.keys()) {
    const current = drift.get(key) ?? 0;
    // Most ticks nudge by 0 or ±1 point; the pull toward 0 keeps it near the base odds.
    const step = Math.random() < 0.35 ? 0 : Math.random() < 0.5 + current * 0.12 ? -1 : 1;
    drift.set(key, Math.max(-MAX_DRIFT, Math.min(MAX_DRIFT, current + step)));
    volumeAdds.set(key, (volumeAdds.get(key) ?? 0) + Math.round(Math.random() * 900 + 40));
  }
  version++;
  listeners.forEach((l) => l());
}

function subscribe(key: string) {
  return (listener: () => void) => {
    if (!drift.has(key)) drift.set(key, 0);
    listeners.add(listener);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!timer && !reduced) timer = setInterval(tick, TICK_MS);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  };
}

const subscribers = new Map<string, ReturnType<typeof subscribe>>();

/** Current drift (in percentage points) and added volume for one market. */
export function useLive(key: string) {
  let sub = subscribers.get(key);
  if (!sub) {
    sub = subscribe(key);
    subscribers.set(key, sub);
  }
  useSyncExternalStore(sub, () => version, () => 0);
  return { drift: drift.get(key) ?? 0, volume: volumeAdds.get(key) ?? 0 };
}

/** Odds for outcome `index` of a two-sided market after live drift. */
export function liveChance(base: number, drift: number, index: number) {
  return Math.max(1, Math.min(99, base + (index === 0 ? drift : -drift)));
}

export function liveVolume(base: string, added: number) {
  const n = Number(base.replace(/[^0-9]/g, "")) + added;
  return `$${n.toLocaleString("en-US")}`;
}

/** "up" / "down" for ~0.8s after a value changes, to drive a flash. */
export function useFlash(value: number) {
  const prev = useRef(value);
  const [dir, setDir] = useState<"" | "up" | "down">("");
  useEffect(() => {
    if (value === prev.current) return;
    setDir(value > prev.current ? "up" : "down");
    prev.current = value;
    const t = setTimeout(() => setDir(""), 800);
    return () => clearTimeout(t);
  }, [value]);
  return dir;
}
