import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parseEventRequest } from "./actions/event-safety";
import { storeEvent } from "./actions/event-store";
import type {
  EventRpcClient,
  EventRpcResult,
  LegacyLogEventArgs,
  LogEventV2Args,
} from "./actions/event-compat";
import { ROUTE_VIEW_EVENT, routeViewTracking } from "./route-view-event";

type RpcCall = {
  name: "log_event_v2" | "log_event";
  args: LogEventV2Args | LegacyLogEventArgs;
};

function rpcClient(): { calls: RpcCall[]; client: EventRpcClient } {
  const calls: RpcCall[] = [];
  const rpc = async (
    name: "log_event_v2" | "log_event",
    args: LogEventV2Args | LegacyLogEventArgs
  ): Promise<EventRpcResult> => {
    calls.push({ name, args });
    return { error: null };
  };
  return { calls, client: { rpc } as EventRpcClient };
}

test("a resolved route is tracked as editorial_page_view under route/<slug>", () => {
  assert.deepEqual(routeViewTracking({ slug: "first-day" }), {
    event: "editorial_page_view",
    slug: "route/first-day",
  });
  assert.equal(ROUTE_VIEW_EVENT, "editorial_page_view");
});

test("a route that did not resolve produces no event", () => {
  // The page's "Route not found" branch passes null — nothing to write.
  assert.equal(routeViewTracking(null), null);
  assert.equal(routeViewTracking(undefined), null);
});

test("a slug the event validator would reject never mounts a tracker", () => {
  for (const slug of ["", "First-Day", "first day", "first-day/", "../etc", `a${"b".repeat(120)}`]) {
    assert.equal(routeViewTracking({ slug }), null, JSON.stringify(slug));
  }
});

test("the route view passes /api/event validation as an existing bounded event", () => {
  const view = routeViewTracking({ slug: "canggu-food-route" });
  assert.ok(view);

  assert.deepEqual(parseEventRequest({ type: view.event, venueSlug: view.slug }), {
    ok: true,
    event: { type: "editorial_page_view", venueSlug: "route/canggu-food-route", payload: null },
  });
  // Same rule as every other page view: no free-form payload rides along.
  assert.equal(
    parseEventRequest({ type: view.event, venueSlug: view.slug, payload: { stops: 3 } }).ok,
    false
  );
});

test("the route view is stored through log_event with the guest's source", async () => {
  const view = routeViewTracking({ slug: "first-day" });
  assert.ok(view);
  const parsed = parseEventRequest({ type: view.event, venueSlug: view.slug });
  assert.ok(parsed.ok);

  const { client, calls } = rpcClient();
  const result = await storeEvent(client, {
    type: parsed.event.type,
    guestRef: "g_testguest123456",
    venueSlug: parsed.event.venueSlug,
    source: "villa_canggu_01",
    payload: parsed.event.payload,
  });

  // editorial_page_view is a preserved event: it goes straight to the legacy
  // RPC and must carry the first-touch source with it (seeding §6.1).
  assert.deepEqual(calls, [
    {
      name: "log_event",
      args: {
        p_type: "editorial_page_view",
        p_guest_ref: "g_testguest123456",
        p_venue_slug: "route/first-day",
        p_source: "villa_canggu_01",
      },
    },
  ]);
  assert.deepEqual(result, { stored: true, version: "legacy" });
});

test("the route page mounts the tracker only after the not-found branch returns", () => {
  const source = readFileSync(new URL("../app/route/[slug]/page.tsx", import.meta.url), "utf8");

  const notFoundStart = source.indexOf("if (!route) {");
  const notFoundEnd = source.indexOf("const back = backLinkFor(route.district);");
  assert.ok(notFoundStart > 0 && notFoundEnd > notFoundStart, "not-found branch not where expected");

  const notFoundBranch = source.slice(notFoundStart, notFoundEnd);
  assert.match(notFoundBranch, /Route not found/);
  assert.doesNotMatch(notFoundBranch, /PageViewTracker|routeViewTracking/);

  const publishedBranch = source.slice(notFoundEnd);
  assert.match(publishedBranch, /const view = routeViewTracking\(route\);/);
  assert.match(publishedBranch, /\{view && <PageViewTracker event=\{view\.event\} slug=\{view\.slug\} \/>\}/);
  assert.equal(source.match(/<PageViewTracker/g)?.length, 1);
});
