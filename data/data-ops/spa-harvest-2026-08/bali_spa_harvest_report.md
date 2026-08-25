# Bali Massage & Spa — Harvest Report

Generated 2026-08-25T06:22:51+00:00 · Other Bali · source: Firecrawl multi-pattern discovery + own-site crawl

## Coverage

| | |
|---|---|
| Raw discovery hits | 525 + weak-area second pass |
| Unique venue domains after filtering | 208 |
| **Venues in the database** | **423** |
| VERIFIED | 193 |
| PARTIAL | 185 |
| REVIEW (needs a human) | 45 |
| Excluded with a recorded reason | 508 |
| Duplicates merged | 10 |

## Services

| | |
|---|---|
| **Total services extracted** | **6791** |
| Venues with structured services | 378 (89%) |
| Services with a price | 3956 (58%) |
| Services with a duration | 4604 (68%) |
| Venues with prices | 216 (51%) |

## Booking

| Provider | Venues |
|---|---|
| unknown | 192 |
| website_form | 147 |
| whatsapp | 51 |
| fresha | 14 |
| custom | 10 |
| zenoti | 7 |
| email | 1 |
| wetravel | 1 |

### Digital maturity

| Level | Venues | Share |
|---|---|---|
| direct booking | 273 | 65% |
| no online booking | 83 | 20% |
| WhatsApp only | 46 | 11% |
| full booking engine | 21 | 5% |

## Data quality

| Field | Coverage |
|---|---|
| Website | 100% |
| Phone | 48% |
| WhatsApp | 44% |
| Address | 57% |
| Opening hours | 47% |
| Booking URL | 70% |
| Structured services | 89% |
| Prices | 51% |
| ≥2 evidence sources | 73% |

## Geography

| Area | Venues |
|---|---|
| Ubud | 29 |
| Nusa Dua | 27 |
| Canggu | 17 |
| Uluwatu | 16 |
| Legian | 16 |
| Sanur | 13 |
| Kedewatan | 13 |
| Pererenan | 11 |
| Seminyak | 10 |
| Jimbaran | 10 |
| Candidasa | 10 |
| Petitenget | 10 |
| Berawa | 9 |
| Lovina | 9 |
| Munduk | 9 |
| Sidemen | 9 |
| Gianyar | 8 |
| Kerobokan | 8 |
| Ungasan | 8 |
| Amed | 8 |
| Balangan | 7 |
| Jalan Hanoman Ubud | 7 |
| Benoa | 6 |
| Pecatu | 6 |
| Seseh | 6 |
| Tabanan | 6 |
| Pandawa | 6 |
| Kuta | 5 |
| Padangbai | 5 |
| Denpasar | 5 |
| Bedugul | 5 |
| Monkey Forest Road Ubud | 5 |
| Kutuh Bali | 5 |
| Sukawati | 5 |
| Tanjung Benoa | 5 |
| Tegallalang | 4 |
| Umalas | 4 |
| Bingin | 4 |
| Ubud Centre | 4 |
| Sayan Ubud | 4 |
| Sawangan Nusa Dua | 4 |
| Seminyak Square | 4 |
| Peliatan | 3 |
| Payangan | 3 |
| Junjungan Ubud | 3 |
| Basangkasa Seminyak | 3 |
| Pecatu Indah | 3 |
| Suluban | 3 |
| Jalan Raya Ubud | 3 |
| Jalan Kayu Aya Seminyak | 3 |
| Jimbaran Bali | 2 |
| Jimbaran Bay | 2 |
| Geger Beach Nusa Dua | 2 |
| Pengosekan Ubud | 2 |
| Jalan Drupadi Seminyak | 1 |
| Andong Ubud | 1 |
| Melasti Ungasan | 1 |
| Bualu Nusa Dua | 1 |
| ITDC Nusa Dua | 1 |

## By Other Bali district

| District | Venues |
|---|---|
| Ubud | 98 |
| Canggu | 55 |
| the Bukit | 51 |
| Seminyak | 44 |
| Nusa Dua | 42 |
| Legian | 25 |
| Sanur | 15 |
| Jimbaran | 14 |
| Munduk | 14 |
| east Bali | 11 |
| Lovina | 9 |
| Sidemen | 7 |
| Amed | 7 |
| Tabanan | 6 |
| Denpasar | 4 |
| (not mapped to a district) | 21 |

## MVP readiness

| Flag | Venues |
|---|---|
| publish_ready | 423 |
| service_data_ready | 378 |
| price_data_ready | 216 |
| booking_ready | 188 |
| **merchant_opportunity** | **58** |

## What is NOT in this database, and why

- **No ratings or review counts.** Republishing review-derived data from Google,
  TripAdvisor or a booking platform breaches the project's hard guardrail and the
  platforms' terms. Venue pages link out to Google Maps instead, where the
  traveller reads the reviews at their source.
- **No coordinates.** Not published on most venue pages; inventing them is
  forbidden (§25), so the columns stay empty pending a licensed geocoding pass.
- Every excluded candidate is listed in `bali_spa_excluded.csv` with its reason,
  so a rerun does not repeat the same dead ends.
