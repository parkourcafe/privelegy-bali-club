# Other Bali menu/action release reconciliation

Date: 2026-07-14 (Bali)
Branch: `loop/05-release-integration`
Coordinator: release integration session
Status: code-only public preview gate passed; database apply, import, and production publication remain closed

## Discovery record

- Remote repository baseline was preserved at `6ca3685`.
- The founder's dirty working tree was preserved independently as snapshot
  `90ee4ca` and then applied to this clean integration branch as `3a73a67`.
- The four-session integration was preserved independently as snapshot
  `fd5b918` and then applied here as `b93190a`.
- The Data Ops evidence package was added as `713a742`.
- The original working tree is not used for release work and has not been
  cleaned, reset, or overwritten.
- The product package reviewed for this release is
  `Other_Bali_Product_Update_v2_2026-07-13.zip`.

## Authority conflicts found

1. The repository contained shortened `AGENTS.md`, architecture, execution-plan,
   and Data Ops documents instead of the founder-approved v2 package copies.
2. The repository `CLAUDE.md` still named the superseded legacy architecture as
   the source of truth.
3. The four sessions implemented a smaller runtime `menu-action.ts` shape that
   differs from the package's frozen v1.1 contract. The implemented database,
   resolver, page, and tests consistently use that runtime shape, so replacing
   it blindly would create a breaking migration rather than a documentation fix.
4. Menu/action and photo-consent migrations reused numbers already present on
   the current remote baseline.
5. Existing partner/operator RPCs exposed onboarding tokens too broadly, and
   mutation actions relied on page-level access instead of authorizing every
   request.
6. Data Ops records are evidence captures, not operator-verified publication
   records. `verifiedAt = null` must remain truthful until a real review occurs.

## App-session production handoff reviewed

The 2026-07-13 app-session status letter was reviewed against commit `6dd361a`.
It independently confirms the anonymous token exposure and reports production
drift that is not represented by the current mainline migration history:

- production contains the five-argument, anon-executable
  `set_venue_photo(text,text,boolean,text,text)` rather than the original
  two-argument function;
- production contains legacy `venue_photo_consents` rows whose schema stores a
  plaintext onboarding token;
- six-district editorial data was applied directly and exists even though it is
  absent from the Supabase migration registry;
- the reported raw production table has 462 rows / 347 active rows, whereas the
  Data Ops denominator is a deduplicated eligible F&B slice of 207, plus the
  unresolved DB-only `kynd-community` candidate.

Therefore the photo security migration must handle both legacy function
signatures, preserve consent evidence while irreversibly removing plaintext
credentials, and must not re-import or overwrite the district editorial layer.
Commit `6dd361a` is evidence and requirements input, not a cherry-pick candidate:
its browser-side anonymous upload/public-URL flow is incompatible with private
staging and operator approval.

## Deliberate reconciliation decisions

- Install the complete v2 operating documents as repository authority and keep
  the original frozen contract as an auditable package reference.
- Keep the integrated runtime contract temporarily as a compatibility boundary;
  do not silently change the database and every consumer during release repair.
  Any later canonical-shape migration must be additive and separately tested.
- Preserve canonical `priceText` semantics additively as `menu_items.price_text`;
  parsed numeric `price_minor`/`currency` may coexist, but an ambiguous source
  display price must never be discarded or converted to false precision.
- Keep directions on the existing verified `venues.gmaps_url` path. Data Ops
  map evidence remains in the compiled review artifact but is not imported as a
  `venue_action_capabilities` row. Other canonical action fields are mapped
  explicitly at the import boundary (`actionType`/`handoffUrl` to runtime
  `kind`/`url`) until the compatibility contract is migrated deliberately.
- Forward-fix migration numbering after the current highest migration; never
  edit a migration assumed to be applied.
- Require authorization inside every server mutation and restrict token-bearing
  RPCs to trusted server/operator roles.
- Treat Data Ops capture, operator verification, and publication as three
  separate states. Compilation or import dry-run never sets `verifiedAt`.
- Use the stricter publication gate for the pilot: no structured menu or action
  becomes public until its official source, parsed content, freshness, and
  handoff have been reviewed. Venue photos additionally require logged owner
  consent and photo-rights confirmation.
- Keep all imports in dry-run/staging mode until schema, RLS, application tests,
  build, browser QA, and operator review have passed.

## Release gates

1. Release repair: security, unique migrations, validation, operator review UI.
2. Menu QA: deterministic compile, rejected-record report, staging dry-run.
3. Preview QA: mobile/desktop paths, stale and missing states, action handoffs,
   accessibility, analytics safety, and no horizontal overflow.
4. Controlled publish: only explicitly operator-verified records; rollback list
   and post-publish checks required. Unverified Data Ops records remain drafts.

This record documents the conflict before implementation and prevents either the
legacy repository files or the session handoffs from silently overriding the
founder-approved product package.

## Final verification snapshot

The reconciled code is suitable for a **code-only, fail-closed public preview**.
It is not approved for database migration, Data Ops apply, or production release.

Completed checks:

- independent public-boundary audit: no remaining P1 finding;
- focused TypeScript/runtime tests: 147/147 passed;
- migration/compiler/validation tests: 53/53 passed;
- TypeScript compilation and ESLint: passed;
- Next.js production build: passed (35 static pages generated);
- current `0030`–`0033` SQL replay: all four migrations committed with
  `ON_ERROR_STOP=1` against a separate local PostgreSQL 16 clone of the prior
  release schema;
- browser smoke QA: passed on 390 px mobile and 1440 px desktop for `/`,
  `/places`, and `/bali`, with no overflow or browser exceptions;
- removed/held surfaces correctly returned 404, including public Reddit reports,
  legacy `/bali/where-to-stay`, DB-unready `/uluwatu`, and a nonexistent venue;
- Data Ops compile check remained deterministic and all 126 menu plus 248 action
  candidates validated as unverified drafts;
- review-only importer returned `applied: false` and made no database request or
  write;
- repository secret scan found no real credential value (only documented empty
  environment names and test-only dummy values).

The local SQL replay additionally confirmed that both legacy
`set_venue_photo` signatures are absent, anonymous execution of roster/token,
redemption, and event RPCs is revoked, service-only execution is present where
required, all sensitive/menu/action/photo tables have RLS enabled, consent logs
are insert-only for the service role, immutable-evidence triggers exist, and
the `venue-photos` bucket is private with a 10 MiB storage ceiling and an
image-only MIME allowlist. This proves the forward repair SQL is internally
executable; it does **not** resolve the live migration-history P0 below.

Fail-closed boundaries confirmed:

- public venue, perk, menu, action, and photo reads require the corresponding
  active/published/fresh/consented database state;
- preview cannot reuse the known production Supabase project or inherited
  production TablePilot credentials;
- preview receives robots exclusion and a response-wide noindex header;
- owner onboarding creates review evidence/drafts but cannot publish a listing,
  perk, menu, action, or photo;
- Data Ops never invents verification timestamps or publication consent;
- verified menus/actions and consent evidence are immutable, and sensitive
  mutations require the server/operator boundary.

## Open release blockers

### P0 — Supabase migration history

Versions `0015` through `0019` each occur more than once. Supabase identifies
migrations by the numeric version, so the folder cannot be applied safely to a
fresh staging project or production until an operator performs a **read-only**
comparison with the live migration history and creates an approved baseline or
forward-repair plan. Existing migration filenames must not be guessed, renamed,
or replayed blindly.

### Data/operator gates after P0

1. Reconcile the repository denominator of 207 eligible venues with the reported
   live candidate count of 208, specifically the unresolved `kynd-community` row.
2. Apply the approved migration plan to an isolated disposable staging project.
3. Run the Data Ops staging preflight/apply only after the package digest and
   denominator gates pass; keep every imported record draft and unverified.
4. Have an operator inspect official sources, parsed menu content/prices,
   handoff URLs, exact perk wording, and exact-image photo rights before any
   explicit publication transition.
5. Repeat browser QA against staging, prepare a rollback manifest, and request a
   separate production approval. No production deployment or write is part of
   this reconciliation branch.
