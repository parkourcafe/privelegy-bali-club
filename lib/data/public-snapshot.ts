import { readFileSync } from "node:fs";
import path from "node:path";
import { isSeedFallbackAllowed } from "../supabase/server";

// Public pages read published data from a snapshot committed to the repo, not
// from Supabase on every render. On 2026-10-10 Supabase restricted the project
// for exceeding the egress quota; every anon read returned 402, the readers
// fail closed to empty, and every venue page answered 404 for over a day.
// Supabase stays the system of record and the write path (onboarding, partner
// portal, saves, consent, analytics); the snapshot only serves what an anon
// visitor may read, exported under the anon role so RLS decides the rows.
//
// Rows are raw snake_case, exactly as PostgREST returns them, so the existing
// mappers and publication gates run unchanged. Time-bound rows (menus, action
// capabilities) keep their expires_at and are re-checked by those mappers at
// render time, so an expired menu drops out even if the snapshot is old.
//
// Refresh: `npm run snapshot:public` (needs the anon env), commit, deploy.
// OTHER_BALI_PUBLIC_DATA_SOURCE=live switches back to live Supabase reads.

export type SnapshotRow = Record<string, unknown>;

export interface PublicSnapshotCatalog {
  plan_entries: SnapshotRow[];
  routes: SnapshotRow[];
  route_stops: SnapshotRow[];
  districts: SnapshotRow[];
  venue_action_capabilities: SnapshotRow[];
  menus: SnapshotRow[];
  menu_sections: SnapshotRow[];
}

export const PUBLIC_SNAPSHOT_DIR = path.join(process.cwd(), "data", "public-snapshot");

export function isPublicSnapshotEnabled(
  env: { source?: string; seedAllowed?: boolean } = {
    source: process.env.OTHER_BALI_PUBLIC_DATA_SOURCE,
    seedAllowed: isSeedFallbackAllowed(),
  },
): boolean {
  if (env.source?.trim().toLowerCase() === "live") return false;
  // Local fixture mode keeps its own invented dataset; never mix the two.
  return !env.seedAllowed;
}

const loaded = new Map<string, unknown>();

function readSnapshotFile<T>(name: string): T | null {
  if (loaded.has(name)) return loaded.get(name) as T | null;
  let value: T | null = null;
  try {
    value = JSON.parse(readFileSync(path.join(PUBLIC_SNAPSHOT_DIR, name), "utf8")) as T;
  } catch (e) {
    console.warn(
      `[public-snapshot] ${name} unavailable, falling back to live reads: ${
        (e as Error)?.message ?? e
      }`,
    );
  }
  loaded.set(name, value);
  return value;
}

export function snapshotVenues(): SnapshotRow[] | null {
  if (!isPublicSnapshotEnabled()) return null;
  return readSnapshotFile<SnapshotRow[]>("venues.json");
}

export function snapshotCatalog(): PublicSnapshotCatalog | null {
  if (!isPublicSnapshotEnabled()) return null;
  return readSnapshotFile<PublicSnapshotCatalog>("catalog.json");
}

let itemsByMenu: Map<string, SnapshotRow[]> | null = null;

export function snapshotMenuItems(menuId: string): SnapshotRow[] | null {
  if (!isPublicSnapshotEnabled()) return null;
  if (!itemsByMenu) {
    const rows = readSnapshotFile<SnapshotRow[]>("menu-items.json");
    if (!rows) return null;
    itemsByMenu = new Map();
    for (const row of rows) {
      const key = String(row.menu_id);
      const list = itemsByMenu.get(key);
      if (list) list.push(row);
      else itemsByMenu.set(key, [row]);
    }
  }
  return itemsByMenu.get(menuId) ?? [];
}

export function byPosition(a: SnapshotRow, b: SnapshotRow): number {
  return Number(a.position ?? 0) - Number(b.position ?? 0);
}
