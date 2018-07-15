#!/usr/bin/env python3
# coding: utf-8

import base64
import os.path

output_fname = "TableSyntaxMaker.html"
html_fname = "main.html"
js_fname = "script.js"
css_fname = "style.css"

images = [
        './img/combineToRight.png',
        './img/combineToUnder.png',
        './img/uncombine.png',
        ]

out_text = ""
html = open(html_fname, 'r')
for line in html:
    if js_fname in line:
        with open(js_fname, 'r') as f:
            line = '<script type="text/javascript">\n'
            line += f.read()
            line += '</script>\n'
    elif css_fname in line:
        with open(css_fname, 'r') as f:
            line = '<style type="text/css">\n'
            line += f.read()
            line += '</style>\n'
    out_text += line
html.close()

# convert image
for img_path in images:
    _, ext = os.path.splitext(img_path)
    ext = ext.replace('.', '')
    with open(img_path, 'rb') as f:
        encoded = base64.b64encode(f.read())
        out_text = out_text.replace(img_path, f"data:image/{ext};base64,{encoded.decode('utf-8')}")

with open(output_fname, 'w') as f:
    f.write(out_text)
