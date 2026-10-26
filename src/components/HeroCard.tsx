"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Market } from "@/lib/markets";
import { liveChance, liveVolume, useLive } from "@/lib/live";
import { simulate } from "@/lib/series";
import { CategoryIcon } from "./Icons";
import { Flash } from "./Live";
import { VoteLink } from "./VoteLink";

const W = 520;
const H = 220;
const POINTS = 60;

/** Featured homepage card, modelled on a prediction market's big "event" hero. */
export function HeroCard({ market }: { market: Market }) {
  const { drift, volume } = useLive(market.slug);
  const base = useMemo(
    () => market.series.map((s, i) => simulate(s, market.seed * 13 + i, POINTS)),
    [market],
  );
  const lines = base.map((values, i) => {
    const v = values.slice();
    v[v.length - 1] = liveChance(market.series[i].end, drift, i);
    return v;
  });
  const x = (i: number) => (i / (POINTS - 1)) * (W - 40);
  const y = (v: number) => 10 + (1 - v / 100) * (H - 20);

  return (
    <section className="card hero" aria-labelledby="hero-title">
      <div className="hero-main">
        <div className="hero-kicker">
          <span className="live">
            <span className="live-dot" aria-hidden="true" />
            Live
          </span>
          <span>Midterms 2026</span>
          <span aria-hidden="true">·</span>
          <span>Ends {market.endDate}</span>
        </div>
        <div className="hero-title-row">
          <CategoryIcon name={market.icon} size={52} />
          <div>
            <h1 id="hero-title" className="hero-title">
              Decide an Election
            </h1>
            <Link href={`/${market.slug}`} className="hero-sub">
              {market.title} ›
            </Link>
          </div>
        </div>

        <ul className="hero-outcomes">
          {market.series.map((s, i) => {
            const chance = liveChance(s.end, drift, i);
            return (
              <li key={s.name}>
                <span className="legend-dot" style={{ background: s.color }} aria-hidden="true" />
                <span className="hero-outcome-name">{s.name}</span>
                <Flash value={chance} className="hero-outcome-chance">
                  {chance}%
                </Flash>
                <VoteLink className="price-btn yes" aria-label={`Buy Yes on ${s.name} (opens Vote.gov)`}>
                  Yes {chance}¢
                </VoteLink>
                <VoteLink className="price-btn no" aria-label={`Buy No on ${s.name} (opens Vote.gov)`}>
                  No {101 - chance}¢
                </VoteLink>
              </li>
            );
          })}
          <li className="hero-reveal">
            <span className="legend-dot" style={{ background: "var(--green)" }} aria-hidden="true" />
            <span className="hero-outcome-name">You</span>
            <strong className="reveal-label">Decides it</strong>
            <VoteLink className="price-btn vote">Make a plan to vote ↗</VoteLink>
          </li>
        </ul>

        <div className="hero-foot">
          <span>{liveVolume(market.volume, volume)} Vol.</span>
          <span>Markets predict outcomes. Voters create them.</span>
        </div>
      </div>

      <div className="hero-chart">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={market.chartDescription}>
          {[0, 25, 50, 75, 100].map((g) => (
            <g key={g}>
              <line x1={0} x2={W - 40} y1={y(g)} y2={y(g)} className="grid-line" />
              <text x={W - 32} y={y(g) + 4} className="axis-label">
                {g}%
              </text>
            </g>
          ))}
          {lines.map((v, i) => (
            <path
              key={i}
              d={v.map((p, j) => `${j ? "L" : "M"}${x(j).toFixed(1)},${y(p).toFixed(1)}`).join("")}
              className="series-line"
              stroke={market.series[i].color}
              pathLength={1}
            />
          ))}
          {lines.map((v, i) => (
            <circle key={i} cx={x(POINTS - 1)} cy={y(v[POINTS - 1])} r={4} fill={market.series[i].color} stroke="#fff" strokeWidth="2" className="end-dot" />
          ))}
        </svg>
      </div>
    </section>
  );
}
