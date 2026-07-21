# Other Bali Wave 1 Gap Analysis — 2026-07-21

- **Repository:** `parkourcafe/privelegy-bali-club`
- **Baseline:** `ad02cb9ace32bec89a2e8fcb10266ff384dc46ab`
- **Branch:** `codex/otherbali-wave1-t1-t2-t3-t9-2026-07-21`
- **Scope:** T1, T2, T3, T9 only
- **Method:** repository-first, read-only discovery before implementation

## Verdict

| Task | Before | Repository evidence | Confirmed gap | Required action |
|---|---|---|---|---|
| T1 — home | Partial | `app/page.tsx:92-120,147-196,394-496`; `components/landing/DayIntentBuilder.tsx:99-109`; `components/SiteFooter.tsx:108-119` | Promise and day builder exist, but the six required scenarios are not the primary shortcuts; the planning/while-here/venue entry model is not explicit; commercial proof content competes with traveller decisions during the monetization freeze | Reuse existing routes and builder; expose the six required shortcuts in the hero; add two primary traveller entrances plus one subdued venue entrance; remove frozen paid-arrival claims from the home surface |
| T2 — Save | Partial/fragile | `components/SaveButton.tsx:17-72`; `app/api/save/route.ts:8-40`; `lib/data.ts:1196-1234`; migrations `0019`, `0031` | Anonymous GuestRef save exists, but POST is a non-idempotent toggle, input/published validation is incomplete, failures can look like an unsave, Save is absent from plan/route cards, and save/share analytics/tests are missing | Preserve GuestRef; add idempotent desired-state operations, validation, honest feedback, card access, analytics, and focused tests |
| T3 — venue completeness | Partial | `lib/data.ts:85-114,172-206`; `app/places/[slug]/page.tsx:480-529,643-767`; `components/VenueCard.tsx:74-125` | DB `last_verified_at`, `price_anchor`, and `practical_tags` are mapped but incompletely rendered; Practical can be empty; `what_to_order` lacks menu/source evidence gating; venue cards omit verification | Render existing confirmed fallbacks, condition the Practical section, expose structured tags and verification, gate `what_to_order` on verified structured/official menu evidence, add formatter/renderer tests |
| T9 — Add to trip | Missing | `lib/types.ts:85-98`; `app/PlanView.tsx:26-61`; `app/me/page.tsx:40-70`; migration `0019`; `app/plan/shared/page.tsx:50-109` | Editorial PlanEntry/RouteStop and flat SavedPlace exist, but no personal day, rank, move/reorder/delete editor, trip-aware share, or Add-to-trip action exists | Extend SavedPlace/SharedList additively; keep editorial plan/routes read-only; add controlled RPC/API operations, day/order UI, read-only shared trip, Maps handoff, and tests |

## T1 facts and interpretation

### Facts

- The canonical promise is present at `app/page.tsx:154`.
- The hero contains planning and catalogue CTAs plus the existing DayIntentBuilder at `app/page.tsx:167-196`.
- The builder's primary quick starts are only Slow morning, Beach day, Food crawl, and Date night at `components/landing/DayIntentBuilder.tsx:104-109`.
- Existing published routes already cover the required shortcuts: `/first-time-in-bali`, `/where-to-watch-sunset-in-bali`, `/bali-with-kids`, `/bali-rainy-day`, `/romantic-bali`, and `/how-many-days-in-bali`.
- The partner entrance exists only in the shared footer at `components/SiteFooter.tsx:108-119`.
- The home includes repeated per-arrival payment claims at `app/page.tsx:184-185,498-575,855-860`, while the principal's freeze through 2026-09-21 is recorded at `OTHERBALI_REPOSITORY_REALITY_MAP_2026-07-21.md:333-354`.

### Interpretation

The home does not need a new catalogue or recommendation engine. It needs an entrance hierarchy using existing routes. Commercial proof is disproportionately prominent for the current traveller-first/free-pilot state and must not compete with the tourist CTA.

## T2 facts and risks

- Proxy/GuestRef uses an httpOnly, SameSite=Lax, one-year cookie; no localStorage identity is introduced.
- `SaveButton` hydrates with GET and optimistically posts a toggle. The route/data layer can return a false-looking state on persistence failure.
- `saved_places` is keyed by `(guest_ref_id, venue_slug)`, but the slug has no venue FK and the legacy toggle accepts arbitrary non-empty values.
- `/me` reopens only currently published venues and accurately warns that clearing the cookie resets anonymous state.
- Tourist login does not exist. Partner Supabase Auth must not be repurposed; guest-to-login merge is therefore not an implementation requirement in this wave.
- `/plan/shared` is a coarse mobile starting-point URL and must not be reused as a detailed personal itinerary.
- Mobile saves are device-local Capacitor Preferences. They are preserved in Wave 1; cross-native/web identity is a documented deferred decision.

## T3 facts and boundary

- Canonical venue data retains `practical_tags`, not a prose `practical_note`. No new field/entity will be invented.
- `why_its_here`, `best_for`, and `not_for` already render conditionally.
- `what_to_order` can be shown only when a current structured menu or a verified official menu source exists.
- Price anchors remain source text/ranges; Wave 1 must not synthesize exact prices.
- Structured menu numeric formatting must fail safely for unsupported currencies rather than expose raw minor units.

## T9 architecture decision

Reuse the existing `SavedPlace` relationship. Add nullable trip day/order metadata and controlled idempotent mutations. Extend `SharedList` compatibly so old slug-only links continue to work while new snapshots retain day/order. Do not create a booking engine, generic itinerary domain, tourist account, or writable editorial `plan_entries`/`route_stops`.

## Acceptance matrix

| Scenario | Required result |
|---|---|
| Home entrances | planning-before-trip and while-in-Bali actions are primary; venue action is visually secondary |
| Six scenarios | exact required labels resolve to existing published routes |
| Save | idempotent add/remove, validated published venue, honest loading/success/error feedback, same GuestRef survives reload |
| Trip | choose day, add once, move day, reorder with accessible controls, delete, reload persistence |
| Share | read-only snapshot preserves day/order and provides Maps links |
| Venue detail | existing verified date, price anchor, practical tags and menu-backed order guidance render without empty sections |
| Unknown data | headings/placeholders are suppressed; no invented practical note, price, menu or booking claim |
| Security | service-role mutations stay server-side; no direct table write; invalid/unpublished slug rejected |
| Compatibility | editorial `/plan` and `/route/[slug]`, old shared lists, mobile shell, publication/indexability and action handoffs remain intact |
| Verification | focused tests, full suite, lint, typecheck, production build, mobile/responsive and accessibility smoke pass |

## Deferred

- Tourist account/login and cross-device restore.
- Native/web saved-state bridge.
- T4 QuickDecision, T5 shortlist, T6 venue page, T7 hygiene, T8 Canggu Now, T10 editorial routes.
- Any paid placement, billing, sponsored inventory, Open Now, or booking fulfilment.
