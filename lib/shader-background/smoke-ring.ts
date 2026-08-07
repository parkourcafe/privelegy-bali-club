// "Smoke Ring" animated background — recipe constants and uniform packing.
//
// Made with the 21st.dev Shader Builder.
// Adapted from Paper Shaders: https://shaders.paper.design/smoke-ring
// Licensed under Apache-2.0: https://github.com/paper-design/shaders
//
// The GLSL lives in ./smoke-ring-shader.ts; the renderer in
// components/ShaderBackground.tsx. Values are kept here so the visual recipe
// is one reviewable list rather than magic numbers scattered through render
// code, and so the packing can be tested without a GPU.

/** WebGL1 guarantees only 16 fragment uniform vectors; the shader uses 15. */
export const COLOUR_SLOTS = 8;

/** Palette, low → high. Source hex: #0A0A12 #5B2A86 #D64FA8 #FFC2E2. */
export const SMOKE_RING_COLOURS: ReadonlyArray<readonly [number, number, number]> = [
  [0.039, 0.039, 0.071],
  [0.357, 0.165, 0.525],
  [0.839, 0.31, 0.659],
  [1.0, 0.761, 0.886],
];

/** u_scene.w — how many palette entries the shader mixes through. */
export const SMOKE_RING_COLOUR_COUNT = SMOKE_RING_COLOURS.length;

/**
 * Seconds → shader time. Negative on purpose: the ring drifts inward, which is
 * what "speed 38" looks like in this preset.
 */
export const TIME_SCALE = -0.82;

/** scale, intensity, paramA, warp */
export const SMOKE_RING_SHAPE = [1.48, 0.52, 0.51, 0.19] as const;
/** detail, contrast, brightness, saturation */
export const SMOKE_RING_SURFACE = [2.75, 1.17, 0.02, 1.16] as const;
/** hue, vignette, blur, grain */
export const SMOKE_RING_FINISH = [4.97, 0.13, 0.002, 0.03] as const;
/** seed, rotation, drift, OKLab toggle (0 = plain sRGB mixing) */
export const SMOKE_RING_TRANSFORM = [2772.0, 0.65, 0.08, 0.0] as const;
/** Static half of u_space: offset.xy. The pointer fills .zw per frame. */
export const SMOKE_RING_OFFSET = [0.17, 0.08] as const;

/**
 * Cursor mode 0 = push. Modes 1–3 read u_cursorRadius; push does not, so the
 * radius below is carried for completeness and has no effect in this preset.
 */
export const CURSOR_EFFECT_PUSH = 0.0;
export const CURSOR_STRENGTH = 0.8;
export const CURSOR_RADIUS = 0.3;

/** Retina is enough; beyond 2 the fragment cost doubles for no visible gain. */
export const MAX_DEVICE_PIXEL_RATIO = 2;

export type Vec4 = [number, number, number, number];

/** Clamp devicePixelRatio into a sane, renderable range. */
export function cappedPixelRatio(raw: number): number {
  if (!Number.isFinite(raw) || raw <= 0) return 1;
  return Math.min(raw, MAX_DEVICE_PIXEL_RATIO);
}

/** u_scene = resolution.xy, time, colour count. */
export function packScene(width: number, height: number, seconds: number): Vec4 {
  return [width, height, seconds * TIME_SCALE, SMOKE_RING_COLOUR_COUNT];
}

/** u_space = offset.xy, pointer.xy (pointer already in -1..1 canvas space). */
export function packSpace(pointerX: number, pointerY: number): Vec4 {
  return [SMOKE_RING_OFFSET[0], SMOKE_RING_OFFSET[1], pointerX, pointerY];
}

/** u_cursor = presence, effect, strength, radius. */
export function packCursor(presence: number): Vec4 {
  return [
    Math.min(Math.max(presence, 0), 1),
    CURSOR_EFFECT_PUSH,
    CURSOR_STRENGTH,
    CURSOR_RADIUS,
  ];
}

/**
 * Viewport pixel → the -1..1 canvas space the shader expects. Y is flipped:
 * pointer events count down from the top, gl_FragCoord counts up from the
 * bottom, and the shader compares the cursor against gl_FragCoord-derived
 * coordinates.
 */
export function pointerToCanvasSpace(
  clientX: number,
  clientY: number,
  width: number,
  height: number
): [number, number] {
  if (width <= 0 || height <= 0) return [0, 0];
  return [(clientX / width) * 2 - 1, 1 - (clientY / height) * 2];
}

/**
 * The full u_colors array. WebGL1 forbids dynamic indexing into a uniform
 * array in a fragment shader, so the shader declares a fixed 8 and walks it
 * with a constant loop; unused slots repeat the last colour rather than
 * holding black, which would darken the mix if the count ever changed.
 */
export function paddedColours(): Array<readonly [number, number, number]> {
  const last = SMOKE_RING_COLOURS[SMOKE_RING_COLOURS.length - 1];
  return Array.from(
    { length: COLOUR_SLOTS },
    (_, i) => SMOKE_RING_COLOURS[i] ?? last
  );
}
