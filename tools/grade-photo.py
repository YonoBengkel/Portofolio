# -*- coding: utf-8 -*-
"""Grade a photograph into the Pale City ladder (PRD P0-3).

A straight desaturate-and-darken was what we shipped before, and it measured 0.15
saturation against the reference's 0.60 - grey, not cold. This instead maps the
photograph's tonal range onto the measured ladder, so every pixel lands on a
palette colour and the image carries the same weather as the page.

Usage: grade.py <src> <dst> [--width N] [--gamma G] [--map M] [--lift L]
"""
import argparse
import sys

import numpy as np
import pillow_heif
from PIL import Image

pillow_heif.register_heif_opener()

# The measured ladder, darkest to lightest, plus the cold light source on the end.
LADDER = ["#0c131d", "#142638", "#2b4962", "#477c9a", "#8cacc6", "#a6b3cb"]


def srgb_to_lin(a):
    return np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)


def lin_to_srgb(a):
    a = np.clip(a, 0, 1)
    return np.where(a <= 0.0031308, a * 12.92, 1.055 * a ** (1 / 2.4) - 0.055)


def luminance(rgb):
    lin = srgb_to_lin(rgb)
    return 0.2126 * lin[..., 0] + 0.7152 * lin[..., 1] + 0.0722 * lin[..., 2]


def ramp():
    """The ladder as a 256-entry lookup, interpolated in linear light."""
    stops = np.array([[int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)] for h in LADDER])
    stops = srgb_to_lin(stops)
    x = np.linspace(0, 1, len(stops))
    xi = np.linspace(0, 1, 256)
    return np.stack([np.interp(xi, x, stops[:, c]) for c in range(3)], axis=1)


def grade(img, gamma, strength, lift):
    a = np.asarray(img.convert("RGB"), dtype=np.float64) / 255

    # Tone first: pull the whole frame down so the lit parts have somewhere to be lit
    # against, but keep the light sources, which is what stops it going flat.
    v = luminance(a)
    key = np.clip(v / max(np.percentile(v, 99.5), 1e-6), 0, 1) ** gamma
    key = lift + (1 - lift) * key

    # Then colour: every tone picks its colour off the ladder.
    lut = ramp()
    idx = np.clip((key * 255).astype(int), 0, 255)
    mapped = lut[idx]

    # Keep some of the photograph's own colour so skin does not turn to paint.
    lin = srgb_to_lin(a)
    lum = luminance(a)[..., None]
    own = lin * (key[..., None] / np.maximum(lum, 1e-4))
    out = mapped * strength + own * (1 - strength)

    return Image.fromarray((lin_to_srgb(out) * 255).round().astype(np.uint8), "RGB")


def report(img, label):
    a = np.asarray(img.convert("RGB"), dtype=np.float64) / 255
    L = luminance(a)
    mx, mn = a.max(2), a.min(2)
    s = np.where(mx > 1e-6, (mx - mn) / np.maximum(mx, 1e-9), 0)
    print(f"{label:28s} medianL={np.median(L):.4f}  above0.01={100 * (L > 0.01).mean():5.1f}%  "
          f"medianS={np.median(s):.2f}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("src")
    p.add_argument("dst")
    p.add_argument("--width", type=int, default=1200)
    p.add_argument("--gamma", type=float, default=2.3)
    p.add_argument("--map", dest="strength", type=float, default=0.82)
    p.add_argument("--lift", type=float, default=0.02)
    p.add_argument("--quality", type=int, default=74)
    a = p.parse_args()

    img = Image.open(a.src)
    if img.width > a.width:
        img = img.resize((a.width, round(img.height * a.width / img.width)), Image.LANCZOS)
    report(img, "source")
    out = grade(img, a.gamma, a.strength, a.lift)
    report(out, "graded")
    out.save(a.dst, quality=a.quality, method=6) if a.dst.endswith(".webp") else out.save(a.dst)
    print(f"wrote {a.dst}  {out.size}")


if __name__ == "__main__":
    sys.exit(main())
