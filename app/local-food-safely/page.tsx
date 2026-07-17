import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QuestionPageView from "@/components/QuestionPageView";
import { getQuestionPage } from "@/lib/question-pages";

// Sample question page (P2-5). Built on the reusable question-page template.
// It is published:false in the registry, so it renders as a noindex draft and
// is absent from the sitemap and internal links until its editorial copy is
// final. Flip `published: true` in lib/question-pages.ts (and add the copy) to
// ship it.

const SLUG = "local-food-safely";
const page = getQuestionPage(SLUG);

export const revalidate = 300;

export function generateMetadata(): Metadata {
  if (!page) return { title: "Not found", robots: { index: false, follow: false } };
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/${page.slug}` },
    // Draft pages stay out of the index until the copy is final.
    robots: page.published ? undefined : { index: false, follow: false },
    openGraph: {
      title: `${page.h1} · Other Bali`,
      description: page.metaDescription,
      url: `https://www.otherbali.com/${page.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.h1} · Other Bali`,
      description: page.metaDescription,
    },
  };
}

export default function LocalFoodSafelyPage() {
  if (!page) notFound();
  return <QuestionPageView page={page} />;
}
