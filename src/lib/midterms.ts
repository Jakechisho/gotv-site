// Homepage "Decide an Election" hub. Like the markets, every number is illustrative
// and every side is generic, so the page stays nonpartisan.

export type Chamber = {
  key: string;
  label: string;
  a: number;
  seats?: { a: number; b: number; total: number; toWin: number };
};

export const chambers: Chamber[] = [
  { key: "mid:senate", label: "Senate", a: 50, seats: { a: 47, b: 47, total: 100, toWin: 51 } },
  { key: "mid:house", label: "House", a: 52, seats: { a: 208, b: 205, total: 435, toWin: 218 } },
  { key: "mid:governor", label: "Governors", a: 49 },
];

export type KeyRace = { key: string; title: string; a: number; href?: string };

export const keyRaces: KeyRace[] = [
  { key: "politics", title: "Texas Senate", a: 51, href: "/politics" },
  { key: "race:ia-sen", title: "Iowa Senate", a: 48 },
  { key: "race:oh-sen", title: "Ohio Senate", a: 50 },
  { key: "race:ia-gov", title: "Iowa Governor", a: 53 },
  { key: "race:ak-sen", title: "Alaska Senate", a: 47 },
];

export const TURNOUT = { key: "vote:young", chance: 23 };
