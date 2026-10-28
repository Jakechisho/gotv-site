import Link from "next/link";
import { CategoryIcon } from "@/components/Icons";
import { Disclosure } from "@/components/Disclosure";
import { VoteLink } from "@/components/VoteLink";
import { LiveChance, LiveGauge, LiveVolume } from "@/components/Live";
import { leadChance } from "@/lib/markets";
import { getMarkets } from "@/lib/store";

export const metadata = { title: "Trending markets" };

/** Trending: every market created in the admin page, newest first. */
export default async function TrendingPage() {
  const marketList = await getMarkets();
  return (
    <div className="container trending">
      <div className="trending-head">
        <h1>Trending markets</h1>
        <p>All open markets. Odds are simulated; outcomes are decided by voters.</p>
      </div>
      {marketList.length === 0 ? (
        <p className="card trending-empty">
          No markets are open right now. The one that matters is always open:{" "}
          <VoteLink>your ballot ↗</VoteLink>
        </p>
      ) : (
        <ul className="trending-grid">
          {marketList.map((m) => (
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
      )}
      <Disclosure />
    </div>
  );
}
