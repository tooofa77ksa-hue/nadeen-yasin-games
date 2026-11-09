// Roblox-style procedural avatars (vanilla Three.js). Facing +z, feet at y=0.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const matCache = new Map();
export function M(color, rough = 0.5, extra) {
  const k = color + '|' + rough;
  if (!extra && matCache.has(k)) return matCache.get(k);
  const m = new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough, metalness: 0 }, extra));
  if (!extra) matCache.set(k, m);
  return m;
}
const geoCache = new Map();
export function rbox(w, h, d, mat, r = 0.08) {
  const k = [w, h, d, r].join(',');
  if (!geoCache.has(k)) geoCache.set(k, new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3)));
  const m = new THREE.Mesh(geoCache.get(k), mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
const place = (o, x, y, z) => { o.position.set(x, y, z); return o; };

// ---------- face texture (canvas) ----------
export function faceTexture({ female = false, mother = false, mouth = '#b5483f' } = {}) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  g.lineCap = 'round';
  // blush
  g.fillStyle = 'rgba(255,120,120,0.32)';
  g.beginPath(); g.ellipse(58, 168, 22, 13, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(198, 168, 22, 13, 0, 0, 7); g.fill();
  for (const ex of [86, 170]) {
    g.fillStyle = '#fff'; g.beginPath(); g.ellipse(ex, 112, 27, 33, 0, 0, 7); g.fill();
    g.fillStyle = '#3a2314'; g.beginPath(); g.ellipse(ex, 118, 18, 23, 0, 0, 7); g.fill();
    g.fillStyle = '#120a05'; g.beginPath(); g.ellipse(ex, 120, 10, 14, 0, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(ex + 7, 108, 7, 0, 7); g.fill();
    g.beginPath(); g.arc(ex - 6, 128, 3.5, 0, 7); g.fill();
    // brows
    g.strokeStyle = '#2a170c'; g.lineWidth = female ? 6 : 9;
    g.beginPath(); g.arc(ex, 100 + 34, 38, Math.PI * 1.18, Math.PI * 1.82); g.stroke();
    if (female) { // lashes
      g.lineWidth = 5; g.strokeStyle = '#120a05';
      const s = ex < 128 ? -1 : 1;
      for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(ex + s * 24, 96 + i * 7); g.lineTo(ex + s * (36 + i * 2), 88 + i * 6); g.stroke(); }
    }
  }
  // smile
  g.strokeStyle = mouth; g.lineWidth = 9;
  g.beginPath(); g.arc(128, 168, 40, Math.PI * 0.18, Math.PI * 0.82); g.stroke();
  g.fillStyle = 'rgba(255,255,255,0.0)';
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

// ---------- pose engine ----------
const KEYS = ['body', 'root', 'torso', 'head', 'armL', 'armR', 'elbowL', 'elbowR', 'legL', 'legR', 'kneeL', 'kneeR'];
const zero = () => { const P = { tilt: 0 }; KEYS.forEach(k => (P[k] = [0, 0, 0])); return P; };
const sm = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
const TAU = Math.PI * 2;
const restArms = (P, b = 0) => {
  P.armL = [0.03 * b, 0, 0.07]; P.armR = [0.03 * b, 0, -0.07];
  P.elbowL = [-0.1, 0, 0]; P.elbowR = [-0.1, 0, 0];
};

export const POSES = {
  idle(P, t) {
    const b = Math.sin(t * 2.4);
    P.root[1] = 0.012 * b; P.torso[0] = 0.015 * b; P.head[0] = -0.015 * b; P.head[1] = 0.05 * Math.sin(t * 0.8);
    restArms(P, b);
  },
  walk(P, t, av, o) {
    const f = o.freq || 0.9, ph = TAU * f * t, A = 0.55 * av.stride, s = Math.sin(ph), c = Math.cos(ph);
    P.legL[0] = -s * A; P.legR[0] = s * A;
    P.kneeL[0] = Math.max(0, c) * 0.9 * av.stride; P.kneeR[0] = Math.max(0, -c) * 0.9 * av.stride;
    P.armL[0] = s * 0.5; P.armR[0] = -s * 0.5; P.armL[2] = 0.06; P.armR[2] = -0.06;
    P.elbowL[0] = -0.25 - Math.max(0, -s) * 0.3; P.elbowR[0] = -0.25 - Math.max(0, s) * 0.3;
    P.root[1] = 0.045 * Math.abs(c) - 0.03; P.torso[1] = s * 0.1; P.head[1] = -s * 0.05; P.torso[0] = 0.03;
  },
  run(P, t, av, o) {
    const f = o.freq || 1.7, ph = TAU * f * t, A = 0.95 * av.stride, s = Math.sin(ph), c = Math.cos(ph);
    P.legL[0] = -s * A; P.legR[0] = s * A;
    P.kneeL[0] = (Math.max(0, c) * 1.3 + 0.15) * av.stride; P.kneeR[0] = (Math.max(0, -c) * 1.3 + 0.15) * av.stride;
    P.armL[0] = s * 0.9; P.armR[0] = -s * 0.9; P.armL[2] = 0.1; P.armR[2] = -0.1;
    P.elbowL[0] = -1.4; P.elbowR[0] = -1.4;
    P.torso[0] = 0.22; P.torso[1] = s * 0.18; P.root[1] = 0.14 * Math.abs(c); P.head[0] = -0.12;
  },
  wave(P, t) {
    POSES.idle(P, t);
    const e = sm(0, 0.4, t);
    P.armR = [-0.1, 0, -0.07 - 2.5 * e]; P.elbowR = [0, 0, -(0.35 + 0.45 * Math.sin(t * 10)) * e];
    P.head[2] = 0.08 * e; P.torso[2] = -0.03 * e;
  },
  hop(P, t) {
    const u = (t * 1.5) % 1, s = Math.sin(Math.PI * u);
    P.root[1] = 0.9 * s - 0.15 * (1 - s) * (1 - s) * 0.5;
    P.armL = [-0.2, 0, 0.35 + 2.1 * s]; P.armR = [-0.2, 0, -0.35 - 2.1 * s];
    P.legL = [-0.3 * s, 0, 0.05]; P.legR = [0.2 * s, 0, -0.05];
    P.kneeL[0] = 0.35 + 0.7 * s * 0.5; P.kneeR[0] = 0.35 + 0.9 * s;
    P.head[0] = -0.1 * s;
  },
  point(P, t) {
    POSES.idle(P, t);
    const e = sm(0, 0.4, t);
    P.armR = [-1.5 * e, 0, -0.07 * (1 - e)]; P.elbowR = [0, 0, 0]; P.head[1] = -0.15 * e;
  },
  // proud: point at own chest with left hand, chest out, chin up
  pointSelf(P, t) {
    const e = sm(0, 0.5, t), n = Math.sin(t * 5) * 0.03 * e;
    P.armL = [-0.6 * e, 0, 0.07 - 0.57 * e]; P.elbowL = [-1.36 * e - n * 3, 0, -0.89 * e];
    P.torso[0] = -0.08 * e; P.head[0] = -0.12 * e + n; P.head[2] = 0.07 * e;
  },
  // raise glass to mouth, sip, lower (3 s)
  drink(P, t) {
    const env = sm(0, 0.8, t) * (1 - sm(2.2, 3.0, t)), sip = sm(0.8, 1.3, t) * (1 - sm(1.8, 2.3, t));
    P.armR = [-0.2 - 0.7 * env, 0, -0.07 + 0.47 * env];
    P.elbowR = [-0.1 - 1.6 * env, 0, 0.75 * env];
    P.head[0] = -0.28 * sip; P.torso[0] = -0.03 * sip; P.tilt = 0.9 * sip;
  },
  bow(P, t, av, o) {
    const u = (t * 0.7) % 1, e = sm(0, 0.3, u) * (1 - sm(0.6, 0.95, u));
    POSES.idle(P, t);
    P.torso[0] = 0.95 * e; P.head[0] = 0.15 * e; P.armL[0] = -0.3 * e; P.armR[0] = -0.3 * e; P.elbowL[0] = -0.5 * e; P.elbowR[0] = -0.5 * e;
    P.legL[0] = -0.05 * e; P.legR[0] = -0.05 * e; P.root[2] = -0.1 * e;
  },
  // lean back and pull a rope. opts.raise (0..1): free right hand goes up
  pullRope(P, t, av, o) {
    const w = Math.sin(t * 3.2), r = o.raise || 0;
    P.torso[0] = -0.3 + 0.07 * w; P.head[0] = 0.15; P.root[2] = -0.2; P.root[1] = -0.05 + 0.015 * w;
    P.armL = [-1.25 + 0.12 * w, 0, -0.12]; P.elbowL = [-0.35 - 0.2 * w, 0, 0];
    P.armR = [-1.25 + 0.12 * w, 0, 0.12]; P.elbowR = [-0.35 - 0.2 * w, 0, 0];
    P.armR = [P.armR[0] * (1 - r) - 0.1 * r, 0, 0.12 * (1 - r) + r * (-2.6)];
    P.elbowR = [P.elbowR[0] * (1 - r), 0, -r * (0.3 + 0.35 * Math.sin(t * 11))];
    P.legL = [-0.55, 0, 0.05]; P.kneeL = [0.45, 0, 0]; P.legR = [0.35, 0, -0.05]; P.kneeR = [0.1, 0, 0];
    P.head[2] = 0.08 * r;
  },
  // mother carrying/hugging the son
  hug(P, t) {
    const b = Math.sin(t * 2.2);
    P.torso[0] = -0.12 + 0.01 * b; P.head[2] = 0.1; P.head[1] = 0.25; P.root[1] = 0.01 * b;
    P.armL = [-1.05, 0, -0.62]; P.elbowL = [-1.25, 0, -0.35];
    P.armR = [-1.05, 0, 0.62]; P.elbowR = [-1.25, 0, 0.35];
    P.legL[0] = -0.05; P.legR[0] = 0.05;
  },
  // child clinging to the mother (arms around her neck, legs dangling)
  hugged(P, t) {
    const b = Math.sin(t * 2.2);
    P.armL = [-2.2, 0, -0.55]; P.elbowL = [-0.5, 0, -0.3];
    P.armR = [-2.2, 0, 0.55]; P.elbowR = [-0.5, 0, 0.3];
    P.legL = [-0.35 + 0.03 * b, 0, 0.1]; P.legR = [-0.35 - 0.03 * b, 0, -0.1]; P.kneeL[0] = 0.5; P.kneeR[0] = 0.5;
    P.head[2] = -0.12; P.head[1] = -0.3; P.torso[0] = 0.03;
  },
};

// ---------- avatar ----------
export function makeAvatar(opts = {}) {
  const o = Object.assign({
    skin: '#f0c49c', shirt: '#4a90d9', pants: '#3b4a6b', shoes: '#2b2b2b', hair: '#2a1a10',
    female: false, mother: false, scale: 1, headScale: 1,
    scarf: null,          // hijab color
    dress: null,          // long dress color (covers legs)
    thobe: false, cap: null, longHair: false, trim: null, hasGlass: false,
  }, opts);
  const LEG = 0.95, TH = 1.0, TW = 0.95, TD = 0.52;
  const skin = M(o.skin, 0.6), shirt = M(o.thobe ? '#ffffff' : (o.dress || o.shirt), 0.5), pants = M(o.pants, 0.6);
  const root = new THREE.Group(); root.name = 'avatar';
  const inner = new THREE.Group(); inner.scale.setScalar(o.scale); root.add(inner);
  const body = place(new THREE.Group(), 0, LEG, 0); body.name='hips'; inner.add(body);
  const torso = new THREE.Group(); torso.name='torso'; body.add(torso);
  torso.add(place(rbox(TW, TH, TD, shirt, 0.12), 0, TH / 2, 0));

  // head
  const headPivot = place(new THREE.Group(), 0, TH, 0); torso.add(headPivot);
  headPivot.name='head'; const head = new THREE.Group(); head.name='head_mesh'; head.scale.setScalar(o.headScale); headPivot.add(head);
  head.add(place(rbox(0.8, 0.76, 0.72, skin, 0.13), 0, 0.4, 0));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.76, 0.76),
    new THREE.MeshStandardMaterial({ map: faceTexture({ female: o.female || o.mother }), transparent: true, roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  face.position.set(0, 0.4, 0.364); head.add(face);
  const hairM = M(o.hair, 0.7);
  if (o.scarf) {
    const sc = M(o.scarf, 0.75);
    head.add(place(rbox(0.9, 0.88, 0.8, sc, 0.22), 0, 0.38, -0.1));            // shell: top, back, sides
    head.add(place(rbox(0.9, 0.15, 0.14, sc, 0.06), 0, 0.745, 0.33));           // forehead band
    head.add(place(rbox(0.1, 0.62, 0.15, sc, 0.04), -0.405, 0.38, 0.31));       // cheek strips
    head.add(place(rbox(0.1, 0.62, 0.15, sc, 0.04), 0.405, 0.38, 0.31));
    head.add(place(rbox(0.88, 0.3, 0.74, sc, 0.12), 0, -0.02, -0.03));          // under-chin / neck cover
    torso.add(place(rbox(1.02, 0.3, 0.62, sc, 0.12), 0, TH - 0.08, 0));         // shoulder cape
    torso.add(place(rbox(0.8, 0.5, 0.1, sc, 0.05), 0, TH - 0.36, TD / 2 + 0.03)); // chest drape
  } else if (o.cap) {
    head.add(place(rbox(0.84, 0.3, 0.76, hairM, 0.12), 0, 0.64, -0.03));
    head.add(place(rbox(0.8, 0.1, 0.06, hairM, 0.03), 0, 0.77, 0.34));
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 12, 0, TAU, 0, Math.PI / 2), M(o.cap, 0.6, { side: THREE.DoubleSide }));
    cap.scale.set(1, 0.55, 0.95); cap.position.set(0, 0.74, 0); cap.castShadow = true; head.add(cap);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.06, 20, 1, true), M(o.cap, 0.6, { side: THREE.DoubleSide }));
    band.scale.set(1, 1, 0.95); band.position.set(0, 0.74, 0); head.add(band);
  } else {
    head.add(place(rbox(0.84, 0.34, 0.76, hairM, 0.13), 0, 0.64, -0.03));
    head.add(place(rbox(0.8, 0.11, 0.06, hairM, 0.03), 0, 0.76, 0.34));
    if (o.longHair) head.add(place(rbox(0.86, 0.95, 0.3, hairM, 0.12), 0, 0.28, -0.3));
  }

  // arms
  const sleeve = M(o.thobe ? '#ffffff' : (o.dress || o.shirt), 0.5);
  function arm(side) {
    const sh = place(new THREE.Group(), side * (TW / 2 + 0.17), TH - 0.17, 0); const S=side>0?'L':'R'; sh.name='arm_'+S; torso.add(sh);
    sh.add(place(rbox(0.32, 0.52, 0.32, sleeve, 0.1), 0, -0.21, 0));
    const el = place(new THREE.Group(), 0, -0.45, 0); el.name='forearm_'+S; sh.add(el);
    el.add(place(rbox(0.3, 0.5, 0.3, sleeve, 0.09), 0, -0.2, 0));
    el.add(place(rbox(0.28, 0.2, 0.28, skin, 0.09), 0, -0.5, 0));
    const hand = place(new THREE.Group(), 0, -0.52, 0); hand.name='hand_'+S; el.add(hand);
    return { sh, el, hand };
  }
  const aL = arm(1), aR = arm(-1);

  // legs
  function leg(side) {
    const hip = place(new THREE.Group(), side * 0.24, 0, 0); const S=side>0?'L':'R'; hip.name='leg_'+S; body.add(hip);
    hip.add(place(rbox(0.42, 0.52, 0.42, pants, 0.1), 0, -0.22, 0));
    const kn = place(new THREE.Group(), 0, -0.45, 0); kn.name='shin_'+S; hip.add(kn);
    kn.add(place(rbox(0.4, 0.5, 0.4, pants, 0.1), 0, -0.2, 0));
    kn.add(place(rbox(0.42, 0.16, 0.58, M(o.shoes, 0.5), 0.07), 0, -0.42, 0.07));
    return { hip, kn };
  }
  const lL = leg(1), lR = leg(-1);

  // long dress / thobe skirt
  let stride = 1;
  if (o.dress || o.thobe) {
    stride = 0.6;
    const col = o.thobe ? '#ffffff' : o.dress, h = LEG - 0.02;
    const sk = new THREE.Mesh(new THREE.CylinderGeometry(0.5, o.thobe ? 0.56 : 0.64, h, 24, 1), M(col, 0.55));
    sk.scale.z = 0.72; sk.position.set(0, 0.1 - h / 2 + 0.0, 0); sk.castShadow = sk.receiveShadow = true; body.add(sk);
    if (o.trim || !o.thobe) {
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.645, 0.07, 24, 1), M(o.trim || '#d9b45a', 0.4));
      tr.scale.z = 0.72; tr.position.set(0, -LEG + 0.1, 0); body.add(tr);
    }
  }

  // glass prop (held in right hand)
  const glassG = new THREE.Group(); glassG.name='glass'; aR.hand.add(glassG);
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.1, 0.3, 16, 1, true), new THREE.MeshStandardMaterial({ color: '#dff4ff', transparent: true, opacity: 0.35, roughness: 0.05, side: THREE.DoubleSide }));
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 16), new THREE.MeshStandardMaterial({ color: '#dff4ff', transparent: true, opacity: 0.5, roughness: 0.05 }));
  const water = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.095, 0.19, 16), new THREE.MeshStandardMaterial({ color: '#4fb6ff', transparent: true, opacity: 0.75, roughness: 0.1 }));
  cup.position.y = 0.17; base.position.y = 0.03; water.position.y = 0.12;
  glassG.add(cup, base, water);
  glassG.visible = !!o.hasGlass;

  const anchors = {
    handL: aL.hand, handR: aR.hand, head: headPivot,
    chest: place(new THREE.Object3D(), 0, 0.6, TD / 2 + 0.05),
  };
  torso.add(anchors.chest);

  const av = {
    group: root, glass: glassG, anchors, opts: o, stride, scale: o.scale,
    height: (LEG + TH + 0.8) * o.scale,
    walkSpeed: (freq = 0.9) => 1.55 * o.scale * (freq / 0.9) * stride * 1.4,
    runSpeed: (freq = 1.7) => 2.8 * o.scale * (freq / 1.7),
    setPose(spec, t = 0, opt = {}) {
      let P = compute(spec, t, opt);
      if (opt.to) {
        const Q = compute(opt.to.spec, opt.to.t ?? t, opt.to), w = opt.to.w;
        for (const k of KEYS) P[k] = P[k].map((v, i) => v + (Q[k][i] - v) * w);
        P.tilt += (Q.tilt - P.tilt) * w;
      }
      body.position.set(P.root[0], LEG + P.root[1], P.root[2]);
      body.rotation.set(P.body[0], P.body[1], P.body[2]);
      torso.rotation.set(...P.torso); headPivot.rotation.set(...P.head);
      aL.sh.rotation.set(...P.armL); aR.sh.rotation.set(...P.armR);
      aL.el.rotation.set(...P.elbowL); aR.el.rotation.set(...P.elbowR);
      lL.hip.rotation.set(...P.legL); lR.hip.rotation.set(...P.legR);
      lL.kn.rotation.set(...P.kneeL); lR.kn.rotation.set(...P.kneeR);
      // keep the glass upright (relative to the avatar), then tilt it toward the face
      if (glassG.visible) {
        const q = new THREE.Quaternion();
        for (let n = glassG.parent; n && n !== inner; n = n.parent) q.premultiply(n.quaternion);
        q.invert().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.25 * P.tilt, 0, -P.tilt * 0.9)));
        glassG.quaternion.copy(q);
      }
      return av;
    },
  };
  function compute(spec, t, opt) {
    const P = zero();
    for (const nm of spec.split('+')) {
      const f = POSES[nm]; if (!f) throw new Error('unknown pose ' + nm);
      f(P, t - ((opt.t0 && opt.t0[nm]) || 0), av, opt);
    }
    return P;
  }
  av.setPose('idle', 0);
  return av;
}

// ---------- presets ----------
export const makeMother = () => makeAvatar({ mother: true, female: true, scale: 1.0, dress: '#2b2440', scarf: '#3a3158', skin: '#e9b98f', trim: '#c9a24a', shoes: '#1c1c1c' });
export const makeSon = () => makeAvatar({ scale: 0.6, headScale: 1.1, shirt: '#f7d117', pants: '#3a64a8', skin: '#e9b98f', shoes: '#f4f4f4' });
export const makeBoyThobe = (hasGlass = false) => makeAvatar({ thobe: true, cap: '#ffffff', skin: '#e3ad82', scale: 0.85, shoes: '#6b4a2b', hasGlass });
export function makeKids(n = 7) {
  const defs = [
    { c: '#e53935', girl: false }, { c: '#fb8c00', girl: true, scarf: '#ffb74d', dress: true }, { c: '#43a047', girl: false },
    { c: '#00acc1', girl: true, scarf: '#4dd0e1', dress: true }, { c: '#1e88e5', girl: false },
    { c: '#8e24aa', girl: true, scarf: '#ba68c8', dress: true }, { c: '#ec407a', girl: true, scarf: '#f48fb1', dress: false },
  ];
  const skins = ['#f0c49c', '#e3ad82', '#d99b6c', '#f2cba7', '#e9b98f', '#d4a074', '#f0c49c'];
  return defs.slice(0, n).map((d, i) => makeAvatar({
    female: d.girl, shirt: d.c, dress: d.girl && d.dress ? d.c : null, scarf: d.scarf || null, trim: '#f5e6a8',
    pants: d.girl ? '#f4efe6' : '#35496e', skin: skins[i], scale: 0.78 + 0.03 * ((i * 3) % 4), hair: i % 2 ? '#3b2314' : '#1c120b',
    shoes: '#fafafa',
  }));
}

// ---------- horse + cart (faces +x, cart trails behind at -x) ----------
export function makeHorseCart() {
  const root = new THREE.Group(); root.name = 'horseCart';
  const brown = M('#8d5a34', 0.7), dark = M('#3a2416', 0.7), wood = M('#b8814a', 0.8), wood2 = M('#8a5b30', 0.8);
  const body = new THREE.Group(); body.name='body'; body.position.y = 1.7; root.add(body);
  body.add(place(rbox(2.1, 0.9, 0.85, brown, 0.22), 0, 0, 0));
  const neck = place(rbox(0.55, 1.0, 0.5, brown, 0.18), 1.2, 0.55, 0); neck.rotation.z = -0.45; body.add(neck);
  const headG = place(new THREE.Group(), 1.55, 1.05, 0); headG.name='head'; headG.rotation.z = -0.5; body.add(headG);
  headG.add(place(rbox(0.85, 0.42, 0.42, brown, 0.16), 0.2, 0, 0));
  headG.add(place(rbox(0.3, 0.34, 0.36, M('#c9a07a', 0.7), 0.12), 0.58, -0.05, 0));
  for (const z of [-0.22, 0.22]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), M('#111', 0.3)); e.position.set(0.15, 0.1, z); headG.add(e);
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 8), brown); ear.position.set(-0.12, 0.32, z * 0.7); ear.castShadow = true; headG.add(ear);
  }
  const mane = place(rbox(0.1, 0.95, 0.14, dark, 0.04), 1.05, 0.62, 0); mane.rotation.z = -0.45; body.add(mane);
  const tail = place(new THREE.Group(), -1.05, 0.3, 0); tail.name='tail'; body.add(tail);
  tail.add(place(rbox(0.16, 0.8, 0.16, dark, 0.06), 0, -0.4, 0));
  body.add(place(rbox(0.12, 0.95, 0.9, M('#b3342b', 0.6), 0.04), 0.7, 0.0, 0)); // harness strap
  const legs = [];
  for (const [x, z, ph] of [[0.8, 0.27, 0], [0.8, -0.27, Math.PI], [-0.8, 0.27, Math.PI], [-0.8, -0.27, 0]]) {
    const hip = place(new THREE.Group(), x, -0.3, z); hip.name='leg_'+(x>0?'F':'B')+(z>0?'L':'R'); body.add(hip);
    hip.add(place(rbox(0.3, 0.65, 0.28, brown, 0.1), 0, -0.3, 0));
    const kn = place(new THREE.Group(), 0, -0.6, 0); kn.name='shin_'+hip.name.slice(4); hip.add(kn);
    kn.add(place(rbox(0.24, 0.55, 0.24, brown, 0.08), 0, -0.25, 0));
    kn.add(place(rbox(0.3, 0.16, 0.3, dark, 0.05), 0, -0.55, 0));
    legs.push({ hip, kn, ph });
  }
  // cart
  const cart = new THREE.Group(); cart.name='cart'; root.add(cart);
  const cx = -4.4;
  cart.add(place(rbox(2.3, 0.14, 1.3, wood, 0.05), cx, 1.15, 0));
  for (const z of [-0.62, 0.62]) cart.add(place(rbox(2.3, 0.4, 0.1, wood2, 0.04), cx, 1.4, z));
  cart.add(place(rbox(0.1, 0.4, 1.3, wood2, 0.04), cx - 1.1, 1.4, 0));
  for (const z of [-0.4, 0.4]) { // shafts to the horse
    const sh = place(rbox(3.7, 0.09, 0.09, wood2, 0.03), cx + 2.15 + 0.35, 1.2, z); sh.rotation.z = 0.06; cart.add(sh);
  }
  const jars = [[-0.4, 0.3], [0.1, -0.2], [0.55, 0.25]];
  for (const [dx, dz] of jars) { const j = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.5, 14), M('#c46a3a', 0.6)); j.position.set(cx + dx, 1.5, dz); j.castShadow = true; cart.add(j); }
  const wheels = [];
  for (const z of [-0.78, 0.78]) {
    const w = place(new THREE.Group(), cx, 0.7, z); w.name='wheel_'+(z>0?'L':'R'); cart.add(w);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.07, 8, 28), wood2); rim.castShadow = true; w.add(rim);
    for (let i = 0; i < 4; i++) { const s = rbox(1.2, 0.09, 0.08, wood, 0.03); s.rotation.z = i * Math.PI / 4; w.add(s); }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.16, 12), dark); hub.rotation.x = Math.PI / 2; w.add(hub);
    wheels.push(w);
  }
  return {
    group: root, radius: 0.69,
    // dist: distance travelled along +x (drives legs & wheels); t: time (tail)
    setPose(name = 'walk', t = 0, { dist = t * 3 } = {}) {
      const L = 2.6, ph = TAU * dist / L;
      for (const l of legs) {
        const s = Math.sin(ph + l.ph), c = Math.cos(ph + l.ph);
        l.hip.rotation.z = s * 0.5; l.kn.rotation.z = -Math.max(0, -c) * 0.0 + Math.max(0, c) * -0.0;
        l.kn.rotation.z = Math.max(0, c) * 0.8; // bends back (toward -x) while swinging forward
      }
      body.position.y = 1.7 + 0.035 * Math.abs(Math.sin(ph * 2 / 2));
      body.rotation.z = 0.01 * Math.sin(ph);
      tail.rotation.z = 0.15 * Math.sin(ph * 1.5 + 1);
      headG.rotation.z = -0.5 + 0.06 * Math.sin(ph * 2);
      for (const w of wheels) w.rotation.z = -dist / 0.69;
      cart.position.y = 0.02 * Math.sin(ph * 2.3);
    },
  };
}
