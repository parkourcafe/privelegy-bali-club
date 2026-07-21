"use client";

import { signOutAdmin } from "./actions";

export default function AdminSignOutButton() {
  async function onClick() {
    await signOutAdmin();
    window.location.href = "/admin/login";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600"
    >
      Sign out
    </button>
  );
}
