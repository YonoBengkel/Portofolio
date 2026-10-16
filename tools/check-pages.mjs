import puppeteer from "puppeteer-core";
const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const base = process.argv[2];
const paths = ["/", "/about", "/work", "/work/warungku", "/work/sales-data-warehouse", "/cv", "/contact", "/about/competitions", "/about/activities"];
const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args:["--hide-scrollbars"] });
for (const w of [1440, 375]) {
  for (const p of paths) {
    const page = await browser.newPage();
    const errs = [];
    page.on("console", m => { if (m.type() === "error") errs.push(m.text().slice(0,120)); });
    page.on("pageerror", e => errs.push("PAGEERROR " + String(e).slice(0,120)));
    await page.setViewport({ width: w, height: 900 });
    const resp = await page.goto(base + p, { waitUntil: "domcontentloaded" });
    await new Promise(r=>setTimeout(r,1400));
    const r = await page.evaluate(() => {
      window.scrollTo(4000,0); const x = window.scrollX; window.scrollTo(0,0);
      // any element wider than the viewport that is actually reachable
      const imgsNoAlt = [...document.images].filter(i => i.alt === null || i.alt === undefined).length;
      const links = [...document.querySelectorAll("a")].filter(a => !a.textContent.trim() && !a.getAttribute("aria-label")).length;
      const btns = [...document.querySelectorAll("button")].filter(b => !b.textContent.trim() && !b.getAttribute("aria-label")).length;
      return { x, scrollW: document.documentElement.scrollWidth, inner: innerWidth, imgsNoAlt, namelessLinks: links, namelessBtns: btns };
    });
    const ok = r.x === 0 && r.scrollW <= r.inner + 1 && errs.length === 0 && r.namelessLinks === 0 && r.namelessBtns === 0;
    console.log(`${ok ? "ok  " : "FAIL"} ${w} ${p.padEnd(28)} status=${resp.status()} sw=${r.scrollW}/${r.inner} scrolledX=${r.x} namelessA=${r.namelessLinks} namelessBtn=${r.namelessBtns}` + (errs.length ? " errs=" + JSON.stringify(errs) : ""));
    await page.close();
  }
}
await browser.close();
