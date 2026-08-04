# Other Bali Competitive Addendum — Open Conflicts

Date: 2026-07-24  
Scope: Gate 0 / T0 diagnostics only  
Repository baseline: `origin/main` at `291414c`  
No product, schema, navigation, URL, ranking, publication or commercial implementation was made.

## Authority inventory

Present in the repository:

- `AGENTS.md`, version `3.1-aligned`;
- `Other_Bali_Master_Architecture.md`, **V3.1 CORRECTED**;
- `docs/money-model.md`, canonical decision dated 2026-07-06;
- `OTHERBALI_REPOSITORY_REALITY_MAP_2026-07-21.md`;
- `OTHERBALI_T0_INDEXABILITY_DIAGNOSIS.md`;
- `OTHERBALI_T0_VERIFICATION_REPORT.md`;
- Wave 1–3 discovery/verification reports;
- `OTHERBALI_PHASE1_RELEASE_BLOCKERS_REPORT_2026-07-22.md`;
- applied migration files through `0060_ubud_verified_restaurant_cards.sql`.

Not present under the canonical names cited by the addendum:

- Canonical Decision Log;
- Unified Master v3.2;
- approved Data Dictionary;
- approved Taxonomy v1;
- approved Current-to-Target Migration Map;
- Public Experience Architecture v1.1;
- one standalone Launch Stabilization plan containing the complete accepted requirement set.

`docs/visual-redesign-pilot-handoff.md` independently records that the Public Experience Architecture and Data Dictionary / Taxonomy / Migration Map were missing from the repository at the time of the visual pilot.

## C-01 — Addendum authority points to unavailable V3.2

```text
CANON_CONFLICT
Requires explicit Decision Log amendment
Do not implement automatically
```

The repository operating contract and Master declare V3.1 CORRECTED authoritative. The addendum and the user-supplied authority order declare Unified Master v3.2 above the addendum. No V3.2 document or Decision Log amendment is present, so target fields, terminology and public IA cannot be inferred safely.

Required resolution: add the approved V3.2 and Decision Log to the repository, or explicitly confirm V3.1 CORRECTED remains the active target for the next implementation gate.

## C-02 — Data Dictionary / Taxonomy / Migration Map are missing

```text
CANON_CONFLICT
Requires explicit Decision Log amendment
Do not implement automatically
```

The Master itself says these documents are required before structural implementation. Existing implementation uses legacy entities (`venues`, `districts`, `perks`, `plan_entries`, `saved_places`) while the target model uses Place, Area, Offer, Route, Trip, MediaAsset, Source and Verification.

Impact: no new tables, duplicate fields, entity renames or schema migrations should be approved from the addendum alone.

## C-03 — Public Experience Architecture v1.1 is missing

```text
CANON_CONFLICT
Requires explicit Decision Log amendment
Do not implement automatically
```

The addendum depends on PEA for the money model, navigation and page-order decisions. Repository documents indirectly quote parts of it but are not a substitute for the approved source.

## C-04 — `/my-bali` is requested but does not exist

Observed in local and production browsers:

- `/my-bali` → 404, `noindex`;
- `/me` → current Saved/My list carrier, `noindex, nofollow`;
- homepage and `/plan` link to `/me`.

Master V3.1 target URL model lists `/my-bali`, but its live-preservation rules forbid automatic renaming/redirects. Addendum primary navigation says `Saved`, while Master V3.1 says `My Bali`.

```text
CANON_CONFLICT
Requires explicit Decision Log amendment
Do not implement automatically
```

Required resolution: a preservation decision for KEEP `/me`, redirect `/my-bali`, or migrate canonical ownership. No redirect was created.

## C-05 — Today carrier and result contract disagree

Master target model contains `/today`, but live preservation says `/my-day` may redirect only after links/SEO/analytics review. Current site correctly keeps `/my-day`.

Current `/my-day` behavior:

- builds up to three cards per time slot, across multiple slots;
- uses `getCollectionSampleInArea`;
- explicitly widens to island-wide results when an area has insufficient results.

The addendum requires exactly three primary roles and prohibits hidden cross-district filling.

This is an implementation gap, not permission to create `/today` or a second engine. The existing `/my-day` carrier must be modified only after role/ranking rules and URL preservation are approved.

## C-06 — Primary navigation terminology differs

- Addendum: `Today / Explore / Plan / Saved`.
- Master V3.1: `Today / Explore / Plan / My Bali`.
- Current desktop header: `Search / Saved / Plan`.
- Current footer exposes more directory-style links.

```text
CANON_CONFLICT
Requires explicit Decision Log amendment
Do not implement automatically
```

No primary navigation change was made.

## C-07 — Money model copy and legacy sponsored contract

Live `/for-venues` and `VenueSubmissionForm` state:

- “2 months free”;
- “Your first 2 months are a free test — no fees”.

This implies a paid listing/product may begin after the trial, while the canonical `docs/money-model.md` permits only a fixed fee per confirmed seated reservation. The database and public TypeScript contract also retain `venues.is_sponsored`; `PlaceCard` can render a `Sponsored` label even though V3.1 says sponsored placement is disabled and out of scope.

```text
MONEY_MODEL_CONFLICT
No commercial copy changed
Decision Log amendment required
```

Required resolution:

1. confirm the sole paid product remains the seated-reservation fee;
2. approve removal/deprecation mapping for `is_sponsored` from public contracts and runtime;
3. replace trial/listing implications in a separately approved copy-only change.

## C-08 — Confirmed extras are not canonically complete

Legacy carriers exist:

- `perks`;
- `perk_offer_confirmations`;
- redemption routes/events;
- `publication_status`, `verified_at`, `expires_at`.

Missing or not canonically mapped:

- typed Offer entity mapping;
- explicit benefit/conditions split;
- start/end/blackout dates;
- redemption method;
- review date;
- source/owner field mapping;
- proof that organic ranking queries cannot consume offers.

Do not extend the legacy schema before Data Dictionary and Migration Map approval.

## C-09 — Issue reporting has no canonical carrier

No place-page “Something changed?” flow, issue table, issue categories, operational owner, retention rule, `issue_report_opened` or `issue_report_submitted` event was found. `/support` is generic and does not provide a venue-context issue contract.

Creating a table automatically would violate the user’s Gate 0 restrictions. A canonical owner and privacy/retention decision are required first.

## C-10 — Media provenance is only partial

Implemented:

- honest “Media pending” state;
- venue photo consent/submission pipeline;
- media upload intake.

Not implemented as a unified public contract:

- `media_status`;
- `media_provenance`;
- creator/original/venue-provided labels;
- canonical MediaAsset rights/read model;
- public short-video provenance.

The existing `photo_url` is explicitly provisional. A new public video or provenance badge requires the missing Data Dictionary/Migration Map.

## C-11 — Freshness semantics are incomplete

Implemented:

- `venues.last_verified_at`;
- action/menu evidence freshness;
- admin freshness queue;
- some visible “Verified <date>” labels.

Missing:

- what was checked;
- field-level verification source;
- consistent owner-confirmed state;
- approved public `Freshly checked` derivation.

Do not derive freshness from `updated_at` or page edits.

## C-12 — Event vocabulary differs from addendum

Existing examples:

- `shortlist_generated`;
- `venue_detail_view`;
- `direction_click`;
- `booking_click`;
- `reservation_click`;
- `save`;
- `route_add`;
- `venue_submission_started/submitted`.

Missing addendum events include:

- Today filters submitted;
- best/backup/contrast clicked;
- issue report opened/submitted;
- venue claim started/completed under canonical names;
- confirmed extra used under a canonical Offer contract;
- villa QR landing/route opened under a canonical property context.

Existing event names cannot be renamed silently because database allowlists and reports depend on them.

## C-13 — Migration numbering is already ambiguous

There are 69 migration files through `0060`, with duplicate numeric prefixes:

`0015`, `0016`, `0017`, `0018`, `0019`, `0031`, `0032`, `0035`.

This is an operational migration-order risk. No migration was added. Before any P0 schema work, production-applied migration state and a single next-number convention must be verified.

## C-14 — Local environment does not contain production catalogue data

Local `/places` renders a truthful 0-state because production Supabase environment variables/data are not present. Production `/places` rendered 68 published places during browser QA, while production sitemap contained 690 URLs.

Local UI verification is valid for layout/routes but not sufficient evidence for production data behavior. Production was therefore tested separately and read-only.

## C-15 — Public “resident-curated” language needs a governance decision

The addendum permits `resident-curated` only adjacent to an explanation of the editorial process. `/for-venues` uses “The resident-curated guide…” near the top; a fuller process explanation appears later rather than immediately adjacent.

This is a copy-only risk suitable for T7/F-track after canonical documents are restored. No copy was changed during T0.

## C-16 — Clean local dev requires the prebuild media fetch

The first clean local browser run occurred before `npm run build`. Scene URLs such as `/scenes/hero-sunset.webp` and homepage moment images returned 404 locally. The build’s `prebuild` step subsequently fetched the required scene assets and the production build passed.

Production media rendered. This is not a production outage, but a completely clean `npm run dev` does not reproduce the intended visual state until the media fetch/build step has run. The generated `venues-story.mp4` was removed from the T0 working tree after verification.
