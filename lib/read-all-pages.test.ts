import test from "node:test";
import assert from "node:assert/strict";
import {
  readAllPages,
  PUBLIC_READ_PAGE_SIZE,
  PUBLIC_READ_MAX_PAGES,
} from "./read-all-pages";

// A fake table of `total` rows that answers inclusive ranges the way PostgREST
// does, and records the ranges it was asked for.
function fakeTable(total: number) {
  const calls: [number, number][] = [];
  const rows = Array.from({ length: total }, (_, i) => ({ id: i }));
  return {
    calls,
    page: (from: number, to: number) => {
      calls.push([from, to]);
      return Promise.resolve({ data: rows.slice(from, to + 1), error: null });
    },
  };
}

test("reads past the single-response cap", async () => {
  // The case this module exists for: 1220 published venues, of which an
  // unpaginated read returned the first 1000 and said nothing about the rest.
  const table = fakeTable(1220);
  const rows = await readAllPages("test", table.page);
  assert.equal(rows.length, 1220);
  assert.deepEqual(
    rows.map((r) => r.id).slice(-3),
    [1217, 1218, 1219],
  );
});

test("stops on the first short page rather than polling to the ceiling", async () => {
  const table = fakeTable(120);
  const rows = await readAllPages("test", table.page);
  assert.equal(rows.length, 120);
  assert.equal(table.calls.length, 1);
});

test("an exactly-full final page still terminates", async () => {
  // Off-by-one trap: a total that is an exact multiple of the page size gives
  // no short page, so termination depends on the following empty read.
  const table = fakeTable(PUBLIC_READ_PAGE_SIZE * 2);
  const rows = await readAllPages("test", table.page);
  assert.equal(rows.length, PUBLIC_READ_PAGE_SIZE * 2);
  assert.equal(table.calls.length, 3);
});

test("requests contiguous, non-overlapping ranges", async () => {
  const table = fakeTable(1100);
  await readAllPages("test", table.page);
  assert.deepEqual(table.calls, [
    [0, 499],
    [500, 999],
    [1000, 1499],
  ]);
});

test("an empty table yields no rows and one request", async () => {
  const table = fakeTable(0);
  const rows = await readAllPages("test", table.page);
  assert.deepEqual(rows, []);
  assert.equal(table.calls.length, 1);
});

test("a null data page is treated as the end, not as a crash", async () => {
  const rows = await readAllPages<{ id: number }>("test", () =>
    Promise.resolve({ data: null, error: null }),
  );
  assert.deepEqual(rows, []);
});

test("an error is thrown, never returned as a partial catalogue", async () => {
  // Half a catalogue presented as the whole one is the failure this module was
  // written to remove; it must not come back through the error path.
  await assert.rejects(
    () =>
      readAllPages<{ id: number }>("test", (from) =>
        Promise.resolve(
          from === 0
            ? { data: Array.from({ length: PUBLIC_READ_PAGE_SIZE }, (_, i) => ({ id: i })), error: null }
            : { data: null, error: new Error("read failed") },
        ),
      ),
    /read failed/,
  );
});

test("hitting the ceiling is loud, not silent", async () => {
  const table = fakeTable(PUBLIC_READ_PAGE_SIZE * PUBLIC_READ_MAX_PAGES + 1);
  const warnings: string[] = [];
  const rows = await readAllPages("test", table.page, (m) => warnings.push(m));
  assert.equal(rows.length, PUBLIC_READ_PAGE_SIZE * PUBLIC_READ_MAX_PAGES);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /truncated/);
  assert.match(warnings[0], /test/);
});
