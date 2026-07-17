import { mobileOptions, mobileVenues } from "@/lib/mobile-api/handlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = mobileVenues;
export const OPTIONS = mobileOptions;
