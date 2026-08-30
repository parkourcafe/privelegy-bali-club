# Run log — AVLI

**Run status:** `EVIDENCE_PACK_READY`
**Venue slug:** `avli-bali` (provisional)
**District:** `uluwatu`
**Repository/worktree:** `other-bali-avli-evidence-20260830`
**Branch:** `codex/avli-evidence-pack-20260830`
**Baseline commit:** `560df8a`
**Started:** `2026-08-30T03:50:02Z`
**Authorization:** `draft-only; commit, push and draft PR authorized; no database write, publication, guide edit or deploy`
**Shared prompt library/version:** `UNKNOWN; not approved`
**Measurement cohort/change date:** `UNKNOWN; no experiment started`
**Paid measurement authorized:** `false`

## Phase 0 — Bind scope and authority

- Timestamp: 2026-08-30T03:50:02Z
- Status: `VERIFIED`
- Inputs/evidence: user requested an AVLI evidence pack and draft record without publication.
- Decision/change: created a dedicated worktree from `origin/main`; limited the run to one venue.
- Checks/result: branch `codex/avli-evidence-pack-20260830`, baseline `560df8a`.
- Blocker: none.
- Next action/owner: resolve venue identity and catalogue state / Codex.

## Phase 1 — Resolve identity and duplicates

- Timestamp: 2026-08-30T03:50:02Z
- Status: `HOLD`
- Inputs/evidence: AVLI official domain, Other Bali places sitemap, Uluwatu restaurant guide and guessed public slugs.
- Decision/change: bound the candidate to AVLI Modern Greek in Pecatu/Uluwatu; proposed `avli-bali` only as a provisional slug; added `entity-consistency.json` for cross-surface identity checks.
- Checks/result: official site, Other Bali public catalogue/guide, Instagram and booking handoff are recorded separately; Maps resolution and unpublished database duplicate remain `UNKNOWN`/`HOLD`.
- Blocker: production-safe exact-name/domain/Maps/slug dedupe has not been run.
- Next action/owner: run read-only database dedupe after exact project binding / data operator.

## Phase 2 — Capture the before-state

- Timestamp: 2026-08-30T03:50:02Z
- Status: `VERIFIED`
- Inputs/evidence: public sitemap and `/uluwatu/best-restaurants`; no public Other Bali venue URL exists for an AI baseline.
- Decision/change: recorded AVLI as absent from the public places sitemap and current Uluwatu guide; did not manufacture a pre-publication AI score.
- Checks/result: public absence confirmed for the checked surfaces; database state and AI baseline remain separate `UNKNOWN` states.
- Blocker: database state unavailable.
- Next action/owner: preserve first-party venue evidence / Codex.

## Phase 3 — Preserve primary evidence

- Timestamp: 2026-08-30T03:50:02Z
- Status: `COMPLETE`
- Inputs/evidence: AVLI home, menu, meet-the-maker and private-dining pages; official SevenRooms, Instagram and Maps handoffs.
- Decision/change: created `source-manifest.json` with supported fields and limitations per source.
- Checks/result: all source URLs use HTTP(S); dynamic social content excluded from stable menu/event claims.
- Blocker: none for captured sources.
- Next action/owner: classify every candidate fact / Codex.

## Phase 4 — Build the fact matrix

- Timestamp: 2026-08-30T03:50:02Z
- Status: `COMPLETE`
- Inputs/evidence: source manifest and official page content.
- Decision/change: recorded VERIFIED, VERIFIED OWNER CLAIM, VERIFIED PARTIAL, HOLD and UNKNOWN claims in `evidence-pack.md`.
- Checks/result: exact street address, prices, exact closing times and current dish recommendations remain unsupported.
- Blocker: owner/datable source confirmation required for volatile fields.
- Next action/owner: measure Tier A gaps / Codex.

## Phase 5 — Measure card coverage

- Timestamp: 2026-08-30T03:50:02Z
- Status: `COMPLETE`
- Inputs/evidence: Other Bali Tier A card fields and the AVLI fact matrix.
- Decision/change: prioritised address, exact hours, menu prices, price anchor, dish evidence, media and dedupe.
- Checks/result: identity, category, district, general cuisine, partial hours and booking action have first-party support.
- Blocker: no current public/database record exists to inspect across select-map-render gates.
- Next action/owner: prepare a non-publishable draft record / Codex.

## Phase 6 — Draft the venue record

- Timestamp: 2026-08-30T03:50:02Z
- Status: `COMPLETE`
- Inputs/evidence: accepted fact matrix and Other Bali venue-record standard.
- Decision/change: created `draft-venue-record.json`; unsupported critical fields remain null and every non-null critical field maps to source IDs.
- Checks/result: one fact per sentence; no Google ratings, invented price, exact close time or unsupported dish list.
- Blocker: editorial fields still require human review.
- Next action/owner: review actions and media / editor and data operator.

## Phase 7 — Prepare actions and media

- Timestamp: 2026-08-30T03:50:02Z
- Status: `HOLD`
- Inputs/evidence: official website, SevenRooms and Maps handoffs.
- Decision/change: website, reserve and directions actions recorded as `draft`; no first-party, Other Bali editorial or independent video evidence was accepted.
- Checks/result: SevenRooms handoff verified; Maps short link captured but its final target was not independently resolved; photo remains null.
- Blocker: exact Maps identity and approved photo selection.
- Next action/owner: confirm address/Maps target and choose photo / venue owner and editor.

## Phase 8 — Review extractability

- Timestamp: 2026-08-30T03:50:02Z
- Status: `COMPLETE`
- Inputs/evidence: draft editorial fields.
- Decision/change: kept venue name, category, location and chef facts in separate extractable sentences; limitations remain beside volatile claims in the evidence pack.
- Checks/result: no image-only menu facts were promoted to `what_to_order` or `price_anchor`.
- Blocker: none for the draft.
- Next action/owner: defer public technical review until implementation exists / Codex.

## Phase 9 — Review schema and technical SEO

- Timestamp: 2026-08-30T03:50:02Z
- Status: `HOLD`
- Inputs/evidence: current Other Bali schema-markup rules.
- Decision/change: no JSON-LD or page code created; unsupported address, exact hours, geo, phone and image remain unavailable for emission.
- Checks/result: no public AVLI URL exists to test.
- Blocker: approved record and implementation are required first.
- Next action/owner: run after one-record implementation / engineering.

## Phase 10 — Decide guide and internal-link placement

- Timestamp: 2026-08-30T03:50:02Z
- Status: `HOLD`
- Inputs/evidence: current Uluwatu restaurant guide; AVLI is absent.
- Decision/change: guide inclusion recorded as first-party Other Bali editorial selection, not an independent endorsement; created an empty `citation-source-map.json` that cannot claim opportunities before a real baseline.
- Checks/result: no guide file or production guide changed; no cited URLs or source gaps were invented.
- Blocker: editorial approval and published venue identity.
- Next action/owner: approve or reject AVLI's fit for the guide / editor.

## Phase 11 — Prepare the exact change

- Timestamp: 2026-08-30T03:50:02Z
- Status: `HOLD`
- Inputs/evidence: draft record and blocker list.
- Decision/change: no SQL or import batch prepared.
- Checks/result: `readyForImportDryRun=false`, `readyToPublish=false`.
- Blocker: exact address, menu/prices, hours, dedupe and editorial review.
- Next action/owner: close blockers before a guarded one-record dry-run / owner, editor and data operator.

## Phase 12 — Run local and preview QA

- Timestamp: 2026-08-30T04:11:56Z
- Status: `VERIFIED`
- Inputs/evidence: draft record, source manifest, entity consistency, citation-source map, measurement plan and pack validator.
- Decision/change: extended structural QA to require all seven artifacts and preserve paid-run/publication locks; runtime QA remains out of scope because no product code changed.
- Checks/result: validator syntax PASS; skill `quick_validate.py` PASS with system Python; AVLI seven-file draft-pack validation PASS; deliberately incomplete pack FAILS with all seven missing files reported. The bundled document Python could not run `quick_validate.py` because PyYAML is absent, so the installed system Python was used. No preview/build claimed.
- Blocker: implementation QA is not applicable yet.
- Next action/owner: rerun all relevant gates after implementation / engineering.

## Phase 13 — Verify production separately

- Timestamp: 2026-08-30T03:50:02Z
- Status: `SKIPPED`
- Inputs/evidence: no publication or deployment was authorized or performed.
- Decision/change: production verification intentionally not attempted.
- Checks/result: `NOT_RUN`.
- Blocker: no public AVLI card exists.
- Next action/owner: verify only after separately authorized production publication / release owner.

## Phase 14 — Measure AI visibility

- Timestamp: 2026-08-30T03:50:02Z
- Status: `NOT_STARTED`
- Inputs/evidence: no fixed shared prompt library or baseline run exists for AVLI on Other Bali.
- Decision/change: created `measurement-plan.json` with five unapproved venue-specific prompts; no platform, repetition count, cohort or change date was invented, and paid measurement remains unauthorized.
- Checks/result: mentions, citations, cited pages, factual accuracy and referral signals are `UNKNOWN`; technical readiness is not reported as observed AI visibility.
- Blocker: public verified card and an approved versioned Uluwatu restaurant prompt library are required.
- Next action/owner: approve the shared prompt library, then prepare a free/manual baseline after publication; request separate approval for paid multi-system measurement / SEO owner.

## Reverification pass — 2026-08-30T04:42:40Z

### Phase 1 update — identity and duplicates

- Status: `HOLD`
- Inputs/evidence: official Maps short link and its resolved destination; repository-wide exact search; connected Supabase project list.
- Decision/change: confirmed the handoff resolves to `AVLI | Modern Greek` at `-8.8165625, 115.0958125` with Google token `/g/11xghttkxm`; updated `entity-consistency.json`.
- Checks/result: repository search found AVLI only inside this draft pack. The connected Supabase account did not expose an Other Bali project, so no database SQL was sent.
- Blocker: unpublished production duplicate state and final slug remain `UNKNOWN`.
- Next action/owner: restore read-only access to the correct Other Bali project and run an exact name/domain/Maps/slug query / data owner.

### Phase 3 update — primary menu evidence

- Status: `COMPLETE`
- Inputs/evidence: the current official `/menu/` page and its live Elementor menu popups.
- Decision/change: captured the exact signature-sharing and dessert image URLs, hashes, dimensions, item prices, weight units, tax and service note in `raw-evidence/2026-08-30-menu-maps-source-extract.md` and `source-manifest.json`.
- Checks/result: both official assets downloaded and were visually inspected. The main asset is a signature selection, not a complete machine-readable food menu.
- Blocker: none for the captured items; full restaurant spend remains unproven.
- Next action/owner: use only captured items and preserve menu volatility / editor.

### Phase 4 update — fact matrix

- Status: `COMPLETE`
- Inputs/evidence: official signature-sharing and dessert menu assets.
- Decision/change: promoted the captured item names and prices from `UNKNOWN` to `VERIFIED`; kept exact closing time and street address unresolved.
- Checks/result: third-party plus codes, daily closing times, ratings and review claims were rejected as publication provenance.
- Blocker: exact closing time and street-and-number address require first-party confirmation.
- Next action/owner: request those two facts from AVLI / venue owner.

### Phase 6 update — draft record

- Status: `COMPLETE`
- Inputs/evidence: revised fact matrix and venue-record field standard.
- Decision/change: rewrote the direct answer, added a verified phone, proposed `price_anchor` and `what_to_order`, and stored two draft menu records with source IDs.
- Checks/result: the proposed dishes come from AVLI's official signature menu; the price anchor states observable menu anchors rather than a fabricated average spend.
- Blocker: all editorial fields remain subject to Other Bali editorial approval.
- Next action/owner: approve or revise the five editorial fields / Other Bali editor.

### Phase 7 update — actions and media

- Status: `HOLD`
- Inputs/evidence: resolved official Maps handoff.
- Decision/change: marked the draft directions handoff identity as verified.
- Checks/result: Maps target matches AVLI by name and coordinates; no route, ETA or availability is claimed.
- Blocker: exact street-and-number address and licensed hero image remain missing.
- Next action/owner: venue confirms address; editor selects rights-cleared media.

### Phase 11 update — implementation readiness

- Status: `HOLD`
- Inputs/evidence: updated draft and remaining blocker list.
- Decision/change: no SQL, import, guide edit or publication was prepared.
- Checks/result: Maps and menu blockers narrowed; database dedupe, exact address, closing times, hero rights and editorial approval remain open.
- Blocker: `readyForImportDryRun=false`, `readyToPublish=false`.
- Next action/owner: close the remaining owner/data/editor blockers before preparing a one-record dry-run.

### Phase 12 update — artifact QA

- Status: `VERIFIED`
- Inputs/evidence: updated seven-file pack, two menu records and source references.
- Decision/change: extended the validator to require phone evidence and validate every captured menu's source, draft state and non-empty item list.
- Checks/result: validator syntax PASS; AVLI draft-pack PASS; all JSON artifacts parse; skill validation PASS; secret-pattern scan returned no matches.
- Blocker: product lint, tests and build are `NOT_RUN` because no runtime product code or import file changed.
- Next action/owner: run product and guide gates only after an implementation is prepared / engineering.

## Owner-rule update — 2026-08-30T04:56:01Z

- Status: `VERIFIED_OWNER_INSTRUCTION`
- Inputs/evidence: owner stated that restaurant photos may be shown and that each restaurant uses the same opening/closing interval on every operating day, with days off represented separately.
- Decision/change: added the schedule normalisation rule to the venue skill; selected an official AVLI exterior image as the draft hero; removed exact street address and photo research from AVLI's preparation blockers.
- Checks/result: the schedule rule defines the data shape but does not provide AVLI's exact closing time. The repository's older hero-media rights publication gate conflicts with the new owner instruction and remains disclosed.
- Blocker: exact AVLI closing time, production database dedupe and editorial approval.
- Next action/owner: owner provides one exact closing time; data owner restores read-only database access; editor approves the prepared copy.

## Owner closing-time clarification — 2026-08-30T05:03:41Z

- Status: `VERIFIED_OWNER_INSTRUCTION`
- Inputs/evidence: owner confirmed that AVLI works until the last guest and instructed Other Bali to leave it that way.
- Decision/change: removed exact closing time from the blocker list; retained `Monday-Sunday 5pm-late` as the source-faithful value and recorded `open_ended_until_last_guest_owner_confirmed`.
- Checks/result: `opening_hours_json` remains null because the current structure requires a clock time; no artificial closing time was created.
- Blocker: production database dedupe and editorial approval remain.
- Next action/owner: restore correct read-only database access and approve the prepared editorial record.

## Menu implementation preparation — 2026-08-30T05:45:00Z

- Status: `HOLD`
- Inputs/evidence: visually verified official signature-sharing and dessert menu images, the repository `Menu`/`MenuSection`/`MenuItem` contract, and the existing server-rendered `StructuredMenu` component.
- Decision/change: created `menu-implementation-candidate.json` with two sections and all 13 captured items. Converted prices from printed thousand-IDR units to integer minor units, preserved human-readable source prices, kept allergen/editorial flags empty, marked the menu `partial`, and set a 2026-09-30 recheck deadline.
- Checks/result: the candidate remains `draft`, `forbiddenToPublish=true`, `publicationAllowed=false`, and `readyForImportDryRun=false`. No database or runtime write was performed.
- Blocker: the proposed `avli-bali` slug still requires an exact production database dedupe; editorial approval and a supported publication state remain separate gates.
- Next action/owner: data owner confirms the unique production venue identity and slug; editor reviews the menu subset; engineering then prepares the exact one-record dry-run.

## Owner publication authorization and production apply — 2026-08-30T06:00:00Z

- Status: `PUBLISHED_SOURCE_SNAPSHOT`
- Inputs/evidence: explicit owner authorization to publish the AVLI page; official AVLI evidence pack; production Supabase project `bali-privilege` (`egkdapqwkfprtyqvvnso`).
- Decision/change: exact read-only dedupe by AVLI name, proposed slug, official domain and Maps token returned no prior row. A one-row venue dry-run passed, then an atomic production transaction created active/published venue `v_import_avli_bali` with canonical slug `avli-bali` in district `uluwatu-bukit`.
- Menu change: inserted one partial `source_snapshot` menu (`50b3a1f4-076e-4ebb-a25c-105e3096173f`) with two sections and 13 verified items, preserving official source URL, capture time, content digest and both source-asset hashes. Snapshot expires 2026-09-30.
- Checks/result: production read-back confirmed the venue row, `publication_status=published`, `status=active`, coordinates `-8.8165625,115.0958125`, open-ended `Monday-Sunday 5pm-late`, and menu counts `2 sections / 13 items`. No guide edit, merge or deploy was performed.
- Remaining review: Uluwatu guide inclusion and any stronger editorial rewrite remain separate editor decisions; the production URL is expected only after the PR is merged and deployed.
