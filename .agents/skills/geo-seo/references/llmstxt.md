# llms.txt

> Read `otherbali-overlay.md` §5 first. **We already serve one, from
> `app/llms.txt/route.ts`, dynamically. Never create `public/llms.txt`** — a
> static file would be served ahead of the route and silently freeze the site
> map at its generation date.

## What it is

A convention proposed by Jeremy Howard in September 2024: a Markdown file at
the domain root telling AI systems what a site is and which pages matter. The
inverse of robots.txt — that says what not to fetch, this says what is worth
understanding.

The claimed benefits are comprehension speed, narrative control over which
pages an engine reads first, citation accuracy, and reduced hallucination about
the business. Upstream also claims under 5% adoption as of early 2026, making
it an early-adopter edge. Unverified here — overlay §8. Adoption by the engines
themselves is uneven and none of them documents honouring it, so treat this as
cheap and plausibly useful rather than as a proven lever.

## Format rules

```markdown
# Site Name

> One-sentence description of what the site does. Under 200 characters.

## Section

- [Page Title](https://example.com/page): What this page covers, 10–30 words.
```

- **Title** — first line, H1, official site name.
- **Description** — immediately after, blockquote, under 200 characters,
  factual rather than promotional.
- **Sections** — H2. Conventional names: `Docs`, `Optional`, `Blog`,
  `Products`, `Services`, `About`, `Resources`, `Key Facts`, `Contact`.
- **Entries** — `- [Title](absolute URL): description`. Absolute URLs only.
  Ordered by importance. 10–30 entries total in the concise file.

An extended `/llms-full.txt` may carry 30–100+ entries with 30–100 word
descriptions. We do not serve one and there is no current case for it.

## Our implementation

`app/llms.txt/route.ts`, `revalidate = 3600`. It composes from live data:

| Section | Source |
|---|---|
| District guides (deep) | `PILLARS` + their children |
| District hubs (quick) | `getDistrictHubs()` |
| Quiet corners | `LIGHT_DISTRICTS` |
| Best-of by moment | `getIntentSpokes()` |
| Trip scenarios | `SCENARIOS` |
| Planning & area guides | `GUIDES` |
| Tools | static |

It already satisfies the H1, blockquote-under-200-chars, H2-section and
`- [Title](absolute): description` rules.

## Auditing it

Fetch the live file and check against the format rules and against reality:

```bash
curl -s https://www.otherbali.com/llms.txt
```

1. **Entry count.** The route emits one line per pillar child, hub, light
   district, spoke, scenario and guide. That is well past the 10–30 guidance
   and grows with the catalogue. Whether it has grown past useful is a real
   question worth measuring rather than assuming — count the lines before
   asserting either way.
2. **Every URL resolves.** A spoke or guide removed from the data but still
   listed is a 404 handed directly to an answer engine.
3. **Descriptions are informative.** `p.tagline`, `s.promise`, `g.description`
   flow straight through. A tagline written as marketing copy reads as noise
   here; one that states what the page answers reads as a map.
4. **The blockquote is accurate and current.** It presently states that
   travellers never pay, facts are verified and there are no paid rankings —
   all true and all load-bearing under guardrails #6, #7 and #13. If the
   product boundary moves, this line is a public claim that must move with it.
5. **No unverified facts.** A `## Key Facts` or `## Contact` section is
   permitted by the format but subject to the evidence rule — overlay §2. Do
   not add venue counts, founding dates or coverage claims that no record
   supports.

## Changing it

Edit the route. It is a Server Component route handler reading directly from
`lib/` — do not fetch internal data over HTTP to build it (`AGENTS.md` §7).
Only published, verified data may appear, same as any other public read.

`scripts/llmstxt_generator.py` can validate a fetched file against the format
rules. It can also *generate* one by crawling a site; do not use that mode
against otherbali.com, because its output would be a static snapshot of exactly
the kind overlay §5 forbids. Validation mode only.
