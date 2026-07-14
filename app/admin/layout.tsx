import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isCurrentAdminRequestAuthorized } from "@/lib/admin-request-auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!(await isCurrentAdminRequestAuthorized())) notFound();
  return children;
}
