// Locale registry (Multi-locale public UI rule v1, AGENTS.md, 2026-07-20
// founder amendment — supersedes guardrail #15). Single source of truth for
// which locales exist and how they're presented, so routing, the switcher and
// dictionaries can never drift apart.

export const DEFAULT_LOCALE = "en" as const;

// First-party cookie name shared by proxy.ts (reads/writes it) and the
// client-side LocaleSwitcher (writes it directly to skip a round trip).
export const LOCALE_COOKIE = "ob_locale";

// Internal request header proxy.ts stamps with the resolved locale so Server
// Components (via lib/i18n/server.ts's getLocale()) see the right locale even
// on the very first request, before any cookie exists.
export const LOCALE_HEADER = "x-ob-locale";

// Tourist-facing locales, in switcher display order. Selection rationale is
// recorded in AGENTS.md: en/zh/ko/fr map to real BPS 2025 top-10 arrivals;
// ru is an explicit founder override (personal network + Canggu resident
// population, not arrival volume). Español/Türkçe were considered and
// declined — see the amendment note for why.
export const PUBLIC_LOCALES = ["en", "zh", "ko", "fr", "ru"] as const;
export type PublicLocale = (typeof PUBLIC_LOCALES)[number];

// Partner/admin-only — never offered in the tourist-facing switcher, never
// used for locale auto-detection on public pages (unchanged from the existing
// EN+ID owner-outreach pattern).
export const PARTNER_LOCALES = ["id"] as const;
export type PartnerLocale = (typeof PARTNER_LOCALES)[number];

export type Locale = PublicLocale | PartnerLocale;

export interface LocaleMeta {
  code: Locale;
  nativeName: string;
  englishName: string;
  htmlLang: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { code: "en", nativeName: "English", englishName: "English", htmlLang: "en" },
  zh: { code: "zh", nativeName: "中文", englishName: "Chinese", htmlLang: "zh-CN" },
  ko: { code: "ko", nativeName: "한국어", englishName: "Korean", htmlLang: "ko" },
  fr: { code: "fr", nativeName: "Français", englishName: "French", htmlLang: "fr" },
  ru: { code: "ru", nativeName: "Русский", englishName: "Russian", htmlLang: "ru" },
  id: { code: "id", nativeName: "Bahasa Indonesia", englishName: "Indonesian", htmlLang: "id" },
};

export function isPublicLocale(v: string | null | undefined): v is PublicLocale {
  return !!v && (PUBLIC_LOCALES as readonly string[]).includes(v);
}

/** Client-only: persist the visitor's chosen locale for a year. Defined at
 * module scope (not inside a component) per the lib/consent.ts convention —
 * keeps cookie writes out of component closures. */
export function setLocaleCookie(next: PublicLocale): void {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

/** Parse an Accept-Language header and return the best-matching public
 * locale, or the default (en) if nothing matches. Never returns a partner
 * locale (id) — public auto-detection must not surface the partner-only
 * language on tourist pages. */
export function matchAcceptLanguage(header: string | null | undefined): PublicLocale {
  if (!header) return DEFAULT_LOCALE;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? parseFloat(q.trim().slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), quality: Number.isFinite(quality) ? quality : 1 };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    if (isPublicLocale(primary)) return primary;
    // zh-Hant/zh-TW/zh-HK etc. all resolve to our single zh dictionary.
    if (primary === "zh") return "zh";
  }
  return DEFAULT_LOCALE;
}
