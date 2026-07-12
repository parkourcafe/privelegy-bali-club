import { getOnboardInfo } from "@/lib/data";
import VenueCard from "@/components/VenueCard";
import OnboardActions from "./OnboardActions";

export const dynamic = "force-dynamic";

// Partner self-onboarding page, reached via a tokenized WhatsApp link. The
// venue sees exactly how its card will look, confirms listing under our
// policy, and uploads its own photos (settling photo rights).
export default async function OnboardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const info = await getOnboardInfo(token);

  if (!info || !info.venue) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Link not valid</h1>
        <p className="mt-2 text-sm text-stone-500">
          This invitation link doesn&apos;t work. Please ask your Other Bali contact
          for a new one.
        </p>
      </main>
    );
  }

  const v = info.venue;

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
        Other Bali · partner invitation
      </p>
      <h1 className="mt-1 text-2xl font-bold">Hello, {v.name}!</h1>
      <p className="mt-2 text-sm text-stone-600">
        We&apos;re building a curated Bali guide for travellers, starting with
        Canggu. Below is how your place will appear. Review it, upload your
        photos, and confirm.
      </p>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
          Your card preview
        </p>
        <VenueCard v={v} showActions={false} showSimilar={false} />
      </div>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
          Listing policy — what you agree to
        </p>
        <ul className="mt-2 space-y-2 text-sm text-stone-700">
          <li>• No setup fee during the pilot.</li>
          {v.perk && (
            <li>
              • {info.confirmed ? "You have approved" : "By confirming, you approve"} the listed
              guest offer (<b>{v.perk.title}</b>) for guests who show the redeem screen.
            </li>
          )}
          {!v.perk && (
            <li>• No guest offer is attached yet; we will confirm any offer with you before publishing one.</li>
          )}
          {v.perk && info.offerNeedsApproval && !info.confirmed && (
            <li>• This offer is pending your approval and is not shown here as a tourist redeem action.</li>
          )}
          <li>• We share aggregate visit numbers with you — never guests&apos; personal data.</li>
          <li>• Photos you upload are yours; you allow us to show them on the guide.</li>
          <li>• You can change the offer or pause the listing anytime via WhatsApp.</li>
        </ul>
      </div>

      <OnboardActions
        token={token}
        alreadyConfirmed={info.confirmed}
        initialJtbd={{
          bestFor: v.bestFor ?? "",
          notFor: v.notFor ?? "",
          jobs: v.jobs ?? [],
          practicalTags: v.practicalTags ?? [],
          ownerNote: v.ownerNote ?? "",
        }}
      />
    </main>
  );
}
