# Other Bali — Master Product & Technical Architecture

**Repository legacy name:** Bali Privilege  
**Public product:** Other Bali  
**Version:** 1.0-current  
**Date:** 2026-07-13  
**Status:** Canonical product and technical architecture  
**Public category:** Resident-curated decision guide for Bali  
**Internal architecture:** Resident-curated decision and action layer  
**Core promise:** The right place for the moment you’re in.

> **Русское резюме.** Other Bali владеет выбором, объяснением, интерфейсом действий, доверием и атрибуцией. Заведения и внешние провайдеры владеют наличием, исполнением, оплатой, отменами и поддержкой. Google Maps владеет маршрутизацией, трафиком, ETA и пошаговой навигацией. Продукт помогает решить, куда идти и почему, затем передаёт действие правильной системе.

---

## 0. Authority and conflict resolution

On conflict, use this order:

1. `AGENTS.md` — hard operating rules for every coding agent.
2. This file — product boundaries, domain model, system architecture, approved entities and roadmap.
3. `CLAUDE.md` — a thin Claude Code entrypoint that imports `AGENTS.md`; it must not contain a second competing architecture.
4. Applied database migrations and current production code — implementation truth, but not permission to violate items 1–2.
5. `docs/money-model.md`, TablePilot integration documents and named feature handovers — focused implementation detail.
6. Session plans, backlog notes and historical documents — non-authoritative unless promoted here.

Rules:

- Historical Bali Privilege architecture is provenance, not live canon.
- If code contradicts this file, stop, document the mismatch and reconcile deliberately.
- If a proposed feature requires a new product boundary, entity, billing event or privacy model, amend this file before implementation.
- Missing implementation is not permission to invent behaviour.

---

## 1. Product thesis

### 1.1 Public definition

> **Other Bali is a resident-curated decision guide for Bali.**

It helps a traveller or resident choose the right place or service for the moment they are in, based on:

- situation;
- area;
- company;
- mood;
- appetite or service need;
- budget;
- dietary constraints;
- practical constraints;
- trip duration;
- the kind of day they want.

### 1.2 Internal product definition

> **Other Bali is the resident-curated decision and action layer for Bali hospitality and lifestyle.**

It does three things:

1. **Decide:** narrow a messy market into a small, context-fit shortlist.
2. **Explain:** show why each option fits, what to expect, what to order or do, and the practical trade-offs.
3. **Act:** let the user reserve, order, request takeaway or pre-order, open Google Maps, or save the choice through trusted handoffs.

### 1.3 Canonical sentence

> **Other Bali helps you decide where to go and why. Google Maps gets you there.**

### 1.4 Product entry model

The user-facing mental model is **moments**, not database categories.

```txt
User moment / need
→ constraints
→ curated shortlist
→ why each option fits
→ menu and practical details
→ Reserve | Order | Takeaway | Open in Google Maps | Save
→ trusted provider fulfils the action
```

Categories remain necessary for data, filtering and operations. They are not the primary home-screen proposition.

### 1.5 Geographic model

Other Bali retains two product layers:

- **Bali-wide planning and decision layer:** district guides, scenarios, places, verified menus and neutral action handoffs.
- **Active-deep commercial layer:** partner proof, TablePilot billable attribution, confirmed perks, QR redemption and commercial reporting in one active district at a time.

Current active-deep district: `canggu`.

Planning and utility are allowed outside Canggu. Commercial activation remains gated by district status.

---

## 2. Ownership boundaries

### 2.1 Other Bali owns

- moment and mission taxonomy;
- resident/editorial selection;
- recommendation logic;
- `Why it fits`, `Best for`, `Not for` and practical intelligence;
- verified structured venue facts;
- verified menus and menu freshness state;
- editorial `What to order` guidance;
- routes, district guides and scenario pages;
- the action-selection interface;
- provider handoff links and labels;
- saved places, shared lists and My Bali;
- anonymous attribution and aggregate reporting;
- publication, provenance and freshness gates;
- partner-facing content maintenance surfaces;
- explicit separation of organic and sponsored content.

### 2.2 Venues and specialist providers own

- live table inventory;
- booking confirmation, modification, cancellation and no-show handling;
- actual menu availability;
- kitchen operations;
- order acceptance;
- preparation time;
- delivery zones, drivers, timing and delivery fees;
- payments, refunds, disputes and operational support;
- actual delivery of hospitality, wellness, activity or other services.

### 2.3 Google Maps owns

- turn-by-turn navigation;
- route calculation;
- live traffic;
- ETA;
- road closures and navigation conditions;
- navigation-mode choice;
- global place coverage.

Other Bali stores or resolves a verified Google Maps handoff and tracks the outbound navigation action. It does not reproduce Google Maps.

### 2.4 Integration transparency

The user can have a coherent Other Bali experience without being misled about fulfilment.

Use small, clear handoff language where relevant:

- `Continues on TablePilot`;
- `Order on Grab`;
- `Order via the restaurant`;
- `Opens Google Maps`.

A seamless handoff is desirable. Pretending an external system is owned by Other Bali is not.

---

## 3. Hard non-goals

Other Bali is not and must not quietly become:

- a Google Maps clone;
- a global place database competing on quantity;
- a Tripadvisor clone;
- a Google review scraper or republisher;
- a public star-rating product;
- a generic directory or Yellow Pages for Bali;
- a tourist-side payment product;
- a wallet, cash balance or real-money cashback product by default;
- an internally owned booking engine;
- a delivery fleet or courier operator;
- a full order-fulfilment, refund or support platform;
- an AI travel chatbot in the tourist product;
- a paid organic-ranking marketplace;
- a native-app rewrite undertaken before the web/PWA product requires it.

AI may later become a natural-language interface over verified structured data. It may not invent recommendations, facts, availability or fulfilment states.

---

## 4. Product surfaces

### 4.1 Public home

Primary question:

> What kind of Bali moment are you in?

Inputs can include:

- area;
- now / later;
- duration;
- company;
- mood;
- budget;
- dietary needs;
- practical constraints;
- desired action.

Output:

- Top 3 decision-ready matches first;
- a short `Matched because…` explanation;
- an option to widen the result set.

This remains deterministic and structured, not a freeform chatbot.

### 4.2 Scenario and district pages

Use the existing `ContentPage` concept for:

- `scenario`;
- `district_guide`;
- editorial dish guides;
- route guides.

Every page must help make a real decision and funnel into relevant places or actions. Thin programmatic pages are forbidden.

### 4.3 Places catalogue

The catalogue is a secondary discovery surface, not the product thesis.

It supports:

- district;
- area;
- category;
- moment/job;
- price;
- practical tags;
- menu/dietary fit;
- available actions;
- publication/freshness filters internally.

Public pages show only decision-ready records.

### 4.4 Place detail page

Canonical order:

1. venue/service identity and editorial verdict;
2. `Why it fits`;
3. `Best for` / `Not for`;
4. practical information;
5. `What to order` or `What to do`;
6. structured menu where available;
7. action panel;
8. confirmed offer where allowed;
9. owner voice, clearly attributed;
10. similar places and related routes;
11. verification timestamp.

Primary actions:

```txt
Reserve
Order delivery
Takeaway
Pre-order request
Open in Google Maps
Save
```

Only verified and currently published actions appear.

### 4.5 Dining and menu experience

A menu is not merely a PDF link. The target product supports:

- current menu sections;
- item name and description;
- price or price text;
- dietary tags;
- allergen tags where verified;
- availability note;
- image where approved;
- partner recommendation;
- separate Other Bali editorial pick;
- source and verification date;
- official-menu fallback link.

The existing `whatToOrder` editorial field remains valid and may reference menu items without becoming partner-controlled copy.

### 4.6 My Bali

No mandatory account for core use.

Supported layers:

- anonymous saved places via `GuestRef` httpOnly cookie;
- shared read-only lists;
- saved routes and moments when implemented on the same identity model;
- optional contact only with explicit consent;
- reservation/order references only when a provider safely returns them and a later architecture amendment adopts storage.

No `localStorage` or `sessionStorage` identity hacks.

### 4.7 Partner and operator surfaces

Partner capabilities:

- confirm ownership/onboarding;
- upload approved photos;
- maintain official menu data or menu source;
- maintain action links and capabilities;
- see freshness warnings;
- see aggregate attributable demand;
- confirm perks where active-deep policy allows.

Operator capabilities:

- review publication readiness;
- review stale menus and links;
- review source evidence;
- review broken provider handoffs;
- approve editorial fields;
- audit organic/sponsored separation;
- view growth vs partner-proof analytics separately.

---

## 5. System context

```txt
                         ┌───────────────────────────┐
                         │ Traveller / Resident      │
                         └─────────────┬─────────────┘
                                       │
                                       ▼
┌───────────────────────────────────────────────────────────────────┐
│ Other Bali — Next.js web/PWA                                     │
│                                                                   │
│ Moments · District guides · Places · Menus · Actions · My Bali    │
│ Editorial trust · Capability resolution · Attribution             │
└──────────┬──────────────────┬──────────────────┬──────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐
│ Supabase         │  │ Google Maps      │  │ External fulfilment │
│ Postgres + RLS   │  │ navigation       │  │ systems             │
│ RPCs + Storage   │  │ traffic + ETA    │  │                      │
└──────────────────┘  └──────────────────┘  │ TablePilot           │
                                            │ Venue website        │
                                            │ WhatsApp             │
                                            │ GrabFood / GoFood    │
                                            │ ShopeeFood / other   │
                                            └──────────────────────┘
```

Other Bali never proxies a provider merely to conceal that it is external. Server-side mediation is used only when needed for security, attribution or a supported provider API.

---

## 6. Technology stack

Decided stack:

- Next.js 16 App Router;
- React 19;
- TypeScript;
- Tailwind CSS 4 and the existing token system;
- Supabase Postgres;
- Supabase SSR and Auth where required;
- RLS and `SECURITY DEFINER` RPCs for controlled writes;
- Supabase Storage for approved partner assets;
- Vercel hosting;
- PWA first;
- Google Maps deep links for navigation;
- TablePilot for the current billable reservation loop;
- WhatsApp prefilled links for transactional handoffs;
- existing QR library for active-deep offer redemption.

Capacitor may remain in the repository, but it is not permission for a native rewrite. Public product delivery remains web/PWA-first unless architecture is explicitly amended.

---

## 7. Architectural layers

### 7.1 Presentation layer

- Server Components for data-heavy public pages by default.
- Client Components only for interaction, local selection state, tracking and progressive enhancement.
- Mobile-first action targets and safe-area support.
- Public UI English only.
- Admin/founder surfaces may include Russian.

### 7.2 Application layer

Responsible for:

- recommendation queries;
- publication filtering;
- action-capability resolution;
- menu rendering contracts;
- anonymous identity resolution;
- event logging;
- provider handoff construction;
- aggregate report reads.

### 7.3 Domain layer

Contains stable business types and rules. It must not depend on React.

Recommended modules:

```txt
lib/domain/venue.ts
lib/domain/menu.ts
lib/domain/actions.ts
lib/domain/moments.ts
lib/domain/coverage.ts
lib/domain/publication.ts
```

Existing thinner files may be migrated incrementally. Do not perform a repository-wide rename merely for aesthetics.

### 7.4 Data-access layer

Maps snake_case database rows to camelCase domain objects at one boundary.

Requirements:

- explicit selected columns on public reads;
- no service-role key in tourist runtime;
- seed/static fallback only where intentionally supported;
- public queries return published/verified data only;
- internal review paths must be explicit, never accidental query parameters exposed as product features.

### 7.5 Integration layer

Provider adapters resolve a common action contract. They do not own provider operations.

```txt
lib/integrations/tablepilot.ts
lib/integrations/google-maps.ts
lib/integrations/whatsapp.ts
lib/integrations/external-ordering.ts
```

Adapters may be small link builders. Do not invent a large service abstraction where a typed pure function is enough.

---

## 8. Canonical domain model

### 8.1 Existing core concepts retained

```txt
Venue
VenueProductEnrollment
District
ContentPage
RouteStop
Offer / Perk
Redemption
Event
User / Role
GuestRef
ConsentLog
VenueReservationConfig
SavedPlace
SharedList
GuideLead
```

Current TypeScript names such as `Venue`, `Perk`, `PlanEntry`, `RouteDef` and `RouteStopDef` remain implementation types. Reconcile deliberately; do not rename blindly.

### 8.2 Newly adopted concepts

The following concepts are approved by this architecture:

```txt
Menu
MenuSection
MenuItem
VenueActionCapability
```

No `Order`, `Cart`, `Delivery`, `Reservation`, `Courier`, `Payment`, `Refund` or `Wallet` entity is adopted for Other Bali at this stage. Those states belong to external fulfilment systems.

### 8.3 Why only four new concepts

They are sufficient to support:

- verified structured menus;
- menu browsing and dish discovery;
- reserve/delivery/takeaway/pre-order handoffs;
- provider-aware UI;
- freshness and evidence;
- action attribution.

Anything more should be earned by a real integration requirement, not by diagram enthusiasm.

---

## 9. Data model

All schema changes are additive, nullable where possible, idempotent and delivered through new migrations. Never edit an applied migration.

### 9.1 `menus`

Purpose: versioned, source-backed menu publication for one venue.

Recommended fields:

```txt
id                  uuid primary key
venue_slug          text not null references venues(slug)
version             integer not null
name                text not null default 'Main menu'
currency            text not null default 'IDR'
source_type         text not null  -- partner | official_url | editorial_capture
source_url          text
status              text not null  -- draft | review | published | stale | archived
verified_at         timestamptz
expires_at          timestamptz
published_at        timestamptz
superseded_at       timestamptz
created_at          timestamptz not null
updated_at          timestamptz not null
```

Constraints:

- unique `(venue_slug, version)`;
- at most one `published` non-superseded menu per named menu for a venue;
- public read requires `status = published` and not expired;
- a stale menu is not silently presented as current.

### 9.2 `menu_sections`

```txt
id                  uuid primary key
menu_id             uuid not null references menus(id) on delete cascade
name                text not null
description         text
availability_text   text
sort_order          integer not null default 0
created_at          timestamptz not null
updated_at          timestamptz not null
```

### 9.3 `menu_items`

```txt
id                  uuid primary key
menu_section_id     uuid not null references menu_sections(id) on delete cascade
slug                text not null
name                text not null
description         text
price_amount        numeric
price_text          text
image_url           text
dietary_tags        text[]
allergen_tags       text[]
availability_text   text
is_available        boolean not null default true
partner_recommended boolean not null default false
editorial_pick      boolean not null default false
editorial_note      text
sort_order          integer not null default 0
created_at          timestamptz not null
updated_at          timestamptz not null
```

Rules:

- `partner_recommended` and `editorial_pick` are distinct.
- Partner write paths may not set Other Bali editorial fields.
- Allergen data is shown only when explicitly verified; absence means unknown, not allergen-free.
- `price_text` supports ranges, market price and variants without false precision.

### 9.4 `venue_action_capabilities`

Purpose: one source of truth for verified actions a user can take with a venue.

```txt
id                    uuid primary key
venue_slug            text not null references venues(slug)
action_type            text not null
provider               text not null
label                  text
handoff_url            text not null
status                 text not null
priority               integer not null default 100
source_type            text not null
source_url             text
verified_at            timestamptz
expires_at             timestamptz
confirmation_required  boolean not null default false
service_area_text      text
minimum_order_text     text
fee_text                text
availability_text      text
metadata                jsonb not null default '{}'
created_at              timestamptz not null
updated_at              timestamptz not null
```

Allowed `action_type` values:

```txt
reserve
delivery
takeaway
preorder
website
whatsapp
```

Navigation remains on the existing verified `venues.gmaps_url` during the first implementation. It can later be represented by the same capability model after a deliberate migration; do not duplicate it immediately.

Initial provider vocabulary:

```txt
tablepilot
venue_website
venue_whatsapp
grabfood
gofood
shopeefood
other_official
```

Rules:

- unique active capability per `(venue_slug, action_type, provider, handoff_url)`;
- public only when `status = published`, URL is valid, and freshness is acceptable;
- provider names are configuration, not a reason to hard-code provider-specific UI throughout the app;
- `metadata` may store non-sensitive provider hints, never PII or secrets.

### 9.5 Event extension

Retain the existing `events` table and acquisition `source` meaning.

Add a nullable safe payload:

```txt
payload jsonb
```

Introduce a backwards-compatible `log_event_v2` RPC rather than breaking the current `log_event` signature.

Safe payload examples:

```json
{
  "actionType": "delivery",
  "provider": "grabfood",
  "capabilityId": "uuid",
  "menuItemId": "uuid"
}
```

Forbidden payload:

- user name;
- phone;
- address;
- message body;
- order contents that can identify a person;
- payment details;
- provider tokens.

### 9.6 Existing venue fields

Retain during migration:

```txt
gmaps_url
tablepilot_slug
whatsapp
what_to_order
price_anchor
why_its_here
best_for
not_for
practical_tags
jobs
owner_note
```

Compatibility rules:

- `tablepilot_slug` may be resolved into a generated `reserve` capability without deleting the field.
- `whatsapp` may be resolved into a generated fallback capability.
- existing verified external `menuUrl` registries may render until their menus are imported.
- no big-bang data rewrite.

---

## 10. Coverage policy

District statuses:

```txt
planning_only
next_deep
active_deep
```

### 10.1 Allowed in every published district

- editorial place pages;
- district/scenario content;
- verified menus;
- official website links;
- neutral official booking links;
- neutral delivery/takeaway links;
- Google Maps handoff;
- saves and sharing;
- growth analytics.

### 10.2 Allowed only in `active_deep`

- TablePilot billable attribution;
- partner money-loop reporting;
- confirmed perks;
- QR redemption;
- commercial campaigns explicitly approved by the money model;
- any venue-facing claim that Other Bali is an active acquisition partner.

### 10.3 Database enforcement

Coverage remains data-enforced for monetization and QR. UI hiding alone is insufficient.

A planning-only venue may have an official booking or delivery link, but it must not enter Canggu’s billable partner loop merely because a button exists.

---

## 11. Menu provenance and freshness

### 11.1 Accepted sources

- venue/partner submission;
- official venue website;
- official venue ordering page;
- editorial capture from a real menu with recorded evidence;
- approved partner file import.

### 11.2 Rejected sources

- copied Google review text;
- scraped third-party review prose;
- guessed dishes or prices;
- unattributed screenshots;
- unofficial aggregator menus treated as current fact;
- AI-generated descriptions presented as venue facts.

### 11.3 Freshness rules

Default operational targets:

- action handoff URL: re-check every 30 days;
- menu price/item set: re-check every 45–60 days;
- temporary menu or event menu: hard expiry;
- opening-hours-sensitive action: re-check every 30 days;
- perk: explicit start/end date and active-deep confirmation.

Exact intervals may be adjusted by category, but every public record needs a freshness state.

### 11.4 Stale behaviour

When structured menu data is stale:

1. stop presenting it as current;
2. keep the official menu link if it still resolves and is clearly labeled;
3. show a restrained verification note;
4. add it to the admin freshness queue.

Do not leave old prices on the page because deleting them felt emotionally difficult.

---

## 12. Action gateway

### 12.1 Common action contract

```ts
export type VenueActionType =
  | "reserve"
  | "delivery"
  | "takeaway"
  | "preorder"
  | "website"
  | "whatsapp"
  | "directions";

export interface ResolvedVenueAction {
  id: string;
  type: VenueActionType;
  provider: string;
  label: string;
  href: string;
  external: true;
  confirmationRequired: boolean;
  availabilityText?: string;
  serviceAreaText?: string;
  minimumOrderText?: string;
  feeText?: string;
  verifiedAt?: string;
}
```

### 12.2 Resolution algorithm

For a venue and action type:

1. load published, non-expired capabilities;
2. apply district/commercial policy;
3. validate URL and provider configuration;
4. order by configured priority;
5. return the strongest primary action plus optional alternatives;
6. show no action when evidence is insufficient.

### 12.3 Reservation

Priority in active-deep Canggu:

1. TablePilot when `tablepilot_slug` is configured and the commercial gate permits it;
2. verified venue booking system;
3. verified WhatsApp request.

Outside active-deep:

- verified official booking handoff only;
- no billable Other Bali reservation claim unless district status and contract are explicitly activated.

### 12.4 Delivery

Possible providers:

- direct restaurant ordering page;
- restaurant WhatsApp;
- GrabFood;
- GoFood;
- ShopeeFood;
- another official provider.

Other Bali does not claim:

- live delivery coverage;
- live stock;
- exact fee;
- exact ETA;
- confirmed order state;

unless a provider API actually supplies it.

### 12.5 Takeaway

Use a verified direct provider, restaurant form or WhatsApp request. A request is not confirmed until the restaurant/provider confirms it.

### 12.6 Pre-order

`preorder` always defaults to `confirmation_required = true`.

Allowed flow:

```txt
Select intended items
→ create a prefilled provider request
→ hand off
→ provider/venue confirms
```

Other Bali must not display `Confirmed` merely because the message was generated.

### 12.7 Assisted item selection

A user may select menu items in memory and send them into a provider handoff when technically supported.

Constraints:

- no persistent Other Bali cart by default;
- no Other Bali order number;
- no payment capture;
- no promise that provider pricing equals displayed pricing;
- item mapping to provider SKUs only when verified.

### 12.8 Directions

Canonical behaviour:

- build or use a verified Google Maps deep link;
- log `direction_click`;
- open externally;
- do not implement route calculation or turn-by-turn UI.

---

## 13. User experience flows

### 13.1 Moment to visit

```txt
Choose moment
→ Top 3 matches
→ open place
→ understand fit
→ inspect menu / what to order
→ reserve or open Google Maps
→ provider fulfils
```

### 13.2 Moment to delivery

```txt
Choose “food at the villa” / delivery need
→ matches with published delivery capability
→ inspect menu
→ choose delivery action
→ see provider disclosure
→ hand off
→ provider fulfils
```

### 13.3 Takeaway

```txt
Choose place or dish
→ inspect menu
→ request takeaway
→ venue/provider confirms
→ Google Maps handles pickup navigation
```

### 13.4 Save and continue later

```txt
Save place
→ GuestRef-backed My Bali
→ share list or reopen
→ action remains freshness-checked at time of use
```

---

## 14. Public data contracts

Recommended view model:

```ts
export interface PublicVenueDetail {
  venue: Venue;
  menu: PublishedMenu | null;
  actions: ResolvedVenueAction[];
  editorial: {
    whyItsHere?: string;
    bestFor?: string;
    notFor?: string;
    whatToOrder?: string;
  };
  verification: {
    venueVerifiedAt?: string;
    menuVerifiedAt?: string;
    actionsVerifiedAt?: string;
  };
}
```

### 14.1 Read strategy

Prefer server-side aggregation in a data-access function such as:

```txt
getPublicVenueDetail(slug)
```

The place page should not independently know how to query every table and provider.

### 14.2 API strategy

Use route handlers only when needed for:

- writes;
- client interaction;
- event logging;
- provider API mediation;
- permission boundaries.

Do not turn every server read into an internal HTTP call.

---

## 15. Analytics and attribution

### 15.1 Separate metric families

**Growth / product health**

- moment started;
- shortlist generated;
- venue detail viewed;
- menu opened;
- menu item opened;
- save;
- share;
- direction click;
- neutral external action click.

**Partner-proof / money loop**

- TablePilot `reservation_click` with Other Bali source;
- TablePilot confirmed reservation;
- TablePilot `arrived` / `completed` billable result;
- externally attributed QR redemption as supporting proof;
- any future provider-confirmed order only after an explicit integration and architecture amendment.

### 15.2 Event vocabulary

Approved additions:

```txt
menu_open
menu_item_open
action_handoff
delivery_click
takeaway_click
preorder_click
```

Retain:

```txt
direction_click
reservation_click
booking_click
menu_click
venue_detail_view
save/share events
```

### 15.3 Attribution rules

- acquisition source remains first-touch and must not be overwritten by provider name;
- provider/action details belong in safe event payload;
- partners see aggregate reports by default;
- click is intent, not fulfilment;
- only externally confirmed outcomes may become billable proof.

---

## 16. Identity, privacy and security

### 16.1 Identity

- anonymous `GuestRef` via httpOnly cookie;
- no mandatory tourist account;
- no localStorage/sessionStorage identity;
- optional contact only with explicit consent;
- no PII copied from provider handoffs.

### 16.2 Database security

- RLS enabled on all new tables;
- public can read only published menu and capability data through safe policies/views;
- partner writes constrained to owned venues and non-editorial fields;
- editorial fields admin-only;
- tourist writes through controlled RPCs or narrowly scoped routes;
- no service-role secret in browser or public runtime.

### 16.3 URL safety

Every external URL must be:

- `https` except explicitly approved schemes such as `whatsapp:`/`wa.me`;
- normalized;
- restricted to expected provider/domain patterns where possible;
- rendered with safe `target`/`rel` handling;
- checked before publication.

### 16.4 Secrets

Provider tokens live in server environment variables only. Public provider URLs may be stored; secret API keys may not.

---

## 17. Editorial trust and publication

### 17.1 Organic vs sponsored

- Organic selection cannot be bought.
- Sponsored visibility is separate and clearly labeled.
- Sponsor state never enters recommendation ranking as quality.

### 17.2 Decision-ready publication gate

A public venue needs:

- identity and location;
- `whyItsHere`;
- `bestFor`;
- a price or offering anchor;
- source-backed practical facts;
- a verified map link;
- no internal draft language.

A menu additionally needs:

- official/partner/editorial source;
- verification timestamp;
- published state;
- non-expired state;
- at least one section and item.

An action additionally needs:

- verified provider;
- valid handoff URL;
- published state;
- freshness state;
- accurate confirmation semantics.

### 17.3 Language rules

Allowed:

- fit context;
- logistics;
- who/when it suits;
- honest limitations relevant to a moment.

Forbidden:

- copied review text;
- invented facts;
- unsupported “best” claims;
- public anti-lists;
- fake availability;
- unconfirmed partnership language.

---

## 18. Partner and admin operations

### 18.1 Partner menu workflow

```txt
Partner submits or updates menu
→ draft version
→ validation
→ operator/editorial review where needed
→ publish
→ previous version superseded
→ freshness timer starts
```

### 18.2 Partner action workflow

```txt
Partner submits action URL/provider
→ domain/provider validation
→ test handoff
→ operator approval
→ publish
→ scheduled re-check
```

### 18.3 Admin queues

Required queues:

- stale menus;
- broken menu source;
- broken action URL;
- capability expiring soon;
- venue missing map verification;
- menu with missing prices/sections;
- unconfirmed perk visible;
- place below publication gate;
- external provider click spike with no verified capability;
- pending partner review.

### 18.4 Manual-first is acceptable

A focused admin checklist is better than an elaborate CMS that does not protect data quality. Build automation where repeated operator work justifies it.

---

## 19. SEO and content architecture

### 19.1 Place pages

Index only decision-ready pages. Structured menus can strengthen a page but do not automatically make it indexable.

### 19.2 Dish discovery

Menu items are structured data, not automatic SEO pages.

Create a public dish guide only when it adds editorial value, such as:

- ramen for a specific moment/area;
- family pizza in Sanur;
- vegan brunch in Ubud;
- breakfast under a useful budget;
- dishes worth sharing for a group dinner.

Do not generate thousands of thin item pages.

### 19.3 Schema markup

Use verified facts only. Do not add ratings, reviews, opening hours, prices or menu schema that the source cannot support.

---

## 20. Error and fallback behaviour

- Missing menu: show `What to order` and verified official menu link if available.
- Stale menu: hide structured prices/items, retain verified official link with note.
- Missing reserve capability: show no reserve button; WhatsApp only when verified.
- Missing delivery capability: do not infer one from the venue category.
- Broken provider URL: suppress action and alert admin.
- TablePilot unavailable: use verified fallback only; do not fabricate a reservation.
- Google Maps URL invalid: use a safe search URL from venue name/address while flagging verification.
- Analytics failure: never block the user’s action.

---

## 21. Migration and rollout strategy

### 21.1 Principles

- additive changes;
- backward compatibility;
- no edits to applied migrations;
- one schema owner during parallel work;
- idempotent backfills;
- production migration apply remains an explicit founder/operator step;
- feature remains hidden until data and UI are both ready.

### 21.2 Rollout order

1. schema and typed contracts;
2. public read layer;
3. action resolver and tracking;
4. menu and action UI;
5. partner/admin maintenance;
6. verified data import;
7. full QA;
8. controlled publish.

### 21.3 Backfill

- generate reserve capability from `tablepilot_slug` where allowed;
- generate WhatsApp fallback from verified `whatsapp`;
- retain existing `gmaps_url`;
- import verified external menu URLs as menu sources, not invented structured items;
- do not publish empty menus.

---

## 22. Quality and verification

Every merged slice must pass:

```txt
npm run lint
npm run build
```

Add focused tests for:

- action resolution;
- expired/stale suppression;
- active-deep coverage;
- URL validation;
- menu publication mapping;
- partner/editorial write separation;
- event payload sanitization;
- mobile action rendering;
- no-action fallbacks.

Browser QA must cover:

- mobile home to shortlist;
- published place with menu and all actions;
- published place with external menu only;
- place with no menu;
- planning-only district place;
- active-deep TablePilot place;
- delivery provider handoff;
- takeaway/pre-order request semantics;
- Google Maps handoff;
- save/share;
- stale menu suppression;
- keyboard and screen-reader basics;
- no horizontal overflow.

---

## 23. Current implementation baseline

As of the architecture date, the repository already contains:

- Other Bali public rebrand;
- moment/day-intent home surface;
- district and scenario pages;
- decision-ready publication gate;
- place detail pages;
- Google Maps navigation links;
- TablePilot reservation handoff and aggregate billable reporting;
- WhatsApp fallback;
- external verified menu links for a limited subset;
- anonymous saves and shared lists;
- partner onboarding and operator surfaces;
- active-deep perk/QR flow;
- evidence-backed venue enrichment across several districts.

Not yet unified in the target architecture:

- structured versioned menu tables;
- menu-section/item UI across venues;
- central action-capability registry;
- delivery/takeaway/pre-order handoff resolver;
- action payload analytics;
- menu/action freshness admin queue;
- partner menu/action maintenance workflow.

This is an extension of the current product, not a rebuild.

---

## 24. Release acceptance criteria

The action/menu architecture is complete when:

1. a published venue can expose a verified structured menu;
2. stale menu data is not represented as current;
3. the place page clearly separates editorial picks from partner facts;
4. reserve, delivery, takeaway, pre-order, Maps and save actions are capability-driven;
5. no button appears without verified backing data;
6. external fulfilment is disclosed accurately;
7. Google Maps remains the navigation handoff;
8. planning-only districts do not enter the billable/QR loop;
9. action clicks are tracked without corrupting acquisition source or collecting PII;
10. partner/admin users can maintain menu and action freshness;
11. all new tables have RLS and tested write boundaries;
12. lint, build, focused tests and mobile browser QA pass;
13. documentation, migrations and handoff notes match the code.

---

## 25. Locked decisions

```txt
Moments are the primary product entry.
Categories remain data structure and secondary navigation.

Menus — yes.
Structured versioned menus — yes.
Editorial “What to order” — yes, separate from partner content.
Dish discovery — yes when curated and decision-useful.
Automatic thin dish SEO pages — no.

Reservations — yes through a gateway/handoff.
Other Bali-owned booking engine — no.

Delivery — yes through verified restaurant/provider handoffs.
Other Bali-owned courier network — no.

Takeaway — yes.
Pre-order — yes only as a confirmation-required partner capability.
Other Bali-owned order fulfilment/payment/refund system — no.

Google Maps — yes as navigation infrastructure.
Other Bali-owned navigation/traffic/ETA engine — no.

My Bali / Saved — yes.
Perks — optional supporting layer, active-deep only.
Tourist-side payment product — no.
Wallet / real-money cashback — not base architecture.
AI concierge — only later as an interface over verified structured data.
“Travel Operating System” — internal ambition at most, not public positioning.
```

### Final ownership rule

```txt
Other Bali owns:
decision · explanation · trusted action interface · attribution · relationship

Partners own:
inventory · fulfilment · payment · cancellation · refund · operational support

Google Maps owns:
routing · traffic · ETA · turn-by-turn navigation
```
