// The one list of machine-sounding patterns for Other Bali public copy. The
// rewrite loop, lint.mjs and check-page.mjs import it, so a word enters the
// standard here once and nowhere else. Plain ESM, no dependencies.
//
// FAIL rules break a guardrail (#2 ratings and review-derived language, #9
// quality warnings, #10 stubs standing in for facts) or are hype in our own
// voice. WARN rules are style smells a human weighs. newOnly rules describe how
// the current catalogue was generated; they gate rewritten text only, because
// on the baseline they would drown the queue in what the family column already
// counts.
//
// Regex literals here are ported from docs/audits/2026-09-28-web/tools/checks.mjs
// (frozen audit artefact) and extended where the task says so.

// "elevated" is hype when it grades food or an evening and a plain fact when it
// describes height: "an elevated terrace overlooking Campuhan Ridge" was a
// false hit in the 2026-10-05 baseline.
export const HYPE =
  /\b(stunning|hidden gem|must-visit|must-try|world-class|nestled|tucked away|vibrant|unforgettable|iconic|breathtaking|paradise|oasis|idyllic|magical|unparalleled|best-kept secret|instagrammable|culinary journey|culinary experience|elevate|elevated(?! (?:terrace|deck|decks|platform|position|walkway|boardwalk|ground|floor|views?|ocean|sea)\b)|elevates|indulge|boasts|a testament to|landmark|best in bali)\b/gi;

export const RATING =
  /\b[1-5][.,]\d\s*(?:★|\/\s*5\b|out of 5\b|stars?\b)|\b[1-5]\s*★|\b[1-5](?:[.,]\d)?\s*out of 5\b|google (?:rating|reviews?)\b|\b\d{2,}(?:,\d{3})*\s+(?:google\s+)?reviews\b|\brated\s+[1-5](?:[.,]\d)?\b/gi;

// "cult" matched Dish Cult, a booking platform, five times in the baseline, and
// "reviewers" matched the app-store reviewers page; both lookbehinds keep the
// review-derived sense ("Jakarta's cult coffee brand", "reviewers note").
export const REVIEW_DERIVED =
  /\b(highly[- ]rated|top[- ]rated|well[- ]reviewed|well[- ]regarded|well[- ]rated|excellent[- ]rated|(?<!\bapp )reviewers|guests rave|rave reviews|five[- ]star reviews|(?<!\bdish )cult(?: following| favou?rite| status| classic)?|beloved|renowned|legendary|crowd favou?rite|popular with|popular for|famous for|favou?rite of|local favou?rite)\b/gi;

export const QUALITY_WARN =
  /\b(slow service|rude|dirty|overpriced|poor service|mediocre|disappointing|unhygienic|unfriendly|not worth|bad food)\b/gi;

export const STUB =
  /\b(verified (dining|hospitality|Bali) (venue|listing|restaurant)|verified place to eat|remains under review|handled externally by|reserve a table through|Media pending|verified details (below|only)|Internal review|TODO|TBD|lorem ipsum)\b/gi;

export const BEST_FOR_OPENER =
  /^(perfect|ideal|great|good) for\b|^travellers (looking|who)|^those who|^visitors (who|wanting|looking)|^people who/gi;

// Case-sensitive on purpose: the "<Category> … in Amed." formula is recognised
// by the capitalised area name, and matching runs on masked text where that
// name may already be ⟨AREA⟩.
export const CATEGORY_OPENER =
  /^(Restaurant|Cafe|Café|Bar|Day spa|Spa|Warung|Hotel|Villa|Yoga studio|Gym|Beach club|Bakery|Coffee shop)\b[^.]{0,80}\b(on|in|at) (Jl\.?|Jalan|Gang|Banjar|[A-Z][a-z]+\.|⟨AREA⟩\.?)/g;

export const AI_PHRASES =
  /\bwhether you(?:'re| are)?\b|\bhere's (?:the|what|why|how)\b|\b(?:the )?honest catch\b|\bsweet spot\b|\bnot just .{1,30}? but\b|\bmore than just\b|\bworth noting\b|\bwhen it comes to\b|(?<=^|[.!?]\s)(?:in short|overall|ultimately|all in all|at the end of the day)\b|\bthat said\b|\boffers an?\b|\bdelve\b|\bembark\b|\bseamless(?:ly)?\b|\bpicture this\b|\bgame-changer\b|\blook no further\b|\ba (?:true|real) gem\b/gi;

export const TRANSITIONS = /\b(moreover|furthermore|additionally|notably|in addition)\b/gi;
export const INTENSIFIERS = /\b(really|very|truly|genuinely|absolutely|incredibly|extremely)\b/gi;
export const SOFT_WORDS = /\b(signature|serious|reliable|proper|go-to|solid|decent)\b/gi;
// A spaced en dash is the same habit typed on a different keyboard.
export const EM_DASH = /—|\s–\s/g;
// "X, Y and Z" with items of one to four words; "X, Y, and Z" counts too.
export const TRICOLON =
  /\b([^\s,.;:—]+(?: [^\s,.;:—]+){0,3}), ([^\s,.;:—]+(?: [^\s,.;:—]+){0,3}),? (?:and|or) ([^\s,.;:—]+)/gi;

// Fields where a question is the form, not a rhetorical device.
export const QUESTION_FIELDS = new Set(["faq_q", "q_text", "question", "heading", "headings", "h1", "h2", "h3", "title", "meta_title", "metaTitle"]);

// Code and resort surfaces name the same fields differently; rules are keyed
// on the venue-record names.
const FIELD_ALIASES = {
  bestfor: "best_for",
  best_for: "best_for",
  notfor: "not_for",
  not_for: "not_for",
  whyhere: "why_its_here",
  whyitshere: "why_its_here",
  why_its_here: "why_its_here",
  verdict: "why_its_here",
  whattoexpect: "what_to_expect",
  what_to_expect: "what_to_expect",
  whattoorder: "what_to_order",
  what_to_order: "what_to_order",
  priceanchor: "price_anchor",
  price_anchor: "price_anchor",
  q: "faq_q",
  q_text: "faq_q",
  question: "faq_q",
  a: "faq_a",
  a_html: "faq_a",
  answer: "faq_a",
  heading: "heading",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  title: "title",
  metatitle: "meta_title",
};
export function normalizeField(name) {
  if (!name) return null;
  const key = String(name).replace(/[^a-z_]/gi, "").toLowerCase();
  return FIELD_ALIASES[key] ?? FIELD_ALIASES[key.replace(/_/g, "")] ?? name;
}

// Template families are structural signatures of generated text. They are
// matched on raw text (names unmasked) and fill the queue's `family` column.
// spa-formula also matches the generator's own sentence without the "spa in"
// opener: 110 of the 269 generated wellness verdicts open with "Wellness spa
// in", "Massage studio in" or "Beauty salon in" and are the same template.
export const FAMILIES = [
  { family: "street-template", re: /^(Restaurant|Cafe|Café|Bar|Warung|Hotel|Villa|Yoga studio|Gym|Beach club|Bakery|Coffee shop)\b[^.]{0,80}\b(on|in|at) (Jl\.?|Jalan|Gang|Banjar)/i },
  { family: "spa-formula", re: /^(Day )?spa in .{1,40}\. The published treatment list runs to \d+ items|\bThe published treatment list runs to \d+ items\b|treatments run up to \d+ minutes/i },
  { family: "stub-best-for", re: /^Travellers looking for a verified place to eat/i },
  { family: "budget-massage", re: /^A budget massage — the list starts at/i },
];
export function familyOf(text) {
  const t = String(text ?? "");
  for (const f of FAMILIES) if (f.re.test(t)) return f.family;
  return "";
}

// ---------------------------------------------------------------- masking

export const NAME_TOKEN = "⟨NAME⟩";
export const DISH_TOKEN = "⟨DISH⟩";
export const AREA_TOKEN = "⟨AREA⟩";

// A single generic word used as a venue name would wipe real copy everywhere:
// a spa called "Paradise" must not hide "paradise" on every other card, and
// masking "Bali" would hide "best in Bali".
const GENERIC = new Set(["bali", "spa", "bar", "cafe", "café", "restaurant", "warung", "kitchen", "beach", "club", "the", "villa", "hotel", "resort", "paradise", "oasis", "landmark", "iconic", "vibrant", "magical", "garden", "house", "home", "coffee", "surf", "yoga", "studio", "wellness", "massage"]);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const compiled = new WeakMap();
function alternation(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  if (compiled.has(list)) return compiled.get(list);
  const terms = [...new Set(list.map((s) => String(s ?? "").trim()).filter((s) => s.length >= 3 && !(s.split(/\s+/).length === 1 && GENERIC.has(s.toLowerCase()))))].sort((a, b) => b.length - a.length);
  // Unicode-aware boundaries: \b fails on "oneeighty°" and "El Kabrón".
  const re = terms.length ? new RegExp(`(?<![\\p{L}\\p{N}])(?:${terms.map(escapeRe).join("|")})(?![\\p{L}\\p{N}])`, "giu") : null;
  compiled.set(list, re);
  return re;
}

export function mask(text, { names = [], dishes = [], areas = [] } = {}) {
  let out = String(text ?? "");
  for (const [list, token] of [[names, NAME_TOKEN], [dishes, DISH_TOKEN], [areas, AREA_TOKEN]]) {
    const re = alternation(list);
    if (re) out = out.replace(re, token);
  }
  return out;
}

// ---------------------------------------------------------------- text helpers

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", hellip: "…", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", middot: "·", deg: "°" };
export function decodeEntities(s) {
  return String(s ?? "").replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") return String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}
// Generated pages store prose as HTML fragments; the lint reads what a visitor reads.
export const stripHtml = (s) =>
  decodeEntities(String(s ?? "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?)”’])/g, "$1")
    .trim();

const matchAll =(text, re) => [...text.matchAll(new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`))];
const countMatches = (text, re) => matchAll(text, re).length;

// Ported from checks.mjs:293 — a claim preceded by a negation within the same
// sentence is a disclaimer, not the claim.
export function negated(t, i) {
  return /\b(not|no|never|without|nor|don't|doesn't|do not|does not|isn't|is not|we do not|rather than|instead of|separate from)\b[^.]{0,40}$/i.test(t.slice(Math.max(0, i - 60), i));
}

export function countWords(text) {
  return String(text ?? "")
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w) || w.includes("⟨")).length;
}

const ABBREV_END = /(?:\b(?:Jl|Jln|Gg|No|Mr|Mrs|Ms|Dr|St|Rp|approx|vs|e\.g|i\.e|etc|Kec|Kab|Mt)|\b[A-Z])\.$/;
export function splitSentences(text) {
  const parts = String(text ?? "").split(/(?<=[.!?…])\s+(?=["“(⟨]?[A-Z0-9])/u);
  const out = [];
  for (const p of parts) {
    if (out.length && ABBREV_END.test(out[out.length - 1])) out[out.length - 1] += ` ${p}`;
    else out.push(p);
  }
  return out.map((s) => s.trim()).filter(Boolean);
}

const quotedSpans = (t) => matchAll(t, /"[^"\n]{1,400}"|“[^”\n]{1,400}”/g).map((m) => [m.index, m.index + m[0].length]);
const inQuote = (spans, i) => spans.some(([a, b]) => i > a && i < b);

// Heuristic finite-verb test for A8. A sentence "has a verb" when a token is a
// listed auxiliary/common verb or contraction, or a regular past form follows a
// subject-shaped token (pronoun, determiner + noun, or a masked ⟨NAME⟩).
// Participle fragments like "Facial booked the same day." stay verbless, which
// is the generated staccato the rule exists for; an unlisted third-person verb
// ("The team sources fish daily") is a known false negative.
const VERBS = new Set(
  "am is are was were be been being do does did have has had can could will would shall should may might must need needs ought get gets got go goes went gone come comes came run runs ran make makes made take takes took taken give gives gave see sees saw know knows knew think thinks thought find finds found want wants tell tells told ask asks put puts keep keeps kept let lets begin begins began seem seems help helps show shows hear hears play plays move moves live lives believe bring brings brought happen happens write writes sit sits sat stand stands stood lose loses pay pays paid meet meets include includes continue continues set sets learn learns change changes lead leads understand watch watches follow follows stop stops create creates speak speaks read reads spend spends grow grows open opens close closes walk walks offer offers remember remembers love loves consider considers appear appears buy buys wait waits serve serves send sends expect expects build builds stay stays fall falls cut cuts reach reaches remain remains suggest suggests raise raises pass passes sell sells require requires report reports decide decides pull pulls return returns explain explains hope hopes develop develops carry carries break breaks receive receives agree agrees support supports hit hits produce produces eat eats cover covers catch catches draw draws choose chooses cause causes point points listen listens allow allows mean means hold holds turn turns start starts end ends work works look looks feel feels try tries leave leaves call calls use uses say says fill fills pour pours cook cooks book books skip skips arrive arrives head heads cost costs charge charges deliver delivers roast roasts bake bakes brew brews mix mixes order orders check checks wear wears pack packs plan plans avoid avoids aim aims pick picks share shares matter matters suit suits fit fits lean leans tend tends rely relies depend depends shut shuts rent rents hire hires sell sells drop drops drive drives ride rides swim swims surf surfs climb climbs hike hikes dine dines drink drinks sip sips taste tastes smell smells sound sounds stretch stretches shift shifts stick sticks hang hangs lie lies lay lays face faces overlook overlooks source sources specialise specialises specialize specializes".split(" "),
);
const SUBJECT_SHAPED = new Set(["i", "you", "we", "they", "he", "she", "it", "who", "which", "that", "this", "there", "⟨name⟩"]);
const DETERMINERS = new Set(["the", "a", "an", "this", "that", "these", "those", "its", "their", "our", "your", "each", "every", "both", "most", "many", "some"]);
export function hasFiniteVerb(sentence) {
  const tokens = sentence.toLowerCase().replace(/[^\p{L}\p{N}'’⟨⟩\s-]/gu, " ").split(/\s+/).filter(Boolean);
  return tokens.some((tok, i) => {
    if (VERBS.has(tok) || /(?:'|’)(?:s|re|ve|ll|d|m)$|n(?:'|’)t$/.test(tok)) return true;
    if (!/[a-z]ed$/.test(tok) || i === 0) return false;
    return SUBJECT_SHAPED.has(tokens[i - 1]) || (i >= 2 && DETERMINERS.has(tokens[i - 2]));
  });
}

// ---------------------------------------------------------------- computed WARN checks

const density = (perWords) => (ctx, rule) => {
  const ms = matchAll(ctx.text, rule.re).filter((m) => !(rule.quoteExempt && ctx.sourceQuoted && inQuote(ctx.quotes, m.index)));
  if (!ms.length || ms.length <= ctx.words / perWords) return [];
  return [{ match: ms.map((m) => m[0]).join(", "), index: ms[0].index, detail: `${ms.length} in ${ctx.words} words (limit 1 per ${perWords})` }];
};

function stackedTransitions(ctx, rule) {
  const ms = matchAll(ctx.text, rule.re);
  const opening = ms.filter((m) => (m.index === 0 || /[.!?…]\s$/.test(ctx.text.slice(Math.max(0, m.index - 2), m.index))) && /^,/.test(ctx.text.slice(m.index + m[0].length)));
  if (ms.length < 2 && !opening.length) return [];
  return [{ match: ms.map((m) => m[0]).join(", "), index: ms[0].index, detail: opening.length ? `"${opening[0][0]}," opens a sentence` : `${ms.length} transition words in one unit` }];
}

function emDashes(ctx) {
  const all = matchAll(ctx.text, EM_DASH);
  if (!all.length) return [];
  // In best_for / not_for the first dash is the house "fit — reason" form.
  const free = ctx.field === "best_for" || ctx.field === "not_for" ? 1 : 0;
  const effective = all.length - free;
  const perSentence = Math.max(0, ...ctx.sentences.map((s) => countMatches(s, EM_DASH) - free));
  const at = all[Math.min(free, all.length - 1)];
  if (effective > 0 && effective > ctx.words / 50) return [{ match: at[0].trim(), index: at.index, detail: `${all.length} em dashes in ${ctx.words} words (limit 1 per 50${free ? ", first free" : ""})` }];
  if (perSentence >= 2) return [{ match: at[0].trim(), index: at.index, detail: `${perSentence + free} em dashes in one sentence` }];
  return [];
}

function tricolons(ctx) {
  const ms = matchAll(ctx.text, TRICOLON);
  if (ms.length < 2 || ctx.words > 80) return [];
  return [{ match: ms[0][0], index: ms[0].index, detail: `${ms.length} "X, Y and Z" lists in ${ctx.words} words` }];
}

function rhetoricalQuestions(ctx) {
  if (QUESTION_FIELDS.has(ctx.field)) return [];
  return ctx.sentences.filter((s) => s.includes("?")).map((s) => ({ match: s.slice(0, 80), index: ctx.text.indexOf(s), detail: "question in body prose" }));
}

function longSentences(ctx) {
  return ctx.sentences
    .map((s) => [s, countWords(s)])
    .filter(([, n]) => n > 25)
    .map(([s, n]) => ({ match: s.slice(0, 80), index: ctx.text.indexOf(s), detail: `${n} words` }));
}

const runs = (items, same) => {
  const out = [];
  let start = 0;
  for (let i = 1; i <= items.length; i += 1) {
    if (i === items.length || !same(items[i], items[start])) {
      if (i - start >= 3) out.push([start, i - start]);
      start = i;
    }
  }
  return out;
};

function verblessRuns(ctx) {
  const flags = ctx.sentences.map((s) => (hasFiniteVerb(s) ? "verb" : "none"));
  return runs(flags, (a, b) => a === b)
    .filter(([start]) => flags[start] === "none")
    .map(([start, len]) => ({ match: ctx.sentences[start].slice(0, 80), index: ctx.text.indexOf(ctx.sentences[start]), detail: `${len} verbless sentences in a row` }));
}

function repeatedOpeners(ctx) {
  const first = ctx.sentences.map((s) => (s.match(/[\p{L}⟨][\p{L}⟩'’-]*/u)?.[0] ?? "").toLowerCase());
  return runs(first, (a, b) => a && a === b).map(([start, len]) => ({ match: first[start], index: ctx.text.indexOf(ctx.sentences[start]), detail: `${len} consecutive sentences start with "${first[start]}"` }));
}

// ---------------------------------------------------------------- rules

// `re` is the word list where one exists; `check` owns the logic for density
// and structure rules. D1 needs the whole corpus and is computed in lint.mjs.
// `negatable` ports checks.mjs' positiveMatches: a negated rating claim is a
// disclaimer. R1/R2 are never quote-exempt — a quoted rating is still a rating.
export const RULES = [
  { code: "R1", severity: "FAIL", re: RATING, fields: null, newOnly: false, quoteExempt: false, negatable: true, note: "rating or review count in public text (guardrail #2)" },
  // A FAQ question repeats the traveller's search ("What is Jimbaran famous
  // for?"); the answer below it is where review language must not appear.
  { code: "R2", severity: "FAIL", re: REVIEW_DERIVED, fields: null, skipFields: ["faq_q"], newOnly: false, quoteExempt: false, negatable: true, note: "review-derived claim (guardrail #2)" },
  { code: "R3", severity: "FAIL", re: QUALITY_WARN, fields: ["not_for", "best_for"], newOnly: false, quoteExempt: false, note: "quality warning where fit context belongs (guardrail #9)" },
  { code: "H1", severity: "FAIL", re: HYPE, fields: null, newOnly: false, quoteExempt: true, note: "hype filler in our voice; a quoted menu line may keep it" },
  { code: "S1", severity: "FAIL", re: STUB, fields: null, newOnly: false, quoteExempt: false, note: "stub or internal text on a public surface" },
  { code: "F1", severity: "FAIL", re: BEST_FOR_OPENER, fields: ["best_for"], newOnly: false, quoteExempt: false, note: "generic best_for opener" },
  { code: "A9", severity: "FAIL", re: CATEGORY_OPENER, fields: ["why_its_here"], newOnly: true, quoteExempt: false, note: "'<Category> on Jl. … in <Area>' formula opener" },
  { code: "D1", severity: "FAIL", re: null, fields: null, newOnly: true, quoteExempt: false, note: "exact duplicate of another unit in the same field (computed in lint.mjs)" },
  { code: "A1", severity: "WARN", re: AI_PHRASES, fields: null, newOnly: false, quoteExempt: true, note: "stock AI phrase" },
  { code: "A2", severity: "WARN", re: TRANSITIONS, fields: null, newOnly: false, quoteExempt: true, check: stackedTransitions, note: "stacked or sentence-opening transition word" },
  { code: "A3", severity: "WARN", re: INTENSIFIERS, fields: null, newOnly: false, quoteExempt: true, check: density(100), note: "intensifier density over 1 per 100 words" },
  { code: "A4", severity: "WARN", re: EM_DASH, fields: null, newOnly: false, quoteExempt: false, check: emDashes, note: "em-dash density over 1 per 50 words or 2 in one sentence" },
  { code: "A5", severity: "WARN", re: TRICOLON, fields: null, newOnly: false, quoteExempt: false, check: tricolons, note: "two or more 'X, Y and Z' lists in a short paragraph" },
  { code: "A6", severity: "WARN", re: /\?/g, fields: null, newOnly: false, quoteExempt: false, check: rhetoricalQuestions, note: "rhetorical question in body prose" },
  { code: "A7", severity: "WARN", re: null, fields: null, newOnly: false, quoteExempt: false, check: longSentences, note: "sentence over 25 words" },
  { code: "A8", severity: "WARN", re: null, fields: null, newOnly: false, quoteExempt: false, check: verblessRuns, note: "three or more verbless sentences in a row (heuristic)" },
  { code: "A10", severity: "WARN", re: SOFT_WORDS, fields: null, newOnly: false, quoteExempt: true, check: density(100), note: "soft-word density over 1 per 100 words" },
  { code: "A11", severity: "WARN", re: null, fields: null, newOnly: false, quoteExempt: false, check: repeatedOpeners, note: "three or more consecutive sentences open with the same word" },
];

// Curly apostrophes are one UTF-16 unit like the straight one, so indices into
// the masked text stay valid after straightening.
const straightenApostrophes = (t) => t.replace(/[’‘]/g, "'");

export function lintText(text, { field = null, names = [], dishes = [], areas = [], sourceQuoted = false, isNew = false, allowlist = [], unit = null } = {}) {
  const normalizedField = normalizeField(field);
  // Zero-width characters are invisible on the page and would split "stu​nning"
  // past every word rule; they are dropped before matching.
  const visible = String(text ?? "").replace(/[​-‍⁠﻿]/g, "");
  const t = straightenApostrophes(mask(visible, { names, dishes, areas }));
  const quotes = quotedSpans(t);
  const sentences = splitSentences(t);
  const words = countWords(t);
  const ctx = { text: t, field: normalizedField, sentences, words, quotes, sourceQuoted };
  const fails = [];
  const warns = [];
  const allowed = (code, match) => allowlist.some((e) => e.unit === unit && e.code === code && e.match === match);
  const push = (rule, hit) => {
    if (allowed(rule.code, hit.match)) return;
    if (rule.severity === "FAIL") fails.push({ code: rule.code, match: hit.match, index: hit.index });
    else warns.push({ code: rule.code, match: hit.match, index: hit.index, detail: hit.detail ?? rule.note });
  };
  for (const rule of RULES) {
    if (rule.newOnly && !isNew) continue;
    if (rule.fields && !rule.fields.includes(normalizedField)) continue;
    if (rule.skipFields?.includes(normalizedField)) continue;
    if (rule.check) {
      for (const hit of rule.check(ctx, rule)) push(rule, hit);
      continue;
    }
    if (!rule.re) continue;
    for (const m of matchAll(t, rule.re)) {
      if (rule.negatable && negated(t, m.index)) continue;
      if (rule.quoteExempt && sourceQuoted && inQuote(quotes, m.index)) continue;
      push(rule, { match: m[0], index: m.index });
    }
  }
  const stats = {
    words,
    sentences: sentences.length,
    emDashes: countMatches(t, EM_DASH),
    tricolons: countMatches(t, TRICOLON),
    longSentences: sentences.filter((s) => countWords(s) > 25).length,
  };
  return { fails, warns, stats };
}
