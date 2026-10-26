#!/usr/bin/env python3
"""Writes self-contained copies of every page (CSS, JS and logo inlined) to ../first-sip-html/.
Run after build.py:  python3 _src/standalone.py"""
import base64, pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
out = root.parent / "first-sip-html"; out.mkdir(exist_ok=True)
b64 = lambda f: "data:image/svg+xml;base64," + base64.b64encode((root / f).read_bytes()).decode()
logo, fav = b64("assets/img/logo.svg"), b64("assets/img/favicon.svg")
css = (root / "assets/css/style.css").read_text().replace('url("../img/logo.svg")', f'url("{logo}")')
def js(name): return "<script>\n" + (root / f"assets/js/{name}.js").read_text().replace("assets/img/logo.svg", logo).replace("</script>", "<\\/script>") + "\n</script>"
for p in sorted(root.glob("*.html")):
    h = p.read_text()
    h = h.replace('<link rel="stylesheet" href="assets/css/style.css">', "<style>\n" + css + "\n</style>")
    h = re.sub(r'<script src="assets/js/([a-z]+)\.js" defer></script>', lambda m: js(m.group(1)), h)
    h = h.replace('href="assets/img/favicon.svg"', f'href="{fav}"').replace("assets/img/logo.svg", logo)
    assert "assets/" not in h, p
    (out / p.name).write_text(h)
    print("standalone", p.name, len(h) // 1024, "KB")
