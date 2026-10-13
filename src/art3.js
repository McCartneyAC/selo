// ─── Inside: floors, walls and what hangs on them ─────────────────────────
const IN0 = {
  void: '#1d1820', clay0: '#d2ab80', clay1: '#c79f74', clay2: '#b38b62',
  plank0: '#b98352', plank1: '#a2703f', plank2: '#7d5233',
  wall: '#f3eee1', wall2: '#e4dccb', beam: '#6b4a2c', beam2: '#4e3420',
};
const INSIDE_CH = new Set(['X', 'W', '_', '+', 'E', 'U', 'I', 'G', 'J', 'D', 'c', 'h', 'v', 'Y', 'o', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'q', 'r']);
const WALL_CH = new Set(['W', 'U', 'I', 'G', 'J', 'D', 'c', 'h', 'v', 'Y', 'o']);
// the Lavra caves: dug into clay, lit by little lamps
const CAVE = { wall: '#8a6a4a', wall2: '#74573b', beam: '#5a4230', beam2: '#3e2e22', clay0: '#7a6450', clay1: '#6e5946', clay2: '#5e4b3a' };
const FLOOR_CH = new Set(['_', '+', 'E']);

// stone: walls of grey stone and no painted border, like the cave but not dark
const STONE_IN = { wall: '#a9a294', wall2: '#857f72', beam: '#5f5a52', beam2: '#3e3a36', clay0: '#8e887c', clay1: '#857f72', clay2: '#6e6a62' };
function buildInterior(cave, stone) {
  const [c, x] = mk(MW * TS, MH * TS);
  const IN = Object.assign({}, IN0, cave ? CAVE : {}, stone ? STONE_IN : {});
  const plankFloor = MAP.some(r => r.includes('+'));
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
    const ch = T(tx, ty), px = tx * 16, py = ty * 16;
    if (ch === 'X') { R(x, px, py, 16, 16, IN.void); continue; }
    if (WALL_CH.has(ch)) {
      const top = !WALL_CH.has(T(tx, ty - 1)), bottom = !WALL_CH.has(T(tx, ty + 1));
      R(x, px, py, 16, 16, IN.wall);
      for (let i = 0; i < 6; i++) P(x, px + Math.floor(hash(tx, ty, i) * 16), py + Math.floor(hash(tx, ty, i + 9) * 16), IN.wall2);
      if (top) { R(x, px, py, 16, 4, IN.beam); R(x, px, py + 4, 16, 1, IN.beam2); }
      if (bottom && !cave && !stone) {
        // a painted border along the bottom of the wall: red and green, like the old village wall painting
        R(x, px, py + 11, 16, 1, '#c8383a');
        for (let X = 0; X < 16; X += 4) { P(x, px + X + 1, py + 12, '#3d8a64'); P(x, px + X + 2, py + 13, '#3d8a64'); P(x, px + X + 3, py + 12, '#3d8a64'); }
        R(x, px, py + 14, 16, 2, IN.wall2);
      }
      continue;
    }
    // floor
    const plank = ch === '+' || (ch !== '_' && plankFloor);
    for (let y = 0; y < 16; y++) for (let X = 0; X < 16; X++) {
      const wx = px + X, wy = py + y;
      let col;
      if (plank) {
        const row = wy >> 2, seam = (wy & 3) === 3, joint = ((wx + row * 7) % 24) === 0;
        col = seam || joint ? IN.plank2 : hash(wx >> 2, row, 3) < .3 ? IN.plank1 : IN.plank0;
      } else {
        const h = hash(wx, wy, 5);
        col = h < .05 ? IN.clay2 : h < .3 ? IN.clay1 : IN.clay0;
        if (hash(wx >> 3, wy >> 3, 6) < .08 && (wx + wy) % 5 === 0) col = IN.clay2;
      }
      P(x, wx, wy, col);
    }
    if (WALL_CH.has(T(tx, ty - 1))) R(x, px, py, 16, 2, 'rgba(60,40,30,.25)');
    if (T(tx - 1, ty) === 'X') R(x, px, py, 2, 16, 'rgba(60,40,30,.2)');
    if (ch === 'E') { R(x, px + 2, py + 6, 12, 10, '#8a3c3c'); for (let X = 3; X < 14; X += 2) R(x, px + X, py + 7, 1, 8, '#b85a4a'); }
  }
  // what hangs on the walls: drawn over the two wall rows
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
    const ch = T(tx, ty), px = tx * 16, py = ty * 16;
    if (ch === 'U') drawWindow(x, px, py - 8);
    else if (ch === 'I') drawIconCorner(x, px, py - 10);
    else if (ch === 'G') drawRushnyk(x, px + 3, py - 8);
    else if (ch === 'J') drawShelf(x, px, py - 6);
    else if (ch === 'D' && T(tx - 1, ty) !== 'D') drawBoard(x, px, py - 8, [1, 2, 3, 4].findIndex(k => T(tx + k, ty) !== 'D') + 1);
    else if (ch === 'c') drawCobweb(x, px, py - 16);
    else if (ch === 'h' || ch === 'v') drawIconostasis(x, tx, ty, ch === 'v');
    else if (ch === 'Y' && T(tx, ty + 1) !== 'Y') drawBookshelf(x, px, py - 8);
    else if (ch === 'o') drawNiche(x, px, py);
  }
  return { canvas: c, over: {} };
}
function drawWindow(x, X, Y) {
  R(x, X + 2, Y, 12, 13, '#3f6fc4'); R(x, X + 3, Y + 1, 10, 11, '#9fd2ee'); R(x, X + 3, Y + 7, 10, 5, '#b7e08a');
  R(x, X + 7, Y + 1, 2, 11, '#3f6fc4'); R(x, X + 3, Y + 6, 10, 1, '#3f6fc4');
  P(x, X + 4, Y + 2, '#fbf8f0'); P(x, X + 5, Y + 2, '#fbf8f0');
  R(x, X + 1, Y + 13, 14, 2, '#2d4f91');
  P(x, X + 3, Y + 12, C.red); P(x, X + 12, Y + 12, C.pink);
}
function drawRushnyk(x, X, Y) {
  // an embroidered towel over a peg: white linen, red and black cross-stitch at the ends
  R(x, X + 4, Y, 2, 2, C.wd2);
  R(x, X, Y + 2, 10, 18, '#fbf8f0'); R(x, X + 9, Y + 2, 1, 18, '#ddd6c6');
  for (const yy of [Y + 13, Y + 16]) for (let k = 0; k < 10; k += 2) { P(x, X + k, yy, C.red); P(x, X + k + 1, yy + 1, C.red); P(x, X + k, yy + 1, '#2b2230'); }
  for (let k = 0; k < 10; k += 2) P(x, X + k, Y + 20, '#fbf8f0');
}
function drawIconCorner(x, X, Y) {
  R(x, X + 3, Y + 2, 10, 13, C.gold2); R(x, X + 4, Y + 3, 8, 11, '#5a77b5');
  R(x, X + 6, Y + 4, 4, 4, C.gold); R(x, X + 7, Y + 5, 2, 3, C.skin); R(x, X + 5, Y + 8, 6, 6, '#8f2430');
  // the rushnyk draped over the icon
  R(x, X + 1, Y, 14, 3, '#fbf8f0'); R(x, X, Y + 2, 3, 15, '#fbf8f0'); R(x, X + 13, Y + 2, 3, 15, '#fbf8f0');
  for (let k = 0; k < 3; k++) { P(x, X + k, Y + 14, C.red); P(x, X + 13 + k, Y + 14, C.red); P(x, X + k, Y + 15, '#2b2230'); P(x, X + 13 + k, Y + 15, '#2b2230'); }
  R(x, X + 7, Y + 17, 2, 3, '#b8323a'); P(x, X + 7, Y + 16, '#f6c93c');
}
function drawShelf(x, X, Y) {
  R(x, X + 1, Y + 10, 14, 2, C.wd1); R(x, X + 1, Y + 2, 1, 10, C.wd2); R(x, X + 14, Y + 2, 1, 10, C.wd2);
  const plate = (cx, cy, a, b) => { R(x, cx - 2, cy - 3, 5, 7, a); R(x, cx - 3, cy - 2, 7, 5, a); R(x, cx - 1, cy - 1, 3, 3, b); };
  plate(X + 5, Y + 6, '#fbf8f0', '#3f6fc4'); plate(X + 11, Y + 6, '#f3c84f', '#cc3b3d');
  for (const [px, col] of [[4, '#b8582f'], [9, '#3d8a64']]) { R(x, X + px, Y + 13, 3, 3, col); P(x, X + px + 1, Y + 12, col); }
}
function drawBoard(x, X, Y, n) {
  const w = n * 16;
  R(x, X, Y, w, 14, C.wd2); R(x, X + 1, Y + 1, w - 2, 12, '#2f4a3c');
  const chalk = '#dfe8dc';
  // А Б В, and a sum
  const glyphs = [[0, 4, 1, 0, 2, 4, 0, 2, 2, 2], [0, 0, 2, 0, 0, 0, 0, 4, 0, 2, 2, 2, 2, 4, 0, 4], [0, 0, 0, 4, 1, 0, 1, 2, 1, 4]];
  glyphs.forEach((g, k) => { for (let i = 0; i < g.length; i += 2) P(x, X + 4 + k * 6 + g[i], Y + 3 + g[i + 1], chalk); });
  for (let k = 0; k < w - 24; k += 3) P(x, X + 22 + k, Y + 10, chalk);
  R(x, X + 2, Y + 14, w - 4, 1, C.wd1);
}
function drawCobweb(x, X, Y) {
  const col = 'rgba(80,70,80,.55)';
  for (let k = 0; k < 10; k++) { P(x, X + k, Y + 4, col); P(x, X + 3, Y + 4 + k, col); }
  line(x, X, Y + 4, X + 9, Y + 13, col); line(x, X + 6, Y + 4, X + 3, Y + 10, col);
  for (let y = Y + 18; y < Y + 30; y += 3) P(x, X + 11, y, '#b8ae9a');
}
function drawIconostasis(x, tx, ty, doors) {
  const X = tx * 16, Y = ty * 16;
  R(x, X, Y, 16, 16, C.gold2);
  if (ty === 0) { R(x, X, Y, 16, 4, IN0.beam); for (let k = 0; k < 16; k += 4) R(x, X + k + 1, Y + 6, 2, 2, C.gold); }
  if (doors) {
    // the royal doors: golden lattice
    R(x, X + 1, Y, 14, 16, C.gold);
    for (let y = 0; y < 16; y += 4) for (let k = 0; k < 14; k += 4) { P(x, X + 2 + k, Y + y + 1, C.gold2); P(x, X + 3 + k, Y + y + 2, C.gold2); }
    R(x, X + 7, Y, 2, 16, C.gold2);
    if (ty === 0) { R(x, X + 6, Y + 4, 4, 1, C.gold); R(x, X + 7, Y + 2, 2, 5, C.gold); }
    return;
  }
  // an icon in each panel: a saint in a red or blue robe with a halo
  R(x, X + 2, Y + 2, 12, 13, C.out);
  R(x, X + 3, Y + 3, 10, 11, ty === 2 ? '#3f6fc4' : '#7a2a2a');
  R(x, X + 6, Y + 4, 4, 4, C.gold); R(x, X + 7, Y + 5, 2, 2, C.skin);
  R(x, X + 5, Y + 8, 6, 6, (tx + ty) % 2 ? '#8f2430' : '#2d4f91'); R(x, X + 7, Y + 9, 2, 3, C.gold);
}

// ─── Furniture ────────────────────────────────────────────────────────────
function makePich() {
  // the great clay stove: you bake on it, you sleep on it, the domovyk lives behind it
  const [c, x] = mk(48, 44);
  R(x, 30, 0, 12, 14, IN0.wall2); R(x, 31, 0, 10, 14, '#f8f4ea'); R(x, 30, 0, 1, 14, C.out); R(x, 41, 0, 1, 14, C.out);
  R(x, 0, 10, 48, 34, C.out);
  R(x, 1, 11, 46, 32, '#f8f4ea'); R(x, 40, 11, 7, 32, '#e6dfd0'); R(x, 1, 11, 46, 3, '#e9e2d3');
  // lezhanka: the warm ledge on top, with a striped rug
  R(x, 2, 14, 22, 6, '#c8383a'); for (let k = 2; k < 24; k += 4) R(x, k, 14, 2, 6, '#2d4f91'); R(x, 2, 19, 22, 1, '#8f2430');
  // the mouth of the oven with embers
  R(x, 16, 26, 16, 14, C.out); R(x, 17, 27, 14, 13, '#2a1a14'); R(x, 18, 26, 12, 1, C.out);
  R(x, 19, 35, 10, 4, '#e8794a'); R(x, 21, 34, 6, 2, '#f6c93c'); P(x, 23, 33, '#fff3b0');
  R(x, 14, 40, 20, 2, '#d9cfbc');
  // painted flowers on the side
  const flower = (fx, fy, a, b) => { P(x, fx, fy, b); P(x, fx - 1, fy, a); P(x, fx + 1, fy, a); P(x, fx, fy - 1, a); P(x, fx, fy + 1, a); P(x, fx - 2, fy + 2, '#3d8a64'); P(x, fx + 2, fy + 2, '#3d8a64'); };
  flower(6, 28, '#c8383a', '#f6c93c'); flower(10, 33, '#3f6fc4', '#f6c93c'); flower(39, 28, '#c8383a', '#f6c93c'); flower(43, 34, '#3f6fc4', '#fbf8f0');
  for (let k = 3; k < 13; k += 2) P(x, k, 38, '#3d8a64');
  return c;
}
function makeTable() {
  const [c, x] = mk(32, 22);
  R(x, 3, 14, 2, 8, C.wd2); R(x, 27, 14, 2, 8, C.wd2);
  R(x, 0, 6, 32, 9, C.out); R(x, 1, 7, 30, 7, '#fbf8f0'); R(x, 1, 12, 30, 2, '#e8e0cf');
  for (let k = 1; k < 31; k += 2) { P(x, k, 13, C.red); P(x, k + 1, 12, C.red); }
  // a round loaf: palianytsia
  R(x, 9, 2, 14, 7, C.out); R(x, 10, 3, 12, 5, '#d9963f'); R(x, 11, 3, 8, 2, '#efb862'); R(x, 12, 5, 6, 1, '#b8722a');
  R(x, 25, 5, 3, 3, '#cfd8e8'); P(x, 26, 5, '#fbf8f0');
  return c;
}
function makeBench() {
  const [c, x] = mk(16, 16);
  R(x, 2, 11, 2, 5, C.wd2); R(x, 12, 11, 2, 5, C.wd2);
  R(x, 0, 6, 16, 6, C.out); R(x, 1, 7, 14, 4, C.wd0);
  for (let k = 1; k < 15; k += 3) R(x, k, 7, 1, 4, '#c8383a');
  return c;
}
function makeChest() {
  const [c, x] = mk(16, 18);
  R(x, 0, 4, 16, 14, C.out); R(x, 1, 5, 14, 12, '#3d7a5a'); R(x, 1, 5, 14, 3, '#4f9a6e');
  R(x, 1, 8, 14, 1, C.gold2); R(x, 7, 10, 2, 3, C.gold2);
  P(x, 4, 13, C.red); P(x, 3, 13, '#f6c93c'); P(x, 5, 13, '#f6c93c'); P(x, 4, 12, '#f6c93c'); P(x, 4, 14, '#f6c93c');
  P(x, 12, 13, C.red); P(x, 11, 13, '#f6c93c'); P(x, 13, 13, '#f6c93c'); P(x, 12, 12, '#f6c93c'); P(x, 12, 14, '#f6c93c');
  return c;
}
function makeBed() {
  // a bed with its tower of pillows, as every good khata has
  const [c, x] = mk(16, 36);
  R(x, 0, 6, 16, 30, C.out); R(x, 1, 7, 14, 28, C.wd1);
  R(x, 1, 16, 14, 18, '#c8383a'); for (let y = 18; y < 34; y += 4) for (let k = 1; k < 15; k += 4) { P(x, k + 1, y, '#f6c93c'); P(x, k + 2, y + 1, '#2b2230'); }
  for (let k = 0; k < 3; k++) {
    const y = 2 + k * 4, w = 12 - k * 2, X = 2 + k;
    R(x, X - 1, y, w + 2, 6, C.out); R(x, X, y + 1, w, 4, '#fbf8f0'); R(x, X, y + 4, w, 1, '#ddd6c6');
    for (let j = 0; j < w; j += 2) P(x, X + j, y + 5, '#fbf8f0');
  }
  return c;
}
function makeDesk() {
  const [c, x] = mk(16, 18);
  R(x, 2, 12, 2, 6, C.wd2); R(x, 12, 12, 2, 6, C.wd2);
  R(x, 0, 6, 16, 7, C.out); R(x, 1, 7, 14, 5, C.wd0);
  R(x, 4, 4, 8, 4, '#fbf8f0'); R(x, 8, 4, 1, 4, '#c9c0ae'); R(x, 5, 5, 2, 1, '#8f86a0'); R(x, 9, 5, 2, 1, '#8f86a0');
  return c;
}
function makeLoom() {
  const [c, x] = mk(32, 30);
  R(x, 1, 2, 2, 28, C.wd2); R(x, 29, 2, 2, 28, C.wd2); R(x, 1, 2, 30, 2, C.wd1); R(x, 1, 24, 30, 2, C.wd1);
  for (let y = 5; y < 22; y++) for (let X = 4; X < 28; X++) {
    const band = (y >> 1) % 4;
    P(x, X, y, y < 14 ? (X % 2 ? '#efe6d0' : '#d9cfb8') : band === 0 ? C.red : band === 2 ? '#2b2230' : ((X + y) % 4 === 0 ? C.red : '#fbf8f0'));
  }
  R(x, 3, 14, 26, 1, C.wd3);
  return c;
}
function makeWheel() {
  const [c, x] = mk(16, 22);
  R(x, 2, 18, 12, 2, C.wd2); R(x, 4, 12, 2, 7, C.wd2); R(x, 11, 8, 2, 11, C.wd2);
  for (let a = 0; a < 24; a++) { const t = a / 24 * Math.PI * 2; P(x, Math.round(6 + Math.cos(t) * 5), Math.round(8 + Math.sin(t) * 5), C.wd1); }
  line(x, 1, 8, 11, 8, C.wd2); line(x, 6, 3, 6, 13, C.wd2);
  R(x, 11, 2, 3, 6, '#efe6d0'); P(x, 12, 1, '#efe6d0');
  return c;
}
function makeCandleStand() {
  const [c, x] = mk(16, 28);
  R(x, 5, 24, 6, 3, C.gold2); R(x, 7, 10, 2, 15, C.gold2); R(x, 2, 8, 12, 3, C.gold); R(x, 2, 10, 12, 1, C.gold2);
  for (const k of [3, 6, 9, 12]) R(x, k, 3 + (k % 2), 1, 5 - (k % 2), '#f3e6b0');
  return c;
}
function makeLectern() {
  const [c, x] = mk(16, 22);
  R(x, 6, 10, 4, 11, C.wd2); R(x, 4, 20, 8, 2, C.wd2);
  R(x, 1, 3, 14, 9, '#8f2430'); R(x, 1, 3, 14, 1, C.gold); R(x, 1, 11, 14, 1, C.gold);
  R(x, 3, 1, 10, 4, '#fbf8f0'); R(x, 8, 1, 1, 4, '#c9c0ae'); R(x, 6, 5, 4, 4, C.gold); R(x, 7, 6, 2, 2, '#8f2430');
  return c;
}
function makeSacks() {
  const [c, x] = mk(16, 16);
  for (const [X, Y] of [[1, 5], [7, 6]]) {
    R(x, X, Y + 1, 8, 9, C.out); R(x, X + 1, Y + 2, 6, 7, '#e8e0cc'); R(x, X + 1, Y + 2, 2, 7, '#f6f1e3');
    R(x, X + 2, Y, 4, 2, C.out); P(x, X + 3, Y - 1, '#c9a27a');
  }
  return c;
}

// ─── Creatures and night things ───────────────────────────────────────────
function makeCat(frame) {
  return art([
    '..o.....o.......',
    '.ogo...ogo......',
    '.ogggggggo......',
    'ogeggggegoo.....',
    'oggggpgggo.o....',
    '.ogggggggoo.....',
    '..ogggggggo.....',
    '..oggwwgggo.....',
    '.ogggwwggggo.oo.',
    '.ogggwwgggggoggo',
    '.oggggggggggogo.',
    frame ? '.ogggggggggggo..' : '.ogggggggggggo...'.slice(0, 16),
    '..owwoooowwoo...'], { o: C.out, g: '#8a8a9a', w: '#fbf8f0', e: '#f3c84f', p: '#e88aa0' });
}
function makeFire(frame) {
  const [c, x] = mk(16, 24);
  R(x, 1, 19, 14, 3, C.wd3); line(x, 1, 22, 14, 18, C.wd2, 2); line(x, 1, 18, 14, 22, C.wd2, 2);
  const cols = ['#fff3b0', '#f6c93c', '#ec8b2e', '#cc3b3d'];
  for (let y = 2; y < 20; y++) {
    const w = Math.max(0, Math.round((y - 2) * .45 + Math.sin(y * 1.3 + frame * 2.1) * 1.5));
    for (let k = -w; k <= w; k++) {
      const d = Math.abs(k) / (w + 1) + (20 - y) / 30;
      P(x, 8 + k, y, cols[Math.min(3, Math.floor(d * 2.6))]);
    }
  }
  return c;
}
function makeFernFlower(frame) {
  const [c, x] = mk(16, 20);
  R(x, 7, 10, 2, 10, C.leaf2);
  P(x, 5, 14, C.leaf1); P(x, 4, 13, C.leaf1); P(x, 10, 15, C.leaf1); P(x, 11, 14, C.leaf1);
  const r = frame ? 4 : 3.4;
  for (let y = 0; y < 12; y++) for (let X = 0; X < 16; X++) {
    const d = Math.hypot(X + .5 - 8, y + .5 - 6);
    const a = Math.atan2(y - 6, X - 8), pet = (Math.cos(a * 5 + frame) + 1) / 2;
    if (d < 1.6) P(x, X, y, '#fffbe0');
    else if (d < r + pet * 1.6) P(x, X, y, pet > .5 ? '#ff8a6a' : '#f6c93c');
  }
  return c;
}

// ─── Things you can carry ─────────────────────────────────────────────────
function makeItemIcon(id) {
  const [c, x] = mk(16, 16);
  if (id === 'bread') { R(x, 2, 6, 12, 7, C.out); R(x, 3, 7, 10, 5, '#d9963f'); R(x, 4, 7, 6, 2, '#efb862'); R(x, 5, 9, 5, 1, '#b8722a'); }
  else if (id === 'candle') { R(x, 6, 5, 4, 10, '#f3e6b0'); R(x, 6, 5, 1, 10, '#fbf8f0'); R(x, 7, 1, 2, 4, '#f6c93c'); P(x, 7, 2, '#fff3b0'); R(x, 4, 14, 8, 2, C.gold2); }
  else if (id === 'wreath') {
    for (let a = 0; a < 20; a++) { const t = a / 20 * Math.PI * 2, X = Math.round(8 + Math.cos(t) * 5), Y = Math.round(8 + Math.sin(t) * 4); P(x, X, Y, a % 3 ? C.leaf1 : [C.red, C.yel, '#6f8fe8'][a % 9 / 3 | 0]); P(x, X, Y + 1, C.leaf2); }
    R(x, 7, 12, 1, 4, C.red); R(x, 9, 12, 1, 4, '#3f6fc4');
  }
  else if (id === 'fern') x.drawImage(makeFernFlower(1), 0, 0, 16, 16, 0, -1, 16, 16);
  else if (id === 'feather') { line(x, 3, 14, 12, 2, '#c9c4b8'); for (let k = 0; k < 7; k++) { P(x, 5 + k, 10 - k, '#fbf8f0'); P(x, 6 + k, 11 - k, '#fbf8f0'); } R(x, 11, 1, 3, 3, C.out); }
  else if (id === 'honey') { R(x, 2, 4, 12, 9, C.yel2); for (let y = 5; y < 12; y += 3) for (let k = 3; k < 13; k += 3) { R(x, k, y, 2, 2, C.yel); } R(x, 2, 12, 12, 1, C.org2); }
  else if (id === 'ear') { R(x, 8, 7, 1, 9, '#c49a3e'); for (let y = 1; y < 9; y++) { P(x, 7, y, y % 2 ? THATCH[0] : THATCH[1]); P(x, 9, y + 1, y % 2 ? THATCH[1] : THATCH[0]); } P(x, 8, 0, THATCH[0]); }
  else if (id === 'sopilka') { line(x, 2, 14, 13, 3, C.wd1, 2); for (const k of [5, 7, 9]) P(x, k, 16 - k - 1, C.out); }
  else if (id === 'beets') { for (const [X, Y] of [[4, 9], [10, 10]]) { R(x, X - 3, Y - 2, 6, 6, '#8f2430'); R(x, X - 2, Y - 1, 3, 3, '#b8323a'); P(x, X, Y + 4, '#8f2430'); R(x, X - 1, Y - 7, 1, 5, C.leaf2); R(x, X + 1, Y - 6, 1, 4, C.leaf1); } }
  else if (id === 'flour') { R(x, 3, 4, 10, 11, C.out); R(x, 4, 5, 8, 9, '#efe6d0'); R(x, 4, 5, 3, 9, '#fbf8f0'); R(x, 5, 2, 6, 3, C.out); R(x, 6, 3, 4, 1, '#c9a27a'); }
  else if (id === 'book') { R(x, 2, 3, 12, 11, C.out); R(x, 3, 4, 10, 9, '#3f6fc4'); R(x, 3, 12, 10, 1, '#fbf8f0'); R(x, 6, 6, 4, 4, C.gold); }
  else if (id === 'thread') { for (let y = 4; y < 13; y++) R(x, 4, y, 8, 1, y % 2 ? C.red : '#e05a4f'); R(x, 3, 3, 10, 1, C.wd1); R(x, 3, 13, 10, 1, C.wd1); line(x, 12, 8, 15, 14, C.red); }
  else if (id === 'salt') { R(x, 3, 5, 10, 10, C.out); R(x, 4, 6, 8, 8, '#c9a27a'); R(x, 5, 3, 6, 3, '#fbf8f0'); P(x, 6, 2, '#fbf8f0'); P(x, 9, 2, '#e8e2d2'); }
  else if (id === 'vyshyvanka') { R(x, 4, 3, 8, 12, '#fbf8f0'); R(x, 1, 4, 3, 6, '#fbf8f0'); R(x, 12, 4, 3, 6, '#fbf8f0'); R(x, 7, 3, 2, 6, C.gold); for (let y = 10; y < 15; y += 2) R(x, 4, y, 8, 1, C.red); P(x, 1, 9, C.red); P(x, 14, 9, C.red); }
  else if (id === 'milkyway') { R(x, 0, 0, 16, 16, '#1d2a4a'); for (let k = 0; k < 16; k++) { P(x, k, 13 - k * .8 | 0, '#e8e4f8'); if (k % 3 === 0) P(x, k, 15 - k * .8 | 0, '#9fb0e0'); } P(x, 3, 3, '#fbf8f0'); P(x, 12, 12, '#fbf8f0'); P(x, 13, 4, '#f3c84f'); }
  else if (id === 'herbs') { for (const X of [5, 8, 11]) { R(x, X, 4, 1, 10, C.leaf2); P(x, X - 1, 5, C.leaf1); P(x, X + 1, 7, C.leaf1); P(x, X, 3, X === 8 ? '#fbf8f0' : C.yel); } R(x, 4, 10, 9, 2, C.red); }
  else if (id === 'honeypot') { R(x, 3, 5, 10, 10, C.out); R(x, 4, 6, 8, 8, '#b8582f'); R(x, 4, 6, 3, 8, '#d9804a'); R(x, 3, 3, 10, 3, '#efe6d0'); R(x, 6, 2, 4, 1, C.red); }
  else if (id === 'fish') { for (const Y of [4, 9]) { R(x, 3, Y, 9, 4, '#8fb2c8'); R(x, 3, Y, 9, 1, '#c4dce8'); R(x, 12, Y, 3, 4, '#6f94aa'); P(x, 4, Y + 1, C.out); } R(x, 2, 2, 1, 12, C.wd2); }
  else if (id === 'sleeve') { R(x, 3, 3, 9, 11, C.out); R(x, 4, 4, 7, 9, C.red); R(x, 4, 4, 2, 9, '#e05a4f'); R(x, 4, 12, 7, 2, C.gold); }
  else if (id === 'boots') { for (const X of [2, 9]) { R(x, X, 2, 5, 10, C.out); R(x, X + 1, 3, 3, 8, '#7a3b22'); R(x, X, 11, 7, 3, C.out); R(x, X + 1, 12, 5, 1, '#5a2a18'); } }
  else if (id === 'pipe') { R(x, 2, 6, 5, 6, C.out); R(x, 3, 7, 3, 4, C.wd1); line(x, 6, 9, 14, 4, C.wd2, 1); P(x, 4, 5, '#c9c4b8'); P(x, 5, 3, '#c9c4b8'); }
  else if (id === 'horseshoe') { for (let a = 0; a < 18; a++) { const t = Math.PI * (a / 17), X = Math.round(8 - Math.cos(t) * 5), Y = Math.round(9 - Math.sin(t) * 6); R(x, X, Y, 2, 2, '#8a8496'); } R(x, 3, 9, 2, 5, '#8a8496'); R(x, 11, 9, 2, 5, '#8a8496'); }
  else if (id === 'letter') { R(x, 2, 4, 12, 9, C.out); R(x, 3, 5, 10, 7, '#f4ecd8'); line(x, 3, 5, 8, 9, '#c9b888'); line(x, 12, 5, 8, 9, '#c9b888'); R(x, 7, 8, 2, 2, C.red); }
  else if (id === 'tooth') { R(x, 6, 2, 4, 3, '#efe6d0'); R(x, 6, 5, 4, 3, '#e4dcc8'); R(x, 7, 8, 2, 3, '#d6cdb8'); P(x, 7, 11, '#d6cdb8'); R(x, 5, 1, 6, 1, C.out); line(x, 3, 1, 13, 1, C.wd2); }
  else if (id === 'oar') { line(x, 2, 2, 10, 10, C.wd1, 2); R(x, 9, 9, 5, 5, C.wd0); R(x, 10, 10, 4, 4, C.wd1); }
  else if (id === 'ticket') { R(x, 2, 5, 12, 7, C.out); R(x, 3, 6, 10, 5, '#e9d89a'); R(x, 5, 7, 6, 1, '#8a7a5a'); R(x, 5, 9, 4, 1, '#8a7a5a'); P(x, 11, 9, C.out); }
  else if (id === 'lavracandle') { R(x, 7, 4, 2, 11, '#f3e6b0'); R(x, 7, 2, 2, 2, '#f6c93c'); P(x, 7, 1, '#fff3b0'); R(x, 5, 14, 6, 1, C.gold2); }
  else if (id === 'quill') { line(x, 3, 14, 13, 2, '#e8e4da', 2); line(x, 4, 13, 12, 3, '#c9c4b8'); R(x, 2, 14, 2, 2, C.out); }
  else if (id === 'scale') { R(x, 4, 4, 8, 8, '#7cc39b'); R(x, 5, 5, 6, 6, '#a8e0c0'); P(x, 6, 6, '#fbf8f0'); R(x, 4, 12, 8, 1, '#3d8a64'); }
  return c;
}
