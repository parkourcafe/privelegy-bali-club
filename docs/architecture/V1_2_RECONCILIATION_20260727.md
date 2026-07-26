# Other Bali v1.2 reconciliation — 2026-07-27

## Compared states

- GitHub `main`: `2ebf74e53d28a5ef7566e165eadc1fa5b6c8d915`
- Local canonical branch: `codex/arch-v12-production`
- Deployed Vercel release: `6b326354b9098a959a602d89a17c3ba3e9036243`
- Supabase migrations:
  - `v12_field_verification_contract`
  - `v12_runtime_persistence`
  - `v12_runtime_fk_indexes`
- Local v1.2 worktrees: data, mobile, trip, provider, runtime, QA and release

## Reconciliation decisions

| Area | Worktree result | Canonical production result | Decision |
|---|---|---|---|
| Import/action validation | Identical to production | Deployed | Keep production |
| Discover/Decide mobile shell | Identical to production | Deployed in bundled mobile assets | Keep production |
| Trip/offline contracts | Base implementation | Integrated and tested | Keep production |
| Maps handoff | Finite-coordinate check and generic driving fallback | WGS84 bounds and scooter `two-wheeler` handoff | Keep hardened production |
| Provider boundary | Fail-closed external handoff | Same boundary with interface-correct method signatures | Keep hardened production |
| Runtime API | Anonymous RPC client | Server-only service-role RPC client | Keep hardened production |
| Runtime persistence | Base migration | Operation-bound idempotency and service-role-only grants | Keep hardened production |

No worktree is merged wholesale. The canonical branch already contains the
useful worktree changes plus the security and production-integration fixes.

## Production state

- Vercel deployment `dpl_AjQvLzMbC9jMKWvGhPv5qgpD4oFU` is READY and serves
  `www.otherbali.com`.
- `/api/health/ready` reports release `6b326354b909`.
- v1.2 mutation, replay and read smoke tests passed.
- The smoke test created one `v12_decision_runs` row and its matching
  `v12_runtime_idempotency` row; no user import was performed.
- New tables use RLS/default-deny and runtime RPCs are executable only by
  `service_role`.

## Source-of-truth repair

The next controlled release action is to publish this exact branch to GitHub,
merge it to `main`, let the GitHub-based production deployment reproduce the
local CLI release, and repeat health/API/database verification. Until that is
complete, a deployment from the old GitHub `main` could regress production.
