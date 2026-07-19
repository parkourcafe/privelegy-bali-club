"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import OtherBaliLogo from "@/components/OtherBaliLogo";

// Persistent site header for every inner page. The cinematic homepage has its
// own overlay nav (LandingNav), so this returns null there to avoid a double
// header; everywhere else it gives a guaranteed way home and to the main
// sections — so a venue or guide page is never a dead end.
const LINKS: { href: string; label: string }[] = [
  { href: "/places", label: "Places" },
  { href: "/bali", label: "Districts" },
  { href: "/collections", label: "Collections" },
  { href: "/my-day", label: "My Day" },
];

export default function GlobalHeader() {
  const pathname = usePathname();
  // Homepage owns its own overlay header. A null fallback is also hidden: with
  // a statically rendered route plus Proxy, Next can defer the client pathname.
  if (!pathname || pathname === "/") return null;

  return (
    <header className="ob-site-header">
      <div className="ob-site-header-inner">
        <Link href="/" className="ob-site-brand" aria-label="Other Bali — home">
          <OtherBaliLogo size={20} />
        </Link>
        <nav className="ob-site-nav" aria-label="Main">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                data-active={active ? "true" : "false"}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
