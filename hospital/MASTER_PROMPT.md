# Master prompt: premium hospital website

Copy everything inside the box below into a new Claude Code session, in an empty repository or folder. Replace the bracketed values first: hospital name, city, phone numbers and colours. The prompt describes the Aurelia Hospital site in this folder exactly as it was finally built and approved, so following it should rebuild the same site without the many rounds of revisions the original needed.

---

```text
Build a premium, multi-page hospital website for a FICTIONAL hospital, for educational use.
Hospital: "[Aurelia] CARE — Hospital & Research", [Bengaluru, India]. Currency ₹ (en-IN formatting).
Emergency line [1800-000-0000], help desk [+91 00000 00000], email [care@aurelia.example].
Deliver a static site (plain HTML/CSS/JS, no framework, no build step needed to view) in a folder `hospital/`,
push it to the repo, and give me a GitHub Pages URL like
https://<user>.github.io/<repo>/hospital/index.html (merge to the Pages branch when I say so).

=====================================================================
1. ARCHITECTURE
=====================================================================
- Source in `hospital/_src/`: body.html (all sections, split by <!-- NAME --> markers), style.css,
  features.css, pages.css, mint.css (theme, loaded last), app.js, features.js, build.py.
- `python3 _src/build.py` splits body.html into pages and writes `hospital/*.html` plus
  `assets/site.css` and `assets/site.js` (one shared CSS/JS for all pages).
- Every JS module starts only if its root element exists on the page (`if ($("#docGrid")) {...}`).
  Expose shared helpers on `window.AUR`.
- Pages share one top bar, header, mobile menu, footer, chat widget, modals and floating buttons.
  Nav links are relative, e.g. `book.html`, and in-page `#hash` links are rewritten to the right page.
- Cross-page hand-off via query strings: `book.html?doc=d5` (doctor preselected, opens at the
  date step), `book.html?dept=card`, `doctors.html?dept=ortho`, `doctors.html?q=knee`.
- Photos are downloaded and stored locally in `assets/img/` (never hot-linked), free Unsplash images,
  credited in the footer and README. I look at every photo before using it.
- Fonts: Google Fonts only. Other libraries: none.
- Use cross-document view transitions (`@view-transition{navigation:auto}`) for page fades.

=====================================================================
2. PAGES (10) AND WHAT IS ON EACH
=====================================================================
index.html        Hero (3D scene) → 6 service tiles + ECG line + live status strip → "A journey through you"
                  scroll story → "Care with a human face" photo collage → "Start here" grid of 8 page links
                  → patient stories carousel → emergency band → footer
specialities.html Page banner → 8 centre cards (photo reveal on hover) → marquee of capabilities
                  → dark "Technology" band (6 items) → CTA band
doctors.html      Banner → search + speciality chips → doctor cards (8 shown on load + "Show all 16")
symptoms.html     Banner → body-map symptom guide
book.html         Banner with floating doctor "Book Now / Available Today" card → 5-step OP booking
visit.html        Banner ("Typical visit 47 minutes") → "Your visit, step by step" animated road
diet.html         Banner → condition-based diet planner
checkups.html     Banner with Individual/Couple toggle → 4 health packages
patients.html     Banner → 6 patient services → health library (3 articles) → FAQ accordion
contact.html      Banner → map card + contact info + call-back form → emergency band

Inner-page banner: light mint gradient, breadcrumb (Home / Page), eyebrow, H1 with a teal accent phrase,
lead text, animated teal ECG line along the bottom, and a floating, gently bobbing rounded photo card
on the right (white 8px border) with two glass bubbles. Most inner pages end with a dark-teal CTA band
"Start with the right doctor, first time." [Book an OP visit] [Try the symptom guide].

Header: top bar (deep teal gradient) with pulsing red dot "24×7 Emergency [number]", "Ambulance Request now",
"OPD: Mon–Sat, 8 AM – 8 PM" and a live IST clock. Sticky glass nav: logo (teal app-style rounded square with
a white cross + "Aurelia CARE", tagline "HOSPITAL & RESEARCH"), links: Specialities, Doctors, Symptoms,
Diet planner, Checkups, Your visit, Patients, Contact (active link highlighted), dark-mode toggle,
"Book appointment" pill. Burger menu below 1240px; full-screen mobile menu.
Footer: dark teal, big line "Healing is a team sport. You’re the captain.", newsletter, 3 link columns.
Floating: back-to-top, chat button (teal), pulsing red ambulance SOS button.
Do NOT add an "educational demo" banner at the top. Keep a small "fictional hospital" note in the footer.

=====================================================================
3. VISUAL DESIGN (match exactly)
=====================================================================
Style reference: a light mint/aqua healthcare UI with frosted-glass cards and soft 3D objects.
Font: Poppins (300–700) everywhere. Headings weight 600, letter-spacing -0.025em; accent words in
teal, NOT italic. Body 15.5px. Minimum text size 12.5px.
Tokens:
  --bg #eaf6f5   --paper #ffffff   --paper2 #f3fbfa   --ink #163a42   --ink2 #3f5f68   --muted #678891
  --navy #155358 --navy2 #1e6d71   --teal #2a9b95     --teal2 #45b7af --mint #d6f1ee  accent-light #8fe3d9
  shadows: soft teal-tinted (0 12px 32px -14px rgba(22,90,95,.25); large 0 30px 70px -30px rgba(22,90,95,.38))
Body background: gradient #eef9f8 → --bg. Cards: white, 1px white border, radius 18–28px, soft shadow.
Primary buttons: teal gradient (#3db3ab→#23857f) pill with glow; secondary: frosted white pill.
Dark accent areas (technology band, CTA band, footer) in deep teal; emergency band in deep red gradient.
Full dark mode (prefers-color-scheme + manual toggle saved in localStorage, wrapped in try/catch) with
dark versions of every frosted surface. Respect prefers-reduced-motion.
Scroll reveal on sections (fade + rise). Count-up numbers.
Responsive: 1440 desktop, tablet, 390 phone; 16px gutters; no horizontal scroll (html,body overflow-x:clip).
Long phone numbers must never wrap (white-space:nowrap with a clamp() font size).

=====================================================================
4. HOME HERO — 3D SCENE WITH SCROLL ANIMATION (most important; get it right)
=====================================================================
Left: eyebrow "QUATERNARY CARE · EST. 1998", H1 "Medicine at its / most human." (second line teal),
lead, [Book an OP visit] [Try the diet planner →], 4 count-up stats (25 years of care, 600+ specialists,
2.4M patients a year, 98.6% would recommend us).
Right: a rounded (40px) mint "stage" panel (radial white→#c3ebe6) with floating glass bubbles, a glass
tray/pedestal at the bottom, a small "Heart rate 72 bpm · SpO₂ 98% · BP 118/76" card top-left and a
"Dr. Elena Marquez · Cardiology · next slot 11:30 AM · ● Available" card along the bottom.
All objects are hand-built SVG with gradients (glossy, soft 3D look):
  - teal shield with a white 3D heart (the hero object)
  - stethoscope, teal 3D cross, pink-topped calendar, teal DNA helix, teal/white capsule, teal phone bubble
Animation sequence (NOT a loop, NOT timed — driven by scroll, and NO pinning/sticky hero, keep the
normal layout):
  a) On load: only the heart shield rises onto the tray and floats gently. Nothing else happens until
     the visitor scrolls.
  b) First scroll: the shield swells (scale 1.16) and bursts with a white/teal glow flash; the six objects
     shoot OUT OF THE HEART one after another (staggered ~40 ms, springy overshoot) and float in the air.
  c) Scrolling further: the 6 service tiles below tilt up into place (3D rotateX/rotateY → flat) and each
     object flies down along the page, shrinks and lands inside its tile as that tile's icon; a teal ✓
     badge pops on. Mapping: calendar→Book Appointment, phone bubble→Online Consultation, DNA→Lab
     Reports, capsule→Pharmacy Delivery, stethoscope→Symptom Guide, cross (red ! badge)→24×7 Emergency.
  d) Scrolling back up reverses c); back at the top the shield returns.
  Implementation notes: compute each object's flight with getBoundingClientRect on scroll (rAF throttled),
  clone each object's SVG into its tile icon so the landed icon is identical, set `.hero{overflow:visible}`
  so flying objects are never clipped, recompute on resize/load/fonts.ready, and make sure only ONE
  scroll handler drives the animation.
Service tiles: 6 frosted-glass cards in a staggered row (even ones lower), icon chip + bold 2-line title
+ short subtitle, mouse-move 3D tilt on hover, a teal ECG line draws underneath. Then a 5-card live
status strip that ticks every 3 s: ER wait time, general beds free, ICU beds free, doctors on duty,
blood bank (O−) units, each with a progress bar.

=====================================================================
5. "A JOURNEY THROUGH YOU" — ILLUSTRATED BODY SCROLL STORY
=====================================================================
A tall section (8 chapters × ~72vh) with a sticky full-screen stage. Left: big outlined chapter numeral
(01–08), eyebrow, chapter number "01 / 08", H2 with teal accent, paragraph, frosted stat chip, link
button, and a clickable 8-segment progress rail. Right: an SVG human figure with a "camera" that zooms
and pans smoothly (lerped) to each organ; the organ in focus glows and the others soften.
Figure style (reference: classic translucent anatomy illustration):
  - translucent skin-toned body with soft side shading and faint muscle contours, floor shadow
  - red arteries and blue veins: carotids/jugulars up the neck, subclavians across the shoulders and down
    both arms with small branches, aortic arch from the heart, descending aorta + vena cava, iliac/femoral
    vessels down both legs
  - cream ribcage (7 ribs each side), clavicles, sternum; pelvis and leg bones with knee joints
  - larynx and pink thyroid; textured mauve lungs that breathe; deep-red veined heart with atrium that
    beats; large liver with green gallbladder, pink stomach, yellow pancreas; bumpy large intestine framing
    a coiled small intestine (serpentine rows, no overlapping/lattice look); kidneys + ureters + bladder;
    pink brain in the head with sparks
  - in close-ups, ribs and central vessels fade so the focused organ reads clearly; the stage fades softly
    on its left edge so nothing runs under the text
Stage: light mint radial background, faint dotted grid, white halo, two slowly rotating orbit rings, a
gentle teal scan line sweeping down the body.
Chapters: 01 heart "It starts with a heartbeat." (58 min door-to-balloon, → Cardiology team) · 02 full body
"The whole of you, in one place." (600+ specialists, one record) · 03 brain "When minutes mean neurons."
(< 10 min stroke code) · 04 lungs "Every breath, supported." (22,000 breaths a day) · 05 gut "Gut feeling,
backed by science." (9 m digestive tract) · 06 kidneys "Quiet organs, serious care." (180 L filtered daily)
· 07 knees "Back on your feet, faster." (24 h to first steps) · 08 full body "Ready when you are."
(11 min OPD wait) with [Book an OP visit] [Where does it hurt?]. "Meet the … team" links go to
doctors.html?dept=…
Phone: figure fills the screen, text sits in a frosted card at the bottom; hide the numeral and stat chip.

=====================================================================
6. FEATURES
=====================================================================
A) OP BOOKING (book.html) — 5 steps with an animated progress bar and a sticky live summary panel:
   1 Department (13 option cards with icons) → 2 Doctor (cards with photo, title, experience, rating, fee)
   → 3 Date & time (next 14 days; doctor's working days only; Morning/Afternoon/Evening 15-min slots;
   ~38% pseudo-randomly booked, seeded by doctor+date so they're stable; past slots today disabled)
   → 4 Patient details (In-person/Video segmented control, name, 10-digit Indian mobile, age, gender,
   visit type, optional UHID, reason; inline validation) → 5 Review + payment (pay at hospital / online
   −5% / insurance) + consent checkbox.
   Fee rules: video −20%, follow-up within 7 days free, online −5%; summary fee counts up.
   Confirmation: animated check, boarding-pass style ticket (token number, UHID, doctor, department,
   date, time, room "Block B, Floor 2, OPD n", payment) with a QR-style code; [Add to calendar] (.ics
   download with a 2-hour reminder), [Print slip], [See your visit, step by step], [Book another].
   "My appointments" list saved in localStorage with Cancel.
B) DIET PLANNER (diet.html) — 8 condition cards with emoji: Type 2 Diabetes, Hypertension (DASH), Heart
   Disease, Kidney Disease (CKD 3–4), PCOS, Fatty Liver (NAFLD), Hypothyroidism, Obesity/Weight loss.
   Inputs: sex toggle, age/height/weight sliders with filled tracks, activity level, veg/non-veg toggle.
   Everything updates live and animates:
   - calorie target (Mifflin-St Jeor BMR × activity + condition adjustment; floor 1200 F / 1500 M) with
     BMR / maintenance / adjustment breakdown
   - BMI gauge with a springy needle (Asian cut-offs: <18.5, 23, 27.5)
   - water glasses filling (≈35 ml/kg; CKD shows a fluid limit instead)
   - macro donut + grams (CKD uses 0.7 g/kg protein; obesity ≥1.2 g/kg) + fibre target
   - per-condition daily limit bars (sodium, sugar, potassium, phosphorus, saturated fat, etc.)
   - plate model pie, key guidance, "Eat more of" / "Limit or avoid" chips, and a 6-meal Indian sample day
     (veg and non-veg versions) with per-meal kcal
   - disclaimer + [Book a dietitian consult] → book.html?doc=d16
C) SYMPTOM GUIDE (symptoms.html) — front/back body map with glowing hotspots (head, throat, chest,
   shoulders, upper/lower abdomen, arms, knees, feet; back: neck, upper back, lower back, flanks, calves)
   + "whole-body symptoms" button and a "Patient is a child" switch (routes to Paediatrics).
   Pick multiple symptoms → recommended speciality with an animated % match ring, reason text and two
   doctors with their next free slot + [Book] (→ book.html?doc=…). Red-flag symptoms (e.g. chest pain
   with sweating, stroke signs, vomiting blood) show a shaking red emergency banner with [Get an
   ambulance]. Note: "A guide, not a diagnosis."
D) YOUR VISIT (visit.html) — winding SVG road with 7 stops and a glowing traveller dot: Arrive & park (3),
   Check in at a kiosk (1), Vitals & triage (5), Relax in the lounge (11), Your consultation (15), Tests &
   pharmacy (10), Head home (2) = 47 min. Auto-plays (6 s per step, pause/play, prev/next, click any stop);
   each stop has text, a tip and a live dark-teal widget (valet spots ticking, kiosk QR with scan line,
   vitals counting up, lounge token board ticking toward your token, doctor card, live queues, phone
   notifications). Personalised from the latest saved booking. Scrolls sideways on phones.
E) DOCTORS — 16 doctors (below), search over name/speciality/conditions, chips per department, card:
   portrait photo (zoom on hover), "● next free slot" pill, rating, speciality, title, degrees,
   experience, languages, fee, [Book] → book.html?doc=…
F) PACKAGES — Essential ₹2,499, Executive ₹6,999 (featured, dark), Heart Check ₹8,999, Women’s Wellness
   ₹4,999, struck-through MRP, couple price ×1.8, 6 inclusions each, [Book this check] → toast.
G) OTHER — patient portal modal (any UHID, OTP 1234, shows sample reports); ambulance request modal with
   validation and a live ETA countdown + moving ambulance progress bar; scripted chat assistant "Aria"
   (typing dots, quick replies, keyword answers, routes to booking/diet pages); FAQ accordion (7 Qs);
   testimonials carousel with portraits (auto-advance, dots, arrows); health library (3 articles with
   photo covers); contact form validation; newsletter; toasts for demo actions.
H) "Care with a human face" (home) — 3-photo collage (doctor vaccinating an elderly woman, bedside
   conversation, held hands) + quote card “They remembered my name, my fears and my grandson’s cricket
   match.” — Dorothy, 71 · cardiac rehab; stats 1:4 nurse ratio, 92% know their care team by name,
   14 languages.

=====================================================================
7. CONTENT AND PEOPLE
=====================================================================
Departments: Cardiology, Neurosciences, Orthopaedics, Oncology, Paediatrics, Nephrology,
Gastroenterology, Women’s Health, Endocrinology, Pulmonology, Dermatology, General Medicine,
Clinical Nutrition.
Doctors (id, name, dept, fee): d1 Dr. Elena Marquez cardiology 1200 · d2 Dr. Omar Haddad cardiac surgery
1500 · d3 Dr. Meera Iyer neurology 1300 · d4 Dr. Arjun Shetty spine 1200 · d5 Dr. Rahul Kapoor joint
replacement 1200 · d6 Dr. Sofia Rossi sports medicine 1000 · d7 Dr. Daniel Tan oncology 1500 ·
d8 Dr. Amara Okafor paediatrics 900 · d9 Dr. Farhan Qureshi nephrology 1300 · d10 Dr. Grace Mensah
gastro 1100 · d11 Dr. Margaret Hughes obstetrics 1200 · d12 Dr. Kwame Asante endocrinology 1100 ·
d13 Dr. Lukas Weber pulmonology 1000 · d14 Dr. Nia Williams dermatology 900 · d15 Dr. Richard Collins
general medicine 800 (works all 7 days) · d16 Ms. Sarah Mitchell chief dietitian 700.
Each has title, degrees, years of experience, languages, rating, working days and session hours.
RULE: every name must match the ethnicity of the person in the photo (South Asian faces get Indian
names; others get fitting names, languages and degrees). Testimonials likewise: Maria L. (daughter of
a cardiac patient), Robert T. (knee replacement, 64), Aisha & Karan (parents of twins, photo of a
newborn's feet), Marco D. (diabetes programme, HbA1c 8.9 → 6.4).
Photos needed (Unsplash, stored locally): 16 doctor portraits (head-and-shoulders, cropped 600×480,
faces near the top), care scenes (vaccination, bedside, holding hands, BP check, consultation,
clinic), surgery/operating theatre, reception, lobby, healthy food ×2, ambulance, anatomical heart
and brain models, X-ray, lab, newborn feet, ward, and 4 testimonial portraits.
Copy tone: warm, specific, human; no "state-of-the-art/world-class" filler. All business numbers are
illustrative.

=====================================================================
8. QUALITY BAR AND PROCESS
=====================================================================
- Before finishing, test every page headlessly (Playwright, already installed) at 1440×900 and 390×844:
  zero console errors, zero broken images, no horizontal overflow, booking flow end-to-end, diet calc,
  body-map → booking hand-off, and the hero burst → float → fly-into-cards sequence at several scroll
  positions. Look at the screenshots yourself and fix anything that looks off.
- Commit on a feature branch with clear messages, push, open a PR, and merge to the Pages branch only
  when I confirm. Then give me the github.io URL for index and each page.
```

---

## Lessons from building the original (why the prompt is so specific)

These are the points that took several rounds to get right. The prompt above already covers each one.

| What went wrong at first | Final, approved behaviour |
|---|---|
| Single long page | 10 separate pages with shared header and footer |
| "Your visit" hidden at the bottom of the booking page | Its own page, linked in the nav and from the booking confirmation |
| Hero animation looped on a timer | Driven only by scroll: burst on first scroll, float, then fly into the cards |
| Hero pinned or sticky while scrolling (felt broken) | Normal layout, no pinning |
| Objects vanished mid-flight | `.hero{overflow:visible}` and one single scroll handler |
| Two animation handlers left in the code fought each other | Replace the old block completely when rewriting |
| Journey changed to full-screen photos (felt odd) | Illustrated anatomical body with flesh, vessels and ribs |
| Doctor names didn't match their photos | Names, languages and degrees chosen to fit each face |
| Gold/navy serif look | Mint/teal Poppins look from the reference video |
| Small intestine drawn as an overlapping lattice | Serpentine rows with small amplitude |
| Emergency number wrapped onto two lines | `white-space:nowrap` with a `clamp()` font size |
| Educational banner on every page | Removed; a short fictional note stays in the footer |
