# Session 4 handoff

- Branch: `loop/04-admin-integration`
- Frozen baseline SHA: `1d77f1e`
- Environment metadata SHA: `51ab700`
- Integrated implementation SHA: `51a5a49`
- Final release-handoff commit: branch `HEAD`
- Status: integrated — ready for release review

## Admin and security audit

- `/admin` is protected at the application edge by HTTP Basic authentication
  when `ADMIN_ACCESS_TOKEN` is configured. In production an absent token makes
  admin routes return 404. This is a small founder/operator control, not user-
  level admin identity or an audit-grade authorization system.
- Partner onboarding uses long unguessable URL tokens and SECURITY DEFINER RPCs.
  There is no partner account/role model. The token proves possession of the
  invitation link, not strong personal identity; links can be forwarded.
- Existing onboarding RPCs whitelist confirmation/JTBD/photo facts. Session 1
  adds factual-only menu/action draft RPCs and forces `editorial_pick=false` and
  `editorial_note=null` on partner item writes.
- Direct draft/review reads and publish/archive writes are unavailable to the
  anonymous Supabase client. Admin maintenance therefore needs a server-only
  service-role key in addition to the application-level admin gate; it must fail
  closed when either admin protection or server credentials are absent.
- Current photo upload publishes a URL through a token RPC. Session 1 tightens
  this with versioned consent evidence; pre-existing photos still require an
  operator consent audit.
- Current venue publication is evidence-backed for Uluwatu and legacy decision-
  ready elsewhere. Menu/action publication adds independent source, verified-at,
  freshness, non-empty/confirmed and publishable-parent gates.

## Smallest safe workflow (recorded before coding)

1. A partner holding a venue onboarding link may submit factual menu/action
   drafts only. The UI explicitly states that the link is private but is not a
   personal login, and that submission does not publish content.
2. Partner RPC signatures never accept Other Bali editorial fields. Existing
   published menus remain untouched while a replacement is in draft/review.
3. The operator uses the Basic-protected admin queue. Server-side service-role
   access lists drafts, stale/expiring content, invalid URLs, missing evidence,
   empty menus, unconfirmed actions, venue publication blockers and missing
   verified Maps handoffs.
4. Operator publish/archive mutations are server actions, require the admin
   route gate plus server-only credentials, revalidate inputs, and call the
   reviewed publish RPC or narrow status updates. No service key reaches the
   browser.
5. Data Ops arrives only as JSON/SQL candidates in draft/review. A dry-run
   validator reports row-level blockers and counts; it never imports or applies
   production SQL. Fixture/example domains are always blocked from publication.
6. Stale content is suppressed/archived according to architecture and remains
   auditable. It is never silently deleted.

## Verification evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Focused tests | Pass (69/69) | Schema/Data Ops 8; event safety/storage/analytics 17; resolver/domain/freshness 44. |
| Lint | Pass | `npm run lint` after all merges and vertical wiring. |
| Build | Pass | `npm run build`; Next.js 16.2.9, TypeScript pass, 27/27 static pages, `/admin/freshness` dynamic route. Google Fonts required network access. |
| Browser QA | Pass with live-data limits | Chrome: 320/375 mobile and 1440 desktop; no horizontal overflow; action panel + 2×46px sticky actions; desktop sticky hidden; structured fixture menu source/freshness/allergen copy; review page noindex; admin queue noindex/fail-closed/no key in HTML; no console errors. |

## Integration readiness review

- Session 1: handoff `6a70108`, implementation `8b00cfe`; green. Diff is
  confined to its declared schema/domain/repository/test ownership. Exactly one
  additive migration (`0026_menu_action_foundation.sql`) is present; no UI,
  provider, admin or legacy `lib/data.ts` files changed. Focused tests, lint and
  build are recorded pass. Expected conflict: Session 4 consumes its RPC/table
  names but has no overlapping implementation file.
- Session 2: handoff `8798fc3`, implementation `eba6775`; green. Diff is
  confined to place page, structured-menu components, narrow global styles and
  its handoff. No migrations, repositories, provider adapters or admin files
  changed. TypeScript, lint, build and browser widths are recorded pass.
  Expected conflicts after Session 3: `app/places/[slug]/page.tsx` integration
  wiring and possibly action-adjacent CSS; resolve through the frozen props,
  never whole-file replacement.
- Session 3: handoff `a1dec6d`, implementation `a5d39b8`; green and integrated.
  Its only merge conflict was `STATUS_BOARD.md`, resolved field-by-field.

## Integration record

- Session 1 merged as `10efe86`; focused tests/lint/build passed.
- Session 3 merged as `9824d93`; resolver 34/34, events 17/17, lint/build passed.
- Session 2 merged as `575f671`; integrated suite/lint/build passed.
- Vertical wiring `51a5a49` connects Session 1 repositories to Session 2 menu
  UI and Session 3 frozen-props action gateway. Both legacy TablePilot/mobile
  paths and raw WhatsApp/Maps actions were removed. Review venues receive no
  action fallbacks. The verified-booking compatibility CTA remains pending the
  documented data backfill.

## Independent scope delivered

- Read-only operator freshness/publication queue with blocker/warning/info
  ordering and explicit missing service-credential/migration states.
- Server-only reviewed menu publish, capability confirm and menu/action archive
  actions. Mutations fail closed unless both `ADMIN_ACCESS_TOKEN` and
  `SUPABASE_SERVICE_ROLE_KEY` exist; UUIDs and publication evidence are checked.
- Partner onboarding factual menu/action draft submission. The private URL is
  disclosed as an invitation rather than personal authentication. No editorial
  fields are accepted and live content remains unchanged until review.
- `validate-menus.mjs` and `validate-capabilities.mjs` dry-run paths for future
  Data Ops handoff. They reject public status, example URLs, incomplete evidence
  and editorial-field injection; they never import or apply SQL.

## Current commits

- `83c5680` — freshness workflow/model and dry-run validators
- `7b29964` — operator freshness queue
- `1edbfae` — reviewed publish/confirm/archive controls
- `abb641a` — partner factual draft submission
- `eff7ae0` — explicit evidence-review step
- `10efe86` — Session 1 merge
- `9824d93` — Session 3 merge
- `575f671` — Session 2 merge
- `51a5a49` — final vertical wiring

## Environment and known limitations

- `SUPABASE_SERVICE_ROLE_KEY` is newly required for operator queue/mutations and
  must be server-only. `ADMIN_ACCESS_TOKEN` remains required for production
  admin access and is also required by mutation code.
- Session 1 migration has not been applied to any database by Session 4.
- Repository paths contain a literal backslash, which breaks Node ESM/package
  tooling. Tests/lint/build use `/private/tmp/otherbali-session4-safe`; no source
  result is inferred from a failed direct-path command.
- Data Ops denominator remains 207 repository-canonical F&B; the 208 production
  candidate requires separately reviewed live SQL. No research data was imported.
- Browser QA used contract fixtures and a temporary action harness for fresh
  menu/provider states because no live Supabase credentials/migration were
  applied. Live RLS, mutation, stale-row and real-provider smoke tests remain
  explicit post-migration steps.

## Production apply checklist

1. Review environment migration state and apply pending baseline files in order.
2. Apply only `0026_menu_action_foundation.sql` for this loop; smoke-test anon
   fresh reads and draft/stale suppression before enabling admin maintenance.
3. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `ADMIN_ACCESS_TOKEN`, server-only `SUPABASE_SERVICE_ROLE_KEY`, existing
   `TABLEPILOT_PARTNER_TOKEN`, and optional `NEXT_PUBLIC_TABLEPILOT_URL`.
4. Audit old photos for owner-consent evidence. New photos require consent RPC.
5. Run `node scripts/validate-menus.mjs <candidate.json>` and
   `node scripts/validate-capabilities.mjs <candidate.json>` before future Data
   Ops imports. Do not change candidates from draft/review during import.
