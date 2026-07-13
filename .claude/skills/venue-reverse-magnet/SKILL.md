---
name: venue-reverse-magnet
description: >
  Use when preparing owner outreach for Other Bali venues — turns a generic
  "please confirm your listing" invite into a per-venue REVERSE lead magnet:
  an already-built, immediately-useful asset (their live listing preview +
  which tourist moments they win) plus honest WhatsApp copy (EN + RU) and the
  real onboarding link. Trigger phrases: "обратный лид-магнит", "reverse lead
  magnet", "prepare outreach for <venue>", "сделай магнит для <заведение>",
  "what do we send owners", batch owner outreach from /admin/invites.
---

# Venue reverse lead magnet (Other Bali)

## The idea in one line

A traditional lead magnet is something the owner has to *do something with*
(read a PDF). A **reverse** lead magnet is something **already built and
working** that we hand them — for us that is **their actual Other Bali listing
page**, which already exists in the database. So the pitch — *"we already made
your page, would it be okay if I sent it?"* — is **literally true for us**, not
a psychological trick. That honesty is the whole point and the reason it keeps
working when AI-written cold email stops.

This skill generates, for one venue or a batch, the full outreach package:
the asset (what they'll see), the message (what we send), and the real link.

## HARD RULES — never break these (they are project guardrails)

1. **Never invent a fact.** Use ONLY what is in our DB / the input: `name`,
   `category`, `area`, `district`, and any already-verified `best_for` /
   `jobs` / `price_anchor` / `what_to_order`. Never fabricate ratings, review
   counts, opening hours, prices, dishes, awards, or "we analysed your
   reviews". If a fact is missing, omit it — do not estimate.
2. **No review scraping / teardown magnets.** We never build a "your Google
   reviews say X" magnet (guardrail #1). Consensus is a manual field process.
3. **No quality warnings / anti-lists.** `Not for` is fit context (WHO/WHEN a
   place suits), never "the food is mixed" (guardrail #7).
4. **Money stays off outside Canggu.** Do NOT offer perks, QR, paid listing,
   or "run a promo" in the outreach. The ask is: confirm the listing + add
   photos + tell us who it's for. Offers exist only in `active_deep` districts
   (Canggu, Ubud) and only later, if the owner chooses (guardrails #4, #5, #6).
5. **English public, Russian founder-facing.** The asset/preview copy and the
   listing itself are English. The WhatsApp message ships in BOTH English and
   Russian (owner picks). Internal notes to Selena may be Russian.
6. **Honest CTA only.** "Would it be okay if I sent you your page / built you a
   moment-fit sheet?" is allowed because we really did it. Never claim we did
   work we didn't (no "I hand-wrote this", no "I personally visited").
7. **No new product entities.** This skill only assembles outreach from what
   the product already has (listing, onboarding page, moment taxonomy). It does
   NOT invent new DB tables, districts, categories, or a tourist chatbot
   (guardrails #2, #11).

## Inputs — get the venue facts first

Pull the venue from Supabase (project `egkdapqwkfprtyqvvnso`, table
`public.venues`) or accept them typed in. You need:

- `slug`, `name`, `category` (`cafe|warung|restaurant|beach_club|spa|bar|surf`)
- `area` (sub-area, e.g. Berawa / Uluwatu), `district`, `status`, `whatsapp`
- any existing `best_for` / `not_for` / `jobs` / `price_anchor` / `what_to_order`

For the **real onboarding link**, get the venue's token via the
`invite_roster` RPC (same source as `/admin/invites`, exposed by
`getInviteRoster()`), then the link is
`https://otherbali.com/onboard/<token>`. Never guess or fabricate a token —
if there is no token yet, say so and stop (the roster mints them).

## The reverse-magnet concepts (pick the best fit per venue)

All are buildable inside the existing architecture — no scraping, no new
entities. Choose by `category` + `district`:

1. **Live Listing Preview** (default, works for every venue).
   The asset = their real `/onboard/<token>` page: "here is exactly how your
   place appears to travellers." Strongest because it is undeniably already
   built. Always include this link.

2. **Moment-Fit Sheet.** Which tourist *moments* this venue wins, drawn from
   the static moment taxonomy (`lib/moments.ts`) matched on category (+ jobs
   if present). Moments and the categories they match:
   - `slow-morning` — cafe, warung
   - `work-session` — cafe (verified: wifi / sockets / quiet before 9am)
   - `midday-reset` — warung, restaurant, surf, spa
   - `golden-hour` — beach_club, bar, restaurant (sunset)
   - `late-dinner` — restaurant, bar
   - `special-occasion` — restaurant (date / celebration)
   - `family-day` — cafe, restaurant, beach_club (kids-friendly)
   Output the 1–3 moments the venue plausibly wins by category, framed as
   "travellers looking for [moment] will be routed to you." Never assert a
   moment the category can't support (a warung is not `golden-hour`).

3. **"How travellers find you" card.** The filter/search paths that surface
   the venue: district → area → category → moment. Shows the owner the demand
   funnel they plug into, using only structural facts.

4. **Fit-context draft** (`Best for` / practical tags) they can edit in one
   tap on the onboarding page. Seed it from category + area only; mark it as a
   *suggestion for them to correct*, never as our verified claim.

Do NOT build: review teardowns, competitor lists, rating scores, deliverability
audits, or anything requiring facts we don't hold.

## Steps each run

1. **Load** the venue facts + onboarding token (above).
2. **Pick the concept**: always #1 (Live Listing Preview) as the spine; add #2
   (Moment-Fit) for food/drink/beach venues; #4 (Fit-context draft) when
   `best_for`/`jobs` are empty. Skip a concept if the data can't support it.
3. **Generate the asset copy** (English, public-ready, honest): 1 editorial
   sentence about the venue's fit (category + area only, no invented facts),
   plus the 1–3 moments, plus a suggested `Best for` line for them to edit.
4. **Write the outreach message** in EN and RU using the honest CTA. Keep it
   to ~2 minutes of owner effort: (1) confirm it's your place, (2) tick who
   you're for, (3) add 1–3 photos. Include the real `/onboard/<token>` link.
   NO offer/promo ask (rule 4). Mirror the tone of the existing
   `app/admin/invites/page.tsx` templates.
5. **Guardrail self-check** before output: no invented facts? no review data?
   no promo ask outside Canggu? English public + RU/EN message? real token?
   If any check fails, fix or omit — do not ship it.

## Output format

Return, per venue:

```
VENUE: <name> · <category> · <area>, <district>
CONCEPT(S): Live Listing Preview [+ Moment-Fit / Fit-context draft]
LINK: https://otherbali.com/onboard/<token>

ASSET (English, owner sees this framing):
  Editorial line: <1 sentence, facts we hold only>
  Moments you win: <1–3 from taxonomy, category-valid>
  Suggested "Best for" (editable by you): <short, honest, no quality claims>

WHATSAPP — EN:
  <message with honest CTA + link, no promo ask>

WHATSAPP — RU:
  <same, Russian>

NOTES (RU, internal): <why this concept, any missing data flagged>
```

For a **batch**, produce one block per venue and, if useful, a CSV mirroring
the `/admin/invites` export columns so Selena can send in bulk.

## What this skill invents each time (tell the user)

- A per-venue **angle**: which already-built asset is most convincing for THIS
  category and area.
- The **editorial one-liner** and **Best-for suggestion** (from real facts,
  editable by the owner — never published as our verdict until verified).
- The **moment mapping**: which tourist moments route to them.
- Fresh **EN + RU WhatsApp copy** tuned to the venue, always with the honest
  "we already built your page" CTA and the real link.

It never invents: facts about the venue, review sentiment, offers, or promises
of money. Those stay off until a real field/consensus check and (for money) a
district unlock.
