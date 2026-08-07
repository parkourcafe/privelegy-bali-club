import test from "node:test";
import assert from "node:assert/strict";
import {
  COLOUR_SLOTS,
  CURSOR_EFFECT_PUSH,
  CURSOR_STRENGTH,
  MAX_DEVICE_PIXEL_RATIO,
  SMOKE_RING_COLOURS,
  SMOKE_RING_COLOUR_COUNT,
  TIME_SCALE,
  cappedPixelRatio,
  packCursor,
  packScene,
  packSpace,
  paddedColours,
  pointerToCanvasSpace,
} from "./smoke-ring";
import { FRAGMENT_SHADER, FULLSCREEN_TRIANGLE } from "./smoke-ring-shader";

/** The recipe as ordered: #0A0A12, #5B2A86, #D64FA8, #FFC2E2. */
test("palette matches the specified hex colours low to high", () => {
  const asHex = ([r, g, b]: readonly [number, number, number]) =>
    [r, g, b]
      .map((c) => Math.round(c * 255).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();

  assert.deepEqual(SMOKE_RING_COLOURS.map(asHex), [
    "0A0A12",
    "5B2A86",
    "D64FA8",
    "FFC2E2",
  ]);
  assert.equal(SMOKE_RING_COLOUR_COUNT, 4);
});

test("the colour array fills all eight slots so unused ones are never black", () => {
  const padded = paddedColours();
  assert.equal(padded.length, COLOUR_SLOTS);
  const last = SMOKE_RING_COLOURS[SMOKE_RING_COLOURS.length - 1];
  for (let i = SMOKE_RING_COLOUR_COUNT; i < COLOUR_SLOTS; i++) {
    assert.deepEqual(padded[i], last);
  }
});

test("time runs backwards at the preset rate", () => {
  assert.equal(TIME_SCALE, -0.82);
  const [, , time] = packScene(800, 600, 10);
  assert.equal(time, -8.2);
});

test("u_scene carries resolution and colour count alongside time", () => {
  assert.deepEqual(packScene(1280, 720, 0), [1280, 720, -0, 4]);
});

test("u_space keeps the static offset and appends the pointer", () => {
  assert.deepEqual(packSpace(-0.5, 0.25), [0.17, 0.08, -0.5, 0.25]);
});

test("cursor is push mode at the specified strength", () => {
  const [presence, effect, strength] = packCursor(1);
  assert.equal(presence, 1);
  assert.equal(effect, CURSOR_EFFECT_PUSH);
  assert.equal(effect, 0);
  assert.equal(strength, CURSOR_STRENGTH);
  assert.equal(strength, 0.8);
});

test("cursor presence is clamped so easing overshoot cannot amplify the push", () => {
  assert.equal(packCursor(1.4)[0], 1);
  assert.equal(packCursor(-0.3)[0], 0);
});

test("device pixel ratio is capped at 2 and never degenerate", () => {
  assert.equal(cappedPixelRatio(3), MAX_DEVICE_PIXEL_RATIO);
  assert.equal(cappedPixelRatio(1.5), 1.5);
  assert.equal(cappedPixelRatio(1), 1);
  // Nonsense input falls back to 1 rather than to the cap: an unreadable
  // ratio is not evidence of a high-density screen.
  for (const bad of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.equal(cappedPixelRatio(bad), 1);
  }
});

test("pointer maps to -1..1 with Y flipped for gl_FragCoord", () => {
  // Top-left of the viewport is (-1, +1) in the shader's space.
  assert.deepEqual(pointerToCanvasSpace(0, 0, 1000, 500), [-1, 1]);
  assert.deepEqual(pointerToCanvasSpace(1000, 500, 1000, 500), [1, -1]);
  assert.deepEqual(pointerToCanvasSpace(500, 250, 1000, 500), [0, 0]);
});

test("a zero-sized viewport yields a centred pointer instead of NaN", () => {
  assert.deepEqual(pointerToCanvasSpace(10, 10, 0, 0), [0, 0]);
});

test("the fullscreen triangle covers the viewport in three vertices", () => {
  assert.equal(FULLSCREEN_TRIANGLE.length, 6);
  assert.deepEqual([...FULLSCREEN_TRIANGLE], [-1, -1, 3, -1, -1, 3]);
});

test("the shader keeps its Apache-2.0 attribution to Paper Shaders", () => {
  assert.match(FRAGMENT_SHADER, /shaders\.paper\.design\/smoke-ring/);
  assert.match(FRAGMENT_SHADER, /Apache-2\.0/);
});

test("the shader stays within WebGL1's guaranteed uniform vector budget", () => {
  // 8 colour vec3s + 7 packed vec4s = 15, one under the guaranteed 16.
  const vec4s = FRAGMENT_SHADER.match(/^uniform vec4 u_\w+;/gm) ?? [];
  assert.equal(vec4s.length, 7);
  assert.match(FRAGMENT_SHADER, /uniform vec3 u_colors\[8\];/);
  assert.ok(COLOUR_SLOTS + vec4s.length <= 16);
});
