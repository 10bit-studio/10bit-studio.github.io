from PIL import Image
import json
import base64
import io
from pathlib import Path

repo = Path(__file__).resolve().parents[1]
covers = repo / "covers"
thumbs = covers / "thumbs"
thumbs.mkdir(exist_ok=True)
manifest = {}

for src in sorted(covers.iterdir()):
    if not src.is_file() or src.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
        continue

    img = Image.open(src)
    if img.mode in ("RGBA", "LA"):
        bg = Image.new("RGB", img.size, (7, 7, 7))
        bg.paste(img, mask=img.split()[-1])
        img = bg
    elif img.mode != "RGB":
        img = img.convert("RGB")

    thumb = img.copy()
    thumb.thumbnail((840, 8400), Image.Resampling.LANCZOS)
    thumb_path = thumbs / f"{src.stem}.jpg"
    thumb.save(thumb_path, "JPEG", quality=84, optimize=True, subsampling=0)

    hero_dir = covers / "hero"
    hero_dir.mkdir(exist_ok=True)
    hero = img.copy()
    hero.thumbnail((1440, 14400), Image.Resampling.LANCZOS)
    hero_path = hero_dir / f"{src.stem}.jpg"
    hero.save(hero_path, "JPEG", quality=90, optimize=True, subsampling=0)

    lq = thumb.copy()
    lq.thumbnail((24, 240), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    lq.save(buf, "JPEG", quality=40, optimize=True)
    lqip = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()

    manifest[src.name] = {
        "w": thumb.width,
        "h": thumb.height,
        "thumb": f"thumbs/{src.stem}.jpg",
        "hero": f"hero/{src.stem}.jpg",
        "lqip": lqip,
    }

manifest_path = repo / "assets" / "covers-manifest.json"
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False), encoding="utf-8")

total_kb = sum(f.stat().st_size for f in thumbs.glob("*.jpg")) // 1024
print(f"thumbs: {len(manifest)}, total: {total_kb} KB")
