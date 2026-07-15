import Link from "next/link";
import { redirect } from "next/navigation";
import { claimPartnerVenue } from "./actions";
import { getAuthenticatedUser } from "@/lib/supabase/auth-server";

export const dynamic = "force-dynamic";

export default async function PartnerClaimPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const query = await searchParams;
  const user = await getAuthenticatedUser();
  if (!user) redirect(`/partner/sign-in?next=${encodeURIComponent(`/partner/claim/${token}`)}`);

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">Other Bali · one-time claim</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">Connect your venue</h1>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        This invitation will connect the venue to {user.email ?? "your authenticated account"}.
        After claiming, use the partner workspace instead of this private link.
      </p>
      <form action={claimPartnerVenue} className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <input type="hidden" name="token" value={token} />
        <button className="min-h-11 w-full rounded-xl bg-cyan-700 px-4 py-3 font-semibold text-white">Claim this venue</button>
        {query.error && <p className="mt-3 text-sm text-rose-700">This claim could not be completed. The link may be invalid, already claimed, or waiting for the reviewed database migration.</p>}
      </form>
      <Link href="/partner" className="mt-6 inline-block text-sm font-medium text-cyan-800 underline">Go to partner workspace</Link>
    </main>
  );
}
