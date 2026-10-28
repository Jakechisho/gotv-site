import Link from "next/link";
import { navItems, type Market } from "@/lib/markets";
import { LogoMark } from "./Icons";
import { VoteLink } from "./VoteLink";

export function Footer({ markets }: { markets: Market[] }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <LogoMark size={22} />
          <span className="wordmark">GOTV</span>
          <span className="footer-tag">A nonpartisan voting campaign. Not a betting platform.</span>
        </div>
        <nav aria-label="Footer">
          <ul className="footer-links">
            {navItems(markets).map((item) => (
              <li key={item.label}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <a href="#about">About GOTV</a>
            </li>
            <li>
              <VoteLink>Vote.gov ↗</VoteLink>
            </li>
          </ul>
        </nav>
        <p className="footer-legal">© 2026 GOTV. Odds and volumes are simulated.</p>
      </div>
    </footer>
  );
}
