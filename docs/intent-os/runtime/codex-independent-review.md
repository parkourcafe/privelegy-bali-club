# Codex Independent Review

**Reviewer:** Codex CLI 0.145.0, `--sandbox read-only`
**Contract:** `docs/intent-os/autopilot/06_CODEX_REVIEW_CONTRACT.md`
**Subject:** date-night modifier pilot (`OB-CAN-0011`), `EXTEND_EXISTING`
**Rounds:** 2 (initial review, then re-review after fixes)

## Round 1 — three HIGH findings, all valid

| Severity | Finding | Disposition |
|---|---|---|
| HIGH | Non-serializable function crossed the Server/Client boundary. `availability` carried `modifier.matches` (a predicate) into a Client Component; React cannot serialize functions, so the page would throw the moment the flag was enabled. | **Fixed.** `ModifierAvailability` is now a flat plain-data record (`key`, `label`, `evidence`, `count`, `available`) with no function. A test asserts no field is a function and that each row survives a JSON round-trip. |
| HIGH | `quiet` used substring containment (`t.includes("quiet")`), so a negating or ambiguous tag such as `not_quiet` or `quiet_unknown` would have counted as positive evidence — an approximation the brief forbids. | **Fixed.** Exact allowlist `{quiet, quiet_enough_to_talk}`. A test asserts five negating/ambiguous variants all fail. |
| HIGH | Analytics payload was not enum-only: it sent `pageSlug` alongside the modifier enum. | **Fixed.** The payload is now the constraint enum alone, and the value must pass the key guard *and* be currently offered before it is sent. |

The first finding is the one worth dwelling on: the local build passed with the flag off, so the
failure was latent and would have surfaced only when the flag was switched on in an environment
where it mattered. Build success was not evidence of correctness here.

## Round 2 — re-review after fixes

> **"No CRITICAL or HIGH findings remain."**

All three prior findings confirmed resolved with file:line evidence. The reviewer additionally
confirmed the redesigned client-side filter is sound: the interpolated CSS key is injection-safe
because it is runtime-guarded to a closed enum; hydration is correctly isolated by `Suspense`; no-JS
visitors receive all venues; and filtered query states canonicalize to the base page rather than
becoming separately indexable.

Two new lower-severity findings were raised and **both were also fixed**, though neither blocked:

| Severity | Finding | Disposition |
|---|---|---|
| MEDIUM | `role="radio"` on navigation links promised arrow-key roving navigation that links do not provide — misleading semantics for assistive technology. | **Fixed.** The fake radiogroup is gone; these are plain links using `aria-current` to convey active state. |
| LOW | The unconditional wrapper `<div>` changed each grid item's box, which could alter equal-height rows even with the flag off. | **Fixed.** With the flag off no wrapper is rendered at all — markup is identical to what shipped previously. With the flag on the wrapper uses `display: contents`, so the card remains the grid item. |

## Scope compliance

| Contract item | Result |
|---|---|
| Source-record integrity | 200 unique `OB-INT-*`, unchanged |
| Canonical/child/modifier parent links | validators pass |
| CSV/JSON validity | validators pass |
| Scope vs product brief | in scope; modifier refinement only |
| Reuse of existing engine | extends the existing intent spoke; no second engine |
| Security and privacy | no credentials committed; no PII; enum-only analytics |
| Analytics payload safety | constraint enum only |
| Route/canonical/sitemap | no new URL; canonical unchanged; route stays SSG |
| Tests / typecheck / lint / build | all pass |
| Rollback and flag behaviour | flag default off; markup identical when off |

## Forbidden scope

The reviewer did not modify files, redesign the taxonomy, create canonical intents, expand product
scope, publish pages or merge anything.
