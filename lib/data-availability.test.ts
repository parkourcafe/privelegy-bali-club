import assert from "node:assert/strict";
import test from "node:test";
import {
  PUBLIC_DATA_UNAVAILABLE,
  PublicDataUnavailableError,
  failPublicDataRead,
  isPublicDataUnavailable,
  requireConfiguredPublicDataSource,
} from "./data-availability";

test("Vercel deployments fail closed when the public data source is not configured", () => {
  for (const environment of ["preview", "production"]) {
    assert.throws(
      () => requireConfiguredPublicDataSource(false, "venues", environment),
      (error: unknown) => error instanceof PublicDataUnavailableError
        && error.message === PUBLIC_DATA_UNAVAILABLE
        && error.context === "venues",
    );
  }
});

test("local no-secret builds remain possible without enabling fixture data", () => {
  assert.doesNotThrow(() => requireConfiguredPublicDataSource(false, "venues", undefined));
  assert.doesNotThrow(() => requireConfiguredPublicDataSource(true, "venues", "production"));
});

test("required read failures use one user-safe error classification", () => {
  let failure: unknown;
  try {
    failPublicDataRead("route_definitions");
  } catch (error) {
    failure = error;
  }
  assert.equal(isPublicDataUnavailable(failure), true);
  assert.equal((failure as Error).message, PUBLIC_DATA_UNAVAILABLE);
});
