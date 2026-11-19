#!/usr/bin/env python3
"""Bundle the built hospital site into ONE self-contained HTML file.

Run build.py first. Output: ../aurelia-hospital-single.html
Each page is stored once; CSS, JS and photos are embedded once and injected
into a full-screen iframe when a page is shown, so pages keep separate
contexts (no duplicate IDs, timers or listeners) and links keep working.
"""
import base64, json, re
from pathlib import Path

here = Path(__file__).parent
site = here.parent
PAGES = ["index", "specialities", "doctors", "symptoms", "book", "visit", "diet", "checkups", "patients", "contact"]

css = (site / "assets/site.css").read_text()
js = (site / "assets/site.js").read_text()
pages = {}
for p in PAGES:
    h = (site / f"{p}.html").read_text()
    h = h.replace('<link rel="stylesheet" href="assets/site.css">', "").replace('<script src="assets/site.js"></script>', "")
    pages[p] = h

# patch JS so in-file navigation and query strings work inside the iframe
js = js.replace("new URLSearchParams(location.search)", "new URLSearchParams(window.__QS || location.search)")
js, n = re.subn(r"location\.href = ([^;]+);", r"window.__nav(\1);", js)
assert n == 4, n
assert "</script" not in js.lower()

# embed only the photos the site actually uses
text = css + js + "".join(pages.values())
imgs = {}
for f in sorted((site / "assets/img").glob("*.jpg")):
    stem = f.stem
    if stem.startswith("doc-") or stem in text:
        imgs[f.name] = "data:image/jpeg;base64," + base64.b64encode(f.read_bytes()).decode()

def sub_imgs(s):
    s = re.sub(r"assets/img/([\w.-]+\.jpg)", lambda m: imgs.get(m.group(1), m.group(0)), s)
    return re.sub(r"url\(img/([\w.-]+\.jpg)\)", lambda m: f"url({imgs[m.group(1)]})", s)

css = sub_imgs(css)
pages = {k: sub_imgs(v) for k, v in pages.items()}

SHIM = r"""(function(){var M=parent.__IMG;
function fix(el){if(!el||el.nodeType!==1)return;
 if(el.tagName==='IMG'){var s=el.getAttribute('src');if(s&&s.indexOf('assets/img/')>-1){var k=s.split('assets/img/')[1];if(M[k])el.setAttribute('src',M[k]);}}
 var st=el.getAttribute('style');if(st&&st.indexOf('assets/img/')>-1)el.setAttribute('style',st.replace(/assets\/img\/([\w.-]+\.jpg)/g,function(a,k){return M[k]||a;}));}
function walk(n){if(n.nodeType!==1)return;fix(n);n.querySelectorAll('img,[style]').forEach(fix);}
new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='childList')m.addedNodes.forEach(walk);else fix(m.target);});})
 .observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
window.__nav=function(u){parent.__nav(String(u));};})();"""

def j(o):  # JSON safe inside <script>
    return json.dumps(o, ensure_ascii=False).replace("</", "<\\/")

fav = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23155358'/%3E%3Cpath d='M32 16v32M16 32h32' stroke='%23ffffff' stroke-width='6' stroke-linecap='round'/%3E%3C/svg%3E"
out = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Aurelia Hospital & Research</title>
<meta name="theme-color" content="#155358">
<link rel="icon" href="{fav}">
<style>html,body{{margin:0;height:100%;background:#eaf6f5;overflow:hidden}}#view{{position:fixed;inset:0;width:100%;height:100%;border:0;display:block}}</style>
</head>
<body>
<iframe id="view" title="Aurelia Hospital"></iframe>
<script>
window.__IMG = {j(imgs)};
var CSS = {j(css)};
var JS = {j(js)};
var SHIM = {j(SHIM)};
var PAGES = {j(pages)};
var view = document.getElementById("view"), current = "";
function parse(u) {{
  u = String(u || "").replace(/^#/, "");
  var m = u.match(/^(?:\\.\\/)?([a-z]+)(?:\\.html)?(\\?[^#]*)?(?:#(.*))?$/);
  if (!m || !PAGES[m[1]]) return {{ page: "index", qs: "", hash: "" }};
  return {{ page: m[1], qs: m[2] || "", hash: m[3] || "" }};
}}
function render(r) {{
  var key = r.page + r.qs;
  var html = PAGES[r.page]
    .replace("</head>", function () {{ return "<style>" + CSS + "</style></head>"; }})
    .replace("</body>", function () {{ return "<scr" + "ipt>window.__QS=" + JSON.stringify(r.qs) + ";" + SHIM + "</scr" + "ipt><scr" + "ipt>" + JS + "</scr" + "ipt></body>"; }});
  view.onload = function () {{
    var d = view.contentDocument;
    document.title = d.title;
    d.addEventListener("click", function (e) {{
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      var h = a.getAttribute("href");
      if (/^(?:\\.\\/)?[a-z]+\\.html/.test(h)) {{ e.preventDefault(); window.__nav(h); }}
    }}, true);
    if (r.hash) setTimeout(function () {{ var t = d.getElementById(r.hash); if (t) t.scrollIntoView({{ behavior: "smooth" }}); }}, 300);
  }};
  current = key;
  view.srcdoc = html;
}}
window.__nav = function (u) {{
  var r = parse(u);
  var h = "#" + r.page + r.qs + (r.hash ? "#" + r.hash : "");
  if (r.page + r.qs === current) {{ if (r.hash) {{ var t = view.contentDocument.getElementById(r.hash); if (t) t.scrollIntoView({{ behavior: "smooth" }}); }} return; }}
  if (location.hash !== h) history.pushState(null, "", h);
  render(r);
}};
addEventListener("popstate", function () {{ render(parse(location.hash)); }});
render(parse(location.hash));
</script>
</body>
</html>
"""
dest = site / "aurelia-hospital-single.html"
dest.write_text(out)
print(f"wrote {dest.name}: {len(out.encode())/1e6:.2f} MB, {len(imgs)} photos embedded")
