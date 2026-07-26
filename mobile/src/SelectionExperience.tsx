import { useMemo, useState } from "react";
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
}

const MODE_LABELS: Record<SelectionMode, string> = {
  discover: "Discover",
  decide: "Decide for me",
  "map-list": "Map / List",
};

function DiscoverCard({
  snapshot,
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
}: {
  snapshot: SavedVenueSnapshot;
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
}) {
  const card = toDiscoveryCards([snapshot.venue], updatedAt)[0]!;
  return (
    <article className="discover-card" aria-labelledby={`discover-${snapshot.venue.id}`}>
      <div className="discover-media">
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
  const cards = useMemo(
    () => toDiscoveryCards(props.snapshots.map((item) => item.venue), props.updatedAt),
    [props.snapshots, props.updatedAt],
  );
  const activeSnapshot = props.snapshots[props.activeIndex] ?? props.snapshots[0] ?? null;
  const filteredCards = filterMapListCards(cards, district, category);
  const snapshotsById = useMemo(
    () => new Map(props.snapshots.map((snapshot) => [snapshot.venue.id, snapshot])),
    [props.snapshots],
  );
  const districts = [...new Set(cards.map((card) => card.venue.district))].sort();
  const categories = [...new Set(cards.map((card) => card.venue.category))].sort();

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

      {mode === "discover" ? activeSnapshot ? (
        <DiscoverCard
          snapshot={activeSnapshot}
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
        />
      ) : (
        <div className="empty-state" role="status">
          <h3>No published cards available.</h3>
          <p>Refresh when online. Saved places remain available in My Bali.</p>
        </div>
      ) : null}

      {mode === "decide" ? (
        <form className="decision-form" onSubmit={(event) => {
          event.preventDefault();
          setDecisionSubmitted(true);
        }}>
          {([
            ["area", "Area"],
            ["company", "Company"],
            ["moment", "Moment or vibe"],
            ["budget", "Budget"],
            ["ending", "How should the day end?"],
          ] as const).map(([field, label]) => (
            <label key={field}>
              <span>{label}</span>
              <input
                value={decisionInputs[field]}
                onChange={(event) => {
                  setDecisionSubmitted(false);
                  setDecisionInputs((current) => ({ ...current, [field]: event.target.value }));
                }}
              />
            </label>
          ))}
          <button type="submit" disabled={!decisionRequestReady(decisionInputs)}>Find my best fit</button>
          {decisionSubmitted ? (
            <div className="notice" role="status">
              The shared Decision API is not connected in this build. Your choices were not replaced by a client-side ranking guess.
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
