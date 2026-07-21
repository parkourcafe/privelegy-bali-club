import { readFileSync, writeFileSync } from "node:fs";

const stagedPath = process.argv[2] || "data/data-ops/chope-607/dry-run-output-full.json";
const venuesPath = process.argv[3] || "data/data-ops/chope-607/production-public-venues-snapshot.json";
const outputPath = process.argv[4] || "data/data-ops/chope-607/db-aware-dedup-output-public.json";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function normalizedName(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(the|restaurant|cafe|bar|bali)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function baseName(value) {
  return normalizedName(String(value || "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s[-|–—]\s*(canggu|berawa|pererenan|seminyak|ubud|sanur|uluwatu|jimbaran|nusa dua|kuta|legian).*$/i, " "));
}

function districtFamily(value) {
  const d = String(value || "").toLowerCase();
  if (d.includes("canggu") || d.includes("berawa") || d.includes("pererenan") || d.includes("umalas")) return "canggu";
  if (d.includes("uluwatu") || d.includes("bukit") || d.includes("pecatu") || d.includes("ungasan") || d.includes("bingin")) return "uluwatu-bukit";
  if (d.includes("seminyak") || d.includes("petitenget")) return "seminyak";
  if (d.includes("kuta") || d.includes("legian")) return "kuta-legian";
  if (d.includes("nusa-dua") || d.includes("nusa dua")) return "nusa-dua";
  if (d.includes("jimbaran")) return "jimbaran";
  if (d.includes("ubud")) return "ubud";
  if (d.includes("sanur")) return "sanur";
  return d;
}

function urlHost(value) {
  if (!value) return null;
  try {
    const u = new URL(value);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function meters(aLat, aLng, bLat, bLng) {
  if (![aLat, aLng, bLat, bLng].every((n) => Number.isFinite(n))) return null;
  const x = (aLng - bLng) * 111320 * Math.cos((aLat * Math.PI) / 180);
  const y = (aLat - bLat) * 111320;
  return Math.sqrt(x * x + y * y);
}

const staged = JSON.parse(readFileSync(stagedPath, "utf8")).staged;
const venueSnapshot = JSON.parse(readFileSync(venuesPath, "utf8"));
const venues = venueSnapshot.data.venues.map((v) => ({
  ...v,
  normalized_name: normalizedName(v.name),
  base_name: baseName(v.name),
  district_family: districtFamily(v.district || v.subarea || v.fullAddress),
  name_slug: slugify(v.name),
  official_host: urlHost(v.officialUrl),
  instagram_host: urlHost(v.instagramUrl),
}));

function scoreCandidate(candidate, venue) {
  const evidence = [];
  let score = 0;
  const candidateName = normalizedName(candidate.name);
  const candidateBaseName = baseName(candidate.name);
  const candidateSlug = candidate.proposed_slug || candidate.dedup_signals?.slug;
  const candidateDistrict = candidate.district;
  const candidateDistrictFamily = districtFamily(candidateDistrict);
  const candidateAddress = normalizedName(candidate.dedup_signals?.address);
  const venueAddress = normalizedName(venue.fullAddress);
  const candidateOfficialHost = urlHost(candidate.dedup_signals?.official_url);
  const candidateInstagramHost = urlHost(candidate.dedup_signals?.instagram_url);

  if (candidateSlug && venue.slug === candidateSlug) {
    score += 55;
    evidence.push("slug_exact");
  }
  if (candidateSlug && venue.name_slug === candidateSlug) {
    score += 45;
    evidence.push("name_slug_exact");
  }
  if (candidateName && venue.normalized_name === candidateName) {
    score += 45;
    evidence.push("name_exact");
  }
  if (candidateBaseName && venue.base_name === candidateBaseName) {
    score += 45;
    evidence.push("base_name_exact");
  } else if (candidateBaseName && venue.base_name && (candidateBaseName.includes(venue.base_name) || venue.base_name.includes(candidateBaseName))) {
    score += 25;
    evidence.push("base_name_contains");
  }
  if (candidateDistrict && venue.district === candidateDistrict) {
    score += 10;
    evidence.push("district_match");
  } else if (candidateDistrictFamily && venue.district_family === candidateDistrictFamily) {
    score += 8;
    evidence.push("district_family_match");
  }
  if (candidateAddress && venueAddress && candidateAddress === venueAddress) {
    score += 25;
    evidence.push("address_exact");
  }
  if (candidateOfficialHost && venue.official_host && candidateOfficialHost === venue.official_host) {
    score += 30;
    evidence.push("official_host_match");
  }
  if (candidateInstagramHost && venue.instagram_host && candidateInstagramHost === venue.instagram_host) {
    score += 30;
    evidence.push("instagram_host_match");
  }
  const distance = meters(
    Number(candidate.dedup_signals?.coordinates?.split(",")[0]),
    Number(candidate.dedup_signals?.coordinates?.split(",")[1]),
    Number(venue.latitude),
    Number(venue.longitude),
  );
  if (distance !== null && distance <= 80) {
    score += 35;
    evidence.push("geo_80m");
  }
  return { score, evidence, distance_m: distance === null ? null : Math.round(distance) };
}

function classify(candidate) {
  const matches = venues
    .map((venue) => ({ venue, ...scoreCandidate(candidate, venue) }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score || a.venue.slug.localeCompare(b.venue.slug));
  const best = matches[0] || null;
  let dedup_bucket = "new_candidate";
  let suggested_action = "create_new";
  if (!candidate.name || !candidate.proposed_slug) {
    dedup_bucket = "needs_review";
    suggested_action = "hold";
  } else if (best?.score >= 80) {
    dedup_bucket = "matched";
    suggested_action = "update_existing";
  } else if (best?.score >= 45) {
    dedup_bucket = "possible_match";
    suggested_action = best.evidence.includes("base_name_exact") && !best.evidence.includes("district_family_match") ? "create_branch" : "hold";
  }
  return {
    candidate_id: candidate.candidate_id,
    source_hash: candidate.source_hash,
    name: candidate.name,
    proposed_slug: candidate.proposed_slug,
    district: candidate.district,
    dedup_bucket,
    suggested_action,
    best_match: best ? {
      venue_slug: best.venue.slug,
      venue_name: best.venue.name,
      venue_district: best.venue.district,
      score: best.score,
      evidence: best.evidence,
      distance_m: best.distance_m,
    } : null,
    match_candidates: matches.slice(0, 5).map((m) => ({
      venue_slug: m.venue.slug,
      venue_name: m.venue.name,
      venue_district: m.venue.district,
      score: m.score,
      evidence: m.evidence,
      distance_m: m.distance_m,
    })),
    publication_status: "draft",
    verification_status: "verification_pending",
    editorial_status: "editorial_pending",
    seo_status: "hold",
    partner_status: "not_contacted",
    photo_permission_status: "not_granted",
    can_publish: false,
  };
}

const classified = staged.map(classify);
const countsBy = (key) => classified.reduce((acc, row) => {
  acc[row[key]] = (acc[row[key]] || 0) + 1;
  return acc;
}, {});
const output = {
  generated_at: new Date().toISOString(),
  mode: "production_public_api_snapshot_read_only",
  source: {
    staged_candidates: stagedPath,
    venues_snapshot: venuesPath,
    venues_snapshot_updated_at: venueSnapshot.updatedAt,
    venue_count: venues.length,
  },
  counts: {
    total: classified.length,
    by_dedup_bucket: countsBy("dedup_bucket"),
    by_suggested_action: countsBy("suggested_action"),
    publishable: classified.filter((r) => r.can_publish).length,
  },
  guardrails: [
    "No production database writes were performed.",
    "No candidate is publishable.",
    "Public API snapshot only detects collisions against currently public venues; non-public production rows require Supabase SELECT pass.",
  ],
  classified,
};
writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n");
console.log(JSON.stringify(output.counts));
