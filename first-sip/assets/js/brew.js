/* First Sip — "From bean to cup" scroll animation.
   Everything in the scene is a pure function of scroll progress (p, 0..1),
   so scrubbing up and down always looks right. Time (t) only adds life:
   falling powder, stream wobble, steam. World space is 600 units wide. */
(() => {
  "use strict";
  const canvas = document.querySelector("[data-brew-canvas]");
  if (!canvas) return;
  const section = canvas.closest(".brew");
  const steps = Array.from(section.querySelectorAll(".brew__step"));
  const label = section.querySelector("[data-brew-label]");
  const metaK = section.querySelector("[data-brew-meta-k]");
  const metaV = section.querySelector("[data-brew-meta-v]");
  const dots = Array.from(section.querySelectorAll(".brew__dots i"));
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- math ---------- */
  const TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const eIO = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const eOut = (t) => 1 - Math.pow(1 - t, 3);
  const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

  /* ---------- canvas sizing ---------- */
  let W = 0, H = 0, DPR = 1, S = 1, OX = 0, OY = 0;
  const VIEW_H = 1000;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    // Fill the panel: frame roughly x 60..540 and y 10..910 of the world.
    S = Math.min(W / 500, H / 905);
    OX = W / S / 2 - 300; OY = (H / S - 905) / 2 - 8;
  };

  /* ---------- pre-rendered textures ---------- */
  const beanSprite = (v) => {
    const w = 48, h = 66, c = document.createElement("canvas");
    c.width = w; c.height = h;
    const g = c.getContext("2d"), cx = w / 2, cy = h / 2, rx = w / 2 - 2, ry = h / 2 - 2;
    const tones = [["#8a5531", "#4d2c17", "#1f1008"], ["#7b4726", "#432410", "#1a0d05"], ["#93603a", "#57331b", "#26140a"]][v];
    const body = g.createRadialGradient(cx - rx * .35, cy - ry * .4, 1, cx, cy, ry * 1.05);
    body.addColorStop(0, tones[0]); body.addColorStop(.55, tones[1]); body.addColorStop(1, tones[2]);
    g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, TAU); g.fillStyle = body; g.fill();
    g.save(); g.clip();
    const crease = () => { g.beginPath(); g.moveTo(cx + rx * .08, cy - ry * .9); g.bezierCurveTo(cx - rx * .5, cy - ry * .3, cx + rx * .5, cy + ry * .3, cx - rx * .08, cy + ry * .9); };
    crease(); g.strokeStyle = "rgba(12,5,2,.92)"; g.lineWidth = 4.2; g.lineCap = "round"; g.stroke();
    g.translate(2.2, 0); crease(); g.strokeStyle = "rgba(255,214,170,.22)"; g.lineWidth = 1.4; g.stroke(); g.translate(-2.2, 0);
    const spec = g.createRadialGradient(cx - rx * .38, cy - ry * .45, 0, cx - rx * .38, cy - ry * .45, rx * .75);
    spec.addColorStop(0, "rgba(255,238,215,.55)"); spec.addColorStop(1, "rgba(255,238,215,0)");
    g.fillStyle = spec; g.fillRect(0, 0, w, h);
    const rim = g.createRadialGradient(cx, cy, ry * .6, cx, cy, ry * 1.02);
    rim.addColorStop(0, "rgba(0,0,0,0)"); rim.addColorStop(1, "rgba(0,0,0,.35)");
    g.fillStyle = rim; g.fillRect(0, 0, w, h);
    g.restore();
    return c;
  };
  const BEANS = [0, 1, 2].map(beanSprite);

  const grain = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 160;
    const g = c.getContext("2d"), d = g.createImageData(160, 160);
    for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 18; }
    g.putImageData(d, 0, 0); return c;
  })();
  let grainPattern = null;

  /* ---------- hopper bean slots (fixed layout) ---------- */
  const N = 66;
  const hopperL = (y) => 252 - (228 - y) / 178 * 58;
  const hopperR = (y) => 348 + (228 - y) / 178 * 58;
  const SLOTS = [];
  for (let row = 0, i = 0; i < N; row++) {
    const y = 214 - row * 15;
    const l = hopperL(y) + 12, r = hopperR(y) - 12;
    const count = Math.max(1, Math.floor((r - l) / 19));
    for (let k = 0; k < count && i < N; k++, i++) {
      SLOTS.push({ x: l + (k + .5) * (r - l) / count + (rnd(i) - .5) * 6, y: y + (rnd(i + 50) - .5) * 5, a: rnd(i + 90) * TAU, v: i % 3, sx: (rnd(i + 20) - .5) * 160 });
    }
  }

  /* ---------- drawing helpers ---------- */
  const bean = (x, y, a, v, sc = 1) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a);
    ctx.drawImage(BEANS[v], -10 * sc, -14 * sc, 20 * sc, 28 * sc);
    ctx.restore();
  };
  const roundRect = (x, y, w, h, r) => {
    const rr = Array.isArray(r) ? r : [r, r, r, r];
    ctx.beginPath();
    ctx.moveTo(x + rr[0], y);
    ctx.lineTo(x + w - rr[1], y); ctx.quadraticCurveTo(x + w, y, x + w, y + rr[1]);
    ctx.lineTo(x + w, y + h - rr[2]); ctx.quadraticCurveTo(x + w, y + h, x + w - rr[2], y + h);
    ctx.lineTo(x + rr[3], y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - rr[3]);
    ctx.lineTo(x, y + rr[0]); ctx.quadraticCurveTo(x, y, x + rr[0], y);
    ctx.closePath();
  };
  const softShadow = (x, y, rx, ry, a) => {
    if (a <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(70,42,20,${.28 * a})`); g.addColorStop(.6, `rgba(70,42,20,${.1 * a})`); g.addColorStop(1, "rgba(70,42,20,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore();
  };
  // A liquid stream as a tapered ribbon along a cubic curve.
  const stream = (p0, p1, p2, p3, w0, w1, colors, alpha = 1) => {
    if (alpha <= 0 || w0 <= 0) return;
    const pts = [], n = 28;
    for (let i = 0; i <= n; i++) {
      const t = i / n, mt = 1 - t;
      const x = mt ** 3 * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t ** 3 * p3[0];
      const y = mt ** 3 * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t ** 3 * p3[1];
      pts.push([x, y]);
    }
    const left = [], right = [];
    pts.forEach((pt, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n, i + 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
      const w = lerp(w0, w1, i / n) / 2;
      left.push([pt[0] - dy * w, pt[1] + dx * w]); right.push([pt[0] + dy * w, pt[1] - dx * w]);
    });
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.beginPath(); ctx.moveTo(left[0][0], left[0][1]);
    left.forEach((q) => ctx.lineTo(q[0], q[1]));
    for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
    ctx.closePath();
    const g = ctx.createLinearGradient(p0[0] - w0, 0, p0[0] + w0, 0);
    g.addColorStop(0, colors[0]); g.addColorStop(.45, colors[1]); g.addColorStop(1, colors[2]);
    ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); right.forEach((q, i) => { const m = [lerp(q[0], pts[i][0], .45), lerp(q[1], pts[i][1], .45)]; i ? ctx.lineTo(m[0], m[1]) : ctx.moveTo(m[0], m[1]); });
    ctx.strokeStyle = colors[3] || "rgba(255,255,255,.35)"; ctx.lineWidth = Math.max(.6, w1 * .18); ctx.stroke();
    ctx.restore();
  };
  const COFFEE = ["#5a2f14", "#24110a", "#4a2511", "rgba(255,226,190,.45)"];
  const WATER = ["rgba(205,225,235,.55)", "rgba(245,250,252,.85)", "rgba(200,220,232,.55)", "rgba(255,255,255,.9)"];

  /* ---------- scene parts ---------- */
  const drawGrinder = (s1, s2, t, dy) => {
    const grinding = s2 > .01 && s2 < .99;
    const jx = grinding && !reduced ? Math.sin(t * 70) * .7 : 0;
    const jy = grinding && !reduced ? Math.cos(t * 63) * .5 : 0;
    ctx.save(); ctx.translate(jx, dy + jy);

    // beans resting in the hopper
    ctx.save();
    ctx.beginPath(); ctx.moveTo(196, 52); ctx.lineTo(404, 52); ctx.lineTo(348, 228); ctx.lineTo(252, 228); ctx.closePath(); ctx.clip();
    const back = ctx.createLinearGradient(0, 52, 0, 228);
    back.addColorStop(0, "rgba(255,255,255,.18)"); back.addColorStop(1, "rgba(120,85,55,.12)");
    ctx.fillStyle = back; ctx.fill();
    const visible = Math.floor(N * (1 - s2));
    for (let i = 0; i < N; i++) {
      const sl = SLOTS[i], land = .06 + .82 * i / N;
      if (s1 < land || i >= visible) continue;
      // beans nearest the throat sink first while grinding
      const sink = grinding ? Math.sin(t * 9 + i) * .6 : 0;
      bean(sl.x, sl.y + sink, sl.a, sl.v);
    }
    ctx.restore();

    // falling beans (not clipped, they drop in from above)
    for (let i = 0; i < N; i++) {
      const sl = SLOTS[i], land = .06 + .82 * i / N, dur = .14;
      if (s1 <= land - dur || s1 >= land) continue;
      const q = (s1 - (land - dur)) / dur;
      const y = lerp(-140, sl.y, q * q);
      const x = lerp(sl.x + sl.sx, sl.x, eOut(q));
      bean(x, y, sl.a + (1 - q) * 5, sl.v);
    }

    // hopper glass
    ctx.beginPath(); ctx.moveTo(196, 52); ctx.lineTo(404, 52); ctx.lineTo(348, 228); ctx.lineTo(252, 228); ctx.closePath();
    const glass = ctx.createLinearGradient(196, 0, 404, 0);
    glass.addColorStop(0, "rgba(255,255,255,.34)"); glass.addColorStop(.18, "rgba(255,255,255,.05)"); glass.addColorStop(.8, "rgba(255,255,255,.04)"); glass.addColorStop(1, "rgba(255,255,255,.26)");
    ctx.fillStyle = glass; ctx.fill();
    ctx.strokeStyle = "rgba(95,70,48,.38)"; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(214, 64); ctx.lineTo(262, 214); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(390, 66); ctx.lineTo(380, 96); ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 2; ctx.stroke();

    // lid (lifts while beans pour in)
    const lid = eIO(seg(s1, 0, .07)) * (1 - eIO(seg(s1, .9, 1)));
    ctx.save(); ctx.translate(186, 45); ctx.rotate(-.5 * lid); ctx.translate(-186, -45 - 10 * lid);
    roundRect(186, 34, 228, 22, 9);
    let g = ctx.createLinearGradient(0, 34, 0, 56); g.addColorStop(0, "#4a3a31"); g.addColorStop(.5, "#2b201a"); g.addColorStop(1, "#1a1310"); ctx.fillStyle = g; ctx.fill();
    roundRect(276, 24, 48, 12, 6); ctx.fillStyle = "#2b201a"; ctx.fill();
    ctx.beginPath(); ctx.moveTo(196, 38); ctx.lineTo(404, 38); ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();

    // chrome collar
    roundRect(240, 226, 120, 20, 4);
    g = ctx.createLinearGradient(240, 0, 360, 0);
    ["#8d8a86", "#f4f2ef", "#a9a5a0", "#e7e4df", "#7d7a76"].forEach((c, i) => g.addColorStop(i / 4, c));
    ctx.fillStyle = g; ctx.fill();

    // matte espresso body
    roundRect(214, 244, 172, 182, [10, 10, 26, 26]);
    g = ctx.createLinearGradient(214, 0, 386, 0);
    g.addColorStop(0, "#1c1411"); g.addColorStop(.22, "#4b3a31"); g.addColorStop(.45, "#2e221c"); g.addColorStop(1, "#140e0b");
    ctx.fillStyle = g; ctx.fill();
    roundRect(214, 244, 172, 182, [10, 10, 26, 26]);
    g = ctx.createLinearGradient(0, 244, 0, 426); g.addColorStop(0, "rgba(255,255,255,.08)"); g.addColorStop(.4, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(0,0,0,.25)");
    ctx.fillStyle = g; ctx.fill();
    // gold badge
    roundRect(262, 296, 76, 26, 6);
    g = ctx.createLinearGradient(262, 296, 338, 322); g.addColorStop(0, "#e6c78f"); g.addColorStop(.5, "#b88d52"); g.addColorStop(1, "#d9b77e");
    ctx.fillStyle = g; ctx.fill();
    ctx.fillStyle = "#2a1a10"; ctx.font = "600 10px 'DM Mono', monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("FIRST SIP", 300, 309.5);
    // grind dial
    ctx.save(); ctx.translate(246, 384);
    g = ctx.createRadialGradient(-4, -4, 1, 0, 0, 16); g.addColorStop(0, "#f5f3f0"); g.addColorStop(1, "#7f7b77");
    ctx.beginPath(); ctx.arc(0, 0, 15, 0, TAU); ctx.fillStyle = g; ctx.fill();
    ctx.rotate(s2 * TAU * 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -11); ctx.strokeStyle = "#2a1a10"; ctx.lineWidth = 2.4; ctx.stroke();
    ctx.restore();
    // status light
    ctx.beginPath(); ctx.arc(356, 384, 4, 0, TAU); ctx.fillStyle = grinding ? "#f2c46d" : "#5b4a3f"; ctx.fill();
    if (grinding) { ctx.beginPath(); ctx.arc(356, 384, 9, 0, TAU); ctx.fillStyle = "rgba(242,196,109,.25)"; ctx.fill(); }
    // chute
    ctx.beginPath(); ctx.moveTo(282, 424); ctx.lineTo(318, 424); ctx.lineTo(311, 448); ctx.lineTo(289, 448); ctx.closePath();
    g = ctx.createLinearGradient(282, 0, 318, 0); g.addColorStop(0, "#6f6a66"); g.addColorStop(.5, "#e3e0dc"); g.addColorStop(1, "#5d5955");
    ctx.fillStyle = g; ctx.fill();
    ctx.restore();
  };

  const moundTopAt = (s2, s3) => 636 - (8 + 70 * eOut(s2)) - 7 * eOut(seg(s3, .1, .4));

  const drawPowderFall = (s2, t, dy, top) => {
    if (s2 <= .015 || s2 >= .985) return;
    const fade = Math.min(1, s2 / .05, (1 - s2) / .05);
    const cols = ["#8a5a35", "#6b4226", "#9c6a40", "#57351d", "#7a4c2c"];
    ctx.save(); ctx.globalAlpha = fade;
    const y0 = 448 + dy;
    for (let k = 0; k < 140; k++) {
      const ph = (t * (.85 + rnd(k) * .35) + rnd(k + 400)) % 1;
      const y = y0 + ph * (top - y0);
      const spread = (rnd(k + 7) - .5) * (4 + ph * 12);
      const x = 300 + spread + Math.sin(t * 3 + k) * .6;
      ctx.fillStyle = cols[k % 5];
      const s = .9 + rnd(k + 3) * 1.6;
      ctx.fillRect(x, y, s, s);
    }
    // the dense core of the stream
    const g = ctx.createLinearGradient(0, y0, 0, top);
    g.addColorStop(0, "rgba(110,66,38,.85)"); g.addColorStop(1, "rgba(110,66,38,.15)");
    ctx.fillStyle = g; ctx.fillRect(297.5, y0, 5, top - y0);
    ctx.restore();
  };

  const drawKettle = (s3, t) => {
    const enter = eOut(seg(s3, 0, .14)), exit = eIO(seg(s3, .86, 1));
    const x = (1 - enter) * 360 + exit * 360;
    if (x >= 359) return null;
    const tilt = -.16 * eIO(seg(s3, .1, .2)) * (1 - seg(s3, .8, .88));
    ctx.save(); ctx.translate(505 + x, 420); ctx.rotate(tilt); ctx.translate(-505, -420);
    // handle
    ctx.beginPath(); ctx.moveTo(552, 382); ctx.bezierCurveTo(604, 382, 610, 452, 560, 458);
    ctx.strokeStyle = "#1d1512"; ctx.lineWidth = 11; ctx.lineCap = "round"; ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 2; ctx.stroke();
    // spout (gooseneck)
    const spout = () => { ctx.beginPath(); ctx.moveTo(452, 452); ctx.bezierCurveTo(410, 466, 398, 396, 372, 392); ctx.bezierCurveTo(356, 390, 346, 404, 340, 428); };
    spout(); ctx.strokeStyle = "#1d1512"; ctx.lineWidth = 8; ctx.stroke();
    spout(); ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.lineWidth = 1.6; ctx.stroke();
    // body
    ctx.beginPath(); ctx.moveTo(468, 372); ctx.lineTo(542, 372); ctx.quadraticCurveTo(552, 372, 556, 382); ctx.lineTo(572, 462); ctx.quadraticCurveTo(574, 472, 562, 472); ctx.lineTo(448, 472); ctx.quadraticCurveTo(436, 472, 438, 462); ctx.lineTo(454, 382); ctx.quadraticCurveTo(458, 372, 468, 372); ctx.closePath();
    let g = ctx.createLinearGradient(438, 0, 574, 0);
    g.addColorStop(0, "#151010"); g.addColorStop(.25, "#4a3b33"); g.addColorStop(.5, "#241b17"); g.addColorStop(1, "#0f0b09");
    ctx.fillStyle = g; ctx.fill();
    // lid + wooden knob
    ctx.beginPath(); ctx.ellipse(505, 371, 40, 8, 0, 0, TAU); ctx.fillStyle = "#2c221d"; ctx.fill();
    ctx.beginPath(); ctx.ellipse(505, 362, 9, 7, 0, 0, TAU);
    g = ctx.createLinearGradient(496, 0, 514, 0); g.addColorStop(0, "#8a5a33"); g.addColorStop(1, "#5b3a20"); ctx.fillStyle = g; ctx.fill();
    // brass thermometer
    ctx.beginPath(); ctx.arc(505, 425, 13, 0, TAU);
    g = ctx.createRadialGradient(501, 421, 1, 505, 425, 14); g.addColorStop(0, "#fff3d6"); g.addColorStop(1, "#b88d52"); ctx.fillStyle = g; ctx.fill();
    ctx.save(); ctx.translate(505, 425); ctx.rotate(-1.2 + 2.2 * seg(s3, 0, .3)); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -9); ctx.strokeStyle = "#a33b2a"; ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore();
    ctx.restore();
    // spout tip in world space
    const [tx, ty] = rot(340 - 505, 428 - 420, tilt);
    return [505 + x + tx, 420 + ty];
  };

  const drawDripper = (s2, s3, t, dy, alpha, top) => {
    if (alpha <= 0) return;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(0, dy);
    const cone = () => { ctx.beginPath(); ctx.moveTo(196, 522); ctx.lineTo(404, 522); ctx.lineTo(320, 640); ctx.lineTo(280, 640); ctx.closePath(); };
    // contents
    ctx.save(); cone(); ctx.clip();
    const wet = eIO(seg(s3, .05, .35));
    const mTop = top;
    const curve = 10 + 6 * wet;
    ctx.beginPath(); ctx.moveTo(150, 650); ctx.lineTo(150, mTop + curve); ctx.quadraticCurveTo(300, mTop - curve, 450, mTop + curve); ctx.lineTo(450, 650); ctx.closePath();
    let g = ctx.createLinearGradient(0, mTop - 10, 0, 640);
    const dry = ["#a0703f", "#7b4f2c"], damp = ["#4a2a15", "#2c170b"];
    g.addColorStop(0, wet ? mix(dry[0], damp[0], wet) : dry[0]); g.addColorStop(1, wet ? mix(dry[1], damp[1], wet) : dry[1]);
    ctx.fillStyle = g; ctx.fill();
    // ground texture
    for (let k = 0; k < 260; k++) {
      const x = 200 + rnd(k) * 200, y = mTop - 6 + rnd(k + 900) * (646 - mTop);
      ctx.fillStyle = k % 3 ? `rgba(40,20,8,${.25 + .25 * wet})` : `rgba(210,160,110,${.25 * (1 - wet)})`;
      ctx.fillRect(x, y, 1.4, 1.4);
    }
    // brewing slurry + bloom bubbles
    const slurry = Math.sin(Math.PI * seg(s3, .12, .82));
    if (slurry > 0) {
      const ly = mTop - 4 - slurry * 24;
      g = ctx.createLinearGradient(0, ly, 0, mTop + 8);
      g.addColorStop(0, "rgba(150,95,55,.9)"); g.addColorStop(.25, "rgba(70,38,18,.9)"); g.addColorStop(1, "rgba(40,20,9,.95)");
      ctx.fillStyle = g; ctx.fillRect(150, ly, 300, mTop + 10 - ly);
      for (let k = 0; k < 22; k++) {
        const bx = 230 + rnd(k + 30) * 140, r = 1.5 + rnd(k + 60) * 3.5 + Math.sin(t * 2 + k) * .5;
        ctx.beginPath(); ctx.arc(bx, ly + 3 + rnd(k) * 5, r, 0, TAU); ctx.fillStyle = "rgba(205,150,100,.55)"; ctx.fill();
        ctx.beginPath(); ctx.arc(bx - r * .3, ly + 2 + rnd(k) * 5, r * .35, 0, TAU); ctx.fillStyle = "rgba(255,240,220,.6)"; ctx.fill();
      }
    }
    ctx.restore();
    // glass cone
    cone();
    g = ctx.createLinearGradient(196, 0, 404, 0);
    g.addColorStop(0, "rgba(255,255,255,.42)"); g.addColorStop(.2, "rgba(255,255,255,.06)"); g.addColorStop(.85, "rgba(255,255,255,.05)"); g.addColorStop(1, "rgba(255,255,255,.3)");
    ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = "rgba(95,70,48,.4)"; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(214, 532); ctx.lineTo(286, 632); ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.stroke();
    // rim + base
    ctx.beginPath(); ctx.ellipse(300, 522, 104, 10, 0, 0, TAU); ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 2.4; ctx.stroke();
    ctx.strokeStyle = "rgba(95,70,48,.3)"; ctx.lineWidth = 1; ctx.stroke();
    roundRect(232, 640, 136, 9, 4);
    g = ctx.createLinearGradient(232, 0, 368, 0); g.addColorStop(0, "#c9a066"); g.addColorStop(.5, "#f1d9a8"); g.addColorStop(1, "#a87c3f");
    ctx.fillStyle = g; ctx.fill();
    ctx.restore();
  };

  // Glass mug, drawn in its own rotated frame. Returns the pouring lip in world space.
  const drawMug = (cx, cy, ang, fill, t) => {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
    const interior = () => roundRect(-78, -104, 156, 200, [3, 3, 16, 16]);
    // liquid
    if (fill > .002) {
      ctx.save(); interior(); ctx.clip();
      ctx.rotate(-ang);
      const level = 96 - fill * 196;
      const [, lipY] = rot(80, -104, ang);
      const surf = Math.max(level * Math.cos(ang) + (1 - Math.cos(ang)) * 40, lipY + 1.5);
      let g = ctx.createLinearGradient(-110, 0, 110, 0);
      g.addColorStop(0, "#7a4219"); g.addColorStop(.18, "#3a1d0c"); g.addColorStop(.6, "#22110a"); g.addColorStop(.9, "#3d1f0d"); g.addColorStop(1, "#6b3818");
      ctx.fillStyle = g; ctx.fillRect(-200, surf, 400, 400);
      // crema line + meniscus highlight
      const wob = reduced ? 0 : Math.sin(t * 4) * .6;
      g = ctx.createLinearGradient(0, surf - 1, 0, surf + 7);
      g.addColorStop(0, "rgba(214,160,104,.95)"); g.addColorStop(1, "rgba(120,70,35,0)");
      ctx.fillStyle = g; ctx.fillRect(-200, surf + wob, 400, 8);
      ctx.fillStyle = "rgba(255,236,210,.6)"; ctx.fillRect(-200, surf + wob, 400, 1.2);
      ctx.restore();
    }
    // glass body
    roundRect(-85, -110, 170, 220, [5, 5, 24, 24]);
    let g = ctx.createLinearGradient(-85, 0, 85, 0);
    g.addColorStop(0, "rgba(255,255,255,.36)"); g.addColorStop(.12, "rgba(255,255,255,.08)"); g.addColorStop(.8, "rgba(255,255,255,.06)"); g.addColorStop(1, "rgba(255,255,255,.3)");
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = "rgba(95,70,48,.42)"; ctx.lineWidth = 1.4; ctx.stroke();
    interior(); ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = .8; ctx.stroke();
    // thick glass base
    roundRect(-78, 96, 156, 12, [0, 0, 14, 14]); ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fill();
    // highlights
    g = ctx.createLinearGradient(-72, 0, -60, 0); g.addColorStop(0, "rgba(255,255,255,.75)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(-72, -96, 12, 176);
    ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(62, -92, 3, 60);
    // rim
    ctx.beginPath(); ctx.moveTo(-85, -110); ctx.lineTo(85, -110); ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 2.6; ctx.stroke();
    // handle (left)
    const handle = () => { ctx.beginPath(); ctx.moveTo(-85, -74); ctx.bezierCurveTo(-140, -78, -140, 46, -85, 40); };
    handle(); ctx.strokeStyle = "rgba(255,255,255,.32)"; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.stroke();
    handle(); ctx.strokeStyle = "rgba(95,70,48,.35)"; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.restore();
    const [lx, ly] = rot(86, -108, ang);
    return [cx + lx, cy + ly];
  };

  const CUP = { x: 372, y: 1290, rx: 100, ry: 20, h: 106 };
  const cupSurface = (L) => ({ y: CUP.y + (1 - L) * 30 + 4, rx: CUP.rx * (.8 + .2 * L) - 5, ry: CUP.ry * (.8 + .2 * L) - 1.5 });

  const drawCupBack = (L, heart, t) => {
    const { x, y, rx, ry, h } = CUP;
    softShadow(x, y + h + 18, 190, 26, 1);
    // saucer
    ctx.beginPath(); ctx.ellipse(x, y + h + 8, 152, 26, 0, 0, TAU);
    let g = ctx.createLinearGradient(x - 152, 0, x + 152, 0);
    g.addColorStop(0, "#ffffff"); g.addColorStop(.6, "#f3eee7"); g.addColorStop(1, "#d7cdbf");
    ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); ctx.ellipse(x, y + h + 4, 150, 24, 0, Math.PI, TAU); ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x, y + h + 8, 152, 26, 0, 0, TAU); ctx.strokeStyle = "#c9a066"; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x, y + h + 6, 74, 12, 0, 0, TAU); ctx.fillStyle = "rgba(150,120,90,.18)"; ctx.fill();
    // handle
    ctx.beginPath(); ctx.moveTo(x + rx - 8, y + 18); ctx.bezierCurveTo(x + rx + 52, y + 6, x + rx + 46, y + 72, x + rx - 14, y + 66);
    ctx.strokeStyle = "#ece5db"; ctx.lineWidth = 13; ctx.lineCap = "round"; ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 3; ctx.stroke();
    // body
    ctx.beginPath(); ctx.moveTo(x - rx, y);
    ctx.bezierCurveTo(x - rx + 2, y + 62, x - 66, y + h, x - 50, y + h);
    ctx.lineTo(x + 50, y + h);
    ctx.bezierCurveTo(x + 66, y + h, x + rx - 2, y + 62, x + rx, y);
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI, false);
    ctx.closePath();
    g = ctx.createLinearGradient(x - rx, 0, x + rx, 0);
    g.addColorStop(0, "#f2ece4"); g.addColorStop(.25, "#ffffff"); g.addColorStop(.6, "#f1ebe2"); g.addColorStop(1, "#cfc4b5");
    ctx.fillStyle = g; ctx.fill();
    // inner rim
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
    g = ctx.createLinearGradient(0, y - ry, 0, y + ry); g.addColorStop(0, "#d8cfc2"); g.addColorStop(1, "#fbf8f3");
    ctx.fillStyle = g; ctx.fill();
    // coffee + crema
    if (L > .01) {
      const s = cupSurface(L);
      ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, rx - 4, ry - 1.5, 0, 0, TAU); ctx.clip();
      ctx.beginPath(); ctx.ellipse(x, s.y, s.rx, s.ry, 0, 0, TAU);
      const cr = ctx.createRadialGradient(x - 10, s.y - 2, 2, x, s.y, s.rx);
      const crema = seg(L, .25, .9);
      cr.addColorStop(0, mix("#3a1d0c", "#d39a5e", crema)); cr.addColorStop(.55, mix("#2a140a", "#a8683a", crema)); cr.addColorStop(.9, mix("#1d0e07", "#6a3a1a", crema)); cr.addColorStop(1, "#3b1d0c");
      ctx.fillStyle = cr; ctx.fill();
      // crema swirl
      ctx.save(); ctx.translate(x, s.y); ctx.scale(1, s.ry / s.rx);
      for (let k = 0; k < 5; k++) {
        ctx.beginPath(); ctx.arc(0, 0, s.rx * (.25 + k * .15), t * .2 + k, t * .2 + k + 2.4);
        ctx.strokeStyle = `rgba(240,200,150,${.12 * crema})`; ctx.lineWidth = 3; ctx.stroke();
      }
      // latte-art heart
      if (heart > 0) {
        ctx.save(); ctx.scale(heart, heart); ctx.translate(0, 6);
        ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-46, 4, -40, -36, -12, -32); ctx.bezierCurveTo(-4, -31, 0, -24, 0, -18);
        ctx.bezierCurveTo(0, -24, 4, -31, 12, -32); ctx.bezierCurveTo(40, -36, 46, 4, 0, 30); ctx.closePath();
        const hg = ctx.createRadialGradient(-8, -10, 2, 0, 0, 44); hg.addColorStop(0, "#fffaf0"); hg.addColorStop(1, "#f1dfc4");
        ctx.fillStyle = hg; ctx.fill(); ctx.strokeStyle = "rgba(160,100,55,.35)"; ctx.lineWidth = 2; ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
      ctx.restore();
    }
  };
  const drawCupFront = () => {
    const { x, y, rx, ry } = CUP;
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI);
    ctx.strokeStyle = "#f8f4ee"; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x, y, rx + 1.5, ry + 1.5, 0, 0, TAU); ctx.strokeStyle = "#c9a066"; ctx.lineWidth = 1.6; ctx.stroke();
    // printed logo on the cup
    ctx.save(); ctx.globalAlpha = .9;
    ctx.fillStyle = "#b88d52"; ctx.font = "italic 400 15px Fraunces, Georgia, serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("First Sip", x - 8, y + 58);
    ctx.restore();
  };

  const drawSteam = (amt, t, x, y) => {
    if (amt <= 0) return;
    ctx.save(); ctx.lineCap = "round";
    for (let k = 0; k < 3; k++) {
      const ph = reduced ? 0 : t * .9 + k * 2.1;
      const bx = x + (k - 1) * 30;
      ctx.beginPath(); ctx.moveTo(bx, y);
      ctx.bezierCurveTo(bx + Math.sin(ph) * 26, y - 70, bx - Math.sin(ph + 1.3) * 30, y - 130, bx + Math.sin(ph + 2.2) * 22, y - 210);
      const g = ctx.createLinearGradient(0, y, 0, y - 210);
      g.addColorStop(0, `rgba(255,255,255,0)`); g.addColorStop(.25, `rgba(255,255,255,${.55 * amt})`); g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = g; ctx.lineWidth = 14; ctx.globalAlpha = .55; ctx.stroke();
      ctx.lineWidth = 4; ctx.globalAlpha = .8; ctx.stroke();
    }
    ctx.restore();
  };

  const mix = (a, b, t) => {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const r = Math.round(lerp(pa >> 16, pb >> 16, t)), g = Math.round(lerp((pa >> 8) & 255, (pb >> 8) & 255, t)), bl = Math.round(lerp(pa & 255, pb & 255, t));
    return `rgb(${r},${g},${bl})`;
  };

  /* ---------- HUD ---------- */
  const STAGES = [
    { label: "Roasted beans", k: "Roast temp", v: "218°C" },
    { label: "Fresh grinding", k: "Grind size", v: "600 µm" },
    { label: "Slow brewing", k: "Water", v: "93°C" },
    { label: "Pouring your cup", k: "Ratio", v: "1 : 16" },
    { label: "Your first sip", k: "Ready in", v: "4 min" },
  ];
  let lastStage = -1;
  const hud = (p) => {
    const stage = p >= .985 ? 4 : Math.min(3, Math.floor(p * 4));
    if (stage !== lastStage) {
      lastStage = stage;
      if (label) label.textContent = STAGES[stage].label;
      if (metaK) metaK.textContent = STAGES[stage].k;
      if (metaV) metaV.textContent = STAGES[stage].v;
    }
    dots.forEach((d, i) => (d.style.transform = `scaleX(${clamp(p * 4 - i)})`));
  };

  /* ---------- frame ---------- */
  const render = (p, t) => {
    const s1 = seg(p, 0, .25), s2 = seg(p, .25, .5), s3 = seg(p, .5, .75), s4 = seg(p, .75, 1);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    // backdrop
    let g = ctx.createRadialGradient(W * .5, H * .32, 10, W * .5, H * .5, Math.max(W, H) * .8);
    g.addColorStop(0, "#fffcf6"); g.addColorStop(.55, "#f5eadb"); g.addColorStop(1, "#e3d1b6");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    const camY = 600 * eIO(seg(s4, 0, .35));
    ctx.setTransform(DPR * S, 0, 0, DPR * S, DPR * S * OX, DPR * S * (OY - camY));

    // big soft light disc behind the scene
    g = ctx.createRadialGradient(300, 420 + camY, 20, 300, 420 + camY, 420);
    g.addColorStop(0, "rgba(255,255,255,.7)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(-300, camY - 200, 1200, 1400);

    // mug motion
    const lift = eIO(seg(s4, 0, .35));
    const tiltIn = eIO(seg(s4, .3, .5));
    const pour = seg(s4, .42, .9);
    const back = eIO(seg(s4, .9, 1));
    const mugX = lerp(300, 214, lift) - back * 160;
    const mugY = lerp(760, 1080, lift) - back * 20;
    const ang = (1.08 * tiltIn + .22 * pour) * (1 - back);
    const brewFill = .8 * eOut(seg(s3, .18, 1));
    const mugFill = brewFill * (1 - pour * .97);

    softShadow(300, 880, 110, 14, 1 - lift);

    // grinder leaves when the kettle arrives
    const gUp = -620 * eIO(seg(s3, 0, .2));
    if (gUp > -600) drawGrinder(s1, s2, t, gUp);
    const top = moundTopAt(s2, s3);
    drawPowderFall(s2, t, gUp, top);

    const tip = s3 > 0 && s3 < 1 ? drawKettle(s3, t) : null;
    const water = seg(s3, .14, .22) * (1 - seg(s3, .78, .86));
    if (tip && water > 0) {
      const wob = reduced ? 0 : Math.sin(t * 7) * 2;
      stream(tip, [tip[0] - 6, tip[1] + 20], [302 + wob, top - 60], [300, top - 2], 4.2, 3.2, WATER, water);
    }

    const dripperDY = -320 * lift, dripperA = 1 - seg(s4, .05, .3);
    drawDripper(s2, s3, t, dripperDY, dripperA, top);
    const drip = seg(s3, .2, .3) * (1 - seg(s4, 0, .08));
    if (drip > 0) {
      const level = 650 + 96 + 110 - brewFill * 196;
      stream([300, 648], [300, 670], [300 + (reduced ? 0 : Math.sin(t * 5)), level - 40], [300, level], 3, 2.2, COFFEE, drip);
    }

    // cup (sits low in the world, revealed as the camera pans)
    const L = eOut(pour);
    const heart = eOut(seg(s4, .9, 1));
    drawCupBack(L, heart, t);

    ctx.save(); ctx.globalAlpha = 1 - back;
    const lip = drawMug(mugX, mugY, ang, mugFill, t);
    ctx.restore();
    const flow = pour > 0 && pour < 1 ? Math.min(1, pour / .06, (1 - pour) / .06) : 0;
    if (flow > 0) {
      const s = cupSurface(L);
      const end = [CUP.x - 18, s.y];
      const wob = reduced ? 0 : Math.sin(t * 8) * 2.5;
      stream(lip, [lip[0] + 34, lip[1] + 4], [end[0] - 10 + wob, end[1] - 70], end, 11 * flow, 7 * flow, COFFEE, 1);
      // ripples where the stream lands
      ctx.save(); ctx.beginPath(); ctx.ellipse(CUP.x, CUP.y, CUP.rx - 4, CUP.ry - 1.5, 0, 0, TAU); ctx.clip();
      for (let k = 0; k < 3; k++) {
        const ph = ((reduced ? .5 : t * 1.4) + k / 3) % 1;
        ctx.beginPath(); ctx.ellipse(end[0], end[1], 8 + ph * 40, (8 + ph * 40) * .2, 0, 0, TAU);
        ctx.strokeStyle = `rgba(240,200,150,${.35 * (1 - ph) * flow})`; ctx.lineWidth = 1.2; ctx.stroke();
      }
      ctx.restore();
    }
    drawCupFront();
    drawSteam(seg(L, .45, 1), t, CUP.x, CUP.y - 6);

    // film grain + vignette (screen space)
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (!grainPattern) grainPattern = ctx.createPattern(grain, "repeat");
    ctx.fillStyle = grainPattern; ctx.fillRect(0, 0, W, H);
    g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .75);
    g.addColorStop(0, "rgba(90,60,30,0)"); g.addColorStop(1, "rgba(90,60,30,.16)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  };

  /* ---------- scroll → progress ---------- */
  const target = () => {
    const vh = window.innerHeight;
    let sum = 0, active = -1;
    steps.forEach((st, i) => {
      const r = st.getBoundingClientRect();
      sum += clamp((vh * .62 - r.top) / r.height);
      if (r.top < vh * .62) active = i;
    });
    steps.forEach((st, i) => st.classList.toggle("is-active", i === active || (active === -1 && i === 0 && false)));
    return clamp(sum / steps.length);
  };

  let p = 0, visible = false, raf = 0;
  const start = performance.now();
  const loop = (now) => {
    const goal = target();
    p = reduced ? goal : p + (goal - p) * .14;
    if (Math.abs(goal - p) < .0005) p = goal;
    render(p, (now - start) / 1000);
    hud(p);
    raf = visible ? requestAnimationFrame(loop) : 0;
  };
  new IntersectionObserver((ents) => {
    visible = ents[0].isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(loop);
  }, { rootMargin: "200px 0px" }).observe(section);
  window.addEventListener("resize", () => { resize(); render(p, (performance.now() - start) / 1000); });
  resize();
  render(0, 0); hud(0);
  if (document.fonts) document.fonts.ready.then(() => render(p, (performance.now() - start) / 1000));
})();
