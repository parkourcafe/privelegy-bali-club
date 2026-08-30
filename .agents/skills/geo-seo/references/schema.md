# Structured data

> **`otherbali-schema-markup` is the standard for anything venue- or
> guide-shaped, and it overrides this file.** Read `otherbali-overlay.md` §1
> before touching markup: upstream recommends `aggregateRating` and `review`
> for `LocalBusiness`, and both are forbidden here by guardrail #2.
>
> Use this file for the detection and validation *procedure*, and for
> site-level entities `otherbali-schema-markup` does not cover — `Organization`
> and `WebSite` + `SearchAction`.

## Why it matters for AI, specifically

Structured data is not primarily about rich results here. It is how a model
resolves what an entity *is* and how it connects to other entities. A complete
entity graph raises citation probability because it removes ambiguity — the
engine does not have to infer from prose what the page is about.

Which is exactly why a *wrong* value is worse than a missing one, and why
`otherbali-schema-markup` leads with refusal rules. Two false statements
shipped from this area in a single day, neither visible on the page: hours
published twelve hours early from a mis-parsed `pm` marker, and an operator's
working note published as a postal address.

## Detection

**Use `scripts/fetch_page.py`, not `WebFetch`.** `WebFetch` converts HTML to
markdown and strips `<head>`, which removes every JSON-LD block — you will
conclude a page has no structured data when it has plenty.

```bash
.agents/skills/geo-seo/scripts/.venv/bin/python \
  .agents/skills/geo-seo/scripts/fetch_page.py https://www.otherbali.com/places/<slug> page
```

The output carries a `structured_data` array of parsed JSON-LD blocks.

- **JSON-LD** — `<script type="application/ld+json">`. Collect all blocks; a
  page may carry several.
- **Microdata** — `itemscope` / `itemtype` / `itemprop`. Harder for AI crawlers
  to parse; flag for migration to JSON-LD.
- **RDFa** — `typeof` / `property` / `vocab`. Same recommendation.

JSON-LD is the format to use. Google, Bing and the AI platforms all process it
most reliably, and it is what this repository emits.

## Validation

For each block:

1. **Valid JSON** — no trailing commas, unquoted keys, malformed strings.
2. **Recognised `@type`** — check against schema.org.
3. **Required properties present** for the type.
4. **Recommended properties** that aid entity resolution.
5. **`sameAs`** links to other platform presences, each a validated URL.
6. **URLs resolve** — a 404 in `sameAs` or `url` is a broken entity edge.
7. **Correct nesting** — `author` inside `Article`, `address` inside
   `Organization`.
8. **Server-rendered, not JS-injected.** Per Google's December 2025 guidance,
   JavaScript-injected structured data may face delayed processing. Verify with
   `curl -s <url> | grep 'application/ld+json'` — if it is absent from raw HTML
   it is not reliably visible. Our public pages are Server Components, so this
   should pass; verify rather than assume.

## Site-level types

### Organization

How a model identifies what the business is.

**Required:** `@type`, `name`, `url`, `logo`.

**Worth adding for entity resolution:** `description`, `sameAs` (every official
platform presence), `foundingDate`, `address`, `contactPoint`, `areaServed`,
`knowsAbout`.

`knowsAbout` is the strongest and most underused signal — an explicit array of
topics the organisation is expert in. For Other Bali the honest values are
territorial and situational: Bali districts we actually cover, and the moments
we actually curate for. Do not list topics with no published coverage behind
them; that is an invented claim under guardrail #10.

`areaServed` should reflect real published coverage, not aspiration.

### WebSite + SearchAction

Declares the site's internal search so engines can offer it directly.

```json
{
  "@type": "WebSite",
  "name": "Other Bali",
  "url": "https://www.otherbali.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.otherbali.com/places?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

`app/places/page.tsx` does accept `q` (alongside `district`, `category`,
`moment`, `intent`, `page`), so this template is accurate as written — verified
2026-08-17. Note that the same route deliberately canonicalizes its
*district-filtered* view onto the district hub so the query-param surface does
not compete with `/bali/[district]` for ranking; that is about `district`, not
`q`, and does not affect the `SearchAction`.

Verify the target still works before emitting it. A `SearchAction` pointing at
a route that ignores the parameter is a false statement of the same family as
the address bug.

### FAQPage

Google restricted FAQ rich results to government and health sites in 2023, but
the schema still serves GEO: AI platforms parse it for question–answer
extraction. Worth implementing for machine readability even with no rich result.

Every answer is a public factual claim and needs a source under `AGENTS.md`
§13. An FAQ generated to fill the schema is exactly the invented content
guardrail #10 forbids.

## Venue and guide types — not this file

`LocalBusiness`, `Restaurant`, `Place` and everything emitted by
`app/places/[slug]/page.tsx` are governed by `otherbali-schema-markup`, which
documents each field, its source column, and its gate:
`publishableStreetAddress` for addresses, `schemaOpeningHours` /
`buildOpeningHoursSpec` for hours, `venueSchemaType` for the type,
`priceBand` for `priceRange`, and both-present-and-finite for `geo`.

Emit the result of a gate, never a raw column. Omit rather than approximate.
Write the test for the refusal.

**Forbidden regardless of what an audit recommends:** `aggregateRating`,
`review`. Overlay §1.

## Templates

`assets/schema-templates/` carries upstream's JSON-LD templates as starting
points. `local-business.json` has had its `aggregateRating` block removed and
replaced with a comment recording why. The others are unmodified upstream and
carry no Other Bali review; treat them as reference shapes, not as approved
markup, and route any venue use through `otherbali-schema-markup`.
