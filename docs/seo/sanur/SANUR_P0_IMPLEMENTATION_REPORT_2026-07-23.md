# Sanur P0 implementation report — 2026-07-23

## Scope

- `P0_UPDATE`: `https://www.otherbali.com/sanur`
- `P0_CREATE`: `https://www.otherbali.com/sanur/where-to-stay`
- No redirects, aliases, deployment or publication.
- `/sanur/best-hotels` remains a separate hotel-selection intent and was not changed.

## Intent boundary

| URL | Primary user decision | Explicitly does not own |
| --- | --- | --- |
| `/sanur` | Is Sanur the right Bali base for this trip? | Choosing a stay zone or an individual hotel |
| `/sanur/where-to-stay` | Which part of Sanur, and which location type, should I choose before choosing a hotel? | Ranking or selecting individual hotels |
| `/sanur/best-hotels` | Which individual hotel should I choose? | Base fit or broad zone selection |

## Implemented claim control

| Claim IDs | Page | Public use | Source IDs | Control |
| --- | --- | --- | --- | --- |
| P0-PILLAR-001–002 | `/sanur` | Calmer promenade-led fit; nightlife trade-off | SRC-001; SRC-002; SRC-031; SRC-032 | Wording stays within allowed ledger language |
| P0-PILLAR-003 | `/sanur` | South/Central/North are editorial planning zones | SRC-001; SRC-002; SRC-003 | Explicitly not administrative boundaries |
| P0-PILLAR-004 | `/sanur` | Ferry handoffs to Nusa Penida, Lembongan and Gilis | SRC-035; SRC-042 | No schedules, prices or guaranteed convenience |
| P0-PILLAR-005–006 | `/sanur` | Qualified family and older-traveller fit | SRC-001; SRC-002; SRC-020; SRC-028 | No safety, stroller, wheelchair or accessibility guarantee |
| P0-WTS-001–004 | `/sanur/where-to-stay` | Zone and beachfront/inland decision | SRC-001; SRC-002; SRC-003; SRC-004; SRC-005; SRC-008; SRC-010; SRC-013; SRC-015; SRC-017; SRC-020; SRC-022; SRC-026; SRC-028; SRC-030; SRC-035; SRC-037; SRC-038 | No exact walking time or universal convenience claim |
| P0-WTS-005–006 | `/sanur/where-to-stay` | Klumpu address and Prime Plaza edge/inland classification | SRC-003; SRC-004; SRC-037 | Non-ranked examples; no Maps links |
| P0-WTS-007–008 | `/sanur/where-to-stay` | Volatility warning and omission of unverified Maps links | SRC-001; SRC-034; SRC-037; SRC-038; SRC-041; SANUR_MAPS_ENTITY_AUDIT | No evergreen rate/policy claim and no unverified action handoff |

## Technical implementation

- Unique metadata, canonical and Open Graph URL on both pages.
- Visible breadcrumbs plus `BreadcrumbList` JSON-LD.
- Visible copy aligned with `Article` + `TravelGuide` JSON-LD.
- `/sanur/where-to-stay` added to the pillar registry, which is the sitemap source of truth.
- Page registry and two active intent owners added with GSC-review conflict status.
- Reciprocal internal links between the pillar and stay-zone guide; both link to the separate hotel guide.

## Remaining publication gates

- Review current GSC query-to-page evidence for `/sanur`, `/sanur/where-to-stay` and `/sanur/best-hotels`.
- Complete any field, owner and manual Maps checks required by the approved Sanur publication gates.
- Human editorial approval of rendered desktop and mobile pages.
- Merge, deploy and publish require separate authorization.

## Source availability note

At implementation time, `SANUR_P0_CLAIM_LEDGER.csv` was readable and all used claims were `READY_FOR_CODEX_DRAFT`. Several other approved Sanur documents in the local synced folder were File Provider placeholders and could not be re-read; this implementation therefore does not elevate any claim beyond the readable ledger or the approved two-page scope.
