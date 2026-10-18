import puppeteer from "puppeteer-core";
const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const b = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--hide-scrollbars"] });
const page = await b.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("https://ilhambintangporto.vercel.app/", { waitUntil: "networkidle2", timeout: 60000 });
await new Promise((r) => setTimeout(r, 1500));
console.log(await page.evaluate(() => {
  const bands = [...document.querySelectorAll(".hero-band")];
  if (!bands.length) return "pita tidak ketemu";
  return bands.map((el, i) => {
    const run = el.querySelector(".hero-band-run");
    const cs = getComputedStyle(run);
    const word = run.textContent.trim().split(/\s+/)[0];
    const side = getComputedStyle(el.querySelector(".hero-band-in")).getPropertyValue("--side").trim();
    return `  ${i} ${word.padEnd(10)} animation-direction=${cs.animationDirection.padEnd(8)} --dir=${getComputedStyle(el).getPropertyValue("--dir").trim() || "(kosong)"} --side=${side}`;
  }).join("\n");
}));
await b.close();
