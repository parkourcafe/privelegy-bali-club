import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), "utf8");
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

function functionBody(sql, name) {
  return sql.match(new RegExp(
    `create or replace function public\\.${name}\\b[\\s\\S]*?\\n\\$\\$;`,
    "i",
  ))?.[0] ?? "";
}

// Mirrors the fail-closed URL shape enforced by is_publishable_evidence_url.
function isPublishableEvidenceUrl(value) {
  if (typeof value !== "string" || !/^https:\/\/\S+$/.test(value)) return false;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === "https:"
      && !url.username
      && !url.password
      && (!url.port || url.port === "443")
      && /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/.test(host)
      && host.includes(".")
      && !host.includes("..")
      && !/^[0-9.]+$/.test(host)
      && host !== "example.com"
      && !host.endsWith(".example.com")
      && !host.endsWith(".invalid")
      && !host.endsWith(".test");
  } catch {
    return false;
  }
}

const [menuPackage, coverageReport, sourcePackage] = await Promise.all([
  readJson("data/data-ops/compiled/menus.json"),
  readJson("data/data-ops/compiled/coverage-report.json"),
  readJson("data/data-ops/compiled/sources.json"),
]);

test("the exact imported menu package contains 127 menus, 126 partials and 881 items", () => {
  const menus = menuPackage.menus;
  const partials = menus.filter((menu) => menu.completeness === "partial");
  const full = menus.filter((menu) => menu.completeness === "full");
  const sections = menus.flatMap((menu) => menu.sections);
  const items = sections.flatMap((section) => section.items);

  assert.equal(menuPackage.packageDigest, coverageReport.packageDigest);
  assert.equal(menuPackage.packageDigest, "ba8599b410eb19a0032484cecfb936ce01429004e16a865ad99bd16dcecce081");
  assert.equal(menus.length, 127);
  assert.equal(partials.length, 126);
  assert.equal(full.length, 1);
  assert.equal(sections.length, 165);
  assert.equal(items.length, 881);
  assert.equal(new Set(menus.map((menu) => menu.id)).size, 127);
  assert.equal(new Set(menus.map((menu) => menu.venueSlug)).size, 127);
  assert.ok(partials.every((menu) => menu.status === "draft" && menu.verifiedAt === null));
  assert.ok(partials.every((menu) => menu.sections.some((section) => section.items.length > 0)));
  assert.ok(partials.every((menu) => menu.sections.every((section) =>
    section.items.every((item) =>
      item.dietaryTags.length === 0
      && item.verifiedAllergenTags.length === 0
      && item.partnerRecommended === false
      && item.editorialPick === false
      && item.editorialNote === null
    )
  )), "partial snapshots must not carry unverified editorial, dietary or allergen signals");

  assert.equal(coverageReport.outputs.menuCandidates, 127);
  assert.equal(coverageReport.outputs.fullMenuCandidates, 1);
  assert.equal(coverageReport.outputs.partialMenuCandidates, 126);
  assert.equal(coverageReport.outputs.menuItems, 881);
});

test("every partial snapshot candidate is backed by safe eligible official-source evidence", () => {
  const sourcesById = new Map(sourcePackage.sources.map((source) => [source.id, source]));
  const partials = menuPackage.menus.filter((menu) => menu.completeness === "partial");

  for (const menu of partials) {
    assert.equal(isPublishableEvidenceUrl(menu.sourceUrl), true, `${menu.venueSlug} has an unsafe source URL`);
    assert.ok(String(menu.sourceLabel).trim(), `${menu.venueSlug} has no source label`);
    assert.equal(menu.verifiedAt, null);
    assert.ok(Number.isFinite(Date.parse(menu.capturedAt)), `${menu.venueSlug} has no capture timestamp`);

    const linkedSources = menu.provenance.sourceIds.map((id) => sourcesById.get(id));
    assert.ok(linkedSources.length > 0 && linkedSources.every(Boolean), `${menu.venueSlug} has broken source mapping`);
    assert.ok(linkedSources.some((source) => source.url === menu.sourceUrl), `${menu.venueSlug} source URL is not in provenance`);
    for (const source of linkedSources) {
      assert.equal(source.validForCandidate, true, `${menu.venueSlug} links quarantined evidence`);
      assert.equal(source.candidateState, "eligible", `${menu.venueSlug} source is not eligible`);
      assert.equal(source.verifiedAt, null, `${menu.venueSlug} source claims operator verification`);
      assert.match(source.sourceType, /^official_/, `${menu.venueSlug} source is not official`);
      assert.ok(
        source.officialControl === "venue" || source.officialControl === "official_asset_linked_by_venue",
        `${menu.venueSlug} source is not controlled or linked by the venue`,
      );
      assert.equal(isPublishableEvidenceUrl(source.url), true, `${menu.venueSlug} provenance URL is unsafe`);
    }
  }
});

test("dedicated public menu routes exist and use the public menu repository", async () => {
  const [indexRoute, detailRoute] = await Promise.all([
    readText("app/menus/page.tsx"),
    readText("app/menus/[slug]/page.tsx"),
  ]);

  assert.match(indexRoute, /export default async function MenusPage\(\)/);
  assert.match(indexRoute, /getPublicMenuSummaries\(\)/);
  assert.match(indexRoute, /href=\{`\/menus\/\$\{menu\.venueSlug\}`\}/);
  assert.match(detailRoute, /export default async function MenuPage/);
  assert.match(detailRoute, /getPublishedMenu\(slug\)/);
  assert.match(detailRoute, /<StructuredMenu\b/);
  assert.match(detailRoute, /href="\/menus"/);
});

test("the repository reads both verified published menus and source snapshots", async () => {
  const repository = await readText("lib/data/menu-repository.ts");
  const publicStatusFilters = repository.match(
    /\.in\("status", \["published", "source_snapshot"\]\)/g,
  ) ?? [];

  assert.equal(publicStatusFilters.length, 2);
  assert.match(repository, /export async function getPublishedMenu/);
  assert.match(repository, /export async function getPublicMenuSummaries/);
  assert.match(repository, /mapPublishedMenu\(/);
  assert.match(repository, /mapPublicMenuSummary\(/);
});

test("the UI labels snapshots as partial and unverified with source freshness context", async () => {
  const [menuIndex, menuDetail, structuredMenu] = await Promise.all([
    readText("app/menus/page.tsx"),
    readText("app/menus/[slug]/page.tsx"),
    readText("components/menu/StructuredMenu.tsx"),
  ]);

  assert.match(menuIndex, /Partial source snapshot/);
  assert.match(menuIndex, /Selected items, not the complete menu\./);
  assert.match(menuIndex, /Always confirm allergies, prices and availability directly with the venue\./);
  assert.match(menuDetail, /Partial official-source menu/);
  assert.match(menuDetail, /never claim to be complete/);
  assert.match(structuredMenu, /Partial source snapshot/);
  assert.match(structuredMenu, /Selected items only:/);
  assert.match(structuredMenu, /not the complete menu/);
  assert.match(structuredMenu, /has not been independently verified item by item/);
  assert.match(structuredMenu, /Official source:/);
  assert.match(structuredMenu, /captured \$\{captured\}/);
  assert.match(structuredMenu, /recheck by \$\{expires\}/);
  assert.match(await readText("components/menu/MenuSection.tsx"), /review subset\\s\*\$/i);
});

test("the migration activates only the exact 126-row package through a service-only RPC", async () => {
  const migration = await readText("supabase/migrations/20260714115933_public_menu_source_snapshots.sql");
  const rpc = functionBody(migration, "publish_data_ops_source_snapshots");

  assert.ok(rpc, "publish_data_ops_source_snapshots RPC is missing");
  assert.match(migration, /grant select on table public\.venues to service_role/i);
  assert.match(migration, /status in \([\s\S]*?'source_snapshot'[\s\S]*?'published'[\s\S]*?\)/i);
  assert.match(migration, /status <> 'source_snapshot'[\s\S]*?completeness = 'partial'[\s\S]*?verified_at is null/i);
  assert.match(migration, /is_publishable_evidence_url\(source_url\)/i);
  assert.match(rpc, /security invoker/i);
  assert.match(rpc, new RegExp(menuPackage.packageDigest, "i"));
  assert.match(rpc, /menus_count = 127/i);
  assert.match(rpc, /sections_count = 165/i);
  assert.match(rpc, /items_count = 881/i);
  assert.match(rpc, /capabilities_count = 250/i);
  assert.match(rpc, /maps_candidates_not_applied = 50/i);
  assert.match(rpc, /v_total_count <> 127/i);
  assert.match(rpc, /v_verified_full_count <> 1/i);
  assert.match(rpc, /v_section_count <> 165 or v_item_count <> 881/i);
  assert.match(rpc, /v_candidate_count <> 126/i);
  assert.match(rpc, /v_updated_count <> 126/i);
  assert.match(rpc, /m\.status = 'draft'[\s\S]*?m\.completeness = 'partial'[\s\S]*?m\.verified_at is null/i);
  assert.match(rpc, /status = 'source_snapshot'/i);
  assert.match(rpc, /source_snapshot_published_at = now\(\)/i);
  assert.match(rpc, /not public\.is_publishable_evidence_url\(m\.source_url\)/i);
  assert.match(rpc, /get diagnostics v_updated_count = row_count/i);
  assert.match(rpc, /'alreadyPublished', true/i);
  assert.match(rpc, /published_source_snapshot_gate_failed/i);
  assert.match(
    migration,
    /revoke all on function public\.publish_data_ops_source_snapshots\(text\)[\s\S]*?from public, anon, authenticated/i,
  );
  assert.match(
    migration,
    /grant execute on function public\.publish_data_ops_source_snapshots\(text\)[\s\S]*?to service_role/i,
  );
  assert.doesNotMatch(
    migration,
    /grant execute on function public\.publish_data_ops_source_snapshots\(text\)\s+to (?:anon|authenticated)/i,
  );
  assert.match(migration, /\$activate_reviewed_source_snapshots\$/i);
  assert.match(migration, /count\(\*\) filter \(where status = 'source_snapshot'\) = 126/i);
});
