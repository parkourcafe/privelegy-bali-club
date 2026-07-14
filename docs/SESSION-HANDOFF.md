# Current session handoff — Other Bali

Updated: 2026-07-13. Branch: `loop/04-admin-integration`.

The four-session menu/action loop is integrated and ready for release review.
Read `CLAUDE.md`, `Other_Bali_Master_Architecture.md`,
`docs/loop/STATUS_BOARD.md` and `docs/loop/handoffs/session-4.md` before changes.

## Integrated product

- Structured, source-backed, freshness-gated menus with official-link/no-menu
  fallbacks and distinct partner/editorial voices.
- Capability-driven Reserve, Delivery, Takeaway, Pre-order, Website, WhatsApp
  and Google Maps handoffs. Providers own fulfilment; Other Bali never claims
  confirmation, availability, fee, ETA or service area.
- Safe action attribution through `log_event_v2`; acquisition `source` remains
  separate and no PII is accepted in action payloads.
- Partner factual menu/action drafts through onboarding tokens. These links are
  invitations, not strong identity. Editorial fields are not partner-writable.
- Basic-protected operator freshness queue with server-only review, publish,
  confirm and archive controls.
- Data Ops dry-run validators. Data Ops candidates remain draft/review and were
  not imported during integration.

## Release checklist

1. Review and apply pending baseline migrations in repository order, then apply
   `supabase/migrations/0026_menu_action_foundation.sql`. No migration was
   applied by the integration session.
2. Smoke-test anon reads: draft/review/expired menus and actions must be absent.
3. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `ADMIN_ACCESS_TOKEN`, server-only `SUPABASE_SERVICE_ROLE_KEY`, optional
   `NEXT_PUBLIC_TABLEPILOT_URL`, and existing `TABLEPILOT_PARTNER_TOKEN`.
4. Never expose `SUPABASE_SERVICE_ROLE_KEY` to a public/client environment.
5. Audit pre-existing venue photos for versioned owner consent before treating
   them as newly consented media.
6. Run menu/capability validators against future Data Ops JSON before any import;
   keep accepted rows draft/review until operator verification.

## Known limitations

- Admin Basic auth is a founder-scale control, not user-level audit identity.
- Onboarding token possession is not proof of a specific person.
- Verified legacy `booking_url` rows need the data-owned capability backfill in
  `docs/loop/requests/session-3-verified-booking-capability-backfill.md`; the
  compatibility booking CTA remains until then.
- Live Supabase mutation/RLS smoke tests remain a post-migration founder step.
- Repository paths containing a literal backslash break Node ESM tooling; final
  verification used a path-safe mirror with identical source.
