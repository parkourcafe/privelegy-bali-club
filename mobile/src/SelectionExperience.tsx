import { useMemo, useRef, useState } from "react";
import { nearestArea } from "../../lib/day-builder";
import type { MobileDecisionResult, MobileFeedCard } from "./api";
import type { SavedVenueSnapshot } from "./storage";
import {
  EMPTY_DECISION_INPUTS,
  decisionRequestReady,
  filterMapListCards,
  nextFeedPosition,
  toDiscoveryCards,
  type DecisionInputs,
  type SelectionMode,
} from "./discovery-model";

interface SelectionExperienceProps {
  snapshots: SavedVenueSnapshot[];
  feedCards?: MobileFeedCard[];
  updatedAt: string | null;
  online: boolean;
  savedIds: ReadonlySet<string>;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onOpenDetails: (id: string) => void;
  onToggleSave: (snapshot: SavedVenueSnapshot) => void;
  onAddToToday: (snapshot: SavedVenueSnapshot) => void;
  onAddToTrip: (snapshot: SavedVenueSnapshot) => void;
  onGoNow: (snapshot: SavedVenueSnapshot) => void;
  onDecide: (inputs: DecisionInputs) => Promise<MobileDecisionResult>;
}

const MODE_LABELS: Record<SelectionMode, string> = {
  discover: "Discover",
  swipe: "Swipe",
  decide: "Decide for me",
  "map-list": "Map / List",
};

function DiscoverCard({
  snapshot,
  feedCard,
  updatedAt,
  saved,
  online,
  position,
  total,
  onOpenDetails,
  onToggleSave,
  onAddToToday,
  onAddToTrip,
  onGoNow,
  onPrevious,
  onNext,
  onSwipe,
  swipeMode = false,
}: {
  snapshot: SavedVenueSnapshot;
  feedCard: MobileFeedCard | null;
  updatedAt: string | null;
  saved: boolean;
  online: boolean;
  position: number;
  total: number;
  onOpenDetails: () => void;
  onToggleSave: () => void;
  onAddToToday: () => void;
  onAddToTrip: () => void;
  onGoNow: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSwipe?: (direction: "left" | "right" | "up") => void;
  swipeMode?: boolean;
}) {
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const card = feedCard ? {
    venue: feedCard.venue,
    reasonShown: feedCard.reasonShown,
    whyThisPlace: feedCard.whyThisPlace,
    skipIf: feedCard.skipIf,
    tags: feedCard.tags,
    freshnessLabel: feedCard.freshness,
    mediaCount: feedCard.venue.photoUrl ? 1 : 0,
  } : toDiscoveryCards([snapshot.venue], updatedAt)[0]!;
  return (
    <article
      className={`discover-card${swipeMode ? " swipe-card" : ""}`}
      aria-labelledby={`discover-${snapshot.venue.id}`}
      onPointerDown={(event) => {
        if (!swipeMode || (event.target as HTMLElement).closest("button, a, input, select, textarea")) return;
        pointerStart.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={(event) => {
        if (!swipeMode || !pointerStart.current || (event.target as HTMLElement).closest("button, a, input, select, textarea")) return;
        const start = pointerStart.current;
        pointerStart.current = null;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 64) return;
        onSwipe?.(Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? "left" : "right") : "up");
      }}
      onPointerCancel={() => { pointerStart.current = null; }}
    >
      {swipeMode ? <p className="swipe-hint" aria-live="polite">Swipe left to skip · right to save · up to add to today</p> : null}
      <div className={`discover-media${snapshot.venue.photoUrl ? "" : " missing-media"}`}>
        {snapshot.venue.photoUrl ? (
          // Capacitor bundles this React shell directly; Next/Image is not available in this runtime.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={snapshot.venue.photoUrl} alt="" />
        ) : (
          <div className="media-fallback" role="img" aria-label={`No published venue media for ${snapshot.venue.name}`}>
            Other Bali editorial guide
          </div>
        )}
        <span className="media-count" aria-label={`${card.mediaCount} published images`}>
          {card.mediaCount ? `${card.mediaCount} photo` : "No venue photo"}
        </span>
      </div>
      <div className="discover-copy">
        <p className="card-kicker">{snapshot.venue.district} · {snapshot.venue.category.replaceAll("_", " ")}</p>
        <h3 id={`discover-${snapshot.venue.id}`}>{snapshot.venue.name}</h3>
        <p><strong>Why this place</strong><br />{card.whyThisPlace}</p>
        <p><strong>Skip if</strong><br />{card.skipIf ?? "No published caveat yet — check the full details before going."}</p>
        <ul className="detail-tags" aria-label="Context tags">
          {card.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
        <p className="reason-shown"><strong>Why you’re seeing this</strong><br />{card.reasonShown}</p>
        <p className="freshness-label">{online ? card.freshnessLabel : `Offline · ${card.freshnessLabel}`}</p>
        <p className="truth-note">Travel time and opening state are hidden until a fresh verified source is available.</p>
      </div>
      <div className="quick-actions" aria-label={`Actions for ${snapshot.venue.name}`}>
        <button type="button" aria-pressed={saved} onClick={onToggleSave}>{saved ? "Saved" : "Save"}</button>
        <button type="button" onClick={onAddToToday}>Add to today</button>
        <button type="button" onClick={onAddToTrip}>Add to trip</button>
        <button type="button" onClick={onGoNow}>{online ? "Go now" : "Go now · internet required"}</button>
        <button type="button" onClick={onOpenDetails}>View details</button>
      </div>
      <div className="feed-controls" aria-label="Discover card navigation">
        <button type="button" onClick={onPrevious} disabled={position === 0} aria-label="Previous place">↑ Previous</button>
        <span aria-live="polite">{position + 1} of {total}</span>
        <button type="button" onClick={onNext} disabled={position === total - 1} aria-label="Next place">Next ↓</button>
      </div>
    </article>
  );
}

export default function SelectionExperience(props: SelectionExperienceProps) {
  const [mode, setMode] = useState<SelectionMode>("discover");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");
  const [decisionInputs, setDecisionInputs] = useState<DecisionInputs>(EMPTY_DECISION_INPUTS);
  const [decisionSubmitted, setDecisionSubmitted] = useState(false);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const [decisionResult, setDecisionResult] = useState<MobileDecisionResult | null>(null);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const cards = useMemo(() => {
    const feedById = new Map((props.feedCards ?? []).map((card) => [card.venue.id, card]));
    return props.snapshots.map((item) => {
      const feedCard = feedById.get(item.venue.id);
      return feedCard ? {
        venue: feedCard.venue,
        reasonShown: feedCard.reasonShown,
        whyThisPlace: feedCard.whyThisPlace,
        skipIf: feedCard.skipIf,
        tags: feedCard.tags,
        freshnessLabel: feedCard.freshness,
        mediaCount: feedCard.venue.photoUrl ? 1 : 0,
      } : toDiscoveryCards([item.venue], props.updatedAt)[0]!;
    });
  }, [props.feedCards, props.snapshots, props.updatedAt]);
  const activeSnapshot = props.snapshots[props.activeIndex] ?? props.snapshots[0] ?? null;
  const filteredCards = filterMapListCards(cards, district, category);
  const snapshotsById = useMemo(
    () => new Map(props.snapshots.map((snapshot) => [snapshot.venue.id, snapshot])),
    [props.snapshots],
  );
  const districts = [...new Set(cards.map((card) => card.venue.district))].sort();
  const categories = [...new Set(cards.map((card) => card.venue.category))].sort();
  const decisionEntries: Array<[string, MobileDecisionResult["bestFit"]]> = decisionResult
    ? [
        ["Best fit", decisionResult.bestFit],
        ["Backup", decisionResult.backup],
        ["Contrast", decisionResult.contrast],
      ]
    : [];
  const decisionCards = decisionEntries.flatMap(([role, place]) => {
        if (!place) return [];
        const snapshot = [...snapshotsById.values()].find((item) => (
          item.venue.slug === place.placeId || item.venue.id === place.placeId
        ));
        return snapshot ? [{ role, place, snapshot }] : [];
      });

  function useCurrentArea() {
    setLocationNotice(null);
    if (!navigator.geolocation) {
      setLocationNotice("Location is unavailable on this device. Choose an area manually.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const area = nearestArea(coords.latitude, coords.longitude);
        if (!area || !districts.includes(area.slug)) {
          setLocationNotice("You are outside the supported area range. Choose an area manually.");
          return;
        }
        setDecisionInputs((current) => ({ ...current, area: area.slug }));
        setLocationNotice(`Using ${area.name} for this decision. Precise location was not stored.`);
      },
      () => setLocationNotice("Location permission was not granted. Choose an area manually."),
      { enableHighAccuracy: false, maximumAge: 300_000, timeout: 8_000 },
    );
  }

  return (
    <section className="selection-experience" aria-labelledby="selection-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Three ways to choose</p>
          <h2 id="selection-title">{MODE_LABELS[mode]}</h2>
        </div>
      </div>
      <div className="selection-modes" role="group" aria-label="Choose how to find a place">
        {(Object.keys(MODE_LABELS) as SelectionMode[]).map((item) => (
          <button key={item} type="button" aria-pressed={mode === item} onClick={() => setMode(item)}>
            {MODE_LABELS[item]}
          </button>
        ))}
      </div>

      {(mode === "discover" || mode === "swipe") ? activeSnapshot ? (
        <DiscoverCard
          snapshot={activeSnapshot}
          feedCard={(props.feedCards ?? []).find(
            (card) => card.venue.id === activeSnapshot.venue.id,
          ) ?? null}
          updatedAt={props.updatedAt}
          saved={props.savedIds.has(activeSnapshot.venue.id)}
          online={props.online}
          position={props.activeIndex}
          total={props.snapshots.length}
          onOpenDetails={() => props.onOpenDetails(activeSnapshot.venue.id)}
          onToggleSave={() => props.onToggleSave(activeSnapshot)}
          onAddToToday={() => props.onAddToToday(activeSnapshot)}
          onAddToTrip={() => props.onAddToTrip(activeSnapshot)}
          onGoNow={() => props.onGoNow(activeSnapshot)}
          onPrevious={() => props.onActiveIndexChange(nextFeedPosition(props.activeIndex, "previous", props.snapshots.length))}
          onNext={() => props.onActiveIndexChange(nextFeedPosition(props.activeIndex, "next", props.snapshots.length))}
          swipeMode={mode === "swipe"}
          onSwipe={(direction) => {
            if (direction === "right" && !props.savedIds.has(activeSnapshot.venue.id)) props.onToggleSave(activeSnapshot);
            if (direction === "up") props.onAddToToday(activeSnapshot);
            props.onActiveIndexChange(nextFeedPosition(props.activeIndex, "next", props.snapshots.length));
          }}
        />
      ) : (
        <div className="empty-state" role="status">
          <h3>No published cards available.</h3>
          <p>Refresh when online. Saved places remain available in My Bali.</p>
        </div>
      ) : null}

      {mode === "decide" ? (
        <form className="decision-form" onSubmit={async (event) => {
          event.preventDefault();
          if (!decisionRequestReady(decisionInputs) || decisionLoading) return;
          setDecisionSubmitted(true);
          setDecisionLoading(true);
          setDecisionError(null);
          setDecisionResult(null);
          try {
            setDecisionResult(await props.onDecide(decisionInputs));
          } catch {
            setDecisionError(props.online
              ? "The shared decision service is unavailable. No client-side ranking was substituted."
              : "Decide for me requires a connection. Discover and saved places remain available offline.");
          } finally {
            setDecisionLoading(false);
          }
        }}>
          <label><span>Area</span><select value={decisionInputs.area} onChange={(event) => {
            setDecisionSubmitted(false);
            setDecisionInputs((current) => ({ ...current, area: event.target.value }));
          }}>
            <option value="">Choose an area</option>
            {districts.map((item) => <option key={item} value={item}>{item.replaceAll("-", " ")}</option>)}
          </select></label>
          <button type="button" onClick={useCurrentArea}>Use my current area</button>
          {locationNotice ? <p className="truth-note" role="status">{locationNotice}</p> : null}
          <label><span>Company</span><select value={decisionInputs.company} onChange={(event) => setDecisionInputs((current) => ({ ...current, company: event.target.value }))}>
            <option value="">Choose</option><option value="solo">Solo</option><option value="couple">Couple</option><option value="family">Family</option><option value="friends">Friends</option>
          </select></label>
          <label><span>Moment</span><select value={decisionInputs.moment} onChange={(event) => setDecisionInputs((current) => ({ ...current, moment: event.target.value }))}>
            <option value="">Choose</option><option value="brunch_after_surf">Brunch</option><option value="local_food_calm">Calm local food</option><option value="date_night_special">Date night</option><option value="sunset_drinks_view">Sunset drinks</option>
          </select></label>
          <label><span>Budget</span><select value={decisionInputs.budget} onChange={(event) => setDecisionInputs((current) => ({ ...current, budget: event.target.value }))}>
            <option value="">Choose</option><option value="budget">Keep it simple</option><option value="mid">Mid-range</option><option value="splurge">Worth a splurge</option>
          </select></label>
          <label><span>Ending</span><select value={decisionInputs.ending} onChange={(event) => setDecisionInputs((current) => ({ ...current, ending: event.target.value }))}>
            <option value="">Choose</option><option value="early">Early</option><option value="dinner">Dinner</option><option value="sunset">Sunset</option><option value="special">Something special</option>
          </select></label>
          <button type="submit" disabled={!props.online || !decisionRequestReady(decisionInputs) || decisionLoading}>
            {decisionLoading ? "Choosing…" : "Find my best fit"}
          </button>
          {decisionError ? <div className="notice" role="alert">{decisionError}</div> : null}
          {decisionSubmitted && decisionResult?.emptyStateReason ? <div className="notice" role="status">No verified candidates match this exact context yet. Try another moment or area.</div> : null}
          {decisionCards.length ? (
            <div className="decision-results" aria-live="polite">
              {decisionCards.map(({ role, place, snapshot }) => (
                <article className="card" key={`${role}-${place.placeId}`}>
                  <div className="card-copy"><p className="card-kicker">{role}</p><h3>{place.name}</h3><p>{place.why ?? "Open the published profile for context."}</p>{place.notIdealIf ? <p><strong>Skip if:</strong> {place.notIdealIf}</p> : null}</div>
                  <div className="card-actions">
                    <button type="button" onClick={() => props.onOpenDetails(snapshot.venue.id)}>Details</button>
                    <button type="button" onClick={() => props.onAddToToday(snapshot)}>Add to today</button>
                    <button type="button" onClick={() => props.onGoNow(snapshot)}>Go now</button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </form>
      ) : null}

      {mode === "map-list" ? (
        <div className="map-list">
          <div className="filter-row">
            <label><span>District</span><select value={district} onChange={(event) => setDistrict(event.target.value)}>
              <option value="">All published districts</option>
              {districts.map((item) => <option key={item}>{item}</option>)}
            </select></label>
            <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">All categories</option>
              {categories.map((item) => <option key={item}>{item.replaceAll("_", " ")}</option>)}
            </select></label>
          </div>
          <p className="truth-note">Map view awaits route-safe coordinates from the shared Place contract. This list uses the same published result set and active filters.</p>
          <div className="cards" aria-live="polite">
            {filteredCards.map((card) => {
              const snapshot = snapshotsById.get(card.venue.id)!;
              return (
                <article className="card" key={card.venue.id}>
                  <div className="card-copy">
                    <p className="card-kicker">{card.venue.district} · {card.venue.category.replaceAll("_", " ")}</p>
                    <h3>{card.venue.name}</h3>
                    <p>{card.whyThisPlace}</p>
                  </div>
                  <div className="card-actions">
                    <button className="detail-button" type="button" onClick={() => props.onOpenDetails(card.venue.id)}>Details</button>
                    <button className="save-button" type="button" aria-pressed={props.savedIds.has(card.venue.id)} onClick={() => props.onToggleSave(snapshot)}>
                      {props.savedIds.has(card.venue.id) ? "Saved" : "Save"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          {!filteredCards.length ? <div className="empty-state"><h3>No matching published places.</h3><p>Try a wider filter. We will not fill from another district silently.</p></div> : null}
        </div>
      ) : null}
    </section>
  );
}
