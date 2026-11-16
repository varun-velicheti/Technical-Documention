#!/usr/bin/env python3
"""Inline style.css, body.html and app.js into ../index.html (single self-contained file)."""
from pathlib import Path
here = Path(__file__).parent
read = lambda *names: "\n".join((here / n).read_text() for n in names)
css, body, js = read("style.css", "features.css"), read("body.html"), read("app.js", "features.js")
fav = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%230a2533'/%3E%3Cpath d='M32 16v32M16 32h32' stroke='%23d9b874' stroke-width='6' stroke-linecap='round'/%3E%3C/svg%3E"
html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Aurelia Hospital</title>
<meta name="description" content="Aurelia Hospital & Research: a fictional premium hospital website built for education, with OP booking and a condition-based diet planner.">
<meta name="theme-color" content="#0a2533">
<link rel="icon" href="{fav}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
{body}
<script>
{js}
</script>
</body>
</html>
"""
(here.parent / "index.html").write_text(html)
print("wrote", here.parent / "index.html", len(html), "bytes")
