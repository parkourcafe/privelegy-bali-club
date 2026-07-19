// Registry for the resort-F&B hub pages (resort day passes · hotel brunches ·
// sunset · free beach clubs). Static config — no DB entity (guardrail #11),
// same pattern as lib/guides.ts / lib/pillars.ts.
//
// Content is generated from the hand-curated, price-verified HTML library by
// scripts/resort-fnb/extract.py into data/resort-fnb/pages.generated.json, then
// re-rendered through the site's own design system by <ResortFnbHub>. The
// extractor already sanitises links (/places stubs unlinked, the 3 deferred
// sunset slugs repointed to existing routes) and keeps schema prices only where
// the source marked them [OFFICIAL]. Prices are shown "as of" a checked date and
// carry provenance badges; nothing here is presented as live/current beyond that.

import type { Metadata } from "next";
import pages from "@/data/resort-fnb/pages.generated.json";

export interface FnbCardKv {
  0: string; // dt
  1: string; // dd (may contain inline HTML)
}

export interface FnbCard {
  h3: string | null;
  meta: string | null;
  body: string | null;
  kv: [string, string][];
  book: { href: string; label: string } | null;
}

export interface FnbFaq {
  q_text: string;
  a_html: string;
  a_text: string;
}

export interface FnbRelated {
  href: string;
  label: string;
}

export interface FnbPage {
  slug: string; // source filename stem
  url: string; // route path with leading slash, e.g. "/canggu/beach-club-day-passes"
  layer: "COVERAGE" | "SEATED";
  metaTitle: string;
  title: string;
  description: string;
  breadcrumbLabel: string | null;
  h1: string;
  sub: string | null;
  answer: string | null;
  callout: string | null;
  checkedNote: string | null;
  tableHead: string[];
  tableRows: string[][];
  cards: FnbCard[];
  faq: FnbFaq[];
  related: FnbRelated[];
  jsonld: Record<string, unknown>[];
}

export const RESORT_FNB_PAGES = pages as unknown as FnbPage[];

/** Look up a hub page by its route path (with or without a leading slash). */
export function getFnbPage(pathOrSlug: string): FnbPage | undefined {
  const url = pathOrSlug.startsWith("/") ? pathOrSlug : `/${pathOrSlug}`;
  return RESORT_FNB_PAGES.find((p) => p.url === url);
}

export function fnbMetadata(page: FnbPage): Metadata {
  return {
    title: page.metaTitle || page.title,
    description: page.description,
    alternates: { canonical: page.url },
    openGraph: {
      title: `${page.title} · Other Bali`,
      description: page.description,
      url: `https://www.otherbali.com${page.url}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} · Other Bali`,
      description: page.description,
    },
  };
}
