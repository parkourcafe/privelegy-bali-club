# Artifact Contract

Every generated artifact must be deterministic, machine-readable where applicable, and traceable to source records.

## Required CSV rules

- UTF-8.
- Header present.
- RFC 4180-compatible quoting.
- Stable column order.
- No embedded unquoted commas.
- Empty unknown values represented as empty string or explicit enum, never invented text.
- Every output includes `created_at`, `generator`, `source_version` where practical.

## Required logs

Every stage appends one event to `event-log.ndjson`:

```json
{
  "timestamp": "ISO-8601",
  "stage": "NORMALIZE",
  "status": "PASS",
  "inputs": [],
  "outputs": [],
  "checks": [],
  "decisions": [],
  "errors": [],
  "next_state": "RECONCILE"
}
```

## Source traceability

Every canonical intent must trace to:

- one or more external `source_record_id`; or
- an internal product job with exact repository evidence.

## Quality score

Each major output receives:

- score out of 100;
- three most critical remaining defects;
- blocking/non-blocking classification;
- terminal recommendation.

Self-scoring alone is not acceptance. Deterministic validators must pass.
