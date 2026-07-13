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
- Canggu loop 2 completed: `the-shady-shack`,
  `milk-and-madu-berawa`. Both have branch-matched official menu sources and
  official action evidence; currency is normalized only where the source names
  IDR and its scale.
- Canggu loop 3 completed: `ji-restaurant-bali`, `luma`, `santanera`.
  Currency/scale ambiguity is preserved as raw source display text rather than
  converted; Ji's currently unreliable Chope redirect remains a draft action
  with an explicit warning.
- Canggu loop 4 completed: `revolver-canggu`, `ulekan-berawa`.
  Revolver prices are normalized only where its PDF explicitly states `000
  IDR`; Ulekan uses an accessible official fallback because the branch PDF is
  blocked, and placeholder menu descriptions were excluded.
- Canggu loop 5 completed: `hippie-fish-pererenan-beach`,
  `baked-pererenan`, `rize-cafe`. Hippie Fish and RiZE have partial official
  menus; BAKED has branch-matched official actions but no itemized restaurant
  menu, so it is classified `only_action_links_found` rather than padded with
  retail products or inferred items.
- Canggu loop 6 completed: `sensorium-bali`, `shelter-restaurant`.
  SENSORIUM is flagged stale/address-conflicting after its PDF returned
  `Last-Modified: 2021-11-02`; Shelter uses the unambiguous official 2026 lunch
  asset and rejects the older placeholder flipbook.
- Wave 1 checkpoint is complete: 15/15 researched; 14 have partial official
  menu evidence and 1 (`baked-pererenan`) has official actions only. Zero menus
  are claimed fully parsed or human-verified.
- Post-Wave checkpoint `canggu-04a` completed four additional branch-matched
  records: Nüde Berawa plus Riviera Bistro Berawa, Riviera Cafe Cemagi, and
  Riviera Trattoria Pererenan. Nüde has an official menu folder that was not
  safely parseable; the three Riviera records have partial official menu
  evidence and strictly separated branch actions.
- Current repo-denominator progress is 19/207 complete: 18 official menus
  found, 17 partial transcriptions, 1 official menu found but not parsed, and 1
  action-only venue. The remaining deterministic queue contains 188 records.
- Canggu batch 02 is processed across all 10 queued slugs. Five records have
  partial official-menu evidence and five have concrete source blockers. The
  Deus PDF was rejected as Australian wrong-branch collateral; Cafe Vida and
  Honey were not backfilled from aggregators. Current ledger state is 24
  complete, 5 blocked, and 178 queued out of 207.
- Canggu batch 01 is processed across all 10 slugs: eight partial official-menu
  transcriptions and two concrete menu-access blockers. Shared menu/branch
  caveats are retained for Bali Buda, Brunch Club and Bottega; a Legian booking
  target was rejected for the Pererenan record. Ledger state is now 32
  complete, 7 blocked, and 168 queued.
- Canggu batch 03 is processed across all 10 slugs: eight partial official-menu
  transcriptions and two social-only blockers (MIEL and Milu). Stale-looking
  filenames and duplicated live menu blocks are retained as review warnings.
  Ledger state is 40 complete, 9 blocked, and 158 queued.
- Canggu batch 04 is fully processed after checkpoint 04b: Pizza Fabbrica has a
  partial official menu, while four social-only venues and Samadi have exact
  access/menu blockers. Ledger state is 41 complete, 14 blocked, and 152
  queued.
- Canggu batch 05 is processed: six partial official menus, two valid
  action-only records, and two exact blockers. Cross-branch Touché actions,
  compromised The Slow collateral, and non-restaurant booking links were
  excluded. Ledger state is 49 complete, 16 blocked, and 142 queued.
- Canggu batch 06 completes the full 70-record Canggu denominator. Three venues
  have item-level partial menus, Warung Bu Mi has buffet-level official menu
  evidence, and Warung Nonii has a specific no-first-party-source blocker.
  Overall ledger state is 53 complete, 17 blocked, and 137 queued.
- Ubud batch 04 is processed: Zest has partial official evidence with an address
  mismatch warning; Wulan is blocked on inaccessible social-only evidence.
  Ledger state is 54 complete, 18 blocked, and 135 queued.

## Validation

- Loop 1: JSON parse passed; 3 unique venue slugs; menu item IDs unique within
  each menu; every menu/action maps to a manifest source; every unverified
  record keeps `verifiedAt: null`; no media is publishable.
- Two-source recheck passed at `2026-07-13T15:18:21Z`–`15:18:23Z`:
  MASONRY Canggu menu and Luigi's menu both returned HTTP 200.
- Loop 2: JSON parse/provenance/duplicate-ID checks passed for 5 cumulative
  venues. Recheck at `2026-07-13T15:19:49Z`: Shady Shack's official PDF link
  returned the expected Squarespace asset redirect (HTTP 302), and Milk &
  Madu's official contact page returned HTTP 200.
- Loop 3: cumulative checks passed for 8 venues. Recheck at
  `2026-07-13T15:20:59Z`: Ji's official menu and Santanera's official booking
  page both returned HTTP 200.
- Loop 4: cumulative checks passed for 10 venues. Recheck at
  `2026-07-13T15:22:04Z`–`15:22:06Z`: Revolver's official Canggu page and
  Ulekan's official fallback menu both returned HTTP 200.
- Loop 5: cumulative checks passed for 13 venues, including the no-menu BAKED
  classification and unique IDs across RiZE's two menu records. Recheck at
  `2026-07-13T15:23:30Z`: Hippie Fish and BAKED's official branch/location
  pages both returned HTTP 200.
- Loop 6 / Wave 1: cumulative JSON, provenance, duplicate slug/item/menu ID,
  draft status, null verification, and publication-block checks passed for 15
  venues. Recheck at `2026-07-13T15:24:36Z`–`15:24:37Z`: SENSORIUM's official
  PDF and Shelter's official lunch page returned HTTP 200; SENSORIUM's stale
  `Last-Modified` value is recorded as a blocker for import readiness.
- Canggu 04a: JSON and source mapping checks passed for four unique venue
  slugs. The Nüde Berawa page/menu and Riviera Bistro branch/menu were reopened
  from official sources during acceptance; branch identity and action links
  remained consistent. All batch records retain null verification, draft-only
  actions, no media, and publication prohibition.
- Canggu 02: all 10 official identity/menu surfaces were independently reopened
  during acceptance. JSON, unique slug, source mapping, action draft/null
  verification, denominator and queue reconciliation checks passed. The batch
  has 5 complete and 5 blocked research states; blocked records have an exact
  retry reason and remain removed from the active queue.
- Canggu 01: venue-controlled pages for all 10 records were reopened during
  acceptance. Deterministic JSON, unique slugs/items, source mapping, action
  draft/null verification, denominator metrics, and completed queue state all
  passed validation. No network-wide menu is represented as branch-verified.
- Canggu 03: all 10 primary pages were reopened during acceptance. JSON,
  provenance, unique identifiers, draft/null verification, denominator metrics
  and queue completion passed. Ambiguous `k`/numeric values were not assigned a
  currency merely from Bali context.
- Canggu 04b: all six official identities/surfaces were rechecked. JSON,
  provenance, unique IDs, draft/null verification, denominator metrics and the
  now-complete Canggu-04 queue passed. Pizza Fabbrica's SSL and Samadi's removed
  PDF are retained as explicit retry conditions.
- Canggu 05: all 10 official surfaces were independently reopened. JSON,
  provenance, unique IDs, draft/null verification, denominator metrics and
  queue completion passed. Action-only and classification-blocked states remain
  distinct.
- Canggu 06: official pages for Warung Bu Mi, Woods, YUKI and ZIN were reopened;
  Warung Nonii produced only rejected third-party results. JSON, source mapping,
  unique IDs, draft/null gates, metric reconciliation and all seven completed
  Canggu queue checkpoints passed.
- Ubud 04: Zest and Wulan sources were both reopened. JSON, source mapping,
  unique IDs, draft/null gates, denominator metrics and completed queue state
  passed.
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
