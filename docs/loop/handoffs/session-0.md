# Session 0 — AI Data Ops Handoff

Status: in progress

## Discovery

Completed at `2026-07-13T15:07:27Z` on branch `loop/00-data-ops`, starting from
`10a82aa0aff8dc894d642d36acb14a4c9ed69175`; the working tree was clean.

- Read `AGENTS.md`, `Other_Bali_Master_Architecture.md`,
  `PARALLEL_LOOP_EXECUTION_PLAN.md`, `docs/DATA_OPS_TRACK.md`, the frozen
  `lib/contracts/menu-action.ts` contract and its fixtures, plus the existing
  Canggu catalogue, editorial pass, launch audit, and venue-collection guidance.
- The old `lib/seed.ts` Canggu list is explicitly placeholder content and is not
  suitable for Wave 1 selection. The canonical candidate evidence is the real
  catalogue slugs in migrations `0021`, `0022`, and the correction in `0023`,
  cross-checked against `docs/canggu-editorial-pass.md`.
- Wave 1 prioritises 15 existing food venues with first-party website candidates
  and likely menu coverage: `mason`, `samesa-canggu`, `luigis-hot-pizza`,
  `the-shady-shack`, `milk-and-madu-berawa`, `ji-restaurant-bali`, `luma`,
  `santanera`, `revolver-canggu`, `ulekan-berawa`,
  `hippie-fish-pererenan-beach`, `baked-pererenan`, `rize-cafe`,
  `sensorium-bali`, and `shelter-restaurant`.
- All records will remain draft/review-only with `verifiedAt: null`. Website
  availability does not grant media rights; any candidate media would remain
  `publicationAllowed: false` (none is required for this wave).
- Contract-fit decision: retain the frozen menu/action shapes and add only a
  Data Ops wrapper for displayed venue name, provenance references, collection
  notes, and review state. Any fact the contract cannot safely express will be
  documented rather than forced into a shared-contract change.
- The optional local deep-research runner could not start because
  `OPENAI_API_KEY` is absent. This did not modify project files and is not a
  blocker; official sources are being checked directly.

## Progress

Wave 1 official-source collection is running; no venue is marked human-verified
or publishable.

- Canonical coverage baseline: `207` reproducible repo-canonical active F&B
  rows. Production-oriented expectations (`208` active F&B, `250` active all,
  approximately `174` publication-ready F&B) remain drift checks pending a
  live SQL snapshot. `kynd-community` is the DB-only candidate that explains
  the first difference.
- Coverage drift is explicit for `cafe-del-mar-bali` (repo replay Seminyak;
  production-oriented Canggu), the dedupe migration's 32-pair claim versus its
  31 explicit loser slugs, and the two remaining Ubud duplicate-review slugs.
- Canggu loop 1 completed: `mason`, `samesa-canggu`,
  `luigis-hot-pizza`. Each has a draft menu record, official action evidence,
  manifest linkage, `verifiedAt: null`, and `publicationAllowed: false`.

## Validation

- Loop 1: JSON parse passed; 3 unique venue slugs; menu item IDs unique within
  each menu; every menu/action maps to a manifest source; every unverified
  record keeps `verifiedAt: null`; no media is publishable.
- Two-source recheck passed at `2026-07-13T15:18:21Z`–`15:18:23Z`:
  MASONRY Canggu menu and Luigi's menu both returned HTTP 200.
- Diff check passed; only Session 0-owned paths changed.

## Contract requests and risks

- The frozen contract has no fields for venue display name, manifest linkage,
  per-source outcome, collection notes, or operator review state. These will be
  carried in Data Ops-owned wrapper/manifest fields, not added to the contract.
- First-party sites may use JavaScript, bot protection, location-wide menus, or
  booking widgets that cannot be safely attributed to one branch. Such cases
  will be recorded as ambiguous/unavailable rather than inferred.

## Final SHA

Not complete.
