// Registry of the hand-crafted district pillars (the deep `/[district]` guides
// that own their districts and are excluded from the programmatic /bali hubs).
// Single source of truth so the /bali index, llms.txt and the sitemap can't
// drift apart. Adding a pillar or a child page = one edit here.

export interface PillarChild {
  path: string;
  title: string;
}

export interface Pillar {
  slug: string;
  name: string;
  tagline: string;
  children: PillarChild[];
}

export const PILLARS: Pillar[] = [
  {
    slug: "canggu",
    name: "Canggu",
    tagline: "Surf mornings, café work, sunset beach clubs — the deep guide.",
    children: [
      { path: "/canggu/best-restaurants", title: "Best restaurants in Canggu" },
      { path: "/canggu/best-brunch", title: "Best brunch in Canggu" },
      { path: "/canggu/best-warungs", title: "Best warungs & local food in Canggu" },
      { path: "/canggu/work-friendly-cafes", title: "Work-friendly cafés in Canggu" },
      { path: "/canggu/best-spas", title: "Best spas in Canggu" },
      { path: "/canggu/beach-clubs-sunset", title: "Canggu beach clubs & sunset" },
    ],
  },
  {
    slug: "uluwatu",
    name: "Uluwatu",
    tagline: "Cliff-edge sunsets, world-class surf, dinners with a view.",
    children: [
      { path: "/uluwatu/best-restaurants", title: "Best restaurants in Uluwatu" },
      { path: "/uluwatu/best-brunch", title: "Best brunch & coffee in Uluwatu" },
      { path: "/uluwatu/beach-clubs-sunset", title: "Uluwatu beach clubs & sunset" },
      { path: "/uluwatu/date-night-restaurants", title: "Date-night restaurants in Uluwatu" },
      { path: "/uluwatu/48-hours", title: "48 hours in Uluwatu" },
    ],
  },
  {
    slug: "ubud",
    name: "Ubud",
    tagline: "Jungle mornings, rice-terrace calm, long slow dinners.",
    children: [
      { path: "/ubud/things-to-do", title: "Best things to do in Ubud" },
      { path: "/ubud/itinerary", title: "2 to 3 days in Ubud (itinerary)" },
      { path: "/ubud/best-restaurants", title: "Best restaurants in Ubud" },
      { path: "/ubud/best-warungs", title: "Best warungs & local food in Ubud" },
      { path: "/ubud/best-cafes-coffee", title: "Best cafés & coffee in Ubud" },
      { path: "/ubud/best-yoga-wellness", title: "Best yoga & wellness in Ubud" },
    ],
  },
  {
    slug: "sanur",
    name: "Sanur",
    tagline: "A calm, walkable, sunrise base with easy island connections.",
    children: [
      { path: "/sanur/best-hotels", title: "Best hotels in Sanur" },
      { path: "/sanur/things-to-do", title: "Best things to do in Sanur" },
      { path: "/sanur/best-restaurants", title: "Best restaurants in Sanur" },
      { path: "/sanur/cafes-and-bars", title: "Best cafés & bars in Sanur" },
      { path: "/sanur/spas-wellness", title: "Best spas & wellness in Sanur" },
    ],
  },
  {
    slug: "seminyak",
    name: "Seminyak",
    tagline: "The original style strip: dining, sunset beach clubs and Bali's densest spa scene.",
    children: [
      { path: "/seminyak/best-restaurants", title: "Best restaurants in Seminyak" },
      { path: "/seminyak/beach-clubs-sunset", title: "Seminyak beach clubs & sunset" },
      { path: "/seminyak/cafes-coffee", title: "Best cafés & coffee in Seminyak" },
      { path: "/seminyak/spas-salons-wellness", title: "Best spas, salons & wellness in Seminyak" },
    ],
  },
  {
    slug: "nusa-dua",
    name: "Nusa Dua",
    tagline: "The calm, gated resort enclave: swimmable beaches, fine dining and big resort spas.",
    children: [
      { path: "/nusa-dua/things-to-do", title: "Best things to do in Nusa Dua" },
      { path: "/nusa-dua/best-restaurants", title: "Best restaurants in Nusa Dua" },
      { path: "/nusa-dua/spas-wellness", title: "Best spas & wellness in Nusa Dua" },
    ],
  },
  {
    slug: "jimbaran",
    name: "Jimbaran",
    tagline: "The seafood bay: grills on the sand at sunset, cliff-edge bars and resort spas.",
    children: [
      { path: "/jimbaran/things-to-do", title: "Best things to do in Jimbaran" },
      { path: "/jimbaran/best-restaurants", title: "Best restaurants in Jimbaran" },
      { path: "/jimbaran/spas-wellness", title: "Best spas & wellness in Jimbaran" },
    ],
  },
  {
    // Destination pillar. Its programmatic children aren't built yet (island
    // venues are still being curated), so `children` is empty — the day-trip
    // logistics live in the separate /nusa-penida-day-trip guide, cross-linked
    // from the pillar rather than listed here as a pillar child.
    slug: "nusa-penida",
    name: "Nusa Penida",
    tagline: "The island of cliffs and mantas: Kelingking, hidden coves and manta snorkelling off the south-east coast.",
    children: [],
  },
];
