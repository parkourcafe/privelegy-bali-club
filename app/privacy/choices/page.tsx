import Link from "next/link";
import PrivacyChoices from "@/components/privacy/PrivacyChoices";

export const metadata = { title: "Privacy choices", robots: { index: false, follow: true } };

export default function PrivacyChoicesPage() {
  return (
    <div className="page-dark">
      <main className="mx-auto min-h-screen w-full max-w-3xl px-5 py-12">
        <Link href="/privacy" className="quiet-link">← Privacy policy</Link>
        <h1 className="mt-8 font-display text-4xl font-semibold">Privacy choices</h1>
        <p className="mt-3 text-[var(--ob-sand-dim)]">Control optional analytics and the Other Bali data linked to this browser.</p>
        <PrivacyChoices />
      </main>
    </div>
  );
}
