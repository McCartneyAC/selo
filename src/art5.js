// ─── The wider country: the Sich, the rapids, Kyiv ────────────────────────
// Map letters: | palisade · & kurin (4x3) · @ town house (4x3) · % great church with gold domes (5x4)
// ! bell tower (2x2) · ( cannon · ) street lamp · ] fountain (2x2) · [ cave mouth (2x1) · < chaika (3x1, on water)
// { tram (3x1) · a chestnut · ^ rock (on land or in the water) · l white monastery wall
// Ground: : cobbles · ; sand · * white water
const GOLD_DOMES = { dome: '#e9b949', dome1: '#f8e08a', dome2: '#a8761c' };
const SICH_CHURCH = { dome: '#4f8a5a', dome1: '#7cbf8a', dome2: '#2f5a3a', wall: '#c99258', wall2: '#9e6a3c', wall3: '#704829', trim: C.wd3 };
const TOWN = [['#f2d98a', '#d8b860', '#5a8a5a'], ['#a8c8e4', '#7fa4c8', '#8f3a32'], ['#ecc0b4', '#cf9a8c', '#3e6a8a'], ['#cfe0b0', '#a9c288', '#8f3a32'], ['#f4efe2', '#d6cdb8', '#3f6f5a']];
const STONE = ['#c9c3b5', '#a9a294', '#857f72', '#5f5a52'];

function makePalisade() {
  // a stockade of sharpened logs, the Sich's wall
  const [c, x] = mk(16, 30);
  for (let k = 0; k < 4; k++) {
    const X = k * 4, top = 2 + ((k * 3) % 4);
    R(x, X, top + 3, 4, 27 - top, C.out); R(x, X + 1, top + 3, 2, 26 - top, k % 2 ? C.wd1 : C.wd0); P(x, X + 1, top + 4, C.wd0);
    P(x, X + 1, top + 1, C.out); P(x, X + 2, top + 1, C.out); R(x, X + 1, top + 2, 2, 1, C.wd1); P(x, X + 1, top, C.out);
  }
  R(x, 0, 20, 16, 2, C.wd3); R(x, 0, 19, 16, 1, C.wd2);
  return c;
}

function makeChestnut(seed) {
  // the Kyiv chestnut, каштан, with its white candles of flowers
  const [c, x] = mk(36, 44);
  shadow(x, 18, 41, 12, 3);
  R(x, 16, 26, 4, 16, C.wd2); R(x, 16, 26, 1, 16, C.wd1);
  const at = blob(x, 18, 15, 16, 13, ['#9cd070', '#6aa84a', '#4b8a40', '#346b36', '#21452a'], seed, .18);
  for (let i = 0; i < 12; i++) {
    const X = 5 + Math.floor(hash(seed, i, 80) * 26), Y = 4 + Math.floor(hash(seed, i, 81) * 18);
    if (!at(X, Y) || !at(X, Y + 3)) continue;
    P(x, X, Y, '#fbf8f0'); P(x, X, Y + 1, '#fbf8f0'); P(x, X - 1, Y + 2, '#fbf8f0'); P(x, X + 1, Y + 2, '#f0d0d8'); P(x, X, Y + 3, '#e8b8c4');
  }
  return { img: c, ox: -10 };
}

function makeRock(seed, wet) {
  const [c, x] = mk(16, 18);
  if (wet) { R(x, 0, 12, 16, 3, C.w0); R(x, 2, 15, 12, 1, C.w1); }
  for (let y = 1; y < 15; y++) for (let X = 1; X < 15; X++) {
    const d = Math.hypot((X + .5 - 8) / 6.8, (y + .5 - 9) / 5.6) + (hash(X >> 1, y >> 1, seed) - .5) * .25;
    if (d >= 1) continue;
    const lit = -(X - 8) / 8 - (y - 8) / 8;
    P(x, X, y, d > .85 ? C.out : lit > .6 ? STONE[0] : lit > -.2 ? STONE[1] : STONE[2]);
  }
  P(x, 6, 6, STONE[0]); P(x, 7, 5, STONE[0]);
  if (hash(seed, 3, 9) < .5) { P(x, 9, 10, '#7d9a5a'); P(x, 10, 10, '#7d9a5a'); }
  return c;
}

function makeWhiteWall() {
  // the Lavra's whitewashed wall, with a niche and a little tiled cap
  const [c, x] = mk(16, 26);
  R(x, 0, 4, 16, 22, C.out); R(x, 0, 5, 16, 20, C.wall); R(x, 12, 5, 4, 20, C.wall2);
  R(x, 0, 2, 16, 3, '#4f8a5a'); R(x, 0, 2, 16, 1, '#7cbf8a'); R(x, 0, 1, 16, 1, C.out);
  R(x, 5, 9, 6, 10, C.wall3); R(x, 6, 8, 4, 1, C.wall3); R(x, 6, 10, 4, 9, '#ddd3be');
  R(x, 0, 23, 16, 2, C.wall3);
  return c;
}

function makeKurin(seed) {
  // a kurin: the Sich's long barracks, log walls under thatch
  return makeKhata([C.wd2, C.wd3], THATCH, seed, true);
}

function makeTownhouse(seed) {
  // a two-storey house on a Kyiv street: stucco, tall windows, a tin roof
  const [wall, wall2, roof] = TOWN[seed % TOWN.length];
  const [c, x] = mk(64, 88);
  R(x, 4, 22, 56, 66, C.out); R(x, 5, 23, 54, 64, wall); R(x, 54, 23, 5, 64, wall2);
  R(x, 5, 52, 54, 2, wall2); R(x, 5, 23, 54, 2, wall2);   // cornices
  // roof
  for (let y = 6; y <= 22; y++) {
    const t = (y - 6) / 16, l = Math.round(14 - t * 12), r = Math.round(49 + t * 12);
    R(x, l, y, r - l + 1, 1, y === 22 || y === 6 ? C.out : ((y >> 1) % 2 ? roof : shade(roof)));
    P(x, l, y, C.out); P(x, r, y, C.out);
  }
  R(x, 42, 0, 6, 10, C.out); R(x, 43, 1, 4, 9, '#8f3a32');   // chimney
  // windows, two floors
  for (const wy of [28, 58]) for (const wx of [9, 21, 45]) {
    if (wy === 58 && wx === 45) continue;
    R(x, wx - 1, wy - 1, 10, 17, C.out); R(x, wx, wy, 8, 15, C.glass); R(x, wx + 3, wy, 2, 15, wall2); R(x, wx, wy + 6, 8, 1, wall2);
    P(x, wx + 1, wy + 1, C.glass2); P(x, wx + 1, wy + 2, C.glass2); R(x, wx - 1, wy + 15, 10, 2, wall2);
    if (wy === 28) R(x, wx - 2, wy - 3, 12, 2, wall2);
  }
  // a balcony over the door
  R(x, 31, 46, 18, 1, C.out); for (let X = 31; X < 49; X += 3) R(x, X, 42, 1, 5, C.out); R(x, 31, 42, 18, 1, C.out);
  // the door, under the middle tile so you walk in where you expect
  R(x, 34, 60, 12, 28, C.out); R(x, 35, 61, 10, 27, C.wd1); R(x, 39, 61, 2, 27, C.wd2); R(x, 35, 61, 10, 2, C.wd2);
  R(x, 33, 57, 14, 3, wall2); P(x, 43, 75, C.gold);
  return c;
}
function shade(hex) {
  const n = parseInt(hex.slice(1), 16), f = v => Math.max(0, Math.round(v * .8)).toString(16).padStart(2, '0');
  return '#' + f(n >> 16) + f((n >> 8) & 255) + f(n & 255);
}

function makeBellTower() {
  // the Great Lavra Bell Tower: white tiers with green columns, a gold dome on top
  const [c, x] = mk(32, 150);
  shadow(x, 16, 147, 15, 3);
  const tier = (y0, h, w, col) => {
    const l = 16 - w / 2;
    R(x, l - 1, y0 - 1, w + 2, h + 2, C.out); R(x, l, y0, w, h, C.wall); R(x, l + w - 4, y0, 4, h, C.wall2);
    for (let X = l + 2; X < l + w - 2; X += 5) R(x, X, y0 + 2, 2, h - 4, col);
    const aw = Math.max(2, Math.floor(w / 6));
    for (let X = l + 4; X < l + w - 4; X += 10) { R(x, X, y0 + 6, aw, h - 12, C.glass); R(x, X, y0 + 5, aw, 1, C.out); }
    R(x, l - 1, y0 + h, w + 2, 2, C.gold2);
  };
  tier(108, 38, 30, '#7cbf8a');
  tier(76, 32, 26, '#7cbf8a');
  tier(48, 28, 22, '#7cbf8a');
  tier(26, 22, 16, '#7cbf8a');
  // the gilded dome and cross
  for (let k = 0; k <= 12; k++) { const r = 8 * Math.sqrt(1 - Math.pow(k / 12, 1.4)); R(x, Math.round(16 - r), 25 - k, Math.round(r * 2), 1, k > 9 ? GOLD_DOMES.dome1 : GOLD_DOMES.dome); }
  R(x, 15, 3, 2, 10, C.gold); R(x, 12, 6, 8, 1, C.gold); R(x, 13, 10, 6, 1, C.gold);
  return c;
}

function makeCannon() {
  const [c, x] = mk(20, 14);
  shadow(x, 10, 12, 8, 2);
  R(x, 2, 7, 12, 3, C.wd2); R(x, 2, 7, 12, 1, C.wd1);
  for (const cx of [4, 12]) { R(x, cx - 2, 8, 5, 5, C.out); R(x, cx - 1, 9, 3, 3, C.wd1); P(x, cx, 10, C.wd3); }
  R(x, 4, 2, 15, 5, C.out); R(x, 5, 3, 13, 3, '#5a5466'); R(x, 5, 3, 13, 1, '#8a8496'); R(x, 17, 2, 3, 5, C.out);
  return c;
}

function makeLamp() {
  const [c, x] = mk(16, 40);
  shadow(x, 8, 38, 4, 1.5);
  R(x, 7, 10, 2, 29, '#3a3046'); R(x, 6, 36, 4, 3, '#3a3046'); R(x, 5, 9, 6, 2, '#3a3046');
  R(x, 4, 1, 8, 8, C.out); R(x, 5, 2, 6, 6, '#f6e7a0'); R(x, 5, 2, 6, 1, '#fff6c8'); R(x, 6, 0, 4, 1, C.out);
  return c;
}

function makeFountain() {
  // Samson's fountain on Kontraktova square: a little rotunda over the spring
  const [c, x] = mk(32, 48);
  shadow(x, 16, 45, 15, 3);
  R(x, 1, 34, 30, 12, C.out); R(x, 2, 35, 28, 10, STONE[1]); R(x, 2, 35, 28, 2, STONE[0]); R(x, 4, 38, 24, 5, C.w2); R(x, 4, 38, 24, 1, C.w0);
  for (const X of [5, 12, 19, 26]) { R(x, X - 1, 16, 3, 22, C.out); R(x, X, 16, 1, 21, C.wall); }
  for (let k = 0; k <= 9; k++) { const r = 14 * Math.sqrt(1 - Math.pow(k / 9, 1.6)); R(x, Math.round(16 - r), 15 - k, Math.round(r * 2), 1, k === 0 ? C.out : k > 6 ? '#7cbf8a' : '#4f8a5a'); }
  R(x, 14, 18, 4, 9, '#c49a3e'); R(x, 15, 16, 2, 2, '#c49a3e');   // Samson and his lion, gilded
  R(x, 15, 0, 2, 6, C.gold); R(x, 13, 2, 6, 1, C.gold);
  return c;
}

function makeCaveMouth() {
  // a door into the hill: the way down to the Lavra caves
  const [c, x] = mk(32, 32);
  for (let y = 0; y < 32; y++) for (let X = 0; X < 32; X++) {
    const d = Math.hypot((X + .5 - 16) / 16, (y + .5 - 30) / 28);
    if (d < 1) P(x, X, y, d > .93 ? C.leaf3 : hash(X >> 1, y >> 1, 77) < .15 ? C.leaf2 : C.leaf1);
  }
  R(x, 9, 12, 14, 20, C.out); R(x, 10, 13, 12, 19, C.wall); R(x, 12, 17, 8, 15, '#1d1820'); R(x, 13, 16, 6, 1, '#1d1820'); R(x, 14, 15, 4, 1, '#1d1820');
  R(x, 15, 8, 2, 5, C.gold); R(x, 13, 10, 6, 1, C.gold);
  return c;
}

function makeChaika() {
  // a chaika: the kozaks' longboat, bundles of reed lashed along its sides
  const [c, x] = mk(48, 22);
  R(x, 2, 18, 44, 2, C.w0);
  for (let X = 1; X < 47; X++) {
    const t = Math.abs(X - 24) / 23, top = 8 + Math.round(t * t * -5), bot = 17 - Math.round(t * t * 4);
    R(x, X, top, 1, bot - top, C.out);
    if (X > 1 && X < 46) { R(x, X, top + 1, 1, 3, '#c9b070'); R(x, X, top + 4, 1, bot - top - 5, C.wd1); }
  }
  for (let X = 6; X < 42; X += 4) R(x, X, 10, 1, 2, '#a89050');
  R(x, 23, 0, 2, 10, C.wd3); R(x, 25, 1, 10, 6, '#f4f1e6'); R(x, 25, 1, 10, 1, C.out); R(x, 34, 1, 1, 6, C.out); R(x, 25, 6, 10, 1, '#d6d0c2');
  return c;
}

function makeTram() {
  // a Kyiv tram, red and cream, waiting at its stop
  const [c, x] = mk(48, 32);
  shadow(x, 24, 30, 23, 2);
  R(x, 22, 0, 1, 5, C.out); line(x, 16, 0, 28, 0, C.out);
  R(x, 1, 5, 46, 24, C.out); R(x, 2, 6, 44, 10, '#f4ecd8'); R(x, 2, 16, 44, 12, '#c8383a'); R(x, 2, 16, 44, 1, '#8f2430');
  for (let X = 5; X < 44; X += 7) { R(x, X, 8, 5, 6, C.glass); P(x, X + 1, 9, C.glass2); }
  R(x, 20, 16, 7, 12, '#8f2430'); R(x, 21, 17, 5, 10, C.glass);
  for (const X of [8, 38]) { R(x, X - 2, 27, 5, 4, C.out); R(x, X - 1, 28, 3, 2, '#5a5466'); }
  return c;
}

// ─── Inside the Lavra caves and Kyiv shops ────────────────────────────────
function drawBookshelf(x, X, Y) {
  R(x, X, Y, 16, 22, C.wd3); R(x, X + 1, Y + 1, 14, 20, C.wd2);
  const cols = ['#c8383a', '#3f6fc4', '#4c9c66', '#f3c84f', '#7a3e8a', '#e8794a'];
  for (const sy of [Y + 2, Y + 9, Y + 16]) {
    let bx = X + 1;
    while (bx < X + 14) { const w = 1 + Math.floor(hash(bx, sy, 31) * 2); R(x, bx, sy, w, 5, cols[Math.floor(hash(bx, sy, 32) * cols.length)]); bx += w + (hash(bx, sy, 33) < .2 ? 1 : 0); }
    R(x, X + 1, sy + 5, 14, 2, C.wd1);
  }
}
function drawNiche(x, X, Y) {
  // a niche in the cave wall, with a little icon and a lamp
  R(x, X + 3, Y + 2, 10, 13, '#3a2e26'); R(x, X + 4, Y + 1, 8, 1, '#3a2e26');
  R(x, X + 5, Y + 4, 6, 7, C.gold2); R(x, X + 6, Y + 5, 4, 5, '#5a77b5'); R(x, X + 7, Y + 6, 2, 2, C.skin);
  P(x, X + 8, Y + 13, '#e0503a');
}
