"""Turn certificate scans into web images for the certificates belt.

PDFs are rendered at page 1 only - a certificate's second page is a score sheet or a
syllabus, and this site does not print scores. Everything is capped at 1400px wide, which
is twice the widest slot the belt ever gives a card, and saved as WebP at quality 80.

Anything in REDACT is painted over before the page is rendered, so the identifier never
reaches the WebP at all rather than being hidden by a layer somebody could peel off.

Run it with the source folder as an argument:

    python tools/certs-to-webp.py "D:/KULIAH/Sertifikat"

Nothing here reads the originals from the repo: the scans stay in his own folder and only
the rendered WebP lands in src/assets. Check each output by eye before committing one -
certificates often carry a student number, and this script cannot tell.
"""

import sys
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image

MAX_W = 1400
QUALITY = 80

# Text to paint over before saving, keyed by output name. PyMuPDF is asked where the
# string actually sits on the page rather than a box being guessed at, so a layout change
# cannot silently move the redaction off the thing it is covering.
REDACT = {
    # Ilham's own, plus the two signatories'. He said his own was fine to show; the other
    # two are not his to publish, and the letter names all three.
    "opp": ["3324600041", "3123600039", "3323600060"],
}

# source (relative to the folder passed in) -> output name.
#
# One certificate in that folder is deliberately NOT here, and must not be added:
# "PPU Suksesi.pdf" is a committee decree listing about seventy students' full names
# against their NRP. The role is on the site; the document cannot be.
FILES = {
    # awards and courses
    "Non-Linear/SIC 7.pdf": "sic-7",
    "Non-Linear/certificate-DQLABAI003WBCLJD.pdf": "dqlab-sql",
    # data competitions
    "Linear/ARA ITS 2026.png": "ara-7",
    "Linear/Sertifikat Gammafest 2026 - Peserta DSC-4.pdf": "gammafest-2026",
    "Non-Linear/Compfest.pdf": "compfest-18",
    "Non-Linear/Gelar Rasa 2024.pdf": "gelar-rasa-2024",
    "Non-Linear/Gelar Rasa 2025.png": "gelar-rasa-2025",
    # chess
    "Non-Linear/Juara 2 Eltafest.jpg": "catur-eltafest",
    "Non-Linear/ITS Chess Tournament.png": "catur-its",
    "Non-Linear/Unessa Chess Tournament.pdf": "catur-unesa",
    # committee roles
    "Non-Linear/Kaderisasi.png": "dynamic-himit",
    "Non-Linear/Panitia PKT PKO.pdf": "pengenalan-komunitas",
    "Non-Linear/Panitia LKMM.pdf": "lkmm-lo",
    "Non-Linear/Mentoring UKKI.pdf": "mentoring-ukki",
    # training and seminars attended
    "Non-Linear/Surat_Lulus_OPP_Ilham Bintang Satria.pdf": "opp",
    "Non-Linear/Peserta LKMM TD.pdf": "lkmm-dasar",
    "Non-Linear/Peserta LKMM Pra-TD.pdf": "lkmm-pra-dasar",
    "Non-Linear/Mentoring Mas Ody.png": "ieee-seminar",
}


def load(path: Path, redact: list[str] | None = None) -> Image.Image:
    if path.suffix.lower() == ".pdf":
        with fitz.open(path) as doc:
            page = doc[0]
            for needle in redact or []:
                for rect in page.search_for(needle):
                    page.draw_rect(rect + (-2, -2, 2, 2), color=None, fill=(0.14, 0.07, 0.02))
            # Render at whatever zoom lands near MAX_W, so a small page is not upscaled
            # from a 72dpi raster and a large one is not rendered at 300dpi for nothing.
            zoom = min(4.0, max(1.5, MAX_W / page.rect.width))
            pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
            return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    return Image.open(path).convert("RGB")


def main() -> int:
    src = Path(sys.argv[1] if len(sys.argv) > 1 else "D:/KULIAH/Sertifikat")
    out = Path(__file__).resolve().parent.parent / "src" / "assets" / "images" / "certs"
    out.mkdir(parents=True, exist_ok=True)

    for rel, name in FILES.items():
        path = src / rel
        if not path.exists():
            print(f"missing  {rel}")
            continue
        img = load(path, REDACT.get(name))
        if img.width > MAX_W:
            img = img.resize((MAX_W, round(img.height * MAX_W / img.width)), Image.LANCZOS)
        dest = out / f"{name}.webp"
        img.save(dest, "WEBP", quality=QUALITY, method=6)
        print(f"{dest.name:24} {img.width}x{img.height}  {dest.stat().st_size // 1024} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
