import { Disclosure } from "@/components/Disclosure";
import { MarketGrid } from "@/components/MarketGrid";
import { getMarkets } from "@/lib/store";

export const metadata = { title: "Trending markets" };

/** Trending: every market created in the admin page, newest first. */
export default async function TrendingPage() {
  const markets = await getMarkets();
  return (
    <div className="container trending">
      <div className="trending-head">
        <h1>Trending markets</h1>
        <p>All open markets. Odds are simulated; outcomes are decided by voters.</p>
      </div>
      <MarketGrid markets={markets} />
      <Disclosure />
    </div>
  );
}
