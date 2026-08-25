# Sitemap Drift Review - Other Bali - 2026-08-25

## Before

`npm run seo:os:check` failed before refresh:

| Metric | Value |
|---|---:|
| Live sitemap URLs | 1427 |
| Registry snapshot URLs | 673 |
| Added since snapshot | 762 |
| Removed since snapshot | 8 |
| Duplicate live URLs | 0 |
| Foreign live origins | 0 |

Removed URLs:

- `https://www.otherbali.com/places/bakso-boedjangan-jimbaran`
- `https://www.otherbali.com/places/dear-lucy-cafe-kuta`
- `https://www.otherbali.com/places/f45-training-seminyak`
- `https://www.otherbali.com/places/gildak-renon`
- `https://www.otherbali.com/places/nalu-bowls`
- `https://www.otherbali.com/places/paddys-pub-legian`
- `https://www.otherbali.com/places/red-manna`
- `https://www.otherbali.com/places/saigon-street`

## Action

Ran:

```bash
node scripts/seo-os.mjs snapshot --approve-drift
```

This refreshed `docs/seo/os/page-registry.json` from the live sitemap and preserved removed URLs as tombstones.

## After

`npm run seo:os:check` passed after refresh:

| Metric | Value |
|---|---:|
| Live sitemap URLs | 1427 |
| Registry snapshot URLs | 1427 |
| Tombstones | 8 |
| Added since snapshot | 0 |
| Removed since snapshot | 0 |
| Duplicate live URLs | 0 |
| Foreign live origins | 0 |

## Current Registry Counts

| Route type | Count |
|---|---:|
| venue | 1271 |
| area_collection | 46 |
| editorial | 47 |
| collection | 16 |
| offer_detail | 15 |
| area_hub | 12 |
| route | 8 |
| partner_b2b | 4 |
| planning_tool | 2 |
| area_directory | 1 |
| catalogue | 1 |
| collection_hub | 1 |
| guide_hub | 1 |
| home | 1 |
| programmatic_area | 1 |

## Operating Rule

Run `npm run seo:os:check` before any deployment. New sitemap drift must be either fixed at source or intentionally approved with a dated review note.
