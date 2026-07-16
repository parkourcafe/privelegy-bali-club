// Nusa Penida district product content (the /nusa-penida pillar).
//
// Like lib/nusa-dua/content.ts, this is a code registry of ATTRACTIONS /
// VIEWPOINTS for the destination pillar — NOT rows in the `venues` table.
// Nusa Penida sits under the `nusa-islands` district, which is planning_only:
// the money loop is OFF (guardrail #4), so items link only to Google Maps /
// neutral info, never to perks, QR or booking. Facts are a synthesis of the
// verified research behind the existing /nusa-penida-day-trip guide (Sanur fast
// boat, west/east sights, manta snorkelling, water-safety); any field that pass
// could not verify is omitted rather than estimated (no invented content, §4).
// Downsides appear only as fit-context and safety, never as quality warnings
// (guardrail #7). The pillar is the destination hub; the day-trip guide is the
// how-to-visit deep-dive — this file must not duplicate its logistics prose.

export const NUSA_PENIDA_REVIEW_DATE = "2026-07-16";

function mapsLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${query} Nusa Penida`
  )}`;
}

export type NusaPenidaZoneKey = "west" | "east" | "water";

export interface NusaPenidaZone {
  key: NusaPenidaZoneKey;
  label: string;
  character: string;
  bestFor: string;
}

// The island splits naturally into two land loops plus the water. Most people
// see one side per day — the split is the single most useful planning fact.
export const NUSA_PENIDA_ZONES: NusaPenidaZone[] = [
  {
    key: "west",
    label: "West & south-west · the classic day",
    character:
      "Closest to the harbour and home to the postcard sights: Kelingking's T-Rex cliff, Angel's Billabong, Broken Beach and Crystal Bay. It's the busiest side, with the longest photo queues at Kelingking around midday.",
    bestFor: "A first visit or a single day trip — the icons, done as one loop.",
  },
  {
    key: "east",
    label: "East · quieter and just as dramatic",
    character:
      "At least as beautiful as the west and far less crowded: Diamond and Atuh beaches under east-facing cliffs, the Thousand Islands viewpoint and the rolling Teletubbies Hills. Usually a separate day because of the drive.",
    bestFor: "A second day, or anyone trading crowds for steep-stair effort.",
  },
  {
    key: "water",
    label: "The water · mantas & calm bays",
    character:
      "Manta rays cruise the cleaning stations essentially year-round, and snorkel-boat trips stop at Manta Point or Manta Bay, Crystal Bay and Gamat Bay. Crystal Bay is also the calm, palm-lined west-side beach for a swim and the sunset.",
    bestFor: "Snorkelling with mantas and the island's only relaxed swim beaches.",
  },
];

export interface NusaPenidaThing {
  title: string;
  zone: string;
  blurb: string;
  mapsUrl?: string;
}

export const NUSA_PENIDA_THINGS_TO_DO: NusaPenidaThing[] = [
  {
    title: "Kelingking Beach viewpoint",
    zone: "West · the T-Rex cliff",
    blurb:
      "The image that put Nusa Penida on every feed: a green headland shaped like a dinosaur's back above a curl of white sand. The clifftop viewpoint is a short walk; the descent to the beach is steep, strenuous and optional, and swimming below is forbidden — the currents are deadly. Come early to beat the parking and photo queues.",
    mapsUrl: mapsLink("Kelingking Beach viewpoint"),
  },
  {
    title: "Angel's Billabong",
    zone: "West · near Broken Beach",
    blurb:
      "A natural infinity tidal pool carved into the rock shelf, safe to enter only at low tide. Never get in on a rising or high tide — rogue waves have swept people out to sea here. Check the tide chart before you go; at the wrong tide it's a viewpoint, not a swim.",
    mapsUrl: mapsLink("Angel's Billabong"),
  },
  {
    title: "Broken Beach (Pasih Uug)",
    zone: "West · next to Angel's Billabong",
    blurb:
      "A photogenic circular cove ringed by cliffs, with a natural rock arch the sea flows through. It's a walk-the-rim viewpoint rather than a swim, and pairs naturally with Angel's Billabong right next door.",
    mapsUrl: mapsLink("Broken Beach Pasih Uug"),
  },
  {
    title: "Crystal Bay",
    zone: "West · calm swim & sunset",
    blurb:
      "The calm, palm-lined west-side beach — the island's easiest swim and snorkel, and its best sunset. Also a common stop on manta snorkelling trips. The one west-coast spot built for slowing down rather than climbing stairs.",
    mapsUrl: mapsLink("Crystal Bay"),
  },
  {
    title: "Diamond Beach",
    zone: "East · carved cliff stairway",
    blurb:
      "A dramatic white-sand cove under east-facing cliffs, reached by a steep carved stairway past rock pinnacles. One of the island's signature east-side sights; the climb back up is a real effort in the heat, so go earlier and carry water.",
    mapsUrl: mapsLink("Diamond Beach"),
  },
  {
    title: "Atuh Beach",
    zone: "East · next to Diamond",
    blurb:
      "Diamond's neighbour, a wide sweep of sand framed by offshore rock islets, with viewpoints along the clifftop above. The two are usually done together as the east-side beach stop.",
    mapsUrl: mapsLink("Atuh Beach"),
  },
  {
    title: "Thousand Islands viewpoint (Raja Lima)",
    zone: "East · Raja Lima headland",
    blurb:
      "A clifftop lookout over a scatter of green islets in a blue sea, with the famous cliffside tree house nearby. One of the east's defining views and an easy add-on to a Diamond and Atuh day.",
    mapsUrl: mapsLink("Thousand Islands viewpoint Raja Lima"),
  },
  {
    title: "Snorkelling with manta rays",
    zone: "Water · Manta Point / Manta Bay",
    blurb:
      "A genuine headline: a half-day boat trip to the manta cleaning stations, usually stopping at three or four spots among Manta Point or Manta Bay, Crystal Bay and Gamat Bay. Mantas are present essentially year-round, so sightings are very likely — though never guaranteed. Manta Point water is often colder and choppier, so a rash guard and seasickness precautions help.",
    mapsUrl: mapsLink("Manta Point snorkelling"),
  },
  {
    title: "Teletubbies Hills",
    zone: "East · inland",
    blurb:
      "Rolling green mounds named for their resemblance to the children's show — a quiet, uncrowded stop that shows a softer, greener side of an island best known for its cliffs. Greenest in and just after the wet season.",
    mapsUrl: mapsLink("Teletubbies Hills"),
  },
];

export const NUSA_PENIDA_FAQ = [
  {
    q: "What is Nusa Penida best for?",
    a: "Dramatic cliff-and-cove scenery and manta snorkelling. It's a rugged island off Bali's south-east coast, famous for the Kelingking 'T-Rex' cliff, Angel's Billabong, Broken Beach and Diamond Beach, plus year-round manta rays. It's about big landscapes and adventure over comfort — the roads are rough and it's short on the polished resorts of mainland Bali.",
  },
  {
    q: "Should you visit the west or the east side?",
    a: "The west (Kelingking, Angel's Billabong, Broken Beach, Crystal Bay) is closest to the harbour and holds the postcard icons — the natural choice for a single day. The east (Diamond, Atuh, Thousand Islands) is quieter and just as beautiful but a longer drive, so it's usually a second day. Trying to combine both in one day means spending most of it in the car.",
  },
  {
    q: "Can you swim at Nusa Penida's beaches?",
    a: "At some, not others. Swimming is forbidden at Kelingking (deadly currents), and Angel's Billabong is only safe to enter at low tide — never on a rising tide, where people have been swept out. Crystal Bay is the calm, swimmable west-side beach; Diamond and Atuh are cove beaches better for scenery than serious swimming.",
  },
  {
    q: "Is one day enough for Nusa Penida?",
    a: "For one side of the island, yes. A day trip from Sanur is what most people do and it comfortably covers the west or a manta snorkel plus a couple of sights — but it's a rushed day on rough roads. If you can spare a night, staying over lets you see both sides and reach the headline spots near-empty, before and after the day boats.",
  },
  {
    q: "Can you see manta rays around Nusa Penida?",
    a: "Yes — snorkelling with manta rays is one of the island's headline experiences, on a half-day boat trip to the cleaning stations around Manta Point or Manta Bay. Mantas are present essentially year-round, so sightings are very likely, though never guaranteed. The water there is often colder and choppier than the calm bays.",
  },
  {
    q: "How do you get around Nusa Penida?",
    a: "The roads are genuinely rough, and there's no Grab, Gojek or taxi network on the island. For most visitors a hired car with a driver or an organised tour is the safer, easier choice over a self-drive scooter — the descents to beaches like Kelingking are steep enough to overwhelm scooter brakes. Bring plenty of cash, since ATMs are few and often empty.",
  },
];
