# Run Commands

## Preferred: Claude Code non-interactive goal

From repository root:

```bash
claude -p "/goal Read docs/intent-os/autopilot/02_CLAUDE_CODE_MASTER_GOAL.md and execute it until its final completion condition is satisfied" \
  --output-format stream-json --verbose
```

Claude Code permissions must be configured to allow only the repository/file/test commands needed by the workflow. Do not bypass permission controls globally.

## Interactive fallback

```bash
claude
```

Then:

```text
/goal Read docs/intent-os/autopilot/02_CLAUDE_CODE_MASTER_GOAL.md and execute it until its final completion condition is satisfied
```

Use auto mode only after the repository trust and command allowlist are configured.

## Resume

```bash
claude --continue
```

The durable source of truth is the repository state, not the chat transcript.
