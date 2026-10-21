"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Market } from "@/lib/markets";
import { CHART_NOW, RANGES, RANGE_WINDOW, formatTick, simulate, type Range } from "@/lib/series";

const PAD = { top: 12, right: 44, bottom: 26, left: 4 };
const GRID = [0, 25, 50, 75, 100];

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.round(width), height: Math.round(height) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, size] as const;
}

export function ChartCard({ market }: { market: Market }) {
  const [range, setRange] = useState<Range>("ALL");
  const [hover, setHover] = useState<number | null>(null);
  const [plotRef, { width, height }] = useSize<HTMLDivElement>();
  const descId = useId();
  const liveId = useId();

  const { points, stepMinutes } = RANGE_WINDOW[range];
  const data = useMemo(
    () =>
      market.series.map((s, i) =>
        simulate(s, market.seed * 31 + i * 7 + RANGES.indexOf(range) * 101, points),
      ),
    [market, range, points],
  );
  const times = useMemo(
    () => Array.from({ length: points }, (_, i) => CHART_NOW - (points - 1 - i) * stepMinutes * 60_000),
    [points, stepMinutes],
  );

  const innerW = Math.max(0, width - PAD.left - PAD.right);
  const innerH = Math.max(0, height - PAD.top - PAD.bottom);
  const x = (i: number) => PAD.left + (points === 1 ? innerW : (i / (points - 1)) * innerW);
  const y = (v: number) => PAD.top + (1 - v / 100) * innerH;

  const paths = data.map((values) =>
    values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(""),
  );

  const index = hover ?? points - 1;
  const ticks = [0, Math.floor((points - 1) / 3), Math.floor(((points - 1) * 2) / 3), points - 1];

  function pointerToIndex(clientX: number, el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const rel = (clientX - rect.left - PAD.left) / Math.max(1, innerW);
    return Math.max(0, Math.min(points - 1, Math.round(rel * (points - 1))));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const current = hover ?? points - 1;
    let next: number | null = null;
    if (e.key === "ArrowLeft") next = Math.max(0, current - 1);
    if (e.key === "ArrowRight") next = Math.min(points - 1, current + 1);
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = points - 1;
    if (e.key === "Escape") setHover(null);
    if (next !== null) {
      e.preventDefault();
      setHover(next);
    }
  }

  const tooltipLeft = Math.min(Math.max(x(index), 70), Math.max(70, width - PAD.right - 70));

  return (
    <section className="card chart-card" aria-labelledby="campaign-headline">
      <ul className="legend" aria-label="Current odds">
        {market.series.map((s, i) => (
          <li key={s.name}>
            <span className="legend-dot" style={{ background: s.color }} aria-hidden="true" />
            <span className="legend-name">{s.name}</span>
            <span className="legend-value">{Math.round(data[i][index])}%</span>
          </li>
        ))}
      </ul>

      <h2 id="campaign-headline" className="campaign-headline">
        {market.headline}
      </h2>
      <p className="campaign-subhead">{market.subhead}</p>

      <div
        ref={plotRef}
        className="plot"
        role="img"
        tabIndex={0}
        aria-label={`Odds chart for ${market.title}, ${range} range. Use left and right arrow keys to inspect points.`}
        aria-describedby={descId}
        onPointerMove={(e) => setHover(pointerToIndex(e.clientX, e.currentTarget))}
        onPointerLeave={() => setHover(null)}
        onKeyDown={onKeyDown}
        onBlur={() => setHover(null)}
      >
        {width > 0 && (
          <svg width={width} height={height} aria-hidden="true" focusable="false">
            {GRID.map((g) => (
              <g key={g}>
                <line
                  x1={PAD.left}
                  x2={width - PAD.right}
                  y1={y(g)}
                  y2={y(g)}
                  className="grid-line"
                />
                <text x={width - PAD.right + 8} y={y(g) + 4} className="axis-label">
                  {g}%
                </text>
              </g>
            ))}
            {ticks.map((t, i) => (
              <text
                key={t}
                x={x(t)}
                y={height - 6}
                className="axis-label"
                textAnchor={i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle"}
              >
                {formatTick(times[t], range)}
              </text>
            ))}
            {paths.map((d, i) => (
              <path
                key={`${range}-${i}`}
                d={d}
                className="series-line"
                stroke={market.series[i].color}
                pathLength={1}
              />
            ))}
            {hover !== null && (
              <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} className="hover-line" />
            )}
            {data.map((values, i) => (
              <circle
                key={i}
                cx={x(index)}
                cy={y(values[index])}
                r={hover !== null ? 4.5 : 3.5}
                fill={market.series[i].color}
                stroke="#fff"
                strokeWidth="2"
                className={hover === null ? "end-dot" : undefined}
              />
            ))}
          </svg>
        )}
        {hover !== null && width > 0 && (
          <div className="chart-tooltip" style={{ left: tooltipLeft }} aria-hidden="true">
            <div className="tooltip-time">{formatTick(times[hover], range)}</div>
            {market.series.map((s, i) => (
              <div key={s.name} className="tooltip-row">
                <span className="legend-dot" style={{ background: s.color }} />
                {s.name} <strong>{Math.round(data[i][hover])}%</strong>
              </div>
            ))}
          </div>
        )}
      </div>
      <p id={descId} className="sr-only">
        {market.chartDescription} Odds are simulated for a nonpartisan voting campaign and are not real market data.
      </p>
      <p id={liveId} className="sr-only" aria-live="polite">
        {hover !== null
          ? `${formatTick(times[hover], range)}: ${market.series
              .map((s, i) => `${s.name} ${Math.round(data[i][hover])} percent`)
              .join(", ")}`
          : ""}
      </p>

      <div className="chart-footer">
        <span className="chart-volume">{market.volume} Vol.</span>
        <div className="range-controls" role="group" aria-label="Chart time range">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              className={`range-btn${r === range ? " is-selected" : ""}`}
              aria-pressed={r === range}
              onClick={() => {
                setRange(r);
                setHover(null);
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
