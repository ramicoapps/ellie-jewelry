# Builds favicons from assets/img/logo.webp: round crop with a transparent outside.
import os, sys
from PIL import Image, ImageDraw

ROOT = sys.argv[1]
logo = Image.open(os.path.join(ROOT, "assets", "img", "logo.webp")).convert("RGBA")
w, h = logo.size
m = int(w * 0.025)                      # trim to just outside the copper ring
logo = logo.crop((m, m, w - m, h - m))
S = 1024
logo = logo.resize((S, S), Image.LANCZOS)
mask = Image.new("L", (S, S), 0)
ImageDraw.Draw(mask).ellipse((0, 0, S - 1, S - 1), fill=255)
round_logo = Image.new("RGBA", (S, S), (0, 0, 0, 0))
round_logo.paste(logo, (0, 0), mask)

out = os.path.join(ROOT, "assets", "img")
round_logo.resize((32, 32), Image.LANCZOS).save(os.path.join(out, "favicon-32.png"))
round_logo.resize((192, 192), Image.LANCZOS).save(os.path.join(out, "icon-192.png"))
# Apple icons can't be transparent: put the round logo on the site's cream color
apple = Image.new("RGBA", (S, S), (247, 242, 236, 255))
apple.alpha_composite(round_logo)
apple.convert("RGB").resize((180, 180), Image.LANCZOS).save(os.path.join(out, "apple-touch-icon.png"))
round_logo.save(os.path.join(ROOT, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
print("done")
