# Other Bali T0 Indexability Diagnosis

- **Incident:** public venue-detail pages intermittently returned HTTP 500 and were therefore unavailable to users and crawlers on cold renders
- **Diagnosis date:** 2026-07-21 (Asia/Makassar, WITA)
- **Repository:** `parkourcafe/privelegy-bali-club`
- **Diagnosed production source:** `5d62fbdd94be63e01dac8dfdcab28b2b94133fc2`
**Scope:** `/places/[slug]` indexability only; no T1–T10 product changes

## 1. Executive verdict

The incident was not Googlebot cloaking, a global `robots.txt` block, a sitemap-count problem, or caused by the publication gate.

The directly observed failure was `DYNAMIC_SERVER_USAGE` during cold on-demand ISR/SSG renders of `/places/[slug]`. The failure began after the root layout became request-bound through `RootLayout → getLocale() → headers()` while the venue route still deferred every dynamic slug to its first request using `revalidate = 300` plus an empty `generateStaticParams()`.

The causal conclusion is intervention-backed:

1. the request-bound locale change entered production while the venue route remained SSG/ISR;
2. Vercel's grouped issue metric then reported 4,383 `DYNAMIC_SERVER_USAGE` events and 173 Vercel “users” across venue page/RSC/middleware paths; these are platform aggregates, not literal HTTP-request or human-user counts;
3. a separate fallback patch for secondary Supabase/cache reads left the route classified as SSG and did not stop the same cold-miss failures;
4. commit `5d62fbdd…` removed ISR/static-params behavior and set `dynamic = "force-dynamic"`;
5. Vercel’s route classification changed from `● /places/[slug]` to `ƒ /places/[slug]`;
6. after the recovery deployment became ready, no `/places/*` HTTP 500 or `DYNAMIC_SERVER_USAGE` event was found in the fixed audited window, while the tested current browser, generic-crawler, and Googlebot Smartphone responses are identical HTTP 200 documents.

The retained production logs omit a full unsanitized stack. Therefore, the exact statement “the thrown stack frame was the `headers()` call in RootLayout” is a **high-confidence causal inference**, not a directly preserved stack-frame fact. The rendering-mode conflict, error digest, change intervention, build-mode flip, and recovery are directly evidenced.

The narrowly scoped recovery was already merged and deployed before this audit began. No second speculative source fix is required.

A separate, directly reproduced gate mismatch was found during the count audit: the detail-route predicate currently marks 518 records `index, follow`, while the structurally filtered catalogue/sitemap contains 517. `/places/big-dragon-villas-ubud` is HTTP 200/indexable at the route but omitted from the sitemap because its database category is `villa`, which the list validator rejects. Its live title is also `Big Dragon Villas Ubud — undefined in Pejeng, near Ubud, Ubud · Other Bali`, and it was absent from the crawled internal-link graph. These are direct facts, not the historical 500 root cause. The decision to align the gates and preserve the full Ubud card inside T0 follows the stated acceptance criteria and Bali-wide product rule.

## 2. Evidence classification

| Label | Meaning in this report |
|---|---|
| **DIRECT FACT** | observed in Git source/diff, Vercel deployment/build/log data, production HTTP, or read-only SQL |
| **CAUSAL INFERENCE** | conclusion supported by timing, source interaction, failed alternative intervention, and successful isolated intervention, but without an unsanitized thrown stack |
| **UNVERIFIED** | requires unavailable authenticated/external evidence such as GSC Live URL Test |

## 3. Incident chronology

All UTC timestamps are also shown in WITA (UTC+8).

| Stage | Git/deployment evidence | Rendering/error evidence |
|---|---|---|
| Before request-bound locale | production `dpl_H6g1YuQZnsYVAMSiGexTLLqVQLfg`, SHA `4f35666b…`, created 2026-07-19 12:25:26 UTC / 20:25:26 WITA | `/places/[slug]` already used `revalidate=300` and empty `generateStaticParams()`, but root layout was not yet request-bound |
| Locale change merged | PR #161, base `4f35666b…`, head `625a1c89…`, merge `439680ed…`, merged 2026-07-20 02:48:31 UTC / 10:48:31 WITA | `app/layout.tsx` became async and called `getLocale()`; `lib/i18n/server.ts` called `await headers()`; venue render mode did not change |
| Failure introduced to production | `dpl_5Me9mK9PA5Rhtpkkq6w1McxYVqD3`, SHA `439680ed…`, ready 2026-07-20 02:49:52 UTC / 10:49:52 WITA | build classified `● /places/[slug]` as SSG; Vercel's grouped issue record contains 4,383 events / 173 platform-defined “users” across `/places/[slug]`, its RSC path, and middleware, first 2026-07-20 03:01:13 UTC and last 2026-07-21 04:49:25 UTC |
| Immutable old-artifact reproduction | PR #161 preview `dpl_AqgqrhEihc6oxLWiQokJkfL2143V`, SHA `625a1c89…` | authenticated-share GET of `/places/monkey-bar-bali` returned HTTP 500 to browser, generic crawler, and Googlebot Smartphone; all bodies had SHA-256 `45040313448863d66a773de9144363bf6a6f6fa8be4a80b642ee814faa59a974` |
| Secondary-read resilience deployed | PR #177, merge `b6ef16d5…`; production `dpl_3F47wKBLky5CgLCiK2UXaQmQPqUM`, ready 2026-07-21 04:19:29 UTC / 12:19:29 WITA | secondary reads gained fallbacks, but route stayed SSG; the bounded 500-row audit slice attributed 150 failures to this deployment, including cold MISS + `DYNAMIC_SERVER_USAGE` for `monkey-bar-bali` and `riviera-cafe-cemagi` |
| Actual rendering recovery merged | PR #174, commit/main SHA `5d62fbdd94be63e01dac8dfdcab28b2b94133fc2`, merged 2026-07-21 04:48:32 UTC / 12:48:32 WITA | `revalidate` and empty `generateStaticParams()` removed; `dynamic = "force-dynamic"` added |
| Recovery reached production | `dpl_3yTWNPQMzRJhhsqqkfvd6NLpaxdD`, ready 2026-07-21 04:49:46 UTC / 12:49:46 WITA | build classified `ƒ /places/[slug]` as Dynamic; the old deployment’s last recorded dynamic 500 occurred 21 seconds before the new deployment became ready |
| Recovered production window | current `www.otherbali.com` deployment on `5d62fbdd…` | a fixed replay query for 2026-07-21 04:49:46.000–07:55:29.765 UTC returned zero `/places/*` HTTP 500 and zero `DYNAMIC_SERVER_USAGE`; current sample pages return identical HTTP 200 HTML to all three user agents |

## 4. Source interaction that caused the failure

### 4.1 Failing rendering contract

At failing SHAs such as `2d40311…` and `b6ef16d…`, `app/places/[slug]/page.tsx` declared:

```ts
export const revalidate = 300;

export async function generateStaticParams() {
  return [];
}
```

The comment and Vercel build output show that hundreds of dynamic venue paths were deferred to an on-demand static/ISR render.

### 4.2 Request-bound root layout introduced later

PR #161 made `app/layout.tsx` call `await getLocale()`. `lib/i18n/server.ts` resolves locale through `await headers()`, using the request header stamped by `proxy.ts`.

This request-bound path is valid during request rendering. It is incompatible with an attempted static/on-demand prerender when Next.js cannot safely resolve request-only dynamic state in that render context.

### 4.3 Direct runtime failure

Vercel retained the runtime digest `DYNAMIC_SERVER_USAGE` for the failed venue paths. A bounded raw-log query for the pre-fix production interval hit the 500-record cap:

- at least 500 HTTP 500 log rows;
- 36 unique `/places/*` paths in the returned slice;
- every returned error had `DYNAMIC_SERVER_USAGE`;
- every returned failure was a cold cache `MISS`;
- the errors occurred across both the first failing deployment and the later fallback-only deployment.

The larger Vercel grouped error record reports 4,383 events and 173 platform-defined “users” between 2026-07-20 03:01:13 UTC and 2026-07-21 04:49:25 UTC. These grouped values are useful incident-volume indicators but are not literal request or unique-person counts; the reproducible raw lower bound is at least 500 HTTP 500 rows across 36 slugs.

### 4.4 Secondary-read intervention was insufficient

PR #177 guarded secondary menu/action/similar-venue reads and added an error boundary. That was sensible resilience work, but it did not change ISR/SSG mode. The deployment still logged the same `DYNAMIC_SERVER_USAGE` cold-miss 500s, and the new secondary-read failure markers were absent from searched logs.

This proves that the secondary-read patch was insufficient and does not support those reads as the dominant explanation for the incident. It does not prove that isolated secondary-read failures never occurred.

### 4.5 Narrow intervention and result

The recovery commit changed only the venue page’s rendering boundary for this issue:

```ts
export const dynamic = "force-dynamic";
```

It removed the empty `generateStaticParams()` and ISR export. The deployment environment, framework, region, and lambda class otherwise remained comparable. The build route changed from SSG to Dynamic. In the fixed replay window `2026-07-21T04:49:46.000Z` through `2026-07-21T07:55:29.765Z`, a Vercel log query with `limit=100`, executed at `2026-07-21T08:24:22.083Z`, returned zero `/places/*` HTTP 500 and zero `DYNAMIC_SERVER_USAGE` (result received at `08:24:28.516Z`).

**CAUSAL INFERENCE.** The request-bound locale read inside the on-demand ISR render is the causal combination. This wording deliberately does not claim that a retained stack literally named the `headers()` line.

## 5. Bot-behavior diagnosis

### 5.1 Old artifact

| User agent | `/places/monkey-bar-bali` on PR #161 artifact | Body result |
|---|---:|---|
| ordinary browser | 500 | identical failure body |
| generic crawler (`OtherBali-T0-Audit/1.0`) | 500 | identical failure body |
| Googlebot Smartphone | 500 | identical failure body |

### 5.2 Current production

A 12-URL stratified positive sample was fetched as an ordinary browser, a generic crawler, and Googlebot Smartphone. Every URL returned:

- direct HTTP 200;
- byte-for-byte identical raw server HTML across all three agents;
- a useful H1 and primary content in the initial HTML;
- one self-referencing canonical;
- `index, follow` and no conflicting `X-Robots-Tag`;
- sitemap inclusion.

Sample slugs:

1. `monkey-bar-bali`
2. `desa-wisata-penglipuran`
3. `amo-spa-canggu-canggu`
4. `atlas-beach-club`
5. `baked-pererenan`
6. `donna-ubud`
7. `pantai-lovina`
8. `nusa-dua-beach-grill`
9. `crumb-and-coaster-kuta`
10. `alchemy-uluwatu`
11. `koa-shala-sanur`
12. `kilo-kitchen-bali-seminyak`

The current `monkey-bar-bali` response is 40,510 bytes and has SHA-256 `b0bd154a4adc960565882fa137293509edfce51597f80e92bbb0e5fbe67303c0` for each agent in the retained check.

**DIRECT FACT, SAMPLE-BOUNDED.** No user-agent divergence was observed for the one retained old-artifact URL or the 12 current positive URLs. No bot-specific branch is required to explain those observed failures and recoveries; this is not a claim about every route or all historical requests.

### 5.3 Positive-sample stratification

The sample spans records created from 2026-07-06 through 2026-07-20, Canggu and non-Canggu districts, six venue categories, and multiple confirmed action combinations.

| Coverage dimension | Included examples |
|---|---|
| geography | Canggu, Pererenan, Ubud, Lovina, Nusa Dua, Kuta, Uluwatu, Sanur, Seminyak, Penglipuran |
| category | restaurant, cafe, spa, yoga, bar, attraction |
| record cohort | older and newer records across the 2026-07-06–2026-07-20 creation range |
| editorial state | 12 decision-ready positives; `adda-yoga` as factual-only negative control |
| confirmed action type | reserve + website (`donna-ubud`); website + WhatsApp (`alchemy-uluwatu`, `baked-pererenan`); reserve + website + WhatsApp (`atlas-beach-club`); WhatsApp (`kilo-kitchen-bali-seminyak`, `amo-spa-canggu-canggu`, `koa-shala-sanur`); Maps/official handoff on the remaining positives |

### 5.4 HTTP methodology and limitation

The current production sample used Node.js 22 `fetch()` with `redirect: "manual"`, `Accept: text/html,application/xhtml+xml`, and these exact agents:

- browser: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36`;
- generic crawler: `Mozilla/5.0 (compatible; AuditCrawler/1.0; +https://example.com/bot)`;
- Googlebot Smartphone: `Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)`.

The check recorded status/final URL, body length and SHA-256, `X-Robots-Tag`, title, H1, robots/googlebot meta, canonical, visible-text length, and internal hrefs. A substituted UA proves the absence of observed UA-based branching; it does not prove a real Google crawler IP or replace GSC Live URL Test.

## 6. Publication gate and negative control

The recovery did not make every published database row indexable.

`/places/adda-yoga` is an active/published database row that fails the current decision-ready editorial predicate. It was used as a negative control:

| User agent | Status | Robots | Sitemap | Body SHA-256 |
|---|---:|---|---|---|
| browser | 404 | noindex present | absent | `0342a163f08eef312c948c67e1f1cc8de6665cf385331408f2e805faa88d9d84` |
| generic crawler | 404 | noindex present | absent | same |
| Googlebot Smartphone | 404 | noindex present | absent | same |

This is expected behavior under `lib/publication.ts`, `lib/venue-validation.ts`, `lib/data.ts`, `app/places/[slug]/page.tsx`, and `app/sitemap.ts`. The editorial/publication gate was not weakened to increase indexable counts.

## 7. Exact venue counters

### 7.1 Environment and date

- environment: production Supabase project `bali-privilege` (`egkdapqwkfprtyqvvnso`);
- query mode: read-only SQL;
- database health/version observed: `ACTIVE_HEALTHY`, PostgreSQL 17;
- query date: 2026-07-21 WITA;
- limitation: point-in-time counts, not historical totals or Google index counts.

### 7.2 Base SQL

```sql
select
  count(*)::bigint as total_venue_records,
  count(*) filter (
    where status = 'active'
      and publication_status = 'published'
  )::bigint as published_venue_records,
  count(*) filter (
    where status = 'active'
      and publication_status = 'published'
      and nullif(btrim(why_its_here), '') is not null
      and nullif(btrim(best_for), '') is not null
  )::bigint as raw_decision_ready_records
from public.venues;
```

Result:

| Counter | Value |
|---|---:|
| `total_venue_records` | 800 |
| `published_venue_records` | 595 |
| `raw_decision_ready_records` | 519 |

### 7.3 Route-level and sitemap-level indexability counts

The repository currently applies two different gates:

- the detail route receives a single active/published row from `getVenueWithPerk()` and applies `lib/publication.ts` plus the Uluwatu registry state;
- catalogue/sitemap data passes through `keepRenderableVenues()` and `lib/venue-validation.ts` first, then the same publication predicate.

The route-equivalent count starts from the 519 editorial-ready rows and applies the current 33-entry Uluwatu registry (`32 published`, `1 review`). A read-only snapshot check confirmed that all 32 published registry slugs are active/published and have non-empty database `why_its_here`/`best_for`, so the simplified exclusion query below is equivalent for this dated snapshot:

```sql
select count(*)
from public.venues
where status = 'active'
  and publication_status = 'published'
  and nullif(btrim(why_its_here), '') is not null
  and nullif(btrim(best_for), '') is not null
  and slug <> 'ulu-artisan-ungasan';
```

Result: `route_metadata_index_follow_records` = **518**.

The sitemap-equivalent predicate additionally requires:

```sql
nullif(btrim(slug), '') is not null
and nullif(btrim(name), '') is not null
and nullif(btrim(district), '') is not null
and category in (
  'cafe', 'warung', 'restaurant', 'beach_club', 'spa', 'beauty',
  'fitness', 'yoga', 'bar', 'surf', 'hotel', 'resort',
  'attraction', 'activity'
)
```

Result: `sitemap_eligible_records` = **517**, matching the 517 unique `/places/*` URLs in production sitemap XML.

The counts are fully accounted for:

- 519 → 518: `ulu-artisan-ungasan` is explicitly `review` in the registry;
- 518 → 517: `big-dragon-villas-ubud` uses category `villa`, outside the current `VenueCategory`/structural validator.

For the three counters required by T0, this report defines `indexable_venue_records` as the acceptance-complete intersection of route `index,follow`, structural renderability, and sitemap inclusion. On the pre-fix production snapshot:

| Required counter | Value |
|---|---:|
| `total_venue_records` | 800 |
| `published_venue_records` | 595 |
| `indexable_venue_records` | 517 |

Live verification of `/places/big-dragon-villas-ubud` returned HTTP 200, a self canonical, `index, follow`, and an H1, while the URL was absent from the sitemap. Keeping `route_metadata_index_follow_records = 518` visible above documents the inconsistency rather than silently redefining it.

## 8. Robots, canonical, sitemap, and rendering diagnosis

| Check | Result on 2026-07-21 | Evidence class |
|---|---|---|
| `robots.txt` | HTTP 200; `/places` not disallowed | DIRECT FACT |
| sitemap | HTTP 200; 667 unique `<loc>` values; 517 unique venue-detail URLs | DIRECT FACT |
| sitemap hygiene | no duplicate `<loc>`, query URL, non-HTTPS URL, apex-host URL, or trailing-slash venue URL found | DIRECT FACT |
| canonical host | HTTP→HTTPS 308; apex→`www` 308; trailing slash→clean path 308 | DIRECT FACT |
| query variant | remains HTTP 200 but canonical points to clean self path | DIRECT FACT |
| server rendering | useful H1/main content exists in raw response, without client execution | DIRECT FACT |
| crawler parity | raw bodies match across browser/generic/Googlebot in the stratified sample | DIRECT FACT, SAMPLE-BOUNDED |
| accidental auth | no auth redirect/challenge on current sampled public venue routes | DIRECT FACT |
| publication control | held negative control remains 404/noindex and outside sitemap | DIRECT FACT |

Sitemap freshness note: 230 of 517 venue URLs have `<lastmod>` and 287 omit it. Omission is valid XML/sitemap behavior, but it gives search engines less explicit freshness information. It is not the cause of the HTTP 500 incident.

Canonical scope note: the audit proved clean sitemap URLs, expected host/path redirects, and self-canonicals for the tested samples. It did not perform an exhaustive sitewide canonical-collision scan.

## 9. Internal linking

### 9.1 Positive-sample discoverability

All 12 positive samples were found in the raw server HTML of at least one non-venue sitemap URL. The crawl fetched all 150 sitemap URLs outside `/places/*` and extracted `/places/...` hrefs; venue-to-venue sources were not included, so this is a lower-bound source list.

| Sample | Confirmed internal source(s) |
|---|---|
| `monkey-bar-bali` | `/places` |
| `desa-wisata-penglipuran` | `/places` |
| `amo-spa-canggu-canggu` | `/best-spas-in-bali`, `/canggu`, `/canggu/best-spas`, `/places` |
| `atlas-beach-club` | `/canggu`, `/canggu/best-restaurants`, `/canggu/beach-clubs-sunset`, `/where-to-watch-sunset-in-bali`, `/places`, `/best-restaurants-in-bali`, `/my-day`, and three collections |
| `baked-pererenan` | `/canggu`, `/canggu/best-restaurants`, `/canggu/best-brunch`, `/places`, `/canggu/work-friendly-cafes`, `/best-restaurants-in-bali`, and two collections |
| `donna-ubud` | `/best-restaurants-in-bali`, `/ubud/best-restaurants`, and three collections |
| `pantai-lovina` | `/places` |
| `nusa-dua-beach-grill` | `/best-restaurants-in-bali`, `/nusa-dua/best-restaurants`, and four collections |
| `crumb-and-coaster-kuta` | `/bali/kuta-legian` |
| `alchemy-uluwatu` | `/best-cafes-in-bali`, `/uluwatu`, `/uluwatu/best-brunch`, `/places`, `/my-day`, and two collections |
| `koa-shala-sanur` | `/sanur/spas-wellness`, `/collections/cheap-and-brilliant` |
| `kilo-kitchen-bali-seminyak` | `/best-restaurants-in-bali`, `/seminyak/best-restaurants`, and three collections |

### 9.2 Confirmed hygiene issue outside the root cause

`/places/big-dragon-villas-ubud` was not present in the raw HTML of `/places` and was not found in the 150 crawled non-venue sitemap pages. This establishes no internal source in that crawl; because venue-to-venue pages were outside the crawl, “sitewide orphan” remains unproven. Combined with its sitemap omission, this is the directly observed discoverability gap addressed by the T0 consistency fix.

The audit found 12 internal links on `/bali/kuta-legian` that currently resolve to 404/noindex and are absent from the sitemap:

`drifter-kayu-aya`, `anika-gym`, `arjuna-futsal`, `celebrity-fitness`, `crossfit-seminyak`, `d-gol-futsal`, `dojo-aora`, `hammerhead-fitness`, `kros-tennis-bali`, `motion-skatepark`, `rai-fitness-sunset-bali`, and `pole-studio-bali`.

This is a confirmed T7 content/link-hygiene issue. It is not evidence for the T0 rendering failure and is deliberately not repaired in the T0 change set.

## 10. Fix status

| Requirement | Status | Evidence |
|---|---|---|
| diagnose before additional product work | met | Git/Vercel/source/HTTP causal record above |
| fix only the proven cause | met before audit branch | `app/places/[slug]/page.tsx` on `5d62fbdd…` |
| retain working behavior | met in current HTTP sample | 200 server HTML, actions/content present, no bot divergence |
| do not weaken publication gate | met | `adda-yoga` negative control remains 404/noindex/outside sitemap |
| add regression tests | pending in this branch | next T0 action |
| GSC Live URL Test | **UNVERIFIED** | requires authenticated Google Search Console access |

## 11. Immutable deployment limitation

Direct old/new production deployment hostnames first return Vercel SSO 302 with `x-robots-tag: noindex`. Authenticated shared access then encounters the application’s canonical-host redirect to current `www.otherbali.com`. Therefore old production artifacts cannot be compared directly by their immutable production hostname without changing platform/Host routing.

The PR #161 immutable preview is the valid old-artifact reproduction. Vercel production logs and build metadata independently establish the production failure and SSG classification.

## 12. Diagnosis conclusion

**Root cause:** on-demand ISR/SSG for `/places/[slug]` conflicted with request-bound locale resolution added at the root layout, causing cold renders to terminate with `DYNAMIC_SERVER_USAGE` and HTTP 500.

**Recovery:** render venue details per request with `dynamic = "force-dynamic"`, retaining cached data reads rather than statically rendering the request-bound page shell.

**Current state:** production venue-detail HTTP/indexability mechanics are recovered for the tested decision-ready cohort; the publication gate remains intact. T0 is not formally closed until regression coverage, the final verification report, and required build/test checks are complete. Google index appearance is monitoring, not a code acceptance criterion; GSC Live URL Test remains an explicitly external check.
