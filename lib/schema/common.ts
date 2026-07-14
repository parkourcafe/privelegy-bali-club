export type ValidationStage = "raw" | "normalized" | "publication" | "dataset" | "source";

export type ValidationSeverity = "error" | "warning";

export interface ValidationRecordRef {
  id: string | null;
  slug: string | null;
  index?: number;
}

export interface ValidationIssue {
  code: string;
  path: string;
  message: string;
  severity: ValidationSeverity;
  stage: ValidationStage;
  record?: ValidationRecordRef;
}

export interface ValidationResult<T> {
  ok: boolean;
  data: T | null;
  issues: ValidationIssue[];
}

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizedText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim().replace(/\s+/g, " ");
  return text || null;
}

export function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || ["string", "number", "boolean"].includes(typeof value)) return true;
  if (Array.isArray(value)) return value.every(isJsonValue);
  return isRecord(value) && Object.values(value).every(isJsonValue);
}

export function hasErrors(issues: readonly ValidationIssue[]): boolean {
  return issues.some((entry) => entry.severity === "error");
}

export function makeIssue(
  code: string,
  path: string,
  message: string,
  stage: ValidationStage,
  severity: ValidationSeverity = "error",
  record?: ValidationRecordRef,
): ValidationIssue {
  return {
    code,
    path,
    message,
    severity,
    stage,
    ...(record ? { record } : {}),
  };
}
