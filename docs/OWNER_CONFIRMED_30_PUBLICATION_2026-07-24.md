# Owner-confirmed venue batch — discovery note

Date: 2026-07-24  
Source batch: `otherbali-research-2026-07-23`  
Scope: 30 venue submissions confirmed by the owner for publication.

## Repository and production facts

- The generic `/places/[slug]` route reads active rows with
  `publication_status = 'published'`.
- A public/indexable detail page additionally requires non-empty
  `why_its_here` and `best_for`.
- Production contains 30 matching `venue_submissions`.
- Eighteen candidates already have a canonical venue record; twelve require a
  new record.
- Existing canonical slugs must be preserved. Known duplicate review rows for
  Room 4 Dessert and Merah Putih must not be promoted.
- No candidate media has been uploaded yet. This batch does not invent or
  attach media, hours, prices, ratings, reviews, perks or booking claims.

## Intended change

- Insert only missing canonical venue rows.
- Update incomplete existing canonical rows without overwriting stronger
  editorial content.
- Publish all 30 owner-confirmed candidates as active factual listings.
- Keep editorial workflow status at `review`.
- Record the confirmation source and verification timestamp.
- Mark all 30 source submissions `accepted`.
- Keep sponsored ranking disabled.

## Verification

After production apply, verify:

1. exactly 30 accepted source submissions;
2. exactly 30 canonical venue records resolved by the batch mapping;
3. no duplicate canonical target slugs;
4. all 30 are active/published and pass the current public-page gate;
5. public catalogue/detail URLs return successfully after cache refresh.

## Production result

Applied migration:
`publish_owner_confirmed_venue_batch_20260724`.

Database verification:

- canonical venue records: `30 / 30`;
- active + published: `30 / 30`;
- decision-ready under the current route gate: `30 / 30`;
- accepted source submissions: `30 / 30`;
- sponsored rows: `0`;
- unverified hours written by this batch: `0`;
- new canonical records: `12`;
- updated canonical records: `18`;
- canonical records already public before this batch: `14`.

Public verification:

- detail checks: `90 / 90` passed (`30 venues × 3 user agents`);
- HTTP status: `200` for browser, generic crawler and Googlebot Smartphone;
- canonical: self-referencing for every venue;
- robots: no accidental `noindex`;
- useful rendered HTML: present for every venue;
- internal catalogue links: `30 / 30`, across paginated `/places` pages;
- sitemap immediately after apply: `14 / 30` (the fourteen records that were
  already public before the batch). The sitemap route regenerates hourly, so
  the twelve new and four newly activated records are expected after the
  existing ISR window. This is a cache refresh state, not a data/publication
  failure.

## Canonical public URLs

1. `/places/sangsaka`
2. `/places/hujan-locale`
3. `/places/locavore-nxt`
4. `/places/room4dessert`
5. `/places/mozaic`
6. `/places/aperitif-restaurant`
7. `/places/mauri-restaurant`
8. `/places/fisherman-s-club`
9. `/places/the-chowk-ubud`
10. `/places/merah-putih-indonesian-restaurant`
11. `/places/kaum-bali`
12. `/places/barbacoa`
13. `/places/sarong`
14. `/places/mamasan-bali`
15. `/places/watercress-ubud`
16. `/places/watercress-seminyak`
17. `/places/watercress-berawa`
18. `/places/milk-and-madu-uluwatu`
19. `/places/milk-and-madu-ubud`
20. `/places/milk-and-madu-seminyak`
21. `/places/rockfish-cliffside`
22. `/places/lolas-cantina-uluwatu`
23. `/places/lolas-cantina-canggu`
24. `/places/chaskaa-ubud`
25. `/places/chaskaa-jimbaran`
26. `/places/revolver-seminyak`
27. `/places/the-avocado-factory`
28. `/places/kynd-community`
29. `/places/warung-mak-beng`
30. `/places/nasi-ayam-kedewatan-ibu-mangku`

## Deferred data

- No photo or video was attached because the source submissions currently have
  zero uploaded media.
- No hours, prices, ratings, review prose, perks or booking claims were added.
- `editorial_status` remains `review`; the public fields are conservative and
  factual.
- Existing stronger Other Bali editorial text was preserved.
