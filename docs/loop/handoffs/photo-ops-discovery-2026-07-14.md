# Photo Ops discovery — 2026-07-14

Status: collection in progress; no venue photography is authorized for public display by this document.

## Scope and live baseline

- Canonical integration tree: `otherbali-release-integration`, branch `loop/05-release-integration`.
- The working tree already contains substantial unrelated changes. Photo Ops must not reset, overwrite, or reformat them.
- Live source audited: `https://www.otherbali.com/places` on 2026-07-14 (Asia/Makassar).
- Point-in-time production deployment: `dpl_3QjTpn4YHfegsdRYjpUQLAJKCym3`, commit `7e79ffa7d12973609881d63dcce3dc48922b1f29` on `claude/bali-tourism-platform-fhd0l9`.
- Live cards: 434 total; 91 render an image; 343 render a category/type cover because `photoUrl` is absent.
- Missing by stored category: restaurant 88, warung 33, cafe 31, bar 10, beach club 6, spa 64, beauty 36, fitness 39, yoga 36.
- Every one of the 91 currently rendered image URLs uses the public `venue-photos/draft/` path. Reachability is not evidence of owner consent.

## Authority and safety decision

`AGENTS.md` and `docs/DATA_OPS_TRACK.md` require a fail-closed workflow:

1. collect candidates only from official venue-controlled sources;
2. retain exact source-page and source-image provenance;
3. store candidates privately as `awaiting_owner_consent`;
4. publish only after the owner confirms rights for each exact image and the consent is logged;
5. never use Google Maps photography or third-party review imagery as a substitute.

The existing `0033_venue_photo_consent_staging.sql` migration is the target rights-aware model. The older direct `venues.photo_url`/public-bucket flow is not a safe publication path.

## Smallest complete slice

1. Generate a reproducible live inventory in JSON, CSV, and Markdown.
2. Collect two or three technically valid, de-duplicated image candidates per missing venue from its official website or official social profile.
3. Record source URL, capture timestamp, hash, MIME type, dimensions where available, and review status.
4. Quarantine uncertain matches and shared-brand/branch images for manual review.
5. Import only into private consent staging after the production schema and credentials are confirmed; do not set public `photo_url` directly.

## Known scale

Completing all missing cards requires 686–1,029 candidate images. The work therefore runs as a resumable batch with manifests and per-venue status rather than an untracked manual download.

## First collection pass

- 343 missing-photo venues processed.
- 608 technically valid, per-file hashed candidates collected from official pages.
- 193 venues have three candidates; 11 have two; 7 have one; 132 have none yet.
- All candidates remain local/private and carry `publicDisplayAllowed: false` plus `awaiting_owner_consent`.
- Validation found no missing/corrupt files, unsafe redirect in the retained set, or consent-policy metadata failure.
- Cross-venue duplicate assets remain in the manual branch/relevance queue and are not approved for publication.

## Production upload blocker

The Supabase connector is authenticated, but not to the Other Bali production project. Its visible project list contains only `utqvuwxosyvkmqwpcbxc` and `htclwrotnmhtbrdisqcu`; a direct read of target project `egkdapqwkfprtyqvvnso` returned `You do not have permission to perform this action`.

No database, Storage, migration, or deployment write was attempted. Upload to private consent staging remains blocked until the connector is authenticated to the exact target project and the live presence of migration `0033_venue_photo_consent_staging.sql` is confirmed.
