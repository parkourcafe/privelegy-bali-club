# Content quality and E-E-A-T

> Read `otherbali-overlay.md` §4 first. Several rows below are **not applicable
> to Other Bali** and scoring them as gaps produces work items that would
> require fabricating provenance. They are marked `N/A` in place.

Google's December 2025 Quality Rater Guidelines update extended E-E-A-T beyond
YMYL to all competitive queries. 100 points, 25 per pillar.

## Experience — 25 points

| Signal | Points | Notes for Other Bali |
|---|---|---|
| First-person accounts | 5 | We publish in editorial voice, not first person. The equivalent evidence is a recorded editorial visit behind the claim. |
| Original research or data not available elsewhere | 5 | **Our strongest row.** `best_for` / `not_for` / `what_to_order` exist nowhere else. |
| Case studies with specific results | 4 | N/A for a travel catalogue. |
| Photos or evidence of direct use | 3 | Venue photography, published under the rights confirmation of 2026-08-04. Fallback art must never be presented as venue photography. |
| Specific examples from direct experience | 4 | `what_to_order` at its best. Generic ("great coffee") scores 0. |
| Demonstration of process, not just outcome | 4 | Partly N/A. The nearest honest equivalent is stating how a fact was verified and when. |

## Expertise — 25 points

| Signal | Points | Notes |
|---|---|---|
| Author credentials visible | 5 | **N/A.** No personal bylines. Inventing one is fabricated provenance — overlay §4. |
| Technical depth appropriate to topic | 5 | Applies. Does a district page know the district, or restate a listicle? |
| Methodology explanation | 4 | Applies, and is underused. How places are selected, and that ranking cannot be bought (guardrail #7), is a genuine expertise signal we can state truthfully. |
| Data-backed claims | 4 | Applies, bounded by the evidence rule — overlay §2. |
| Correct domain terminology | 3 | Applies. Bali place names, area boundaries, local terms used accurately. |
| Dedicated author page | 4 | **N/A.** See above. |

Realistic ceiling here is about 16/25, and the missing 9 are structural, not
fixable. Do not open work to close them.

## Authoritativeness — 25 points

| Signal | Points | Notes |
|---|---|---|
| Inbound citations from authoritative sources | 5 | Applies. Slow to move. |
| Author quoted in press | 4 | **N/A.** |
| Industry awards | 3 | N/A unless real. |
| Speaker credentials | 3 | **N/A.** |
| Published in respected outlets | 4 | N/A. |
| Comprehensive topical coverage | 3 | **Applies and is the one to work.** Depth per district beats breadth across districts — and it is what `otherbali-district-seo-pipeline` already governs. |
| Wikipedia or encyclopedic reference | 3 | Applies in principle; notability is not currently met. |

Structural ceiling around 11/25. `references/brand-mentions.md` covers what can
actually be moved here.

## Trustworthiness — 25 points

The pillar that transfers cleanly and where the product already has real
advantages worth scoring honestly.

| Signal | Points | Notes |
|---|---|---|
| Contact information visible | 4 | Applies. |
| Privacy policy present | 2 | Applies. |
| Terms of service present | 1 | Applies. |
| HTTPS valid | 2 | Applies. |
| Editorial standards or corrections policy | 3 | **Applies, high leverage.** "Facts are verified, no paid rankings" is already asserted in llms.txt; a public editorial-standards statement would make it checkable. |
| Transparent about business model and conflicts | 3 | **Applies, and we can state something most competitors cannot:** travellers never pay, and organic selection cannot be bought (guardrails #6, #7). |
| Reviews and testimonials from customers | 3 | **Forbidden as scored.** Overlay §1 — no review republication, no ratings. Treat as N/A rather than a gap. |
| Accurate claims, no misinformation | 4 | Applies, and `last_verified_at` is the mechanism. Stale hours are a trust defect, not a data defect. |
| Affiliate/sponsorship disclosure | 3 | Applies. Provider handoffs must be disclosed accurately; a click is intent, never confirmed fulfilment (`AGENTS.md` §11). |

Ceiling around 22/25, and most of it is already earned. The gap worth closing
is the editorial-standards page — a small, honest, entirely evidence-backed
piece of work.

## Word count benchmarks

| Page type | Minimum | Ideal |
|---|---|---|
| Homepage | 500 | 500–1,500 |
| Blog post | 1,500 | 1,500–3,000 |
| Pillar / ultimate guide | 2,000 | 2,500–5,000 |
| Product page | 300 | 500–1,500 |
| Service page | 500 | 800–2,000 |
| About page | 300 | 500–1,000 |
| FAQ | 500 | 1,000–2,500 |

Treat these as diagnostic, not as targets. A district page padded to 2,500
words to hit a benchmark scores worse on citability, not better — filler
dilutes every extractable passage around it. `otherbali-guide-page-standard`
sets the real shape.

## Low-quality-content signals to flag

Generic openers ("In today's fast-paced world"); no original insight; no
first-hand specifics; perfect structure over shallow content; abstract
explanation without concrete instances; every section ending on the same note;
hedging without specifics ("it depends on various factors" — which factors?);
no expressed judgement; paragraphs deletable without loss; claims with no
attribution.

Most of these describe a venue description written without a visit. The
detection value is real: a `why_its_here` exhibiting three or more is a record
to route back through `otherbali-data-ops-run` for evidence before it is
rewritten — because rewriting it without evidence just produces fluent
invention, which is worse.
