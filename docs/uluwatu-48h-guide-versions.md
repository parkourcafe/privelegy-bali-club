# 48 hours in Uluwatu — email & WhatsApp versions

Companion to the web guide at `/uluwatu/48-hours` (the canonical version).
**Delivery status (honest):** no email/WhatsApp provider is integrated.
Leads are stored in `guide_leads` (consent-stamped); sends are MANUAL until
a provider is wired (see gap register). The site never claims a message was
sent.

---

## Email version

**Subject:** Your 48 hours in Uluwatu — the plan that doesn't backtrack
**Preheader:** One side of the peninsula per day. Four bookings that matter.

Hi {{first_name}},

Here's the plan you asked for — two Uluwatu days with zero wasted driving.
Every place below is verified (identity, location, operating status) and has
its own page with booking links and maps.

**Day 1 — the west cliffs**
- 07:00 — BGS Uluwatu: pre-surf coffee at the Suluban entrance
- 09:30 — Suka Espresso: the proper breakfast (walk-in)
- 12:00 — Padang Padang Beach + the Labuan Sait strip
- 13:30 — Ulu Fishmarket: garden seafood lunch
- 17:00 — Single Fin: THE sunset (arrive 60–90 min early; book Wed/Sun)
- 19:30 — KALA: wood-fire dinner (reserve via SevenRooms)

**Day 2 — Bingin, then the south side**
- 07:30 — Son of a Baker: first-light pastry (closed Mondays — check IG)
- 09:00 — Bingin Beach morning
- 12:00 — Laggas: dumpling lunch in Bingin
- 13:30 — Sundays Beach Club: funicular down to the cove (18+ alternative:
  Tropical Temptation on Melasti)
- 17:30 — Sunset from the south side — stay put, don't race back west
- 19:30 — WAATU: fire-cooked dinner directly above Sundays (book ahead)

**The four bookings that matter:** KALA · WAATU · Single Fin (event nights)
· Sundays cabanas.

**If it rains:** Suka, Artisan, YUKI, ZALI, Gooseberry, Mana and El Kabrón
all have real covered space. Beach hours become long lunches.

Full guide with maps and booking links:
https://otherbali.com/uluwatu/48-hours?utm_source=email&utm_medium=email&utm_campaign=uluwatu-launch-2026-07

— Other Bali · The right place for the moment you're in.
You're receiving this because you asked for the guide at otherbali.com and
ticked the consent box. Reply "stop" and we'll delete your details.

---

## WhatsApp version (≤ ~1500 chars, no images required)

🌊 *48 hours in Uluwatu — Other Bali*

The rule: one side of the peninsula per day. Never backtrack.

*Day 1 — west cliffs*
☕ 07:00 BGS (Suluban) → 🍳 09:30 Suka Espresso → 🏖 12:00 Padang Padang →
🐟 13:30 Ulu Fishmarket → 🌅 17:00 Single Fin (early! book Wed/Sun) →
🔥 19:30 KALA (reserve)

*Day 2 — Bingin → south*
🥐 07:30 Son of a Baker (Mon closed) → 🏄 Bingin Beach → 🥟 12:00 Laggas →
🏝 13:30 Sundays Beach Club (funicular to the cove; 18+ option: Tropical
Temptation) → 🌅 sunset stays south → 🍢 19:30 WAATU (book — it's right
above Sundays)

Book these 4: KALA · WAATU · Single Fin event nights · Sundays cabanas.
Rain plan + maps + booking links:
otherbali.com/uluwatu/48-hours

Free, verified, no ads. Reply STOP to be removed.

---

## Send rules

- Send only to rows in `guide_leads` with `consent_granted = true`, matching
  channel, and no prior opt-out.
- Manual sends: BCC for email; WhatsApp broadcast lists (not groups).
- Log every manual send date in this file until a provider exists.
- Never state or imply automation that doesn't exist.

### Manual send log

| Date | Channel | Batch size | Notes |
|---|---|---|---|
| — | — | — | none yet |
