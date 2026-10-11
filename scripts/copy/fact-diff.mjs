#!/usr/bin/env node
// Deterministic fact guard for copy rewrites (AGENTS.md guardrail #10).
// A rewriter may change wording; it may not add, change or invent facts.
// Every "hard token" (number, time, name, amenity, fit word, claim, dish) in
// the rewritten text must already exist in the source text or the allowed
// evidence, compared on a canonical form so that "190K IDR", "Rp 190k" and
// "IDR 190,000" are the same fact and "180K" is not.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// ---------------------------------------------------------------------------
// Text normalisation and sentence splitting
// ---------------------------------------------------------------------------

// ICU breaks a sentence after "Jl." or "No." when the next word is
// capitalised, which is exactly the shape of a Bali street address. The dot
// is swapped for a private-use character (Sentence_Break=Other) during
// segmentation and restored afterwards.
const DOT_MARK = "";
// "a.m." is deliberately not protected: it ends a sentence more often than it
// precedes a capitalised word, and a wrongly merged sentence turns the next
// sentence's first word into a mid-sentence name.
const ABBREVIATIONS = ["Jl.", "Jln.", "Gg.", "Br.", "Rp.", "Mt.", "approx.", "St.", "Dr.", "e.g.", "i.e."];

export function normalizeText(text) {
  return String(text ?? "")
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "")
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/ /g, " ")
    .replace(/\r\n?/g, "\n");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const ABBREVIATION_PATTERNS = ABBREVIATIONS.map((abbreviation) => new RegExp(
  `(?<![\\p{L}\\p{N}])${escapeRegExp(abbreviation)}`,
  "giu",
));
// "No." is protected only as a house-number marker; a bare "No." can end a sentence.
const HOUSE_NUMBER_PATTERN = /(?<![\p{L}\p{N}])No\.(?=\s?\d)/gu;

function protectAbbreviations(text) {
  let output = text;
  for (const pattern of [...ABBREVIATION_PATTERNS, HOUSE_NUMBER_PATTERN]) {
    output = output.replace(pattern, (match) => match.replaceAll(".", DOT_MARK));
  }
  return output;
}

const SENTENCE_SEGMENTER = new Intl.Segmenter("en", { granularity: "sentence" });

export function splitSentences(text) {
  const protectedText = protectAbbreviations(normalizeText(text));
  return [...SENTENCE_SEGMENTER.segment(protectedText)]
    .map((segment) => segment.segment.replaceAll(DOT_MARK, ".").trim())
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------

// Words that never count as facts: function words, connectives, and the
// generic verbs/nouns of venue copy ("opens", "serves", "table"). They are
// excluded from NEW_TERM warnings and, when capitalised at sentence start,
// from PROPER detection — "Doors open at 7am" is not about a place called Doors.
export const STOPLIST = new Set(`
a an the and or but nor so yet for of in on at to by with from into onto upon over under about
than then there their theirs them they this that these those which where when while who whom whose
why how what also too very just still even only not no nor never ever always often sometimes usually
mostly generally typically rarely here now then once again instead otherwise overall although though
because since until till unless if whether either neither both each every all any some many much more most
less least few several couple lot lots plenty enough rather quite fairly pretty almost nearly around
about roughly approximately approx across along between among inside outside within without beyond
behind beside near nearby next after before during through throughout toward towards up down out off
away back up upstairs downstairs above below front rear side
i me my mine you your yours he him his she her hers it its we us our ours one ones
is are was were be been being am do does did done doing have has had having
will would shall should can could may might must ought need needs needed
get gets got getting go goes went going gone come comes came coming
make makes made making take takes took taken taking give gives gave given
keep keeps kept stay stays stayed put puts set sets let lets
run runs ran running start starts started begin begins began end ends ended finish finishes finished
last lasts lasted take takes
open opens opened opening close closes closed closing
serve serves served serving offer offers offered offering
sit sits sat sitting seat seats seated seating table tables chair chairs
come comes order orders ordered ordering book books booked booking reserve reserves reservation reservations
walk walks walked walking drive drives driving ride rides riding park parks parked
pay pays paid paying price prices priced pricing cost costs costing charge charges charged
fee fees rate rates
place places spot spots venue venues site sites branch branches location locations
menu menus list lists item items option options choice choices selection
day days week weeks month months year years hour hours minute minutes time times
morning afternoon evening night nights noon midday midnight daily weekday weekdays weekend weekends
lunch dinner breakfast brunch supper snack snacks drink drinks food foods dish dishes meal meals plate plates
cup cups glass glasses bottle bottles
door doors entry entrance exit way ways road roads street streets corner
own same other another different such like unlike
part parts kind kinds sort sorts type types bit bits
thing things something anything nothing everything someone anyone everyone
well good fine nice right left
yes no
expect expects expected plan plans planned think thinks ask asks asked bring brings brought
try tries tried skip skips choose chooses chose pick picks picked head heads grab grabs
allow allows allowed avoid avoids call calls check checks find finds look looks
leave leaves use uses used wear wears carry carries dress turn turns follow follows
enter enters visit visits return returns spend spends show shows add adds hold holds wait waits
watch watches rent rents hire hires buy buys sell sells share shares mind count counts
note notes tip tips arrive arrives arrived arriving
service staff payment card cards cash
include includes included including
`.split(/\s+/).filter(Boolean));

// Lowercase words that are facts or evaluations. Adding one is adding a claim.
// Each entry: canonical → surface forms (hyphen and space are interchangeable).
const LEXICON_ENTRIES = [
  // amenities
  ["pool", ["pool", "poolside", "swimming pool", "infinity pool"]],
  ["rooftop", ["rooftop", "roof top", "roof-top"]],
  ["terrace", ["terrace"]],
  ["garden", ["garden"]],
  ["beachfront", ["beachfront", "beach front", "beach-front"]],
  ["sea view", ["sea view", "seaview"]],
  ["ocean view", ["ocean view", "oceanview"]],
  ["air-con", ["air-con", "aircon", "air con", "air conditioning", "air-conditioning", "air conditioned", "air-conditioned", "ac", "a/c"]],
  ["wifi", ["wifi", "wi-fi", "wi fi"]],
  ["parking", ["parking", "car park", "carpark"]],
  ["live music", ["live music"]],
  ["dj", ["dj"]],
  ["vegan", ["vegan"]],
  ["vegetarian", ["vegetarian", "veggie"]],
  ["gluten-free", ["gluten-free", "gluten free", "glutenfree"]],
  ["halal", ["halal"]],
  ["alcohol", ["alcohol", "alcoholic"]],
  ["cocktails", ["cocktail", "cocktails"]],
  ["kids", ["kid", "kids", "child", "children"]],
  ["playground", ["playground", "play area"]],
  ["pet-friendly", ["pet-friendly", "pet friendly", "dog-friendly", "dog friendly"]],
  ["shisha", ["shisha", "hookah"]],
  // fit words
  ["quiet", ["quiet", "quieter", "quietest"]],
  ["loud", ["loud", "louder", "loudest"]],
  ["busy", ["busy", "busier", "busiest"]],
  ["calm", ["calm", "calmer"]],
  ["cosy", ["cosy", "cozy", "cosier", "cozier"]],
  ["romantic", ["romantic"]],
  ["lively", ["lively", "livelier"]],
  ["laid-back", ["laid-back", "laid back", "laidback"]],
  ["upscale", ["upscale", "upmarket"]],
  ["casual", ["casual"]],
  ["family-friendly", ["family-friendly", "family friendly", "kid-friendly", "kid friendly", "kids-friendly", "child-friendly"]],
  ["small", ["small", "smaller", "smallest"]],
  ["big", ["big", "bigger", "biggest"]],
  ["large", ["large", "larger"]],
  ["tiny", ["tiny"]],
  ["early", ["early", "earlier", "earliest"]],
  ["late", ["late"]],
  ["cheap", ["cheap", "cheaper", "cheapest"]],
  ["expensive", ["expensive", "pricey"]],
  ["budget", ["budget"]],
  ["premium", ["premium"]],
  // claims
  ["best", ["best"]],
  ["only", ["only"]],
  ["first", ["first"]],
  ["oldest", ["oldest"]],
  ["newest", ["newest"]],
  ["largest", ["largest"]],
  ["most", ["most"]],
  ["famous", ["famous"]],
  ["popular", ["popular"]],
  ["award", ["award", "awards", "awarded"]],
  ["award-winning", ["award-winning", "award winning"]],
  ["michelin", ["michelin"]],
  ["finest", ["finest"]],
  ["top-rated", ["top-rated", "top rated"]],
  ["legendary", ["legendary"]],
  ["iconic", ["iconic"]],
  ["renowned", ["renowned"]],
  ["must-visit", ["must-visit", "must visit", "must-try", "must try"]],
  ["hidden gem", ["hidden gem"]],
  ["world-class", ["world-class", "world class"]],
  ["authentic", ["authentic"]],
  ["favourite", ["favourite", "favorite"]],
];

// Dish and ingredient words. A dish that appears only in the rewrite was
// invented by the rewriter, however plausible it sounds for the venue.
const FOOD_WORDS = `
nasi goreng mie bakmi satay sate sambal bebek betutu ayam ikan pepes lawar urap rendang laksa bakso soto
rawon tempeh tempe tofu tahu jamu martabak rujak lontong lumpia ketoprak pecel bubur klepon kopi teh
bowl smoothie acai croissant pancake waffle bagel toast egg benedict bacon avocado granola oat oatmeal
porridge yoghurt yogurt muesli chia sandwich wrap burrito taco nachos quesadilla salad soup bread sourdough
pastry cake brownie cookie muffin scone donut doughnut cheesecake tiramisu gelato sorbet dessert chocolate
coffee espresso latte cappuccino americano mocha piccolo matcha chai tea juice kombucha lemonade coconut
milkshake shake beer wine mocktail spritz margarita mojito negroni gin whisky whiskey rum arak vodka tequila
sake prosecco champagne cider bintang
burger pizza pasta sushi ramen steak seafood lobster prawn shrimp crab oyster squid calamari octopus tuna
salmon snapper barramundi fish chicken pork beef lamb duck ribs wagyu tenderloin sirloin ribeye curry noodle
rice dumpling pho bibimbap kimchi poke ceviche tapas paella risotto gnocchi lasagne lasagna carbonara
bolognese falafel hummus shawarma kebab schnitzel sausage fries chips wings nuggets tempura teriyaki bento
sashimi tataki gyoza bao wonton congee hotpot bbq barbecue roast pie quiche omelette omelet frittata crepe
galette mango papaya pineapple dragonfruit banana berries strawberry kale spinach quinoa lentil chickpea
mushroom truffle cheese burrata mozzarella feta halloumi parmesan butter honey jam peanut almond cashew
`.split(/\s+/).filter(Boolean);

const FOOD_PHRASES = [
  "nasi goreng", "mie goreng", "nasi campur", "nasi uduk", "babi guling", "bebek betutu", "ayam betutu",
  "ikan bakar", "gado-gado", "gado gado", "pisang goreng", "es campur", "es teler", "sate lilit",
  "smoothie bowl", "acai bowl", "avocado toast", "eggs benedict", "ice cream", "cinnamon roll",
  "flat white", "cold brew", "long black", "coconut water", "poke bowl", "dim sum", "pad thai",
  "fish and chips", "mahi mahi", "mahi-mahi",
];

const TERM_SUFFIX = "(?:s|es|ed)?";

function termPattern(surface) {
  return escapeRegExp(surface).replace(/(?:\\ |-)/g, "[\\s-]");
}

// One alternation, longest surface first, so "flat white" wins over "white"
// and "live music" over "music".
function buildTermMatcher(extraLexicon = []) {
  const bySurface = new Map();
  const register = (type, canonical, surface) => {
    const key = surface.toLowerCase();
    if (!bySurface.has(key)) bySurface.set(key, { type, canonical });
  };
  for (const word of extraLexicon) {
    const clean = normalizeText(word).trim().toLowerCase();
    if (clean) register("LEX", clean, clean);
  }
  for (const [canonical, surfaces] of LEXICON_ENTRIES) {
    for (const surface of surfaces) register("LEX", canonical, surface);
  }
  for (const phrase of FOOD_PHRASES) register("FOOD", phrase.replace(/-/g, " "), phrase);
  for (const word of FOOD_WORDS) register("FOOD", word, word);
  const surfaces = [...bySurface.keys()].sort((a, b) => b.length - a.length);
  const regex = new RegExp(
    `(?<![\\p{L}\\p{N}-])(${surfaces.map(termPattern).join("|")})${TERM_SUFFIX}(?![\\p{L}])`,
    "giu",
  );
  return { regex, lookup: (surface) => bySurface.get(surface.toLowerCase().replace(/[\s-]+/g, " ")) ?? bySurface.get(surface.toLowerCase().replace(/\s+/g, "-")) };
}

const DEFAULT_TERM_MATCHER = buildTermMatcher();

export const LEXICON_TERMS = Object.freeze(LEXICON_ENTRIES.map(([canonical]) => canonical));
export const FOOD_TERMS = Object.freeze([...FOOD_PHRASES, ...FOOD_WORDS]);
export const POLARITY_WORDS = Object.freeze(["no", "not", "never", "without", "only", "except", "closed", "free"]);

const NUMBER_WORDS = new Map(Object.entries({
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
}));
const DURATION_WORDS = new Map([
  ...NUMBER_WORDS,
  ["a", 1], ["an", 1], ["half an", 0.5], ["half a", 0.5], ["half", 0.5],
  ["fifteen", 15], ["twenty", 20], ["thirty", 30], ["forty", 40], ["forty-five", 45], ["fifty", 50], ["sixty", 60], ["ninety", 90],
]);

const ADDRESS_PREFIXES = new Set(["jl", "jln", "jalan", "gang", "gg", "banjar", "br"]);
const PROPER_CONNECTORS = new Set(["of", "de", "di", "da", "del", "la", "du", "&"]);

// ---------------------------------------------------------------------------
// Number parsing
// ---------------------------------------------------------------------------

// Thousands pattern first so "190.000" is not read as a decimal.
const NUM = String.raw`\d{1,3}(?:[.,]\d{3})+(?!\d)|\d+(?:[.,]\d+)?`;
const RANGE_SEP = String.raw`(?:\s?[-–—]\s?|\s+(?:to|until|till)\s+)`;
const NOT_WORD_BEFORE = String.raw`(?<![\p{L}\p{N}])`;
const NOT_WORD_AFTER = String.raw`(?![\p{L}\p{N}])`;

export function parseNumber(raw) {
  const compact = raw.replace(/\s+/g, "");
  if (/^\d{1,3}(?:[.,]\d{3})+$/.test(compact)) return Number(compact.replace(/[.,]/g, ""));
  return Number(compact.replace(",", "."));
}

const MONEY_PREFIX = String.raw`(?:[Rr][Pp]\.?|IDR|idr)\s?`;
const MONEY_SUFFIX = String.raw`\s?(?:IDR|idr|rupiah|Rupiah)(?![\p{L}])`;
// Lowercase "m" is deliberately absent: it means metres unless the number
// carries an Rp/IDR prefix (handled by MONEY_PREFIXED_M).
const MONEY_MULT = String.raw`\s?(?:rb|ribu|jt|juta|million|mio|mn|[kKM])(?![\p{L}])`;

function multiplierValue(raw) {
  const unit = (raw ?? "").trim().toLowerCase();
  if (unit === "k" || unit === "rb" || unit === "ribu") return 1e3;
  if (unit === "m" || unit === "jt" || unit === "juta" || unit === "million" || unit === "mio" || unit === "mn") return 1e6;
  return 1;
}

const MONEY_RANGE = new RegExp(
  `${NOT_WORD_BEFORE}(${MONEY_PREFIX})?(${NUM})(${MONEY_MULT})?${RANGE_SEP}(${MONEY_PREFIX})?(${NUM})(${MONEY_MULT})?(${MONEY_SUFFIX})?${NOT_WORD_AFTER}`,
  "gu",
);
const MONEY_PREFIXED_M = new RegExp(`${NOT_WORD_BEFORE}(${MONEY_PREFIX})(${NUM})\\s?m(?![\\p{L}])`, "gu");
const MONEY_SINGLE = new RegExp(`${NOT_WORD_BEFORE}(${MONEY_PREFIX})?(${NUM})(${MONEY_MULT})?(${MONEY_SUFFIX})?${NOT_WORD_AFTER}`, "gu");
const USD_SINGLE = new RegExp(`${NOT_WORD_BEFORE}(?:US)?\\$\\s?(${NUM})(${MONEY_MULT})?${NOT_WORD_AFTER}`, "gu");
const PRICE_BAND = /(?<![\p{L}\p{N}$])\${1,3}(?![\p{L}\p{N}$])/gu;

// The trailing dot belongs to "a.m." only; "7pm." ends a sentence.
const MERIDIEM = String.raw`([aApP])(?:\.[mM]\.?|[mM])(?![\p{L}])`;
const TIME_BEFORE = String.raw`(?<![\p{L}\p{N}:.])`;
const TIME_MIXED_RANGE = new RegExp(`${TIME_BEFORE}(\\d{1,2})(?:[:.](\\d{2}))?${RANGE_SEP}(\\d{1,2})(?:[:.](\\d{2}))?\\s?${MERIDIEM}`, "gu");
const TIME_DOTTED_RANGE = new RegExp(`${TIME_BEFORE}(\\d{1,2})\\.(\\d{2})${RANGE_SEP}(\\d{1,2})\\.(\\d{2})(?!\\d)`, "gu");
const TIME_MERIDIEM = new RegExp(`${TIME_BEFORE}(\\d{1,2})(?:[:.](\\d{2}))?\\s?${MERIDIEM}`, "gu");
const TIME_COLON = /(?<![\p{L}\p{N}:.])(\d{1,2}):(\d{2})(?![\p{N}:])/gu;
const TIME_WORDS = /(?<![\p{L}])(noon|midday|midnight)(?![\p{L}])/giu;
const TIME_ALWAYS = /(?<![\p{N}])24\s?\/\s?7(?![\p{N}])/gu;

const DURATION_UNIT = String.raw`(minutes?|mins?|hours?|hrs?|h)(?![\p{L}])`;
const DURATION_RANGE = new RegExp(`${NOT_WORD_BEFORE}(${NUM})(?:[\\s-]?${DURATION_UNIT})?${RANGE_SEP}(${NUM})[\\s-]?${DURATION_UNIT}`, "giu");
const DURATION_SINGLE = new RegExp(`${NOT_WORD_BEFORE}(${NUM})[\\s-]?${DURATION_UNIT}`, "giu");
// "one and a half hours" and "an hour and a half" both carry the half.
const DURATION_WORDED = new RegExp(
  `(?<![\\p{L}-])(${[...DURATION_WORDS.keys()].sort((a, b) => b.length - a.length).join("|")})(\\s+and\\s+a\\s+half)?[\\s-](hours?|hrs?|minutes?|mins?)(\\s+and\\s+a\\s+half)?(?![\\p{L}])`,
  "giu",
);

const DISTANCE_UNIT = String.raw`(km|kilomet(?:re|er)s?|m|met(?:re|er)s?)(?![\p{L}])`;
const DISTANCE_RANGE = new RegExp(`${NOT_WORD_BEFORE}(${NUM})(?:\\s?${DISTANCE_UNIT})?${RANGE_SEP}(${NUM})\\s?${DISTANCE_UNIT}`, "gu");
const DISTANCE_SINGLE = new RegExp(`${NOT_WORD_BEFORE}(${NUM})\\s?${DISTANCE_UNIT}`, "gu");

const PERCENT_UNIT = String.raw`\s?(?:%|percent|per cent)(?![\p{L}])`;
const PERCENT_RANGE = new RegExp(`${NOT_WORD_BEFORE}(${NUM})(?:${PERCENT_UNIT})?${RANGE_SEP}(${NUM})${PERCENT_UNIT}`, "giu");
const PERCENT_SINGLE = new RegExp(`${NOT_WORD_BEFORE}(${NUM})${PERCENT_UNIT}`, "giu");

const ORDINAL = /(?<![\p{L}\p{N}])(\d+)(?:st|nd|rd|th)(?![\p{L}])/giu;
const COUNT_THOUSANDS = /(?<![\p{L}\p{N}.,])(\d{1,3}(?:[.,]\d{3})+)(?![\p{N}])/gu;
const YEAR = /(?<![\p{L}\p{N}.,])((?:1[89]|20)\d{2})(?![\p{L}\p{N}])/gu;
const COUNT_DECIMAL = /(?<![\p{L}\p{N}.,])(\d+[.,]\d+)(?![\p{L}\p{N}])/gu;
const COUNT_INTEGER = /(?<![\p{L}\p{N}])(\d+)(?![\p{L}\p{N}])/gu;
const COUNT_WORD = new RegExp(`(?<![\\p{L}])(${[...NUMBER_WORDS.keys()].join("|")})(?![\\p{L}])`, "giu");

const DAY_WEEKDAYS_RANGE = /(?<![\p{L}])(?:mon|monday)\s?(?:[-–—]|to|through|until)\s?(?:fri|friday)(?![\p{L}])/giu;
const DAY_WEEKEND_RANGE = /(?<![\p{L}])(?:sat|saturday)\s?(?:[-–—]|to|and|&)\s?(?:sun|sunday)(?![\p{L}])/giu;
// "a day" is the per-day rate only after a quantity ("80K a day"); "a day spa" is not.
const DAY_DAILY = /(?<![\p{L}])(?:daily|every\s?day|everyday|(?:per|each)\s+day|(?<=(?:\d|[kK]|IDR|idr|rupiah)\s)a\s+day)(?![\p{L}])/giu;
const DAY_GROUPS = /(?<![\p{L}])(weekends?|weekdays?|public\s+holidays?|bank\s+holidays?)(?![\p{L}])/giu;
const DAY_FULL = /(?<![\p{L}])(monday|tuesday|wednesday|thursday|friday|saturday|sunday)s?(?![\p{L}])/giu;
// Abbreviations only when capitalised: lowercase "sat" and "sun" are ordinary words.
const DAY_ABBREVIATED = /(?<![\p{L}])(Mon|Tue|Tues|Wed|Thu|Thur|Thurs|Fri|Sat|Sun)(?![\p{L}])/gu;

const WORD = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;
const POLARITY = /(?<![\p{L}-])(no|not|never|without|only|except|closed|free)(?![\p{L}-])|n't(?![\p{L}])/giu;
const CLAUSE_SPLIT = /;|:|\s[–—]\s|,\s+(?:and|but|though|while|whereas)\s+/u;

// ---------------------------------------------------------------------------
// Fact extraction
// ---------------------------------------------------------------------------

function toDay(name) {
  const key = name.toLowerCase();
  if (key.startsWith("mon")) return "mon";
  if (key.startsWith("tue")) return "tue";
  if (key.startsWith("wed")) return "wed";
  if (key.startsWith("thu")) return "thu";
  if (key.startsWith("fri")) return "fri";
  if (key.startsWith("sat")) return "sat";
  if (key.startsWith("sun")) return "sun";
  if (key.startsWith("weekend")) return "weekends";
  if (key.startsWith("weekday")) return "weekdays";
  return "holidays";
}

function clockCanonical(hour, minute) {
  const h = hour === 24 ? 0 : hour;
  return `TIME:${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function meridiemHour(hour, meridiem) {
  if (hour < 1 || hour > 12) return null;
  const pm = meridiem.toLowerCase() === "p";
  if (hour === 12) return pm ? 12 : 0;
  return pm ? hour + 12 : hour;
}

// Possessives and contractions reduce to the base word: "Gianyar's" is still
// Gianyar and "aren't" is "are" (the negation is the polarity scan's job).
function wordKey(token) {
  return token.toLowerCase()
    .replace(/n['’]t$/u, "")
    .replace(/['’](?:s|re|ll|ve|d|m)$/u, "")
    .replace(/['’]$/u, "");
}

function isCapitalised(token) {
  return /^\p{Lu}/u.test(token);
}

// Light stemming for comparison only. All candidates are kept so that
// "sells" and "selling" still meet on "sell" without a real stemmer.
export function stemCandidates(word) {
  const w = wordKey(word);
  const out = new Set([w]);
  if (w.length > 4 && w.endsWith("ies")) out.add(`${w.slice(0, -3)}y`);
  if (w.length > 4 && w.endsWith("es")) out.add(w.slice(0, -2));
  if (w.length > 3 && w.endsWith("s")) out.add(w.slice(0, -1));
  if (w.length > 4 && w.endsWith("ed")) {
    out.add(w.slice(0, -2));
    out.add(w.slice(0, -1));
    if (/([^aeiou])\1ed$/.test(w)) out.add(w.slice(0, -3));
  }
  if (w.length > 5 && w.endsWith("ing")) {
    out.add(w.slice(0, -3));
    out.add(`${w.slice(0, -3)}e`);
    if (/([^aeiou])\1ing$/.test(w)) out.add(w.slice(0, -4));
  }
  if (w.length > 5 && w.endsWith("ly")) out.add(w.slice(0, -2));
  if (w.length > 5 && w.endsWith("er")) out.add(w.slice(0, -2));
  return out;
}

function wordParts(token) {
  return wordKey(token).split("-").filter(Boolean);
}

export function wordBag(text) {
  const bag = new Set();
  const normalized = normalizeText(text);
  for (const match of normalized.matchAll(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)) {
    bag.add(wordKey(match[0]));
    for (const part of wordParts(match[0])) bag.add(part);
  }
  return bag;
}

function stemSet(words) {
  const stems = new Set();
  for (const word of words) for (const stem of stemCandidates(word)) stems.add(stem);
  return stems;
}

function knownWord(word, stems) {
  for (const stem of stemCandidates(word)) if (stems.has(stem)) return true;
  return false;
}

class SpanLedger {
  constructor() {
    this.spans = [];
  }

  overlaps(start, end) {
    return this.spans.some(([s, e]) => start < e && end > s);
  }

  claim(start, end) {
    if (this.overlaps(start, end)) return false;
    this.spans.push([start, end]);
    return true;
  }
}

function polarityMarkers(text) {
  const markers = new Set();
  for (const m of text.matchAll(POLARITY)) {
    const marker = m[0].toLowerCase() === "n't" ? "not" : m[0].toLowerCase();
    // "No. 12" is a house number, not a negation.
    if (marker === "no" && /^\.?\s?\d/.test(text.slice(m.index + m[0].length))) continue;
    markers.add(marker);
  }
  return [...markers].sort();
}

function extractSentenceFacts(sentence, sentenceIndex, context) {
  const facts = [];
  const ledger = new SpanLedger();
  const add = (type, token, canonical, start, end, extra = {}) => {
    if (!ledger.claim(start, end)) return false;
    facts.push({ type, token, canonical, sentence: sentenceIndex, ...extra });
    return true;
  };
  const scan = (regex, handler) => {
    for (const match of sentence.matchAll(regex)) handler(match);
  };

  // --- money -------------------------------------------------------------
  scan(MONEY_RANGE, (m) => {
    const [, prefix1, num1, mult1, prefix2, num2, mult2, suffix] = m;
    if (!prefix1 && !prefix2 && !mult1 && !mult2 && !suffix) return;
    const start = m.index;
    const end = m.index + m[0].length;
    if (ledger.overlaps(start, end)) return;
    const factor1 = multiplierValue(mult1 ?? mult2);
    const factor2 = multiplierValue(mult2 ?? mult1);
    ledger.claim(start, end);
    facts.push({ type: "MONEY", token: m[0].trim(), canonical: `MONEY:${Math.round(parseNumber(num1) * factor1)}`, sentence: sentenceIndex });
    facts.push({ type: "MONEY", token: m[0].trim(), canonical: `MONEY:${Math.round(parseNumber(num2) * factor2)}`, sentence: sentenceIndex });
  });
  scan(MONEY_PREFIXED_M, (m) => {
    add("MONEY", m[0].trim(), `MONEY:${Math.round(parseNumber(m[2]) * 1e6)}`, m.index, m.index + m[0].length);
  });
  scan(MONEY_SINGLE, (m) => {
    const [, prefix, num, mult, suffix] = m;
    if (!prefix && !mult && !suffix) return;
    add("MONEY", m[0].trim(), `MONEY:${Math.round(parseNumber(num) * multiplierValue(mult))}`, m.index, m.index + m[0].length);
  });
  scan(USD_SINGLE, (m) => {
    add("MONEY", m[0].trim(), `USD:${Math.round(parseNumber(m[1]) * multiplierValue(m[2]))}`, m.index, m.index + m[0].length);
  });
  scan(PRICE_BAND, (m) => {
    add("BAND", m[0], `BAND:${m[0].length}`, m.index, m.index + m[0].length);
  });

  // --- time ----------------------------------------------------------------
  scan(TIME_MIXED_RANGE, (m) => {
    const [, h1, min1, h2, min2, meridiem] = m;
    const hour2 = meridiemHour(Number(h2), meridiem);
    if (hour2 === null || Number(h1) < 1 || Number(h1) > 12) return;
    // "8–11am" shares the meridiem; "11–2pm" crosses noon, so the first end
    // takes the other half of the day. A first end of 12 sits on the boundary
    // of the stated half: "12–3pm" is noon to 3pm, "12–3am" midnight to 3am.
    const sameHalf = Number(h1) < Number(h2) || Number(h1) === 12;
    const inferred = sameHalf ? meridiem : (meridiem.toLowerCase() === "a" ? "p" : "a");
    const hour1 = meridiemHour(Number(h1), inferred);
    const minute1 = Number(min1 ?? 0);
    const minute2 = Number(min2 ?? 0);
    if (minute1 > 59 || minute2 > 59) return;
    const start = m.index;
    const end = m.index + m[0].length;
    if (!ledger.claim(start, end)) return;
    facts.push({ type: "TIME", token: m[0].trim(), canonical: clockCanonical(hour1, minute1), sentence: sentenceIndex });
    facts.push({ type: "TIME", token: m[0].trim(), canonical: clockCanonical(hour2, minute2), sentence: sentenceIndex });
  });
  scan(TIME_DOTTED_RANGE, (m) => {
    const [, h1, min1, h2, min2] = m;
    const hours = [Number(h1), Number(h2)];
    const minutes = [Number(min1), Number(min2)];
    if (hours.some((h) => h > 24) || minutes.some((x) => x > 59)) return;
    const start = m.index;
    const end = m.index + m[0].length;
    if (!ledger.claim(start, end)) return;
    facts.push({ type: "TIME", token: m[0].trim(), canonical: clockCanonical(hours[0], minutes[0]), sentence: sentenceIndex });
    facts.push({ type: "TIME", token: m[0].trim(), canonical: clockCanonical(hours[1], minutes[1]), sentence: sentenceIndex });
  });
  scan(TIME_MERIDIEM, (m) => {
    const hour = meridiemHour(Number(m[1]), m[3]);
    const minute = Number(m[2] ?? 0);
    if (hour === null || minute > 59) return;
    add("TIME", m[0].trim(), clockCanonical(hour, minute), m.index, m.index + m[0].length);
  });
  scan(TIME_COLON, (m) => {
    const hour = Number(m[1]);
    const minute = Number(m[2]);
    if (hour > 24 || minute > 59) return;
    add("TIME", m[0], clockCanonical(hour, minute), m.index, m.index + m[0].length);
  });
  scan(TIME_WORDS, (m) => {
    const canonical = m[1].toLowerCase() === "midnight" ? "TIME:00:00" : "TIME:12:00";
    add("TIME", m[0], canonical, m.index, m.index + m[0].length);
  });
  scan(TIME_ALWAYS, (m) => {
    add("TIME", m[0], "TIME:24/7", m.index, m.index + m[0].length);
  });

  // --- duration --------------------------------------------------------------
  const durationMinutes = (value, unit) => Math.round(value * (unit.toLowerCase().startsWith("h") ? 60 : 1));
  scan(DURATION_RANGE, (m) => {
    const [, num1, unit1, num2, unit2] = m;
    const start = m.index;
    const end = m.index + m[0].length;
    if (!ledger.claim(start, end)) return;
    facts.push({ type: "DURATION", token: m[0].trim(), canonical: `DURATION:${durationMinutes(parseNumber(num1), unit1 ?? unit2)}`, sentence: sentenceIndex });
    facts.push({ type: "DURATION", token: m[0].trim(), canonical: `DURATION:${durationMinutes(parseNumber(num2), unit2)}`, sentence: sentenceIndex });
  });
  scan(DURATION_SINGLE, (m) => {
    add("DURATION", m[0].trim(), `DURATION:${durationMinutes(parseNumber(m[1]), m[2])}`, m.index, m.index + m[0].length);
  });
  scan(DURATION_WORDED, (m) => {
    const base = DURATION_WORDS.get(m[1].toLowerCase().replace(/\s+/g, " "));
    if (base === undefined) return;
    const value = base + (m[2] || m[4] ? 0.5 : 0);
    add("DURATION", m[0].trim(), `DURATION:${durationMinutes(value, m[3])}`, m.index, m.index + m[0].length);
  });

  // --- distance --------------------------------------------------------------
  const metres = (value, unit) => Math.round(value * (unit.toLowerCase().startsWith("k") ? 1000 : 1));
  scan(DISTANCE_RANGE, (m) => {
    const [, num1, unit1, num2, unit2] = m;
    const start = m.index;
    const end = m.index + m[0].length;
    if (!ledger.claim(start, end)) return;
    facts.push({ type: "DISTANCE", token: m[0].trim(), canonical: `DISTANCE:${metres(parseNumber(num1), unit1 ?? unit2)}`, sentence: sentenceIndex });
    facts.push({ type: "DISTANCE", token: m[0].trim(), canonical: `DISTANCE:${metres(parseNumber(num2), unit2)}`, sentence: sentenceIndex });
  });
  scan(DISTANCE_SINGLE, (m) => {
    add("DISTANCE", m[0].trim(), `DISTANCE:${metres(parseNumber(m[1]), m[2])}`, m.index, m.index + m[0].length);
  });

  // --- percent, ordinal, year, count ----------------------------------------
  scan(PERCENT_RANGE, (m) => {
    const start = m.index;
    const end = m.index + m[0].length;
    if (!ledger.claim(start, end)) return;
    facts.push({ type: "PERCENT", token: m[0].trim(), canonical: `PERCENT:${parseNumber(m[1])}`, sentence: sentenceIndex });
    facts.push({ type: "PERCENT", token: m[0].trim(), canonical: `PERCENT:${parseNumber(m[2])}`, sentence: sentenceIndex });
  });
  scan(PERCENT_SINGLE, (m) => {
    add("PERCENT", m[0].trim(), `PERCENT:${parseNumber(m[1])}`, m.index, m.index + m[0].length);
  });
  scan(ORDINAL, (m) => {
    add("ORDINAL", m[0], `ORDINAL:${Number(m[1])}`, m.index, m.index + m[0].length);
  });
  scan(COUNT_THOUSANDS, (m) => {
    add("COUNT", m[0], `COUNT:${parseNumber(m[1])}`, m.index, m.index + m[0].length);
  });
  scan(YEAR, (m) => {
    add("YEAR", m[0], `YEAR:${m[1]}`, m.index, m.index + m[0].length);
  });
  scan(COUNT_DECIMAL, (m) => {
    add("COUNT", m[0], `COUNT:${parseNumber(m[1])}`, m.index, m.index + m[0].length);
  });
  scan(COUNT_INTEGER, (m) => {
    add("COUNT", m[0], `COUNT:${Number(m[1])}`, m.index, m.index + m[0].length);
  });

  // --- days --------------------------------------------------------------------
  scan(DAY_WEEKDAYS_RANGE, (m) => add("DAY", m[0], "DAY:weekdays", m.index, m.index + m[0].length));
  scan(DAY_WEEKEND_RANGE, (m) => add("DAY", m[0], "DAY:weekends", m.index, m.index + m[0].length));
  scan(DAY_DAILY, (m) => add("DAY", m[0], "DAY:daily", m.index, m.index + m[0].length));
  scan(DAY_GROUPS, (m) => add("DAY", m[0], `DAY:${toDay(m[1].replace(/\s+/g, " "))}`, m.index, m.index + m[0].length));
  scan(DAY_FULL, (m) => add("DAY", m[0], `DAY:${toDay(m[1])}`, m.index, m.index + m[0].length));
  scan(DAY_ABBREVIATED, (m) => add("DAY", m[0], `DAY:${toDay(m[1])}`, m.index, m.index + m[0].length));

  // --- lexicon and food ------------------------------------------------------
  scan(context.terms.regex, (m) => {
    const entry = context.terms.lookup(m[1]);
    if (!entry) return;
    add(entry.type, m[0], `${entry.type}:${entry.canonical}`, m.index, m.index + m[0].length, { words: wordParts(m[0].replace(/\s+/g, "-")) });
  });

  // --- number words ------------------------------------------------------------
  scan(COUNT_WORD, (m) => {
    const word = m[1].toLowerCase();
    if (word === "one") {
      // "one of the", "the one", "no one": pronoun uses, not a quantity.
      const after = sentence.slice(m.index + m[0].length).match(/^\s+(\p{L}+)/u)?.[1]?.toLowerCase();
      const before = sentence.slice(0, m.index).match(/(\p{L}+)\s+$/u)?.[1]?.toLowerCase();
      if (after === "of") return;
      if (before && ["no", "the", "any", "every", "each", "which", "that", "this", "some", "another"].includes(before)) return;
    }
    add("COUNT", m[0], `COUNT:${NUMBER_WORDS.get(word)}`, m.index, m.index + m[0].length);
  });

  // --- alphanumerics ("125cc", "4WD") -------------------------------------------
  const tokens = [...sentence.matchAll(WORD)].map((m) => ({ text: m[0], start: m.index, end: m.index + m[0].length }));
  for (const token of tokens) {
    if (ledger.overlaps(token.start, token.end)) continue;
    if (/\p{N}/u.test(token.text) && /\p{L}/u.test(token.text)) {
      add("ALNUM", token.text, `ALNUM:${token.text.toLowerCase()}`, token.start, token.end);
    }
  }

  // --- proper nouns ----------------------------------------------------------
  const firstStart = tokens.length ? tokens[0].start : -1;
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (ledger.overlaps(token.start, token.end) || !isCapitalised(token.text) || token.text === "I") {
      i += 1;
      continue;
    }
    const key = wordKey(token.text);
    if (token.start === firstStart && !ADDRESS_PREFIXES.has(key) && !context.reference) {
      // A sentence-initial capital is only a name when the word is neither a
      // function word nor something the other text already says in lowercase.
      if (STOPLIST.has(key) || knownWord(key, context.otherStems)) {
        i += 1;
        continue;
      }
    }
    const parts = [token];
    let j = i + 1;
    while (j < tokens.length) {
      const next = tokens[j];
      const gap = sentence.slice(parts[parts.length - 1].end, next.start);
      if (!/^[\s.'’&-]*$/u.test(gap) || ledger.overlaps(next.start, next.end)) break;
      // "No. 99" is the house-number marker, not part of the street name.
      if (next.text === "No" && tokens[j + 1] && /^\p{N}/u.test(tokens[j + 1].text)) break;
      if (isCapitalised(next.text)) {
        parts.push(next);
        j += 1;
        continue;
      }
      const following = tokens[j + 1];
      if (PROPER_CONNECTORS.has(next.text.toLowerCase()) && following && isCapitalised(following.text)
        && !ledger.overlaps(following.start, following.end)
        && /^[\s.'’&-]*$/u.test(sentence.slice(next.end, following.start))) {
        parts.push(next);
        j += 1;
        continue;
      }
      break;
    }
    const words = parts.flatMap((part) => wordParts(part.text));
    const start = parts[0].start;
    const end = parts[parts.length - 1].end;
    i = j;
    // Title-cased chrome ("Best For", "Open Daily") is not a name.
    if (words.every((word) => STOPLIST.has(word))) continue;
    add("PROPER", sentence.slice(start, end), `PROPER:${words.join(" ")}`, start, end, { words });
  }

  // --- polarity ------------------------------------------------------------------
  // Recorded at two scopes: the clause a token sits in and the whole sentence.
  // A real flip changes both; a comma replacing a semicolon changes only one.
  const sentencePolarity = polarityMarkers(sentence);
  const clausePolarityAt = (position) => {
    let offset = 0;
    for (const clause of sentence.split(CLAUSE_SPLIT)) {
      const clauseStart = sentence.indexOf(clause, offset);
      const clauseEnd = clauseStart + clause.length;
      offset = clauseEnd;
      if (position >= clauseStart && position < clauseEnd) return polarityMarkers(clause);
    }
    return [];
  };
  for (const fact of facts) {
    const position = sentence.indexOf(fact.token);
    fact.polarity = clausePolarityAt(position >= 0 ? position : 0);
    fact.sentencePolarity = sentencePolarity;
  }

  // --- lowercase content words for NEW_TERM ------------------------------------
  const contentWords = [];
  for (const token of tokens) {
    if (ledger.overlaps(token.start, token.end) || isCapitalised(token.text) || /\p{N}/u.test(token.text)) continue;
    for (const part of wordParts(token.text)) {
      if (part.length >= 4) contentWords.push({ word: part, token: token.text });
    }
  }

  return { facts, contentWords };
}

/**
 * Extract hard tokens from a text.
 * options.otherStems — stems of the text being compared against; a capitalised
 *   sentence-initial word already present there in lowercase is not a name.
 * options.reference — treat every capitalised word as a name (allowed-list input).
 * options.lexicon — extra lowercase words to track as LEX hard tokens.
 */
export function extractFacts(text, options = {}) {
  const context = {
    otherStems: options.otherStems ?? new Set(),
    reference: Boolean(options.reference),
    terms: options.lexicon?.length ? buildTermMatcher(options.lexicon) : DEFAULT_TERM_MATCHER,
  };
  const sentences = splitSentences(text);
  const facts = [];
  const contentWords = [];
  sentences.forEach((sentence, index) => {
    const extracted = extractSentenceFacts(sentence, index, context);
    facts.push(...extracted.facts);
    for (const word of extracted.contentWords) contentWords.push({ ...word, sentence: index });
  });
  return { sentences, facts, contentWords };
}

// ---------------------------------------------------------------------------
// Diff
// ---------------------------------------------------------------------------

const TEXTUAL_TYPES = new Set(["PROPER", "LEX", "FOOD", "DAY"]);

function factWords(fact) {
  return fact.words ?? wordParts(fact.token.replace(/\s+/g, "-"));
}

function coveredByWords(fact, stems) {
  if (!TEXTUAL_TYPES.has(fact.type)) return false;
  const words = factWords(fact).filter((word) => !ADDRESS_PREFIXES.has(word));
  return words.length > 0 && words.every((word) => knownWord(word, stems));
}

function publicFact(fact) {
  return { type: fact.type, token: fact.token, canonical: fact.canonical, sentence: fact.sentence };
}

export function factDiff(before, after, options = {}) {
  const mode = options.mode ?? "style";
  if (mode !== "style" && mode !== "evidence") throw new Error(`Unknown mode: ${mode}`);
  const allowed = {
    names: [], area: "", district: "", evidence: [], lexicon: [],
    ...(options.allowed ?? {}),
  };
  const lexicon = (allowed.lexicon ?? []).map((word) => normalizeText(word).trim().toLowerCase()).filter(Boolean);

  const referenceTexts = [
    ...(allowed.names ?? []),
    allowed.area ?? "",
    allowed.district ?? "",
    ...(mode === "evidence" ? (allowed.evidence ?? []) : []),
  ].map((value) => String(value ?? "")).filter((value) => value.trim());

  const beforeWords = wordBag(before);
  const afterWords = wordBag(after);
  const referenceWords = new Set();
  for (const text of referenceTexts) for (const word of wordBag(text)) referenceWords.add(word);

  const afterStems = stemSet(afterWords);
  // Lexicon words are tracked, not pre-approved: they stay out of the allowed set.
  const allowedStems = stemSet(new Set([...beforeWords, ...referenceWords]));

  const beforeX = extractFacts(before, { otherStems: afterStems, lexicon });
  const afterX = extractFacts(after, { otherStems: allowedStems, lexicon });
  const referenceFacts = referenceTexts.flatMap((text) => extractFacts(text, { reference: true, lexicon }).facts);

  const allowedCanon = new Set([...beforeX.facts, ...referenceFacts].map((fact) => fact.canonical));
  const afterCanon = new Set(afterX.facts.map((fact) => fact.canonical));

  const rejects = [];
  const seenRejects = new Set();
  for (const fact of afterX.facts) {
    if (allowedCanon.has(fact.canonical) || coveredByWords(fact, allowedStems)) continue;
    if (seenRejects.has(fact.canonical)) continue;
    seenRejects.add(fact.canonical);
    rejects.push({ type: fact.type, token: fact.token, canonical: fact.canonical, where: afterX.sentences[fact.sentence] });
  }

  const dropped = [];
  const seenDropped = new Set();
  for (const fact of beforeX.facts) {
    if (afterCanon.has(fact.canonical) || coveredByWords(fact, afterStems)) continue;
    if (seenDropped.has(fact.canonical)) continue;
    seenDropped.add(fact.canonical);
    dropped.push({ type: fact.type, token: fact.token, canonical: fact.canonical });
  }

  const warns = [];
  const polarityIndex = (facts) => {
    const index = new Map();
    for (const fact of facts) {
      const entry = index.get(fact.canonical) ?? { clause: new Set(), sentence: new Set() };
      for (const marker of fact.polarity) entry.clause.add(marker);
      for (const marker of fact.sentencePolarity) entry.sentence.add(marker);
      index.set(fact.canonical, entry);
    }
    return index;
  };
  const sameMarkers = (a, b) => [...a].sort().join(",") === [...b].sort().join(",");
  const polarityBefore = polarityIndex(beforeX.facts);
  const polarityAfter = polarityIndex(afterX.facts);
  // One warn per rewritten sentence: every anchor in it shares the same flip.
  const seenPolarity = new Set();
  for (const fact of afterX.facts) {
    if (!polarityBefore.has(fact.canonical) || seenPolarity.has(fact.sentence)) continue;
    const previous = polarityBefore.get(fact.canonical);
    const current = polarityAfter.get(fact.canonical);
    if (sameMarkers(previous.clause, current.clause) || sameMarkers(previous.sentence, current.sentence)) continue;
    seenPolarity.add(fact.sentence);
    warns.push({ type: "POLARITY", token: fact.token, sentence: afterX.sentences[fact.sentence] });
  }

  const knownStems = stemSet(new Set([...beforeWords, ...referenceWords, ...STOPLIST, ...lexicon]));
  const seenTerms = new Set();
  for (const entry of afterX.contentWords) {
    if (seenTerms.has(entry.word) || knownWord(entry.word, knownStems)) continue;
    seenTerms.add(entry.word);
    warns.push({ type: "NEW_TERM", token: entry.token, sentence: afterX.sentences[entry.sentence] });
  }

  return {
    verdict: rejects.length ? "REJECT" : "PASS",
    rejects,
    dropped,
    warns,
    facts: { before: beforeX.facts.map(publicFact), after: afterX.facts.map(publicFact) },
  };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

export function parseCliArgs(argv) {
  const options = { before: null, after: null, beforeFile: null, afterFile: null, names: [], area: "", district: "", evidenceFile: null, lexicon: [], mode: "style", json: false };
  const args = [...argv];
  const takeValue = (index, flag) => {
    if (index + 1 >= args.length) throw new Error(`${flag} needs a value`);
    return args[index + 1];
  };
  const list = (value) => value.split(",").map((part) => part.trim()).filter(Boolean);
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const [flag, inlineValue] = arg.includes("=") ? [arg.slice(0, arg.indexOf("=")), arg.slice(arg.indexOf("=") + 1)] : [arg, undefined];
    const value = () => {
      if (inlineValue !== undefined) return inlineValue;
      index += 1;
      return takeValue(index - 1, flag);
    };
    switch (flag) {
      case "--before": options.before = value(); break;
      case "--after": options.after = value(); break;
      case "--before-file": options.beforeFile = value(); break;
      case "--after-file": options.afterFile = value(); break;
      case "--names": options.names = list(value()); break;
      case "--area": options.area = value(); break;
      case "--district": options.district = value(); break;
      case "--evidence-file": options.evidenceFile = value(); break;
      case "--lexicon": options.lexicon = list(value()); break;
      case "--mode": options.mode = value(); break;
      case "--json": options.json = true; break;
      default: throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (options.before === null && !options.beforeFile) throw new Error("--before or --before-file is required");
  if (options.after === null && !options.afterFile) throw new Error("--after or --after-file is required");
  if (options.mode !== "style" && options.mode !== "evidence") throw new Error(`Unknown mode: ${options.mode}`);
  return options;
}

function formatReport(result) {
  const lines = [result.verdict];
  if (result.rejects.length) {
    lines.push("rejects:");
    for (const item of result.rejects) lines.push(`  - ${item.type} "${item.token}" (${item.canonical}) in: ${item.where}`);
  }
  if (result.dropped.length) {
    lines.push("dropped:");
    for (const item of result.dropped) lines.push(`  - ${item.type} "${item.token}" (${item.canonical})`);
  }
  if (result.warns.length) {
    lines.push("warns:");
    for (const item of result.warns) lines.push(`  - ${item.type} "${item.token}" in: ${item.sentence}`);
  }
  return lines.join("\n");
}

async function main(argv) {
  let options;
  try {
    options = parseCliArgs(argv);
  } catch (error) {
    console.error(error.message);
    console.error('usage: node scripts/copy/fact-diff.mjs --before "<text>" --after "<text>" [--names "A,B"] [--area X] [--district Y] [--evidence-file f.txt] [--lexicon "a,b"] [--mode style|evidence] [--json]');
    process.exitCode = 2;
    return;
  }
  const before = options.beforeFile ? await readFile(resolve(options.beforeFile), "utf8") : options.before;
  const after = options.afterFile ? await readFile(resolve(options.afterFile), "utf8") : options.after;
  const evidence = options.evidenceFile ? [await readFile(resolve(options.evidenceFile), "utf8")] : [];
  const result = factDiff(before, after, {
    mode: options.mode,
    allowed: { names: options.names, area: options.area, district: options.district, evidence, lexicon: options.lexicon },
  });
  console.log(options.json ? JSON.stringify(result, null, 2) : formatReport(result));
  process.exitCode = result.verdict === "PASS" ? 0 : 1;
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) {
  await main(process.argv.slice(2));
}
