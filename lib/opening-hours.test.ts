import { test } from "node:test";
import assert from "node:assert/strict";
import { parseRange, buildOpeningHoursSpec } from "./opening-hours";

test("trailing am/pm applies to both bounds", () => {
  // The error that matters: "5.00-11.00pm" is an evening service, and
  // reading the first bound as morning opens the venue twelve hours early.
  assert.deepEqual(parseRange("5.00-11.00pm"), { opens: "17:00", closes: "23:00" });
  assert.deepEqual(parseRange("6.30-11.00pm"), { opens: "18:30", closes: "23:00" });
  assert.deepEqual(parseRange("12.00-3.00pm"), { opens: "12:00", closes: "15:00" });
});

test("explicit markers on both bounds are respected", () => {
  assert.deepEqual(parseRange("10.00am-11.00pm"), { opens: "10:00", closes: "23:00" });
  assert.deepEqual(parseRange("8am-8pm"), { opens: "08:00", closes: "20:00" });
  assert.deepEqual(parseRange("7 a.m.-2 p.m."), { opens: "07:00", closes: "14:00" });
});

test("24-hour input passes through", () => {
  assert.deepEqual(parseRange("07:30-22:00"), { opens: "07:30", closes: "22:00" });
});

test("midnight and past-midnight closings truncate to end of day", () => {
  assert.deepEqual(parseRange("8.00am-12.00am"), { opens: "08:00", closes: "23:59" });
  assert.deepEqual(parseRange("8.00pm-4.00am"), { opens: "20:00", closes: "23:59" });
});

test("noon is 12:00, midnight start is 00:00", () => {
  assert.deepEqual(parseRange("12.00pm-10.00pm"), { opens: "12:00", closes: "22:00" });
  assert.deepEqual(parseRange("12.00am-6.00am"), { opens: "00:00", closes: "06:00" });
});

test("unparseable input yields null rather than a guess", () => {
  assert.equal(parseRange("Daily until late"), null);
  assert.equal(parseRange("11:00"), null);
  assert.equal(parseRange("25:00-26:00"), null);
});

test("two shifts in a day become two separate specs", () => {
  const spec = buildOpeningHoursSpec({
    Monday: ["7.00am-11.00am", "6.00pm-10.00pm"],
  });
  assert.equal(spec.length, 2);
  assert.deepEqual(
    spec.map((s) => [s.opens, s.closes]),
    [["07:00", "11:00"], ["18:00", "22:00"]],
  );
  assert.ok(spec.every((s) => s.dayOfWeek === "https://schema.org/Monday"));
});

test("closed days are omitted, not emitted as zero-length", () => {
  const spec = buildOpeningHoursSpec({
    Saturday: ["9.00am-5.00pm"],
    Sunday: ["Closed"],
  });
  assert.equal(spec.length, 1);
  assert.equal(spec[0].dayOfWeek, "https://schema.org/Saturday");
});

test("malformed containers return an empty list", () => {
  assert.deepEqual(buildOpeningHoursSpec(null), []);
  assert.deepEqual(buildOpeningHoursSpec("Mo-Su 09:00-17:00"), []);
  assert.deepEqual(buildOpeningHoursSpec([]), []);
  assert.deepEqual(buildOpeningHoursSpec({ Monday: ["nonsense"] }), []);
});
