"use client";

import { nanoid } from "nanoid";

// Anonymous, device-local guest token. No PII. Created lazily on first
// redemption attempt and reused so we can attribute repeat visits to the same
// (still anonymous) guest. Privacy: this is the only identifier we hold.
const KEY = "bp_guest_ref";

export function getOrCreateGuestRef(): string {
  if (typeof window === "undefined") return "";
  let ref = window.localStorage.getItem(KEY);
  if (!ref) {
    ref = "g_" + nanoid(16);
    window.localStorage.setItem(KEY, ref);
  }
  return ref;
}
