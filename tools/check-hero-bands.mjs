// Check the hero's ink bands: every cream run between them is either one of the even
// gaps inside a set, or nothing.
//
// Usage: node tools/check-hero-bands.mjs http://localhost:3000
//
// The bands are two sets of parallel strips that cross. Inside a set the gap is the same
// at every point across the window, because the strips share a tilt; between the sets
// there is no gap at all, because they overlap rather than meet. Anything else is a
// wedge: two strips at different angles diverging, cream showing through wide at one end
// and shut at the other. This hero has carried that bug twice - once with alternating
// tilts up to eleven degrees apart, and once behind a `gap: -38px` that read like it
// closed them but was invalid CSS and never applied. Geometry caught neither, so this
// measures the painted pixels.
//
// Four things here were each a wrong answer first:
//
//   - The band text is cream on ink, so a letter at the edge of a column reads exactly
//     like a wedge. The run is hidden before measuring; without that, the "DATA" on the
//     left edge reported as a 132px gap.
//   - The header strip, the toggle and the chip are also light-on-dark. Guessing their
//     class names missed two of them, so everything outside .hero-alt is hidden by
//     walking the DOM instead.
//   - Column x=0 sits on the clip boundary of .hero-alt and antialiases towards the
//     page, which trips the threshold at a 4x zoom that shows solid ink. It is skipped.
//   - The first version failed any cream at all, which was right only while the bands
//     were one solid field. The gaps are deliberate now, so the test is that a run is
//     either the set's own gap or small, not that there are no runs.
import puppeteer from "puppeteer-core";
import { PNG } from "pngjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const base = process.argv[2] ?? "http://localhost:3000";
const out = fs.mkdtempSync(path.join(os.tmpdir(), "hero-bands-"));
const SLACK = 6; // px, for edge antialiasing and sub-pixel gap rounding

const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--hide-scrollbars"] });
let failures = 0;

for (const vw of [1440, 1920, 375]) {
  const page = await browser.newPage();
  await page.setViewport({ width: vw, height: 900 });
  await page.goto(base, { waitUntil: "networkidle2", timeout: 60000 });

  await page.evaluate(() => {
    const field = document.querySelector(".hero-alt");
    document.querySelectorAll("body *").forEach((el) => {
      if (el.closest(".hero-alt") || el.contains(field)) return;
      el.style.visibility = "hidden";
    });
    document.querySelectorAll(".hero-band-run").forEach((e) => (e.style.visibility = "hidden"));
    document.documentElement.setAttribute("data-run", "1");
  });
  await new Promise((r) => setTimeout(r, 2600));

  const box = await page.evaluate(() => {
    const r = document.querySelector(".hero-alt").getBoundingClientRect();
    const x = Math.max(0, Math.round(r.left));
    const y = Math.max(0, Math.round(r.top));
    return { x, y, width: Math.min(innerWidth - x, Math.round(r.width)), height: Math.min(innerHeight - y, Math.round(r.height)) };
  });
  const file = path.join(out, `bands-${vw}.png`);
  await page.screenshot({ path: file, clip: box });

  const png = PNG.sync.read(fs.readFileSync(file));
  const dark = (x, y) => {
    const i = (png.width * y + x) << 2;
    return png.data[i] < 120 && png.data[i + 1] < 100;
  };

  // The gap the sets are built to hold, read from the page rather than hard-coded, so
  // the check follows the stylesheet instead of drifting from it.
  const gap = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector(".hero-set")).rowGap));
  const limit = gap + SLACK;

  let worst = 0;
  let worstX = -1;
  let columns = 0;
  for (let x = 4; x < png.width; x += 4) {
    let first = -1;
    let last = -1;
    for (let y = 0; y < png.height; y++) if (dark(x, y)) { if (first < 0) first = y; last = y; }
    if (first < 0) continue;
    columns++;
    let run = 0;
    let longest = 0;
    for (let y = first; y <= last; y++) {
      if (dark(x, y)) run = 0;
      else { run++; longest = Math.max(longest, run); }
    }
    if (longest > worst) { worst = longest; worstX = x; }
  }

  const ok = worst <= limit;
  if (!ok) failures++;
  console.log(
    `${ok ? "ok  " : "FAIL"} ${vw}px  gap ${gap.toFixed(0)}px, widest cream run ${worst}px` +
      (ok ? "" : ` at x=${worstX} - ${(worst - gap).toFixed(0)}px wider than the gap; see ${file}`) +
      `  (${columns} columns)`,
  );
  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} failing` : "\nno wedges");
process.exit(failures ? 1 : 0);
