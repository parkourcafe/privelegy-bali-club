# Acceptor brief — batch 01 (Uluwatu 25)

You are the independent check. Someone else proposed values for a venue's
record. You see only the claim, its source URL, a quote and a hash. You do
not see who collected it, what they thought, or what the card said before.
Your job is to try to **refute** each claim. When you cannot verify, the
answer is `hold` or `reject`, never `accept`.

Batch directory: `data/data-ops/verification/2026-09-28-batch-01-uluwatu/`

## Files

Read **only** `claims/<slug>/blinded.json`. Do not open `claims.json`,
`claims.validated.json`, `canaries.json`, `before.json`, `leads.json`,
`codex-proposals.json` or anything under `snapshots/`. Some claims in
`blinded.json` are deliberately wrong; you are expected to catch them.

## Procedure per claim

1. **Source rule.** Allowed: the venue's own official domain(s) listed in
   `officialDomains`; a parent-property official site that names the venue;
   a booking-provider page (SevenRooms, TableCheck, Chope, DishCult,
   OpenTable) only if the official site links to it — you must see that link
   yourself on an official page. Everything else → `reject`,
   `SOURCE_NOT_OFFICIAL` (TripAdvisor, Wanderlog, HappyCow, Google Maps,
   Instagram, blogs, other guides, otherbali.com).
2. **Re-fetch yourself.**
   `node tools/snapshot.mjs <slug> <source_url> --root snapshots-acceptor --force`
   prints the index line (with `sha256`) and the page text. If the fetch is
   blocked (401/403/429, TLS, timeout) → `hold`, `SOURCE_BLOCKED`,
   `refetch: "blocked"`. Do not use WebFetch. Do not open Google Maps.
3. **Quote check.** The `quote` must appear verbatim in the text you fetched
   (ignore whitespace, dash and quote-mark variants). Not present → `reject`,
   `QUOTE_NOT_FOUND`. Present but it does not support `proposed` (different
   day, different branch, different item, a price for something else) →
   `reject`, `VALUE_NOT_SUPPORTED_BY_QUOTE`.
4. **Branch check.** For a brand with several branches the page or the quote
   must name this branch (Uluwatu / Bingin / Pecatu / Ungasan / Suluban /
   Bukit). Otherwise → `reject`, `BRANCH_MISMATCH`.
5. **Bounds** (from `acceptance-rules.md`):
   - hours: per-day JSON covering all 7 days (closed = `[]`); a trailing am/pm
     applies to both ends; café opening before 05:00 or closing before 14:00,
     a 24 h window, or `14:00–23:59` are suspect → `hold`, `BOUND_FAIL`;
   - phone: `+62…`, the venue's own, not a group head office;
   - address: contains Jl./Jalan/Gang/Banjar and no working notes
     (verify/tbc/approx);
   - coordinates: only from the official site; inside −8.87…−8.74 /
     115.03…115.25 with ≥5 decimals;
   - price anchor: a number, a currency marker and the named item; a date.
6. **Removals** (`action: "remove"`, `claim_text` given): search the official
   pages you fetched for support of that sentence. Found support → `reject`
   the removal (`REMOVAL_SUPPORTED`, quote it). No support on official
   pages → `accept` the removal (`REMOVAL_UNSUPPORTED`). Experiential or
   editorial sentences (crowd, "arrive early", "not for a quiet dinner") are
   not facts a website proves → `hold`, `NOT_A_SOURCE_FACT`.
7. `keep` claims are not in your file; ignore any that slipped through.

## Output

`claims/<slug>/verdicts.json`:

```json
{ "slug": "...", "acceptedAt": "2026-09-28T…Z",
  "verdicts": [
    {"claim_id": "…", "verdict": "accept|reject|hold", "reason_code": "OK|QUOTE_NOT_FOUND|SOURCE_NOT_OFFICIAL|BRANCH_MISMATCH|VALUE_NOT_SUPPORTED_BY_QUOTE|BOUND_FAIL|SOURCE_BLOCKED|REMOVAL_SUPPORTED|REMOVAL_UNSUPPORTED|NOT_A_SOURCE_FACT",
     "refetch": "ok|blocked", "refetch_sha256": "…", "quote_found": true, "note": "one line"}
  ] }
```

Every claim in `blinded.json` gets exactly one verdict. Return per slug the
counts of accept/reject/hold as your structured output.
