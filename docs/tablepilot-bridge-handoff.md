# TablePilot bridge — handoff (execute in the `tablepilot-id` repo)

> **Русское резюме для Селены:** это задание для Claude Code, открытого в репо
> `tablepilot-id`. BP-сторона моста уже закоммичена (кнопка Reserve ведёт на
> `/book/<slug>?source=bali_privilege`). Здесь — что должен сделать TablePilot:
> (1) принимать и сохранять источник `bali_privilege`, (2) считать «seated» по
> уже существующим статусам arrived/completed, (3) отдать BP защищённый отчёт
> без персональных данных гостей. Патч ниже готов к применению — «читай и выполняй».

**Audience:** a Claude Code session opened in `parkourcafe/tablepilot-id`.
**Branch:** `claude/continuation-6l3iqw` (create from `main` if absent, push there).
**Status:** BP side is DONE (commit `784ed44` in `privelegy-bali-club`). This doc is
the TablePilot side. Canonical business decision: `docs/money-model.md` in the BP repo
(money model v0.3, 2026-07-06).

---

## Context (read once, don't re-derive)

Bali Privilege (BP) earns a **fixed fee per confirmed seated reservation** made
through TablePilot. The tourist never pays. The chain:

> Find (BP) → Reserve (TablePilot `/book/:slug`) → Arrive/Seated (venue marks it)
> → Report → Fee (BP ↔ TablePilot reconciliation)

**What BP already ships (do not change, it is the contract):**

- The BP "Reserve a table" button opens
  `https://tablepilot-id.vercel.app/book/<tablepilotSlug>?source=bali_privilege`
  (new tab). `NEXT_PUBLIC_TABLEPILOT_URL` can override the host.
- BP logs its own `reservation_click` event before handoff — TablePilot does
  NOT need to notify BP about clicks.
- BP expects to pull a reconciliation report from TablePilot (spec in Step 3).

**Current gaps in `tablepilot-id` (verified against the code on 2026-07-06):**

1. `BookingSource` union (`src/lib/types.ts:10`) has no `bali_privilege`, and the
   public booking page (`PublicGuestApiPage` in `src/App.tsx`, ~line 691) hard-codes
   `source: "widget"` and ignores the `?source=` query param → BP attribution is
   silently dropped today.
2. "Seated" is not a reservation status. `ReservationStatus` already has
   `arrived` and `completed` — those ARE the seated signal. **Do not add a new
   status.** Billable = `source === "bali_privilege" && status ∈ {arrived, completed}`.
3. No partner report endpoint for BP to reconcile against.

**Constraints imported from BP guardrails (binding here too):**

- **No guest PII leaves TablePilot** in the partner report: no names, no phones,
  no guestId. Reservation id, venue slug, time, party size, status only. (BP #9)
- Attribution must be an **allowlist**, not a passthrough — never store an
  arbitrary query string as `source`. (BP #8 spirit)
- No tourist-side payments anywhere in this work. No billing UI, no invoicing —
  the report is raw material only. (BP #5)

---

## First steps (run these before touching code)

```bash
git fetch origin main
git checkout claude/continuation-6l3iqw 2>/dev/null || git checkout -b claude/continuation-6l3iqw origin/main
npm ci
npm test          # baseline must be green before you start
npm run build     # tsc --noEmit + vite build — baseline must pass
```

---

## Step 1 — accept and persist `source=bali_privilege`

### 1a. `src/lib/types.ts` — extend the union (line ~10)

```ts
export type BookingSource =
  | "widget"
  | "phone"
  | "whatsapp"
  | "instagram"
  | "google"
  | "walk_in"
  | "manual"
  | "bali_privilege";
```

### 1b. `src/lib/domain.ts` — label (in `sourceLabel`, line ~276)

Add to the `labels` record:

```ts
bali_privilege: "Bali Privilege"
```

(`Record<BookingSource, string>` makes this a compile error if forgotten — good.)

### 1c. `src/App.tsx` — include it in the staff dropdowns and source report

Line ~106:

```ts
const sources: BookingSource[] = ["phone", "whatsapp", "instagram", "google", "walk_in", "manual", "bali_privilege"];
```

This array feeds the reservation-edit dropdown, waitlist forms, and the
per-source report rows (`sourceRows`, ~line 2268) — one change covers all.

### 1d. `src/App.tsx` — `PublicGuestApiPage` reads the query param (allowlist)

Inside the component (top of `PublicGuestApiPage`, ~line 691), add:

```tsx
const [bookingSource] = useState<BookingSource>(() => {
  if (typeof window === "undefined") return "widget";
  const fromQuery = new URLSearchParams(window.location.search).get("source");
  return fromQuery === "bali_privilege" ? "bali_privilege" : "widget";
});
```

In `submit()` (~line 779) replace `source: "widget"` with `source: bookingSource`.

### 1e. `server/app.ts` — validate server-side (defense in depth)

`reservationPayload` (~line 285) currently blind-casts `body.source`. Replace:

```ts
source: (body.source as BookingSource | undefined) ?? "manual",
```

with an allowlist (module-level const next to the function):

```ts
const bookingSources: BookingSource[] = [
  "widget", "phone", "whatsapp", "instagram", "google", "walk_in", "manual", "bali_privilege"
];
```

```ts
source: bookingSources.includes(body.source as BookingSource)
  ? (body.source as BookingSource)
  : "manual",
```

---

## Step 2 — seated semantics (no code, one verification)

The money event is a reservation with `source === "bali_privilege"` whose status
reached `arrived` or `completed`. The venue already marks this in the Today
screen (`PATCH /api/admin/reservations/:id` with `status`). Verify the Today /
reservation-detail UI exposes an "Arrived" action for a confirmed reservation;
if it does, Step 2 is done — write nothing new. If it does not, add `arrived`
to the existing status-change control (do NOT invent a new status or screen).

---

## Step 3 — partner report endpoint (the report-back)

New route in `server/app.ts`. Place it right after the `/api/health` handler.
`timingSafeEqual` is already imported at the top of the file.

```ts
if (request.method === "GET" && url.pathname === "/api/partner/bali-privilege/report") {
  const expected = process.env.BP_PARTNER_TOKEN ?? "";
  if (!expected) {
    sendJson(response, 503, { error: "partner_report_not_configured" });
    return;
  }
  const provided = Buffer.from(getToken(request));
  const secret = Buffer.from(expected);
  if (provided.length !== secret.length || !timingSafeEqual(provided, secret)) {
    sendJson(response, 401, { error: "unauthorized" });
    return;
  }
  const from = url.searchParams.get("from"); // YYYY-MM-DD, optional
  const to = url.searchParams.get("to");     // YYYY-MM-DD, optional
  const rows = state.reservations
    .filter((item) => item.source === "bali_privilege")
    .filter(
      (item) =>
        (!from || item.startAt >= from) &&
        (!to || item.startAt <= `${to}T23:59:59.999Z`)
    )
    .map((item) => ({
      reservationId: item.id,
      venueSlug: state.venues.find((venue) => venue.id === item.venueId)?.slug ?? "",
      startAt: item.startAt,
      partySize: item.partySize,
      status: item.status,
      billable: item.status === "arrived" || item.status === "completed"
    }));
  sendJson(response, 200, {
    from,
    to,
    summary: {
      total: rows.length,
      billable: rows.filter((row) => row.billable).length,
      confirmedNotSeated: rows.filter((row) => row.status === "confirmed").length
    },
    reservations: rows
  });
  return;
}
```

Notes that are part of the spec, not suggestions:

- **PII check before committing:** the response must contain no guest name,
  phone, or guestId. If you add a field, re-check against BP guardrail #9.
- `confirmedNotSeated` is reported separately because it is the weaker billing
  basis (no-show risk) — BP decides what to do with it, TablePilot just reports.
- Auth is a single shared token in `BP_PARTNER_TOKEN`. Unset ⇒ 503 (endpoint
  off by default). Founder sets it in Vercel project env (manual step, flag it
  in your final summary) and hands the same value to BP.

---

## Verify (must actually run, not just compile)

```bash
npm test && npm run build

# terminal 1 — API with the partner token set
BP_PARTNER_TOKEN=dev-secret npm run api:dev   # listens on 127.0.0.1:8787

# terminal 2 — walk the chain
SLUG=$(curl -s localhost:8787/api/state -H "Authorization: Bearer demo-owner" | # get the seeded venue slug
  node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(JSON.parse(d).venues[0].slug))")

# 1. booking arrives with source=bali_privilege and survives the allowlist
curl -s -X POST "localhost:8787/api/public/$SLUG/reservations" \
  -H "content-type: application/json" \
  -d '{"name":"Bridge Test","phone":"+628123456789","partySize":2,"time":"19:00","source":"bali_privilege"}'
# → 201, reservation.source === "bali_privilege"

# 2. junk source is rejected to "manual", not stored verbatim
curl -s -X POST "localhost:8787/api/public/$SLUG/reservations" \
  -H "content-type: application/json" \
  -d '{"name":"Junk Source","phone":"+628123456780","partySize":2,"time":"20:00","source":"<script>x</script>"}'
# → 201, reservation.source === "manual"

# 3. report: no token → 401; wrong token → 401; token unset on server → 503
curl -s "localhost:8787/api/partner/bali-privilege/report"                          # 401
curl -s -H "Authorization: Bearer wrong" "localhost:8787/api/partner/bali-privilege/report"  # 401

# 4. report with token: reservation from (1) present, billable=false, no PII fields
curl -s -H "Authorization: Bearer dev-secret" "localhost:8787/api/partner/bali-privilege/report"

# 5. mark it arrived via admin PATCH, re-pull report → billable=true, summary.billable=1
```

Also verify in the browser: `npm run dev`, open
`http://127.0.0.1:5173/book/<slug>?source=bali_privilege`, submit a booking,
confirm it shows as "Bali Privilege" in the staff reservation list.

## Acceptance criteria

- [ ] `?source=bali_privilege` on `/book/:slug` is captured end-to-end; any other
      `?source=` value falls back to `widget` (client) / `manual` (server).
- [ ] `bali_privilege` bookings are visible in staff UI and the per-source report.
- [ ] `GET /api/partner/bali-privilege/report` — 503 unset, 401 bad token,
      200 with correct `summary` and zero PII otherwise.
- [ ] `npm test` and `npm run build` green; curl chain above walked manually.
- [ ] Committed and pushed to `claude/continuation-6l3iqw` with a message that
      references the BP bridge (BP commit `784ed44`).

## Out of scope — do not do these even if they look adjacent

- No billing/invoicing UI, no fee amounts anywhere in TablePilot.
- No webhooks/push to BP — BP pulls the report. (Webhook is a later decision.)
- No new `ReservationStatus`, no schema/state-shape changes beyond the
  `BookingSource` union.
- No changes to the BP repo from the TablePilot session.
- No deposits/QRIS work — untouched.
