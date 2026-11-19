"use client";
import { useEffect, useRef } from "react";

/**
 * A single fixed WebGL canvas that renders the glass bottle and follows
 * "anchor" elements in the page ([data-bottle-anchor]). The bottle eases
 * between anchors as the user scrolls, rotates with scroll progress, and can
 * be dragged for a 360° view inside the showcase anchor.
 * Three.js is loaded lazily after first paint.
 */
export default function BottleStage() {
  const host = useRef(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const start = async () => {
      const canvasTest = document.createElement("canvas");
      if (!canvasTest.getContext("webgl2") && !canvasTest.getContext("webgl")) return;
      const THREE = await import("three");
      if (disposed) return;
      try { cleanup = buildScene(THREE, host.current, reduce); } catch (err) { console.error("[BottleStage]", err); }
    };

    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    const handle = idle(() => start(), { timeout: 1500 });
    return () => {
      disposed = true;
      (window.cancelIdleCallback || clearTimeout)(handle);
      cleanup();
    };
  }, []);

  return <div ref={host} className="stage" aria-hidden="true" />;
}

/** Wrap-around label: white band with the Kemp's logo, painted once the logo image loads. */
function makeLabelTexture(THREE) {
  const c = document.createElement("canvas");
  c.width = 2048; c.height = 520;
  const g = c.getContext("2d");
  const paint = (logo) => {
    const grad = g.createLinearGradient(0, 0, 0, c.height);
    grad.addColorStop(0, "#ffffff"); grad.addColorStop(1, "#e8f2fa");
    g.fillStyle = grad; g.fillRect(0, 0, c.width, c.height);
    g.strokeStyle = "rgba(30,95,176,0.35)"; g.lineWidth = 6;
    for (const yy of [40, c.height - 40]) { g.beginPath(); for (let x = 0; x <= c.width; x += 16) g.lineTo(x, yy + Math.sin(x / 90) * 6); g.stroke(); }
    if (logo) {
      const lw = 620, lh = (logo.height / logo.width) * lw;
      for (const cx of [c.width * 0.25, c.width * 0.75]) g.drawImage(logo, cx - lw / 2, c.height / 2 - lh / 2 - 10, lw, lh);
    }
    g.fillStyle = "#1e5fb0"; g.textAlign = "center"; g.font = "600 30px Arial, sans-serif";
    for (const cx of [0, c.width * 0.5, c.width]) { g.save(); g.translate(cx, c.height / 2); g.rotate(-Math.PI / 2); g.fillText("PACKAGED DRINKING WATER", 0, 12); g.restore(); }
    tex.needsUpdate = true;
  };
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  paint(null);
  const img = new Image();
  img.onload = () => paint(img);
  img.src = "/img/label-logo.png";
  return tex;
}

/** Procedural condensation normal map: hundreds of tiny droplets. */
function makeDropletNormals(THREE) {
  const S = 512;
  const c = document.createElement("canvas");
  c.width = S; c.height = S;
  const g = c.getContext("2d");
  const img = g.createImageData(S, S);
  for (let i = 0; i < img.data.length; i += 4) { img.data[i] = 128; img.data[i + 1] = 128; img.data[i + 2] = 255; img.data[i + 3] = 255; }
  const drops = 900;
  for (let d = 0; d < drops; d++) {
    const r = Math.random() < 0.85 ? 1.5 + Math.random() * 3 : 4 + Math.random() * 6;
    const cx = Math.random() * S, cy = Math.random() * S;
    const elong = 1 + Math.random() * 0.5;
    for (let y = -r * elong; y <= r * elong; y++) {
      for (let x = -r; x <= r; x++) {
        const nx = x / r, ny = y / (r * elong);
        const dd = nx * nx + ny * ny;
        if (dd > 1) continue;
        const px = ((Math.round(cx + x) % S) + S) % S, py = ((Math.round(cy + y) % S) + S) % S;
        const k = (py * S + px) * 4;
        const nz = Math.sqrt(1 - dd);
        img.data[k] = 128 + nx * 120;
        img.data[k + 1] = 128 - ny * 120;
        img.data[k + 2] = 128 + nz * 127;
      }
    }
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 2);
  return t;
}

function buildScene(THREE, host, reduce) {
  const isSmall = window.innerWidth < 760;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const FOV = 30, CAM_Z = 10;
  const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, CAM_Z);

  // Environment for reflections: the brand's own lake photograph, used as an equirect map.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envLoader = new THREE.TextureLoader();
  envLoader.load("/img/lake-1280.webp", (tex) => {
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    const env = pmrem.fromEquirectangular(tex).texture;
    scene.environment = env;
    tex.dispose();
    host.classList.add("is-ready");
    document.documentElement.classList.add("webgl-ready");
  });

  scene.add(new THREE.HemisphereLight(0xffffff, 0x9fc0d6, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(-4, 6, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xcfe6ff, 2.4);
  rim.position.set(5, 2, -4);
  scene.add(rim);

  // ── Bottle geometry (lathe profiles) ──
  const H = 3.44;
  // PET bottle profile: petaloid base, ribbed lower body, tapered shoulder, neck and collar
  const outer = [
    [0.0, 0.02], [0.3, 0.0], [0.44, 0.02], [0.49, 0.08], [0.5, 0.18],
    [0.5, 0.42], [0.475, 0.47], [0.5, 0.52], [0.5, 0.72], [0.475, 0.77], [0.5, 0.82],
    [0.5, 2.22], [0.475, 2.27], [0.5, 2.32], [0.49, 2.42], [0.44, 2.56], [0.36, 2.7], [0.27, 2.84], [0.215, 2.95],
    [0.205, 3.02], [0.26, 3.04], [0.26, 3.08], [0.205, 3.09], [0.205, 3.14],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const inner = [
    [0.0, 0.1], [0.42, 0.1], [0.47, 0.2], [0.47, 2.3], [0.0, 2.3],
  ].map(([x, y]) => new THREE.Vector2(x, y));

  const dropletNormals = makeDropletNormals(THREE);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xf4fbff,
    metalness: 0,
    roughness: 0.04,
    transparent: true,
    opacity: 0.1,
    envMapIntensity: 2.6,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    clearcoatNormalMap: dropletNormals,
    clearcoatNormalScale: new THREE.Vector2(0.9, 0.9),
    ior: 1.5,
    specularIntensity: 1,
    side: THREE.FrontSide,
    depthWrite: false,
  });
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: 0xbfdcee,
    roughness: 0.02,
    transparent: true,
    opacity: 0.12,
    envMapIntensity: 1.2,
    ior: 1.33,
    depthWrite: false,
  });
  // Fresnel rim shell — gives glass its luminous silhouette
  const rimMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: { uColor: { value: new THREE.Color(0x7fa3ba) }, uPower: { value: 3.2 }, uStrength: { value: 0.75 } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uPower; uniform float uStrength; varying vec3 vN; varying vec3 vV;
      void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uPower); float spec = smoothstep(0.82, 1.0, abs(dot(normalize(vN), normalize(vec3(-0.55, 0.2, 0.8))))) * 0.55;
        vec3 col = mix(uColor, vec3(1.0), spec / max(0.001, f * uStrength + spec));
        gl_FragColor = vec4(col, clamp(f * uStrength + spec, 0.0, 1.0)); }`,
  });
  const capMat = new THREE.MeshPhysicalMaterial({ color: 0x1e5fb0, metalness: 0, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.3, envMapIntensity: 1.1 });
  const labelMat = new THREE.MeshPhysicalMaterial({ map: makeLabelTexture(THREE), roughness: 0.4, metalness: 0, clearcoat: 0.8, clearcoatRoughness: 0.15, envMapIntensity: 0.9 });

  const bottle = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.LatheGeometry(outer, 96), glassMat);
  glass.renderOrder = 3;
  const glassRim = new THREE.Mesh(new THREE.LatheGeometry(outer, 96), rimMat);
  glassRim.renderOrder = 4;
  const water = new THREE.Mesh(new THREE.LatheGeometry(inner, 64), waterMat);
  water.renderOrder = 2;
  // ribbed screw cap
  const capGeo = new THREE.CylinderGeometry(0.24, 0.245, 0.3, 96, 1);
  const pos = capGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), r = Math.hypot(x, z);
    if (r > 0.2) { const a = Math.atan2(z, x); const k = 1 + 0.025 * Math.sign(Math.sin(a * 24)); pos.setX(i, x * k); pos.setZ(i, z * k); }
  }
  capGeo.computeVertexNormals();
  const cap = new THREE.Mesh(capGeo, capMat);
  cap.position.y = 3.14 + 0.15;
  const capTop = new THREE.Mesh(new THREE.CircleGeometry(0.24, 64), capMat);
  capTop.rotation.x = -Math.PI / 2; capTop.position.y = 3.44;
  const label = new THREE.Mesh(new THREE.CylinderGeometry(0.505, 0.505, 1.15, 96, 1, true), labelMat);
  label.position.y = 1.5;
  label.rotation.y = -Math.PI / 2; // logo faces the camera at rotation 0
  label.renderOrder = 5;
  bottle.add(water, glass, label, cap, capTop, glassRim);

  // Centre the bottle vertically around its own middle for nicer rotation framing
  const pivot = new THREE.Group();
  bottle.position.y = -H / 2;
  pivot.add(bottle);
  scene.add(pivot);

  // ── Reflection (mirrored, faded) + ripple surface for the hero ──
  const reflection = bottle.clone(true);
  reflection.traverse((o) => {
    if (o.isMesh) {
      o.material = o.material.clone();
      if ("opacity" in o.material) o.material.opacity *= 0.35;
      if (o.material.uniforms?.uStrength) o.material.uniforms.uStrength.value = 0.25;
      o.material.transparent = true;
      o.material.side = THREE.DoubleSide;
    }
  });
  const reflPivot = new THREE.Group();
  reflPivot.add(reflection);
  scene.add(reflPivot);

  const rippleMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform float uTime; uniform float uOpacity; varying vec2 vUv;
      void main(){
        vec2 p = (vUv - 0.5) * vec2(2.0, 2.0);
        float d = length(p);
        float rings = 0.0;
        for (int i = 0; i < 3; i++) {
          float t = fract(uTime * 0.09 + float(i) / 3.0);
          float r = t * 0.95;
          float w = 0.012 + t * 0.02;
          rings += smoothstep(w, 0.0, abs(d - r)) * (1.0 - t) * (1.0 - t);
        }
        float glow = smoothstep(0.55, 0.0, d) * 0.12;
        float fade = smoothstep(1.0, 0.25, d);
        float a = (rings * 0.55 + glow) * fade * uOpacity;
        gl_FragColor = vec4(vec3(0.88, 0.95, 1.0), a);
      }`,
  });
  const ripple = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), rippleMat);
  ripple.rotation.x = -Math.PI / 2;
  scene.add(ripple);

  // ── Anchors & interaction ──
  const anchors = () => Array.from(document.querySelectorAll("[data-bottle-anchor]"));
  let drag = 0, dragVel = 0, dragging = false, lastX = 0;
  const spin = document.querySelector("[data-bottle-spin]");
  const onDown = (e) => { dragging = true; lastX = e.clientX; spin.setPointerCapture?.(e.pointerId); };
  const onMove = (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; dragVel = dx * 0.012; drag += dragVel; };
  const onUp = () => { dragging = false; };
  const onKey = (e) => {
    if (e.key === "ArrowLeft") { drag -= 0.3; e.preventDefault(); }
    if (e.key === "ArrowRight") { drag += 0.3; e.preventDefault(); }
  };
  if (spin) {
    spin.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    spin.addEventListener("keydown", onKey);
  }

  const state = { x: 0, y: 0, s: 0.0001, rot: 0, vis: 0, ripple: 0 };
  let first = true;
  const pxToWorld = () => (2 * CAM_Z * Math.tan((FOV * Math.PI) / 360)) / window.innerHeight;

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  let running = true;
  const onVis = () => { running = !document.hidden; if (running) loop(); };
  document.addEventListener("visibilitychange", onVis);

  const clock = new THREE.Clock();
  let raf = 0;
  function loop() {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const vh = window.innerHeight, vw = window.innerWidth, k = pxToWorld();

    // choose the anchor with the greatest visible area
    let best = null, bestVis = 0, bestRect = null;
    for (const el of anchors()) {
      const r = el.getBoundingClientRect();
      const vis = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) / Math.max(1, r.height);
      if (vis > bestVis) { bestVis = vis; best = el; bestRect = r; }
    }
    if (!best) { host.style.visibility = "hidden"; return; }
    host.style.visibility = bestVis > 0.001 ? "visible" : "hidden";
    if (bestVis <= 0.001) return;

    const r = bestRect;
    const worldH = r.height * k;
    const tx = (r.left + r.width / 2 - vw / 2) * k;
    const ty = -(r.top + r.height / 2 - vh / 2) * k;
    const ts = worldH / H;
    const mode = best.dataset.bottleAnchor; // "hero" | "showcase"

    // scroll progress through the anchor's section
    const section = best.closest("section") || best;
    const sr = section.getBoundingClientRect();
    const prog = Math.min(1, Math.max(0, (vh - sr.top) / (sr.height + vh)));

    const ease = reduce ? 1 : 1 - Math.pow(0.0008, dt); // frame-rate independent smoothing
    if (first) { state.x = tx; state.y = ty; state.s = ts; first = false; }
    state.x += (tx - state.x) * ease;
    state.y += (ty - state.y) * ease;
    state.s += (ts - state.s) * ease;

    let targetRot;
    if (mode === "showcase") {
      if (!dragging) { dragVel *= 0.94; drag += dragVel; }
      targetRot = drag + (reduce ? 0 : prog * Math.PI * 2);
    } else {
      targetRot = reduce ? 0.35 : prog * Math.PI * 2.2 + t * 0.12;
    }
    state.rot += (targetRot - state.rot) * (reduce ? 1 : 1 - Math.pow(0.002, dt));

    const bob = reduce || mode !== "hero" ? 0 : Math.sin(t * 0.9) * 0.06 * state.s;
    pivot.position.set(state.x, state.y + bob, 0);
    pivot.scale.setScalar(state.s);
    pivot.rotation.set(0, state.rot, reduce ? 0 : Math.sin(t * 0.5) * 0.03);

    // hero-only water: ripples + reflection beneath the floating bottle
    const heroOn = mode === "hero" ? 1 : 0;
    state.ripple += (heroOn - state.ripple) * (1 - Math.pow(0.01, dt));
    const baseY = state.y - (H / 2) * state.s;
    const gap = 0.32 * state.s;
    ripple.position.set(state.x, baseY - gap, 0.4 * state.s);
    ripple.scale.setScalar(H * 1.3 * state.s);
    rippleMat.uniforms.uTime.value = reduce ? 3 : t;
    rippleMat.uniforms.uOpacity.value = state.ripple;
    reflPivot.visible = state.ripple > 0.02;
    reflPivot.position.set(state.x, baseY - 2 * gap - (H / 2) * state.s - bob, 0);
    reflPivot.scale.set(state.s, -state.s, state.s);
    reflPivot.rotation.y = state.rot;
    reflection.position.y = -H / 2;
    ripple.visible = state.ripple > 0.02;

    renderer.render(scene, camera);
  }
  loop();

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVis);
    if (spin) {
      spin.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      spin.removeEventListener("keydown", onKey);
    }
    scene.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose()); } });
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    document.documentElement.classList.remove("webgl-ready");
  };
}
