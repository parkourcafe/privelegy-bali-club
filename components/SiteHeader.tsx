import Link from "next/link";

// Overlay header for the cinematic homepage. Menu is deliberately minimal:
// the two anchors that matter + My perks + the primary action.
export default function SiteHeader() {
  return (
    <header className="ob-header">
      <div className="site-shell ob-header-inner">
        <Link href="/" className="ob-wordmark">
          Other <em>Bali</em>
        </Link>
        <nav className="ob-nav" aria-label="Main">
          <a href="#routes">Routes</a>
          <a href="#how">How it works</a>
          <a href="#trust">Why trust this</a>
          <Link href="/me">My perks</Link>
          <a href="#guide" className="ob-nav-cta">
            Plan my day
          </a>
        </nav>
      </div>
    </header>
  );
}
