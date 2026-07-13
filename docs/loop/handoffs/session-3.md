# Session 3 handoff

- Branch: `loop/03-action-gateway`
- Frozen baseline SHA: `1d77f1e`
- Environment metadata SHA: `51ab700`
- Final implementation SHA: `a5d39b8`
- Status: ready for integration

## Scope delivered

- Added a pure capability resolver that fails closed on wrong-venue, draft,
  review, disabled, archived, unverified, future-dated, expired, malformed and
  provider-incompatible records. It applies deterministic priority and keeps
  Maps separate from the primary decision action.
- Added central adapters for TablePilot, Google Maps, WhatsApp, official/direct
  links, GrabFood, GoFood, ShopeeFood and supported booking providers.
- Added the frozen-props `VenueActionBar` path plus a reusable full action panel
  and a two-action mobile sticky surface. The old prop shape remains only as a
  narrow compilation bridge until Session 4 replaces both legacy page paths.
- Added runtime-safe action event parsing, typed Session 1 `log_event_v2`
  compatibility and action analytics. Existing events go directly to legacy
  `log_event`; only the six additive events go to v2 with `p_source: null`.
- Corrected the legacy WhatsApp reserve path so it emits growth
  `booking_click`, not partner-proof `reservation_click`. TablePilot remains the
  only producer of the internal partner-proof reservation intent.

## Owned-file diff

- `lib/actions/*` — resolver, public result types, event safety/storage adapters
  and 51 focused resolver/event assertions.
- `lib/integrations/*` — TablePilot, Google Maps, WhatsApp and external-provider
  validation/builders.
- `components/actions/VenueActionPanel.tsx` — full action hierarchy and mobile
  sticky UI.
- `components/VenueActionBar.tsx`, `components/ReserveButton.tsx` — frozen
  contract consumer and safe legacy bridge.
- `app/api/event/route.ts`, `lib/analytics.ts` — runtime-safe event intake and
  client attribution mapping.
- `docs/loop/handoffs/session-3.md`, `docs/loop/STATUS_BOARD.md` and
  `docs/loop/requests/session-3-verified-booking-capability-backfill.md` —
  integration record and open data-owned backfill request.

No migration, `lib/data.ts`, public place-page layout, admin or onboarding file
was changed.

## Audit decisions and architecture compliance

### Resolution priority

1. Only a capability for the requested venue with `status === "confirmed"`,
   complete evidence, a valid `verifiedAt`, a non-expired `expiresAt` and a
   provider-valid HTTPS handoff can resolve.
2. Lower numeric `priority` wins. Ties are deterministic by action-kind rank and
   capability id; input array order is never a hidden priority.
3. The primary action is the first verified decision/fulfilment handoff
   (`reserve`, `delivery`, `takeaway`, `preorder`). Website and WhatsApp are
   alternatives unless no decision action exists. Google Maps stays available as
   the navigation handoff and is not allowed to displace a verified commerce
   action merely because it has a low priority value.
4. Legacy fallbacks resolve only after verified capability records and receive
   explicit fallback priorities. No empty or invalid fallback becomes a button.

### Coverage and commercial policy

- TablePilot resolves only when `coverageMode === "active_deep"`. A stray
  `tablepilotSlug` or TablePilot capability in `next_deep`/`planning_only` fails
  closed.
- Verified official booking links may resolve outside active-deep as external,
  non-partner handoffs. They emit `booking_click`, never TablePilot's
  `reservation_click`.
- Delivery, takeaway and preorder remain provider/venue requests or handoffs.
  The UI does not claim confirmation, stock, service area, fee or ETA.
- Google Maps remains external navigation. Other Bali does not replace it with
  an internal map or directions model.

### Provider and domain validation

- Every external URL must parse as HTTPS, contain no credentials and match the
  provider/action policy. Unknown providers fail closed.
- TablePilot links are rebuilt by one adapter from the actual TablePilot slug and
  configured TablePilot origin. The fixed allowlisted query
  `source=bali_privilege` is always set; `acquisitionSource` never replaces it.
- Google Maps accepts only the canonical `maps.google.com`, Google `/maps`,
  `maps.app.goo.gl` and legacy `goo.gl/maps` forms, not lookalike or arbitrary
  `google.<tld>` domains.
- WhatsApp accepts a bounded international digit string and builds an encoded
  `wa.me` link. Phone numbers and prefilled message bodies are never analytics
  payload fields.
- GrabFood, GoFood and ShopeeFood accept only their approved host families.
- Direct/official venue links require evidence or the verified official website
  host to match. Provider display labels are canonical and do not imply Other
  Bali fulfilment.

### Disclosure and fallback behaviour

- Canonical action labels are used (`Reserve`, `Delivery`, `Takeaway`,
  `Request pre-order`, `Website`, `WhatsApp`, `Open in Google Maps`).
- Each action exposes a provider disclosure such as “Booking handled by
  TablePilot”, “Continue with GrabFood” or “Opens Google Maps”.
- `confirmationRequired` renders a neutral note that confirmation happens with
  the provider after handoff. It never states that a request is already sent or
  confirmed.
- Desktop/panel UI may list verified alternatives. The sticky mobile surface is
  deliberately limited to one primary action plus Maps so 320px layouts do not
  clip.

### Session 1 contract expected by Session 3

- `getPublishedActionCapabilities(venueSlug)` returns only parent-publishable,
  fresh records mapped to `VenueActionCapabilityRecord`.
- Current verified `tablepilot_slug`, venue WhatsApp, official website/menu and
  `gmaps_url` values are exposed through `VenueActionFallbacks` or derived
  capabilities without changing their meaning.
- Existing verified `booking_url` values (including Uluwatu) must be normalized
  into confirmed `reserve` capabilities because the frozen fallback type has no
  booking URL field.
- Session 1's `log_event_v2` RPC accepts the safe action payload separately from
  acquisition `source`. Session 3 matches migration 0026's exact five-argument
  signature and sends `p_source: null`; client input can never set it.
- The six additive events use v2. Every pre-existing event, including
  TablePilot `reservation_click`, goes directly to legacy `log_event` so the v2
  allowlist cannot silently discard the established funnel.

## Verification evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Focused tests | Pass (51/51) | Resolver/provider suite 34/34; event safety/storage/analytics suite 17/17. |
| TypeScript | Pass | `tsc --noEmit`. |
| Lint | Pass | `npm run lint`. |
| Build | Pass | Next.js 16.2.9 production build; TypeScript and 27/27 static pages completed. |
| Browser QA | Deferred to integration | The frozen-props slot is not rendered by the baseline place page and Session 3 is forbidden to edit that page. Session 4 must smoke-test the merged slot at 320px, 375px and desktop widths. |

## Migrations, environment and founder steps

- No migration was created or edited on this branch.
- `NEXT_PUBLIC_TABLEPILOT_URL` remains the optional TablePilot origin override.
- The repository path contains a literal backslash. A normal `npm ci` fails in
  the third-party `unrs-resolver` postinstall because Node rejects its encoded
  file URL. Full verification ran from the path-safe mirror
  `/private/tmp/otherbali-session-3-qa2`; the source mirrored there was identical
  to this branch. The build's multiple-lockfile root warning was non-failing.
- Apply Session 1 migration `0026_menu_action_foundation.sql` before expecting
  provider/action payload persistence. When v2 is genuinely absent, Session 3
  falls back to legacy event storage and intentionally drops only the payload.

## Contract requests and integration notes

- No frozen-contract edit was made or requested.
- Merge Session 1 implementation `8b00cfe`, then Session 3 implementation
  `a5d39b8`, then Session 2, as required by the loop merge gate.
- Load `actionCapabilities` through Session 1's
  `getPublicVenueDetailExtension(venueSlug)` and pass the exact frozen
  `VenueActionBarProps`: venue identity, district coverage mode, those
  capabilities and only publishable legacy fallbacks.
- Replace both venue-page action paths — the desktop `ReserveButton` / raw
  booking link and the old mobile `VenueActionBar` call — with the same new
  frozen-props `VenueActionBar`. Replacing only one leaves a raw-link policy and
  analytics bypass. The new component renders both the full panel and its
  mobile sticky surface.
- Do not pass raw fallbacks for a review/unpublished parent. Session 1's public
  repository already suppresses its capabilities, but parent publication is
  not a field in `VenueActionBarProps`.
- Resolve
  `docs/loop/requests/session-3-verified-booking-capability-backfill.md` before
  removing the remaining legacy `booking_url` CTA. The frozen fallback has no
  booking URL field, and Session 4 must not synthesize unverified capability
  evidence.
- After integration, smoke-test: TablePilot in `active_deep`; official booking
  in planning coverage; expired/no-action venues; provider disclosure;
  confirmation copy; Maps; and 320px/375px sticky truncation.

## Known limitations / blockers

- The legacy `log_event` RPC cannot persist the safe payload. Until Session 1's
  migration is merged and applied, compatible fallback logging preserves event
  type and venue only and intentionally drops provider/action metadata.
- Public parent-venue publication is not representable in the frozen action-bar
  props; Session 1 must suppress unpublished capability reads and Session 4 must
  avoid passing raw fallbacks for unpublished/review venues.
- Verified legacy `booking_url` rows are not backfilled by Session 1 migration
  0026. The open cross-session request records the data-owned fix; this does not
  block merging Session 3 but does block deleting that one compatibility CTA.
- Browser QA of the new frozen-props UI is an integration responsibility because
  editing the place-page slot is outside Session 3 ownership.
