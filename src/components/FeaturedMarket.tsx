import Link from "next/link";
import { categoryHref, type Market } from "@/lib/markets";
import { ChartCard } from "./ChartCard";
import { FeaturedOutcomes } from "./FeaturedOutcomes";
import { CategoryIcon } from "./Icons";
import { LiveVolume } from "./Live";

/** Full-width spotlight for one market at the top of Trending. */
export function FeaturedMarket({ market }: { market: Market }) {
  return (
    <section className="card featured" aria-labelledby="featured-title">
      <div className="featured-head">
        <CategoryIcon name={market.icon} size={48} />
        <div className="featured-head-text">
          <div className="market-meta">
            <span className="live">
              <span className="live-dot" aria-hidden="true" />
              Live
            </span>
            <Link href={categoryHref(market.category)} className="featured-cat">
              {market.category}
            </Link>
            <span>
              <LiveVolume slug={market.slug} base={market.volume} /> Vol.
            </span>
          </div>
          <h2 id="featured-title" className="featured-title">
            <Link href={`/${market.slug}`}>{market.title}</Link>
          </h2>
        </div>
      </div>
      <div className="featured-body">
        <ChartCard market={market} />
        <div className="featured-side">
          <FeaturedOutcomes market={market} />
          <Link href={`/${market.slug}`} className="btn btn-secondary btn-block">
            View market
          </Link>
        </div>
      </div>
    </section>
  );
}
