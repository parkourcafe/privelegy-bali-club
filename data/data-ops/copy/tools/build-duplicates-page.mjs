// Builds the founder's decision page for suspected duplicate venue records.
// Decisions (keep one / distinct / check) are made on the published page and
// stored in its own database; this script only embeds the candidate list.
//
//   node data/data-ops/copy/tools/build-duplicates-page.mjs --out <file.html> [--date 2026-10-08]

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv } from "../../../../scripts/copy/lint.mjs";
import { mdToHtml } from "./build-review-page.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DUP = resolve(HERE, "../duplicates");

// Data problems the candidate pass found that must be fixed before a record
// is unpublished, so the kept card is not the broken one.
const WARNINGS = {
  G06: ["alchemy-yoga-meditation-center — йога-студия записана в категорию «спа»."],
  G08: ["taksu-yoga-ubud — йога-студия записана в категорию «спа»."],
  G14: ["jungle-padel-canggu-shortcut — падел-клуб записан в категорию «спа»."],
  G16: ["Обе записи Swara Spa сомнительны: сайт swarnaspa.com не совпадает с названием, Instagram — аккаунт продавца шаблонов (ancora_themes), у записи в Jimbaran подрайон Pererenan, Canggu."],
  G19: ["chaskaa-modern-indian-cuisine-and-bar-at-jimbaran — район uluwatu-bukit, а адрес в Jimbaran."],
};

export function buildData(date) {
  const rows = parseCsv(readFileSync(join(DUP, `${date}-candidates.csv`), "utf8")).map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v ?? ""])));
  const md = readFileSync(join(DUP, `${date}-CANDIDATES.md`), "utf8");
  const titles = Object.fromEntries([...md.matchAll(/^### (G\d+) · (.+?) — /gm)].map((m) => [m[1], m[2]]));
  const notDup = md.match(/^## Что, скорее всего, не дубль\n([\s\S]*?)(?=^## |$(?![\s\S]))/m)?.[1] ?? "";
  const groups = new Map();
  for (const r of rows) {
    if (!groups.has(r.group_id)) {
      groups.set(r.group_id, { id: r.group_id, title: titles[r.group_id] ?? r.group_id, confidence: r.confidence, evidence: r.evidence, suggestedKeep: r.suggested_keep, warnings: WARNINGS[r.group_id] ?? [], records: [] });
    }
    groups.get(r.group_id).records.push({
      slug: r.slug, name: r.name, district: r.district, address: r.full_address, phone: r.phone, site: r.official_url,
      published: r.publication_status === "published",
    });
  }
  const list = [...groups.values()];
  return { date, groups: list, records: rows.length, published: rows.filter((r) => r.publication_status === "published").length, notDuplicateHtml: mdToHtml(notDup) };
}

export function renderPage(data) {
  const base = readFileSync(join(HERE, "review-page.html"), "utf8").match(/<style>([\s\S]*?)<\/style>/)[1];
  const json = JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  return readFileSync(join(HERE, "duplicates-page.html"), "utf8").replace("/*__BASE_STYLE__*/", () => base).replace("/*__DATA__*/", () => json);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const opt = (flag, fallback) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : fallback);
  const out = opt("--out", null);
  if (!out) { console.error("usage: build-duplicates-page.mjs --out <file.html> [--date YYYY-MM-DD]"); process.exit(2); }
  const data = buildData(opt("--date", "2026-10-08"));
  mkdirSync(dirname(resolve(out)), { recursive: true });
  writeFileSync(out, renderPage(data));
  const keepOk = data.groups.filter((g) => !g.suggestedKeep || g.records.some((r) => r.slug === g.suggestedKeep && r.published)).length;
  console.log(`${data.groups.length} groups · ${data.records} records · ${data.published} published · suggested keep valid in ${keepOk}/${data.groups.length}`);
}
