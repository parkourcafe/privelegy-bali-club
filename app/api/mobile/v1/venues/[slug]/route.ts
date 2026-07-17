import { mobileOptions, mobileVenue } from "@/lib/mobile-api/handlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  return mobileVenue(request, params);
}

export const OPTIONS = mobileOptions;
