# Production release completion — 2026-07-14

## Outcome

The Other Bali menu/action foundation is live on the public production domains.
The deterministic Data Ops package was imported atomically as private drafts,
then only the independently verified KYND Community menu and its two safe
official actions were published.

Public deployment:

- Vercel deployment: `dpl_HQ17z3Ymh6N5sg6P7QeirQbteA1e`
- Deployment URL: `https://privelegy-bali-club-1bm90or4t-yulaboober.vercel.app`
- Public aliases: `https://www.otherbali.com` and `https://otherbali.com`
- Runtime release commit: `98c7c74`

## Production import

The one-shot transactional importer accepted the exact reviewed package:

- package digest:
  `ba8599b410eb19a0032484cecfb936ce01429004e16a865ad99bd16dcecce081`
- input digest:
  `79eac95c0d8a93a18045b1a4d79691d2c1ac5fe869bd41ea9764010412844e9a`
- menus: `127`
- sections: `165`
- items: `881`
- action capabilities: `250`
- venue mappings present but intentionally not applied: `50`

The import ledger contains one matching run. Exact-repeat handling is
idempotent. All imported records entered production as private drafts with
`verified_at = null`; no draft became publicly readable during import.

## Operator verification and publication

KYND Community was checked against the current official May 2026 four-page
menu PDF and the official venue pages. The PDF SHA-256 is:

`14ee0e82406a0ae1d5ca04a1408b8752926ee7b9d4e02353da8705a3df90ca71`

Published menu:

- menu id: `558f60bc-5cb7-940e-64b2-d978e94a42ee`
- title: `KYND Community shared sample food & drinks menu - May 2026`
- completeness: `full`
- sections: `22`
- items: `120`
- verified at: `2026-07-14T11:37:06.303Z`
- verification expiry: `2026-09-12T11:37:06.303Z`

Only two branch-safe KYND actions were newly published:

1. the official KYND cafe page;
2. the official Seminyak WhatsApp number.

The booking link was not published because it resolves to the Canggu branch.
No photo was published because exact-image publication consent was not present.

## Final live state

- menus: `1` published and verified; `126` private partial drafts
- menu visibility for anonymous visitors: `1` menu, `22` sections, `120` items
- actions: `80` confirmed in total; `248` remaining package actions are private
  drafts
- photo submissions preserved: `91`; published by this release: `0`
- legacy onboarding photo tokens remaining: `0`

The public KYND page returns HTTP `200` and renders the exact menu title,
representative item and price content, source/freshness labels, official website
action, and Seminyak WhatsApp action. Home, places, and Ubud itinerary routes
also return HTTP `200`.

The production import endpoint returns HTTP `401` without a token. The one-time
`DATA_OPS_IMPORT_TOKEN` and `KYND_OPERATOR_TOKEN` environment variables were
removed after use, and their temporary mutation deployments were deleted.
Temporary diagnostic preview deployments used for the final checks were also
removed. Recent runtime logs contained no `5xx` responses for the checked
production deployment.

## Concurrent deployment note

At final audit time, Vercel also contained a newer target=`production`
deployment `dpl_CHpskoToXJDfLzDAgrQkCzHqWeiW` from the independent branch
`claude/bali-tourism-platform-fhd0l9` at `3fd94ac6`. It does not own
`www.otherbali.com` or `otherbali.com`; both public domains remain on the
reviewed deployment above. Git ancestry confirms that `3fd94ac6` contains
`98c7c74`, but its additional changes were not part of this release gate. A
future operator should reconcile the two production lines before moving the
public aliases.

## Remaining work

The remaining `248` imported actions stay deliberately private. They require a
later Data Ops/operator wave with branch-specific first-party evidence and real
verification before publication. KYND must be rechecked before its verification
expiry.

## Public source-snapshot follow-on release

Later on 2026-07-14, release commit `eb74912` was deployed as Vercel production
deployment `dpl_55KpKbwnvS4GdxgPtLwq3T7oaWD5`. The reviewed migration exposed
the 126 partial menu records through a separate `source_snapshot` state rather
than mislabeling them as verified full menus.

The production confirmation row reported:

- `ok=true`;
- `verified_full_menus=1`;
- `partial_source_snapshots=126`;
- `total_public_menus=127`.

The migration transaction revalidated the exact live package shape of 127
menus, 165 sections and 881 items before activation. Partial snapshots keep
`verified_at=null`, expire after 60 days, link to their official evidence and
cannot carry dietary, allergen, editorial or partner-verification signals.

Post-release verification fetched the catalogue and every one of its 127 unique
detail routes. All returned HTTP `200`; the 126 partial pages contained the
selected-items warning, official-source link and `noindex, follow` metadata.
Only `/menus/kynd-community`, the complete verified menu, is included as an
indexable menu detail in the production sitemap.
