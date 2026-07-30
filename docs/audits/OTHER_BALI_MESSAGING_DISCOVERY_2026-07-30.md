# Other Bali messaging discovery — 2026-07-30

Status: discovery complete; implementation not yet released

## Source inspected

- Repository: `parkourcafe/privelegy-bali-club`
- Working branch: `codex/discover-bali-messaging-20260730`
- Baseline: `64818bebe180cfa5204fe6e8378b6b75f9de05a0`
- Production architecture: Today, Discover/Explore, Trip/Plan and My Bali
- Current mobile capabilities inspected: curated discovery feed, deterministic
  decision flow, editable 3/5/7/10-day local Trip, saved/offline summaries,
  native sharing of public place and route URLs, and external Maps handoff

## Founder-approved messaging

- Product promise: **The right place for the moment you’re in.**
- Campaign line: **Discover Bali together.**
- Proof: **Resident-curated places, routes and plans for every Bali moment.**
- Outcome: **Less searching. More Bali.**
- “Together” means choosing, sharing and planning with people the traveller
  already knows. It does not mean people search, public profiles, chat, dating
  or a social graph.

## Confirmed conflict

The baseline `/together` design said `Find new friends.` while the same page
also said there was no people search and no member directory. No friend
discovery feature exists in the inspected web or mobile runtime. The release
slice removes that claim before the page is reused in store copy or screenshots.

The baseline `/together` explainer also simulated an opaque `/r/...` link and
choice/booking interactions. The current mobile release shares canonical public
place or route URLs instead and does not provide voting or universal booking.
The release slice replaces those visuals with real catalogue, public-page and
native-share behaviour.

## Smallest complete slice

1. Preserve the existing product architecture and approved visual design.
2. Replace the unsupported friend-discovery promise with the approved campaign
   line and existing-companion language.
3. Align homepage, global metadata, mobile hero, PWA manifest, social card and
   store-listing draft with the same message.
4. Add regression checks that reject `Find new friends` and other social-network
   claims in release-facing surfaces.
5. Rebuild and verify from this exact fresh baseline before any deployment,
   signed artifact capture or store action.

The audit also removed unsupported `live booking` language from the bounded
`/plan/shared` preview. That route represents mood/district/day parameters as a
starting point; it does not load or claim a saved user-authored itinerary.

No schema, migration, ranking, payment, account or social feature is introduced
by this slice.
