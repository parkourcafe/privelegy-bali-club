import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL(
  "../supabase/migrations/0061_v12_runtime_persistence.sql",
  import.meta.url,
);
const dataAccessUrl = new URL("../lib/runtime-v1.2/data-access.ts", import.meta.url);

test("v1.2 runtime RPCs are server-only", async () => {
  const [migration, dataAccess] = await Promise.all([
    readFile(migrationUrl, "utf8"),
    readFile(dataAccessUrl, "utf8"),
  ]);

  assert.match(dataAccess, /import \{ serviceClient \} from "@\/lib\/supabase\/service"/);
  assert.doesNotMatch(dataAccess, /anonClient/);

  for (const signature of [
    "v12_runtime_mutate\\(text,text,jsonb,text\\)",
    "v12_runtime_read\\(text,text,text\\)",
  ]) {
    assert.match(
      migration,
      new RegExp(`grant execute on function public\\.${signature} to service_role`, "i"),
    );
    assert.doesNotMatch(
      migration,
      new RegExp(`grant execute on function public\\.${signature} to (?:anon|authenticated)`, "i"),
    );
  }
});

test("v1.2 idempotency key cannot be replayed across operations", async () => {
  const migration = await readFile(migrationUrl, "utf8");
  assert.match(migration, /select operation, response into v_existing_operation, v_existing/i);
  assert.match(migration, /v_existing_operation <> p_operation/i);
  assert.match(migration, /'idempotency_conflict'/i);
});
