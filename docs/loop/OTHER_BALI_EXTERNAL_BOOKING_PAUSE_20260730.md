# Discovery — temporary owned-booking pause

Date: 2026-07-30

## Owner decision

The owned TablePilot reservation rail is paused for approximately one month.
During the pause, Other Bali may continue to hand a visitor to a fresh,
verified external booking provider or the venue's official booking page.
The provider owns availability, confirmation, payment, cancellation and
support. An outbound click remains Intent, not a confirmed booking or a
billable Outcome.

## AS-IS

- TablePilot public links depend on a configured public base URL.
- Confirmed external providers resolve independently of TablePilot.
- Public Chope handoffs were blocked by the 2026-07-28 fail-closed decision.
  On 2026-07-30 the owner explicitly amended that decision: the official
  Chope import is an approved external handoff source and stored verified
  Chope capabilities must be restored.
- Production currently has no confirmed TablePilot action capabilities.

## Safe implementation

1. Require an explicit `NEXT_PUBLIC_TABLEPILOT_ENABLED=YES` launch flag.
2. Default the flag to `NO` in the environment template.
3. Keep previews fail-closed and preserve the existing production-origin
   allowlist when the rail is later re-enabled.
4. Restore only stored, fresh, verified Chope capabilities that already map to
   active published venues. Do not manufacture links for unmatched candidates.
5. Verify that a mixed action set still exposes a fresh external reservation
   while rejecting TablePilot when the flag is off.

## Chope reconciliation

The source dry-run contains 607 draft candidates. Production contains 338
distinct venues with a stored, fresh, verified Chope capability. Those 338 can
be restored deterministically. The remaining 269 candidates require identity
matching before publication.
