// Check the title sequence: when it plays, when it does not, that it cannot be clicked
// away, that it always uncovers the page, and that the mark comes to rest upright.
//
// Usage: node tools/check-intro.mjs http://localhost:3000
//
// Two things here are deliberate.
//
// Most of it scrubs rather than waits. The sequence is three CSS animations, and
// getAnimations() hands back objects whose currentTime can be set - so a frame at
// exactly 1480ms is a frame at exactly 1480ms, not "a screenshot taken as soon after
// 1480ms as the renderer got round to it". Sampling by sleeping and reading ran up to
// 80ms late while this was written, which is the difference between the mark sitting
// upright and the mark apparently sitting flat.
//
// The angle test does not check the final rotation. The final rotation was never wrong:
// it is 1080deg, and the mark reads the same every 180. What Ilham saw was the slot lying
// flat for a fifth of a second while the easing crawled through 990deg - an extra
// keyframe that made the curve decelerate into it and accelerate out of it again. So what
// is guarded is the thing that was actually broken: wherever the spin is slow enough to
// read as stopped, it must not be anywhere near horizontal.
import puppeteer from "puppeteer-core";
import { PNG } from "pngjs";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const base = process.argv[2] ?? "http://localhost:3000";

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--hide-scrollbars"],
});

let failures = 0;
const ok = (name, detail = "") => console.log(`ok   ${name}${detail ? "   " + detail : ""}`);
const bad = (name, detail = "") => {
  failures++;
  console.log(`FAIL ${name}${detail ? "   " + detail : ""}`);
};
const check = (cond, name, detail) => (cond ? ok(name, detail) : bad(name, detail));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// A page per case. sessionStorage is per tab, so every case that has to look like a first
// visit needs its own one - a reused page is already carrying the flag.
async function fresh({ reduce = false, width = 1920 } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 1042 });
  if (reduce) {
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  }
  return page;
}

const state = (page) =>
  page.evaluate(() => {
    const el = document.querySelector(".intro");
    const cs = el && getComputedStyle(el);
    return {
      flag: document.documentElement.dataset.intro ?? null,
      present: !!el,
      display: cs?.display ?? null,
    };
  });

// --- when it plays ------------------------------------------------------------------
{
  const page = await fresh();
  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  const first = await state(page);
  check(first.flag === "on" && first.display !== "none", "first visit plays", `flag=${first.flag} display=${first.display}`);

  // Same tab, so the session flag is already set.
  await page.goto(base + "/work", { waitUntil: "domcontentloaded" });
  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  const again = await state(page);
  check(again.flag === "off" && again.display === "none", "second visit skipped", `flag=${again.flag} display=${again.display}`);
  await page.close();
}
{
  const page = await fresh();
  await page.goto(base + "/about", { waitUntil: "domcontentloaded" });
  const s = await state(page);
  check(s.flag === "off" && !s.present, "other route never draws it", `flag=${s.flag} present=${s.present}`);
  await page.close();
}
{
  const page = await fresh({ reduce: true });
  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  const s = await state(page);
  check(s.flag === "off" && s.display === "none", "reduced motion skips it", `flag=${s.flag} display=${s.display}`);
  await page.close();
}
{
  const page = await fresh();
  await page.goto(base + "/?intro", { waitUntil: "domcontentloaded" });
  const a = await state(page);
  await page.goto(base + "/?intro", { waitUntil: "domcontentloaded" });
  const b = await state(page);
  check(a.flag === "on" && b.flag === "on", "?intro replays on demand", `first=${a.flag} again=${b.flag}`);
  await page.close();
}

// --- it cannot be clicked away --------------------------------------------------------
{
  const page = await fresh();
  await page.goto(base + "/?intro", { waitUntil: "domcontentloaded" });
  await wait(700);
  await page.mouse.click(960, 520);
  await page.keyboard.press("Escape");
  await page.mouse.wheel({ deltaY: 400 });
  await wait(200);
  const s = await state(page);
  check(s.flag === "on" && s.display !== "none", "click, key and wheel do not skip it", `flag=${s.flag}`);
  await page.close();
}

// --- it always uncovers the page ------------------------------------------------------
{
  const page = await fresh();
  await page.goto(base + "/?intro", { waitUntil: "domcontentloaded" });
  await wait(3400);
  const clear = await page.evaluate(() => {
    const at = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    return { intro: !!at?.closest(".intro"), tag: at?.tagName ?? null, flag: document.documentElement.dataset.intro };
  });
  check(!clear.intro && clear.flag === "off", "page is reachable after the sequence", `hit=${clear.tag} flag=${clear.flag}`);
  await page.close();
}
{
  // The script is what ends it early; the CSS is what must end it at all. Strip the flag
  // and scrub to the end - an overlay that needs JavaScript to get out of the way is a door.
  const page = await fresh();
  await page.goto(base + "/?intro", { waitUntil: "domcontentloaded" });
  const s = await page.evaluate(() => {
    document.documentElement.removeAttribute("data-intro");
    const el = document.querySelector(".intro");
    const a = el.getAnimations()[0];
    a.pause();
    a.currentTime = 3000;
    const cs = getComputedStyle(el);
    return { visibility: cs.visibility, pointer: cs.pointerEvents };
  });
  check(
    s.visibility === "hidden" && s.pointer === "none",
    "CSS alone ends it with no script",
    `visibility=${s.visibility} pointer-events=${s.pointer}`,
  );
  await page.close();
}

// --- the mark ---------------------------------------------------------------------------
{
  const page = await fresh();
  await page.goto(base + "/?intro", { waitUntil: "domcontentloaded" });

  // The used width, not the painted rect: at this point the sequence has the mark scaled
  // to 0.05, so a bounding rect here reports 9px for a mark that is laid out at 182.
  const size = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.querySelector(".intro-mark svg")).width),
  );
  check(size >= 180, "mark is laid out at 7em at 1920", `${Math.round(size)}px`);

  // Nothing on screen through the opening wait - the dot used to arrive before anyone had
  // looked at the page.
  const early = await page.evaluate(() => {
    const mark = document.querySelector(".intro-mark");
    const a = mark.getAnimations()[0];
    a.pause();
    const out = [];
    for (const t of [0, 200, 400, 480]) {
      a.currentTime = t;
      out.push([t, Number(getComputedStyle(mark).opacity)]);
    }
    return out;
  });
  check(
    early.every(([, o]) => o === 0),
    "nothing shows for the first 500ms",
    early.map(([t, o]) => `${t}:${o}`).join(" "),
  );

  const spin = await page.evaluate(() => {
    const mark = document.querySelector(".intro-mark");
    const a = mark.getAnimations()[0];
    a.pause();
    const read = (t) => {
      a.currentTime = t;
      const r = getComputedStyle(mark).rotate;
      return r === "none" ? 0 : parseFloat(r);
    };
    const step = 20;
    const samples = [];
    for (let t = 520; t <= 1700; t += step) samples.push([t, read(t)]);
    const dwell = [];
    for (let i = 1; i < samples.length; i++) {
      const speed = Math.abs(samples[i][1] - samples[i - 1][1]) / (step / 1000);
      const mod = ((samples[i][1] % 180) + 180) % 180;
      if (speed < 250 && mod > 45 && mod < 135) {
        dwell.push(`${samples[i][0]}ms:${Math.round(samples[i][1])}deg@${Math.round(speed)}deg/s`);
      }
    }
    return { end: read(1700), dwell };
  });
  const rest = ((spin.end % 180) + 180) % 180;
  check(rest < 1 || rest > 179, "mark comes to rest upright", `${Math.round(spin.end)}deg`);
  check(spin.dwell.length === 0, "spin never dwells horizontal", spin.dwell.join(" "));

  // The ripple: out of nothing as the mark lands, and gone before the mark moves.
  const ring = await page.evaluate(() => {
    const el = document.querySelector(".intro-ring");
    const a = el.getAnimations()[0];
    a.pause();
    const at = (t) => {
      a.currentTime = t;
      const cs = getComputedStyle(el);
      return { o: Number(cs.opacity), s: parseFloat(cs.scale) || 1 };
    };
    return { before: at(1400), peak: at(1600), gone: at(2400) };
  });
  check(ring.before.o === 0, "no ripple before the mark lands", `opacity=${ring.before.o}`);
  check(
    ring.peak.o > 0.1 && ring.peak.s > ring.before.s,
    "ripple opens out of the mark",
    `opacity=${ring.peak.o.toFixed(2)} scale=${ring.peak.s.toFixed(2)}`,
  );
  check(ring.gone.o < 0.02, "ripple is gone before the mark moves", `opacity=${ring.gone.o.toFixed(3)}`);

  await page.close();
}

// --- the stacked arrangement ------------------------------------------------------------
{
  // Below 820px the mark sits above the words instead of beside them, and the words
  // centre. This is the case that shipped broken once: side by side, the mono line ran
  // off the right edge and DECISIONS was cut in half on a phone. So the test is simply
  // that at the end of the sequence everything is inside the viewport.
  const page = await fresh({ width: 375 });
  await page.goto(base + "/?intro", { waitUntil: "domcontentloaded" });
  // 2750ms, not the end: the overlay starts fading out at 92% and a frame taken after
  // that is measuring a half-transparent composite against the page behind it.
  const fit = await page.evaluate(() => {
    for (const el of [".intro", ".intro-mark", ".intro-words"]) {
      const a = document.querySelector(el).getAnimations()[0];
      a.pause();
      a.currentTime = 2750;
    }
    const box = (sel) => document.querySelector(sel).getBoundingClientRect();
    const mark = box(".intro-mark svg");
    const words = box(".intro-words");
    return {
      inside: words.left >= 0 && words.right <= innerWidth && mark.top >= 0 && words.bottom <= innerHeight,
      centred: getComputedStyle(document.querySelector(".intro-words")).justifyItems === "center",
      mark: [mark.top, mark.bottom],
      wordsBox: [words.top, words.bottom],
      words: `${Math.round(words.left)}..${Math.round(words.right)} of ${innerWidth}`,
    };
  });
  check(fit.inside, "words fit the viewport at 375", fit.words);

  // Stacking is read off the pixels rather than off the boxes. The name's box starts
  // above its capitals by the font's internal leading, so the mark's box and the words'
  // box overlap by a few pixels in a layout that has clear daylight between the ink -
  // which is how a correct composition first failed this test.
  const png = PNG.sync.read(await page.screenshot());
  const rows = [];
  for (let y = 0; y < png.height; y++) {
    let ink = 0;
    for (let x = 0; x < png.width; x++) {
      if (png.data[(png.width * y + x) << 2] < 120) ink++;
    }
    rows.push(ink > 0);
  }
  const runs = [];
  for (let y = 0; y < rows.length; y++) {
    if (!rows[y]) continue;
    const start = y;
    while (y + 1 < rows.length && rows[y + 1]) y++;
    runs.push([start, y]);
  }
  // Each run is matched to the box it must belong to rather than to a measured height:
  // the diamond does not fill its own box, the capitals do not fill theirs, and both of
  // those are the SVG's and the font's business, not this test's. Side by side, the mark
  // and the name share rows and the two collapse into one run.
  const inside = ([a, b], [top, bottom]) => a >= Math.floor(top) && b <= Math.ceil(bottom);
  const first = runs[0];
  const rest = runs.slice(1);
  check(
    runs.length >= 2 && first && inside(first, fit.mark),
    "the topmost ink is the mark, alone on its rows",
    first ? `run ${first[0]}-${first[1]} vs mark ${Math.round(fit.mark[0])}-${Math.round(fit.mark[1])}` : "no ink",
  );
  check(
    rest.length > 0 && rest.every((r) => inside(r, fit.wordsBox)),
    "every other band of ink is the words",
    `${rest.length} runs: ${rest.map(([a, b]) => `${a}-${b}`).join(" ")} vs words ${Math.round(fit.wordsBox[0])}-${Math.round(fit.wordsBox[1])}`,
  );
  check(fit.centred, "words are centred at 375");
  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} failed` : "\nsequence holds");
process.exit(failures ? 1 : 0);
