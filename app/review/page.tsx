import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Private restaurateur preview · Other Bali",
  robots: { index: false, follow: false, nocache: true },
};

type ReviewLoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ReviewLoginPage({ searchParams }: ReviewLoginPageProps) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#160f0b] px-5 py-12 text-[#f6ead8]">
      <section className="w-full max-w-md rounded-[2rem] border border-[rgba(198,154,92,0.45)] bg-[rgba(35,24,17,0.96)] p-7 shadow-2xl sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7ae70]">Other Bali</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight">
          Private restaurateur preview
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#dfd0bc]">
          Enter the shared review password to see the current site with the prepared venue photos.
          This protected review window stays open for 80 hours.
        </p>

        <form action="/api/review-access" method="post" className="mt-8 space-y-4">
          <label className="block text-sm font-semibold" htmlFor="review-password">
            Review password
          </label>
          <input
            id="review-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            className="min-h-12 w-full rounded-xl border border-[rgba(246,234,216,0.28)] bg-[#100b08] px-4 text-base text-white outline-none transition focus:border-[#d7ae70] focus:ring-2 focus:ring-[rgba(215,174,112,0.25)]"
          />
          <input
            aria-hidden="true"
            autoComplete="off"
            className="absolute -left-[10000px] h-px w-px overflow-hidden"
            name="website"
            tabIndex={-1}
          />
          {hasError ? (
            <p role="alert" className="rounded-xl bg-[rgba(138,50,36,0.28)] px-4 py-3 text-sm text-[#ffd6cc]">
              Password not accepted. Please try again.
            </p>
          ) : null}
          <button
            type="submit"
            className="min-h-12 w-full rounded-xl bg-[#d7ae70] px-5 font-semibold text-[#160f0b] transition hover:bg-[#e7c28b] focus:outline-none focus:ring-2 focus:ring-white"
          >
            Open preview
          </button>
        </form>
      </section>
    </main>
  );
}
