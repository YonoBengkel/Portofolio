import puppeteer from "puppeteer-core";
const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const url = process.argv[2];
const b = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--hide-scrollbars"] });
const page = await b.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
await new Promise((r) => setTimeout(r, 1500));
console.log(await page.evaluate(() => {
  const bands = [...document.querySelectorAll(".hero-band")];
  if (!bands.length) return "pita tidak ketemu";
  const words = ["Process(atas)", "Data", "Decisions(atas)", "Evidence", "Process(bawah)", "Decisions(bawah)"];
  return bands.map((el, i) => {
    const dir = getComputedStyle(el.querySelector(".hero-band-run")).animationDirection;
    const side = getComputedStyle(el.querySelector(".hero-band-in")).getPropertyValue("--side").trim();
    const text = dir === "reverse" ? "kiri->kanan" : "kanan->kiri";
    const from = side === "1" ? "kiri" : "kanan";
    const paired = (dir === "reverse") === (side === "-1") ? "ok" : "TIDAK BERPASANGAN";
    return `  ${words[i].padEnd(17)} tulisan ${text.padEnd(12)} masuk dari ${from.padEnd(6)} ${paired}`;
  }).join("\n");
}));
await b.close();
