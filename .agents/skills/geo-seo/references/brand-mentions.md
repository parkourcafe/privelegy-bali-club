# Brand mentions and entity authority

## The claim

Upstream reports an Ahrefs study published December 2025 across 75,000 brands
finding that **unlinked brand mentions** predict AI citation better than Domain
Rating or backlink count — roughly 3x stronger correlation than backlinks — and
that *where* the mention appears matters enormously, because AI training and
retrieval disproportionately index high-engagement platforms.

Upstream's claim, unverified here — overlay §8. Treat it as a prioritisation
hypothesis, not a fact to repeat.

## Platform weighting

Ordered by reported influence on AI citation:

| Platform | Why it carries weight |
|---|---|
| Wikipedia | 47.9% of ChatGPT citations. The single strongest entity anchor. |
| Reddit | 46.7% of Perplexity citations, 11.3% of ChatGPT's. Community validation. |
| YouTube | Weighted heavily by Gemini; transcripts are indexed text. |
| Wikidata | Machine-readable entity graph; feeds Knowledge Graph and several engines. |
| LinkedIn | Organisation entity confirmation. |
| Major press | Authority and entity grounding. |
| Niche forums, Hacker News, Quora | Perplexity indexes these heavily. |
| Crunchbase and directories | Entity consistency signals. |

## Scanning

```bash
.agents/skills/geo-seo/scripts/.venv/bin/python \
  .agents/skills/geo-seo/scripts/brand_scanner.py "Other Bali" otherbali.com
```

It queries public pages on those platforms for the brand name and domain and
reports what it finds. It stores nothing and reads only public content, but it
is outbound traffic to third parties — do not loop it.

Two cautions specific to our brand name. "Other Bali" is a common English word
pair, so raw mention counts will be badly inflated by unrelated text; read the
matches, not the number. And the legacy names — "Bali Privilege", the
`privelegy-bali-club` repository slug — will surface historical results that
are not the current product. Scan for the public product name and treat legacy
hits as noise.

## Scoring

100 points, weighted by platform influence: Wikipedia presence 20, Wikidata
entity 15, Reddit presence 20, YouTube 15, press and authoritative backlinks
15, LinkedIn and directories 10, entity consistency across all of them 5.

Entity consistency is the row most often lost for free: the same name, founding
date, location and official URL must appear identically everywhere. A brand
that is "Other Bali" in one place and "Bali Privilege" in another reads to a
model as two weakly-attested entities rather than one well-attested one. Given
this repository's own naming history, that is a live risk worth auditing before
anything else on this page.

## What is actually actionable here

Most of this page describes things that take months and are not fully within
our control. Be honest about that in any report rather than listing nine work
items of which two are real.

**Legitimate and available now:**

- **Wikidata item.** States verifiable facts only — official website, instance
  of, area covered. No notability bar comparable to Wikipedia's. Directly feeds
  the entity graph several engines read.
- **Entity consistency pass.** Audit every existing off-site listing for name,
  URL and description agreement. Cheap, entirely in our control, and the
  repository's rename history makes it likely to find real discrepancies.
- **Bing Webmaster Tools.** Covered in `references/platforms.md`; listed again
  because it is the most-neglected free win and it serves two engines.

**Not available, and not a gap to close:**

- **Wikipedia.** Notability is not currently met. Creating an article for a
  non-notable subject is against Wikipedia policy, gets deleted, and is a
  reputational risk. Do not attempt it, and do not carry it as a work item.
- **Press coverage.** Real, slow, and a founder decision rather than an audit
  output.

**Requires a decision, not a task:**

- **Reddit.** Worth 20 points on Perplexity and genuinely influential. Also a
  community with strong anti-promotion norms, where inauthentic participation
  would be both ineffective and directly corrosive to the product's central
  claim that its rankings cannot be bought (guardrail #7). Authentic, useful
  participation is legitimate; astroturfing is not, and the line between them
  is a judgement for Selena. Surface it as a decision. Never action it from an
  audit score.

## The honest framing

Other Bali's off-site entity presence is thin, and most of the levers are slow
or need founder decisions. That is a fair finding to report. What it is not is
a reason to manufacture presence — bought mentions, planted threads or an
invented Wikipedia entry would all breach the same evidence and integrity rules
that make the on-site content trustworthy in the first place.

The compensating strength is that our on-page original data (`not_for`,
`what_to_order`, verified hours) is the kind of thing that earns citation on
merit once a page is reachable and extractable. Fix those first — they are
fully in our control, and they are what the rest of this skill is for.
