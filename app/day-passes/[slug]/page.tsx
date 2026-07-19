import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OfferDetail from "@/components/resort/OfferDetail";
import { getOffer, publicOfferSlugs } from "@/lib/domain/resort-repo";

const OFFER_TYPE = "day_pass" as const;

// Only PUBLIC (whitelisted + gated) offers get a static page; anything else
// 404s (dynamicParams stays true but the handler rejects non-public slugs).
export function generateStaticParams() {
  return publicOfferSlugs(OFFER_TYPE).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer || !offer.isPublic || offer.offerType !== OFFER_TYPE) return { title: "Not found", robots: { index: false } };
  return {
    title: `${offer.name}${offer.property?.name ? ` — ${offer.property.name}` : ""}`,
    description: offer.whatsIncluded ?? `${offer.name} in ${offer.district}.`,
    alternates: { canonical: `/day-passes/${offer.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer || !offer.isPublic || offer.offerType !== OFFER_TYPE) notFound();
  return <OfferDetail offer={offer} />;
}
