export interface PlacesFilterState {
  query: string;
  district: string | null;
  category: string | null;
  intentMode: boolean;
}

export function readPlacesFilterState(search: string): PlacesFilterState {
  const params = new URLSearchParams(search);
  const rawDistrict = params.get("district")?.trim() ?? "";
  return {
    query: params.get("q")?.trim().slice(0, 240) ?? "",
    district: rawDistrict
      ? rawDistrict === "uluwatu" ? "uluwatu-bukit" : rawDistrict
      : null,
    category: params.get("category")?.trim() || null,
    intentMode: params.get("intent") === "1",
  };
}

export function buildPlacesFilterPath(input: {
  pathname: string;
  search: string;
  hash?: string;
  filters: Pick<PlacesFilterState, "query" | "district" | "category">;
  clearBrief?: boolean;
}): string {
  const params = new URLSearchParams(input.search);
  const query = input.filters.query.trim().slice(0, 240);
  if (query) params.set("q", query);
  else params.delete("q");

  if (input.filters.district) {
    params.set(
      "district",
      input.filters.district === "uluwatu-bukit" ? "uluwatu" : input.filters.district,
    );
  } else {
    params.delete("district");
  }

  if (input.filters.category) params.set("category", input.filters.category);
  else params.delete("category");

  if (input.clearBrief) {
    params.delete("intent");
    params.delete("m");
    params.delete("dur");
  }

  const nextSearch = params.toString();
  return `${input.pathname}${nextSearch ? `?${nextSearch}` : ""}${input.hash ?? ""}`;
}
