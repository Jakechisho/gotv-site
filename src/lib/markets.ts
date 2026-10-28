// Market shape. Every market page is rendered by <MarketExperience /> from one of
// these objects. Markets are created in the hidden admin page and stored as a short
// `MarketInput`; `buildMarket` fills in everything else (odds, volume, copy).

export type CategoryIcon = "politics" | "weather" | "economy" | "people";

export type Series = {
  name: string;
  color: string;
  /** Final value (0-100) the simulated line settles on. */
  end: number;
  /** Starting value (0-100). */
  start: number;
};

export type Outcome =
  | {
      kind: "market";
      id: string;
      name: string;
      detail: string;
      initials: string;
      color: string;
      chance: number;
      change: number;
      yesPrice: number;
      noPrice: number;
    }
  | {
      /** The row that gives the game away: not tradeable, only votable. */
      kind: "reveal";
      id: string;
      name: string;
      detail: string;
      initials: string;
      color: string;
      label: string;
      cta: string;
    };

export type RelatedCard =
  | { kind: "market"; slug: string }
  | {
      kind: "vote";
      title: string;
      icon: CategoryIcon;
      chance: number;
      volume: string;
      yes: string;
      no: string;
    };

export type Market = {
  slug: string;
  /** Any name; every category in use gets a tab and a page at /category/<slug>. */
  category: string;
  breadcrumb: string[];
  icon: CategoryIcon;
  title: string;
  /** Short title used on related-market cards. */
  cardTitle: string;
  volume: string;
  endDate: string;
  headline: string;
  subhead: string;
  chartDescription: string;
  seed: number;
  series: [Series, Series];
  outcomes: Outcome[];
  rules: string[];
  context: string[];
  related: RelatedCard[];
  trade: {
    question: string;
    yesLabel: string;
    noLabel: string;
    yesPrice: number;
    noPrice: number;
  };
};

/** Suggested in the admin form; any other name works too. */
export const CATEGORIES = ["Politics", "Weather", "Economy", "Community"];

const CATEGORY_ICON: Record<string, CategoryIcon> = {
  Politics: "politics",
  Weather: "weather",
  Economy: "economy",
  Community: "people",
};

/** What the admin form saves. Everything else on the page is derived from it. */
export type MarketInput = {
  slug: string;
  title: string;
  headline: string;
  optionA: string;
  optionB: string;
  category: string;
  /** Odds (1-99) for option A; option B gets the rest. */
  chanceA: number;
  subhead: string;
  endDate: string;
  createdAt: number;
};

export const DEFAULT_SUBHEAD = "Traders can price it. Only voters can decide it.";
export const DEFAULT_END_DATE = "Nov 3, 2026";
const COLOR_A = "#2d6af6";
const COLOR_B = "#e23b3b";

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

function dollars(n: number) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function initials(name: string) {
  const words = name.replace(/[^\p{L}\p{N} ]/gu, "").split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return words.length === 1 ? words[0].slice(0, 2).toUpperCase() : (words[0][0] + words[1][0]).toUpperCase();
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Turns a saved input into a full market. `all` supplies the related-market cards. */
export function buildMarket(input: MarketInput, all: MarketInput[]): Market {
  const h = hash(input.slug);
  const a = Math.max(1, Math.min(99, Math.round(input.chanceA)));
  const b = 100 - a;
  // A deterministic starting point a few points away, so the chart has a story.
  const shift = (h % 13) - 6 || 3;
  const startA = Math.max(2, Math.min(98, a - shift));
  const change = a - startA;
  const total = 800_000 + (h % 4_200_000);
  const volA = Math.round((total * a) / 100);
  const others = all.filter((m) => m.slug !== input.slug).slice(0, 2);

  return {
    slug: input.slug,
    category: input.category,
    breadcrumb: [input.category, input.title],
    icon: CATEGORY_ICON[input.category] ?? "people",
    title: input.title,
    cardTitle: input.title,
    volume: dollars(total),
    endDate: input.endDate,
    headline: input.headline,
    subhead: input.subhead,
    chartDescription: `Line chart of simulated odds for ${input.optionA} and ${input.optionB}, moving from ${startA} and ${100 - startA} percent to ${a} and ${b} percent.`,
    seed: h % 1000,
    series: [
      { name: input.optionA, color: COLOR_A, start: startA, end: a },
      { name: input.optionB, color: COLOR_B, start: 100 - startA, end: b },
    ],
    outcomes: [
      {
        kind: "market",
        id: "a",
        name: input.optionA,
        detail: `${dollars(volA)} Vol.`,
        initials: initials(input.optionA),
        color: COLOR_A,
        chance: a,
        change,
        yesPrice: a,
        noPrice: Math.min(99, b + 1),
      },
      {
        kind: "market",
        id: "b",
        name: input.optionB,
        detail: `${dollars(total - volA)} Vol.`,
        initials: initials(input.optionB),
        color: COLOR_B,
        chance: b,
        change: -change,
        yesPrice: b,
        noPrice: Math.min(99, a + 1),
      },
    ],
    rules: [
      `This market resolves on ${input.endDate} to whichever outcome actually happens.`,
      "No trade placed here can change that result. The only position that counts is a ballot cast by a registered voter.",
      "Odds shown are illustrative. GOTV does not take positions, accept money, or settle trades.",
    ],
    context: [
      "Close races and ballot measures are often decided by margins smaller than the number of people who stayed home.",
      "Young voters are one of the largest groups of eligible voters, and one of the least likely to turn out. That gap is the opportunity.",
      "Registration deadlines, early voting dates, and ID rules vary by state. Vote.gov points you to your state’s official information.",
    ],
    related: [
      ...others.map((m) => ({ kind: "market" as const, slug: m.slug })),
      {
        kind: "vote",
        title: "Will young voters show up?",
        icon: "people",
        chance: 23,
        volume: "$918,440",
        yes: "Show up",
        no: "Stay home",
      },
    ],
    trade: {
      question: input.title,
      yesLabel: input.optionA,
      noLabel: input.optionB,
      yesPrice: a,
      noPrice: b,
    },
  };
}

export function categoryHref(category: string) {
  return `/category/${slugify(category) || "other"}`;
}

/** Categories in use, in order of their newest market. */
export function categoriesOf(markets: Market[]) {
  return [...new Set(markets.map((m) => m.category))];
}

/** Trending, then one tab per category in use. */
export function navItems(markets: Market[]) {
  return [
    { label: "Trending", href: "/" },
    ...categoriesOf(markets).map((c) => ({ label: c, href: categoryHref(c) })),
  ];
}

/** Lead (first-series) odds, used on related-market cards. */
export function leadChance(market: Market): number {
  return market.series[0].end;
}
