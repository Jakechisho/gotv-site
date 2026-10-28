import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketExperience } from "@/components/MarketExperience";
import { getMarketsWith } from "@/lib/store";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const markets = await getMarketsWith((ms) => ms.some((m) => m.slug === slug));
  return { markets, market: markets.find((m) => m.slug === slug) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market } = await load((await params).slug);
  return market ? { title: market.title, description: market.headline } : {};
}

export default async function MarketPage({ params }: Props) {
  const { market, markets } = await load((await params).slug);
  if (!market) notFound();
  return <MarketExperience market={market} markets={markets} />;
}
