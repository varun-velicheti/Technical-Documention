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
