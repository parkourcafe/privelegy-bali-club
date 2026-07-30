import Link from "next/link";
import PrivacyChoices from "./PrivacyChoices";

export const metadata = {
  title: "Privacy choices",
  alternates: { canonical: "/privacy/choices" },
};

export default function PrivacyChoicesPage() {
  return (
    <div className="page-dark">
      <main className="mx-auto w-full max-w-3xl px-5 py-12">
        <Link href="/privacy" className="quiet-link">
          ← Privacy
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-[var(--lagoon)]">
          Privacy
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Privacy choices</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Change what Other Bali records for this browser. No login required.
          Mobile app cloud data can be deleted in the app; support is available
          below if the app is no longer accessible and you copied its Anonymous
          Guest Reference before uninstalling.
        </p>

        <PrivacyChoices />

        <div className="mt-10 flex flex-wrap gap-4 text-sm">
          <Link href="/terms" className="quiet-link">
            Terms
          </Link>
          <Link href="/support" className="quiet-link">
            Support
          </Link>
        </div>
      </main>
    </div>
  );
}
