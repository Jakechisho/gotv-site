"use client";

import { liveChance, liveVolume, useFlash, useLive } from "@/lib/live";

/** Wraps a live value and briefly tints it green or red when it moves. */
export function Flash({ value, children, className = "" }: { value: number; children: React.ReactNode; className?: string }) {
  const dir = useFlash(value);
  return <span className={`flash ${dir ? `flash-${dir}` : ""} ${className}`}>{children}</span>;
}

export function LiveChance({ slug, base, index }: { slug: string; base: number; index: number }) {
  const { drift } = useLive(slug);
  const value = liveChance(base, drift, index);
  return <Flash value={value}>{value}%</Flash>;
}

export function LiveVolume({ slug, base }: { slug: string; base: string }) {
  const { volume } = useLive(slug);
  return <>{liveVolume(base, volume)}</>;
}

export function LiveGauge({ slug, base }: { slug: string; base: number }) {
  const { drift } = useLive(slug);
  const value = liveChance(base, drift, 0);
  return (
    <span className="gauge" aria-hidden="true" style={{ ["--v" as string]: value }}>
      <span>{value}%</span>
    </span>
  );
}
