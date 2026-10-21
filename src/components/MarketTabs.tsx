"use client";

import { useId, useRef, useState } from "react";
import type { Market } from "@/lib/markets";

const TABS = [
  { key: "rules", label: "Rules" },
  { key: "context", label: "Market Context" },
] as const;

export function MarketTabs({ market }: { market: Market }) {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("rules");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = TABS.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setActive(TABS[next].key);
    refs.current[next]?.focus();
  }

  return (
    <section className="card tabs-card">
      <div role="tablist" aria-label="Market details" className="tablist">
        {TABS.map((t, i) => (
          <button
            key={t.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${base}-tab-${t.key}`}
            aria-selected={active === t.key}
            aria-controls={`${base}-panel-${t.key}`}
            tabIndex={active === t.key ? 0 : -1}
            className={`tab${active === t.key ? " is-active" : ""}`}
            onClick={() => setActive(t.key)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {TABS.map((t) => (
        <div
          key={t.key}
          role="tabpanel"
          id={`${base}-panel-${t.key}`}
          aria-labelledby={`${base}-tab-${t.key}`}
          hidden={active !== t.key}
          tabIndex={0}
          className="tabpanel"
        >
          {(t.key === "rules" ? market.rules : market.context).map((p) => (
            <p key={p}>{p}</p>
          ))}
          {t.key === "rules" && (
            <dl className="rules-meta">
              <div>
                <dt>Resolves</dt>
                <dd>{market.endDate}</dd>
              </div>
              <div>
                <dt>Resolution source</dt>
                <dd>Voters</dd>
              </div>
            </dl>
          )}
        </div>
      ))}
    </section>
  );
}
