#!/usr/bin/env python3
"""Bundles the whole website into ONE self-contained HTML file.

All seven pages become views inside a single document. Menu links switch views
instantly (index.html -> #home, menu.html -> #menu, contact.html#reserve -> #reserve).
CSS, JavaScript, the logo and local photos are inlined. Online photos, fonts and
the smooth-scroll library still load from the internet.

Run after build.py:  python3 _src/singlefile.py   ->  ../first-sip-website.html
"""
import base64, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
out = root.parent / "first-sip-website.html"
PAGES = [("index", "home"), ("menu", "menu"), ("story", "story"), ("shop", "shop"),
         ("locations", "locations"), ("franchise", "franchise"), ("contact", "contact")]
VIEW = dict(PAGES)

def b64(path, mime):
    return f"data:{mime};base64," + base64.b64encode((root / path).read_bytes()).decode()

logo, fav = b64("assets/img/logo.svg", "image/svg+xml"), b64("assets/img/favicon.svg", "image/svg+xml")
css = (root / "assets/css/style.css").read_text().replace('url("../img/logo.svg")', f'url("{logo}")')
css += """
/* single-file views */
[data-view][hidden] { display: none !important; }
main.view-in { animation: view-in .45s cubic-bezier(.22, 1, .36, 1) both; }
@keyframes view-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { main.view-in { animation: none; } }
"""

def js(name):
    code = (root / f"assets/js/{name}.js").read_text().replace("assets/img/logo.svg", logo)
    return "<script>\n" + code.replace("</script>", "<\\/script>") + "\n</script>"

def relink(html):
    # page.html#anchor -> #anchor ; page.html -> #view
    html = re.sub(r'href="([a-z]+)\.html#([\w-]+)"', lambda m: f'href="#{m.group(2)}"', html)
    return re.sub(r'href="([a-z]+)\.html"', lambda m: f'href="#{VIEW.get(m.group(1), m.group(1))}"', html)

views, titles = [], {}
for page, view in PAGES:
    h = (root / f"{page}.html").read_text()
    titles[view] = re.search(r"<title>(.*?)</title>", h, re.S).group(1)
    body = h[h.index('<main id="main">') + len('<main id="main">'):h.index("</main>")]
    views.append(f'<div data-view="{view}"{" hidden" if view != "home" else ""}>{body}</div>')

base = (root / "index.html").read_text()
start, end = base.index('<main id="main">'), base.index("</main>") + len("</main>")
router = """<script>
(function () {
  var TITLES = %s;
  var views = [].slice.call(document.querySelectorAll("[data-view]"));
  var names = views.map(function (v) { return v.getAttribute("data-view"); });
  var main = document.getElementById("main"), first = true;
  function show(hash) {
    var h = (hash || "").replace(/^#/, "") || "home", view = names.indexOf(h) >= 0 ? h : null, target = null;
    if (!view) { var el = document.getElementById(h); var v = el && el.closest("[data-view]"); if (v) { view = v.getAttribute("data-view"); target = el; } }
    if (!view) view = "home";
    views.forEach(function (v) { v.hidden = v.getAttribute("data-view") !== view; });
    document.title = TITLES[view] || document.title;
    document.body.setAttribute("data-page", view === "home" ? "index" : view);
    [].forEach.call(document.querySelectorAll(".nav a, .mobile-menu nav a"), function (a) {
      if (a.getAttribute("href") === "#" + view) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (h === "reserve") { var rt = document.querySelector('[data-target="reserve"]'); if (rt && !rt.classList.contains("is-active")) rt.click(); }
    if (document.body.classList.contains("menu-open")) { var b = document.querySelector("[data-burger]"); if (b) b.click(); }
    if (!first) { main.classList.remove("view-in"); void main.offsetWidth; main.classList.add("view-in"); }
    requestAnimationFrame(function () {
      window.dispatchEvent(new Event("resize"));
      if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 90);
      else if (!first) window.scrollTo(0, 0);
      window.dispatchEvent(new Event("scroll"));
      first = false;
    });
  }
  window.addEventListener("hashchange", function () { show(location.hash); });
  show(location.hash);
})();
</script>""" % repr(titles).replace("'", '"')

page = base[:start] + '<main id="main">' + "".join(views) + "</main>\n" + router + base[end:]
page = re.sub(r'<link rel="stylesheet" href="assets/css/style\.css(\?v=\d+)?">', lambda m: "<style>\n" + css + "\n</style>", page)
page = re.sub(r'<script src="assets/js/[a-z]+\.js(?:\?v=\d+)?" defer></script>\n?', "", page)
page = page.replace("</body>", js("main") + "\n" + js("brew") + "\n" + js("calc") + "\n</body>")
page = page.replace('href="assets/img/favicon.svg"', f'href="{fav}"').replace("assets/img/logo.svg", logo)
for img in sorted((root / "assets/img").glob("*.jpg")):
    page = page.replace(f"assets/img/{img.name}", b64(f"assets/img/{img.name}", "image/jpeg"))
page = relink(page)
# Prefetch hints point at separate pages that don't exist in the single file.
page = re.sub(r'<script type="speculationrules">.*?</script>\n?', "", page, flags=re.S)
assert "assets/" not in page and not re.search(r'href="[a-z]+\.html', page)
out.write_text(page)
print(f"wrote {out} ({len(page) // 1024} KB)")
