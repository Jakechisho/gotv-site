import Link from "next/link";
import { leadChance, type Market } from "@/lib/markets";
import { CategoryIcon } from "./Icons";
import { LiveChance, LiveGauge, LiveVolume } from "./Live";
import { VoteLink } from "./VoteLink";

/** Card grid used by Trending and the category pages. */
export function MarketGrid({ markets }: { markets: Market[] }) {
  if (markets.length === 0) {
    return (
      <p className="card trending-empty">
        No markets are open right now. The one that matters is always open:{" "}
        <VoteLink>your ballot ↗</VoteLink>
      </p>
    );
  }
  return (
    <ul className="trending-grid">
      {markets.map((m) => (
        <li key={m.slug}>
          <Link href={`/${m.slug}`} className="card related-card trending-card">
            <div className="related-top">
              <CategoryIcon name={m.icon} size={40} />
              <span className="related-title">{m.title}</span>
              <LiveGauge slug={m.slug} base={leadChance(m)} />
            </div>
            <ul className="trending-outcomes" aria-label="Outcomes">
              {m.series.map((s, i) => (
                <li key={s.name}>
                  <span>{s.name}</span>
                  <strong>
                    <LiveChance slug={m.slug} base={s.end} index={i} />
                  </strong>
                </li>
              ))}
            </ul>
            <div className="related-bottom">
              <span className="related-cat">{m.category}</span>
              <span>
                <LiveVolume slug={m.slug} base={m.volume} /> Vol.
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
