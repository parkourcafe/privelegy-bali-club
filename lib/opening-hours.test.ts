import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { schemaOpeningHours, schemaOpeningHoursSpecification } from "./opening-hours";

describe("schemaOpeningHours", () => {
  it("maps canonical venue JSON to schema.org rules", () => {
    assert.equal(schemaOpeningHours({
      Monday: ["7.00am-10.00pm"],
      Tuesday: ["7.00am-10.00pm"],
    }), "Mo 07:00-22:00, Tu 07:00-22:00");
  });

  it("keeps split service as separate rules", () => {
    assert.equal(
      schemaOpeningHours({ Monday: ["8.00am-2.00pm", "6.00pm-10.00pm"] }),
      "Mo 08:00-14:00, Mo 18:00-22:00",
    );
  });

  it("accepts only strictly normalized legacy values", () => {
    assert.equal(schemaOpeningHours(null, "Mo-Su 07:00-22:00"), "Mo-Su 07:00-22:00");
    assert.equal(schemaOpeningHours(null, "open daily from seven"), undefined);
  });
});

describe("schemaOpeningHoursSpecification", () => {
  it("emits one JSON-LD entry per split service interval", () => {
    assert.deepEqual(
      schemaOpeningHoursSpecification({
        Monday: ["7.00am-11.00am", "6.00pm-10.00pm"],
      }),
      [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "https://schema.org/Monday",
          opens: "07:00",
          closes: "11:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "https://schema.org/Monday",
          opens: "18:00",
          closes: "22:00",
        },
      ],
    );
  });

  it("omits malformed or empty schedules", () => {
    assert.equal(schemaOpeningHoursSpecification({ Monday: ["until late"] }), undefined);
    assert.equal(schemaOpeningHoursSpecification(null), undefined);
  });
});
