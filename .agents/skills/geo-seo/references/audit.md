# Running a full audit

## Scope first

Upstream audits arbitrary client sites and must discover structure. We know our
own. Skip discovery and pick a representative sample instead — an audit of
"otherbali.com" as a single object produces findings too vague to action,
because our page types differ more from each other than most sites' do.

Minimum useful sample, one of each:

| Page type | Example | What it tests |
|---|---|---|
| District pillar | `/canggu` | Deep editorial content |
| District hub | `/bali/<district>` | Programmatic assembly |
| Intent spoke | `/bali/<district>/<intent>` | The "best X in Y" shape |
| Place page | `/places/<slug>` | Venue markup and record fields |
| Guide | `/guides/...` | Long-form prose |
| Home | `/` | Entity and site-level markup |

## Sequence

Run in dependency order (`SKILL.md`, "Order of work"). A citability finding on
an unreachable page is wasted effort, so do not parallelise across the
reachable → parseable → extractable chain. Within a stage, pages are
independent.

1. **Reachable** — `crawlers.md`. Production URLs only; preview deployments
   disallow everything by design.
2. **Parseable** — `technical.md` §7 (SSR) via `curl`, then the rest.
3. **Findable** — `llmstxt.md`, sitemap, internal linking.
4. **Extractable** — `citability.md` per page in the sample.
5. **Attributable** — `schema.md`, deferring to `otherbali-schema-markup`.
6. **Corroborated** — `brand-mentions.md`, `platforms.md`. Once per site, not
   per page.

## Composite

```txt
GEO = Citability·0.25 + Brand·0.20 + E-E-A-T·0.20
    + Technical·0.15 + Schema·0.10 + Platform·0.10
```

| Band | Reading |
|---|---|
| 80–100 | Strong. Reachable, extractable, well-attested. |
| 60–79 | Solid foundations, specific gaps. |
| 40–59 | Fundamentals present, AI surface underdeveloped. |
| 20–39 | Significant gaps across categories. |
| 0–19 | Largely invisible to AI search. |

Three things to state whenever you report a number.

**It is self-assessed.** Every input is an agent's judgement against a rubric,
not a measurement. Two agents will not agree within ten points. Useful for
tracking one site against itself; worthless as a precise claim.

**Brand and E-E-A-T are structurally capped for us** at roughly 11/25 and 16/25
on two of four pillars — no bylines, no Wikipedia, no Reddit strategy. That is
40% of the composite carrying a built-in penalty for things that are not
defects. See `content-eeat.md` and overlay §4. A composite in the 50s can
coexist with excellent pages.

**Report the spread, not just the total.** `platforms.md` closes with how to
read one.

## Writing findings

Each finding needs: the page, the category, what is wrong, **which skill owns
the fix**, and the evidence you observed. Most findings are not this skill's to
resolve:

| Finding shape | Owner |
|---|---|
| Weak or missing venue copy | `otherbali-venue-record-standard` |
| Field empty across many records | `otherbali-data-ops-run` |
| Markup missing, wrong or forbidden | `otherbali-schema-markup` |
| Page structure, block order, publishability | `otherbali-guide-page-standard` |
| URL should/shouldn't exist, cannibalization | `otherbali-district-seo-pipeline` |
| Any resulting database write | `otherbali-supabase-write` |
| Crawler access, SSR, llms.txt, technical | this skill |

A finding that says "rewrite this description to be more citable" is wrong
twice over: the copy lives in a `venues` row, and rewriting without evidence
produces fluent invention. Write it as "`why_its_here` for `<slug>` opens
narratively and states no verifiable fact — route to data collection for a
price anchor and signature dish, then to the record standard."

## Before reporting

- Every number is either measured or labelled as a judgement.
- No upstream market statistic is presented as our finding (overlay §8).
- No recommendation would breach a guardrail if executed — check the "must
  never do" list in `SKILL.md`.
- Rows marked N/A in `content-eeat.md` are not listed as gaps.
- Reddit and press appear as decisions for Selena, not as tasks.
- Findings are attributed to owning skills, not left as loose prose.

## Output

Write to `docs/` if the audit is a deliverable someone will act on later;
otherwise report inline. Do not create the upstream `GEO-*.md` files at the
repository root — root docs are coordinator-owned after baseline
(`AGENTS.md` §15), and a scatter of audit artefacts at root is exactly the
drift the handoff discipline exists to prevent.
