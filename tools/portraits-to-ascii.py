"""Turn photographs into the ASCII portraits the about card cycles through.

Run it with the folder holding the originals:

    python tools/portraits-to-ascii.py "D:/CODE/portfolio-website/photos"

Two things come out of each photo and both land in the repo: the ASCII, written into
src/content/ascii-portraits.ts, and a WebP of the same crop WITH its background, which is
what the card shows on hover. The originals do not land in the repo - they are 7MB of
phone JPEGs and nothing is served from them.

Why the background is removed for the ASCII and kept for the photo: a portrait at 100
characters across has no room to spend on a room. Measured on these five, a busy
background does not read as a background at that size, it reads as noise over the face.
Taking it out is what made the difference between a shape and a person. The hover is the
opposite case - it is a real photograph at real resolution, and a cut-out person floating
on paper there would look like a mistake.

The cut-out is rough on purpose. One character covers about 20px of the source, so an
edge error smaller than that cannot be seen, and this is a rare place where a model's
sloppy mask is genuinely good enough.

The crop boxes are per photo and were read off a percentage grid laid over each one; they
frame head and shoulders, because a face that fills half the frame is the only thing a
100-column grid can resolve. Ilham moved #2 to #4 left by hand after seeing the first
pass - they sat too far right.

Needs: pillow, opencv-python-headless, numpy, rembg, onnxruntime. First run downloads
rembg's 176MB u2net model to ~/.rembg.
"""

import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

# 100 columns is the measured compromise. Fewer and the face stops resolving; more and
# the characters stop being characters at the frame's 420px. Both were rendered at the
# real frame size and compared before this number was chosen.
COLS = 100

# Darkest to lightest. The page is ink on cream, so a dense character reads as shadow.
RAMP = "@%#*+=-:. "

# A cell is about twice as tall as it is wide, so rows are halved to keep the face round.
CELL_ASPECT = 0.5

FRAME = 420 / 511  # the photo frame's own ratio, so nothing is letterboxed

# file, crop as fractions of the original, and the alt text's subject
PHOTOS = [
    ("IMG-20260901-WA0032.jpg", (0.23, 0.05, 0.86, 0.68)),
    ("IMG20251004171959.jpg", (0.17, 0.26, 0.84, 0.90)),
    ("IMG20241002154704.jpg", (0.15, 0.22, 0.95, 0.86)),
    ("IMG-20251124-WA0001.jpg", (0.23, 0.18, 0.79, 0.72)),
]

ROOT = Path(__file__).resolve().parent.parent
OUT_IMG = ROOT / "src" / "assets" / "images" / "portraits"
OUT_TS = ROOT / "src" / "content" / "ascii-portraits.ts"


def to_frame(img: Image.Image, box) -> Image.Image:
    """Head and shoulders, then trimmed to the frame's ratio so the card never letterboxes."""
    w, h = img.size
    crop = img.crop((round(box[0] * w), round(box[1] * h), round(box[2] * w), round(box[3] * h)))
    cw, ch = crop.size
    if cw / ch > FRAME:
        nw = round(ch * FRAME)
        crop = crop.crop(((cw - nw) // 2, 0, (cw - nw) // 2 + nw, ch))
    else:
        nh = round(cw / FRAME)
        crop = crop.crop((0, 0, cw, nh))
    return crop


def ascii_of(rgba: Image.Image) -> list[str]:
    """Grey measured inside the subject only.

    The stretch has to ignore the transparent surround or it spends most of its range on
    the page: on the old cut-out the tones inside the figure covered 25..172 of 0..255 and
    a whole-image stretch flattened the face into the jacket.
    """
    a = np.asarray(rgba)
    alpha = a[..., 3]
    grey = (0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]).astype("uint8")
    grey = cv2.createCLAHE(clipLimit=2.4, tileGridSize=(8, 8)).apply(grey).astype(float)

    inside = alpha > 40
    lo, hi = np.percentile(grey[inside], [2, 98])
    grey = np.clip((grey - lo) / max(1.0, hi - lo) * 255, 0, 255)

    small = Image.fromarray(grey.astype("uint8"), "L")
    rows = max(1, round(COLS * (small.size[1] / small.size[0]) * CELL_ASPECT))
    small = small.resize((COLS, rows), Image.LANCZOS)
    # The mask is resized on its own. Resizing a pre-masked image instead lets the soft
    # edge bleed outwards, which prints a halo of stray characters around the shoulders.
    mask = Image.fromarray((inside * 255).astype("uint8"), "L").resize((COLS, rows), Image.LANCZOS)

    px, mp = small.load(), mask.load()
    return [
        "".join(" " if mp[x, y] < 90 else RAMP[min(len(RAMP) - 1, px[x, y] * len(RAMP) // 256)] for x in range(COLS))
        for y in range(rows)
    ]


def main() -> int:
    src = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / "photos")
    OUT_IMG.mkdir(parents=True, exist_ok=True)
    session = new_session("u2net")

    imports, entries = [], []
    for i, (name, box) in enumerate(PHOTOS, 1):
        path = src / name
        if not path.exists():
            print(f"missing  {path}")
            continue

        original = Image.open(path).convert("RGB")

        # the hover photo: same crop, background intact
        shot = to_frame(original, box)
        shot.thumbnail((840, 840 * 2), Image.LANCZOS)
        dest = OUT_IMG / f"ilham-{i}.webp"
        shot.save(dest, "WEBP", quality=82, method=6)

        # the ascii: same crop, background gone
        small = original.copy()
        small.thumbnail((1400, 1400), Image.LANCZOS)
        cut = remove(small, session=session).convert("RGBA")
        lines = ascii_of(to_frame(cut, box))

        imports.append(f'import p{i} from "@/assets/images/portraits/ilham-{i}.webp";')
        body = "\\n".join(lines)
        entries.append(f'  {{ photo: p{i}, ascii: "{body}" }},')
        print(f"{dest.name:16} {shot.size[0]}x{shot.size[1]}  {dest.stat().st_size // 1024} KB   ascii {COLS}x{len(lines)}")

    OUT_TS.write_text(
        "// Generated by tools/portraits-to-ascii.py - do not edit by hand.\n"
        "// Each ascii is 100 characters wide; the photo is the same crop with its\n"
        "// background, which is what the card shows on hover.\n"
        + "\n".join(imports)
        + "\n\nexport const asciiPortraits = [\n"
        + "\n".join(entries)
        + "\n];\n",
        encoding="utf-8",
    )
    print(f"wrote {OUT_TS.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
