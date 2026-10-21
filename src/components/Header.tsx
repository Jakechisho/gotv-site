"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { marketList } from "@/lib/markets";
import { LogoMark, SearchIcon } from "./Icons";
import { VoteLink } from "./VoteLink";

const NAV = [
  { label: "Trending", href: "/" },
  ...marketList.map((m) => ({ label: m.category, href: `/${m.slug}` })),
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname === `${href}/`;
}

function MarketSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const listId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return marketList.filter((m) =>
      [m.title, m.category, ...m.breadcrumb].some((s) => s.toLowerCase().includes(q)),
    );
  }, [query]);

  const showResults = focused && query.trim().length > 0;

  return (
    <form
      role="search"
      className="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (results[0]) {
          router.push(`/${results[0].slug}`);
          setQuery("");
        }
      }}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
      }}
    >
      <SearchIcon size={16} className="search-icon" />
      <input
        type="search"
        placeholder="Search markets"
        aria-label="Search markets"
        aria-controls={showResults ? listId : undefined}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {showResults && (
        <div className="search-results" id={listId}>
          {results.length > 0 ? (
            <ul>
              {results.map((m) => (
                <li key={m.slug}>
                  <Link href={`/${m.slug}`} onClick={() => setQuery("")}>
                    <span>{m.title}</span>
                    <span className="search-chance">{m.series[0].end}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="search-empty">
              No markets found. The one that matters isn’t listed:{" "}
              <VoteLink>your ballot ↗</VoteLink>
            </p>
          )}
        </div>
      )}
    </form>
  );
}

export function Header() {
  const pathname = usePathname() ?? "";

  return (
    <header className="site-header">
      <div className="header-top container">
        <Link href="/" className="brand" aria-label="GOTV home">
          <LogoMark />
          <span className="wordmark">GOTV</span>
        </Link>
        <MarketSearch />
        <div className="account">
          <VoteLink className="btn btn-ghost" aria-label="Log in (opens Vote.gov)">
            Log In
          </VoteLink>
          <VoteLink className="btn btn-primary btn-sm" aria-label="Sign up (register to vote at Vote.gov)">
            Sign Up
          </VoteLink>
        </div>
      </div>
      <nav className="category-nav" aria-label="Market categories">
        <ul className="container">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`category-link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
