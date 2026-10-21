import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketExperience } from "@/components/MarketExperience";
import { getMarket, marketList } from "@/lib/markets";

// Only configured markets exist: /politics, /weather, /economy.
export const dynamicParams = false;

export function generateStaticParams() {
  return marketList.map((m) => ({ slug: m.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const market = getMarket((await params).slug);
  return market ? { title: market.title, description: market.headline } : {};
}

export default async function MarketPage({ params }: Props) {
  const market = getMarket((await params).slug);
  if (!market) notFound();
  return <MarketExperience market={market} />;
}
