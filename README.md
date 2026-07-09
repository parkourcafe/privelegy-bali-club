# Bali Privilege — Canggu (thin G0→G1 MVP)

Web-first, tourist-first planning + perk-redemption for one deep district (Canggu).
Built to prove **one** chain: a tourist finds a venue here, reserves a table
through TablePilot, shows up and is seated — and the venue can see that visit is
ours. Perk redemption stays as the on-the-ground arrival proof and tourist
incentive. Everything else is deliberately out of scope.

> Positioning: **Bali-wide planning, Canggu-deep execution.** Free for tourists;
> venues pay a fixed fee per confirmed seated reservation made through us —
> nothing else is a paid product (`docs/money-model.md`).

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

Apply `supabase/migrations/` in order, then `supabase/seed.sql` for local seed data.
RLS: planning tables are public-read; identity/consent/redemption tables are
default-deny and written exclusively through SECURITY DEFINER RPCs with the anon key.
Do not add a service-role key to the app or Vercel.

## Scope discipline (NOT built — later gates)

Partner auth/roles, multi-district, reviews, AI, second district. Paid tiers are
dead permanently (money model v0.3), not gated. Reservations are never built
internally — BP hands off to the external TablePilot product
(`docs/tablepilot-bridge-handoff.md`). See the master architecture doc for the
gate sequence.

## Seed data is placeholder

Every venue and perk in `lib/seed.ts` / `supabase/seed.sql` is placeholder
curation. Replace with signed Editorial Seed partners before any tourist sees it.
