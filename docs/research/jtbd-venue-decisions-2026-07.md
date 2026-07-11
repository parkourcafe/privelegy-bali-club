# How Bali tourists decide where to go — JTBD research v1 (2026-07-11)

> **Русское резюме для Селены.** Машинный ресёрч (Reddit / TripAdvisor / блоги +
> научные работы, с адверсариальной проверкой каждого утверждения). Главный
> вывод: наша ставка на «моменты» подтверждается — поиск в Google/Maps требует
> заранее знать, что вводить, и именно эту дыру закрывает кураторский гид по
> моментам. НО: частотность самих моментов и русскоязычный сегмент ресёрч НЕ
> подтвердил — это добираем с земли. Несколько «очевидных» гипотез
> **опровергнуты** (см. §4) — их в продукт не тащим.

Method: 108-agent deep-research pass, 6 search angles, 3-vote adversarial
verification (a claim needs 2/3 refutes to be killed). Only claims that
survived verification are below. This is an internal research note — findings
inform product, they are **not** published content (guardrail #1: no scraping /
republishing reviews; the traveler quotes below are vocabulary evidence, cited).

---

## 1. What's strongly supported (high confidence)

**A. Venue choice is made and re-made ON-SITE, not just executed from a plan.**
Smartphones create a "phygital" context where position, movement and distance
become decision inputs that trigger new plans and even *cancel* pre-trip ones.
→ *Liu, Wang & Gretzel (2022), Tourism Management 88:104424.*

**B. Planning and in-the-moment discovery coexist ("planned serendipity").**
Tourists deliberately leave gaps and fill them on-site through an effortful,
"where-I-am-now" search, optimizing routes / not wasting time.
→ *Mieli (2024), Current Issues in Tourism 27(6):988-1002.*

**Product implication (A+B):** one product must serve BOTH the day-before plan
and the on-street choice. This validates our two surfaces: cinematic landing +
`/plan` tool, and the tagline *"the right place for the moment you're in."*

**C. Discovery channels are NOT interchangeable; the mix shifts in unfamiliar
areas and by segment.** Google Maps / TripAdvisor / Instagram / TikTok differ in
content, format and recommendation mechanism; usage varies by known-vs-unknown
area (the tourist condition) and by age/gender/education. Gen Z skews
Instagram/TikTok for discovery (~40-44%); 54+ skews Google/Yelp (~69%).
→ *Beier (HCI International 2025, Springer LNCS 16337), n=1,004.*

**Product implication (C):** don't assume one funnel. Segment the entry — QR/IG
for younger nomads, Maps/word-of-mouth for older couples/families.

---

## 2. The strategic validation (medium confidence, directly on our thesis)

**Query-based search leaves a curation gap.** On-site search is intentional and
narrow — *"people need to know what they are searching for in order to enter a
query string… information is not encountered casually or serendipitously"*
(Mieli 2024, verbatim). Google/Maps are poor at surfacing what the tourist
doesn't know to look for.

→ **This is the gap Other Bali fills.** Moment/JTBD framing = "you don't have to
know what to type." Keep this as the core positioning line to partners and in copy.

---

## 3. The two moments that survived with real vocabulary

**Moment: nomad laptop-work block** (medium confidence, 9-0).
Runs on a small, repeatable, *explicitly scored* criteria set:
**coffee quality · noise level · wifi speed · comfortable seating · power plugs ·
free-to-sit**, time-boxed by one failure mode: **time-of-day crowding**.
Vocabulary evidence: venues literally scored *"Coffee 9/10, Noise: Medium, WiFi:
Medium"*; Crate Cafe *"super crowded by mid morning"* / *"too distracting from
9am"*. → *Johnny Africa work-cafes guide (2026); TripAdvisor; zin.world.*

**Moment: couples' special-occasion dinner (Ubud)** (medium, 5-1).
**Planned in advance, not in-the-moment.** Framed in romance markers, not food:
*"special occasion romantic candlelight dinner setting"*; explicit price-anchor
deliberation before booking (~10m+ IDR at Mozaic). → *TripAdvisor Ubud forum
thread k15319923.*

**Product implication:** our `work-session` moment should carry these six as
`practical_tags` / criteria, plus a "quiet before ~9am" time cue. Our
`late-dinner` moment should split: casual-late-dinner vs **planned
special-occasion** (higher price anchor, book-ahead, romance vocabulary) — the
latter is a distinct job.

---

## 4. Refuted — do NOT build on these (they were intuitive and wrong)

- **"Families choose by physical space for a toddler (lawn/courtyard)"** — 0-3
  refuted. Do not assert this as the family criterion.
- **"Wifi is table-stakes; nearly every Canggu venue is fine for work"** —
  refuted. Wifi speed *is* a live differentiator in the work moment (see §3).
- **"Discovery runs through the coworking/hostel community (Dojo etc.)"** —
  refuted as a *primary* channel. Don't overweight community word-of-mouth
  until field data says otherwise.
- Various specific "nomad day chains" (7am Mustache 25k coffee → Lolas dinner)
  — single-blog, refuted. Don't hard-code specific venue chains from blogs.

---

## 5. Open — must come from the FIELD, not the web (verification gaps)

1. **Frequency/priority of the moments taxonomy.** No web evidence quantifies
   how often "sunset / slow morning / rainy day / post-surf" actually drive
   trips out. → needs Reddit/forum corpus sampling **or** field interviews.
   Our 6 moments stay a **hypothesis** until then.
2. **Russian-speaking expats — a stated audience with ZERO surviving evidence.**
   No RU-language source survived. Telegram/VK Bali chats are an untouched,
   high-value corpus. → dedicated RU-language pass or field.
3. **Word-of-mouth (villa hosts, drivers) vs platforms** — the one supporting
   claim was refuted; real role unknown in Canggu specifically.
4. **Which platform actually wins the in-the-moment choice by segment** (Maps vs
   IG/TikTok saved posts) — no Bali-specific channel-share survived.

These four are exactly the "2 minutes with a guest" + IG-by-hand + RU-chat
tasks — the web can't close them.

---

## 6. What changes in the product (proposed, gated on founder ok)

1. Add work-moment criteria as `practical_tags` vocabulary: `fast wifi`,
   `power plugs`, `free to sit`, `quiet before 9am`, `good coffee`.
2. Split `late-dinner` → keep casual; add `special-occasion` moment
   (book-ahead, price-anchor shown, romance framing) for the couples job.
3. Keep `slow-morning / midday-reset / golden-hour / family-day` but mark
   internally as **hypothesis** — validate/re-rank from field before investing.
4. Do NOT ship a "kid space" family claim; soften family copy to fit-context.
5. Field kit gets 3 guest questions (source / when-decided / near-miss) +
   an IG-by-area checklist + a RU-chat listening pass.

Sources are inline above; full machine report retained in task output
`w2o3coz9q` (not committed — contains raw fetched text).
