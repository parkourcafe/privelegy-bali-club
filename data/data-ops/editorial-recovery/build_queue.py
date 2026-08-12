#!/usr/bin/env python3
"""
Evidence-based rewrite-queue builder for the editorial recovery.

Joins two inputs by normalized Place-Page slug and emits a single ranked queue:

  1. Production editorial diagnostic  (REQUIRED)
     inputs/production-editorial-diagnostic-2026-08-12.csv
     One row per active+published Place Page (1,272 rows). Carries the editorial
     blocker classification (`queue`), the release-gate verdict
     (`passes_release_gate`), and the per-row blocker list (`blockers_and_warnings`).

  2. Google Search Console "Pages" export  (OPTIONAL — demand layer)
     A GSC > Search results > Pages export (CSV). Supplies the three demand
     signals: impressions, clicks, average position. When absent, the builder
     runs an EDITORIAL-ONLY interim pass and marks every row gsc_available=false,
     so the composite is transparent about which signals were present.

The composite rank blends five signals, exactly as specified for the recovery:
    impressions · clicks · position  (demand, from GSC)
    editorial blocker severity        (from the diagnostic `queue` class)
    proximity to the release gate      (fewer remaining blockers = closer)

Nothing here writes to the database. This produces a queue only. Batch apply /
rollback SQL is generated per batch, downstream, from the top of this queue.

Usage:
    python3 build_queue.py                 # editorial-only interim (no GSC yet)
    python3 build_queue.py --gsc PATH.csv  # full composite once the export lands
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import os
import re
import sys
from typing import Optional

HERE = os.path.dirname(os.path.abspath(__file__))
DIAG_DEFAULT = os.path.join(
    HERE, "inputs", "production-editorial-diagnostic-2026-08-12.csv"
)
OUT_DIR = os.path.join(HERE, "out")

# ---------------------------------------------------------------------------
# Signal 1-2: editorial blocker severity + release-gate proximity
# ---------------------------------------------------------------------------

# Base severity per diagnostic queue class. Higher = more editorial debt on a
# page that is already live+indexed, so a higher-value fix. READY_FOR_RELEASE_GATE
# rows are already good and sit at the floor.
QUEUE_SEVERITY = {
    "P1_REWRITE_BOILERPLATE": 1.00,   # live but generic why/best_for — worst quality
    "P1_ADD_VERIFIED_ANCHOR": 0.90,   # missing a verified price/decision anchor
    "P2_ADD_NOT_FOR": 0.50,
    "P2_DEEPEN_PRACTICAL_VALUE": 0.45,
    "P2_VERIFY_SOURCE_AND_DATE": 0.40,
    "READY_FOR_RELEASE_GATE": 0.05,
}

# Blocker count is capped for the proximity curve. A page one blocker away from
# the release gate is a quicker win than one four blockers away.
MAX_BLOCKERS = 4


def _num_blockers(raw: str) -> int:
    raw = (raw or "").strip()
    if not raw:
        return 0
    try:
        arr = json.loads(raw)
        return len(arr) if isinstance(arr, list) else 0
    except json.JSONDecodeError:
        # Fallback: count quoted tokens if the JSON is malformed for any reason.
        return len(re.findall(r'"[^"]+"', raw))


def gate_proximity(num_blockers: int, passes_gate: bool) -> float:
    """1.0 = already passes / one step away; →0 = far from the gate."""
    if passes_gate:
        return 1.0
    capped = min(num_blockers, MAX_BLOCKERS)
    # 1 blocker -> 0.75, 2 -> 0.5, 3 -> 0.25, 4+ -> 0.0
    return max(0.0, (MAX_BLOCKERS - capped) / MAX_BLOCKERS)


# ---------------------------------------------------------------------------
# Signal 3-5: GSC demand (impressions, clicks, position)
# ---------------------------------------------------------------------------

# GSC "Pages" exports vary by locale/UI. Accept the common header spellings.
GSC_PAGE_KEYS = ["page", "top pages", "url", "landing page"]
GSC_CLICKS_KEYS = ["clicks", "url clicks"]
GSC_IMPR_KEYS = ["impressions"]
GSC_POS_KEYS = ["position", "average position", "avg. position"]

# Only Place Pages participate in this rewrite queue. Slugs join on /places/<slug>.
PLACE_URL_RE = re.compile(r"/places/([^/?#]+)")


def _pick(row: dict, keys: list[str]) -> Optional[str]:
    lower = {k.lower().strip(): v for k, v in row.items()}
    for k in keys:
        if k in lower:
            return lower[k]
    return None


def _to_float(v) -> float:
    if v is None:
        return 0.0
    s = str(v).strip().replace(",", "").replace("%", "")
    try:
        return float(s)
    except ValueError:
        return 0.0


def slug_from_url(url: str) -> Optional[str]:
    if not url:
        return None
    m = PLACE_URL_RE.search(url.strip())
    return m.group(1).strip().lower() if m else None


def load_gsc(path: str) -> dict[str, dict]:
    """Return {slug: {impressions, clicks, position}} for /places/* rows only."""
    by_slug: dict[str, dict] = {}
    with open(path, newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            url = _pick(row, GSC_PAGE_KEYS)
            slug = slug_from_url(url or "")
            if not slug:
                continue
            rec = by_slug.setdefault(
                slug, {"impressions": 0.0, "clicks": 0.0, "position": None}
            )
            rec["impressions"] += _to_float(_pick(row, GSC_IMPR_KEYS))
            rec["clicks"] += _to_float(_pick(row, GSC_CLICKS_KEYS))
            pos = _pick(row, GSC_POS_KEYS)
            if pos is not None and str(pos).strip():
                # If a slug appears more than once, keep the best (lowest) position.
                p = _to_float(pos)
                rec["position"] = p if rec["position"] is None else min(rec["position"], p)
    return by_slug


def demand_score(rec: Optional[dict], max_impr: float) -> tuple[float, dict]:
    """Normalized 0..1 demand signal + the raw components for transparency."""
    if not rec:
        return 0.0, {"impressions": None, "clicks": None, "position": None,
                     "striking_distance": None}
    impr = rec["impressions"]
    clicks = rec["clicks"]
    pos = rec["position"]
    # Log-scaled impressions so a handful of head pages don't dominate.
    impr_norm = (math.log10(impr + 1) / math.log10(max_impr + 1)) if max_impr > 0 else 0.0
    # Striking distance (positions 5-15) is the highest-ROI band per docs/gsc-setup.md.
    striking = pos is not None and 5.0 <= pos <= 15.0
    striking_bonus = 0.25 if striking else 0.0
    # Clicks confirm the page already converts impressions — small additive weight.
    click_bonus = min(0.15, math.log10(clicks + 1) / 4.0)
    score = min(1.0, 0.6 * impr_norm + striking_bonus + click_bonus)
    return score, {
        "impressions": impr,
        "clicks": clicks,
        "position": pos,
        "striking_distance": striking,
    }


# ---------------------------------------------------------------------------
# Composite
# ---------------------------------------------------------------------------

# Weights when GSC is present. Demand leads (proven search demand), editorial
# debt and gate-proximity break ties and surface quick, high-value wins.
W_WITH_GSC = {"demand": 0.50, "editorial": 0.30, "proximity": 0.20}
# Editorial-only interim: demand unavailable, renormalize across the two we have.
W_NO_GSC = {"demand": 0.00, "editorial": 0.60, "proximity": 0.40}


def build(diag_path: str, gsc_path: Optional[str]) -> dict:
    gsc = load_gsc(gsc_path) if gsc_path else {}
    gsc_available = bool(gsc)
    weights = W_WITH_GSC if gsc_available else W_NO_GSC
    max_impr = max((r["impressions"] for r in gsc.values()), default=0.0)

    rows = list(csv.DictReader(open(diag_path, newline="", encoding="utf-8-sig")))
    out = []
    for r in rows:
        slug = (r.get("slug") or "").strip().lower()
        qclass = (r.get("queue") or "").strip()
        passes = str(r.get("passes_release_gate", "")).strip().lower() == "true"
        nblock = _num_blockers(r.get("blockers_and_warnings", ""))

        edit = QUEUE_SEVERITY.get(qclass, 0.30)
        prox = gate_proximity(nblock, passes)
        dem, dem_raw = demand_score(gsc.get(slug), max_impr)

        score = (
            weights["demand"] * dem
            + weights["editorial"] * edit
            + weights["proximity"] * prox
        )
        out.append({
            "slug": slug,
            "name": r.get("name", ""),
            "district": r.get("district", ""),
            "category": r.get("category", ""),
            "queue_class": qclass,
            "passes_release_gate": passes,
            "num_blockers": nblock,
            "blockers": r.get("blockers_and_warnings", ""),
            "editorial_severity": round(edit, 4),
            "gate_proximity": round(prox, 4),
            "demand_score": round(dem, 4),
            "gsc_impressions": dem_raw["impressions"],
            "gsc_clicks": dem_raw["clicks"],
            "gsc_position": dem_raw["position"],
            "gsc_striking_distance": dem_raw["striking_distance"],
            "composite_score": round(score, 6),
        })

    # Rank: composite desc, then more editorial debt, then closer to the gate.
    out.sort(key=lambda x: (-x["composite_score"], -x["editorial_severity"],
                            -x["gate_proximity"], x["slug"]))
    for i, x in enumerate(out, 1):
        x["rank"] = i

    matched = sum(1 for x in out if x["gsc_impressions"] is not None)
    return {
        "meta": {
            "diagnostic_input": os.path.relpath(diag_path, HERE),
            "gsc_input": os.path.relpath(gsc_path, HERE) if gsc_path else None,
            "gsc_available": gsc_available,
            "weights": weights,
            "total_pages": len(out),
            "gsc_matched_pages": matched if gsc_available else 0,
            "note": (
                "FULL composite (demand + editorial + proximity)."
                if gsc_available else
                "EDITORIAL-ONLY INTERIM — GSC Pages export not yet supplied. "
                "Demand signals (impressions/clicks/position) are absent; this "
                "ranking is provisional and MUST be recomputed once GSC lands "
                "before Batch membership is fixed."
            ),
        },
        "queue": out,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--diagnostic", default=DIAG_DEFAULT)
    ap.add_argument("--gsc", default=None,
                    help="Path to a GSC 'Pages' export CSV. Omit for interim.")
    ap.add_argument("--limit", type=int, default=None,
                    help="Print only the top N rows to stdout summary.")
    args = ap.parse_args()

    result = build(args.diagnostic, args.gsc)
    os.makedirs(OUT_DIR, exist_ok=True)

    tag = "composite" if result["meta"]["gsc_available"] else "editorial-interim"
    json_path = os.path.join(OUT_DIR, f"queue-{tag}.json")
    csv_path = os.path.join(OUT_DIR, f"queue-{tag}.csv")

    with open(json_path, "w", encoding="utf-8") as fh:
        json.dump(result, fh, ensure_ascii=False, indent=2)

    cols = ["rank", "slug", "name", "district", "category", "queue_class",
            "passes_release_gate", "num_blockers", "editorial_severity",
            "gate_proximity", "demand_score", "gsc_impressions", "gsc_clicks",
            "gsc_position", "gsc_striking_distance", "composite_score"]
    with open(csv_path, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        w.writerows(result["queue"])

    m = result["meta"]
    print(f"gsc_available   : {m['gsc_available']}")
    print(f"total_pages     : {m['total_pages']}")
    print(f"gsc_matched     : {m['gsc_matched_pages']}")
    print(f"weights         : {m['weights']}")
    print(f"wrote           : {os.path.relpath(json_path, HERE)}")
    print(f"                  {os.path.relpath(csv_path, HERE)}")
    print(f"note            : {m['note']}")
    n = args.limit or 15
    print(f"\nTop {n} (by composite):")
    for x in result["queue"][:n]:
        print(f"  #{x['rank']:<4} {x['composite_score']:.4f}  "
              f"{x['queue_class']:<26} {x['district']:<14} {x['slug']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
