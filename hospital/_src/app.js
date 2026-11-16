(() => {
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const icon = id => `<svg><use href="#i-${id}"/></svg>`;
function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 3200); }

/* ---------------- DATA ---------------- */
const DEPTS = [
  { id: "card", name: "Cardiology", icon: "heart", short: "Heart & vascular", desc: "Interventional cardiology, heart failure clinic and cardiac surgery with a 24×7 cath lab." },
  { id: "neuro", name: "Neurosciences", icon: "brain", short: "Brain & spine", desc: "Stroke unit, epilepsy monitoring, movement disorders and minimally invasive spine surgery." },
  { id: "ortho", name: "Orthopaedics", icon: "bone", short: "Bones & joints", desc: "Robotic knee and hip replacement, sports injuries, arthroscopy and trauma." },
  { id: "onco", name: "Oncology", icon: "ribbon", short: "Cancer care", desc: "Medical, surgical and radiation oncology, with tumour boards for every case." },
  { id: "paed", name: "Paediatrics", icon: "baby", short: "Child health", desc: "Level-III NICU, paediatric surgery, vaccinations and child development clinic." },
  { id: "neph", name: "Nephrology", icon: "kidney", short: "Kidney care", desc: "Dialysis centre with 40 stations, kidney transplant and CKD clinic." },
  { id: "gastro", name: "Gastroenterology", icon: "stomach", short: "Digestive & liver", desc: "Advanced endoscopy, liver clinic, IBD care and liver transplant." },
  { id: "obgyn", name: "Women’s Health", icon: "female", short: "Obstetrics & gynaecology", desc: "High-risk pregnancy, fertility, painless delivery and laparoscopic gynaecology." },
  { id: "endo", name: "Endocrinology", icon: "pill", short: "Diabetes & thyroid", desc: "Diabetes reversal programme, thyroid, PCOS and hormone disorders." },
  { id: "pulmo", name: "Pulmonology", icon: "lungs", short: "Lungs & sleep", desc: "Asthma and COPD care, interventional bronchoscopy and sleep lab." },
  { id: "derm", name: "Dermatology", icon: "skin", short: "Skin & hair", desc: "Clinical dermatology, lasers, hair restoration and cosmetology." },
  { id: "gen", name: "General Medicine", icon: "hosp", short: "Internal medicine", desc: "Fevers, infections, chronic illness and your first stop for any concern." },
  { id: "diet", name: "Clinical Nutrition", icon: "skin", short: "Dietitians", desc: "Therapeutic diet plans for diabetes, kidney, heart, liver and weight management." }
];
const D = id => DEPTS.find(d => d.id === id);
const COLORS = ["#0f7a72,#0a2533", "#2b9c96,#1d6b6f", "#3d5a80,#1b263b", "#8e5572,#3b1f2b", "#2a9d8f,#164e48", "#c06c52,#5e2a1c", "#577590,#22333b", "#6d597a,#2d2238"];
const DOCS = [
  { id: "d1", name: "Dr. Elena Marquez", dept: "card", title: "Senior Consultant, Interventional Cardiology", exp: 22, deg: "MD, FACC (Cardiology)", langs: "English, Spanish", fee: 1200, rating: 4.9, days: [1, 2, 3, 4, 5, 6], sess: [[9, 13], [16, 18]], tags: "heart attack chest pain angioplasty bp" },
  { id: "d2", name: "Dr. Omar Haddad", dept: "card", title: "Director, Cardiac Surgery", exp: 28, deg: "MD, FRCS (Cardiothoracic)", langs: "English, Arabic, French", fee: 1500, rating: 4.8, days: [1, 3, 5], sess: [[10, 14]], tags: "bypass valve surgery heart" },
  { id: "d3", name: "Dr. Meera Iyer", dept: "neuro", title: "Head, Neurology & Stroke", exp: 19, deg: "MD, DM (Neurology)", langs: "English, Tamil", fee: 1300, rating: 4.9, days: [1, 2, 4, 5, 6], sess: [[9, 13], [15, 17]], tags: "stroke migraine epilepsy headache seizure" },
  { id: "d4", name: "Dr. Arjun Shetty", dept: "neuro", title: "Consultant Spine Surgeon", exp: 14, deg: "MS, MCh (Neurosurgery)", langs: "English, Kannada, Tulu", fee: 1200, rating: 4.7, days: [2, 4, 6], sess: [[11, 15]], tags: "back pain spine disc slip sciatica" },
  { id: "d5", name: "Dr. Rahul Kapoor", dept: "ortho", title: "Chief, Joint Replacement", exp: 24, deg: "MS (Ortho), Fellowship (Arthroplasty)", langs: "English, Hindi, Punjabi", fee: 1200, rating: 4.9, days: [1, 2, 3, 4, 5], sess: [[9, 12], [16, 19]], tags: "knee hip replacement arthritis joint" },
  { id: "d6", name: "Dr. Sofia Rossi", dept: "ortho", title: "Consultant, Sports Medicine", exp: 11, deg: "MD, Fellowship (Sports Medicine)", langs: "English, Italian", fee: 1000, rating: 4.8, days: [1, 3, 5, 6], sess: [[10, 13], [17, 19]], tags: "ligament acl sports injury shoulder knee" },
  { id: "d7", name: "Dr. Daniel Tan", dept: "onco", title: "Senior Consultant, Medical Oncology", exp: 20, deg: "MBBS, FRCP (Medical Oncology)", langs: "English, Mandarin, Malay", fee: 1500, rating: 4.9, days: [1, 2, 3, 4, 5], sess: [[9, 14]], tags: "cancer chemotherapy tumour breast lung" },
  { id: "d8", name: "Dr. Amara Okafor", dept: "paed", title: "Consultant Paediatrician & Neonatologist", exp: 16, deg: "MD, FAAP (Neonatology)", langs: "English, Igbo, French", fee: 900, rating: 4.9, days: [1, 2, 3, 4, 5, 6], sess: [[9, 13], [17, 20]], tags: "child baby fever vaccination newborn" },
  { id: "d9", name: "Dr. Farhan Qureshi", dept: "neph", title: "Head, Nephrology & Transplant", exp: 21, deg: "MD, DM (Nephrology)", langs: "English, Urdu, Hindi", fee: 1300, rating: 4.8, days: [1, 2, 4, 5], sess: [[10, 14]], tags: "kidney ckd dialysis creatinine transplant" },
  { id: "d10", name: "Dr. Grace Mensah", dept: "gastro", title: "Consultant Gastroenterologist", exp: 13, deg: "MD, FACG (Gastroenterology)", langs: "English, Twi", fee: 1100, rating: 4.7, days: [1, 2, 3, 5, 6], sess: [[9, 12], [15, 18]], tags: "acidity liver fatty liver endoscopy ibs stomach" },
  { id: "d11", name: "Dr. Margaret Hughes", dept: "obgyn", title: "Senior Consultant, Obstetrics", exp: 25, deg: "MBBS, FRCOG", langs: "English, Welsh", fee: 1200, rating: 4.9, days: [1, 2, 3, 4, 5, 6], sess: [[9, 13], [16, 18]], tags: "pregnancy delivery pcos fertility women" },
  { id: "d12", name: "Dr. Kwame Asante", dept: "endo", title: "Consultant Endocrinologist", exp: 15, deg: "MD, FACE (Endocrinology)", langs: "English, Twi, French", fee: 1100, rating: 4.8, days: [1, 2, 3, 4, 5, 6], sess: [[9, 13], [16, 19]], tags: "diabetes sugar thyroid pcos obesity hormone" },
  { id: "d13", name: "Dr. Lukas Weber", dept: "pulmo", title: "Consultant Pulmonologist", exp: 12, deg: "Dr. med., FCCP (Pulmonology)", langs: "English, German", fee: 1000, rating: 4.7, days: [2, 3, 4, 6], sess: [[10, 13], [16, 18]], tags: "asthma cough copd breathing sleep apnea" },
  { id: "d14", name: "Dr. Nia Williams", dept: "derm", title: "Consultant Dermatologist", exp: 10, deg: "MD, FAAD (Dermatology)", langs: "English", fee: 900, rating: 4.8, days: [1, 2, 3, 4, 5, 6], sess: [[11, 14], [17, 20]], tags: "skin acne hair fall eczema" },
  { id: "d15", name: "Dr. Richard Collins", dept: "gen", title: "Senior Physician, Internal Medicine", exp: 27, deg: "MD, FACP (Internal Medicine)", langs: "English", fee: 800, rating: 4.8, days: [0, 1, 2, 3, 4, 5, 6], sess: [[8, 13], [16, 20]], tags: "fever infection bp diabetes general checkup" },
  { id: "d16", name: "Ms. Sarah Mitchell", dept: "diet", title: "Chief Clinical Dietitian", exp: 12, deg: "MSc (Clinical Nutrition), RD", langs: "English", fee: 700, rating: 4.9, days: [1, 2, 3, 4, 5, 6], sess: [[10, 13], [15, 18]], tags: "diet nutrition weight loss diabetes diet kidney diet" }
].map((d, i) => ({ ...d, color: COLORS[i % COLORS.length] }));
const initials = n => n.replace(/^(Dr\.|Ms\.)\s*/, "").split(" ").map(w => w[0]).join("").slice(0, 2);
DOCS.forEach(d => d.photo = `assets/img/doc-${d.id}.jpg`);
const docAv = d => `background:url(${d.photo}) center 22%/cover,linear-gradient(145deg,${d.color});color:transparent`;

const QS = new URLSearchParams(location.search);
/* ---------------- SEGMENTED CONTROLS ---------------- */
const segHandlers = {};
function placeThumbs() { $$(".seg").forEach(seg => { const on = $("button.on", seg), th = $(".thumb", seg); if (on && th && on.offsetWidth) { th.style.left = on.offsetLeft + "px"; th.style.width = on.offsetWidth + "px"; } }); }
$$(".seg").forEach(seg => seg.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; $$("button", seg).forEach(x => x.classList.toggle("on", x === b)); placeThumbs(); segHandlers[seg.dataset.seg]?.(b.dataset.v); }));
addEventListener("resize", placeThumbs);
/* ---------------- TWEEN ---------------- */
function tween(el, to, fmt = v => Math.round(v).toLocaleString("en-IN"), dur = 900) {
  const from = el._v ?? 0; el._v = to; const t0 = performance.now();
  cancelAnimationFrame(el._raf);
  const step = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = fmt(from + (to - from) * e); if (p < 1) el._raf = requestAnimationFrame(step); };
  el._raf = requestAnimationFrame(step);
}
/* ---------------- SHARED BOOKING HELPERS ---------------- */
const B = { step: 0, dept: null, doc: null, date: null, time: null, mode: "In-person", pay: "Pay at hospital", pat: {} };
const dkey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
function slotsFor(doc, date) {
  const r = rng(hash(doc.id + dkey(date)));
  const now = new Date(), isToday = dkey(date) === dkey(now);
  const out = [];
  doc.sess.forEach(([a, b]) => { for (let m = a * 60; m < b * 60; m += 15) {
    const h = Math.floor(m / 60), mi = m % 60;
    const past = isToday && (h * 60 + mi) < (now.getHours() * 60 + now.getMinutes() + 30);
    const lbl = `${((h + 11) % 12) + 1}:${String(mi).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
    out.push({ m, h, label: lbl, booked: r() < 0.38, past });
  } });
  return out;
}
const fmtDate = d => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
function qrSvg(seed) {
  const n = 25, r = rng(hash(seed)); let cells = "";
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#0a2533"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#0a2533"/>`;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const inF = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9); if (!inF && r() > .52) cells += `M${x} ${y}h1v1h-1z`; }
  return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><path d="${cells}" fill="#0a2533"/>${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}</svg>`;
}
if ($("#centreGrid")) {
/* ---------------- CENTRES + MARQUEE ---------------- */
const CIMG = { card: "heart-model", neuro: "brain-model", ortho: "xray", onco: "lab", paed: "baby", neph: "ward", gastro: "food", obgyn: "care-doctor-patient" };
$("#centreGrid").innerHTML = DEPTS.slice(0, 8).map((d, i) => `
  <a href="doctors.html?dept=${d.id}" class="centre rv ${"d" + (i % 4)}" data-dept="${d.id}">
    <span class="cimg" style="background-image:url(assets/img/${CIMG[d.id]}.jpg)"></span><span class="ci">${icon(d.icon)}</span><span class="arrow">${icon("arrow")}</span>
    <h3>${d.name}</h3><p>${d.desc}</p></a>`).join("");
const mq = ["Robotic surgery", "Level-1 trauma centre", "Kidney transplant", "Level-III NICU", "Hybrid cath lab", "3T MRI", "Stroke-ready unit", "Bone marrow transplant", "Sleep lab", "Bariatric surgery"];
$("#marq").innerHTML = [...mq, ...mq].map(t => `<span>${t}</span>`).join("");
}
if ($("#docGrid")) {
/* ---------------- DOCTORS ---------------- */
let docFilter = "all", docQuery = "", docShow = 8;
function renderChips() {
  const ch = [{ id: "all", name: "All" }, ...DEPTS];
  $("#docChips").innerHTML = ch.map(c => `<button class="chip ${docFilter === c.id ? "on" : ""}" data-f="${c.id}">${c.name}</button>`).join("");
}
function nextAvail(d) {
  const now = new Date();
  for (let i = 0; i < 14; i++) { const dt = new Date(now); dt.setDate(now.getDate() + i); if (d.days.includes(dt.getDay())) { const s = slotsFor(d, dt).find(x => !x.booked && !x.past); if (s) return (i === 0 ? "Today" : i === 1 ? "Tomorrow" : dt.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })) + ", " + s.label; } }
  return "Fully booked";
}
function renderDocs() {
  const q = docQuery.toLowerCase().trim();
  const list = DOCS.filter(d => (docFilter === "all" || d.dept === docFilter) && (!q || (d.name + " " + D(d.dept).name + " " + D(d.dept).short + " " + d.tags + " " + d.title).toLowerCase().includes(q)));
  const total = list.length; const shown = list.slice(0, docShow);
  $("#docGrid").innerHTML = list.length ? shown.map((d, i) => `
    <article class="doc" style="animation-delay:${i * 50}ms">
      <div class="doc-ph" style="background:linear-gradient(145deg,${d.color})">
        <img src="${d.photo}" alt="Portrait of ${d.name}" loading="lazy">
        <span class="avail"><i></i>${esc(nextAvail(d))}</span><span class="rating">★ ${d.rating}</span>
      </div>
      <div class="doc-body">
        <h3>${d.name}</h3><div class="sp">${D(d.dept).name}</div>
        <div class="meta"><span>${d.title}</span><span>${d.deg} · ${d.exp} yrs</span><span>Speaks ${d.langs}</span></div>
        <div class="row"><span class="fee">Fee <b>${inr(d.fee)}</b></span><button class="btn btn-primary btn-sm" data-bookdoc="${d.id}">Book</button></div>
      </div></article>`).join("") + (total > shown.length ? `<div style="grid-column:1/-1;text-align:center;margin-top:10px"><button class="btn btn-ghost" data-more>Show all ${total} doctors</button></div>` : "") : `<div class="empty">No doctors match “${esc(docQuery)}”. Try a speciality like “heart” or “skin”.</div>`;
}
$("#docChips").addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; docFilter = b.dataset.f; renderChips(); renderDocs(); });
$("#docSearch").addEventListener("input", e => { docQuery = e.target.value; renderDocs(); });
$("#docGrid").addEventListener("click", e => { if (e.target.closest("[data-more]")) { docShow = 99; renderDocs(); return; } const b = e.target.closest("[data-bookdoc]"); if (b) location.href = "book.html?doc=" + b.dataset.bookdoc; });
if (QS.get("dept") && D(QS.get("dept"))) docFilter = QS.get("dept");
if (QS.get("q")) { docQuery = QS.get("q"); $("#docSearch").value = docQuery; }
renderChips(); renderDocs();
}
if ($("#steps")) {
/* ---------------- BOOKING ---------------- */
const STEPS = ["Department", "Doctor", "Date & time", "Details", "Confirm"];
function renderSteps() {
  $("#steps").innerHTML = STEPS.map((s, i) => `<div class="step-pill ${i < B.step ? "done" : i === B.step ? "cur" : ""}" data-go="${i}"><div class="track"><i></i></div><span>${i + 1}. ${s}</span></div>`).join("");
}
$("#steps").addEventListener("click", e => { const p = e.target.closest(".step-pill.done"); if (p && B.step < 5) goStep(+p.dataset.go); });
function renderDept() {
  $("#deptGrid").innerHTML = DEPTS.map(d => `<button type="button" class="opt ${B.dept === d.id ? "sel" : ""}" data-dept="${d.id}">${icon(d.icon)}<b>${d.name}</b><small>${d.short}</small></button>`).join("");
}
$("#deptGrid").addEventListener("click", e => { const b = e.target.closest(".opt"); if (!b) return; if (B.dept !== b.dataset.dept) { B.doc = null; B.date = null; B.time = null; } B.dept = b.dataset.dept; renderDept(); updSummary(); setTimeout(() => goStep(1), 260); });
function renderDocPick() {
  const list = DOCS.filter(d => d.dept === B.dept);
  $("#docSub").textContent = `${list.length} doctor${list.length > 1 ? "s" : ""} available in ${D(B.dept).name}.`;
  $("#docPick").innerHTML = list.map(d => `<button type="button" class="opt ${B.doc === d.id ? "sel" : ""}" data-doc="${d.id}"><span class="av" style="${docAv(d)}">${initials(d.name)}</span><div><b>${d.name}</b><small>${d.title}</small><small>${d.exp} yrs · ★ ${d.rating} · ${inr(d.fee)}</small></div></button>`).join("");
}
$("#docPick").addEventListener("click", e => { const b = e.target.closest(".opt"); if (!b) return; if (B.doc !== b.dataset.doc) { B.date = null; B.time = null; } B.doc = b.dataset.doc; renderDocPick(); updSummary(); setTimeout(() => goStep(2), 260); });
function renderDates() {
  const doc = DOCS.find(d => d.id === B.doc), now = new Date();
  $("#slotSub").textContent = `${doc.name} consults on ${doc.days.length === 7 ? "all days" : doc.days.map(x => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][x]).join(", ")}. Times in IST.`;
  let html = "", firstAvail = null;
  for (let i = 0; i < 14; i++) {
    const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 12);
    const ok = doc.days.includes(dt.getDay()) && slotsFor(doc, dt).some(s => !s.booked && !s.past);
    if (ok && !firstAvail) firstAvail = dt;
    html += `<button type="button" class="date ${B.date && dkey(B.date) === dkey(dt) ? "sel" : ""}" data-d="${dt.toISOString()}" ${ok ? "" : "disabled"}><small>${i === 0 ? "Today" : dt.toLocaleDateString("en-IN", { weekday: "short" })}</small><b>${dt.getDate()}</b><small>${dt.toLocaleDateString("en-IN", { month: "short" })}</small></button>`;
  }
  $("#dates").innerHTML = html;
  if (!B.date && firstAvail) { B.date = firstAvail; $$("#dates .date").find(b => dkey(new Date(b.dataset.d)) === dkey(firstAvail))?.classList.add("sel"); }
  renderSlots();
}
$("#dates").addEventListener("click", e => { const b = e.target.closest(".date"); if (!b) return; B.date = new Date(b.dataset.d); B.time = null; $$("#dates .date").forEach(x => x.classList.toggle("sel", x === b)); renderSlots(); updSummary(); });
function renderSlots() {
  const doc = DOCS.find(d => d.id === B.doc);
  if (!B.date) { $("#slotArea").innerHTML = `<p class="sub">No slots in the next two weeks.</p>`; return; }
  const s = slotsFor(doc, B.date);
  const groups = [["Morning", "sun", x => x.h < 12], ["Afternoon", "sun", x => x.h >= 12 && x.h < 16], ["Evening", "moon", x => x.h >= 16]];
  $("#slotArea").innerHTML = groups.map(([n, ic, f]) => { const g = s.filter(f); if (!g.length) return ""; const free = g.filter(x => !x.booked && !x.past).length;
    return `<div class="slot-group"><h4><svg style="width:15px;height:15px"><use href="#i-${ic}"/></svg>${n} · ${free} open</h4><div class="slots">${g.map(x => `<button type="button" class="slot ${B.time === x.label ? "sel" : ""}" data-t="${x.label}" ${x.booked || x.past ? "disabled" : ""}>${x.label}</button>`).join("")}</div></div>`; }).join("");
}
$("#slotArea").addEventListener("click", e => { const b = e.target.closest(".slot"); if (!b) return; B.time = b.dataset.t; $$("#slotArea .slot").forEach(x => x.classList.toggle("sel", x === b)); updSummary(); updNav(); });
function setSum(id, v, ph) { const el = $(id); el.textContent = v || ph; el.classList.toggle("empty-v", !v); }
function fee() { const d = DOCS.find(x => x.id === B.doc); if (!d) return 0; let f = d.fee; if (B.mode === "Video") f *= .8; if ((B.pat.visit || "").startsWith("Follow")) f = 0; if (B.pay.startsWith("Paid online")) f *= .95; return f; }
function updSummary() {
  const doc = DOCS.find(x => x.id === B.doc);
  setSum("#sDept", B.dept && D(B.dept).name, "Not selected");
  setSum("#sDoc", doc && doc.name, "Not selected");
  setSum("#sDate", B.date && fmtDate(B.date), "Not selected");
  setSum("#sTime", B.time && (B.time + (B.mode === "Video" ? " · Video" : "")), "Not selected");
  setSum("#sPat", B.pat.name && `${B.pat.name}${B.pat.age ? ", " + B.pat.age : ""}`, "Not entered");
  tween($("#sFee"), fee(), v => inr(v));
}
function readPatient(validate) {
  const P = { name: $("#pName").value.trim(), phone: $("#pPhone").value.trim(), age: $("#pAge").value.trim(), gender: $("#pGender").value, visit: $("#pVisit").value, uhid: $("#pUhid").value.trim(), reason: $("#pReason").value.trim() };
  B.pat = P;
  if (!validate) return true;
  const checks = [["#pName", P.name.length >= 2], ["#pPhone", /^[6-9]\d{9}$/.test(P.phone)], ["#pAge", P.age !== "" && +P.age >= 0 && +P.age <= 120], ["#pGender", !!P.gender]];
  let ok = true; checks.forEach(([s, v]) => { $(s).closest(".field").classList.toggle("err", !v); if (!v) ok = false; });
  return ok;
}
["#pName", "#pPhone", "#pAge", "#pGender", "#pVisit"].forEach(s => $(s).addEventListener("input", () => { $(s).closest(".field").classList.remove("err"); readPatient(false); updSummary(); }));
$("#pPhone").addEventListener("input", e => e.target.value = e.target.value.replace(/\D/g, ""));
function renderReview() {
  const doc = DOCS.find(x => x.id === B.doc);
  const items = [["Doctor", doc.name], ["Department", D(B.dept).name], ["Date", fmtDate(B.date)], ["Time", B.time + " (report 15 min early)"], ["Patient", `${B.pat.name}, ${B.pat.age} · ${B.pat.gender}`], ["Mobile", "+91 " + B.pat.phone], ["Consultation", B.mode], ["Visit type", B.pat.visit]];
  $("#review").innerHTML = items.map(([k, v]) => `<div><small>${k}</small><b>${esc(v)}</b></div>`).join("");
}
$("#payOpts").addEventListener("click", e => { const b = e.target.closest(".opt"); if (!b) return; B.pay = b.dataset.pay; $$("#payOpts .opt").forEach(x => x.classList.toggle("sel", x === b)); updSummary(); });
function canNext() { return [!!B.dept, !!B.doc, !!B.time, true, true][B.step]; }
function updNav() {
  $("#bookNav").style.display = B.step === 5 ? "none" : "flex";
  $("#backBtn").style.visibility = B.step === 0 ? "hidden" : "visible";
  $("#nextBtn").disabled = !canNext();
  $("#nextBtn").innerHTML = B.step === 4 ? `Confirm booking ${icon("arrow")}` : `Continue ${icon("arrow")}`;
}
function goStep(n) {
  B.step = n;
  $$(".bstep").forEach(s => s.classList.toggle("on", +s.dataset.step === n));
  if (n === 0) renderDept(); if (n === 1) renderDocPick(); if (n === 2) renderDates(); if (n === 4) renderReview();
  renderSteps(); updSummary(); updNav(); placeThumbs();
}
$("#backBtn").addEventListener("click", () => goStep(Math.max(0, B.step - 1)));
$("#nextBtn").addEventListener("click", () => {
  if (B.step === 3 && !readPatient(true)) { toast("Please complete the highlighted fields"); return; }
  if (B.step === 4) { if (!$("#consent").checked) { toast("Please accept the terms to confirm"); $("#consent").focus(); return; } confirmBooking(); return; }
  goStep(B.step + 1);
});
let lastAppt = null;
function confirmBooking() {
  const doc = DOCS.find(x => x.id === B.doc);
  const s = slotsFor(doc, B.date); const token = s.findIndex(x => x.label === B.time) + 1;
  const op = "OP" + dkey(B.date).replace(/-/g, "").slice(2) + String(hash(B.pat.phone + B.time) % 9000 + 1000);
  const appt = { id: op, token, doc: doc.id, dept: B.dept, date: B.date.toISOString(), time: B.time, mode: B.mode, pay: B.pay, fee: fee(), pat: { ...B.pat }, uhid: B.pat.uhid || "AUR-" + (hash(B.pat.phone) % 900000 + 100000) };
  const list = store.get("aur-appts", []); list.unshift(appt); store.set("aur-appts", list.slice(0, 8));
  lastAppt = appt;
  $("#ticket").innerHTML = `<div class="ticket">
    <div class="tl"><div class="tok"><small>Token number</small><b>${String(token).padStart(2, "0")}</b></div>
      <div class="tgrid"><div><small>Patient</small><b>${esc(appt.pat.name)}</b></div><div><small>UHID</small><b>${appt.uhid}</b></div>
      <div><small>Doctor</small><b>${doc.name}</b></div><div><small>Department</small><b>${D(appt.dept).name}</b></div>
      <div><small>Date</small><b>${fmtDate(B.date)}</b></div><div><small>Time</small><b>${appt.time}${appt.mode === "Video" ? " · Video" : ""}</b></div>
      <div><small>Location</small><b>${appt.mode === "Video" ? "Link sent by SMS" : "Block B, Floor 2, OPD " + (hash(doc.id) % 20 + 1)}</b></div><div><small>Payment</small><b>${appt.fee ? inr(appt.fee) : "Free"} · ${appt.pay}</b></div></div></div>
    <div class="tr"><div class="qr">${qrSvg(op)}</div><small>${op}</small><small>Scan at the OPD kiosk</small></div></div>`;
  goStep(5); renderMyAppts(); toast("Appointment confirmed · SMS sent (demo)");
}
$("#againBtn").addEventListener("click", () => { Object.assign(B, { dept: null, doc: null, date: null, time: null, pat: {} }); $("#patForm").reset(); $("#consent").checked = false; goStep(0); });
$("#icsBtn").addEventListener("click", () => {
  if (!lastAppt) return; const doc = DOCS.find(x => x.id === lastAppt.doc);
  const d = new Date(lastAppt.date); const [hm, ap] = lastAppt.time.split(" "); let [h, m] = hm.split(":").map(Number); if (ap === "PM" && h < 12) h += 12; if (ap === "AM" && h === 12) h = 0;
  const st = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m), en = new Date(st.getTime() + 15 * 60000);
  const f = x => x.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Aurelia Hospital Demo//EN", "BEGIN:VEVENT", "UID:" + lastAppt.id + "@aurelia.example", "DTSTAMP:" + f(new Date()), "DTSTART:" + f(st), "DTEND:" + f(en), "SUMMARY:OP appointment with " + doc.name, "LOCATION:Aurelia Hospital (demo)", "DESCRIPTION:Token " + lastAppt.token + " · " + lastAppt.id, "BEGIN:VALARM", "TRIGGER:-PT2H", "ACTION:DISPLAY", "DESCRIPTION:Reminder", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = lastAppt.id + ".ics"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
});
function renderMyAppts() {
  const list = store.get("aur-appts", []);
  $("#myAppts").innerHTML = `<h4>My appointments</h4><p style="font-size:13px;color:var(--muted);margin-bottom:8px">Saved in this browser only.</p>` + (list.length ? list.map(a => { const d = new Date(a.date), doc = DOCS.find(x => x.id === a.doc);
    return `<div class="appt"><div class="ad"><small>${d.toLocaleDateString("en-IN", { month: "short" })}</small><b>${d.getDate()}</b></div><div class="ai"><b>${doc ? doc.name : ""}</b><span>${a.time} · Token ${a.token} · ${esc(a.pat.name)}</span></div><button class="link" data-cancel="${a.id}">Cancel</button></div>`; }).join("") : `<p style="font-size:14px;color:var(--muted);padding:14px 0">No upcoming appointments yet.</p>`);
}
$("#myAppts").addEventListener("click", e => { const b = e.target.closest("[data-cancel]"); if (!b) return; store.set("aur-appts", store.get("aur-appts", []).filter(a => a.id !== b.dataset.cancel)); renderMyAppts(); toast("Appointment cancelled"); });
segHandlers.mode = v => { B.mode = v; updSummary(); };
renderMyAppts();
{ const qd = DOCS.find(d => d.id === QS.get("doc")); if (qd) { B.dept = qd.dept; B.doc = qd.id; goStep(2); } else if (QS.get("dept") && D(QS.get("dept"))) { B.dept = QS.get("dept"); goStep(1); } else goStep(0); }
}
if ($("#condGrid")) {
/* ---------------- DIET ---------------- */
const M = (t, title, veg, nv) => ({ t, title, veg, nv: nv || veg });
const COND = {
  dm: { name: "Type 2 Diabetes", short: "Diabetes", e: "🩸", adj: b => b >= 23 ? -400 : 0, mac: [45, 20, 35], fibre: 35,
    note: "Gentle deficit to improve insulin sensitivity",
    limits: c => [["Added sugar", 20, "g", 50, "#d9534f"], ["Sodium", 2300, "mg", 4000, "#e0a63a"], ["Fibre (target)", 35, "g", 40, "#1f9d6b"], ["Carbs per meal", Math.round(c * .45 / 4 / 3.5), "g", 120, "#e0a63a"]],
    plate: [50, 25, 25],
    eat: ["Millets (ragi, jowar, bajra)", "Leafy greens", "Dal & sprouts", "Soaked methi seeds", "Low-fat curd", "Guava, apple, pear", "Almonds & walnuts", "Brown / red rice in small portions", "Paneer & tofu"],
    avoid: ["Sweets & jaggery", "Fruit juices", "Maida & bakery", "Sugary drinks", "Large portions of white rice", "Fried snacks", "Mango & chikoo in excess", "Sweetened breakfast cereals"],
    tips: ["Pair every carb with protein or fibre to slow sugar spikes.", "Eat at the same times every day and don’t skip meals, especially on medication.", "A 10–15 minute walk after meals lowers post-meal sugar.", "Check sugar two hours after meals to see how different foods affect you."],
    meals: [M("6:30", "Wake-up", "Warm water with 1 tsp soaked methi seeds"), M("8:00", "Breakfast", "2 ragi dosas, sambar and mint chutney", "2-egg vegetable omelette and 1 multigrain toast"), M("11:00", "Mid-morning", "1 guava and 5 almonds"), M("1:30", "Lunch", "2 jowar rotis, dal, mixed vegetable sabzi, salad and curd", "1 cup brown rice, grilled fish, vegetable sabzi and salad"), M("5:00", "Evening", "Roasted chana and unsweetened green tea"), M("8:00", "Dinner", "Paneer bhurji, sautéed vegetables and 1 multigrain roti", "Chicken curry (little oil), vegetables and 1 multigrain roti")] },
  htn: { name: "Hypertension", short: "BP (DASH)", e: "🫀", adj: b => b >= 23 ? -300 : 0, mac: [52, 18, 30], fibre: 30,
    note: "DASH-style plan, low in sodium",
    limits: () => [["Sodium", 1500, "mg", 4000, "#d9534f"], ["Salt (≈ ¾ tsp)", 3.8, "g", 10, "#e0a63a"], ["Potassium (target)", 4700, "mg", 5000, "#1f9d6b"], ["Caffeine", 200, "mg", 400, "#b07bd6"]],
    plate: [50, 25, 25],
    eat: ["Fruit: banana, orange, papaya", "Vegetables at every meal", "Low-fat milk & curd", "Oats & whole grains", "Unsalted nuts & seeds", "Beetroot", "Coconut water (if kidneys are healthy)", "Lemon, herbs & spices instead of salt"],
    avoid: ["Pickles & papad", "Extra salt at the table", "Chips & namkeen", "Instant noodles & soups", "Sauces & ketchup", "Processed meat", "Alcohol", "Bakery biscuits"],
    tips: ["Keep total salt under one teaspoon a day, including what’s already in food.", "Check labels: more than 400 mg sodium per serving counts as high.", "Aim for 150 minutes of brisk walking each week.", "Measure your BP at home at the same time each day."],
    meals: [M("6:30", "Wake-up", "Warm water with lemon; no salt"), M("8:00", "Breakfast", "Vegetable oats upma (low salt) and a glass of low-fat milk", "2 boiled eggs, oats porridge and low-fat milk"), M("11:00", "Mid-morning", "1 banana and a handful of unsalted peanuts"), M("1:30", "Lunch", "Rice, palak dal, beetroot poriyal, cucumber salad and curd", "Rice, grilled chicken, beetroot poriyal and cucumber salad"), M("5:00", "Evening", "Papaya bowl and buttermilk with jeera (no salt)"), M("8:00", "Dinner", "2 phulkas, lauki chana dal and a lightly seasoned salad", "2 phulkas, steamed fish with herbs and vegetables")] },
  heart: { name: "Heart Disease", short: "Cholesterol", e: "❤️", adj: b => b >= 23 ? -300 : 0, mac: [50, 20, 30], fibre: 30,
    note: "Heart-healthy, low in saturated fat",
    limits: c => [["Saturated fat (<7%)", Math.round(c * .07 / 9), "g", 40, "#d9534f"], ["Dietary cholesterol", 200, "mg", 400, "#e0a63a"], ["Sodium", 2000, "mg", 4000, "#e0a63a"], ["Omega-3 (target)", 1.5, "g", 2, "#1f9d6b"]],
    plate: [50, 25, 25],
    eat: ["Oats & barley", "Flaxseed & walnuts", "Fatty fish (non-veg)", "Mustard, groundnut or rice bran oil (measured)", "Rajma, chana & soy", "Fresh fruit & vegetables", "Garlic", "Skimmed dairy"],
    avoid: ["Vanaspati & trans fats", "Excess ghee & butter", "Red & processed meat", "Deep-fried foods", "Full-fat cheese & cream", "Bakery items", "Egg yolks in excess", "Smoking & alcohol"],
    tips: ["Limit cooking oil to 3–4 teaspoons per person per day and rotate oils.", "Soluble fibre from oats, beans and fruit helps lower LDL cholesterol.", "Have fish twice a week, or flaxseed and walnuts if vegetarian.", "Do cardiac rehab exercise only as advised by your cardiologist."],
    meals: [M("6:30", "Wake-up", "Water and 4 soaked walnut halves"), M("8:00", "Breakfast", "Oats chilla with vegetables and mint chutney", "Egg-white bhurji with 1 multigrain toast"), M("11:00", "Mid-morning", "1 apple and 1 tbsp roasted flaxseed"), M("1:30", "Lunch", "Barley khichdi, rajma, salad and skimmed curd", "Brown rice, mackerel curry (light oil) and salad"), M("5:00", "Evening", "Sprouts chaat with lemon"), M("8:00", "Dinner", "2 phulkas, soya chunk curry and steamed vegetables", "2 phulkas, tandoori chicken (skinless) and vegetables")] },
  ckd: { name: "Kidney Disease (CKD)", short: "CKD 3–4", e: "🫘", adj: () => 0, pk: .7, fat: 30, fibre: 25,
    note: "Controlled protein, low potassium & phosphorus",
    limits: () => [["Sodium", 2000, "mg", 4000, "#d9534f"], ["Potassium", 2000, "mg", 4000, "#e0a63a"], ["Phosphorus", 800, "mg", 1400, "#b07bd6"], ["Fluids (as advised)", 1.5, "L", 3, "#5aa9e6"]],
    plate: [40, 20, 40],
    eat: ["Bottle, ridge & snake gourd", "Cabbage & cauliflower", "Apple, pear, guava (small)", "Rice & wheat in measured amounts", "Egg whites (if allowed)", "Leached vegetables", "Unsalted puffed rice", "Measured paneer"],
    avoid: ["Banana & coconut water", "Oranges & sweet lime", "Tomato in excess", "Salt substitutes (potassium)", "Dried fruits", "Colas (phosphorus)", "Processed cheese", "Pickles & papad"],
    tips: ["Leach high-potassium vegetables: peel, dice, soak in warm water for two hours, then boil and drain.", "Protein needs change with stage and dialysis, so your nephrologist sets the exact amount.", "Follow your fluid limit, including tea, soups and dal water.", "Avoid painkillers like ibuprofen unless your doctor approves them."],
    meals: [M("6:30", "Wake-up", "Half a cup of warm water (within your fluid limit)"), M("8:00", "Breakfast", "Rice flakes poha with leached vegetables", "Poha and 2 egg whites"), M("11:00", "Mid-morning", "1 small apple"), M("1:30", "Lunch", "Rice, bottle gourd sabzi, small katori thin dal and cucumber", "Rice, bottle gourd sabzi and 1 small piece of chicken"), M("5:00", "Evening", "Unsalted puffed rice and a small cup of tea"), M("8:00", "Dinner", "2 phulkas, cabbage sabzi and 30 g paneer", "2 phulkas, cabbage sabzi and 2 egg whites")] },
  pcos: { name: "PCOS", short: "Hormonal", e: "🌸", adj: b => b >= 23 ? -400 : -100, mac: [40, 25, 35], fibre: 30,
    note: "Low-GI plan for insulin resistance",
    limits: () => [["Added sugar", 20, "g", 50, "#d9534f"], ["Refined carbs (servings)", 1, "/day", 6, "#e0a63a"], ["Fibre (target)", 30, "g", 40, "#1f9d6b"], ["Protein per meal", 25, "g", 40, "#0f7a72"]],
    plate: [45, 30, 25],
    eat: ["Low-GI grains (millets, quinoa)", "Protein at every meal", "Flax, chia & pumpkin seeds", "Cinnamon", "Berries & guava", "Leafy greens", "Nuts", "Curd & paneer"],
    avoid: ["Sugar & desserts", "Maida & white bread", "Sweetened drinks", "Fried foods", "Packaged snacks", "Late-night eating", "Excess caffeine", "Alcohol"],
    tips: ["Losing just 5–10% of body weight can restore regular cycles.", "Do strength training twice a week to improve insulin sensitivity.", "Sleep 7–8 hours, because poor sleep worsens hormonal balance.", "Spearmint tea is popular, but discuss supplements with your gynaecologist."],
    meals: [M("6:30", "Wake-up", "Warm water with cinnamon and 1 tsp soaked chia"), M("8:00", "Breakfast", "Moong dal chilla stuffed with paneer", "3-egg-white omelette with spinach"), M("11:00", "Mid-morning", "Handful of berries or guava and pumpkin seeds"), M("1:30", "Lunch", "Quinoa pulao, chana curry, salad and curd", "Quinoa, grilled chicken, salad and curd"), M("5:00", "Evening", "Roasted makhana and spearmint tea"), M("8:00", "Dinner", "Tofu stir-fry with vegetables and 1 bajra roti", "Fish tikka, sautéed greens and 1 bajra roti")] },
  nafld: { name: "Fatty Liver (NAFLD)", short: "Liver", e: "🫁", adj: b => b >= 23 ? -500 : -200, mac: [45, 22, 33], fibre: 30,
    note: "Deficit aimed at 7–10% weight loss",
    limits: () => [["Added sugar & fructose", 20, "g", 50, "#d9534f"], ["Alcohol", 0, "units", 14, "#d9534f"], ["Saturated fat", 20, "g", 40, "#e0a63a"], ["Fibre (target)", 30, "g", 40, "#1f9d6b"]],
    plate: [50, 25, 25],
    eat: ["Vegetables & salads", "Whole grains", "Dal & legumes", "Black coffee (unsweetened)", "Green tea", "Fish & lean protein", "Olive or mustard oil (measured)", "Walnuts"],
    avoid: ["Alcohol completely", "Sugary drinks & packaged juice", "Sweets & desserts", "Fried food", "White bread & maida", "Red & processed meat", "High-fructose snacks", "Large late dinners"],
    tips: ["Losing 7–10% of body weight can significantly reduce liver fat.", "Avoid crash diets, as rapid weight loss can strain the liver.", "Exercise for 150–300 minutes a week, even before the scale moves.", "Check with your doctor before any herbal ‘liver detox’ products."],
    meals: [M("6:30", "Wake-up", "Water and a cup of black coffee"), M("8:00", "Breakfast", "Vegetable daliya with low-fat curd", "Boiled eggs and vegetable daliya"), M("11:00", "Mid-morning", "1 pear and green tea"), M("1:30", "Lunch", "2 rotis, mixed dal, palak sabzi and large salad", "2 rotis, fish curry (light oil) and large salad"), M("5:00", "Evening", "Sprouts salad"), M("8:00", "Dinner", "Vegetable soup, paneer tikka and stir-fried vegetables", "Vegetable soup, grilled chicken and stir-fried vegetables")] },
  thy: { name: "Hypothyroidism", short: "Thyroid", e: "🦋", adj: b => b >= 23 ? -250 : 0, mac: [45, 25, 30], fibre: 28,
    note: "Balanced plan supporting metabolism",
    limits: () => [["Iodine (target)", 150, "mcg", 300, "#1f9d6b"], ["Selenium (target)", 55, "mcg", 100, "#0f7a72"], ["Added sugar", 25, "g", 50, "#d9534f"], ["Sodium", 2300, "mg", 4000, "#e0a63a"]],
    plate: [50, 25, 25],
    eat: ["Iodised salt (in moderation)", "Eggs & dairy", "Fish (non-veg)", "Sunflower & pumpkin seeds", "Whole grains", "Fresh fruit", "Cooked vegetables", "Lentils"],
    avoid: ["Soy close to medicine time", "Very large amounts of raw cabbage or broccoli", "Highly processed foods", "Excess sugar", "Coffee within an hour of your tablet", "Calcium or iron supplements near your tablet"],
    tips: ["Take levothyroxine on an empty stomach 30–60 minutes before breakfast.", "Keep calcium and iron supplements at least four hours apart from your tablet.", "Cooking cruciferous vegetables makes them safe in normal amounts.", "Get your TSH rechecked as advised, usually every 6–12 weeks after a dose change."],
    meals: [M("6:30", "Wake-up", "Thyroid tablet with plain water; wait 45 minutes"), M("7:45", "Breakfast", "Vegetable idli, sambar and coconut chutney", "Egg dosa and sambar"), M("11:00", "Mid-morning", "1 orange and pumpkin seeds"), M("1:30", "Lunch", "Rice, moong dal, cooked beans sabzi and curd", "Rice, fish curry, beans sabzi and curd"), M("5:00", "Evening", "Milk with a handful of sunflower seeds"), M("8:00", "Dinner", "2 rotis, paneer curry and cooked vegetables", "2 rotis, egg curry and cooked vegetables")] },
  obese: { name: "Obesity / Weight loss", short: "Weight", e: "⚖️", adj: () => -550, mac: [40, 30, 30], pk: 1.2, fibre: 30,
    note: "Safe deficit of roughly 0.5 kg a week",
    limits: () => [["Added sugar", 15, "g", 50, "#d9534f"], ["Cooking oil", 15, "ml", 40, "#e0a63a"], ["Fibre (target)", 30, "g", 40, "#1f9d6b"], ["Steps (target)", 9000, "/day", 12000, "#0f7a72"]],
    plate: [50, 30, 20],
    eat: ["Dal, paneer, eggs & chicken", "Salads before meals", "Vegetables in large portions", "Buttermilk", "Whole fruit, not juice", "Millets in small portions", "Sprouts", "Soups"],
    avoid: ["Sugary drinks", "Fried snacks", "Sweets & mithai", "Refined carbs", "Late-night eating", "Alcohol", "Packaged ‘diet’ snacks", "Mindless eating at screens"],
    tips: ["Aim to lose about 0.5 kg a week; faster loss is harder to keep off.", "Protein at every meal keeps you full and protects muscle.", "Sleep 7–8 hours, since short sleep raises hunger hormones.", "Walk 8,000–10,000 steps a day and add strength training twice a week."],
    meals: [M("6:30", "Wake-up", "Warm water and 5 soaked almonds"), M("8:00", "Breakfast", "Besan chilla with paneer and green chutney", "3-egg-white omelette with vegetables and 1 toast"), M("11:00", "Mid-morning", "Buttermilk and 1 apple"), M("1:30", "Lunch", "Bowl of salad first, then 1 roti, dal, sabzi and curd", "Bowl of salad first, then 1 roti, chicken curry and sabzi"), M("5:00", "Evening", "Sprouts chaat or roasted chana"), M("7:30", "Dinner", "Clear vegetable soup and tofu-vegetable stir-fry", "Clear soup and grilled fish with vegetables")] }
};
const S = { cond: "dm", sex: "f", pref: "veg" };
const CF = [0.02, 0.24, 0.08, 0.32, 0.09, 0.25];
$("#condGrid").innerHTML = Object.entries(COND).map(([k, c]) => `<button type="button" class="cond ${k === S.cond ? "sel" : ""}" data-c="${k}"><span class="ce">${c.e}</span><b>${c.name}</b></button>`).join("");
$("#condGrid").addEventListener("click", e => { const b = e.target.closest(".cond"); if (!b) return; S.cond = b.dataset.c; $$("#condGrid .cond").forEach(x => x.classList.toggle("sel", x === b)); calc(true); });
const rangeFill = r => r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min) * 100) + "%");
[["#dAge", "#oAge", "yrs"], ["#dHt", "#oHt", "cm"], ["#dWt", "#oWt", "kg"]].forEach(([i, o, u]) => { const r = $(i); rangeFill(r); r.addEventListener("input", () => { rangeFill(r); $(o).innerHTML = `${r.value}<small>${u}</small>`; calc(); }); });
$("#dAct").addEventListener("change", () => calc());
$("#water").innerHTML = Array.from({ length: 12 }, () => `<span class="glass-cup"><i></i></span>`).join("");
const CIRC = 2 * Math.PI * 70;
function arc(el, start, frac) { el.style.strokeDasharray = `${Math.max(0, frac * CIRC - 2)} ${CIRC}`; el.style.strokeDashoffset = -start * CIRC; }
function plate(p) {
  const [veg, pro, gr] = p, PC = 2 * Math.PI * 40, segs = [[veg, "#6fbf73", "Vegetables"], [pro, "#0f7a72", "Protein"], [gr, "#e0a63a", "Whole grains"]];
  let acc = 0, html = `<circle cx="100" cy="100" r="96" fill="var(--paper2)" stroke="var(--line2)" stroke-width="2"/><circle cx="100" cy="100" r="84" fill="var(--paper)" stroke="var(--line)" />`;
  html += `<g transform="rotate(-90 100 100)">` + segs.map(([v, c]) => { const s = `<circle class="seg-c" cx="100" cy="100" r="40" fill="none" stroke="${c}" stroke-width="80" stroke-dasharray="${v / 100 * PC - 1.5} ${PC}" stroke-dashoffset="${-acc / 100 * PC}" style="transition:stroke-dasharray .9s, stroke-dashoffset .9s"/>`; acc += v; return s; }).join("") + `</g>`;
  acc = 0; segs.forEach(([v]) => { const mid = (acc + v / 2) / 100 * 2 * Math.PI - Math.PI / 2; acc += v; html += `<text x="${100 + Math.cos(mid) * 46}" y="${100 + Math.sin(mid) * 46 + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff" font-family="Inter,sans-serif">${v}%</text>`; });
  const pl = $("#plate");
  if (!pl.dataset.init) { pl.innerHTML = html; pl.dataset.init = 1; } else {
    const circles = $$(".seg-c", pl); acc = 0; segs.forEach(([v], i) => { circles[i].setAttribute("stroke-dasharray", `${v / 100 * PC - 1.5} ${PC}`); circles[i].setAttribute("stroke-dashoffset", -acc / 100 * PC); acc += v; });
    const texts = $$("text", pl); acc = 0; segs.forEach(([v], i) => { const mid = (acc + v / 2) / 100 * 2 * Math.PI - Math.PI / 2; acc += v; texts[i].setAttribute("x", 100 + Math.cos(mid) * 46); texts[i].setAttribute("y", 100 + Math.sin(mid) * 46 + 5); texts[i].textContent = v + "%"; });
  }
  $("#plateLegend").innerHTML = segs.map(([v, c, n]) => `<span><i style="background:${c}"></i>${n}</span>`).join("") + `<span><i style="background:#5aa9e6"></i>Water / buttermilk</span>`;
}
function calc(changed) {
  const c = COND[S.cond], age = +$("#dAge").value, ht = +$("#dHt").value, wt = +$("#dWt").value, act = +$("#dAct").value;
  const bmi = wt / ((ht / 100) ** 2);
  const bmr = 10 * wt + 6.25 * ht - 5 * age + (S.sex === "m" ? 5 : -161);
  const tdee = bmr * act;
  let adj = c.adj(bmi); const floor = S.sex === "m" ? 1500 : 1200;
  let kcal = Math.round((tdee + adj) / 10) * 10; if (kcal < floor) { kcal = floor; adj = floor - Math.round(tdee); }
  let pG, cG, fG, pp, cp, fp;
  if (c.pk && S.cond === "ckd") { pG = Math.round(c.pk * wt); fG = Math.round(kcal * c.fat / 100 / 9); cG = Math.round((kcal - pG * 4 - fG * 9) / 4); }
  else { [cp, pp, fp] = c.mac; pG = Math.round(kcal * pp / 100 / 4); if (c.pk) pG = Math.max(pG, Math.round(c.pk * wt)); fG = Math.round(kcal * fp / 100 / 9); cG = Math.round((kcal - pG * 4 - fG * 9) / 4); }
  const tot = cG * 4 + pG * 4 + fG * 9; cp = cG * 4 / tot; pp = pG * 4 / tot; fp = fG * 9 / tot;
  tween($("#rCal"), kcal); tween($("#rBmr"), bmr); tween($("#rTdee"), tdee); tween($("#rAdj"), adj, v => (v > 0 ? "+" : "") + Math.round(v));
  $("#rCalNote").textContent = c.note;
  tween($("#rBmi"), bmi, v => v.toFixed(1));
  const cat = bmi < 18.5 ? ["Underweight", "#5aa9e6"] : bmi < 23 ? ["Healthy (Asian cut-off)", "#1f9d6b"] : bmi < 27.5 ? ["Overweight", "#e0a63a"] : ["Obese", "#d9534f"];
  $("#rBmiCat").textContent = cat[0]; $("#rBmiCat").style.color = cat[1];
  const ang = (Math.min(40, Math.max(14, bmi)) - 14) / 26 * 180 - 90;
  $("#needle").style.transform = `rotate(${ang}deg)`;
  const water = S.cond === "ckd" ? 1.5 : Math.min(4, Math.max(1.8, wt * 0.035));
  tween($("#rWater"), water, v => v.toFixed(1));
  const glasses = Math.round(water * 4);
  $("#rWaterNote").textContent = S.cond === "ckd" ? "Fluid limit is set by your nephrologist" : `about ${glasses} glasses of 250 ml`;
  $$("#water .glass-cup i").forEach((g, i) => { g.style.height = Math.max(0, Math.min(1, water * 3 - i)) * 100 + "%"; g.style.transitionDelay = i * 45 + "ms"; });
  arc($("#dC"), 0, cp); arc($("#dP"), cp, pp); arc($("#dF"), cp + pp, fp);
  $("#rCondName").textContent = c.short;
  tween($("#mC"), cG, v => Math.round(v) + " g"); tween($("#mP"), pG, v => Math.round(v) + " g"); tween($("#mF"), fG, v => Math.round(v) + " g"); tween($("#mFi"), c.fibre, v => Math.round(v) + " g");
  $("#mCp").textContent = Math.round(cp * 100) + "% of calories"; $("#mPp").textContent = Math.round(pp * 100) + "% · " + (pG / wt).toFixed(1) + " g/kg"; $("#mFp").textContent = Math.round(fp * 100) + "% of calories";
  const lim = c.limits(kcal);
  const lh = $("#limits");
  if (changed || !lh.children.length || lh.dataset.c !== S.cond) {
    lh.dataset.c = S.cond;
    lh.innerHTML = lim.map(([n, v, u, max, col]) => `<div class="limit"><div class="lt"><span>${n}</span><b>${v.toLocaleString("en-IN")} ${u}</b></div><div class="bar"><i style="background:${col}" data-w="${Math.min(100, v / max * 100)}"></i></div></div>`).join("");
    requestAnimationFrame(() => requestAnimationFrame(() => $$("#limits .bar i").forEach(i => i.style.width = i.dataset.w + "%")));
  } else { $$("#limits .limit").forEach((el, i) => { $("b", el).textContent = lim[i][1].toLocaleString("en-IN") + " " + lim[i][2]; $(".bar i", el).style.width = Math.min(100, lim[i][1] / lim[i][3] * 100) + "%"; }); }
  plate(c.plate);
  if (changed || !$("#tips").children.length || $("#tips").dataset.c !== S.cond + S.pref) {
    $("#tips").dataset.c = S.cond + S.pref;
    $("#tips").innerHTML = c.tips.map((t, i) => `<li class="reveal-r" style="animation-delay:${i * 80}ms">${t}</li>`).join("");
    $("#eat").innerHTML = c.eat.map((t, i) => `<span style="animation-delay:${i * 40}ms">${t}</span>`).join("");
    $("#avoid").innerHTML = c.avoid.map((t, i) => `<span style="animation-delay:${i * 40}ms">${t}</span>`).join("");
  }
  const mealsChanged = $("#meals").dataset.c !== S.cond + S.pref;
  if (mealsChanged) {
    $("#meals").dataset.c = S.cond + S.pref;
    $("#meals").innerHTML = c.meals.map((m, i) => `<div class="meal" style="animation-delay:${i * 70}ms"><time>${m.t}</time><span class="dot"></span><div class="mt"><b>${m.title}</b><span>${S.pref === "veg" ? m.veg : m.nv}</span></div><span class="kc" data-f="${CF[i]}"></span></div>`).join("");
  }
  $$("#meals .kc").forEach(k => k.textContent = "~" + Math.round(kcal * +k.dataset.f / 10) * 10 + " kcal");
  $("#planKcal").textContent = `${S.pref === "veg" ? "Vegetarian" : "Non-vegetarian"} · about ${kcal.toLocaleString("en-IN")} kcal`;
}
segHandlers.sex = v => { S.sex = v; calc(); };
segHandlers.pref = v => { S.pref = v; calc(); };
const db = $("#dietBook"); if (db) db.href = "book.html?doc=d16";
calc(true);
}
if ($("#pkgGrid")) {
/* ---------------- PACKAGES ---------------- */
let pkgN = 1;
const PKGS = [
  { n: "Essential", d: "For adults under 35", p: 2499, mrp: 3800, items: ["Complete blood count", "Fasting blood sugar & HbA1c", "Lipid profile", "Liver & kidney function", "Thyroid (TSH)", "Physician consultation"] },
  { n: "Executive", d: "Our most comprehensive check", p: 6999, mrp: 11500, feat: 1, items: ["Everything in Essential", "ECG & 2D echo", "Treadmill stress test", "Ultrasound abdomen", "Vitamin D & B12", "Diet & cardiology consults"] },
  { n: "Heart Check", d: "For 40+ or with risk factors", p: 8999, mrp: 14000, items: ["Lipid profile & hs-CRP", "ECG, 2D echo & TMT", "CT calcium score", "Diabetes screening", "Cardiologist consult", "Personal heart-risk report"] },
  { n: "Women’s Wellness", d: "Tailored for women 30+", p: 4999, mrp: 8200, items: ["Pap smear & HPV screening", "Breast ultrasound / mammogram", "Thyroid & hormone panel", "Bone density (DEXA)", "Iron & Vitamin D", "Gynaecologist consult"] }
];
function renderPkgs() {
  $("#pkgGrid").innerHTML = PKGS.map((p, i) => `<div class="panel pkg ${p.feat ? "feat" : ""} rv in" style="transition-delay:${i * 60}ms">${p.feat ? '<span class="tag">Most chosen</span>' : ""}<h3>${p.n}</h3><p class="muted">${p.d}</p>
    <div class="price"><span class="pp" data-v="${Math.round(p.p * (pkgN === 2 ? 1.8 : 1))}">${inr(p.p * (pkgN === 2 ? 1.8 : 1))}</span><s>${inr(p.mrp * pkgN)}</s></div><small class="muted">${pkgN === 2 ? "for two people" : "per person"} · reports in 24 h</small>
    <ul>${p.items.map(x => `<li>${x}</li>`).join("")}</ul><button class="btn ${p.feat ? "btn-gold" : "btn-ghost"}" data-pkg="${p.n}">Book this check</button></div>`).join("");
}
$("#pkgGrid").addEventListener("click", e => { const b = e.target.closest("[data-pkg]"); if (b) toast(`${b.dataset.pkg} check reserved (demo). Our team will call to fix a date.`); });
segHandlers.pkg = v => { pkgN = +v; renderPkgs(); };
renderPkgs();
}
if ($("#tTrack")) {
/* ---------------- TESTIMONIALS / LIBRARY / FAQ ---------------- */
const TESTI = [
  ["After my father’s heart attack, the team had him in the cath lab within an hour. The doctors explained every step in plain words, twice when we needed it. We felt held.", "Maria L.", "Daughter of a cardiac patient", "t-shalini"],
  ["I booked my knee consult online in under a minute, and the robotic surgery had me walking the next day. Physio continued at home.", "Robert T.", "Knee replacement, age 64", "t-rajiv"],
  ["The NICU nurses treated our premature twins like their own. Six weeks later we took two healthy babies home.", "Aisha & Karan", "Parents of twins", "t-aisha"],
  ["The dietitian’s plan brought my HbA1c from 8.9 to 6.4 in five months without fancy food, just smarter everyday meals.", "Marco D.", "Diabetes programme", "t-venkatesh"]
];
let tI = 0;
$("#tTrack").innerHTML = TESTI.map(([q, n, r, ph]) => `<div class="t-slide"><div class="panel t-card"><div class="t-photo"><img src="assets/img/${ph}.jpg" alt="${n}" loading="lazy"><span class="qm">“</span></div><div><div class="stars">★★★★★</div><blockquote>${q}</blockquote><cite><b>${n}</b>${r}</cite></div></div></div>`).join("");
$("#tDots").innerHTML = TESTI.map((_, i) => `<button aria-label="Story ${i + 1}" data-i="${i}"></button>`).join("");
function tGo(i) { tI = (i + TESTI.length) % TESTI.length; $("#tTrack").style.transform = `translateX(-${tI * 100}%)`; $$("#tDots button").forEach((b, j) => b.classList.toggle("on", j === tI)); }
$("#tDots").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { tGo(+b.dataset.i); resetT(); } });
$("#tPrev").onclick = () => { tGo(tI - 1); resetT(); }; $("#tNext").onclick = () => { tGo(tI + 1); resetT(); };
let tT; const resetT = () => { clearInterval(tT); tT = setInterval(() => tGo(tI + 1), 6500); }; tGo(0); resetT();
}
if ($("#libGrid")) {
const LIB = [
  ["Heart", "Seven warning signs of a heart attack women often miss", "Jaw pain, fatigue and nausea are just as common as chest pain. Here’s what to watch for.", "6 min", ["#0a2533", "#14a093"], "heart-model"],
  ["Nutrition", "The Indian plate, rebuilt for diabetes", "You don’t need to give up rice. Portion, pairing and timing matter more than banning foods.", "8 min", ["#1d6b6f", "#7fd8cf"], "food2"],
  ["Kidney", "Why your creatinine number isn’t the whole story", "eGFR, urine protein and blood pressure together show how your kidneys are really doing.", "5 min", ["#3b1f2b", "#c06c52"], "lab"]
];
$("#libGrid").innerHTML = LIB.map(([c, t, p, r, g, im], i) => `<a href="#" class="panel post rv d${i}" data-toast="Articles are placeholders in this educational demo."><div class="cover"><img src="assets/img/${im}.jpg" alt="" loading="lazy"></div><div class="pb"><span class="cat">${c}</span><h3>${t}</h3><p>${p}</p><div class="read">${r} read · Reviewed by Aurelia doctors</div></div></a>`).join("");

}
if ($("#faqList")) {
const FAQ = [
  ["How do I book an OP appointment?", "Use the booking tool above: choose a department, doctor, date and time, then enter patient details. You get a token number and OP number instantly. You can also call the help desk."],
  ["What should I bring to my first visit?", "A photo ID, previous prescriptions and reports, your list of current medicines and your insurance card if you have one. Please arrive 15 minutes before your slot."],
  ["Is cashless insurance available?", "Yes. We work with 50+ insurers and TPAs. For planned admissions, share your policy details 48 hours ahead so our desk can get pre-authorisation."],
  ["Can I cancel or reschedule?", "Cancellation is free up to two hours before the slot. In this demo, use “My appointments” beside the booking tool."],
  ["Are follow-up visits charged?", "A follow-up with the same doctor within 7 days is free. The booking tool applies this automatically when you choose ‘Follow-up’."],
  ["Is the diet planner a prescription?", "No. It is an educational estimate based on standard formulas and general guidance. Your doctor or dietitian will personalise it for your test results and medicines."],
  ["What are the visiting hours?", "General wards 4–7 PM. ICU 11 AM–12 PM and 5–6 PM, one visitor at a time. Children under 12 are not allowed in critical-care areas."]
];
$("#faqList").innerHTML = FAQ.map(([q, a], i) => `<div class="acc rv ${i === 0 ? "open" : ""}"><button aria-expanded="${i === 0}">${q}<span class="pm"></span></button><div class="ans"><div><p>${a}</p></div></div></div>`).join("");
$("#faqList").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; const a = b.parentElement, open = !a.classList.contains("open"); $$("#faqList .acc").forEach(x => { x.classList.remove("open"); $("button", x).setAttribute("aria-expanded", "false"); }); if (open) { a.classList.add("open"); b.setAttribute("aria-expanded", "true"); } });
}

/* ---------------- CHAT ---------------- */
const BOT = [
  [/book|appoint|op\b|opd|slot/i, "You can book an OP visit in five quick steps using the booking tool on this page. I’ll take you there now."],
  [/time|hour|open|timing/i, "OPD runs Monday to Saturday, 8 AM to 8 PM. Emergency, pharmacy and lab are open 24×7. Ward visiting hours are 4–7 PM."],
  [/insur|cashless|tpa|claim/i, "We offer cashless treatment with 50+ insurers. Bring your policy card and photo ID; for planned surgery, share details 48 hours ahead."],
  [/emergenc|ambulance|accident|urgent/i, "For emergencies, call 1800-000-0000 (demo number) or tap the red ambulance button. In a real emergency, call your local emergency number right away."],
  [/diet|food|nutrition|calorie/i, "Try our diet planner. Pick a condition like diabetes, BP, kidney disease or PCOS and you’ll get calories, macros and an Indian meal plan."],
  [/report|result|lab/i, "Reports are in the patient portal. Click ‘Download reports’ and sign in with your UHID; the demo OTP is 1234."],
  [/fee|cost|price|charge/i, "Consultation fees range from ₹700 to ₹1,500 depending on the specialist. Video consults are 20% less and follow-ups within 7 days are free."],
  [/park|where|location|address|direction/i, "We’re at 1 Wellness Avenue, Lakeview District (a fictional address). Valet parking is free for patients at Gate 2."],
  [/hi|hello|hey|namaste/i, "Hello! I’m Aria, Aurelia’s care assistant. How can I help you today?"]
];
const QUICK = ["Book appointment", "OPD timings", "Insurance", "Diet planner", "Reports"];
function bub(t, me) { const b = document.createElement("div"); b.className = "bub " + (me ? "me" : "bot"); b.textContent = t; $("#chatBody").appendChild(b); $("#chatBody").scrollTop = 1e6; return b; }
function botReply(q) {
  const ty = document.createElement("div"); ty.className = "bub bot typing"; ty.innerHTML = "<span></span><span></span><span></span>"; $("#chatBody").appendChild(ty); $("#chatBody").scrollTop = 1e6;
  setTimeout(() => { ty.remove(); const m = BOT.find(([r]) => r.test(q)); bub(m ? m[1] : "I can help with appointments, timings, insurance, reports, diet and emergencies. For anything else, our help desk is on +91 00000 00000 (demo).");
    if (/book|appoint|op\b|opd|slot/i.test(q)) setTimeout(() => { location.href = "book.html"; }, 1200);
    if (/diet|food|nutrition|calorie/i.test(q)) setTimeout(() => { location.href = "diet.html"; }, 1200);
  }, 700 + Math.random() * 500);
}
$("#chatQ").innerHTML = QUICK.map(q => `<button type="button">${q}</button>`).join("");
$("#chatQ").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; bub(b.textContent, true); botReply(b.textContent); });
$("#chatForm").addEventListener("submit", e => { e.preventDefault(); const v = $("#chatIn").value.trim(); if (!v) return; $("#chatIn").value = ""; bub(v, true); botReply(v); });
$("#chatBtn").addEventListener("click", () => { const c = $("#chatbox"); c.classList.toggle("open"); if (!$("#chatBody").children.length) setTimeout(() => bub("Hi, I’m Aria 👋 I can help you book a visit, find timings or answer insurance questions."), 300); if (c.classList.contains("open")) setTimeout(() => $("#chatIn").focus(), 350); });
$("#chatClose").addEventListener("click", () => $("#chatbox").classList.remove("open"));

/* ---------------- MODALS ---------------- */
function openModal(id) { $("#" + id).classList.add("open"); if (id === "reportModal") { $("#rpStep1").style.display = "grid"; $("#rpStep2").style.display = "none"; $("#rpStep3").style.display = "none"; } }
document.addEventListener("click", e => {
  const o = e.target.closest("[data-open]"); if (o) { e.preventDefault(); openModal(o.dataset.open); return; }
  const t = e.target.closest("[data-toast]"); if (t) { e.preventDefault(); toast(t.dataset.toast); return; }
  if (e.target.closest("[data-close]") || e.target.classList.contains("modal")) { $$(".modal.open").forEach(m => m.classList.remove("open")); }
});
addEventListener("keydown", e => { if (e.key === "Escape") { $$(".modal.open").forEach(m => m.classList.remove("open")); $("#chatbox").classList.remove("open"); $("#mobileMenu").classList.remove("open"); } });
let ambTimer;
$("#aPhone").addEventListener("input", e => e.target.value = e.target.value.replace(/\D/g, ""));
$("#ambGo").addEventListener("click", () => {
  const loc = $("#aLoc").value.trim(), ph = $("#aPhone").value.trim();
  $("#aLoc").closest(".field").classList.toggle("err", !loc); $("#aPhone").closest(".field").classList.toggle("err", !/^[6-9]\d{9}$/.test(ph));
  if (!loc || !/^[6-9]\d{9}$/.test(ph)) return;
  $("#ambForm").style.display = "none"; $("#ambTrack").style.display = "block";
  $("#ambInfo").textContent = `Vehicle KA-01-AU-${2000 + hash(ph) % 7999} · ${$("#aType").value} · to ${loc}`;
  const total = 12 * 60; let left = total; clearInterval(ambTimer);
  const tick = () => { const m = Math.floor(left / 60), s = left % 60; $("#ambEta").textContent = `${m}:${String(s).padStart(2, "0")}`; const p = (1 - left / total) * 100; $("#ambBar").style.width = p + "%"; $("#ambIcon").style.left = p + "%"; if (left-- <= 0) clearInterval(ambTimer); };
  tick(); ambTimer = setInterval(tick, 1000);
});
$("#ambModal").addEventListener("transitionend", () => { if (!$("#ambModal").classList.contains("open")) { clearInterval(ambTimer); $("#ambForm").style.display = "block"; $("#ambTrack").style.display = "none"; } });
$("#rpOtp").addEventListener("click", () => { const ok = $("#rUhid").value.trim().length > 2; $("#rUhid").closest(".field").classList.toggle("err", !ok); if (!ok) return; $("#rpStep1").style.display = "none"; $("#rpStep2").style.display = "grid"; toast("OTP sent (demo OTP: 1234)"); $("#rOtp").focus(); });
$("#rpLogin").addEventListener("click", () => {
  const ok = $("#rOtp").value === "1234"; $("#rOtp").closest(".field").classList.toggle("err", !ok); if (!ok) return;
  $("#rpStep2").style.display = "none"; const r = $("#rpStep3"); r.style.display = "block";
  const reps = [["Complete Blood Count", "12 Nov", "Normal"], ["HbA1c", "12 Nov", "6.4% · Borderline"], ["Lipid Profile", "12 Nov", "LDL 128 · Review"], ["Chest X-ray", "02 Oct", "Normal"]];
  r.innerHTML = `<p class="sub" style="margin-top:-6px">Signed in as ${esc($("#rUhid").value.trim().toUpperCase())} (sample data)</p>` + reps.map(([n, d, s]) => `<div class="appt"><div class="ad"><small>${d.split(" ")[1]}</small><b>${d.split(" ")[0]}</b></div><div class="ai"><b>${n}</b><span>${s}</span></div><button class="link" style="color:var(--teal)" data-toast="Sample report: PDFs aren’t generated in this demo.">View</button></div>`).join("");
});
function simpleForm(form, fields, msg) { $(form).addEventListener("submit", e => { e.preventDefault(); let ok = true; fields.forEach(([s, fn]) => { const v = fn($(s).value.trim()); $(s).closest(".field")?.classList.toggle("err", !v); if (!v) ok = false; }); if (ok) { $(form).reset(); toast(msg); } }); }
if ($("#contactForm")) simpleForm("#contactForm", [["#cName", v => v.length > 1], ["#cPhone", v => /^[6-9]\d{9}$/.test(v)]], "Thanks! Our care team will call you back within 30 minutes (demo).");
if ($("#contactForm")) $("#cPhone").addEventListener("input", e => e.target.value = e.target.value.replace(/\D/g, ""));
$("#newsForm").addEventListener("submit", e => { e.preventDefault(); e.target.reset(); toast("Subscribed. Welcome to Aurelia Health Notes (demo)."); });

/* ---------------- CHROME: nav, theme, reveal, counters, live ---------------- */
const nav = $("#nav");
const onScroll = () => { nav.classList.toggle("scrolled", scrollY > 50); $("#toTop").classList.toggle("show", scrollY > 900); };
addEventListener("scroll", onScroll, { passive: true }); onScroll();
$("#toTop").onclick = () => scrollTo({ top: 0, behavior: "smooth" });
$("#burger").onclick = () => $("#mobileMenu").classList.add("open");
$("#menuClose").onclick = () => $("#mobileMenu").classList.remove("open");
$$("#mobileMenu a").forEach(a => a.onclick = () => $("#mobileMenu").classList.remove("open"));
const root = document.documentElement;
const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
const setThemeIcon = () => $("#themeBtn use").setAttribute("href", isDark() ? "#i-sun" : "#i-moon");
const saved = store.get("aur-theme", null); if (saved) root.dataset.theme = saved; setThemeIcon();
$("#themeBtn").onclick = () => { root.dataset.theme = isDark() ? "light" : "dark"; store.set("aur-theme", root.dataset.theme); setThemeIcon(); };
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
const observeAll = () => $$(".rv:not(.in)").forEach(el => io.observe(el)); observeAll();
const cio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const el = e.target, to = +el.dataset.count, dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || ""; tween(el, to, v => v.toFixed(dec) + suf, 1800); cio.unobserve(el); }), { threshold: .5 });
$$("[data-count]").forEach(el => cio.observe(el));
function clock() { $("#clock").textContent = new Date().toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }) + " IST"; }
clock(); setInterval(clock, 30000);
const LIVE = { lsEr: [6, 2, 18, " min", 20], lsBeds: [142, 120, 170, "", 220], lsIcu: [18, 10, 26, "", 60], lsDocs: [214, 200, 230, "", 260], lsBlood: [36, 28, 44, " units", 80], ambLive: [23, 18, 30, "", 40] };
setInterval(() => { Object.entries(LIVE).forEach(([id, v]) => { if (Math.random() < .55) return; v[0] = Math.max(v[1], Math.min(v[2], v[0] + Math.round((Math.random() - .5) * 4))); const el = $("#" + id); if (!el) return; el.textContent = v[0] + v[3]; el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 600); const bar = el.parentElement.querySelector(".bar i"); if (bar) bar.style.width = (v[0] / v[4] * 100) + "%"; }); const b = $("#bpm"); if (b) b.textContent = 68 + Math.round(Math.random() * 8); }, 3000);
$("#yr").textContent = new Date().getFullYear();

/* ---------------- INIT ---------------- */
window.AUR = { DOCS, DEPTS, D, B, toast, store, tween, icon, inr, esc, hash, rng, slotsFor, fmtDate, qrSvg, docAv, initials, segHandlers, placeThumbs, observeAll };
requestAnimationFrame(placeThumbs); document.fonts?.ready.then(placeThumbs);
})();
