"use client";

import type { Market } from "@/lib/markets";
import { liveChance, useLive } from "@/lib/live";
import { Flash } from "./Live";
import { VoteLink } from "./VoteLink";

export function OutcomeRows({ market }: { market: Market }) {
  const { drift } = useLive(market.slug);
  let side = 0;
  return (
    <section className="card outcomes" aria-labelledby="outcomes-heading">
      <div className="outcomes-head">
        <h2 id="outcomes-heading">Outcome</h2>
        <span>% Chance</span>
      </div>
      <ul>
        {market.outcomes.map((o) => {
          const i = o.kind === "market" ? side++ : -1;
          const move = i === 0 ? drift : -drift;
          const chance = o.kind === "market" ? liveChance(o.chance, drift, i) : 0;
          const yes = o.kind === "market" ? o.yesPrice + move : 0;
          const no = o.kind === "market" ? o.noPrice - move : 0;
          return (
          <li key={o.id} className={`outcome-row${o.kind === "reveal" ? " is-reveal" : ""}`}>
            <div className="outcome-info">
              <span className="avatar" style={{ background: o.color }} aria-hidden="true">
                {o.initials}
              </span>
              <div>
                <div className="outcome-name">{o.name}</div>
                <div className="outcome-detail">{o.detail}</div>
              </div>
            </div>
            {o.kind === "market" ? (
              <>
                <div className="outcome-chance">
                  <Flash value={chance}>
                    <strong>{chance}%</strong>
                  </Flash>
                  <span className={o.change >= 0 ? "delta up" : "delta down"}>
                    <span aria-hidden="true">{o.change >= 0 ? "▲" : "▼"}</span>
                    <span className="sr-only">{o.change >= 0 ? "up" : "down"}</span>
                    {Math.abs(o.change)}
                  </span>
                </div>
                <div className="outcome-actions">
                  <VoteLink className="price-btn yes" aria-label={`Buy Yes on ${o.name} at ${yes} cents (opens Vote.gov)`}>
                    Buy Yes {yes}¢
                  </VoteLink>
                  <VoteLink className="price-btn no" aria-label={`Buy No on ${o.name} at ${no} cents (opens Vote.gov)`}>
                    Buy No {no}¢
                  </VoteLink>
                </div>
              </>
            ) : (
              <>
                <div className="outcome-chance">
                  <strong className="reveal-label">{o.label}</strong>
                </div>
                <div className="outcome-actions">
                  <VoteLink className="price-btn vote">{o.cta} ↗</VoteLink>
                </div>
              </>
            )}
          </li>
          );
        })}
      </ul>
    </section>
  );
}
