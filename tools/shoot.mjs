// Viewport-by-viewport screenshots of a local page, plus an overflow + layout read.
// Full-page captures lie on this site because the about card is scroll-scrubbed, so
// every shot is a real viewport at a real scroll position.
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const url = process.argv[2] ?? "http://localhost:3000/";
const outDir = process.argv[3] ?? "shots";
const W = Number(process.argv[4] ?? 1440);
const H = Number(process.argv[5] ?? 900);
const runAttr = process.argv[6] ?? null; // "1" to flip the hero switch before shooting

mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--force-device-scale-factor=1", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
await new Promise((r) => setTimeout(r, 900));

if (runAttr) {
  await page.evaluate(() => {
    const box = document.querySelector(".run-switch input");
    if (box) box.click();
  });
  await new Promise((r) => setTimeout(r, 2200));
}

const info = await page.evaluate(() => ({
  docH: document.documentElement.scrollHeight,
  scrollW: document.documentElement.scrollWidth,
  inner: window.innerWidth,
  canScrollX: document.documentElement.scrollWidth > window.innerWidth + 1,
}));
console.log(JSON.stringify(info));

const steps = Math.min(16, Math.ceil(info.docH / H));
for (let i = 0; i < steps; i++) {
  const y = Math.min(i * H, info.docH - H);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await new Promise((r) => setTimeout(r, 700));
  const n = String(i).padStart(2, "0");
  await page.screenshot({ path: `${outDir}/${n}.png` });
}

await browser.close();
console.log("shots:", steps, "->", outDir);
