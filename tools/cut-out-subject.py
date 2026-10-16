# -*- coding: utf-8 -*-
"""Cut the figure out of a photograph with a salient-object model (PRD P1-2).

GrabCut could not do this one: the subject's navy shirt and the cold room behind him
sit in the same part of the colour space, so a colour-model segmenter kept claiming the
windows and the floor. U2-Net is trained on salience instead of colour, which is the
right question here - who is the subject of this picture.

Usage: segment.py <model.onnx> <src> <dst.png> [--width N] [--feather F]
"""
import argparse

import numpy as np
import onnxruntime as ort
import pillow_heif
from PIL import Image, ImageFilter
from scipy import ndimage

pillow_heif.register_heif_opener()

SIZE = 320  # what u2netp was trained at


def predict(session, img):
    a = np.asarray(img.convert("RGB").resize((SIZE, SIZE), Image.LANCZOS), dtype=np.float32) / 255.0
    # The published preprocessing: scale by the max channel, then the usual mean/std.
    a = a / max(a.max(), 1e-6)
    mean, std = np.array([0.485, 0.456, 0.406]), np.array([0.229, 0.224, 0.225])
    a = (a - mean) / std
    x = a.transpose(2, 0, 1)[None].astype(np.float32)
    out = session.run(None, {session.get_inputs()[0].name: x})[0][0, 0]
    return (out - out.min()) / (np.ptp(out) + 1e-8)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("model")
    p.add_argument("src")
    p.add_argument("dst")
    p.add_argument("--width", type=int, default=900)
    p.add_argument("--feather", type=float, default=1.1)
    p.add_argument("--threshold", type=float, default=0.5)
    a = p.parse_args()

    pil = Image.open(a.src).convert("RGB")
    if pil.width > a.width:
        pil = pil.resize((a.width, round(pil.height * a.width / pil.width)), Image.LANCZOS)

    session = ort.InferenceSession(a.model, providers=["CPUExecutionProvider"])
    small = predict(session, pil)
    alpha = np.asarray(Image.fromarray((small * 255).astype(np.uint8)).resize(pil.size, Image.BICUBIC)) / 255.0

    hard = alpha > a.threshold
    lab, n = ndimage.label(hard)
    if n > 1:
        sizes = ndimage.sum(hard, lab, range(1, n + 1))
        hard = lab == (1 + int(np.argmax(sizes)))
    hard = ndimage.binary_fill_holes(hard)
    print(f"subject covers {100 * hard.mean():.1f}% of the frame")

    # Keep the model's soft edge inside the chosen blob rather than a hard stencil.
    alpha = np.where(hard, np.clip(alpha / max(a.threshold, 1e-6), 0, 1), 0.0)
    alpha = np.asarray(
        Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(a.feather))
    ) / 255.0

    rgba = np.dstack([np.asarray(pil), (alpha * 255).astype(np.uint8)])
    ys, xs = np.where(alpha > 0.4)
    if len(ys):
        pad = 6
        rgba = rgba[max(0, ys.min() - pad):ys.max() + pad, max(0, xs.min() - pad):xs.max() + pad]
    im = Image.fromarray(rgba, "RGBA")
    im.save(a.dst)

    chk = Image.new("RGB", im.size, (43, 73, 98))
    chk.paste(im, (0, 0), im)
    chk.save(a.dst.replace(".png", "-check.png"))
    print(f"wrote {a.dst} {im.size}")


if __name__ == "__main__":
    main()
