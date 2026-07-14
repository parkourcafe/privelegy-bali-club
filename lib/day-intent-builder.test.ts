import assert from "node:assert/strict";
import test from "node:test";
import { buildIntentHref } from "../components/landing/DayIntentBuilder";

test("an untouched planner opens the unranked catalogue without hidden defaults", () => {
  assert.equal(buildIntentHref([], "", ""), "/places");
});

test("the planner serializes only explicitly selected criteria", () => {
  const href = buildIntentHref([
    {
      value: "view",
      label: "A view",
      hint: "Ocean, ricefield, sunset",
      query: ["view"],
    },
    {
      value: "ubud",
      label: "Ubud",
      hint: "Culture, jungle, slower days",
      query: [],
      district: "ubud",
    },
  ], "", "");

  const url = new URL(href, "https://www.otherbali.com");
  assert.equal(url.pathname, "/places");
  assert.equal(url.searchParams.get("q"), "view");
  assert.equal(url.searchParams.get("district"), "ubud");
  assert.equal(url.searchParams.get("intent"), "1");
  assert.equal(url.searchParams.has("category"), false);
  assert.equal(url.searchParams.has("m"), false);
  assert.equal(url.searchParams.has("dur"), false);
});

test("duplicate query signals are de-duplicated and bounded", () => {
  const choices = Array.from({ length: 12 }, (_, index) => ({
    value: `choice-${index}`,
    label: `Choice ${index}`,
    hint: "",
    query: [index === 1 ? "tag-0" : `tag-${index}`],
  }));
  const url = new URL(buildIntentHref(choices, "", ""), "https://www.otherbali.com");
  assert.deepEqual(url.searchParams.get("q")?.split(" "), [
    "tag-0", "tag-2", "tag-3", "tag-4", "tag-5", "tag-6", "tag-7", "tag-8",
  ]);
});
