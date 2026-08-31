# Run log — Single Fin

**Run status:** `HOLD_PREPARED`
**Venue slug:** `single-fin`
**District:** `uluwatu`
**Repository/worktree:** `other-bali-avli-evidence-20260830`
**Branch:** `codex/avli-evidence-pack-20260830`
**Baseline commit:** `aff19a0`
**Started:** `2026-08-30T05:46:16Z`
**Authorization:** `draft-only; no database write, publication, commit, push or deploy`
**Shared prompt library/version:** `UNKNOWN`
**Measurement cohort/change date:** `UNKNOWN`
**Paid measurement authorized:** `false`

## Phase 0 — Bind scope and authority

- Timestamp: 2026-08-30T05:46:16Z
- Status: `COMPLETED`
- Inputs/evidence: Uluwatu recovery workbook and the existing `single-fin` registry record.
- Decision/change: one venue, one isolated draft pack; publication and production writes remain forbidden.
- Checks/result: slug exists in the local registry and its public page resolves.
- Blocker: none.
- Next action/owner: operator captures current first-party evidence.

## Phase 1 — Resolve identity and duplicates

- Timestamp: 2026-08-30T05:46:16Z
- Status: `COMPLETED_LOCAL_AND_PUBLIC`
- Inputs/evidence: official website and existing Other Bali public page.
- Decision/change: update the existing `single-fin` card; do not create a second venue.
- Checks/result: name, domain, address context and public slug agree.
- Blocker: exact production row identity was not queried.
- Next action/owner: verify the one-row production target before any write.

## Phase 2 — Capture the before-state

- Timestamp: 2026-08-30T05:46:16Z
- Status: `COMPLETED`
- Inputs/evidence: public page and `lib/uluwatu/venues.ts`.
- Decision/change: record the stale 2026-07-12 check date, missing hours and unsubstantiated `sliders` menu suggestion.
- Checks/result: public page is live; it does not expose current menu text or hours.
- Blocker: none.
- Next action/owner: replace stale fields only after source verification.

## Phase 3 — Preserve primary evidence

- Timestamp: 2026-08-30T05:46:16Z
- Status: `COMPLETED`
- Inputs/evidence: official home, official Eat & Drinks page and official SevenRooms handoff.
- Decision/change: preserve a dated text extract in `raw-evidence/`.
- Checks/result: the menu is machine-readable HTML; OCR is not required.
- Blocker: none.
- Next action/owner: build the field-level fact matrix.

## Phase 4 — Build the fact matrix

- Timestamp: 2026-08-30T05:46:16Z
- Status: `COMPLETED`
- Inputs/evidence: source manifest and raw extract.
- Decision/change: hours, address, booking link, representative menu items and prices are VERIFIED; event cadence remains HOLD.
- Checks/result: every non-null critical draft field maps to a source ID.
- Blocker: dynamic event claims were not reverified on a dated event page.
- Next action/owner: keep event copy out of the prepared data change.

## Phase 5 — Measure card coverage

- Timestamp: 2026-08-30T05:46:16Z
- Status: `COMPLETED`
- Inputs/evidence: live public page compared with current official sources.
- Decision/change: hours and menu/price fields are current gaps; identity and core editorial positioning already exist.
- Checks/result: current page is indexable and provider links are visible.
- Blocker: none.
- Next action/owner: draft only the missing or corrected fields.

## Phase 6 — Draft the venue record

- Timestamp: 2026-08-30T05:46:16Z
- Status: `COMPLETED_DRAFT`
- Inputs/evidence: verified field matrix.
- Decision/change: drafted a current hours string and menu-backed `what_to_order`; structured hours stay null because the repository parser truncates post-midnight closing to 23:59.
- Checks/result: publication/import locks are enabled.
- Blocker: editorial approval and exact one-row production target.
- Next action/owner: editorial review.

## Phase 7 — Prepare actions and media

- Timestamp: 2026-08-30T05:46:16Z
- Status: `COMPLETED_DRAFT`
- Inputs/evidence: official home, Maps handoff and SevenRooms redirect.
- Decision/change: website, directions and reservation actions drafted; existing public image is not changed in this run.
- Checks/result: reservation resolves to the Single Fin Uluwatu SevenRooms entity.
- Blocker: none for actions; no new hero selection was requested.
- Next action/owner: retain current media until a separate image change is reviewed.

## Phase 8 — Review extractability

- Timestamp: 2026-08-30T05:46:16Z
- Status: `COMPLETED`
- Inputs/evidence: official menu HTML.
- Decision/change: representative food items and prices are stored as text and JSON.
- Checks/result: critical menu facts are not image-only.
- Blocker: the draft stores a representative selection, not a full menu mirror.
- Next action/owner: link to the official full menu and date the extract.

## Phase 9 — Review schema and technical SEO

- Timestamp: 2026-08-30T05:46:16Z
- Status: `HOLD_STRUCTURED_HOURS`
- Inputs/evidence: `lib/opening-hours.ts`.
- Decision/change: do not encode 08:00–02:00 in `opening_hours_json` until overnight intervals are represented without truncation.
- Checks/result: human-readable hours remain exact; no false 23:59 close is proposed.
- Blocker: current opening-hours parser cannot faithfully express overnight close.
- Next action/owner: engineering decides whether to extend the parser/schema.

## Phase 10 — Decide guide and internal-link placement

- Timestamp: 2026-08-30T05:46:16Z
- Status: `EDITOR_REVIEW_REQUIRED`
- Inputs/evidence: existing public card and proposed editorial copy.
- Decision/change: no automatic guide edit; preserve current internal links.
- Checks/result: recommendation language avoids ranking or guaranteed outcomes.
- Blocker: editor has not approved the revised menu-backed copy.
- Next action/owner: Other Bali editor reviews `editorial-review.md`.

## Phase 11 — Prepare the exact change

- Timestamp: 2026-08-30T05:46:16Z
- Status: `COMPLETED_PROPOSAL_ONLY`
- Inputs/evidence: reviewed draft record.
- Decision/change: field-level change proposal prepared without SQL or repository venue mutation.
- Checks/result: proposal targets existing slug `single-fin` and excludes unverified event claims.
- Blocker: exact production row and editorial approval.
- Next action/owner: owner approves the proposal before guarded data preparation.

## Phase 12 — Run local and preview QA

- Timestamp: 2026-08-30T05:46:16Z
- Status: `COMPLETED_PACK_VALIDATION`
- Inputs/evidence: isolated draft pack.
- Decision/change: run the pack validator after all artifacts are written.
- Checks/result: `PASS: draft pack is structurally safe for operator review`; `git diff --check` passed and the draft diff contained no configured secret signatures.
- Blocker: none.
- Next action/owner: operator runs validator.

## Phase 13 — Verify production separately

- Timestamp: 2026-08-30T05:46:16Z
- Status: `BEFORE_STATE_ONLY`
- Inputs/evidence: current public page.
- Decision/change: public page availability is evidence only for the before-state, not for an unpublished change.
- Checks/result: page resolves and reports last checked 2026-07-12.
- Blocker: no change has been published.
- Next action/owner: verify again only after separately authorized publication.

## Phase 14 — Measure AI visibility

- Timestamp: 2026-08-30T05:46:16Z
- Status: `NOT_STARTED`
- Inputs/evidence: draft measurement plan only.
- Decision/change: no AI answer or citation is claimed.
- Checks/result: paid run is not authorized; prompts remain unapproved.
- Blocker: approved prompt library and public change date are absent.
- Next action/owner: measurement owner approves a baseline after publication.
