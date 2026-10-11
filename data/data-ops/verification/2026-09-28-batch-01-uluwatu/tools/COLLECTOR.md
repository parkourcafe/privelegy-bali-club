# Collector brief — batch 01 (Uluwatu 25)

You verify what the live Other Bali card says about a venue against the venue's
own official sources, today. You do not write new copy. You do not decide what
gets published: a blind acceptor and the founder do. Your output is a claims
file per venue; every claim you mark `ready` must be reproducible from a stored
snapshot by someone who never talks to you.

Batch directory (all paths below are relative to it):
`data/data-ops/verification/2026-09-28-batch-01-uluwatu/`

## Inputs you may use

- `before.json` → `venues[]` entry for your slug: the live card (`live`) and
  the code registry entry from `lib/uluwatu/venues.ts` (`registry`). `live` is
  what a reader sees today; `registry` is what a code change would edit.
- `leads.json[slug]` → URLs only. They come from earlier evidence packs whose
  values are **not** evidence (no raw captures, self-contradicting). Use them
  to find pages; never copy a value from them.
- `snapshots/<slug>/index.jsonl` + the `.txt`/`.html`/`.pdf` files: pages
  already fetched today. Read the `.txt`. To fetch another page (an official
  `/contact`, `/menu`, `/faq` page, a menu PDF linked from the official site):
  `node tools/snapshot.mjs <slug> <url>` — it prints the index line and the
  text. **Do not use WebFetch** (no bytes, no hash, no verifiable quote).
  For a PDF or image you may also `Read` the stored file to transcribe it.
- `AGENTS.md` guardrails apply: no Google Maps scraping, no ratings, no
  reviews, no aggregator facts, unknown stays null.

## Sources that count

1. The venue's own website (any page on its official domain(s)).
2. A first-party menu PDF/image linked from that site.
3. A booking provider page (SevenRooms, TableCheck, Chope, DishCult…) **only**
   if the official site links to it — record that link as `booking_link_quote`.
4. A parent property's official site for a venue inside a hotel/villa
   (e.g. uluwatusurfvillas.com for Mana; alilahotels.com / hyatt.com for The
   Warung at Alila) — the page must name the venue.

Never: Instagram (unreachable here and not a stable source), Google Maps,
TripAdvisor, Wanderlog, HappyCow, Horego, link-trees, blogs, other guides,
otherbali.com itself, the earlier evidence packs.

If the only source is Instagram or a blocked site (403/TLS), the venue's
factual claims are `status: "unclear"` with `note: "source_unreachable_env"` or
`"instagram_only"`. Do not guess.

## Step 1 — identity gate

Before any field: is the venue operating under this name at this branch?
Write `identity: {operating, current_name, branch_ok, evidence}` where
`evidence` is a quote + source_url. Known traps: Masonry Uluwatu presents as
"M. MASON" on some pages; Artisan has several branches (artisan-uluwatu vs
ulu-artisan-ungasan); oneeighty publishes two phone numbers; Suka and BGS are
multi-branch brands — a quote must name the Uluwatu/Bingin/Ungasan branch or
the URL must be branch-specific (`multi_branch: true`, `branch_evidence`).
If identity fails or is unknown, still produce claims, but mark identity
accordingly — reconcile will HOLD everything.

## Step 2 — one claim per field (fixed list)

Target `CODE` = registry fields in `lib/uluwatu/venues.ts`; target `DB` =
`venues` columns that feed the page's JSON-LD; `BOTH` for URLs.

| field | target | what to check |
|---|---|---|
| name | CODE | matches official naming |
| verdict, whyHere, whatToExpect, practicalNote, reservations | CODE | **one claim per factual sentence** — `field: "copy:whyHere#2"` etc. (see step 3) |
| bestFor, notFor | CODE | class `O`: is it fit context only (no quality warning, no review-derived praise)? action `keep`, or `remove`/`replace` if it breaks guardrail #9 or #2 |
| whatToOrder | CODE | items exist on the official menu today; `;`-separated lowercase |
| priceBand | CODE | `$` ≤~50K, `$$` ~50–150K, `$$$` >150K mains, from the official menu; include `price_anchor` evidence (named item + price + date) |
| address | CODE | official contact page; needs a street marker (Jl./Jalan/Gang/Banjar) |
| hours | CODE (text) and `opening_hours_json` DB | per-day JSON `{"Monday":["8.00am-10.00pm"],…,"Sunday":[]}`; "until late" stays as text and the structured close is omitted; a closing at/after midnight is stored as 23.59pm |
| officialUrl, instagramUrl, bookingUrl, menuUrl | BOTH | live URL returns 200 today and is the venue's own / official-linked; a 404 or dead provider page is `action: "remove"` or `"replace"` |
| phone | DB | official site only, `+62…` |
| full_address | DB | as `address` |
| coordinates | DB | only if the official site itself publishes lat/lng (embedded map link with `@lat,lng` or `q=lat,lng`); otherwise `not_found`. Never from Google Maps |
| category | DB | restaurant / cafe / bar / beach_club — matches how the venue describes itself |
| lastVerifiedAt | CODE | `action: "keep"` — reconcile decides the date |

`action`: `add` (live empty, source has it) · `replace` (live differs from source)
· `remove` (live claims something the official source contradicts or cannot
support) · `keep` (live matches source, quote it) · `unknown` (no official
source; `status: not_found`).

## Step 3 — sentence claims for visible copy

Split `verdict`, `whyHere`, `whatToExpect`, `practicalNote`, `reservations`
into sentences. For each sentence one claim with `class`:

- `F` — checkable at the source (hours, "DJs on Wednesday and Sunday",
  "adults only", "pool", "reservation via SevenRooms", location).
- `E` — experiential (crowd, parking, "arrive 60–90 minutes before sunset").
  `action: "keep"`, `status: "unclear"`, note `needs_visit_attestation`.
- `O` — fit/editorial judgement ("not for a quiet dinner"). `action: "keep"`
  unless it is a quality warning or review-derived.
- `Q` — quality/review-derived language ("landmark", "iconic", "well-regarded",
  "best in Bali"). `action: "remove"` candidate; `claim_text` = the sentence.

F-claims: `action: "keep"` with a supporting quote, `"replace"` with the
corrected value and quote, or `"remove"` when the official source contradicts
it or no official page supports a checkable fact.

## Claim record

```json
{
  "claim_id": "<slug>-07",
  "field": "hours",
  "target": "DB",
  "class": "F",
  "action": "add",
  "live_value": null,
  "proposed": {"Monday": ["8.00am-10.00pm"], "...": []},
  "source_url": "https://www.singlefinbali.com/",
  "source_date": "2026-09-28",
  "quote": "Wednesday\n8 AM – 2 AM",
  "snapshot_sha256": "<sha256 from snapshots/<slug>/index.jsonl>",
  "evidence_kind": "html",
  "multi_branch": false,
  "branch_evidence": null,
  "booking_link_quote": null,
  "status": "ready",
  "note": null
}
```

`quote` is verbatim from the stored `.txt` (≤300 chars; newlines allowed).
`source_date` is the page's own date if it prints one (menu "valid from",
"updated"), else today. `snapshot_sha256` is the `sha256` of the stored file.

## Step 4 — validate before you finish

```
node tools/validate-claims.mjs claims/<slug>/claims.json
```

Fix quotes that are not verbatim; downgrade to `unclear`/`not_found` what you
cannot support. Leave `claims/<slug>/claims.validated.json` in place. A claim
that still fails is fine to leave as `unclear` with the reason in `note` —
never satisfy the validator by inventing.

## Output

`claims/<slug>/claims.json`:

```json
{ "slug": "...", "category": "bar", "officialDomains": ["singlefinbali.com"],
  "identity": {"operating": true, "current_name": "Single Fin", "branch_ok": true, "evidence": {"quote": "...", "source_url": "..."}},
  "claims": [ ... ] }
```

Return (as your final structured output) per slug: counts by action and
status, identity result, and blockers.
