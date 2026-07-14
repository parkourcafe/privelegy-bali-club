"use client";

import { useId } from "react";
import { trackVenueAction } from "@/lib/analytics";
import type { ResolvedVenueAction, VenueActionResolution } from "@/lib/actions/types";

type VenueActionPanelProps = {
  venueName: string;
  resolution: VenueActionResolution;
  className?: string;
  includeStickyBar?: boolean;
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
      className={classes(
        "group flex min-h-[46px] min-w-0 flex-col justify-center rounded-xl border px-4 py-3 no-underline transition",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00737a]",
        primary
          ? "border-[#00737a] bg-[#00737a] text-[#fffaf1] hover:bg-[#005962]"
          : "border-black/15 bg-[#fffaf1] text-[#20231e] hover:border-[#00737a]/60 hover:bg-[#00737a]/5"
      )}
      aria-label={`${action.label}. ${action.disclosure}`}
      onClick={() => trackVenueAction(action.eventPayload)}
    >
      <span className="break-words text-sm font-extrabold leading-5">{action.label}</span>
      <span
        className={classes(
          "mt-0.5 break-words text-xs leading-4",
          primary ? "text-[#fffaf1]/80" : "text-[#5f625a]"
        )}
      >
        {action.disclosure}
      </span>
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

  if (!primary && alternatives.length === 0) return null;

  return (
    <>
      <section
        className={classes(
          "min-w-0 rounded-2xl border border-black/10 bg-[#fffaf1] p-4 shadow-[0_16px_40px_rgba(32,35,30,0.08)] sm:p-5",
          className
        )}
        aria-labelledby={titleId}
      >
        <div className="max-w-2xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#00737a]">
            Continue with a provider
          </p>
          <h2 id={titleId} className="mt-1 text-xl font-black text-[#20231e]">
            Choose what you want to do at {venueName}
          </h2>
          <p className="mt-1 text-sm leading-5 text-[#5f625a]">
            Other Bali helps you choose. The venue or provider handles the request, order or
            directions after handoff.
          </p>
        </div>

        {primary && (
          <div className="mt-4">
            <ActionLink action={primary} primary />
            {primary.confirmationRequired && (
              <p className="mt-2 text-xs leading-4 text-[#5f625a]">
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
                  <p className="mt-1 px-1 text-xs leading-4 text-[#5f625a]">
                    Confirmation happens with {action.providerLabel} after handoff.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {includeStickyBar && <VenueActionStickyBar resolution={resolution} />}
    </>
  );
}
