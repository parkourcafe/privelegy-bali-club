import assert from "node:assert/strict";
import test from "node:test";
import {
  CONSENT_CHANGE_EVENT,
  clearConsent,
  denyAnalyticsUnlessGranted,
  initializeAnalyticsRuntime,
  parseConsentCookie,
  setConsent,
  type ConsentState,
  type ConsentValue,
} from "./consent";

test("parses only the explicit first-party consent values", () => {
  assert.equal(parseConsentCookie("foo=1; bp_consent=granted; bar=2"), "granted");
  assert.equal(parseConsentCookie("bp_consent=denied"), "denied");
  assert.equal(parseConsentCookie("bp_consent=maybe"), null);
  assert.equal(parseConsentCookie(null), null);
});

test("clearConsent expires the choice and immediately notifies mounted analytics", () => {
  const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, "document");
  const locationDescriptor = Object.getOwnPropertyDescriptor(globalThis, "location");
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const target = new EventTarget();
  const documentMock = { cookie: "bp_consent=granted" };
  let observed: ConsentState = "granted";

  target.addEventListener(CONSENT_CHANGE_EVENT, (event) => {
    observed = (event as CustomEvent<ConsentState>).detail;
  });
  Object.defineProperty(globalThis, "document", { configurable: true, value: documentMock });
  Object.defineProperty(globalThis, "location", {
    configurable: true,
    value: { protocol: "https:" },
  });
  Object.defineProperty(globalThis, "window", { configurable: true, value: target });

  try {
    clearConsent();
    assert.match(documentMock.cookie, /^bp_consent=;/);
    assert.match(documentMock.cookie, /Max-Age=0/);
    assert.match(documentMock.cookie, /; Secure$/);
    assert.equal(observed, null);
  } finally {
    if (documentDescriptor) Object.defineProperty(globalThis, "document", documentDescriptor);
    else Reflect.deleteProperty(globalThis, "document");
    if (locationDescriptor) Object.defineProperty(globalThis, "location", locationDescriptor);
    else Reflect.deleteProperty(globalThis, "location");
    if (windowDescriptor) Object.defineProperty(globalThis, "window", windowDescriptor);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

test("withdrawn or cleared consent immediately denies an already-loaded analytics runtime", () => {
  const calls: unknown[][] = [];
  const gtag = (...args: Parameters<NonNullable<Parameters<typeof denyAnalyticsUnlessGranted>[1]>>) => {
    calls.push(args);
  };

  denyAnalyticsUnlessGranted("granted", gtag);
  assert.equal(calls.length, 0);

  denyAnalyticsUnlessGranted("denied", gtag);
  denyAnalyticsUnlessGranted(null, gtag);
  assert.deepEqual(calls, [
    ["consent", "update", { analytics_storage: "denied" }],
    ["consent", "update", { analytics_storage: "denied" }],
  ]);
});

test("deferred analytics readiness re-checks withdrawn consent and never configures GA", () => {
  const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, "document");
  const locationDescriptor = Object.getOwnPropertyDescriptor(globalThis, "location");
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const target = new EventTarget();
  const documentMock = { cookie: "bp_consent=granted" };
  const calls: unknown[][] = [];
  const deferredReady = () => initializeAnalyticsRuntime(
    "G-DEFERRED",
    (...args) => calls.push(args),
    new Date("2026-07-30T00:00:00.000Z"),
  );

  Object.defineProperty(globalThis, "document", { configurable: true, value: documentMock });
  Object.defineProperty(globalThis, "location", {
    configurable: true,
    value: { protocol: "https:" },
  });
  Object.defineProperty(globalThis, "window", { configurable: true, value: target });

  try {
    clearConsent();
    assert.equal(deferredReady(), false);
    assert.deepEqual(calls, [
      ["consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      }],
      ["consent", "update", { analytics_storage: "denied" }],
    ]);
    assert.equal(
      calls.some(([command]) => command === "config" || command === "js"),
      false,
    );
  } finally {
    if (documentDescriptor) Object.defineProperty(globalThis, "document", documentDescriptor);
    else Reflect.deleteProperty(globalThis, "document");
    if (locationDescriptor) Object.defineProperty(globalThis, "location", locationDescriptor);
    else Reflect.deleteProperty(globalThis, "location");
    if (windowDescriptor) Object.defineProperty(globalThis, "window", windowDescriptor);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

test("setConsent persists the choice and notifies mounted analytics", () => {
  const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, "document");
  const locationDescriptor = Object.getOwnPropertyDescriptor(globalThis, "location");
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const target = new EventTarget();
  const documentMock = { cookie: "" };
  let observed: ConsentValue | null = null;

  target.addEventListener(CONSENT_CHANGE_EVENT, (event) => {
    observed = (event as CustomEvent<ConsentValue>).detail;
  });
  Object.defineProperty(globalThis, "document", { configurable: true, value: documentMock });
  Object.defineProperty(globalThis, "location", {
    configurable: true,
    value: { protocol: "https:" },
  });
  Object.defineProperty(globalThis, "window", { configurable: true, value: target });

  try {
    setConsent("granted");
    assert.match(documentMock.cookie, /^bp_consent=granted;/);
    assert.match(documentMock.cookie, /; Secure$/);
    assert.equal(observed, "granted");
  } finally {
    if (documentDescriptor) Object.defineProperty(globalThis, "document", documentDescriptor);
    else Reflect.deleteProperty(globalThis, "document");
    if (locationDescriptor) Object.defineProperty(globalThis, "location", locationDescriptor);
    else Reflect.deleteProperty(globalThis, "location");
    if (windowDescriptor) Object.defineProperty(globalThis, "window", windowDescriptor);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
