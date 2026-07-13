# Other Bali Four-Session Status Board

Frozen implementation baseline SHA: `1d77f1e`

Environment metadata commit is the single child of this baseline and contains only
this board plus empty handoffs. Every session worktree is created from that metadata
commit; product implementation diffs are therefore measured against `1d77f1e`.

| Session | Branch | Status | Final SHA | Handoff |
| --- | --- | --- | --- | --- |
| 1 — Data foundation | `loop/01-data-foundation` | ready to start | — | `docs/loop/handoffs/session-1.md` |
| 2 — Place/menu UI | `loop/02-menu-place-ui` | ready to start | — | `docs/loop/handoffs/session-2.md` |
| 3 — Action gateway | `loop/03-action-gateway` | ready to start | — | `docs/loop/handoffs/session-3.md` |
| 4 — Admin/integration | `loop/04-admin-integration` | ready for parallel admin phase | — | `docs/loop/handoffs/session-4.md` |

## Merge gate

Session 4 may integrate a session only when its handoff names a final SHA, its owned
scope and migrations comply, and focused tests/lint/build results are recorded. Merge
order: Session 1, Session 3, Session 2.

