# Cleans the logo: removes the fake checker background and the corner watermark
# (both are grey/white, the logo is rose gold), and saves a transparent logo.
import os, sys
from PIL import Image

ROOT = sys.argv[1]
src = os.path.join(ROOT, "assets", "img", "src", "logo-original.jpeg")
im = Image.open(src).convert("RGB")
BG = 245.0
out = []
for r, g, b in im.getdata():
    # How "rose gold" a pixel is: warm pixels have red well above blue
    a = min(1.0, max(0.0, (r - b - 14) / 46))
    if a <= 0:
        out.append((0, 0, 0, 0)); continue
    # Un-blend from the light background so soft edges keep the right color
    c = [min(255, max(0, int((v - (1 - a) * BG) / a))) for v in (r, g, b)]
    out.append((c[0], c[1], c[2], int(a * 255)))
res = Image.new("RGBA", im.size); res.putdata(out)
bbox = res.getchannel("A").point(lambda v: 255 if v > 40 else 0).getbbox()
res = res.crop(bbox)
side = max(res.size)
sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
sq.paste(res, ((side - res.width) // 2, (side - res.height) // 2))
sq = sq.resize((480, 480), Image.LANCZOS)
sq.save(os.path.join(ROOT, "assets", "img", "logo.webp"), "WEBP", quality=92)
print("bbox", bbox)
