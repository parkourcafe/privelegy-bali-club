# Other Bali — data inventory (2026-07)

Purpose: a code-derived map of every piece of data the product collects, why,
who processes it, how long it's kept, and how it's deleted. It exists to feed
three downstream artifacts that must all agree (audit 2026-07):

1. the **App Store Connect privacy labels**,
2. the iOS **`PrivacyInfo.xcprivacy`** manifest,
3. the **privacy policy** (and web consent copy).

**This is a factual draft for legal review, not legal advice.** Every row cites
where it lives in the code. Where a classification is a judgment call (e.g. how a
first-party WebView's server-side collection maps onto Apple's native-SDK
manifest), it is flagged **[LEGAL]**, not decided here.

Scope note: the iOS app is currently a Capacitor wrapper around the web app, so
"collection" happens server-side in the web app (Supabase), not via native SDKs.
That distinction matters for the manifest (§6) and is flagged throughout.

---

## 1. Cookies (the only client-side identifiers)

| Cookie | Set by | Type | Lifetime | Purpose | PII? |
|---|---|---|---|---|---|
| `bp_guest` | server, `lib/guest-server.ts` | httpOnly, SameSite=Lax | 365 days | Anonymous device reference — links a source scan → redemption for venue attribution, and shows "my offers" on this device. Minted only by functional actions (`/api/source`, `/api/redeem`) or, post-consent, `/api/event`. | Pseudonymous ID, no name/email |
| `bp_consent` | client, `lib/consent.ts` | readable, SameSite=Lax | 365 days | Records the analytics opt-in choice (`granted`/`denied`). Is the consent record itself. | No |

No `localStorage`/`sessionStorage` is used for identity or state (guardrail #10).

---

## 2. Server-side data (Supabase Postgres)

Anonymous unless noted. Guest rows key off `guest_refs.ref` (= the `bp_guest`
token), never a name/email/account.

| Data element | Table (migration) | Fields | Purpose | Legal basis (draft) | Retention (current) | Deletion path |
|---|---|---|---|---|---|---|
| Device reference | `guest_refs` (0001/0003) | `ref`, `source`, `first_district`, `created_at` | Attribution + "my offers" | Legitimate interest / functional | **None (indefinite)** | `forget_guest` nulls `source`; row kept for redemption FK |
| Behavioural events | `events` (0003, `payload` added 0032) | `type`, `guest_ref_id`, `venue_slug`, `source`, `ts`, `payload` (jsonb) | Funnel analytics (growth vs partner-proof). `payload` carries menu/action context (`menuId`, `menuItemId`, `action`, `provider`, `capabilityId`) — **RPC-validated PII-free** (key allowlist + regex, 0032) | **Consent** (opt-in gate, §audit item 9) | **None (indefinite)** | `forget_guest` deletes; email request |
| Redemptions | `redemption_events` (0001/0003) | `guest_ref_id`, `venue_slug`, `perk_id`, `confirm_code`, `source`, `ts`, `externally_attributed` | Partner-proof / billing evidence (guardrail #8) | Legitimate interest / contract (venue) | **None (indefinite)** — retained as proof | **Retained** by `forget_guest` **[LEGAL]**; email for full erasure |
| Consent record | `consent_log` (0001) | `guest_ref_id`, `consent_type`, `granted`, `user_agent`, `ts` | Proof of redemption-tracking consent | Legal obligation / legitimate interest | **None (indefinite)** | Retained (consent proof) **[LEGAL]** |
| Saved places | `saved_places` (0019) | `guest_ref_id`, `venue_slug` | Anonymous ♥ list on device | Functional | **None** | `forget_guest` deletes |
| Shared lists | `shared_lists` (0019) | `id`, `guest_ref_id`, `venue_slugs` | Share-by-link | Functional | **None** | `forget_guest` deletes |
| **Guide leads (PII)** | `guide_leads` (0018) | `first_name`, `email` **or** `whatsapp`, `travel_date`, `interests[]`, `language`, `source`, `utm`, `consent_granted`, `consent_ts`, `user_agent`, timestamps | 48-hour guide delivery + follow-up (explicit opt-in lead magnet) | **Consent** (`consent_granted` required, `app/api/guide-lead`) | **None (indefinite)** | **No self-serve path** — email request only ⚠️ |

**Partner/venue-owner data (B2B, web onboarding — not the tourist app):**

| Data | Where | Fields | Notes |
|---|---|---|---|
| Venue confirmation | `venue_confirmations` (via `confirm_onboarding`) | contact `name`, `agreed`, `user_agent` | Venue owner accepts listing terms |
| Venue photos | `venues.photo_url` (via `set_venue_photo`, consent-gated 0030) | owner-uploaded image URL + rights | Owner submission, shown attributed |
| **Photo-rights consent (incl. IP)** | `venue_photo_consents` (0030) + `consent_log` owner fields (0033) | `venue_slug`, `photo_url`, `granted_by` (name/role), `user_agent`, **`submitted_ip` (inet)**, `terms_version`, `scope` | ⚠️ **IP address IS captured here** — venue-owner consent evidence at photo-upload time (`app/api/onboard/photo` reads `x-forwarded-for`). B2B web flow; **not** the tourist path. |

---

## 3. Third-party processors & sub-processors

| Party | Role | Data it sees | Status |
|---|---|---|---|
| **Supabase** | Database + hosting of §2 | All server-side data above | Active (sub-processor). Access uses the anon key + RLS/RPCs; a **`service_role` client** (`lib/supabase/service.ts`, `SUPABASE_SERVICE_ROLE_KEY`) was **added in the merge** for privileged server-only ops, env-guarded against preview→prod. NB: contradicts the earlier CLAUDE.md line "no service_role secret needed anywhere" — reconcile. |
| **Vercel** | App hosting | Request metadata at infra level — **IP address + user-agent in access/runtime logs** (standard; the app itself stores no IP) | Active (sub-processor) |
| **Google Analytics (GA4)** | Web analytics | Would receive event names + the GA client id | **DISABLED** — off unless `NEXT_PUBLIC_ENABLE_ANALYTICS=1` (audit item 8); ships off |
| Google Maps | External navigation handoff | Whatever the user does *after* leaving via a maps link | Not integrated in-app; user's own session under Google's policy |
| WhatsApp | Pre-filled message handoff | The message the user chooses to send | Link only; under WhatsApp's policy |
| TablePilot | Reservation handoff | Reservation details the user enters there | External product; `?source=bali_privilege` tag only |
| Google Fonts | — | **None** — fonts self-hosted at build via `next/font` | No external request |

---

## 4. Explicitly NOT collected

- **No account / login, no password.**
- **No payment data** (travellers never pay; guardrail #5).
- **No precise or coarse location / geolocation for travellers** — no geolocation
  API is used (Permissions-Policy denies it); no lat/long anywhere. "District" is
  a tapped preference, not a measured location. **IP caveat:** the only IP stored
  in the schema is `submitted_ip` on the **venue-owner** photo-consent path (B2B
  web onboarding), as rights-grant evidence — not the traveller flow. Vercel
  infra logs still see request IPs (standard, all hosts).
- **No IDFA / ATT / advertising identifier; no cross-app or cross-site tracking;
  no data brokers.** → `NSPrivacyTracking=false` is correct.
- **No third-party analytics or ad SDKs** (GA is first-party config and off).

---

## 5. Recommended App Store Connect privacy labels (DRAFT — confirm with legal)

Based on §1–§4, the in-app data flows suggest declaring:

| Apple data type | Collected? | Linked to user? | Used for tracking? | Purpose |
|---|---|---|---|---|
| **Contact Info** — Name, Email, Phone | Yes, **only if** the traveller submits the guide lead form | Yes (it's contact data) | No | App Functionality (deliver the guide), Customer support |
| **Identifiers** — Device ID | Yes (the anonymous `bp_guest` reference) | Pseudonymous | No | App Functionality; Analytics (only after opt-in) |
| **Usage Data** — Product Interaction | Yes (events) — **only after consent** | Pseudonymous | No | Analytics, App Functionality |
| **User Content** — Photos | Only venue *owners* (B2B), not travellers | — | No | App Functionality |
| Location, Financial, Health, Browsing history, Contacts, etc. | **No** | — | — | — |

"Data used to track you": **None** → tracking = No.

Note on IP: the only stored IP (`submitted_ip`) is on the **venue-owner** photo-consent
web flow, not the tourist app — so it likely falls outside the tourist app's
labels, but confirm scope with legal (§7.7). If venue owners ever submit photos
from *inside* the app, IP would then be app-collected and need declaring.

---

## 6. Recommended `PrivacyInfo.xcprivacy` (DRAFT) **[LEGAL]**

The current manifest declares empty arrays + `NSPrivacyTracking=false`. With GA
off, `NSPrivacyTracking=false` and empty `NSPrivacyTrackingDomains` are correct.

The open question is `NSPrivacyCollectedDataTypes`: the manifest is designed for
data collected by the **native app / SDKs**, but here collection is server-side
in the WebView's web app. Two defensible readings:

- **(a)** Mirror the App Store labels here too (Device ID, Product Interaction,
  and Contact Info when the lead form is used), for consistency; or
- **(b)** Keep it minimal because no native SDK collects data, and rely on the
  App Store labels for the disclosure.

Do **not** ship either blindly — this is the one item to put to the reviewer /
legal explicitly. No `NSPrivacyAccessedAPITypes` (required-reason APIs) are
currently used by the wrapper; confirm when native features are added.

---

## 7. Open questions for legal review

1. Retention: **nothing currently expires.** Define retention periods (e.g.
   events 14–24 months; leads until unsubscribe + N; redemptions per financial
   record rules) and implement TTL/cron. ⚠️ biggest gap.
2. Does the functional `bp_guest` (not just behavioural events) itself require
   consent under the applicable regime?
3. `guide_leads` has **no self-serve deletion/unsubscribe** — email only. Add a
   one-click unsubscribe + deletion?
4. `forget_guest` **retains** `redemption_events` + `consent_log` (proof). Confirm
   that retention is lawful vs. an erasure request; if not, extend the RPC.
5. Controller identity, business address, governing law, international transfer
   (Supabase/Vercel regions) — needed for the policy and DSA trader status.
6. §6(a) vs §6(b): the `PrivacyInfo.xcprivacy` collected-data reading.
7. Venue-owner `submitted_ip` (photo consent) — retention + is it in scope for
   the tourist **app's** privacy labels (it's a B2B web flow, not app collection)?
8. `service_role` key now in use (`lib/supabase/service.ts`) — reconcile with the
   CLAUDE.md guardrail and confirm it is never exposed to the client bundle.
9. Migration numbering **collisions** on disk (two `0030_`, three `0031_`, two
   `0032_`) — confirm apply order is unambiguous in prod.
10. ~~The merge added unit tests but CI didn't run them.~~ **Done** — a `test`
    step now runs the full `node:test` suite in CI (audit item 12).

---

## 8. Sources

Cookies: `lib/guest-server.ts`, `lib/consent.ts`. Tables: `supabase/migrations/`
0001, 0003, 0018, 0019. APIs: `app/api/{event,source,redeem,guide-lead,privacy/forget}`.
Analytics: `components/Analytics.tsx`, `lib/analytics.ts`. Erasure:
`supabase/migrations/0031_forget_guest.sql`. Menu/action events: `0032`,
`lib/actions/*`, `lib/contracts/menu-action`. Photo-rights consent + the only
stored IP: `0030`/`0033`, `app/api/onboard/photo/route.ts`. Service client:
`lib/supabase/service.ts`. Refreshed 2026-07-14 against the merged menu/action +
photo-consent code.
