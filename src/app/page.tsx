import { Disclosure } from "@/components/Disclosure";
import { FeaturedMarket } from "@/components/FeaturedMarket";
import { MarketGrid } from "@/components/MarketGrid";
import { getMarkets } from "@/lib/store";

export const metadata = { title: "Trending markets" };
// A different market is featured on each visit, so render per request (markets stay cached).
export const dynamic = "force-dynamic";

/** Trending: every market created in the admin page, newest first. */
export default async function TrendingPage() {
  const markets = await getMarkets();
  const featured = markets.length > 0 ? markets[Math.floor(Math.random() * markets.length)] : null;
  return (
    <div className="container trending">
      <div className="trending-head">
        <h1>Trending markets</h1>
        <p>All open markets. Odds are simulated; outcomes are decided by voters.</p>
      </div>
      {featured && <FeaturedMarket market={featured} />}
      <MarketGrid markets={markets} />
      <Disclosure />
    </div>
  );
}
