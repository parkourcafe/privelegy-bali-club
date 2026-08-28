import type { PublicMenuSummary } from "../data/menu-summary-repository";

type MenuJsonLdOptions = {
  pageUrl: string;
  now?: Date;
};

function text(value: string | null | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function numericPrice(priceMinor: number, currency: string): number | null {
  try {
    const fractionDigits = new Intl.NumberFormat("en", {
      style: "currency",
      currency,
    }).resolvedOptions().maximumFractionDigits ?? 2;
    return priceMinor / 10 ** fractionDigits;
  } catch {
    return null;
  }
}

function offerForItem(item: PublicMenuSummary["sections"][number]["items"][number]) {
  const currency = text(item.currency)?.toUpperCase();
  if (item.priceMinor != null && Number.isFinite(item.priceMinor) && currency) {
    const price = numericPrice(item.priceMinor, currency);
    if (price != null) {
      return { "@type": "Offer", price, priceCurrency: currency };
    }
  }
  const priceText = text(item.priceText);
  return priceText ? { "@type": "Offer", price: priceText } : undefined;
}

/**
 * Schema.org Menu data built only from the same published, source-backed,
 * non-expired menu summary that the visitor can open on the page.
 */
export function buildPublishedMenuJsonLd(
  menu: PublicMenuSummary | null,
  { pageUrl, now = new Date() }: MenuJsonLdOptions,
): Record<string, unknown> | undefined {
  if (!menu || menu.status !== "published" || menu.completeness !== "full") return undefined;
  if (!menu.verifiedAt || !menu.sourceUrl) return undefined;
  if (!menu.expiresAt || Date.parse(menu.expiresAt) <= now.getTime()) return undefined;

  const hasMenuSection = menu.sections.flatMap((section) => {
    const hasMenuItem = section.items.flatMap((item) => {
      const name = text(item.name);
      if (!name) return [];
      const offers = offerForItem(item);
      return [{
        "@type": "MenuItem",
        name,
        ...(text(item.description) ? { description: text(item.description) } : {}),
        ...(offers ? { offers } : {}),
      }];
    });
    if (!hasMenuItem.length) return [];
    return [{
      "@type": "MenuSection",
      name: text(section.name) ?? "Menu",
      ...(text(section.description) ? { description: text(section.description) } : {}),
      hasMenuItem,
    }];
  });

  if (!hasMenuSection.length) return undefined;
  return {
    "@type": "Menu",
    "@id": `${pageUrl}#menu`,
    name: text(menu.title) ?? "Menu",
    url: `${pageUrl}#menu-heading`,
    dateModified: menu.verifiedAt,
    hasMenuSection,
  };
}
