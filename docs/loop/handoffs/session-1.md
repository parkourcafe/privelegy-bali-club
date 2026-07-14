# Session 1 handoff

- Branch: `loop/01-data-foundation`
- Frozen baseline SHA: `1d77f1e`
- Final implementation SHA: `8b00cfe`
- Status: ready for integration

## Discovery findings (before schema changes)

- Worktree is clean on the required branch; environment-only parent commit is
  `51ab700` and the frozen implementation baseline is `1d77f1e`.
- Highest baseline migration is `0025_ubud_wellness_discovery.sql`; production
  notes still identify migrations 0013, 0018, 0019 and 0025 as founder/pending
  apply steps depending on environment.
- Public venue data is stored in `venues`; legacy action sources are
  `tablepilot_slug`, `whatsapp`, `official_url`, `booking_url`, and `gmaps_url`.
  There is no structured menu store and no official-menu-specific column.
- `events` is default-deny under RLS and written through SECURITY DEFINER RPCs.
  Acquisition attribution is in `events.source`; migration 0009 added `meta
  jsonb`. The loop contract requires a new nullable `payload jsonb`, so the
  existing fields must remain untouched.
- Partner onboarding uses an unguessable `venue_onboard_tokens` token and
  SECURITY DEFINER RPCs. There is no partner user/role table. Direct writes to
  the new tables must remain denied; token RPCs need a strict factual-column
  whitelist, while editorial columns need a separate admin/service-role path.
- Existing `set_venue_photo` writes `venues.photo_url` after token validation
  but does not persist versioned owner consent. This conflicts with the v2
  architecture addendum; the new migration must add consent evidence and make
  publication conditional on it without breaking existing stored photos.
- `venue_fact_sources` is internal/default-deny and can support provenance, but
  the four approved concepts need their own source URL/label, captured-at and
  verified-at fields to satisfy the frozen public contract directly.
- Current public venue policies are broad (`using (true)`). The new menu/action
  policies must independently require a publishable parent, evidence,
  verification and freshness.

## Scope delivered

- Added the four approved stores: `menus`, `menu_sections`, `menu_items`, and
  `venue_action_capabilities`, plus versioned media-consent evidence required
  by the v2 addendum.
- Added evidence, publication lifecycle, freshness, ordering, URL, price,
  currency and referential checks; all new tables have RLS.
- Added safe `events.payload` and backwards-compatible `log_event_v2`; the
  original `events.source`, `events.meta`, and `log_event` remain unchanged.
- Added partner-token draft RPCs with factual-only signatures and hard reset of
  `editorial_pick=false` / `editorial_note=null`; publishing/editorial mutation
  remains service-role/admin-only.
- Added atomic reviewed-menu publishing, owner-media consent capture, and a
  consent gate on the existing two-argument photo RPC.
- Added evidence-backed, idempotent TablePilot, WhatsApp and Google Maps
  capability backfills. TablePilot is constrained to monetized `active_deep`
  coverage. No menu items are invented.
- Added camelCase domain mapping and the frozen public repository functions:
  `getPublishedMenu`, `getPublishedActionCapabilities`, and
  `getPublicVenueDetailExtension`.
- Added focused behavioural and schema-policy tests.

## Owned-file diff

- `supabase/migrations/0026_menu_action_foundation.sql`
- `lib/types.ts` (contract type re-exports only)
- `lib/domain/menu.ts`
- `lib/domain/actions.ts`
- `lib/data/menu-repository.ts`
- `lib/data/action-repository.ts`
- `lib/data/public-venue-detail.ts`
- `scripts/menu-action-foundation.test.ts`
- `scripts/menu-action-schema.test.mjs`
- `docs/loop/handoffs/session-1.md`

No UI, admin, provider-adapter, public page, root architecture, or legacy
`lib/data.ts` files were changed.

## Decisions and architecture compliance

- Public RLS requires active/published parent venue, verified evidence and a
  non-expired record. Repository mapping repeats freshness and HTTPS checks so
  malformed data fails closed even if fetched through a privileged client.
- Repositories return `null`/`[]` on absence, configuration lag or query error.
- Sorting is deterministic by position/priority and stable tie-breakers.
- Partner writes never accept editorial fields. Editorial publishing uses a
  separate service-role-only function.
- `source` continues to mean acquisition. Provider/action values are restricted
  to the four-key safe JSON payload and bounded lengths; no arbitrary JSON or
  PII fields pass `log_event_v2`.
- Existing official menu URLs remain presentation fallbacks (for example the
  current Uluwatu `menuUrl` content); this session does not manufacture a
  structured menu from a URL.

## Verification evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Focused tests | Pass (9/9) | `node --test scripts/menu-action-schema.test.mjs`; `node --import tsx --test scripts/menu-action-foundation.test.ts` in a temporary path-safe mirror. |
| Lint | Pass | `npm run lint` |
| Build | Pass | `npm run build`; Next.js 16.2.9 production build, 27/27 static pages. Network access was required for Google Fonts. |
| TypeScript | Pass | Build TypeScript phase completed. |
| Browser QA | Not applicable | Session 1 owns no UI. |

## Migrations, environment and founder steps

Apply exactly:

1. Apply any environment-pending baseline migrations through
   `0025_ubud_wellness_discovery.sql` in repository order.
2. Apply `supabase/migrations/0026_menu_action_foundation.sql` once using the
   normal Supabase production migration workflow.
3. Confirm the migration transaction succeeds, then smoke-query published
   menu/action reads as `anon` and confirm draft/expired rows are absent.
4. Before a newly uploaded owner photo can be assigned, call
   `record_venue_media_consent`, then the existing `set_venue_photo` RPC.

No new environment variables are required. The migration was not applied to a
live database by Session 1.

## Contract requests and integration notes

- No frozen-contract changes requested from Sessions 2–4.
- Session 2 can import the three public functions directly from `lib/data/*`.
  Its legacy official `menuUrl` should remain a fallback when structured menu
  is `null`.
- Session 3 should send only `SafeActionEventPayload` fields to `log_event_v2`
  and must retain the separate acquisition source parameter.
- Session 4 should expose the consent-capture step before partner photo
  publication and include stale/empty/unconfirmed records in admin queues.
- Integration commit order remains Session 1, Session 3, Session 2.

## Known limitations / blockers

- The SQL migration has focused static policy tests but was not executed against
  a local/live Supabase instance because none is configured in this worktree.
- Existing photos are retained for backward compatibility and require a Data
  Ops consent audit; this migration does not invent consent evidence.
- The repository path contains a literal backslash, which breaks Node package
  postinstall and TypeScript path discovery. Dependencies were installed with
  `--ignore-scripts`; verification ran from a temporary path-safe mirror.
