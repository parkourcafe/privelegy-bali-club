import assert from "node:assert/strict";
import test from "node:test";
import {
  CONSENT_CHANGE_EVENT,
  parseConsentCookie,
  setConsent,
  type ConsentValue,
} from "./consent";

test("parses only the explicit first-party consent values", () => {
  assert.equal(parseConsentCookie("foo=1; bp_consent=granted; bar=2"), "granted");
  assert.equal(parseConsentCookie("bp_consent=denied"), "denied");
  assert.equal(parseConsentCookie("bp_consent=maybe"), null);
  assert.equal(parseConsentCookie(null), null);
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
