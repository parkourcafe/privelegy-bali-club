# Run log — Sundays Beach Club

**Run status:** `HOLD_PREPARED`
**Venue slug:** `sundays-beach-club`
**District:** `uluwatu`
**Repository/worktree:** `other-bali-avli-evidence-20260830`
**Branch:** `codex/avli-evidence-pack-20260830`
**Baseline commit:** `aff19a0`
**Started:** `2026-08-30T05:58:00Z`
**Authorization:** `draft-only; no database write, publication, commit, push or deploy`
**Paid measurement authorized:** `false`

## Phase 0 — Bind scope and authority
- Status: `COMPLETED`; timestamp: 2026-08-30T05:58:00Z.
- Decision/change: isolated draft for the existing `sundays-beach-club` card; no live mutation.
- Checks/result: slug exists locally and publicly. Blocker: none. Next: first-party evidence capture.

## Phase 1 — Resolve identity and duplicates
- Status: `COMPLETED_LOCAL_AND_PUBLIC`; timestamp: 2026-08-30T05:58:00Z.
- Evidence: official site, exact Maps handoff and live Other Bali card.
- Decision/change: update the existing slug, never create a second record.
- Blocker: exact production row not queried. Next: one-row read check before write.

## Phase 2 — Capture the before-state
- Status: `COMPLETED`; timestamp: 2026-08-30T05:58:00Z.
- Result: public card is live, reports 2026-07-12, omits current hours/menu and uses the daily-pass page as booking.
- Next: compare current official sources.

## Phase 3 — Preserve primary evidence
- Status: `COMPLETED`; timestamp: 2026-08-30T05:58:00Z.
- Evidence: official home and four-page June 2026 food-and-beverage PDF.
- Result: PDF downloaded to temporary evidence; SHA-256 and metadata recorded; text layer extracted successfully.
- Blocker: none. Next: fact matrix.

## Phase 4 — Build the fact matrix
- Status: `COMPLETED`; timestamp: 2026-08-30T05:58:00Z.
- Decision/change: identity, address, Maps, daily 07:30–22:00, walk-in pass policy, VIP handoff, menu and prices VERIFIED.
- Blocker: printed surcharge wording is preserved without reinterpretation. Next: coverage review.

## Phase 5 — Measure card coverage
- Status: `COMPLETED`; timestamp: 2026-08-30T05:58:00Z.
- Result: current hours, text menu evidence and separate walk-in/VIP paths are missing from the card.
- Next: draft supported fields only.

## Phase 6 — Draft the venue record
- Status: `COMPLETED_DRAFT`; timestamp: 2026-08-30T05:58:00Z.
- Decision/change: identical daily hours structured across all seven days; current menu-backed recommendations and price anchor proposed.
- Blocker: editorial approval and exact production target. Next: editorial review.

## Phase 7 — Prepare actions and media
- Status: `COMPLETED_DRAFT`; timestamp: 2026-08-30T05:58:00Z.
- Decision/change: website, exact official Maps handoff and VIP SevenRooms action prepared; daily pass remains labelled walk-in.
- Result: no availability promise and no media change. Next: extractability review.

## Phase 8 — Review extractability
- Status: `COMPLETED_PDF_TRANSCRIPTION`; timestamp: 2026-08-30T05:58:00Z.
- Result: official PDF has a text layer; all food item names/prices are transcribed in `raw-evidence/` and representative items are structured in JSON.
- Blocker: drinks are preserved in the PDF but not duplicated into the restaurant-card JSON. Next: schema review.

## Phase 9 — Review schema and technical SEO
- Status: `COMPLETED_DRAFT`; timestamp: 2026-08-30T05:58:00Z.
- Result: daily schedule is compatible with current parser; no schema type change proposed.
- Blocker: rendering QA waits for authorized implementation. Next: guide review.

## Phase 10 — Decide guide and internal-link placement
- Status: `EDITOR_REVIEW_REQUIRED`; timestamp: 2026-08-30T05:58:00Z.
- Decision/change: no automatic guide change; existing family/beach-day positioning is supported.
- Blocker: editor approval. Next: Other Bali editor.

## Phase 11 — Prepare the exact change
- Status: `COMPLETED_PROPOSAL_ONLY`; timestamp: 2026-08-30T05:58:00Z.
- Result: field-level proposal targets existing slug; no SQL or venue code mutation.
- Blocker: exact row and approval. Next: owner/editor.

## Phase 12 — Run local and preview QA
- Status: `COMPLETED_PACK_VALIDATION`; timestamp: 2026-08-30T05:58:00Z.
- Decision/change: run pack validator and diff checks after artifact creation.
- Checks/result: `PASS: draft pack is structurally safe for operator review`; `git diff --check` passed and no configured secret signature appeared in the draft diff. Next: operator.

## Phase 13 — Verify production separately
- Status: `BEFORE_STATE_ONLY`; timestamp: 2026-08-30T05:58:00Z.
- Result: live page resolves; no prepared change is published.
- Blocker: publication not authorized. Next: verify only after release.

## Phase 14 — Measure AI visibility
- Status: `NOT_STARTED`; timestamp: 2026-08-30T05:58:00Z.
- Result: prompts unapproved, paid run false, no citation outcome claimed.
- Blocker: public change date and shared baseline. Next: measurement owner after publication.
