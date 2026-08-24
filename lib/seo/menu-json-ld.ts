import type { PublicMenuSummary } from "@/lib/data/menu-summary-repository";

// schema.org Menu node for a venue's LocalBusiness JSON-LD (`hasMenu`).
//
// Source is the already-gated PublicMenuSummary (published/source_snapshot,
// fresh, evidenced) — never a raw menus row — so any future tightening of the
// publication gate flows into the markup automatically (schema skill rule #1).
// Every field is conditional: omit rather than approximate (rule #2).

type SchemaOffer = { "@type": "Offer"; price: string; priceCurrency: string };

// Numeric price for an Offer. Mirrors formatMenuPrice's denomination logic:
// price_minor is stored in the currency's minor units, and only currency
// metadata can establish how many minor units make one major unit. Unknown
// currency ⇒ no offer — a wrong denomination is a false public price.
function schemaOffer(priceMinor: number | null, currency: string | null): SchemaOffer | null {
  if (priceMinor == null || !Number.isFinite(priceMinor) || !currency?.trim()) return null;
  const code = currency.trim().toUpperCase();
  try {
    const formatter = new Intl.NumberFormat("en", { style: "currency", currency: code });
    const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
    return {
      "@type": "Offer",
      price: (priceMinor / 10 ** digits).toFixed(digits),
      priceCurrency: code,
    };
  } catch {
    return null;
  }
}

export function menuJsonLd(menu: PublicMenuSummary): Record<string, unknown> | null {
  const sections = menu.sections
    // A section whose items were withheld from the summary (deferred) still
    // names what the venue serves; a section with no items at all says
    // nothing and is dropped.
    .filter((section) => section.itemCount > 0 || section.items.length > 0)
    .map((section) => {
      const items = section.items
        .filter((item) => item.name.trim().length > 0)
        .map((item) => {
          const offer = schemaOffer(item.priceMinor, item.currency);
          return {
            "@type": "MenuItem",
            name: item.name,
            ...(item.description ? { description: item.description } : {}),
            ...(offer ? { offers: offer } : {}),
          };
        });
      return {
        "@type": "MenuSection",
        name: section.name,
        ...(section.description ? { description: section.description } : {}),
        ...(items.length ? { hasMenuItem: items } : {}),
      };
    });
  if (!sections.length) return null;
  return {
    "@type": "Menu",
    name: menu.title,
    hasMenuSection: sections,
  };
}
