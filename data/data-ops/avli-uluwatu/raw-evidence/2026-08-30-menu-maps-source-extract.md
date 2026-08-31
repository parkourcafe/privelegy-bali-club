# AVLI official source extract — menu and Maps

**Captured:** `2026-08-30T04:42:40Z`
**Use:** internal evidence only; not a publication instruction

## Official menu handoff

The live AVLI menu page exposed Elementor popup `5424` for the main menu and
popup `5673` for desserts during capture:

- page: `https://avlibali.com/menu/`
- signature menu asset:
  `https://avlibali.com/wp-content/uploads/2025/09/Copy-of-Sharing-Menu-0107_page-0001.webp`
- signature asset SHA-256:
  `6d425bd7cc7f1732c2eae514576b2d3f057fb5d13730ce3cab270772efde38c6`
- signature asset dimensions: `874x1241`
- dessert menu asset:
  `https://avlibali.com/wp-content/uploads/2026/02/Dessert-Menu-276-opt-1_page-0001.webp`
- dessert asset SHA-256:
  `6b2ed1bb73d6126defafc81128f82d71172b861bccb5dadfe60f653c5fa86f97`
- dessert asset dimensions: `1747x2482`

### Signature-sharing transcription

Prices are printed in thousand IDR.

| Item | Printed price | Unit / note |
|---|---:|---|
| Lobster pasta | 270 | per 100g |
| Grilled king black tiger prawns | 150 | per 100g |
| Market whole fresh fish | 100 | per 100g; salt-baked preparation adds 300 |
| 400g Wagyu rib eye A5 | 2,800 | per item |
| 1.6kg tomahawk, 150-day grainfed | 3,900 | per item |
| Fresh black truffle | 290 | per 5g |
| Aquatir sturgeon caviar | 700 | per 10g |

### Dessert transcription

| Item | Printed price | Unit / note |
|---|---:|---|
| Baklava | 150 | per item |
| Mango passion | 140 | per item |
| Soft cookie | 140 | per item |
| Peanut tart | 170 | per item |
| Greek chocolate mousse | 280 | serves two |
| Prometheus dessert cocktail | 200 | per item |

Both assets state that 10% government tax and 7% service charge are added.
The main asset is explicitly a signature-sharing menu, so it does not prove
that every current food item or the restaurant-wide spend range was captured.

## Official Maps handoff

- official short URL: `https://maps.app.goo.gl/ou9Loqtmt68qnnDL8`
- resolved entity: `AVLI | Modern Greek`
- resolved coordinates: `-8.8165625, 115.0958125`
- resolved Google token: `/g/11xghttkxm`

The official site publishes only `Pecatu, South Kuta, Badung Regency, Bali
80361, Indonesia`. The resolved Maps target confirms the venue identity and
coordinates but does not confirm a street-and-number address.

## Rejected discovery evidence

Search results and directory pages exposed a plus code and exact-looking daily
closing times. They were not accepted because they are not AVLI-controlled
sources and conflict with the official site's broader `5 pm–late` statement.

## Database dedupe and publication check

The Other Bali production project was confirmed as `bali-privilege`
(`egkdapqwkfprtyqvvnso`) on 2026-08-30. An exact read-only query across venue
name, slug, official domain, Maps URL and Google token returned no prior AVLI
row. A one-row insert dry-run passed and the owner-authorized production write
created `v_import_avli_bali` / `avli-bali` as an active published venue. The
same transaction created a partial `source_snapshot` menu with two sections and
13 items, expiring 2026-09-30.

## Hero image selected under owner policy

- URL: `https://avlibali.com/wp-content/uploads/2025/09/Avli-Gallery-7.webp`
- SHA-256: `ffb9e3a84e4eb3cd7c22633fecbcd4383e4576fcae2972a9e95bf83fdb329bea`
- visual check: AVLI-branded exterior entrance

The owner instructed on 2026-08-30 that restaurant photos may be shown and
photo-rights research must not block card preparation. The repository's older
publication gate still asks for a rights record; this conflict is disclosed in
the draft rather than hidden.
