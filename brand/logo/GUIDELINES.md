# Ilham Bintang Satria — Logo Guidelines

One page. Written for whoever uses the mark next, including future me.

## 1. The logo

**Idea.** A flowchart decision diamond cut open by a vertical slot of light. The diamond is the
one shape every process map shares — the point where a business decides. The slot is not a letter
drawn on top of it; it is an absence, and it reads as an **I**.

**Versions.** Horizontal lockup (primary) · stacked lockup · symbol only · wordmark only.

**Three cuts of the symbol, and they are not interchangeable:**

| File | Use it for |
|---|---|
| `masters/symbol.svg` | Display. 32 px and above, dark on light. |
| `masters/symbol-small.svg` | 24 px and below, and every favicon/app icon. Wider slot, diamond pulled in, so both survive the pixel grid. |
| `masters/symbol-reversed.svg` | Anything light on dark. Diamond pulled in 2 units, slot widened 4, to cancel the bloom of light on a dark field. |

Never reverse the display cut by recolouring it — use the reversed file.

## 2. Clear space

The unit is the **slot** — the width of the gap in the middle of the diamond, which is ⅛ of the
symbol's height.

Keep **2 slots** (= ¼ of the symbol's height) clear on all four sides of the logo. Nothing enters
that zone: no text, no rule, no edge of the page. The zone scales with the logo, so never write it
down as a fixed number of pixels.

## 3. Minimum size

| Version | Screen | Print |
|---|---|---|
| Symbol | 16 px (use `symbol-small`) | 5 mm (use `symbol-small` below 8 mm) |
| Horizontal lockup | 150 px wide | 30 mm wide |
| Stacked lockup | 120 px wide | 25 mm wide |

Below those, drop the wordmark and use the symbol alone. The minimums come from the wordmark's
cap height, which is 35% of the horizontal lockup's height and 15% of the stacked one's; both
floors hold the cap at about 8 px / 1.6 mm, where a serif stops being legible.

## 4. Colour

| Name | HEX | RGB | CMYK (start here, then proof) |
|---|---|---|---|
| Void — the page, and the mark in print | `#0C131D` | 12 · 19 · 29 | 59 · 34 · 0 · 89 |
| Bone — the mark on the dark page | `#D9D5C8` | 217 · 213 · 200 | 0 · 2 · 8 · 15 |
| Soot — raised surfaces | `#142638` | 20 · 38 · 56 | 64 · 32 · 0 · 78 |
| Brass — hover only, never the mark | `#CCA052` | 204 · 160 · 82 | 0 · 22 · 60 · 20 |

Measured contrast: bone on void **12.70:1**, void on white **18.64:1**, brass on void **7.74:1**.
Brass on white is **2.41:1** — that is why brass is a hover state on the dark page and never the
mark on a light background.

These replaced an earlier set built on `#06080C` and `#D9A441`, which were the site's tokens before
the palette was rebuilt onto the measured Pale City ladder.

**Approved pairs.** Bone on void (primary) · void on white (print and light mode) · white on void ·
black on white. On a photograph, use the reversed cut on a calm dark area, or set it on a solid
void tile — never float it over a lit, busy part of the frame.

CMYK here is a straight conversion, not a proof. For anything printed, ask the printer for a proof
and expect void to be mixed as a rich black rather than four-colour.

## 5. Typography

- Wordmark: **Newsreader** Regular, outlined to paths and optically tracked. The wordmark is
  artwork, not live text — never retype it.
- Site display: Instrument Serif · Body: Archivo · Metadata: IBM Plex Mono.
- All four are open licence (SIL Open Font Licence) and clear for this use. If the wordmark ever
  needs to change, re-outline it from the same font — don't fake it with a lookalike.

## 6. Don'ts

Don't stretch, squash or rotate it · don't recolour it outside the four values above · don't add a
shadow, outline, glow or gradient · don't rearrange the parts of a lockup or resize them against
each other · don't put the display cut on a dark field · don't fill the slot or round the points ·
don't retype the wordmark · don't put it on a busy photograph without a solid tile.

## 7. Files

- `masters/` — the source SVGs. Everything else is generated from these.
- `digital/` — black, white and void versions of the symbol and both lockups, plus 1200 px PNGs.
- `web/` — `favicon.ico`, `favicon.svg`, the PNG icon set, `site.webmanifest`, `head-snippet.html`.
- `board/` — the presentation board (`board.html`, `slides/`) and the test sheet (`preview.html`).

Installed on the site at `src/app/icon.svg` and `src/components/logo.tsx`.

## 8. One honest limit

I can't clear a trademark. Before this mark goes on anything commercial, run a professional search
— national trademark databases plus a reverse image search. A diamond with a slot is a simple form
and simple forms collide.
