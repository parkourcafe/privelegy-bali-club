"use client";

import { useEffect, useRef } from "react";
import {
  FRAGMENT_SHADER,
  FULLSCREEN_TRIANGLE,
  VERTEX_SHADER,
} from "@/lib/shader-background/smoke-ring-shader";
import {
  COLOUR_SLOTS,
  SMOKE_RING_FINISH,
  SMOKE_RING_SHAPE,
  SMOKE_RING_SURFACE,
  SMOKE_RING_TRANSFORM,
  cappedPixelRatio,
  packCursor,
  packScene,
  packSpace,
  paddedColours,
  pointerToCanvasSpace,
} from "@/lib/shader-background/smoke-ring";

// Animated "Smoke Ring" background. Adapted from Paper Shaders
// (https://shaders.paper.design/smoke-ring), Apache-2.0.
//
// Fills its nearest positioned ancestor rather than the viewport: mounted
// app-wide it was invisible wherever a section painted an opaque background,
// and destroyed text contrast wherever one did not. It is a section
// background, and the section owns the scrims that keep text readable.
//
// Decorative only: aria-hidden, pointer-events none, and it never carries
// content. If WebGL is unavailable the canvas simply stays empty and the
// parent's own background shows through, so nothing depends on it rendering.

/** How fast the pointer and its presence catch up, per second. */
const POINTER_EASING = 6;

type Scene = {
  program: WebGLProgram;
  buffer: WebGLBuffer;
  vertex: WebGLShader;
  fragment: WebGLShader;
  uScene: WebGLUniformLocation | null;
  uSpace: WebGLUniformLocation | null;
  uCursor: WebGLUniformLocation | null;
};

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Build the program and set every uniform that never changes. Returns null on
 * any failure so the caller can leave the canvas blank rather than throw.
 */
function createScene(gl: WebGLRenderingContext): Scene | null {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return null;
  }

  const buffer = gl.createBuffer();
  if (!buffer) return null;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_TRIANGLE, gl.STATIC_DRAW);

  gl.useProgram(program);
  const position = gl.getAttribLocation(program, "a_position");
  if (position >= 0) {
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  }

  // Colours are set element by element rather than as one array upload: a
  // driver that optimises away the unused tail reports the array as shorter
  // than its declared 8, and a single oversized uniform3fv would then be an
  // INVALID_OPERATION. Missing locations are simply skipped.
  const colours = paddedColours();
  for (let i = 0; i < COLOUR_SLOTS; i++) {
    const location = gl.getUniformLocation(program, `u_colors[${i}]`);
    if (!location) continue;
    const [r, g, b] = colours[i];
    gl.uniform3f(location, r, g, b);
  }

  const setVec4 = (name: string, v: readonly number[]) => {
    const location = gl.getUniformLocation(program, name);
    if (location) gl.uniform4f(location, v[0], v[1], v[2], v[3]);
  };
  setVec4("u_shape", SMOKE_RING_SHAPE);
  setVec4("u_surface", SMOKE_RING_SURFACE);
  setVec4("u_finish", SMOKE_RING_FINISH);
  setVec4("u_transform", SMOKE_RING_TRANSFORM);

  return {
    program,
    buffer,
    vertex,
    fragment,
    uScene: gl.getUniformLocation(program, "u_scene"),
    uSpace: gl.getUniformLocation(program, "u_space"),
    uCursor: gl.getUniformLocation(program, "u_cursor"),
  };
}

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      }) as WebGLRenderingContext | null) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    let scene = createScene(gl);
    if (!scene) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let elapsed = 0;
    let lastTick = 0;
    let disposed = false;

    // Pointer state is eased so the push follows the cursor instead of
    // snapping to it, and so leaving the window releases the field smoothly.
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let presence = 0;
    let targetPresence = 0;

    const resize = () => {
      const ratio = cappedPixelRatio(window.devicePixelRatio);
      // Layout size of the canvas itself, so the shader follows whatever
      // section it was dropped into instead of assuming the whole viewport.
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const draw = () => {
      if (!scene) return;
      resize();
      const [sx, sy, st, sc] = packScene(canvas.width, canvas.height, elapsed);
      if (scene.uScene) gl.uniform4f(scene.uScene, sx, sy, st, sc);
      const [ox, oy, px, py] = packSpace(pointerX, pointerY);
      if (scene.uSpace) gl.uniform4f(scene.uSpace, ox, oy, px, py);
      const [cp, ce, cs, cr] = packCursor(presence);
      if (scene.uCursor) gl.uniform4f(scene.uCursor, cp, ce, cs, cr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const tick = (now: number) => {
      frame = 0;
      const delta = lastTick === 0 ? 0 : Math.min((now - lastTick) / 1000, 0.1);
      lastTick = now;
      elapsed += delta;

      const ease = Math.min(1, delta * POINTER_EASING);
      pointerX += (targetX - pointerX) * ease;
      pointerY += (targetY - pointerY) * ease;
      presence += (targetPresence - presence) * ease;

      draw();
      schedule();
    };

    /** Animate unless the tab is hidden or the visitor asked for less motion. */
    function schedule() {
      if (disposed || frame !== 0) return;
      if (document.hidden || reduceMotion.matches) return;
      frame = window.requestAnimationFrame(tick);
    }

    const stop = () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      // Reset so the clock does not jump by the length of the pause when the
      // loop resumes; elapsed keeps its value, only the delta baseline moves.
      lastTick = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else schedule();
    };

    const onMotionPreference = () => {
      if (reduceMotion.matches) {
        stop();
        draw();
      } else {
        schedule();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      // Rect-relative, so the push tracks the cursor over this section rather
      // than over the page. Outside the section the field settles back.
      const rect = canvas.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (inside) {
        [targetX, targetY] = pointerToCanvasSpace(
          event.clientX - rect.left,
          event.clientY - rect.top,
          rect.width,
          rect.height
        );
      }
      targetPresence = inside ? 1 : 0;
      // A static render still owes the visitor a response to the cursor.
      if (reduceMotion.matches) {
        pointerX = targetX;
        pointerY = targetY;
        presence = targetPresence;
        draw();
      }
    };

    const releasePointer = () => {
      targetPresence = 0;
      if (reduceMotion.matches) {
        presence = 0;
        draw();
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      // Touch has no hover: the field should settle once the finger lifts.
      if (event.pointerType !== "mouse") releasePointer();
    };

    // The running loop resizes itself each frame; this only covers the cases
    // where no loop is running (reduced motion, hidden tab) but the section
    // still changed size — a rotation, a font load, a collapsing panel.
    const onResize = () => {
      if (reduceMotion.matches || document.hidden) draw();
    };

    const observer =
      typeof ResizeObserver === "function" ? new ResizeObserver(onResize) : null;
    observer?.observe(canvas);

    // A lost context leaves every GL object invalid; rebuild on restore rather
    // than leaving a dead canvas over the page for the rest of the session.
    const onContextLost = (event: Event) => {
      event.preventDefault();
      stop();
      scene = null;
    };

    const onContextRestored = () => {
      scene = createScene(gl);
      if (!scene) return;
      canvas.width = 0; // force resize() to re-apply the viewport
      draw();
      schedule();
    };

    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", releasePointer, { passive: true });
    window.addEventListener("blur", releasePointer);
    window.addEventListener("resize", onResize, { passive: true });
    if (typeof reduceMotion.addEventListener === "function") {
      reduceMotion.addEventListener("change", onMotionPreference);
    }

    draw();
    schedule();

    return () => {
      disposed = true;
      stop();
      observer?.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", releasePointer);
      window.removeEventListener("blur", releasePointer);
      window.removeEventListener("resize", onResize);
      if (typeof reduceMotion.removeEventListener === "function") {
        reduceMotion.removeEventListener("change", onMotionPreference);
      }
      if (scene) {
        gl.deleteProgram(scene.program);
        gl.deleteShader(scene.vertex);
        gl.deleteShader(scene.fragment);
        gl.deleteBuffer(scene.buffer);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
