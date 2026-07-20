import Link from "next/link";
import { getCoverageReport, type CoverageCell } from "@/lib/admin-coverage";

export const dynamic = "force-dynamic";

// Operator data-coverage matrix: venues per district × category (published vs.
// in review), so it's obvious where the catalogue is thin. Admin-only (root
// /admin layout gates on ADMIN_ACCESS_TOKEN). Aggregate counts only.

const CATEGORY_LABEL: Record<string, string> = {
  restaurant: "Rest.",
  cafe: "Café",
  warung: "Warung",
  bar: "Bar",
  beach_club: "Beach",
  spa: "Spa",
  beauty: "Beauty",
  fitness: "Gym",
  yoga: "Yoga",
  surf: "Surf",
  hotel: "Hotel",
  resort: "Resort",
  attraction: "Sight",
  activity: "Activity",
};

function cellClass(cell: CoverageCell): string {
  if (cell.total === 0) return "bg-rose-50 text-rose-300";
  if (cell.total >= 3) return "bg-emerald-50 text-emerald-900";
  return "bg-amber-50 text-amber-900";
}

function Cell({ cell }: { cell: CoverageCell }) {
  if (cell.total === 0) {
    return <td className={`border border-stone-200 px-2 py-1 text-center text-xs ${cellClass(cell)}`}>—</td>;
  }
  return (
    <td className={`border border-stone-200 px-2 py-1 text-center text-xs font-semibold ${cellClass(cell)}`}>
      {cell.total}
      {cell.review > 0 && (
        <span title={`${cell.review} in review (not yet public)`} className="ml-0.5 font-normal text-amber-600">
          +{cell.review}
        </span>
      )}
    </td>
  );
}

function Tile({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3">
      <p className="text-2xl font-bold text-stone-900">{value}</p>
      <p className="text-xs font-medium text-stone-500">{label}</p>
      {hint ? <p className="mt-0.5 text-[11px] text-stone-400">{hint}</p> : null}
    </div>
  );
}

export default async function CoveragePage() {
  const report = await getCoverageReport();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <Link href="/admin" className="text-xs font-medium text-stone-500 hover:text-stone-800">
        ← Field Kit
      </Link>
      <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-cyan-700">
        Field Kit · coverage
      </p>
      <h1 className="mt-1 text-2xl font-bold">Data coverage by district & category</h1>
      <p className="mt-1 text-sm text-stone-500">
        Every active venue we hold, counted per district and category. The big
        number is total; <span className="text-amber-600">+N</span> is how many
        of those are still in review (not yet public). Red cells are gaps —
        that category has nothing in that district.
      </p>

      {!report ? (
        <p className="mt-6 rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-600">
          Coverage data is unavailable (the service database isn&apos;t configured in
          this environment). This report runs on production.
        </p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Tile label="Venues (active)" value={report.grand.total} />
            <Tile label="Published" value={report.grand.published} hint={`${report.grand.review} in review`} />
            <Tile label="Districts with venues" value={report.rows.length} hint={`${report.emptyDistricts.length} still empty`} />
            <Tile label="Gap cells" value={report.gapCells} hint="district × category with 0" />
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-stone-100">
                  <th className="sticky left-0 z-10 border border-stone-200 bg-stone-100 px-3 py-2 text-left font-semibold">
                    District
                  </th>
                  {report.categories.map((c) => (
                    <th key={c} className="border border-stone-200 px-2 py-2 text-center text-xs font-semibold text-stone-600">
                      {CATEGORY_LABEL[c] ?? c}
                    </th>
                  ))}
                  <th className="border border-stone-200 px-2 py-2 text-center text-xs font-bold">Total</th>
                  <th className="border border-stone-200 px-2 py-2 text-center text-xs font-medium text-stone-500">Cats</th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map((row) => (
                  <tr key={row.slug}>
                    <th className="sticky left-0 z-10 border border-stone-200 bg-white px-3 py-1 text-left font-medium">
                      {row.name}
                    </th>
                    {report.categories.map((c) => (
                      <Cell key={c} cell={row.cells[c]} />
                    ))}
                    <td className="border border-stone-200 px-2 py-1 text-center text-xs font-bold">
                      {row.total.total}
                      {row.total.review > 0 && (
                        <span className="ml-0.5 font-normal text-amber-600">+{row.total.review}</span>
                      )}
                    </td>
                    <td className="border border-stone-200 px-2 py-1 text-center text-xs text-stone-500">
                      {row.categoriesCovered}/{report.categories.length}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-stone-100 font-semibold">
                  <th className="sticky left-0 z-10 border border-stone-200 bg-stone-100 px-3 py-2 text-left">
                    Total
                  </th>
                  {report.categories.map((c) => (
                    <td key={c} className="border border-stone-200 px-2 py-2 text-center text-xs">
                      {report.categoryTotals[c].total}
                    </td>
                  ))}
                  <td className="border border-stone-200 px-2 py-2 text-center text-xs">{report.grand.total}</td>
                  <td className="border border-stone-200 px-2 py-2" />
                </tr>
              </tfoot>
            </table>
          </div>

          {report.emptyDistricts.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-stone-700">
                Catalogued districts with no venues yet ({report.emptyDistricts.length})
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                {report.emptyDistricts.map((d) => d.name).join(" · ")}
              </p>
            </div>
          )}

          {report.unknownDistricts.length > 0 && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <h2 className="text-sm font-semibold text-amber-800">
                Venues in unregistered districts ({report.unknownDistricts.length})
              </h2>
              <p className="mt-1 text-sm text-amber-700">
                These venue.district values aren&apos;t in the districts registry —
                likely a data-entry typo or a district that needs adding:{" "}
                {report.unknownDistricts.join(" · ")}
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
