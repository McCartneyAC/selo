// ─── Podillia, the Black Sea and Lviv ─────────────────────────────────────
// Map letters: ц cliff · с steps · ї salt crust (all ground) · ж the Kamianets castle (9x5) · п the cathedral with the minaret (5x4)
// р a ratusha (6x5) · о the Odesa opera (7x4) · к a ship (8x3) · м a lighthouse (2x2) · х salt heap (2x1) · в oxen (2x1)
// а acacia · я apple tree · л stone lion · ч café table
const LIME = ['#ece4d0', '#d8ceb6', '#c2b698', '#a0937a', '#7a6e5a'];     // Podillia limestone
const KAM_STONE = ['#e2d6b8', '#c9b994', '#a89874', '#83745a', '#5e523e'];
const TILE_ROOF = ['#d8785a', '#b8523e', '#923a2e', '#6e2a22'];
const LIPOVAN_CHURCH = { dome: '#4f86c6', dome1: '#9cc4ec', dome2: '#2f5f9a', wall: '#f6f1e3', wall2: '#e2dac6', wall3: '#c3b9a3', trim: '#4f86c6' };
const LVIV_TOWN = [['#e8c27a', '#c99e58', TILE_ROOF[1]], ['#9fc8b8', '#78a898', TILE_ROOF[2]], ['#e8a890', '#c8846c', '#5f6a7a'], ['#c8d4e8', '#a0b0cc', TILE_ROOF[1]],
  ['#f2e2b8', '#d6c294', '#4f7a6a'], ['#d89870', '#b87450', TILE_ROOF[2]], ['#e4d0e4', '#c4acc8', TILE_ROOF[1]]];

// a pointed tower roof, from a base width up to a point
function cone(x, cx, base, w, h, pal) {
  for (let k = 0; k <= h; k++) {
    const r = w / 2 * (1 - k / h), l = Math.round(cx - r), rr = Math.round(cx + r);
    if (rr < l) continue;
    R(x, l, base - k, rr - l + 1, 1, C.out);
    if (rr - l > 1) { R(x, l + 1, base - k, rr - l - 1, 1, pal[1]); R(x, l + 1, base - k, Math.max(1, Math.round((rr - l) * .3)), 1, pal[0]); R(x, rr - Math.max(1, Math.round((rr - l) * .25)), base - k, Math.max(1, Math.round((rr - l) * .25)), 1, pal[2]); }
  }
}
// a round tower: a stone drum with arrow slits
function drum(x, cx, top, bottom, r, S) {
  R(x, cx - r - 1, top, r * 2 + 2, bottom - top, C.out);
  for (let X = cx - r; X < cx + r; X++) {
    const t = (X - cx + r) / (2 * r), col = t < .25 ? S[0] : t < .7 ? S[1] : t < .9 ? S[2] : S[3];
    R(x, X, top + 1, 1, bottom - top - 1, col);
  }
  for (let y = top + 6; y < bottom - 2; y += 7) for (let X = cx - r + 2; X < cx + r - 1; X += 5) P(x, X + ((y / 7) & 1) * 2, y, S[3]);
  for (let y = top + 10; y < bottom - 14; y += 18) R(x, cx - 1, y, 2, 5, '#2b2230');
}

function makeCastle(flag) {
  // the fortress at Kamianets on its rock: a curtain wall, round towers with tall red roofs, the gate in the middle
  const [c, x] = mk(144, 132);
  const S = KAM_STONE, wallTop = 70;
  shadow(x, 72, 128, 70, 4);
  // the curtain wall with its battlements
  R(x, 6, wallTop, 132, 62, C.out); R(x, 7, wallTop + 1, 130, 60, S[1]);
  for (let y = wallTop + 6; y < 130; y += 6) { R(x, 7, y, 130, 1, S[2]); for (let X = 7 + ((y / 6) & 1) * 6; X < 137; X += 12) R(x, X, y - 5, 1, 5, S[2]); }
  R(x, 7, wallTop + 1, 130, 2, S[0]);
  for (let X = 8; X < 136; X += 7) { R(x, X, wallTop - 5, 4, 6, C.out); R(x, X + 1, wallTop - 4, 2, 5, S[0]); }
  for (let i = 0; i < 14; i++) { const X = 10 + Math.floor(hash(i, 4, 300) * 124), Y = wallTop + 8 + Math.floor(hash(i, 5, 300) * 50); P(x, X, Y, '#8aa060'); P(x, X + 1, Y, '#6a8a4a'); }
  // towers: west, the gatehouse's neighbours, and the great New East tower
  const towers = [[14, 40, 11, 30], [44, 52, 8, 22], [100, 50, 9, 24], [128, 26, 14, 40]];
  for (const [cx, top, r, h] of towers) { drum(x, cx, top, 131, r, S); cone(x, cx, top, r * 2 + 6, h, TILE_ROOF); P(x, cx, top - h - 1, C.out); }
  // the gatehouse: a square tower with a hipped roof, over the gate
  R(x, 57, 44, 30, 88, C.out); R(x, 58, 45, 28, 86, S[0]); R(x, 78, 45, 8, 86, S[2]);
  for (let y = 50; y < 128; y += 6) R(x, 58, y, 28, 1, S[1]);
  cone(x, 72, 44, 36, 22, TILE_ROOF);
  for (const wx of [63, 75]) { R(x, wx, 56, 5, 8, C.out); R(x, wx + 1, 57, 3, 6, '#3a3046'); }
  // the gate itself, under the fifth tile so you walk in where you expect
  R(x, 63, 100, 18, 32, C.out); R(x, 64, 104, 16, 28, '#2b2230'); R(x, 66, 101, 12, 3, '#2b2230');
  R(x, 64, 104, 16, 2, '#5e3d20'); for (let X = 65; X < 80; X += 3) R(x, X, 106, 1, 26, '#4b2f1c');
  if (flag) {   // the flag, back in its colours
    R(x, 72, 0, 1, 24, C.out);
    R(x, 73, 2, 16, 6, '#3f78d0'); R(x, 73, 8, 16, 6, '#f6d03c'); R(x, 89, 2, 1, 12, C.out); R(x, 73, 14, 17, 1, C.out); R(x, 73, 1, 17, 1, C.out);
  }
  return c;
}

function makeMinaret() {
  // the cathedral of Peter and Paul at Kamianets: a church with a minaret beside it, and on the minaret, the Virgin in gold
  const [c, x] = mk(80, 150);
  shadow(x, 40, 146, 38, 4);
  const W = ['#f6ecc8', '#e6d6a4', '#c9b47e'];
  // the church body
  R(x, 22, 92, 56, 58, C.out); R(x, 23, 93, 54, 56, W[0]); R(x, 66, 93, 11, 56, W[1]);
  R(x, 23, 93, 54, 3, '#fbf8f0'); R(x, 23, 118, 54, 2, W[1]);
  // a gable and a little dome
  for (let k = 0; k < 16; k++) R(x, 30 + k, 92 - k, 40 - 2 * k, 1, k === 15 ? C.out : W[k > 10 ? 2 : 1]);
  for (let k = 0; k <= 12; k++) { const r = 9 * Math.sqrt(1 - Math.pow(k / 12, 1.6)); R(x, Math.round(50 - r), 78 - k, Math.round(r * 2), 1, k === 12 ? C.out : k > 7 ? '#86c0a6' : '#4f8a6c'); }
  R(x, 49, 58, 2, 8, C.gold); R(x, 47, 61, 6, 1, C.gold);
  for (const wx of [28, 42, 58]) { R(x, wx - 1, 99, 9, 15, C.out); R(x, wx, 101, 7, 13, C.glass); R(x, wx + 1, 100, 5, 1, C.glass); P(x, wx + 1, 103, C.glass2); }
  R(x, 43, 124, 14, 26, C.out); R(x, 44, 127, 12, 23, C.wd2); R(x, 46, 125, 8, 2, C.wd2); R(x, 49, 127, 2, 23, C.wd3);
  // the minaret: slim, white, a balcony near the top
  R(x, 5, 22, 14, 128, C.out); R(x, 6, 23, 12, 127, '#fbf8f0'); R(x, 14, 23, 4, 127, '#e2dac6');
  for (let y = 40; y < 146; y += 9) R(x, 6, y, 12, 1, '#e2dac6');
  R(x, 2, 30, 20, 4, C.out); R(x, 3, 31, 18, 2, '#d8d0bc'); for (let X = 4; X < 21; X += 3) R(x, X, 26, 1, 4, C.out); R(x, 3, 26, 18, 1, C.out);
  for (let k = 0; k < 8; k++) R(x, 7 + (k >> 1), 22 - k, 10 - (k >> 1) * 2, 1, k === 7 ? C.out : '#c9c3b5');
  // the Virgin on top, gilded
  R(x, 10, 4, 4, 11, C.out); R(x, 11, 5, 2, 9, C.gold); P(x, 11, 3, C.gold); P(x, 12, 3, C.gold2); R(x, 9, 6, 6, 1, C.gold2);
  for (let a = 0; a < 6; a++) P(x, 12 + Math.round(Math.cos(a) * 4), 4 + Math.round(Math.sin(a) * 3), '#fff1a8');
  return c;
}

function makeRatusha(walls, roof) {
  // a town hall, ратуша: a square block with a tall tower in the middle, a clock, a gallery and a cupola
  const [c, x] = mk(96, 176);
  const [w0, w1, w2] = walls;
  shadow(x, 48, 172, 46, 4);
  R(x, 2, 112, 92, 64, C.out); R(x, 3, 113, 90, 62, w0); R(x, 78, 113, 15, 62, w1);
  R(x, 3, 113, 90, 3, w1); R(x, 3, 140, 90, 2, w1);
  for (const wy of [120, 147]) for (let wx = 8; wx < 90; wx += 12) {
    if (wy === 147 && wx > 36 && wx < 56) continue;
    R(x, wx - 1, wy - 1, 8, 14, C.out); R(x, wx, wy, 6, 12, C.glass); R(x, wx, wy + 5, 6, 1, w1); P(x, wx + 1, wy + 1, C.glass2);
  }
  for (let y = 100; y <= 112; y++) { const t = (y - 100) / 12, l = Math.round(10 - t * 9), r = Math.round(85 + t * 9); R(x, l, y, r - l + 1, 1, y === 100 ? C.out : ((y >> 1) & 1) ? roof[1] : roof[2]); P(x, l, y, C.out); P(x, r, y, C.out); }
  // the door, under the middle two tiles
  R(x, 38, 148, 20, 28, C.out); R(x, 39, 151, 18, 25, C.wd2); R(x, 41, 149, 14, 2, C.wd2); R(x, 47, 151, 2, 25, C.wd3); P(x, 44, 162, C.gold); P(x, 51, 162, C.gold);
  // the tower
  R(x, 34, 22, 28, 92, C.out); R(x, 35, 23, 26, 90, w0); R(x, 53, 23, 8, 90, w1);
  for (let y = 30; y < 110; y += 16) { R(x, 35, y, 26, 1, w1); R(x, 44, y + 3, 8, 10, C.out); R(x, 45, y + 4, 6, 8, C.glass); }
  R(x, 39, 40, 18, 18, C.out); R(x, 40, 41, 16, 16, '#fbf8f0'); R(x, 47, 43, 2, 7, C.out); R(x, 47, 48, 6, 2, C.out); R(x, 40, 41, 16, 1, C.gold);   // the clock
  R(x, 30, 18, 36, 6, C.out); R(x, 31, 19, 34, 4, w1); for (let X = 32; X < 65; X += 4) R(x, X, 12, 1, 7, C.out); R(x, 31, 12, 34, 1, C.out);   // the gallery
  for (let k = 0; k <= 10; k++) { const r = 11 * Math.sqrt(1 - Math.pow(k / 10, 1.5)); R(x, Math.round(48 - r), 12 - k, Math.round(r * 2), 1, k === 10 ? C.out : k > 6 ? roof[0] : roof[1]); }
  R(x, 47, 0, 2, 3, C.gold);
  return c;
}

function makeOpera() {
  // the Odesa opera: a cream horseshoe of columns and arches, a green dome, a quadriga on the roof
  const [c, x] = mk(112, 108);
  const W = ['#f6ecd2', '#e4d4b0', '#c8b48a'];
  shadow(x, 56, 104, 54, 4);
  R(x, 2, 50, 108, 58, C.out); R(x, 3, 51, 106, 56, W[0]); R(x, 3, 51, 12, 56, W[1]); R(x, 97, 51, 12, 56, W[1]);
  R(x, 3, 51, 106, 3, '#fbf8f0'); R(x, 3, 76, 106, 3, W[1]);
  for (let X = 10; X < 104; X += 10) {   // columns and arched windows
    R(x, X, 56, 3, 50, W[2]); R(x, X, 56, 1, 50, '#fbf8f0');
    if (X < 100) { R(x, X + 4, 60, 5, 12, C.out); R(x, X + 5, 62, 3, 10, C.glass); P(x, X + 6, 61, C.glass); R(x, X + 4, 84, 5, 14, C.out); R(x, X + 5, 86, 3, 12, '#f3d68a'); }
  }
  // the dome and the front
  for (let k = 0; k <= 22; k++) { const r = 34 * Math.sqrt(1 - Math.pow(k / 22, 1.4)); R(x, Math.round(56 - r), 50 - k, Math.round(r * 2), 1, k === 22 ? C.out : k > 14 ? '#9cc8b8' : k > 6 ? '#6aa494' : '#4f8a7a'); }
  for (let X = 26; X < 88; X += 6) R(x, X, 36 - Math.round(Math.sqrt(Math.max(0, 900 - (X - 56) * (X - 56))) / 3), 1, 8, '#3f7262');
  R(x, 40, 40, 32, 12, C.out); R(x, 41, 41, 30, 10, W[0]); for (let X = 44; X < 70; X += 6) R(x, X, 43, 2, 8, W[2]);
  R(x, 50, 26, 12, 6, C.out); R(x, 51, 27, 10, 4, '#b8a070'); R(x, 52, 22, 2, 5, '#b8a070'); R(x, 58, 22, 2, 5, '#b8a070');   // the quadriga, very small
  R(x, 46, 92, 20, 16, C.out); R(x, 47, 93, 18, 15, '#7a4a2a'); R(x, 55, 93, 2, 15, '#5e3d20');
  return c;
}

function makeShip(raketa) {
  // a ship at the quay: white decks, round windows, a funnel with a blue and yellow band
  const [c, x] = mk(128, 58);
  const hull = raketa ? '#f4f1e6' : '#2f4a7a';
  R(x, 2, 30, 124, 18, C.out);
  for (let X = 3; X < 125; X++) { const sag = X < 14 ? Math.round((14 - X) * .7) : X > 112 ? Math.round((X - 112) * .9) : 0; R(x, X, 31 + sag, 1, 16 - sag, hull); P(x, X, 44, '#c8383a'); P(x, X, 45, '#c8383a'); }
  R(x, 3, 31, 120, 2, raketa ? '#3f78d0' : '#4f6a9a');
  for (let X = 18; X < 110; X += 9) { R(x, X, 36, 4, 4, C.out); R(x, X + 1, 37, 2, 2, '#9cc6de'); }
  R(x, 20, 16, 84, 15, C.out); R(x, 21, 17, 82, 14, '#fbf8f0'); R(x, 21, 17, 82, 2, '#e2dac6');
  for (let X = 24; X < 100; X += 8) { R(x, X, 21, 5, 5, C.out); R(x, X + 1, 22, 3, 3, C.glass); }
  R(x, 40, 6, 44, 11, C.out); R(x, 41, 7, 42, 10, '#fbf8f0'); for (let X = 44; X < 80; X += 7) { R(x, X, 9, 5, 4, C.out); R(x, X + 1, 10, 3, 2, C.glass); }
  R(x, 88, 0, 12, 17, C.out); R(x, 89, 1, 10, 16, '#e8e2d2'); R(x, 89, 5, 10, 3, '#3f78d0'); R(x, 89, 8, 10, 3, '#f6d03c'); R(x, 89, 1, 10, 2, '#2b2230');
  R(x, 6, 26, 1, 5, C.out); R(x, 120, 24, 1, 7, C.out); line(x, 6, 26, 40, 8, 'rgba(43,34,48,.6)'); line(x, 120, 24, 100, 1, 'rgba(43,34,48,.6)');
  return c;
}

function makeLighthouse() {
  // the Vorontsov lighthouse at the end of the mole: white, with a red lantern
  const [c, x] = mk(32, 84);
  R(x, 2, 72, 28, 12, C.out); R(x, 3, 73, 26, 10, STONE[1]); R(x, 3, 73, 26, 2, STONE[0]);
  for (let y = 22; y < 74; y++) { const r = Math.round(6 + (y - 22) / 52 * 5); R(x, 16 - r - 1, y, r * 2 + 2, 1, C.out); R(x, 16 - r, y, r * 2, 1, '#fbf8f0'); R(x, 16 + r - 3, y, 3, 1, '#d6d0c2'); }
  for (const y of [34, 50, 64]) R(x, 15, y, 2, 4, '#3a3046');
  R(x, 7, 18, 18, 5, C.out); R(x, 8, 19, 16, 3, '#5f5a52');
  R(x, 10, 8, 12, 11, C.out); R(x, 11, 9, 10, 9, '#f6e7a0'); R(x, 13, 9, 1, 9, C.out); R(x, 18, 9, 1, 9, C.out);
  for (let k = 0; k < 7; k++) R(x, 10 + k, 7 - k, 12 - 2 * k, 1, k === 6 ? C.out : '#c8383a');
  return c;
}

function makeAcacia(seed) {
  // a white acacia, біла акація: Odesa's tree. In May the whole city smells of it.
  const [c, x] = mk(32, 46);
  shadow(x, 16, 43, 11, 3);
  R(x, 14, 26, 4, 18, '#6b5a48'); R(x, 14, 26, 1, 18, '#8a7660'); line(x, 16, 30, 9, 22, '#6b5a48'); line(x, 16, 28, 23, 20, '#6b5a48');
  const at = blob(x, 16, 16, 14, 11, ['#c8e49a', '#9ccc6e', '#76ac56', '#558a44', '#335a2e'], seed, .32);
  for (let i = 0; i < 16; i++) {
    const X = 4 + Math.floor(hash(seed, i, 310) * 24), Y = 6 + Math.floor(hash(seed, i, 311) * 18);
    if (!at(X, Y) || !at(X, Y + 3)) continue;
    P(x, X, Y, '#fbf8f0'); P(x, X, Y + 1, '#f4f1e6'); P(x, X, Y + 2, '#e8e2d2'); P(x, X + 1, Y + 1, '#fbf8f0');
  }
  return { img: c, ox: -8 };
}

function makeApple(seed) {
  // an apple tree in a Podillia orchard
  const [c, x] = mk(28, 36);
  shadow(x, 14, 33, 10, 3);
  R(x, 12, 20, 4, 14, C.wd2); R(x, 12, 20, 1, 14, C.wd1);
  const at = blob(x, 14, 13, 12, 10, ['#a6dc74', '#76b852', '#559a44', '#3a7a3a', '#21452a'], seed, .2);
  for (let i = 0; i < 10; i++) {
    const X = 4 + Math.floor(hash(seed, i, 320) * 20), Y = 6 + Math.floor(hash(seed, i, 321) * 14);
    if (!at(X, Y) || !at(X + 1, Y + 1)) continue;
    R(x, X, Y, 2, 2, hash(seed, i, 322) < .3 ? '#f0c040' : '#d8403a'); P(x, X, Y, '#f8a080');
  }
  return { img: c, ox: -6 };
}

function makeSaltHeap(seed) {
  // a heap of salt, white as snow, raked up at the edge of the liman
  const [c, x] = mk(32, 22);
  shadow(x, 16, 19, 15, 3);
  for (let y = 0; y < 20; y++) {
    const r = Math.round(3 + y * .7 + (y > 14 ? 0 : 0)), l = 16 - r, rr = 16 + r;
    R(x, l - 1, y + 1, rr - l + 2, 1, C.out);
    for (let X = l; X < rr; X++) P(x, X, y + 1, X < l + r * .6 ? '#fbfaf8' : X > rr - r * .5 ? '#d8d4d0' : hash(X, y, 330 + seed) < .1 ? '#f0dde0' : '#eeecea');
  }
  for (let i = 0; i < 6; i++) P(x, 10 + Math.floor(hash(i, seed, 331) * 12), 6 + Math.floor(hash(i, seed, 332) * 12), '#ffffff');
  return c;
}

function makeOxen() {
  // two grey oxen in a yoke: воли. The chumaks' engines.
  const [c, x] = mk(32, 22);
  shadow(x, 16, 20, 15, 2.5);
  for (const [ox, oy, col] of [[0, 0, '#bdb6a8'], [4, 4, '#d6d0c2']]) {
    R(x, ox + 4, oy + 6, 22, 10, C.out); R(x, ox + 5, oy + 7, 20, 8, col); R(x, ox + 5, oy + 13, 20, 2, shade(col));
    R(x, ox + 24, oy + 4, 7, 7, C.out); R(x, ox + 25, oy + 5, 5, 5, col); P(x, ox + 28, oy + 6, C.out);
    R(x, ox + 24, oy + 1, 1, 4, '#f4efe2'); R(x, ox + 30, oy + 1, 1, 4, '#f4efe2'); P(x, ox + 23, oy + 1, '#f4efe2');
    for (const lx of [6, 10, 19, 23]) R(x, ox + lx, oy + 15, 2, 3, C.out);
  }
  R(x, 22, 3, 2, 14, C.wd2); R(x, 20, 9, 8, 2, C.wd1);   // the yoke
  return c;
}

function makeLion(seed) {
  // one of Lviv's stone lions, sitting on its pedestal with a shield
  const [c, x] = mk(16, 30);
  shadow(x, 8, 28, 7, 2);
  R(x, 1, 20, 14, 10, C.out); R(x, 2, 21, 12, 8, STONE[1]); R(x, 2, 21, 12, 2, STONE[0]);
  const L = ['#d8d2c4', '#b4ad9e', '#8a8478'];
  R(x, 3, 9, 10, 12, C.out); R(x, 4, 10, 8, 10, L[0]); R(x, 9, 10, 3, 10, L[1]);
  R(x, 2, 2, 12, 10, C.out); R(x, 3, 3, 10, 8, L[1]); R(x, 5, 4, 6, 6, L[0]);   // the mane and face
  P(x, 6, 6, C.out); P(x, 9, 6, C.out); R(x, 7, 8, 2, 1, L[2]);
  R(x, seed ? 9 : 2, 12, 5, 7, C.out); R(x, seed ? 10 : 3, 13, 3, 5, '#3f6fc4'); P(x, seed ? 11 : 4, 15, C.gold);
  return c;
}

function makeCafeTable(seed) {
  // a café table on the square, under a striped umbrella
  const [c, x] = mk(16, 32);
  shadow(x, 8, 30, 7, 2);
  const col = ['#c8383a', '#3f6fc4', '#4c9c66'][seed % 3];
  R(x, 7, 8, 2, 20, '#5f5a52');
  for (let y = 0; y < 8; y++) { const r = Math.round(2 + y), l = 8 - r; R(x, l - 1, y + 1, r * 2 + 2, 1, C.out); for (let X = l; X < 8 + r; X++) P(x, X, y + 1, ((X - l) >> 1) & 1 ? '#fbf8f0' : col); }
  R(x, 1, 9, 14, 1, C.out);
  R(x, 2, 20, 12, 3, C.out); R(x, 3, 20, 10, 2, '#f4efe2');
  R(x, 7, 18, 2, 2, '#8a5a35'); P(x, 7, 18, '#fbf8f0');   // a cup of coffee
  for (const cx of [0, 13]) { R(x, cx, 22, 3, 2, C.wd2); R(x, cx, 24, 1, 6, C.wd2); R(x, cx + 2, 24, 1, 6, C.wd2); R(x, cx + (cx ? 2 : 0), 16, 1, 7, C.wd2); }
  return c;
}

function makeLvivHouse(seed) {
  // a tall narrow house on Rynok square: three storeys, a cornice, a steep red roof, and every one a different colour
  const [wall, wall2, roof] = LVIV_TOWN[seed % LVIV_TOWN.length];
  const [c, x] = mk(64, 108);
  R(x, 4, 30, 56, 78, C.out); R(x, 5, 31, 54, 76, wall); R(x, 54, 31, 5, 76, wall2);
  for (const y of [31, 54, 76]) R(x, 5, y, 54, 2, wall2);
  R(x, 3, 28, 58, 3, C.out); R(x, 4, 29, 56, 1, wall2);
  for (let y = 4; y <= 28; y++) {
    const t = (y - 4) / 24, l = Math.round(28 - t * 24), r = Math.round(35 + t * 24);
    R(x, l, y, r - l + 1, 1, y === 4 ? C.out : ((y >> 1) % 2 ? roof : shade(roof)));
    P(x, l, y, C.out); P(x, r, y, C.out);
  }
  if (seed % 2) { R(x, 26, 12, 12, 14, C.out); R(x, 27, 13, 10, 13, wall); R(x, 29, 15, 6, 9, C.glass); }   // a dormer
  for (const wy of [36, 58]) for (const wx of [10, 26, 42]) {
    R(x, wx - 1, wy - 1, 10, 16, C.out); R(x, wx, wy, 8, 14, C.glass); R(x, wx + 3, wy, 2, 14, wall2); P(x, wx + 1, wy + 1, C.glass2);
    R(x, wx - 1, wy - 3, 10, 2, wall2); R(x, wx - 1, wy + 14, 10, 2, wall2);
    if (seed % 3 === 0) { R(x, wx, wy + 12, 8, 2, '#c8383a'); P(x, wx + 2, wy + 11, '#f06080'); P(x, wx + 5, wy + 11, '#f06080'); }   // geraniums
  }
  for (const wx of [10, 52]) { R(x, wx - 1, 81, 6, 14, C.out); R(x, wx, 82, 4, 12, C.glass); }
  R(x, 33, 78, 14, 30, C.out); R(x, 34, 81, 12, 27, C.wd2); R(x, 36, 79, 8, 2, C.wd2); R(x, 39, 81, 2, 27, C.wd3); P(x, 43, 94, C.gold);
  return c;
}

// creatures and things that aren't on the map grid
function makeBalloon(cols, frame) {
  // a hot-air balloon from the Kamianets festival: striped gores, a wicker basket
  const [c, x] = mk(30, 46);
  for (let y = 0; y < 30; y++) for (let X = 0; X < 30; X++) {
    const dx = (X + .5 - 15) / 14, dy = (y + .5 - 13) / 13, d = dx * dx + dy * dy * (y > 13 ? 1.6 : 1);
    if (d >= 1) continue;
    const gore = Math.floor((Math.asin(Math.max(-1, Math.min(1, dx / Math.sqrt(Math.max(.05, 1 - Math.min(.95, dy * dy)))))) + 1.6) * 2.2) % 2;
    P(x, X, y, d > .86 ? C.out : gore ? cols[0] : cols[1]);
    if (d < .86 && X < 10 && y < 12 && hash(X, y, 340) < .3) P(x, X, y, '#ffffff');
  }
  line(x, 9, 26, 12, 36, C.out); line(x, 20, 26, 17, 36, C.out);
  R(x, 11, 36, 8, 7, C.out); R(x, 12, 37, 6, 5, C.wd1); R(x, 12, 39, 6, 1, C.wd2);
  if (frame) { R(x, 13, 33, 4, 3, '#f6c93c'); P(x, 14, 32, '#ec8b2e'); }   // the burner, lit
  return c;
}
function makeGull(frame) {
  // a seagull, чайка: Odesa's loudest citizen
  return art(frame ? [
    'oo..........oo',
    '.oww......wwo.',
    '..owww..wwwo..',
    '....owwwwo....',
    '.....owwyo....',
    '......ooo.....'] : [
    '..............',
    '......oo......',
    '....owwwwoo...',
    'ooowwwwwwwyo..',
    '..oggwwwwoo...',
    '....oooo......',
    '....r..r......'], { o: C.out, w: '#fbf8f0', g: '#a9a9b8', y: '#f6c93c', r: '#e8a060' });
}
function makePelican(frame) {
  // a pink-white pelican of the Danube delta, with a beak like a shovel
  return art([
    '....oo.........',
    '...owwo........',
    '...owkwoooooo..',
    '...owwwyyyyyyo.',
    '...owwooooooo..',
    '..owwwwwo......',
    '.owwwwwwwo.....',
    'owwwwwwwwwo....',
    'owwwwwwwggo....',
    '.owwwwwggo.....',
    '..ooooooo......',
    frame ? '...y...y.......' : '..y.....y......'], { o: C.out, w: '#f8e8e4', g: '#c8b8c0', k: '#2b2230', y: '#f0a040' });
}
function makeFlamingo(frame) {
  // a flamingo standing in the pink water: it's pink because of what it eats there
  return art([
    '...oo...',
    '..oppo..',
    '..opko..',
    '..oo.yo.',
    '..op..k.',
    '..op....',
    '...op...',
    '..oppppo',
    '.opppppo',
    'opppppPo',
    '.oppPPo.',
    '..oooo..',
    frame ? '....r...' : '...r....',
    frame ? '....r...' : '...r.r..',
    frame ? '....r...' : '...r..r.',
    '....r...'], { o: C.out, p: '#f4a0b8', P: '#e07898', k: '#2b2230', y: '#f6e0e8', r: '#e07898' });
}
function makeBooth() {
  // a telephone booth in the old post office: polished oak, a little window, a black receiver
  const [c, x] = mk(16, 32);
  R(x, 0, 2, 16, 30, C.out); R(x, 1, 3, 14, 28, '#8a5a35'); R(x, 1, 3, 14, 2, '#a8743f'); R(x, 12, 3, 3, 28, '#6b4426');
  R(x, 3, 7, 9, 10, C.out); R(x, 4, 8, 7, 8, '#f6e7a0');
  R(x, 5, 9, 3, 5, '#2b2230'); P(x, 8, 10, '#2b2230'); R(x, 6, 11, 1, 4, '#2b2230');
  R(x, 4, 20, 2, 2, C.gold);
  return c;
}
function makeLizard(frame) {
  // a green lizard, ящірка, on a warm stone. It has been asked too many questions.
  return art([
    '..............',
    '...yyyy.......',
    '..yssssy......',
    '.ysssssyy.....',
    'ysggggggsy....',
    'yggkggggggyyyy',
    '.yggggggggggy.',
    '..yglyyyglyy..',
    frame ? '..y..y..y..y..' : '...y..y..y..y.'], { y: C.out, s: '#c9bea6', g: '#6ab04a', k: '#2b2230', l: '#4a8a3a' });
}
function makeCounter() {
  // a section of a shop or post office counter: dark wood, a polished top, panels
  const [c, x] = mk(16, 22);
  R(x, 0, 2, 16, 20, C.out); R(x, 0, 3, 16, 18, '#7a4a2a'); R(x, 0, 3, 16, 3, '#b07a48'); R(x, 0, 3, 16, 1, '#d8a870');
  R(x, 2, 9, 12, 10, '#6b3e22'); R(x, 2, 9, 12, 1, '#8a5a35'); R(x, 2, 18, 12, 1, '#4b2a16');
  return c;
}
