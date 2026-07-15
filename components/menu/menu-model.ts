import type { MenuRecord } from "@/lib/contracts/menu-action";

export type MenuFreshness = "fresh" | "stale" | "unpublished" | "empty";

export function getMenuFreshness(menu: MenuRecord, now = new Date()): MenuFreshness {
  if (menu.status !== "published") return "unpublished";
  if (menu.expiresAt && new Date(menu.expiresAt).getTime() <= now.getTime()) return "stale";
  if (
    !menu.sections.some((section) => {
      const itemCount = (section as typeof section & { itemCount?: number }).itemCount;
      return (itemCount ?? section.items.length) > 0;
    })
  ) return "empty";
  return "fresh";
}

export function formatMenuPrice(
  priceMinor: number | null,
  currency: string | null,
  priceText: string | null = null
): string | null {
  const sourcePrice = priceText?.trim();
  if (sourcePrice) return sourcePrice;
  if (priceMinor == null || !currency) return null;
  try {
    const formatter = new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: currency.toUpperCase() === "IDR" ? 0 : undefined,
    });
    const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
    return formatter.format(priceMinor / 10 ** fractionDigits);
  } catch {
    return `${currency.toUpperCase()} ${priceMinor.toLocaleString("en")}`;
  }
}

export function formatMenuDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date);
}
