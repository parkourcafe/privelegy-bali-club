import assert from "node:assert/strict";
import test from "node:test";
import { track } from "../analytics";

test("withdrawn browser consent blocks both first-party and GA sends", () => {
  const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, "document");
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const fetchDescriptor = Object.getOwnPropertyDescriptor(globalThis, "fetch");
  let fetches = 0;
  let gaEvents = 0;

  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { cookie: "__Host-ob_consent=essential_only" },
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { gtag: () => { gaEvents += 1; } },
  });
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    value: () => {
      fetches += 1;
      return Promise.resolve(new Response(null, { status: 200 }));
    },
  });

  try {
    track("venue_card_click", { venueSlug: "fixture-venue" });
    assert.equal(fetches, 0);
    assert.equal(gaEvents, 0);
  } finally {
    if (documentDescriptor) Object.defineProperty(globalThis, "document", documentDescriptor);
    else Reflect.deleteProperty(globalThis, "document");
    if (windowDescriptor) Object.defineProperty(globalThis, "window", windowDescriptor);
    else Reflect.deleteProperty(globalThis, "window");
    if (fetchDescriptor) Object.defineProperty(globalThis, "fetch", fetchDescriptor);
    else Reflect.deleteProperty(globalThis, "fetch");
  }
});
