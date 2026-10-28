import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Disclosure } from "@/components/Disclosure";
import { MarketGrid } from "@/components/MarketGrid";
import { slugify } from "@/lib/markets";
import { getMarketsWith } from "@/lib/store";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const inCategory = (m: { category: string }) => slugify(m.category) === slug;
  const markets = (await getMarketsWith((ms) => ms.some(inCategory))).filter(inCategory);
  return { name: markets[0]?.category, markets };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await load((await params).slug);
  return name ? { title: `${name} markets` } : {};
}

export default async function CategoryPage({ params }: Props) {
  const { name, markets } = await load((await params).slug);
  if (!name) notFound();
  return (
    <div className="container trending">
      <div className="trending-head">
        <h1>{name}</h1>
        <p>Every open {name.toLowerCase()} market. Odds are simulated; outcomes are decided by voters.</p>
      </div>
      <MarketGrid markets={markets} />
      <Disclosure />
    </div>
  );
}
