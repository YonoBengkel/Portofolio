// Check the hero's lattice of ink bands: nothing shows with the switch off, every band
// is actually on screen, and every crossing stacks the way the component asked.
//
// Usage: node tools/check-hero-bands.mjs http://localhost:3000
//
// This replaces a checker built for an older arrangement, where the bands were two sets
// of near-parallel strips and the thing worth guarding was the even cream gap between
// them. There are no gaps now - the bands cross outright - so that test could only pass
// vacuously. What is worth guarding instead is the three things the lattice can quietly
// lose:
//
//   - a band left showing with the switch off. The travel out of the window is derived
//     per band from its own height and tilt, and a change to either silently shortens it.
//     This has already shipped once: a band sat 87px inside the window at 1920.
//   - a band buried. Every band is meant to be seen; with six of them overlapping, one
//     can end up entirely behind the others and nobody notices.
//   - a crossing stacking the wrong way. The order is explicit per band, and z-index is
//     fragile: any ancestor that creates a stacking context reorders the whole lattice
//     without an error.
//
// Measured from painted pixels, not geometry. A band tilted 24 degrees has a bounding
// rect 2156px tall at 1920 of which almost none is on screen, so rect arithmetic reports
// leaks and coverage that are not there - which it did, to me, while this was written.
import puppeteer from "puppeteer-core";
import { PNG } from "pngjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Edge by default, because that is what is on this machine. BROWSER overrides it:
// the binary moves, Edge sometimes refuses to launch under automation after an
// update, and a checker that can only run in one browser stops being run.
const EDGE = process.env.BROWSER || String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const base = process.argv[2] ?? "http://localhost:3000";
const out = fs.mkdtempSync(path.join(os.tmpdir(), "hero-bands-"));
const MIN_VISIBLE = 1.0; // % of the window a band must paint to count as present
const STEP = 2; // pixel sampling stride

const isInk = (d, i) => d[i] < 120 && d[i + 1] < 100;
const isRed = (d, i) => d[i] > 150 && d[i + 1] < 90 && d[i + 2] < 90;

function count(file, test) {
  const png = PNG.sync.read(fs.readFileSync(file));
  let n = 0;
  let total = 0;
  for (let y = 0; y < png.height; y += STEP) {
    for (let x = 0; x < png.width; x += STEP) {
      total++;
      if (test(png.data, (png.width * y + x) << 2)) n++;
    }
  }
  return { n, total };
}

// Everything outside the band field is hidden before measuring: the header strip, the
// switch and the chip are light-on-dark too, and guessing their class names missed two
// of them when this was first written. Walking the DOM is the version that holds.
const isolate = () => {
  const field = document.querySelector(".hero-alt");
  document.querySelectorAll("body *").forEach((el) => {
    if (el.closest(".hero-alt") || el.contains(field)) return;
    el.style.visibility = "hidden";
  });
};

const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--hide-scrollbars"] });
let failures = 0;

for (const [vw, vh] of [[1920, 1042], [1440, 900], [375, 812]]) {
  const page = await browser.newPage();
  await page.setViewport({ width: vw, height: vh });
  await page.goto(base, { waitUntil: "networkidle2", timeout: 60000 });
  // The hero only exists for a visitor who has already clicked past the title sequence,
  // so that is the state to measure it in. isolate() hides the overlay anyway, but the
  // sequence also locks scroll, and a checker that has to be told twice is cheaper than
  // one that measures a state nobody sees.
  await page.evaluate(() => (document.documentElement.dataset.intro = "off"));
  await page.evaluate(isolate);

  // 1. nothing painted with the switch off
  await new Promise((r) => setTimeout(r, 1200));
  const offFile = path.join(out, `off-${vw}.png`);
  await page.screenshot({ path: offFile });
  const off = count(offFile, isInk);
  const offOk = off.n === 0;
  if (!offOk) failures++;
  console.log(`${offOk ? "ok  " : "FAIL"} ${vw}x${vh} switch off: ${off.n} ink pixels${offOk ? "" : ` - see ${offFile}`}`);

  await page.evaluate(() => document.documentElement.setAttribute("data-run", "1"));
  await new Promise((r) => setTimeout(r, 2600));

  // 2. every band paints something. Band k is turned red and the red is counted, so
  //    occlusion by the others is included without any geometry being assumed.
  await page.evaluate(() => document.querySelectorAll(".hero-band-run").forEach((e) => (e.style.visibility = "hidden")));
  const n = await page.evaluate(() => document.querySelectorAll(".hero-band-in").length);
  const hidden = [];
  for (let k = 0; k < n; k++) {
    await page.evaluate((k) => {
      document.querySelectorAll(".hero-band-in").forEach((e, i) => (e.style.background = i === k ? "#e4002b" : ""));
    }, k);
    await new Promise((r) => setTimeout(r, 100));
    const f = path.join(out, `band-${vw}-${k}.png`);
    await page.screenshot({ path: f });
    const { n: red, total } = count(f, isRed);
    const pct = (red / total) * 100;
    if (pct < MIN_VISIBLE) hidden.push(`${k}:${pct.toFixed(1)}%`);
    fs.rmSync(f, { force: true });
  }
  const visOk = hidden.length === 0;
  if (!visOk) failures++;
  console.log(`${visOk ? "ok  " : "FAIL"} ${vw}x${vh} all ${n} bands on screen${visOk ? "" : ` - buried: ${hidden.join(" ")}`}`);

  // 3. every visible crossing stacks by the declared z
  await page.evaluate(() => {
    document.querySelectorAll(".hero-band-in").forEach((e) => (e.style.background = ""));
    document.querySelectorAll(".hero-band-run").forEach((e) => (e.style.visibility = ""));
  });
  const wrong = await page.evaluate(() => {
    const els = [...document.querySelectorAll(".hero-band")];
    document.querySelector(".hero-alt").style.pointerEvents = "auto";
    els.forEach((e) => (e.style.pointerEvents = "auto"));
    const geo = els.map((el) => {
      const inn = el.querySelector(".hero-band-in");
      const r = inn.getBoundingClientRect();
      const m = getComputedStyle(el).rotate.match(/(-?[\d.]+)deg/);
      return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, t: ((m ? parseFloat(m[1]) : 0) * Math.PI) / 180, h: inn.offsetHeight, w: inn.offsetWidth, z: +getComputedStyle(el).zIndex };
    });
    const inside = (g, x, y) => {
      const dx = x - g.cx;
      const dy = y - g.cy;
      const u = dx * Math.cos(-g.t) - dy * Math.sin(-g.t);
      const v = dx * Math.sin(-g.t) + dy * Math.cos(-g.t);
      return Math.abs(u) <= g.w / 2 && Math.abs(v) <= g.h / 2;
    };
    const bad = [];
    for (let i = 0; i < els.length; i++) {
      for (let j = i + 1; j < els.length; j++) {
        // Candidates rather than one point, because a point can be geometrically inside
        // both bands and still hit nothing: innerWidth includes the reserved scrollbar
        // gutter, and a probe that lands in it comes back with an empty stack. That read
        // as "painted in the wrong order" and failed two crossings that were correct.
        // The first 40 hits are skipped to get away from the tapering ends of the overlap.
        const cands = [];
        let hits = 0;
        for (let y = 4; y < innerHeight && cands.length < 24; y += 6) {
          for (let x = 4; x < innerWidth; x += 6) {
            if (inside(geo[i], x, y) && inside(geo[j], x, y) && ++hits > 40) cands.push([x, y]);
          }
        }
        let pt = null;
        let stack = [];
        for (const c of cands) {
          const s = document.elementsFromPoint(c[0], c[1]).map((e) => e.closest(".hero-band")).filter(Boolean);
          if (s.includes(els[i]) || s.includes(els[j])) { pt = c; stack = s; break; }
        }
        if (!pt) continue;
        const pi = stack.indexOf(els[i]);
        const pj = stack.indexOf(els[j]);
        const painted = pi >= 0 && (pj < 0 || pi < pj) ? i : j;
        const declared = geo[i].z > geo[j].z ? i : j;
        if (painted !== declared) bad.push(`${i}x${j}`);
      }
    }
    return bad;
  });
  const zOk = wrong.length === 0;
  if (!zOk) failures++;
  console.log(`${zOk ? "ok  " : "FAIL"} ${vw}x${vh} crossings stack by z${zOk ? "" : ` - wrong: ${wrong.join(" ")}`}`);

  fs.rmSync(offFile, { force: true });
  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} failing` : "\nlattice holds");
process.exit(failures ? 1 : 0);
