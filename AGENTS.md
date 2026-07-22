# AGENTS.md — Other Bali repository operating contract

**Applies to:** every human or AI agent working in this repository
**Version:** 3.1-aligned
**Date:** 2026-07-22
**Public product:** Other Bali
**Legacy repository name:** Bali Privilege / `privelegy-bali-club`

This file contains hard repository operating rules. The canonical product and technical architecture is `Other_Bali_Master_Architecture.md` (**V3.1 CORRECTED**). Repository code and older focused docs describe AS-IS implementation; they do not override V3.1 TARGET decisions.

---

## 1. Read order and authority

Before non-trivial work, read:

1. `AGENTS.md`;
2. `Other_Bali_Master_Architecture.md`;
3. `CLAUDE.md` if the runtime loads it;
4. the focused docs named by the task;
5. relevant code and applied migrations.

Authority is split by concern:

```txt
Product truth: approved live-canon decisions → Master V3.1 Corrected
→ approved Data Dictionary / Taxonomy / Migration Map
→ approved focused specs

Repository process: AGENTS.md → thin CLAUDE.md entrypoint
→ code/migrations as AS-IS implementation truth
→ session handoffs/backlog/history
```

AGENTS.md may constrain how work is performed but may not redefine Master product truth. If code or an older focused document conflicts with V3.1, separate AS-IS from TARGET, record the conflict and do not normalize it silently.

---

## 2. Product in one paragraph

Other Bali is one Bali-wide digital product for choosing and planning a trip. It serves four public modes: **Today**, **Explore**, **Plan** and **My Bali**. It helps a traveller choose the right place, activity or route for the moment they are in and take the next verified action. Territory is data, filter and context—not a separate product. Privileges are an optional contextual Offer layer, never primary navigation or the basis of usefulness.

Public tagline:

> The right place for the moment you’re in.

---

## 3. Mandatory discovery before editing

At the start of every session:

1. confirm repository and branch;
2. run `git status --short`;
3. inspect recent commits relevant to the task;
4. read the authoritative files above;
5. inspect the exact files and migrations in scope;
6. inspect `package.json`;
7. for Next.js work, read the relevant guide under `node_modules/next/dist/docs/` because this repository uses Next.js 16;
8. write a short discovery note before changing code.

Do not start by rewriting a file based on memory or a stale handoff.

---

## 4. Hard product guardrails

Never violate these without an explicit architecture amendment from Selena.

1. **No Google Maps clone.** Use verified Google Maps handoffs. Do not build routing, traffic, ETA or turn-by-turn navigation.
2. **No Google review scraping or republishing.** Do not copy review prose, ratings or review-derived claims into public content.
3. **No ungrounded tourist AI chatbot.** Structured decision flows are allowed. Any later natural-language interface must operate only on verified structured data.
4. **No broad marketplace booking engine.** Only the narrow owned confirmed seated-booking rail allowed by V3.1 may be implemented; external providers continue to own fulfilment, payment, cancellation, refund and support.
5. **No delivery fleet or fulfilment platform.** Other Bali may route to a verified restaurant/provider; it does not own drivers, refunds or support.
6. **No tourist-side payments.** Do not add checkout, deposits, wallet, cash balance or real-money cashback.
7. **No sponsored placement, paid visibility or pay-to-rank.** These are reserved/disabled/out of scope in runtime, schema, API, UI, admin, partner portal and sales. Organic selection cannot be bought.
8. **Canonical money model only.** The sole paid product is a fixed fee for a confirmed seated-booking through the owned rail. A Maps, Instagram, WhatsApp or outbound booking click is Intent, never a booking or billable Outcome.
9. **No public anti-lists or unsupported quality warnings.** Fit context is allowed; invented or copied negative claims are not.
10. **No invented content.** Unknown means `null`, hidden or `needs_verification`.
11. **No identity in localStorage/sessionStorage.** Use the httpOnly `GuestRef` model.
12. **No unnecessary PII.** Provider handoffs must not be copied into Other Bali storage by default.
13. **Respect V3.1 entity boundaries.** Organization, Place, Experience, Experience Offering, Event, Offer, Route, Collection and Area are distinct. Implementation additions such as Menu and VenueActionCapability must map through the approved Data Dictionary; no new canonical entity may be invented without an architecture decision.
14. **No big-bang rewrite.** Extend the current product and preserve compatible paths.
15. **Canonical public source language is English.** Internal documentation and QA are Russian. Existing translated UI chrome is AS-IS preservation, not permission to generate or publish unreviewed translations; Social Media OS public output remains English unless a later approved channel spec says otherwise.

---

## 5. Canonical ownership boundary

```txt
Other Bali:
selection · editorial verdict · Best for / Not ideal for · warnings · organic rank
decision · explanation · trusted action interface · attribution · My Bali

Partners/providers:
availability · confirmation · fulfilment · payment · cancellation · refund · support

Google Maps:
routing · traffic · ETA · turn-by-turn navigation
```

Never label a request or outbound click as confirmed fulfilment.
Partners may supply and correct facts, but may not control editorial verdict, Best for, Not ideal for, warnings or organic rank.

---

## 6. Technical stack — do not substitute casually

- Next.js 16 App Router;
- React 19;
- TypeScript;
- Tailwind CSS 4 and existing CSS tokens;
- Supabase Postgres, RLS and controlled RPCs;
- Supabase Storage for approved assets;
- Vercel;
- PWA-first delivery;
- Google Maps deep links;
- TablePilot reservation handoff;
- WhatsApp prefilled transactional links;
- existing QR library for legacy redemption AS-IS; any future use must comply with V3.1 Offer and confirmed-outcome rules.

Do not add a framework, state library, ORM or UI kit merely because it is familiar.

---

## 7. Next.js and React rules

- This is Next.js 16, not an older App Router baseline.
- Read the relevant local Next.js docs before changing framework APIs.
- Prefer Server Components for public data rendering.
- Use Client Components only for actual interaction.
- Do not fetch internal server reads through HTTP when a server-side function can be called directly.
- Preserve metadata, canonical, robots and sitemap behaviour.
- Avoid hydration-dependent critical content.
- Keep mobile action targets at least 44–46 px.
- Do not introduce horizontal-scroll UI that hides required choices.
- Maintain accessible labels, focus order and keyboard behaviour.

---

## 8. Domain and data rules

### 8.1 V3.1 canonical concepts

```txt
Organization · Place · Experience · Experience Offering · Event · Offer
Route · RouteStop · Collection · Area · MediaAsset · Source · Verification
Trip · InteractionEvent · PartnerAccount
```

Legacy implementation types such as `Venue`, `District`, `Perk`, `ContentPage`, `SavedPlace` and `SharedList` are AS-IS and require explicit Current-to-Target mapping. Do not rename or collapse them blindly.

### 8.2 Approved additions

```txt
Menu · MenuSection · MenuItem · VenueActionCapability
```

Do not add:

```txt
Order · Cart · Delivery · Courier · InternalReservation · Payment · Refund · Wallet
```

without a separate architecture decision.

### 8.3 Boundary mapping

- Database rows are snake_case.
- Domain objects are camelCase.
- Map once at the data-access boundary.
- Public reads select explicit columns.
- Public UI receives published/verified data only.

---

## 9. Migration rules

- Never modify an applied migration.
- Add a new numbered migration after verifying the current highest number.
- During the four-session loop, **Session 1 is the sole schema owner**.
- Other sessions submit schema needs in their handoff instead of creating migrations.
- Migrations must be idempotent where practical.
- New tables require RLS.
- Public read and partner write policies must be explicit.
- Partner write paths may not update Other Bali editorial fields.
- Use additive nullable columns for compatibility.
- Do not assume a migration is applied in production merely because the SQL file exists.
- Record production-apply requirements in the handoff.

---

## 10. Menu rules

- Structured menu data requires a source and verification timestamp.
- Partner recommendation and Other Bali editorial pick are separate fields.
- Allergen absence means unknown, not safe.
- Prices and items must not remain publicly “current” after expiry.
- Existing official menu links remain a valid fallback.
- Do not scrape third-party review/menu aggregators and present them as venue truth.
- Do not generate thin SEO pages for every menu item.

---

## 11. Action gateway rules

Supported actions:

```txt
reserve · delivery · takeaway · preorder · website · whatsapp · directions
```

Rules:

- resolve only published, non-expired capabilities;
- display no action when evidence is insufficient;
- disclose external provider handoffs accurately;
- `preorder` is confirmation-required by default;
- clicks are intent, not fulfilment;
- do not claim live availability, stock, ETA, fee or service area without provider data;
- Google Maps remains the navigation handoff;
- analytics failure must never block the outbound action.

---

## 12. Analytics rules

Keep metric families separate.

**Growth:**

```txt
moment_started · shortlist_generated · venue_detail_view · menu_open
menu_item_open · save · share · direction_click · neutral action clicks
```

**Partner proof:**

```txt
reservation_click → TablePilot confirmed → arrived/completed
externally attributed redemption as supporting proof
```

- Never overwrite acquisition `source` with provider name.
- Provider/action metadata belongs in a safe payload.
- Never log PII, full addresses, payment data or provider tokens.
- A click is not a billable result.

---

## 13. Content and provenance rules

Every factual public claim must come from:

- official venue/provider source;
- partner submission;
- recorded editorial visit/research;
- approved internal evidence record.

Use `null` or hide when unknown.

Organic recommendation copy remains Other Bali editorial voice. Owner copy is attributed as owner copy. Sponsored placement and paid visibility are not active concepts and may not enter content metadata or ranking.

---

## 14. Security and privacy

- No service-role key in browser or public runtime.
- Use RLS and controlled RPCs.
- Validate external URLs.
- Restrict provider domains where practical.
- Keep provider secrets server-side.
- Use httpOnly `GuestRef` identity.
- Partners see aggregate reports by default.
- PII requires explicit user submission and consent.
- Do not persist provider order or booking details unless architecture adopts that storage.

---

## 15. Parallel-session file ownership

During the four-session loop, obey the ownership matrix in `PARALLEL_LOOP_EXECUTION_PLAN.md`.

General rule:

- edit only owned files;
- do not “help” another session by changing its files;
- submit a contract request in your handoff instead;
- one session owns migrations;
- one session owns final integration;
- shared root docs are coordinator-owned after baseline.

This is how four agents remain parallel instead of becoming a distributed merge-conflict generator.

---

## 16. Loop operating mode

Every session repeats this loop until its exit criteria are met or a hard blocker is documented:

```txt
READ
→ INSPECT
→ STATE ASSUMPTIONS
→ IMPLEMENT THE SMALLEST COMPLETE SLICE
→ RUN FOCUSED TESTS
→ RUN LINT/BUILD WHEN RELEVANT
→ REVIEW THE DIFF
→ UPDATE SESSION STATUS/HANDOFF
→ REPEAT
```

At the end of each loop, record:

- what changed;
- tests run and exact result;
- files owned/touched;
- migration state;
- unresolved risk;
- cross-session request;
- next loop objective.

Do not continue stacking code on a failing loop.

---

## 17. Git discipline

- Work in the designated branch/worktree.
- Start from the frozen baseline commit.
- Keep commits focused and descriptive.
- Do not reformat unrelated files.
- Do not merge another session’s branch yourself unless you are Session 4 integrator.
- Rebase only when the plan says to do so.
- Never force-push a shared integration branch.
- Do not delete another session’s work to make tests pass.
- Record the final commit SHA in the handoff.

---

## 18. Testing and verification

Minimum commands for code-bearing sessions:

```txt
npm run lint
npm run build
```

Also run focused tests or scripts added for the slice.

Required checks for menu/action work:

- published fresh menu renders;
- stale menu is suppressed or clearly downgraded;
- place without menu remains valid;
- reserve/delivery/takeaway/preorder actions hide when absent;
- no district status or partner relationship changes organic rank or creates an unauthorized money loop;
- TablePilot flow remains intact;
- Google Maps opens externally;
- event payload contains no PII;
- mobile sticky action UI remains usable;
- public page metadata and indexability remain correct.

Do not claim browser QA if no browser verification occurred.

---

## 19. Definition of done

A task is done only when:

- architecture and guardrails are respected;
- scope acceptance criteria are met;
- data source/freshness semantics are correct;
- errors and empty states are handled;
- tests pass;
- lint passes;
- build passes;
- no unrelated regression is introduced;
- docs/handoff match the implementation;
- any required production migration or env action is explicitly listed;
- the diff has been self-reviewed.

“Code exists” is not a definition of done.

---

## 20. Stop and escalate conditions

Stop and document rather than guessing when:

- authority documents conflict;
- a new entity is required but not approved;
- a provider does not expose the needed state;
- a source cannot verify menu/action data;
- a change would collect new PII;
- a change would add tourist payment;
- a change would monetize anything other than a confirmed seated-booking through the approved owned rail;
- production migration status is unknown;
- another session owns the required file;
- required tests cannot be run.

Use the handoff template. A precise blocker is useful; confident improvisation is not.

## Content publication rule (v3, 2026-07-19 — founder amendment)

- **Interim pre-launch policy (explicit founder decision, 2026-07-19):** while the
  product is in owner-outreach mode (not promoted to tourists), a venue's own
  public marketing photo MAY be displayed on its OWN listing before a consent
  record exists. Conditions: photo shows the venue itself (never another
  venue's photo on its card); immediate takedown on any owner request; the
  consent pipeline keeps running and an approved owner submission replaces the
  interim photo. Implemented by migration 0043 (restores the 0033-quarantined
  URLs; reversible — quarantine rows are kept).
- **At the public-launch gate this reverts to v2 strictness:** venue photos
  without a logged owner consent record (who / when / content version /
  channel, incl. photo-rights confirmation) are re-quarantined.
- Fallback art must not be presented as venue photography (unchanged).
- Menu facts captured from official sources may be published before owner approval, but only with source attribution and a captured-at date; UI must communicate "prices as of <date>".
- Full workflow: `docs/DATA_OPS_TRACK.md`.

## Locale implementation preservation note (AS-IS, reconciled 2026-07-22)

The repository currently contains UI-chrome support for English, Bahasa
Indonesia, Chinese, Korean, French and Russian, with English as the first-visit
default and explicit user switching. This is an AS-IS implementation fact and
must not be removed incidentally during V3.1 migration.

V3.1 establishes English as the canonical public product and social-content
source language; internal documentation and QA are Russian. Existing translated
chrome does not authorize machine translation of prices, access rules, warnings,
offers or other trust-bearing facts. Any non-English public factual content
requires the same evidence, freshness and human review as English. A future
locale expansion or contraction requires an approved focused specification and
preservation review rather than an implicit architecture amendment in code.
