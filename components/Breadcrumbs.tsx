import Link from "next/link";

// Visible breadcrumb trail + BreadcrumbList JSON-LD (brief §10/§15).
// Server component — safe to use in any page. The last item is the current
// page and is not a link.

const BASE = "https://otherbali.com";

export interface Crumb {
  name: string;
  href?: string; // absent on the current page
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.href ? { item: `${BASE}${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol>
        {items.map((item, i) => (
          <li key={`${item.name}-${i}`}>
            {item.href ? (
              <Link href={item.href}>{item.name}</Link>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
