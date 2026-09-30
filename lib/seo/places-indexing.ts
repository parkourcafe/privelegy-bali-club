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

export function placesPaginationWindow(input: {
  itemCount: number;
  page: number;
  pageSize: number;
  firstPageIsDirectory: boolean;
}): { start: number; end: number; totalPages: number } {
  const directoryPages = input.firstPageIsDirectory ? 1 : 0;
  const dataPages = Math.ceil(input.itemCount / input.pageSize);
  const totalPages = Math.max(1, directoryPages + dataPages);
  const dataPageIndex = input.page - directoryPages - 1;

  if (dataPageIndex < 0) {
    return { start: 0, end: 0, totalPages };
  }

  const start = dataPageIndex * input.pageSize;
  return {
    start,
    end: Math.min(start + input.pageSize, input.itemCount),
    totalPages,
  };
}
