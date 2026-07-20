import { VENUE_CATEGORIES } from "./venue-validation";
import { DISTRICT_GUIDE } from "./districts";

// Pure data model + aggregation for the operator coverage report. Kept free of
// `server-only`, the DB client and auth (all in admin-coverage.ts) so the
// counting logic is unit-testable in plain node.

export interface CoverageCell {
  published: number;
  review: number;
  total: number;
}

export interface CoverageRow {
  slug: string;
  name: string;
  cells: Record<string, CoverageCell>; // by category slug
  total: CoverageCell;
  categoriesCovered: number; // distinct categories with >= 1 venue
}

export interface CoverageReport {
  categories: string[]; // category slugs, column order
  rows: CoverageRow[]; // one per district that has >= 1 venue
  emptyDistricts: { slug: string; name: string }[]; // catalogued districts with 0 venues
  categoryTotals: Record<string, CoverageCell>;
  grand: CoverageCell;
  gapCells: number; // (district × category) pairs with 0 venues, among populated districts
  unknownDistricts: string[]; // venue.district values not in the districts registry
}

function emptyCell(): CoverageCell {
  return { published: 0, review: 0, total: 0 };
}

function add(cell: CoverageCell, isPublished: boolean) {
  cell.total += 1;
  if (isPublished) cell.published += 1;
  else cell.review += 1;
}

// Aggregate raw venue rows (snake_case, as returned by the service query) into
// a district × category coverage matrix. Only `status = 'active'` rows count
// as coverage; publication_status splits published vs. in-review.
export function buildCoverageReport(data: Record<string, unknown>[]): CoverageReport {
  const categories = [...VENUE_CATEGORIES] as string[];
  const knownDistrictSlugs = new Set(DISTRICT_GUIDE.map((d) => d.slug));
  const districtName = new Map(DISTRICT_GUIDE.map((d) => [d.slug, d.name] as const));

  const byDistrict = new Map<string, Map<string, CoverageCell>>();
  const unknown = new Set<string>();

  for (const raw of data) {
    if (String(raw.status ?? "") !== "active") continue;
    const district = String(raw.district ?? "").trim();
    const category = String(raw.category ?? "").trim();
    if (!district || !category) continue;
    if (!knownDistrictSlugs.has(district)) unknown.add(district);
    const isPublished = String(raw.publication_status ?? "") === "published";

    let cats = byDistrict.get(district);
    if (!cats) {
      cats = new Map();
      byDistrict.set(district, cats);
    }
    let cell = cats.get(category);
    if (!cell) {
      cell = emptyCell();
      cats.set(category, cell);
    }
    add(cell, isPublished);
  }

  const categoryTotals: Record<string, CoverageCell> = {};
  for (const c of categories) categoryTotals[c] = emptyCell();
  const grand = emptyCell();

  const rowOrder = [
    ...DISTRICT_GUIDE.map((d) => d.slug),
    ...[...byDistrict.keys()].filter((s) => !knownDistrictSlugs.has(s)).sort(),
  ];

  const rows: CoverageRow[] = [];
  let gapCells = 0;

  for (const slug of rowOrder) {
    const cats = byDistrict.get(slug);
    if (!cats) continue;
    const cells: Record<string, CoverageCell> = {};
    const rowTotal = emptyCell();
    let covered = 0;
    for (const category of categories) {
      const cell = cats.get(category) ?? emptyCell();
      cells[category] = cell;
      if (cell.total > 0) covered += 1;
      else gapCells += 1;
      rowTotal.published += cell.published;
      rowTotal.review += cell.review;
      rowTotal.total += cell.total;
      categoryTotals[category].published += cell.published;
      categoryTotals[category].review += cell.review;
      categoryTotals[category].total += cell.total;
    }
    // Fold any categories not in the canonical list (defensive) into row/grand
    // totals so counts never silently drop, even if a stray category slug exists.
    for (const [cat, cell] of cats) {
      if (categories.includes(cat)) continue;
      rowTotal.published += cell.published;
      rowTotal.review += cell.review;
      rowTotal.total += cell.total;
    }
    grand.published += rowTotal.published;
    grand.review += rowTotal.review;
    grand.total += rowTotal.total;
    rows.push({
      slug,
      name: districtName.get(slug) ?? slug,
      cells,
      total: rowTotal,
      categoriesCovered: covered,
    });
  }

  const emptyDistricts = DISTRICT_GUIDE.filter((d) => !byDistrict.has(d.slug)).map((d) => ({
    slug: d.slug,
    name: d.name,
  }));

  return {
    categories,
    rows,
    emptyDistricts,
    categoryTotals,
    grand,
    gapCells,
    unknownDistricts: [...unknown].sort(),
  };
}
