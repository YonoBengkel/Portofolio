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
 * the pointer, the keys dropping in the first time it is seen. A keyboard nobody is
 * touching costs no frames.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

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

export type KeyboardOptions = {
  canvas: HTMLCanvasElement;
  /** One SVG document per key, in key order, already in the colour it is drawn in. */
  logos: string[];
  colors: string[];
  columns: number;
  still: boolean;
  onSelect: (index: number | null) => void;
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

/* ------------------------------------------------------------------- easing */
const easeOutBack = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export async function mountKeyboard(o: KeyboardOptions): Promise<KeyboardHandle> {
  const { canvas, logos, colors, columns, still, onSelect } = o;
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
  // so the board sits centred and whole in a canvas of any shape.
  camera.updateMatrixWorld();
  const view = new THREE.Box2();
  {
    const y0 = layout.position.y;
    const y1 = y0 + (KIT.keyY + KIT.keyTop) * fit;
    const p = new THREE.Vector3();
    for (const x of [-outerX * fit, outerX * fit])
      for (const y of [y0, y1])
        for (const z of [-outerZ * fit, outerZ * fit]) {
          p.set(x, y, z).applyMatrix4(camera.matrixWorldInverse);
          view.expandByPoint(new THREE.Vector2(p.x, p.y));
        }
  }
  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    const aspect = w / h;
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
    renderer.render(scene, camera);
    if (moving) raf = requestAnimationFrame(frame);
  };
  function kick() {
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
  const announce = () => onSelect(held.length ? held[held.length - 1].index : null);

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

  return {
    press,
    reveal: () => {
      if (revealAt >= 0) return;
      board.visible = true;
      revealAt = performance.now();
      kick();
    },
    dispose: () => {
      cancelAnimationFrame(raf);
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
