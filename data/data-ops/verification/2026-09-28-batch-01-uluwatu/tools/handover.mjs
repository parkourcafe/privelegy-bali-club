#!/usr/bin/env node
// Founder-facing hand-over for batch 1: CHANGE-LIST.md (Russian), draft-changes.sql
// (guarded, never executed here) and registry-changes.md (code edits blocked
// until a deploy decision). Reads change-list.csv from reconcile.mjs and
// codex-proposals.json.
//
//   node handover.mjs --batch <dir>

import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const val = (n, d) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : d);
const BATCH = resolve(val("--batch", ".."));
const TODAY = "2026-09-28";

function parseCsv(text) {
  // Full CSV state machine: quoted fields may contain commas, quotes and newlines.
  text = text.replace(/^(#[^\n]*\n)+/, ""); // leading "# одна строка = …" comment lines
  const records = [];
  let row = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") {
      row.push(cur);
      cur = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cur);
      cur = "";
      if (!(row.length === 1 && row[0] === "") && !(row.length === 1 && row[0].startsWith("#"))) records.push(row);
      row = [];
    } else cur += ch;
  }
  if (cur !== "" || row.length) {
    row.push(cur);
    records.push(row);
  }
  const header = records[0];
  return records.slice(1).map((r) => Object.fromEntries(r.map((v, i) => [header[i], v])));
}

const rows = parseCsv(await readFile(join(BATCH, "change-list.csv"), "utf8"));
const codex = JSON.parse(await readFile(join(BATCH, "codex-proposals.json"), "utf8"));
const summary = JSON.parse(await readFile(join(BATCH, "reconcile-summary.json"), "utf8"));
const sqlLit = (v) => `'${String(v).replace(/'/g, "''")}'`;
const DB_FIELDS = { opening_hours_json: "opening_hours_json", phone: "phone", full_address: "full_address", coordinates: null, price_anchor: "price_anchor", category: "category", officialUrl: "official_url", instagramUrl: "instagram_url", menuUrl: null, bookingUrl: null };
const isOpenEnded = (v) => /late|last guest/i.test(String(v)) && !String(v).startsWith("{");

// ---------- per-venue markdown
const md = [];
md.push(`# Батч 1 — Uluwatu 25: список изменений для решения\n`);
md.push(`Дата: ${TODAY}. Источники — только официальные сайты заведений и брони, на которые они ссылаются; каждое принятое значение прошло три независимых шага: сборщик (ready) → скрипт-валидатор (цитата дословно в сохранённом снимке, домен официальный, границы правдоподобия) → слепой приёмщик (сам перекачал источник; видел только поле, значение, URL и цитату). Любое расхождение = HOLD. **Ничего не записано и не опубликовано.** Полная таблица: \`change-list.csv\` (одна строка = одно утверждение по одному полю).\n`);
const t = summary.totals;
md.push(`## Итог\n`);
md.push(`| Решение | Строк |\n|---|---:|\n| ACCEPTED — можно применять после вашего «да» | ${t.ACCEPTED ?? 0} |\n| MANUAL_REVIEW — удаления и цитаты из PDF/картинок: посмотрите сами | ${t.MANUAL_REVIEW ?? 0} |\n| HOLD — расхождение или нет официального источника | ${t.HOLD ?? 0} |\n| REJECTED — отвергнуто и валидатором, и приёмщиком | ${t.REJECTED ?? 0} |\n| KEEP — на карточке верно, менять нечего | ${t.KEEP ?? 0} |\n`);
md.push(`Канарейки (заведомо ложные утверждения, подмешанные приёмщикам): ${summary.canaries.length}, пропущено ${summary.canariesMissed.length}.\n`);
md.push(`Куда попадают изменения: **CODE** — реестр \`lib/uluwatu/venues.ts\` (видимая карточка), **DB** — колонки \`venues\` (питают JSON-LD), **BOTH** — ссылки. Правки CODE до сайта не доедут, пока прод не пересобран из main (см. аудит 28.09, §0.2).\n`);

// identity table
md.push(`## Личность заведений (шаг 0)\n\n| slug | работает | название сегодня | тот филиал | итог |\n|---|---|---|---|---|`);
for (const [slug, v] of Object.entries(summary.perVenue)) {
  const id = v.identity ?? {};
  md.push(`| ${slug} | ${id.operating ?? "—"} | ${id.current_name ?? "—"} | ${id.branch_ok ?? "—"} | ${v.identityOk ? "ok" : "**HOLD всё**"} — принято ${v.accepted}, hold ${v.hold}, вручную ${v.manual} |`);
}
md.push("");

// accepted per venue
md.push(`## Принятые изменения (ACCEPTED)\n`);
const accepted = rows.filter((r) => r.decision === "ACCEPTED");
for (const slug of [...new Set(accepted.map((r) => r.slug))]) {
  md.push(`### ${slug}\n\n| поле | цель | сейчас | предлагается | источник · цитата |\n|---|---|---|---|---|`);
  for (const r of accepted.filter((x) => x.slug === slug)) {
    const note = (r.field === "opening_hours_json" || r.field === "hours") && isOpenEnded(r.proposed) ? " _(открытый конец: в CODE как текст; в DB структурное закрытие не пишется)_" : "";
    md.push(`| ${r.field} | ${r.target} | ${(r.live_value || "—").slice(0, 80)} | ${String(r.proposed).slice(0, 120)}${note} | ${r.source_url} · «${(r.quote || "").replace(/\n/g, " ").slice(0, 90)}» |`);
  }
  md.push("");
}

// manual
md.push(`## На ручную проверку (MANUAL_REVIEW)\n\n| slug | поле | действие | предлагается / что убрать | почему вручную |\n|---|---|---|---|---|`);
for (const r of rows.filter((x) => x.decision === "MANUAL_REVIEW")) md.push(`| ${r.slug} | ${r.field} | ${r.action} | ${String(r.proposed || r.live_value).slice(0, 100)} | ${r.why.slice(0, 140)} |`);
md.push("");

// holds grouped by reason
md.push(`## HOLD — что разблокирует\n`);
const holdGroups = {};
for (const r of rows.filter((x) => x.decision === "HOLD")) {
  const w = r.why;
  const key = /identity gate/.test(w) ? "личность заведения не подтверждена официальным источником (сайт недоступен или только Instagram)" : /not_found/.test(w) ? "факта нет ни на одном официальном источнике" : /SOURCE_BLOCKED|no 200 snapshot/.test(w) ? "источник закрыт для среды (403/Cloudflare/500) — проверить с телефона или позже" : /class E/.test(w) ? "опытные утверждения (толпа, парковка, «приходите заранее») — нужна ваша аттестация визита" : /class Q/.test(w) ? "оценочные фразы — кандидаты на удаление, решает редактор" : /NOT_A_SOURCE_FACT/.test(w) ? "редакционные фразы, которые сайт не доказывает" : /unclear/.test(w) ? "сборщик не смог подтвердить (unclear)" : "расхождение сборщика и приёмщика";
  (holdGroups[key] ??= []).push(r);
}
for (const [k, list] of Object.entries(holdGroups).sort((a, b) => b[1].length - a[1].length)) {
  md.push(`- **${list.length}** — ${k}. Места: ${[...new Set(list.map((r) => r.slug))].join(", ")}.`);
}
md.push("");

// codex survival
let codexTotal = 0;
let codexSurvived = 0;
for (const r of accepted) {
  const c = codex[r.slug]?.codex;
  if (!c) continue;
  const map = { hours: c.openingHoursText, opening_hours_json: c.opening_hours_json, phone: c.phone, address: c.address, full_address: c.address, whatToOrder: c.editorial?.what_to_order, price_anchor: c.editorial?.price_anchor, menuUrl: null, bookingUrl: null };
  if (r.field in map && map[r.field]) {
    codexTotal += 1;
    if (String(map[r.field]).replace(/\s+/g, " ").toLowerCase() === String(r.proposed).replace(/\s+/g, " ").toLowerCase()) codexSurvived += 1;
  }
}
md.push(`## Паки Codex (30.08) как наводки\n\nИз принятых значений ${codexTotal} имели аналог в паках; дословно совпали ${codexSurvived}. Остальные предложения паков либо не подтвердились официальным источником, либо не были проверены (HOLD). Паки не использовались как доказательство.\n`);

// blocked sources
md.push(`## Источники, недоступные из среды\n\n- alilahotels.com / hyatt.com (Akamai 403) — The Warung at Alila; artisangroup.id (500) — Artisan, Ulu Artisan Ungasan; dishcult.com (403/404) — Ulu Garden, Artisan; corner.inc (429) — ZALI; hotels.com (429).\n- Только Instagram: laggas-uluwatu, son-of-a-baker — чек-лист для проверки с телефона: работает ли, био (адрес, часы), дата последнего поста, тот ли филиал.\n`);
md.push(`## Что дальше\n\n1. Скажите «да»/«нет» по таблице ACCEPTED (можно построчно: slug + поле).\n2. Просмотрите MANUAL_REVIEW (4–8 строк).\n3. Для DB-строк: \`draft-changes.sql\` — не выполняется; перед запуском нужен SELECT текущих значений и dry-run одной строки с откатом (otherbali-supabase-write).\n4. Для CODE-строк: \`registry-changes.md\` — правки \`lib/uluwatu/venues.ts\`, заблокированы до решения о деплое.\n`);
await writeFile(join(BATCH, "CHANGE-LIST.md"), md.join("\n"));

// ---------- SQL draft (DB targets only)
const sql = [];
sql.push(`-- Batch 1 (Uluwatu 25) — DRAFT, NOT EXECUTED. Generated ${TODAY} from change-list.csv (decision = ACCEPTED, target DB/BOTH → DB columns).`);
sql.push(`-- Before running: (1) SELECT the current values below and paste each into /*EXPECTED_FROM_PREFLIGHT*/; (2) dry-run ONE row inside begin/rollback;`);
sql.push(`-- (3) state the expected row count. A replace never runs without the live current value. See .agents/skills/otherbali-supabase-write/SKILL.md.`);
sql.push(`-- last_verified_at is NOT bumped here: it moves only when every F-claim of a card is accepted or removed (decided per venue by the founder).\n`);
const dbRows = accepted.filter((r) => r.target === "DB" || (r.target === "BOTH" && DB_FIELDS[r.field]));
const slugs = [...new Set(dbRows.map((r) => r.slug))];
sql.push(`-- 0. Current values (read-only)`);
sql.push(`select slug, status, publication_status, opening_hours_json, phone, full_address, price_anchor, category, official_url, instagram_url, latitude, longitude, verified_at, verification_source\nfrom venues where slug in (${slugs.map(sqlLit).join(", ")}) order by slug;\n`);
let n = 1;
for (const r of dbRows) {
  const col = DB_FIELDS[r.field];
  if (r.field === "coordinates") {
    const [lat, lng] = JSON.parse(r.proposed);
    sql.push(`-- ${n++}. ${r.slug} · coordinates · ${r.action} · source ${r.source_url}`);
    sql.push(`update venues set latitude = ${lat}, longitude = ${lng} where slug = ${sqlLit(r.slug)} and status = 'active' and publication_status = 'published' and latitude is null and longitude is null; -- expect: UPDATE 1\n`);
    continue;
  }
  if (!col) continue;
  if (col === "opening_hours_json" && isOpenEnded(r.proposed)) {
    sql.push(`-- ${n++}. ${r.slug} · opening_hours_json · SKIPPED: open-ended hours ("${r.proposed}") stay as registry text; no structured closing time is invented.\n`);
    continue;
  }
  const value = col === "opening_hours_json" ? `${sqlLit(r.proposed)}::jsonb` : sqlLit(r.proposed);
  sql.push(`-- ${n++}. ${r.slug} · ${col} · ${r.action} · source ${r.source_url} · quote: ${(r.quote || "").replace(/\n/g, " ").slice(0, 100)}`);
  if (r.action === "add") sql.push(`update venues set ${col} = ${value} where slug = ${sqlLit(r.slug)} and status = 'active' and publication_status = 'published' and (${col} is null or length(trim(${col}::text)) = 0); -- expect: UPDATE 1\n`);
  else sql.push(`update venues set ${col} = ${value} where slug = ${sqlLit(r.slug)} and status = 'active' and publication_status = 'published' and ${col}::text = /*EXPECTED_FROM_PREFLIGHT*/; -- expect: UPDATE 1 — fill the current value from step 0 first\n`);
}
sql.push(`-- Verify: select slug, opening_hours_json, phone, full_address, price_anchor, latitude, longitude from venues where slug in (${slugs.map(sqlLit).join(", ")});`);
await writeFile(join(BATCH, "draft-changes.sql"), sql.join("\n") + "\n");

// ---------- registry changes
const reg = [`# Правки реестра lib/uluwatu/venues.ts — заблокированы до решения о деплое\n`, `Сгенерировано ${TODAY} из change-list.csv (ACCEPTED, target CODE/BOTH). Не применены. Каждая правка — одно поле одной записи реестра; вместе с ней в \`evidence[]\` добавляется запись {field, sourceType: "official_website" | "official_booking_page", sourceUrl, verifiedAt: "${TODAY}", status: "VERIFIED"} — иначе ссылки останутся скрытыми (TTL 30/60 дней).\n`];
for (const r of accepted.filter((x) => x.target === "CODE" || x.target === "BOTH")) {
  const field = r.field.startsWith("copy:") ? r.field.replace("copy:", "").replace(/#\d+$/, "") : r.field;
  reg.push(`- **${r.slug}** · \`${field}\` · ${r.action}: ${r.field.startsWith("copy:") ? `предложение «${(r.live_value || "").slice(0, 90)}» → «${String(r.proposed).slice(0, 120)}»` : `→ \`${String(r.proposed).slice(0, 160)}\``} — источник ${r.source_url}`);
}
await writeFile(join(BATCH, "registry-changes.md"), reg.join("\n") + "\n");
console.log(JSON.stringify({ accepted: accepted.length, dbRows: dbRows.length, codeRows: accepted.filter((x) => x.target !== "DB").length, venuesWithAccepted: new Set(accepted.map((r) => r.slug)).size }));
