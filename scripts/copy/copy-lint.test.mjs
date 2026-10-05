import assert from "node:assert/strict";
import test from "node:test";
import { resolve } from "node:path";
import { HYPE, RULES, lintText, mask, familyOf, splitSentences, negated, normalizeField } from "./patterns.mjs";
import { extractProse, isProse, markPinned, pinnedCorpusFrom, SKIP_FILES } from "./extract-code-prose.mjs";
import { run, parseCsv, resortUnits, exactDuplicateOf } from "./lint.mjs";

const REPO = resolve(import.meta.dirname, "../..");
const PLACES = resolve(REPO, "docs/audits/2026-09-28-web/places.csv");

const codes = (r) => [...r.fails, ...r.warns].map((h) => h.code);
const failCodes = (r) => r.fails.map((h) => h.code);

// ---------------------------------------------------------------- masking

test("a venue called Hidden Gem Uluwatu is a name, not hype, when passed in names", () => {
  const text = "Hidden Gem Uluwatu serves breakfast until noon.";
  assert.deepEqual(failCodes(lintText(text)), ["H1"]);
  assert.deepEqual(failCodes(lintText(text, { names: ["Hidden Gem Uluwatu"] })), []);
});

test("mask replaces names, dishes and areas with placeholders but never Bali or generic single words", () => {
  const out = mask("Single Fin's deck at El Kabrón and oneeighty° above Uluwatu; Paradise is in Bali", { names: ["Single Fin", "El Kabrón", "oneeighty°", "Paradise"], areas: ["Uluwatu", "Bali"] });
  assert.equal(out, "⟨NAME⟩'s deck at ⟨NAME⟩ and ⟨NAME⟩ above ⟨AREA⟩; Paradise is in Bali");
  assert.deepEqual(failCodes(lintText("The best in Bali for a long lunch in Canggu.", { areas: ["Bali", "Canggu"] })), ["H1"]);
});

test("a dish from the menu does not trigger hype but the same word in our voice does", () => {
  assert.deepEqual(failCodes(lintText("Order the Vibrant Garden Bowl before 11am.", { dishes: ["Vibrant Garden Bowl"] })), []);
  assert.deepEqual(failCodes(lintText("A vibrant garden bowl before 11am.")), ["H1"]);
});

// ---------------------------------------------------------------- quotes and negation

test("H1 is quote-exempt only when the source is quoted; R1/R2 never are", () => {
  const quoted = 'The menu calls the bowl "vibrant and fresh" on its own site.';
  assert.deepEqual(failCodes(lintText(quoted)), ["H1"]);
  assert.deepEqual(failCodes(lintText(quoted, { sourceQuoted: true })), []);
  assert.deepEqual(failCodes(lintText('"A local favourite," says the owner.', { sourceQuoted: true })), ["R2"]);
  assert.deepEqual(failCodes(lintText('"4.8 stars on Google," says the sign.', { sourceQuoted: true })), ["R1"]);
});

test("negated review language is a disclaimer, not a claim", () => {
  assert.deepEqual(failCodes(lintText("It is not highly rated by us; we go for the view.")), []);
  assert.deepEqual(failCodes(lintText("Highly rated by locals for the view.")), ["R2"]);
  assert.ok(negated("We do not publish ratings", 18));
});

// ---------------------------------------------------------------- FAIL rules

test("world-class surf fails H1; signature dish only warns A10", () => {
  assert.deepEqual(failCodes(lintText("world-class surf")), ["H1"]);
  const r = lintText("signature dish");
  assert.deepEqual(r.fails, []);
  assert.deepEqual(codes(r), ["A10"]);
});

test("F1 generic openers apply to best_for only", () => {
  assert.deepEqual(failCodes(lintText("Perfect for couples who want a quiet table.", { field: "best_for" })), ["F1"]);
  assert.deepEqual(failCodes(lintText("Perfect for couples who want a quiet table.", { field: "why_its_here" })), []);
  assert.deepEqual(failCodes(lintText("Visitors wanting a polished resort spa.", { field: "bestFor" })), ["F1"]);
});

test("R3 quality warnings fail in not_for and best_for, not in body prose", () => {
  assert.deepEqual(failCodes(lintText("Anyone expecting quick plates; slow service at peak.", { field: "not_for" })), ["R3"]);
  assert.deepEqual(failCodes(lintText("Anyone expecting quick plates; slow service at peak.", { field: "why_its_here" })), []);
});

test("stub best_for fails S1 and F1 together", () => {
  assert.deepEqual(failCodes(lintText("Travellers looking for a verified place to eat in Canggu.", { field: "best_for" })), ["S1", "F1"]);
});

test("A9 category opener is enforced on new text only and survives area masking", () => {
  const street = "Restaurant on Jl. Raya Canggu in Canggu, open daily from 8am.";
  assert.deepEqual(failCodes(lintText(street, { field: "why_its_here" })), []);
  assert.deepEqual(failCodes(lintText(street, { field: "why_its_here", isNew: true })), ["A9"]);
  assert.deepEqual(failCodes(lintText("Day spa in Amed. The published treatment list runs to 18 items.", { field: "why_its_here", isNew: true, areas: ["Amed"] })), ["A9"]);
  assert.deepEqual(failCodes(lintText("Spa in Amed. The treatment list is short.", { field: "why_its_here", isNew: true })), ["A9"]);
  assert.deepEqual(failCodes(lintText("Spa in Amed. The treatment list is short.", { field: "best_for", isNew: true })), []);
});

test("allowlist suppresses one code for one match in one unit only", () => {
  const allowlist = [{ unit: "x#best_for", code: "H1", match: "iconic", reason: "owner's registered name", approvedBy: "selena" }];
  assert.deepEqual(failCodes(lintText("An iconic deck.", { unit: "x#best_for", allowlist })), []);
  assert.deepEqual(failCodes(lintText("An iconic deck.", { unit: "y#best_for", allowlist })), ["H1"]);
  assert.deepEqual(failCodes(lintText("An iconic, stunning deck.", { unit: "x#best_for", allowlist })), ["H1"]);
});

// ---------------------------------------------------------------- WARN rules

test("three verbless sentences in a row warn A8; past-tense prose does not", () => {
  assert.deepEqual(codes(lintText("Tired feet after a day of walking. A long reset before dinner. Quiet mornings on the terrace.")), ["A8"]);
  assert.ok(!codes(lintText("The kitchen opened in 2019. The owners moved from Jakarta. It changed last year.")).includes("A8"));
});

test("em-dash rule: first dash is free in not_for, three in forty words is not", () => {
  const r = lintText("A quiet table — it is loud", { field: "not_for" });
  assert.ok(!codes(r).includes("A4"));
  assert.equal(r.stats.emDashes, 1);
  const dense = lintText("The deck hangs over the break — surfers below, sun ahead — and the kitchen keeps it simple: fish tacos, cold beer, nothing clever — which is the point when the light goes orange and the whole terrace turns to face west together.");
  assert.ok(codes(dense).includes("A4"));
  assert.equal(dense.stats.words, 40);
  assert.equal(dense.stats.emDashes, 3);
});

test("rhetorical questions warn in body prose but not in FAQ questions or headings", () => {
  assert.deepEqual(codes(lintText("Looking for sunset? This is it, most evenings.", { field: "why_its_here" })), ["A6"]);
  assert.deepEqual(codes(lintText("Looking for sunset? This is it, most evenings.", { field: "faq_q" })), []);
  assert.deepEqual(codes(lintText("Is Uluwatu the right Bali base for you?", { field: "h1" })), []);
});

test("structure warnings: long sentence, repeated openers, tricolons, AI phrases, transitions", () => {
  const long = lintText("This single sentence runs on and on past the twenty five word limit because nobody stopped to put a full stop anywhere in it at all, which is tiring.");
  assert.deepEqual(codes(long), ["A7"]);
  assert.equal(long.stats.longSentences, 1);
  assert.deepEqual(codes(lintText("The deck is wide. The food is simple. The crowd is young.")), ["A11"]);
  const tri = lintText("Expect pizza, pasta and salads, with beer, wine or cocktails to follow.");
  assert.deepEqual(codes(tri), ["A5"]);
  assert.equal(tri.stats.tricolons, 2);
  assert.deepEqual(codes(lintText("Whether you’re after brunch or dinner, here’s the catch: it closes at nine.")), ["A1", "A1"]);
  assert.deepEqual(codes(lintText("Additionally, the garden seats forty.")), ["A2"]);
  assert.deepEqual(codes(lintText("It is truly a garden that seats forty.")), ["A3"]);
});

test("sentence splitting keeps street abbreviations whole", () => {
  assert.deepEqual(splitSentences("Restaurant on Jl. Raya Canggu in Canggu. Open daily. Foot Reflexology is 100K IDR for 60 minutes."), ["Restaurant on Jl. Raya Canggu in Canggu.", "Open daily.", "Foot Reflexology is 100K IDR for 60 minutes."]);
});

// ---------------------------------------------------------------- exported shape for check-page.mjs and the loop

test("HYPE is a global regex usable with String.match, and every rule declares its contract", () => {
  assert.ok(HYPE.flags.includes("g") && HYPE.flags.includes("i"));
  assert.deepEqual("Stunning and vibrant, stunning".match(HYPE), ["Stunning", "vibrant", "stunning"]);
  for (const rule of RULES) {
    assert.match(rule.code, /^(R\d|H1|S1|F1|A\d{1,2}|D1)$/);
    assert.ok(["FAIL", "WARN"].includes(rule.severity), rule.code);
    assert.ok(rule.fields === null || Array.isArray(rule.fields), rule.code);
    assert.equal(typeof rule.newOnly, "boolean", rule.code);
    assert.equal(typeof rule.quoteExempt, "boolean", rule.code);
    assert.equal(typeof rule.note, "string", rule.code);
    if (rule.re) assert.ok(rule.re.flags.includes("g"), `${rule.code} must be global`);
  }
  assert.deepEqual(RULES.filter((r) => r.newOnly).map((r) => r.code), ["A9", "D1"]);
  assert.equal(normalizeField("whyHere"), "why_its_here");
});

test("families are matched on raw text", () => {
  assert.equal(familyOf("Day spa in Amed. The published treatment list runs to 18 items — Traditional Massage."), "spa-formula");
  assert.equal(familyOf("Wellness spa in Canggu. The published treatment list runs to 9 items — Balinese Massage."), "spa-formula");
  assert.equal(familyOf("Restaurant on Jl. Raya Canggu in Canggu, open daily."), "street-template");
  assert.equal(familyOf("Travellers looking for a verified place to eat in Ubud."), "stub-best-for");
  assert.equal(familyOf("A budget massage — the list starts at 865K IDR."), "budget-massage");
  assert.equal(familyOf("Every Uluwatu trip crosses Single Fin eventually."), "");
});

// ---------------------------------------------------------------- code prose extraction

test("extractProse returns prose units with property paths and skips slug/href keys and chrome attributes", () => {
  const fixture = `
import { x } from "some module name here";
const AUTHOR = "Selena";
export const GUIDES = [
  {
    slug: "canggu-brunch-spots-for-families",
    href: "/canggu/best-brunch",
    title: "Where to eat breakfast in Canggu",
    evidence: ["Visited on a Tuesday in July 2026"],
    sections: [{ heading: "Why we chose these", body: \`Every place here was visited by \${AUTHOR} this year.\` }],
  },
];
type Mode = "today or explore or plan";
export default function Page() {
  console.log("debug line with four words");
  if (!GUIDES.length) throw new Error("No guides were loaded for this page");
  return (
    <main className="flex items-center gap-2 text-sm">
      <h1>The right place &amp; moment</h1>
      <p>{"Partners own fulfilment here."}</p>
      <img alt="A table by the sea at dawn" src="/x.jpg" />
      <a href="/places" aria-label="Open the full places list">All</a>
    </main>
  );
}
`;
  const units = extractProse("app/fixture/page.tsx", fixture);
  assert.deepEqual(
    units.map((u) => [u.path, u.kind, u.field, u.text]),
    [
      ["GUIDES[0].title", "string", "title", "Where to eat breakfast in Canggu"],
      ["GUIDES[0].sections[0].heading", "string", "heading", "Why we chose these"],
      ["GUIDES[0].sections[0].body", "template", null, "Every place here was visited by {AUTHOR} this year."],
      ["<JSX>", "jsx-text", null, "The right place & moment"],
      ["<JSX>", "string", null, "Partners own fulfilment here."],
      ["<JSX>@alt", "jsx-attr", null, "A table by the sea at dawn"],
    ],
  );
  assert.equal(units[0].file, "app/fixture/page.tsx");
  assert.equal(units[0].line, 8);
  assert.ok(units.every((u) => u.id === `${u.file}:${u.line}:${u.col}`));
});

test("isProse rejects class lists, column lists and paths, keeps sentences", () => {
  assert.equal(isProse("flex items-center gap-2 text-sm"), false);
  assert.equal(isProse("slug, name, district, why_its_here"), false);
  assert.equal(isProse("/places/single-fin?utm=x and more"), false);
  assert.equal(isProse("Tired feet after a day of walking"), true);
  assert.equal(isProse("Book ahead, weekends fill."), true);
  assert.equal(isProse("Too short"), false);
});

test("skip list covers API, admin, i18n, partner, privacy, terms and test files; pinned marks text a test asserts on", () => {
  for (const f of ["app/api/x/route.ts", "app/admin/page.tsx", "lib/i18n/en.ts", "app/partner/page.tsx", "app/privacy/page.tsx", "app/terms/page.tsx", "lib/x.test.ts", "components/shader-background/x.tsx"]) assert.ok(SKIP_FILES.test(`/${f}`), f);
  assert.ok(!SKIP_FILES.test("/lib/guides.ts"));
  const corpus = pinnedCorpusFrom("assert.match(page, /The right place for the moment you\\'re in, every day \\(nearly\\)/);\nassert.ok(html.includes(\"Open in Google Maps (external)\"));");
  const marked = markPinned([{ text: "The right place for the moment you're in, every day (nearly)" }, { text: "Totally unrelated sentence here, friends" }, { text: "Open in Google Maps (external)" }], corpus);
  assert.deepEqual(marked.map((u) => u.pinned), [true, false, true]);
});

// ---------------------------------------------------------------- lint.mjs over real inputs

test("parseCsv handles preamble comments, quoted commas, escaped quotes and newlines", () => {
  const rows = parseCsv('# comment\nslug,name,best_for\na,"Warung ""Bu"" Oka","Couples, late — ""fine""\nsecond line"\n');
  assert.deepEqual(rows, [{ slug: "a", name: 'Warung "Bu" Oka', best_for: 'Couples, late — "fine"\nsecond line' }]);
});

test("the 2026-09-28 crawl reproduces the known template families and duplicate best_for groups", async () => {
  const { units, summary } = await run({ places: PLACES, repoRoot: REPO });
  assert.equal(summary.families.total["stub-best-for"], 99);
  assert.ok(summary.families.total["street-template"] >= 380, `street-template ${summary.families.total["street-template"]}`);
  assert.ok(summary.families.total["spa-formula"] >= 300, `spa-formula ${summary.families.total["spa-formula"]}`);
  assert.ok(summary.duplicateBestFor.groups >= 30, `duplicate groups ${summary.duplicateBestFor.groups}`);
  assert.equal(summary.bySurface.db.units, units.length);
  assert.ok(units.every((u) => u.surface === "db" && ["FAIL", "WARN", "OK"].includes(u.severity)));
  // The stub best_for units are the S1+F1 failures the loop must clear first.
  const stubs = units.filter((u) => u.family === "stub-best-for");
  assert.ok(stubs.every((u) => u.codes.includes("S1") && u.codes.includes("F1")));
  // The crawl's verdict column stands in for why_its_here; a priority comes from stage-b scores.
  assert.ok(units.some((u) => u.field === "why_its_here" && u.priority > 0));
  const verified = exactDuplicateOf("Travellers looking for a verified place to eat in Ubud.", "best_for", units);
  assert.ok(verified.length >= 3);
});

test("A9 and D1 are added on a --new run only", async () => {
  const base = await run({ places: PLACES, repoRoot: REPO });
  assert.ok(!base.units.some((u) => u.codes.includes("A9") || u.codes.includes("D1")));
  const fresh = await run({ places: PLACES, repoRoot: REPO, isNew: true });
  assert.ok(fresh.units.some((u) => u.codes.split(" ").includes("A9")));
  assert.ok(fresh.units.some((u) => u.codes.split(" ").includes("D1")));
  assert.equal(fresh.summary.isNew, true);
});

test("resort pages are read as a visitor reads them: HTML stripped, FAQ questions exempt from A6", () => {
  const units = resortUnits([{ slug: "p", title: "Free Bali beach clubs", answer: "Two we could confirm as &#39;free&#39; with <strong>no minimum</strong>.", faq: [{ q_text: "Which clubs are actually free?", a_html: "Two of them, <em>both</em> in Sanur." }], tableRows: [["Byrd House", "Free entry", "No minimum — order à la carte; towel fee for the pool"]], cards: [] }]);
  assert.deepEqual(units.map((u) => [u.path, u.field, u.text]), [
    ["title", "title", "Free Bali beach clubs"],
    ["answer", "answer", "Two we could confirm as 'free' with no minimum."],
    ["faq[0].q", "faq_q", "Which clubs are actually free?"],
    ["faq[0].a", "faq_a", "Two of them, both in Sanur."],
    ["tableRows[0][2]", "table", "No minimum — order à la carte; towel fee for the pool"],
  ]);
  assert.deepEqual(codes(lintText(units[2].text, { field: units[2].field })), []);
});

// ---------------------------------------------------------------- mask robustness (coordinator request)

test("mask survives names with hyphens, ampersands, pipes, percent signs and parentheses", () => {
  const names = ["Kunang-Kunang Restaurant", "Tan-Ting Restaurant", "Artisan - Uluwatu", "12 Urban Cafe - Breakfast & Dinner | Movie night", "100% Vegan Kitchen", "Ulu Artisan (Ungasan)"];
  const out = mask("Kunang-Kunang Restaurant, Tan-Ting Restaurant, Artisan - Uluwatu, 12 Urban Cafe - Breakfast & Dinner | Movie night, 100% Vegan Kitchen and Ulu Artisan (Ungasan).", { names });
  for (const n of names) assert.ok(!out.includes(n), `${n} must be masked`);
  assert.doesNotMatch(out, /Kunang|Urban|Vegan|Ungasan/);
});

test("one alternation of 300 names over 5k words stays well under 200 ms", () => {
  const names = Array.from({ length: 300 }, (_, i) => `Venue Number ${i} Kitchen & Bar - Canggu`);
  const text = Array.from({ length: 5000 }, (_, i) => (i % 97 === 0 ? `Venue Number ${i % 300} Kitchen & Bar - Canggu` : "word")).join(" ");
  const t0 = performance.now();
  const r = lintText(text, { field: "why_its_here", names });
  assert.ok(performance.now() - t0 < 200, "lintText over 5k words with 300 names took too long");
  assert.ok(r.stats.words > 4000);
});

// ---------------------------------------------------------------- precision fixes from the 2026-10-05 baseline review

test("Dish Cult is a booking platform, not review language; a cult brand still is", () => {
  assert.deepEqual(failCodes(lintText("Book online (Dish Cult) for event nights and Sundays.")), []);
  assert.deepEqual(failCodes(lintText("Jakarta's cult neighbourhood coffee brand, here in its first Bali store.")), ["R2"]);
  assert.deepEqual(failCodes(lintText("A burger bar with a cult following.")), ["R2"]);
});

test("app reviewers are not review language; reviewers noting skill are", () => {
  assert.deepEqual(failCodes(lintText("This page is for app reviewers.")), []);
  assert.deepEqual(failCodes(lintText("Reviewers note skilled barbers and a slightly premium price.")), ["R2"]);
});

test("a FAQ question may repeat the search phrase; its answer may not", () => {
  assert.deepEqual(failCodes(lintText("What is Jimbaran famous for?", { field: "q" })), []);
  assert.deepEqual(failCodes(lintText("Jimbaran is famous for seafood dinners on the sand.", { field: "a" })), ["R2"]);
});

test("elevated describing height is a fact; elevated grading a dinner is hype", () => {
  assert.deepEqual(failCodes(lintText("Built around an elevated terrace overlooking Campuhan Ridge.")), []);
  assert.deepEqual(failCodes(lintText("Elevated ocean and sunset views from the rooftop.")), []);
  assert.deepEqual(failCodes(lintText("An elevated dinner and weekly jazz nights.")), ["H1"]);
});

test("the extractor skips evidence notes, which are working records and never rendered", () => {
  const src = `const ev = (f: string, n: string) => ({ f, n });
export const V = [{ verdict: "A cliff bar above the surf break with a long sunset deck.",
  evidence: [ev("identity", "Live booking listings on Chope and Dish Cult; active Instagram.")] }];`;
  const units = extractProse("lib/fixture/venues.ts", src);
  assert.deepEqual(units.map((u) => u.path), ["V[0].verdict"]);
});

test("an allowlist entry suppresses one code for one exact match in one unit and nothing wider", () => {
  const entry = { unit: "nusa-dua-resort-day-passes#tableRows[9][0]", code: "H1", match: "Paradise" };
  const text = "Hilton Bali · A Day in Paradise";
  assert.deepEqual(failCodes(lintText(text, { unit: entry.unit, allowlist: [entry] })), []);
  assert.deepEqual(failCodes(lintText(text, { unit: "some-other-page#tableRows[0][0]", allowlist: [entry] })), ["H1"]);
  assert.deepEqual(failCodes(lintText("A paradise of a pool.", { unit: entry.unit, allowlist: [entry] })), ["H1"]);
});

test("a zero-width character inside a hype word does not hide it", () => {
  assert.deepEqual(failCodes(lintText("A stu​nning cafe on the beach.")), ["H1"]);
});
