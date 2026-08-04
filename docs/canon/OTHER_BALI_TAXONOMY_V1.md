# Other Bali — Taxonomy V1

Status: `CONTRACTS_ONLY / DRAFT FOR APPROVAL`  
Recorded: 2026-07-25, Asia/Makassar  
Authority: V3.1 target master + TODAY-001 + TRUTH-001  
Implementation: none; no labels, routes or navigation are changed

## Taxonomy rules

- Taxonomy names are decision vocabulary, not new routes or entities.
- Launch shortcuts are not canonical `Scenario` entities until this taxonomy is approved and editorially reviewed.
- Area is data and context, not a separate product. A district selection must not silently widen to island-wide results.
- Unknown, unverified and stale are valid states and must remain visible where needed.
- Synonyms may improve matching, but cannot create unsupported claims or duplicate indexable pages.

## Area and district keys

| Key family | Canonical role | Examples / aliases | Rule |
|---|---|---|---|
| `area` | geographic context | `canggu`, `seminyak`, `ubud`, `uluwatu`, `sanur`, `nusa_penida` | key comes from approved Area records |
| `district` | user-facing local area | Canggu, Ubud, Uluwatu | no island-wide fallback without explicit disclosure |
| `island` | broad territory | Bali | default context only when user has not selected a district |
| `nearby` | computed context | current/selected area | must state how proximity was determined; no turn-by-turn routing |

Legacy `districts` values remain AS-IS until mapped to canonical `Area` keys.

## Today dimensions

Today uses three independent dimensions; each result must carry the evidence for the chosen values.

| Dimension | Controlled values (draft) | Evidence requirement |
|---|---|---|
| `moment` | `now`, `morning`, `afternoon`, `sunset`, `evening`, `late` | time context; no claim of live availability |
| `need` | `eat`, `coffee`, `swim`, `unwind`, `date`, `work`, `culture`, `move`, `stay` | editorial fit mapped to Place/Experience |
| `pace` | `quick`, `easy`, `social`, `special`, `active` | editorial rationale, never inferred from price alone |

## Shortlist semantics

`/my-day` must eventually return exactly:

1. `best_choice`;
2. `backup`;
3. `contrast`.

Each slot contains `place_or_experience_id`, `area_id`, `fit_reasons`, `not_ideal_reasons?`, `confidence`, `freshness_at` and a verified action set. If fewer than three district-honest results exist, return an explicit `partial` or `empty` state and explain the limitation. Do not fill silently from another district.

## Editorial labels

| Label | Meaning | Forbidden shortcut |
|---|---|---|
| `best_for` | positive fit supported by editorial evidence | do not invert `not_for` to create it |
| `not_ideal_for` | contextual limitation | no unsupported negative or anti-list claim |
| `fits_this_moment` | decision-language for current context | not equivalent to `open_now` |
| `check_before_going` | volatile detail needs confirmation | do not present as verified current fact |
| `verified` | status plus date exists | never display a bare boolean |
| `open_now` | derived from verified current hours | unavailable when hours are unknown/stale |
| `official` | action target individually verified | do not infer from domain appearance |

## Action taxonomy

Allowed action keys: `reserve`, `delivery`, `takeaway`, `preorder`, `website`, `whatsapp`, `directions`, `menu`.

Actions are capabilities, not promises. `reservation_click` is intent. `confirmed` and `seated` are separate stages; only seated is billable under MONEY-001.

## Deprecation and collision rules

- `Sponsored`, `Featured`, `paid rank`, `category sponsorship` and `visibility tier` are forbidden taxonomy values for public selection.
- `Scenario` remains reserved until explicit approval; existing launch shortcut labels are provisional.
- `District`, `Venue`, `Perk`, `SavedPlace` and `ContentPage` are legacy implementation vocabulary and require Migration Map V1 mapping.
- A synonym cannot change canonical URL ownership or create a new indexable page.

## Approval and non-goals

This draft is ready for editorial/product review. It does not change current labels, filters, ranking, routes, redirects, schema, events or UI.
