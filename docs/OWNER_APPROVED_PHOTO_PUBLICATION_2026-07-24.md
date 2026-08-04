# Owner-approved photo publication — 2026-07-24

## Discovery

- Branch: `codex/publish-owner-confirmed-30-2026-07-24`.
- Production project: `bali-privilege` (`egkdapqwkfprtyqvvnso`).
- The owner-confirmed 30-venue batch contains 14 exact non-empty
  `venues.photo_url` values and 16 venues without a real photo URL.
- Before this change, all 14 were suppressed in `tourist_public` mode because
  the legacy bridge treated every `photo_url` as provisional.
- Founder direction on 2026-07-24 confirms that agreements cover all 14 exact
  files currently attached to these venue rows.

## Implementation

- Migration `0062` creates or updates one consent-ledger row per exact file,
  records consent and owner confirmation, makes it primary, and changes only
  the 14 target venue rows to `photo_status = 'published'`.
- Public reads now select `photo_status` and render a `photo_url` in tourist
  mode only when the status is `approved` or `published`.
- Four approved files still use a legacy Storage object path containing
  `/venue-photos/draft/`. The image component accepts that path only when the
  server-side row also carries the exact-file approved/published flag; an
  unapproved legacy draft URL remains blocked.
- Preview mode remains unchanged.
- Every other provisional, missing, rejected or unverified image remains
  hidden in tourist mode.

## Required verification

- Photo-policy unit test.
- Wave 1 test suite.
- Typecheck, lint and production build.
- Production SQL count: 14 published exact URLs and 14 approved primary
  consent records.
- Public HTML/DOM check after the code release.
