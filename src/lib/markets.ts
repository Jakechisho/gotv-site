// Market configuration. Every market page is rendered by <MarketExperience />
// from one of these objects, so a new market is a new entry here, not a new layout.

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
  /** Matches a header category so the right tab is underlined. */
  category: "Politics" | "Weather" | "Economy";
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

export const markets: Record<string, Market> = {
  politics: {
    slug: "politics",
    category: "Politics",
    breadcrumb: ["Politics", "Elections", "Texas Senate"],
    icon: "politics",
    title: "Texas Senate Election Winner",
    cardTitle: "Texas Senate Election Winner",
    volume: "$4,812,330",
    endDate: "Nov 3, 2026",
    headline: "Too close to call. Your vote isn’t.",
    subhead:
      "Traders are pricing this race at a coin flip. Coin flips don’t decide elections. Turnout does.",
    chartDescription:
      "Line chart of simulated odds for James Talarico and Ken Paxton. Both lines hover near 50 percent for the whole period, crossing several times, ending at 51 and 49 percent.",
    seed: 7,
    series: [
      { name: "James Talarico (D)", color: "#2d6af6", start: 46, end: 51 },
      { name: "Ken Paxton (R)", color: "#e23b3b", start: 54, end: 49 },
    ],
    outcomes: [
      {
        kind: "market",
        id: "a",
        name: "James Talarico (D)",
        detail: "Democrat · $2,406,112 Vol.",
        initials: "JT",
        color: "#2d6af6",
        chance: 51,
        change: 2,
        yesPrice: 51,
        noPrice: 50,
      },
      {
        kind: "market",
        id: "b",
        name: "Ken Paxton (R)",
        detail: "Republican · $2,388,904 Vol.",
        initials: "KP",
        color: "#e23b3b",
        chance: 49,
        change: -2,
        yesPrice: 49,
        noPrice: 52,
      },
      {
        kind: "reveal",
        id: "voters",
        name: "Texans who vote",
        detail: "Not for sale",
        initials: "TX",
        color: "#0f9d58",
        label: "Decides it",
        cta: "Make a plan to vote",
      },
    ],
    rules: [
      "This market resolves to whichever candidate receives the most votes in the Texas U.S. Senate general election on November 3, 2026.",
      "No trade placed here can change that result. The only position that counts is a ballot cast by a registered voter.",
      "Odds shown are illustrative. GOTV does not take positions, accept money, or settle trades.",
    ],
    context: [
      "Close races are often decided by margins smaller than the number of people who stayed home.",
      "Young voters are one of the largest groups of eligible voters, and one of the least likely to turn out. That gap is the opportunity.",
      "Registration deadlines, early voting dates, and ID rules vary by state. Vote.gov points you to your state’s official information.",
    ],
    related: [
      { kind: "market", slug: "weather" },
      { kind: "market", slug: "economy" },
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
      question: "Texas Senate Election Winner",
      yesLabel: "Talarico",
      noLabel: "Paxton",
      yesPrice: 51,
      noPrice: 49,
    },
  },

  weather: {
    slug: "weather",
    category: "Weather",
    breadcrumb: ["Weather", "Climate", "2050 Outlook"],
    icon: "weather",
    title: "U.S. Weather Outlook: 2050",
    cardTitle: "U.S. Weather Outlook: 2050",
    volume: "$2,140,775",
    endDate: "Dec 31, 2050",
    headline: "You can’t trade the weather. You can vote on how we prepare for it.",
    subhead:
      "Flood maps, heat plans, and power grids are decided by people on your ballot, many of them local.",
    chartDescription:
      "Line chart of simulated odds. The line for more extreme heat days climbs from 58 to 74 percent while the line for communities being ready falls from 42 to 31 percent.",
    seed: 21,
    series: [
      { name: "More extreme heat days", color: "#f2810c", start: 58, end: 74 },
      { name: "Communities ready for it", color: "#2d6af6", start: 42, end: 31 },
    ],
    outcomes: [
      {
        kind: "market",
        id: "heat",
        name: "More extreme heat days",
        detail: "$1,204,330 Vol.",
        initials: "H",
        color: "#f2810c",
        chance: 74,
        change: 6,
        yesPrice: 74,
        noPrice: 27,
      },
      {
        kind: "market",
        id: "ready",
        name: "Communities ready for it",
        detail: "$936,445 Vol.",
        initials: "R",
        color: "#2d6af6",
        chance: 31,
        change: -4,
        yesPrice: 31,
        noPrice: 70,
      },
      {
        kind: "reveal",
        id: "local",
        name: "Your local ballot",
        detail: "Mayors, councils, utility boards",
        initials: "LB",
        color: "#0f9d58",
        label: "Decides it",
        cta: "See what’s on yours",
      },
    ],
    rules: [
      "This market resolves on December 31, 2050, based on how prepared U.S. communities are for the weather they actually get.",
      "Preparation is set by budgets, building codes, and infrastructure plans approved by elected officials and ballot measures.",
      "Odds shown are illustrative. GOTV does not take positions, accept money, or settle trades.",
    ],
    context: [
      "Many of the decisions that shape how a city handles heat, floods, and storms are made by local offices that see very low turnout.",
      "Local elections are often decided by a few hundred votes.",
      "Vote.gov links to your state’s official election site, where you can see what’s on your ballot.",
    ],
    related: [
      { kind: "market", slug: "politics" },
      { kind: "market", slug: "economy" },
      {
        kind: "vote",
        title: "Will Costco raise its $1.50 hot dog?",
        icon: "economy",
        chance: 8,
        volume: "$3,305,019",
        yes: "Yes",
        no: "No",
      },
    ],
    trade: {
      question: "U.S. Weather Outlook: 2050",
      yesLabel: "Hotter",
      noLabel: "Ready",
      yesPrice: 74,
      noPrice: 31,
    },
  },

  economy: {
    slug: "economy",
    category: "Economy",
    breadcrumb: ["Economy", "Cost of Living", "Rent vs. Wages"],
    icon: "economy",
    title: "Will rent rise faster than paychecks in 2027?",
    cardTitle: "Rent vs. paychecks in 2027",
    volume: "$3,027,118",
    endDate: "Dec 31, 2027",
    headline: "You can’t short your rent. You can vote on it.",
    subhead:
      "Zoning, minimum wage, transit, and tuition all get decided by people you can elect.",
    chartDescription:
      "Line chart of simulated odds. Rent outpacing wages rises from 55 to 68 percent while wages catching up falls from 45 to 33 percent.",
    seed: 42,
    series: [
      { name: "Rent outpaces wages", color: "#f2810c", start: 55, end: 68 },
      { name: "Wages catch up", color: "#2d6af6", start: 45, end: 33 },
    ],
    outcomes: [
      {
        kind: "market",
        id: "rent",
        name: "Rent outpaces wages",
        detail: "$1,688,204 Vol.",
        initials: "R",
        color: "#f2810c",
        chance: 68,
        change: 3,
        yesPrice: 68,
        noPrice: 33,
      },
      {
        kind: "market",
        id: "wages",
        name: "Wages catch up",
        detail: "$1,338,914 Vol.",
        initials: "W",
        color: "#2d6af6",
        chance: 33,
        change: -3,
        yesPrice: 33,
        noPrice: 68,
      },
      {
        kind: "reveal",
        id: "voters",
        name: "People who vote",
        detail: "Every race on the ballot",
        initials: "V",
        color: "#0f9d58",
        label: "Decides it",
        cta: "Make a plan to vote",
      },
    ],
    rules: [
      "This market resolves on December 31, 2027, comparing national median rent growth with median wage growth.",
      "Housing, wage, and transit policy are set by officials and ballot measures that voters choose.",
      "Odds shown are illustrative. GOTV does not take positions, accept money, or settle trades.",
    ],
    context: [
      "City councils decide what can be built and where. State legislatures and ballot measures often set minimum wages.",
      "These offices are on the ballot more often than you’d think, and usually with far lower turnout than a presidential race.",
      "Vote.gov points you to registration and voting information for your state.",
    ],
    related: [
      { kind: "market", slug: "politics" },
      { kind: "market", slug: "weather" },
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
      question: "Rent vs. paychecks in 2027",
      yesLabel: "Rent wins",
      noLabel: "Wages win",
      yesPrice: 68,
      noPrice: 33,
    },
  },
};

export const marketList = Object.values(markets);

export function getMarket(slug: string): Market | undefined {
  return markets[slug];
}

/** Lead (first-series) odds, used on related-market cards. */
export function leadChance(market: Market): number {
  return market.series[0].end;
}
