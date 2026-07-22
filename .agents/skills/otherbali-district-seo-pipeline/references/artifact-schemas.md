# Artifact and CSV schemas

## Required district artifacts

Use uppercase district prefix: repository inventory, intent map, SERP gap report, source registry, entity master, fact matrix, evidence closure report, volatility register, Maps audit, owner confirmation pack, field verification pack, unified cluster decision, P0 briefs, P0 claim ledger, publication gates, implementation report and independent QA report.

## `*_SOURCE_REGISTRY.csv`

`source_id,source_type,source_name,source_url,publisher,accessed_at,applies_to,verification_state,notes`

`source_id` must be unique. `source_url` must be HTTPS when present. AI output is forbidden as a source.

## `*_ENTITY_MASTER.csv`

`entity_id,entity_type,name,official_url,maps_url,place_id,district,subarea,identity_state,source_ids,notes`

`entity_id` must be unique. Unknown Maps values remain empty. `source_ids` are semicolon-separated and must exist.

## `*_P0_CLAIM_LEDGER.csv`

`claim_id,page,page_url,action,claim_text,label,source_ids,confidence,volatility,allowed_wording,prohibited_wording,refresh_requirement,publication_status,owner_dependency,field_dependency,maps_dependency`

`claim_id` must be unique. `label` and `publication_status` use governance vocabulary. Every `source_id` must exist. Draft-ready rows cannot have unresolved required dependencies.

## Queue

`docs/seo/os/district-queue.yaml` uses: `district`, `priority`, `status`, `repo_inventory`, `serp_research`, `evidence`, `architecture`, `briefs`, `drafts`, `implementation`, `qa`, `preview`, `production`, `blockers`, `last_updated`.
