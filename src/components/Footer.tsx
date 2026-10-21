import Link from "next/link";
import { LogoMark } from "./Icons";
import { VoteLink } from "./VoteLink";

export function Footer() {
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
            <li>
              <Link href="/">Trending</Link>
            </li>
            <li>
              <Link href="/politics">Politics</Link>
            </li>
            <li>
              <Link href="/weather">Weather</Link>
            </li>
            <li>
              <Link href="/economy">Economy</Link>
            </li>
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
