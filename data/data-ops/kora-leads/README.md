# KORA leads — staged venue candidates

Source: `koraprospectsFULL.csv` (KORA food-hall recruitment prospects — potential tenants
for the 12-corner food hall on Jl. Monkey Forest, Ubud, opening December 2026).

## What this is

`new-bali-venue-candidates.json` stages a **filtered** slice of the prospects list as
**draft venue candidates** for the Other Bali catalogue. It is **not** published content
and is kept **outside** `data/data-ops/batches/` so the batch compiler does not ingest it
until a human promotes each candidate.

## Selection rule

Every one of the 64 prospects was classified. A lead is staged here only if it is **both**:

1. **Not already in the catalogue** — deduped against every venue name/slug in
   `supabase/migrations/*.sql` and `data/data-ops/coverage/canonical-venue-registry.json`
   (brand-siblings already present were excluded, e.g. NÜDE Berawa, Soul on the Beach,
   Naughty Nuri's Warung Seminyak, Massimo, Luigi's Hot Pizza, Ling-Ling's Bali).
2. **Located in a Bali district** — the tracker's `Area` is a real Bali district.

Result: **26 candidates**. Verification level varies and is preserved per venue in
`leadVerificationStatus`; all are staged as `needs_verification`.

### What was excluded (and why)

| Group | Count | Reason |
|---|---|---|
| Already in the catalogue | 23 | Deduped — already a venue (see list above + Gelato Secrets, BAKED, KYND, Suka, Seniman, Bali Buda, Alchemy, Sisterfields, Sangsaka, Avocado Factory, Zest, Crate, Warung Varuna, Genius, Warung Mak Beng, Shady Shack, Bu Oki). |
| Jakarta/Singapore chains, uncertain Bali outlet | ~8 | Tuku, Sate Khas Senayan, Bakso Boedjangan, Gildak, Dailybox, Bittersweet, Fore, Hangry — real chains, but their Bali presence is a mall/Kuta/Renon outlet (or unconfirmed). A specific outlet + district must be chosen before staging; **not** staged automatically. |
| No Bali presence | 6 | Encik Tan, En Yeoh's, Haus!, Mangkokku, Padang Merdeka, Mata Karanjang — no visitable Bali venue; staging one would mean inventing a location (guardrail 10). |
| Rejected / do-not-contact | 1 | Kelly's Warung — venue demolished July 2025. |

## Guardrails honoured

- **No PII** — contact-person names, WhatsApp/phone numbers, emails and name-bearing
  deep-link URLs are omitted or redacted; the internal per-lead verification log was **not**
  imported. Public business names (e.g. "Vincent Nigita", "HOME by Chef Wayan") are kept as
  brand identity, not contact PII (guardrails 12, 14).
- **No invented content** — only public facts (name, cuisine, current district/locations,
  official website/Instagram, source URLs). `verifiedAt` is `null`; `forbiddenToPublish`
  is `true`. Public reads require `status=active AND publication_status=published`, so these
  can never surface publicly.
- **Tracker "verified" ≠ Other Bali published-verified.** `verificationStatus` is
  `needs_verification`; the tracker's own status is preserved as `leadVerificationStatus`.

## Promotion path (to make a candidate a live venue)

1. Verify the venue's official **address** and **Google Maps URL** from an official source.
2. Set the final **category** (`proposedCategory` is a best-guess) and, where
   `districtNeedsConfirmation` is `true`, the specific **district**.
3. Move it into a standard `data/data-ops/batches/<batch>/` package, add its slug to
   `coverage-ledger.json`, `canonical-venue-registry.json` and `resumable-queue.json`
   (the compiler asserts these sets match), then run the compile/import.
4. Photos stay hidden until a logged owner consent record exists (content publication rule).
