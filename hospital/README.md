# Aurelia Hospital — premium hospital website (educational demo)

A multi-page, fully interactive website for a **fictional** hospital. Open `index.html` in any browser (internet is only needed for the fonts).

| Page | What's on it |
|---|---|
| `index.html` | Hero with beating heart, live status, journey-through-the-body scroll story, quick links, patient stories, emergency |
| `specialities.html` | Centres of excellence and technology |
| `doctors.html` | Doctor finder (supports `?dept=` and `?q=`) |
| `symptoms.html` | Body-map symptom guide |
| `book.html` | OP booking wizard (supports `?doc=` and `?dept=`) and the visit walkthrough |
| `diet.html` | Condition-based diet planner |
| `checkups.html` | Health-check packages |
| `patients.html` | Patient services, health library, FAQ |
| `contact.html` | Contact form, visiting info, emergency and ambulance |

## Features
- **Journey through the body**: a pinned, full-screen photographic scroll story. The camera zooms through real photos of the heart, brain, lungs, skeleton, cancer cells, MRI scans and a surgical team to a closing call to action, with a medical viewfinder overlay and a link to the right team for each chapter.
- **Body-map symptom guide**: tap where it hurts (front or back view), pick symptoms, and get a recommended speciality with a match score, doctors with their next free slot, one-click booking, red-flag emergency warnings and a child mode that routes to paediatrics.
- **Your visit, step by step**: an animated road from parking to heading home, with a traveller moving between 7 stops, live widgets (valet spots, kiosk QR scan, vitals, a ticking token board, live queues) and personalisation from your latest booking.
- **OP booking tool**: 5-step wizard (department → doctor → date & live slots → patient details → review & pay), with a live summary and fee rules (video −20%, free follow-up, online −5%). Confirmation gives a token number, OP number, QR slip, print and an *Add to calendar* (.ics) download. "My appointments" are saved in the browser and can be cancelled.
- **Animated diet planner** for 8 conditions: Type 2 diabetes, hypertension (DASH), heart disease, CKD, PCOS, fatty liver, hypothyroidism and obesity. It calculates BMR (Mifflin-St Jeor), maintenance and target calories, a BMI gauge (Asian cut-offs), a macro donut, water glasses, daily limit bars, a plate model, foods to eat/avoid, tips and a veg/non-veg Indian meal plan.
- Find-a-doctor search with speciality filters and next-available slot
- Centres of excellence, technology, live hospital status (ER wait, beds, ICU, blood bank)
- Health-check packages (individual/couple), emergency band with an ambulance request and live ETA tracker
- Patient portal demo (any UHID, OTP `1234`), patient services, testimonials carousel, health library, FAQ, contact form
- Care-assistant chatbot, dark mode, sticky glass nav, scroll reveals, fully responsive, reduced-motion support

## Edit
Source lives in `_src/`: content sections in `body.html` (split into pages by `build.py`), styles in `style.css`, `features.css` and `pages.css`, and scripts in `app.js` and `features.js`. After editing, run `python3 _src/build.py` to regenerate the pages and `assets/site.css` and `assets/site.js`.

Photos are from [Unsplash](https://unsplash.com) (free to use under the Unsplash License) and are stored in `assets/img/`. The people pictured are models, not the fictional staff named on the site.

All names, numbers, doctors and addresses are fictional. Diet output is educational, not medical advice.
