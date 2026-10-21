export const VOTE_URL = "https://vote.gov";

/** Set when a visitor leaves for Vote.gov; read (and cleared) when they come back. */
export const VOTE_VISIT_KEY = "gotv:vote-visit";

export function markVoteVisit() {
  try {
    sessionStorage.setItem(VOTE_VISIT_KEY, "1");
  } catch {
    // Storage can be unavailable (private mode, blocked site data). The link still works.
  }
}

/** Returns true once per Vote.gov trip, then clears the flag. */
export function consumeVoteVisit(): boolean {
  try {
    if (sessionStorage.getItem(VOTE_VISIT_KEY) !== "1") return false;
    sessionStorage.removeItem(VOTE_VISIT_KEY);
    return true;
  } catch {
    return false;
  }
}
