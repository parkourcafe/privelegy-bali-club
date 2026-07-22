"use client";

import { useState } from "react";
import { signInAdmin } from "./actions";

// A hard navigation (not next/navigation's router) once the server action
// confirms the session cookie is set — see actions.ts for why.
export default function AdminLoginForm() {
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(false);
    const result = await signInAdmin(new FormData(event.currentTarget));
    if (result.ok) {
      window.location.href = "/admin";
      return;
    }
    setError(true);
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-widest text-stone-500">
          Access token
        </span>
        <input
          type="password"
          name="token"
          required
          autoFocus
          autoComplete="off"
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm font-semibold text-red-700">
          That token didn&apos;t match. Try again.
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-cyan-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
