---
name: otherbali-ai-visible-venue
description: >
  Prepare, improve and verify one Other Bali venue so its public place card is
  factually complete, extractable, indexable and measurable in AI search. Use
  for requests such as "make this venue AI-visible", "создай GEO-карточку",
  "улучши карточку ресторана для ChatGPT/Google AI", "add this venue to an
  Other Bali guide", or "record every step from venue research to AI
  measurement". This skill covers one venue at a time and never treats schema,
  sitemap presence or crawler access as proof of AI citation.
---

# Other Bali AI-visible venue

Turn one real venue into an evidence-backed Other Bali record and a public page
that retrieval systems can understand and attribute. Do not promise a mention,
ranking, citation date or ROI. `AI_CITATION_OBSERVED` is an evidence state, not
a synonym for technically correct implementation.

## Required reads

Read `AGENTS.md` and the relevant parts of `Other_Bali_Master_Architecture.md`
before acting. Then use the existing local standards instead of duplicating
them:

- `../otherbali-venue-record-standard/SKILL.md` for editorial fields;
- `../otherbali-data-ops-run/SKILL.md` for collection and row acceptance;
- `../otherbali-schema-markup/SKILL.md` for JSON-LD and refusal gates;
- `../otherbali-guide-page-standard/SKILL.md` when a guide is in scope;
- `../otherbali-supabase-write/SKILL.md` immediately before any database write;
- `../otherbali-district-seo-pipeline/SKILL.md` when the request changes or
  creates a district/guide URL rather than only adding one approved venue.

Read [references/workflow.md](references/workflow.md) for the complete recorded
workflow. Read
[references/field-guide-adaptation.md](references/field-guide-adaptation.md)
when deciding which broader AI-visibility tactics belong to a single restaurant
card and which belong to a site-level or owner-led program. Do not skip phases;
mark an inapplicable phase `SKIPPED` with a reason.

## One run, one venue, one folder

Create or reuse:

```text
data/data-ops/ai-visible-venues/<venue-slug>/
  RUNLOG.md
  evidence-pack.md
  source-manifest.json
  draft-venue-record.json
  entity-consistency.json
  citation-source-map.json
  measurement-plan.json
  menu-implementation-candidate.json  # only when a verified menu is captured
```

Start from the templates in `assets/`. Keep the folder outside compiler/import
batch paths until a human has approved promotion.

When an official menu is available only as an image or PDF, preserve the
original asset and transcribe only visually verified facts into
`menu-implementation-candidate.json`. Use the repository's existing
`Menu`/`MenuSection`/`MenuItem` contract: store prices in minor currency units,
preserve the source display price, mark a subset `partial`, and keep editorial
and allergen fields empty unless separately verified. The image remains the
source; the structured candidate is the accessible text representation.

After every phase, update `RUNLOG.md` before starting the next phase. Record:

- timestamp and status;
- inputs and exact evidence references;
- decision or change;
- checks run and their actual result;
- blocker or `none`;
- next action and owner.

Allowed phase states are `NOT_STARTED`, `IN_PROGRESS`, `VERIFIED`, `HOLD`,
`UNKNOWN`, `SKIPPED`, `FAILED` and `COMPLETE`. Never convert missing evidence
into a confident value to make the run look complete.

## Evidence and authorization boundaries

- Persist raw evidence before summaries, ledgers or draft copy.
- Prefer the venue's official site, official provider handoff, owner submission
  or recorded Other Bali editorial evidence. Search snippets and AI answers are
  discovery aids, not venue-fact sources.
- Public page or sitemap absence does not prove that no unpublished database
  row exists. Keep database identity `UNKNOWN` until exact dedupe is performed.
- Google ratings, review counts and review-derived claims stay out.
- Volatile facts need a source and verification date. Unknown means `null`,
  hidden or `needs_verification`.
- For restaurant schedules, repeat one schedule across every operating day and
  represent days off separately. If the verified operating rule is `until
  late` or `until the last guest`, keep it as human-readable open-ended service;
  omit the structured closing time instead of inventing one. A confirmed
  open-ended closing is not a publication blocker.
- Separate official facts from Other Bali editorial judgement. A venue owner
  cannot choose `best_for`, `not_for`, warnings or organic rank.
- A booking link is an external handoff. It is not live availability or a
  confirmed booking.
- Do not run paid multi-platform AI measurements without explicit spend
  approval. Offer a free/manual baseline separately.
- Reuse a versioned district/scenario prompt library. Add only a small
  venue-specific layer; do not multiply a full site baseline by every venue.
- Treat Other Bali's own guide inclusion as first-party editorial selection,
  not an independent endorsement. Record ownership/disclosure conflicts.
- Honest review collection, community participation, PR and independent video
  are owner/editor-led optional tracks. The agent may research and draft, but
  may not publish, solicit, negotiate or impersonate without explicit authority.
- Photo-rights research does not block draft preparation under the owner's
  current operating instruction. Before publication, record whether the
  repository's existing hero-media rights gate has been formally aligned with
  that instruction; do not hide the conflict.
- Do not write to production, publish, add to a guide, commit, push, open a PR
  or deploy unless the current user request explicitly authorizes that layer.

## Outcome states

Use the narrowest state supported by evidence:

- `EVIDENCE_PACK_READY`: sources, facts and blockers are recorded.
- `CARD_READY_FOR_REVIEW`: draft record passes the local evidence gates.
- `IMPLEMENTATION_READY`: exact one-record change is prepared and dry-run.
- `PUBLIC_CARD_VERIFIED`: live URL, visible facts, schema, canonical and
  indexability have been checked after publication.
- `AI_MEASUREMENT_ACTIVE`: a fixed prompt library and baseline exist.
- `AI_CITATION_OBSERVED`: a dated grounded answer cites the Other Bali URL.

Never collapse these states into a generic `AI_VISIBLE` claim.

## Draft-pack validation

Run:

```bash
node .agents/skills/otherbali-ai-visible-venue/scripts/validate-draft-pack.mjs \
  data/data-ops/ai-visible-venues/<venue-slug>
```

The validator checks the recording skeleton, publication lock, source
references, entity/citation/measurement artifacts, null handling for
unsupported fields and action status. It does not approve factual claims or
authorize publication; human/editorial review remains required.

If the run includes a structured menu candidate, also run:

```bash
node .agents/skills/otherbali-ai-visible-venue/scripts/validate-menu-candidate.mjs \
  data/data-ops/ai-visible-venues/<venue-slug>/menu-implementation-candidate.json
```

This validates the candidate against the repository's current Data Ops menu
contract. It deliberately rejects publication-unlocked artifacts.
