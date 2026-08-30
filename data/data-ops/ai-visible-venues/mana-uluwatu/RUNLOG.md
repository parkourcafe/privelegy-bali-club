# Run log — Mana Uluwatu

**Run status:** `HOLD_PREPARED`
**Venue slug:** `mana-uluwatu`
**District:** `uluwatu`
**Repository/worktree:** `other-bali-avli-evidence-20260830`
**Branch:** `codex/avli-evidence-pack-20260830`
**Baseline commit:** `aff19a0`
**Started:** `2026-08-30T05:51:23Z`
**Authorization:** `draft-only; no database write, publication, commit, push or deploy`
**Paid measurement authorized:** `false`

## Phase 0 — Bind scope and authority
- Timestamp: 2026-08-30T05:51:23Z; Status: `COMPLETED`.
- Decision/change: isolated draft for the existing `mana-uluwatu` venue only.
- Checks/result: no live mutation is included.
- Blocker: none. Next action/owner: operator collects first-party evidence.

## Phase 1 — Resolve identity and duplicates
- Timestamp: 2026-08-30T05:51:23Z; Status: `COMPLETED_LOCAL_AND_PUBLIC`.
- Inputs/evidence: official resort restaurant page, contact page and Other Bali public card.
- Decision/change: update the existing public slug; do not create a duplicate.
- Checks/result: name, parent property, Suluban location and domain agree.
- Blocker: exact production row was not queried. Next action/owner: read-only one-row verification before write.

## Phase 2 — Capture the before-state
- Timestamp: 2026-08-30T05:51:23Z; Status: `COMPLETED`.
- Inputs/evidence: `lib/uluwatu/venues.ts` and live public page.
- Decision/change: current card has no hours, points booking to the restaurant page and says last checked 2026-07-12.
- Checks/result: public page resolves. Blocker: none. Next action/owner: compare current sources.

## Phase 3 — Preserve primary evidence
- Timestamp: 2026-08-30T05:51:23Z; Status: `COMPLETED`.
- Inputs/evidence: official restaurant HTML plus Breakfast, Lunch and Dinner image assets.
- Decision/change: downloaded three official images to temporary evidence, recorded URLs, hashes and visual transcription in `raw-evidence/`.
- Checks/result: all three assets are 2480x3508 JPEG and currently linked by the official page.
- Blocker: none. Next action/owner: build fact matrix.

## Phase 4 — Build the fact matrix
- Timestamp: 2026-08-30T05:51:23Z; Status: `COMPLETED`.
- Decision/change: identity, hours, contact, TableCheck handoff, menu items/prices and +21% tax/service are VERIFIED.
- Checks/result: all non-null critical fields map to source IDs.
- Blocker: official contact address describes the parent property, not a separate restaurant street number.
- Next action/owner: use the parent-property address without inventing a unit.

## Phase 5 — Measure card coverage
- Timestamp: 2026-08-30T05:51:23Z; Status: `COMPLETED`.
- Decision/change: add current hours, structured hours, direct booking and text menu evidence; retain supported core editorial positioning.
- Checks/result: current public page omits these current facts.
- Blocker: none. Next action/owner: draft venue update.

## Phase 6 — Draft the venue record
- Timestamp: 2026-08-30T05:51:23Z; Status: `COMPLETED_DRAFT`.
- Decision/change: daily 07:00–23:00 is encoded identically for all seven days; current `what_to_order` is refined to exact menu names.
- Checks/result: draft/import/publication locks enabled.
- Blocker: editorial approval and exact production target. Next action/owner: editor review.

## Phase 7 — Prepare actions and media
- Timestamp: 2026-08-30T05:51:23Z; Status: `COMPLETED_DRAFT`.
- Decision/change: official website, TableCheck reservation and Maps search actions prepared; media unchanged.
- Checks/result: official reservation link resolves to the Mana Uluwatu TableCheck entity.
- Blocker: none. Next action/owner: retain current media unless separately changed.

## Phase 8 — Review extractability
- Timestamp: 2026-08-30T05:51:23Z; Status: `COMPLETED_IMAGE_TRANSCRIPTION`.
- Decision/change: image-only breakfast/lunch/dinner names and prices are transcribed into Markdown; representative structured items are in JSON.
- Checks/result: menu facts required for the card no longer remain image-only.
- Blocker: kids, poolside, dessert and beverage images are linked but not transcribed in this restaurant-card scope.
- Next action/owner: expand those modules only if the card needs them.

## Phase 9 — Review schema and technical SEO
- Timestamp: 2026-08-30T05:51:23Z; Status: `COMPLETED_DRAFT`.
- Decision/change: exact same-hours schedule is safe for `opening_hours_json`; no schema type change is proposed here.
- Checks/result: seven day keys use `7.00am-11.00pm`.
- Blocker: publication rendering not tested because no data mutation is authorized.
- Next action/owner: run normal preview gates after an approved implementation.

## Phase 10 — Decide guide and internal-link placement
- Timestamp: 2026-08-30T05:51:23Z; Status: `EDITOR_REVIEW_REQUIRED`.
- Decision/change: no automatic guide change; proposed fit remains sunset dining and poolside/formal choice.
- Checks/result: no ranking promise is introduced.
- Blocker: editor approval. Next action/owner: Other Bali editor.

## Phase 11 — Prepare the exact change
- Timestamp: 2026-08-30T05:51:23Z; Status: `COMPLETED_PROPOSAL_ONLY`.
- Decision/change: field-level proposal prepared; no SQL or venue source mutation.
- Checks/result: proposal targets `mana-uluwatu` and expected future row count is one.
- Blocker: exact production row and approval. Next action/owner: owner/editor.

## Phase 12 — Run local and preview QA
- Timestamp: 2026-08-30T05:51:23Z; Status: `COMPLETED_PACK_VALIDATION`.
- Inputs/evidence: isolated pack. Decision/change: run pack validator after writing artifacts.
- Checks/result: `PASS: draft pack is structurally safe for operator review`; `git diff --check` passed and no configured secret signature appeared in the draft diff. Blocker: none. Next action/owner: operator.

## Phase 13 — Verify production separately
- Timestamp: 2026-08-30T05:51:23Z; Status: `BEFORE_STATE_ONLY`.
- Checks/result: public card resolves and reports 2026-07-12; this does not prove any prepared update.
- Blocker: nothing published. Next action/owner: production verifier after separate authorization.

## Phase 14 — Measure AI visibility
- Timestamp: 2026-08-30T05:51:23Z; Status: `NOT_STARTED`.
- Decision/change: prompts remain unapproved and no citation result is claimed.
- Checks/result: paid run false. Blocker: approved shared baseline and public change date.
- Next action/owner: measurement owner after publication.
