import type { Market } from "@/lib/markets";
import { ChartCard } from "./ChartCard";
import { Disclosure } from "./Disclosure";
import { MarketHeader } from "./MarketHeader";
import { MarketTabs } from "./MarketTabs";
import { OutcomeRows } from "./OutcomeRows";
import { RelatedMarkets } from "./RelatedMarkets";
import { TradingPanel } from "./TradingPanel";

/** The one layout every market page uses. All content comes from the `market` config. */
export function MarketExperience({ market, markets }: { market: Market; markets: Market[] }) {
  return (
    <div className="container market-layout">
      <div className="market-main">
        <MarketHeader market={market} />
        <ChartCard market={market} />
        <OutcomeRows market={market} />
        <MarketTabs market={market} />
      </div>
      <div className="market-rail">
        <TradingPanel market={market} />
      </div>
      <div className="market-after">
        <RelatedMarkets cards={market.related} markets={markets} />
        <Disclosure />
      </div>
    </div>
  );
}
