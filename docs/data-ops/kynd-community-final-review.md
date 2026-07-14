# KYND Community final live-only reconciliation — operator review

Status: research complete; ready for import dry-run and staging apply as a
draft candidate; operator review required; forbidden to publish.

## Identity and denominator

- The read-only production snapshot at `2026-07-14T02:20:05Z` confirms
  `kynd-community` exists with `status=active` and `district=seminyak`.
- The snapshot is used only for venue identity/live status, never for menu or
  action facts.
- The canonical eligible F&B denominator is now 208: the reproducible
  207-record repository replay plus this one confirmed live-only Seminyak cafe.
- Public-surface publication state is unknown for this live-only record. It is
  not added to the known published count and remains operator-review-only.

## Menu acceptance

- Official source: four-page `KYND_MENU___WEBSITE_MAY_2026.pdf`, linked by the
  venue's own site.
- PDF metadata: created and modified `2026-05-11T11:36:15+08:00`; title
  `WEBSITE MENU > FOOD & DRINKS`.
- Visual and text review covered all four pages: 22 sections and 120 priced
  item/group lines. Descriptions, exact price text, explicit GF/GFO labels and
  readable allergen icons are retained where present.
- Every unambiguous `k` amount is normalized to integer IDR while preserving
  the original price text, including `+15k` and `all 140k`.
- The PDF states all prices are subject to 10% tax and 6% service.
- The venue calls the linked document a sample menu. `fully_parsed` means the
  captured PDF is fully transcribed; it does not claim that no other in-venue
  offerings exist.

## Accepted action candidates

- Official KYND cafe page.
- Official Seminyak WhatsApp: `+62 859 3112 0209`.
- Official Seminyak Maps short-link, rechecked through its redirect to
  `KYND COMMUNITY SEMINYAK`.

## Rejected action candidates

- Reserve: the venue's current `cutt.ly/book-kyndbali` short-link resolves to
  `booking.resdiary.com/widget/Standard/KYNDCanggu/1352`; it is the wrong branch
  for this Seminyak record.
- GoFood/Gojek delivery: the official site states availability but publishes no
  Seminyak branch-deep destination URL.
- Grab delivery: the official site states availability but publishes no
  Seminyak branch-deep destination URL.

No fabricated order URL, aggregator fact, review, rating, media right, owner
verification, import, publication, or deployment is included. `verifiedAt`
remains `null` and `publicationAllowed` remains `false`.
