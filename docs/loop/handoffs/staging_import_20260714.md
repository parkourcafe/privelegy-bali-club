# Data Ops disposable staging import - 2026-07-14

## Result

- Completed at `2026-07-14T08:42:40Z`.
- Target: disposable local PostgreSQL 16.14 plus PostgREST 14.14, exposed only
  on loopback for the import run.
- Production project `egkdapqwkfprtyqvvnso` was not connected to or mutated.
- Input digest:
  `79eac95c0d8a93a18045b1a4d79691d2c1ac5fe869bd41ea9764010412844e9a`.
- Package digest:
  `ba8599b410eb19a0032484cecfb936ce01429004e16a865ad99bd16dcecce081`.

The importer rebuilt the canonical package from exactly 55 raw Data Ops files,
confirmed byte identity with `compiled/candidates.json`, passed the explicit
disposable-target gates, and applied through the same Supabase JavaScript /
PostgREST path used by a hosted project.

## Applied draft rows

- Menus: 127
- Menu sections: 165
- Menu items: 881
- Action capabilities: 250
- Google Maps verification candidates intentionally not applied: 50
- Candidate venues represented: 147

All 127 menus and all 250 capabilities remained `draft`; all `verified_at`
values remained null. The menu split after insertion was exactly 1 `full`
(`kynd-community`) and 126 `partial`.

## Reconciliation note

The repository migration replay does not contain production's live-only
`kynd-community` row. Before the final empty-target apply, staging received one
minimal review-only venue scaffold using the already approved production
snapshot identity: slug `kynd-community`, name `KYND Community`, category
`cafe`, district `seminyak`, status `active`, publication status `review`.
No menu or action fact came from this scaffold. The importer then confirmed
that every one of its 147 candidate venue slugs existed.

## Post-apply checks

- Exact row counts matched the import plan: 127 / 165 / 881 / 250.
- Duplicate menu keys: 0.
- Duplicate action keys: 0.
- Orphan menu sections: 0.
- Orphan menu items: 0.
- Non-HTTPS menu evidence URLs: 0.
- Non-HTTPS action or action-evidence URLs: 0.
- Unexpected verified or public rows: 0.
- Anonymous visibility of draft menus and capabilities: 0 rows.
- KYND imported as 22 sections and 120 items with the corrected shared-sample
  title.
- Calling `publish_menu_version` for a partial draft returned
  `{"ok": false, "error": "not_publishable"}`.
- In a rolled-back transaction, the reviewed, fresh, full KYND candidate passed
  the publication RPC and became anonymously visible; rollback restored it to
  an unverified draft.

The staging apply proves schema/import compatibility and the fail-closed public
gates. It does not itself authorize production import or publication.
