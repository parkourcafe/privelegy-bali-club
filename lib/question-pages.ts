import type { Venue } from "@/lib/types";

// Question-page engine (P2-5). A reusable answer-page structure from the
// question bank (docs/other-bali-question-bank-synthesis-v1.md):
//   short answer → who for / not for → best time → how to not waste the day →
//   what to combine → suggested route → places nearby → FAQ.
//
// Content discipline (guardrails): "worth it / tourist trap" questions are
// answered as fit-context (who / when / how), never anti-lists, stars or
// "best-rated"; we link only to covered venues. Prose is NOT invented here —
// a page ships (published:true, indexable, in the sitemap) only once its
// editorial copy is final. Until then it stays published:false → noindex and
// unlinked, and empty prose slots render an explicit draft marker, never lorem.

export interface QuestionFaq {
  q: string;
  a: string;
}

// Which real, published venues to surface as "places nearby". Resolved from the
// live catalogue at render time so only covered venues ever appear.
export interface PlaceQuery {
  districts?: string[];
  categories?: Venue["category"][];
  limit?: number;
}

export interface QuestionPage {
  slug: string;
  // false → noindex + excluded from the sitemap until copy is final.
  published: boolean;
  cluster: string;
  breadcrumbParent?: { name: string; href: string };
  h1: string;
  // The question exactly as travellers phrase it (from the bank).
  question: string;
  metaTitle: string;
  metaDescription: string;
  // Editorial prose — omit until final; the view shows a draft marker instead.
  shortAnswer?: string;
  whoFor?: string[];
  notFor?: string[];
  bestTime?: string;
  withoutWastingTheDay?: string;
  whatToCombine?: string;
  suggestedRoute?: { href: string; label: string };
  places?: PlaceQuery;
  faq?: QuestionFaq[];
}

// Registry. First entries follow the bank's "First 15 pages" order, but only
// pages with no existing equivalent are added (e.g. /canggu-or-ubud is held
// back — /ubud-vs-canggu already owns that intent; see the PR note).
export const QUESTION_PAGES: QuestionPage[] = [
  {
    slug: "local-food-safely",
    published: false, // scaffold — awaiting final editorial copy
    cluster: "Local food",
    breadcrumbParent: { name: "Canggu", href: "/canggu" },
    h1: "Eating local in Bali without getting sick",
    question: "How do I avoid Bali belly — is warung and street food safe?",
    metaTitle: "Local food in Bali, safely — warungs without the Bali belly",
    metaDescription:
      "How to eat Bali's warungs and local food with confidence: what actually causes Bali belly, how to choose a busy, fresh kitchen, and where to start near Canggu.",
    // Prose intentionally omitted until final copy lands — view renders drafts.
    places: { districts: ["canggu"], categories: ["warung", "restaurant"], limit: 4 },
    faq: [
      { q: "Is warung and street food safe to eat in Bali?", a: "" },
      { q: "What actually causes Bali belly?", a: "" },
      { q: "Can I have ice, salads and tap water?", a: "" },
      { q: "Where should I start near Canggu?", a: "" },
    ],
  },
];

export function getQuestionPage(slug: string): QuestionPage | undefined {
  return QUESTION_PAGES.find((p) => p.slug === slug);
}

// Only finalised pages belong in the sitemap / internal-link surfaces.
export const PUBLISHED_QUESTION_PAGES = QUESTION_PAGES.filter((p) => p.published);
