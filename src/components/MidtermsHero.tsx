"use client";

import Link from "next/link";
import { useMemo } from "react";
import { chambers, keyRaces, TURNOUT, type Chamber } from "@/lib/midterms";
import { liveChance, liveVolume, useLive } from "@/lib/live";
import { simulate } from "@/lib/series";
import { Flash } from "./Live";
import { VoteLink } from "./VoteLink";

const A = "#2d6af6";
const B = "#f2810c";

function ChamberTile({ c }: { c: Chamber }) {
  const { drift } = useLive(c.key);
  const a = liveChance(c.a, drift, 0);
  return (
    <VoteLink className="mt-tile" aria-label={`${c.label} control: ${a} to ${100 - a}. Opens Vote.gov`}>
      <span className="mt-tile-label">{c.label}</span>
      <Flash value={a} className="mt-tile-big">
        {a}%
      </Flash>
      <span className="mt-split" aria-hidden="true">
        <span style={{ width: `${a}%`, background: A }} />
        <span style={{ width: `${100 - a}%`, background: B }} />
      </span>
      <span className="mt-tile-foot">
        <span>Side A {a}%</span>
        <span>Side B {100 - a}%</span>
      </span>
    </VoteLink>
  );
}

function SeatCard({ c }: { c: Chamber }) {
  const { drift } = useLive(c.key);
  const a = liveChance(c.a, drift, 0);
  const s = c.seats!;
  const open = s.total - s.a - s.b;
  return (
    <section className="card mt-seats" aria-labelledby={`${c.key}-h`}>
      <div className="mt-card-kicker">U.S. {c.label} Midterm Winner</div>
      <h2 id={`${c.key}-h`} className="mt-card-title">
        Control of the {c.label} is a coin flip: <Flash value={a}>{a}%</Flash> to {100 - a}%.
      </h2>
      <div className="mt-seatbar" aria-hidden="true">
        <span style={{ flex: s.a, background: A }} />
        <span style={{ flex: open }} className="mt-open" />
        <span style={{ flex: s.b, background: B }} />
        <i style={{ left: `${(s.toWin / s.total) * 100}%` }} />
      </div>
      <div className="mt-seat-legend">
        <span><b style={{ color: A }}>{s.a}</b> Side A</span>
        <span className="mt-towin">{s.toWin} to win</span>
        <span>Side B <b style={{ color: B }}>{s.b}</b></span>
      </div>
      <p className="mt-open-note">
        <b>{open} seats</b> are still open. Polls and markets can’t fill them. Voters do.
      </p>
      <VoteLink className="btn btn-primary mt-cta">Decide one ↗</VoteLink>
    </section>
  );
}

function TurnoutCard() {
  const { drift, volume } = useLive(TURNOUT.key);
  const yes = liveChance(TURNOUT.chance, drift, 0);
  const line = useMemo(() => simulate({ name: "", color: "", start: 31, end: TURNOUT.chance }, 99, 60), []);
  const pts = line.map((v, i) => (i === line.length - 1 ? yes : v));
  const d = pts.map((v, i) => `${i ? "L" : "M"}${(i / 59) * 400},${(1 - v / 60) * 140 + 6}`).join("");
  return (
    <section className="card mt-turnout" aria-labelledby="turnout-h">
      <div className="mt-card-kicker">Most traded market</div>
      <h2 id="turnout-h" className="mt-card-title">
        There’s a <Flash value={yes}>{yes}%</Flash> chance young voters show up.
      </h2>
      <svg viewBox="0 0 400 152" className="mt-spark" role="img" aria-label={`Simulated odds that young voters show up, falling from 31 to ${yes} percent.`}>
        <path d={d} fill="none" stroke="var(--green)" strokeWidth="2.5" className="series-line" pathLength={1} />
      </svg>
      <div className="mt-turnout-rows">
        <VoteLink className="price-btn yes">Show up {yes}¢</VoteLink>
        <VoteLink className="price-btn no">Stay home {100 - yes}¢</VoteLink>
      </div>
      <div className="mt-card-foot">
        <span>{liveVolume("$918,440", volume)} Vol.</span>
        <span>This one resolves the way you make it.</span>
      </div>
    </section>
  );
}

function RaceCard({ r }: { r: (typeof keyRaces)[number] }) {
  const { drift } = useLive(r.key);
  const a = liveChance(r.a, drift, 0);
  const body = (
    <>
      <span className="mt-race-title">{r.title}</span>
      <span className="mt-race-row">
        <span><i style={{ background: A }} />Candidate A</span>
        <Flash value={a}>{a}%</Flash>
      </span>
      <span className="mt-race-row">
        <span><i style={{ background: B }} />Candidate B</span>
        <span>{100 - a}%</span>
      </span>
      <span className="mt-split" aria-hidden="true">
        <span style={{ width: `${a}%`, background: A }} />
        <span style={{ width: `${100 - a}%`, background: B }} />
      </span>
    </>
  );
  return r.href ? (
    <Link href={r.href} className="card mt-race">{body}</Link>
  ) : (
    <VoteLink className="card mt-race">{body}</VoteLink>
  );
}

/** Full-width midterms hub at the top of the homepage. */
export function MidtermsHero() {
  return (
    <section className="mt" aria-labelledby="mt-title">
      <div className="mt-head">
        <div>
          <div className="mt-kicker">
            <span className="live"><span className="live-dot" aria-hidden="true" />Live</span>
            Midterms 2026 · Election day Nov 3
          </div>
          <h1 id="mt-title" className="mt-title">Decide an Election</h1>
          <p className="mt-sub">
            2026 midterm odds and predictions. Every race on this page is too close to call, and none
            of it is decided by the market.
          </p>
        </div>
        <VoteLink className="btn btn-primary mt-head-cta">Make a plan to vote ↗</VoteLink>
      </div>

      <div className="mt-tiles">
        {chambers.map((c) => <ChamberTile key={c.key} c={c} />)}
      </div>

      <div className="mt-grid">
        <SeatCard c={chambers[0]} />
        <TurnoutCard />
      </div>

      <h2 className="mt-section">Key races</h2>
      <div className="mt-races">
        {keyRaces.map((r) => <RaceCard key={r.key} r={r} />)}
      </div>
    </section>
  );
}
