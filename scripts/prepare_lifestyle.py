# Web copies of the lifestyle / model photos (resized only, colors untouched).
import os, sys
from PIL import Image
ROOT = sys.argv[1]
SRC = os.path.join(ROOT, "images")
OUT = os.path.join(ROOT, "assets", "img", "lifestyle")
os.makedirs(OUT, exist_ok=True)
FILES = {
    "באנר פתיחת שרשרת.png": ("hero-necklace", 1600),
    "באנר פתיחה עגילים.png": ("hero-earrings", 1600),
    "שופינג מהתמונה סט רוז גולד.png": ("shop-the-look", 1100),
    "באנר קולקציית הטניס.png": ("tennis-banner", 1916),
    "כרטיסיית מתנה שמספרת סיפור.png": ("gift", 1400),
    "איך לענוד בעמוד המוצר (תבנית לכל תכשיט).png": ("wear-oval", 1000),
}
for src, (name, size) in FILES.items():
    im = Image.open(os.path.join(SRC, src)).convert("RGB")
    im.thumbnail((size, size), Image.LANCZOS)
    im.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=84)
    print(name, im.size, os.path.getsize(os.path.join(OUT, name + ".webp")) // 1024, "KB")
