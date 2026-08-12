# District SEO ExecPlan

## Uluwatu autonomous cluster — 2026-07-23

Goal: create the reusable district SEO skill and take Uluwatu from inventory through evidence-gated preview without merge or production deployment.

- [completed] Phase 0: verify workspace, branch and authority; create reusable pipeline and queue.
- [completed] Phases 1–3: repository, SERP, evidence and entity research.
- [completed] Phase 4: resolve canonical unified cluster decision.
- [completed] Phase 5: create P0 briefs and claim ledger for evidence-ready pages only.
- [completed] Phase 6: implement only `READY_FOR_CODEX_DRAFT` P0 pages.
- [completed] Phase 7: run source-level technical SEO QA and rendered mobile checks.
- [completed] Phase 8: independent claim/cannibalization review.
- [completed] Phase 9: focused commit, push and protected Vercel preview.

Constraints: do not modify unrelated districts; do not merge or deploy production; HOLD blocked topics and continue.

## Ubud autonomous cluster — 2026-07-23

Goal: run the evidence-gated district pipeline for Ubud from the merged production baseline, preserving every existing route until repository, GSC and cannibalization evidence support a change.

Discovery note: the clean branch starts at production merge `d79aaba`. The repository already exposes eleven Ubud editorial URLs plus a route page and many place entities. The current OS registry has one active Ubud intent owner (`/ubud/best-cafes-coffee`) and an explicit monthly HOLD because the available GSC window is immature. Existing `/ubud-one-day`, `/ubud/itinerary`, `/ubud/things-to-do`, `/ubud-culture-rice-terraces-waterfalls` and `/route/ubud-culture-day` require a cannibalization audit before any architecture or content decision.

- [completed] Phase 0: verify production baseline, branch, authority and queue state.
- [completed] Phase 1: inventory Ubud routes, canonicals, sitemap, registries and internal links.
- [completed] Phase 2: research current SERP and user-decision clusters.
- [completed] Phase 3: close evidence/entity records or mark dependencies HOLD.
- [completed] Phase 4: create the sole unified Ubud cluster decision.
- [completed] Phase 5: create briefs and claim ledger only for evidence-ready P0 pages.
- [completed] Phase 6: implement only `READY_FOR_CODEX_DRAFT` P0 work.
- [completed] Phase 7: technical SEO QA, full checks and mobile rendering.
- [completed] Phase 8: independent claim and cannibalization review.
- [completed] Phase 9: focused commit, push, draft PR and protected preview; no merge or production without new authority.

Constraints: no invented claims; no HOLD route; no automatic merge, redirect, retirement or production deployment.

## Ubud scenario-layer pilot pair — 2026-08-12

Context: an externally-built "48 scenarios → 20 intent owners → 8 day/evening
scenarios" analysis (`OtherBali_Ubud_48_to_Scenarios_Registry.xlsx` +
`_Architecture_and_Implementation_Plan.docx`, both dated 2026-08-12) proposed a
new decision-guide + scenario layer for Ubud, built without access to this
repository. Reconciled against `docs/seo/ubud/UBUD_UNIFIED_CLUSTER_DECISION_V1.md`:
most of its 20 proposed "standalone guide" P0_CREATEs sit on canonicals the
frozen decision already assigns to `P1_UPDATE` (e.g. work-friendly cafés vs.
`/ubud/best-cafes-coffee`), and one directly contradicts it (kid-friendly
dining vs. the decided `MERGE_INTO_EXISTING /ubud`). The proposed 8
scenario/day-plan pages are the one genuinely new layer with no existing owner.

Founder (Selena, via chat) explicitly scoped a one-pair pilot to validate the
"guide → scenario → place pages" connection on live code before reconciling
the other 19 intent owners, rather than a full Phase 4 re-decision up front.

- [completed] Extend `/ubud/best-cafes-coffee` with a "Laptop-friendly"
  module — additive `extraSection` on `UbudGuide` (lib/ubud-guides.ts),
  rendered by `components/UbudGuideView.tsx`, filtered on the venue's own
  `jobs` tag (`quiet_work_cafe`, real data already set by the 0024 editorial
  pass — nothing invented; no wifi/socket/call-suitability claim, since none
  of those specific facts are on the venue record). `venueHasJob`/`hasTag`
  added to `lib/ubud.ts`, mirroring `lib/canggu.ts`.
- [completed] Build `/route/ubud-remote-work-day` as a `route` entity (same
  URL shape as `/route/ubud-culture-day`, not a new `/ubud/plans/*`
  namespace) — migration `0067_ubud_remote_work_day_route.sql` + offline
  mirror in `lib/seed.ts`. Three stops, all real, already-published,
  `quiet_work_cafe`-tagged Ubud venues (seniman-coffee-studio,
  anomali-coffee-ubud, bali-buda-ubud). No fabricated hourly schedule,
  wifi/socket claims, or call-suitability claims.
- [completed] Reciprocal internal link both ways: the guide module links to
  the route; `lib/pillars.ts`'s Ubud children (rendered on `/ubud` via
  `RelatedGuides`) gained the route.
- [completed] Checks: `npm run typecheck`, `npm run lint`,
  `scripts/ubud-p0-boundary.test.mjs`, `scripts/plan-route-hierarchy.test.mjs`,
  `scripts/internal-links.test.mjs`, `npm run test:seo-os`, `npm run build` —
  all pass. Route rendering itself cannot be smoke-tested in this sandbox (no
  Supabase credentials here — seed mode 404s the route exactly like
  `ubud-culture-day` already does locally); it resolves against the real,
  already-published venues once deployed with live Supabase, same as every
  other non-Canggu route in this repo.
- [not_started] Reconcile the remaining 19 intent owners / 7 scenarios into a
  v2 unified cluster decision — deferred pending founder direction on scope
  (see chat: Variant A offered, not yet chosen).

Constraints: did not touch `app/ubud/page.tsx` (frozen `P0_UPDATE`, approved
claim ledger only, per boundary test `scripts/ubud-p0-boundary.test.mjs`); did
not touch any other district; no page-registry/intent-registry entry added
for the new route (matches how other undeployed routes in this repo are
tracked — sitemap/registry population happens at the next OS snapshot); no
production deployment or migration apply — migration 0067 ships in this PR
unapplied, same status as the rest of the Ubud pipeline (preview_ready,
production not_started).
