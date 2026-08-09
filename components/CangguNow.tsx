import Image from "next/image";
import Link from "next/link";

const CANGGU_NOW_ITEMS: Array<{ label: string; href: string; copy: string; imageSrc?: string }> = [
  {
    label: "Breakfast",
    href: "/canggu/best-brunch",
    copy: "Coffee, brunch, an easy start.",
    imageSrc: "/scenes/canggu-cafes-illustrative.webp",
  },
  {
    label: "Restaurants",
    href: "/canggu/best-restaurants",
    copy: "Date night or a table for friends.",
    imageSrc: "/scenes/canggu-restaurants-illustrative.webp",
  },
  {
    label: "Beach clubs",
    href: "/canggu/beach-clubs-sunset",
    copy: "Sunset, social or quiet.",
    imageSrc: "/scenes/canggu-sunset-illustrative.webp",
  },
  {
    label: "Spa & reset",
    href: "/canggu/best-spas",
    copy: "Slow down after beach and board.",
    imageSrc: "/scenes/canggu-spas-illustrative.webp",
  },
  {
    label: "Rainy day",
    href: "/route/canggu-rainy-day",
    copy: "Covered stops, without losing the day.",
    imageSrc: "/scenes/home-bali-rainy-day.webp",
  },
  {
    label: "Remote work",
    href: "/route/cafe-work",
    copy: "Laptop café, lunch, then switch off.",
    imageSrc: "/scenes/plan-route-cafe-work.webp",
  },
] as const;

const CANGGU_NOW_UTILITIES = [
  { label: "Near me", href: "/my-day" },
  { label: "First day", href: "/route/first-day" },
  { label: "With kids", href: "/places?district=canggu&q=kids" },
  { label: "Saved", href: "/me" },
  { label: "My perks", href: "/me#offers" },
] as const;

export default function CangguNow() {
  return (
    <section className="guide-section canggu-now-section" aria-labelledby="canggu-now-heading">
      <div className="canggu-section-heading">
        <div>
          <p className="eyebrow">Canggu Now</p>
          <h2 id="canggu-now-heading">Choose the moment</h2>
        </div>
        <Link href="/places?district=canggu" className="quiet-link">
          All Canggu places →
        </Link>
      </div>

      <div className="canggu-moment-grid" aria-label="Fits this moment">
        {CANGGU_NOW_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="canggu-visual-card canggu-moment-card"
            data-canggu-moment-card
          >
            {item.imageSrc ? (
              <Image
                src={item.imageSrc}
                alt=""
                fill
                loading="lazy"
                sizes="(max-width: 759px) calc((100vw - 3.5rem) / 2), (max-width: 1199px) calc((100vw - 5rem) / 3), 360px"
                className="canggu-visual-card-image ob-grade"
              />
            ) : (
              <span className="canggu-visual-card-no-image" aria-hidden="true" />
            )}
            <span className="canggu-visual-card-scrim" aria-hidden="true" />
            <span className="canggu-visual-card-copy" data-media-copy>
              <strong>{item.label}</strong>
              <span>{item.copy}</span>
            </span>
          </Link>
        ))}
      </div>
      <nav className="canggu-utility-links" aria-label="More ways to start in Canggu">
        {CANGGU_NOW_UTILITIES.map((item) => (
          <Link key={item.label} href={item.href}>
            {item.label} <span aria-hidden="true">→</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
