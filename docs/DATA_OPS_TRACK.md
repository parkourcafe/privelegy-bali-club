# OTHER BALI — DATA OPS TRACK (Track 0)

Created: 13.07.2026 | 21:30 | Bali
Status: APPROVED by founder, 13.07.2026
Runs in parallel with Sessions 1-4 of the parallel loop. This is a human + assistant-AI track, not a Claude Code session.

---

## 1. Purpose

Fill the menu/action layer with verified venue content while the engineering sessions build the infrastructure. Prevents the "empty shelves" failure mode: pipes finished, nothing to show.

## 2. Core principle: we pre-fill, owners approve

Owners never fill forms from scratch — manual owner-side data entry takes weeks and kills conversion. Instead:

1. The team collects everything publicly available from each venue's OFFICIAL sources (official website first; official delivery listings for action links).
2. Content is structured into a draft venue page (menu sections, items, prices, photos, action links).
3. The owner receives a personal review link, corrects anything, optionally adds content, and gives explicit approval (checkbox or written "YES").

## 3. Publication rules (hard — mirrored in AGENTS.md)

- **FACTS** (menu sections, item names, prices, descriptions): may be published immediately with source attribution — "Source: official website, captured DD.MM.YYYY". UI must communicate "prices as of [date], may vary".
- **PHOTOS**: uploaded to draft but NEVER published until owner consent is logged. No exceptions. Fallback art must not be presented as venue photography.
- If the owner cannot confirm photo rights, photos stay hidden; facts remain published with attribution.

## 4. Consent — must be real and recorded

- Channel: personal review link (onboarding token) or WhatsApp reply "YES" to the review message.
- Log per venue: who approved (name/role), when (timestamp), which content version, channel, evidence (screenshot for WhatsApp).
- Approval text MUST include the photo-rights line: *"I confirm our venue owns or controls the rights to these photos and permits Other Bali to display them."*
- Rationale: venue-site photos are often licensed to the venue only — the owner's explicit confirmation is what transfers display permission to Other Bali.

## 5. Freshness

- `captured_at` recorded on collection; `verified_at` set on owner approval.
- Re-check cycle: every 45-60 days per Master Architecture freshness policy. Stale content enters the admin freshness queue (Session 4).

## 6. Pipeline (per venue)

1. Founder selects the venue (wave 1: 10-15 Canggu venues).
2. AI collects from official sources: menu (sections/items/prices), photos into a draft folder, action links (booking URL / WhatsApp / GoFood / GrabFood / Maps).
3. Operations Assistant spot-check (5 min): prices plausible, names clean, correct venue.
4. Send owner the review message (template below) with a personal link.
5. Owner corrects/adds, then approves (checkbox or WhatsApp "YES").
6. Log consent → publish photos → set `verified_at`.
7. No response in 7 days → one follow-up. Still silent → facts stay live with attribution, photos stay hidden.

## 7. Owner message template (WhatsApp / email, EN)

> Hi [Name], this is [Assistant] from Other Bali — a resident-curated guide that helps travelers pick the right place. We've already prepared [Venue]'s page for you: menu and info taken from your official website, so there is nothing to fill in. Could you take 2 minutes to check it? [review link]. You can correct anything or add photos and dishes. If everything looks right, just tap Approve (or reply YES) — that confirms the info and that you're happy for us to show your photos. Prices are shown as of [date].

Indonesian-language version to be produced before the first send.

## 8. Roles

- **Founder**: venue selection, edge-case decisions.
- **Operations Assistant (Ananda)**: outreach, follow-ups, consent logging, spot-checks.
- **AI (Claude / Claude Code)**: collection, structuring to the contract shape (see `lib/contracts/menu-action.fixtures.ts` for the canonical shape), draft creation.

## 9. Wave-1 acceptance criteria

- ≥10 venues with structured draft menus + action links.
- ≥6 venues with logged owner approval and photos live.
- 100% of published photo sets have a consent log entry; 0 photos published without consent.
