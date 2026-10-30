// Walk every route at two widths and fail on the things a screenshot will not show you:
// real horizontal scrolling, console errors, and links or buttons with no accessible name.
//
// Usage: node tools/check-pages.mjs http://localhost:3000
//
// Two things here are deliberate and were both learned the hard way.
//
// It scrolls the whole page before measuring. An <img> contributes no intrinsic width
// until it has loaded, so a grid blown open by an 1800px screenshot measures perfectly
// clean at DOM-ready and only overflows once the picture arrives - and next/image is
// lazy, so the picture never arrives unless you scroll past it. That exact false pass
// has happened on this repo.
//
// And it tests scrolling by scrolling, not by comparing scrollWidth to innerWidth.
// Clipped overflow (the hazard tape at 108vw, the hero's alternate ground) still counts
// toward scrollWidth in Chromium, so that comparison reports failures that do not exist.
// window.scrollX after a scrollTo is the only honest answer.
import puppeteer from "puppeteer-core";

// Edge by default, because that is what is on this machine. BROWSER overrides it:
// the binary moves, Edge sometimes refuses to launch under automation after an
// update, and a checker that can only run in one browser stops being run.
const EDGE = process.env.BROWSER || String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const base = process.argv[2] ?? "http://localhost:3000";
const paths = [
  "/",
  "/about",
  "/work",
  "/work/turnify-flow",
  "/work/sales-data-warehouse",
  "/cv",
  "/contact",
  "/about/competitions",
  "/about/activities",
];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--hide-scrollbars"],
});

let failures = 0;

for (const w of [1440, 375]) {
  for (const p of paths) {
    const page = await browser.newPage();
    const errs = [];
    page.on("console", (m) => {
      if (m.type() === "error") errs.push(m.text().slice(0, 140));
    });
    page.on("pageerror", (e) => errs.push("PAGEERROR " + String(e).slice(0, 140)));

    await page.setViewport({ width: w, height: 900 });
    const resp = await page.goto(base + p, { waitUntil: "domcontentloaded", timeout: 60000 });
    // The home page opens behind the title sequence, which locks scroll until it is
    // clicked away - and this checker measures by scrolling. Without this the walk down
    // the page silently does nothing on "/", no lazy image ever loads, and the overflow
    // test passes for the wrong reason. Each path gets a fresh tab, so the session flag
    // that would otherwise suppress it is never set.
    await page.evaluate(() => (document.documentElement.dataset.intro = "off"));

    // Scroll the page so lazy images mount, then give them a bounded chance to arrive.
    await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += window.innerHeight) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page
      .waitForFunction(() => [...document.images].every((i) => i.complete), { timeout: 12000 })
      .catch(() => {});
    await new Promise((r) => setTimeout(r, 500));

    const r = await page.evaluate(() => {
      window.scrollTo(4000, 0);
      const x = window.scrollX;
      window.scrollTo(0, 0);
      const nameless = (sel) =>
        [...document.querySelectorAll(sel)].filter(
          (el) => !el.textContent.trim() && !el.getAttribute("aria-label") && !el.getAttribute("title"),
        ).length;
      return {
        x,
        scrollW: document.documentElement.scrollWidth,
        inner: window.innerWidth,
        namelessLinks: nameless("a"),
        namelessBtns: nameless("button"),
      };
    });

    const ok = r.x === 0 && errs.length === 0 && r.namelessLinks === 0 && r.namelessBtns === 0;
    if (!ok) failures++;
    console.log(
      `${ok ? "ok  " : "FAIL"} ${w} ${p.padEnd(28)} status=${resp.status()} sw=${r.scrollW}/${r.inner} ` +
        `scrolledX=${r.x} namelessA=${r.namelessLinks} namelessBtn=${r.namelessBtns}` +
        (errs.length ? " errs=" + JSON.stringify(errs) : ""),
    );
    await page.close();
  }
}

await browser.close();
console.log(failures ? `\n${failures} failing` : "\nall clear");
process.exit(failures ? 1 : 0);
