"use client";

import Link, { type LinkProps } from "next/link";
import { analyticsAllowed } from "@/lib/consent";
import type { HomeSectionId, HomeItemKind } from "@/lib/homepage";

type HomeAnalyticsEvent =
  | "home_mode_select"
  | "home_scenario_select"
  | "home_area_select"
  | "home_plan_select"
  | "home_category_select"
  | "home_cta_select";

function eventFor(kind: HomeItemKind): HomeAnalyticsEvent {
  switch (kind) {
    case "scenario":
      return "home_scenario_select";
    case "area":
      return "home_area_select";
    case "plan":
      return "home_plan_select";
    case "category":
      return "home_category_select";
    case "cta":
      return "home_cta_select";
  }
}

export default function HomeAnalyticsLink({
  href,
  sectionId,
  itemId,
  itemKind,
  position,
  children,
  className,
  ariaLabel,
}: {
  href: LinkProps["href"];
  sectionId: HomeSectionId;
  itemId: string;
  itemKind: HomeItemKind;
  position?: number;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const targetPath = typeof href === "string" ? href : href.pathname ?? "";

  function onClick() {
    if (!analyticsAllowed()) return;
    const eventId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const payload = {
      event_id: eventId,
      source_context: "homepage",
      section_id: sectionId,
      item_id: itemId,
      item_kind: itemKind,
      position,
      target_path: targetPath,
    };
    try {
      window.gtag?.("event", eventFor(itemKind), payload);
    } catch {
      // Analytics must never block navigation.
    }
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </Link>
  );
}
