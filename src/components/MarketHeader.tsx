"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categoryHref, type Market } from "@/lib/markets";
import { LiveVolume } from "./Live";
import { BookmarkIcon, CategoryIcon, ChevronIcon, ClockIcon, ShareIcon } from "./Icons";

export function MarketHeader({ market }: { market: Market }) {
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${market.title} · GOTV`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast("Link copied");
    } catch {
      // Share sheet dismissed or clipboard blocked; nothing to do.
    }
  }

  return (
    <div className="market-header">
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <ol>
          {market.breadcrumb.map((crumb, i) => {
            const last = i === market.breadcrumb.length - 1;
            return (
              <li key={crumb}>
                {i === 0 ? (
                  <Link href={categoryHref(market.category)}>{crumb}</Link>
                ) : (
                  <span aria-current={last ? "page" : undefined}>{crumb}</span>
                )}
                {!last && <ChevronIcon size={12} className="crumb-sep" />}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="market-title-row">
        <CategoryIcon name={market.icon} />
        <div className="market-title-text">
          <h1>{market.title}</h1>
          <div className="market-meta">
            <span className="live">
              <span className="live-dot" aria-hidden="true" />
              Live
            </span>
            <span>
              <LiveVolume slug={market.slug} base={market.volume} /> Vol.
            </span>
            <span className="meta-date">
              <ClockIcon size={14} /> {market.endDate}
            </span>
          </div>
        </div>
        <div className="market-actions">
          <button
            type="button"
            className="icon-btn"
            aria-pressed={saved}
            aria-label={saved ? "Remove bookmark" : "Bookmark this market"}
            onClick={() => {
              setSaved((s) => !s);
              setToast(saved ? "Bookmark removed" : "Bookmarked");
            }}
          >
            <BookmarkIcon filled={saved} />
          </button>
          <button type="button" className="icon-btn" aria-label="Share this market" onClick={share}>
            <ShareIcon />
          </button>
        </div>
      </div>
      <div className="toast" role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}
