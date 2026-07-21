import AdminLoginForm from "./AdminLoginForm";

export const dynamic = "force-dynamic";

// Friendly front door for the operator Field Kit. Submits the SAME secret as
// the break-glass Basic Auth header (ADMIN_ACCESS_TOKEN) — this page doesn't
// introduce a new credential, just a normal form instead of a URL with the
// password embedded in it. On success, AdminLoginForm's server action mints a
// 30-day httpOnly session cookie (lib/admin-session.ts) scoped to /admin.
export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-sm flex-col justify-center px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
        Field Kit · operator
      </p>
      <h1 className="mt-1 text-2xl font-bold">Sign in</h1>
      <p className="mt-2 text-sm text-stone-600">
        Enter the operator access token to continue.
      </p>

      <AdminLoginForm />
    </main>
  );
}
