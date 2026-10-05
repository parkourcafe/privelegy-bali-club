import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  extractFacts,
  factDiff,
  normalizeText,
  parseCliArgs,
  parseNumber,
  splitSentences,
  stemCandidates,
} from "./fact-diff.mjs";

const canaries = JSON.parse(await readFile(new URL("./fixtures/canaries.json", import.meta.url), "utf8"));
const canon = (text) => extractFacts(text).facts.map((fact) => fact.canonical);

// --- canaries ----------------------------------------------------------------

for (const canary of canaries) {
  test(`canary ${canary.id}: ${canary.why}`, () => {
    const result = factDiff(canary.before, canary.after);
    assert.equal(result.verdict, canary.expect, JSON.stringify(result.rejects));
    if (canary.assert === "dropped") assert.ok(result.dropped.length > 0, "the deletion must be named");
    if (canary.assert === "polarity") assert.ok(result.warns.some((warn) => warn.type === "POLARITY"), JSON.stringify(result.warns));
  });
}

test("canary fixture has 30 mutations and 20 known-good paraphrases", () => {
  const mutations = canaries.filter((canary) => canary.id.startsWith("m"));
  const paraphrases = canaries.filter((canary) => canary.id.startsWith("p"));
  assert.equal(mutations.length, 30);
  assert.equal(paraphrases.length, 20);
  assert.ok(paraphrases.every((canary) => canary.expect === "PASS"));
  assert.equal(new Set(canaries.map((canary) => canary.id)).size, canaries.length);
});

test("known-good paraphrases produce zero false rejects", (t) => {
  const paraphrases = canaries.filter((canary) => canary.id.startsWith("p"));
  const falseRejects = paraphrases
    .map((canary) => ({ id: canary.id, result: factDiff(canary.before, canary.after) }))
    .filter(({ result }) => result.verdict === "REJECT");
  t.diagnostic(`false rejects on ${paraphrases.length} paraphrases: ${falseRejects.length}`);
  assert.deepEqual(falseRejects.map(({ id, result }) => `${id}: ${result.rejects.map((r) => r.canonical).join(", ")}`), []);
});

// --- worked example ------------------------------------------------------------

test("worked example: an added fit word rejects, the same rewrite without it passes", () => {
  const before = "Day spa in Amed. Foot Reflexology is 100K IDR for 60 minutes.";
  const rejected = factDiff(before, "A small day spa in Amed. An hour of foot reflexology costs 100K IDR.");
  assert.equal(rejected.verdict, "REJECT");
  assert.deepEqual(rejected.rejects.map((r) => [r.type, r.token, r.canonical]), [["LEX", "small", "LEX:small"]]);
  assert.equal(rejected.rejects[0].where, "A small day spa in Amed.");

  const passed = factDiff(before, "A day spa in Amed. An hour of foot reflexology costs 100K IDR.");
  assert.equal(passed.verdict, "PASS");
  assert.deepEqual(passed.rejects, []);
  assert.deepEqual(passed.dropped, []);
});

// --- money --------------------------------------------------------------------

test("money formats canonicalise to integer IDR", () => {
  for (const form of ["190K IDR", "Rp 190k", "IDR 190,000", "Rp190.000", "Rp. 190.000", "190.000 rupiah", "190,000 IDR"]) {
    assert.deepEqual(canon(form), ["MONEY:190000"], form);
  }
  assert.deepEqual(canon("1.2M IDR"), ["MONEY:1200000"]);
  assert.deepEqual(canon("2 million IDR"), ["MONEY:2000000"]);
  assert.deepEqual(canon("25 ribu"), ["MONEY:25000"]);
});

test("money ranges apply the unit of either end to both ends", () => {
  for (const form of ["35–70K", "35-70K", "35k-70k", "Rp 35,000–70,000", "35.000–70.000 IDR", "IDR 35K to 70K"]) {
    assert.deepEqual(canon(form), ["MONEY:35000", "MONEY:70000"], form);
  }
  assert.deepEqual(canon("100-250K"), ["MONEY:100000", "MONEY:250000"]);
});

test("thousands separators need exactly three digits; otherwise the mark is a decimal point", () => {
  assert.equal(parseNumber("190.000"), 190000);
  assert.equal(parseNumber("190,000"), 190000);
  assert.equal(parseNumber("1.500.000"), 1500000);
  assert.equal(parseNumber("1.5"), 1.5);
  assert.equal(parseNumber("1,5"), 1.5);
  assert.equal(parseNumber("7.00"), 7);
});

test("price bands and dollar amounts are separate from IDR", () => {
  assert.deepEqual(canon("$$"), ["BAND:2"]);
  assert.deepEqual(canon("$$$ territory"), ["BAND:3"]);
  assert.deepEqual(canon("$5 beers"), ["USD:5", "FOOD:beer"]);
});

// --- time -----------------------------------------------------------------------

test("clock formats canonicalise to HH:MM", () => {
  for (const form of ["7:00am", "7am", "07:00", "7.00 am", "7 a.m.", "7AM"]) {
    assert.deepEqual(canon(form), ["TIME:07:00"], form);
  }
  assert.deepEqual(canon("7pm"), ["TIME:19:00"]);
  assert.deepEqual(canon("12am"), ["TIME:00:00"]);
  assert.deepEqual(canon("12pm"), ["TIME:12:00"]);
  assert.deepEqual(canon("noon"), ["TIME:12:00"]);
  assert.deepEqual(canon("midnight"), ["TIME:00:00"]);
  assert.deepEqual(canon("until 24.00"), ["COUNT:24"]);
});

test("a bare dotted number is a time only with am/pm or when range-dashed to another time", () => {
  assert.deepEqual(canon("7.00"), ["COUNT:7"]);
  assert.deepEqual(canon("7.00–15.00"), ["TIME:07:00", "TIME:15:00"]);
  assert.deepEqual(canon("08.30 - 17.00"), ["TIME:08:30", "TIME:17:00"]);
});

test("a range with one meridiem shares it, or crosses noon when the hours fall", () => {
  assert.deepEqual(canon("8–11am"), ["TIME:08:00", "TIME:11:00"]);
  assert.deepEqual(canon("11–2pm"), ["TIME:11:00", "TIME:14:00"]);
  assert.deepEqual(canon("5–7pm"), ["TIME:17:00", "TIME:19:00"]);
  assert.deepEqual(canon("10 to 2am"), ["TIME:22:00", "TIME:02:00"]);
  assert.deepEqual(canon("8am–4pm"), ["TIME:08:00", "TIME:16:00"]);
});

test("the sentence-final dot is not swallowed into pm", () => {
  const [fact] = extractFacts("Kids are allowed after 7pm.").facts.filter((f) => f.type === "TIME");
  assert.equal(fact.token, "7pm");
  assert.equal(fact.canonical, "TIME:19:00");
});

test("late stays a word, weekdays and daily become DAY tokens", () => {
  assert.deepEqual(canon("open late"), ["LEX:late"]);
  assert.deepEqual(canon("Mon–Fri"), ["DAY:weekdays"]);
  assert.deepEqual(canon("Monday to Friday"), ["DAY:weekdays"]);
  assert.deepEqual(canon("closed Mondays"), ["DAY:mon"]);
  assert.deepEqual(canon("every day"), ["DAY:daily"]);
  assert.deepEqual(canon("daily"), ["DAY:daily"]);
  assert.deepEqual(canon("on weekends"), ["DAY:weekends"]);
  assert.deepEqual(canon("80K a day"), ["MONEY:80000", "DAY:daily"]);
  assert.deepEqual(canon("a day spa"), []);
});

// --- duration ----------------------------------------------------------------

test("durations canonicalise to minutes", () => {
  for (const form of ["60 minutes", "60-minute", "60 min", "1 hour", "1h", "an hour", "one hour", "sixty minutes"]) {
    assert.deepEqual(canon(form), ["DURATION:60"], form);
  }
  for (const form of ["90 min", "1.5 hours", "an hour and a half", "one and a half hours", "ninety minutes"]) {
    assert.deepEqual(canon(form), ["DURATION:90"], form);
  }
  assert.deepEqual(canon("two hours"), ["DURATION:120"]);
  assert.deepEqual(canon("half an hour"), ["DURATION:30"]);
  assert.deepEqual(canon("a 2-hour lesson"), ["DURATION:120"]);
  assert.deepEqual(canon("5 minutes' walk"), ["DURATION:5"]);
  assert.deepEqual(canon("60–90 minutes"), ["DURATION:60", "DURATION:90"]);
});

// --- distance and the two meanings of m -------------------------------------------

test("lowercase m is metres unless the number carries a currency prefix", () => {
  assert.deepEqual(canon("170m from the beach"), ["DISTANCE:170"]);
  assert.deepEqual(canon("170 m"), ["DISTANCE:170"]);
  assert.deepEqual(canon("Rp 1.5m"), ["MONEY:1500000"]);
  assert.deepEqual(canon("IDR 2m"), ["MONEY:2000000"]);
  assert.deepEqual(canon("1.5M"), ["MONEY:1500000"]);
});

test("distances canonicalise to metres", () => {
  assert.deepEqual(canon("2 km"), ["DISTANCE:2000"]);
  assert.deepEqual(canon("2,000 metres"), ["DISTANCE:2000"]);
  assert.deepEqual(canon("500 metres"), ["DISTANCE:500"]);
  assert.deepEqual(canon("1.5 km"), ["DISTANCE:1500"]);
  assert.deepEqual(canon("200–400m"), ["DISTANCE:200", "DISTANCE:400"]);
});

// --- counts, years, percentages, alphanumerics --------------------------------------

test("numbers that are not quantities of money, time or distance are still facts", () => {
  assert.deepEqual(canon("18 items"), ["COUNT:18"]);
  assert.deepEqual(canon("two shalas"), ["COUNT:2"]);
  assert.deepEqual(canon("since 2015"), ["YEAR:2015"]);
  assert.deepEqual(canon("10% service charge"), ["PERCENT:10"]);
  assert.deepEqual(canon("2nd floor"), ["ORDINAL:2"]);
  assert.deepEqual(canon("125cc bikes"), ["ALNUM:125cc"]);
  assert.deepEqual(canon("rated 4.5"), ["COUNT:4.5"]);
});

test("pronoun uses of one and vague quantities are not counts", () => {
  assert.deepEqual(canon("one of the few"), []);
  assert.deepEqual(canon("the one place"), []);
  assert.deepEqual(canon("a couple of tables"), []);
  assert.deepEqual(canon("a few tables"), []);
  assert.deepEqual(canon("one scoop"), ["COUNT:1"]);
});

// --- proper nouns ------------------------------------------------------------------

test("accents are stripped so Kabrón and Kabron are one name", () => {
  assert.equal(normalizeText("Kabrón Café"), "Kabron Cafe");
  assert.deepEqual(canon("at Kabrón"), ["PROPER:kabron"]);
  assert.deepEqual(canon("at Kabron"), ["PROPER:kabron"]);
});

test("street prefixes join the following capitalised words into one token", () => {
  assert.deepEqual(canon("on Jl. Pantai Berawa No. 99"), ["COUNT:99", "PROPER:jl pantai berawa"]);
  assert.deepEqual(canon("on Jalan Raya Ubud"), ["PROPER:jalan raya ubud"]);
  assert.deepEqual(canon("near Finns Beach Club"), ["PROPER:finns beach club"]);
});

test("a sentence-initial capital is a name only when it is not a function word and the other text lacks it", () => {
  assert.equal(factDiff("Opens at 7am.", "Doors open at 7am.").verdict, "PASS");
  assert.equal(factDiff("Opens at 7am.", "Kabron opens at 7am.").verdict, "REJECT");
  assert.equal(factDiff("Booking is by WhatsApp.", "Book by WhatsApp.").verdict, "PASS");
  assert.equal(factDiff("Opens at 7am.", "Prices start at 7am.").verdict, "PASS");
});

test("case changes on names are neither rejects nor drops", () => {
  const result = factDiff("Foot Reflexology is 100K IDR.", "foot reflexology is 100K IDR.");
  assert.equal(result.verdict, "PASS");
  assert.deepEqual(result.dropped, []);
});

// --- sentence splitting -------------------------------------------------------------

test("abbreviations do not split a sentence", () => {
  assert.deepEqual(splitSentences("The spa is on Jl. Raya Ubud. Booking is by WhatsApp."), [
    "The spa is on Jl. Raya Ubud.",
    "Booking is by WhatsApp.",
  ]);
  assert.deepEqual(splitSentences("Address is Jl. Pantai Berawa No. 99. Open daily."), [
    "Address is Jl. Pantai Berawa No. 99.",
    "Open daily.",
  ]);
  assert.deepEqual(splitSentences("Costs Rp. 25.000 a plate. Cash only."), ["Costs Rp. 25.000 a plate.", "Cash only."]);
  assert.deepEqual(splitSentences("Opens at 7 a.m. Breakfast runs until 11am."), ["Opens at 7 a.m.", "Breakfast runs until 11am."]);
  assert.deepEqual(splitSentences("Near Mt. Agung, e.g. Amed. Dr. Oen is next door."), ["Near Mt. Agung, e.g. Amed.", "Dr. Oen is next door."]);
});

// --- lexicon and food ----------------------------------------------------------------

test("lexicon variants share one canonical", () => {
  assert.deepEqual(canon("cosy"), canon("cozy"));
  assert.deepEqual(canon("air-con"), canon("AC"));
  assert.deepEqual(canon("gluten free"), canon("gluten-free"));
  assert.deepEqual(canon("children welcome"), canon("kids welcome"));
  assert.deepEqual(canon("Flat white"), ["FOOD:flat white"]);
  assert.deepEqual(canon("croissants"), canon("croissant"));
  assert.deepEqual(canon("Nasi Goreng 25K"), ["MONEY:25000", "FOOD:nasi goreng"]);
});

test("food words in the rewrite only are rejects; food words removed are drops", () => {
  const added = factDiff("Coffee is 35K IDR.", "Coffee is 35K IDR and the croissants are fresh.");
  assert.equal(added.verdict, "REJECT");
  assert.deepEqual(added.rejects.map((r) => r.canonical), ["FOOD:croissant"]);
  const removed = factDiff("Coffee and croissants from 7am.", "Coffee from 7am.");
  assert.equal(removed.verdict, "PASS");
  assert.deepEqual(removed.dropped.map((d) => d.canonical), ["FOOD:croissant"]);
});

test("allowed.lexicon words become hard tokens and are exempt from NEW_TERM", () => {
  const allowed = { lexicon: ["shirodhara"] };
  const invented = factDiff("Day spa in Amed.", "Day spa in Amed offering shirodhara.", { allowed });
  assert.equal(invented.verdict, "REJECT");
  assert.deepEqual(invented.rejects.map((r) => r.canonical), ["LEX:shirodhara"]);
  const kept = factDiff("Day spa in Amed with shirodhara.", "Shirodhara is on the list at this Amed day spa.", { allowed });
  assert.equal(kept.verdict, "PASS");
  assert.ok(!kept.warns.some((w) => w.type === "NEW_TERM" && /shirodhara/i.test(w.token)));
});

// --- allowed set and modes -----------------------------------------------------------

test("names, area and district are allowed in both modes; evidence only in evidence mode", () => {
  const before = "Day spa in Amed. Booking is by WhatsApp.";
  const after = "Day spa in Amed near Jemeluk Bay, Karangasem. Booking is by WhatsApp.";
  assert.equal(factDiff(before, after).verdict, "REJECT");
  assert.equal(factDiff(before, after, { allowed: { names: ["Jemeluk Bay"], district: "Karangasem" } }).verdict, "PASS");

  const evidence = ["Facilities: pool, parking. Open 8am–8pm."];
  const withPool = "Day spa in Amed with a pool. Booking is by WhatsApp.";
  assert.equal(factDiff(before, withPool, { allowed: { evidence } }).verdict, "REJECT");
  assert.equal(factDiff(before, withPool, { allowed: { evidence }, mode: "evidence" }).verdict, "PASS");
  assert.throws(() => factDiff(before, after, { mode: "loose" }), /Unknown mode/);
});

test("the result shape carries facts for both sides", () => {
  const result = factDiff("Opens at 7am.", "Opens at 7am.");
  assert.deepEqual(Object.keys(result), ["verdict", "rejects", "dropped", "warns", "facts"]);
  assert.deepEqual(result.facts.before, [{ type: "TIME", token: "7am", canonical: "TIME:07:00", sentence: 0 }]);
  assert.deepEqual(result.facts.after, result.facts.before);
});

// --- warnings -------------------------------------------------------------------------

test("a lowercase content word absent from the source is a NEW_TERM warning, not a reject", () => {
  const result = factDiff("Open daily.", "Open daily, with hammocks.");
  assert.equal(result.verdict, "PASS");
  assert.deepEqual(result.warns, [{ type: "NEW_TERM", token: "hammocks", sentence: "Open daily, with hammocks." }]);
});

test("light stemming keeps inflections of source words out of NEW_TERM", () => {
  assert.ok(stemCandidates("treatments").has("treatment"));
  assert.ok(stemCandidates("booking").has("book"));
  assert.ok(stemCandidates("roasted").has("roast"));
  assert.ok(stemCandidates("stopped").has("stop"));
  assert.ok(stemCandidates("mostly").has("most"));
  const result = factDiff("The treatment list runs to 18 items.", "There are 18 treatments listed.");
  assert.deepEqual(result.warns, []);
});

test("polarity flips warn only when a hard token anchors the sentence", () => {
  const anchored = factDiff("Kids are not allowed after 7pm.", "Kids are allowed after 7pm.");
  assert.equal(anchored.verdict, "PASS");
  assert.deepEqual(anchored.warns, [{ type: "POLARITY", token: "7pm", sentence: "Kids are allowed after 7pm." }]);
  const contraction = factDiff("Cards are not accepted at the Ubud branch.", "Cards aren't accepted at the Ubud branch.");
  assert.deepEqual(contraction.warns, []);
});

test("hyphenated free and house numbers are not negations", () => {
  assert.deepEqual(factDiff("Gluten-free pancakes 45K IDR.", "Pancakes are 45K IDR and gluten-free.").warns, []);
  assert.deepEqual(factDiff("Jl. Raya No. 12, open 8am.", "Open 8am at Jl. Raya 12.").warns, []);
});

test("a comma replacing a semicolon does not count as a polarity change", () => {
  const result = factDiff("Cash only; no cards.", "Cash only, no cards.");
  assert.deepEqual(result.warns, []);
});

// --- CLI ------------------------------------------------------------------------------

test("CLI argument parsing", () => {
  const parsed = parseCliArgs(["--before", "a", "--after", "b", "--names", "Kabron, Finns", "--area", "Bukit", "--district=Uluwatu", "--mode", "evidence", "--json"]);
  assert.equal(parsed.before, "a");
  assert.equal(parsed.after, "b");
  assert.deepEqual(parsed.names, ["Kabron", "Finns"]);
  assert.equal(parsed.area, "Bukit");
  assert.equal(parsed.district, "Uluwatu");
  assert.equal(parsed.mode, "evidence");
  assert.equal(parsed.json, true);
  assert.throws(() => parseCliArgs(["--before", "a"]), /--after/);
  assert.throws(() => parseCliArgs(["--before", "a", "--after", "b", "--mode", "loose"]), /Unknown mode/);
  assert.throws(() => parseCliArgs(["--before", "a", "--after", "b", "--bogus"]), /Unknown argument/);
});

test("CLI exits 0 on PASS, 1 on REJECT and 2 on usage errors", () => {
  const script = fileURLToPath(new URL("./fact-diff.mjs", import.meta.url));
  const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: "utf8" });

  const pass = run("--before", "Opens at 7:00am.", "--after", "Opens at 07:00.", "--json");
  assert.equal(pass.status, 0, pass.stderr);
  assert.equal(JSON.parse(pass.stdout).verdict, "PASS");

  const reject = run("--before", "Day spa in Amed.", "--after", "A small day spa in Amed.");
  assert.equal(reject.status, 1);
  assert.match(reject.stdout, /^REJECT\n/);
  assert.match(reject.stdout, /LEX "small"/);

  const usage = run("--before", "x");
  assert.equal(usage.status, 2);
  assert.match(usage.stderr, /--after/);
});

test("a range starting at 12 keeps the stated half of the day", () => {
  assert.equal(factDiff("Best around 12–3pm.", "Best from noon to 3pm.").verdict, "PASS");
  assert.equal(factDiff("Open 12–3am on weekends.", "Open midnight to 3am on weekends.").verdict, "PASS");
  assert.equal(factDiff("Best around 12–3pm.", "Best from midnight to 3pm.").verdict, "REJECT");
  assert.equal(factDiff("Lunch 11–2pm.", "Lunch 11am to 2pm.").verdict, "PASS");
});
