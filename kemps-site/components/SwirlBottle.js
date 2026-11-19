"use client";
import { useEffect, useRef } from "react";
import Img from "./Img";
import { IMAGES } from "@/lib/images";
import { asset } from "@/lib/base";

/**
 * Eight Plus bottle with a living 3D water swirl.
 * The bottle is a cut-out photo on a plane; two liquid ribbons spiral around it
 * (passing behind and in front), spinning continuously, while droplets are
 * flung off the swirl. Three.js loads lazily; the still photo shows until then
 * and stays for reduced-motion users or browsers without WebGL.
 */
export default function SwirlBottle({ fallback = "ep-splash", alt, sizes = "40vw", className = "" }) {
  const wrap = useRef(null);
  const holder = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const test = document.createElement("canvas");
    if (!test.getContext("webgl2") && !test.getContext("webgl")) return;
    let cleanup = () => {}, dead = false;
    import("three").then((THREE) => { if (!dead) cleanup = build(THREE, wrap.current, holder.current); });
    return () => { dead = true; cleanup(); };
  }, []);

  return (
    <div ref={wrap} className={`swirl ${className}`}>
      <div className="swirl__fallback"><Img name={fallback} alt={alt} sizes={sizes} style={{ backgroundColor: "transparent" }} /></div>
      <div ref={holder} className="swirl__stage" aria-hidden="true" />
    </div>
  );
}

function build(THREE, wrap, holder) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  holder.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0.25, 10);
  camera.lookAt(0, 0, 0);

  // ── bottle (photo cut-out) ──
  const meta = IMAGES["ep-bottle"];
  const BH = 4.2, BW = BH * (meta.w / meta.h);
  const tex = new THREE.TextureLoader().load(asset(`/img/ep-bottle-${meta.widths[meta.widths.length - 1]}.webp`), () => { wrap.classList.add("is-live"); });
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const bottleMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.35, depthWrite: true });
  const bottle = new THREE.Mesh(new THREE.PlaneGeometry(BW, BH), bottleMat);
  const bottleGroup = new THREE.Group();
  bottleGroup.add(bottle);
  scene.add(bottleGroup);
  // soft glow behind the bottle
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(BW * 4, BH * 1.3), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "varying vec2 vUv; void main(){ vec2 d = (vUv - 0.5) * vec2(1.6, 1.0); float a = smoothstep(0.5, 0.0, length(d)) * 0.35; gl_FragColor = vec4(0.45, 0.72, 1.0, a); }",
  }));
  glow.position.z = -1.2;
  scene.add(glow);

  // ── liquid ribbons ──
  const uniforms = { uTime: { value: 0 } };
  const waterMat = (tint, alpha) => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: { ...uniforms, uTint: { value: new THREE.Color(tint) }, uAlpha: { value: alpha } },
    vertexShader: `
      uniform float uTime; attribute vec3 aCenter; attribute float aU;
      varying vec3 vN; varying vec3 vV; varying float vU; varying vec3 vOff;
      void main(){
        vec3 off = position - aCenter;
        // thick in the middle, tapering to fine tips; a travelling bulge makes the water pulse along the swirl
        float profile = pow(sin(3.14159 * aU), 0.8);
        float pulse = 1.0 + 0.35 * sin(aU * 28.0 - uTime * 5.0) + 0.12 * sin(aU * 71.0 + uTime * 3.0);
        vec3 p = aCenter + off * profile * pulse;
        p.y += sin(aU * 20.0 + uTime * 2.2) * 0.05;
        vOff = normalize(off);
        vU = aU;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vN = normalize(normalMatrix * normalize(off));
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform float uTime; uniform vec3 uTint; uniform float uAlpha;
      varying vec3 vN; varying vec3 vV; varying float vU; varying vec3 vOff;
      void main(){
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        // flowing caustic streaks running along the ribbon
        float s1 = smoothstep(0.88, 1.0, sin(vU * 90.0 - uTime * 9.0 + vOff.y * 4.0));
        float s2 = smoothstep(0.93, 1.0, sin(vU * 160.0 - uTime * 13.0 + vOff.x * 6.0));
        // specular glint from a key light
        vec3 L = normalize(vec3(-0.4, 0.7, 0.6));
        vec3 H = normalize(L + normalize(vV));
        float spec = pow(max(dot(normalize(vN), H), 0.0), 60.0);
        float tip = smoothstep(0.0, 0.08, vU) * smoothstep(1.0, 0.92, vU);
        vec3 col = uTint * 0.55 + vec3(0.85, 0.95, 1.0) * (f * 0.9 + s1 * 0.5 + s2 * 0.4) + vec3(1.0) * spec * 1.2;
        float a = (uAlpha + f * 0.6 + s1 * 0.25 + spec) * tip;
        gl_FragColor = vec4(col, clamp(a, 0.0, 0.95));
      }`,
  });

  function ribbon({ turns, radius, rise, y0, thickness, tint, alpha, phase, squash }) {
    const pts = [];
    const N = 220;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const a = phase + u * Math.PI * 2 * turns;
      const r = radius * (0.85 + 0.25 * Math.sin(u * Math.PI));
      pts.push(new THREE.Vector3(Math.cos(a) * r, y0 + u * rise + Math.sin(u * Math.PI * 3) * 0.08, Math.sin(a) * r * squash));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tubular = 420, radial = 20;
    const geo = new THREE.TubeGeometry(curve, tubular, thickness, radial, false);
    const count = geo.attributes.position.count;
    const centers = new Float32Array(count * 3), us = new Float32Array(count);
    for (let i = 0; i <= tubular; i++) {
      const c = curve.getPointAt(i / tubular);
      for (let j = 0; j <= radial; j++) {
        const k = i * (radial + 1) + j;
        centers.set([c.x, c.y, c.z], k * 3);
        us[k] = i / tubular;
      }
    }
    geo.setAttribute("aCenter", new THREE.BufferAttribute(centers, 3));
    geo.setAttribute("aU", new THREE.BufferAttribute(us, 1));
    return { mesh: new THREE.Mesh(geo, waterMat(tint, alpha)), curve };
  }

  const swirl = new THREE.Group();
  const main = ribbon({ turns: 1.35, radius: BW * 0.95, rise: BH * 0.5, y0: -BH * 0.42, thickness: 0.26, tint: 0x5fa8ff, alpha: 0.26, phase: 0, squash: 0.55 });
  const thin = ribbon({ turns: 1.8, radius: BW * 1.15, rise: BH * 0.62, y0: -BH * 0.3, thickness: 0.09, tint: 0x8fc8ff, alpha: 0.18, phase: 2.2, squash: 0.5 });
  const low = ribbon({ turns: 1.1, radius: BW * 0.8, rise: BH * 0.18, y0: -BH * 0.5, thickness: 0.18, tint: 0x4f9cf5, alpha: 0.28, phase: 4.1, squash: 0.55 });
  swirl.add(main.mesh, thin.mesh, low.mesh);
  scene.add(swirl);

  // ── droplets flung from the swirl ──
  const DROPS = 90;
  const dGeo = new THREE.BufferGeometry();
  const seeds = new Float32Array(DROPS * 4);
  for (let i = 0; i < DROPS; i++) seeds.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
  dGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(DROPS * 3), 3));
  dGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
  const dMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { ...uniforms, uR: { value: BW * 1.05 }, uY0: { value: -BH * 0.45 }, uRise: { value: BH * 0.6 }, uScale: { value: 1 } },
    vertexShader: `
      uniform float uTime; uniform float uR; uniform float uY0; uniform float uRise; uniform float uScale;
      attribute vec4 aSeed; varying float vA;
      void main(){
        float life = 1.6 + aSeed.w * 1.4;
        float t = mod(uTime + aSeed.x * 10.0, life);
        float k = t / life;
        float ang = aSeed.y * 6.2831 + uTime * 1.6;           // ride the swirl…
        float r = uR * (0.9 + k * (0.6 + aSeed.z * 0.9));     // …then fly outward
        vec3 p = vec3(cos(ang) * r, uY0 + aSeed.z * uRise + k * 0.6 - k * k * 1.6, sin(ang) * r * 0.55);
        vA = smoothstep(0.0, 0.1, k) * (1.0 - smoothstep(0.7, 1.0, k));
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (4.0 + aSeed.w * aSeed.w * 14.0) * uScale / -mv.z * 10.0;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying float vA;
      void main(){
        vec2 d = gl_PointCoord - 0.5; float r = length(d);
        if (r > 0.5) discard;
        float rim = (smoothstep(0.5, 0.38, r) - smoothstep(0.38, 0.22, r) * 0.7) * 0.6;
        float hi = smoothstep(0.14, 0.0, length(d - vec2(-0.14, -0.16)));
        vec3 col = vec3(0.75, 0.88, 1.0) * (0.35 + rim) + hi;
        gl_FragColor = vec4(col, (0.18 + rim * 0.5 + hi * 0.9) * vA * 0.85);
      }`,
  });
  const drops = new THREE.Points(dGeo, dMat);
  drops.frustumCulled = false;
  swirl.add(drops);

  // ── layout ──
  const resize = () => {
    const w = wrap.clientWidth, h = wrap.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // fit the bottle (plus swirl) into the frame
    const needH = BH * 1.18, needW = BW * 3.4;
    const fovH = 2 * Math.atan(Math.tan((28 * Math.PI) / 360));
    const distH = needH / 2 / Math.tan(fovH / 2);
    const distW = needW / 2 / Math.tan(fovH / 2) / camera.aspect;
    camera.position.z = Math.max(distH, distW);
    camera.updateProjectionMatrix();
    dMat.uniforms.uScale.value = h / 600;
  };
  const ro = new ResizeObserver(resize);
  ro.observe(wrap);
  resize();

  // ── loop ──
  let visible = false, raf = 0;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }, { rootMargin: "120px" });
  io.observe(wrap);
  const clock = new THREE.Clock();
  function loop() {
    raf = 0;
    if (!visible || document.hidden) return;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    swirl.rotation.y = -t * 0.9;                     // the swirl spins around the bottle
    swirl.position.y = Math.sin(t * 0.8) * 0.05;
    bottleGroup.position.y = Math.sin(t * 0.8 + 0.6) * 0.08;
    bottleGroup.rotation.z = Math.sin(t * 0.5) * 0.02;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  const onVis = () => { if (!document.hidden && visible && !raf) raf = requestAnimationFrame(loop); };
  document.addEventListener("visibilitychange", onVis);

  return () => {
    cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    tex.dispose(); renderer.dispose(); renderer.domElement.remove();
  };
}
