# Builds favicons from assets/img/logo.webp: the logo on an ivory disc, transparent outside.
import os, sys
from PIL import Image, ImageDraw

ROOT = sys.argv[1]
logo = Image.open(os.path.join(ROOT, "assets", "img", "logo.webp")).convert("RGBA")
S = 1024
logo = logo.resize((S, S), Image.LANCZOS)
IVORY = (255, 249, 246, 255)

disc = Image.new("RGBA", (S, S), (0, 0, 0, 0))
ImageDraw.Draw(disc).ellipse((4, 4, S - 5, S - 5), fill=IVORY)
disc.alpha_composite(logo)

out = os.path.join(ROOT, "assets", "img")
disc.resize((32, 32), Image.LANCZOS).save(os.path.join(out, "favicon-32.png"))
disc.resize((192, 192), Image.LANCZOS).save(os.path.join(out, "icon-192.png"))
# Apple icons can't be transparent: full ivory square
apple = Image.new("RGBA", (S, S), IVORY)
apple.alpha_composite(logo)
apple.convert("RGB").resize((180, 180), Image.LANCZOS).save(os.path.join(out, "apple-touch-icon.png"))
disc.save(os.path.join(ROOT, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
print("done")
