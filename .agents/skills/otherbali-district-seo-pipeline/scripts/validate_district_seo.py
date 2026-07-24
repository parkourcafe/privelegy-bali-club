#!/usr/bin/env python3
import csv, pathlib, sys

ROOT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".")
errors = []

def rows(pattern, id_field):
    for path in ROOT.glob(pattern):
        with path.open(newline="", encoding="utf-8-sig") as handle:
            data = list(csv.DictReader(handle))
        seen = set()
        for index, row in enumerate(data, 2):
            value = (row.get(id_field) or "").strip()
            if not value: errors.append(f"{path}:{index}: missing {id_field}")
            elif value in seen: errors.append(f"{path}:{index}: duplicate {id_field} {value}")
            seen.add(value)
        yield path, data

source_ids = set()
for _, data in rows("*_SOURCE_REGISTRY.csv", "source_id"):
    source_ids.update((row.get("source_id") or "").strip() for row in data)

for pattern, key in [("*_ENTITY_MASTER.csv", "entity_id"), ("*_P0_CLAIM_LEDGER.csv", "claim_id")]:
    for path, data in rows(pattern, key):
        for index, row in enumerate(data, 2):
            for source_id in filter(None, (row.get("source_ids") or "").split(";")):
                if source_id not in source_ids:
                    errors.append(f"{path}:{index}: unknown source_id {source_id}")

if errors:
    print("\n".join(errors))
    raise SystemExit(1)
print(f"OK: validated district SEO CSVs in {ROOT}")
