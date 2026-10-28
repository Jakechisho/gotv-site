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

Locally, set `ADMIN_PASSWORD` (e.g. `ADMIN_PASSWORD=dev npm run dev`) to use the
admin page. Without a Blob token, markets are saved to `.data/markets.json`.

## Creating markets

Go to `/admin` (not linked anywhere, not indexed) and log in with `ADMIN_PASSWORD`.
Enter the market name, headline, two options, and a category (pick one or type a
new one; each category in use gets a nav tab and a page at `/category/<name>`). Odds, subhead,
resolve date, and page address are optional. Markets are saved as one JSON file in
Vercel Blob (`BLOB_READ_WRITE_TOKEN`, store `gotv-markets`), so they survive deploys,
and pages refresh as soon as you publish or delete.

## Where things live

- `src/app/admin/` — the hidden market creator (password login, create, delete).
- `src/lib/store.ts` — reads and writes the saved markets (Blob, cached until a change).
- `src/lib/markets.ts` — `buildMarket` turns a saved market (name, headline, two
  options) into the full page content: odds, volume, chart, rules, related cards.
- `src/components/MarketExperience.tsx` — the shared page layout.
- `src/components/VoteLink.tsx` — the only way the site links to Vote.gov; it sets
  the `gotv:vote-visit` sessionStorage flag on a plain left click.
- `src/components/ReturnModal.tsx` — reads and clears that flag on mount and on
  `pageshow` (covers back-forward cache restores). Uses Radix Dialog for focus
  trapping, Escape, and labelling. Its "Return to Vote.gov" button does not set
  the flag again.
- `src/lib/series.ts` — deterministic simulated chart data. No real market data.

No payments or betting. The only login is the admin password.
