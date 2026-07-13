import assert from "node:assert/strict";
import test from "node:test";
import { safeTablePilotPublicBase } from "./tablepilot-environment";

test("preview suppresses inherited production TablePilot links", () => {
  assert.equal(safeTablePilotPublicBase({
    vercelEnv: "preview",
    configuredBaseUrl: "https://tablepilot-id.vercel.app",
  }), null);
  assert.equal(safeTablePilotPublicBase({
    vercelEnv: "preview",
    configuredBaseUrl: "https://tablepilot-staging.vercel.app",
  }), "https://tablepilot-staging.vercel.app");
});

test("production accepts only the known production TablePilot origin", () => {
  assert.equal(safeTablePilotPublicBase({
    vercelEnv: "production",
    configuredBaseUrl: "https://tablepilot-id.vercel.app",
  }), "https://tablepilot-id.vercel.app");
  assert.equal(safeTablePilotPublicBase({
    vercelEnv: "production",
    configuredBaseUrl: "https://tablepilot-staging.vercel.app",
  }), null);
});
