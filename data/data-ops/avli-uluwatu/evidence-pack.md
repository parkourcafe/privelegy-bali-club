# AVLI Uluwatu — evidence pack

**Status:** `HOLD_PREPARED`
**Captured:** 2026-08-30
**Publication:** forbidden
**Database write:** not performed

## Discovery note

This pack was prepared in a dedicated worktree from `origin/main` at commit
`560df8a`. It is deliberately outside `data/data-ops/batches/`, so the data-ops
compiler cannot promote it accidentally. No SQL, migration, production write,
guide edit, venue publication or deploy is included. The evidence pack and its
reusable workflow may be reviewed through a branch and draft PR.

The supplied GEO audit was used only to identify AVLI as a candidate. Venue
facts below were re-checked against AVLI-controlled pages on 2026-08-30. The
audit is not treated as publication provenance.

## Identity and catalogue check

| Field | State | Evidence / decision |
|---|---|---|
| Venue identity | VERIFIED | AVLI's official site identifies the business as a modern Greek restaurant in Uluwatu. |
| District | VERIFIED | The official site describes the venue as Uluwatu and gives Pecatu, South Kuta as its locality. Proposed Other Bali district: `uluwatu`. |
| Maps identity | VERIFIED | The official short link resolves to `AVLI \| Modern Greek` at `-8.8165625, 115.0958125`, Google token `/g/11xghttkxm`. |
| Exact street address | OMITTED | The official page exposes the locality `Pecatu, South Kuta, Badung Regency, Bali 80361`, but not a street-and-number address. The draft uses the verified Maps identity and coordinates instead of inventing an address. |
| Existing public Other Bali record | NOT FOUND | Checked the public places sitemap and the Uluwatu restaurant guide on 2026-08-30; no AVLI match was found. This does not prove absence from unpublished database rows. |
| Unpublished/database duplicate | UNKNOWN | The connected Supabase project list did not expose an Other Bali project, so no database query was sent. The proposed slug remains provisional. |

## Claim ledger

| Claim | State | Primary source | Public-field decision |
|---|---|---|---|
| AVLI is a modern Greek restaurant in Uluwatu/Pecatu. | VERIFIED | Official home page | May support category, district and `why_its_here`. |
| AVLI is built around an open-air Greek courtyard concept. | VERIFIED OWNER CLAIM | Official home page | May be restated as factual venue description. |
| Chef Angelos Lantos leads the kitchen; AVLI says he has more than two decades in Greek and Mediterranean cuisine, including eight years at Spondi in Athens. | VERIFIED OWNER CLAIM | Official meet-the-maker page | May be attributed or carefully restated; do not turn it into an award or Michelin claim. |
| The food is designed for sharing and includes pita, dips, salads, grilled meats and seasonal seafood. | VERIFIED OWNER CLAIM | Official menu page | May support general cuisine description, not `what_to_order`. |
| The courtyard can host up to 120 guests for private dining/events. | VERIFIED OWNER CLAIM | Official private-dining page | May support private-dining fit; capacity is volatile and should be rechecked before publication. |
| Opening is Monday–Sunday from 5 pm until “late”; the owner confirms this means service continues until the last guest. | VERIFIED + OWNER CLARIFICATION | Official home/menu/private-dining pages and recorded owner instruction | Publish the human-readable open-ended schedule. Leave `opening_hours_json` null rather than inventing a closing time. |
| SevenRooms is the official booking handoff. | VERIFIED | Official site link to SevenRooms | Safe as a draft `reserve` action; availability and confirmation remain with SevenRooms. |
| The official menu page currently links a priced signature-sharing menu and dessert menu. | VERIFIED | Official menu image assets captured 2026-08-30 | Supports a draft price anchor and `what_to_order`; both remain editorial proposals. Prices exclude 10% tax and 7% service. |
| Signature menu lists lobster pasta at 270K/100g, grilled king black tiger prawns at 150K/100g and market whole fresh fish at 100K/100g. | VERIFIED | Official signature-sharing menu image | May support the proposed `what_to_order`; availability and whole-fish price vary by weight. |
| Dessert menu lists desserts from 140K to 280K. | VERIFIED | Official dessert menu image | May support the proposed price anchor, but does not establish a full restaurant spend range. |
| AVLI official-site exterior image can serve as the hero candidate. | VERIFIED SOURCE / OWNER POLICY | Official AVLI media asset plus the owner's display instruction | Selected in the draft. The older repository media-rights publication gate remains a disclosed policy conflict. |
| Fixed closing time by weekday. | NOT APPLICABLE | Owner confirms AVLI operates until the last guest. | A fixed closing time is neither required nor to be invented. |
| Recurring OPA/Flower Party schedule. | HOLD | Dynamic social feed text is visible on the official site, but no dated current event schedule was confirmed. | Do not put this in the venue record or guide copy. |

## Primary sources

- Official site: https://avlibali.com/
- Official menu page: https://avlibali.com/menu/
- Official signature-sharing menu image: https://avlibali.com/wp-content/uploads/2025/09/Copy-of-Sharing-Menu-0107_page-0001.webp
- Official dessert menu image: https://avlibali.com/wp-content/uploads/2026/02/Dessert-Menu-276-opt-1_page-0001.webp
- Official chef page: https://avlibali.com/meet-the-maker/
- Official private-dining page: https://avlibali.com/private-dining/
- Official Instagram: https://www.instagram.com/avlibali/
- Official booking handoff: https://www.sevenrooms.com/explore/avlimoderngreek/reservations/create/search/
- Official Maps handoff exposed by the site: https://maps.app.goo.gl/ou9Loqtmt68qnnDL8
- Other Bali public places sitemap checked: https://www.otherbali.com/sitemap/places
- Other Bali Uluwatu restaurant guide checked: https://www.otherbali.com/uluwatu/best-restaurants

The machine-readable source registry is in `source-manifest.json`. The proposed
record is in `draft-venue-record.json`. The step-by-step history is in
`RUNLOG.md`. Cross-surface identity is recorded in `entity-consistency.json`.
`citation-source-map.json` is deliberately empty until a dated AI baseline
exists. `measurement-plan.json` contains only an unapproved venue-specific
prompt layer; it does not authorize a paid run or claim observed visibility.
The dated menu and Maps extraction is preserved in
`raw-evidence/2026-08-30-menu-maps-source-extract.md`. The human-readable copy
proposal is in `editorial-review.md`.

## Owner/editor verification required before a data change

1. Restore read-only access to the correct Other Bali Supabase project and run
   a production-safe dedupe for name, domain, Maps URL and proposed slug.
2. Approve or revise `why_its_here`, `best_for`, `not_for`, the proposed price
   anchor and `what_to_order` in Other Bali editorial voice.

The exact street address is no longer a preparation blocker because the
official Maps identity and coordinates are verified. A hero photo is selected
under the owner's instruction that restaurant photos may be shown. Before a
public implementation, reconcile that instruction with the repository's older
media-rights gate so the policy is internally consistent.

AVLI's closing time is no longer a blocker. Public copy should say it opens
daily at 5 pm and operates until the last guest. Structured closing time stays
omitted because an open-ended service must not be converted into an invented
clock time.

## Promotion sequence after confirmation

1. Update this pack and move every newly supported field from `HOLD`/`UNKNOWN`
   to a dated verified state.
2. Run a one-row import dry-run and verify exactly one intended target.
3. Prepare guarded SQL or the approved one-record data path; do not publish by
   default.
4. Verify the unpublished venue page and structured data gates.
5. Request editorial approval to add AVLI to the Uluwatu restaurant guide.
6. Publish the venue and guide change only under separate explicit approval.
