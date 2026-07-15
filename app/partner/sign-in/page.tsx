import Link from "next/link";
import { requestPartnerMagicLink } from "./actions";

export const dynamic = "force-dynamic";

export default async function PartnerSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const sent = params.sent === "1";
  const error = params.error;

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">Other Bali · partner workspace</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">Sign in to your venue</h1>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        Use the email connected to your restaurant. We&apos;ll send a one-time secure link;
        no permanent bearer link is used as your login.
      </p>

      {sent ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          Check your inbox for the secure sign-in link. You can close this page after opening it.
        </div>
      ) : (
        <form action={requestPartnerMagicLink} className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <input type="hidden" name="next" value={params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : "/partner"} />
          <label className="block text-sm font-medium text-stone-700">
            Venue email
            <input name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-3" placeholder="you@restaurant.com" />
          </label>
          <button className="mt-4 min-h-11 w-full rounded-xl bg-cyan-700 px-4 py-3 font-semibold text-white">Email me a sign-in link</button>
          {error && <p className="mt-3 text-sm text-rose-700">We couldn&apos;t send that link. Check the address or contact Other Bali.</p>}
        </form>
      )}

      <Link href="/" className="mt-6 inline-block text-sm font-medium text-cyan-800 underline">Back to Other Bali</Link>
    </main>
  );
}
