// ─── Ground tiles for the new areas ───────────────────────────────────────
function makeFern(seed, G) {
  const [c, x] = mk(16, 16);
  R(x, 0, 0, 16, 16, G.g3);
  for (let i = 0; i < 26; i++) P(x, Math.floor(hash(seed, i, 1) * 16), Math.floor(hash(seed, i, 2) * 16), G.g2);
  const frond = (bx, by, tx, ty) => {
    const n = Math.max(Math.abs(tx - bx), Math.abs(ty - by));
    for (let k = 0; k <= n; k++) {
      const t = k / n, X = Math.round(bx + (tx - bx) * t + Math.sin(t * 3) * 1.2), Y = Math.round(by + (ty - by) * t);
      P(x, X, Y, C.leaf2);
      const len = Math.round((1 - t) * 3);
      for (let j = 1; j <= len; j++) { if ((k + j) % 2) continue; P(x, X - j, Y + (j > 1 ? 1 : 0), j === 1 ? C.leaf1 : C.leaf0); P(x, X + j, Y + (j > 1 ? 1 : 0), j === 1 ? C.leaf1 : C.leaf2); }
    }
  };
  frond(4, 15, 1 + (seed & 1), 3); frond(8, 15, 8, 1); frond(12, 15, 14 - (seed & 1), 4);
  frond(2, 15, 6, 8); frond(14, 15, 10, 9);
  return c;
}
function makeMushrooms(seed) {
  const [c, x] = mk(16, 16);
  const shroom = (X, Y, red) => {
    R(x, X + 1, Y + 3, 2, 3, '#efe6d2'); P(x, X + 2, Y + 3, '#cfc4ae');
    R(x, X - 1, Y + 1, 6, 2, C.out); R(x, X, Y, 4, 1, C.out);
    R(x, X, Y + 1, 4, 2, red ? C.red : '#9a5a2e'); P(x, X, Y + 1, red ? '#f07a6a' : '#c08050');
    if (red) { P(x, X + 1, Y + 1, '#fbf8f0'); P(x, X + 3, Y + 2, '#fbf8f0'); }
  };
  shroom(3 + (seed * 3) % 5, 3, seed % 2 === 1);
  shroom(9, 8 + (seed % 3), seed % 2 === 0);
  return c;
}
function makePoppies(seed) {
  const [c, x] = mk(16, 16);
  for (let i = 0; i < 5; i++) {
    const X = 1 + Math.floor(hash(seed, i, 3) * 13), Y = 1 + Math.floor(hash(seed, i, 4) * 11);
    R(x, X + 1, Y + 2, 1, 3, C.leaf2);
    R(x, X, Y, 3, 2, C.red); P(x, X, Y, '#f2685e'); P(x, X + 1, Y + 1, C.out); P(x, X + 2, Y + 1, C.red2);
  }
  return c;
}
function makeReeds() {
  const [c, x] = mk(16, 16);
  R(x, 0, 6, 16, 10, C.g3);
  for (let X = 0; X < 16; X++) {
    const top = 1 + Math.floor(hash(X, 3, 9) * 6);
    for (let Y = top; Y < 16; Y++) P(x, X, Y, (X % 3 === 0) ? C.leaf3 : (Y - top < 2 ? C.leaf0 : C.leaf1));
  }
  for (const X of [3, 10]) { R(x, X, 0, 2, 4, '#6b4426'); P(x, X, 0, '#8a5a35'); }
  return c;
}

// ─── Trees and things of the forest, steppe and Kalynivka ─────────────────
function makeOak(seed) {
  const [c, x] = mk(44, 50);
  shadow(x, 22, 47, 16, 3);
  R(x, 19, 28, 7, 20, C.wd2); R(x, 19, 28, 2, 20, C.wd1); R(x, 25, 28, 1, 20, C.wd3);
  P(x, 18, 47, C.wd2); P(x, 26, 47, C.wd2); P(x, 17, 47, C.wd3);
  blob(x, 22, 18, 19, 15, ['#7fbd56', '#4f9442', '#36733a', '#26562f', '#183a22'], seed, .22);
  return { img: c, ox: -14 };
}
function makeBirch(seed) {
  const [c, x] = mk(24, 50);
  shadow(x, 12, 48, 7, 2);
  R(x, 10, 16, 4, 33, '#efece4'); R(x, 13, 16, 1, 33, '#c9c4b8');
  for (let y = 18; y < 48; y += 3 + Math.floor(hash(y, seed, 5) * 3)) R(x, 10 + (y % 2), y, 2, 1, C.out);
  blob(x, 12, 15, 10.5, 14, ['#c8e88c', '#9ccc68', '#6fa64e', '#4d8040', '#2f4f2c'], seed, .2);
  return { img: c, ox: -4 };
}
function makeHut(frame) {
  // Baba Yaga's izbushka: a log hut standing on two hen's legs
  const [c, x] = mk(56, 80);
  shadow(x, 28, 77, 20, 3);
  const leg = (X, lift) => {
    const sc = '#d9a441', sc2 = '#a8742a';
    R(x, X, 52, 5, 10 - lift, sc2); R(x, X + 1, 52, 3, 10 - lift, sc);
    for (let y = 53; y < 62 - lift; y += 2) P(x, X + 2, y, sc2);
    R(x, X + 2, 61 - lift, 4, 9, sc2); R(x, X + 3, 61 - lift, 2, 9, sc);
    const fy = 70 - lift;
    R(x, X - 2, fy, 10, 2, sc2); P(x, X - 3, fy + 1, C.out); P(x, X + 8, fy + 1, C.out); R(x, X + 2, fy + 2, 3, 1, sc2);
  };
  leg(16, frame ? 3 : 0); leg(35, frame ? 0 : 3);
  // log walls
  R(x, 5, 24, 46, 30, C.out);
  for (let y = 25; y < 53; y++) {
    const r = (y - 25) % 4;
    R(x, 6, y, 44, 1, r === 0 ? '#9a6a3c' : r === 3 ? '#4b2f1c' : '#704829');
  }
  for (let y = 25; y < 53; y += 4) { R(x, 4, y, 3, 3, '#c99258'); R(x, 49, y, 3, 3, '#c99258'); }
  // window with a candle, a crooked door
  R(x, 12, 32, 10, 9, C.out); R(x, 13, 33, 8, 7, '#f6c93c'); R(x, 13, 33, 8, 1, '#f9e08a'); R(x, 16, 33, 1, 7, C.out); R(x, 13, 36, 8, 1, C.out);
  R(x, 30, 33, 11, 20, C.out); R(x, 31, 34, 9, 19, '#5b3b22'); R(x, 34, 34, 1, 19, '#3e2715'); P(x, 38, 44, C.gold);
  // mossy gable roof
  for (let y = 2; y <= 26; y++) {
    const half = Math.round((y - 2) * 1.12) + 3;
    for (let X = 28 - half; X <= 28 + half; X++) {
      if (X < 0 || X > 55) continue;
      const edge = X === 28 - half || X === 28 + half || y === 26;
      const s = hash(X, y >> 1, 77);
      P(x, X, y, edge ? '#1d331f' : s < .3 ? '#5d8f45' : s < .75 ? '#3f6e35' : '#2c4a2a');
    }
  }
  R(x, 26, 0, 4, 6, '#6e6a64'); R(x, 26, 0, 4, 1, C.out);
  return c;
}
function makeWindmill() {
  // a wooden post-mill; its sails are drawn separately so they can turn
  const [c, x] = mk(48, 88);
  shadow(x, 24, 85, 14, 3);
  R(x, 21, 70, 6, 16, C.wd3); R(x, 14, 82, 20, 2, C.wd3);
  line(x, 16, 84, 22, 70, C.wd2, 2); line(x, 32, 84, 26, 70, C.wd2, 2);
  R(x, 11, 22, 26, 50, C.out);
  for (let X = 12; X < 36; X++) for (let y = 23; y < 71; y++) P(x, X, y, X % 4 === 0 ? C.wd2 : (X > 30 ? C.wd1 : C.wd0));
  for (let y = 4; y <= 23; y++) {
    const half = Math.round((y - 4) * .78) + 1;
    for (let X = 24 - half; X <= 24 + half; X++) P(x, X, y, X === 24 - half || X === 24 + half ? C.out : (X < 24 ? '#8a7857' : '#685940'));
  }
  R(x, 19, 52, 10, 19, C.out); R(x, 20, 53, 8, 18, C.wd2); R(x, 23, 53, 1, 18, C.wd3);
  R(x, 21, 34, 6, 6, C.out); R(x, 22, 35, 4, 4, C.glass);
  return c;
}
function makeSails(angle) {
  const [c, x] = mk(64, 64);
  const cx = 32, cy = 32;
  for (let k = 0; k < 4; k++) {
    const a = angle + k * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a);
    const at = (r, o) => [Math.round(cx + ca * r - sa * o), Math.round(cy + sa * r + ca * o)];
    for (let r = 3; r <= 29; r++) { const [X, Y] = at(r, 0); P(x, X, Y, C.wd3); }
    for (let r = 9; r <= 29; r++) for (let o = 1; o <= 6; o++) {
      const [X, Y] = at(r, o);
      const lattice = r % 4 === 0 || o === 6;
      P(x, X, Y, lattice ? C.wd2 : '#efe6d2');
    }
  }
  R(x, cx - 2, cy - 2, 5, 5, C.out); R(x, cx - 1, cy - 1, 3, 3, C.wd1);
  return c;
}
function makeStoneBaba() {
  // a kamiana baba: the old steppe statue on the kurhan, hands folded over a bowl
  const [c, x] = mk(16, 28);
  shadow(x, 8, 26, 6, 2);
  const st = ['#c9c3b5', '#a9a294', '#857f72', '#5f5a52'];
  R(x, 3, 9, 10, 18, st[3]); R(x, 4, 10, 8, 16, st[1]); R(x, 4, 10, 2, 16, st[0]); R(x, 10, 10, 2, 16, st[2]);
  R(x, 4, 2, 8, 8, st[3]); R(x, 5, 3, 6, 6, st[1]); R(x, 5, 3, 2, 5, st[0]);
  P(x, 6, 5, st[3]); P(x, 9, 5, st[3]); R(x, 7, 7, 2, 1, st[2]);
  R(x, 5, 16, 6, 3, st[3]); R(x, 6, 16, 4, 2, st[2]);
  P(x, 4, 21, '#7d9a5a'); P(x, 5, 22, '#7d9a5a'); P(x, 10, 12, '#7d9a5a');
  return c;
}
function makeKalyna(seed) {
  const [c, x] = mk(20, 22);
  shadow(x, 10, 20, 8, 2);
  const at = blob(x, 10, 11, 9, 8.5, [C.leaf0, C.leaf1, C.leaf2, C.leaf3, C.leafO], seed, .25);
  for (let i = 0; i < 6; i++) {
    const X = 4 + Math.floor(hash(seed, i, 8) * 11), Y = 5 + Math.floor(hash(seed, i, 9) * 9);
    if (!at(X, Y) || !at(X + 2, Y + 2)) continue;
    P(x, X, Y, C.red); P(x, X + 1, Y, C.red2); P(x, X + 2, Y, C.red); P(x, X + 1, Y + 1, C.red); P(x, X, Y + 1, C.red2); P(x, X + 1, Y + 2, C.red2);
    P(x, X, Y, '#f2685e');
  }
  return { img: c, ox: -2 };
}
function makeStall(seed) {
  const [c, x] = mk(32, 30);
  shadow(x, 16, 28, 15, 2);
  R(x, 2, 8, 2, 20, C.wd2); R(x, 28, 8, 2, 20, C.wd2);
  R(x, 1, 18, 30, 10, C.out); R(x, 2, 19, 28, 8, C.wd0); R(x, 2, 22, 28, 1, C.wd1);
  const goods = seed % 2 ? [[C.red, C.red2], [C.yel, C.yel2], [C.org, C.org2]] : [[C.leaf1, C.leaf3], ['#7a3e8a', '#4f2459'], [C.red, C.red2]];
  for (let i = 0; i < 9; i++) { const [a, b] = goods[i % 3]; const X = 3 + i * 3; R(x, X, 15, 3, 3, b); R(x, X, 15, 2, 2, a); }
  for (let X = 0; X < 32; X++) {
    const col = (X >> 2) % 2 ? '#fbf8f0' : (seed % 2 ? C.red : '#3f6fc4');
    R(x, X, 1, 1, 6, col);
    if ((X & 3) !== 0 || true) P(x, X, 7, (X & 3) === 1 || (X & 3) === 2 ? col : 'rgba(0,0,0,0)');
  }
  R(x, 0, 0, 32, 1, C.out);
  return c;
}

// ─── Word spirits: one little creature per word, generated from its number ─
const ZONE_PALS = [
  ['#e05a4f', '#a8323a', '#fbf8f0'],   // Vyshneve: embroidery red
  ['#f0b440', '#b87a1c', '#5a3a1a'],   // khutir: honey
  ['#f2c33c', '#c08422', '#3f6fc4'],   // steppe: wheat and sky
  ['#e8794a', '#b0472e', '#7cc39b'],   // Kalynivka: kalyna and leaf
  ['#d8473f', '#2b2230', '#f6c93c'],   // the fair: red and black
  ['#6fb2e0', '#3a78b8', '#fbf8f0'],   // the lake
  ['#b8323a', '#7a1f28', '#f3c84f'],   // the crossing: kozak crimson
  ['#6fae9a', '#3d6a5e', '#c9a8e0'],   // the marsh
  ['#7cc39b', '#3d8a64', '#f3e6b0'],   // forest: fern and glow
  ['#c8383a', '#2b2230', '#e9b949'],   // Khortytsia: the Sich banner
  ['#7aa8c8', '#3f6f95', '#f4f1e6'],   // the rapids: white water
  ['#e9b949', '#8a5a2a', '#4f86c6'],   // Podil: Kyiv gold and blue
  ['#f3c84f', '#b98626', '#fbf8f0'],   // the Lavra: domes
  ['#d6c7a8', '#8a6f4a', '#c8383a'],   // Polissia: linen and red thread
  ['#6f9a5a', '#2f5a31', '#c9a06a'],   // the pine forest: needles and bark
  ['#3a6a8a', '#1f3d55', '#f0b440'],   // Verkhovyna: Hutsul blue and brass
  ['#9cc46a', '#5a8a3a', '#f4f1e6'],   // the polonyna: grass and sheep
  ['#8a8fb0', '#4a4f72', '#e8eaf4'],   // Chornohora: stone and snow
  ['#4f9aa8', '#22606a', '#cfe8ea'],   // Synevyr: deep lake
  ['#c9a46a', '#7a5a35', '#d8473f'],   // Kamianets: castle stone
  ['#7cbf8a', '#3d6e46', '#e8d8b0'],   // the Dniester: canyon green
  ['#6fb2e0', '#2a5f95', '#f6e7c4'],   // Odesa: sea and sand
  ['#8fc2b0', '#3d7a6a', '#f3c84f'],   // Vylkove: reeds and water
  ['#eef0f2', '#a8b0b8', '#d87a8a'],   // the liman: salt and pink brine
  ['#8a5a35', '#4b2f1c', '#f0dcc0'],   // Lviv: coffee and cream
];
function makeSpirit(id, zone) {
  const [c, x] = mk(16, 16);
  const pal = ZONE_PALS[zone] || ZONE_PALS[0];
  const m = [];
  for (let y = 0; y < 16; y++) {
    m.push([]);
    for (let X = 0; X < 8; X++) {
      const cx = 7.5 - X, cy = y - 8.5;
      const r = Math.hypot(cx * 1.1, cy * .9);
      const p = r < 3.2 ? 1 : r < 6.6 ? .55 : 0;
      m[y].push(hash(id, y * 8 + X, 300) < p ? 1 : 0);
    }
  }
  const on = (X, y) => y >= 0 && y < 16 && X >= 0 && X < 16 && m[y][X < 8 ? X : 15 - X] === 1;
  for (let y = 0; y < 16; y++) for (let X = 0; X < 16; X++) {
    if (!on(X, y)) continue;
    const edge = !on(X - 1, y) || !on(X + 1, y) || !on(X, y - 1) || !on(X, y + 1);
    const pattern = ((X < 8 ? X : 15 - X) + y + id) % 4 === 0 && y > 9;
    P(x, X, y, edge ? C.out : pattern ? pal[2] : (y < 7 ? pal[0] : (X < 8 ? pal[0] : pal[1])));
  }
  const ey = 6 + Math.floor(hash(id, 1, 301) * 3), ex = 5 + Math.floor(hash(id, 2, 302) * 2);
  for (const X of [ex, 15 - ex]) { P(x, X, ey, '#fbf8f0'); P(x, X, ey + 1, C.out); P(x, X, ey - 1, C.out); }
  return c;
}
