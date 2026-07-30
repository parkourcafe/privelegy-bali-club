import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type {
  MobileRouteDetail,
  MobileRouteSummary,
  MobileVenue,
  MobileVenueCompact,
} from "../../lib/mobile-api/contracts";
import type { ExternalLinkKind } from "../../lib/external-links";
import {
  createDecision,
  deleteSyncedData as requestSyncedDataDeletion,
  fetchBootstrap,
  fetchDiscoveryFeed,
  fetchEvents,
  fetchOfflineBaliManifest,
  pushSyncMutation,
  fetchRouteDetail,
  fetchVenueDetail,
  type MobileEventOccurrence,
  type MobileFeedCard,
} from "./api";
import type { Trip } from "../../lib/journey/contracts";
import type { SyncMutation } from "../../lib/journey/offline-sync";
import type { MobileBootstrapPayload } from "./contracts";
import SelectionExperience from "./SelectionExperience";
import { parseMobileDeepLink, type MobileDeepLinkTarget } from "./deep-links";
import {
  enqueuePendingSyncMutation,
  flushPendingSyncQueue,
} from "./sync-runtime";
import {
  exitMobileApp,
  openControlledExternal,
  shareMobileTarget,
  startBackButtonMonitoring,
  startAppStateMonitoring,
  startDeepLinkMonitoring,
  startNetworkMonitoring,
} from "./native-runtime";
import {
  DEFAULT_NAVIGATION_STATE,
  clearPrivacyDeletionQuarantine,
  clearMobilePersonalData,
  hydrateMobileStorage,
  MAX_SAVED_ROUTE_SNAPSHOTS,
  writeCachedBootstrap,
  writeNavigationState,
  writeNavigationSession,
  writeOfflinePackStates,
  writePendingSync,
  writePrivacyDeletionQuarantine,
  writeSavedRouteState,
  writeSavedVenueState,
  writeEventsSnapshot,
  writeFeedResumeSnapshot,
  writeTodayEventState,
  writeTodayVenueState,
  writeTrip,
  type MobileSurface,
  type MobileNavigationState,
  type PrivacyDeletionQuarantinePhase,
  type SavedRouteSnapshot,
  type SavedVenueSnapshot,
} from "./storage";
import {
  deleteGuestIdentity,
  getOrCreateGuestIdentity,
} from "./guest-identity";
import { PersonalWriteBarrier } from "./personal-write-barrier";
import {
  adaptReadyMadeRoutesToTrip,
  addTripStop,
  createEmptyTrip,
  isEventUsable,
  moveTripStopToDay,
  moveTripStop,
  reconcileTodayEventOccurrences,
  removeTripStop,
  replaceTripStop,
  setTripStopNote,
  setTripStopState,
} from "./trip-planner";
import {
  buildSharedCandidateUniverse,
  MOBILE_FEED_POLICY_VERSION,
  resolveFeedResumeSnapshot,
  type FeedResumeSnapshot,
} from "./discovery-model";
import type { OfflineBaliManifest, OfflinePackState, OfflineRegionManifest } from "../../lib/journey/offline-bali";
import {
  defaultOfflineMapRuntime,
  downloadOfflineRegionIfAvailable,
  reconcileOfflinePackStates,
  removeOfflineRegionSafely,
  type ListableOfflineMapRuntime,
} from "./offline-runtime";
import {
  buildCompanionSuggestions,
  createNavigationSession,
  transitionNavigationSession,
  type CompanionSuggestion,
  type NavigationSession,
} from "../../lib/journey/adaptive-companion";

interface LoadedVenueDetail {
  venue: MobileVenue;
  updatedAt: string;
}

interface LoadedRouteDetail {
  route: MobileRouteDetail;
  updatedAt: string;
}

interface PersistedVenueState {
  ids: string[];
  snapshots: SavedVenueSnapshot[];
}

interface PersistedRouteState {
  ids: string[];
  snapshots: SavedRouteSnapshot[];
}

function formatUpdatedAt(value: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

async function copyTextToClipboard(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("clipboard_unavailable");
}

async function fetchCompleteDiscoveryFeed(signal?: AbortSignal): Promise<MobileFeedCard[]> {
  const cards: MobileFeedCard[] = [];
  const seenCursors = new Set<string>();
  let cursor: string | null = null;
  for (let pageNumber = 0; pageNumber < 10; pageNumber += 1) {
    const result = await fetchDiscoveryFeed({
      district: "all",
      category: "all",
      limit: 50,
      cursor,
    }, signal);
    cards.push(...result.page.items);
    if (result.page.end) return cards;
    if (!result.page.nextCursor || seenCursors.has(result.page.nextCursor)) {
      throw new Error("Feed cursor did not advance");
    }
    seenCursors.add(result.page.nextCursor);
    cursor = result.page.nextCursor;
  }
  throw new Error("Feed exceeded the bounded mobile catalogue");
}

function VenueCard({
  venue,
  saved,
  onOpen,
  onToggle,
}: {
  venue: MobileVenueCompact;
  saved: boolean;
  onOpen: () => void;
  onToggle: () => void;
}) {
  return (
    <article className="card">
      <div className="card-copy">
        <p className="card-kicker">{venue.district} · {venue.category.replaceAll("_", " ")}</p>
        <h3>{venue.name}</h3>
        <p>{venue.bestFor ?? venue.subarea ?? "Open the summary for verified public details."}</p>
        {venue.isSponsored ? <span className="disclosure">Sponsored</span> : null}
      </div>
      <div className="card-actions">
        <button className="detail-button" type="button" onClick={onOpen}>Details</button>
        <button className="save-button" type="button" aria-pressed={saved} onClick={onToggle}>
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </article>
  );
}

function RouteCard({
  route,
  saved,
  offlineDetailSaved,
  onOpen,
  onToggle,
}: {
  route: MobileRouteSummary;
  saved: boolean;
  offlineDetailSaved: boolean;
  onOpen: () => void;
  onToggle: () => void;
}) {
  return (
    <article className="card">
      <div className="card-copy">
        <p className="card-kicker">Curated route · {route.stopCount} stops</p>
        <h3>{route.title}</h3>
        {route.subtitle ? <p>{route.subtitle}</p> : null}
      </div>
      <div className="card-actions">
        <button className="detail-button" type="button" onClick={onOpen}>Open route</button>
        <button className="save-button" type="button" aria-pressed={saved} onClick={onToggle}>
          {saved ? offlineDetailSaved ? "Saved offline" : "Saved summary" : "Save summary"}
        </button>
      </div>
    </article>
  );
}

function EventCard({
  event,
  inToday,
  onAddToToday,
  onAddToTrip,
}: {
  event: MobileEventOccurrence;
  inToday: boolean;
  onAddToToday: () => void;
  onAddToTrip: () => void;
}) {
  return (
    <article className="card">
      <div className="card-copy">
        <p className="card-kicker">{event.area ?? "Bali"} · {formatUpdatedAt(event.startsAt)}</p>
        <h3>{event.title}</h3>
        <p>Ends {formatUpdatedAt(event.endsAt)} · verified {formatUpdatedAt(event.lastVerifiedAt)}</p>
      </div>
      <div className="card-actions">
        <button className="detail-button" type="button" disabled={inToday} onClick={onAddToToday}>
          {inToday ? "In Today" : "Add to Today"}
        </button>
        <button className="save-button" type="button" onClick={onAddToTrip}>Add to Trip</button>
      </div>
    </article>
  );
}

function TripPlan({
  trip,
  resolveStop,
  replacementOptions,
  onMove,
  onMoveToDay,
  onReplace,
  onSaveNote,
  onToggleSkipped,
  onToggleVisited,
  onRemove,
}: {
  trip: Trip;
  resolveStop: (entityType: "place" | "event_occurrence", entityId: string) => string;
  replacementOptions: Array<{ id: string; name: string }>;
  onMove: (dayIndex: number, stopId: string, direction: -1 | 1) => void;
  onMoveToDay: (dayIndex: number, stopId: string, targetDayIndex: number) => void;
  onReplace: (dayIndex: number, stopId: string, replacementId: string) => void;
  onSaveNote: (dayIndex: number, stopId: string, note: string) => void;
  onToggleSkipped: (dayIndex: number, stopId: string, skipped: boolean) => void;
  onToggleVisited: (dayIndex: number, stopId: string, visited: boolean) => void;
  onRemove: (dayIndex: number, stopId: string) => void;
}) {
  return (
    <section className="trip-plan" aria-label="Offline trip plan">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Editable offline plan</p>
          <h2>{trip.title}</h2>
        </div>
      </div>
      {trip.days.map((day, dayIndex) => (
        <article className="trip-day" key={day.id}>
          <h3>Day {dayIndex + 1} · {day.date}</h3>
          {!day.stops.length ? <p>No stops yet.</p> : (
            <ol>
              {day.stops.map((stop, stopIndex) => (
                <li key={stop.id} className={stop.state === "visited" ? "visited" : ""}>
                  <span>
                    {resolveStop(stop.entityType, stop.entityId)}
                    {stop.state === "skipped" ? " · skipped" : ""}
                    {stop.state === "replaced" ? " · replaced" : ""}
                  </span>
                  <div className="trip-actions">
                    <button type="button" disabled={stopIndex === 0} onClick={() => onMove(dayIndex, stop.id, -1)}>↑</button>
                    <button type="button" disabled={stopIndex === day.stops.length - 1} onClick={() => onMove(dayIndex, stop.id, 1)}>↓</button>
                    <label>
                      Day
                      <select
                        aria-label={`Move ${resolveStop(stop.entityType, stop.entityId)} to another day`}
                        value={dayIndex}
                        onChange={(event) => onMoveToDay(dayIndex, stop.id, Number(event.target.value))}
                      >
                        {trip.days.map((targetDay, targetDayIndex) => (
                          <option key={targetDay.id} value={targetDayIndex}>Day {targetDayIndex + 1}</option>
                        ))}
                      </select>
                    </label>
                    <button type="button" onClick={() => onToggleVisited(dayIndex, stop.id, stop.state !== "visited")}>
                      {stop.state === "visited" ? "Undo" : "Visited"}
                    </button>
                    <button type="button" onClick={() => onToggleSkipped(dayIndex, stop.id, stop.state !== "skipped")}>
                      {stop.state === "skipped" ? "Restore" : "Skip"}
                    </button>
                    {stop.entityType === "place" && replacementOptions.length ? (
                      <label>
                        Replace
                        <select
                          aria-label={`Replace ${resolveStop(stop.entityType, stop.entityId)}`}
                          defaultValue=""
                          onChange={(event) => {
                            if (event.target.value) onReplace(dayIndex, stop.id, event.target.value);
                            event.target.value = "";
                          }}
                        >
                          <option value="">Choose another place</option>
                          {replacementOptions.map((option) => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                          ))}
                        </select>
                      </label>
                    ) : null}
                    <label>
                      Note
                      <input
                        aria-label={`Note for ${resolveStop(stop.entityType, stop.entityId)}`}
                        defaultValue={stop.userNote ?? ""}
                        maxLength={500}
                        onChange={(event) => onSaveNote(
                          dayIndex,
                          stop.id,
                          event.currentTarget.value,
                        )}
                      />
                    </label>
                    <button type="button" onClick={() => onRemove(dayIndex, stop.id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </article>
      ))}
    </section>
  );
}

function OfflineBaliManager({
  manifest,
  online,
  packs,
  onDownload,
  onRemove,
  onOpen,
}: {
  manifest: OfflineBaliManifest | null;
  online: boolean;
  packs: OfflinePackState[];
  onDownload: (region: OfflineRegionManifest) => void;
  onRemove: (regionId: string) => void;
  onOpen: (regionId: string) => void;
}) {
  const activated = manifest?.providerStatus === "available";
  return (
    <section className="offline-bali" aria-labelledby="offline-bali-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Offline Level 3</p>
          <h2 id="offline-bali-title">Offline Bali</h2>
        </div>
        <span className={activated ? "status online" : "status offline"}>
          {activated ? "Available" : "Not activated"}
        </span>
      </div>
      {activated ? (
        <div className="offline-region-list">
          {manifest.regions.map((region) => (
            <article className="card" key={region.id}>
              {(() => {
                const pack = packs.find((item) => item.regionId === region.id);
                return (
                  <>
              <div className="card-copy">
                <p className="card-kicker">Downloadable map region</p>
                <h3>{region.name}</h3>
                <p>{Math.ceil(region.estimatedBytes / 1_048_576)} MB · map, GPS and onboard routing</p>
                {pack ? <p>{pack.status === "ready" ? "Ready offline" : `${Math.round(pack.progress * 100)}% · ${pack.status}`}</p> : null}
              </div>
              <div className="trip-actions">
                {pack?.status === "ready" ? (
                  <>
                    <button type="button" onClick={() => onOpen(region.id)}>Open map</button>
                    <button type="button" onClick={() => onRemove(region.id)}>Remove</button>
                  </>
                ) : (
                  <button className="save-button" type="button" disabled={!online} onClick={() => onDownload(region)}>
                    {online ? "Download" : "Internet required"}
                  </button>
                )}
              </div>
                  </>
                );
              })()}
            </article>
          ))}
        </div>
      ) : (
        <>
          <p>
            Saved places, routes, events and your Trip stay available offline. Full map tiles,
            GPS on a downloaded map and turn-by-turn routing are not active yet.
          </p>
          <ul>
            <li>No map provider has passed privacy, cost and Bali device acceptance.</li>
            <li>No map region can be downloaded until all three Level 3 capabilities are verified.</li>
            <li>Google Maps remains an online external handoff and is never labelled offline navigation.</li>
          </ul>
          {manifest?.reason ? <p className="truth-note">{manifest.reason}</p> : null}
        </>
      )}
    </section>
  );
}

function AdaptiveCompanion({
  suggestions,
  districts,
  area,
  online,
  onAreaChange,
  onOpen,
  onAddToToday,
  onGoNow,
}: {
  suggestions: CompanionSuggestion[];
  districts: Array<{ slug: string; name: string }>;
  area: string | null;
  online: boolean;
  onAreaChange: (area: string | null) => void;
  onOpen: (venueId: string) => void;
  onAddToToday: (venueId: string) => void;
  onGoNow: (venueId: string) => void;
}) {
  return (
    <section className="companion" aria-labelledby="companion-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Adaptive companion</p>
          <h2 id="companion-title">Your next move</h2>
        </div>
      </div>
      <label>
        Area context
        <select value={area ?? ""} onChange={(event) => onAreaChange(event.target.value || null)}>
          <option value="">Any published area</option>
          {districts.map((district) => (
            <option value={district.slug} key={district.slug}>{district.name}</option>
          ))}
        </select>
      </label>
      <p className="truth-note">
        {online
          ? "Suggestions use your Today, Trip, saved places and selected area. Live opening and traffic are never inferred."
          : "Using cached guide context. Current opening, traffic and travel time require internet."}
      </p>
      {suggestions.length ? (
        <div className="companion-results" aria-live="polite">
          {suggestions.map((suggestion) => (
            <article className="card" key={suggestion.venueId}>
              <div className="card-copy">
                <p className="card-kicker">Context match</p>
                <h3>{suggestion.name}</h3>
                <p>{suggestion.reason}</p>
                <p className="truth-note">{suggestion.caveat}</p>
              </div>
              <div className="card-actions">
                <button type="button" className="detail-button" onClick={() => onOpen(suggestion.venueId)}>Details</button>
                <button type="button" className="save-button" onClick={() => onAddToToday(suggestion.venueId)}>Add to Today</button>
                <button type="button" className="save-button" disabled={!online} onClick={() => onGoNow(suggestion.venueId)}>
                  {online ? "Go now" : "Internet required"}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : <p>No unvisited published candidates are available for this context.</p>}
    </section>
  );
}

function VenueDetail({
  snapshot,
  detail,
  detailLoading,
  detailUnavailable,
  online,
  saved,
  onBack,
  onOpenMap,
  onOpenOfficial,
  onShare,
  onToggle,
}: {
  snapshot: SavedVenueSnapshot;
  detail: LoadedVenueDetail | null;
  detailLoading: boolean;
  detailUnavailable: boolean;
  online: boolean;
  saved: boolean;
  onBack: () => void;
  onOpenMap: (url: string) => void;
  onOpenOfficial: (url: string) => void;
  onShare: () => void;
  onToggle: () => void;
}) {
  const { venue, updatedAt } = snapshot;
  const officialWebsiteUrl = detail?.venue.officialUrl ?? null;
  return (
    <article className="venue-detail" aria-labelledby="venue-detail-title">
      <button className="back-button" type="button" onClick={onBack}>← Back</button>
      <p className="eyebrow">{online ? "Public summary" : saved ? "Saved offline summary" : "Cached public summary"}</p>
      <h2 id="venue-detail-title">{venue.name}</h2>
      <p className="detail-meta">{venue.district} · {venue.category.replaceAll("_", " ")}</p>
      {venue.subarea ? <p><strong>Area</strong><br />{venue.subarea}</p> : null}
      {venue.bestFor ? <p><strong>Best for</strong><br />{venue.bestFor}</p> : null}
      {venue.isSponsored ? <p><span className="disclosure">Sponsored</span></p> : null}
      {detail ? (
        <section className="full-detail" aria-label="Verified venue details">
          {detail.venue.fullAddress ? <p><strong>Address</strong><br />{detail.venue.fullAddress}</p> : null}
          {detail.venue.priceLabel ? <p><strong>Price guide</strong><br />{detail.venue.priceLabel}</p> : null}
          {detail.venue.whatToOrder ? <p><strong>What to order</strong><br />{detail.venue.whatToOrder}</p> : null}
          {detail.venue.whyItsHere ? <p><strong>Why it’s here</strong><br />{detail.venue.whyItsHere}</p> : null}
          {detail.venue.notFor ? <p><strong>Not for</strong><br />{detail.venue.notFor}</p> : null}
          {detail.venue.practicalTags.length ? (
            <ul className="detail-tags" aria-label="Practical tags">
              {detail.venue.practicalTags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          ) : null}
        </section>
      ) : null}
      <div className="detail-state" aria-live="polite">
        {detailLoading ? <p>Refreshing verified venue details…</p> : null}
        {!detail && !detailLoading && !online ? (
          <p>The venue&apos;s Google Maps handoff is not cached. Connect to load the verified venue detail.</p>
        ) : null}
        {!detail && !detailLoading && online && detailUnavailable ? (
          <p>Exact venue details are unavailable right now. The compact cached summary remains available.</p>
        ) : null}
        {detail && detailUnavailable ? (
          <p>The verified detail could not refresh. Its timestamped cached copy remains available.</p>
        ) : null}
      </div>
      <p className="cache-note">
        Cached public data from {formatUpdatedAt(detail?.updatedAt ?? updatedAt)}. This detail does not claim live opening,
        availability, travel time, or fulfilment.
      </p>
      <div className="detail-actions">
        <button className="save-button" type="button" aria-pressed={saved} onClick={onToggle}>
          {saved ? "Remove saved place" : "Save for offline"}
        </button>
        <button className="detail-button" type="button" onClick={onShare}>Share place</button>
        {detail ? (
          <button className="detail-button" type="button" onClick={() => onOpenMap(detail.venue.mapsUrl)}>
            Open this venue in Google Maps
          </button>
        ) : null}
        {officialWebsiteUrl ? (
          <button className="detail-button" type="button" onClick={() => onOpenOfficial(officialWebsiteUrl)}>
            Official website
          </button>
        ) : null}
      </div>
    </article>
  );
}

function RouteDetail({
  slug,
  summary,
  detail,
  loading,
  unavailable,
  online,
  saved,
  usingSavedSnapshot,
  onBack,
  onOpenVenue,
  onShare,
  onToggle,
}: {
  slug: string;
  summary: MobileRouteSummary | null;
  detail: LoadedRouteDetail | null;
  loading: boolean;
  unavailable: boolean;
  online: boolean;
  saved: boolean;
  usingSavedSnapshot: boolean;
  onBack: () => void;
  onOpenVenue: (venueId: string) => void;
  onShare: () => void;
  onToggle: () => void;
}) {
  const route = detail?.route ?? summary;
  return (
    <article className="venue-detail" aria-labelledby="route-detail-title">
      <button className="back-button" type="button" onClick={onBack}>← Back</button>
      <p className="eyebrow">
        {usingSavedSnapshot ? online ? "Saved route snapshot" : "Saved offline route" : "Curated route"}
      </p>
      <h2 id="route-detail-title">{route?.title ?? "Other Bali route"}</h2>
      {route?.subtitle ? <p className="detail-meta">{route.subtitle}</p> : null}
      {detail ? (
        <ol className="cards route-cards" aria-label={`${detail.route.title} stops`}>
          {detail.route.stops.map((stop) => (
            <li className="card" key={`${stop.position}-${stop.venue.id}`}>
              <div className="card-copy">
                <p className="card-kicker">Stop {stop.position}</p>
                <h3>{stop.venue.name}</h3>
                <p>{stop.venue.bestFor ?? stop.venue.subarea ?? "Open the place for its public summary."}</p>
              </div>
              <button className="detail-button" type="button" onClick={() => onOpenVenue(stop.venue.id)}>
                Open place
              </button>
            </li>
          ))}
        </ol>
      ) : null}
      <div className="detail-state" aria-live="polite">
        {loading ? <p>Loading verified route stops…</p> : null}
        {!detail && !loading && !online ? (
          <p>
            {saved
              ? "This route was saved before its ordered stops were downloaded. Connect to load and store them for offline use."
              : "Connect to load this route’s latest published public stops."}
          </p>
        ) : null}
        {!detail && !loading && online && unavailable ? <p>This route is unavailable right now.</p> : null}
        {detail && unavailable ? (
          <p>
            {usingSavedSnapshot
              ? "The route could not refresh. Its timestamped saved copy remains available."
              : "The route could not refresh. The timestamped loaded copy remains on screen."}
          </p>
        ) : null}
      </div>
      {detail ? (
        <p className="cache-note">
          {usingSavedSnapshot ? "Saved public route snapshot" : "Published route data"} from {formatUpdatedAt(detail.updatedAt)}.
          {" "}This is a timestamped copy; travel time, traffic and turn-by-turn navigation are not claimed.
        </p>
      ) : null}
      <div className="detail-actions">
        <button className="save-button" type="button" aria-pressed={saved} onClick={onToggle}>
          {saved ? "Remove saved route" : detail ? "Save route for offline" : "Save route reference"}
        </button>
        <button className="detail-button" type="button" onClick={onShare}>Share route</button>
      </div>
      <span className="sr-only">Route reference: {slug}</span>
    </article>
  );
}

export default function App() {
  const [storageReady, setStorageReady] = useState(false);
  const [storageReadFailed, setStorageReadFailed] = useState(false);
  const [storageRetryNonce, setStorageRetryNonce] = useState(0);
  const [bootstrap, setBootstrap] = useState<MobileBootstrapPayload | null>(null);
  const [surface, setSurface] = useState<MobileSurface>(DEFAULT_NAVIGATION_STATE.surface);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [initialScrollY, setInitialScrollY] = useState(0);
  const [savedVenueIds, setSavedVenueIds] = useState<string[]>([]);
  const [savedRouteIds, setSavedRouteIds] = useState<string[]>([]);
  const [savedVenueSnapshots, setSavedVenueSnapshots] = useState<SavedVenueSnapshot[]>([]);
  const [savedRouteSnapshots, setSavedRouteSnapshots] = useState<SavedRouteSnapshot[]>([]);
  const [todayVenueIds, setTodayVenueIds] = useState<string[]>([]);
  const [todayVenueSnapshots, setTodayVenueSnapshots] = useState<SavedVenueSnapshot[]>([]);
  const [todayEventIds, setTodayEventIds] = useState<string[]>([]);
  const [todayEventOccurrences, setTodayEventOccurrences] = useState<MobileEventOccurrence[]>([]);
  const [events, setEvents] = useState<MobileEventOccurrence[]>([]);
  const [feedCards, setFeedCards] = useState<MobileFeedCard[]>([]);
  const [eventsUpdatedAt, setEventsUpdatedAt] = useState<string | null>(null);
  const [offlineBaliManifest, setOfflineBaliManifest] = useState<OfflineBaliManifest | null>(null);
  const [offlinePacks, setOfflinePacks] = useState<OfflinePackState[]>([]);
  const [navigationSession, setNavigationSession] = useState<NavigationSession | null>(null);
  const navigationSessionRef = useRef<NavigationSession | null>(null);
  const feedResumeRef = useRef<FeedResumeSnapshot | null>(null);
  const feedSessionIdRef = useRef(crypto.randomUUID());
  const [companionArea, setCompanionArea] = useState<string | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripDayIndex, setTripDayIndex] = useState(0);
  const [tripTemplateLoading, setTripTemplateLoading] = useState<number | null>(null);
  const [clock, setClock] = useState(() => new Date());
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [online, setOnline] = useState(() => typeof navigator === "undefined" || navigator.onLine);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshAttempted, setRefreshAttempted] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [syncFailed, setSyncFailed] = useState(false);
  const [externalOpenFailed, setExternalOpenFailed] = useState(false);
  const [shareFailed, setShareFailed] = useState(false);
  const [deepLinkFailed, setDeepLinkFailed] = useState(false);
  const [storageWriteFailed, setStorageWriteFailed] = useState(false);
  const [privacyDeleteConfirming, setPrivacyDeleteConfirming] = useState(false);
  const [privacyDeletePending, setPrivacyDeletePending] = useState(false);
  const [privacyDeleteError, setPrivacyDeleteError] = useState<string | null>(null);
  const [
    privacyDeletionQuarantinePhase,
    setPrivacyDeletionQuarantinePhase,
  ] = useState<PrivacyDeletionQuarantinePhase | null>(null);
  const [guestReference, setGuestReference] = useState<string | null>(null);
  const [guestReferenceUnavailable, setGuestReferenceUnavailable] = useState(false);
  const [pendingDeepLink, setPendingDeepLink] = useState<MobileDeepLinkTarget | null>(null);
  const [loadedVenueDetail, setLoadedVenueDetail] = useState<LoadedVenueDetail | null>(null);
  const [detailLoadingVenueId, setDetailLoadingVenueId] = useState<string | null>(null);
  const [detailFailureVenueId, setDetailFailureVenueId] = useState<string | null>(null);
  const [loadedRouteDetail, setLoadedRouteDetail] = useState<LoadedRouteDetail | null>(null);
  const [routeLoadingId, setRouteLoadingId] = useState<string | null>(null);
  const [routeFailureId, setRouteFailureId] = useState<string | null>(null);
  const [discoveryIndex, setDiscoveryIndex] = useState(0);
  const [selectionNotice, setSelectionNotice] = useState<string | null>(null);
  const restoredScroll = useRef(false);
  const storageMutationActive = useRef(false);
  const persistedVenueState = useRef<PersistedVenueState>({ ids: [], snapshots: [] });
  const persistedRouteState = useRef<PersistedRouteState>({ ids: [], snapshots: [] });
  const venuePersistenceQueue = useRef<Promise<void>>(Promise.resolve());
  const routePersistenceQueue = useRef<Promise<void>>(Promise.resolve());
  const tripRef = useRef<Trip | null>(null);
  const pendingSyncRef = useRef<SyncMutation[]>([]);
  const syncActive = useRef(false);
  const syncAbortController = useRef<AbortController | null>(null);
  const privacyDeletionActive = useRef(false);
  const privacyDeletionQuarantineRef = useRef<PrivacyDeletionQuarantinePhase | null>(null);
  const [personalWriteBarrier] = useState(() => new PersonalWriteBarrier());
  const storageReadyRef = useRef(storageReady);
  const navigationSnapshotRef = useRef<MobileNavigationState>({
    surface,
    selectedVenueId,
    selectedRouteId,
    scrollY: 0,
    discoveryIndex: 0,
  });

  useLayoutEffect(() => {
    storageReadyRef.current = storageReady;
    navigationSnapshotRef.current = {
      ...navigationSnapshotRef.current,
      surface,
      selectedVenueId,
      selectedRouteId,
      discoveryIndex,
    };
  }, [discoveryIndex, selectedRouteId, selectedVenueId, storageReady, surface]);

  const enqueueVenueState = useCallback((
    transform: (current: PersistedVenueState) => PersistedVenueState,
  ): Promise<boolean> => {
    const tracked = personalWriteBarrier.run(async () => {
      const operation = venuePersistenceQueue.current.then(async () => {
        const next = transform(persistedVenueState.current);
        await writeSavedVenueState(next.ids, next.snapshots);
        persistedVenueState.current = next;
        setSavedVenueIds(next.ids);
        setSavedVenueSnapshots(next.snapshots);
      });
      venuePersistenceQueue.current = operation.catch(() => {});
      await operation;
    });
    if (!tracked) return Promise.resolve(false);
    return tracked.then(() => true).catch(() => {
      setStorageWriteFailed(true);
      return false;
    });
  }, [personalWriteBarrier]);

  const enqueueRouteState = useCallback((
    transform: (current: PersistedRouteState) => PersistedRouteState,
  ): Promise<boolean> => {
    const tracked = personalWriteBarrier.run(async () => {
      const operation = routePersistenceQueue.current.then(async () => {
        const next = transform(persistedRouteState.current);
        await writeSavedRouteState(next.ids, next.snapshots);
        persistedRouteState.current = next;
        setSavedRouteIds(next.ids);
        setSavedRouteSnapshots(next.snapshots);
      });
      routePersistenceQueue.current = operation.catch(() => {});
      await operation;
    });
    if (!tracked) return Promise.resolve(false);
    return tracked.then(() => true).catch(() => {
      setStorageWriteFailed(true);
      return false;
    });
  }, [personalWriteBarrier]);

  const queueMutation = useCallback(async (
    mutation: Omit<SyncMutation, "idempotencyKey" | "createdAt" | "baseVersion">,
  ) => {
    if (privacyDeletionActive.current) {
      setSelectionNotice("Finish the pending privacy cleanup before saving new personal changes.");
      return;
    }
    const tracked = personalWriteBarrier.run(async () => {
      const next: SyncMutation = {
        ...mutation,
        idempotencyKey: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        baseVersion: null,
      };
      const pending = enqueuePendingSyncMutation(pendingSyncRef.current, next);
      pendingSyncRef.current = pending;
      setPendingSyncCount(pending.length);
      try {
        await writePendingSync(pending);
      } catch {
        setStorageWriteFailed(true);
      }
    });
    if (tracked) await tracked;
  }, [personalWriteBarrier]);

  const trackPersonalStorageWrite = useCallback((
    operation: () => Promise<void>,
  ): Promise<void> => {
    return personalWriteBarrier.run(async () => {
      await operation();
    }) ?? Promise.resolve();
  }, [personalWriteBarrier]);

  useEffect(() => {
    let active = true;
    void hydrateMobileStorage()
      .then((state) => {
        if (!active) return;
        const quarantine = state.privacyDeletionQuarantine;
        if (quarantine) {
          privacyDeletionQuarantineRef.current = quarantine;
          setPrivacyDeletionQuarantinePhase(quarantine);
          privacyDeletionActive.current = true;
          storageMutationActive.current = true;
          personalWriteBarrier.block();
          setPrivacyDeleteConfirming(true);
          setPrivacyDeleteError(quarantine === "server_confirmed"
            ? "Synced data was deleted, but device cleanup was interrupted. Personal changes remain paused; tap Retry cleanup."
            : "A previous deletion was interrupted. Sync and personal changes remain paused; reconnect and tap Retry cleanup.");
        } else {
          privacyDeletionQuarantineRef.current = null;
          setPrivacyDeletionQuarantinePhase(null);
        }
        setBootstrap(state.bootstrap);
        setSavedVenueIds(state.savedVenueIds);
        setSavedRouteIds(state.savedRouteIds);
        setSavedVenueSnapshots(state.savedVenueSnapshots);
        setSavedRouteSnapshots(state.savedRouteSnapshots);
        setTodayVenueIds(state.todayVenueIds);
        setTodayVenueSnapshots(state.todayVenueSnapshots);
        setTodayEventIds(state.todayEventIds);
        setTodayEventOccurrences(state.todayEventOccurrences);
        setEvents(state.eventsSnapshot?.events ?? []);
        setEventsUpdatedAt(state.eventsSnapshot?.updatedAt ?? null);
        tripRef.current = state.trip;
        setTrip(state.trip);
        setOfflinePacks(state.offlinePacks);
        if (defaultOfflineMapRuntime.list) {
          const runtime = defaultOfflineMapRuntime as ListableOfflineMapRuntime;
          void reconcileOfflinePackStates({
            runtime,
            packs: state.offlinePacks,
            publish: setOfflinePacks,
            persist: writeOfflinePackStates,
          }).catch(() => setStorageWriteFailed(true));
        }
        setNavigationSession(state.navigationSession);
        navigationSessionRef.current = state.navigationSession;
        feedResumeRef.current = state.feedResume;
        if (state.feedResume) feedSessionIdRef.current = state.feedResume.sessionId;
        pendingSyncRef.current = state.pendingSync;
        setPendingSyncCount(state.pendingSync.length);
        persistedVenueState.current = {
          ids: state.savedVenueIds,
          snapshots: state.savedVenueSnapshots,
        };
        persistedRouteState.current = {
          ids: state.savedRouteIds,
          snapshots: state.savedRouteSnapshots,
        };
        const navigation = quarantine
          ? { ...DEFAULT_NAVIGATION_STATE, surface: "saved" as const }
          : state.navigation;
        setSurface(navigation.surface);
        setSelectedVenueId(navigation.selectedVenueId);
        setSelectedRouteId(navigation.selectedRouteId);
        setInitialScrollY(navigation.scrollY);
        setDiscoveryIndex(navigation.discoveryIndex ?? 0);
        setCompanionArea(navigation.companionArea ?? null);
        navigationSnapshotRef.current = navigation;
        setStorageReady(true);
      })
      .catch(() => {
        if (active) setStorageReadFailed(true);
      });
    return () => {
      active = false;
    };
  }, [personalWriteBarrier, storageRetryNonce]);

  useEffect(() => {
    if (!storageReady || privacyDeletionQuarantinePhase) return;
    let active = true;
    void getOrCreateGuestIdentity()
      .then((identity) => {
        if (active) {
          setGuestReference(identity);
          setGuestReferenceUnavailable(false);
        }
      })
      .catch(() => {
        if (active) setGuestReferenceUnavailable(true);
      });
    return () => {
      active = false;
    };
  }, [privacyDeletionQuarantinePhase, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    let disposed = false;
    let handle: Awaited<ReturnType<typeof startAppStateMonitoring>> | null = null;
    void startAppStateMonitoring((active) => {
      if (disposed) return;
      const current = navigationSessionRef.current;
      if (!current) return;
      const nextState = active && current.state === "away"
        ? "returned"
        : !active && current.state === "handoff_pending"
          ? "away"
          : null;
      if (!nextState) return;
      try {
        const next = transitionNavigationSession(current, nextState);
        navigationSessionRef.current = next;
        setNavigationSession(next);
        void trackPersonalStorageWrite(() => writeNavigationSession(next))
          .catch(() => setStorageWriteFailed(true));
      } catch {
        // A stale lifecycle callback must not corrupt a terminal navigation session.
      }
    }).then((next) => {
      if (disposed && next) void next.remove();
      else handle = next;
    }).catch(() => {});
    return () => {
      disposed = true;
      if (handle) void handle.remove();
    };
  }, [storageReady, trackPersonalStorageWrite]);

  useEffect(() => {
    if (
      !storageReady
      || !online
      || privacyDeletionActive.current
      || syncActive.current
      || !pendingSyncRef.current.length
    ) return;
    syncActive.current = true;
    setSyncFailed(false);
    const controller = new AbortController();
    syncAbortController.current = controller;
    void (async () => {
      try {
        while (!controller.signal.aborted && pendingSyncRef.current.length > 0) {
          const flushingKeys = new Set(
            pendingSyncRef.current.map((mutation) => mutation.idempotencyKey),
          );
          const result = await flushPendingSyncQueue(
            pendingSyncRef.current,
            (mutation) => pushSyncMutation(mutation, controller.signal),
            async (remaining) => {
              if (privacyDeletionActive.current || controller.signal.aborted) return;
              const appended = pendingSyncRef.current.filter(
                (mutation) => !flushingKeys.has(mutation.idempotencyKey),
              );
              const nextPending = [...remaining, ...appended];
              pendingSyncRef.current = nextPending;
              setPendingSyncCount(nextPending.length);
              await trackPersonalStorageWrite(() => writePendingSync(nextPending));
            },
          );
          if (result.conflict || result.appliedCount === 0) {
            setSyncFailed(true);
            break;
          }
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setSyncFailed(true);
        }
      } finally {
        syncActive.current = false;
        if (syncAbortController.current === controller) syncAbortController.current = null;
      }
    })();
    return () => controller.abort();
  }, [
    online,
    pendingSyncCount,
    privacyDeletePending,
    storageReady,
    trackPersonalStorageWrite,
  ]);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setRefreshing(true);
    setRefreshFailed(false);
    try {
      const [next, feedResult, eventResult, offlineManifestResult] = await Promise.all([
        fetchBootstrap(signal),
        fetchCompleteDiscoveryFeed(signal).catch(() => null),
        fetchEvents(signal).catch(() => null),
        fetchOfflineBaliManifest(signal).catch(() => null),
      ]);
      setBootstrap(next);
      if (feedResult) setFeedCards(feedResult);
      void writeCachedBootstrap(next).catch(() => setStorageWriteFailed(true));
      if (eventResult) {
        setEvents(eventResult.events);
        setEventsUpdatedAt(eventResult.updatedAt);
        void writeEventsSnapshot(eventResult).catch(() => setStorageWriteFailed(true));
      }
      if (offlineManifestResult) setOfflineBaliManifest(offlineManifestResult);

      void enqueueVenueState((current) => {
        const savedIds = new Set(current.ids);
        const refreshed = new Map(current.snapshots.map((item) => [item.venue.id, item]));
        for (const venue of next.data.venues) {
          if (savedIds.has(venue.id)) {
            const previous = refreshed.get(venue.id);
            refreshed.set(venue.id, {
              venue,
              updatedAt: next.updatedAt,
              detail: previous?.detail?.slug === venue.slug ? previous.detail : null,
              detailUpdatedAt: previous?.detail?.slug === venue.slug ? previous.detailUpdatedAt : null,
            });
          }
        }
        for (const id of refreshed.keys()) {
          if (!savedIds.has(id)) refreshed.delete(id);
        }
        const snapshots = [...refreshed.values()];
        return { ids: current.ids, snapshots };
      });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setRefreshFailed(true);
    } finally {
      if (!signal?.aborted) {
        setRefreshing(false);
        setRefreshAttempted(true);
      }
    }
  }, [enqueueVenueState]);

  useEffect(() => {
    if (!storageReady) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => void refresh(controller.signal), 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [refresh, storageReady]);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!selectionNotice) return;
    const timer = window.setTimeout(() => setSelectionNotice(null), 6_000);
    return () => window.clearTimeout(timer);
  }, [selectionNotice]);

  const downloadOfflineRegion = useCallback(async (region: OfflineRegionManifest) => {
    try {
      const result = await downloadOfflineRegionIfAvailable({
        region,
        packs: offlinePacks,
        publish: setOfflinePacks,
        persist: async (packs) => {
          try {
            await writeOfflinePackStates(packs);
          } catch {
            setStorageWriteFailed(true);
            throw new Error("offline_pack_persist_failed");
          }
        },
      });
      if (result.outcome === "blocked") {
        setSelectionNotice("Offline maps are not available on this device yet.");
      } else if (result.outcome === "failed") {
        setSelectionNotice("The offline map download failed. Your existing offline data is unchanged.");
      } else {
        setSelectionNotice(`${region.name} is ready offline.`);
      }
    } catch {
      setSelectionNotice("The offline map state could not be saved on this device.");
    }
  }, [offlinePacks]);

  const removeOfflineRegion = useCallback(async (regionId: string) => {
    const result = await removeOfflineRegionSafely({
      runtime: defaultOfflineMapRuntime,
      regionId,
      packs: offlinePacks,
      publish: setOfflinePacks,
      persist: async (packs) => {
        try {
          await writeOfflinePackStates(packs);
        } catch {
          setStorageWriteFailed(true);
          throw new Error("offline_pack_persist_failed");
        }
      },
    });
    if (result.outcome === "failed") {
      setSelectionNotice("The offline map could not be removed from this device.");
    }
  }, [offlinePacks]);

  useEffect(() => {
    let disposed = false;
    let handle: Awaited<ReturnType<typeof startNetworkMonitoring>> | null = null;
    void startNetworkMonitoring((connected) => {
      if (disposed) return;
      setOnline((previous) => {
        if (connected && !previous && storageReady) void refresh();
        return connected;
      });
    }).then((next) => {
      if (disposed) void next.remove();
      else handle = next;
    }).catch(() => {
      // navigator.onLine remains the conservative initial fallback.
    });
    return () => {
      disposed = true;
      if (handle) void handle.remove();
    };
  }, [refresh, storageReady]);

  const persistNavigation = useCallback(() => trackPersonalStorageWrite(
    () => writeNavigationState({
      ...navigationSnapshotRef.current,
      scrollY: Math.max(0, window.scrollY),
    }),
  ), [trackPersonalStorageWrite]);

  useEffect(() => {
    if (!storageReady) return;
    const onPageHide = () => void persistNavigation().catch(() => setStorageWriteFailed(true));
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        void persistNavigation().catch(() => setStorageWriteFailed(true));
      }
    };
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [persistNavigation, storageReady]);

  useEffect(() => {
    if (!storageReady || restoredScroll.current) return;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: initialScrollY, behavior: "auto" });
      restoredScroll.current = true;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [initialScrollY, storageReady]);

  const handleDeepLink = useCallback((url: string) => {
    const target = parseMobileDeepLink(url);
    if (!target) return;
    setDeepLinkFailed(false);
    setPendingDeepLink(target);
  }, []);

  const handleBackButton = useCallback(() => {
    if (!storageReadyRef.current) {
      void exitMobileApp().catch(() => {});
      return;
    }

    const navigation = navigationSnapshotRef.current;
    if (navigation.selectedVenueId || navigation.selectedRouteId) {
      const rootNavigation = {
        ...navigation,
        selectedVenueId: null,
        selectedRouteId: null,
        scrollY: 0,
      };
      navigationSnapshotRef.current = rootNavigation;
      setSelectedVenueId(null);
      setSelectedRouteId(null);
      window.scrollTo({ top: 0, behavior: "auto" });
      void trackPersonalStorageWrite(() => writeNavigationState(rootNavigation))
        .catch(() => setStorageWriteFailed(true));
      return;
    }

    void persistNavigation()
      .catch(() => setStorageWriteFailed(true))
      .finally(() => void exitMobileApp().catch(() => {}));
  }, [persistNavigation, trackPersonalStorageWrite]);

  useEffect(() => {
    let disposed = false;
    let handle: Awaited<ReturnType<typeof startBackButtonMonitoring>> = null;
    void startBackButtonMonitoring(() => {
      if (!disposed) handleBackButton();
    }).then((next) => {
      if (disposed && next) void next.remove();
      else handle = next;
    }).catch(() => {
      // iOS and web have no Android hardware-back event.
    });
    return () => {
      disposed = true;
      if (handle) void handle.remove();
    };
  }, [handleBackButton]);

  useEffect(() => {
    if (!storageReady) return;
    let disposed = false;
    let handle: Awaited<ReturnType<typeof startDeepLinkMonitoring>> = null;
    void startDeepLinkMonitoring(handleDeepLink).then((next) => {
      if (disposed && next) void next.remove();
      else handle = next;
    }).catch(() => {
      // Production universal links remain blocked on entitlement/AASA evidence.
    });
    return () => {
      disposed = true;
      if (handle) void handle.remove();
    };
  }, [handleDeepLink, storageReady]);

  const savedVenueSet = useMemo(() => new Set(savedVenueIds), [savedVenueIds]);
  const savedRouteSet = useMemo(() => new Set(savedRouteIds), [savedRouteIds]);
  const venues = useMemo(() => bootstrap?.data.venues ?? [], [bootstrap]);
  const routes = useMemo(() => bootstrap?.data.routes ?? [], [bootstrap]);
  const routeSnapshotsById = useMemo(
    () => new Map(savedRouteSnapshots.map((snapshot) => [snapshot.route.id, snapshot])),
    [savedRouteSnapshots],
  );
  const venueSnapshotsById = useMemo(() => {
    const result = new Map(todayVenueSnapshots.map((item) => [item.venue.id, item]));
    for (const item of savedVenueSnapshots) result.set(item.venue.id, item);
    const routeDetails = [
      ...savedRouteSnapshots,
      ...(loadedRouteDetail ? [loadedRouteDetail] : []),
    ];
    for (const routeSnapshot of routeDetails) {
      for (const stop of routeSnapshot.route.stops) {
        if (result.has(stop.venue.id)) continue;
        result.set(stop.venue.id, {
          venue: stop.venue,
          updatedAt: routeSnapshot.updatedAt,
          detail: null,
          detailUpdatedAt: null,
        });
      }
    }
    if (bootstrap) {
      for (const venue of venues) {
        const previous = result.get(venue.id);
        result.set(venue.id, {
          venue,
          updatedAt: bootstrap.updatedAt,
          detail: previous?.detail?.slug === venue.slug ? previous.detail : null,
          detailUpdatedAt: previous?.detail?.slug === venue.slug ? previous.detailUpdatedAt : null,
        });
      }
    }
    return result;
  }, [bootstrap, loadedRouteDetail, savedRouteSnapshots, savedVenueSnapshots, todayVenueSnapshots, venues]);

  const routeSummariesById = useMemo(() => {
    const result = new Map<string, MobileRouteSummary>();
    for (const snapshot of savedRouteSnapshots) result.set(snapshot.route.id, snapshot.route);
    for (const route of routes) result.set(route.id, route);
    return result;
  }, [routes, savedRouteSnapshots]);
  const activeEvents = useMemo(
    () => events.filter((event) => isEventUsable(event, clock)),
    [clock, events],
  );
  const activeTodayEvents = useMemo(
    () => {
      const reconciled = reconcileTodayEventOccurrences(todayEventOccurrences, events);
      return todayEventIds
      .map((id) => (
        reconciled.find((event) => event.id === id)
        ?? events.find((event) => event.id === id)
      ))
      .filter((event): event is MobileEventOccurrence => Boolean(event))
      .filter((event) => isEventUsable(event, clock));
    },
    [clock, events, todayEventIds, todayEventOccurrences],
  );
  const companionSuggestions = useMemo(() => {
    const tripStops = trip?.days.flatMap((day) => day.stops) ?? [];
    return buildCompanionSuggestions(venues, {
      manualArea: companionArea,
      online,
      now: clock.toISOString(),
      todayVenueIds,
      tripVenueIds: tripStops
        .filter((stop) => stop.entityType === "place" && stop.state !== "visited")
        .map((stop) => stop.entityId),
      visitedVenueIds: tripStops
        .filter((stop) => stop.entityType === "place" && stop.state === "visited")
        .map((stop) => stop.entityId),
      savedVenueIds,
    });
  }, [clock, companionArea, online, savedVenueIds, todayVenueIds, trip, venues]);

  useEffect(() => {
    if (!pendingDeepLink) return;
    const timer = window.setTimeout(() => {
      if (pendingDeepLink.kind === "route") {
        setSurface("routes");
        setSelectedVenueId(null);
        setSelectedRouteId(pendingDeepLink.slug);
        setPendingDeepLink(null);
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }
      const venue = [...venueSnapshotsById.values()].find((item) => item.venue.slug === pendingDeepLink.slug);
      if (venue) {
        setSurface("places");
        setSelectedRouteId(null);
        setSelectedVenueId(venue.venue.id);
        setPendingDeepLink(null);
        window.scrollTo({ top: 0, behavior: "auto" });
      } else if (!refreshing && (refreshAttempted || !online)) {
        setDeepLinkFailed(true);
        setPendingDeepLink(null);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [online, pendingDeepLink, refreshAttempted, refreshing, venueSnapshotsById]);

  const sharedCandidateUniverse = useMemo(
    () => buildSharedCandidateUniverse(
      feedCards.length ? feedCards.map((card) => card.venue) : venues,
    ),
    [feedCards, venues],
  );

  useEffect(() => {
    if (!storageReady || !feedResumeRef.current || !sharedCandidateUniverse.length) return;
    const resolution = resolveFeedResumeSnapshot(feedResumeRef.current, {
      expectedVersion: MOBILE_FEED_POLICY_VERSION,
      candidateIds: sharedCandidateUniverse.map((venue) => venue.id),
    });
    if (resolution.status === "restored") {
      setDiscoveryIndex(resolution.snapshot.position);
      return;
    }
    feedResumeRef.current = null;
    setDiscoveryIndex(0);
    setSelectionNotice(
      resolution.reason === "version_mismatch"
        ? "Discover changed since your last visit, so a fresh feed was opened."
        : "Your previous Discover card is no longer published, so a fresh feed was opened.",
    );
  }, [sharedCandidateUniverse, storageReady]);
  const visibleVenueSnapshots = surface === "saved"
    ? savedVenueIds.map((id) => venueSnapshotsById.get(id)).filter((item): item is SavedVenueSnapshot => Boolean(item))
    : surface === "today"
      ? todayVenueIds.map((id) => (
          todayVenueSnapshots.find((item) => item.venue.id === id) ?? venueSnapshotsById.get(id)
        )).filter((item): item is SavedVenueSnapshot => Boolean(item))
    : sharedCandidateUniverse.map((venue) => ({
      venue,
      updatedAt: bootstrap?.updatedAt ?? new Date(0).toISOString(),
      detail: null,
      detailUpdatedAt: null,
    }));
  const visibleRoutes = surface === "saved"
    ? savedRouteIds
        .map((id) => routeSummariesById.get(id))
        .filter((route): route is MobileRouteSummary => Boolean(route))
    : routes;
  const selectedVenue = selectedVenueId ? venueSnapshotsById.get(selectedVenueId) ?? null : null;
  const selectedVenueSlug = selectedVenue?.venue.slug ?? null;
  const selectedVenueDetail = loadedVenueDetail?.venue.id === selectedVenueId
    && loadedVenueDetail.venue.slug === selectedVenueSlug
    ? loadedVenueDetail
    : selectedVenue?.detail && selectedVenue.detailUpdatedAt
      ? { venue: selectedVenue.detail, updatedAt: selectedVenue.detailUpdatedAt }
      : null;
  const selectedRouteSummary = selectedRouteId
    ? routeSummariesById.get(selectedRouteId) ?? null
    : null;
  const selectedSavedRouteSnapshot = selectedRouteId
    ? routeSnapshotsById.get(selectedRouteId) ?? null
    : null;
  const selectedRouteDetail = loadedRouteDetail?.route.slug === selectedRouteId
    ? loadedRouteDetail
    : selectedSavedRouteSnapshot;
  const usingSavedRouteSnapshot = Boolean(
    selectedSavedRouteSnapshot
    && loadedRouteDetail?.route.slug !== selectedRouteId,
  );

  useEffect(() => {
    if (!selectedVenueId || !selectedVenueSlug || !online) return;
    const requestVenueId = selectedVenueId;
    const requestVenueSlug = selectedVenueSlug;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setDetailLoadingVenueId(requestVenueId);
      setDetailFailureVenueId((current) => current === requestVenueId ? null : current);
      try {
        const response = await fetchVenueDetail(requestVenueSlug, controller.signal);
        const detail = response.data.venue;
        if (detail.id !== requestVenueId || detail.slug !== requestVenueSlug) {
          throw new Error("Venue detail identity does not match the selected venue");
        }
        const loaded = { venue: detail, updatedAt: response.updatedAt };
        setLoadedVenueDetail(loaded);
        if (savedVenueSet.has(requestVenueId)) {
          void enqueueVenueState((current) => {
            if (!current.ids.includes(requestVenueId)) return current;
            const snapshots = current.snapshots.map((item) => item.venue.id === requestVenueId
              ? { ...item, detail, detailUpdatedAt: response.updatedAt }
              : item);
            return { ids: current.ids, snapshots };
          });
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setDetailFailureVenueId(requestVenueId);
        }
      } finally {
        setDetailLoadingVenueId((current) => current === requestVenueId ? null : current);
      }
    }, 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [enqueueVenueState, online, savedVenueSet, selectedVenueId, selectedVenueSlug]);

  useEffect(() => {
    if (!selectedRouteId || !online) return;
    const requestRouteId = selectedRouteId;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setRouteLoadingId(requestRouteId);
      setRouteFailureId((current) => current === requestRouteId ? null : current);
      try {
        const response = await fetchRouteDetail(requestRouteId, controller.signal);
        if (response.data.route.slug !== requestRouteId) {
          throw new Error("Route detail identity does not match the selected route");
        }
        const loaded = { route: response.data.route, updatedAt: response.updatedAt };
        setLoadedRouteDetail(loaded);
        if (savedRouteSet.has(requestRouteId)) {
          void enqueueRouteState((current) => {
            if (!current.ids.includes(requestRouteId)) return current;
            const snapshots = [
              ...current.snapshots.filter((snapshot) => snapshot.route.id !== requestRouteId),
              loaded,
            ].slice(-MAX_SAVED_ROUTE_SNAPSHOTS);
            return { ids: current.ids, snapshots };
          });
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setRouteFailureId(requestRouteId);
        }
      } finally {
        setRouteLoadingId((current) => current === requestRouteId ? null : current);
      }
    }, 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [enqueueRouteState, online, savedRouteSet, selectedRouteId]);

  async function toggleVenue(snapshot: SavedVenueSnapshot) {
    if (privacyDeletionActive.current || storageMutationActive.current) return;
    storageMutationActive.current = true;
    setStorageWriteFailed(false);
    const id = snapshot.venue.id;
    const syncId = snapshot.venue.slug;
    const removing = savedVenueSet.has(id);
    try {
      const persisted = await enqueueVenueState((current) => {
        const removingCurrent = current.ids.includes(id);
        return {
          ids: removingCurrent ? current.ids.filter((item) => item !== id) : [...current.ids, id],
          snapshots: removingCurrent
            ? current.snapshots.filter((item) => item.venue.id !== id)
            : [...current.snapshots.filter((item) => item.venue.id !== id), snapshot],
        };
      });
      if (persisted) await queueMutation({
        entityType: "saved",
        entityId: syncId,
        operation: removing ? "remove" : "save",
        payload: { entityType: "place", entityId: syncId },
      });
    } finally {
      storageMutationActive.current = false;
    }
  }

  async function toggleRoute(id: string) {
    if (privacyDeletionActive.current || storageMutationActive.current) return;
    storageMutationActive.current = true;
    setStorageWriteFailed(false);
    const loadedSnapshot = loadedRouteDetail?.route.id === id ? loadedRouteDetail : null;
    try {
      await enqueueRouteState((current) => {
        const removing = current.ids.includes(id);
        return {
          ids: removing ? current.ids.filter((item) => item !== id) : [...current.ids, id],
          snapshots: removing
            ? current.snapshots.filter((snapshot) => snapshot.route.id !== id)
            : loadedSnapshot
              ? [...current.snapshots.filter((snapshot) => snapshot.route.id !== id), loadedSnapshot]
                  .slice(-MAX_SAVED_ROUTE_SNAPSHOTS)
              : current.snapshots,
        };
      });
    } finally {
      storageMutationActive.current = false;
    }
  }

  function chooseSurface(next: MobileSurface) {
    if (privacyDeletionActive.current) return;
    const navigation = {
      ...navigationSnapshotRef.current,
      surface: next,
      selectedVenueId: null,
      selectedRouteId: null,
      scrollY: 0,
    };
    navigationSnapshotRef.current = navigation;
    setSurface(next);
    setSelectedVenueId(null);
    setSelectedRouteId(null);
    window.scrollTo({ top: 0, behavior: "auto" });
    void trackPersonalStorageWrite(() => writeNavigationState(navigation))
      .catch(() => setStorageWriteFailed(true));
  }

  function openVenue(id: string) {
    if (privacyDeletionActive.current || !venueSnapshotsById.has(id)) return;
    const navigation = {
      ...navigationSnapshotRef.current,
      selectedVenueId: id,
      selectedRouteId: null,
      scrollY: 0,
    };
    navigationSnapshotRef.current = navigation;
    setSelectedRouteId(null);
    setSelectedVenueId(id);
    window.scrollTo({ top: 0, behavior: "auto" });
    void trackPersonalStorageWrite(() => writeNavigationState(navigation))
      .catch(() => setStorageWriteFailed(true));
  }

  function changeDiscoveryIndex(index: number) {
    if (privacyDeletionActive.current) return;
    const next = Math.min(
      Math.max(0, Math.trunc(index)),
      Math.max(0, sharedCandidateUniverse.length - 1),
    );
    setDiscoveryIndex(next);
    navigationSnapshotRef.current = { ...navigationSnapshotRef.current, discoveryIndex: next };
    const active = sharedCandidateUniverse[next];
    if (active) {
      const cursor = btoa(JSON.stringify({
        version: 1,
        position: next,
        entityId: active.id,
      })).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
      const resume: FeedResumeSnapshot = {
        sessionId: feedSessionIdRef.current,
        version: MOBILE_FEED_POLICY_VERSION,
        cursor,
        lastSeenEntityId: active.id,
        position: next,
        updatedAt: new Date().toISOString(),
      };
      feedResumeRef.current = resume;
      void trackPersonalStorageWrite(() => writeFeedResumeSnapshot(resume))
        .catch(() => setStorageWriteFailed(true));
    }
    void trackPersonalStorageWrite(() => writeNavigationState({
      ...navigationSnapshotRef.current,
      scrollY: Math.max(0, window.scrollY),
    })).catch(() => setStorageWriteFailed(true));
  }

  async function addToToday(snapshot: SavedVenueSnapshot) {
    if (privacyDeletionActive.current) {
      setSelectionNotice("Finish the pending privacy cleanup before changing Today.");
      return;
    }
    const tracked = personalWriteBarrier.run(async () => {
      setStorageWriteFailed(false);
      const ids = todayVenueIds.includes(snapshot.venue.id)
        ? todayVenueIds
        : [...todayVenueIds, snapshot.venue.id];
      const snapshots = [
        ...todayVenueSnapshots.filter((item) => item.venue.id !== snapshot.venue.id),
        snapshot,
      ];
      try {
        await writeTodayVenueState(ids, snapshots);
        if (privacyDeletionActive.current) return;
        setTodayVenueIds(ids);
        setTodayVenueSnapshots(snapshots);
        setSelectionNotice(`${snapshot.venue.name} was added to Today and is available offline on this device.`);
        await queueMutation({
          entityType: "trip_stop",
          entityId: snapshot.venue.slug,
          operation: "add_to_day",
          payload: { entityType: "place", day: "today" },
        });
      } catch {
        setStorageWriteFailed(true);
      }
    });
    if (tracked) await tracked;
  }

  async function persistTrip(
    update: Trip | ((current: Trip | null) => Trip | null),
  ) {
    if (privacyDeletionActive.current) {
      setSelectionNotice("Finish the pending privacy cleanup before changing Trip.");
      return false;
    }
    const next = typeof update === "function"
      ? update(tripRef.current)
      : update;
    if (!next) return false;
    tripRef.current = next;
    setTrip(next);
    setTripDayIndex((current) => Math.min(current, next.days.length - 1));
    const storageWrite = writeTrip(next);
    const syncWrite = queueMutation({
      entityType: "trip_stop",
      entityId: next.id,
      operation: "trip_replace",
      payload: { trip: next },
    });
    const tracked = personalWriteBarrier.run(async () => {
      setStorageWriteFailed(false);
      try {
        await Promise.all([storageWrite, syncWrite]);
        if (privacyDeletionActive.current) return false;
        return true;
      } catch {
        setStorageWriteFailed(true);
        return false;
      }
    });
    return tracked ? await tracked : false;
  }

  async function addToTrip(snapshot: SavedVenueSnapshot) {
    let selectedDayIndex = 0;
    if (await persistTrip((current) => {
      const base = current ?? createEmptyTrip(3);
      selectedDayIndex = Math.min(tripDayIndex, base.days.length - 1);
      return addTripStop(base, selectedDayIndex, "place", snapshot.venue.id);
    })) {
      setSelectionNotice(`${snapshot.venue.name} was added to Trip day ${selectedDayIndex + 1}.`);
    }
  }

  async function createTripFromPublishedRoutes(duration: 3 | 5 | 7 | 10) {
    if (!online || tripTemplateLoading !== null) {
      setSelectionNotice("Published trip templates require a connection.");
      return;
    }
    setTripTemplateLoading(duration);
    setSelectionNotice(null);
    try {
      const details = (await Promise.all(
        routes.slice(0, duration).map(async (route) => {
          try {
            return (await fetchRouteDetail(route.slug)).data.route;
          } catch {
            return null;
          }
        }),
      )).filter((route): route is MobileRouteDetail => Boolean(route));
      if (!details.length) {
        setSelectionNotice("No verified route templates are available right now. Nothing was created.");
        return;
      }
      const next = adaptReadyMadeRoutesToTrip(
        duration,
        new Date().toISOString().slice(0, 10),
        details,
      );
      if (await persistTrip(next)) {
        setSelectionNotice(
          `${duration}-day Trip created from ${details.length} published route${details.length === 1 ? "" : "s"}. Duplicate stops were removed.`,
        );
      }
    } finally {
      setTripTemplateLoading(null);
    }
  }

  async function addEventToToday(event: MobileEventOccurrence) {
    if (privacyDeletionActive.current) {
      setSelectionNotice("Finish the pending privacy cleanup before changing Today.");
      return;
    }
    const tracked = personalWriteBarrier.run(async () => {
      if (!isEventUsable(event)) {
        setSelectionNotice("This event is no longer active and was not added.");
        return;
      }
      const ids = todayEventIds.includes(event.id) ? todayEventIds : [...todayEventIds, event.id];
      const occurrences = [
        ...todayEventOccurrences.filter((item) => item.id !== event.id),
        event,
      ];
      try {
        await writeTodayEventState(ids, occurrences);
        if (privacyDeletionActive.current) return;
        setTodayEventIds(ids);
        setTodayEventOccurrences(occurrences);
        setSelectionNotice(`${event.title} was added to Today and cached on this device.`);
        await queueMutation({
          entityType: "trip_stop",
          entityId: event.id,
          operation: "add_to_day",
          payload: { entityType: "event_occurrence", day: "today" },
        });
      } catch {
        setStorageWriteFailed(true);
      }
    });
    if (tracked) await tracked;
  }

  async function addEventToTrip(event: MobileEventOccurrence) {
    if (!isEventUsable(event)) {
      setSelectionNotice("This event is no longer active and was not added.");
      return;
    }
    let selectedDayIndex = 0;
    if (await persistTrip((current) => {
      const base = current ?? createEmptyTrip(3);
      selectedDayIndex = Math.min(tripDayIndex, base.days.length - 1);
      return addTripStop(base, selectedDayIndex, "event_occurrence", event.id);
    })) {
      setSelectionNotice(`${event.title} was added to Trip day ${selectedDayIndex + 1}.`);
    }
  }

  async function goNow(snapshot: SavedVenueSnapshot) {
    setSelectionNotice(null);
    if (privacyDeletionActive.current) {
      setSelectionNotice("Finish the pending privacy cleanup before starting directions.");
      return;
    }
    if (!online) {
      setSelectionNotice("Go now requires internet in this Level 1 offline build.");
      return;
    }
    try {
      const cached = snapshot.detail?.mapsUrl ? snapshot.detail : null;
      const venue = cached ?? (await fetchVenueDetail(snapshot.venue.slug)).data.venue;
      const session = createNavigationSession({
        id: crypto.randomUUID(),
        targetType: "place",
        targetId: snapshot.venue.id,
        targetName: snapshot.venue.name,
        sourceSurface: surface,
        mode: "external_maps",
      });
      const initialWrite = personalWriteBarrier.run(async () => {
        await writeNavigationSession(session);
        if (privacyDeletionActive.current) return false;
        navigationSessionRef.current = session;
        setNavigationSession(session);
        return true;
      });
      if (!initialWrite || !await initialWrite) return;
      const opened = await openExternal(venue.mapsUrl, "google_maps");
      if (
        !opened
        && !privacyDeletionActive.current
        && navigationSessionRef.current?.id === session.id
      ) {
        const failed = transitionNavigationSession(session, "failed");
        const failedWrite = personalWriteBarrier.run(async () => {
          await writeNavigationSession(failed);
          if (privacyDeletionActive.current) return;
          navigationSessionRef.current = failed;
          setNavigationSession(failed);
        });
        if (failedWrite) await failedWrite;
      }
    } catch {
      setSelectionNotice("Exact directions are unavailable. No generic or unverified destination was opened.");
    }
  }

  function resolveTripStop(entityType: "place" | "event_occurrence", entityId: string): string {
    if (entityType === "place") {
      return venueSnapshotsById.get(entityId)?.venue.name ?? "Saved place unavailable";
    }
    const event = [...events, ...todayEventOccurrences].find((item) => item.id === entityId);
    if (!event) return "Event unavailable";
    return isEventUsable(event, clock) ? event.title : `${event.title} · expired`;
  }

  async function editTrip(transform: (current: Trip) => Trip) {
    await persistTrip((current) => current ? transform(current) : null);
  }

  function openRoute(id: string) {
    if (privacyDeletionActive.current) return;
    const navigation = {
      ...navigationSnapshotRef.current,
      selectedVenueId: null,
      selectedRouteId: id,
      scrollY: 0,
    };
    navigationSnapshotRef.current = navigation;
    setSelectedVenueId(null);
    setSelectedRouteId(id);
    window.scrollTo({ top: 0, behavior: "auto" });
    void trackPersonalStorageWrite(() => writeNavigationState(navigation))
      .catch(() => setStorageWriteFailed(true));
  }

  async function openExternal(url: string, kind: ExternalLinkKind, allowedHosts?: readonly string[]) {
    setExternalOpenFailed(false);
    const opened = await openControlledExternal(url, kind, {
      allowedHosts,
      beforeOpen: persistNavigation,
    });
    setExternalOpenFailed(!opened);
    return opened;
  }

  function changeCompanionArea(area: string | null) {
    if (privacyDeletionActive.current) return;
    setCompanionArea(area);
    navigationSnapshotRef.current = { ...navigationSnapshotRef.current, companionArea: area };
    void trackPersonalStorageWrite(() => writeNavigationState({
      ...navigationSnapshotRef.current,
      scrollY: Math.max(0, window.scrollY),
    })).catch(() => setStorageWriteFailed(true));
  }

  function completeNavigationSession() {
    if (privacyDeletionActive.current) return;
    const current = navigationSessionRef.current;
    if (!current || current.state !== "returned") return;
    const completed = transitionNavigationSession(current, "completed");
    const tracked = personalWriteBarrier.run(async () => {
      await writeNavigationSession(completed);
      if (privacyDeletionActive.current) return;
      navigationSessionRef.current = completed;
      setNavigationSession(completed);
    });
    if (tracked) void tracked.catch(() => setStorageWriteFailed(true));
  }

  async function shareTarget(target: MobileDeepLinkTarget, title: string) {
    setShareFailed(false);
    await persistNavigation();
    setShareFailed(!await shareMobileTarget(target, title));
  }

  async function copyGuestReference() {
    if (!guestReference) return;
    try {
      await copyTextToClipboard(guestReference);
      setSelectionNotice("Anonymous guest reference copied.");
    } catch {
      setSelectionNotice("This device could not copy the guest reference. You can select it manually.");
    }
  }

  function quarantinePersonalStateInMemory() {
    pendingSyncRef.current = [];
    setPendingSyncCount(0);
    setSyncFailed(false);
    persistedVenueState.current = { ids: [], snapshots: [] };
    persistedRouteState.current = { ids: [], snapshots: [] };
    navigationSessionRef.current = null;
    feedResumeRef.current = null;
    feedSessionIdRef.current = crypto.randomUUID();
    setSavedVenueIds([]);
    setSavedRouteIds([]);
    setSavedVenueSnapshots([]);
    setSavedRouteSnapshots([]);
    setTodayVenueIds([]);
    setTodayVenueSnapshots([]);
    setTodayEventIds([]);
    setTodayEventOccurrences([]);
    tripRef.current = null;
    setTrip(null);
    setTripDayIndex(0);
    setNavigationSession(null);
    setCompanionArea(null);
    setSelectedVenueId(null);
    setSelectedRouteId(null);
    setDiscoveryIndex(0);
    navigationSnapshotRef.current = {
      ...DEFAULT_NAVIGATION_STATE,
      surface: "saved",
    };
  }

  async function deleteSyncedAndLocalPersonalData() {
    if (privacyDeletePending) return;
    setPrivacyDeleteError(null);
    const existingQuarantine = privacyDeletionQuarantineRef.current;
    if (!online && existingQuarantine !== "server_confirmed") {
      setPrivacyDeleteError(privacyDeletionActive.current
        ? "Local privacy cleanup is still incomplete. Sync and personal changes remain paused; reconnect and retry."
        : "Connect to the internet to delete synced data. Nothing was deleted.");
      return;
    }

    const alreadyQuarantined = existingQuarantine !== null || privacyDeletionActive.current;
    const deletionWriteGeneration = personalWriteBarrier.block();
    privacyDeletionActive.current = true;
    storageMutationActive.current = true;
    syncAbortController.current?.abort();
    setPrivacyDeletePending(true);
    let serverDeletionConfirmed = existingQuarantine === "server_confirmed";
    let localCleanupConfirmed = false;
    let safeRollbackConfirmed = false;
    try {
      if (!existingQuarantine) {
        await writePrivacyDeletionQuarantine("pending_server");
        privacyDeletionQuarantineRef.current = "pending_server";
        setPrivacyDeletionQuarantinePhase("pending_server");
      }
      await personalWriteBarrier.waitForSettled();
      if (!serverDeletionConfirmed) {
        await requestSyncedDataDeletion();
        serverDeletionConfirmed = true;
        await writePrivacyDeletionQuarantine("server_confirmed");
        privacyDeletionQuarantineRef.current = "server_confirmed";
        setPrivacyDeletionQuarantinePhase("server_confirmed");
      }

      // The cloud deletion is now authoritative. Quarantine the pre-deletion
      // queue and its in-memory surfaces before any fallible device cleanup so
      // an error can never replay deleted state into the same guest scope.
      quarantinePersonalStateInMemory();

      await clearMobilePersonalData();
      quarantinePersonalStateInMemory();
      await deleteGuestIdentity();
      setGuestReference(null);
      const nextIdentity = await getOrCreateGuestIdentity();
      await clearPrivacyDeletionQuarantine();
      privacyDeletionQuarantineRef.current = null;
      setPrivacyDeletionQuarantinePhase(null);
      localCleanupConfirmed = true;
      setGuestReference(nextIdentity);
      setGuestReferenceUnavailable(false);
      setPrivacyDeleteConfirming(false);
      setSelectionNotice(
        "Synced data and your saved personal plans were deleted. Public guide caches and offline map downloads remain.",
      );
    } catch {
      if (!serverDeletionConfirmed && !alreadyQuarantined) {
        try {
          await clearPrivacyDeletionQuarantine();
          privacyDeletionQuarantineRef.current = null;
          setPrivacyDeletionQuarantinePhase(null);
          safeRollbackConfirmed = true;
        } catch {
          // The durable marker could not be removed. Keep the app quarantined
          // so a relaunch cannot hydrate or sync stale personal state.
        }
      }
      setPrivacyDeleteError(serverDeletionConfirmed
        ? "Synced data was deleted, but this device could not clear every local copy. Sync and personal changes are paused; tap Retry cleanup."
        : alreadyQuarantined || !safeRollbackConfirmed
          ? "Local privacy cleanup is still incomplete. Sync and personal changes remain paused; reconnect and retry."
          : "Synced data could not be deleted. Nothing on this device was cleared.");
    } finally {
      if (serverDeletionConfirmed) quarantinePersonalStateInMemory();
      if (safeRollbackConfirmed || localCleanupConfirmed) {
        privacyDeletionActive.current = false;
        storageMutationActive.current = false;
        personalWriteBarrier.release(deletionWriteGeneration);
      }
      setPrivacyDeletePending(false);
    }
  }

  if (!storageReady) {
    return (
      <main className="app-shell">
        <section className="empty-state" aria-live="polite">
          <h1>Other Bali</h1>
          {storageReadFailed ? (
            <>
              <p>Your saved guide could not be read safely. Nothing was overwritten.</p>
              <button type="button" onClick={() => {
                setStorageReadFailed(false);
                setStorageRetryNonce((value) => value + 1);
              }}>
                Try again
              </button>
            </>
          ) : <p>Opening your saved guide…</p>}
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Discover Bali together</p>
        <h1>The right place for the moment you’re in.</h1>
        <p className="hero-copy">
          Resident-curated places, routes and plans for every Bali moment. Less searching. More Bali.
        </p>
        <div className="status-row" aria-live="polite">
          <span className={online ? "status online" : "status offline"}>{online ? "Online" : "Offline · cached data"}</span>
          {bootstrap ? <span>Updated {formatUpdatedAt(bootstrap.updatedAt)}</span> : null}
          {pendingSyncCount ? <span>{pendingSyncCount} change{pendingSyncCount === 1 ? "" : "s"} waiting to sync</span> : null}
        </div>
        {refreshFailed ? <p className="notice">The live guide could not refresh. Cached public data remains available.</p> : null}
        {syncFailed ? <p className="notice">Your offline changes are safe on this device and will retry syncing automatically.</p> : null}
        {externalOpenFailed ? <p className="notice" role="alert">That external link could not be opened safely.</p> : null}
        {shareFailed ? <p className="notice" role="alert">Sharing is unavailable on this device.</p> : null}
        {deepLinkFailed ? <p className="notice" role="alert">That place link is not available in the current public guide.</p> : null}
        {storageWriteFailed ? (
          <p className="notice" role="alert">
            This device could not persist that change, so the saved/offline state was not updated.
          </p>
        ) : null}
        {navigationSession && !["failed", "completed"].includes(navigationSession.state) ? (
          <section className="navigation-session" aria-live="polite">
            <p className="eyebrow">Integrated navigation</p>
            <strong>{navigationSession.targetName}</strong>
            <span>
              {navigationSession.state === "returned"
                ? "Returned from Maps · your place in Other Bali was restored."
                : "External Maps handoff active · route guidance remains with the provider."}
            </span>
            {navigationSession.state === "returned" ? (
              <button type="button" onClick={completeNavigationSession}>Done</button>
            ) : null}
          </section>
        ) : null}
      </header>

      <div className="sticky-navigation">
        <nav className="tabs" aria-label="Guide sections">
          {([
            ["places", "Discover"],
            ["today", "Today"],
            ["routes", "Trip"],
            ["events", "What’s On"],
            ["saved", "My Bali"],
          ] as const).map(([item, label]) => (
            <button key={item} type="button" aria-pressed={surface === item} onClick={() => chooseSurface(item)}>
              {label}
            </button>
          ))}
        </nav>
        {selectionNotice ? (
          <p
            className="action-feedback"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {selectionNotice}
          </p>
        ) : null}
      </div>

      <main id="main-content">
        {selectedVenue ? (
          <VenueDetail
            snapshot={selectedVenue}
            detail={selectedVenueDetail}
            detailLoading={detailLoadingVenueId === selectedVenue.venue.id}
            detailUnavailable={detailFailureVenueId === selectedVenue.venue.id}
            online={online}
            saved={savedVenueSet.has(selectedVenue.venue.id)}
            onBack={() => setSelectedVenueId(null)}
            onOpenMap={(url) => void openExternal(url, "google_maps")}
            onOpenOfficial={(url) => void openExternal(url, "official_website")}
            onShare={() => void shareTarget(
              { kind: "place", slug: selectedVenue.venue.slug },
              selectedVenue.venue.name,
            )}
            onToggle={() => toggleVenue(selectedVenueDetail
              ? {
                  ...selectedVenue,
                  detail: selectedVenueDetail.venue,
                  detailUpdatedAt: selectedVenueDetail.updatedAt,
                }
              : selectedVenue)}
          />
        ) : selectedRouteId ? (
          <RouteDetail
            slug={selectedRouteId}
            summary={selectedRouteSummary}
            detail={selectedRouteDetail}
            loading={routeLoadingId === selectedRouteId}
            unavailable={routeFailureId === selectedRouteId}
            online={online}
            saved={savedRouteSet.has(selectedRouteId)}
            usingSavedSnapshot={usingSavedRouteSnapshot}
            onBack={() => setSelectedRouteId(null)}
            onOpenVenue={openVenue}
            onShare={() => void shareTarget(
              { kind: "route", slug: selectedRouteId },
              selectedRouteDetail?.route.title ?? selectedRouteSummary?.title ?? "Other Bali route",
            )}
            onToggle={() => toggleRoute(selectedRouteId)}
          />
        ) : (
          <>
            <div className="section-heading">
              <div>
                <p className="eyebrow">{surface === "saved" ? "Saved on this device" : "Public guide"}</p>
                <h2>
                  {surface === "places" ? "Discover"
                    : surface === "today" ? "Today"
                      : surface === "routes" ? "Trip"
                        : surface === "events" ? "What’s On"
                          : "My Bali"}
                </h2>
              </div>
              <button className="refresh-button" type="button" onClick={() => void refresh()} disabled={refreshing || !online}>
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>
            </div>

            {!bootstrap
              && surface !== "saved"
              && !savedVenueIds.length
              && !savedRouteIds.length
              && !savedVenueSnapshots.length
              && !savedRouteSnapshots.length ? (
              <section className="empty-state">
                <h2>The local shell is ready.</h2>
                <p>Connect once to download the latest public places and routes. No account is required.</p>
              </section>
            ) : null}

            {surface === "places" ? (
              <SelectionExperience
                snapshots={visibleVenueSnapshots}
                feedCards={feedCards}
                updatedAt={bootstrap?.updatedAt ?? null}
                online={online}
                savedIds={savedVenueSet}
                activeIndex={Math.min(discoveryIndex, Math.max(0, visibleVenueSnapshots.length - 1))}
                onActiveIndexChange={changeDiscoveryIndex}
                onOpenDetails={openVenue}
                onToggleSave={(snapshot) => void toggleVenue(snapshot)}
                onAddToToday={addToToday}
                onAddToTrip={addToTrip}
                onGoNow={(snapshot) => void goNow(snapshot)}
                onDecide={(inputs) => createDecision({
                  area: inputs.area,
                  company: inputs.company,
                  moment: inputs.moment,
                  budget: inputs.budget,
                  ending: inputs.ending,
                })}
              />
            ) : null}

            {(surface === "saved" || surface === "today") && visibleVenueSnapshots.length ? (
              <section className="cards" aria-label={surface === "saved" ? "Saved places" : "Places"}>
                {visibleVenueSnapshots.map((snapshot) => (
                  <VenueCard
                    key={snapshot.venue.id}
                    venue={snapshot.venue}
                    saved={savedVenueSet.has(snapshot.venue.id)}
                    onOpen={() => openVenue(snapshot.venue.id)}
                    onToggle={() => toggleVenue(snapshot)}
                  />
                ))}
              </section>
            ) : null}

            {surface === "today" && !visibleVenueSnapshots.length && !activeTodayEvents.length ? (
              <section className="empty-state">
                <h2>Today is empty.</h2>
                <p>Add a place from Discover or Decide. The plan remains readable offline on this device.</p>
              </section>
            ) : null}

            {surface === "today" ? (
              <AdaptiveCompanion
                suggestions={companionSuggestions}
                districts={(bootstrap?.data.districts ?? []).map(({ slug, name }) => ({ slug, name }))}
                area={companionArea}
                online={online}
                onAreaChange={changeCompanionArea}
                onOpen={openVenue}
                onAddToToday={(venueId) => {
                  const snapshot = venueSnapshotsById.get(venueId);
                  if (snapshot) void addToToday(snapshot);
                }}
                onGoNow={(venueId) => {
                  const snapshot = venueSnapshotsById.get(venueId);
                  if (snapshot) void goNow(snapshot);
                }}
              />
            ) : null}

            {surface === "today" && activeTodayEvents.length ? (
              <section className="cards" aria-label="Today events">
                {activeTodayEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    inToday
                    onAddToToday={() => {}}
                    onAddToTrip={() => void addEventToTrip(event)}
                  />
                ))}
              </section>
            ) : null}

            {surface === "today"
              && todayEventIds.length > activeTodayEvents.length ? (
              <p className="notice" role="status">
                {todayEventIds.length - activeTodayEvents.length} expired or unavailable event
                {todayEventIds.length - activeTodayEvents.length === 1 ? " was" : "s were"} removed from the active plan.
              </p>
            ) : null}

            {surface === "events" ? (
              <>
                {eventsUpdatedAt ? (
                  <p className="freshness">
                    Event availability checked {formatUpdatedAt(eventsUpdatedAt)}.
                    {!online ? " Showing the last verified offline snapshot." : ""}
                  </p>
                ) : null}
                {activeEvents.length ? (
                  <section className="cards" aria-label="Active events">
                    {activeEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        inToday={todayEventIds.includes(event.id)}
                        onAddToToday={() => void addEventToToday(event)}
                        onAddToTrip={() => void addEventToTrip(event)}
                      />
                    ))}
                  </section>
                ) : (
                  <section className="empty-state">
                    <h2>No verified active events.</h2>
                    <p>
                      {online
                        ? "Nothing is currently published in the verified event feed."
                        : "Reconnect to refresh What’s On. Expired cached events are never shown as active."}
                    </p>
                  </section>
                )}
              </>
            ) : null}

            {(surface === "routes" || surface === "saved") && visibleRoutes.length ? (
              <section className="cards route-cards" aria-label={surface === "saved" ? "Saved routes" : "Routes"}>
                {visibleRoutes.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    saved={savedRouteSet.has(route.id)}
                    offlineDetailSaved={routeSnapshotsById.has(route.id)}
                    onOpen={() => openRoute(route.id)}
                    onToggle={() => toggleRoute(route.id)}
                  />
                ))}
              </section>
            ) : null}

            {surface === "routes" ? (
              <>
                <section className="trip-controls">
                  <label>
                    Add new stops to
                    <select
                      value={tripDayIndex}
                      disabled={!trip}
                      onChange={(event) => setTripDayIndex(Number(event.target.value))}
                    >
                      {(trip?.days ?? []).map((day, index) => (
                        <option value={index} key={day.id}>Day {index + 1} · {day.date}</option>
                      ))}
                    </select>
                  </label>
                  {!trip ? (
                    <div className="duration-actions" aria-label="Create or adapt a trip">
                      {[3, 5, 7, 10].map((duration) => (
                        <div key={duration}>
                          <button
                            type="button"
                            onClick={() => void persistTrip(createEmptyTrip(duration as 3 | 5 | 7 | 10))}
                          >
                            Start empty {duration}-day trip
                          </button>
                          <button
                            type="button"
                            disabled={!online || tripTemplateLoading !== null}
                            onClick={() => void createTripFromPublishedRoutes(duration as 3 | 5 | 7 | 10)}
                          >
                            {tripTemplateLoading === duration
                              ? "Building…"
                              : `Use published routes for ${duration} days`}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </section>
                {trip ? (
                  <TripPlan
                    trip={trip}
                    resolveStop={resolveTripStop}
                    replacementOptions={sharedCandidateUniverse
                      .filter((venue) => !trip.days.some((day) => day.stops.some(
                        (stop) => stop.entityType === "place" && stop.entityId === venue.id,
                      )))
                      .map((venue) => ({ id: venue.id, name: venue.name }))}
                    onMove={(dayIndex, stopId, direction) => void editTrip(
                      (current) => moveTripStop(current, dayIndex, stopId, direction),
                    )}
                    onMoveToDay={(dayIndex, stopId, targetDayIndex) => void editTrip(
                      (current) => moveTripStopToDay(
                        current,
                        dayIndex,
                        stopId,
                        targetDayIndex,
                        current.days[targetDayIndex]?.stops.length ?? 0,
                      ),
                    )}
                    onReplace={(dayIndex, stopId, replacementId) => void editTrip(
                      (current) => replaceTripStop(current, dayIndex, stopId, "place", replacementId),
                    )}
                    onSaveNote={(dayIndex, stopId, note) => void editTrip(
                      (current) => setTripStopNote(current, dayIndex, stopId, note),
                    )}
                    onToggleSkipped={(dayIndex, stopId, skipped) => void editTrip(
                      (current) => setTripStopState(current, dayIndex, stopId, skipped ? "skipped" : "planned"),
                    )}
                    onToggleVisited={(dayIndex, stopId, visited) => void editTrip(
                      (current) => setTripStopState(current, dayIndex, stopId, visited ? "visited" : "planned"),
                    )}
                    onRemove={(dayIndex, stopId) => void editTrip(
                      (current) => removeTripStop(current, dayIndex, stopId),
                    )}
                  />
                ) : null}
              </>
            ) : null}

            {surface === "saved"
              ? (
                <>
                  <OfflineBaliManager
                    manifest={offlineBaliManifest}
                    online={online}
                    packs={offlinePacks}
                    onDownload={(region) => void downloadOfflineRegion(region)}
                    onRemove={(regionId) => void removeOfflineRegion(regionId)}
                    onOpen={(regionId) => void defaultOfflineMapRuntime.open(regionId)}
                  />
                  <section className="privacy-controls" aria-labelledby="privacy-controls-title">
                    <p className="eyebrow">Privacy & device data</p>
                    <h3 id="privacy-controls-title">Your synced plans</h3>
                    <p>
                      Other Bali uses a random app identifier to sync Saved, Today and Trip changes.
                      No account is required.
                    </p>
                    <div className="guest-reference">
                      <span>Anonymous Guest Reference</span>
                      {guestReference ? (
                        <>
                          <code>{guestReference}</code>
                          <button type="button" onClick={() => void copyGuestReference()}>
                            Copy
                          </button>
                        </>
                      ) : (
                        <span>{guestReferenceUnavailable ? "Unavailable on this device" : "Loading…"}</span>
                      )}
                    </div>
                    <p className="guest-reference-help">
                      Share this code with support when asking us to locate synced data.
                      Save it before uninstalling if you may need help later.
                    </p>
                    {!privacyDeleteConfirming ? (
                      <button
                        className="delete-data-button"
                        type="button"
                        disabled={privacyDeletePending}
                        onClick={() => {
                          setPrivacyDeleteError(null);
                          setPrivacyDeleteConfirming(true);
                        }}
                      >
                        Delete synced data
                      </button>
                    ) : (
                      <div
                        className="delete-confirmation"
                        role="alertdialog"
                        aria-modal="false"
                        aria-labelledby="delete-confirmation-title"
                      >
                        <strong id="delete-confirmation-title">
                          {privacyDeletionQuarantinePhase
                            ? "Finish the interrupted privacy cleanup?"
                            : "Delete synced data and personal plans from this device?"}
                        </strong>
                        <p>
                          Saved places, Today, Trip, notes, visited states and pending sync changes
                          will be removed. Public guide caches and offline map downloads will remain.
                        </p>
                        <div>
                          <button
                            type="button"
                            disabled={privacyDeletePending || privacyDeletionQuarantinePhase !== null}
                            onClick={() => {
                              setPrivacyDeleteConfirming(false);
                              setPrivacyDeleteError(null);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="delete-data-button"
                            type="button"
                            disabled={privacyDeletePending}
                            onClick={() => void deleteSyncedAndLocalPersonalData()}
                          >
                            {privacyDeletePending
                              ? "Deleting…"
                              : privacyDeletionQuarantinePhase
                                ? "Retry cleanup"
                                : "Confirm deletion"}
                          </button>
                        </div>
                      </div>
                    )}
                    {privacyDeleteError ? (
                      <p className="delete-error" role="alert">{privacyDeleteError}</p>
                    ) : null}
                  </section>
                </>
              )
              : null}

            {surface === "saved"
              && (savedVenueIds.length > 0 || savedRouteIds.length > 0)
              && !visibleVenueSnapshots.length
              && !visibleRoutes.length ? (
              <section className="empty-state">
                <h2>Saved references kept.</h2>
                <p>
                  Connect to restore their published summaries and, for routes, ordered stops. Existing saved IDs remain on this device.
                </p>
              </section>
            ) : null}

            {surface === "saved"
              && !savedVenueIds.length
              && !savedRouteIds.length
              && !visibleVenueSnapshots.length
              && !visibleRoutes.length ? (
              <section className="empty-state">
                <h2>Nothing saved yet.</h2>
                <p>Save a place or route to keep its public summary available in this local shell.</p>
              </section>
            ) : null}
          </>
        )}
      </main>

      <footer>
        <p>Other Bali helps you decide. Google Maps and external providers handle navigation and fulfilment.</p>
        <div className="footer-links">
          <button
            type="button"
            onClick={() => void openExternal(
              bootstrap?.data.config.privacyPolicyUrl ?? "https://www.otherbali.com/privacy",
              "official_website",
              ["www.otherbali.com"],
            )}
          >Privacy</button>
          <button
            type="button"
            onClick={() => void openExternal(
              bootstrap?.data.config.supportUrl ?? "https://www.otherbali.com/support",
              "official_website",
              ["www.otherbali.com"],
            )}
          >Support</button>
        </div>
      </footer>
    </div>
  );
}
