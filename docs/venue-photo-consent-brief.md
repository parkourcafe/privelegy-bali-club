# Task brief — Venue photo submission & consent flow

> **Русское резюме для Селены:** это ТЗ для отдельной сессии Claude Code в этом репозитории.
> Задача: сделать так, чтобы **каждое заведение само загрузило/подтвердило свои фото по личной
> ссылке и поставило галочку "разрешаю использовать"**. Только после согласия фото появляется на
> странице заведения (и страница выходит из noindex). Мы НЕ берём фото из Google Maps и НЕ грузим
> чужое — фото приходят от самого заведения с явным разрешением. Ссылку на согласование мы шлём
> заведению; страница у него уже готова.

## Why

Every published venue page (`/places/[slug]`) currently renders a **typographic cover**, not a
photo — because no venue has rights-cleared images (`venues.photo_url` is empty for all 155
published venues across Canggu/Ubud/Uluwatu). That's why venue detail pages stay `noindex`.

We must **never** scrape or republish Google Maps / third-party photos (guardrail #1, copyright,
Google ToS). The only legitimate source is the venue itself, granting us a licence. This feature
builds that: a per-venue link where the owner uploads/confirms photos and ticks an explicit consent
box. On approval, the photo shows on their page and the page can become indexable.

## What to build

### 1. Storage + data
- Supabase **Storage bucket** `venue-photos` (private by default; public URL only for approved images).
- New table `venue_photo_submissions`:
  `id`, `venue_slug` (FK → `venues.slug`), `image_path` (storage path), `submitter_name`,
  `submitter_contact` (email or WhatsApp, optional), `consent_granted boolean not null`,
  `consent_terms_version text`, `consent_at timestamptz`, `submitted_ip`, `submitted_ua`,
  `status text check (status in ('pending','approved','rejected')) default 'pending'`,
  `is_primary boolean default false`, `created_at`.
  **RLS: deny all.** All writes go through `SECURITY DEFINER` RPCs — same pattern as the existing
  `submit_guide_lead` / `record_redemption` RPCs. Do not expose the table to the anon role.
- Write a **`ConsentLog`** row (the master-doc entity; see how guide_leads records consent) capturing
  the rights grant: who, when, terms version, scope ("display venue photos on otherbali.com").
- Reuse the existing **`venues.photo_url`** column for the approved primary image's public URL.

### 2. Per-venue consent link (owner-facing, no login)
- Route: **`/venue/[slug]/photos`** gated by a **server-verified token** (`?t=...`).
  - Generate a random, non-guessable token per venue; store a hash in a `venue_photo_tokens` table
    (or a signed token). Verify server-side. **No localStorage; httpOnly / server-side only** (#10).
- Page contents (English public UI, mobile-first):
  - A preview of the venue's live page (name + editorial) so the owner sees what they're improving.
  - A **multi-file uploader** (drag-drop, jpg/png/webp, size + count limits, client + server validation).
  - A **consent checkbox, NOT pre-ticked**: *"I own or have the rights to these photos and grant
    Other Bali a non-exclusive licence to display them on otherbali.com."* Plus a one-line terms link.
  - Optional name / contact fields.
  - Honeypot; loading/error/success states; the same honesty bar as `GuideLeadForm` (never claim
    success unless the upload + row actually persisted).
- On submit: upload files to `venue-photos` (status `pending`), insert `venue_photo_submissions`
  rows + the `ConsentLog` row via the RPC, stamp `consent_at`. Show a clear "thanks, pending review".

### 3. Admin review (founder-facing; Russian copy OK per CLAUDE.md)
- Route `/admin/photos` (behind the existing admin auth used by `/admin/phase0`):
  - List `pending` submissions grouped by venue, with image previews.
  - **Approve** → move/mark image public, set `venues.photo_url` to its public URL, set the chosen
    image `is_primary=true`, submission `status='approved'`. **Reject** → `status='rejected'`, no display.
  - Only **approved + consented** images may ever be referenced by `photo_url` or rendered publicly.

### 4. Display + indexability (the payoff)
- `PlaceCard` / `PlaceCover` / the venue hero already consume `photo_url` — when present, render the
  real photo instead of the typographic cover. Verify all three surfaces.
- **Indexability:** extend `lib/publication.ts` so a non-Uluwatu venue page becomes `index,follow`
  only when it is decision-ready **AND** has an approved `photo_url` (thin, photo-less pages stay
  `noindex` — same principle as today). Uluwatu keeps its registry gate. Update the sitemap
  enumeration to match. This is what finally lifts venue pages out of `noindex`, venue by venue, as
  photos land.

### 5. Outreach helper (so Selena can send the links)
- Add a script/admin view that, for each venue lacking a photo, outputs: venue name, its live page
  URL (`https://otherbali.com/places/<slug>`), its consent link (`/venue/<slug>/photos?t=<token>`),
  and its known official site / Instagram (for a friendly, pre-filled WhatsApp/email message).
- The current outreach list (155 venues with a known official photo-source) can be regenerated any
  time with this SQL:

  ```sql
  select district, name, slug, category,
         'https://otherbali.com/places/'||slug as page_url,
         coalesce(official_url,'') as official_url,
         coalesce(instagram_url,'') as instagram_url
  from venues
  where status='active'
    and coalesce(why_its_here,'')<>'' and coalesce(best_for,'')<>''
    and (coalesce(price_anchor,'')<>'' or coalesce(what_to_order,'')<>'')
    and coalesce(photo_url,'')=''
  order by district, category, name;
  ```

## Guardrails (must hold)
1. **No scraping / republishing Google Maps or third-party photos** (#1). Only owner-submitted images.
2. **Explicit consent, not pre-ticked; `ConsentLog` written before any public display** (#9-analogous).
3. **No photo renders publicly until admin-approved.**
4. **No localStorage / client identity hacks — server-side token + httpOnly** (#10).
5. English in public UI; admin may be Russian.
6. No new tourist-facing *entity* beyond the master doc — `venue_photo_submissions` / `venue_photo_tokens`
   are internal infrastructure (flag for a one-line master-doc note, like `venue_fact_sources` / `guide_leads`).
7. Additive migration only; RLS-denied tables; SECURITY DEFINER RPCs. Prod apply is a founder step.

## Acceptance criteria
- A tokenised `/venue/[slug]/photos` link lets an owner upload photos + grant consent; a bad/missing
  token is rejected.
- Submissions land as `pending` with a `ConsentLog` row; nothing shows publicly yet.
- `/admin/photos` approve sets `venues.photo_url`; the venue page + card now show the real photo.
- An approved-photo, decision-ready venue page returns `index,follow` and appears in the sitemap;
  a photo-less one stays `noindex`.
- `tsc` clean · `lint` clean · `build` green. Migration file included; documents the prod-apply step.
