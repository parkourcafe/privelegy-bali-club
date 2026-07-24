# Other Bali — Taxonomy V1

Status: `CONTRACTS_ONLY / DRAFT FOR APPROVAL`  
Recorded: 2026-07-25, Asia/Makassar  
Implementation: none

## Rules

Canonical keys are product vocabulary, not routes or navigation. Public labels are English. Aliases aid matching only; they cannot create indexable pages or silently widen a district. Editorial fit is separate from commercial state. Paid status never affects organic ranking. Unknown/unverified/stale are explicit states.

## Controlled vocabularies

| Family | Canonical keys | Public English labels | Allowed parent / aliases | Forbidden use / migration |
|---|---|---|---|---|
| district | `canggu`, `seminyak`, `ubud`, `uluwatu`, `sanur`, `nusa_penida`, `other` | Canggu, Seminyak, Ubud, Uluwatu, Sanur, Nusa Penida | Area; legacy District names are aliases | never a new primary-nav item; map legacy `districts` |
| area | canonical Area id | area name | island → area | no route rename without Migration Map |
| subarea | approved child key | local area name | area → subarea | no invented mapping |
| venue_type | `restaurant`, `cafe`, `bar`, `hotel`, `villa`, `beach`, `spa`, `wellness`, `culture`, `activity`, `shop`, `other` | editorial public label | Place | not a navigation category |
| public_category | `eat`, `drink`, `stay`, `wellness`, `beach`, `culture`, `activity`, `shop` | Eat, Drink, Stay, Wellness, Beach, Culture, Activity, Shop | venue_type → category | does not determine organic rank alone |
| traveller_job | `eat`, `coffee`, `swim`, `unwind`, `date`, `work`, `culture`, `move`, `stay`, `plan` | Eat, Coffee, Swim, Unwind, Date, Work, Culture, Move, Stay, Plan | launch shortcut layer | not canonical Scenario until approved |
| moment | `now`, `morning`, `afternoon`, `sunset`, `evening`, `late` | Now, Morning, Afternoon, Sunset, Evening, Late | Today | never equivalent to open_now |
| occasion | `solo`, `couple`, `family`, `friends`, `group`, `celebration`, `work` | Solo, Couple, Family, Friends, Group, Celebration, Work | traveller_job | no demographic inference |
| company_type | `solo`, `couple`, `family`, `friends`, `group` | Solo, Couple, Family, Friends, Group | occasion | editorial context only |
| mood | `quiet`, `social`, `special`, `easy`, `energetic`, `romantic`, `reset` | Quiet, Social, Special, Easy, Energetic, Romantic, Reset | editorial fit | no unsupported quality claim |
| budget | `unknown`, `low`, `mid`, `high`, `premium` | Price unknown, Low, Mid, High, Premium | Place/Offer | never infer exact price |
| ending | `sunset`, `dinner`, `drinks`, `quiet`, `activity`, `stay` | Sunset, Dinner, Drinks, Quiet, Activity, Stay | Route/Today | not a route by itself |
| practical_tag | `walk_in`, `reservation_recommended`, `work_friendly`, `kid_friendly`, `parking`, `outdoor`, `indoor`, `accessible` | editorial reviewed label | Place | no tag without evidence |
| price_band | `unknown`, `budget`, `mid`, `upper_mid`, `premium` | Price unknown, Budget, Mid, Upper-mid, Premium | Place/Offer | source/date required |
| action_type | `directions`, `website`, `menu`, `instagram`, `whatsapp`, `reserve`, `delivery`, `takeaway`, `preorder` | canonical action copy | VenueActionCapability | action is not fulfilment |
| verification_status | `verified`, `needs_verification`, `disputed`, `stale` | Verified, Needs verification, Disputed, Stale | Verification | bare verified boolean forbidden |
| freshness_status | `current`, `due`, `stale`, `unknown` | Current, Check due, Stale, Unknown | field evidence | never derive from updated_at |
| publication_status | `draft`, `published`, `unpublished`, `closed` | internal/public state | Place/Media/Offer | only published public |
| editorial_status | `draft`, `review`, `approved`, `disputed`, `stale` | internal status | editorial carrier | partner cannot set verdict/rank |
| media_scope | `venue`, `branch`, `property`, `brand`, `shared_facility`, `unresolved` | internal scope | MediaAsset → entity | cross-entity reuse requires explicit scope |
| media_provenance | `owner_candidate_bucket`, `confirmed_official_batch`, `submission`, `venue_photo_url`, `legacy_external_project`, `admin_upload`, `unknown` | internal provenance | MediaAsset | provenance is not rights by itself |
| media_status | `discovered`, `validated`, `mapping_required`, `ready`, `published`, `blocked_technical`, `superseded`, `archived` | internal lifecycle | MediaAsset | no silent discard |
| rights_basis | `project_owner_global_authorization` | internal rights basis | MEDIA-002 | do not claim personal confirmation |
| offer_status | `draft`, `active`, `expired`, `disputed`, `stale`, `unpublished` | contextual offer state | Offer | Sponsored/Featured forbidden |
| claim_status | `unverified`, `verified`, `disputed`, `stale` | claim evidence state | editorial claim | no copied reviews/anti-lists |
| attribution_source | `tablepilot`, `official_booking`, `website`, `maps`, `instagram`, `whatsapp`, `menu`, `other` | internal source | InteractionEvent | click ≠ confirmed/seated |
| reservation_status | `intent`, `confirmed`, `seated`, `cancelled`, `unknown` | internal stage | reservation rail | only seated billable |

## Navigation boundary

Primary navigation remains **Today, Explore, Plan, Saved**. Taxonomy families must not become top-level navigation, paid placement, category sponsorship or organic ranking controls.

## Legacy treatment

`Venue`, `District`, `Perk`, `SavedPlace`, `ContentPage`, `Sponsored`, `Featured`, `is_sponsored` and trial/listing terms are legacy values. They map through Migration Map V1; they are not implementation authority.
