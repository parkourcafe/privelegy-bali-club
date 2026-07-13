# Other Bali Four-Session Execution Plan

## Frozen baseline

All session branches start from the SHA recorded in `docs/loop/STATUS_BOARD.md`.
Session branches never merge one another. Session 4 alone integrates completed work.

## Branches and ownership

| Session | Branch | Responsibility |
| --- | --- | --- |
| 1 | `loop/01-data-foundation` | schema, RLS, domain and repositories |
| 2 | `loop/02-menu-place-ui` | structured menu and place-detail presentation |
| 3 | `loop/03-action-gateway` | capability resolver, provider adapters, actions and attribution |
| 4 | `loop/04-admin-integration` | admin/freshness, merge gates, integration and final QA |

Shared contracts are frozen at baseline. A requested change is documented under
`docs/loop/requests/`, reviewed by affected owners and integrated deliberately.

## Session loop

Each session repeats: read, inspect, document, implement, focused test, lint, build,
review diff, update handoff. Work must stop on a contract/architecture conflict rather
than guessing.

## Handoff gate

A handoff must contain branch, baseline SHA, final SHA, owned-file diff, decisions,
tests with actual results, migrations/env/manual steps, known limitations, contract
requests and integration notes. A failing or unrun check is stated plainly.

## Integration order

Session 4 merges only green handoffs, in this order:

1. `loop/01-data-foundation`
2. `loop/03-action-gateway`
3. `loop/02-menu-place-ui`

Run lint and build after each merge. Resolve conflicts field-by-field against the
master architecture and shared contract. Never replace a whole conflicted file merely
because one side is newer.

## Final gate

From the integrated branch: clean install, lint, build, focused tests, validation
scripts and evidence-based browser QA. Record unavailable checks. Update the status
board and current session handoff with the integrated SHA, production migration/env
checklist and known limitations.

