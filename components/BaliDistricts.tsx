import type { DistrictGuideEntry } from "@/lib/districts";
import DistrictMapLink from "@/components/DistrictMapLink";

// Bali-wide planning layer: area cards with fit context only (who/when).
// Coverage discipline: no perks, no booking, no QR outside active_deep —
// planning_only cards carry a map link and nothing money-shaped.

const STATUS_LABEL: Record<DistrictGuideEntry["status"], string> = {
  active_deep: "Full guide",
  next_deep: "In depth next",
  planning_only: "Planning notes",
};

export default function BaliDistricts({
  districts,
}: {
  districts: DistrictGuideEntry[];
}) {
  return (
    <div className="district-grid">
      {districts.map((d) => {
        const deep = d.status === "active_deep";
        return (
          <article
            key={d.slug}
            className={`district-card ${deep ? "district-card-deep" : ""}`}
          >
            <div className="district-card-top">
              <p className="district-region">{d.region}</p>
              <span
                className={`district-status ${deep ? "district-status-deep" : ""}`}
              >
                {STATUS_LABEL[d.status]}
              </span>
            </div>
            <h3 className="district-name">{d.name}</h3>
            <p className="district-moment">{d.moment}</p>
            <p className="district-fit">
              <span>Best for</span> {d.bestFor.join(" · ")}
            </p>
            <div className="district-actions">
              {deep ? (
                <a href="#guide" className="quiet-link">
                  Open the Canggu guide →
                </a>
              ) : (
                <DistrictMapLink
                  href={d.mapsUrl}
                  districtSlug={d.slug}
                  className="quiet-link"
                >
                  Map →
                </DistrictMapLink>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
