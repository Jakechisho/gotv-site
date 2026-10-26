// Homepage "Decide an Election" hub. Like the markets, every number is illustrative
// Odds are kept deliberately close; the page takes no side.

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

/** `a` is the Democratic side's odds; the Republican side is 100 - a. */
export type KeyRace = { key: string; title: string; dem: string; rep: string; a: number; href?: string };

export const keyRaces: KeyRace[] = [
  { key: "politics", title: "Texas Senate", dem: "J. Talarico", rep: "K. Paxton", a: 51, href: "/politics" },
  { key: "race:ia-sen", title: "Iowa Senate", dem: "J. Turek", rep: "A. Hinson", a: 48 },
  { key: "race:oh-sen", title: "Ohio Senate", dem: "S. Brown", rep: "J. Husted", a: 50 },
  { key: "race:ia-gov", title: "Iowa Governor", dem: "R. Sand", rep: "Z. Lahn", a: 53 },
  { key: "race:ak-sen", title: "Alaska Senate", dem: "M. Peltola", rep: "D. Sullivan", a: 47 },
];

export const TURNOUT = { key: "vote:young", chance: 23 };
