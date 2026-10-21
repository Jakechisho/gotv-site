# GOTV

A nonpartisan get-out-the-vote campaign site styled as a prediction market.
Every buy, sell, vote, sign-up, or "voting info" action goes to https://vote.gov
in the same tab. Coming back with the Back button shows a one-time message.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000 (Trending homepage)
npm run build && npm start
```

Static export (any static host): `STATIC_EXPORT=1 npm run build` writes `out/`.

## Where things live

- `src/lib/markets.ts` — every market page's content. Add a market by adding an
  entry here; `/[slug]` renders it and the header nav/related cards can point to it.
- `src/components/MarketExperience.tsx` — the shared page layout.
- `src/components/VoteLink.tsx` — the only way the site links to Vote.gov; it sets
  the `gotv:vote-visit` sessionStorage flag on a plain left click.
- `src/components/ReturnModal.tsx` — reads and clears that flag on mount and on
  `pageshow` (covers back-forward cache restores). Uses Radix Dialog for focus
  trapping, Escape, and labelling. Its "Return to Vote.gov" button does not set
  the flag again.
- `src/lib/series.ts` — deterministic simulated chart data. No real market data.

No database, auth, payments, or betting.
