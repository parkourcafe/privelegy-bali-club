#!/usr/bin/env node

import process from "node:process";
import { pathToFileURL } from "node:url";

export const KNOWN_PRODUCTION_PROJECT_REF = "egkdapqwkfprtyqvvnso";

export function validateBrowserStagingEnvironment(env) {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "GUEST_REF_SIGNING_SECRET",
    "OTHER_BALI_PREVIEW_SUPABASE_PROJECT_REF",
  ];
  const missing = required.filter((name) => !env[name]?.trim());
  if (missing.length > 0) throw new Error(`missing staging configuration: ${missing.join(", ")}`);
  if (env.VERCEL_ENV !== "preview") throw new Error("staging browser proof requires VERCEL_ENV=preview");

  const projectRef = env.OTHER_BALI_PREVIEW_SUPABASE_PROJECT_REF.trim();
  if (!/^[a-z0-9]{20}$/.test(projectRef)) throw new Error("invalid staging Supabase project ref");
  if (projectRef === KNOWN_PRODUCTION_PROJECT_REF) throw new Error("production Supabase is forbidden for browser E2E");

  let url;
  try {
    url = new URL(env.NEXT_PUBLIC_SUPABASE_URL);
  } catch {
    throw new Error("invalid staging Supabase URL");
  }
  if (
    url.protocol !== "https:"
    || url.username
    || url.password
    || url.hostname !== `${projectRef}.supabase.co`
    || url.pathname !== "/"
    || url.search
    || url.hash
  ) {
    throw new Error("staging Supabase URL does not match the isolated project ref");
  }
  if (env.GUEST_REF_SIGNING_SECRET.length < 32) {
    throw new Error("staging GuestRef signing secret must contain at least 32 characters");
  }
  if (env.NEXT_PUBLIC_SUPABASE_ANON_KEY === env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("staging anon and service-role credentials must be distinct");
  }
  return { projectRef, hostname: url.hostname };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = validateBrowserStagingEnvironment(process.env);
    console.log(`Validated isolated browser staging target ${result.hostname}.`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
