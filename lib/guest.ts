"use client";

import { nanoid } from "nanoid";

// Anonymous, device-local guest token. No PII. Created lazily on first
// redemption attempt and reused so we can attribute repeat visits to the same
// (still anonymous) guest. Privacy: this is the only identifier we hold.
const KEY = "bp_guest_ref";
const SOURCE_KEY = "bp_source";

export function getOrCreateGuestRef(): string {
  if (typeof window === "undefined") return "";
  let ref = window.localStorage.getItem(KEY);
  if (!ref) {
    ref = "g_" + nanoid(16);
    window.localStorage.setItem(KEY, ref);
  }
  return ref;
}

// First-touch source (villa_01, coliving_02, reels_001, …). Persisted so the
// attribution survives across the trip, not just the landing page.
export function getStoredSource(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SOURCE_KEY);
}

export function saveSourceIfFirst(source: string): boolean {
  if (typeof window === "undefined" || !source) return false;
  if (window.localStorage.getItem(SOURCE_KEY)) return false; // first-touch wins
  window.localStorage.setItem(SOURCE_KEY, source);
  return true;
}
