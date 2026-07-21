# Chope-607 Dry Run Report

Date: 2026-07-22
Environment: local repository dry run
Command: `node scripts/chope-607-dry-run.mjs`

## Result

| Metric | Count |
|---|---:|
| Input rows processed | 5 |
| Publishable rows | 0 |
| `dedup_pending` rows | 5 |
| `draft` publication rows | 5 |

## Source limitation

The full 607-row source file was not found in the repository or inspected Downloads paths. This dry run uses a controlled five-row sample derived from the available 12-row `/Users/msnigmatullaeva/Downloads/insert_chope_candidates.sql` artifact. The downloaded SQL itself was not applied and should not be used as a production importer because it inserts directly into `venues`.

## Guard proof

- Every row has `publication_status: draft`.
- Every row has `candidate_state: dedup_pending`.
- Every row has `verification_status: verification_pending`.
- Every row has `editorial_status: editorial_pending`.
- Every row has `seo_status: hold`.
- Every row has `photo_permission_status: not_granted`.
- `publication_guard.can_publish` is false for every row.

## Dry-run output

The machine-readable output is stored at `data/data-ops/chope-607/dry-run-output.json`.

```json
{
  "generated_at": "2026-07-21T17:11:30.097Z",
  "input_path": "data/data-ops/chope-607/sample-candidates.json",
  "source_file_available": false,
  "limitations": [
    "Full 607-row Chope source was not available in the repository or inspected Downloads paths; this is a controlled sample dry run."
  ],
  "counts": {
    "total": 5,
    "publishable": 0,
    "by_candidate_state": {
      "dedup_pending": 5
    },
    "by_publication_status": {
      "draft": 5
    }
  },
  "staged": [
    {
      "candidate_id": "chope-sample-001",
      "source_hash": "1ce77b58153186b0",
      "source": "chope",
      "name": "Secana Rooftop Bali",
      "category": "bar",
      "district": "canggu",
      "slug": "secana-rooftop-bali",
      "dedup_signals": {
        "normalized_name": "secana rooftop bali",
        "slug": "secana-rooftop-bali",
        "google_place_id": null,
        "coordinates": null,
        "address": "Jalan Pemelisan Agung, Canggu, Bali 80361",
        "official_url": "https://secanabeachtown.com/",
        "instagram_url": "https://www.instagram.com/secanabeachtown/",
        "branch_identity": null,
        "parent_venue": null
      },
      "candidate_state": "dedup_pending",
      "publication_status": "draft",
      "verification_status": "verification_pending",
      "editorial_status": "editorial_pending",
      "seo_status": "hold",
      "partner_status": "not_contacted",
      "photo_permission_status": "not_granted",
      "allowed_actions_after_dedup": [
        "create_new",
        "update_existing",
        "create_branch",
        "attach_as_child",
        "hold",
        "reject"
      ],
      "recommended_action": "hold",
      "publication_guard": {
        "can_insert_as_draft": true,
        "can_publish": false,
        "reason": "Chope row is a staged candidate only; dedup, verification, editorial QA and photo rights are incomplete."
      }
    },
    {
      "candidate_id": "chope-sample-002",
      "source_hash": "84ca1714673787ab",
      "source": "chope",
      "name": "Yema Kitchen",
      "category": "restaurant",
      "district": "canggu",
      "slug": "yema-kitchen",
      "dedup_signals": {
        "normalized_name": "yema kitchen",
        "slug": "yema-kitchen",
        "google_place_id": null,
        "coordinates": null,
        "address": "Jalan Tanah Barak No.31, Canggu, Bali 80351",
        "official_url": "https://yemabali.com/",
        "instagram_url": "https://www.instagram.com/yema.bali/",
        "branch_identity": null,
        "parent_venue": null
      },
      "candidate_state": "dedup_pending",
      "publication_status": "draft",
      "verification_status": "verification_pending",
      "editorial_status": "editorial_pending",
      "seo_status": "hold",
      "partner_status": "not_contacted",
      "photo_permission_status": "not_granted",
      "allowed_actions_after_dedup": [
        "create_new",
        "update_existing",
        "create_branch",
        "attach_as_child",
        "hold",
        "reject"
      ],
      "recommended_action": "hold",
      "publication_guard": {
        "can_insert_as_draft": true,
        "can_publish": false,
        "reason": "Chope row is a staged candidate only; dedup, verification, editorial QA and photo rights are incomplete."
      }
    },
    {
      "candidate_id": "chope-sample-003",
      "source_hash": "074904d9d3a26afd",
      "source": "chope",
      "name": "Sa'Mesa Canggu | Experience Dining",
      "category": "restaurant",
      "district": "canggu",
      "slug": "sa-mesa-canggu-experience-dining",
      "dedup_signals": {
        "normalized_name": "sa'mesa canggu | experience dining",
        "slug": "sa-mesa-canggu-experience-dining",
        "google_place_id": null,
        "coordinates": null,
        "address": "Jalan Tanah Barak No.1e, Canggu, Bali 80351",
        "official_url": "https://samesabali.com/",
        "instagram_url": null,
        "branch_identity": null,
        "parent_venue": null
      },
      "candidate_state": "dedup_pending",
      "publication_status": "draft",
      "verification_status": "verification_pending",
      "editorial_status": "editorial_pending",
      "seo_status": "hold",
      "partner_status": "not_contacted",
      "photo_permission_status": "not_granted",
      "allowed_actions_after_dedup": [
        "create_new",
        "update_existing",
        "create_branch",
        "attach_as_child",
        "hold",
        "reject"
      ],
      "recommended_action": "hold",
      "publication_guard": {
        "can_insert_as_draft": true,
        "can_publish": false,
        "reason": "Chope row is a staged candidate only; dedup, verification, editorial QA and photo rights are incomplete."
      }
    },
    {
      "candidate_id": "chope-sample-004",
      "source_hash": "5978aff1b3e83253",
      "source": "chope",
      "name": "Cliff at CANNA",
      "category": "restaurant",
      "district": "nusa-dua",
      "slug": "cliff-at-canna",
      "dedup_signals": {
        "normalized_name": "cliff at canna",
        "slug": "cliff-at-canna",
        "google_place_id": null,
        "coordinates": null,
        "address": "Jalan Raya Nusa Dua Selatan, Benoa, Nusa Dua, Bali 80363",
        "official_url": "https://cannabali.id/",
        "instagram_url": "https://www.instagram.com/cliffatcannabali/",
        "branch_identity": null,
        "parent_venue": null
      },
      "candidate_state": "dedup_pending",
      "publication_status": "draft",
      "verification_status": "verification_pending",
      "editorial_status": "editorial_pending",
      "seo_status": "hold",
      "partner_status": "not_contacted",
      "photo_permission_status": "not_granted",
      "allowed_actions_after_dedup": [
        "create_new",
        "update_existing",
        "create_branch",
        "attach_as_child",
        "hold",
        "reject"
      ],
      "recommended_action": "hold",
      "publication_guard": {
        "can_insert_as_draft": true,
        "can_publish": false,
        "reason": "Chope row is a staged candidate only; dedup, verification, editorial QA and photo rights are incomplete."
      }
    },
    {
      "candidate_id": "chope-sample-005",
      "source_hash": "d9963d99d48a003b",
      "source": "chope",
      "name": "Huge Restaurant",
      "category": "restaurant",
      "district": "seminyak",
      "slug": "huge-restaurant",
      "dedup_signals": {
        "normalized_name": "huge restaurant",
        "slug": "huge-restaurant",
        "google_place_id": null,
        "coordinates": null,
        "address": "Jalan Batu Belig No.4, Seminyak, Bali 80361",
        "official_url": "https://hugebali.com/",
        "instagram_url": "https://www.instagram.com/huge.restaurant/",
        "branch_identity": null,
        "parent_venue": null
      },
      "candidate_state": "dedup_pending",
      "publication_status": "draft",
      "verification_status": "verification_pending",
      "editorial_status": "editorial_pending",
      "seo_status": "hold",
      "partner_status": "not_contacted",
      "photo_permission_status": "not_granted",
      "allowed_actions_after_dedup": [
        "create_new",
        "update_existing",
        "create_branch",
        "attach_as_child",
        "hold",
        "reject"
      ],
      "recommended_action": "hold",
      "publication_guard": {
        "can_insert_as_draft": true,
        "can_publish": false,
        "reason": "Chope row is a staged candidate only; dedup, verification, editorial QA and photo rights are incomplete."
      }
    }
  ]
}
```
