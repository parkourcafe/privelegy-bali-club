import { mutationResponse, readResponse } from "@/lib/runtime-v1.2/route-runtime";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET() { return readResponse("sync"); }
export function POST(request: Request) { return mutationResponse(request, "sync.push"); }
