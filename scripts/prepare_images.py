# Copies the original photos into assets/img with short English names,
# resized to web size only - colors and backgrounds are kept exactly as sent.
# Originals in images/ stay untouched.
import os, sys
from PIL import Image

ROOT = sys.argv[1]
SRC = os.path.join(ROOT, "images")
OUT = os.path.join(ROOT, "assets", "img", "products")
os.makedirs(OUT, exist_ok=True)

files = sorted(f for f in os.listdir(SRC) if not f.endswith(".zip"))
names = [
 "helix-marquise", "helix-tennis", "hoop-marquise", "lotus-peer-model",
 "lotus-peer", "lotus-drop-model", "lotus-drop", "marquise-drop",
 "rainbow-drops", "oval-gold", "oval-silver", "thread-pink", "thread-gold",
 "thread-black", "thread-marquise", "tennis-graduated", "pear-tennis-bust",
 "tennis-classic", "tennis-spikes", "tennis-spikes-model", "collier-square",
 "collier-marquise-center", "collier-mini-ovals", "collier-marquises",
 "rigid-rectangle", "rigid-pear",
]
assert len(files) == len(names), (len(files), len(names))
for f, n in zip(files, names):
    im = Image.open(os.path.join(SRC, f)).convert("RGB")
    size = 1800 if n == "pear-tennis-bust" else 1100
    im.thumbnail((size, size), Image.LANCZOS)
    im.save(os.path.join(OUT, n + ".webp"), "WEBP", quality=84)
    print(n, im.size)
