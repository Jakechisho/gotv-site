"use client";

import type { Market } from "@/lib/markets";
import { liveChance, useLive } from "@/lib/live";
import { Flash } from "./Live";
import { VoteLink } from "./VoteLink";

/** Compact outcome list with live odds and buy buttons, for the featured market. */
export function FeaturedOutcomes({ market }: { market: Market }) {
  const { drift } = useLive(market.slug);
  const outcomes = market.outcomes.filter((o) => o.kind === "market");
  return (
    <ul className="featured-outcomes">
      {outcomes.map((o, i) => {
        const move = i === 0 ? drift : -drift;
        const chance = liveChance(o.chance, drift, i);
        const yes = o.yesPrice + move;
        const no = o.noPrice - move;
        return (
          <li key={o.id}>
            <div className="featured-outcome-top">
              <span className="avatar" style={{ background: o.color }} aria-hidden="true">
                {o.initials}
              </span>
              <span className="featured-outcome-name">{o.name}</span>
              <Flash value={chance} className="featured-outcome-chance">
                {chance}%
              </Flash>
            </div>
            <div className="outcome-actions">
              <VoteLink className="price-btn yes" aria-label={`Buy Yes on ${o.name} at ${yes} cents (opens Vote.gov)`}>
                Buy Yes {yes}¢
              </VoteLink>
              <VoteLink className="price-btn no" aria-label={`Buy No on ${o.name} at ${no} cents (opens Vote.gov)`}>
                Buy No {no}¢
              </VoteLink>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
