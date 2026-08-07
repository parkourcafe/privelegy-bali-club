#!/usr/bin/env node
// Gate for the Other Bali guide page standard.
//
//   node check-page.mjs <url> [--json]
//   node check-page.mjs --file <path-to-saved-html>
//
// Checks only what a machine can decide. Provenance, fit-vs-quality wording and
// whether a section over-promises still need a human — the skill lists those
// separately so a green run is never mistaken for a full sign-off.
//
// Exits 1 on any FAIL so it can gate a deploy. WARN never fails the run.

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const fileIdx = args.indexOf("--file");
const target = fileIdx >= 0 ? args[fileIdx + 1] : args.find((a) => !a.startsWith("--"));

if (!target) {
  console.error("usage: check-page.mjs <url> [--json] | --file <path.html>");
  process.exit(2);
}

const results = [];
const add = (level, name, ok, detail) => results.push({ level, name, ok, detail });

// ---------------------------------------------------------------- load

let html, status = 200;
try {
  if (fileIdx >= 0) {
    html = await (await import("node:fs/promises")).readFile(target, "utf8");
  } else {
    const res = await fetch(target, { redirect: "follow" });
    status = res.status;
    html = await res.text();
  }
} catch (e) {
  console.error(`could not load ${target}: ${e.message}`);
  process.exit(2);
}

add("FAIL", "page returns 200", status === 200, `HTTP ${status}`);

// ---------------------------------------------------------------- helpers

const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/gi, " ")
                      .replace(/<style[\s\S]*?<\/style>/gi, " ")
                      .replace(/<[^>]+>/g, " ")
                      .replace(/&[a-z#0-9]+;/gi, " ")
                      .replace(/\s+/g, " ").trim();

const ldBlocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((m) => { try { return JSON.parse(m[1]); } catch { return null; } })
  .filter(Boolean);

const hasType = (t) => JSON.stringify(ldBlocks).includes(`"${t}"`);

// ---------------------------------------------------------------- 0. metadata

const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1];
add("FAIL", "self-canonical present", Boolean(canonical), canonical ?? "no canonical tag");

const robots = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? "";
add("FAIL", "not noindex", !/noindex/i.test(robots), robots || "no robots meta (indexable)");

const title = strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
add("WARN", "title <= 60 chars", title.length > 0 && title.length <= 60, `${title.length}: ${title}`);

const desc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? "";
add("WARN", "meta description 80-170 chars", desc.length >= 80 && desc.length <= 170, `${desc.length} chars`);

// ---------------------------------------------------------------- 1. answer block

const answer = html.match(/<section[^>]*class=["'][^"']*guide-answer[^"']*["'][\s\S]*?<\/section>/i)?.[0];
add("FAIL", "answer block present before the list", Boolean(answer),
    answer ? "found, server-rendered" : "no .guide-answer section in the HTML source");

if (answer) {
  const picks = (answer.match(/<dt>/g) ?? []).length;
  add("FAIL", "answer names 3-6 decisions", picks >= 3 && picks <= 6, `${picks} picks`);

  const nums = (strip(answer).match(/\d[\d,.]*\s*(?:IDR|K\b)/gi) ?? []).length;
  add("FAIL", "answer carries extractable numbers", nums >= 1, `${nums} numeric facts`);

  add("WARN", "answer states how the list is chosen",
      /nobody can pay|chosen by us|checked on the record/i.test(strip(answer)), "trust line");
}

// ---------------------------------------------------------------- 2/3. cards

const bestFor = (html.match(/Best for:/g) ?? []).length;
const notFor = (html.match(/Not for:/g) ?? []).length;
add("FAIL", "cards carry Best for", bestFor >= 1, `${bestFor} cards`);
add("FAIL", "Not for covers >=60% of Best for",
    bestFor > 0 && notFor / bestFor >= 0.6,
    `${notFor}/${bestFor} = ${bestFor ? Math.round((notFor / bestFor) * 100) : 0}%`);

// ---------------------------------------------------------------- 4. price format

const text = strip(html);
const rawRange = text.match(/\b\d{1,3}\s*k\s*-\s*\d{1,3}\s*k\s*IDR\b|\bRp\s?\d{1,3}[.,]\d{3}\s*-\s*\d{1,3}[.,]\d{3}/gi) ?? [];
add("FAIL", "no raw price ranges without a band", rawRange.length === 0,
    rawRange.length ? `unbanded: ${[...new Set(rawRange)].join(", ")}` : "none found");

// ---------------------------------------------------------------- 5. good to know

// Scope to the Good to know container. Counting <summary> page-wide picks up
// footer and nav disclosures and silently inflates the number.
const faqList = html.match(/<div[^>]*class=["'][^"']*faq-list[^"']*["'][\s\S]*?(?=<\/section>)/i)?.[0] ?? "";
const faqQs = (faqList.match(/<summary[^>]*>/g) ?? []).length;
add("FAIL", "5-8 Good to know questions", faqQs >= 5 && faqQs <= 8, `${faqQs} questions`);
add("FAIL", "FAQPage JSON-LD emitted", hasType("FAQPage"), hasType("FAQPage") ? "present" : "missing");
add("WARN", "ItemList JSON-LD emitted", hasType("ItemList"), hasType("ItemList") ? "present" : "missing");

// ---------------------------------------------------------------- 6. freshness + links

const checked = text.match(/Last checked\s+(\d{1,2}\s+\w+\s+\d{4})/i);
add("FAIL", "visible last-checked date", Boolean(checked), checked?.[1] ?? "no 'Last checked' line");
if (checked) {
  const age = (Date.now() - Date.parse(checked[1])) / 86400000;
  add("WARN", "evidence younger than 180 days", age < 180, `${Math.round(age)} days old`);
}

const internal = new Set([...html.matchAll(/href=["'](\/[a-z0-9\-/]+)["']/gi)].map((m) => m[1]));
add("WARN", ">=3 internal links", internal.size >= 3, `${internal.size} distinct internal hrefs`);

// ---------------------------------------------------------------- sentence craft

// Measure only prose we authored — the answer block and the Good to know
// answers. Running this over the whole document scores the nav, the title and
// the footer, which tells you nothing about the writing.
const authored = [answer ?? "", ...(faqList.match(/<p class=["']faq-answer["'][\s\S]*?<\/p>/g) ?? [])]
  .map(strip).join(" ");
const sentences = authored.split(/(?<=[.!?])\s+/).filter((s) => s.split(" ").length > 3);
const long = sentences.filter((s) => s.split(" ").length > 25);
add("WARN", "no sentence over 25 words in the opening",
    long.length === 0, long.length ? `${long.length} long: "${long[0].slice(0, 80)}..."` : "all under 25");

const HYPE = /\b(stunning|hidden gem|must-visit|world-class|nestled|vibrant|unforgettable|iconic|breathtaking)\b/gi;
const hype = [...new Set(text.match(HYPE) ?? [])];
add("FAIL", "no hype filler adjectives", hype.length === 0, hype.length ? hype.join(", ") : "none");

// ---------------------------------------------------------------- report

const fails = results.filter((r) => r.level === "FAIL" && !r.ok);
const warns = results.filter((r) => r.level === "WARN" && !r.ok);

if (asJson) {
  console.log(JSON.stringify({ target, passed: fails.length === 0, results }, null, 2));
} else {
  console.log(`\n  ${target}\n`);
  for (const r of results) {
    const mark = r.ok ? "PASS" : r.level;
    console.log(`  ${mark.padEnd(5)} ${r.name.padEnd(42)} ${r.detail}`);
  }
  console.log(`\n  ${fails.length} failed, ${warns.length} warnings, ` +
              `${results.filter((r) => r.ok).length}/${results.length} passed\n`);
  if (fails.length) {
    console.log("  Machine checks only. Provenance, fit-vs-quality wording and");
    console.log("  section over-promising still need the human checklist in SKILL.md.\n");
  }
}

process.exit(fails.length ? 1 : 0);
