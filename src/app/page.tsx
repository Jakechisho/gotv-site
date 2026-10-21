import Link from "next/link";
import { CategoryIcon } from "@/components/Icons";
import { Disclosure } from "@/components/Disclosure";
import { VoteLink } from "@/components/VoteLink";
import { leadChance, marketList } from "@/lib/markets";

export const metadata = { title: "Trending markets" };

function Gauge({ value }: { value: number }) {
  return (
    <span className="gauge" aria-hidden="true" style={{ ["--v" as string]: value }}>
      <span>{value}%</span>
    </span>
  );
}

/** Trending: every configured market in one grid, plus one card that goes straight to Vote.gov. */
export default function TrendingPage() {
  return (
    <div className="container trending">
      <div className="trending-head">
        <h1>Trending</h1>
        <p>All open markets. Odds are simulated; outcomes are decided by voters.</p>
      </div>
      <ul className="trending-grid">
        {marketList.map((m) => (
          <li key={m.slug}>
            <Link href={`/${m.slug}`} className="card related-card trending-card">
              <div className="related-top">
                <CategoryIcon name={m.icon} size={40} />
                <span className="related-title">{m.title}</span>
                <Gauge value={leadChance(m)} />
              </div>
              <ul className="trending-outcomes" aria-label="Outcomes">
                {m.series.map((s) => (
                  <li key={s.name}>
                    <span>{s.name}</span>
                    <strong>{s.end}%</strong>
                  </li>
                ))}
              </ul>
              <div className="related-bottom">
                <span className="related-cat">{m.category}</span>
                <span>{m.volume} Vol.</span>
              </div>
            </Link>
          </li>
        ))}
        <li>
          <VoteLink className="card related-card trending-card">
            <div className="related-top">
              <CategoryIcon name="people" size={40} />
              <span className="related-title">Will young voters show up?</span>
              <Gauge value={23} />
            </div>
            <div className="related-pills" aria-hidden="true">
              <span className="pill yes">Show up</span>
              <span className="pill no">Stay home</span>
            </div>
            <div className="related-bottom">
              <span className="related-cat">Opens Vote.gov</span>
              <span>$918,440 Vol.</span>
            </div>
          </VoteLink>
        </li>
      </ul>
      <Disclosure />
    </div>
  );
}
