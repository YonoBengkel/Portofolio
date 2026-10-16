# -*- coding: utf-8 -*-
"""Generate the four Pale City surface tiles (PRD P0-2).

Grayscale, seamless, a few KB each. Grayscale on purpose: the colour comes from
the ladder tokens at paint time, so a surface can never drift off-palette.

Seamlessness is not faked with mirroring — the noise is built in the frequency
domain, so it is periodic by construction and the tile wraps exactly. The
spectrum is a power law rather than a hard band, because a hard band rings and
the ringing shows up as a plaid.
"""
import os
import sys

import numpy as np
from PIL import Image

OUT = sys.argv[1] if len(sys.argv) > 1 else "."
N = 256  # tile side in px — big enough that the repeat is not the first thing you see


def fnoise(seed, beta=1.6, aniso=1.0, lo=1.0, hi=None, shape=None):
    """Periodic noise with a 1/f**beta spectrum. `aniso` > 1 stretches it horizontally."""
    h, w = shape or (N, N)
    rng = np.random.default_rng(seed)
    spec = rng.normal(size=(h, w)) + 1j * rng.normal(size=(h, w))
    fy = np.fft.fftfreq(h)[:, None] * h
    fx = np.fft.fftfreq(w)[None, :] * w / aniso
    r = np.sqrt(fy ** 2 + fx ** 2)
    amp = np.where(r >= lo, r ** -beta, 0.0)
    if hi:
        amp = np.where(r <= hi, amp, 0.0)
    out = np.real(np.fft.ifft2(spec * amp))
    return out / (out.std() + 1e-9)


def norm(a, lo=0.0, hi=1.0):
    a = (a - a.min()) / (np.ptp(a) + 1e-9)
    return lo + a * (hi - lo)


def save(a, name, q=78, floor=0.0, levels=24):
    """Write the tile as alpha, not as grey.

    The file carries no colour at all: RGB is white and the texture lives in the alpha
    channel. The page then uses it as a CSS mask over a div filled with a ladder token,
    so the visible surface is always a palette colour at varying opacity. Painting a grey
    texture over a blue page would wash the blue out, which is the opposite of what this
    palette is for.
    """
    alpha = np.clip((a - floor) / max(1e-6, 1 - floor), 0, 1)
    rgba = np.zeros((N, N, 4), dtype=np.uint8)
    rgba[..., :3] = 255
    # A couple of dozen levels is past what the eye resolves at these opacities, and flat steps
    # are what lets the codec get the file down to a few KB.
    rgba[..., 3] = (np.round(alpha * (levels - 1)) / (levels - 1) * 255).astype(np.uint8)
    path = os.path.join(OUT, name)
    Image.fromarray(rgba, "RGBA").save(path, "WEBP", quality=q, alpha_quality=42, method=6)
    print(f"{name:16s} {N}x{N}  {os.path.getsize(path) / 1024:5.1f} KB")


def concrete():
    """A poured wall: broad mottling with a fine aggregate in it, and no direction."""
    a = norm(fnoise(11, beta=1.9)) * 0.80
    a += norm(fnoise(12, beta=0.6, lo=10, hi=70)) * 0.20   # aggregate
    return norm(a, 0.46, 1.0)


def wood():
    """Floorboards. Boards run vertically, so the grain runs vertically too: long lines
    that wander along their length, not rings across the board. Rings across a board are
    end grain, which is what you see on a sawn-off plank, not on a floor."""
    a = np.zeros((N, N))
    edges = [0, 71, 128, 197, N]
    rng = np.random.default_rng(77)
    for i in range(len(edges) - 1):
        x0, x1 = edges[i], edges[i + 1]
        w = x1 - x0
        yy, xx = np.mgrid[0:N, 0:w].astype(float)
        # The grain lines sit at a slowly drifting offset, so they wander up the board
        # instead of running dead straight.
        drift = fnoise(200 + i, beta=2.6, aniso=0.08, shape=(N, w)) * 9.0
        fine = fnoise(260 + i, beta=1.3, aniso=0.25, lo=4, shape=(N, w)) * 2.4
        lines = np.sin((xx + drift + fine) * (2 * np.pi * 3.0 / max(w, 1)))
        # Dark thin lines on a broad pale field is what reads as grain.
        lines = np.sign(lines) * np.abs(lines) ** 0.35
        board = norm(lines, 0.58, 1.0)
        board += norm(fnoise(300 + i, beta=0.7, aniso=0.07, lo=5, shape=(N, w))) * 0.20
        board *= 0.84 + 0.16 * rng.random()
        a[:, x0:x1] = board

    # Seams between boards: a hard dark line with a pale catch of light beside it.
    for e in edges[1:-1]:
        a[:, e] *= 0.40
        a[:, max(e - 1, 0)] *= 0.66
        a[:, min(e + 1, N - 1)] = np.clip(a[:, min(e + 1, N - 1)] * 1.16, 0, 1.4)
    a[:, 0] *= 0.40
    a[:, N - 1] *= 0.66

    a += norm(fnoise(31, beta=0.4, lo=40)) * 0.05
    return norm(a, 0.34, 1.0)


def ceramic():
    """Institutional floor tile: a grid of grout, each tile slightly its own colour."""
    k = 3                                   # 3 tiles per side -> ~85px tiles
    s = N // k
    y, x = np.mgrid[0:N, 0:N]
    a = np.full((N, N), 0.92)
    rng = np.random.default_rng(31)
    for iy in range(k):
        for ix in range(k):
            a[iy * s:(iy + 1) * s, ix * s:(ix + 1) * s] *= 0.82 + 0.18 * rng.random()
    a += norm(fnoise(32, beta=1.2, lo=8)) * 0.10             # glaze mottle
    a += norm(fnoise(33, beta=0.3, lo=50)) * 0.05            # fine speckle

    # Grout: 3px, recessed, with its own grain, and the tile edge catches a little light.
    gy = ((y % s) < 3).astype(float)
    gx = ((x % s) < 3).astype(float)
    grout = np.clip(gy + gx, 0, 1)
    lip = np.clip(((y % s) == 3).astype(float) + ((x % s) == 3).astype(float), 0, 1)
    tone = 0.40 + norm(fnoise(34, beta=0.8, lo=12)) * 0.16
    a = a * (1 - grout) + tone * grout
    a = np.clip(a + lip * 0.10, 0, 1)
    return np.clip(a, 0, 1)


def paint():
    """A painted plate letting go: a few broad patches have lifted, with hard irregular
    edges, and what is under them is darker."""
    field = fnoise(41, beta=2.6) + fnoise(42, beta=1.1, lo=12) * 0.22   # big shapes, ragged edges
    lifted = field > np.percentile(field, 58)
    a = np.where(lifted, 0.96, 0.60)

    # The lip of a lifted patch: light where it rises, shadow on the far side.
    gy, gx = np.gradient(lifted.astype(float))
    a += np.clip(gx + gy, 0, 1) * 0.20
    a -= np.clip(-(gx + gy), 0, 1) * 0.22

    a += norm(fnoise(43, beta=1.4, lo=4)) * 0.12             # unevenness across the whole plate
    a += norm(fnoise(44, beta=0.3, lo=60)) * 0.05            # tooth
    return norm(a, 0.40, 1.0)


def paper():
    """Pressed paper: long fibres lying in every direction, a slow unevenness across the
    sheet, and the odd darker speck where the pulp did not take."""
    a = norm(fnoise(51, beta=2.0, lo=2)) * 0.52            # the sheet is not flat
    a += norm(fnoise(52, beta=0.5, aniso=9.0, lo=8)) * 0.22  # fibres one way
    a += norm(fnoise(53, beta=0.5, aniso=0.11, lo=8)) * 0.20  # and the other
    a += norm(fnoise(54, beta=0.2, lo=70)) * 0.10           # tooth
    specks = fnoise(55, beta=0.3, lo=40)
    a -= (specks > np.percentile(specks, 99.3)) * 0.30      # flecks in the pulp
    return norm(a, 0.30, 1.0)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    save(concrete(), "concrete.webp", floor=0.32)
    save(wood(), "wood.webp", q=62, floor=0.22, levels=12)
    save(ceramic(), "ceramic.webp", floor=0.18)
    save(paint(), "paint.webp", floor=0.26)
    save(paper(), "paper.webp", floor=0.10, levels=16)
