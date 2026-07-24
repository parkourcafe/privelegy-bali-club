# Other Bali — Canon Conflict Register

Status: active docs-only reconciliation  
Recorded: 2026-07-25, Asia/Makassar

Legacy boundary for every historical carrier: `HISTORICAL / READ-ONLY / NOT IMPLEMENTATION AUTHORITY`.

| T0 conflict | Owner decision / boundary | Reconciliation status | Next action |
|---|---|---|---|
| C-01: Addendum/PEA referenced unavailable Unified Master v3.2 | Source-of-truth rule; current target master is V3.1 corrected | Closed for governance | Use V3.1 until a dated V3.2 decision exists |
| C-02: Data Dictionary, Taxonomy and Migration Map absent | `CONTRACTS_ONLY` is the next stage | Open, intentionally deferred | Create and approve the three contracts |
| C-03: PEA was previously absent | PEA is now present, below V3.1 authority | Closed for reconciliation | Resolve its lower-order conflicts in contracts |
| C-04: `/my-bali` versus `/me` | ROUTE-002: `/me` current, `/my-bali` target, no redirect | Decided/deferred | Preserve state and validate target before migration |
| C-05: `/my-day` versus `/today`, silent widening | ROUTE-001 and TODAY-001 | Decided/deferred | Define district-honest contract; no route change now |
| C-06: Saved/My navigation terminology | ROUTE-002; no navigation change | Decided/deferred | Address only after route/state review |
| C-07: money/sponsored/trial language | MONEY-001 | Registered, no code change | Reconcile in money/data contracts |
| C-08: confirmed extras incomplete | MONEY-001 + TRUTH-001 | Open | Define evidence and status fields |
| C-09: issue reporting absent | TRUTH-001 | Open | Define contract only |
| C-10: media provenance partial | TRUTH-001 | Open | Define source/status/date contract |
| C-11: freshness incomplete | TRUTH-001 | Open | Define freshness contract |
| C-12: event vocabulary mismatch | Truth and attribution boundaries | Open | Map existing events in contracts |
| C-13: duplicate migration prefixes | Migration Map V1 required | Open | Register deterministic migration policy |
| C-14: local environment lacks production data | Repo as-is evidence | Closed for T0 | Keep local/live distinction explicit |
| C-15: resident-curated claim flow not adjacent | TRUTH-001 | Open | Define claim/evidence contract |
| C-16: local dev needs prebuild media fetch | Repo as-is evidence | Closed for reconciliation | No runtime change in this stage |

## Required conflict language

`CANON_CONFLICT`  
Requires explicit Decision Log amendment  
Do not implement automatically

`MONEY_MODEL_CONFLICT`  
No commercial copy changed  
Decision Log amendment required

No conflict above authorizes a route, schema, migration, UI, copy, money or production change in this commit.
