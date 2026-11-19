"use client";
import { useEffect, useRef } from "react";
import Img from "./Img";
import { IMAGES } from "@/lib/images";
import { asset } from "@/lib/base";

/**
 * Looping drop-impact scene built on two photos of the same shot:
 *  - "droplet-clean": the splash with the hovering drop removed (background plate)
 *  - "droplet":       the original, used only as the source for the drop itself
 * Each cycle the drop falls under gravity, hits the surface, the crown surges up
 * and out, spray droplets arc and fall back, and rings race across the water.
 * The pointer also leaves ripples. Static photo for reduced motion / no WebGL.
 */
const DROP = { x: 0.5, y: 0.28, r: 0.062 };   // drop in the original photo (fractions; r in height units)
const CROWN = { x: 0.5, y: 0.6 };              // centre of the splash crown
const PERIOD = 3.4, FALL = 1.05;               // seconds per cycle, seconds of free fall

export default function DropSplash({ alt = "", sizes = "100vw", className = "" }) {
  const wrap = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = canvas.current;
    const gl = cv.getContext("webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) return;
    const meta = IMAGES["droplet-clean"];
    const imgAspect = meta.w / meta.h;

    const vs = "attribute vec2 a; varying vec2 vUv; void main(){ vUv = a * 0.5 + 0.5; vUv.y = 1.0 - vUv.y; gl_Position = vec4(a, 0.0, 1.0); }";
    const fs = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uPlate; uniform sampler2D uOrig;
      uniform vec2 uRes; uniform float uImgAspect; uniform float uTime;
      uniform vec2 uMouse; uniform float uMouseT;
      const vec3 DROP = vec3(${DROP.x}, ${DROP.y}, ${DROP.r});
      const vec2 CROWN = vec2(${CROWN.x}, ${CROWN.y});
      const float PERIOD = ${PERIOD.toFixed(2)};
      const float FALL = ${FALL.toFixed(2)};

      float hash(float n){ return fract(sin(n) * 43758.5453); }

      void main(){
        float ca = uRes.x / uRes.y;
        vec2 s = vec2(1.0);
        if (ca > uImgAspect) s.y = uImgAspect / ca; else s.x = ca / uImgAspect;
        vec2 p = (vUv - 0.5) * s + 0.5;
        vec2 asp = vec2(uImgAspect, 1.0);

        float t = mod(uTime, PERIOD);
        float age = t - FALL;                  // time since impact (negative while falling)
        float hit = step(0.0, age);

        // ── water surface response ───────────────────────────────
        vec2 q = p;
        vec2 dc = (p - CROWN) * asp;
        float rc = length(dc);
        float surface = smoothstep(CROWN.y - 0.3, CROWN.y + 0.02, p.y);
        // idle swell
        q += normalize(dc + 1e-5) / asp * sin(rc * 40.0 - uTime * 1.8) * exp(-rc * 1.8) * 0.0025 * surface;
        if (hit > 0.5) {
          // crown surges up and outward, then relaxes
          float surge = sin(min(age * 5.0, 3.14159)) * exp(-age * 1.6);
          float crown = exp(-pow(rc / 0.34, 2.0));
          q.y += 0.07 * surge * crown;
          q.x -= (p.x - CROWN.x) * 0.16 * surge * crown;
          // shock rings racing outward
          float front = age * 0.55;
          float ring = sin((rc - front) * 70.0) * exp(-abs(rc - front) * 14.0) * exp(-age * 0.9);
          float ring2 = sin((rc - front * 0.6) * 90.0) * exp(-abs(rc - front * 0.6) * 18.0) * exp(-age * 1.2);
          q += normalize(dc + 1e-5) / asp * (ring * 0.012 + ring2 * 0.007) * surface;
        }
        // pointer ripple
        float ma = uTime - uMouseT;
        vec2 dm = (p - uMouse) * asp; float rm = length(dm);
        q += normalize(dm + 1e-5) / asp * sin(rm * 70.0 - ma * 7.0) * exp(-rm * 5.0) * exp(-ma * 1.1) * smoothstep(0.0, 0.15, ma) * 0.012;

        vec4 col = texture2D(uPlate, clamp(q, 0.001, 0.999));
        // impact flash on the crown
        if (hit > 0.5) col.rgb += vec3(0.6, 0.8, 1.0) * exp(-age * 5.0) * exp(-pow(rc / 0.25, 2.0)) * 0.25;

        // ── spray droplets ───────────────────────────────────────
        if (hit > 0.5 && age < 2.2) {
          for (int i = 0; i < 26; i++) {
            float fi = float(i);
            float th = (hash(fi * 3.1) - 0.5) * 2.6;                  // launch angle around vertical
            float sp = 0.45 + hash(fi * 7.7) * 0.55;                  // launch speed
            float rad = 0.004 + hash(fi * 1.9) * 0.011;               // drop size
            vec2 p0 = CROWN + vec2(sin(th) * 0.16 / uImgAspect, -0.07 - hash(fi) * 0.04);
            vec2 v = vec2(sin(th) * sp * 0.55 / uImgAspect, -cos(th * 0.6) * sp);
            float tt = age * (0.9 + hash(fi * 5.3) * 0.3);
            vec2 pos = p0 + v * tt + vec2(0.0, 1.35) * tt * tt;      // gravity pulls back down
            float alive = step(pos.y, CROWN.y + 0.05) * (1.0 - smoothstep(1.6, 2.2, age));
            vec2 d = (p - pos) * asp;
            float r = length(d);
            if (r < rad && alive > 0.5) {
              vec2 n = d / rad;
              float z = sqrt(max(0.0, 1.0 - dot(n, n)));
              vec3 refr = texture2D(uPlate, clamp(p - n / asp * rad * 2.5, 0.001, 0.999)).rgb;
              float hi = pow(max(0.0, dot(normalize(vec3(n, z)), normalize(vec3(-0.4, -0.6, 0.7)))), 18.0);
              float rimv = smoothstep(0.55, 1.0, length(n));
              vec3 dropCol = refr * 1.1 + vec3(0.8, 0.9, 1.0) * (rimv * 0.5 + hi);
              col.rgb = mix(col.rgb, dropCol, smoothstep(1.0, 0.85, length(n)));
            }
          }
        }

        // ── the falling drop ─────────────────────────────────────
        float k = clamp(t / FALL, 0.0, 1.0);
        float fade = smoothstep(0.0, 0.12, t) * (1.0 - hit);
        if (fade > 0.0) {
          float y = mix(-0.12, CROWN.y - 0.1, k * k);               // accelerating fall
          float stretch = 1.0 + 0.35 * k * k;                         // elongates as it speeds up
          vec2 dp = (p - vec2(DROP.x, y)) * asp;
          dp.y /= stretch;
          float r = length(dp);
          if (r < DROP.z) {
            vec2 src = vec2(DROP.x, DROP.y) + dp / asp;
            vec4 dropCol = texture2D(uOrig, src);
            float m = smoothstep(DROP.z, DROP.z * 0.88, r) * fade;
            col.rgb = mix(col.rgb, dropCol.rgb, m);
          }
          // faint motion trail above the drop
          float trail = exp(-pow((p.x - DROP.x) * uImgAspect / (DROP.z * 0.5), 2.0)) * smoothstep(y - 0.02, y - 0.25 * k, p.y) * step(p.y, y) * k * 0.08 * fade;
          col.rgb += vec3(0.7, 0.85, 1.0) * trail;
        }
        gl_FragColor = col;
      }`;

    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; };
    const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n) => gl.getUniformLocation(prog, n);
    const u = { res: U("uRes"), asp: U("uImgAspect"), time: U("uTime"), mouse: U("uMouse"), mouseT: U("uMouseT"), plate: U("uPlate"), orig: U("uOrig") };
    gl.uniform1f(u.asp, imgAspect);
    gl.uniform2f(u.mouse, -5, -5); gl.uniform1f(u.mouseT, -100);
    gl.uniform1i(u.plate, 0); gl.uniform1i(u.orig, 1);

    const width = meta.widths.find((w) => w >= Math.min(1600, wrap.current.clientWidth * 1.5)) || meta.widths[meta.widths.length - 1];
    let loaded = 0, visible = false, raf = 0;
    const start = performance.now();
    const now = () => (performance.now() - start) / 1000;
    const load = (unit, name) => {
      const tex = gl.createTexture();
      const im = new Image();
      im.onload = () => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (++loaded === 2) { resize(); wrap.current?.classList.add("is-live"); kick(); }
      };
      im.src = asset(`/img/${name}-${width}.webp`);
      return tex;
    };
    const t0 = load(0, "droplet-clean"), t1 = load(1, "droplet");

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = Math.max(1, Math.round(r.width * dpr)); cv.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(u.res, cv.width, cv.height);
    };
    const frame = () => {
      raf = 0;
      if (loaded < 2 || !visible || document.hidden) return;
      gl.uniform1f(u.time, now());
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }, { rootMargin: "100px" });
    io.observe(wrap.current);
    const ro = new ResizeObserver(() => loaded === 2 && resize());
    ro.observe(cv);
    const zone = wrap.current.closest("section") || wrap.current;
    let last = 0;
    const onMove = (e) => {
      const tn = now(); if (tn - last < 0.35) return;
      const r = cv.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      const ca = r.width / r.height; let sx = 1, sy = 1;
      if (ca > imgAspect) sy = imgAspect / ca; else sx = ca / imgAspect;
      gl.uniform2f(u.mouse, (x - 0.5) * sx + 0.5, (y - 0.5) * sy + 0.5); gl.uniform1f(u.mouseT, tn); last = tn;
    };
    zone.addEventListener("pointermove", onMove);
    const onVis = () => kick();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      zone.removeEventListener("pointermove", onMove); document.removeEventListener("visibilitychange", onVis);
      gl.deleteTexture(t0); gl.deleteTexture(t1); gl.deleteBuffer(buf); gl.deleteProgram(prog);
    };
  }, []);

  return (
    <div ref={wrap} className={`liquid liquid--cover ${className}`}>
      <Img name="droplet" alt={alt} sizes={sizes} style={{ backgroundColor: "transparent" }} />
      <canvas ref={canvas} aria-hidden="true" />
    </div>
  );
}
