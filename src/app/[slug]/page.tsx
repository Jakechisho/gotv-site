import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketExperience } from "@/components/MarketExperience";
import { getMarket, getMarkets } from "@/lib/store";

// Markets come from the admin page, so pages render on first visit and are cached
// until a market is created or deleted.
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const market = await getMarket((await params).slug);
  return market ? { title: market.title, description: market.headline } : {};
}

export default async function MarketPage({ params }: Props) {
  const slug = (await params).slug;
  const markets = await getMarkets();
  const market = markets.find((m) => m.slug === slug);
  if (!market) notFound();
  return <MarketExperience market={market} markets={markets} />;
}
