// Builds the founder's review page for the wave lists: every card's live text
// ("before"), the rewrite ("after"), the reviewer's reason, the doubtful facts
// the rewriters logged, and the gate result. Decisions are made on the
// published page and stored in its own database, not here.
//
//   node data/data-ops/copy/tools/build-review-page.mjs --out <file.html> [--checked "7 октября"]
//
// The page reads no network data; everything it shows is embedded.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkCards } from "../../../../scripts/copy/check-cards.mjs";
import { parseCsv } from "../../../../scripts/copy/lint.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const COPY = resolve(HERE, "..");
const REPO = resolve(COPY, "../../..");

export const LISTS = [
  { id: "canggu", file: "wave-db/canggu", group: "Районы", title: "Canggu" },
  { id: "seminyak-kuta-bali", file: "wave-db/seminyak-kuta-bali", group: "Районы", title: "Seminyak, Kuta и остальной Бали" },
  { id: "ubud-north-east", file: "wave-db/ubud-north-east", group: "Районы", title: "Ubud, север и восток" },
  { id: "uluwatu-sanur", file: "wave-db/uluwatu-sanur", group: "Районы", title: "Uluwatu и Sanur" },
  { id: "nusa-dua-jimbaran", file: "wave-db/nusa-dua-jimbaran", group: "Районы", title: "Nusa Dua и Jimbaran" },
  { id: "clean-a", file: "wave-db/clean-a", group: "Почти чистые", title: "Почти чистые, часть A" },
  { id: "clean-b", file: "wave-db/clean-b", group: "Почти чистые", title: "Почти чистые, часть B" },
  ...[1, 2, 3, 4, 5, 6].map((n) => ({ id: `spa-${n}`, file: `wave-spa/spa-${n}`, group: "Спа", title: `Спа, часть ${n}` })),
  { id: "rewrite-now", file: "wave-db/rewrite-now", group: "Срочные", title: "Срочные: 14 карточек" },
  { id: "routes", file: "wave-db/routes", group: "Маршруты", title: "Маршруты: подзаголовки и остановки", kind: "routes" },
];

// Route titles as production holds them (read-only query, 2026-10-07).
const ROUTE_TITLES = {
  "bangli-temple-village-day": "A Bangli temple & village day",
  "cafe-work": "Café & work day",
  "canggu-food-route": "Canggu food route",
  "canggu-rainy-day": "Canggu rainy-day route",
  "east-bali-heritage-day": "An East Bali heritage day",
  "first-day": "First day in Canggu",
  "sunset-run": "Sunset run",
  "ubud-culture-day": "An Ubud culture day",
};

const readRows = (path) => parseCsv(readFileSync(path, "utf8")).map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v ?? ""])));
const readJson = (path) => {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return []; }
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const inline = (s) => esc(s)
  .replace(/`([^`]+)`/g, "<code>$1</code>")
  .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
  .replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');

// Small Markdown subset: headings, bullet and numbered lists (with nesting by
// indentation), paragraphs, bold, code, links. Enough for the run notes.
export function mdToHtml(md) {
  const out = [];
  const stack = [];
  const closeTo = (depth) => { while (stack.length > depth) out.push(`</li></${stack.pop()}>`); };
  let para = [];
  const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
  for (const raw of md.split("\n")) {
    const line = raw.replace(/\s+$/, "");
    const m = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (/^#{1,6}\s/.test(line)) {
      flush(); closeTo(0);
      const level = line.match(/^#+/)[0].length;
      out.push(`<h${Math.min(level + 2, 6)}>${inline(line.replace(/^#+\s*/, ""))}</h${Math.min(level + 2, 6)}>`);
    } else if (m) {
      flush();
      const depth = Math.floor(m[1].replace(/\t/g, "  ").length / 2) + 1;
      const tag = /\d/.test(m[2]) ? "ol" : "ul";
      if (stack.length < depth) { while (stack.length < depth) { out.push(`<${tag}><li>`); stack.push(tag); } }
      else { closeTo(depth); out.push("</li><li>"); }
      out.push(inline(m[3]));
    } else if (!line.trim()) {
      flush(); closeTo(0);
    } else if (stack.length) {
      out.push(" " + inline(line.trim()));
    } else {
      para.push(line.trim());
    }
  }
  flush(); closeTo(0);
  return out.join("").replace(/<(ul|ol)><li><\/li><\/(ul|ol)>/g, "");
}

function sections(md) {
  const heads = [...md.matchAll(/^## (.+)$/gm)];
  return heads.map((m, i) => ({ title: m[1].trim(), body: md.slice(m.index + m[0].length, heads[i + 1]?.index ?? md.length) }));
}

// Top-level list items of a section, each with its continuation lines.
function items(body) {
  const out = [];
  for (const line of body.split("\n")) {
    if (/^(\d+\.|[-*])\s+/.test(line)) out.push(line);
    else if (out.length && line.trim()) out[out.length - 1] += "\n" + line;
  }
  return out;
}

const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();

const GENERIC = new Set(["bali", "spa", "the", "cafe", "yoga", "gym", "beach", "villa", "resort", "restaurant", "warung", "kitchen", "massage", "day spa", "eat street"]);
const shortName = (name) => norm(name.split(/\s+[-|–—(]\s*|,\s/)[0]);

// A note names its venue by slug, by display name, or by the words before its
// first colon or dash ("Anika Gym: район …"). A bare generic word never matches.
function matchCards(text, cards) {
  const lead = text.replace(/^(\d+\.|[-*])\s+/, "").split(/[:—–]|\.\s/)[0];
  const refs = [...[...text.matchAll(/\*\*([^*]+)\*\*|`([^`]+)`/g)].map((x) => (x[1] || x[2]).trim()), lead]
    .flatMap((r) => r.split(/\s+(?:\/|и|and)\s+/)).map((r) => r.replace(/[«»"]/g, "").trim()).filter(Boolean);
  const flat = ` ${norm(text)} `;
  const hits = new Set();
  for (const c of cards) {
    const n = norm(c.name);
    const sn = shortName(c.name);
    for (const r of refs) {
      const rr = r.replace(/[….:]+$/, "").trim();
      if (/^[a-z0-9-]+$/.test(rr) && rr.includes("-") && (c.slug === rr || (r.endsWith("…") && c.slug.startsWith(rr)))) hits.add(c);
      const nr = norm(rr);
      if (nr.length < 4 || GENERIC.has(nr) || nr.split(" ").length > 8) continue;
      if (nr === n || nr === sn || n.startsWith(nr + " ") || (sn.split(" ").length >= 2 && nr.startsWith(sn + " "))) hits.add(c);
    }
    if (c.slug.length > 6 && text.includes(c.slug)) hits.add(c);
    if (sn.length >= 8 && sn.split(" ").length >= 2 && !GENERIC.has(sn) && flat.includes(` ${sn} `)) hits.add(c);
  }
  return [...hits];
}

function contextLine(input) {
  const ctx = input?.context_not_for_copy;
  if (!ctx) return [];
  const out = [];
  if (ctx.hours_visible) out.push(["Часы на сайте", ctx.hours_visible]);
  if (ctx.spend) out.push(["Цены", ctx.spend]);
  return out;
}

export function buildData({ checkedAt }) {
  const places = readRows(join(REPO, "docs/audits/2026-09-28-web/places.csv"));
  const lists = [];
  let cardTotal = 0;
  let rowTotal = 0;
  let unmatchedTotal = 0;
  const combinedRows = [];
  for (const def of LISTS) {
    const rows = readRows(join(COPY, `${def.file}.csv`));
    const md = readFileSync(join(COPY, `${def.file}.md`), "utf8");
    const inputs = new Map(readJson(join(COPY, `${def.file}.input.json`)).map((x) => [x.slug, x]));
    const isRoutes = def.kind === "routes";
    const bySlug = new Map();
    for (const r of rows) {
      if (r.action === "keep" || r.before === r.after) continue;
      const key = isRoutes ? r.key.split("/")[0] : r.slug_or_path;
      const label = isRoutes ? (r.table === "routes" ? "Подзаголовок маршрута" : `Остановка: ${r.key.split("/")[1]}`) : null;
      if (!bySlug.has(key)) bySlug.set(key, []);
      bySlug.get(key).push({ f: r.field, label, b: r.before, a: r.after, r: r.reason, ...(isRoutes ? { table: r.table, key: r.key } : {}) });
    }
    let gate = null;
    const gateBySlug = new Map();
    if (!isRoutes) {
      combinedRows.push(...rows);
      const res = checkCards(rows, places);
      gate = {
        fail: res.cards.filter((c) => c.verdict === "FAIL").length,
        batch: res.batch.length,
        warnBefore: res.cards.reduce((s, c) => s + (c.warnBefore ?? 0), 0),
        warnAfter: res.cards.reduce((s, c) => s + (c.warnAfter ?? 0), 0),
        openerNotes: res.openerNotes,
      };
      for (const c of res.cards) gateBySlug.set(c.slug, [...c.problems.map((p) => `Ошибка проверки: ${p}`), ...c.notes]);
    }
    const cards = [...bySlug].map(([slug, rws]) => {
      const inp = inputs.get(slug);
      return {
        slug,
        name: isRoutes ? ROUTE_TITLES[slug] ?? slug : inp?.name ?? slug,
        district: inp?.district ?? "",
        where: inp?.where ?? "",
        url: isRoutes ? `https://www.otherbali.com/route/${slug}` : `https://www.otherbali.com/places/${slug}`,
        ctx: contextLine(inp),
        notes: (gateBySlug.get(slug) ?? []).map((n) => n.replace(/^why_its_here is (\d+) words \(standard: 20–45\)$/, "Длина описания: $1 слов (норма 20–45)").replace(/^dropped /, "Убрано из текста: ")),
        flags: [],
        rows: rws,
      };
    });
    const listFlags = [];
    for (const s of sections(md)) {
      if (!/^(Сомнительные факты|Что осталось открытым)/.test(s.title)) continue;
      for (const it of items(s.body)) {
        const html = inline(it.replace(/^(\d+\.|[-*])\s+/, "").replace(/\n\s*/g, " "));
        const hits = matchCards(it, cards);
        if (hits.length) for (const c of hits) c.flags.push({ s: s.title, html });
        else listFlags.push({ s: s.title, html });
      }
    }
    if (gate) for (const n of gate.openerNotes) listFlags.push({ s: "Одинаковые начала", html: esc(n.replace(/ opens (\d+) cards$/, " — так начинаются $1 карточек")) });
    unmatchedTotal += listFlags.length;
    const summarySec = sections(md).filter((s) => /^(Итог|Гейт|Изменено)/.test(s.title));
    const intro = md.split(/^## /m)[0].replace(/^# .*$/m, "").trim();
    const summaryMd = summarySec.length ? summarySec.map((s) => (summarySec.length > 1 ? `### ${s.title}\n` : "") + s.body).join("\n") : intro;
    const nRows = cards.reduce((s, c) => s + c.rows.length, 0);
    lists.push({
      id: def.id, title: def.title, group: def.group, kind: def.kind ?? "venues", file: `data/data-ops/copy/${def.file}.csv`,
      rows: nRows, gate, summaryHtml: mdToHtml(summaryMd), notesHtml: mdToHtml(md.replace(/^# .*$/m, "")), listFlags, cards,
    });
    cardTotal += cards.length;
    rowTotal += nRows;
  }
  const combined = checkCards(combinedRows, places);
  return {
    checkedAt,
    totals: { lists: lists.length, cards: cardTotal, rows: rowTotal, unmatchedFlags: unmatchedTotal },
    combined: { fail: combined.cards.filter((c) => c.verdict === "FAIL").length, batch: combined.batch.length, openerNotes: combined.openerNotes },
    lists,
  };
}

export function renderPage(data) {
  const template = readFileSync(join(HERE, "review-page.html"), "utf8");
  // `<` escaped so no card text can close the data script.
  const json = JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  return template.replace("/*__DATA__*/", () => json);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const opt = (flag, fallback) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : fallback);
  const out = opt("--out", null);
  if (!out) { console.error("usage: build-review-page.mjs --out <file.html> [--checked <label>]"); process.exit(2); }
  const data = buildData({ checkedAt: opt("--checked", new Date().toISOString().slice(0, 10)) });
  mkdirSync(dirname(resolve(out)), { recursive: true });
  const html = renderPage(data);
  writeFileSync(out, html);
  console.log(`${data.totals.lists} lists · ${data.totals.cards} cards · ${data.totals.rows} rows · ${(html.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`combined gate: ${data.combined.fail} FAIL · batch ${data.combined.batch}`);
  for (const l of data.lists) console.log(`  ${l.id.padEnd(20)} cards ${String(l.cards.length).padStart(3)} rows ${String(l.rows).padStart(3)} flagged ${String(l.cards.filter((c) => c.flags.length).length).padStart(3)} list-notes ${l.listFlags.length}`);
}
