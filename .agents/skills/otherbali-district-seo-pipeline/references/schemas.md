# Schemas and status vocabulary

## Source registry CSV

`source_id,title,url,source_type,publisher,published_or_updated,retrieved_at,evidence_label,authority,volatility,notes`

## Entity master CSV

`entity_id,canonical_name,entity_type,admin_parent,editorial_area,official_url,google_maps_url,google_place_id,identity_status,evidence_label,source_ids,confidence,notes`

## Claim ledger CSV

`claim_id,page_id,page_url,action,claim_text,evidence_label,source_ids,confidence,volatility,allowed_wording,prohibited_wording,refresh_requirement,publication_status`

## Maps queue CSV

`entity_id,canonical_name,maps_url,google_place_id,name_match,address_match,alias_risk,status,notes`

## Allowed status vocabulary

- Topic decisions: `P0_UPDATE`, `P0_CREATE`, `P1_UPDATE`, `P1_CREATE`, `MERGE_INTO_EXISTING`, `HOLD`, `REJECT`.
- Claim publication: `READY_FOR_CODEX_DRAFT`, `HOLD`, `REJECT`.
- Evidence: `EXTRACTED`, `INTERPRETED`, `UNVERIFIED`.
- Maps: `CONFIRMED`, `NEEDS_MANUAL_MAPS_CONFIRMATION`, `HOLD_IDENTITY_RECONCILE`.
- Gate result: `PASS`, `PASS_WITH_CAVEAT`, `FAIL`, `UNRESOLVED`, `NOT_APPLICABLE`.
- Queue district status: `pilot_complete_or_current_state`, `in_progress`, `queued`, `complete`, `blocked`.
- Queue phase status: `pending`, `in_progress`, `complete`, `partial`, `current_state`, `forbidden`, `blocked`, `not_applicable`.

Semicolon-separate multiple source IDs inside one CSV cell. IDs must be unique within their registry. Every claim source ID must resolve to the district source registry.
