# Other Bali — release integration workspace

Resident-curated Bali planning, verified venue menus and safe external action
handoffs. Canggu remains the first deep operating district; other districts are
planning surfaces until their own release gates are met. Reservations stay in
TablePilot or another verified external provider rather than being recreated in
this repository.

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

Deployed builds fail closed when Supabase is unavailable. For local development
only, invented fixture data can be enabled explicitly with
`OTHER_BALI_ALLOW_FIXTURE_DATA=YES`; preview and production ignore that flag.
Redemption writes need an isolated configured database and otherwise return
`redemption_storage_unconfigured`.

In production, `/admin/*` is protected by `ADMIN_ACCESS_TOKEN`. The browser
username can be anything; the password must match the token. If the token is
unset in production, `/admin/*` returns 404.

## Database

Do **not** apply the migration folder to staging or production yet. Historical
versions `0015`–`0019` are duplicated and first require a read-only comparison
with the live Supabase migration history plus an approved baseline/repair plan.
After that reconciliation, apply only the reviewed ordered plan; never guess by
renaming migrations that may already have run.

RLS exposes only active, published planning rows. Identity/consent/redemption
tables are default-deny. Operator queues use a server-only service-role key;
never prefix it with `NEXT_PUBLIC_` or expose it to browser code. Preview may
use only an isolated staging project ref and hard-denies the production ref.

## Current release gate

The codebase now contains public planning/place pages, draft menu/action
contracts, operator review queues, token-scoped partner maintenance, private
photo staging with exact-image consent, and a deterministic Data Ops compiler.
This does not mean production publication is approved: live migration history,
the 207-vs-208 venue denominator, isolated staging apply, operator verification,
and preview QA must close first. Reviews and aggregator content are not a public
product, and Data Ops captures remain unverified drafts until a real operator
checks them.

## Seed data is placeholder

Every venue and perk in `lib/seed.ts` / `supabase/seed.sql` is placeholder
curation. Replace with signed Editorial Seed partners before any tourist sees it.
