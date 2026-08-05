# Constraints that have actually rejected a write

Not a schema dump. These are the rules that stopped a real bulk write, with the
migration they live in and what to do instead.

---

## `venues.publication_status`

```sql
check (publication_status in ('published', 'review'))
```

`supabase/migrations/0018_uluwatu_launch.sql:34`

**`archived` is not a legal value.** To take a card off the public site, set it
to `review` — that is the internal-only, noindex state. This was caught by
reading the migration *before* running the de-publish batch for the thin cards,
which is the only reason it did not become a fourth failed round trip.

---

## `venues_published_requires_verification_check`

**Exists in production. Exists in no migration in this repository.**

Publishing a venue requires `verified_at` and `verification_source` to be
non-null. A batch that sets `publication_status = 'published'` without them is
rejected.

This is the single most important entry on the page, and not because of the
rule itself. It is proof that reading the repository is not the same as knowing
what production will accept. Dry-run one row.

For the BPC import the honest values were
`verification_source = 'bali_privileges_club_partner_page'` and the date the
partner page was actually read.

---

## `venues.price_band`

```sql
check (price_band is null or price_band in ('$', '$$', '$$$', '$$$$'))
```

`supabase/migrations/0018_uluwatu_launch.sql:28`

Free-text price bands are rejected. The human-readable anchor belongs in
`price_anchor`.

---

## `perks.publication_status`

```sql
check (publication_status in ('draft','confirmed','disabled'))
```

`supabase/migrations/0031_secure_partner_operator_rpcs.sql:193`

**`published` is not a legal value for a perk.** This one is easy to hit by
analogy with `venues`, and the analogy is wrong. A live perk is `confirmed`.

---

## `perks_confirmed_evidence_check`

```sql
check (
  publication_status <> 'confirmed'
  or (verified_at is not null and expires_at is not null and expires_at > verified_at)
)
```

`supabase/migrations/0031_secure_partner_operator_rpcs.sql:200`

A confirmed perk must carry both a verification date and a future expiry. An
offer with no end date is a claim that cannot go stale, which is exactly the
kind of claim that goes stale.

---

## `venue_action_capabilities.status`

```sql
check (status in ('draft','review','confirmed','disabled','archived'))
```
and
```sql
check (status <> 'confirmed' or (verified_at is not null and expires_at is not null))
```

`supabase/migrations/0032_menu_action_foundation.sql:107,120`

Same shape as perks: confirmed means evidenced and dated. An action that cannot
expire will eventually send someone to a booking channel that no longer exists.

---

## `menus.status`

```sql
check (status in ('draft','review','published','archived'))
```

`supabase/migrations/0032_menu_action_foundation.sql:14`

Note that `menus` **does** accept `archived` while `venues` does not. The
vocabularies are not shared; check per table.

---

## RLS on public reads

`supabase/migrations/0031_secure_partner_operator_rpcs.sql:172`

```sql
using (status = 'active' and publication_status = 'published')
```

A row that is published but not `active` is invisible to the public client.
When a write "succeeds" and the page still shows nothing, check `status` before
suspecting the cache.

---

## The pattern across all of these

Every one is a **conditional evidence requirement**: a stronger state (published,
confirmed) demands proof that a weaker state does not.

They are satisfiable by typing a plausible date. Doing so passes the check and
defeats the point — the constraint exists to send you back to the source. If
you cannot honestly fill `verified_at`, the row is not ready to be published.
