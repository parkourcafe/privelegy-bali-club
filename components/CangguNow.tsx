import Link from "next/link";

const CANGGU_NOW_ITEMS = [
  {
    label: "Near me",
    href: "/my-day",
    copy: "Use the day builder, or fall back to Canggu areas if location is off.",
  },
  { label: "Breakfast", href: "/canggu/best-brunch", copy: "Brunch and easy morning starts." },
  { label: "Restaurants", href: "/canggu/best-restaurants", copy: "Dinner rooms and group tables." },
  { label: "Beach clubs", href: "/canggu/beach-clubs-sunset", copy: "Pool, beach and sunset setups." },
  { label: "Spa", href: "/canggu/best-spas", copy: "Reset stops for slow afternoons." },
  { label: "Sunset", href: "/route/sunset-run", copy: "A Canggu sunset route, then dinner nearby." },
  { label: "Rainy day", href: "/route/canggu-rainy-day", copy: "Covered, low-friction stops when weather turns." },
  { label: "First day", href: "/route/first-day", copy: "Soft landing: coffee, beach, sunset, dinner." },
  { label: "Remote work", href: "/route/cafe-work", copy: "Laptop-friendly cafés and easy lunch." },
  { label: "With kids", href: "/places?district=canggu&q=kids", copy: "Lower-friction daytime picks." },
  { label: "Saved", href: "/me", copy: "Open your private shortlist on this device." },
  { label: "My perks", href: "/me#offers", copy: "See redeemed or saved venue offers." },
] as const;

export default function CangguNow() {
  return (
    <section className="guide-section rounded-[2rem] border border-[var(--sand-line)] bg-white/80 p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Canggu Now</p>
          <h2>What do you want to do in Canggu now?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            Pick the moment, then choose from editorially tagged places and existing routes.
            We show “Fits this moment” from editorial tags until verified structured hours exist.
          </p>
        </div>
        <Link href="/places?district=canggu" className="quiet-link">
          Browse all Canggu places →
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CANGGU_NOW_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-2xl border border-[var(--sand-line)] bg-[var(--sand)]/55 p-4 transition hover:border-[var(--accent)] hover:bg-white"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Fits this moment
            </span>
            <h3 className="mt-2 text-base">{item.label}</h3>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{item.copy}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
