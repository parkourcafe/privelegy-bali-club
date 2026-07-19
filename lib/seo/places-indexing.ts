export function parsePlacesPageNumber(value: string): number | null {
  if (!value) return 1;
  if (!/^[1-9]\d*$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function placesCanonical(input: {
  hasFilters: boolean;
  hubPath?: string;
  requestedPage: number;
}): string {
  if (input.hubPath) return input.hubPath;
  if (!input.hasFilters && input.requestedPage > 1) {
    return `/places?page=${input.requestedPage}`;
  }
  return "/places";
}
