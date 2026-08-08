@AGENTS.md

# CLAUDE.md — Other Bali Claude Code entrypoint

This file is intentionally thin to prevent rule drift.

Before any non-trivial work, read:

1. `AGENTS.md` — hard operating rules;
2. the newest `docs/HANDOFF_<date>.md` — where the project actually stands, and
   which numbers in the current artefacts and plans have since gone stale;
3. `Other_Bali_Master_Architecture.md` — canonical product and technical architecture;
4. `PARALLEL_LOOP_EXECUTION_PLAN.md` and the assigned session prompt when working in loop mode;
5. relevant code, migrations and focused docs.

The handoff exists because plans and dashboards for this product are built
outside the repository and go stale within a day. It records what was measured
against the live database and what was corrected — read it before acting on any
number quoted from an artefact.

Current product boundary:

> Other Bali owns the decision, explanation, trusted action interface and attribution. Partners own fulfilment. Google Maps owns navigation.

Do not duplicate or redefine the architecture here. If this file conflicts with `AGENTS.md` or the master architecture, those files win and this file must be corrected.
