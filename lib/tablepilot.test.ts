import assert from "node:assert/strict";
import test from "node:test";
import { tablePilotReportConfig } from "./tablepilot";

test("preview cannot inherit the production TablePilot report or token", () => {
  assert.equal(tablePilotReportConfig({
    vercelEnv: "preview",
    token: "production-token",
    reportUrl: "https://tablepilot-id.vercel.app/api/partner/bali-privilege/report",
  }), null);
  assert.equal(tablePilotReportConfig({
    vercelEnv: "preview",
    previewToken: "preview-token",
    previewReportUrl: "https://tablepilot-id.vercel.app/api/partner/bali-privilege/report",
  }), null);
});

test("preview accepts an explicit non-production report configuration", () => {
  assert.deepEqual(tablePilotReportConfig({
    vercelEnv: "preview",
    previewToken: "preview-token",
    previewReportUrl: "https://tablepilot-staging.vercel.app/api/report",
  }), {
    token: "preview-token",
    reportUrl: "https://tablepilot-staging.vercel.app/api/report",
  });
});
