import Link from "next/link";
import { getMarket, leadChance, type RelatedCard } from "@/lib/markets";
import { CategoryIcon } from "./Icons";
import { LiveGauge, LiveVolume } from "./Live";
import { VoteLink } from "./VoteLink";

export function RelatedMarkets({ cards }: { cards: RelatedCard[] }) {
  return (
    <section aria-labelledby="related-heading" className="related">
      <h2 id="related-heading">Related markets</h2>
      <ul className="related-grid">
        {cards.map((card) => {
          if (card.kind === "market") {
            const m = getMarket(card.slug);
            if (!m) return null;
            const chance = leadChance(m);
            return (
              <li key={m.slug}>
                <Link href={`/${m.slug}`} className="card related-card">
                  <div className="related-top">
                    <CategoryIcon name={m.icon} size={40} />
                    <span className="related-title">{m.cardTitle}</span>
                    <LiveGauge slug={m.slug} base={chance} />
                  </div>
                  <div className="related-bottom">
                    <span className="related-cat">{m.category}</span>
                    <span>
                      <LiveVolume slug={m.slug} base={m.volume} /> Vol.
                    </span>
                  </div>
                </Link>
              </li>
            );
          }
          return (
            <li key={card.title}>
              <VoteLink className="card related-card">
                <div className="related-top">
                  <CategoryIcon name={card.icon} size={40} />
                  <span className="related-title">{card.title}</span>
                  <LiveGauge slug={`vote:${card.title}`} base={card.chance} />
                </div>
                <div className="related-pills" aria-hidden="true">
                  <span className="pill yes">{card.yes}</span>
                  <span className="pill no">{card.no}</span>
                </div>
                <div className="related-bottom">
                  <span className="related-cat">Opens Vote.gov</span>
                  <span>
                    <LiveVolume slug={`vote:${card.title}`} base={card.volume} /> Vol.
                  </span>
                </div>
              </VoteLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
