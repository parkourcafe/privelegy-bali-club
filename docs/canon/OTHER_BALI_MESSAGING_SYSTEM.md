# Other Bali — messaging system

Status: approved product messaging

Approved: 2026-07-30, Asia/Makassar

Decision owner: Selena

Decision reference: `MESSAGING-001`

## The idea

Other Bali is not another directory of everything that exists on the island.
It is a resident-curated decision and planning guide that helps people choose
the right place, route or plan for the moment they are in, then take the next
clear action.

The strongest benefit is fewer, better decisions:

> Other Bali is not about finding more places. It is about making a better
> choice.

## Messaging hierarchy

### Canonical product promise

> **The right place for the moment you’re in.**

This is the durable explanation of what the product does.

### Campaign and participation line

> **Discover Bali together.**

`Together` means choosing, sharing and planning with a partner, friends, family
or group the traveller already knows.

It does not mean social discovery. Until those capabilities genuinely ship, do
not use `Find new friends`, `Meet people`, `People near you`, public profiles,
following, chat, dating, social matching or similar claims.

### Product proof

> **Resident-curated places, routes and plans for every Bali moment.**

Use this immediately after the campaign line when the reader needs a concrete
explanation of the product. `Every Bali moment` is umbrella positioning for
the supported decision contexts, not a claim of exhaustive island coverage.

### Outcome line

> **Less searching. More Bali.**

Use this as the short emotional payoff, not as a substitute for factual store
metadata.

## Product journey

```text
Discover → Choose → Plan → Share → Go
```

- **Discover:** browse or swipe through curated places and verified events.
- **Choose:** use moment, area, company and budget context to understand fit.
- **Plan:** add places and events to Today or create an editable 3/5/7/10-day
  personal Trip from scratch or from published routes.
- **Share:** send a public place or ready-made route through the device share
  sheet.
- **Go:** continue to external Maps or an official provider page.

## Current mobile-release claims

### Safe to claim

- resident-curated Bali places and ready-made routes;
- a swipeable Discover feed and structured decision flow;
- filters by area, company, moment and budget where available;
- a personal Today plan;
- creation and on-device editing of a 3/5/7/10-day personal Trip;
- moving, reordering, replacing, skipping and removing Trip stops;
- private notes on Trip stops;
- verified active events when the public feed contains them;
- on-device saved places and routes;
- offline access to downloaded/saved public summaries and the personal Trip;
- sharing a public place or ready-made route through the device share sheet;
- handoff to external Maps and official provider pages.

### Do not claim yet

- finding new friends or discovering other users;
- user profiles, following, messaging, chat or social matching;
- collaborative Trip editing, voting or invitations in the current mobile app;
- sharing the user-authored personal Trip from the current mobile app;
- live availability, live opening status, live prices or booking inventory;
- owned turn-by-turn navigation or downloadable offline maps unless the
  provider capability is explicitly active and device-verified in that release.

## One-sentence product description

> Other Bali helps couples, friends and families discover resident-curated
> places, choose ready-made routes, build a personal Bali Trip and share useful
> recommendations with the people they already travel with.

## Together implementation rule

The public `/together` explainer may show how a real place or route is shared.
It must never generate a fake `/r/...` URL, promise collaborative choice/voting,
show a universal booking action or imply that Other Bali searches a people
directory. When the explainer has no selected place, its action must send the
traveller to the real catalogue to choose one.

## Voice

Calm, specific and useful. Other Bali sounds like a knowledgeable local friend,
not a hype blog, booking marketplace, social network or exhaustive directory.
Prefer a short reason to choose over an adjective. Unknown facts remain hidden
or explicitly unverified.
