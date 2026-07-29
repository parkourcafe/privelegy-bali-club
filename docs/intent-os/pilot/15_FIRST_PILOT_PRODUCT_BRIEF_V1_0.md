# First Pilot Product Brief V1.0

**Winner:** `OB-CAN-0011` — Choose a romantic dinner in Ubud
**Backup:** `OB-CAN-0007` — Find breakfast open before 7 AM
**Reuse decision:** `EXTEND_EXISTING`
**Generated:** 2026-07-29T19:00:09.424Z

> **Status: specified, not implemented.** Implementation requires editing `lib/` and `app/`, which is
> outside this run's authorised file scope. This brief is the handoff.

## 1. One user job

Choose a romantic dinner in Ubud that fits the specific evening — quiet enough to talk, or with a
sunset view, or private enough to propose.

Not "browse date-night restaurants" (already served), but "narrow a qualifying set by the constraint
that actually decides it".

## 2. Required inputs (1–4)

1. District — defaults to the current spoke (Ubud).
2. Constraint — one of: `quiet` (no loud music), `sunset view`, `secluded`, `special occasion`.
3. *(optional)* Party size — couple or small group.

No free-text. Every input maps to an existing editorial field; none invents a new data requirement.

## 3. Complete free result

A ranked list of qualifying published Ubud venues with the existing editorial verdict
(`why_its_here`, `best_for`, `not_for`), no truncation, no signup, no paywall. Where the constraint
cannot be evidenced for a venue, that venue is **excluded rather than guessed** (guardrail 10).

Empty result is a valid, honest outcome and must say so plainly.

## 4. Portable outcome actions

Existing rails only: save, add-to-trip, share, directions (Google Maps handoff), and — in Canggu
only, per the existing `actionMode` gate — the full action set. No new action type.

## 5. Second job

After choosing dinner, the natural next job is assembling the rest of the evening — which is
`add-to-trip`, already implemented. The pilot ends by offering it.

## 6. Data selection method

Filter `getIntentSpokes()` output for `district = ubud`, `jobSlug = date_night_special`, then narrow by
constraint against existing tags:

| Constraint | Source field | If absent |
|---|---|---|
| quiet | `practical_tags` / `vibe_tags` | exclude |
| sunset view | `vibe_tags` + `sunset_drinks_view` job | exclude |
| secluded | `vibe_tags` | exclude |
| special occasion | `special_occasion` job slug | exclude |

**No new column, table or migration.** If a constraint proves unsupported by existing tags, that
constraint ships disabled rather than approximated.

## 7. Privacy and storage

No PII. Identity stays with the existing httpOnly `GuestRef`. Nothing in `localStorage`. No new
storage of any kind.

## 8. Analytics without user-content payloads

Reuse the existing growth family: `moment_started`, `shortlist_generated`, `venue_detail_view`,
`save`, `share`, `direction_click`. Payload carries the constraint enum only — never free text,
never venue-level personal data. Analytics failure must never block an outbound action.

## 9. Empty / loading / error / offline states

- **Empty:** "No Ubud venue currently has verified evidence for this constraint." Offers to relax it.
- **Loading:** server-rendered; no hydration-dependent critical content.
- **Error:** falls back to the unfiltered spoke, which already works.
- **Offline:** PWA shell serves the last ISR-rendered spoke.

## 10. Accessibility

Constraint chips are real radio inputs with labels, ≥44 px targets, visible focus order, no
horizontal-scroll container hiding a required choice.

## 11. SEO shell

**`index_new_page: false`.** The constraint view is a filtered state of an existing canonical URL,
not a new indexable page. It must not create a second URL competing with `/bali/ubud/date-night` —
that is the cannibalization risk the SERP research flagged.

## 12. Feature flag

`feature_flag_required: true`. Ships behind a flag, default off. The unfiltered spoke is unaffected
when off.

## 13. Rollback

Disable the flag. No migration, no data change, no URL change — so rollback is instant and total.

## 14. Acceptance

- [ ] Constraint filter returns only venues with positive evidence for the constraint
- [ ] Venues lacking evidence are excluded, never inferred
- [ ] Empty state renders honestly
- [ ] No new URL is indexable
- [ ] Flag off restores exact current behaviour
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` pass
- [ ] Analytics payload contains no free text or PII
