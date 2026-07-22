import Link from "next/link";
import OtherBaliLogo from "@/components/OtherBaliLogo";
import { SUPPORT_WHATSAPP_URL, WHATSAPP_NUMBER_DISPLAY } from "@/lib/contact";

// Site-wide footer (2026-07-20 redesign, v2). One shared component, rendered
// in the light tone everywhere (founder decision, 2026-07-20) — the cream
// footer is the site standard on both the editorial/catalogue pages and the
// homepage. The dark tone is kept as an option (tone="dark") but is not
// currently used anywhere. A design or link change here reaches the whole
// site at once. Homepage anchor links use a leading "/" (e.g. "/#how") since
// this renders on every route, not only "/".

type Tone = "light" | "dark";

interface Palette {
  bg: string;
  logoColor: string;
  logoDot: string;
  heading: string;
  body: string;
  eyebrow: string;
  accentEyebrow: string;
  link: string;
  cardBg: string;
  cardBorder: string;
  ghostBorder: string;
  ghostText: string;
  clayBg: string;
  clayText: string;
  iconBg: string;
  iconColor: string;
  contactLabel: string;
  divider: string;
  barBorder: string;
  cardShadow: string;
}

// Palette per tone — kept in one place so the two variants can't drift.
// Light values track the design-system tokens (--paper, --lagoon #005962,
// --ink, --clay); dark values are the deep-teal footer canvas from the
// handoff. Clay is the shared CTA accent across both tones, per the mockup.
const PALETTE: Record<Tone, Palette> = {
  light: {
    bg: "#F3ECDF",
    logoColor: "#005962",
    logoDot: "#C4623F",
    heading: "#2B1A13",
    body: "#5c4a3c",
    eyebrow: "#5c4a3c",
    accentEyebrow: "#005962",
    link: "#2B1A13",
    cardBg: "#FFFFFF",
    cardBorder: "#EDE4D6",
    ghostBorder: "#DCD2C2",
    ghostText: "#005962",
    clayBg: "#E08A5E",
    clayText: "#2B1A13",
    iconBg: "rgba(0,89,98,0.1)",
    iconColor: "#005962",
    contactLabel: "#2B1A13",
    divider: "#DCD2C2",
    barBorder: "#E1D8C7",
    cardShadow: "0 12px 30px rgba(43,26,19,0.08)",
  },
  dark: {
    bg: "#00343B",
    logoColor: "#FAF6EF",
    logoDot: "#E8A97D",
    heading: "#FAF6EF",
    body: "rgba(250,246,239,0.65)",
    eyebrow: "rgba(250,246,239,0.5)",
    accentEyebrow: "#E8A97D",
    link: "rgba(250,246,239,0.85)",
    cardBg: "rgba(250,246,239,0.03)",
    cardBorder: "rgba(250,246,239,0.18)",
    ghostBorder: "rgba(250,246,239,0.3)",
    ghostText: "#FAF6EF",
    clayBg: "#E8A97D",
    clayText: "#00343B",
    iconBg: "rgba(232,169,125,0.14)",
    iconColor: "#E8A97D",
    contactLabel: "#FAF6EF",
    divider: "rgba(250,246,239,0.14)",
    barBorder: "rgba(250,246,239,0.14)",
    cardShadow: "none",
  },
};

const EYEBROW = "text-[11px] font-bold uppercase tracking-[0.14em]";

const EXPLORE_LINKS = [
  { href: "/my-day", label: "Build my day" },
  { href: "/places", label: "Explore Bali" },
  { href: "/bali", label: "Bali by district" },
  { href: "/guides", label: "Guides & collections" },
];
const ABOUT_LINKS = [
  { href: "/support", label: "Support" },
  { href: "/for-venues", label: "For businesses" },
];
const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

function ChatIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function LinkColumn({
  c,
  eyebrow,
  links,
}: {
  c: Palette;
  eyebrow: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className={EYEBROW} style={{ color: c.eyebrow }}>
        {eyebrow}
      </p>
      <ul className="mt-3 space-y-2.5">
        {links.map((l, i) => (
          <li key={`${l.href}-${i}`}>
            <Link
              href={l.href}
              className="text-sm transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ color: c.link }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactRow({
  c,
  icon,
  href,
  label,
  note,
}: {
  c: Palette;
  icon: React.ReactNode;
  href: string;
  label: string;
  note: string;
}) {
  return (
    <a href={href} className="flex items-start gap-3 py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
      <span
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: c.iconBg, color: c.iconColor }}
      >
        {icon}
      </span>
      <span>
        <span className="block text-sm font-semibold" style={{ color: c.contactLabel }}>
          {label}
        </span>
        <span className="block text-xs" style={{ color: c.body }}>
          {note}
        </span>
      </span>
    </a>
  );
}

export default function SiteFooter({ tone = "light" }: { tone?: Tone }) {
  const c = PALETTE[tone];
  const year = new Date().getFullYear();

  return (
    <footer className="px-5 py-14 sm:py-16" style={{ background: c.bg }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <Link href="/" aria-label="Other Bali — home" className="inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005962]">
              <OtherBaliLogo size={22} color={c.logoColor} dot={c.logoDot} />
            </Link>
            <p
              className="mt-4 font-display text-xl font-semibold leading-snug sm:text-2xl"
              style={{ color: c.heading }}
            >
              The right place for the moment you&apos;re in.
            </p>
            <p className="mt-3 text-sm" style={{ color: c.body }}>
              Bali discovery for moments, areas and trip plans.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t pt-10" style={{ borderColor: c.divider }}>
          <div className="grid gap-8 min-[430px]:grid-cols-2 min-[900px]:grid-cols-4">
            <LinkColumn c={c} eyebrow="Explore" links={EXPLORE_LINKS} />
            <LinkColumn c={c} eyebrow="About" links={ABOUT_LINKS} />
            <LinkColumn c={c} eyebrow="Legal" links={LEGAL_LINKS} />
            <div>
              <p className={EYEBROW} style={{ color: c.eyebrow }}>
                Talk to us
              </p>
              <div className="mt-2">
                <ContactRow
                  c={c}
                  icon={<ChatIcon />}
                  href={SUPPORT_WHATSAPP_URL}
                  label={WHATSAPP_NUMBER_DISPLAY}
                  note="WhatsApp — fastest reply"
                />
                <ContactRow
                  c={c}
                  icon={<MailIcon />}
                  href="mailto:hello@otherbali.com"
                  label="hello@otherbali.com"
                  note="Partnerships & press"
                />
                <ContactRow
                  c={c}
                  icon={<InstagramIcon />}
                  href="https://www.instagram.com/otherbali/"
                  label="@otherbali"
                  note="Instagram"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: c.barBorder, color: c.body }}
        >
          <p className="max-w-xl">Free to use.</p>
          <p className="shrink-0">© {year} Other Bali · otherbali.com</p>
        </div>
      </div>
    </footer>
  );
}
