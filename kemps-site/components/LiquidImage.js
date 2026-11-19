"use client";
import { useEffect, useRef } from "react";
import Img from "./Img";
import { IMAGES } from "@/lib/images";
import { asset } from "@/lib/base";

/**
 * Brings a still photograph to life with a small WebGL shader (no libraries).
 *
 * mode="ripple": concentric waves roll out from `center`, an optional `drop`
 *   (x, y, radius) bobs gently, and the pointer leaves ripples on the water.
 * mode="splash": the water around the product flows and shimmers while the
 *   `protect` rectangle (the bottle) stays crisp, with a light sheen sweeping
 *   across it.
 *
 * All coordinates are fractions of the image (0–1, origin top-left).
 * The plain <Img> is rendered first (SEO, LCP, no-JS, reduced motion) and the
 * canvas fades in over it once the texture is ready.
 */
/** Presets measured on the source images (fractions of width/height). */
export const SPLASH_BOTTLE = [0.36, 0.02, 0.745, 0.99];
export const DROPLET = { center: [0.5, 0.62], drop: [0.5, 0.28, 0.06] };

export default function LiquidImage({ name, alt, sizes = "100vw", fit = "cover", mode = "ripple", center = [0.5, 0.6], drop = null, protect = [0.36, 0.08, 0.64, 0.98], strength = 1, className = "", imgStyle }) {
  const wrap = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = canvas.current;
    const gl = cv.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;
    const meta = IMAGES[name];
    const imgAspect = meta.w / meta.h;

    const vs = `attribute vec2 a; varying vec2 vUv; void main(){ vUv = a * 0.5 + 0.5; vUv.y = 1.0 - vUv.y; gl_Position = vec4(a, 0.0, 1.0); }`;
    const fs = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTex;
      uniform vec2 uRes; uniform float uImgAspect; uniform float uTime; uniform float uFit; uniform float uMode;
      uniform vec2 uCenter; uniform vec3 uDrop; uniform vec4 uProtect; uniform float uStrength;
      uniform vec2 uMouse; uniform float uMouseT;

      vec2 fitUv(vec2 uv){
        float ca = uRes.x / uRes.y;
        vec2 s = vec2(1.0);
        if (uFit < 0.5) { if (ca > uImgAspect) s.y = uImgAspect / ca; else s.x = ca / uImgAspect; }
        else { if (ca > uImgAspect) s.x = ca / uImgAspect; else s.y = uImgAspect / ca; }
        return (uv - 0.5) * s + 0.5;
      }

      void main(){
        vec2 p = fitUv(vUv);
        vec2 asp = vec2(uImgAspect, 1.0);
        float sheen = 0.0;

        if (uMode < 0.5) {
          // ── ripple: waves from the crown, stronger on the water surface
          vec2 d = (p - uCenter) * asp;
          float r = length(d);
          float surface = smoothstep(uCenter.y - 0.32, uCenter.y + 0.02, p.y);
          float w = sin(r * 46.0 - uTime * 2.0) * exp(-r * 1.6);
          w += 0.5 * sin(r * 90.0 - uTime * 3.1) * exp(-r * 3.0);
          p += normalize(d + 1e-5) / asp * w * 0.0045 * surface * uStrength;
          // pointer ripple
          float age = uTime - uMouseT;
          vec2 dm = (p - uMouse) * asp;
          float rm = length(dm);
          float w2 = sin(rm * 70.0 - age * 7.0) * exp(-rm * 5.0) * exp(-age * 1.1) * smoothstep(0.0, 0.15, age);
          p += normalize(dm + 1e-5) / asp * w2 * 0.012;
          // bobbing drop
          if (uDrop.z > 0.0) {
            float dd = length((p - uDrop.xy) * asp);
            float k = 1.0 - smoothstep(uDrop.z * 0.9, uDrop.z * 2.2, dd);
            p.y += sin(uTime * 1.3) * 0.014 * k;
          }
        } else {
          // ── splash: flowing water outside the protected bottle area
          vec2 q = smoothstep(uProtect.xy - 0.03, uProtect.xy + 0.03, p) * (1.0 - smoothstep(uProtect.zw - 0.03, uProtect.zw + 0.03, p));
          float inside = q.x * q.y;
          float flow = 1.0 - inside;
          vec2 o = vec2(
            sin(p.y * 26.0 + uTime * 1.6) + 0.6 * sin(p.y * 61.0 - uTime * 2.3 + p.x * 9.0),
            cos(p.x * 24.0 + uTime * 1.3) + 0.6 * cos(p.x * 57.0 + uTime * 2.0 + p.y * 7.0)
          );
          p += o * 0.0032 * flow * uStrength;
          // light sheen sweeping across the bottle every few seconds
          float x = (p.x - uProtect.x) / (uProtect.z - uProtect.x) + (p.y - 0.5) * 0.35;
          float pos = fract(uTime * 0.11) * 2.6 - 0.8;
          sheen = smoothstep(0.16, 0.0, abs(x - pos)) * inside * 0.32;
          // sparkle on splash highlights
          sheen += flow * 0.18 * pow(max(0.0, sin(p.x * 140.0 + uTime * 3.0) * sin(p.y * 120.0 - uTime * 2.4)), 24.0);
        }

        if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) { gl_FragColor = vec4(0.0); return; }
        vec4 c = texture2D(uTex, p);
        c.rgb += sheen * c.a;
        gl_FragColor = c;
      }`;

    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; };
    const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n) => gl.getUniformLocation(prog, n);
    const u = { res: U("uRes"), asp: U("uImgAspect"), time: U("uTime"), fit: U("uFit"), mode: U("uMode"), center: U("uCenter"), drop: U("uDrop"), protect: U("uProtect"), strength: U("uStrength"), mouse: U("uMouse"), mouseT: U("uMouseT") };
    gl.uniform1f(u.asp, imgAspect);
    gl.uniform1f(u.fit, fit === "cover" ? 0 : 1);
    gl.uniform1f(u.mode, mode === "ripple" ? 0 : 1);
    gl.uniform2f(u.center, center[0], center[1]);
    gl.uniform3f(u.drop, ...(drop || [0, 0, 0]));
    gl.uniform4f(u.protect, ...protect);
    gl.uniform1f(u.strength, strength);
    gl.uniform2f(u.mouse, -5, -5);
    gl.uniform1f(u.mouseT, -100);

    const tex = gl.createTexture();
    let ready = false, visible = false, raf = 0;
    const start = performance.now();
    const t = () => (performance.now() - start) / 1000;

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(u.res, cv.width, cv.height);
    };
    const frame = () => {
      raf = 0;
      if (!ready || !visible || document.hidden) return;
      gl.uniform1f(u.time, t());
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const image = new Image();
    image.decoding = "async";
    const width = meta.widths.find((w) => w >= Math.min(1600, wrap.current.clientWidth * 1.5)) || meta.widths[meta.widths.length - 1];
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      ready = true;
      resize();
      wrap.current?.classList.add("is-live");
      kick();
    };
    image.src = asset(`/img/${name}-${width}.webp`);

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }, { rootMargin: "100px" });
    io.observe(wrap.current);
    const ro = new ResizeObserver(() => ready && resize());
    ro.observe(cv);

    // pointer → ripple (in image coordinates)
    const zone = wrap.current.closest("section") || wrap.current;
    let last = 0;
    const onMove = (e) => {
      if (mode !== "ripple") return;
      const now = t();
      if (now - last < 0.35) return;
      const r = cv.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      const ca = r.width / r.height;
      let sx = 1, sy = 1;
      if (fit === "cover") { if (ca > imgAspect) sy = imgAspect / ca; else sx = ca / imgAspect; }
      gl.uniform2f(u.mouse, (x - 0.5) * sx + 0.5, (y - 0.5) * sy + 0.5);
      gl.uniform1f(u.mouseT, now);
      last = now;
    };
    zone.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      zone.removeEventListener("pointermove", onMove);
      gl.deleteTexture(tex); gl.deleteBuffer(buf); gl.deleteProgram(prog);
    };
  }, [name, fit, mode, strength]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={wrap} className={`liquid liquid--${fit} ${className}`}>
      <Img name={name} alt={alt} sizes={sizes} style={{ backgroundColor: "transparent", ...imgStyle }} />
      <canvas ref={canvas} aria-hidden="true" />
    </div>
  );
}
