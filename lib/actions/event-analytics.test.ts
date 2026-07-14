import test from "node:test";
import assert from "node:assert/strict";
import type { SafeActionEventPayload } from "../contracts/menu-action";
import type { SafeEventPayload } from "./event-payload";
import { trackMenuItemOpen, trackMenuOpen, trackVenueAction } from "../analytics";

type PostedEvent = {
  type: string;
  venueSlug?: string;
  payload?: SafeEventPayload;
};
type GaEvent = [command: string, type: string, params: Record<string, unknown>];
type TrackingSinks = { posts: PostedEvent[]; gaEvents: GaEvent[] };

function requestBody(init?: RequestInit): PostedEvent {
  if (typeof init?.body !== "string") throw new Error("Expected a JSON request body");
  return JSON.parse(init.body) as PostedEvent;
}

async function withTrackingSinks(
  run: (sinks: TrackingSinks) => void | Promise<void>
): Promise<void> {
  const fetchDescriptor = Object.getOwnPropertyDescriptor(globalThis, "fetch");
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const posts: PostedEvent[] = [];
  const gaEvents: GaEvent[] = [];

  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    writable: true,
    value: (_url: RequestInfo | URL, init?: RequestInit) => {
      posts.push(requestBody(init));
      return Promise.resolve(new Response(null, { status: 200 }));
    },
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    writable: true,
    value: {
      gtag: (...args: GaEvent) => gaEvents.push(args),
    },
  });

  try {
    await run({ posts, gaEvents });
  } finally {
    if (fetchDescriptor) Object.defineProperty(globalThis, "fetch", fetchDescriptor);
    else Reflect.deleteProperty(globalThis, "fetch");
    if (windowDescriptor) Object.defineProperty(globalThis, "window", windowDescriptor);
    else Reflect.deleteProperty(globalThis, "window");
  }
}

test("emits a generic handoff and keeps TablePilot reservation clicks internal", async () => {
  await withTrackingSinks(({ posts, gaEvents }) => {
    const runtimePayload: SafeActionEventPayload & { url: string } = {
      action: "reserve",
      provider: "tablepilot",
      capabilityId: "capability-123",
      venueSlug: "fixture-venue",
      url: "https://example.com/?token=must-not-leak",
    };
    trackVenueAction(runtimePayload);

    assert.deepEqual(posts, [
      {
        type: "action_handoff",
        venueSlug: "fixture-venue",
        payload: {
          action: "reserve",
          provider: "tablepilot",
          capabilityId: "capability-123",
          venueSlug: "fixture-venue",
        },
      },
      { type: "reservation_click", venueSlug: "fixture-venue" },
    ]);
    assert.deepEqual(
      gaEvents.map((entry) => entry[1]),
      ["action_handoff"]
    );
  });
});

test("menu interactions emit only bounded entity identifiers", async () => {
  await withTrackingSinks(({ posts, gaEvents }) => {
    trackMenuOpen({ venueSlug: "fixture-venue", menuId: "menu-123" });
    trackMenuItemOpen({ venueSlug: "fixture-venue", menuId: "menu-123", menuItemId: "item-456" });

    assert.deepEqual(posts, [
      {
        type: "menu_open",
        venueSlug: "fixture-venue",
        payload: { venueSlug: "fixture-venue", menuId: "menu-123" },
      },
      {
        type: "menu_item_open",
        venueSlug: "fixture-venue",
        payload: { venueSlug: "fixture-venue", menuId: "menu-123", menuItemId: "item-456" },
      },
    ]);
    assert.deepEqual(
      gaEvents.map(([command, type, params]) => ({ command, type, params })),
      [
        {
          command: "event",
          type: "menu_open",
          params: {
            venue_slug: "fixture-venue",
            page_slug: undefined,
            link_label: undefined,
            action: undefined,
            provider: undefined,
            capability_id: undefined,
            menu_id: "menu-123",
            menu_item_id: undefined,
          },
        },
        {
          command: "event",
          type: "menu_item_open",
          params: {
            venue_slug: "fixture-venue",
            page_slug: undefined,
            link_label: undefined,
            action: undefined,
            provider: undefined,
            capability_id: undefined,
            menu_id: "menu-123",
            menu_item_id: "item-456",
          },
        },
      ]
    );
  });
});

test("maps venue actions to the approved specific or legacy event", async () => {
  await withTrackingSinks(({ posts, gaEvents }) => {
    const cases: Array<[
      Pick<SafeActionEventPayload, "action" | "provider">,
      string,
    ]> = [
      [{ action: "reserve", provider: "official" }, "booking_click"],
      [{ action: "whatsapp", provider: "whatsapp" }, "booking_click"],
      [{ action: "delivery", provider: "gojek" }, "delivery_click"],
      [{ action: "takeaway", provider: "official" }, "takeaway_click"],
      [{ action: "preorder", provider: "official" }, "preorder_click"],
      [{ action: "website", provider: "official" }, "official_website_click"],
      [{ action: "maps", provider: "google_maps" }, "direction_click"],
    ];

    for (const [partial, expected] of cases) {
      const before = posts.length;
      trackVenueAction({ ...partial, venueSlug: "fixture-venue" });
      assert.equal(posts[before].type, "action_handoff");
      assert.equal(posts[before + 1].type, expected);

      if (["delivery_click", "takeaway_click", "preorder_click"].includes(expected)) {
        assert.deepEqual(posts[before + 1].payload, posts[before].payload);
      } else {
        assert.equal("payload" in posts[before + 1], false);
      }
    }

    assert.deepEqual(
      gaEvents.map((entry) => entry[1]),
      cases.flatMap(([, expected]) => ["action_handoff", expected])
    );
  });
});

test("a synchronous analytics failure never prevents the specific event attempt", async () => {
  const fetchDescriptor = Object.getOwnPropertyDescriptor(globalThis, "fetch");
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const attempted: string[] = [];
  let fetchCalls = 0;

  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    writable: true,
    value: (_url: RequestInfo | URL, init?: RequestInit) => {
      fetchCalls += 1;
      const body = requestBody(init);
      attempted.push(body.type);
      if (fetchCalls === 1) throw new Error("first fetch failed");
      return Promise.reject(new Error("second fetch failed asynchronously"));
    },
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    writable: true,
    value: { gtag: () => { throw new Error("gtag failed"); } },
  });

  try {
    assert.doesNotThrow(() => {
      trackVenueAction({
        action: "website",
        provider: "official",
        venueSlug: "fixture-venue",
      });
    });
    assert.deepEqual(attempted, ["action_handoff", "official_website_click"]);
  } finally {
    if (fetchDescriptor) Object.defineProperty(globalThis, "fetch", fetchDescriptor);
    else Reflect.deleteProperty(globalThis, "fetch");
    if (windowDescriptor) Object.defineProperty(globalThis, "window", windowDescriptor);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
