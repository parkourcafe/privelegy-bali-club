#!/usr/bin/env node

import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

const PHOTO_BUCKET = "venue-photos";
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;
const DEFAULT_GRACE_MINUTES = 60;
const MIN_GRACE_MINUTES = 15;
const MAX_GRACE_MINUTES = 7 * 24 * 60;

export function parseCleanupArgs(argv) {
  const args = {
    apply: false,
    limit: DEFAULT_LIMIT,
    graceMinutes: DEFAULT_GRACE_MINUTES,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--apply") args.apply = true;
    else if (value === "--limit") args.limit = Number(argv[++index]);
    else if (value === "--grace-minutes") args.graceMinutes = Number(argv[++index]);
    else if (value === "--help") args.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }

  if (!Number.isInteger(args.limit) || args.limit < 1 || args.limit > MAX_LIMIT) {
    throw new Error(`--limit must be an integer between 1 and ${MAX_LIMIT}`);
  }
  if (
    !Number.isInteger(args.graceMinutes)
    || args.graceMinutes < MIN_GRACE_MINUTES
    || args.graceMinutes > MAX_GRACE_MINUTES
  ) {
    throw new Error(
      `--grace-minutes must be an integer between ${MIN_GRACE_MINUTES} and ${MAX_GRACE_MINUTES}`,
    );
  }

  return args;
}

function transitionPayload(data) {
  return data && typeof data === "object" && !Array.isArray(data) ? data : null;
}

function absentStorageError(error) {
  if (!error || typeof error !== "object") return false;
  const status = Number(error.statusCode ?? error.status);
  const code = String(error.code ?? "").toLowerCase();
  return status === 404 || code === "404" || code === "not_found" || code === "nosuchkey";
}

function publicCandidate(candidate) {
  return {
    id: String(candidate.id),
    venueSlug: String(candidate.venue_slug),
    imagePath: String(candidate.image_path),
    storageState: String(candidate.storage_state),
    createdAt: String(candidate.created_at),
    updatedAt: String(candidate.updated_at),
  };
}

export async function loadCleanupCandidates(client, { limit, graceMinutes, now = Date.now() }) {
  const columns = "id,venue_slug,image_path,storage_state,created_at,updated_at";
  const staleBefore = new Date(now - graceMinutes * 60_000).toISOString();

  const pendingQuery = await client
    .from("venue_photo_submissions")
    .select(columns)
    .eq("storage_state", "cleanup_pending")
    .lt("cleanup_requested_at", staleBefore)
    .order("cleanup_requested_at", { ascending: true })
    .limit(limit);
  if (pendingQuery.error) throw new Error("cleanup_pending_query_failed");

  const staleQuery = await client
    .from("venue_photo_submissions")
    .select(columns)
    .in("storage_state", ["reserved", "uploaded"])
    .eq("consent_granted", false)
    .is("consent_log_id", null)
    .lt("created_at", staleBefore)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (staleQuery.error) throw new Error("stale_photo_query_failed");

  const candidates = [];
  const seen = new Set();
  for (const row of [...(pendingQuery.data ?? []), ...(staleQuery.data ?? [])]) {
    const id = String(row.id ?? "");
    if (!id || seen.has(id)) continue;
    seen.add(id);
    candidates.push(publicCandidate(row));
    if (candidates.length >= limit) break;
  }
  return candidates;
}

async function requestCleanup(client, candidate) {
  const requested = await client.rpc("request_venue_photo_cleanup", {
    p_submission_id: candidate.id,
    p_venue_slug: candidate.venueSlug,
    p_image_path: candidate.imagePath,
    p_reason: "stale_unconsented_storage",
  });
  if (requested.error) return "rpc_failed";

  const payload = transitionPayload(requested.data);
  if (payload?.error === "consent_recorded") return "consent_recorded";
  if (payload?.ok !== true) return "state_conflict";
  if (payload.storage_state === "removed") return "removed";
  if (payload.storage_state !== "cleanup_pending") return "state_conflict";
  return "cleanup_pending";
}

async function removeAndComplete(client, candidate) {
  const removal = await client.storage.from(PHOTO_BUCKET).remove([candidate.imagePath]);
  if (removal.error && !absentStorageError(removal.error)) return "storage_failed";

  const completed = await client.rpc("complete_venue_photo_cleanup", {
    p_submission_id: candidate.id,
    p_venue_slug: candidate.venueSlug,
    p_image_path: candidate.imagePath,
    p_storage_removal_confirmed: true,
  });
  if (completed.error) return "rpc_failed";

  const payload = transitionPayload(completed.data);
  return payload?.ok === true && payload.storage_state === "removed"
    ? "removed"
    : "state_conflict";
}

export async function runCleanupSweep(client, options) {
  const candidates = await loadCleanupCandidates(client, options);
  const summary = {
    mode: options.apply ? "apply" : "dry-run",
    scanned: candidates.length,
    eligibleByState: {},
    removed: 0,
    consentRecorded: 0,
    deferred: 0,
  };

  for (const candidate of candidates) {
    summary.eligibleByState[candidate.storageState] =
      (summary.eligibleByState[candidate.storageState] ?? 0) + 1;
  }
  if (!options.apply) return summary;

  for (const candidate of candidates) {
    const requested = await requestCleanup(client, candidate);
    if (requested === "removed") {
      summary.removed += 1;
      continue;
    }
    if (requested === "consent_recorded") {
      summary.consentRecorded += 1;
      continue;
    }
    if (requested !== "cleanup_pending") {
      summary.deferred += 1;
      continue;
    }

    const completed = await removeAndComplete(client, candidate);
    if (completed === "removed") summary.removed += 1;
    else summary.deferred += 1;
  }

  return summary;
}

function serviceClientFromEnvironment() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function main() {
  const args = parseCleanupArgs(process.argv.slice(2));
  if (args.help) {
    console.log(
      "Usage: node scripts/reconcile-venue-photo-cleanup.mjs [--apply] [--limit 1..100] [--grace-minutes 15..10080]",
    );
    return;
  }

  const summary = await runCleanupSweep(serviceClientFromEnvironment(), args);
  // Aggregate state counts only: never print submitter data, object paths,
  // credentials or record identifiers.
  console.log(JSON.stringify(summary, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await main();
}
