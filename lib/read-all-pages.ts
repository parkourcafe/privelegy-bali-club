// Bounded paginated reads for public catalogue queries.
//
// PostgREST returns at most 1000 rows per response. The published catalogue
// passed that mark on 2026-08-04 (1220 active/published rows), so a single
// unpaginated read silently dropped everything after the thousandth row in
// (district, name) order — the tail of the alphabet, which is Ubud and
// Uluwatu. 196 venues that pass the publication gate were missing from both
// the catalogue and the sitemap.
//
// The failure mode is what makes this worth a module of its own: a truncated
// response is indistinguishable from a complete one. No error, no warning,
// no short count — the page just renders fewer venues than exist, and stays
// wrong until someone counts by hand.
//
// So the ceiling here is loud. Hitting it logs, because a silent cap is
// exactly the bug being fixed and reintroducing it quietly would be worse
// than failing.

export const PUBLIC_READ_PAGE_SIZE = 500;
export const PUBLIC_READ_MAX_PAGES = 12; // 6000 rows — a guard, not a target

export interface PageResult<T> {
  data: T[] | null;
  error: unknown;
}

/**
 * Reads every row a query matches, one bounded page at a time.
 *
 * `page(from, to)` receives an inclusive row range. Reading stops as soon as a
 * page comes back shorter than the page size — the standard end-of-results
 * signal — or when the page ceiling is reached.
 *
 * Errors are thrown rather than swallowed: callers wrap this in the same
 * try/catch that makes a configured database fail closed, and a partial
 * catalogue must not be presented as the whole one.
 */
export async function readAllPages<T>(
  label: string,
  page: (from: number, to: number) => PromiseLike<PageResult<T>>,
  onCeiling: (message: string) => void = console.warn,
): Promise<T[]> {
  const rows: T[] = [];
  for (let i = 0; i < PUBLIC_READ_MAX_PAGES; i += 1) {
    const from = i * PUBLIC_READ_PAGE_SIZE;
    const { data, error } = await page(from, from + PUBLIC_READ_PAGE_SIZE - 1);
    if (error) throw error;
    const batch = data ?? [];
    rows.push(...batch);
    if (batch.length < PUBLIC_READ_PAGE_SIZE) return rows;
  }
  onCeiling(
    `[public-read:${label}] hit the ${
      PUBLIC_READ_MAX_PAGES * PUBLIC_READ_PAGE_SIZE
    }-row page ceiling; results are truncated and the ceiling needs raising.`,
  );
  return rows;
}
