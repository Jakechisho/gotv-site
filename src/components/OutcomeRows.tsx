import type { Market } from "@/lib/markets";
import { VoteLink } from "./VoteLink";

export function OutcomeRows({ market }: { market: Market }) {
  return (
    <section className="card outcomes" aria-labelledby="outcomes-heading">
      <div className="outcomes-head">
        <h2 id="outcomes-heading">Outcome</h2>
        <span>% Chance</span>
      </div>
      <ul>
        {market.outcomes.map((o) => (
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
                  <strong>{o.chance}%</strong>
                  <span className={o.change >= 0 ? "delta up" : "delta down"}>
                    <span aria-hidden="true">{o.change >= 0 ? "▲" : "▼"}</span>
                    <span className="sr-only">{o.change >= 0 ? "up" : "down"}</span>
                    {Math.abs(o.change)}
                  </span>
                </div>
                <div className="outcome-actions">
                  <VoteLink className="price-btn yes" aria-label={`Buy Yes on ${o.name} at ${o.yesPrice} cents (opens Vote.gov)`}>
                    Buy Yes {o.yesPrice}¢
                  </VoteLink>
                  <VoteLink className="price-btn no" aria-label={`Buy No on ${o.name} at ${o.noPrice} cents (opens Vote.gov)`}>
                    Buy No {o.noPrice}¢
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
        ))}
      </ul>
    </section>
  );
}
