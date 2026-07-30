import assert from "node:assert/strict";
import test from "node:test";
import { safeTablePilotPublicBase } from "./tablepilot-environment";

test("TablePilot stays off until the owned rail is explicitly enabled", () => {
  assert.equal(safeTablePilotPublicBase({
    vercelEnv: "production",
    configuredBaseUrl: "https://tablepilot-id.vercel.app",
  }), null);
  assert.equal(safeTablePilotPublicBase({
    enabled: "NO",
    vercelEnv: "production",
    configuredBaseUrl: "https://tablepilot-id.vercel.app",
  }), null);
});

test("preview suppresses inherited production TablePilot links", () => {
  assert.equal(safeTablePilotPublicBase({
    enabled: "YES",
    vercelEnv: "preview",
    configuredBaseUrl: "https://tablepilot-id.vercel.app",
  }), null);
  assert.equal(safeTablePilotPublicBase({
    enabled: "YES",
    vercelEnv: "preview",
    configuredBaseUrl: "https://tablepilot-staging.vercel.app",
  }), "https://tablepilot-staging.vercel.app");
});

test("production accepts only the known production TablePilot origin", () => {
  assert.equal(safeTablePilotPublicBase({
    enabled: "YES",
    vercelEnv: "production",
    configuredBaseUrl: "https://tablepilot-id.vercel.app",
  }), "https://tablepilot-id.vercel.app");
  assert.equal(safeTablePilotPublicBase({
    enabled: "YES",
    vercelEnv: "production",
    configuredBaseUrl: "https://tablepilot-staging.vercel.app",
  }), null);
});
