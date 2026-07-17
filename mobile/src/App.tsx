import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  MobileRouteDetail,
  MobileRouteSummary,
  MobileVenue,
  MobileVenueCompact,
} from "../../lib/mobile-api/contracts";
import type { ExternalLinkKind } from "../../lib/external-links";
import { fetchBootstrap, fetchRouteDetail, fetchVenueDetail } from "./api";
import type { MobileBootstrapPayload } from "./contracts";
import { parseMobileDeepLink, type MobileDeepLinkTarget } from "./deep-links";
import {
  openControlledExternal,
  shareMobileTarget,
  startDeepLinkMonitoring,
  startNetworkMonitoring,
} from "./native-runtime";
import {
  DEFAULT_NAVIGATION_STATE,
  hydrateMobileStorage,
  MAX_SAVED_ROUTE_SNAPSHOTS,
  writeCachedBootstrap,
  writeNavigationState,
  writeSavedRouteState,
  writeSavedVenueState,
  type MobileSurface,
  type SavedRouteSnapshot,
  type SavedVenueSnapshot,
} from "./storage";

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
  const [online, setOnline] = useState(() => typeof navigator === "undefined" || navigator.onLine);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshAttempted, setRefreshAttempted] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [externalOpenFailed, setExternalOpenFailed] = useState(false);
  const [shareFailed, setShareFailed] = useState(false);
  const [deepLinkFailed, setDeepLinkFailed] = useState(false);
  const [storageWriteFailed, setStorageWriteFailed] = useState(false);
  const [pendingDeepLink, setPendingDeepLink] = useState<MobileDeepLinkTarget | null>(null);
  const [loadedVenueDetail, setLoadedVenueDetail] = useState<LoadedVenueDetail | null>(null);
  const [detailLoadingVenueId, setDetailLoadingVenueId] = useState<string | null>(null);
  const [detailFailureVenueId, setDetailFailureVenueId] = useState<string | null>(null);
  const [loadedRouteDetail, setLoadedRouteDetail] = useState<LoadedRouteDetail | null>(null);
  const [routeLoadingId, setRouteLoadingId] = useState<string | null>(null);
  const [routeFailureId, setRouteFailureId] = useState<string | null>(null);
  const restoredScroll = useRef(false);
  const storageMutationActive = useRef(false);
  const persistedVenueState = useRef<PersistedVenueState>({ ids: [], snapshots: [] });
  const persistedRouteState = useRef<PersistedRouteState>({ ids: [], snapshots: [] });
  const venuePersistenceQueue = useRef<Promise<void>>(Promise.resolve());
  const routePersistenceQueue = useRef<Promise<void>>(Promise.resolve());

  const enqueueVenueState = useCallback((
    transform: (current: PersistedVenueState) => PersistedVenueState,
  ): Promise<boolean> => {
    const operation = venuePersistenceQueue.current.then(async () => {
      const next = transform(persistedVenueState.current);
      await writeSavedVenueState(next.ids, next.snapshots);
      persistedVenueState.current = next;
      setSavedVenueIds(next.ids);
      setSavedVenueSnapshots(next.snapshots);
    });
    venuePersistenceQueue.current = operation.catch(() => {});
    return operation.then(() => true).catch(() => {
      setStorageWriteFailed(true);
      return false;
    });
  }, []);

  const enqueueRouteState = useCallback((
    transform: (current: PersistedRouteState) => PersistedRouteState,
  ): Promise<boolean> => {
    const operation = routePersistenceQueue.current.then(async () => {
      const next = transform(persistedRouteState.current);
      await writeSavedRouteState(next.ids, next.snapshots);
      persistedRouteState.current = next;
      setSavedRouteIds(next.ids);
      setSavedRouteSnapshots(next.snapshots);
    });
    routePersistenceQueue.current = operation.catch(() => {});
    return operation.then(() => true).catch(() => {
      setStorageWriteFailed(true);
      return false;
    });
  }, []);

  useEffect(() => {
    let active = true;
    void hydrateMobileStorage()
      .then((state) => {
        if (!active) return;
        setBootstrap(state.bootstrap);
        setSavedVenueIds(state.savedVenueIds);
        setSavedRouteIds(state.savedRouteIds);
        setSavedVenueSnapshots(state.savedVenueSnapshots);
        setSavedRouteSnapshots(state.savedRouteSnapshots);
        persistedVenueState.current = {
          ids: state.savedVenueIds,
          snapshots: state.savedVenueSnapshots,
        };
        persistedRouteState.current = {
          ids: state.savedRouteIds,
          snapshots: state.savedRouteSnapshots,
        };
        setSurface(state.navigation.surface);
        setSelectedVenueId(state.navigation.selectedVenueId);
        setSelectedRouteId(state.navigation.selectedRouteId);
        setInitialScrollY(state.navigation.scrollY);
        setStorageReady(true);
      })
      .catch(() => {
        if (active) setStorageReadFailed(true);
      });
    return () => {
      active = false;
    };
  }, [storageRetryNonce]);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setRefreshing(true);
    setRefreshFailed(false);
    try {
      const next = await fetchBootstrap(signal);
      setBootstrap(next);
      void writeCachedBootstrap(next).catch(() => setStorageWriteFailed(true));

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

  const persistNavigation = useCallback(() => writeNavigationState({
    surface,
    selectedVenueId,
    selectedRouteId,
    scrollY: Math.max(0, window.scrollY),
  }), [selectedRouteId, selectedVenueId, surface]);

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
    const result = new Map(savedVenueSnapshots.map((item) => [item.venue.id, item]));
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
  }, [bootstrap, loadedRouteDetail, savedRouteSnapshots, savedVenueSnapshots, venues]);

  const routeSummariesById = useMemo(() => {
    const result = new Map<string, MobileRouteSummary>();
    for (const snapshot of savedRouteSnapshots) result.set(snapshot.route.id, snapshot.route);
    for (const route of routes) result.set(route.id, route);
    return result;
  }, [routes, savedRouteSnapshots]);

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

  const visibleVenueSnapshots = surface === "saved"
    ? savedVenueIds.map((id) => venueSnapshotsById.get(id)).filter((item): item is SavedVenueSnapshot => Boolean(item))
    : venues.map((venue) => ({
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
    if (storageMutationActive.current) return;
    storageMutationActive.current = true;
    setStorageWriteFailed(false);
    const id = snapshot.venue.id;
    try {
      await enqueueVenueState((current) => {
        const removing = current.ids.includes(id);
        return {
          ids: removing ? current.ids.filter((item) => item !== id) : [...current.ids, id],
          snapshots: removing
            ? current.snapshots.filter((item) => item.venue.id !== id)
            : [...current.snapshots.filter((item) => item.venue.id !== id), snapshot],
        };
      });
    } finally {
      storageMutationActive.current = false;
    }
  }

  async function toggleRoute(id: string) {
    if (storageMutationActive.current) return;
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
    setSurface(next);
    setSelectedVenueId(null);
    setSelectedRouteId(null);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function openVenue(id: string) {
    if (!venueSnapshotsById.has(id)) return;
    setSelectedRouteId(null);
    setSelectedVenueId(id);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function openRoute(id: string) {
    setSelectedVenueId(null);
    setSelectedRouteId(id);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  async function openExternal(url: string, kind: ExternalLinkKind, allowedHosts?: readonly string[]) {
    setExternalOpenFailed(false);
    const opened = await openControlledExternal(url, kind, {
      allowedHosts,
      beforeOpen: persistNavigation,
    });
    setExternalOpenFailed(!opened);
  }

  async function shareTarget(target: MobileDeepLinkTarget, title: string) {
    setShareFailed(false);
    await persistNavigation();
    setShareFailed(!await shareMobileTarget(target, title));
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
        <p className="eyebrow">Other Bali</p>
        <h1>The right place for the moment you’re in.</h1>
        <p className="hero-copy">Resident-curated places and routes, with clear handoffs when you’re ready to go.</p>
        <div className="status-row" aria-live="polite">
          <span className={online ? "status online" : "status offline"}>{online ? "Online" : "Offline · cached data"}</span>
          {bootstrap ? <span>Updated {formatUpdatedAt(bootstrap.updatedAt)}</span> : null}
        </div>
        {refreshFailed ? <p className="notice">The live guide could not refresh. Cached public data remains available.</p> : null}
        {externalOpenFailed ? <p className="notice" role="alert">That external link could not be opened safely.</p> : null}
        {shareFailed ? <p className="notice" role="alert">Sharing is unavailable on this device.</p> : null}
        {deepLinkFailed ? <p className="notice" role="alert">That place link is not available in the current public guide.</p> : null}
        {storageWriteFailed ? (
          <p className="notice" role="alert">
            This device could not persist that change, so the saved/offline state was not updated.
          </p>
        ) : null}
      </header>

      <nav className="tabs" aria-label="Guide sections">
        {(["places", "routes", "saved"] as const).map((item) => (
          <button key={item} type="button" aria-pressed={surface === item} onClick={() => chooseSurface(item)}>
            {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </nav>

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
                <h2>{surface === "places" ? "Places" : surface === "routes" ? "Routes" : "Saved"}</h2>
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

            {(surface === "places" || surface === "saved") && visibleVenueSnapshots.length ? (
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
