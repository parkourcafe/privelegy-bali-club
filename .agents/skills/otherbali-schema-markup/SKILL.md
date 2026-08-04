---
name: otherbali-schema-markup
description: >
  What an Other Bali venue page may state in its structured data, where each
  field comes from, and what is forbidden. Use this when adding or changing
  JSON-LD on a place or guide page, wiring a new database column through to the
  markup, or answering "why don't our cards show up", "add rating stars", "add
  hours/geo/phone to the markup", "почему карточки не отдают факты", "добавить
  рейтинг в разметку", "подключить поле к разметке". Two invisible bugs shipped
  from this area in one day — a venue published as open twelve hours early, and
  operator working notes published as a postal address — so the refusal rules
  here matter more than the emission rules.
---

# Other Bali schema markup

This file is the canonical standard and is agent-neutral: Claude Code, Codex
and any other agent working in this repository read this same file. Claude Code
reaches it through the thin entrypoint at
`.claude/skills/otherbali-schema-markup/SKILL.md`; OpenAI-style agents through
`agents/openai.yaml` beside this file.

## The one idea

**A card that answers nothing Google Maps already answers has no reason to
exist — but a card that answers wrongly is worse than one that stays silent.**

Both halves were demonstrated in a single day.

The first half: a measurement across 25 venue pages found `openingHours`,
`geo`, `telephone` and `image` present on **zero** of them, while the database
held coordinates for 621 venues, phones for 652 and hours for 501. The data was
collected and reaching nobody.

The second half: within hours of wiring those fields through, two of them were
publishing false statements. Hours because a trailing `pm` marker was not
inherited by the first bound, so `5.00-11.00pm` became "open from 05:00".
Address because `venues.full_address` mostly holds an area note — and in some
rows an operator's working note, `Berawa boundary / verify pin` — which went
straight into `PostalAddress.streetAddress`.

Neither is visible on the page. That is the defining property of this area: the
page looks fine either way.

## What the venue page emits

`app/places/[slug]/page.tsx`, the `jsonLd` object. Every field is conditional —
a missing value omits the key rather than emitting an empty one.

| Field | Source | Gate |
|---|---|---|
| `name`, `url` | venue record | — |
| `@type` | `venueSchemaType(category)` | category vocabulary in `lib/venue-presentation.ts` |
| `address.streetAddress` | `content?.address` → `venue.fullAddress` | **`publishableStreetAddress`** — needs a street marker, rejects working notes |
| `address.addressLocality` | micro-area → district label → "Bali" | — |
| `sameAs` | `officialUrl`, `instagramUrl` | validated URL |
| `priceRange` | `priceBand` → band extracted from `priceAnchor` | `$`…`$$$$` only |
| `openingHours` | `schemaOpeningHours(opening_hours_json, opening_hours)` | normalised at the data boundary; legacy text accepted only if already strict |
| `openingHoursSpecification` | `buildOpeningHoursSpec(opening_hours_json)` | per-day; the only form that can carry two services in a day |
| `geo` | `latitude`, `longitude` | both present and finite, or omitted |
| `telephone` | `venue.phone` | — |
| `image` | `venue.photoUrl` | routed through `venuePhotoUrlForDisplay` |
| `hasMap` | `venue.gmapsUrl` | validated Maps URL |

## Rules

### 1. Emit the result of a gate, never the raw column

`image` takes `venue.photoUrl` — the value that already passed
`venuePhotoUrlForDisplay` — not `photo_url` from the database. `streetAddress`
takes `publishableStreetAddress(...)`, not `full_address`.

The reason is future-proofing that costs nothing now: when the photo rights
gate or the address rule tightens, the markup follows automatically. A page
that reads columns directly has to be found and edited again, and it will be
missed.

### 2. Omit rather than approximate

There is no acceptable default for a fact about a real place. No "Bali" as a
street address, no midpoint coordinate, no "open daily" where hours are
unknown. Guardrail #10: unknown means the field is absent.

### 3. Write the test for the refusal

For every field with a gate, the test suite must contain cases that assert the
field is **not** emitted. Success cases catch nothing here — the bugs in this
area are all values that should have been refused and were not. See
`lib/venue-presentation.test.ts` and `lib/opening-hours.test.ts` for the
pattern: real rejected values from the database, quoted verbatim.

### 4. Two services in a day are two entries

A venue with lunch and dinner service has two `OpeningHoursSpecification`
entries for that day, not one span covering both. Collapsing them states the
venue is open through the afternoon gap.

## Forbidden

### `aggregateRating` from Google ratings

`google_rating` and `google_reviews` exist in the database for 139 venues. They
are **not** selected into the public read and must not be emitted.

Publishing them republishes Google's review-derived data, which breaches
guardrail #2 and Google's terms. Star ratings in search results are visibly
attractive, which is exactly why this needs to be written down rather than
re-litigated: it is the one change in this area that can get the site penalised
rather than rewarded. Changing it requires a dated architecture decision from
the founder, not a code change.

### Anything derived from review text

No claims, summaries or "what guests say" paraphrases sourced from review
platforms. A human reading reviews to decide where to look is fine; the output
must then be verified against a primary source and written as Other Bali
editorial.

### Claims about live state

No availability, stock, ETA, delivery fee or service area unless a provider
supplies it. A click is intent, never fulfilment.

## How to verify

**Rich Results Test** — `search.google.com/test/rich-results` — paste the page
URL. It parses the markup as Google does and lists what it found. No terminal
required, so this is the check to hand to a non-developer.

From a terminal, the fast version:

```bash
curl -s https://www.otherbali.com/places/<slug> \
  | grep -o '"geo"\|"telephone"\|"openingHoursSpecification"\|"image"'
```

A field missing here is not automatically a bug — it may simply be null for
that venue, which is the system working. Confirm against the database before
investigating the code.
