import { NextResponse } from "next/server";
import { V12_ERROR_CONTRACTS, type V12ErrorCode } from "@/lib/contracts/errors-v1.2";
import {
  RUNTIME_SCHEMA_VERSION,
  type RuntimeEnvelope,
  type RuntimeErrorEnvelope,
} from "./contracts";

const noStore = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

export function runtimeSuccess<T>(data: T, status = 200): NextResponse<RuntimeEnvelope<T>> {
  return NextResponse.json(
    { schemaVersion: RUNTIME_SCHEMA_VERSION, updatedAt: new Date().toISOString(), data },
    { status, headers: noStore },
  );
}

export function runtimeError(
  code: V12ErrorCode | "INVALID_REQUEST" | "TEMPORARILY_UNAVAILABLE",
  message: string,
  status?: number,
): NextResponse<RuntimeErrorEnvelope> {
  const contract = code in V12_ERROR_CONTRACTS
    ? V12_ERROR_CONTRACTS[code as V12ErrorCode]
    : null;
  return NextResponse.json(
    {
      schemaVersion: RUNTIME_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
      error: { code, message, retryable: contract?.retryable ?? code === "TEMPORARILY_UNAVAILABLE" },
    },
    { status: status ?? contract?.httpStatus ?? 400, headers: noStore },
  );
}
