# Батч 1 — Uluwatu 25: список изменений для решения

Дата: 2026-09-28. Источники — только официальные сайты заведений и брони, на которые они ссылаются; каждое принятое значение прошло три независимых шага: сборщик (ready) → скрипт-валидатор (цитата дословно в сохранённом снимке, домен официальный, границы правдоподобия) → слепой приёмщик (сам перекачал источник; видел только поле, значение, URL и цитату). Любое расхождение = HOLD. **Ничего не записано и не опубликовано.** Полная таблица: `change-list.csv` (одна строка = одно утверждение по одному полю).

## Итог

| Решение | Строк |
|---|---:|
| ACCEPTED — можно применять после вашего «да» | 68 |
| MANUAL_REVIEW — удаления и цитаты из PDF/картинок: посмотрите сами | 7 |
| HOLD — расхождение или нет официального источника | 179 |
| REJECTED — отвергнуто и валидатором, и приёмщиком | 1 |
| KEEP — на карточке верно, менять нечего | 378 |

Канарейки (заведомо ложные утверждения, подмешанные приёмщикам): 75, пропущено 0.

Куда попадают изменения: **CODE** — реестр `lib/uluwatu/venues.ts` (видимая карточка), **DB** — колонки `venues` (питают JSON-LD), **BOTH** — ссылки. Правки CODE до сайта не доедут, пока прод не пересобран из main (см. аудит 28.09, §0.2).

## Личность заведений (шаг 0)

| slug | работает | название сегодня | тот филиал | итог |
|---|---|---|---|---|
| alchemy-uluwatu | true | Alchemy Uluwatu | true | ok — принято 7, hold 4, вручную 0 |
| artisan-uluwatu | — | Artisan Uluwatu (menu header: ULUWATU; visual menu handle @ulu.artisan) | true | **HOLD всё** — принято 0, hold 13, вручную 0 |
| bgs-uluwatu | true | BGS Uluwatu | true | ok — принято 1, hold 7, вручную 0 |
| el-kabron-bali | true | El Kabron Bali | true | ok — принято 1, hold 5, вручную 0 |
| gooseberry-french-restaurant-uluwatu | true | Gooseberry French Restaurant | true | ok — принято 9, hold 3, вручную 0 |
| kala-uluwatu | true | KALA Uluwatu | true | ok — принято 2, hold 11, вручную 3 |
| laggas-uluwatu | — | Laggas | — | **HOLD всё** — принято 0, hold 8, вручную 0 |
| mana-uluwatu | true | Mana Uluwatu | true | ok — принято 0, hold 13, вручную 0 |
| masonry-restaurant | true | MASONRY Uluwatu (site also uses 'M. Uluwatu' and 'MASONRY. Grill & Bar') | true | ok — принято 0, hold 12, вручную 0 |
| oneeighty | true | oneeighty° | true | ok — принято 0, hold 17, вручную 0 |
| papi-sapi | true | Papi Sapi | true | ok — принято 8, hold 4, вручную 0 |
| seed-bingin | true | Seed | true | ok — принято 11, hold 2, вручную 0 |
| single-fin | true | Single Fin | true | ok — принято 7, hold 3, вручную 0 |
| son-of-a-baker | — | — | — | **HOLD всё** — принято 0, hold 12, вручную 0 |
| suka-espresso | true | Suka Espresso - Uluwatu (page header: SUKA - ULUWATU) | true | ok — принято 5, hold 4, вручную 3 |
| sundays-beach-club | true | Sundays Beach Club | true | ok — принято 0, hold 6, вручную 0 |
| the-warung-at-alila-villas-uluwatu | — | — | — | **HOLD всё** — принято 0, hold 6, вручную 0 |
| tropical-temptation-adult-only-beach-club | true | Tropical Temptation Beach Club | true | ok — принято 0, hold 9, вручную 0 |
| ulu-artisan-ungasan | — | — | — | **HOLD всё** — принято 0, hold 7, вручную 0 |
| ulu-fishmarket | true | ULU Fishmarket | true | ok — принято 0, hold 6, вручную 0 |
| ulu-garden | true | ULU Garden | true | ok — принято 5, hold 5, вручную 0 |
| waatu | true | Waatu | true | ok — принято 5, hold 6, вручную 1 |
| white-rock-beach-club | true | White Rock Beach Club | true | ok — принято 3, hold 7, вручную 0 |
| yuki-uluwatu | true | YUKI Uluwatu | true | ok — принято 2, hold 4, вручную 0 |
| zali-uluwatu | true | ZALI Uluwatu | true | ok — принято 2, hold 5, вручную 0 |

## Принятые изменения (ACCEPTED)

### alchemy-uluwatu

| поле | цель | сейчас | предлагается | источник · цитата |
|---|---|---|---|---|
| whatToOrder | CODE | bowls; jackfruit salad; pizza & kombucha | breakfast bowl; salad bar; margherita pizza; alchemy kombucha | https://www.alchemybali.com/alchemymenu?menu=alchemy-uluwatu-menu · «MARGHERITA Tomato sauce, home made tofu mozzarella & basil. IDR 105,000» |
| price_anchor | DB | — | Poke bowl IDR 105,000; Margherita pizza IDR 105,000 (official Uluwatu menu, 2026-09-28) | https://www.alchemybali.com/alchemymenu?menu=alchemy-uluwatu-menu · «POKE BOWL Rice/grain or choice, edamame, cucumber, sesame nori, platbased "tuna", avocado,» |
| hours | CODE | — | {"Monday":["7.30am-10.00pm"],"Tuesday":["7.30am-10.00pm"],"Wednesday":["7.30am-10.00pm"],"Thursday":["7.30am-10.00pm"]," | https://www.alchemybali.co/alchemy-ubud-bali-contact · «Alchemy Uluwatu Jalan Pantai Bingin No 8 Pecatu Uluwatu - Bali Indonesia - 80361 +62 811 3» |
| opening_hours_json | DB | — | {"Monday":["7.30am-10.00pm"],"Tuesday":["7.30am-10.00pm"],"Wednesday":["7.30am-10.00pm"],"Thursday":["7.30am-10.00pm"]," | https://www.alchemybali.co/alchemy-ubud-bali-contact · «Alchemy Uluwatu Jalan Pantai Bingin No 8 Pecatu Uluwatu - Bali Indonesia - 80361 +62 811 3» |
| menuUrl | BOTH | — | https://www.alchemybali.co/alchemymenu?menu=alchemy-uluwatu-menu | https://www.alchemybali.com/alchemymenu?menu=alchemy-uluwatu-menu · «ALCHEMY ULUWATU MENU All prices on this menu are subject to 6% service charge and 10% gove» |
| phone | DB | — | +628113888143 | https://www.alchemybali.co/alchemy-ubud-bali-contact · «Alchemy Uluwatu Jalan Pantai Bingin No 8 Pecatu Uluwatu - Bali Indonesia - 80361 +62 811 3» |
| full_address | DB | Jl. Pantai Bingin No.8, Pecatu | Jalan Pantai Bingin No 8, Pecatu, Uluwatu, Bali 80361 | https://www.alchemybali.co/alchemy-ubud-bali-contact · «Alchemy Uluwatu Jalan Pantai Bingin No 8 Pecatu Uluwatu - Bali Indonesia - 80361 +62 811 3» |

### bgs-uluwatu

| поле | цель | сейчас | предлагается | источник · цитата |
|---|---|---|---|---|
| full_address | DB | Jl. Labuansait, Pecatu | Jl. Labuansait, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361 | https://bgsbali.com/store/bgs-uluwatu/ · «Store Info Address Jl. Labuansait, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361 Op» |

### el-kabron-bali

| поле | цель | сейчас | предлагается | источник · цитата |
|---|---|---|---|---|
| menuUrl | BOTH | — | https://elkabron.com/menu/food | https://elkabron.com/menu/food · «Food Menu | El Kabron Bali Beach Club & Restaurant in Uluwatu» |

### gooseberry-french-restaurant-uluwatu

| поле | цель | сейчас | предлагается | источник · цитата |
|---|---|---|---|---|
| copy:practicalNote#1 | CODE | Above Bingin Beach (Jl. Pantai Bingin area), Pecatu. | Gang Pirta, Pecatu — above Bingin Beach. | https://www.gooseberry-restaurant.com/ · «Address Gang Pirta Pecatu Kecamatan Kuta Selatan Kabupaten Badung Bali 80361 Opening Hours» |
| whatToOrder | CODE | onglet classique; confit de canard; barramundi à la persillade | onglet classique; parmentier de canard confit; joue de boeuf braisée | https://www.gooseberry-restaurant.com/ · «Onglet Classique, Frites & Salade 465» |
| address | CODE | — | Gang Pirta, Pecatu | https://www.gooseberry-restaurant.com/ · «Address Gang Pirta Pecatu Kecamatan Kuta Selatan Kabupaten Badung Bali 80361 Opening Hours» |
| hours | CODE | — | {"Monday":["8.00am-10.30pm"],"Tuesday":["8.00am-10.30pm"],"Wednesday":["8.00am-10.30pm"],"Thursday":["8.00am-10.30pm"]," | https://www.gooseberry-restaurant.com/ · «Address Gang Pirta Pecatu Kecamatan Kuta Selatan Kabupaten Badung Bali 80361 Opening Hours» |
| opening_hours_json | DB | — | {"Monday":["8.00am-10.30pm"],"Tuesday":["8.00am-10.30pm"],"Wednesday":["8.00am-10.30pm"],"Thursday":["8.00am-10.30pm"]," | https://www.gooseberry-restaurant.com/ · «Address Gang Pirta Pecatu Kecamatan Kuta Selatan Kabupaten Badung Bali 80361 Opening Hours» |
| menuUrl | BOTH | — | https://www.gooseberry-restaurant.com/#menu | https://www.gooseberry-restaurant.com/ · «Discover The Menus À la Carte» |
| phone | DB | — | +6282144823166 | https://www.gooseberry-restaurant.com/ · «Talk To Us Call Us Text Us on WhatsApp» |
| full_address | DB | — | Gang Pirta, Pecatu, Kecamatan Kuta Selatan, Kabupaten Badung, Bali 80361 | https://www.gooseberry-restaurant.com/ · «Address Gang Pirta Pecatu Kecamatan Kuta Selatan Kabupaten Badung Bali 80361 Opening Hours» |
| coordinates | DB | — | [-8.812029591240924,115.11612367686756] | https://www.gooseberry-restaurant.com/ · «Location Find Your Way Here Gooseberry Modern French Restaurant · Bingin Beach» |

### kala-uluwatu

| поле | цель | сейчас | предлагается | источник · цитата |
|---|---|---|---|---|
| copy:reservations#1 | CODE | Reservations via SevenRooms — recommended for dinner. | Reservations via TableCheck; groups of more than 7 are asked to contact the venue on WhatsApp. | https://www.tablecheck.com/en/kalauluwatu/reserve/message · «For group booking more than 7 pax please do not hesitate to contact us directly to WhatsAp» |
| bookingUrl | BOTH | https://www.sevenrooms.com/explore/kalauluwatu/reservations/create/search/ | https://www.tablecheck.com/en/kalauluwatu/reserve/message | https://www.tablecheck.com/en/kalauluwatu/reserve/message · «KALA Uluwatu - TableCheck» |

### papi-sapi

| поле | цель | сейчас | предлагается | источник · цитата |
|---|---|---|---|---|
| copy:whatToExpect#2 | CODE | Premium cuts (wagyu rib eye, picanha) at the centre, easy sides around them, and | Cuts from the showcase at the centre, easy sides around them, and a second branch on Lombok if the name looks familiar f | https://papisapi.com/ · «OUR LOCATIONS Bali +62 851 9590 3719 hello@papisapi.com Jl. Labuansait, Pecatu, Kec. Kuta » |
| copy:reservations#1 | CODE | Book a table via the official site (ResDiary widget). | Book a table via the official site (SevenRooms). | https://papisapi.com/ · «BOOK A TABLE» |
| price_anchor | DB | — | sapi penyet burger 140K (menu-bali, 2026-09-28; grill cuts priced by weight at the showcase) | https://papisapi.com/menu-bali · «SAPI PENYET Two super smashed australian beef patties, caramelised white onion, american c» |
| full_address | DB | Jl. Labuansait, Pecatu | Jl. Labuansait, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361 | https://papisapi.com/contact/ · «Jl. Labuansait, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361» |
| opening_hours_json | DB | — | {"Monday":["4.00pm-11.30pm"],"Tuesday":["4.00pm-11.30pm"],"Wednesday":["4.00pm-11.30pm"],"Thursday":["4.00pm-11.30pm"]," | https://papisapi.com/ · «OPENING HOURS Everyday 04 : 00 pm - 11:30 pm» |
| bookingUrl | BOTH | https://papisapi.com/book-a-table/ | https://www.sevenrooms.com/reservations/papisapibali | https://www.sevenrooms.com/reservations/papisapibali · «SevenRooms» |
| menuUrl | BOTH | https://papisapi.com/menu/ | https://papisapi.com/menu-bali | https://papisapi.com/menu-bali · «Menu - Bali | Papi Sapi» |
| phone | DB | — | +62 851 9590 3719 | https://papisapi.com/ · «Bali +62 851 9590 3719 hello@papisapi.com» |

### seed-bingin

| поле | цель | сейчас | предлагается | источник · цитата |
|---|---|---|---|---|
| copy:verdict#1 | CODE | Farm-to-table French-Asian two minutes from the Bingin steps — garden produce, w | Farm-to-table French-Asian a short walk from the Bingin steps — garden produce, wood fire and a proper breakfast. | https://seedbingin.com/ · «It is a short walk up from the beach itself.» |
| copy:whatToExpect#2 | CODE | Mornings are calm (open from around 7); evenings shift into date-night territory | Mornings are calm (open from 7); evenings shift into date-night territory — rendang, seasonal plates, house-made dessert | https://seedbingin.com/food-menu · «Sumatran Beef Rendang Slow cooked beef cheek in a rich blend of fresh spices.» |
| copy:practicalNote#1 | CODE | Jl. Pantai Bingin, Pecatu — 2 minutes from the Bingin Beach steps. | Jl. Pantai Bingin, Pecatu — a short walk up from Bingin Beach. | https://seedbingin.com/ · «a short walk up from Bingin Beach» |
| copy:reservations#1 | CODE | Contact the venue directly for dinner reservations; breakfast is walk-in. | Reserve online via SevenRooms (linked from the official site); dinner reservations essential. | https://seedbingin.com/ · «You can reserve a table online through Seed's SevenRooms booking page, linked from every "» |
| whatToOrder | CODE | beef rendang; crème brûlée; seasonal plates | sumatran beef rendang; tuna crudo; soft shell crab tempura | https://seedbingin.com/food-menu · «Sumatran Beef Rendang» |
| price_anchor | DB | — | sumatran beef rendang 210k ++ (dinner menu, 2026-09-28) | https://seedbingin.com/food-menu · «Sumatran Beef Rendang Slow cooked beef cheek in a rich blend of fresh spices. 210k» |
| full_address | DB | Jl. Pantai Bingin, Pecatu | Jalan Pantai Bingin, Pecatu, South Kuta, Badung, Bali 80361 | https://seedbingin.com/ · «Jalan Pantai Bingin Pecatu, South Kuta Badung, Bali 80361» |
| hours | CODE | — | {"Monday":["7.00am-11.00pm"],"Tuesday":["7.00am-11.00pm"],"Wednesday":["7.00am-11.00pm"],"Thursday":["7.00am-11.00pm"]," | https://seedbingin.com/ · «Open Daily 7 AM to 11 PM» |
| opening_hours_json | DB | Mo-Su 07:30-23:00 | {"Monday":["7.00am-11.00pm"],"Tuesday":["7.00am-11.00pm"],"Wednesday":["7.00am-11.00pm"],"Thursday":["7.00am-11.00pm"]," | https://seedbingin.com/ · «Open Daily 7 AM to 11 PM» |
| bookingUrl | BOTH | https://www.chope.co/bali-restaurants/restaurant/seed-bingin-uluwatu | https://www.sevenrooms.com/explore/seedbingin/reservations/create/search/ | https://www.sevenrooms.com/explore/seedbingin/reservations/create/search/ · «SevenRooms» |
| menuUrl | BOTH | — | https://seedbingin.com/food-menu | https://seedbingin.com/food-menu · «Menu · Seed Restaurant, Farm to Table in Bingin Uluwatu» |

### single-fin

| поле | цель | сейчас | предлагается | источник · цитата |
|---|---|---|---|---|
| whatToOrder | CODE | pizza; tacos; sliders | margherita pizza; tempura fish taco; nasi goreng single fin | https://www.singlefinbali.com/eat-drinks/ · «NASI GORENG SINGLE FIN Indonesian fried rice, chicken satay, fried egg, shrimp crackers, c» |
| price_anchor | DB | — | nasi goreng single fin 135K incl. tax and service (eat & drinks menu, 2026-09-28) | https://www.singlefinbali.com/eat-drinks/ · «NASI GORENG SINGLE FIN Indonesian fried rice, chicken satay, fried egg, shrimp crackers, c» |
| full_address | DB | Pantai Suluban, Jl. Labuan Sait, Pecatu | Pantai Suluban, Jl. Labuan Sait, Pecatu, Uluwatu, Kuta Selatan, Kabupaten Badung, Bali 80361 | https://www.singlefinbali.com/ · «Pantai Suluban, Jl. Labuan Sait, Pecatu, Uluwatu, Kuta Selatan, Kabupaten Badung, Bali 803» |
| hours | CODE | — | {"Monday":["8.00am-10.00pm"],"Tuesday":["8.00am-10.00pm"],"Wednesday":["8.00am-23.59pm"],"Thursday":["8.00am-10.00pm"]," | https://www.singlefinbali.com/ · «Monday 8 AM – 10 PM Tuesday 8 AM – 10 PM Wednesday 8 AM – 2 AM Thursday 8 AM – 10 PM Frida» |
| opening_hours_json | DB | — | {"Monday":["8.00am-10.00pm"],"Tuesday":["8.00am-10.00pm"],"Wednesday":["8.00am-23.59pm"],"Thursday":["8.00am-10.00pm"]," | https://www.singlefinbali.com/ · «Monday 8 AM – 10 PM Tuesday 8 AM – 10 PM Wednesday 8 AM – 2 AM Thursday 8 AM – 10 PM Frida» |
| menuUrl | BOTH | — | https://www.singlefinbali.com/eat-drinks/ | https://www.singlefinbali.com/eat-drinks/ · «Eat & Drinks - Single Fin, Bali's Iconic Cliffside Beach Bar» |
| phone | DB | — | +6281996305521 | https://www.singlefinbali.com/contact/ · «Phone. +6281996305521» |

### suka-espresso

| поле | цель | сейчас | предлагается | источник · цитата |
|---|---|---|---|---|
| copy:practicalNote#1 | CODE | Jl. Labuansait, Pecatu — part of the By/Suka group (second location in Uluwatu). | Jl. Labuansait, Uluwatu — part of the By/Suka collective (sister branch in Ubud). | https://www.bysuka.com/suka-uluwatu · «Suka Ubud & Suka Uluwatu.» |
| address | CODE | Jl. Labuansait No.10, Pecatu | Jl. Labuansait, Uluwatu | https://www.bysuka.com/suka-uluwatu · «lOCATION: Jl. Labuansait, ULUWATU» |
| full_address | DB | Jl. Labuansait No.10, Pecatu | Jl. Labuansait, Uluwatu | https://www.bysuka.com/suka-uluwatu · «lOCATION: Jl. Labuansait, ULUWATU» |
| hours | CODE | — | {"Monday":["7.30am-10.00pm"],"Tuesday":["7.30am-10.00pm"],"Wednesday":["7.30am-10.00pm"],"Thursday":["7.30am-10.00pm"]," | https://www.bysuka.com/suka-uluwatu · «HOURS: 7:30AM - 10PM» |
| opening_hours_json | DB | — | {"Monday":["7.30am-10.00pm"],"Tuesday":["7.30am-10.00pm"],"Wednesday":["7.30am-10.00pm"],"Thursday":["7.30am-10.00pm"]," | https://www.bysuka.com/suka-uluwatu · «HOURS: 7:30AM - 10PM» |

### ulu-garden

| поле | цель | сейчас | предлагается | источник · цитата |
|---|---|---|---|---|
| full_address | DB | — | Jl. Pantai Padang-Padang, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361 | https://ulutribe.com/contact/ · «Jl. Pantai Padang-Padang, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361» |
| hours | CODE | — | {"Monday":["7.00am-11.00pm"],"Tuesday":["7.00am-11.00pm"],"Wednesday":["7.00am-11.00pm"],"Thursday":["7.00am-11.00pm"]," | https://ulutribe.com/contact/ · «Opening Hours Garden 7AM – 11PM» |
| opening_hours_json | DB | — | {"Monday":["7.00am-11.00pm"],"Tuesday":["7.00am-11.00pm"],"Wednesday":["7.00am-11.00pm"],"Thursday":["7.00am-11.00pm"]," | https://ulutribe.com/contact/ · «Garden 7AM – 11PM» |
| bookingUrl | BOTH | https://www.dishcult.com/restaurant/ulugarden | https://www.sevenrooms.com/reservations/ulugarden | https://www.sevenrooms.com/reservations/ulugarden · «SevenRooms» |
| menuUrl | BOTH | — | https://drive.google.com/drive/folders/1RjWQo9qGTmgGaSqvuJxhWXY_-_WYGxpo?usp=drive_link | https://drive.google.com/drive/folders/1RjWQo9qGTmgGaSqvuJxhWXY_-_WYGxpo?usp=drive_link · «Night Menu VF.pdf» |

### waatu

| поле | цель | сейчас | предлагается | источник · цитата |
|---|---|---|---|---|
| full_address | DB | — | Jl. Pantai Sel. Gau, Ungasan, Kec. Kuta Sel., Kabupaten Badung, Bali 80362 | https://waatu.com/ · «Jl. Pantai Sel. Gau, Ungasan, Kec. Kuta Sel., Kabupaten Badung, Bali 80362, Indonesia» |
| hours | CODE | — | Daily 7.30am until late _(открытый конец: в CODE как текст; в DB структурное закрытие не пишется)_ | https://waatu.com/ · «OPEN 7.30 AM TIL LATE» |
| opening_hours_json | DB | — | Daily 7.30am until late _(открытый конец: в CODE как текст; в DB структурное закрытие не пишется)_ | https://waatu.com/ · «OPEN 7.30 AM TIL LATE» |
| bookingUrl | BOTH | https://waatubali.com/reservations/ | https://www.sevenrooms.com/explore/waatu/reservations/create/search | https://www.sevenrooms.com/explore/waatu/reservations/create/search/landing · «SevenRooms» |
| menuUrl | BOTH | — | https://waatuprd.wpenginepowered.com/wp-content/uploads/2026/07/Waatu-Dinner-Menu-July-2026.pdf | https://waatu.com/ · «view our menus subject to change Breakfast View Menu Lunch View Menu Dinner View Menu» |

### white-rock-beach-club

| поле | цель | сейчас | предлагается | источник · цитата |
|---|---|---|---|---|
| price_anchor | DB | — | single sofa (2 pax) min. spend IDR 500K++; single bed (2 pax) min. spend IDR 2,000K++ — whiterockbali.com, 2026-09-28 | https://whiterockbali.com/ · «SINGLE SOFA (2 pax) MIN. SPEND IDR 500K++» |
| menuUrl | BOTH | — | https://whiterockbali.com/menu/ | https://whiterockbali.com/menu/ · «FOOD MENU DRINKS MENU SHISHA MENU» |
| phone | DB | — | +628113803003 | https://whiterockbali.com/ · «[+62] 811 3803 003» |

### yuki-uluwatu

| поле | цель | сейчас | предлагается | источник · цитата |
|---|---|---|---|---|
| full_address | DB | — | Jl. Labuansait, Pecatu, Kec. Kuta Selatan, Kabupaten Badung, Bali | https://www.yuki-bali.com/ulu-reservations · «Jl Labuansait, Pecatu, Kec. Kuta Selatan, Kabupaten Badung, Bali, Indonesia» |
| opening_hours_json | DB | — | Daily 11.00am until late _(открытый конец: в CODE как текст; в DB структурное закрытие не пишется)_ | https://www.yuki-bali.com/ulu-reservations · «OPEN 11AM - LATE 7 DAYS WEEK» |

### zali-uluwatu

| поле | цель | сейчас | предлагается | источник · цитата |
|---|---|---|---|---|
| hours | CODE | Mo 08:00-23:30, Tu 08:00-23:30, We 08:00-23:30, Th 08:00-23:30, Fr 08:00-23:30,  | {"Monday":["8.00am-23.59pm"],"Tuesday":["8.00am-23.59pm"],"Wednesday":["8.00am-23.59pm"],"Thursday":["8.00am-23.59pm"]," | https://www.zalirestaurant.com/ · «Uluwatu +62 877 7813 7273 Everyday 8:00AM &ndash; 12:00AM» |
| opening_hours_json | DB | Mo 08:00-23:30, Tu 08:00-23:30, We 08:00-23:30, Th 08:00-23:30, Fr 08:00-23:30,  | {"Monday":["8.00am-23.59pm"],"Tuesday":["8.00am-23.59pm"],"Wednesday":["8.00am-23.59pm"],"Thursday":["8.00am-23.59pm"]," | https://www.zalirestaurant.com/ · «Uluwatu +62 877 7813 7273 Everyday 8:00AM &ndash; 12:00AM» |

## На ручную проверку (MANUAL_REVIEW)

| slug | поле | действие | предлагается / что убрать | почему вручную |
|---|---|---|---|---|
| kala-uluwatu | whatToOrder | replace | feta tempura; lamb shoulder; grilled octopus | quote transcribed from pdf: founder checks the file |
| kala-uluwatu | price_anchor | add | lamb shoulder 290K IDR; feta tempura 120K IDR (official menu PDF headed SEPTEMBER, captured 2026-09- | quote transcribed from pdf: founder checks the file |
| kala-uluwatu | menuUrl | add | https://kalauluwatu.com/assets/kala-menu.pdf | quote transcribed from pdf: founder checks the file |
| suka-espresso | whatToOrder | replace | salmon scramble; chicken katsu sando; wagyu beef burger | quote transcribed from pdf: founder checks the file |
| suka-espresso | price_anchor | add | big brekky 98K + service and tax (morning menu, 2026-09-28) | quote transcribed from pdf: founder checks the file |
| suka-espresso | menuUrl | add | https://www.bysuka.com/s/NEW_MORNING_ULUWATU.pdf | quote transcribed from pdf: founder checks the file |
| waatu | copy:whyHere#2 | remove | Chef James Viles runs archipelago ingredients through a yakitori lens on The Ungasan clifftop, makin | acceptor: accept — REMOVAL_UNSUPPORTED waatu.com names Lachlan Budd as Head Chef; 'Viles' appears nowhere on the site — the factual core of  |

## HOLD — что разблокирует

- **68** — источник закрыт для среды (403/Cloudflare/500) — проверить с телефона или позже. Места: el-kabron-bali, kala-uluwatu, mana-uluwatu, masonry-restaurant, oneeighty, sundays-beach-club, tropical-temptation-adult-only-beach-club, ulu-fishmarket, ulu-garden.
- **46** — личность заведения не подтверждена официальным источником (сайт недоступен или только Instagram). Места: artisan-uluwatu, laggas-uluwatu, son-of-a-baker, the-warung-at-alila-villas-uluwatu, ulu-artisan-ungasan.
- **32** — факта нет ни на одном официальном источнике. Места: alchemy-uluwatu, bgs-uluwatu, gooseberry-french-restaurant-uluwatu, kala-uluwatu, mana-uluwatu, masonry-restaurant, oneeighty, papi-sapi, seed-bingin, single-fin, suka-espresso, tropical-temptation-adult-only-beach-club, ulu-fishmarket, ulu-garden, waatu, white-rock-beach-club, yuki-uluwatu, zali-uluwatu.
- **14** — сборщик не смог подтвердить (unclear). Места: bgs-uluwatu, el-kabron-bali, papi-sapi, seed-bingin, suka-espresso, ulu-garden, waatu, white-rock-beach-club.
- **13** — расхождение сборщика и приёмщика. Места: alchemy-uluwatu, bgs-uluwatu, el-kabron-bali, gooseberry-french-restaurant-uluwatu, kala-uluwatu, masonry-restaurant, ulu-garden, waatu, yuki-uluwatu.
- **6** — редакционные фразы, которые сайт не доказывает. Места: alchemy-uluwatu, el-kabron-bali, gooseberry-french-restaurant-uluwatu, single-fin, white-rock-beach-club.

## Паки Codex (30.08) как наводки

Из принятых значений 21 имели аналог в паках; дословно совпали 1. Остальные предложения паков либо не подтвердились официальным источником, либо не были проверены (HOLD). Паки не использовались как доказательство.

## Источники, недоступные из среды

- alilahotels.com / hyatt.com (Akamai 403) — The Warung at Alila; artisangroup.id (500) — Artisan, Ulu Artisan Ungasan; dishcult.com (403/404) — Ulu Garden, Artisan; corner.inc (429) — ZALI; hotels.com (429).
- Только Instagram: laggas-uluwatu, son-of-a-baker — чек-лист для проверки с телефона: работает ли, био (адрес, часы), дата последнего поста, тот ли филиал.

## Что дальше

1. Скажите «да»/«нет» по таблице ACCEPTED (можно построчно: slug + поле).
2. Просмотрите MANUAL_REVIEW (4–8 строк).
3. Для DB-строк: `draft-changes.sql` — не выполняется; перед запуском нужен SELECT текущих значений и dry-run одной строки с откатом (otherbali-supabase-write).
4. Для CODE-строк: `registry-changes.md` — правки `lib/uluwatu/venues.ts`, заблокированы до решения о деплое.
