# Bali Privilege — Canggu (thin G0→G1 MVP)

Web-first, tourist-first planning + perk-redemption for one deep district (Canggu).
Built to prove **one** thing: that a tourist redeems a perk on the ground and the
venue sees an attributable visit. Everything else is deliberately out of scope.

> Positioning: **Bali-wide planning, Canggu-deep execution.** Free for tourists;
> venues pay only after redemption proof.

## What's here

- **G0 — planning form** (`/`): a curated Canggu day by slot (morning/day/sunset/
  evening), each spot with a real perk. Not a listing — opinionated curation.
- **G1 — redemption proof**:
  - Guest scans the **printed counter QR** (`/admin/qr/[venue]`) → `/v/[venue]/redeem`.
  - Taps Redeem → anonymous `GuestRef` + `ConsentLog` → `redemption_event` written
    server-side → green confirmation with a rolling code for staff.
  - Partner sees an **aggregate count** at `/partner/[venue]` (privacy by default).

The printed QR is the on-premise proof anchor — you can't redeem from your villa.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind v4 · Supabase (Postgres + RLS) ·
`qrcode` · installable PWA (manifest + minimal service worker).

## Run

```bash
npm install
cp .env.local.example .env.local   # optional for G0; required for G1 writes
npm run dev
```

Without Supabase env vars the app serves **seed data** (`lib/seed.ts`) so G0 is
fully browsable. Redemption writes need a DB and will return
`redemption_storage_unconfigured` until configured.

## Database

Apply `supabase/migrations/0001_init.sql` then `supabase/seed.sql` to a Supabase
project. RLS: planning tables are public-read; identity/consent/redemption tables
are service-role-only (default deny), written exclusively through server routes.

## Scope discipline (NOT built — later gates)

Partner auth/roles, paid tiers, multi-district, booking, reviews, AI, second
district. See the master architecture doc for the gate sequence.

## Seed data is placeholder

Every venue and perk in `lib/seed.ts` / `supabase/seed.sql` is placeholder
curation. Replace with signed Editorial Seed partners before any tourist sees it.
