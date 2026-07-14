# Launch architecture decisions

## ADR-L01 — canonical production origin

Status: accepted by launch specification, implemented locally 2026-07-14.

- Canonical origin is `https://www.otherbali.com`.
- Apex requests permanently redirect to `www`, preserving path and query.
- Production origin resolution fails closed to the canonical `www` origin.
- Preview deployments retain their trusted `*.vercel.app` origin and cannot inherit a production host.

Production Vercel project ID and project name remain owner/platform evidence blockers and must be recorded before production deployment.

## ADR-L02 — iOS minimum target

The existing iOS 15.0 target is preserved. Any change requires a separate ADR and device-support analysis.

## ADR-L03 — venue validation boundary

Raw database rows, normalized venue entities and publishable venue entities are separate contracts. Public legacy reads pass a transitional structural gate before mapping; invalid rows are excluded with structured identifier/issue logs. The full normalized publication contract is the data-audit and migration target and requires provenance, location, directions, editorial evidence and an approved photo/no-photo state.
