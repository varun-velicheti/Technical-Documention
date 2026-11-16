/* First Sip — franchise planner.
   A month-by-month model of one café over five years: ramp-up, growth, rent and
   salary escalation, royalty, marketing fund and delivery commission.
   All figures are illustrative and pre-tax. */
(() => {
  "use strict";
  const root = document.querySelector("[data-planner]");
  if (!root) return;
  const $ = (s, c = root) => c.querySelector(s);
  const $$ = (s, c = root) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- assumptions ---------- */
  const CUPS_PER_BILL = 1.4, DAYS = 30, MONTHS = 60;
  const ROYALTY = 0.06, MARKETING = 0.02, APP_COMMISSION = 0.22;
  const RENT_ESCALATION = 0.05, SALARY_RAISE = 0.06;

  // Presets calibrated to typical specialty-café economics (roughly 13–16% EBITDA margin).
  const FORMATS = {
    kiosk:    { cups: 180, bill: 200, delivery: 15, growth: 6, cogs: 32, rent: 150, team: 6,  salary: 20, utilities: 45,  setup: 25,  fee: 5,  wc: 2 },
    cafe:     { cups: 300, bill: 260, delivery: 20, growth: 6, cogs: 33, rent: 250, team: 12, salary: 24, utilities: 120, setup: 60,  fee: 8,  wc: 5 },
    flagship: { cups: 520, bill: 320, delivery: 15, growth: 6, cogs: 34, rent: 600, team: 24, salary: 26, utilities: 250, setup: 130, fee: 15, wc: 10 },
  };
  const TIERS = {
    metro: { cups: 1, bill: 1, rent: 1, salary: 1, setup: 1 },
    t1:    { cups: .92, bill: .9, rent: .7, salary: .85, setup: .92 },
    t2:    { cups: .85, bill: .8, rent: .5, salary: .72, setup: .85 },
  };
  const SCENARIOS = {
    low:  { name: "Conservative", cups: .88, cogs: 1,  ramp: 9 },
    base: { name: "Base",         cups: 1,   cogs: 0,  ramp: 6 },
    high: { name: "Optimistic",   cups: 1.15, cogs: -1, ramp: 4 },
  };
  const LABELS = { kiosk: "Kiosk", cafe: "Café", flagship: "Flagship", metro: "Metro", t1: "Tier 1", t2: "Tier 2" };

  /* ---------- formatting ---------- */
  const money = (v, dp) => {
    const s = v < 0 ? "−" : "", a = Math.abs(v);
    if (a >= 1e7) return `${s}₹${(a / 1e7).toFixed(dp ?? 2)} Cr`;
    if (a >= 1e5) return `${s}₹${(a / 1e5).toFixed(dp ?? 1)} L`;
    if (a >= 1e3) return `${s}₹${Math.round(a / 1e3)}K`;
    return `${s}₹${Math.round(a)}`;
  };
  const kToText = (k) => (k >= 100 ? `₹${(k / 100).toFixed(k % 100 ? 1 : 0)}L` : `₹${k}K`);
  const lakhToText = (l) => (l >= 100 ? `₹${(l / 100).toFixed(2).replace(/0$/, "")} Cr` : `₹${l}L`);
  const pct = (v, dp = 0) => `${(v * 100).toFixed(dp)}%`;
  const months = (m) => (m == null ? "60+ months" : `${m} month${m === 1 ? "" : "s"}`);

  const OUT = {
    cups: (v) => `${v}`, bill: (v) => `₹${v}`, delivery: (v) => `${v}%`, growth: (v) => `${v}%`,
    cogs: (v) => `${v}%`, rent: kToText, team: (v) => `${v} people`, salary: (v) => `₹${v}K`,
    utilities: kToText, setup: lakhToText, fee: lakhToText, wc: lakhToText,
  };

  /* ---------- state ---------- */
  const inputs = Object.fromEntries($$("[data-in]").map((el) => [el.dataset.in, el]));
  const sel = { format: "cafe", tier: "metro", scenario: "base" };
  const read = () => Object.fromEntries(Object.entries(inputs).map(([k, el]) => [k, +el.value]));

  const snap = (el, v) => {
    const step = +el.step || 1, min = +el.min, max = +el.max;
    return Math.min(max, Math.max(min, Math.round((v - min) / step) * step + min));
  };
  const applyPreset = () => {
    const f = FORMATS[sel.format], t = TIERS[sel.tier];
    const v = { ...f, cups: f.cups * t.cups, bill: f.bill * t.bill, rent: f.rent * t.rent, salary: f.salary * t.salary, setup: f.setup * t.setup };
    Object.entries(inputs).forEach(([k, el]) => (el.value = snap(el, v[k])));
  };

  /* ---------- the model ---------- */
  const model = (x, scenKey) => {
    const sc = SCENARIOS[scenKey];
    const cups = x.cups * sc.cups, cogsRate = (x.cogs + sc.cogs) / 100;
    const d = x.delivery / 100, g = x.growth / 100;
    const invest = (x.setup + x.fee + x.wc) * 1e5;
    const rows = [];
    let cum = -invest, payback = null, prevCum = cum;
    for (let t = 1; t <= MONTHS; t++) {
      const yr = Math.floor((t - 1) / 12);
      const ramp = t >= sc.ramp ? 1 : 0.6 + 0.4 * (t - 1) / Math.max(1, sc.ramp - 1);
      const rev = cups / CUPS_PER_BILL * x.bill * DAYS * ramp * Math.pow(1 + g, (t - 1) / 12);
      const r = {
        rev,
        cogs: rev * cogsRate,
        delivery: rev * d * APP_COMMISSION,
        royalty: rev * (ROYALTY + MARKETING),
        rent: x.rent * 1e3 * Math.pow(1 + RENT_ESCALATION, yr),
        staff: x.team * x.salary * 1e3 * Math.pow(1 + SALARY_RAISE, yr),
        util: x.utilities * 1e3,
      };
      r.ebitda = r.rev - r.cogs - r.delivery - r.royalty - r.rent - r.staff - r.util;
      prevCum = cum; cum += r.ebitda; r.cum = cum;
      if (payback == null && cum >= 0) payback = t;
      rows.push(r);
    }
    // Annual return: monthly IRR on the five-year cash flows (no exit value assumed).
    const npv = (rate) => rows.reduce((s, r, i) => s + r.ebitda / Math.pow(1 + rate, i + 1), -invest);
    let irr = null;
    if (npv(-0.5) > 0 && npv(1) < 0) {
      let lo = -0.5, hi = 1;
      for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; npv(mid) > 0 ? (lo = mid) : (hi = mid); }
      irr = Math.pow(1 + lo, 12) - 1;
    }
    const total = rows.reduce((s, r) => s + r.ebitda, 0);
    const y2 = rows.slice(12, 24);
    const avg = (k) => y2.reduce((s, r) => s + r[k], 0) / 12;
    const steady = Object.fromEntries(["rev", "cogs", "delivery", "royalty", "rent", "staff", "util", "ebitda"].map((k) => [k, avg(k)]));
    // Cups a day needed to cover year-one fixed costs.
    const perCup = x.bill / CUPS_PER_BILL * DAYS * (1 - cogsRate - d * APP_COMMISSION - ROYALTY - MARKETING);
    const fixed = x.rent * 1e3 + x.team * x.salary * 1e3 + x.utilities * 1e3;
    const be = perCup > 0 ? Math.ceil(fixed / perCup) : null;
    const years = [0, 1, 2, 3, 4].map((y) => {
      const ys = rows.slice(y * 12, y * 12 + 12);
      const sum = (k) => ys.reduce((s, r) => s + r[k], 0);
      const o = Object.fromEntries(["rev", "cogs", "delivery", "royalty", "rent", "staff", "util", "ebitda"].map((k) => [k, sum(k)]));
      o.cum = ys[11].cum; return o;
    });
    return { rows, invest, payback, irr, roi: (total - invest) / invest, steady, be, years, firstMonth: rows[0].ebitda };
  };

  /* ---------- small animation helpers ---------- */
  const tweens = new WeakMap();
  const tween = (el, to, fmt) => {
    const from = tweens.has(el) ? tweens.get(el) : to;
    tweens.set(el, to);
    if (reduced || from === to || !isFinite(from) || !isFinite(to)) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 420;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (k < 1 && tweens.get(el) === to) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- cumulative cash chart ---------- */
  const svg = $("[data-chart] svg"), tip = $("[data-tip]"), chartBox = $("[data-chart]");
  const W = 600, H = 220, PAD = 10;
  let shown = null, target = null, animStart = 0, lastRes = null;
  const scaleOf = (vals) => {
    const lo = Math.min(0, ...vals), hi = Math.max(0, ...vals);
    const span = hi - lo || 1;
    return { y: (v) => PAD + (H - 2 * PAD) * (1 - (v - lo) / span), x: (i) => (i / (vals.length - 1)) * W };
  };
  const drawChart = (vals, payback) => {
    const s = scaleOf(vals), zero = s.y(0);
    const line = vals.map((v, i) => `${i ? "L" : "M"}${s.x(i).toFixed(1)},${s.y(v).toFixed(1)}`).join("");
    const area = `${line}L${W},${zero}L0,${zero}Z`;
    const pbX = payback ? s.x(payback - 1) : null;
    svg.innerHTML = `
      <defs>
        <clipPath id="pc-above"><rect x="0" y="0" width="${W}" height="${zero}"/></clipPath>
        <clipPath id="pc-below"><rect x="0" y="${zero}" width="${W}" height="${H - zero}"/></clipPath>
        <linearGradient id="pc-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f5f45" stop-opacity=".35"/><stop offset="1" stop-color="#1f5f45" stop-opacity=".04"/></linearGradient>
        <linearGradient id="pc-r" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#a0764e" stop-opacity=".35"/><stop offset="1" stop-color="#a0764e" stop-opacity=".05"/></linearGradient>
      </defs>
      ${[12, 24, 36, 48].map((m) => `<line x1="${s.x(m)}" x2="${s.x(m)}" y1="${PAD}" y2="${H - PAD}" stroke="rgba(30,20,16,.07)" vector-effect="non-scaling-stroke"/>`).join("")}
      <path d="${area}" fill="url(#pc-g)" clip-path="url(#pc-above)"/>
      <path d="${area}" fill="url(#pc-r)" clip-path="url(#pc-below)"/>
      <line x1="0" x2="${W}" y1="${zero}" y2="${zero}" stroke="rgba(30,20,16,.35)" stroke-dasharray="4 4" vector-effect="non-scaling-stroke"/>
      <path d="${line}" fill="none" stroke="#1f5f45" stroke-width="2.5" clip-path="url(#pc-above)" vector-effect="non-scaling-stroke"/>
      <path d="${line}" fill="none" stroke="#8a5a34" stroke-width="2.5" clip-path="url(#pc-below)" vector-effect="non-scaling-stroke"/>
      ${pbX != null ? `<line x1="${pbX}" x2="${pbX}" y1="${PAD}" y2="${H - PAD}" stroke="#1f5f45" stroke-dasharray="3 4" vector-effect="non-scaling-stroke"/>` : ""}
      <line data-cursor x1="0" x2="0" y1="${PAD}" y2="${H - PAD}" stroke="#241812" stroke-width="1" vector-effect="non-scaling-stroke" visibility="hidden"/>`;
    // HTML markers keep their shape (the SVG stretches to fit the box).
    $$(".pc__marker, .pc__dot", chartBox).forEach((n) => n.remove());
    if (pbX != null) {
      const m = document.createElement("div");
      m.className = "pc__marker";
      m.style.left = `${(pbX / W) * 100}%`; m.style.top = `${(zero / H) * 100}%`;
      m.innerHTML = `<i></i><span>Break-even · month ${payback}</span>`;
      if (pbX / W > .7) m.classList.add("is-right");
      chartBox.appendChild(m);
    }
  };
  const animateChart = (vals, payback) => {
    target = { vals, payback };
    if (!shown || reduced) { shown = vals.slice(); drawChart(shown, payback); return; }
    const from = shown.slice(); animStart = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - animStart) / 450), e = 1 - Math.pow(1 - k, 3);
      shown = from.map((v, i) => v + (target.vals[i] - v) * e);
      drawChart(shown, k < 1 ? null : target.payback);
      if (k < 1 && target.vals === vals) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const hover = (clientX) => {
    if (!lastRes) return;
    const r = chartBox.getBoundingClientRect();
    const fx = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const i = Math.round(fx * (MONTHS - 1)), row = lastRes.rows[i];
    const cursor = $("[data-cursor]", svg);
    if (cursor) { const x = (i / (MONTHS - 1)) * W; cursor.setAttribute("x1", x); cursor.setAttribute("x2", x); cursor.setAttribute("visibility", "visible"); }
    const s = scaleOf(lastRes.rows.map((q) => q.cum));
    let dot = $(".pc__dot", chartBox);
    if (!dot) { dot = document.createElement("div"); dot.className = "pc__dot"; chartBox.appendChild(dot); }
    dot.style.left = `${(i / (MONTHS - 1)) * 100}%`; dot.style.top = `${(s.y(row.cum) / H) * 100}%`;
    dot.classList.toggle("neg", row.cum < 0);
    tip.hidden = false;
    tip.innerHTML = `<b>Month ${i + 1}</b><span>Cash position <strong>${money(row.cum)}</strong></span><span>Monthly profit ${money(row.ebitda)}</span><span>Sales ${money(row.rev)}</span>`;
    const left = fx * r.width;
    tip.style.left = `${Math.min(r.width - 170, Math.max(0, left - 85))}px`;
  };
  chartBox.addEventListener("pointermove", (e) => hover(e.clientX));
  chartBox.addEventListener("pointerdown", (e) => hover(e.clientX));
  chartBox.addEventListener("pointerleave", () => {
    tip.hidden = true; const c = $("[data-cursor]", svg); if (c) c.setAttribute("visibility", "hidden");
    const dot = $(".pc__dot", chartBox); if (dot) dot.remove();
  });

  // Axis labels sit exactly under the year gridlines.
  const axis = $("[data-axis]");
  if (axis) axis.innerHTML = [[0, "Month 1"], [12, "Year 2"], [24, "Year 3"], [36, "Year 4"], [48, "Year 5"], [59, "Month 60"]]
    .map(([m, t]) => `<span style="left:${(m / (MONTHS - 1)) * 100}%">${t}</span>`).join("");

  /* ---------- where every ₹100 goes ---------- */
  const PARTS = [
    ["cogs", "Coffee, milk & food", "#8a5a34"],
    ["staff", "Team", "#b88d5e"],
    ["rent", "Rent", "#d6b98f"],
    ["royalty", "Royalty & marketing", "#e7d5b8"],
    ["delivery", "Delivery apps", "#c9b49a"],
    ["util", "Utilities & other", "#a89382"],
    ["ebitda", "Your profit", "#1f5f45"],
  ];
  const stack = $("[data-stack]"), keys = $("[data-keys]");
  stack.innerHTML = PARTS.map(([k, , c]) => `<span data-part="${k}" style="background:${c}"></span>`).join("");
  keys.innerHTML = PARTS.map(([k, label, c]) => `<li><i style="background:${c}"></i>${label}<b data-key="${k}"></b></li>`).join("");
  const drawStack = (st) => {
    PARTS.forEach(([k]) => {
      const share = Math.max(0, st[k] / st.rev);
      $(`[data-part="${k}"]`, stack).style.flexBasis = `${share * 100}%`;
      $(`[data-key="${k}"]`, keys).textContent = st[k] < 0 && k === "ebitda" ? `−₹${Math.abs(Math.round(st[k] / st.rev * 100))}` : `₹${Math.round(Math.max(0, st[k]) / st.rev * 100)}`;
    });
  };

  /* ---------- scenarios + sensitivity + table ---------- */
  const drawScenarios = (x) => {
    $("[data-scen]").innerHTML = ["low", "base", "high"].map((k) => {
      const m = model(x, k);
      return `<button type="button" class="pc__scen-card${k === sel.scenario ? " is-active" : ""}" data-pick="${k}">
        <span>${SCENARIOS[k].name}</span>
        <b>${months(m.payback)}</b><small>payback</small>
        <dl><div><dt>IRR</dt><dd>${m.irr == null ? "Below 0%" : (m.irr < 0 ? "−" : "") + pct(Math.abs(m.irr))}</dd></div><div><dt>Year 3 profit</dt><dd>${money(m.years[2].ebitda)}</dd></div></dl>
      </button>`;
    }).join("");
  };
  const DRIVERS = [
    ["cups", "Cups per day", 1], ["bill", "Average bill", 1], ["cogs", "Coffee & food cost", -1],
    ["rent", "Rent", -1], ["salary", "Salaries", -1], ["setup", "Fit-out cost", -1],
  ];
  const drawTornado = (x, base) => {
    const cap = (m) => (m == null ? 61 : m);
    const b = cap(base.payback);
    const rows = DRIVERS.map(([k, label, dir]) => {
      const better = { ...x, [k]: x[k] * (1 + 0.15 * dir) }, worse = { ...x, [k]: x[k] * (1 - 0.15 * dir) };
      const pb = cap(model(better, sel.scenario).payback), pw = cap(model(worse, sel.scenario).payback);
      return { label, gain: b - pb, loss: pw - b, pb, pw };
    }).sort((p, q) => (q.gain + q.loss) - (p.gain + p.loss));
    const max = Math.max(1, ...rows.map((r) => Math.max(r.gain, r.loss)));
    $("[data-tornado]").innerHTML = rows.map((r) => `
      <div class="pc__t-row">
        <span class="pc__t-label">${r.label}</span>
        <span class="pc__t-bar pc__t-bar--good"><i style="width:${(r.gain / max) * 100}%"></i><em>${r.gain ? `−${r.gain} mo` : "0"}</em></span>
        <span class="pc__t-bar pc__t-bar--bad"><i style="width:${(r.loss / max) * 100}%"></i><em>${r.pw > 60 ? "60+ mo" : `+${r.loss} mo`}</em></span>
      </div>`).join("") + `<div class="pc__t-axis"><span>15% better</span><span>15% worse</span></div>`;
  };
  const drawTable = (m) => {
    const lines = [
      ["Sales", "rev"], ["Coffee, milk & food", "cogs", 1], ["Delivery apps", "delivery", 1], ["Royalty & marketing", "royalty", 1],
      ["Rent", "rent", 1], ["Team", "staff", 1], ["Utilities & other", "util", 1],
    ];
    const head = `<thead><tr><th></th>${m.years.map((_, i) => `<th>Year ${i + 1}</th>`).join("")}</tr></thead>`;
    const body = lines.map(([label, k, neg]) => `<tr><th>${label}</th>${m.years.map((y) => `<td>${neg ? money(-y[k]) : money(y[k])}</td>`).join("")}</tr>`).join("")
      + `<tr class="is-total"><th>Profit (EBITDA)</th>${m.years.map((y) => `<td class="${y.ebitda < 0 ? "neg" : ""}">${money(y.ebitda)}</td>`).join("")}</tr>`
      + `<tr><th>Margin</th>${m.years.map((y) => `<td>${pct(y.ebitda / y.rev, 1)}</td>`).join("")}</tr>`
      + `<tr class="is-cum"><th>Cumulative cash</th>${m.years.map((y) => `<td class="${y.cum < 0 ? "neg" : "pos"}">${money(y.cum)}</td>`).join("")}</tr>`;
    $("[data-table]").innerHTML = head + `<tbody>${body}</tbody>`;
  };

  /* ---------- update ---------- */
  const R = (k) => $(`[data-r="${k}"]`);
  const update = () => {
    const x = read();
    Object.entries(inputs).forEach(([k, el]) => {
      el.style.setProperty("--pct", `${((el.value - el.min) / (el.max - el.min)) * 100}%`);
      $(`[data-out="${k}"]`).textContent = OUT[k](+el.value);
    });
    const m = model(x, sel.scenario);
    lastRes = m;
    const pbEl = R("payback");
    if (m.payback == null) { tweens.delete(pbEl); pbEl.textContent = "60+ months"; }
    else tween(pbEl, m.payback, (v) => months(Math.round(v)));
    R("paybackNote").textContent = `${SCENARIOS[sel.scenario].name} · ${LABELS[sel.format]} · ${LABELS[sel.tier]} · ${money(m.invest)} invested`;
    if (m.irr == null) { tweens.delete(R("irr")); R("irr").textContent = "Below 0%"; } else tween(R("irr"), m.irr * 100, (v) => `${v < 0 ? "−" : ""}${Math.abs(Math.round(v))}%`);
    tween(R("roi"), m.roi * 100, (v) => `${v < 0 ? "−" : ""}${Math.abs(Math.round(v))}%`);
    tween(R("ebitda"), m.steady.ebitda, (v) => money(v));
    R("margin").textContent = `${pct(m.steady.ebitda / m.steady.rev)} margin · year 2`;
    if (m.be == null) R("be").textContent = "–"; else tween(R("be"), m.be, (v) => `${Math.round(v)}`);
    root.classList.toggle("is-loss", m.payback == null);
    $('[data-sum="sales"]').textContent = `${money(m.steady.rev)} / month`;
    $('[data-sum="costs"]').textContent = `${money(x.rent * 1e3 + x.team * x.salary * 1e3 + x.utilities * 1e3)} fixed / month`;
    $('[data-sum="invest"]').textContent = `${money(m.invest)} total`;
    animateChart(m.rows.map((r) => r.cum), m.payback);
    drawStack(m.steady);
    drawScenarios(x);
    drawTornado(x, m);
    drawTable(m);
  };

  let queued = false;
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; update(); }); } };
  Object.values(inputs).forEach((el) => el.addEventListener("input", schedule));
  $$("[data-group]").forEach((g) => g.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-val]"); if (!b) return;
    $$("button", g).forEach((x) => x.classList.toggle("is-active", x === b));
    sel[g.dataset.group] = b.dataset.val;
    if (g.dataset.group !== "scenario") applyPreset();
    update();
  }));
  root.addEventListener("click", (e) => {
    const c = e.target.closest("[data-pick]"); if (!c) return;
    const b = $(`[data-group="scenario"] [data-val="${c.dataset.pick}"]`); if (b) b.click();
  });
  $("[data-reset]").addEventListener("click", () => { applyPreset(); update(); });
  applyPreset();
  update();
})();
