"use client";

import { useId } from "react";
import { trackVenueAction } from "@/lib/analytics";
import type { ResolvedVenueAction, VenueActionResolution } from "@/lib/actions/types";

type VenueActionPanelProps = {
  venueName: string;
  resolution: VenueActionResolution;
  className?: string;
  includeStickyBar?: boolean;
  reviewMode?: boolean;
};

function classes(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function ActionLink({
  action,
  primary = false,
  compact = false,
}: {
  action: ResolvedVenueAction;
  primary?: boolean;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noreferrer"
        className={classes("min-w-0 truncate", primary && "is-primary")}
        aria-label={`${action.label}. ${action.disclosure}`}
        onClick={() => trackVenueAction(action.eventPayload)}
      >
        {action.kind === "maps" ? "Google Maps" : action.label}
      </a>
    );
  }

  return (
    <a
      href={action.href}
      target="_blank"
      rel="noreferrer"
      className={classes("action-link", primary && "action-link-primary")}
      aria-label={`${action.label}. ${action.disclosure}`}
      onClick={() => trackVenueAction(action.eventPayload)}
    >
      <span className="action-link-label">{action.label}</span>
      <span className="action-link-disclosure">{action.disclosure}</span>
    </a>
  );
}

export function VenueActionStickyBar({ resolution }: { resolution: VenueActionResolution }) {
  const primary = resolution.primary;
  const maps = resolution.maps;
  const stickyActions = [primary, maps].filter(
    (action, index, values): action is ResolvedVenueAction =>
      Boolean(action) && values.findIndex((candidate) => candidate?.id === action?.id) === index
  );

  if (stickyActions.length === 0) return null;

  return (
    <nav className="venue-action-bar max-w-[100vw] overflow-hidden" aria-label="Quick actions">
      {stickyActions.map((action, index) => (
        <ActionLink key={action.id} action={action} primary={index === 0} compact />
      ))}
    </nav>
  );
}

export default function VenueActionPanel({
  venueName,
  resolution,
  className,
  includeStickyBar = true,
  reviewMode = false,
}: VenueActionPanelProps) {
  const titleId = useId();
  const primary = resolution.primary;
  const alternatives = [
    ...resolution.alternatives,
    ...(resolution.maps && resolution.maps.id !== primary?.id ? [resolution.maps] : []),
  ].filter(
    (action, index, actions) =>
      action.id !== primary?.id && actions.findIndex((candidate) => candidate.id === action.id) === index
  );
  const availableKinds = new Set(resolution.all.map((action) => action.kind));
  const hasDeliveryAction = resolution.all.some((action) =>
    ["delivery", "takeaway", "preorder"].includes(action.kind),
  );
  const missingReviewActions = reviewMode
    ? [
        ...(!availableKinds.has("reserve")
          ? [{ key: "reserve", title: "Reserve a table", note: "Owner booking link needed" }]
          : []),
        ...(!hasDeliveryAction
          ? [{ key: "delivery", title: "Order delivery", note: "Owner delivery link needed" }]
          : []),
      ]
    : [];

  if (!primary && alternatives.length === 0 && !reviewMode) return null;

  return (
    <>
      <section
        className={classes("action-gateway", className)}
        aria-labelledby={titleId}
      >
        {reviewMode && (
          <p className="mb-4 rounded-xl border border-[rgba(198,154,92,0.45)] bg-[rgba(198,154,92,0.12)] px-3 py-2 text-xs text-[var(--ob-sand)]">
            Prepared action links · operator reviewed · owner confirmation pending
          </p>
        )}
        <div className="max-w-2xl">
          <p className="action-gateway-eyebrow">Continue with a provider</p>
          <h2 id={titleId} className="action-gateway-title">
            Choose what you want to do at {venueName}
          </h2>
          <p className="action-gateway-note">
            Other Bali helps you choose. The venue or provider handles the request, order or
            directions after handoff.
          </p>
        </div>

        {primary && (
          <div className="mt-4">
            <ActionLink action={primary} primary />
            {primary.confirmationRequired && (
              <p className="action-gateway-confirm mt-2">
                Confirmation happens with {primary.providerLabel} after you continue.
              </p>
            )}
          </div>
        )}

        {alternatives.length > 0 && (
          <div className="mt-3 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
            {alternatives.map((action) => (
              <div key={action.id} className="min-w-0">
                <ActionLink action={action} />
                {action.confirmationRequired && (
                  <p className="action-gateway-confirm mt-1 px-1">
                    Confirmation happens with {action.providerLabel} after handoff.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {missingReviewActions.length > 0 && (
          <div className="mt-3 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
            {missingReviewActions.map((action) => (
              <div key={action.key} className="action-link opacity-70" aria-disabled="true">
                <span className="action-link-label">{action.title}</span>
                <span className="action-link-disclosure">{action.note}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {includeStickyBar && <VenueActionStickyBar resolution={resolution} />}
    </>
  );
}
