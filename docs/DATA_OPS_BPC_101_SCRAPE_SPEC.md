# ТЗ на сбор: 101 партнёрская страница Bali Privileges Club

**Кому:** Codex / Firecrawl.
**Зачем:** данные пойдут в каталог Other Bali (проверенный источник —
партнёрские страницы baliprivilegesclub.com). Рестораны и кафе (77) уже
собраны и импортированы; здесь — спа, фитнес, бьюти, йога, пляжные клубы,
падел, сёрф.

**Результат:** один CSV или JSON, 101 запись, ключ состыковки — `url`.
Файлы рядом: `bpc-101-urls.txt` (голый список для batch-скрейпа),
`bpc-101-targets.json` (url + ожидаемая категория), `bpc-101-schema.json`.

---

## 1. Схема извлечения (Firecrawl `extract` / `json` format)

```json
{
 "type": "object",
 "properties": {
  "venue_name": {
   "type": "string",
   "description": "Venue name exactly as shown on the page"
  },
  "address": {
   "type": "string",
   "description": "Full street address in Latin script. Country must be written 'Indonesia', never in Cyrillic. Empty string if absent."
  },
  "district": {
   "type": "string",
   "description": "Area/district as stated on the page. If it contradicts the address, still report what the page says; the mismatch is resolved downstream."
  },
  "official_website_url": {
   "type": "string",
   "description": "ONLY the venue's own website. If the link points to instagram.com, taplink.cc, linktr.ee, gofood, grab, a link aggregator or a booking marketplace, return an empty string and put that link in other_links instead."
  },
  "instagram_url": {
   "type": "string"
  },
  "other_links": {
   "type": "array",
   "items": {
    "type": "string"
   },
   "description": "Any link that was offered as 'website' but is not a real venue site"
  },
  "benefit_verbatim": {
   "type": "string",
   "description": "The discount/perk wording exactly as printed on the page"
  },
  "discount_percent": {
   "type": "integer",
   "description": "Numeric percent if the benefit is a percentage discount; omit if not"
  },
  "complimentary_item": {
   "type": "string",
   "description": "Free item, if the benefit is a gift rather than a percentage"
  },
  "card_required": {
   "type": "boolean"
  },
  "booking_required": {
   "type": "boolean"
  },
  "minimum_spend": {
   "type": "string"
  },
  "valid_days": {
   "type": "string"
  },
  "valid_hours": {
   "type": "string"
  },
  "valid_until": {
   "type": "string",
   "description": "Expiry date if stated, ISO format. Empty if the page states none."
  },
  "other_restrictions": {
   "type": "string"
  },
  "phone": {
   "type": "string",
   "description": "Collect but it will be discarded downstream; do not guess"
  },
  "opening_hours": {
   "type": "string"
  }
 },
 "required": [
  "venue_name",
  "address",
  "benefit_verbatim"
 ]
}
```

## 2. Пример вызова

```bash
curl -X POST https://api.firecrawl.dev/v1/batch/scrape \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d @payload.json
```

где `payload.json` — `{"urls": [...из bpc-101-urls.txt...],
"formats": ["json"], "jsonOptions": {"schema": ...схема выше...}}`

## 3. Правила качества

Это не придирки — ровно эти четыре дефекта нашлись в прошлой выгрузке
по ресторанам, и каждый пришлось чинить руками:

1. **`official_website_url` — только собственный сайт заведения.**
   Если на странице под видом сайта стоит `instagram.com`, `taplink.cc`,
   `linktr.ee`, GoFood/Grab или домен-заглушка — поле оставить пустым,
   а ссылку положить в `other_links`.
   *В прошлый раз: 13 ошибок из 77, включая `rupagencymockup.com`.*
2. **Адрес — латиницей, страна `Indonesia`.**
   *В прошлый раз: 34 адреса из 77 содержали «Индонезия» кириллицей.*
3. **Район из адреса не выдумывать.** Пишите то, что на странице; если он
   противоречит адресу — так и отметьте, мы разрешим расхождение сами.
   *В прошлый раз: указан Чангу, адрес — Денпасар.*
4. **Пусто значит пусто.** Не писать «нет данных», «n/a», «null» текстом
   внутри поля и не додумывать значение.

Дополнительно: `valid_until` у ресторанов был пуст во всех 77 записях —
если на странице срок действия скидки всё же указан, это важно, не пропускайте.

## 4. Список — 101 страница

| № | Название у BPC | Тип у BPC | Наша категория | URL |
|---|---|---|---|---|
| 1 | ARCTIC Recovery &#124; Sauna, Massage & Ice Bath | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/arctic-recovery-sauna-massage-ice-bath/ |
| 2 | ARETE Sports Complex | Padel | `fitness` | https://baliprivilegesclub.com/partners/arete-sports-complex/ |
| 3 | BALI BABE beauty & hair Ubud | Beauty | `beauty` | https://baliprivilegesclub.com/partners/bali-babe-beauty-hair-ubud/ |
| 4 | BALI BABE beauty & hair Uluwatu | Beauty | `beauty` | https://baliprivilegesclub.com/partners/bali-babe-beauty-hair-uluwatu/ |
| 5 | BALI BABE beauty & hair Canggu | Beauty | `beauty` | https://baliprivilegesclub.com/partners/bali-babe-beauty-hair/ |
| 6 | BALI DACHA | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/bali-dacha/ |
| 7 | Bali Yoga Center | Fitness | `fitness` | https://baliprivilegesclub.com/partners/bali-yoga-center/ |
| 8 | Beam And Bare Laser Studio Bali | Beauty | `beauty` | https://baliprivilegesclub.com/partners/beam-and-bare-laser-studio-bali/ |
| 9 | Beautique | Beauty | `beauty` | https://baliprivilegesclub.com/partners/beautique/ |
| 10 | BULLGYM BALI at Cafe Del Mar Bali | Fitness | `fitness` | https://baliprivilegesclub.com/partners/bullgym-bali-at-cafe-del-mar-bali/ |
| 11 | De WAVE Jimbaran | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/de-wave-jimbaran/ |
| 12 | EL Salon Bali | Beauty | `beauty` | https://baliprivilegesclub.com/partners/el-salon-bali/ |
| 13 | Endless Summer | Surfing | `surf` | https://baliprivilegesclub.com/partners/endless-summer/ |
| 14 | Espace Spa | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/espace-spa/ |
| 15 | Fajar Bali Spa | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/fajar-bali-spa/ |
| 16 | Firefly Laser Hair Removal & Facial | Beauty | `beauty` | https://baliprivilegesclub.com/partners/firefly-laser-hair-removal-facial/ |
| 17 | Fitness Plus Jimbaran | Fitness | `fitness` | https://baliprivilegesclub.com/partners/fitness-plus-jimbaran/ |
| 18 | GravityStretching — Canggu | Fitness | `fitness` | https://baliprivilegesclub.com/partners/gravitystretching-canggu/ |
| 19 | GravityStretching | Fitness | `fitness` | https://baliprivilegesclub.com/partners/gravitystretching/ |
| 20 | Hammana Spa Ubud | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/hammana-spa-ubud/ |
| 21 | Heartbeat Bali Fitness Boutique | Fitness | `fitness` | https://baliprivilegesclub.com/partners/heartbeat-bali-fitness-boutique/ |
| 22 | Hill Fit Bali | Fitness | `fitness` | https://baliprivilegesclub.com/partners/hill-fit-bali/ |
| 23 | HOTSTONE Regenerative Retreat Hot Stone Club Ubud | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/hotstone-regenerative-retreat-hot-stone-club-ubud/ |
| 24 | Ijen Spa | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/ijen-spa/ |
| 25 | Kae Spa — Batu Bolong | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/kae-spa-batu-bolong/ |
| 26 | Kae Spa — Batu Mejan | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/kae-spa/ |
| 27 | Kanana Gym | Fitness | `fitness` | https://baliprivilegesclub.com/partners/kanana-gym/ |
| 28 | Kanana Yoga | Yoga | `yoga` | https://baliprivilegesclub.com/partners/kanana-yoga/ |
| 29 | Karma Spa – Karma Kandara | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/karma-spa-karma-kandara/ |
| 30 | Kayumanis Beach Bar & Grill Nusa Dua | Beach club | `beach_club` | https://baliprivilegesclub.com/partners/kayumanis-beach-bar-grill-nusa-dua/ |
| 31 | Korean Face Bar | Beauty | `beauty` | https://baliprivilegesclub.com/partners/korean-face-bar/ |
| 32 | Lash and Nails Lounge | Beauty | `beauty` | https://baliprivilegesclub.com/partners/lash-and-nails-lounge/ |
| 33 | Love Spa Ubud | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/love-spa-ubud/ |
| 34 | Lyla Wellness | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/lyla-wellness/ |
| 35 | Lymphatic Drainage by Carica Studio | Beauty | `beauty` | https://baliprivilegesclub.com/partners/lymphatic-drainage-by-carica-studio/ |
| 36 | Maison Pilates | Fitness | `fitness` | https://baliprivilegesclub.com/partners/maison-pilates/ |
| 37 | Miss Yu Hair Bar | Beauty | `beauty` | https://baliprivilegesclub.com/partners/miss-yu-hair-bar/ |
| 38 | MOII Aesthetic Clinic Bali | Beauty | `beauty` | https://baliprivilegesclub.com/partners/moii-aesthetic-clinic-bali/ |
| 39 | MONSTER PADEL SOCIAL CLUB BALI | Padel | `fitness` | https://baliprivilegesclub.com/partners/monster-padel-social-club-bali/ |
| 40 | Moon Beauty Space | Beauty | `beauty` | https://baliprivilegesclub.com/partners/moon-beauty-space/ |
| 41 | MYNX Hair & Beauty Emporium | Beauty | `beauty` | https://baliprivilegesclub.com/partners/mynx-hair-beauty-emporium/ |
| 42 | Oasis Padel | Padel | `fitness` | https://baliprivilegesclub.com/partners/oasis-padel/ |
| 43 | Omra Spa | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/omra-spa/ |
| 44 | PALLAS Fit Ground | Fitness | `fitness` | https://baliprivilegesclub.com/partners/pallas-fit-ground/ |
| 45 | Raya Spa & Massage Canggu | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/raya-spa-and-massage-canggu/ |
| 46 | Riverside Spa | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/riverside-spa/ |
| 47 | Rose Petal | Beauty | `beauty` | https://baliprivilegesclub.com/partners/rose-petal/ |
| 48 | Roseluxe Beauty Laser | Beauty | `beauty` | https://baliprivilegesclub.com/partners/roseluxe-beauty-laser/ |
| 49 | Sakala Beach Club | Beach club | `beach_club` | https://baliprivilegesclub.com/partners/sakala-beach-club/ |
| 50 | Sembuh Recovery Balangan | Fitness | `fitness` | https://baliprivilegesclub.com/partners/sembuh-recovery-balangan/ |
| 51 | SINERFAND SPA CANGGU | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/sinerfand-spa-canggu/ |
| 52 | Soendaram Spa & Wellness | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/soendaram-spa-wellness/ |
| 53 | SUGAR SKIN | Beauty | `beauty` | https://baliprivilegesclub.com/partners/sugar-skin/ |
| 54 | SURF JOINT | Surfing | `surf` | https://baliprivilegesclub.com/partners/surf-joint/ |
| 55 | Svaha Spa Arden | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-arden/ |
| 56 | Svaha Spa Batu Bolong | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-batu-bolong/ |
| 57 | Svaha Spa Berawa | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-berawa/ |
| 58 | Svaha Spa Bingin | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-bingin/ |
| 59 | Svaha Spa Bisma | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-bisma/ |
| 60 | Svaha Spa Celuk | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-celuk/ |
| 61 | Svaha Spa Dedary | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-dedary/ |
| 62 | Svaha Spa Kelusa | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-kelusa/ |
| 63 | Svaha Spa Kenderan | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-kenderan/ |
| 64 | Svaha Spa La Mewali | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-la-mewali/ |
| 65 | Svaha Spa Maar | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-maar/ |
| 66 | Svaha Spa Melasti | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-melasti/ |
| 67 | Svaha Spa Nelayan | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-nelayan/ |
| 68 | Svaha Spa Padang Linjong | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-padang-linjong/ |
| 69 | Svaha Spa Sana Vie | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-sana-vie/ |
| 70 | Svaha Spa Sanora | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-sanora/ |
| 71 | Svaha Spa Sanur | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-sanur/ |
| 72 | Svaha Spa Seminyak Sanctuary | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-seminyak-sanctuary/ |
| 73 | Svaha Spa Seminyak | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-seminyak/ |
| 74 | Svaha Spa Teges | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-teges/ |
| 75 | Svaha Spa Umalas | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/svaha-spa-umalas/ |
| 76 | Swargaloka Spa | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/swargaloka-spa/ |
| 77 | TEPLO: Spa, Massage, Cafe | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/teplo-spa-massage-cafe/ |
| 78 | The Bali Physio — Kedampang | Fitness | `fitness` | https://baliprivilegesclub.com/partners/the-bali-physio-kedampang/ |
| 79 | The Bali Physio — Kerobokan | Fitness | `fitness` | https://baliprivilegesclub.com/partners/the-bali-physio-kerobokan/ |
| 80 | The Bali Physio — Mas Ubud | Fitness | `fitness` | https://baliprivilegesclub.com/partners/the-bali-physio-mas-ubud/ |
| 81 | The Bali Physio — Peliatan Ubud | Fitness | `fitness` | https://baliprivilegesclub.com/partners/the-bali-physio-peliatan-ubud/ |
| 82 | The Bali Physio — Pererenan | Fitness | `fitness` | https://baliprivilegesclub.com/partners/the-bali-physio-pererenan/ |
| 83 | The Bali Physio — Sanur | Fitness | `fitness` | https://baliprivilegesclub.com/partners/the-bali-physio-sanur/ |
| 84 | The Bali Physio — Uluwatu | Fitness | `fitness` | https://baliprivilegesclub.com/partners/the-bali-physio-uluwatu/ |
| 85 | The Bali Physio — Shortcut Canggu | Fitness | `fitness` | https://baliprivilegesclub.com/partners/the-bali-physio/ |
| 86 | The Calma Spa Bali – Jimbaran Beach | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/the-calma-spa-bali-jimbaran-beach/ |
| 87 | The FACES — Sanur | Beauty | `beauty` | https://baliprivilegesclub.com/partners/the-faces-sanur/ |
| 88 | The FACES — Ubud | Beauty | `beauty` | https://baliprivilegesclub.com/partners/the-faces/ |
| 89 | The Istana | SPA & massage | `spa` | https://baliprivilegesclub.com/partners/the-istana/ |
| 90 | The Space Bali Yoga & Co-working Uluwatu | Yoga | `yoga` | https://baliprivilegesclub.com/partners/the-space-bali-yoga-co-working-uluwatu/ |
| 91 | The Tanning Edit Bali — Canggu | Beauty | `beauty` | https://baliprivilegesclub.com/partners/the-tanning-edit-bali-canggu/ |
| 92 | The Tanning Edit Bali — Seminyak | Beauty | `beauty` | https://baliprivilegesclub.com/partners/the-tanning-edit-bali/ |
| 93 | The Yoga Garden Lembongan | Yoga | `yoga` | https://baliprivilegesclub.com/partners/the-yoga-garden-lembongan/ |
| 94 | Threshold Gym | Fitness | `fitness` | https://baliprivilegesclub.com/partners/threshold-gym/ |
| 95 | TOPGYM | Fitness | `fitness` | https://baliprivilegesclub.com/partners/topgym/ |
| 96 | Train At Six Gym & Wellness Centre | Fitness | `fitness` | https://baliprivilegesclub.com/partners/train-at-six-gym-wellness-centre/ |
| 97 | Tropical Temptation Beach Club | Beach club | `beach_club` | https://baliprivilegesclub.com/partners/tropical-temptation-beach-club/ |
| 98 | ULU FIT Bali &#124; Fitness Centre in Uluwatu | Fitness | `fitness` | https://baliprivilegesclub.com/partners/ulu-fit-bali-fitness-centre-in-uluwatu/ |
| 99 | Upgrade Beauty Center | Beauty | `beauty` | https://baliprivilegesclub.com/partners/upgrade-beauty-center/ |
| 100 | White Rock Beach Club | Beach club | `beach_club` | https://baliprivilegesclub.com/partners/white-rock-beach-club/ |
| 101 | Yoga 108 Bali | Yoga | `yoga` | https://baliprivilegesclub.com/partners/yoga-108-bali/ |
