import { mobileBootstrap, mobileOptions } from "@/lib/mobile-api/handlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = mobileBootstrap;
export const OPTIONS = mobileOptions;
