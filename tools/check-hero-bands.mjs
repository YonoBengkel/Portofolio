// Fail if a cream wedge opens between the hero's ink bands.
//
// Usage: node tools/check-hero-bands.mjs http://localhost:3000
//
// Two strips at opposing tilts diverge across the screen, and the cream page shows
// through the triangle between them. The hero has carried that bug twice: once with
// alternating tilts of up to eleven degrees apart, and once behind a `gap: -38px` that
// looked like it closed them but was invalid CSS and never applied. Geometry alone did
// not catch either, so this measures the painted pixels.
//
// Three things here were each a wrong answer first:
//
//   - The band text is cream on ink, so a letter at the edge of a column reads exactly
//     like a wedge. The run is hidden before measuring; without that, the "DATA" on the
//     left edge reported as a 132px gap.
//   - The header strip, the toggle and the chip are also light-on-dark. Guessing their
//     class names missed two of them, so everything outside .hero-alt is hidden by
//     walking the DOM instead.
//   - Column x=0 sits on the clip boundary of .hero-alt and antialiases towards the
//     page, which trips the threshold at a 4x zoom that shows solid ink. It is skipped.
import puppeteer from "puppeteer-core";
import { PNG } from "pngjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const base = process.argv[2] ?? "http://localhost:3000";
const out = fs.mkdtempSync(path.join(os.tmpdir(), "hero-bands-"));
const TOLERANCE = 4; // px, for edge antialiasing

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

  const ok = worst <= TOLERANCE;
  if (!ok) failures++;
  console.log(
    `${ok ? "ok  " : "FAIL"} ${vw}px  widest cream run inside the band field = ${worst}px` +
      (ok ? "" : ` at x=${worstX}; see ${file}`) +
      `  (${columns} columns sampled)`,
  );
  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} failing` : "\nno wedges");
process.exit(failures ? 1 : 0);
