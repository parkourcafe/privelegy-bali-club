import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="ob-footer">
      <div className="site-shell ob-footer-inner">
        <p className="ob-footer-tagline">
          The right place for the moment you&apos;re in.
        </p>
        <nav className="ob-footer-links" aria-label="Footer">
          <a href="#routes">Routes</a>
          <a href="#guide">The guide</a>
          <a href="#how">How it works</a>
          <a href="#faq">FAQ</a>
          <Link href="/me">My perks</Link>
        </nav>
        <p className="ob-footer-note">
          Other Bali is free to use — no account, no card, no charges. We earn
          from venues only when a table reserved through us becomes a real
          seated visit. Sponsored placements are always labeled and never
          change the order of recommendations.
        </p>
      </div>
    </footer>
  );
}
