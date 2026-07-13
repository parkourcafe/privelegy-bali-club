import "server-only";

import { requireAdminRequest } from "./admin-request-auth";
import { serviceClient } from "./supabase/service";
import type { Phase0Overview } from "./types";

export interface OnboardStatus {
  slug: string;
  invited: boolean;
  confirmed: boolean;
  hasPhoto: boolean;
}

export async function getOperatorOnboardStatus(): Promise<Record<string, OnboardStatus>> {
  await requireAdminRequest();
  const client = serviceClient();
  if (!client) return {};
  const { data, error } = await client.rpc("onboard_status");
  if (error || !data) return {};
  const out: Record<string, OnboardStatus> = {};
  for (const row of data as Record<string, unknown>[]) {
    const slug = String(row.slug);
    out[slug] = {
      slug,
      invited: Boolean(row.invited),
      confirmed: Boolean(row.confirmed),
      hasPhoto: Boolean(row.has_photo),
    };
  }
  return out;
}

export async function getOperatorPhase0Overview(): Promise<Phase0Overview | null> {
  await requireAdminRequest();
  const client = serviceClient();
  if (!client) return null;
  const { data, error } = await client.rpc("phase0_overview");
  if (error || !data) return null;
  const root = data as Record<string, unknown>;
  const funnel = (root.funnel ?? {}) as Record<string, unknown>;
  const venues = (root.venues ?? []) as Record<string, unknown>[];
  return {
    funnel: {
      sourceScan: Number(funnel.source_scan ?? 0),
      landingOpen: Number(funnel.landing_open ?? 0),
      venueCardOpen: Number(funnel.venue_card_open ?? 0),
      perkOpen: Number(funnel.perk_open ?? 0),
      directionClick: Number(funnel.direction_click ?? 0),
      reservationClick: Number(funnel.reservation_click ?? 0),
      similarOpen: Number(funnel.similar_open ?? 0),
      redemption: Number(funnel.redemption ?? 0),
    },
    venues: venues.map((venue) => ({
      slug: String(venue.slug),
      name: String(venue.name),
      directionClicks: Number(venue.direction_clicks ?? 0),
      reservationClicks: Number(venue.reservation_clicks ?? 0),
      perkOpens: Number(venue.perk_opens ?? 0),
      redemptions: Number(venue.redemptions ?? 0),
      externallyAttributed: Number(venue.externally_attributed ?? 0),
      inVenue: Number(venue.in_venue ?? 0),
      creator: Number(venue.creator ?? 0),
    })),
  };
}
