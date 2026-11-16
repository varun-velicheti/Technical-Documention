# Aurelia Hospital — premium hospital website (educational demo)

A single-page, fully interactive website for a **fictional** hospital. Open `index.html` in any browser; it is one self-contained file (internet is only needed for the fonts).

## Features
- **OP booking tool**: 5-step wizard (department → doctor → date & live slots → patient details → review & pay), with a live summary and fee rules (video −20%, free follow-up, online −5%). Confirmation gives a token number, OP number, QR slip, print and an *Add to calendar* (.ics) download. "My appointments" are saved in the browser and can be cancelled.
- **Animated diet planner** for 8 conditions: Type 2 diabetes, hypertension (DASH), heart disease, CKD, PCOS, fatty liver, hypothyroidism and obesity. It calculates BMR (Mifflin-St Jeor), maintenance and target calories, a BMI gauge (Asian cut-offs), a macro donut, water glasses, daily limit bars, a plate model, foods to eat/avoid, tips and a veg/non-veg Indian meal plan.
- Find-a-doctor search with speciality filters and next-available slot
- Centres of excellence, technology, live hospital status (ER wait, beds, ICU, blood bank)
- Health-check packages (individual/couple), emergency band with an ambulance request and live ETA tracker
- Patient portal demo (any UHID, OTP `1234`), patient services, testimonials carousel, health library, FAQ, contact form
- Care-assistant chatbot, dark mode, sticky glass nav, scroll reveals, fully responsive, reduced-motion support

## Edit
Source lives in `_src/` (`style.css`, `body.html`, `app.js`). After editing, run `python3 _src/build.py` to regenerate `index.html`.

All names, numbers, doctors and addresses are fictional. Diet output is educational, not medical advice.
