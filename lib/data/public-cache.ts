// One hour: each refill of the published catalogue downloads whole tables from
// Supabase, once per Vercel project, and at five minutes that traffic used up
// the organization's egress quota (October 2026). Admin edits call
// revalidateTag on these tags, so they still show up immediately.
export const PUBLIC_CACHE_REVALIDATE_SECONDS = 3600;

export const PUBLIC_CACHE_TAGS = {
  venues: "public-venues",
  menus: "public-menus",
  actions: "public-actions",
  routes: "public-routes",
  plans: "public-plans",
} as const;
