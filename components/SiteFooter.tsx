import Link from "next/link";
import OtherBaliLogo from "@/components/OtherBaliLogo";
import { SUPPORT_WHATSAPP_URL, WHATSAPP_NUMBER_DISPLAY } from "@/lib/contact";

// Site-wide dark footer (2026-07-20 redesign). Single shared component —
// every page footer on the site renders this (via GuideFooter's re-export
// in components/GuideBlocks.tsx and the direct <SiteFooter /> uses below),
// so a design or link change here reaches the whole site at once. Anchor
// links into the homepage sections use a leading "/" (e.g. "/#how") rather
// than a bare "#how", since this footer renders on every route, not just "/".
const EXPLORE_LINKS = [
  { href: "/my-day", label: "Build my day" },
  { href: "/places", label: "Explore Bali" },
  { href: "/bali", label: "Bali by district" },
  { href: "/guides", label: "Guides & collections" },
];

const ABOUT_LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#trust", label: "Why it's free" },
  { href: "/#faq", label: "FAQ" },
  { href: "/support", label: "Support" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function ContactRow({
  icon,
  href,
  label,
  note,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
  note: string;
}) {
  return (
    <a href={href} className="group flex items-start gap-3 py-1.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(230,138,94,0.14)] text-[#E8A97D] transition-colors group-hover:bg-[rgba(230,138,94,0.24)]">
        {icon}
      </span>
      <span>
        <span className="block text-sm font-semibold text-[#FAF6EF]">{label}</span>
        <span className="block text-xs text-[rgba(250,246,239,0.6)]">{note}</span>
      </span>
    </a>
  );
}

function FooterLinkList({
  eyebrow,
  links,
}: {
  eyebrow: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[rgba(250,246,239,0.5)]">
        {eyebrow}
      </p>
      <ul className="mt-3 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-[rgba(250,246,239,0.85)] transition-colors hover:text-[#FAF6EF]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#00343B] px-5 py-14 text-[#FAF6EF] sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <Link href="/" aria-label="Other Bali — home" className="inline-flex">
              <OtherBaliLogo size={22} color="#FAF6EF" dot="#E8A97D" />
            </Link>
            <p className="mt-4 font-display text-xl font-semibold leading-snug sm:text-2xl">
              The right place for the moment you&apos;re in.
            </p>
            <p className="mt-3 text-sm text-[rgba(250,246,239,0.65)]">
              Resident-curated Bali discovery. Free to use — travellers never pay.
            </p>
          </div>

          <div className="w-full max-w-sm rounded-2xl border border-[rgba(250,246,239,0.18)] bg-[rgba(250,246,239,0.03)] p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#E8A97D]">
              Partner with us — free
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/villas"
                className="rounded-full border border-[rgba(250,246,239,0.3)] px-4 py-2 text-sm font-semibold text-[#FAF6EF] transition-colors hover:border-[rgba(250,246,239,0.55)]"
              >
                For villas
              </Link>
              <Link
                href="/hotels"
                className="rounded-full border border-[rgba(250,246,239,0.3)] px-4 py-2 text-sm font-semibold text-[#FAF6EF] transition-colors hover:border-[rgba(250,246,239,0.55)]"
              >
                For hotels
              </Link>
            </div>
            <Link
              href="/list-your-property"
              className="mt-3 flex items-center justify-center rounded-full bg-[#E8A97D] px-5 py-3 text-sm font-bold text-[#00343B] transition-colors hover:bg-[#F0BC98]"
            >
              List your place →
            </Link>
            <p className="mt-3 text-xs text-[rgba(250,246,239,0.6)]">
              Restaurants, cafés &amp; spas —{" "}
              <Link href="/for-venues" className="underline underline-offset-2 hover:text-[#FAF6EF]">
                for venues
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-[rgba(250,246,239,0.14)] pt-10">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <FooterLinkList eyebrow="Explore" links={EXPLORE_LINKS} />
            <FooterLinkList eyebrow="About" links={ABOUT_LINKS} />
            <FooterLinkList eyebrow="Legal" links={LEGAL_LINKS} />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[rgba(250,246,239,0.5)]">
                Talk to us
              </p>
              <div className="mt-2">
                <ContactRow
                  icon={<ChatIcon />}
                  href={SUPPORT_WHATSAPP_URL}
                  label={WHATSAPP_NUMBER_DISPLAY}
                  note="WhatsApp — fastest reply"
                />
                <ContactRow
                  icon={<MailIcon />}
                  href="mailto:hello@otherbali.com"
                  label="hello@otherbali.com"
                  note="Partnerships & press"
                />
                <ContactRow
                  icon={<InstagramIcon />}
                  href="https://www.instagram.com/otherbali/"
                  label="@otherbali"
                  note="Instagram"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[rgba(250,246,239,0.14)] pt-6 text-xs text-[rgba(250,246,239,0.55)] sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl">
            Free to use. We earn from venues only when a reservation made through
            us becomes a real seated visit — never from you.
          </p>
          <p className="shrink-0">© {year} Other Bali · otherbali.com</p>
        </div>
      </div>
    </footer>
  );
}
