import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  PRODUCTION_SUPABASE_PROJECT_REF,
  isProtectedPreviewProductionMediaAllowed,
} from "./protected-preview-media-policy";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const previewProjectRef = process.env.OTHER_BALI_PREVIEW_SUPABASE_PROJECT_REF;

let client: SupabaseClient | null = null;
let submissionMediaClient: SupabaseClient | null = null;

export function isServiceEnvironmentSafe(input: {
  url?: string;
  vercelEnv?: string;
  previewProjectRef?: string;
}): boolean {
  if (input.vercelEnv !== "preview") return true;
  const ref = input.previewProjectRef?.trim();
  if (!input.url || !ref || ref === PRODUCTION_SUPABASE_PROJECT_REF) return false;
  try {
    const parsed = new URL(input.url);
    return parsed.protocol === "https:" && parsed.hostname === `${ref}.supabase.co`;
  } catch {
    return false;
  }
}

export function serviceClient(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  if (!isServiceEnvironmentSafe({
    url,
    vercelEnv: process.env.VERCEL_ENV,
    previewProjectRef,
  })) return null;
  if (!client) {
    client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export function isProductionSubmissionMediaPreviewBridgeActive(): boolean {
  return isProtectedPreviewProductionMediaAllowed({
    url,
    vercelEnv: process.env.VERCEL_ENV,
    gitCommitRef: process.env.VERCEL_GIT_COMMIT_REF,
    approval:
      process.env
        .OTHER_BALI_PROTECTED_PREVIEW_PRODUCTION_SUBMISSION_MEDIA_WRITE,
  });
}

// Narrow exception for the founder-authorised, Vercel-protected owner preview.
// General preview code continues to receive null from serviceClient() when it
// points at production. Only the submission-media DAL and its two upload
// endpoints import this capability.
export function submissionMediaServiceClient(): SupabaseClient | null {
  const safeGeneralClient = serviceClient();
  if (safeGeneralClient) return safeGeneralClient;
  if (!url || !serviceKey) return null;
  if (!isProductionSubmissionMediaPreviewBridgeActive()) return null;
  if (!submissionMediaClient) {
    submissionMediaClient = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return submissionMediaClient;
}
