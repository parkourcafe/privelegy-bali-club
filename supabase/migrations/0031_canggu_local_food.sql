-- 0031_canggu_local_food.sql
-- Adds 9 verified Canggu warungs & babi guling stalls (a local-food cluster),
-- so /canggu/best-warungs is a real page and "warung / local food Canggu"
-- queries have somewhere to land (Warung Bu Mi already gets branded impressions
-- in Search Console). Discovery + verified web-research pass (official IG/sites);
-- guardrails held (no ratings/review counts; downsides only as not_for
-- fit-context; prices as bands). category='warung', district='canggu'; status/
-- tier/publication use column defaults. Applied to prod by the founder.

insert into venues
  (id, slug, name, category, district, area,
   why_its_here, best_for, not_for, what_to_order, price_anchor,
   official_url, instagram_url)
values
($ob$v_warung-sika$ob$, $ob$warung-sika$ob$, $ob$Warung Sika$ob$, $ob$warung$ob$, $ob$canggu$ob$, $ob$Batu Bolong$ob$,
 $ob$A family-run point-and-pick nasi campur warung where you choose rice then add vegetables and meats from the display. One of Canggu's most popular local rice stalls, open daily 9am–9pm.$ob$,
 $ob$cheap authentic nasi campur; solo diners and quick lunches; build-your-own plate eaters; first-timers who want a low-friction, English-friendly setup$ob$,
 $ob$diners wanting table service or a quiet sit-down dinner; anyone avoiding a busy, canteen-style room$ob$,
 $ob$nasi campur (mixed rice, self-selected); fried chicken; BBQ chicken; mie goreng; sambal$ob$,
 $ob$$ · plate ~30–60K depending on choices$ob$,
 $ob$https://warungsika.biz.id/$ob$, $ob$https://www.instagram.com/warung_sika/$ob$),

($ob$v_warung-varuna$ob$, $ob$warung-varuna$ob$, $ob$Warung Varuna$ob$, $ob$warung$ob$, $ob$canggu$ob$, $ob$Batu Bolong$ob$,
 $ob$Buffet-style Indonesian warung with 30-plus dishes in a glass case; you build a plate of rice, proteins and vegetables at low prices. Open daily 8am–10pm.$ob$,
 $ob$budget eaters near Batu Bolong beach; vegetarians and mixed groups who want to see and pick dishes; big-plate value seekers$ob$,
 $ob$diners who want food cooked hot-to-order rather than from a display$ob$,
 $ob$nasi campur (self-selected plate); nasi goreng; satay chicken; tempe and tofu sides; fresh banana juice$ob$,
 $ob$$ · plate ~25–50K$ob$,
 null, $ob$https://www.instagram.com/warungvaruna/$ob$),

($ob$v_warung-yess$ob$, $ob$warung-yess$ob$, $ob$Warung Yess$ob$, $ob$warung$ob$, $ob$canggu$ob$, $ob$Pererenan$ob$,
 $ob$A long-running Pererenan nasi campur warung with indoor and garden seating, known locally for its sambal matah. You pick from a daily fresh display to build a mixed-rice plate.$ob$,
 $ob$nasi campur and sambal matah lovers; a sit-down garden lunch; Pererenan-side stays; groups wanting greenery over a roadside stall$ob$,
 $ob$diners after Western dishes or a bar/nightlife setting$ob$,
 $ob$nasi campur (mixed rice, self-selected); sambal matah; grilled or fried chicken; sayur (vegetable sides); tempe$ob$,
 $ob$$ · plate ~50–70K$ob$,
 $ob$https://www.warungyess.com/$ob$, null),

($ob$v_warung-local$ob$, $ob$warung-local$ob$, $ob$Warung Local$ob$, $ob$warung$ob$, $ob$canggu$ob$, $ob$Batu Bolong$ob$,
 $ob$A semi-open Indonesian warung on the Batu Bolong strip serving Halal local staples — nasi campur, nasi goreng and satay — with an outdoor seating section. Open daily 10am–10pm.$ob$,
 $ob$Halal diners; a central Batu Bolong location; casual dinner as well as lunch; travellers wanting familiar local staples in an easy setting$ob$,
 $ob$anyone specifically after pork dishes (Halal kitchen); diners seeking a quiet, no-scene warung$ob$,
 $ob$nasi campur; nasi goreng; chicken satay; mie goreng; sambal$ob$,
 $ob$$ · mains ~35–70K$ob$,
 null, $ob$https://www.instagram.com/warunglocal/$ob$),

($ob$v_warung-jawa-bu-sri$ob$, $ob$warung-jawa-bu-sri$ob$, $ob$Warung Jawa Bu Sri$ob$, $ob$warung$ob$, $ob$canggu$ob$, $ob$Padang Linjong$ob$,
 $ob$A small family-run Javanese-Balinese warung serving home-style nasi campur at lunch. Semi-indoor with street views; open roughly 10am–5pm, closed Sundays.$ob$,
 $ob$home-style Javanese nasi campur; a midday lunch; vegetarians (plentiful veg options); travellers near Padang Linjong or Echo Beach wanting an unfussy local plate$ob$,
 $ob$dinner or Sunday diners (lunch-only, closed Sundays); large groups wanting lots of table space$ob$,
 $ob$nasi campur (Javanese-style mixed rice); tempe and tofu sides; sayur; sambal; fried or grilled chicken$ob$,
 $ob$$ · plate ~25–50K$ob$,
 null, $ob$https://www.instagram.com/warungjawabusricanggu/$ob$),

($ob$v_babi-guling-men-lari$ob$, $ob$babi-guling-men-lari$ob$, $ob$Babi Guling Men Lari$ob$, $ob$warung$ob$, $ob$canggu$ob$, $ob$Padang Linjong$ob$,
 $ob$A well-known Canggu-area babi guling warung, roasting suckling pig served with rice, crackling and sides. The Canggu branch sits on Jl. Padang Linjong; open daily from around 9am.$ob$,
 $ob$babi guling seekers; a hearty pork lunch; travellers wanting an established, locally-followed roast-pork spot; big appetites$ob$,
 $ob$vegetarians and anyone avoiding pork; diners wanting a polished dining room$ob$,
 $ob$babi guling (roast suckling pork with rice); crispy pork skin; lawar; sambal; pork soup$ob$,
 $ob$$ · plate ~30–60K$ob$,
 null, $ob$https://www.instagram.com/begulingmenlari/$ob$),

($ob$v_babi-guling-swari$ob$, $ob$babi-guling-swari$ob$, $ob$Warung Babi Guling Swari$ob$, $ob$warung$ob$, $ob$canggu$ob$, $ob$Pererenan$ob$,
 $ob$An unpretentious Pererenan-strip babi guling warung serving a full roast-pork plate with crackling and sides, known for a bold, spicy profile. Open daily from around 8am.$ob$,
 $ob$babi guling with a chili kick; spice lovers; Pererenan-side diners; a filling, affordable pork plate$ob$,
 $ob$vegetarians and non-pork eaters; anyone sensitive to strong chili heat$ob$,
 $ob$babi guling paket (complete plate); crispy pork skin and crackling; fried chicken skin; lawar; keropok$ob$,
 $ob$$ · plate ~35–60K$ob$,
 null, $ob$https://www.instagram.com/babigulingswari/$ob$),

($ob$v_babi-guling-men-agus$ob$, $ob$babi-guling-men-agus$ob$, $ob$Babi Guling Men Agus$ob$, $ob$warung$ob$, $ob$canggu$ob$, $ob$Canggu$ob$,
 $ob$A low-cost roadside babi guling warung on Jl. Raya Canggu, popular with locals for an affordable roast-pork rice plate. Open daily roughly 8am–9pm, with delivery.$ob$,
 $ob$budget babi guling; a fast local lunch; delivery or takeaway; travellers wanting an everyday, no-frills pork plate$ob$,
 $ob$vegetarians and non-pork eaters; diners wanting a scenic or sit-and-linger setting$ob$,
 $ob$nasi babi guling (roast pork with rice); crispy pork skin; lawar; sambal$ob$,
 $ob$$ · plate ~25–45K$ob$,
 null, $ob$https://www.instagram.com/babigulingmenagus/$ob$),

($ob$v_babi-guling-sari-kembar-99$ob$, $ob$babi-guling-sari-kembar-99$ob$, $ob$Babi Guling Sari Kembar 99$ob$, $ob$warung$ob$, $ob$canggu$ob$, $ob$Canggu (Subak Sari)$ob$,
 $ob$A local-favoured babi guling warung on the Subak Sari side of Canggu, mostly frequented by residents rather than tourists. Open daily from around 7am, with delivery.$ob$,
 $ob$an off-the-tourist-track babi guling; early risers (opens ~7am); a locals-style breakfast or lunch pork plate; delivery$ob$,
 $ob$vegetarians and non-pork eaters; travellers wanting an English-forward, tourist-oriented venue$ob$,
 $ob$nasi babi guling (roast pork with rice); crispy pork skin; lawar; pork soup; sambal$ob$,
 $ob$$ · plate ~30–50K$ob$,
 null, $ob$https://www.instagram.com/babiguling.sarikembar99/$ob$);
