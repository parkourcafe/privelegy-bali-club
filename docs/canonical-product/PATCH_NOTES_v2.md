# OTHER BALI — PACKAGE PATCH NOTES v2

Created: 13.07.2026 | 21:30 | Bali
Approved by: Founder (Selena), 13.07.2026
Base: Other_Bali_Product_Update_Complete_2026-07-13 (original bundle)

## Changes

1. **RENAME.** `02_REPOSITORY_UPDATE/Bali_Privilege_Master_Architecture.md` → `Other_Bali_Master_Architecture.md`. All references updated across README, AGENTS.md, AGENT.md, CLAUDE.md, the execution plan and all four session prompts. **Action at commit:** update any references to the old filename that exist inside the current repository in the same baseline commit.
2. **FIX.** Status board path unified to `docs/loop/STATUS_BOARD.md` (execution plan §3.1 previously pointed to `coordination/STATUS_BOARD.md`, which would stall agents).
3. **CONTRACT v1.1 addendum** (`lib/contracts/menu-action.ts`): added `VenueActionBarProps` — the frozen component contract for the Session 2 ↔ Session 3 integration slot (the previously undefined seam where merge conflicts were most likely).
4. **NEW:** `lib/contracts/menu-action.fixtures.ts` — canonical shared mock data. All sessions import fixtures from here; local invented mocks are prohibited (rule added to session prompts 1-4).
5. **NEW:** `docs/DATA_OPS_TRACK.md` — Track 0: pre-fill → owner-approval content workflow. Facts publish immediately with source attribution and captured-at date; photos are gated behind logged owner consent including a photo-rights confirmation line. Roles (Founder / Ananda / AI), per-venue pipeline, owner message template, wave-1 acceptance criteria. Referenced from README, the execution plan, AGENTS.md and session prompts 1 and 4.
6. **AGENTS.md:** added "Content publication rule (v2)" — the photo-consent and source-attribution rules as hard guardrails for all agents.
7. **SHA256SUMS.txt** regenerated for the full package.

## Not changed

- Product Constitution v1.1, both architecture copies (content untouched, filename only), the one-page docx, coordination templates.
- Open founder decisions remain: launch-fix sequencing vs. loop start; repository name confirmation.
