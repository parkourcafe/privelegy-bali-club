# Other Bali Four-Session Status Board

Frozen implementation baseline SHA: `1d77f1e`

Environment metadata commit is the single child of this baseline and contains only
this board plus empty handoffs. Every session worktree is created from that metadata
commit; product implementation diffs are therefore measured against `1d77f1e`.

| Session | Branch | Status | Final SHA | Handoff |
| --- | --- | --- | --- | --- |
| 1 — Data foundation | `loop/01-data-foundation` | integrated; post-merge gate pass | `8b00cfe` (handoff `6a70108`) | `docs/loop/handoffs/session-1.md` |
| 2 — Place/menu UI | `loop/02-menu-place-ui` | integrated; post-merge gate pass | `eba6775` (handoff `8798fc3`) | `docs/loop/handoffs/session-2.md` |
| 3 — Action gateway | `loop/03-action-gateway` | integrated; post-merge gate pass | `a5d39b8` (handoff `a1dec6d`) | `docs/loop/handoffs/session-3.md` |
| 4 — Admin/integration | `loop/04-admin-integration` | integrated; ready for release review | `51a5a49` (integrated implementation) | `docs/loop/handoffs/session-4.md` |

## Merge gate

Session 4 may integrate a session only when its handoff names a final SHA, its owned
scope and migrations comply, and focused tests/lint/build results are recorded. Merge
order: Session 1, Session 3, Session 2.

Integration order completed: Session 1 merge `10efe86`, Session 3 merge
`9824d93`, Session 2 merge `575f671`; vertical wiring `51a5a49`. Data Ops remains
separate and its draft/review candidates are not public.
