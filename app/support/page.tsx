import Link from "next/link";
import { SUPPORT_WHATSAPP_URL, WHATSAPP_NUMBER_DISPLAY } from "@/lib/contact";

export const metadata = {
  title: "Support",
  description:
    "Need help with Other Bali? How to reach us, what we can and can't do (partners own bookings and fulfilment), and how to remove your data.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <div className="page-dark">
      <main className="mx-auto w-full max-w-3xl px-5 py-12">
        <Link href="/" className="quiet-link">
          ← Home
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-[var(--lagoon)]">
          Support
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Support</h1>
        <p className="mt-4 text-[var(--muted)]">
          Need help with a place, route, offer, reservation handoff, or privacy
          question? Contact the Other Bali team.
        </p>

        <div className="mt-10 rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-6 text-[var(--ink)]">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--muted)]">
            WhatsApp — fastest
          </p>
          <a
            href={SUPPORT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex min-h-11 items-center text-lg font-semibold text-[var(--lagoon-strong)]"
          >
            Chat on WhatsApp · {WHATSAPP_NUMBER_DISPLAY}
          </a>
          <p className="mt-4 text-sm text-[var(--muted)]">
            The quickest way to reach the team — opens a chat with a short
            message started for you.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-6 text-[var(--ink)]">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--muted)]">
            Email
          </p>
          <a
            href="mailto:support@otherbali.com"
            className="mt-2 inline-flex min-h-11 items-center text-lg font-semibold text-[var(--lagoon-strong)]"
          >
            support@otherbali.com
          </a>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Include the venue name, district, and what you were trying to do.
            We do not ask travellers for payment card details or account
            passwords.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/privacy" className="quiet-link">
            Privacy
          </Link>
          <Link href="/terms" className="quiet-link">
            Terms
          </Link>
        </div>
      </main>
    </div>
  );
}
