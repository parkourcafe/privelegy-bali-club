import Link from "next/link";
import OtherBaliLogo from "@/components/OtherBaliLogo";

export default function SiteFooter() {
  return (
    <footer className="ob-footer">
      <div className="site-shell ob-footer-inner">
        <Link href="/" aria-label="Other Bali — home" className="inline-flex">
          <OtherBaliLogo size={20} />
        </Link>
        <p className="ob-footer-tagline">
          The right place for the moment you&apos;re in.
        </p>
        <nav className="ob-footer-links" aria-label="Footer">
          <a href="#routes">Routes</a>
          <a href="#guide">The guide</a>
          <a href="#bali">Around Bali</a>
          <a href="#how">How it works</a>
          <a href="#faq">FAQ</a>
          <Link href="/me">My perks</Link>
          <Link href="/for-venues">List your place</Link>
          <Link href="/villas">For villas</Link>
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
