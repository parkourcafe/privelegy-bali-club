import { mutationResponse } from "@/lib/runtime-v1.2/route-runtime";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function POST(request: Request) { return mutationResponse(request, "decision.create"); }
