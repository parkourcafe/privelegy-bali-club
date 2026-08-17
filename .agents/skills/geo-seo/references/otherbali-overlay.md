# The Other Bali overlay — what this repository refuses from upstream GEO advice

Read this before acting on anything in the other reference files. Upstream
`geo-seo-claude` was written for a GEO consultancy auditing arbitrary client
sites. Other Bali is not an arbitrary client site: it is a product with hard
guardrails in `AGENTS.md` §4 and an editorial contract it cannot buy its way
out of. Several pieces of upstream advice are, applied here, guardrail
violations.

The rule for every conflict below is the same: **`AGENTS.md` wins, and the
`otherbali-*` skill wins over the `geo-*` reference.** Nothing in this skill
amends product truth.

## 1. Ratings and reviews stay out of the markup

Upstream `references/schema.md` lists `aggregateRating` and a `review` array as
"recommended for GEO" on `LocalBusiness`, and the upstream
`schema/local-business.json` template ships a populated `aggregateRating` block.
`assets/schema-templates/local-business.json` in this repository has that block
removed and a comment in its place.

Guardrail #2 forbids Google review scraping or republishing: no review prose,
no ratings, no review-derived claims in public content. We hold no first-party
rating of our own. So there is no legitimate source for an `aggregateRating`
value on an Other Bali page — emitting one would mean either republishing
Google's rating or inventing a number, and guardrail #10 forbids the second as
firmly as #2 forbids the first.

This is not a permanent technical judgment, it is a policy one. It changes only
with a dated architecture decision from Selena, in the manner of the photo
decisions recorded at the end of `AGENTS.md`. Until then, an agent that adds
rating stars "because the GEO audit recommended it" has shipped a guardrail
violation that looks like an improvement.

**For anything touching venue or guide JSON-LD, `otherbali-schema-markup` is
the standard and this skill is not.** Use `references/schema.md` here only for
site-level entities that skill does not cover — `Organization`, `WebSite` +
`SearchAction` — and for the general detection/validation procedure.

## 2. "Add statistics" is not permission to invent them

`references/citability.md` scores content on statistical density and will
reward "5+ specific statistics per 500 words". It was written for consultants
advising clients who have their own data.

Every factual public claim on Other Bali must come from an official
venue/provider source, a partner submission, a recorded editorial visit, or an
approved internal evidence record (`AGENTS.md` §13). Unknown is `null`, hidden
or `needs_verification` — never a plausible number.

A low citability score caused by missing facts is a **data-collection finding**,
not a writing finding. The fix runs through `otherbali-data-ops-run` to collect
the fact with a source URL, then `otherbali-venue-record-standard` to write it
into the record. It does not run through a rewrite that adds confident numbers.

The citability rubric's real use here: it explains *why* the venue record
standard demands `price_anchor` and `what_to_order` in the shape it does. Read
it as diagnosis, never as a licence to fill gaps.

## 3. Venue copy lives in the record, not the page

Upstream assumes you edit pages. On Other Bali, district pages, guide cards and
place pages are assembled at render time from `venues` rows. A citability or
E-E-A-T finding about a venue's description is a finding about
`why_its_here` / `best_for` / `not_for` / `price_anchor` / `what_to_order`, and
`otherbali-venue-record-standard` governs those fields.

Do not "improve a page" by editing `.tsx` when the weakness is in the data. See
`otherbali-guide-page-standard` for the required block order and its
`scripts/check-page.mjs` gate, which is the pass/fail authority — not the
upstream scoring rubrics, which produce advisory numbers only.

## 4. E-E-A-T author signals do not map cleanly onto us

`references/content-eeat.md` awards points for author bylines, credentials,
author pages, `sameAs` to LinkedIn/ORCID, speaker credentials and peer-reviewed
publication. Other Bali publishes in a single editorial voice, not under
personal bylines, and inventing an author persona to score points would be
fabricated provenance under guardrail #10.

What transfers honestly is the *trust* column: `last_verified_at` on records,
visible verification dates, source attribution on captured menu facts, accurate
disclosure of external provider handoffs, and the "prices as of `<date>`"
treatment already required by the content publication rule. Score those. Treat
the byline rows as not-applicable rather than as a gap to close.

The Trustworthiness row "Reviews and testimonials from real customers" is
subject to §1 above.

## 5. llms.txt is already ours and it is dynamic

`references/llmstxt.md` describes generating a static `/llms.txt` and writing
it to the web root. **This repository already serves one** from
`app/llms.txt/route.ts`, built at request time from `PILLARS`, the district
hubs and intent spokes, `SCENARIOS`, `GUIDES` and `LIGHT_DISTRICTS`, with
`revalidate = 3600`.

Never add `public/llms.txt`. A static file at the web root would be served by
Next ahead of the route and would silently freeze the site map at whatever day
it was generated — a stale file that looks maintained. Improvements go into the
route.

The upstream *format rules* still apply and are worth checking the route
against: H1 title, a `>` blockquote description under 200 characters, H2
sections, `- [Title](absolute URL): description` entries, 10–30 entries in the
concise file. The `## Key Facts` and `## Contact` sections upstream recommends
are subject to §2 — only facts that already pass the evidence rule.

## 6. robots.txt is code, and it is under test

`references/crawlers.md` recommends editing `robots.txt`. Ours is generated by
`app/robots.ts` and asserted by `app/robots.test.ts`, which is in the default
`npm test` list. Any change goes through the route and the test, never through
a hand-written file.

Current state, measured: `app/robots.ts` emits a single `userAgent: "*"` rule
allowing `/` with operational surfaces disallowed, and no AI-crawler-specific
rules at all. Under the robots.txt standard a crawler with no matching
user-agent group falls back to `*`, so **every AI crawler in the upstream tier
list is currently allowed** — GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
PerplexityBot, Google-Extended and the rest. Nothing is blocked and nothing is
broken.

So the honest finding for Other Bali is not "you are blocking AI crawlers". It
is that the allowance is implicit. Whether to make it explicit is a real
decision with a real trade-off, and this skill does not get to make it
unilaterally: explicit per-bot groups are self-documenting and survive a future
tightening of the `*` rule, but they also duplicate state that must then be
kept in sync with the `*` group, and each named group is a place a future
`disallow` can be forgotten.

Also note the non-production branch: when `VERCEL_ENV !== "production"` the
route disallows everything. Any preview-URL crawl check will correctly report a
fully blocked site. That is intended. Do not "fix" it.

## 7. There is no client, and there is no proposal

The upstream skills `geo-prospect`, `geo-proposal` and `geo-compare` are agency
sales tooling — a CRM pipeline, priced service packages, and a monthly
retention report. They are **not vendored**, for two reasons.

First, they are inapplicable: Other Bali is its own site, there is no client to
invoice, and guardrail #6 forbids tourist-side payments while #8 restricts the
money model to a fixed fee on a confirmed seated booking. A skill whose job is
to generate priced service packages has nothing to price.

Second, they would mis-trigger. Their descriptions fire on "prospect", "lead",
"client" and "pipeline" — exactly the vocabulary of owner outreach, which in
this repository belongs to `venue-reverse-magnet`. Vendoring them would put a
GEO-agency CRM in competition with the owner-outreach skill on every outreach
request.

`geo-report-pdf` is also not vendored: it hard-codes
`/Applications/Google Chrome.app/` and requires `pandoc`, neither of which
exists in this environment.

If you want any of these later, they are in the upstream repository named in
`UPSTREAM.md`.

## 8. Reported market figures are upstream's, not ours

The reference files carry upstream's headline numbers — "+527% AI-referred
sessions", "Reddit 46.7% of Perplexity citations", "134–167 words", "3x
stronger correlation than backlinks". They are reproduced because the rubrics
are built on them and stripping them would leave the thresholds unexplained.

They are **secondary claims from a third-party repository, dated late 2025 to
early 2026, and this repository has verified none of them.** They may inform
internal prioritisation. They may not be republished on an Other Bali public
page, quoted to a venue owner, or put in a deck as our finding, because they
would fail the same evidence rule in §2 that we apply to everything else.

## 9. English is the source language

Guardrail #15: canonical public source language is English; internal
documentation and QA are Russian. Upstream carries Italian trigger vocabulary
in some skill descriptions ("preventivo", "offerta", "confronta") — an artefact
of its author, and dropped here.

Nothing in this skill authorises machine-translating prices, access rules,
warnings or offers into the non-English UI chrome the repository already
supports. See the locale preservation note at the end of `AGENTS.md`.
