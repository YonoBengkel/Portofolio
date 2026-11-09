/**
 * The 3D tools keyboard: a three.js scene, loaded only when the tools section is near.
 *
 * Ilham asked on 9 Nov 2026 for Naresh Khatri's keyboard (github.com/Naresh-Khatri/
 * 3d-portfolio, MIT) with his own tools on it. What is taken is the asset and the
 * geometry: the keycap model (public/assets/keyboard/keycaps.glb, one cap in key-width
 * units), the dimensions it is built to (KIT below, from his scene.ts), the case shape
 * (keyWell below, ported from his key-well.ts), the camera angle and the key sounds. The
 * licence is in public/assets/keyboard/LICENSE.txt. What is not taken is his runtime -
 * @chibi3d/runtime brings drei, postprocessing, zod and jszip for things this page does
 * not do - or his signature pieces, the bongo cat and the shared press counter. This is
 * plain three.js, about the smallest thing that draws his keyboard.
 *
 * It draws only when something changes: a key going down or up, the board leaning to
 * the pointer, the keys dropping in the first time it is seen, the screen's caret. A
 * keyboard nobody is touching costs no frames beyond that caret, and the caret stops
 * when the board is off screen or the tab is hidden.
 *
 * The screen that names the key stands on the back rim of the case, behind the top row,
 * since Ilham asked on 9 Nov 2026 for the strip to sit on the board at the board's own
 * angle. It is part of the scene rather than an overlay, so it leans with the board, the
 * top row hides its foot, and its face is lit by nothing: a screen gives its own light.
 * Only where the text is big enough to read (KeyboardOptions.screen.query); below that
 * the page keeps its flat strip above the board.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// Geometry contract of keycaps.glb, in key-width units (Naresh Khatri, scene.ts).
const KIT = {
  pitch: 1.04468,
  keyY: 1.21117,
  keyHeight: 0.7629,
  logoY: 0.13985,
  keyTop: 0.13102987408638,
  cutX: 3.189,
  cutZ: 2.053,
  halfW: 3.67448,
  halfD: 2.57744,
};
const PRESS = -KIT.keyHeight * 0.6;
const MODEL_URL = "/assets/keyboard/keycaps.glb";
const CASE = "#1d120a";
const PLATE = "#110a05";
// The screen, in the strip's own colours (.kb-screen in globals.css).
const SCREEN_BG = "#120802";
const SCREEN_ON = "#f2b705";
// The strip dims to 62%; at the slant the screen is seen at, that read as brown, so 74.
const SCREEN_DIM = "rgba(242, 183, 5, 0.74)";

export type ScreenOptions = {
  /** What the screen says while each key is down, in key order. */
  labels: { name: string; group: string }[];
  /** What it says while none is. */
  idle: string;
  /** The strip's computed font-family, so the screen is set in the page's own mono. */
  font: string;
  /** Where the screen is on the board; elsewhere the page's flat strip does the job. */
  query: string;
};

export type KeyboardOptions = {
  canvas: HTMLCanvasElement;
  /** One SVG document per key, in key order, already in the colour it is drawn in. */
  logos: string[];
  colors: string[];
  columns: number;
  still: boolean;
  onSelect: (index: number | null) => void;
  screen?: ScreenOptions;
};

export type KeyboardHandle = {
  press: (index: number, down: boolean, source: string) => void;
  reveal: () => void;
  dispose: () => void;
};

/* ------------------------------------------------------------------ the case */
// Ported from Naresh Khatri's key-well.ts (MIT): rounded contours stacked into a shell
// with a recessed opening, and a plate at the bottom of the opening.
const CORNER_SEGMENTS = 16;
type Contour = { halfWidth: number; halfDepth: number; radius: number; y: number };

function roundedContour({ halfWidth, halfDepth, radius, y }: Contour): number[] {
  const positions: number[] = [];
  for (let corner = 0; corner < 4; corner++) {
    const angle = (corner * Math.PI) / 2;
    const cx = (corner === 0 || corner === 3 ? 1 : -1) * (halfWidth - radius);
    const cz = (corner < 2 ? 1 : -1) * (halfDepth - radius);
    for (let step = 0; step <= CORNER_SEGMENTS; step++) {
      const theta = angle + (step / CORNER_SEGMENTS) * (Math.PI / 2);
      positions.push(cx + Math.cos(theta) * radius, y, cz + Math.sin(theta) * radius);
    }
  }
  return positions;
}

function keyWell(outerX: number, outerZ: number, keysWidth: number, keysDepth: number) {
  const opening = { halfWidth: keysWidth / 2 + 0.07, halfDepth: keysDepth / 2 + 0.07, radius: 0.12 };
  const profiles: Contour[] = [
    { halfWidth: outerX - 0.08, halfDepth: outerZ - 0.08, radius: 0.26, y: 0 },
    { halfWidth: outerX, halfDepth: outerZ, radius: 0.34, y: 0.08 },
    { halfWidth: outerX, halfDepth: outerZ, radius: 0.34, y: 0.65 },
    { halfWidth: outerX - 0.018, halfDepth: outerZ - 0.018, radius: 0.322, y: 0.73 },
    { halfWidth: outerX - 0.055, halfDepth: outerZ - 0.055, radius: 0.285, y: 0.77 },
    { halfWidth: opening.halfWidth + 0.025, halfDepth: opening.halfDepth + 0.025, radius: opening.radius + 0.025, y: 0.77 },
    { ...opening, y: 0.745 },
    { ...opening, y: 0.6 },
  ];
  const rings = profiles.map(roundedContour);
  const count = (CORNER_SEGMENTS + 1) * 4;
  const shell: number[] = [];
  const v = (level: number, i: number) => rings[level].slice(i * 3, i * 3 + 3);
  for (let level = 0; level < profiles.length - 1; level++) {
    for (let i = 0; i < count; i++) {
      const j = (i + 1) % count;
      const a = v(level, i), b = v(level + 1, i), c = v(level + 1, j), d = v(level, j);
      shell.push(...a, ...b, ...c, ...a, ...c, ...d);
    }
  }
  // the underside
  for (let i = 1; i < count - 1; i++) shell.push(...v(0, 0), ...v(0, i), ...v(0, i + 1));
  const plateRing = roundedContour({ ...opening, y: 0.6 });
  const plate: number[] = [];
  for (let i = 0; i < count; i++) {
    const j = (i + 1) % count;
    plate.push(0, 0.6, 0, ...plateRing.slice(j * 3, j * 3 + 3), ...plateRing.slice(i * 3, i * 3 + 3));
  }
  const geo = (p: number[]) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
    g.computeVertexNormals();
    return g;
  };
  return { shell: geo(shell), plate: geo(plate) };
}

/* ----------------------------------------------------------------- textures */
function svgTexture(svg: string, size = 256): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const ctx = c.getContext("2d");
      if (!ctx) return reject(new Error("no 2d context"));
      const pad = size * 0.1;
      ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      resolve(t);
    };
    img.onerror = () => reject(new Error("logo failed to load"));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

/*
  The screen's text, painted the way the strip sets it: upper case, the page's mono with
  0.08em of tracking, the prompt and the tool's name in full yellow and the rest dimmed,
  and a block caret. All of it at 500: at the slant the screen is seen at, the strip's
  400 for the dimmed part thinned to nothing.

  One size for every line, taken from the longest line there can be, so the text does
  not grow and shrink from key to key. Mono means every character has the same advance,
  which makes the longest line's width plain arithmetic.
*/
type Run = { text: string; on: boolean };
const screenPad = (h: number) => h * 0.3;
function screenSize(ctx: CanvasRenderingContext2D, family: string, longest: number) {
  const { width: w, height: h } = ctx.canvas;
  ctx.font = `500 100px ${family}`;
  const perPx = ctx.measureText("M").width / 100 + 0.08;
  return Math.min(h * 0.5, (w - screenPad(h) * 2) / (longest * perPx + 0.75));
}
function paintScreen(ctx: CanvasRenderingContext2D, runs: Run[], caret: boolean, family: string, size: number) {
  const { width: w, height: h } = ctx.canvas;
  ctx.fillStyle = SCREEN_BG;
  ctx.fillRect(0, 0, w, h);
  ctx.font = `500 ${size}px ${family}`;
  const step = ctx.measureText("M").width + size * 0.08;
  ctx.textBaseline = "middle";
  const y = h / 2 + size * 0.05;
  let x = screenPad(h);
  for (const run of runs) {
    ctx.fillStyle = run.on ? SCREEN_ON : SCREEN_DIM;
    for (const ch of run.text.toUpperCase()) {
      ctx.fillText(ch, x, y);
      x += step;
    }
  }
  if (caret) {
    ctx.fillStyle = SCREEN_ON;
    ctx.fillRect(x + size * 0.12, y - size * 0.56, size * 0.6, size * 1.1);
  }
}

/* ------------------------------------------------------------------- easing */
const easeOutBack = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export async function mountKeyboard(o: KeyboardOptions): Promise<KeyboardHandle> {
  const { canvas, logos, colors, columns, still, onSelect, screen: screenOpts } = o;
  const n = colors.length;
  const cols = Math.min(columns, n);
  const rows = Math.ceil(n / cols);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // Shadows are redrawn only in frames where something moved (see frame and kick): the
  // caret's blink changes the screen and nothing else, so it skips the shadow pass.
  renderer.shadowMap.autoUpdate = false;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.45;

  // Naresh's camera: from the front left, above, looking slightly down at the middle.
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.set(-9, 9.6, 9);
  camera.lookAt(0, 0.6, 0);

  const key = new THREE.DirectionalLight(0xffffff, 2.6);
  key.position.set(-6, 8, -3);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -7;
  key.shadow.camera.right = 7;
  key.shadow.camera.top = 7;
  key.shadow.camera.bottom = -7;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.45);
  fill.position.set(4, 6, 6);
  scene.add(fill);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x2a1a10, 0.55));

  // The board: a placement group that leans to the pointer, holding the layout.
  const board = new THREE.Group();
  scene.add(board);
  const innerX = KIT.cutX + ((cols - 6) * KIT.pitch) / 2;
  const innerZ = KIT.cutZ + ((rows - 4) * KIT.pitch) / 2;
  const span = innerX + innerZ + KIT.halfW - KIT.cutX + KIT.halfD - KIT.cutZ;
  const fit = Math.min(1.2, (KIT.halfW + KIT.halfD) / span);
  const layout = new THREE.Group();
  layout.scale.setScalar(fit);
  layout.position.y = -((KIT.keyY + KIT.keyTop) / 2) * fit;
  board.add(layout);

  const outerX = innerX + KIT.halfW - KIT.cutX;
  const outerZ = innerZ + KIT.halfD - KIT.cutZ;
  const well = keyWell(outerX, outerZ, (cols - 1) * KIT.pitch + 1, (rows - 1) * KIT.pitch + 1);
  const caseMat = new THREE.MeshStandardMaterial({ color: CASE, roughness: 0.64, side: THREE.DoubleSide });
  const plateMat = new THREE.MeshStandardMaterial({ color: PLATE, roughness: 0.82, side: THREE.DoubleSide });
  const shell = new THREE.Mesh(well.shell, caseMat);
  shell.castShadow = shell.receiveShadow = true;
  const plate = new THREE.Mesh(well.plate, plateMat);
  plate.receiveShadow = true;
  layout.add(shell, plate);

  /* ---------------------------------------------------------- the screen */
  // On the flat of the back rim, behind the top row. The rim's top is at y 0.77 (keyWell's
  // profiles) and runs from just outside the opening to just inside the rounded edge. The
  // face starts 0.45 above it: from this camera, anything on the face above y 1.2 is seen
  // over the top row's caps, so the text is never behind a key; the bezel below it is.
  // The face is only as tall as the text needs, so the bar adds as little as it can to
  // the height the board is framed in.
  const RIM_Y = 0.77;
  const rimIn = ((rows - 1) * KIT.pitch + 1) / 2 + 0.07 + 0.025;
  const rimOut = outerZ - 0.055;
  const BAR = {
    w: (cols - 1) * KIT.pitch + 1.08,
    h: 1.03,
    d: Math.min(0.24, rimOut - rimIn - 0.06),
    z: -(rimIn + rimOut) / 2,
    faceLift: 0.45,
    faceH: 0.46,
  };
  const faceW = BAR.w - 0.3;
  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = 2048;
  screenCanvas.height = Math.round((2048 * BAR.faceH) / faceW);
  const screenCtx = screenCanvas.getContext("2d");
  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  // The face is always seen at a slant, which is what anisotropic filtering is for.
  screenTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const bezelGeo = new RoundedBoxGeometry(BAR.w, BAR.h, BAR.d, 4, 0.06);
  const faceGeo = new THREE.PlaneGeometry(faceW, BAR.faceH);
  const bezel = new THREE.Mesh(bezelGeo, caseMat);
  bezel.position.set(0, RIM_Y + BAR.h / 2, BAR.z);
  // It takes the light's shadow but casts none: cast, it lays a dark band across the top
  // row, which reads as something wrong with those keys rather than as a shadow.
  bezel.receiveShadow = true;
  const face = new THREE.Mesh(faceGeo, new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
  face.position.set(0, RIM_Y + BAR.faceLift + BAR.faceH / 2, BAR.z + BAR.d / 2 + 0.004);
  const screenGroup = new THREE.Group();
  screenGroup.add(bezel, face);
  layout.add(screenGroup);
  const wide = screenOpts && screenCtx ? matchMedia(screenOpts.query) : null;
  screenGroup.visible = !!wide?.matches;

  let shown: number | null = null;
  let caretOn = true;
  const runsFor = (i: number | null): Run[] => {
    const label = i !== null ? screenOpts?.labels[i] : undefined;
    return label
      ? [
          { text: "> ", on: true },
          { text: label.name, on: true },
          { text: ` · ${label.group}`, on: false },
        ]
      : [
          { text: "> ", on: true },
          { text: screenOpts?.idle ?? "", on: false },
        ];
  };
  const lines = [null, ...colors.map((_, i) => i)].map((i) => runsFor(i).reduce((n, r) => n + r.text.length, 0));
  const longest = Math.max(...lines);
  let textSize = screenCtx && screenOpts ? screenSize(screenCtx, screenOpts.font, longest) : 0;
  const repaint = () => {
    if (!screenCtx || !screenOpts) return;
    paintScreen(screenCtx, runsFor(shown), caretOn, screenOpts.font, textSize);
    screenTex.needsUpdate = true;
  };
  repaint();

  // The keycap model and the logos, in parallel.
  const [gltf, textures] = await Promise.all([
    new GLTFLoader().loadAsync(MODEL_URL),
    Promise.all(logos.map((svg) => svgTexture(svg))),
  ]);
  let capGeo: THREE.BufferGeometry | null = null;
  gltf.scene.traverse((obj) => {
    if (!capGeo && (obj as THREE.Mesh).isMesh && obj.name === "keycap") capGeo = (obj as THREE.Mesh).geometry;
  });
  if (!capGeo) throw new Error("keycap mesh missing from the model");
  const logoGeo = new THREE.PlaneGeometry(0.52, 0.52);

  type Key = {
    motion: THREE.Group;
    mat: THREE.MeshPhysicalMaterial;
    mesh: THREE.Mesh;
    offset: number;
    target: number;
    glow: number;
    drop: number; // entrance offset, above the board
    dropAt: number; // ms after reveal when this key starts to fall
  };
  const keys: Key[] = colors.map((color, i) => {
    const slot = new THREE.Group();
    slot.position.set(((i % cols) - (cols - 1) / 2) * KIT.pitch, KIT.keyY, (Math.floor(i / cols) - (rows - 1) / 2) * KIT.pitch);
    const motion = new THREE.Group();
    slot.add(motion);
    const mat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.34, clearcoat: 0.12, clearcoatRoughness: 0.38 });
    const mesh = new THREE.Mesh(capGeo!, mat);
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.userData.index = i;
    motion.add(mesh);
    const logo = new THREE.Mesh(
      logoGeo,
      new THREE.MeshStandardMaterial({ map: textures[i], transparent: true, roughness: 0.6, color: 0xffffff }),
    );
    logo.position.y = KIT.logoY;
    logo.rotation.x = -Math.PI / 2;
    logo.receiveShadow = true;
    mesh.add(logo);
    layout.add(slot);
    const row = Math.floor(i / cols);
    const col = i % cols;
    return { motion, mat, mesh, offset: 0, target: 0, glow: 0, drop: still ? 0 : 3.2, dropAt: row * 110 + col * 45 };
  });
  if (!still) for (const k of keys) k.motion.position.y = k.drop;
  board.visible = still;

  /* ------------------------------------------------------------- sizing */
  // The board at rest, as eight corners seen from the camera: the frame is fitted to these,
  // so the board sits centred and whole in a canvas of any shape. With the screen up, its
  // own eight corners join them.
  camera.updateMatrixWorld();
  const seenFrom = (box: THREE.Box2, xs: number[], ys: number[], zs: number[]) => {
    const p = new THREE.Vector3();
    for (const x of xs)
      for (const y of ys)
        for (const z of zs) {
          p.set(x, y, z).applyMatrix4(camera.matrixWorldInverse);
          box.expandByPoint(new THREE.Vector2(p.x, p.y));
        }
    return box;
  };
  const y0 = layout.position.y;
  const boardView = seenFrom(
    new THREE.Box2(),
    [-outerX * fit, outerX * fit],
    [y0, y0 + (KIT.keyY + KIT.keyTop) * fit],
    [-outerZ * fit, outerZ * fit],
  );
  const screenView = seenFrom(
    boardView.clone(),
    [(-BAR.w / 2) * fit, (BAR.w / 2) * fit],
    [y0 + RIM_Y * fit, y0 + (RIM_Y + BAR.h) * fit],
    [(BAR.z - BAR.d / 2) * fit, (BAR.z + BAR.d / 2) * fit],
  );
  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    const view = screenGroup.visible ? screenView : boardView;
    const c = view.getCenter(new THREE.Vector2());
    const size = view.getSize(new THREE.Vector2());
    // A little air round the board, so a key that leans or drops in never touches the edge.
    const halfH = Math.max(size.y / 2, size.x / 2 / aspect) * 1.1;
    const halfW = halfH * aspect;
    camera.left = c.x - halfW;
    camera.right = c.x + halfW;
    camera.top = c.y + halfH;
    camera.bottom = c.y - halfH;
    camera.updateProjectionMatrix();
    kick();
  };

  /* ----------------------------------------------------------- the loop */
  let raf = 0;
  let last = performance.now();
  let revealAt = -1;
  let shadowsDirty = true;
  let wasMoving = false;
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(48, now - last);
    last = now;
    let moving = false;
    const k1 = 1 - Math.exp(-dt / 32);
    for (const k of keys) {
      // the press: ~100ms down or up
      if (Math.abs(k.target - k.offset) > 0.001) {
        k.offset += (k.target - k.offset) * k1;
        moving = true;
      } else k.offset = k.target;
      const g = k.target < 0 ? 0.7 : 0;
      if (Math.abs(g - k.glow) > 0.005) {
        k.glow += (g - k.glow) * k1;
        moving = true;
      } else k.glow = g;
      k.mat.emissive.copy(k.mat.color);
      k.mat.emissiveIntensity = k.glow;
      // the entrance: each key falls into its slot, a little late after the one before
      let drop = 0;
      if (k.drop > 0 && revealAt >= 0) {
        const t = (now - revealAt - k.dropAt) / 620;
        if (t >= 1) k.drop = 0;
        else if (t > 0) drop = (1 - easeOutBack(t)) * 3.2;
        else drop = 3.2;
        moving = moving || k.drop > 0;
      } else if (k.drop > 0) drop = k.drop;
      k.motion.position.y = k.offset + drop;
    }
    if (!still) {
      tilt.x += (tilt.tx - tilt.x) * k1 * 0.5;
      tilt.y += (tilt.ty - tilt.y) * k1 * 0.5;
      if (Math.abs(tilt.tx - tilt.x) + Math.abs(tilt.ty - tilt.y) > 0.0005) moving = true;
      board.rotation.set(tilt.x, tilt.y, 0);
    }
    if (moving || wasMoving || shadowsDirty) renderer.shadowMap.needsUpdate = true;
    shadowsDirty = false;
    wasMoving = moving;
    renderer.render(scene, camera);
    if (moving) raf = requestAnimationFrame(frame);
  };
  function kick(shadows = true) {
    if (shadows) shadowsDirty = true;
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  /* ------------------------------------------------------- the pointer */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const meshes = keys.map((k) => k.mesh);
  const held: { source: string; index: number }[] = [];

  // The caret blinks at the strip's own rate (kb-blink: 1.1s, two steps), which costs a
  // frame every 550ms - so only while the screen is up, the board is on screen and the
  // tab is in front. A key going down holds it solid and starts the blink over, as a
  // terminal's caret does while you type.
  let blink = 0;
  let onScreen = false;
  const awake = () =>
    screenGroup.visible && board.visible && onScreen && document.visibilityState === "visible";
  const restartBlink = () => {
    clearInterval(blink);
    blink = 0;
    if (!awake()) return;
    blink = window.setInterval(() => {
      caretOn = !caretOn;
      repaint();
      kick(false);
    }, 550);
  };
  const wake = () => {
    if (!awake()) {
      clearInterval(blink);
      blink = 0;
    } else if (!blink) restartBlink();
  };
  const seen = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    wake();
  });
  seen.observe(canvas);
  document.addEventListener("visibilitychange", wake);
  const onWide = () => {
    screenGroup.visible = !!wide?.matches;
    resize();
    wake();
  };
  wide?.addEventListener("change", onWide);

  const announce = () => {
    const now = held.length ? held[held.length - 1].index : null;
    onSelect(now);
    if (now === shown) return;
    shown = now;
    caretOn = true;
    repaint();
    restartBlink();
  };

  const press = (index: number, down: boolean, source: string) => {
    const was = held.findIndex((h) => h.source === source);
    if (was >= 0) {
      const prev = held[was].index;
      held.splice(was, 1);
      if (!held.some((h) => h.index === prev)) keys[prev].target = 0;
    }
    if (down && index >= 0) {
      held.push({ source, index });
      keys[index].target = PRESS;
    }
    announce();
    kick();
  };

  const pick = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(meshes, false)[0];
    return hit ? (hit.object.userData.index as number) : -1;
  };
  let hovered = -1;
  const onMove = (e: PointerEvent) => {
    if (!still) {
      const r = canvas.getBoundingClientRect();
      tilt.ty = ((e.clientX - r.left) / r.width - 0.5) * 0.16;
      tilt.tx = ((e.clientY - r.top) / r.height - 0.5) * 0.08;
    }
    if (e.pointerType !== "mouse") return kick();
    const i = pick(e);
    if (i !== hovered) {
      hovered = i;
      press(i, i >= 0, "hover");
    }
    canvas.style.cursor = i >= 0 ? "pointer" : "";
    kick();
  };
  const onLeave = () => {
    hovered = -1;
    tilt.tx = tilt.ty = 0;
    press(-1, false, "hover");
    canvas.style.cursor = "";
  };
  const onDown = (e: PointerEvent) => {
    const i = pick(e);
    if (i >= 0) press(i, true, `pointer:${e.pointerId}`);
  };
  const onUp = (e: PointerEvent) => press(-1, false, `pointer:${e.pointerId}`);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  // The page's mono is loaded long before this module is, but if it is not, the screen is
  // painted again in it once it is.
  let disposed = false;
  document.fonts?.ready.then(() => {
    if (disposed) return;
    if (screenCtx && screenOpts) textSize = screenSize(screenCtx, screenOpts.font, longest);
    repaint();
    kick(false);
  });

  return {
    press,
    reveal: () => {
      if (revealAt >= 0) return;
      board.visible = true;
      revealAt = performance.now();
      kick();
      wake();
    },
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearInterval(blink);
      seen.disconnect();
      document.removeEventListener("visibilitychange", wake);
      wide?.removeEventListener("change", onWide);
      bezelGeo.dispose();
      faceGeo.dispose();
      screenTex.dispose();
      observer.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.isMesh) {
          (Array.isArray(m.material) ? m.material : [m.material]).forEach((mat) => mat.dispose());
        }
      });
      well.shell.dispose();
      well.plate.dispose();
      logoGeo.dispose();
      (capGeo as THREE.BufferGeometry | null)?.dispose();
      for (const t of textures) t.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
