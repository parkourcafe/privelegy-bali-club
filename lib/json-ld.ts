const JSON_LD_ESCAPE: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

// JSON inside an HTML <script> element must escape characters that can close
// the element or create parser ambiguities. This preserves the JSON value while
// preventing editorial/database text such as </script> from becoming markup.
export function serializeJsonLd(value: unknown): string {
  const serialized = JSON.stringify(value);
  if (serialized === undefined) throw new TypeError("JSON-LD value is not serializable");
  return serialized.replace(/[<>&\u2028\u2029]/g, (character) => JSON_LD_ESCAPE[character]);
}
