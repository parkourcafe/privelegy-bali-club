// Navigation registry gates (IA spec v1 §19.1-2): every href in the shared
// taxonomy must resolve to a real static route (no dead links, no
// menu-reachable empty hubs), labels must be unique within a group, and the
// homepage gateway must stay consistent with the registry.
import { strict as assert } from "node:assert";
import { test } from "node:test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  NAV_GROUPS,
  NAV_ACTIONS,
  GATEWAY_PRIMARY,
  GATEWAY_SECONDARY,
} from "./navigation.ts";

const APP = join(process.cwd(), "app");

function routeExists(href: string): boolean {
  if (!href.startsWith("/")) return false;
  const clean = href.split(/[?#]/)[0];
  return existsSync(join(APP, clean.slice(1), "page.tsx"));
}

const allLinks = [
  ...NAV_GROUPS.flatMap((g) => g.links),
  ...NAV_ACTIONS,
  ...GATEWAY_PRIMARY,
  ...GATEWAY_SECONDARY,
];

test("every navigation href resolves to an existing static route", () => {
  for (const l of allLinks) {
    assert.ok(routeExists(l.href), `dead link in navigation: ${l.href}`);
  }
});

test("groups are non-empty and labels unique within each group", () => {
  for (const g of NAV_GROUPS) {
    assert.ok(g.links.length > 0, `empty nav group: ${g.key}`);
    const labels = g.links.map((l) => l.label);
    assert.equal(new Set(labels).size, labels.length, `duplicate label in ${g.key}`);
    const hrefs = g.links.map((l) => l.href);
    assert.equal(new Set(hrefs).size, hrefs.length, `duplicate href in ${g.key}`);
  }
});

test("group keys are unique and gateway groups reference real groups", () => {
  const keys = NAV_GROUPS.map((g) => g.key);
  assert.equal(new Set(keys).size, keys.length, "duplicate group key");
  for (const c of GATEWAY_PRIMARY) {
    assert.ok(keys.includes(c.group), `gateway card references unknown group: ${c.group}`);
  }
});

test("gateway art assets exist", () => {
  for (const c of GATEWAY_PRIMARY) {
    assert.ok(
      existsSync(join(process.cwd(), "public", c.art.slice(1))),
      `missing gateway art: ${c.art}`,
    );
  }
});
