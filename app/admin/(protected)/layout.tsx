import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isCurrentAdminRequestAuthorized } from "@/lib/admin-request-auth";

// Everything under this route group is the operator Field Kit. app/admin/login
// lives OUTSIDE this group (a sibling, not gated here) so there's somewhere to
// go: an unauthenticated visit lands on the login form instead of a bare 404.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!(await isCurrentAdminRequestAuthorized())) redirect("/admin/login");
  return children;
}
