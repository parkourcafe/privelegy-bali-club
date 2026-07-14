import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredMenu from "@/components/menu/StructuredMenu";
import { getPublishedMenu } from "@/lib/data/menu-repository";

export const dynamic = "force-dynamic";

type MenuPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: MenuPageProps): Promise<Metadata> {
  const { slug } = await params;
  const menu = await getPublishedMenu(slug);
  if (!menu) return { title: "Menu unavailable", robots: { index: false, follow: false } };
  const sourceSnapshot = menu.status === "source_snapshot";
  return {
    title: menu.title,
    description: sourceSnapshot
      ? `A partial official-source menu snapshot for ${menu.title}, with capture and recheck dates.`
      : `The verified full menu for ${menu.title}.`,
    robots: { index: !sourceSnapshot, follow: true },
    alternates: sourceSnapshot ? undefined : { canonical: `/menus/${menu.venueSlug}` },
  };
}

export default async function MenuPage({ params }: MenuPageProps) {
  const { slug } = await params;
  const menu = await getPublishedMenu(slug);
  if (!menu) notFound();

  return (
    <div className="page-dark">
      <main className="site-shell venue-page-pad">
        <Breadcrumbs items={[
          { name: "Home", href: "/" },
          { name: "Menus", href: "/menus" },
          { name: menu.title },
        ]} />

        <header className="mt-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--lagoon-strong)]">
            {menu.status === "source_snapshot" ? "Partial official-source menu" : "Verified full menu"}
          </p>
          <h1 className="hero-title mt-3">{menu.title}</h1>
          <p className="hero-copy">
            Source-labelled menu information with freshness dates. Partial snapshots show selected available items and never claim to be complete.
          </p>
        </header>

        <section className="guide-section mt-10" aria-labelledby="structured-menu-heading">
          <h2 id="structured-menu-heading">Menu details</h2>
          <div className="mt-4">
            <StructuredMenu menu={menu} venueSlug={menu.venueSlug} officialMenuUrl={menu.sourceUrl} />
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/menus" className="button-secondary">← All menus</Link>
          <a href={menu.sourceUrl} target="_blank" rel="noreferrer" className="quiet-link">Open official source ↗</a>
        </div>
      </main>
    </div>
  );
}
