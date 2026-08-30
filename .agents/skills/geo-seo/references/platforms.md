# Platform-specific optimisation

Upstream's headline: only **11% of domains** are cited by both ChatGPT and
Google AI Overviews for the same query. Each engine uses a different index and
different selection logic, so "AI visibility" is not one thing. Upstream's
figure, unverified — overlay §8.

Percentages below are upstream's reported source-share data from late 2025 /
early 2026. They inform prioritisation. They are not our findings and must not
be quoted as such.

## Google AI Overviews

**Selection:** 92% of citations come from pages already in the top 10 organic —
traditional SEO is the gateway. But 47% come from pages below position 5, so
AIO has its own logic favouring clarity and directness over rank. Featured
snippet optimisation overlaps ~70%.

**Checklist:** question-based H2/H3 matching real queries (mirror "People Also
Ask" phrasing); a direct 1–2 sentence answer immediately after each question
heading; tables for any comparison; ordered lists for processes; a real FAQ
section of 5–10 questions; defined terms in "**X** is …" form; statistics with
attribution; visible publication and updated dates; author byline; target pages
within 3 clicks of home.

| Criterion | Points |
|---|---|
| Ranks top 10 for target queries | 20 |
| Question-based headings | 10 |
| Direct answers after headings | 15 |
| Tables for comparison data | 10 |
| Lists for processes/features | 10 |
| FAQ with 5+ questions | 10 |
| Statistics with citations | 10 |
| Publication/updated date visible | 5 |
| Author byline with credentials | 5 |
| Clean URL and heading hierarchy | 5 |

**For us:** the byline row is N/A (overlay §4). The dates row is *not* — it
maps to `last_verified_at`, and surfacing verification dates on public pages
serves trust and AIO simultaneously. The strongest available move is
question-shaped headings on district and intent pages, since those already
match how the product thinks: "the right place for the moment you're in" is
already a question-and-answer structure.

## ChatGPT Search

**Selection:** built on **Bing's index**, not Google's. Top source domains:
Wikipedia 47.9%, Reddit 11.3%, then YouTube and major news. Weights entity
recognition heavily — a brand that exists as a structured entity (Wikipedia,
Wikidata, Crunchbase) is far likelier to be cited. Prefers established,
comprehensive sources and tends to cite the most canonical source rather than
the original.

| Criterion | Points |
|---|---|
| Wikipedia article exists and is accurate | 20 |
| Wikidata entity with 5+ properties | 10 |
| Bing index coverage of key pages | 10 |
| Reddit brand mentions | 10 |
| YouTube channel with relevant content | 10 |
| Authoritative backlinks (.edu, .gov, press) | 15 |
| Entity consistency across platforms | 10 |
| Content comprehensiveness (2000+ words) | 10 |
| Bing Webmaster Tools configured | 5 |

**For us:** the cheapest real wins are **Bing Webmaster Tools registration and
Bing index coverage** — 15 points, entirely within our control, and commonly
neglected because everyone checks Google. Verify with `site:otherbali.com` on
Bing, not Google. Wikipedia is not currently attainable on notability grounds
and should not be attempted; a **Wikidata item is** attainable and legitimate,
since it states only verifiable facts (official website, instance of, founding,
location).

## Perplexity

**Selection:** Reddit 46.7% of citations, then Wikipedia, YouTube, major
publications. The heaviest community-validation weighting of any engine, and
the strongest recency preference. Cites 5–15 sources per answer, so there is
more room for mid-authority sites to appear.

| Criterion | Points |
|---|---|
| Active Reddit presence in relevant subreddits | 20 |
| Forum/community mentions (HN, Quora, niche) | 10 |
| Content freshness (updated within 6 months) | 10 |
| Original research/data published | 15 |
| YouTube content with transcripts | 10 |
| Quotable standalone paragraphs | 10 |
| Multi-source claim validation | 10 |
| Discussion-generating content | 10 |
| Wikipedia/Wikidata presence | 5 |

**For us:** the most winnable engine, for two reasons. It cites many sources
per answer, and it weights original data heavily — and `not_for` is original
data that no aggregator holds. Freshness maps directly to `last_verified_at`.

The Reddit row is worth 20 points and is a genuine strategic question, not a
task: r/bali is an active community with strong norms against promotion, and
inauthentic participation would be both ineffective and a reputational risk to
a product whose entire claim is that its rankings cannot be bought. Do not
action this row from an audit. It needs a decision from Selena.

## Google Gemini

**Selection:** Google's index plus heavy weighting toward Google properties.
YouTube weighted far more than in standard Search. Reads Google Business
Profile directly. Uses the Knowledge Graph. Consumes Schema.org markup more
aggressively than other engines. Multi-modal.

| Criterion | Points |
|---|---|
| Google Knowledge Panel | 15 |
| Google Business Profile complete | 10 |
| YouTube channel with chapters | 20 |
| Schema.org structured data | 15 |
| Google ecosystem presence (Scholar, News, Maps) | 10 |
| Image optimisation (alt text, filenames) | 10 |
| E-E-A-T signals | 10 |
| Google Merchant Center | 5 |
| Multi-modal content | 5 |

**For us:** structured data is the row we control outright, and
`otherbali-schema-markup` already governs it — the measured jump from zero
`openingHours` / `geo` / `telephone` / `image` on venue pages to gated emission
is exactly this row moving. Image optimisation is real headroom on a
photo-heavy catalogue.

Google Business Profile is a venue's asset, not ours — do not claim or edit
venue GBP listings. Merchant Center is N/A (guardrail #6, no tourist-side
payments).

## Bing Copilot

Behaves close to Gemini in preference — high-authority domains, clear factual
claims, concise answer blocks — but draws on Bing's index, so it shares
ChatGPT's dependency on Bing coverage. Optimising Bing indexing serves both.

## Reading a platform spread

A high AIO score with a low ChatGPT score means content is good and entity
presence is thin — work Bing coverage and Wikidata. The reverse means the
entity is recognised but pages are not extractable — work
`references/citability.md`. A uniformly low spread with a passing technical
score usually means the content is fine and nobody has ever linked to it;
that is `references/brand-mentions.md`, and it is the slowest to move.
