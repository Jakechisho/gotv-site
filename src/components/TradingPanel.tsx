"use client";

import { useId, useState } from "react";
import type { Market } from "@/lib/markets";
import { VoteLink } from "./VoteLink";

const CHIPS = [1, 20, 100];

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function TradingPanel({ market }: { market: Market }) {
  const { trade } = market;
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [pick, setPick] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("");
  const amountId = useId();
  const summaryId = useId();

  const value = Math.max(0, Number(amount.replace(/[^0-9.]/g, "")) || 0);
  const price = (pick === "yes" ? trade.yesPrice : trade.noPrice) / 100;
  const shares = value > 0 ? value / price : 0;
  const engaged = value > 0;

  return (
    <aside className="card trade-panel" aria-labelledby="trade-heading">
      <h2 id="trade-heading" className="trade-title">
        Take a position
      </h2>
      <p className="trade-question">{trade.question}</p>

      <div className="segmented" role="group" aria-label="Order side">
        {(["buy", "sell"] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={side === s}
            className={side === s ? "is-active" : undefined}
            onClick={() => setSide(s)}
          >
            {s === "buy" ? "Buy" : "Sell"}
          </button>
        ))}
      </div>

      <div className="pick-row" role="group" aria-label="Outcome">
        <button
          type="button"
          aria-pressed={pick === "yes"}
          className={`pick yes${pick === "yes" ? " is-active" : ""}`}
          onClick={() => setPick("yes")}
        >
          {trade.yesLabel} <span>{trade.yesPrice}¢</span>
        </button>
        <button
          type="button"
          aria-pressed={pick === "no"}
          className={`pick no${pick === "no" ? " is-active" : ""}`}
          onClick={() => setPick("no")}
        >
          {trade.noLabel} <span>{trade.noPrice}¢</span>
        </button>
      </div>

      <label htmlFor={amountId} className="amount-label">
        Amount
      </label>
      <div className="amount-field">
        <span aria-hidden="true">$</span>
        <input
          id={amountId}
          inputMode="decimal"
          placeholder="0"
          value={amount}
          aria-describedby={summaryId}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
        />
      </div>
      <div className="chips">
        {CHIPS.map((c) => (
          <button key={c} type="button" className="chip" onClick={() => setAmount(String(Math.round(value + c)))}>
            +${c}
          </button>
        ))}
        <button type="button" className="chip" onClick={() => setAmount("1000")}>
          Max
        </button>
      </div>

      <dl className="trade-summary" id={summaryId} aria-live="polite">
        <div>
          <dt>Avg. price</dt>
          <dd>{Math.round(price * 100)}¢</dd>
        </div>
        <div>
          <dt>Shares</dt>
          <dd>{shares.toFixed(2)}</dd>
        </div>
        <div>
          <dt>Potential return</dt>
          <dd>{money(side === "buy" ? shares : 0)}</dd>
        </div>
        <div className={`influence${engaged ? " is-visible" : ""}`}>
          <dt>Effect on the outcome</dt>
          <dd>{engaged ? "$0.00" : "—"}</dd>
        </div>
      </dl>

      {engaged && (
        <p className="trade-reveal">
          A {money(value)} position can’t move a single vote. One ballot can. Markets predict
          outcomes. Voters create them.
        </p>
      )}

      <VoteLink className="btn btn-primary btn-block trade-cta">
        {engaged ? "Take the position that counts ↗" : "Trade"}
      </VoteLink>
      <p className="trade-fineprint">
        GOTV is a nonpartisan voting campaign, not a betting platform. Nothing here can be bought
        or sold. Every trade button opens Vote.gov.
      </p>
    </aside>
  );
}
