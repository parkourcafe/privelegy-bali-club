# Other Bali Homepage Wave 4 Discovery

Дата: 2026-07-22
Режим: Phase A / read-only product audit
Маршрут: `/`
Репозиторий: `parkourcafe/privelegy-bali-club`
Текущая ветка: `codex/chope-607-db-aware-dedup-2026-07-22`
HEAD: `9066ee61db92496b2c9da9ca5ec95f192591eea4`
`origin/main`: `2b168079668ad80792bb767e75188b53fcb78669`

Статус: `BLOCKED FOR IMPLEMENTATION UNTIL GATE A`.

Код продукта не менялся. Созданы только этот discovery report и evidence/artifact-файлы в `docs/wave4-homepage-evidence/`.

---

## 1. Executive verdict и оценка `/`

Текущая главная технически живая и индексируемая в production, но продуктово не готова к Wave 4 без reset.

Оценка текущей `/`: **62 / 100**.

| Criterion | Weight | Score | Status | Evidence |
|---|---:|---:|---|---|
| Clarity of purpose | 15 | 9 | Code-confirmed | Hero + day builder + many later explanatory sections: `app/page.tsx:92-120`, `app/page.tsx:131-199`, `components/landing/DayIntentBuilder.tsx:200-314` |
| Whole-Bali alignment | 15 | 8 | Partially code-confirmed | Has Bali-wide copy and district grid, but still says `Canggu-deep guidance` and “right now that’s Canggu”: `app/page.tsx:147-149`, `app/page.tsx:706-713` |
| Decision usefulness | 20 | 13 | Code-confirmed with gaps | Quick starts and moments exist; many lead to guides or filtered `/places`: `components/landing/DayIntentBuilder.tsx:103-110`, `app/page.tsx:447-541` |
| Source trust | 15 | 7 | Unknown / blocker | Claims like “verified vibe tags”, “checked in person”, “honest price anchors” are visible but not item-level proven on homepage: `app/page.tsx:319-322`, `app/page.tsx:581-590`, `app/page.tsx:831-844` |
| Actionability | 10 | 8 | Code-confirmed | 84 links rendered in production baseline; key targets mostly 200; `/uluwatu` 200 in production, local dev stale 404 |
| Mobile usability | 10 | 8 | Code-confirmed | Screenshots at 320/375/768/1024/1440; no horizontal overflow in production preview: `docs/wave4-homepage-evidence/homepage-baseline.json` |
| SEO | 5 | 4 | Code-confirmed | 200, 1 H1, self-canonical, sitemap contains homepage; duplicate WebSite/Organization JSON-LD risk between layout and page: `app/layout.tsx:67-95`, `app/page.tsx:42-88` |
| Accessibility | 5 | 3 | Partial | Semantic headings and links present; axe package absent, keyboard audit not fully automated: `npm ls lighthouse @axe-core/puppeteer axe-core --depth=0` returned empty |
| Performance | 3 | 1 | Unknown / blocker | Build passes; Lighthouse package absent, no median x3 available without adding dependency |
| Duplication/legacy risk | 2 | 1 | Code-confirmed | Homepage has both old long landing narrative and newer Wave 1 entrances; Wave 4 wants simpler IA: `app/page.tsx:92-120` |

Main verdict:

- `Code-confirmed`: `/` returns HTTP 200 in production and Googlebot UA gets 200.
- `Code-confirmed`: `/` has exactly one H1 in rendered DOM.
- `Code-confirmed`: no `Open now` text found in rendered homepage baseline.
- `Code-confirmed`: current homepage still has Canggu-first/deep framing and B2B/partner copy in visible journey/footer.
- `Unknown / blocker`: current resident/trust claims are not backed by a homepage item-level data contract.
- `Unknown / blocker`: Lighthouse and axe were not run because the packages are not installed and Phase A forbids package installation.

---

## 2. Repository evidence map

| Area | Evidence | Status |
|---|---|---|
| Operating instructions | `AGENTS.md` hash `60a3125bd7afb2323f5fe44cbd7e8dc69b4c997309c7e564f143ed62fcc9b40c` | Code-confirmed |
| Master architecture | `Other_Bali_Master_Architecture.md` hash `df09593ec2a12c158f8610d7b49e5a3ae5ae046a179e18e36a12729221443276` | Code-confirmed source artifact |
| README | `README.md` hash `04f06bdf7e71353f51e555fea7e16e619d7f741cc5e5a3cee93c3a39683d53d1` | Code-confirmed; partly legacy/conflicting |
| Canonical product index | `docs/canonical-product/README_START_HERE.md` hash `7472cbed18c91e060d44a40c6c77153e3c2ef6656beecdc62be017cdad500a85` | Code-confirmed |
| Homepage route | `app/page.tsx` | Code-confirmed |
| Root layout/global metadata/JSON-LD | `app/layout.tsx` | Code-confirmed |
| Public navigation registry | `lib/navigation.ts` | Code-confirmed |
| Homepage day builder | `components/landing/DayIntentBuilder.tsx` | Code-confirmed |
| Browse pill data wrapper | `components/landing/BrowseBar.tsx` | Code-confirmed |
| District guide source | `lib/districts.ts` | Code-confirmed static editorial source |
| Footer | `components/SiteFooter.tsx` | Code-confirmed shared component |
| Analytics client/helpers | `components/Analytics.tsx`, `components/AnalyticsClient.tsx`, `lib/analytics.ts`, `app/SourceCapture.tsx`, `components/ConsentBanner.tsx` | Code-confirmed |
| Robots/sitemap | `app/robots.ts`, `app/sitemap.ts` | Code-confirmed |
| Homepage boundary tests | `scripts/wave1-home-boundary.test.mjs` | Code-confirmed |
| Wave 2/Wave 3 boundary tests | `scripts/wave2-product-boundary.test.mjs`, `scripts/wave3-product-boundary.test.mjs` | Code-confirmed |
| Evidence folder | `docs/wave4-homepage-evidence/` | Created in Phase A |

### Normative Decision Register

| Decision ID | Exact rule | Status | Source availability | Repository evidence | Required action |
|---|---|---|---|---|---|
| D-001 | Other Bali is a whole-Bali product; Canggu is not the global product centre | Founder-approved rule | Brief text supplied in task; original V1.2 file not found in repo | Current code partially conflicts: `app/page.tsx:147-149`, `app/page.tsx:706-713` | Remove Canggu-global-centre framing in Gate A-approved copy |
| D-002 | Historical Canggu-first architecture is not binding strategy | Founder-approved rule | Brief text supplied; original V1.2 missing | Master architecture still encodes active-deep Canggu model; current homepage repeats it | Treat as target rule, not current code fact |
| D-003 | Organic editorial ranking is independent from payment | Founder-approved rule | Brief + code | Current copy says no paid rankings: `app/page.tsx:551-579`; footer has monetization copy: `components/SiteFooter.tsx:326-329` | Keep no-paid-ranking; review footer monetization claim |
| D-004 | No paid placement before 2026-09-21; no sponsored homepage inventory | Founder-approved rule | Brief + previous money freeze | No sponsored homepage inventory found; partner/free pilot copy visible | Do not add sponsored slots; consider removing partner block from homepage journey |
| D-005 | Not Google Maps clone, SEO farm, exhaustive directory, discount card | Founder-approved rule | Brief + AGENTS | Header/category gateway and long SEO-like sections create directory risk but not a full clone | Simplify to decision-content IA |
| D-006 | Full decision-ready venue depth may exist in any Bali district | Founder-approved rule | Brief | Current copy still says deep one district at a time/Canggu: `app/page.tsx:706-713` | Remove restriction from homepage promise |
| D-007 | Destination decision-content is current product identity | Working decision | Brief | Current app has matching pattern but noisy execution | Gate A should approve WIRE-4.1 or revised version |

Missing source artifact: `GENSPARK_OTHERBALI_STRATEGIC_RESET_V1.2_FINAL_PATCH` was referenced in the brief but not found in repo during Phase A. Rules repeated in the user brief were treated as owner-provided normative input, not repository facts.

---

## 3. Current Homepage Inventory

| section_id | Position | User job | Visible copy summary | Code evidence | Data source | CTA destinations | States | Analytics | SEO/a11y | Decision | Score | Critical issues |
|---|---:|---|---|---|---|---|---|---|---|---|---:|---|
| `global_header_landing` | 0 | Navigate landing anchors and core surfaces | Build a day, How it works, Moments, A Bali Day, Around Bali, Explore | `components/landing/LandingChrome.tsx:1-120`; mounted in `app/page.tsx:89-90` | Static NAV array | `#day-builder`, `#how`, `#moments`, `/my-day`, `#bali`, `/places` | Client scroll state, mobile menu | No homepage-specific events | Header/nav landmarks; client component | Modify | 65 | Duplicates global header; anchor-heavy; not WIRE-4.0 global nav |
| `home_hero` | 1 | Understand promise and choose immediate action | “Bali-wide planning · Canggu-deep guidance”; H1; Plan my day; Browse all places | `app/page.tsx:131-199` | Static copy + `SceneImage`/`HeroLoop` assets | `#day-builder`, `/places` | Image/video fallback only | No click instrumentation | 1 H1, SSR copy visible | Modify | 70 | Canggu-deep claim conflicts D-001/D-006; CTA labels differ from COPY-4.0; Browse all places too directory-forward |
| `home_day_builder` | 1b | Pick quick scenario or fine-tune brief | “Tell us the trip. Get the shortlist.” + 6 quick starts + fine-tune | `components/landing/DayIntentBuilder.tsx:103-314` | Static `quickStarts`, static axes | Six guide URLs, `/places`, filtered `/places?...` | Expanded/collapsed client state | No `home_scenario_select`; only navigation | Section has `aria-label`; buttons native | Modify/Merge | 72 | Good pattern, but wrong labels/order for WIRE-4.0; advanced brief may be too much above fold; static targets need validation |
| `home_primary_entrances` | 2 | Distinguish before-trip vs in-Bali | “Plan before the trip, or decide while you’re here.” + venue link | `app/page.tsx:206-252` | Static copy | `/plan`, `/places`, `/for-venues` | None | No homepage-specific events | Good section heading | Merge | 68 | Useful intent split, but duplicates hero; B2B link appears before main content sections |
| `home_categories_gateway` | 3 | Browse by category | “What are you looking for?” four primary cards + two secondary | `app/page.tsx:258-285`, `lib/navigation.ts:117-129` | `GATEWAY_PRIMARY`, `GATEWAY_SECONDARY` | category/area/guide pages | Static; translations via `t()` | No `home_category_select` | H2 + cards | Modify | 66 | Appears before scenario layer, contrary WIRE-4.0; only 4+2 categories, not final 6-10 category set |
| `home_browse_bar` | 4 | Jump to where/taste/moment browse | “Or jump straight in” | `components/landing/BrowseBar.tsx:1-32` | `PILLARS`, `COLLECTIONS`, `liveCollectionSlugs()` | Pillar/collection URLs | Renders null if no live taste/moment | Unknown | Server wrapper; conditional section | Remove/Merge | 55 | Extra browse layer; data depends on live collections; not in WIRE-4.0 |
| `home_problem_chaos` | 5 | Frame old planning pain | “death by a thousand tabs”; “verified vibe tags”, “honest price anchors” | `app/page.tsx:288-341` | Static copy | None | None | None | H2/H3 text SSR | Remove/Merge | 48 | Long marketing section; contains unproven claims under Wave 4 copy rules |
| `home_mechanism` | 6 | Explain find/map/go/keep loop | “How Other Bali actually works…” | `app/page.tsx:344-400` | Static copy | None | None | None | Ordered list | Merge | 58 | Over-explains mechanism; duplicates WIRE trust/save and moments |
| `home_how_it_works` | 8 | Explain steps | “From where do we go? to a table…” | `app/page.tsx:404-444` | Static copy | `#day-builder` | None | None | H2 + cards | Merge/Remove | 56 | Duplicates mechanism; “table” implies booking/restaurant bias |
| `home_moments_current` | 9 | Scenario browsing | Slow morning, Midday reset, Golden hour, Late dinner | `app/page.tsx:447-541` | Static scene array | Filtered `/places`, `/my-day` | None | No scenario events | Good H2; visible links | Modify | 73 | Good layer but after category/long sections; only 4 items; includes availability-ish late-night context without hours proof |
| `home_trust_cards` | 10 | Explain free/no paid order/privacy | Free for travellers, Free partner pilot, No paid rankings | `app/page.tsx:551-579` | Static copy | None | None | None | H2/cards | Modify | 64 | Good no-paid-ranking; partner pilot too prominent for B2C homepage |
| `home_whats_inside` | 12 | List product capabilities | Curated places, routes, verified tags, price anchors, what to order | `app/page.tsx:581-612` | Static copy | None | None | None | H2/H3 | Modify | 53 | Multiple claims require evidence/data contract; no item-level proof |
| `home_comparison` | 13 | Position vs Google/listing/group chat | “Where the usual tools stop” | `app/page.tsx:614-686` | Static copy | None | None | None | H2/H3 | Remove/Merge | 45 | Long competitive positioning; not needed for WIRE-4.0; includes “checked in person/offer ready/book” claim |
| `home_around_bali` | 14 | Choose area | “All of Bali, honestly mapped.” + district grid | `app/page.tsx:696-824`, `lib/districts.ts:1-206` | Static district guide + catalogue flags | area guide, `/places?district`, Google Maps | Static | `DistrictMapLink` may track district opens; not homepage taxonomy | Many H3s; external Maps links | Modify | 68 | Useful planning layer, but says Canggu is current deep centre; includes beyond-Bali entries; CTA text can mismatch e.g. “Open the Nusa guide” for Nusa Dua |
| `home_human_moment` | 15 | Trust emotional proof | “Built by people who live in Bali…” | `app/page.tsx:831-848` | Static copy | None | None | None | H text | Modify | 55 | Claim needs operational proof or narrower copy |
| `home_faq` | 16 | Answer objections | Free/account/pay/ranking/choose/where | `app/page.tsx:854-899` | Static copy + FAQ JSON-LD | None | details open/closed | None | FAQPage JSON-LD | Modify | 59 | FAQ JSON-LD describes visible content but duplicates root/page WebSite graph; Canggu-deep answer conflicts Wave 4 |
| `home_final_cta` | 17 | Re-engage | “Your next Bali day starts with the right map.” | `app/page.tsx:902-933` | Static copy | `#day-builder`, `#how` | None | None | H2/links | Merge | 50 | Another map/day-builder CTA; not in WIRE-4.0 |
| `global_footer` | 18 | Global footer, B2B/contact/legal | Partner with us — free; traveller never pays; venue monetization copy | `components/SiteFooter.tsx:240-334` | Static copy/contact constants | `/villas`, `/hotels`, `/for-venues`, `/list-your-property`, WhatsApp/mail/Instagram | None | Unknown | Footer landmark | Separate task | 45 | B2B card and “earn from venues…” statement mix B2B/money into global tourist footer; outside Wave 4 unless Gate A expands scope |

---

## 4. Data-source matrix

| Visible field / block | Canonical source | Query path | Publication rule | Editorial rule | Freshness | Fallback | Trust class | Privacy |
|---|---|---|---|---|---|---|---|---|
| Hero copy | `app/page.tsx:147-184` | Static SSR | N/A | Static copy | No versioned copy file | Always renders | Organic | No PII |
| Hero scene/video | `SceneImage`, `HeroLoop` via `app/page.tsx:134-141` | Static asset | N/A | Decorative | Asset freshness unknown | Poster fallback comment | System-generated/media | No PII |
| Six quick starts | `components/landing/DayIntentBuilder.tsx:103-110` | Static client component | Target route existence only, not data validated here | Direct label/hint | No verified_at | Always renders | Organic | No PII |
| Fine-tune axes | `components/landing/DayIntentBuilder.tsx` static arrays | Client state builds URL | `/places` handles downstream publication | User-selected tags | N/A | `/places` if no brief | System-generated | Does not send raw analytics unless clicked; URL query includes choices |
| Category cards | `lib/navigation.ts:117-129` | `CategoryGateway` maps registry | `lib/navigation.test.ts` checks static route existence | Canonical registry labels | No date | Always renders | Organic | No PII |
| BrowseBar taste/moment | `lib/collections.ts`, `liveCollectionSlugs()` | Async server component | `liveCollectionSlugs()` filters live collection slugs | Collection metadata | Depends on collection gate | Returns null if no taste/moment | Organic | No PII |
| District grid | `lib/districts.ts:1-206` | Static import into `AroundBali` | Static flags `catalogued`, `guidePath`; not DB queried here | Static editorial copy | No verified_at in file | Google Maps fallback for non-catalogued | Organic | External Maps links |
| Trust/no-paid claims | `app/page.tsx:551-579`; `components/SiteFooter.tsx:326-329` | Static | N/A | Founder rule + copy | Not date-stamped in UI | Always renders | Organic/business | No PII |
| FAQ JSON-LD | `app/page.tsx:854-899` | Static | N/A | Mirrors visible FAQ | No update date | Always renders | Organic | No PII |
| Footer contact | `components/SiteFooter.tsx`, `lib/contact.ts` | Static | N/A | Contact utility | Unknown | Always renders | Utility/B2B | Phone/email visible by design |

Data risks checked:

- `Open now`: not found in `app/page.tsx` rendered text or `homepage-baseline.json`.
- Paid status ranking: no sponsored homepage inventory found; no paid homepage sorting found.
- Draft/candidate records: homepage does not query venue catalogue for resident picks; current dynamic sections are static/registry-based, so draft venues do not appear via homepage-specific venue query. However, if Wave 4 adds resident picks, a new validation gate is required.
- Hardcoded slugs: yes. Quick starts, moments, district grid and footer links contain many static URLs. Static route existence is partially tested by `lib/navigation.test.ts`; quick start/moment/district links need Wave 4 validation coverage.

---

## 5. Analytics baseline

| Item | Current state | Evidence | Gap to ANALYTICS-4.0 |
|---|---|---|---|
| GA loading | Disabled unless `VERCEL_ENV=production` and `NEXT_PUBLIC_ENABLE_ANALYTICS=1` | `components/Analytics.tsx` | OK privacy posture |
| Consent | Banner sets granted/denied; GA and internal event store guarded | `components/ConsentBanner.tsx`, `lib/consent.ts`, `lib/analytics.ts` | Need homepage-specific events after consent |
| Page view | GA SPA page_view after consent, not private paths | `components/AnalyticsClient.tsx` | Needs `page_type=home`, event_version if adopted |
| Landing open | `SourceCapture` and banner send `landing_open` after consent | `app/SourceCapture.tsx`, `components/ConsentBanner.tsx` | Not equivalent to Wave 4 CTA/exposure events |
| Existing event taxonomy | `save`, `route_add`, `shortlist_generated`, venue/action events | `lib/analytics.ts` | No `source_context=homepage`, `section_id`, `event_id` for homepage links |
| Provider debug | Not available in Phase A without live analytics console | Unknown / blocker | Gate A must define debug procedure |

Recommendation: reuse current consent-gated event path; add only missing homepage events/properties. Do not add a new provider.

---

## 6. SEO / accessibility / performance baseline

### SEO

| Check | Result | Evidence |
|---|---|---|
| Production browser HTTP status | 200 | `curl -I https://www.otherbali.com/` at 2026-07-22 00:54 UTC |
| Production Googlebot Smartphone HTTP status | 200 | `curl -I -A 'Googlebot Smartphone' https://www.otherbali.com/` |
| Production robots | Allows `/`; disallows operational paths | `https://www.otherbali.com/robots.txt`; code `app/robots.ts` |
| Local non-production robots | Disallow `/` | Expected from `app/robots.ts:4-6` when `VERCEL_ENV !== production` |
| Sitemap includes homepage | Yes, first URL `https://www.otherbali.com` | `app/sitemap.ts`; production sitemap curl |
| Title | `Other Bali — the right place for the moment you're in` | `app/page.tsx:26-40`; baseline JSON |
| Meta description | Current old copy, differs from COPY-4.0 | `app/page.tsx:26-40`; baseline JSON |
| Canonical | `https://www.otherbali.com` rendered | `app/page.tsx:30`; baseline JSON |
| H1 | exactly 1 | baseline `homepage-baseline.json` |
| Structured data | Layout emits Organization/WebSite; page emits Organization/WebSite; FAQ emits FAQPage | `app/layout.tsx`, `app/page.tsx:42-88`, `app/page.tsx:854-899` |
| Schema risk | Duplicate Organization/WebSite nodes and unsafe `JSON.stringify` pattern persists on homepage | `dangerouslySetInnerHTML={{ __html: JSON.stringify(...) }}` in `app/layout.tsx`, `app/page.tsx` |

### Accessibility

| Check | Result | Evidence |
|---|---|---|
| Semantic main | Present | baseline script verifies main through rendered HTML file |
| H1 count | 1 | `homepage-baseline.json` |
| Horizontal overflow | none at 320/375/768/1024/1440 in production preview | `homepage-baseline.json` |
| Console/page errors | none in production preview | `homepage-baseline.json` |
| axe | Not run | `npm ls lighthouse @axe-core/puppeteer axe-core --depth=0` returned empty; Phase A forbids install |
| Manual keyboard/focus | Partial only | Not completed; requires browser walkthrough in Gate A/Phase B QA |

### Performance

| Check | Result | Evidence |
|---|---|---|
| Production build | PASS | `npm run build`, Next 16.2.10, 151 static pages generated, `/` dynamic |
| Route type | `/` dynamic server-rendered on demand | build route table: `ƒ /` |
| Lighthouse mobile median x3 | Unknown / blocker | Lighthouse not installed; Phase A forbids package install |
| Route JS budget | Unknown / blocker | Next build output in current config did not print route JS sizes |
| LCP asset | Likely hero media/image, not measured | `app/page.tsx:134-141`; no Lighthouse trace |

Screenshots/evidence:

- `docs/wave4-homepage-evidence/homepage-320.png`
- `docs/wave4-homepage-evidence/homepage-375.png`
- `docs/wave4-homepage-evidence/homepage-768.png`
- `docs/wave4-homepage-evidence/homepage-1024.png`
- `docs/wave4-homepage-evidence/homepage-1440.png`
- `docs/wave4-homepage-evidence/homepage-baseline.json`
- `docs/wave4-homepage-evidence/homepage-rendered.html`

---

## 7. Keep / Modify / Remove / Merge / Add decision log

| Decision | Item | Reason | Evidence |
|---|---|---|---|
| Keep | Existing global metadata foundation | Works, homepage indexable; update homepage-specific title/description only after Gate A | `app/page.tsx:26-40`, production curl |
| Keep | Navigation registry as canonical category source | Shared registry prevents menu/homepage drift | `lib/navigation.ts:1-129`, `lib/navigation.test.ts` |
| Keep | Consent-gated analytics architecture | Strong privacy baseline | `components/Analytics.tsx`, `components/ConsentBanner.tsx`, `lib/analytics.ts` |
| Modify | Hero | Remove Canggu-deep/global guide claim; align CTAs to WIRE/COPY | `app/page.tsx:147-184` |
| Modify/Merge | DayIntentBuilder | Reuse scenario pattern but move to `home_moments`; validate all targets | `components/landing/DayIntentBuilder.tsx:103-314` |
| Modify | CategoryGateway | Move below scenario/planning layers; expand/crosswalk labels per canonical taxonomy | `app/page.tsx:258-285`, `lib/navigation.ts:117-129` |
| Modify | AroundBali | Convert to `home_plan.areas`; remove Canggu privileged mechanics; likely reduce to 4–6 | `app/page.tsx:696-824`, `lib/districts.ts` |
| Add conditionally | Resident picks | Add only if explicit organic curation source can validate 4+ records | No current homepage resident-picks source found |
| Add | Homepage CTA analytics | Required for Wave 4 KPI plan | current gap in `lib/analytics.ts` taxonomy |
| Remove/Merge | Chaos/Mechanism/How/Comparison/Final CTA | Too much marketing explanation, duplicates WIRE-4.0 layers | `app/page.tsx:288-444`, `app/page.tsx:614-686`, `app/page.tsx:902-933` |
| Separate task | Footer B2B/money separation | Shared footer affects whole site; outside Wave 4 by default | `components/SiteFooter.tsx:240-334` |
| Fix before/with Wave 4 | Homepage JSON-LD duplicate/unsafe serialization | Duplicated Organization/WebSite and raw `JSON.stringify` in script | `app/layout.tsx`, `app/page.tsx:42-88` |

---

## 8. Сопоставление текущей страницы с WIRE-4.0

| WIRE-4.0 section | Current equivalent | Status | Gap |
|---|---|---|---|
| Global header | Landing-specific header + global header from layout | Partially confirmed | Current homepage mounts `LandingNav` inside page while layout also has `GlobalHeader`; visual behavior requires Gate A decision |
| `home_hero / two intents` | Hero + DayIntentBuilder + PrimaryEntrances | Partially confirmed | Current hero has directory CTA and Canggu-deep copy; intent split appears after hero, not as approved copy |
| `home_moments` | DayIntentBuilder quick starts + later Moments section | Partially confirmed | Duplicated scenario layers; current scenario labels differ; only 4 later moments; appears after categories and long sections |
| `home_plan` areas/plans | PrimaryEntrances `/plan`, AroundBali district grid, nav/guides | Partially confirmed | No compact combined planning block; current areas grid is 15 cards including beyond Bali; plans not selected as WIRE set |
| `home_picks` | None found | Unknown / blocker | No explicit resident picks homepage data source found; must not invent from catalogue |
| `home_categories` | CategoryGateway | Confirmed | Currently too high in hierarchy; only 4 primary + 2 secondary; labels not final WIRE set |
| `home_trust_save` | TrustCards + HumanMoment + footer saved links | Partially confirmed | Trust claims need proof; shortlist CTA not integrated as WIRE block |
| Footer unchanged by default | SiteFooter | Code-confirmed | Footer has prominent B2B/money card; default Wave 4 should not redesign, but issue should become separate task or explicit scope expansion |

---

## 9. Конфликты с Wave 3 и pending changes

Current branch includes Chope-only pending work relative to `origin/main`:

- `CHOPE_607_DB_AWARE_DEDUP_REPORT.md`
- `data/data-ops/chope-607/db-aware-dedup-input.json`
- `data/data-ops/chope-607/db-aware-dedup-output-public.json`
- `data/data-ops/chope-607/db-aware-dedup-readonly.sql`
- `data/data-ops/chope-607/production-public-venues-snapshot.json`
- `scripts/chope-607-classify-public-snapshot.mjs`
- `scripts/chope-607-db-aware-dedup.mjs`
- `scripts/wave3-product-boundary.test.mjs`

No homepage code files are changed in this branch versus `origin/main`. This reduces direct merge conflict risk for Wave 4, but Phase B should start from a clean branch after Chope branch disposition.

Wave 3 product code is present in current repo:

- Canggu Now component: `components/CangguNow.tsx`.
- Plan/nav route exists: `lib/navigation.ts:111-114`; `/plan` in build route table.
- T10 pages exist in build route table: `/bali-itinerary-3-days`, `/bali-itinerary-5-days`, `/canggu-without-a-scooter`.
- Chope tests extended in `scripts/wave3-product-boundary.test.mjs`.

Potential conflict: Wave 4 must not redesign `/canggu`, route engine, Chope pipeline or `/plan`; homepage can link to them only if Gate A validates the targets.

---

## 10. Blockers и минимальные вопросы владельцу

### Blockers

1. `GENSPARK_OTHERBALI_STRATEGIC_RESET_V1.2_FINAL_PATCH` source artifact is not in repo. The brief contains rules, but the original source file is missing.
2. Resident picks cannot be implemented safely until an explicit organic curation source is identified or Gate A removes the block.
3. Trust copy claims “people who live here”, “checked in person”, “reviewed/date-stamped” need operational evidence or narrower approved copy.
4. Lighthouse and axe baselines are missing because packages are absent and Phase A forbids installing dependencies.
5. Footer B2B/money separation affects shared footer and is outside default Wave 4 scope; Gate A must choose `Separate task` or `Expand scope`.
6. Homepage JSON-LD uses raw `JSON.stringify` and duplicates WebSite/Organization with layout. This is not only Wave 4 IA; it is SEO/security hygiene to handle in Phase B if scope approved.

### Owner questions for Gate A

1. Approve removing all Canggu-deep/global-centre copy from `/`, including hero, Around Bali, FAQ and footer-adjacent copy?
2. Should `home_picks` be removed from Wave 4 until an explicit curated venue source exists, or should Wave 4 include a small version-controlled list of stable venue IDs hydrated through the published catalogue?
3. Is footer B2B card in scope for Wave 4, or should it be a separate shared-footer task?
4. Which performance budget mode should Gate A use: `No-regression` now, or require installing/running Lighthouse in a separate approval before Phase B?
5. Should optional homepage search be omitted in Wave 4.1 until search reliability and no-PII analytics are audited?

---

## 11. Recommended Gate A artifacts

Artifacts created in `docs/wave4-homepage-evidence/`:

| artifact_id | Version | Path | SHA-256 | Status |
|---|---|---|---|---|
| WIRE | 4.1 | `docs/wave4-homepage-evidence/WIRE-4.1.md` | `a8d7868b4b964e4d3cb4cf56aef0038d1ab4cd25bb012f6bcee4a54f5eeaecae` | Candidate / not approved |
| COPY | 4.1 | `docs/wave4-homepage-evidence/COPY-4.1.md` | `513248ca2745d76e2ce0e7d3b6f7f93eb5a67dd1aa49c183078b03653cece713` | Candidate / not approved |
| DATA | 4.1 | `docs/wave4-homepage-evidence/DATA-4.1.md` | `727cf53bf797ad572ef45a9cff64b2d8cb1f5d30905e3f88f62e9c23fe57050d` | Candidate / not approved |
| ANALYTICS | 4.1 | `docs/wave4-homepage-evidence/ANALYTICS-4.1.md` | `c1935c2720a69fcba123bf6ea939f4e49da21dc60a40becdee93f412c4cfbd78` | Candidate / not approved |
| AC | 4.1 | `docs/wave4-homepage-evidence/AC-4.1.md` | `3ee2c6f61af404b8889dede4716dcf2fd4ec652b2be990d7dba424027877ee8e` | Candidate / not approved |
| Baseline | 2026-07-22 | `docs/wave4-homepage-evidence/homepage-baseline.json` | `c1f7c81b24d2588a8bacae691ef910cfa42ff845069c48e22c3b8a3bf86a08d4` | Evidence |

Recommended Gate A approval phrase, if accepted without edits:

> Approved for implementation: WIRE-4.1 a8d7868b4b964e4d3cb4cf56aef0038d1ab4cd25bb012f6bcee4a54f5eeaecae + COPY-4.1 513248ca2745d76e2ce0e7d3b6f7f93eb5a67dd1aa49c183078b03653cece713 + DATA-4.1 727cf53bf797ad572ef45a9cff64b2d8cb1f5d30905e3f88f62e9c23fe57050d + ANALYTICS-4.1 c1935c2720a69fcba123bf6ea939f4e49da21dc60a40becdee93f412c4cfbd78 + AC-4.1 3ee2c6f61af404b8889dede4716dcf2fd4ec652b2be990d7dba424027877ee8e.

---

## 12. Exact implementation plan by files — no implementation

No Phase B work is authorized yet. If Gate A approves WIRE/COPY/DATA/ANALYTICS/AC, implement in this order:

1. Create/adjust homepage config and validation.
   - Candidate files: `lib/homepage.ts` or `lib/homepage/config.ts`; tests under `lib/homepage.test.ts` or `scripts/wave4-homepage-boundary.test.mjs`.
   - Purpose: stable IDs, target validation, approved copy, required/optional cardinality, no duplicate target/job between moments/plans.

2. Refactor `app/page.tsx` into approved sections only.
   - Candidate files: `app/page.tsx`, possibly `components/home/HomeHero.tsx`, `components/home/HomeMoments.tsx`, `components/home/HomePlan.tsx`, `components/home/HomeCategories.tsx`, `components/home/HomeTrustSave.tsx`.
   - Remove/merge old long marketing sections only after approved.

3. Reuse existing canonical sources.
   - Categories: `lib/navigation.ts`.
   - Areas: `lib/districts.ts` + route existence checks.
   - Plans/scenarios: `lib/guides.ts`, `lib/scenarios.ts`, existing route data.
   - Resident picks: only if approved source is available; otherwise omit.

4. Add homepage analytics instrumentation.
   - Candidate files: `lib/analytics.ts`, a homepage client tracker component, tests for event payloads.
   - Must preserve consent gating and no PII.

5. SEO/JSON-LD cleanup for `/`.
   - Candidate files: `app/page.tsx`, maybe shared safe JSON-LD helper if already accepted from prior security tasks.
   - Ensure one Organization/WebSite graph strategy and no raw unsafe JSON-LD serialization.

6. QA/tests.
   - Add Wave 4 boundary tests for copy, target validation, no Canggu-centre copy, no B2B above fold, no Open now, no paid/sponsored signals.
   - Run: `npm run typecheck`, `npm run lint`, `npm run build`, targeted tests and existing suite as scope allows.
   - Browser QA at 320/375/768/1024/1440.
   - axe/Lighthouse only after dependency/tool approval or existing installed tool is available.

---

## 13. Commands and results

| Command | Result | Notes |
|---|---|---|
| `git status --short --branch` | branch shown; untracked `public/scenes/venues-story.mp4` | Pre-existing/untracked; not touched |
| `npm run test:wave1` | PASS 46/46 | Homepage Wave 1 tests pass |
| `npm run typecheck` | PASS | `tsc --noEmit` |
| `npm run lint` | PASS with 1 warning | Warning in `app/partner/venues/[venue]/[section]/PhotoReviewPanel.tsx`, not homepage |
| `npm run build` | PASS | Next 16.2.10; `/` dynamic route; 151 static pages generated |
| Production curl `/` browser + Googlebot | 200 / 200 | No bot-specific homepage block found |
| Production robots/sitemap curl | PASS | `/` allowed and sitemap includes homepage |
| Production-preview screenshots | PASS | 320/375/768/1024/1440, no console errors, no horizontal overflow |
| `npm ls lighthouse @axe-core/puppeteer axe-core --depth=0` | empty | Lighthouse/axe unavailable without install |

---

## 14. Stop condition

Per Wave 4 brief, this Phase A discovery stops here.

Do not implement Phase B until owner explicitly approves all five artifacts with hashes or requests edits to the candidate artifacts.
