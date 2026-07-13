# Data Ops compiler and staging import handoff

Status: **ready for operator review only; not ready for import apply or publication**.

This handoff covers the deterministic compiler, the quarantined review package,
and the guarded disposable-staging importer. It does not authorize a staging or
production write. No database or network mutation was performed while producing
or testing this package.

## Denominator gate

- Package venues: **207**.
- Coverage-ledger venues: **207**.
- Canonical-registry venues: **207**.
- Both repository denominator metrics: **207**.
- Live-database candidate: **208** with status
  `needs_live_sql_confirmation`.
- Unresolved live-only candidate: `kynd-community`.
- Research-complete venues: **152**; proved blockers: **55**.

The four repository counts agree, but the live candidate is neither equal nor
confirmed. The compiler therefore derives all of these values as `false`:

- `liveCandidateStatusConfirmed`
- `liveCandidateMatchesRepository`
- `denominatorReconciled`
- `readyForImportDryRun`
- `readyForStagingApply`
- `readyForPublish`

These are computed gates, not operator-editable attestations. `--apply` fails
before loading a database client while the denominator remains unresolved.

## Deterministic compilation result

Raw-input digest:
`dbe5ea0b22de50c266e6b0213f8faf0d1c92258c586e1af800021cd0b4ee97bf`

Canonical compiled-package digest:
`682f63f1981383f39a6d98e78694af04295da96fd9becbcd327e2bb1d09e51a2`

| Measure | Raw input | Review package |
|---|---:|---:|
| Source records | 358 | 287 candidate-eligible; 71 quarantined |
| Explicit freshness quarantines | — | 14 sources |
| Menu records | 148 | 126 menu candidates |
| Menu sections | — | 143 |
| Menu items | 819 | 761 |
| Preserved display-price strings | — | 696 |
| Text-only prices | — | 242 |
| Whole-rupiah IDR prices | — | 454 |
| Action records | 391 | 248 capabilities + 49 Maps review candidates |
| Venues with any candidate | 207 researched | 146 |
| Non-null `verifiedAt` | 0 | 0 |

The package contains **423** top-level candidates and **424** provenance input
references. Every reference links to a present, candidate-eligible canonical
source record. Candidate input references and rejection input references are
disjoint. All source, rejection, candidate, section, and item IDs are globally
unique; all initial candidates use `version=1`.

Six research-complete venues have no remaining candidate after fail-closed
source quarantine:

- `arwana`
- `izakaya-by-oku`
- `manarai-beach-house`
- `masonry-restaurant`
- `massimo-italian-restaurant`
- `onion-collective`

## Source eligibility and freshness quarantine

Candidate sources must have an explicit `usable`, `partial`, or
`usable_with_caveat` outcome and pass URL, label, capture-time, and Data Ops
verification checks. Blocked, unavailable, rejected, identity-changed,
not-parsed, stale, or recheck-required outcomes are not candidate evidence.

The compiler also quarantines explicit freshness signals such as
`stale_recheck_required`, `stale-dated`, `freshness recheck required`, and a
documented stale/current mismatch that blocks import. In particular, the old
SENSORIUM menu PDF is no longer emitted as a menu candidate; its source and
rejection records retain the exact reason for operator follow-up. A current
independently eligible source may still support a separate action candidate.

There are **115** rejected raw records: 21 menus and 94 actions. Reasons overlap:

| Reason | Count |
|---|---:|
| Candidate belongs to a blocked venue | 54 |
| Source outcome is not candidate-eligible | 45 |
| Explicit stale/recheck quarantine | 12 |
| Unsupported provider | 42 |
| Empty menu placeholder | 11 |
| Provider URL host not approved | 9 |
| HTTP action URL | 3 |
| Ambiguous order semantics | 2 |
| Conflicting actions for one canonical key | 2 |
| Provider/action mismatch | 1 |
| Official target/source host-family mismatch | 1 |

The row-level queue is in `data/data-ops/compiled/rejections.json`.

## Provenance and validation invariants

- Compilation reads exactly **53** raw Data Ops and coverage JSON files.
- Every candidate has stable IDs and non-empty, duplicate-free `packageIds`,
  `inputIds`, `sourceIds`, and `originalSourceIds` provenance arrays.
- Every canonical source link exists, belongs to the same venue/package, is
  candidate-eligible, and matches the candidate evidence fields.
- No emitted provenance input reference also appears in rejections.
- Candidate IDs and database natural keys are unique.
- Initial import validation accepts only `version=1`.
- `verifiedAt` remains null for all Data Ops candidates.
- Publish validation rejects verification before capture, verification at or
  after expiry, and verification in the future.
- Maps stay outside `venue_action_capabilities` and remain review candidates for
  `venues.gmaps_url`.
- Exact `sourceDisplayPrice` text remains `priceText`; IDR remains whole rupiah
  with no cent scaling.

## Generated artifacts

- `data/data-ops/compiled/candidates.json` — canonical combined package.
- `data/data-ops/compiled/menus.json` — menu-validator input.
- `data/data-ops/compiled/capabilities.json` — capability-validator input.
- `data/data-ops/compiled/venue-maps.json` — `venues.gmaps_url` review queue.
- `data/data-ops/compiled/sources.json` — canonical source and quarantine ledger.
- `data/data-ops/compiled/rejections.json` — row-level rejection queue.
- `data/data-ops/compiled/coverage-report.json` — counts, integrity, denominator,
  and release gates.

Regenerate and check:

```sh
node scripts/compile-data-ops.mjs
node scripts/compile-data-ops.mjs --check
```

The local repository path contains a literal backslash, which Node ESM cannot
execute from on macOS. Local verification therefore uses a path-safe temporary
mirror. Normal CI/worktree paths do not require that workaround.

## Review validators

The non-writing validators accept the quarantined candidate set structurally:

```sh
node scripts/validate-menus.mjs data/data-ops/compiled/menus.json
node scripts/validate-capabilities.mjs data/data-ops/compiled/capabilities.json
node scripts/import-data-ops.mjs
```

Current results:

- menus: **126/126 valid**;
- capabilities: **248/248 valid**;
- Maps evidence: **49/49 valid inside the import-plan check**, but never written
  as capabilities;
- review-only plan: 126 menus, 143 sections, 761 items, 248 capabilities, 49
  Maps candidates, 146 venues;
- release readiness: `readyForImportDryRun=false` and
  `readyForStagingApply=false` because the denominator is unresolved.

Publish mode remains fail-closed: 0/126 menus and 0/248 capabilities are
publishable while `verifiedAt=null`.

## Apply trust chain and disposable staging restriction

On `--apply`, the importer does not trust the candidate JSON or its stored
digest. Before any database library is loaded, it:

1. rereads the canonical 53 raw files;
2. recompiles the package in memory;
3. recomputes the canonical package digest;
4. requires the selected candidate file to be byte-for-byte identical to that
   rebuilt package;
5. requires the derived denominator and staging-apply gates to be true;
6. then checks the explicit staging, digest, and production-separation
   environment guards.

Even after those gates become true, this release may run only against a new,
disposable staging target whose `menus`, `menu_sections`, `menu_items`, and
`venue_action_capabilities` tables are completely empty. Existing rows — even
unverified drafts or unrelated natural keys — block apply. All candidate venue
slugs must already exist and `menu_items.price_text` must be present.

The importer uses inserts, not upserts. It writes no editorial columns and never
writes Maps candidates. Required operator acknowledgements include:

- `OTHER_BALI_STAGING_DISPOSABLE_EMPTY_TARGET=YES`
- `OTHER_BALI_STAGING_RECREATE_ON_FAILURE=YES`

The importer is intentionally non-atomic. If any write fails after insertion
starts, do not retry against that target. Destroy and recreate the disposable
staging target, reapply its schema/venue seed, and rerun preflight from zero.

## Verification evidence

- Focused tests: **25/25 passed**.
- Compiler `--check`: passed against all generated artifacts.
- Digest tampering and byte changes: blocked.
- Duplicate IDs, missing provenance, invalid source links, and rejected-input
  overlap: blocked by negative tests.
- Non-v1 candidates and future/illogical verification timestamps: blocked.
- Non-empty staging and direct apply with the current denominator: blocked
  before writes.
- Importer review dry-run: passed; no database client, network request, or write.

## Next owner actions

1. Resolve `kynd-community` with the documented live SQL snapshot and update the
   canonical raw denominator files. Do not hand-edit compiled gates.
2. Re-research the 71 quarantined sources, prioritizing the 14 explicit
   freshness cases, SENSORIUM, and the six complete venues now without any
   candidate.
3. Recompile and require the derived denominator/apply gates to become true.
4. Create a new disposable staging target with the required migration and all
   candidate venue rows, then run the non-writing review plan again.
5. If apply is later authorized, use the one-shot empty-target procedure; after
   any partial failure, recreate staging rather than retrying.
6. Let the named operator verify candidates in the admin workflow. Only that
   workflow may set `verifiedAt` or move records toward publication.
