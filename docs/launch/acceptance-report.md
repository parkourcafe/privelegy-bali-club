# Launch acceptance report

Status: **foundation implemented; release gates still open**.

## Locally satisfied foundation contracts

- C-01: canonical `www` policy, apex redirect and regression tests.
- C-02: five workflow definitions for quality, preview smoke, data audit, unsigned iOS Simulator Release and production-build Chromium/axe E2E; the browser workflow separates credential-free PR coverage from a protected isolated-staging job.
- C-03/C-04: runtime schema/publication gates, additive migrations `0035`–`0041`, deterministic backfill review and audit artifacts. The guide-lead boundary uses a service-role-only RPC, generic public acknowledgement and atomic same-contact throttling without IP limiter storage. Token onboarding is venue-serialized with durable write budgets; private photo review requires uploaded digest-bound bytes and exact consent.
- C-05: controlled error/404 states, fail-closed required data reads, request IDs, bounded release identifiers and health endpoints.
- C-06: explicit consent, no first-request analytics identity, first-party event enforcement, Privacy Choices, versioned export and generic deletion.
- C-07/C-08: bounded API input, DB-backed rate limit/source allowlist, unified external-link validation, security headers and production admin denial.
- CL-01/CL-08/CL-09 slice: no planner defaults, removable brief criteria, honest fallback copy, privacy UI and toggle/live-region semantics.
- Commercial-integrity slice: organic Places ranking uses fit before completeness and ignores tier/sponsored status; active criteria and history-synchronized filter state reflect only user-selected inputs.
- Route/detail slice: exact fail-closed route integrity, an ordered route page, evidence-labelled exact/search/generic Google Maps handoffs, route save/share, exact related routes, public detail navigation and bounded incorrect-info reporting are implemented. No geographic route map, live routing, ETA or provider travel-time claim is made.
- Mobile foundation: strict `/api/mobile/v1` contracts plus a bundled local Capacitor shell using the exact App, AppLauncher, Browser, Network, Preferences and Share plugins. Local cold/warm URL handlers and bounded offline venue/ordered-route snapshots are implemented.

## Final local verification state (2026-07-14)

- Final local/credential-free implementation gate: **PASS**.
- Authoritative complete-suite result: **406/406 passed**; lint, typecheck and production build passed; locked install and high-severity production dependency audit reported 0 vulnerabilities.
- Deterministic snapshot data audit: READY for 2 checked-in fixture venues only. All five workflow files parsed. Fresh PostgreSQL 16 replay/smoke/repeat/rollback/reapply through `0041` passed with exact final readiness `{ok:true,version:2,schemaRevision:"0041"}`.
- Chromium/axe Browser E2E on Chrome 150: **51 passed, 0 failed**, with no axe violations on exercised states. Gradient/pseudo-element contrast remained incomplete for manual review. No full WCAG, Safari or manual-device result is claimed.
- Mobile build/sync and iOS config verification passed. Full Xcode build was unavailable; strict native-readiness remained red only for the five recorded external/product blockers.
- The no-secret local server correctly failed dependency-backed readiness/Mobile bootstrap closed, so production-like preview smoke, configured data-backed Browser E2E and live CI remain unproven external gates.
- The current native readiness inventory has five remaining blocker codes: `signing_team_missing`, `associated_domains_not_linked`, `associated_domains_missing`, `aasa_missing`, and `native_map_missing`.
- Earlier foundation runs and disposable PostgreSQL checks remain engineering evidence, but they are not substituted for the pending final combined gate.

## Evidence that must not be conflated

- External GitHub CI proves only the fetched `claude/otherbali-audit-report-itlrg4` commits and its install/lint/typecheck/build workflow.
- Local tests prove repository contracts in a path-safe mirror; they do not prove Vercel, production Supabase, Apple signing, TestFlight or real devices.
- The two-row checked-in snapshot proves validator behavior, not production content quality.
- Disposable PostgreSQL evidence through `0041` must pass in the final gate; even a passing disposable replay will not prove production application, reconciliation or cleanup in the production project, which remain owner operations.
- A local `ios:verify --config-only` pass proves bundle/config invariants only. It is not an Xcode build or App Store privacy report.
- Local exact-URL cold/warm handlers do not prove production Universal Links. Saved route snapshots do not prove background sync, live availability, offline booking or provider routing.

## Gate status

| Gate | Status | Remaining evidence |
| --- | --- | --- |
| A — Web foundation | Local credential-free gate passed | live CI on this integration, isolated preview smoke, production-like ready check, data-backed Browser E2E, Vercel consolidation |
| B — Product integrity | Local Chromium gate passed; external QA partial | media/performance baselines, manual contrast, Safari/manual accessibility and device QA; native map remains absent |
| C — Privacy | Technical foundation only | provision current GuestRef signing secret; owner/controller, tombstone/event/lead/photo-evidence retention approval, photo reconciliation/cleanup operations, global abuse controls, production RPC evidence, App Store answers |
| D — iOS beta | Not ready | signing team, entitlements/associated domain, production AASA, native map, Xcode build and signed device/TestFlight matrix |
| E — App Store | Not ready | all P0/P1 blockers, current SDK, labels, screenshots, metadata and review notes |

No production deployment, production migration, Universal Link delivery, App Store archive/beta or TestFlight upload is claimed.
