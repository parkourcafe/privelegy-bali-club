import { readFile } from "node:fs/promises";
import path from "node:path";

export const REDDIT_REPORTS = [
  { slug: "five-core-areas", title: "Five core Bali areas", description: "Seminyak, Sanur, Nusa Dua, Ubud and Canggu: fit, trade-offs and realistic stay length.", file: "reddit-bali-five-areas-report-ru.md" },
  { slug: "area-recommendations", title: "Things to do, wellness and day plans", description: "Activities, wellness, beaches, family ideas, nightlife and routes across five areas.", file: "reddit-complete-area-recommendations-plan-and-report-ru.md" },
  { slug: "restaurants", title: "Restaurant recommendations", description: "Top recurring restaurant mentions and the most disputed places across five areas.", file: "reddit-restaurants-top20-bottom5-ru.md" },
  { slug: "hotels", title: "Hotel recommendations", description: "Twenty recurring hotel recommendations for each of five major Bali areas.", file: "reddit-hotels-top20-five-areas-ru.md" },
  { slug: "second-five-areas", title: "Uluwatu, Jimbaran, Amed, Sidemen and Kuta", description: "Restaurants, hotels, activities, routes and common mistakes in the second area cluster.", file: "reddit-second-five-areas-full-report-ru.md" },
  { slug: "islands-north-east-gili", title: "Islands, north, east and the Gilis", description: "Lembongan, Penida, Munduk, Lovina, Candidasa and the three Gili islands.", file: "reddit-third-cluster-islands-north-east-gili-report-ru.md" },
  { slug: "nusa-and-gili-islands", title: "Nusa and Gili island recommendations", description: "A focused guide to Lembongan, Ceningan, Penida, Gili Trawangan, Gili Air and Gili Meno — stays, food, diving, transport and safety trade-offs.", file: "ISLANDS-ONLY-NUSA-AND-GILI-REPORT.md" },
] as const;

export type RedditReport = (typeof REDDIT_REPORTS)[number];

export function getRedditReport(slug: string): RedditReport | undefined {
  return REDDIT_REPORTS.find((report) => report.slug === slug);
}

export async function readRedditReport(report: RedditReport): Promise<string> {
  return readFile(path.join(process.cwd(), "docs", "research", "reddit-2026-07-13", report.file), "utf8");
}
