// Check the title sequence: when it plays, when it does not, that the first 3500ms
// cannot be clicked away, that a click after that ends it, and that the mark comes to
// rest upright.
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

{
  // The replay test used to match "intro" anywhere in the query string and ran before the
  // route gate, so a campaign link put a page that renders no overlay into the sequence
  // states - and 3500ms later the first Space or Enter was silently eaten.
  const page = await fresh();
  await page.goto(base + "/work?utm_campaign=introducing-ilham", { waitUntil: "domcontentloaded" });
  const stray = await state(page);
  check(stray.flag === "off" && !stray.present, "a campaign link is not a replay", `flag=${stray.flag}`);

  // A near miss on the home page needs a second visit to tell anything: the first one
  // plays whatever the query string says. ?intro would replay here; this must not.
  const page2 = await fresh();
  await page2.goto(base + "/", { waitUntil: "domcontentloaded" });
  await page2.goto(base + "/?utm_content=intro-video", { waitUntil: "domcontentloaded" });
  const near = await state(page2);
  check(near.flag === "off" && near.display === "none", "intro-video is not ?intro", `flag=${near.flag}`);
  await page.close();
  await page2.close();
}

// --- the first 3500ms cannot be clicked away ------------------------------------------
{
  const page = await fresh();
  await page.goto(base + "/?intro", { waitUntil: "domcontentloaded" });

  // Everything that used to dismiss it, and the two keys that still do once it is ready.
  await wait(700);
  await page.mouse.click(960, 520);
  await page.keyboard.press("Escape");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  for (let i = 0; i < 6; i++) await page.mouse.wheel({ deltaY: 400 });
  await wait(200);
  const during = await state(page);
  check(
    during.flag === "on" && during.display !== "none",
    "click, keys and wheel do nothing while it plays",
    `flag=${during.flag}`,
  );

  // Not the same question. The wheel never dismissed the overlay, but for a while it
  // still scrolled the document behind it: six ticks put the page 2400px down and the
  // click that followed dropped the visitor below the heading the sequence introduces.
  // Asserting the flag alone passed throughout.
  const scrolled = await page.evaluate(() => ({
    y: Math.round(scrollY),
    html: getComputedStyle(document.documentElement).overflowY,
  }));
  check(scrolled.y === 0, "the page does not travel behind it", `scrollY=${scrolled.y} html overflow-y=${scrolled.html}`);

  // Tab is held too, or focus walks into the header behind an opaque layer and Enter
  // follows a link nobody saw themselves choose.
  for (let i = 0; i < 4; i++) await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await wait(250);
  const stayed = await page.evaluate(() => ({
    path: location.pathname,
    focus: document.activeElement?.tagName ?? null,
    flag: document.documentElement.dataset.intro,
  }));
  check(
    stayed.path === "/" && stayed.flag === "on",
    "tab and enter cannot navigate out from under it",
    `path=${stayed.path} focus=${stayed.focus} flag=${stayed.flag}`,
  );

  // The cue must not be offering a click that is not wired up yet.
  const cueEarly = await page.evaluate(() => Number(getComputedStyle(document.querySelector(".intro-cue")).opacity));
  check(cueEarly === 0, "no cue while it plays", `opacity=${cueEarly}`);

  // 3500ms, measured from navigation; the waits above already spent ~900 of it.
  await wait(2800);
  const ready = await state(page);
  await wait(600); // the cue fades in over 520ms; read it after, not through it
  const cueUp = await page.evaluate(() => ({
    opacity: Number(getComputedStyle(document.querySelector(".intro-cue")).opacity),
    cursor: getComputedStyle(document.querySelector(".intro")).cursor,
  }));
  check(ready.flag === "ready", "it arms itself at 3500ms", `flag=${ready.flag}`);
  check(cueUp.opacity > 0.9 && cueUp.cursor === "pointer", "the cue comes up with it", `opacity=${cueUp.opacity} cursor=${cueUp.cursor}`);

  // The held tail, read live rather than scrubbed. Every composition check in this file
  // pauses an animation and sets currentTime, which reads the keyframes back to itself:
  // drop the `both` fill while editing the duration and the mark snaps home to centre at
  // 3500ms, on top of the words, and every scrub still passes. This is the frame the
  // visitor actually sits in front of, for as long as they like.
  const tail = await page.evaluate(() => {
    const mark = document.querySelector(".intro-mark");
    const words = document.querySelector(".intro-words");
    const cs = getComputedStyle(mark);
    const w = getComputedStyle(words);
    return {
      markTranslate: cs.translate,
      markRotate: cs.rotate,
      wordsOpacity: Number(w.opacity),
      wordsClip: w.clipPath,
      apart: Math.round(words.getBoundingClientRect().left - mark.getBoundingClientRect().right),
    };
  });
  check(
    tail.apart > 0 && tail.wordsOpacity === 1 && !tail.wordsClip.includes("100%"),
    "the held frame is the composition, not the unanimated page",
    `mark translate=${tail.markTranslate} words clip=${tail.wordsClip} gap=${tail.apart}px`,
  );

  // Enter on its own, before the click is tried: the only keyboard assertion used to be
  // that keys do nothing, which is satisfied just as well by the handler not existing.
  await page.keyboard.press("Enter");
  await wait(700);
  const byEnter = await state(page);
  check(byEnter.flag === "off", "Enter ends it once it is ready", `flag=${byEnter.flag}`);
  await page.close();
}
{
  const page = await fresh();
  await page.goto(base + "/?intro", { waitUntil: "domcontentloaded" });
  await wait(4000);
  await page.keyboard.press("Space");
  await wait(700);
  const bySpace = await state(page);
  check(bySpace.flag === "off", "Space ends it once it is ready", `flag=${bySpace.flag}`);
  await page.close();
}
{
  const page = await fresh();
  await page.goto(base + "/?intro", { waitUntil: "domcontentloaded" });
  await wait(4000);

  // And now the click works.
  await page.mouse.click(960, 520);
  await wait(900);
  const after = await page.evaluate(() => {
    const at = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    return { intro: !!at?.closest(".intro"), tag: at?.tagName ?? null, flag: document.documentElement.dataset.intro };
  });
  check(after.flag === "off" && !after.intro, "a click after that ends it", `hit=${after.tag} flag=${after.flag}`);
  await page.close();
}
{
  // The cue has to leave with the overlay rather than blink out under it. Its rule was
  // keyed on "ready" alone, so the click took the animation off the element and dropped
  // it to its base opacity in one frame with 390ms of the lift still to run.
  const page = await fresh();
  await page.goto(base + "/?intro", { waitUntil: "domcontentloaded" });
  await wait(4200);
  const together = await page.evaluate(async () => {
    document.documentElement.dataset.intro = "out";
    await new Promise((r) => setTimeout(r, 120));
    return {
      cue: Number(getComputedStyle(document.querySelector(".intro-cue")).opacity),
      intro: Number(getComputedStyle(document.querySelector(".intro")).opacity),
    };
  });
  check(
    together.cue > 0.5 && together.intro < 1,
    "the cue leaves with the overlay, not before it",
    `cue=${together.cue.toFixed(2)} overlay=${together.intro.toFixed(2)}`,
  );
  await page.close();
}
{
  // Scripting on, this script blocked: the case noscript cannot see. A CSP header is the
  // honest way to reproduce it, so the page is re-served with one and the overlay has to
  // let go on its own.
  const page = await fresh();
  const html = (await (await fetch(base + "/")).text()).replace(
    "<head>",
    `<head><base href="${base}/"><meta http-equiv="Content-Security-Policy" content="script-src 'none'">`,
  );
  // domcontentloaded, not networkidle0: over HTTPS something always keeps a connection
  // open and the idle never arrives. The 5200ms wait below covers the stylesheet.
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await wait(5200);
  const released = await page.evaluate(() => {
    const el = document.querySelector(".intro");
    const cs = getComputedStyle(el);
    return {
      flag: document.documentElement.dataset.intro ?? null,
      visibility: cs.visibility,
      pointer: cs.pointerEvents,
    };
  });
  check(
    released.flag === null && released.visibility === "hidden" && released.pointer === "none",
    "a blocked inline script still lets go at 4000ms",
    `flag=${released.flag} visibility=${released.visibility} pointer-events=${released.pointer}`,
  );
  await page.close();
}
{
  // Left alone it stays. This is the whole point of the change and also its one hazard,
  // so it is worth asserting rather than assuming.
  const page = await fresh();
  await page.goto(base + "/?intro", { waitUntil: "domcontentloaded" });
  await wait(6000);
  const held = await page.evaluate(() => {
    const at = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    const cs = getComputedStyle(document.querySelector(".intro"));
    return {
      covered: !!at?.closest(".intro"),
      flag: document.documentElement.dataset.intro,
      visibility: cs.visibility,
      opacity: Number(cs.opacity),
    };
  });
  check(
    held.covered && held.flag === "ready" && held.visibility === "visible" && held.opacity === 1,
    "it waits indefinitely if nobody clicks",
    `flag=${held.flag} visibility=${held.visibility} opacity=${held.opacity}`,
  );
  await page.close();
}
{
  // The sequence can no longer take itself away, so the one thing that must not happen is
  // a visitor meeting a door with no handle. With scripting off the overlay is not drawn
  // at all, and the only honest way to test that is to turn scripting off - which also
  // means page.evaluate is unavailable, so this reads pixels.
  const page = await fresh();
  await page.setJavaScriptEnabled(false);
  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  const png = PNG.sync.read(await page.screenshot({ clip: { x: 0, y: 0, width: 1920, height: 110 } }));
  let ink = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i] < 120) ink++;
  }
  check(ink > 200, "with scripting off the overlay is never drawn", `${ink} ink pixels in the header band`);
  await page.close();
}

{
  // Where scrollbars take up space, releasing the lock widens the page by one scrollbar
  // and slides a centred layout sideways by half of it. That reflow has to happen while
  // the overlay still covers it, which is why "out" is not one of the locked states - so
  // what is asserted is the ordering: the moment the lock is gone, the overlay is still
  // opaque. An equality test would pass vacuously here, because this browser runs with
  // --hide-scrollbars and has nothing to give back.
  const page = await fresh();
  await page.goto(base + "/?intro", { waitUntil: "domcontentloaded" });
  await wait(4000);
  const order = await page.evaluate(async () => {
    document.documentElement.dataset.intro = "out";
    await new Promise((r) => requestAnimationFrame(r));
    return {
      overflow: getComputedStyle(document.documentElement).overflowY,
      opacity: Number(getComputedStyle(document.querySelector(".intro")).opacity),
    };
  });
  check(
    order.overflow === "visible" && order.opacity > 0.85,
    "scroll is given back while the overlay still covers the page",
    `html overflow-y=${order.overflow} overlay opacity=${order.opacity.toFixed(2)}`,
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
  // 2750ms: past 2640, where the words finish settling, and well short of the 3500 that
  // brings the cue up - the cue is at the foot of the screen and would be a fourth band
  // of ink in the read below.
  const fit = await page.evaluate(() => {
    // The attribute goes before the scrub. Left on "on" the script would flip it to
    // "ready" at 3500ms and bring the cue up mid-test, which would land a fourth band of
    // ink at the foot of the frame; the timer only fires while the state is still "on".
    document.documentElement.removeAttribute("data-intro");
    for (const el of [".intro-mark", ".intro-words"]) {
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
