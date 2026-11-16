(() => {
"use strict";
const A = window.AUR; if (!A) return;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const NS = "http://www.w3.org/2000/svg";

/* ---------- shared: human silhouette (Catmull-Rom through half outline, mirrored) ---------- */
const LEFT = [[150,20],[132,26],[121,44],[120,62],[124,80],[134,94],[138,106],[124,112],[104,117],[92,127],[86,147],[82,177],[78,211],[74,247],[70,283],[66,317],[62,343],[59,358],[64,369],[72,359],[78,331],[84,297],[90,263],[95,229],[100,197],[103,173],[105,190],[106,212],[104,250],[100,290],[98,330],[102,362],[108,420],[112,470],[112,520],[114,568],[111,594],[116,606],[136,606],[138,592],[136,560],[138,510],[140,470],[144,410],[148,372],[150,366]];
const OUTLINE = LEFT.concat(LEFT.slice(1, -1).reverse().map(([x, y]) => [300 - x, y]));
function smooth(pts) {
  const n = pts.length, P = i => pts[(i + n) % n]; let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n; i++) { const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`; }
  return d + "Z";
}
const BODY = smooth(OUTLINE);

/* =====================================================================
   1. JOURNEY THROUGH THE BODY
   ===================================================================== */
if ($("#journey")) {
const CH = [
  { o: "heart", cam: [160, 208, 5], num: "01", h: "It starts with a <em>heartbeat.</em>", p: "Your heart beats about 100,000 times a day. Our cardiac team makes sure every one counts: a 24×7 cath lab, a hybrid operating room and a heart-failure clinic that follows you home.", stat: ["58 min", "average door-to-balloon time"], dept: "card", ring: [160, 211] },
  { o: null, cam: [150, 315, 1], num: "02", h: "The whole of you, <em>in one place.</em>", p: "Forty-two specialities work as one team and share a single digital record, so nothing about you gets lost between doctors, floors or visits.", stat: ["600+", "specialists, one record"] },
  { o: "brain", cam: [150, 50, 3.8], num: "03", h: "When minutes <em>mean neurons.</em>", p: "Our stroke code activates in under ten minutes. Neurologists, neurosurgeons and rehab therapists work side by side, from migraine care to minimally invasive spine surgery.", stat: ["< 10 min", "stroke code activation"], dept: "neuro", ring: [150, 49] },
  { o: "lungs", cam: [150, 190, 2.4], num: "04", h: "Every breath, <em>supported.</em>", p: "Asthma, COPD and sleep apnoea are treated with personalised plans, interventional bronchoscopy and an overnight sleep lab, all on one floor.", stat: ["22,000", "breaths you take every day"], dept: "pulmo", ring: [150, 190] },
  { o: "gut", cam: [150, 272, 2.6], num: "05", h: "Gut feeling, <em>backed by science.</em>", p: "Advanced endoscopy, a dedicated liver clinic and a liver-transplant programme, with dietitians embedded in every team.", stat: ["9 m", "of digestive tract we look after"], dept: "gastro", ring: [150, 268] },
  { o: "kidney", cam: [150, 298, 3], num: "06", h: "Quiet organs, <em>serious care.</em>", p: "Your kidneys filter about 180 litres of blood a day. Our 40-station dialysis centre and transplant unit keep that going when they can’t.", stat: ["180 L", "of blood filtered daily"], dept: "neph", ring: [150, 298] },
  { o: "knee", cam: [150, 478, 2.6], num: "07", h: "Back on your feet, <em>faster.</em>", p: "Robotic knee and hip replacement means smaller cuts and more precise alignment. Most patients are walking within 24 hours.", stat: ["24 h", "to first steps after robotic knee surgery"], dept: "ortho" },
  { o: "all", cam: [150, 315, 1], num: "08", h: "Ready <em>when you are.</em>", p: "Whatever brings you in, start with the right doctor. Book an OP visit in a minute, or tell us where it hurts and we’ll guide you.", stat: ["11 min", "average OPD wait today"], final: true }
];
const N = CH.length;
const sec = $("#journey"); sec.style.setProperty("--n", N);
$("#storyCh").innerHTML = CH.map((c, i) => `<div class="sch" data-i="${i}"><div class="num">${c.num} <span>/ 0${N}</span></div><h3>${c.h}</h3><p>${c.p}</p><div class="stat"><b>${c.stat[0]}</b>${c.stat[1]}</div>${c.final
  ? `<div class="acts"><a href="book.html" class="btn btn-gold">Book an OP visit</a><a href="symptoms.html" class="btn btn-ghost">Where does it hurt?</a></div>`
  : c.dept ? `<div class="acts"><a href="doctors.html?dept=${c.dept}" class="btn btn-ghost btn-sm">Meet the ${A.D(c.dept).name} team →</a></div>` : ""}</div>`).join("");
$("#storyRail").innerHTML = CH.map((_, i) => `<button aria-label="Chapter ${i + 1}" data-j="${i}"><i></i></button>`).join("");
$("#storyRail").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; const total = sec.offsetHeight - innerHeight; scrollTo({ top: sec.offsetTop + (+b.dataset.j / (N - 1)) * total + 2, behavior: "smooth" }); });

const RIBS = Array.from({ length: 7 }, (_, i) => { const y = 140 + i * 12.5, w = 40 - Math.max(0, i - 4) * 4, d = 18 + i * 2.5;
  return `<path d="M146 ${y} C134 ${y - 6} ${150 - w} ${y - 2} ${150 - w - 3} ${y + d * .55} C${150 - w - 3} ${y + d} ${150 - w + 6} ${y + d + 4} ${150 - w + 14} ${y + d + 2}"/>`
       + `<path d="M154 ${y} C166 ${y - 6} ${150 + w} ${y - 2} ${150 + w + 3} ${y + d * .55} C${150 + w + 3} ${y + d} ${150 + w - 6} ${y + d + 4} ${150 + w - 14} ${y + d + 2}"/>`; }).join("");
const SI = (() => { const sp = 8.2, x0 = 136, x1 = 166, n = 5, seg = 6; let d = `M${x0} 298`; for (let r = 0; r < n; r++) { const y = 298 + r * sp, dir = r % 2 ? -1 : 1, from = dir > 0 ? x0 : x1, step = (x1 - x0) / seg; for (let k = 0; k < seg; k++) { const xa = from + dir * step * (k + .5), xb = from + dir * step * (k + 1); d += ` Q${xa.toFixed(1)} ${(y + (k % 2 ? 1.3 : -1.3)).toFixed(1)} ${xb.toFixed(1)} ${y}`; } if (r < n - 1) d += ` A${sp / 2} ${sp / 2} 0 0 ${dir > 0 ? 1 : 0} ${dir > 0 ? x1 : x0} ${y + sp}`; } return d; })();
$("#storySvg").innerHTML = `
<defs>
  <linearGradient id="skinG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9a98f"/><stop offset=".3" stop-color="#f1d3bf"/><stop offset=".5" stop-color="#f6ddcb"/><stop offset=".7" stop-color="#f1d3bf"/><stop offset="1" stop-color="#d9a98f"/></linearGradient>
  <radialGradient id="skinHi" cx="45%" cy="28%" r="55%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <radialGradient id="sbFloor" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#1f7f7a" stop-opacity=".28"/><stop offset="1" stop-color="#1f7f7a" stop-opacity="0"/></radialGradient>
  <linearGradient id="sbScan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a9b95" stop-opacity="0"/><stop offset=".85" stop-color="#2a9b95" stop-opacity=".08"/><stop offset="1" stop-color="#2a9b95" stop-opacity=".3"/></linearGradient>
  <radialGradient id="sgMyo" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#f26a5a"/><stop offset=".5" stop-color="#c8312e"/><stop offset="1" stop-color="#6e0f17"/></radialGradient>
  <radialGradient id="sgAtr" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ef8a7c"/><stop offset="1" stop-color="#a8323a"/></radialGradient>
  <radialGradient id="sgBrain" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffd3dc"/><stop offset=".6" stop-color="#ee9aae"/><stop offset="1" stop-color="#b85c78"/></radialGradient>
  <radialGradient id="sgLung" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#e7c1bf"/><stop offset=".6" stop-color="#c39294"/><stop offset="1" stop-color="#8d6064"/></radialGradient>
  <pattern id="lungTex" width="3.2" height="3.2" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".45" fill="#7b4c50" opacity=".28"/><circle cx="2.6" cy="2.4" r=".3" fill="#fff" opacity=".25"/></pattern>
  <radialGradient id="sgLiver" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#ec7f62"/><stop offset=".55" stop-color="#c94f37"/><stop offset="1" stop-color="#8a2b1e"/></radialGradient>
  <radialGradient id="sgStom" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#f9c7bb"/><stop offset="1" stop-color="#d98b80"/></radialGradient>
  <radialGradient id="sgKid" cx="35%" cy="35%" r="75%"><stop offset="0" stop-color="#e0786b"/><stop offset="1" stop-color="#7e2027"/></radialGradient>
  <radialGradient id="sgGall" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#c3d35a"/><stop offset="1" stop-color="#5f7316"/></radialGradient>
  <clipPath id="sbClip"><path d="${BODY}"/></clipPath>
</defs>
<g id="cam">
  <ellipse cx="150" cy="612" rx="62" ry="9" fill="url(#sbFloor)"/>
  <path d="${BODY}" fill="url(#skinG)" opacity=".62"/>
  <path d="${BODY}" fill="url(#skinHi)"/>
  <path d="${BODY}" fill="none" stroke="#b07f68" stroke-opacity=".55" stroke-width="1.3" vector-effect="non-scaling-stroke"/>
  <g clip-path="url(#sbClip)" fill="none" stroke="#9c6b55" stroke-opacity=".18" stroke-width="1.2" stroke-linecap="round">
    <path d="M118 140 C124 160 140 166 149 160 M182 140 C176 160 160 166 151 160"/>
    <path d="M150 236 V338 M134 250 H166 M136 270 H164 M138 290 H162"/>
    <path d="M104 126 C96 140 94 156 98 170 M196 126 C204 140 206 156 202 170"/>
    <path d="M118 400 C116 430 118 450 122 462 M182 400 C184 430 182 450 178 462"/>
  </g>

  <g class="vessels" fill="none" stroke-linecap="round" clip-path="url(#sbClip)">
    <g stroke="#3d64c9" stroke-width="2.6">
      <path d="M146 168 C130 136 114 134 100 137 C92 175 86 225 80 262 C76 292 72 322 64 354"/>
      <path d="M154 168 C170 136 186 134 200 137 C208 175 214 225 220 262 C224 292 228 322 236 354"/>
      <path d="M146 330 C136 348 128 362 125 382 L122 460 L120 590 M154 330 C164 348 172 362 175 382 L178 460 L180 590"/>
    </g>
    <g stroke="#3d64c9" stroke-width="1.1" opacity=".75"><path d="M90 200 L82 222 M86 250 L94 280 M210 200 L218 222 M214 250 L206 280 M122 420 L114 440 M178 420 L186 440"/></g>
    <g stroke="#d8323f" stroke-width="2.3">
      <path d="M152 178 C136 132 118 130 105 134 C97 172 91 222 85 260 C81 290 77 320 69 352"/>
      <path d="M160 178 C168 132 184 130 195 134 C203 172 209 222 215 260 C219 290 223 320 231 352"/>
      <path d="M152 330 C141 346 134 360 131 382 L128 460 L126 590 M152 330 C161 346 168 360 170 382 L173 460 L175 590"/>
    </g>
    <g stroke="#d8323f" stroke-width="1" opacity=".75"><path d="M95 190 L104 214 M88 240 L80 266 M205 190 L196 214 M212 240 L220 266 M129 410 L137 432 M172 410 L164 432"/></g>
  </g>

  <g class="organ" id="o-brain">
    <path d="M127 52 C125 35 139 27 152 29 C167 27 177 38 175 52 C177 63 166 71 150 69 C135 71 125 63 127 52Z" fill="url(#sgBrain)"/>
    <path d="M135 42 C139 37 145 44 150 39 C155 35 161 42 166 39 M133 52 C139 47 144 56 150 51 C156 47 161 56 168 52 M137 61 C143 58 148 63 154 60 C158 58 162 61 165 60 M150 30 V68" stroke="#a74a66" stroke-width="1.2" fill="none" opacity=".7"/>
    <g fill="#fff"><circle class="o-spark" cx="140" cy="45" r="1.4"/><circle class="o-spark" cx="160" cy="56" r="1.4" style="animation-delay:.6s"/><circle class="o-spark" cx="152" cy="40" r="1.2" style="animation-delay:1.1s"/></g>
  </g>

  <g class="organ" id="o-lungs">
    <g class="o-breathe">
      <path d="M143 142 C124 140 108 164 106 200 C105 226 114 242 130 240 C138 236 142 214 142 196 C138 186 140 166 143 142Z" fill="url(#sgLung)"/>
      <path d="M157 142 C176 140 192 164 194 200 C195 226 186 242 170 240 C162 236 160 222 162 206 C160 196 160 170 157 142Z" fill="url(#sgLung)"/>
      <path d="M143 142 C124 140 108 164 106 200 C105 226 114 242 130 240 C138 236 142 214 142 196 C138 186 140 166 143 142Z M157 142 C176 140 192 164 194 200 C195 226 186 242 170 240 C162 236 160 222 162 206 C160 196 160 170 157 142Z" fill="url(#lungTex)"/>
      <path d="M140 170 C128 182 118 196 112 214 M160 168 C172 180 182 194 188 210" stroke="#7b4c50" stroke-width=".9" fill="none" opacity=".45"/>
    </g>
    <path d="M150 104 V146 M150 146 C146 152 140 156 134 162 M150 146 C154 152 160 156 166 162" stroke="#efe2d6" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <path d="M150 106 V146" stroke="#c9b8a8" stroke-width="3.4" stroke-dasharray="1 2" fill="none"/>
  </g>

  <g class="neck">
    <path d="M144 86 C144 80 156 80 156 86 L157 98 C154 102 146 102 143 98Z" fill="#cfe0da" stroke="#8fa9a0" stroke-width=".6"/>
    <path d="M145 89 H155 M146 93 H154" stroke="#8fa9a0" stroke-width=".6"/>
    <path d="M150 104 C145 100 140 102 140 108 C140 113 145 114 148 111 L150 109 L152 111 C155 114 160 113 160 108 C160 102 155 100 150 104Z" fill="#f2a8a3" stroke="#c97a76" stroke-width=".5"/>
  </g>
  <g class="vessels central" fill="none" stroke-linecap="round">
    <path d="M141 178 C139 150 140 120 141 96 M159 178 C161 150 160 120 159 96" stroke="#d8323f" stroke-width="2.4"/>
    <path d="M136 172 C134 150 134 120 135 96 M164 172 C166 150 166 120 165 96" stroke="#3d64c9" stroke-width="2.6"/>
    <path d="M147 194 V166 M146 168 H154" stroke="#3d64c9" stroke-width="4"/>
    <path d="M147 236 C146 270 146 300 146 330" stroke="#3d64c9" stroke-width="4"/>
    <path d="M156 196 C154 182 158 174 165 175 C171 177 171 186 168 194 C164 220 153 250 152 330" stroke="#d8323f" stroke-width="4.2"/>
  </g>

  <g class="ribs" fill="none" stroke="#f1dfb4" stroke-width="2.6" stroke-linecap="round">
    <path d="M150 126 C136 121 120 121 102 127 M150 126 C164 121 180 121 198 127" stroke-width="4"/>
    <path d="M150 132 V200" stroke-width="6"/>
    ${RIBS}
  </g>

  <g class="organ" id="o-heart">
    <path d="M158 194 C163 184 172 182 182 184" stroke="#4f72cf" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    <g class="o-beat">
      <path d="M143 194 C138 186 146 180 152 185 C155 190 152 196 148 198Z" fill="url(#sgAtr)"/>
      <path d="M147 192 C136 198 136 216 146 228 C154 238 166 243 175 239 C181 228 183 212 177 200 C171 190 158 186 147 192Z" fill="url(#sgMyo)"/>
      <g fill="none" stroke-linecap="round">
        <path d="M156 194 C152 206 156 222 168 238 M156 206 L148 214 M158 218 L150 226 M162 226 L170 222" stroke="#ffb09f" stroke-width=".8" opacity=".9"/>
        <path d="M165 194 C170 206 174 218 174 232 M170 206 L176 212 M172 220 L178 222" stroke="#4f72cf" stroke-width=".7" opacity=".8"/>
      </g>
      <ellipse cx="152" cy="206" rx="5" ry="8" fill="#fff" opacity=".2" transform="rotate(-25 152 206)"/>
    </g>
  </g>

  <g class="organ" id="o-kidney">
    <ellipse cx="128" cy="292" rx="8.5" ry="14" fill="url(#sgKid)" transform="rotate(-12 128 292)"/>
    <ellipse cx="172" cy="292" rx="8.5" ry="14" fill="url(#sgKid)" transform="rotate(12 172 292)"/>
    <path d="M132 302 C138 318 144 330 147 340 M168 302 C162 318 156 330 153 340" stroke="#f0c56a" stroke-width="1.6" fill="none"/>
    <path class="o-flow" d="M132 302 C138 318 144 330 147 340 M168 302 C162 318 156 330 153 340" stroke="#fff" stroke-width="1" fill="none"/>
    <ellipse cx="150" cy="344" rx="8" ry="6" fill="#e9a35f" opacity=".9"/>
  </g>

  <g class="organ" id="o-gut">
    <path d="M140 268 C150 264 164 266 172 270 C170 274 156 276 142 274Z" fill="#f2c46a"/>
    <path d="M160 242 C178 234 196 246 192 266 C188 282 170 284 160 277 C153 271 156 262 164 260 C172 258 172 250 160 242Z" fill="url(#sgStom)"/>
    <path d="M110 240 C120 228 150 228 166 236 C171 240 169 246 163 250 C150 262 126 272 116 266 C109 258 107 248 110 240Z" fill="url(#sgLiver)"/>
    <path d="M140 232 C144 242 142 254 146 262" stroke="#f3d7b4" stroke-width="1.6" fill="none" opacity=".8"/>
    <ellipse cx="128" cy="266" rx="5.5" ry="4.5" fill="url(#sgGall)"/>
    <path d="M126 340 V294 C126 284 132 280 142 280 H160 C170 280 176 284 176 294 V340" fill="none" stroke="#dc8873" stroke-width="7" stroke-linecap="round"/>
    <path d="M126 340 V294 C126 284 132 280 142 280 H160 C170 280 176 284 176 294 V340" fill="none" stroke="#efa38f" stroke-width="9.5" stroke-linecap="round" stroke-dasharray="0.1 6.6"/>
    <path d="M126 340 V294 C126 284 132 280 142 280 H160 C170 280 176 284 176 294 V340" fill="none" stroke="#ffd6c9" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="0.1 6.6" transform="translate(-1 -1.5)" opacity=".8"/>
    <path d="${SI}" fill="none" stroke="#b9604e" stroke-width="5.6" stroke-linejoin="round"/>
    <path d="${SI}" fill="none" stroke="#f0a593" stroke-width="4" stroke-linejoin="round"/>
    <path class="o-flow" d="${SI}" stroke="#ffe2d8" stroke-width=".8" fill="none" opacity=".8"/>
  </g>

  <g class="organ" id="o-knee">
    <g stroke="#f1e2bf" stroke-width="5.5" stroke-linecap="round" fill="none">
      <path d="M118 348 C128 358 140 360 150 356 C160 360 172 358 182 348" stroke-width="5"/>
      <path d="M129 368 L126 462 M171 368 L174 462"/><path d="M125 480 L124 588 M175 480 L176 588"/>
    </g>
    <g fill="#f8eedb"><ellipse cx="126" cy="466" rx="8" ry="5"/><ellipse cx="174" cy="466" rx="8" ry="5"/><ellipse cx="125" cy="477" rx="7.5" ry="4"/><ellipse cx="175" cy="477" rx="7.5" ry="4"/></g>
    <circle cx="126" cy="470" r="4" fill="#ffd27a"/><circle cx="174" cy="470" r="4" fill="#ffd27a"/>
    <circle cx="126" cy="471" r="11" fill="none" stroke="#2a9b95" stroke-width=".8" stroke-dasharray="2 2"/><circle cx="174" cy="471" r="11" fill="none" stroke="#2a9b95" stroke-width=".8" stroke-dasharray="2 2"/>
  </g>
  <g clip-path="url(#sbClip)"><rect class="scan" x="0" y="0" width="300" height="70" fill="url(#sbScan)"/></g>
  <circle id="storyRing" class="ring-c" cx="160" cy="211" r="10" stroke-width=".6" opacity="0"/>
</g>`;
const cam = $("#cam"), ring = $("#storyRing"), stage = $("#storyStage");
const cur = { cx: 160, cy: 208, s: 5 }; let target = { ...cur }, active = -1, running = false;
function computeTarget() {
  const total = sec.offsetHeight - innerHeight, p = clamp(-sec.getBoundingClientRect().top / total);
  const f = p * (N - 1), i = Math.min(N - 2, Math.floor(f)); let t = clamp((f - i - 0.28) / 0.44); t = t * t * (3 - 2 * t);
  const a = CH[i].cam, b = CH[i + 1].cam;
  target = { cx: lerp(a[0], b[0], t), cy: lerp(a[1], b[1], t), s: Math.exp(lerp(Math.log(a[2]), Math.log(b[2]), t)) };
  const act = Math.round(f);
  $$("#storyRail i").forEach((el, j) => el.style.transform = `scaleX(${clamp(f - j + 1)})`);
  $("#storyHint").style.opacity = p > 0.02 ? 0 : 1;
  if (act !== active) {
    active = act;
    $$("#storyCh .sch").forEach((el, j) => { el.classList.toggle("on", j === act); el.classList.toggle("past", j < act); });
    const big = $("#storyBig"); if (big) { big.textContent = CH[act].num; big.classList.remove("swap"); void big.offsetWidth; big.classList.add("swap"); }
    const o = CH[act].o;
    stage.classList.toggle("all", !o || o === "all");
    $$(".organ", stage).forEach(g => g.classList.toggle("lit", g.id === "o-" + o));
    if (CH[act].ring) { ring.setAttribute("cx", CH[act].ring[0]); ring.setAttribute("cy", CH[act].ring[1]); ring.setAttribute("opacity", 1); } else ring.setAttribute("opacity", 0);
  }
}
function frame() {
  if (!running) return;
  computeTarget();
  cur.cx = lerp(cur.cx, target.cx, .1); cur.cy = lerp(cur.cy, target.cy, .1); cur.s = Math.exp(lerp(Math.log(cur.s), Math.log(target.s), .1));
  cam.setAttribute("transform", `translate(150 310) scale(${cur.s.toFixed(4)}) translate(${(-cur.cx).toFixed(2)} ${(-cur.cy).toFixed(2)})`);
  ring.setAttribute("r", (26 / cur.s).toFixed(2)); ring.setAttribute("stroke-width", (1.6 / cur.s).toFixed(3));
  requestAnimationFrame(frame);
}
new IntersectionObserver(es => es.forEach(e => { running = e.isIntersecting; if (running) requestAnimationFrame(frame); }), { rootMargin: "200px 0px" }).observe(sec);
computeTarget(); Object.assign(cur, target); frame();

}
/* =====================================================================
   2. BODY MAP SYMPTOM GUIDE
   ===================================================================== */
if ($("#bmSvg")) {
const R = true;
const REG = {
  head: { name: "Head", sym: [["Headache that keeps coming back", "neuro"], ["Migraine with flashing lights", "neuro"], ["Dizziness or spinning", "neuro"], ["Sudden weakness, face droop or slurred speech", "neuro", R], ["Fever with headache", "gen"], ["Memory problems", "neuro"]] },
  throat: { name: "Throat & neck", sym: [["Sore throat or cold", "gen"], ["Swelling in front of the neck", "endo"], ["Lump in the neck", "onco"], ["Difficulty swallowing", "gastro"], ["Hoarse voice for 3+ weeks", "gen"]] },
  chest: { name: "Chest", sym: [["Chest pain or pressure", "card"], ["Chest pain with sweating or arm pain", "card", R], ["Racing or irregular heartbeat", "card"], ["Breathless climbing stairs", "card"], ["Cough lasting 3+ weeks", "pulmo"], ["Wheezing or tight chest", "pulmo"], ["Severe breathlessness at rest", "pulmo", R]] },
  upperAbd: { name: "Upper abdomen", sym: [["Acidity or heartburn", "gastro"], ["Pain after meals", "gastro"], ["Bloating and gas", "gastro"], ["Yellow eyes or skin", "gastro"], ["Vomiting blood or black stools", "gastro", R], ["Diagnosed fatty liver", "gastro"]] },
  lowerAbd: { name: "Lower abdomen & pelvis", sym: [["Irregular or painful periods", "obgyn"], ["Pregnancy check-up", "obgyn"], ["Burning when passing urine", "neph"], ["Constipation or loose stools", "gastro"], ["Blood in stools", "gastro"], ["Sudden severe pain", "gen", R]] },
  shoulder: { name: "Shoulder", sym: [["Shoulder pain lifting the arm", "ortho"], ["Stiff, frozen shoulder", "ortho"], ["Dislocated or injured shoulder", "ortho"], ["Left shoulder pain with chest discomfort", "card", R]] },
  arm: { name: "Arm & hand", sym: [["Wrist or elbow pain", "ortho"], ["Numbness or tingling in fingers", "neuro"], ["Swollen, painful finger joints", "ortho"], ["Rash or itching on the skin", "derm"], ["Possible fracture after a fall", "ortho", R]] },
  knee: { name: "Knee", sym: [["Knee pain on stairs", "ortho"], ["Sports or twisting injury", "ortho"], ["Swollen knee", "ortho"], ["Knee locks or gives way", "ortho"], ["Long-standing arthritis", "ortho"]] },
  foot: { name: "Foot & ankle", sym: [["Heel pain in the morning", "ortho"], ["Sprained ankle", "ortho"], ["Wound that won’t heal (diabetic)", "endo"], ["Burning or numb feet", "endo"], ["Swollen ankles", "card"]] },
  neck: { name: "Back of neck", sym: [["Neck pain or stiffness", "neuro"], ["Pain spreading to the arm", "neuro"], ["Neck pain with high fever and stiffness", "gen", R]] },
  upperBack: { name: "Upper back", sym: [["Upper back pain from posture", "ortho"], ["Pain between shoulder blades", "ortho"], ["Back pain while breathing deeply", "pulmo"], ["Sudden tearing pain in the back", "card", R]] },
  lowerBack: { name: "Lower back", sym: [["Lower back pain", "neuro"], ["Pain shooting down the leg (sciatica)", "neuro"], ["Back pain after lifting", "ortho"], ["Back pain with loss of bladder control", "neuro", R]] },
  flank: { name: "Side of the back (kidneys)", sym: [["Dull ache on one side", "neph"], ["Puffy face or swollen feet", "neph"], ["Foamy or reduced urine", "neph"], ["Severe pain with fever and chills", "neph", R], ["High creatinine in a report", "neph"]] },
  calf: { name: "Calf & leg", sym: [["Leg cramps at night", "gen"], ["Varicose veins", "card"], ["Pain in calves while walking", "card"], ["One leg suddenly swollen and painful", "card", R]] },
  whole: { name: "Whole body", sym: [["Fever for more than 3 days", "gen"], ["Always tired", "gen"], ["Unexplained weight change", "endo"], ["Excess thirst and urination", "endo"], ["Skin rash, acne or hair fall", "derm"], ["Feeling faint or confused", "gen", R]] }
};
const SPOTS = {
  front: [["head", [[150, 46]]], ["throat", [[150, 100]]], ["chest", [[150, 168]]], ["shoulder", [[100, 128], [200, 128]]], ["upperAbd", [[150, 244]]], ["lowerAbd", [[150, 318]]], ["arm", [[66, 350], [234, 350]]], ["knee", [[126, 470], [174, 470]]], ["foot", [[124, 594], [176, 594]]]],
  back: [["head", [[150, 46]]], ["neck", [[150, 104]]], ["upperBack", [[150, 180]]], ["shoulder", [[100, 128], [200, 128]]], ["flank", [[118, 282], [182, 282]]], ["lowerBack", [[150, 318]]], ["arm", [[66, 350], [234, 350]]], ["calf", [[126, 535], [174, 535]]], ["foot", [[124, 596], [176, 596]]]]
};
const WHY = { card: "Your symptoms point to the heart and blood vessels.", neuro: "This sounds like it involves the nerves, brain or spine.", ortho: "This looks like a bone, joint or muscle problem.", pulmo: "These symptoms usually relate to the lungs and airways.", gastro: "This points to the digestive system or liver.", neph: "These are common signs of a kidney or urinary problem.", obgyn: "A women’s health specialist is the right first stop.", endo: "This may be linked to hormones, thyroid or diabetes.", derm: "A dermatologist treats skin, hair and nail problems.", gen: "A physician can examine you and refer you if needed.", onco: "A specialist should check any new lump promptly.", paed: "Children are best seen first by a paediatrician." };
const BM = { side: "front", region: null, picked: new Set() };
const bmSvg = $("#bmSvg");
function drawBody() {
  const back = BM.side === "back";
  bmSvg.innerHTML = `<defs><linearGradient id="bmFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--teal)" stop-opacity=".16"/><stop offset="1" stop-color="var(--teal)" stop-opacity=".05"/></linearGradient></defs>
  <g class="bm-body"><path d="${BODY}" fill="url(#bmFill)" stroke="var(--teal)" stroke-opacity=".45" stroke-width="1.4"/>
  ${back ? `<path d="M150 108 V352" stroke="var(--teal)" stroke-opacity=".35" stroke-width="2" stroke-dasharray="4 5"/><path d="M118 150 C112 170 116 196 130 206 M182 150 C188 170 184 196 170 206" stroke="var(--teal)" stroke-opacity=".3" fill="none" stroke-width="1.5"/>`
    : `<path d="M140 52 h.1 M160 52 h.1" stroke="var(--teal)" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/><path d="M143 70 Q150 75 157 70" stroke="var(--teal)" stroke-opacity=".4" fill="none" stroke-width="1.5"/><path d="M150 112 V340" stroke="var(--teal)" stroke-opacity=".15" stroke-width="1" stroke-dasharray="2 5"/>`}</g>
  ${SPOTS[BM.side].map(([k, pts]) => pts.map(([x, y], i) => `<g class="bm-spot ${BM.region === k ? "sel" : ""}" data-r="${k}" tabindex="${i ? -1 : 0}" role="button" aria-label="${REG[k].name}">
    <circle class="hit" cx="${x}" cy="${y}" r="20"/><circle class="halo" cx="${x}" cy="${y}" r="8" style="animation-delay:${(x + y) % 7 * .25}s"/><circle class="dot" cx="${x}" cy="${y}" r="7"/>
    <text class="lbl" x="${x > 150 ? x + 14 : x < 150 ? x - 14 : x + 14}" y="${y + 4}" text-anchor="${x < 150 ? "end" : "start"}">${REG[k].name}</text></g>`).join("")).join("")}`;
}
function nextSlot(d) {
  const now = new Date();
  for (let i = 0; i < 14; i++) { const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 12); if (!d.days.includes(dt.getDay())) continue; const s = A.slotsFor(d, dt).find(x => !x.booked && !x.past); if (s) return (i === 0 ? "Today" : i === 1 ? "Tomorrow" : dt.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" })) + ", " + s.label; }
  return "Fully booked";
}
function renderPanel() {
  const P = $("#bmPanel");
  if (!BM.region) { P.innerHTML = `<div class="bm-empty"><div class="big-ic"><svg><use href="#i-search"/></svg></div><h3>Where does it hurt?</h3><p>Tap a glowing point on the body, or choose a whole-body symptom below it. Turn the figure around for back pain.</p></div>`; return; }
  const reg = REG[BM.region], picked = [...BM.picked].map(i => reg.sym[i]);
  let html = `<div class="bm-sec"><h3>${reg.name}</h3><p class="sub">What are you feeling? Choose all that apply.</p><div class="sym-chips">${reg.sym.map(([t, , red], i) => `<button type="button" class="sym ${BM.picked.has(i) ? "on" : ""} ${red ? "red" : ""}" data-s="${i}" style="animation-delay:${i * 40}ms">${t}</button>`).join("")}</div></div>`;
  if (picked.length) {
    if (picked.some(s => s[2])) html += `<div class="bm-sec redflag"><span class="ring"><svg><use href="#i-phone"/></svg></span><div><b>This could be an emergency.</b><span>Please don’t wait for an OP slot. Call emergency services or come to our ER now.</span></div><button class="btn btn-white btn-sm" data-open="ambModal">Get an ambulance</button></div>`;
    const tally = {}; picked.forEach(([, d]) => tally[d] = (tally[d] || 0) + 1);
    let dept = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
    const child = $("#bmChild").checked && !picked.some(s => s[2]);
    if (child) dept = "paed";
    if (dept === "onco" || !A.DOCS.some(d => d.dept === dept)) dept = dept === "onco" ? "onco" : "gen";
    const conf = child ? 90 : Math.min(96, Math.round(58 + 38 * (tally[dept] || 1) / picked.length + Math.min(picked.length, 3) * 2));
    const C = 2 * Math.PI * 26, docs = A.DOCS.filter(d => d.dept === dept).slice(0, 2);
    html += `<div class="bm-sec"><div class="match"><span class="mi"><svg><use href="#i-${A.D(dept).icon}"/></svg></span><div><small>Recommended speciality</small><b>${A.D(dept).name}</b><p>${WHY[dept]}</p></div>
      <div class="conf"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,.12)"/><circle cx="32" cy="32" r="26" stroke="#7fd8cf" stroke-linecap="round" stroke-dasharray="0 ${C}" data-c="${conf / 100 * C} ${C}" style="transition:stroke-dasharray 1s cubic-bezier(.6,0,.2,1)"/></svg><span>${conf}% match</span></div></div>
      <div class="bm-docs">${docs.map((d, i) => `<div class="bm-doc" style="animation-delay:${i * 90}ms"><span class="av" style="${A.docAv(d)}">${A.initials(d.name)}</span><div class="t"><b>${d.name}</b><span>${nextSlot(d)} · ${A.inr(d.fee)}</span></div><button class="btn btn-primary btn-sm" data-bmbook="${d.id}">Book</button></div>`).join("")}</div></div>`;
  }
  html += `<p class="bm-note"><svg style="width:16px;height:16px;flex:none;margin-top:2px"><use href="#i-info"/></svg>A guide to the right department, not a diagnosis. If you’re unsure, a General Medicine visit is always a good start.</p>`;
  P.innerHTML = html;
  requestAnimationFrame(() => requestAnimationFrame(() => { const c = $(".conf circle[data-c]", P); if (c) c.style.strokeDasharray = c.dataset.c; }));
}
function pickRegion(k) {
  BM.region = k; BM.picked.clear();
  $$(".bm-spot", bmSvg).forEach(g => g.classList.toggle("sel", g.dataset.r === k));
  $("#bmGeneral button")?.classList.toggle("on", k === "whole");
  renderPanel();
  if (innerWidth < 1000) $("#bmPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}
bmSvg.addEventListener("click", e => { const g = e.target.closest(".bm-spot"); if (g) pickRegion(g.dataset.r); });
bmSvg.addEventListener("keydown", e => { const g = e.target.closest(".bm-spot"); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); pickRegion(g.dataset.r); } });
$("#bmGeneral").innerHTML = `<button type="button">Whole-body symptoms (fever, tiredness, rash…)</button>`;
$("#bmGeneral button").addEventListener("click", () => pickRegion("whole"));
$("#bmPanel").addEventListener("click", e => {
  const s = e.target.closest(".sym"); if (s) { const i = +s.dataset.s; BM.picked.has(i) ? BM.picked.delete(i) : BM.picked.add(i); renderPanel(); return; }
  const b = e.target.closest("[data-bmbook]"); if (b) { const d = A.DOCS.find(x => x.id === b.dataset.bmbook); location.href = "book.html?doc=" + d.id; }
});
$("#bmChild").addEventListener("change", () => BM.region && renderPanel());
A.segHandlers.side = v => { BM.side = v; if (BM.region && !SPOTS[v].some(([k]) => k === BM.region) && BM.region !== "whole") { BM.region = null; BM.picked.clear(); renderPanel(); } bmSvg.classList.add("flip"); setTimeout(() => { drawBody(); bmSvg.classList.remove("flip"); }, 10); };
drawBody(); renderPanel();

}
/* =====================================================================
   3. YOUR VISIT TIMELINE
   ===================================================================== */
if ($("#road")) {
const appts = A.store.get("aur-appts", []); const ap = appts[0];
const apDoc = ap && A.DOCS.find(d => d.id === ap.doc) || A.DOCS[0];
const myTok = ap ? ap.token : 9;
let serving = Math.max(1, myTok - 3), parking = 46;
const STOPS = [
  { t: "Arrive & park", m: 3, ic: "pin", p: "Drive in through Gate 2. Valet parking is free for patients, and wheelchairs and buggies wait at the porch for anyone who needs them.", tip: "Coming by cab? The Gate 2 drop-off is closest to the OPD lifts.",
    live: () => `<div class="lt"><span class="pulse-dot" style="background:#5ff0dc"></span>Live at Gate 2</div><div class="lbig"><span data-live="parking">${parking}</span> <small>valet spots free</small></div><p>Free for patients · open 24×7</p><div class="row3"><div><small>Wheelchairs</small><b>12</b></div><div><small>Buggy arrives in</small><b>2 min</b></div><div><small>Walk to OPD</small><b>90 s</b></div></div>` },
  { t: "Check in at a kiosk", m: 1, ic: "file", p: "Scan the QR code on your booking slip at any lobby kiosk. It confirms your details, prints your token and lets your doctor’s team know you’ve arrived.", tip: "No smartphone? Just type your mobile number at the kiosk.",
    live: () => `<div class="lt">Self check-in kiosk</div><div class="kiosk"><div class="qr">${A.qrSvg(ap ? ap.id : "AUR-DEMO")}</div><div><div class="lbig" style="font-size:44px;margin:0">Token ${String(myTok).padStart(2, "0")}</div><p>${ap ? "Your booking " + ap.id : "Scanning your booking slip…"}</p><p style="color:#5ff0dc;margin-top:6px">✓ Checked in · doctor notified</p></div></div>` },
  { t: "Vitals & triage", m: 5, ic: "heart", p: "A nurse checks your blood pressure, pulse, oxygen level, temperature and weight. The readings go straight into your digital record, so your doctor sees them before you walk in.", tip: "Loose sleeves make the blood-pressure check quicker.",
    live: () => `<div class="lt">Recorded to your health record</div><div class="lbig" style="font-size:44px">All vitals synced</div><div class="row3"><div><small>Blood pressure</small><b>118/76</b></div><div><small>SpO₂</small><b data-count2="98">0</b></div><div><small>Pulse</small><b data-count2="72">0</b></div></div>` },
  { t: "Relax in the lounge", m: 11, ic: "clock", p: "Your token shows on the lounge screens and on your phone. Have a coffee, use the free Wi-Fi or settle children in the play corner. We’ll text you two tokens before your turn.", tip: "Want to step out for a walk? Your phone will buzz when you’re nearly up.",
    live: () => `<div class="lt"><span class="pulse-dot" style="background:#5ff0dc"></span>OPD token board · ${apDoc.name}</div><div class="board"><div><small>Now serving</small><b data-live="serving">${String(serving).padStart(2, "0")}</b></div><div class="you"><small>Your token</small><b>${String(myTok).padStart(2, "0")}</b></div></div><p style="margin-top:14px">About <b style="color:#fff" data-live="wait">${Math.max(0, (myTok - serving) * 4)}</b> minutes to go · café, Wi-Fi and kids’ corner nearby</p>` },
  { t: "Your consultation", m: 15, ic: "chat", p: "Your doctor already has your history and today’s vitals, so the time goes to you, not paperwork. Prescriptions and test orders are sent digitally, so you have nothing to carry.", tip: "Write down your top three questions before you go in.",
    live: () => `<div class="lt">Your doctor</div><div style="display:flex;gap:16px;align-items:center;margin-top:16px;position:relative"><span style="width:72px;height:72px;border-radius:20px;display:grid;place-items:center;font-family:var(--serif);font-size:28px;${A.docAv(apDoc)}">${A.initials(apDoc.name)}</span><div><div style="font-family:var(--serif);font-size:26px;line-height:1.1">${apDoc.name}</div><p>${A.D(apDoc.dept).name} · ${apDoc.exp} yrs</p></div></div><div class="row3"><div><small>Room</small><b>OPD ${A.hash(apDoc.id) % 20 + 1}</b></div><div><small>Block</small><b>B · 2F</b></div><div><small>Rating</small><b>★ ${apDoc.rating}</b></div></div>` },
  { t: "Tests & pharmacy", m: 10, ic: "pill", p: "If you need blood tests or a scan, they’re on the same floor. Your medicines are packed while you’re in the consult, so they’re usually ready by the time you reach the counter.", tip: "Fasting test? Book a morning slot and have breakfast at our café afterwards.",
    live: () => `<div class="lt"><span class="pulse-dot" style="background:#5ff0dc"></span>Live queues</div><div class="lbig">4 <small>min at pharmacy</small></div><p>Prescription received · packing in progress</p><div class="row3"><div><small>Lab queue</small><b>6 min</b></div><div><small>Imaging</small><b>Floor 1</b></div><div><small>Walk</small><b>40 m</b></div></div>` },
  { t: "Head home", m: 2, ic: "hosp", p: "Pay on your phone or at any counter. Reports appear in your patient portal as soon as they’re signed, and a follow-up with the same doctor is free within 7 days.", tip: "Add your follow-up date to your calendar before you leave.",
    live: () => { const f = new Date(ap ? ap.date : Date.now()); f.setDate(f.getDate() + 7); return `<div class="phone"><div style="font-size:12px;color:#9fc2c8;text-align:center">Aurelia app</div><div class="pn"><i></i>Bill paid · receipt saved</div><div class="pn" style="animation-delay:.25s"><i></i>Prescription in your portal</div><div class="pn" style="animation-delay:.5s"><i></i>Reports ready by 6 PM</div><div class="pn" style="animation-delay:.75s"><i></i>Free follow-up till ${f.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div></div>`; } }
];
$("#visitPersonal").innerHTML = ap
  ? `<div class="visit-personal"><svg><use href="#i-cal"/></svg><span>Your visit: <b>${A.fmtDate(new Date(ap.date))}, ${ap.time}</b> with <b>${apDoc.name}</b>, token ${ap.token}. Here’s how your day will go.</span></div>`
  : `<div class="visit-personal"><svg><use href="#i-cal"/></svg><span>No appointment yet? <a href="book.html" style="color:var(--teal);font-weight:600">Book one in 60 seconds</a> and this walkthrough becomes personal.</span></div>`;
const road = $("#road");
road.innerHTML = `<defs><linearGradient id="roadGrad" x1="0" x2="1"><stop offset="0" stop-color="var(--teal)"/><stop offset="1" stop-color="var(--gold)"/></linearGradient></defs>
  <path id="roadPath" class="base" d="M40 125 C140 125 150 45 250 45 S360 145 450 145 S560 45 650 45 S760 145 850 145 S960 45 1060 45 S1140 105 1165 105"/>
  <path id="roadProg" class="prog" d="M40 125 C140 125 150 45 250 45 S360 145 450 145 S560 45 650 45 S760 145 850 145 S960 45 1060 45 S1140 105 1165 105"/>
  <g id="roadNodes"></g><g class="traveler" id="trav"><circle class="tglow" r="18"/><circle class="tdot" r="8"/></g>`;
const rp = $("#roadPath"), L = rp.getTotalLength(), prog = $("#roadProg");
prog.style.strokeDasharray = L; prog.style.strokeDashoffset = L;
const nodeLen = STOPS.map((_, i) => 24 + i * (L - 48) / (STOPS.length - 1));
$("#roadNodes").innerHTML = STOPS.map((s, i) => { const pt = rp.getPointAtLength(nodeLen[i]), up = pt.y < 95;
  return `<g class="node" data-i="${i}" tabindex="0" role="button" aria-label="Step ${i + 1}: ${s.t}"><circle class="n" cx="${pt.x}" cy="${pt.y}" r="21"/><g class="ic"><use href="#i-${s.ic}" x="${pt.x - 10}" y="${pt.y - 10}" width="20" height="20"/></g><text x="${pt.x}" y="${up ? pt.y - 34 : pt.y + 44}">${s.t}</text></g>`; }).join("");
const trav = $("#trav"); let travLen = nodeLen[0], vi = -1, auto = true, autoT, inView = false, liveT;
function moveTrav(to) {
  const from = travLen, t0 = performance.now(), dur = 1100; cancelAnimationFrame(moveTrav.raf);
  const step = t => { const p = Math.min(1, (t - t0) / dur), e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; travLen = from + (to - from) * e; const pt = rp.getPointAtLength(travLen); trav.setAttribute("transform", `translate(${pt.x} ${pt.y})`); if (p < 1) moveTrav.raf = requestAnimationFrame(step); };
  moveTrav.raf = requestAnimationFrame(step); prog.style.strokeDashoffset = L - to;
}
function showStop(i, user) {
  if (user) { auto = false; }
  vi = (i + STOPS.length) % STOPS.length; const s = STOPS[vi];
  if (vi === 3) serving = Math.max(1, myTok - 3);
  $$("#roadNodes .node").forEach((n, j) => { n.classList.toggle("cur", j === vi); n.classList.toggle("done", j < vi); });
  moveTrav(nodeLen[vi]);
  const rw = $("#roadWrap"); if (rw.scrollWidth > rw.clientWidth + 4) { const px = rp.getPointAtLength(nodeLen[vi]).x / 1200 * rw.scrollWidth; rw.scrollTo({ left: px - rw.clientWidth / 2, behavior: "smooth" }); }
  const elapsed = STOPS.slice(0, vi).reduce((a, x) => a + x.m, 0);
  $("#visitDetail").innerHTML = `<div class="vd-text" key="${vi}"><span class="vstep">Step ${vi + 1} of ${STOPS.length} · about ${elapsed} min in</span><h3>${s.t}</h3><span class="vtime"><svg><use href="#i-clock"/></svg>${s.m} min${vi === 3 ? " (live estimate)" : ""}</span><p>${s.p}</p><div class="vd-tip"><b>Tip</b>${s.tip}</div>
    <div class="vd-ctrl"><button class="icon-btn" data-vgo="-1" aria-label="Previous step" style="transform:scaleX(-1)"><svg><use href="#i-arrow"/></svg></button><button class="icon-btn" id="vPlay" aria-label="${auto ? "Pause" : "Play"} walkthrough">${auto ? "❚❚" : "▶"}</button><button class="icon-btn" data-vgo="1" aria-label="Next step"><svg><use href="#i-arrow"/></svg></button><div class="vd-bar"><i id="vBar"></i></div></div></div>
    <div class="vd-live">${s.live()}</div>`;
  $$("#visitDetail [data-count2]").forEach(el => A.tween(el, +el.dataset.count2, v => Math.round(v) + (el.dataset.count2 === "98" ? "%" : ""), 1400));
  const bar = $("#vBar"); clearTimeout(autoT);
  if (auto && inView) { bar.style.transition = "none"; bar.style.width = "0"; requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transition = "width 6s linear"; bar.style.width = "100%"; })); autoT = setTimeout(() => showStop(vi + 1), 6000); }
  else bar.style.width = ((vi + 1) / STOPS.length * 100) + "%";
}
$("#visitDetail").addEventListener("click", e => { const g = e.target.closest("[data-vgo]"); if (g) { showStop(vi + +g.dataset.vgo, true); return; } if (e.target.closest("#vPlay")) { auto = !auto; showStop(auto ? vi : vi, false); } });
$("#roadNodes").addEventListener("click", e => { const n = e.target.closest(".node"); if (n) showStop(+n.dataset.i, true); });
$("#roadNodes").addEventListener("keydown", e => { const n = e.target.closest(".node"); if (n && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); showStop(+n.dataset.i, true); } });
new IntersectionObserver(es => es.forEach(e => { const was = inView; inView = e.isIntersecting; if (inView && !was) { showStop(vi < 0 ? 0 : vi); } if (!inView) clearTimeout(autoT); }), { threshold: .35 }).observe($("#visit .visit-shell"));
liveT = setInterval(() => {
  parking = Math.max(30, Math.min(60, parking + Math.round((Math.random() - .5) * 4)));
  const pk = $('[data-live="parking"]'); if (pk) pk.textContent = parking;
  const sv = $('[data-live="serving"]'); if (sv && serving < myTok) { serving++; sv.textContent = String(serving).padStart(2, "0"); sv.classList.remove("flip"); void sv.offsetWidth; sv.classList.add("flip"); const w = $('[data-live="wait"]'); if (w) w.textContent = Math.max(0, (myTok - serving) * 4); if (serving === myTok) A.toast(`Token ${myTok}: it’s your turn (demo)`); }
}, 2600);
setTimeout(() => A.tween($("#visitTotal"), STOPS.reduce((a, s) => a + s.m, 0), v => Math.round(v), 1400), 400);
showStop(0); trav.setAttribute("transform", (() => { const pt = rp.getPointAtLength(nodeLen[0]); return `translate(${pt.x} ${pt.y})`; })());

}
/* tile hover tilt */
$$(".tile").forEach(el => {
  el.addEventListener("mousemove", e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.setProperty("--ry", (x * 14).toFixed(2) + "deg"); el.style.setProperty("--rx", (-y * 14).toFixed(2) + "deg"); });
  el.addEventListener("mouseleave", () => { el.style.setProperty("--ry", "0deg"); el.style.setProperty("--rx", "0deg"); });
});
/* hero: first scroll bursts objects out of the heart; further scroll flies them into the cards */
if ($(".hero3d") && $(".tiles")) {
  const h3 = $(".hero3d"), objs = $$(".hero3d .o3[data-t]"), tiles = $$(".tiles .tile");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  objs.forEach(o => { const ti = $(".ti", tiles[+o.dataset.t]); if ($(".ti3d", ti)) return; const svg = $("svg", o).cloneNode(true); svg.classList.add("ti3d"); $("svg", ti)?.remove(); ti.prepend(svg); });
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  let rel = [], ticking = false;
  function measure() {
    objs.forEach(o => o.style.transform = "");
    const sr = h3.getBoundingClientRect();
    rel = objs.map(o => { const r = o.getBoundingClientRect(); return { x: (r.left + r.width / 2 - sr.left) / sr.width, y: (r.top + r.height / 2 - sr.top) / sr.height, w: r.width / sr.width }; });
    render();
  }
  function render() {
    ticking = false;
    const sr = h3.getBoundingClientRect(), sceneMid = sr.top + sr.height / 2 + scrollY;
    const trigger = Math.max(8, sceneMid - innerHeight * .72);
    const burst = reduce || scrollY > trigger;
    h3.classList.toggle("burst", burst);
    const tt = tiles[0].getBoundingClientRect().top + scrollY;
    const f0 = trigger + 170, f1 = Math.max(f0 + 320, tt - innerHeight * .42);
    const F = reduce ? 1 : clamp((scrollY - f0) / (f1 - f0));
    objs.forEach((o, i) => {
      const k = +o.dataset.t, tile = tiles[k], r = rel[i];
      const tk = ease(clamp((F - k * .05) / .5));
      tile.style.setProperty("--tf", `translateY(${((1 - tk) * 70).toFixed(1)}px) rotateX(${((1 - tk) * 38).toFixed(1)}deg) rotateY(${((1 - tk) * -12).toFixed(1)}deg) scale(${(.9 + .1 * tk).toFixed(3)})`);
      tile.style.opacity = clamp(tk * 1.6).toFixed(3);
      const fk = ease(clamp((F - .2 - k * .06) / .45));
      if (fk > 0) {
        const t = $(".ti", tile).getBoundingClientRect();
        const nx = sr.left + r.x * sr.width, ny = sr.top + r.y * sr.height, nw = r.w * sr.width;
        const dx = t.left + t.width / 2 - nx, dy = t.top + t.height / 2 - ny, s = t.width * .82 / nw;
        o.style.transform = `translate(${(dx * fk).toFixed(1)}px, ${(dy * fk).toFixed(1)}px) scale(${(1 + (s - 1) * fk).toFixed(4)})`;
      } else o.style.transform = "";
      o.style.opacity = fk >= .995 ? 0 : 1;
      tile.classList.toggle("landed", fk >= .995);
    });
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(render); } };
  measure();
  addEventListener("scroll", req, { passive: true });
  addEventListener("resize", measure);
  addEventListener("load", measure);
  document.fonts?.ready.then(measure);
}
A.observeAll && A.observeAll();
requestAnimationFrame(A.placeThumbs);
})();
