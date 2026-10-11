import { test } from "node:test";
import assert from "node:assert/strict";
import { humanOpeningHours, schemaOpeningHours } from "./opening-hours";

const week = (hours: string) =>
  ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => `${d} ${hours}`).join(", ");

test("the same hours every day read as Daily", () => {
  assert.equal(humanOpeningHours(week("07:00-23:00")), "Daily 07:00–23:00");
  assert.equal(humanOpeningHours("Mo-Su 08:00-22:00"), "Daily 08:00–22:00");
});

test("consecutive days with identical hours are grouped", () => {
  const value =
    "Mo 08:00-22:00, Tu 08:00-22:00, We 08:00-22:00, Th 08:00-22:00, Fr 08:00-22:00, Sa 09:00-23:00, Su 09:00-23:00";
  assert.equal(humanOpeningHours(value), "Mon–Fri 08:00–22:00 · Sat–Sun 09:00–23:00");
});

test("23:59 is shown as written, never turned into midnight", () => {
  assert.equal(humanOpeningHours(week("10:00-23:59")), "Daily 10:00–23:59");
});

test("two shifts in one day stay two shifts", () => {
  const value = schemaOpeningHours({
    Monday: ["7.00am-11.00am", "6.00pm-10.00pm"],
    Tuesday: ["7.00am-11.00am", "6.00pm-10.00pm"],
  });
  assert.equal(humanOpeningHours(value), "Mon–Tue 07:00–11:00, 18:00–22:00");
});

test("a day missing from the source is neither called closed nor joined across", () => {
  const value = "Mo 09:00-17:00, Tu 09:00-17:00, Th 09:00-17:00";
  const out = humanOpeningHours(value);
  assert.equal(out, "Mon–Tue 09:00–17:00 · Thu 09:00–17:00");
  assert.doesNotMatch(out ?? "", /closed|Wed/i);
});

test("non-consecutive identical days are not merged into one range", () => {
  assert.equal(
    humanOpeningHours("Mo 08:00-20:00, Tu 10:00-18:00, We 08:00-20:00"),
    "Mon 08:00–20:00 · Tue 10:00–18:00 · Wed 08:00–20:00",
  );
});

test("unparseable or human-written text falls back unchanged", () => {
  assert.equal(humanOpeningHours("Daily from 11:00 until late"), "Daily from 11:00 until late");
  assert.equal(humanOpeningHours("Mo 08:00-20:00, sometimes later"), "Mo 08:00-20:00, sometimes later");
  assert.equal(humanOpeningHours("Su-Mo 08:00-20:00"), "Su-Mo 08:00-20:00");
});

test("empty input stays empty", () => {
  assert.equal(humanOpeningHours(undefined), undefined);
  assert.equal(humanOpeningHours(null), undefined);
  assert.equal(humanOpeningHours("  "), undefined);
});

test("the schema string used for markup is not changed by the display formatter", () => {
  const value = schemaOpeningHours({ Monday: ["10.00am-11.00pm"], Tuesday: ["10.00am-11.00pm"] });
  humanOpeningHours(value);
  assert.equal(value, "Mo 10:00-23:00, Tu 10:00-23:00");
});
