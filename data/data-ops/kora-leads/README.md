# KORA leads — staged venue candidates

Source: `koraleadtracker.csv` (KORA food-hall recruitment tracker — prospective tenants
for the 12-corner food hall on Jl. Monkey Forest, Ubud, opening December 2026).

## What this is

`verified-new-venues.json` stages a **filtered** slice of the tracker as
**draft venue candidates** for the Other Bali catalogue. It is **not** published
content and is intentionally kept **outside** `data/data-ops/batches/` so the batch
compiler does not ingest it until a human promotes it.

## Selection rule (why only 7 of 64 leads)

A lead was staged here only if it is **all three** of:

1. **Not already in the catalogue** — deduped against every venue slug/name in
   `supabase/migrations/*.sql` and `data/data-ops/coverage/canonical-venue-registry.json`.
   (Brand-siblings already present were excluded: e.g. NÜDE Berawa, Soul on the Beach,
   Naughty Nuri's Warung Seminyak, Warung Nasi Ayam Bu Oki.)
2. **Located in Bali** — the 14 Jakarta/Singapore/International brands were excluded;
   they have no Bali venue a traveller can visit, so listing them would mean inventing a
   location (AGENTS.md guardrail 10).
3. **`verification_status = verified`** in the tracker — `partially-verified`,
   `unverified` and the `reject` lead (Kelly's Warung, demolished) were excluded.

Result: **7 candidates** — tukies-coconut-shop, sushimi-bali, bossman-burgers,
nalu-bowls, kilig-bali, bebek-bengil, sayuri-healing-food.

## Guardrails honoured

- **No PII** — decision-maker names, WhatsApp numbers, emails and name-bearing deep-link
  URLs from the tracker are omitted (guardrails 12, 14).
- **No invented content** — only public facts (name, cuisine, current district, official
  website/Instagram, source URLs). `verifiedAt` is `null`; `forbiddenToPublish` is `true`.
- **Tracker "verified" ≠ Other Bali published-verified.** `verificationStatus` is
  `needs_verification`; the tracker's own status is preserved separately as
  `leadVerificationStatus`.

## Promotion path (to make a candidate a live venue)

1. Verify the venue's official **address** and **Google Maps URL** from an official source.
2. Confirm the final **category** (`proposedCategory` is a best-guess) and canonical branch.
3. Move it into a standard `data/data-ops/batches/<batch>/` package (evidence +
   source-manifest), add its slug to `coverage-ledger.json`, `canonical-venue-registry.json`
   and `resumable-queue.json` (the compiler asserts these sets match), then run
   `npm run` compile/import.
4. Photos remain hidden until a logged owner consent record exists (content publication rule).
