// Island-wide "things to do in Bali" registry — the icon sights that anchor the
// /things-to-do-in-bali hub. A code registry (not venue rows or a DB entity,
// guardrail #11), mirroring lib/sanur/content.ts etc. Facts are from a verified
// web-research pass (14 Jul 2026, official temple/park sites + Bali provincial
// tourism); descriptions are factual with one practical note each, no hype
// (guardrail #7). Entry fees are intentionally NOT published as figures — Bali
// site fees change often and cash-only, so stale numbers would mislead
// (freshness guardrail); we say a fee exists and to check on arrival. Every item
// links only to Google Maps / neutral info — no money loop (this is planning).

export const BALI_THINGS_REVIEW_DATE = "2026-07-14";

const maps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${q} Bali`)}`;

export type BaliThingGroup = "temples" | "nature" | "culture";

export interface BaliThing {
  group: BaliThingGroup;
  title: string;
  region: string;
  blurb: string;
  mapsUrl?: string;
}

export const BALI_ICONS: BaliThing[] = [
  // ── Temples & sacred sites ────────────────────────────────────────────
  {
    group: "temples",
    title: "Uluwatu Temple & the sunset Kecak",
    region: "Pecatu, Bukit peninsula (south)",
    blurb:
      "A clifftop sea temple perched ~70m above the ocean, with a daily sunset Kecak fire dance in the open-air amphitheatre next door. A sarong and sash are required and handed out free at the gate; the resident macaques will grab loose glasses and phones, so keep them secured.",
    mapsUrl: maps("Pura Luhur Uluwatu Temple"),
  },
  {
    group: "temples",
    title: "Tanah Lot",
    region: "Beraban, Tabanan (west coast)",
    blurb:
      "Bali's most photographed sea temple, set on an offshore rock and framed by the sunset. The sanctum is closed to non-worshippers, but you can walk the rock base and the clifftop grounds — access to the base is only possible at low tide, so check the tide and come by late afternoon.",
    mapsUrl: maps("Tanah Lot Temple"),
  },
  {
    group: "temples",
    title: "Ulun Danu Beratan",
    region: "Bedugul highlands, Tabanan",
    blurb:
      "The lake temple whose shrines appear to float on Lake Beratan when the water is high — the scene on the 50,000-rupiah note. It sits at ~1,200m, so mornings are cool and misty; go early for calm-water reflections.",
    mapsUrl: maps("Ulun Danu Beratan Temple Bedugul"),
  },
  {
    group: "temples",
    title: "Tirta Empul holy spring",
    region: "Tampaksiring, ~40 min north of Ubud",
    blurb:
      "A temple built around a sacred spring where Balinese Hindus — and visitors — perform melukat, a purification ritual moving spout to spout through the bathing pool. A sarong is required (provided); bring dry clothes if you bathe.",
    mapsUrl: maps("Tirta Empul Temple Tampaksiring"),
  },
  {
    group: "temples",
    title: "Besakih, the Mother Temple",
    region: "Rendang, Karangasem (Mount Agung, east)",
    blurb:
      "Bali's largest and holiest temple complex, on the slopes of Mount Agung. Since the new visitor centre opened, a single foreigner ticket bundles a mandatory local guide, sarong and a short shuttle up to the gate — you can no longer self-tour it, so plan for the managed route.",
    mapsUrl: maps("Pura Besakih Temple"),
  },
  {
    group: "temples",
    title: "Lempuyang — the Gates of Heaven",
    region: "Abang, Karangasem (east)",
    blurb:
      "An active clifftop temple famous for the split-gate photo with the mountain behind. Be warned: the mirror-lake reflection is a trick done with a small mirror under a phone — there is no pool, and the managed photo queue can run 1–3 hours, so arrive at opening.",
    mapsUrl: maps("Pura Lempuyang Luhur Gates of Heaven"),
  },
  // ── Nature, viewpoints & treks ────────────────────────────────────────
  {
    group: "nature",
    title: "Mount Batur sunrise trek",
    region: "Kintamani, Bangli (central highlands)",
    blurb:
      "The classic pre-dawn hike up an active volcano (1,717m) to watch sunrise over the caldera and Lake Batur — about two hours up, starting around 3.30–4am. A registered local guide is mandatory and enforced; you can't do it solo.",
    mapsUrl: maps("Mount Batur Kintamani trek"),
  },
  {
    group: "nature",
    title: "Tegallalang Rice Terraces",
    region: "~20 min north of Ubud",
    blurb:
      "A steep, sculpted valley of terraced paddies watered by Bali's traditional subak cooperative irrigation, with paid jungle swings on site. Go 7–9am before the crowds and heat. (It's a subak example, not one of the island's UNESCO-inscribed terraces — that's Jatiluwih, further west.)",
    mapsUrl: maps("Tegallalang Rice Terraces"),
  },
  {
    group: "nature",
    title: "Chase a waterfall",
    region: "Around Ubud & the north",
    blurb:
      "Tegenungan (near Ubud) is the easy one — big falls, steps down, minimal effort. Tibumana is the calm, swimmable alternative. Sekumpul in the north is the most spectacular but a proper trek with river crossings and, since 2025, a mandatory village guide — go in the dry season.",
    mapsUrl: maps("Tegenungan Waterfall"),
  },
  {
    group: "nature",
    title: "Nusa Penida day trip",
    region: "Island off the south-east, fast boat from Sanur",
    blurb:
      "A 30–45 minute fast boat from Sanur reaches the island of Kelingking's T-Rex cliff, Broken Beach, Angel's Billabong (only safe at low tide — never swim on a rising tide) and Crystal Bay. The roads are rough and distances long, so do it as a full day with a tour or hired driver, not a self-drive scooter loop.",
    mapsUrl: maps("Kelingking Beach Nusa Penida"),
  },
  {
    group: "nature",
    title: "Handara Gate",
    region: "Pancasari, Bedugul (north)",
    blurb:
      "A free-standing Balinese split gate framing forested crater hills — a pure photo stop rather than a temple, at the entrance to the Handara golf resort. Best early for the light and a shorter queue.",
    mapsUrl: maps("Handara Gate Bedugul"),
  },
  {
    group: "nature",
    title: "Sidemen Valley",
    region: "Karangasem (east Bali)",
    blurb:
      "A quiet rural valley of rice terraces, rivers and weaving villages under Mount Agung — the slower, less-developed alternative to Ubud. It's a scenic base to stay and walk rather than a single ticketed sight; best over an overnight.",
    mapsUrl: maps("Sidemen Valley Karangasem"),
  },
  // ── Culture & experiences ─────────────────────────────────────────────
  {
    group: "culture",
    title: "A traditional dance performance",
    region: "Ubud, Uluwatu & Nusa Dua",
    blurb:
      "Kecak, Legong and Barong are a standard evening out: Ubud Palace stages a different nightly dance around 7.30pm, Uluwatu runs the sunset Kecak, and GWK includes daytime dances and an evening Kecak. Ubud is the easiest base for picking a different style each night.",
    mapsUrl: maps("Ubud Palace Puri Saren"),
  },
  {
    group: "culture",
    title: "A coffee plantation tour",
    region: "Ubud & Kintamani belt",
    blurb:
      "A common half-day: a plantation tour with free tastings of Balinese coffees and teas, with kopi luwak (civet coffee) sold as the premium pour. Worth doing for the tasting — but much tourist luwak coffee comes from caged civets, so ask whether the civets are caged or wild-sourced and skip the caged operations.",
    mapsUrl: maps("Ubud coffee plantation Tegallalang"),
  },
];

export const BALI_THING_GROUPS: { key: BaliThingGroup; heading: string; note: string }[] = [
  { key: "temples", heading: "Temples & sacred sites", note: "Sea temples, lake temples and holy springs — bring a sarong; most provide one." },
  { key: "nature", heading: "Nature, viewpoints & treks", note: "Volcano sunrises, rice terraces, waterfalls and the Nusa Penida cliffs." },
  { key: "culture", heading: "Culture & experiences", note: "Evening dance and coffee agrotourism — easy to slot into any base." },
];

export const BALI_THINGS_FAQ = [
  {
    q: "What are the must-see things to do in Bali?",
    a: "The island icons are Uluwatu Temple and its sunset Kecak, Tanah Lot, the Tegallalang rice terraces, a Mount Batur sunrise trek, a waterfall like Tegenungan or Sekumpul, and a Nusa Penida day trip. Beyond those, each area has its own things to do — Ubud for culture and rice fields, the Bukit for cliffs and surf, Sanur and Nusa Dua for calm beaches.",
  },
  {
    q: "How many days do you need to see the main sights?",
    a: "Bali's icons are spread across the island, so plan around your base rather than trying to see everything. A week lets you pair one inland stay (Ubud, for temples, terraces and Batur) with one by the sea, and still fit a Nusa Penida day. See our how-many-days and itinerary guides.",
  },
  {
    q: "Do I need to pay to visit Bali's temples and sights?",
    a: "Most temples and sights charge a small cash entry fee in rupiah, and some — Besakih, Mount Batur and Sekumpul waterfall — now require a paid local guide. Bali also charges a one-time foreign-tourist levy you can pay online via the official Love Bali site; check current amounts before you go, as fees change.",
  },
  {
    q: "What should I wear to Bali's temples?",
    a: "A sarong and a covered top with shoulders covered. Most temples provide a sarong (and sash) free or for a small rental at the entrance, but carrying your own is easier. Purification sites like Tirta Empul have a separate wet sarong if you bathe.",
  },
  {
    q: "Is the Gates of Heaven photo real?",
    a: "The temple (Lempuyang) is real and active, but the mirror-lake 'reflection' is created with a small mirror held under a phone camera — there's no pool. Expect a long managed queue for the photo, so arrive at opening.",
  },
];
