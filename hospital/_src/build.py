#!/usr/bin/env python3
"""Build the multi-page Aurelia Hospital site.

Sources (this folder):  style.css, features.css, pages.css, body.html, app.js, features.js
Output (parent folder): *.html pages + assets/site.css + assets/site.js
"""
import re
from pathlib import Path

here = Path(__file__).parent
out = here.parent
read = lambda *names: "\n".join((here / n).read_text() for n in names)

(out / "assets").mkdir(exist_ok=True)
(out / "assets" / "site.css").write_text(read("style.css", "features.css", "pages.css"))
(out / "assets" / "site.js").write_text(read("app.js", "features.js"))

body = read("body.html")
prefix, rest = body.split("<main>", 1)
main, suffix = rest.split("</main>", 1)

# split <main> into named chunks at <!-- NAME --> markers
parts = re.split(r"<!-- ([A-Z ]+) -->\n", main)
CH = {parts[i]: parts[i + 1] for i in range(1, len(parts), 2)}

LINKS = {"#home": "index.html", "#journey": "index.html#journey", "#centres": "specialities.html", "#bodymap": "symptoms.html",
         "#doctors": "doctors.html", "#book": "book.html", "#visit": "book.html#visit", "#diet": "diet.html", "#packages": "checkups.html",
         "#services": "patients.html", "#faq": "patients.html#faq", "#emergency": "contact.html#emergency", "#contact": "contact.html"}
def relink(html):
    return re.sub(r'href="(#[a-z]+)"', lambda m: f'href="{LINKS.get(m.group(1), m.group(1))}"', html)

NAV = [("specialities.html", "Specialities"), ("doctors.html", "Doctors"), ("symptoms.html", "Symptoms"), ("diet.html", "Diet planner"),
       ("checkups.html", "Checkups"), ("patients.html", "Patients"), ("contact.html", "Contact")]
MOBILE = [("index.html", "Home"), ("book.html", "Book OP")] + NAV

def strip_head(chunk):
    """Remove a section's first .sec-head and return (chunk, eyebrow, title, lead, extra)."""
    m = re.search(r'\n    <div class="sec-head">\n(.*?)\n    </div>\n', chunk, re.S)
    if not m:
        return chunk, None, None, None, ""
    head = m.group(1)
    eyebrow = re.search(r'<span class="eyebrow[^"]*">(.*?)</span>', head).group(1)
    title = re.search(r'<h2[^>]*>(.*?)</h2>', head, re.S).group(1)
    lead = re.search(r'<p class="lead[^"]*">(.*?)</p>', head, re.S)
    extra = re.search(r'(<div class="seg[^"]*".*?</div>)\s*$', head, re.S)
    return chunk.replace(m.group(0), "\n", 1), eyebrow, title, lead.group(1) if lead else "", extra.group(1).replace(" rv d2", "") if extra else ""

EXPLORE = """<section id="explore">
  <div class="wrap">
    <div class="sec-head">
      <div><span class="eyebrow rv">Start here</span><h2 class="rv d1">Everything you need, <em>one tap away.</em></h2></div>
      <p class="lead rv d2">Book a visit, find the right specialist, plan your diet or prepare for your day at the hospital.</p>
    </div>
    <div class="centres">
""" + "\n".join(f"""      <a href="{h}" class="centre rv d{i % 4}"><span class="ci"><svg><use href="#i-{ic}"/></svg></span><span class="arrow"><svg><use href="#i-arrow"/></svg></span><h3>{t}</h3><p>{p}</p></a>"""
    for i, (h, ic, t, p) in enumerate([
        ("book.html", "cal", "Book an OP visit", "Live slots, instant token number and a walkthrough of your visit."),
        ("symptoms.html", "search", "Symptom guide", "Tap where it hurts and we’ll suggest the right speciality and doctor."),
        ("doctors.html", "heart", "Find a doctor", "Search 600+ specialists by name, speciality or condition."),
        ("diet.html", "pill", "Diet planner", "Calories, macros and an Indian meal plan for 8 common conditions."),
        ("checkups.html", "shield", "Health checkups", "Preventive packages with same-day reports and a doctor consult."),
        ("specialities.html", "hosp", "Specialities", "42 centres of excellence and the technology behind them."),
        ("patients.html", "file", "Patient services", "Reports, video consults, pharmacy delivery, insurance and FAQs."),
        ("contact.html", "phone", "Contact & emergency", "24×7 help desk, ambulance requests and directions.")])) + """
    </div>
  </div>
</section>
"""

CTA = """<section class="cta-wrap">
  <div class="wrap">
    <div class="cta-band rv">
      <div><span class="eyebrow">Need help choosing?</span><h2>Start with the right doctor, <em>first time.</em></h2></div>
      <div class="hero-actions" style="margin:0"><a href="book.html" class="btn btn-gold">Book an OP visit</a><a href="symptoms.html" class="btn btn-ghost">Try the symptom guide</a></div>
    </div>
  </div>
</section>
"""

# page file, nav label for <title>, chunks, strip first head?, add CTA?
PAGES = [
    ("index.html", None, ["HERO", "JOURNEY", "@EXPLORE", "TESTIMONIALS", "EMERGENCY"], False, False),
    ("specialities.html", "Specialities", ["CENTRES", "TECH"], True, True),
    ("doctors.html", "Find a Doctor", ["DOCTORS"], True, True),
    ("symptoms.html", "Symptom Guide", ["BODY MAP"], True, True),
    ("book.html", "Book an OP Visit", ["BOOKING", "VISIT"], True, False),
    ("diet.html", "Diet Planner", ["DIET"], True, True),
    ("checkups.html", "Health Checkups", ["PACKAGES"], True, True),
    ("patients.html", "Patient Services", ["SERVICES", "LIBRARY", "FAQ"], True, True),
    ("contact.html", "Contact & Emergency", ["CONTACT", "EMERGENCY"], False, False),
]
CONTACT_HERO = ("Get in touch", "Talk to a human, <em>any time.</em>", "Reach our help desk, request an ambulance or plan your visit. Someone is always here.", "")

ACT = ' class="active"'
fav = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%230a2533'/%3E%3Cpath d='M32 16v32M16 32h32' stroke='%23d9b874' stroke-width='6' stroke-linecap='round'/%3E%3C/svg%3E"

for file, label, chunks, strip, cta in PAGES:
    html_chunks, hero = [], None
    for k, name in enumerate(chunks):
        c = EXPLORE if name == "@EXPLORE" else CH[name]
        if k == 0 and strip:
            c, eb, title, lead, extra = strip_head(c)
            hero = (eb, title, lead, extra)
        html_chunks.append(c)
    if file == "contact.html":
        hero = CONTACT_HERO
        html_chunks[0] = html_chunks[0].replace("We’re here, <em>always.</em>", "Plan your <em>visit.</em>")
    content = "\n".join(html_chunks)
    if cta:
        content += CTA
    if hero:
        eb, title, lead, extra = hero
        content = f"""<section class="page-hero">
  <svg class="ph-ecg" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70h260l14-20 14 20h40l12 10 16-70 18 120 16-60h60l14-14 14 14h260l14-20 14 20h40l12 10 16-70 18 120 16-60h60l14-14 14 14h300"/></svg>
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><b>{label}</b></nav>
    <span class="eyebrow">{eb}</span>
    <h1>{title}</h1>
    {f'<p class="lead">{lead}</p>' if lead else ''}
    {f'<div class="ph-extra">{extra}</div>' if extra else ''}
  </div>
</section>
""" + content

    pre = prefix
    nav_html = "\n".join(f'      <a href="{h}"{ACT if h == file else ""}>{t}</a>' for h, t in NAV)
    pre = re.sub(r'(<nav class="nav-links" aria-label="Main">\n).*?(\n    </nav>)', lambda m: m.group(1) + nav_html + m.group(2), pre, flags=re.S)
    mob = "".join(f'<a href="{h}"{ACT if h == file else ""}>{t}</a>' for h, t in MOBILE)
    pre = re.sub(r'(<button class="icon-btn close" id="menuClose" aria-label="Close menu">✕</button>\n  ).*?(\n</div>)', lambda m: m.group(1) + mob + m.group(2), pre, flags=re.S)

    title = "Aurelia Hospital & Research" if not label else f"{label} | Aurelia Hospital"
    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="Aurelia Hospital & Research: a fictional premium hospital website built for education.">
<meta name="theme-color" content="#0a2533">
<link rel="icon" href="{fav}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css">
</head>
<body class="page-{file[:-5]}">
{relink(pre)}<main>
{relink(content)}</main>{relink(suffix)}
<script src="assets/site.js"></script>
</body>
</html>
"""
    (out / file).write_text(page)
    print(f"wrote {file:20s} {len(page):>7,} bytes")
