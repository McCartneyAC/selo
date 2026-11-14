// ─── Kyiv again, Polissia and the Carpathians ─────────────────────────────
// Kyiv: pigeons, the reliquaries in the caves, the kalyta, St Andrew's church
const ANDREW_CHURCH = { dome: '#4fb3a8', dome1: '#9fe0d6', dome2: '#2a7a72', wall: '#f4f1ea', wall2: '#dcd6c8', wall3: '#b9b2a2', trim: '#e9b949' };

function makePigeon(frame) {
  // a Kyiv pigeon, голуб: grey, with a green and violet shine on its neck
  return art([
    '.....oo.....',
    '....oggo....',
    '...onggo....',
    '..yoggvo....',
    '....ogvvoooo',
    '...ogggggwwo',
    '...ogggggggo',
    '....ogggggo.',
    '.....ooooo..',
    frame ? '.....r..r...' : '....r....r..'], { o: C.out, g: '#a9a9b8', n: C.out, y: '#e8a060', v: '#6fa88a', w: '#7d7d90', r: '#d8707a' });
}

function makeReliquary() {
  // a рака: a saint's coffin under a gilded lid, with a little embroidered cloth
  const [c, x] = mk(32, 16);
  R(x, 1, 4, 30, 11, C.out); R(x, 2, 5, 28, 9, '#7a4a2a'); R(x, 2, 5, 28, 2, C.gold2); R(x, 2, 5, 28, 1, C.gold);
  R(x, 4, 8, 24, 5, '#5a3a22');
  for (let X = 5; X < 27; X += 4) P(x, X, 10, C.gold2);
  R(x, 12, 4, 8, 6, '#fbf8f0'); R(x, 12, 9, 8, 1, C.red); P(x, 14, 6, C.red); P(x, 17, 6, C.red); P(x, 15, 7, C.red); P(x, 16, 7, C.red);
  R(x, 14, 0, 4, 4, C.out); R(x, 15, 1, 2, 3, '#f3e6b0'); P(x, 15, 0, '#f6c93c');   // a candle at its head
  return c;
}

function makeKalyta() {
  // the kalyta: a round honey loaf hung from the ceiling on a red ribbon, for St Andrew's Eve
  const [c, x] = mk(16, 30);
  R(x, 7, 0, 2, 14, C.red); P(x, 7, 0, C.red2);
  for (let y = 0; y < 14; y++) for (let X = 0; X < 16; X++) {
    const d = Math.hypot((X + .5 - 8) / 7.5, (y + .5 - 7) / 6.5);
    if (d >= 1) continue;
    const ring = d < .45 ? (d < .3 ? null : '#7a4a22') : d > .86 ? C.out : (X + y) % 5 === 0 ? '#f3c84f' : X < 7 && y < 6 ? '#e8b060' : '#c98a3c';
    if (ring) P(x, X, y + 13, ring);
  }
  P(x, 4, 17, '#c8383a'); P(x, 11, 18, '#4c9c66'); P(x, 5, 22, '#4c9c66'); P(x, 12, 22, '#c8383a');
  return c;
}

// ─── Polissia ─────────────────────────────────────────────────────────────
// Map letters: t pine · I bort (a pine with a hive in it) · - flax (ground) · W the train (8x2)
const WOOD_CHURCH = { dome: '#7d7466', dome1: '#a89e8c', dome2: '#554c42', wall: '#a8743f', wall2: '#86592e', wall3: '#5e3d20', trim: '#5e3d20' };
const PINE = ['#8fbf6a', '#5f9a4c', '#3f7a3f', '#2a5a34', '#1a3a26'];
function makePine(seed, bort) {
  // a Polissia pine, сосна: a tall bare trunk, orange near the top, and a flat crown of needles
  const [c, x] = mk(28, 60);
  shadow(x, 14, 57, 8, 2.5);
  R(x, 12, 18, 4, 40, '#6b4426'); R(x, 12, 18, 1, 40, '#8a5a32'); R(x, 15, 18, 1, 40, '#4b2f1c');
  R(x, 12, 18, 4, 14, '#b8683a'); R(x, 12, 18, 1, 14, '#d88a50');
  for (let y = 34; y < 56; y += 5) P(x, 13 + (y % 3), y, '#4b2f1c');
  if (seed % 2) { line(x, 15, 30, 21, 26, '#6b4426'); }
  blob(x, 14, 12, 12, 7, PINE, seed + 7, .25);
  blob(x, 9, 17, 6, 4, PINE, seed + 8, .3);
  if (seed % 3 === 0) blob(x, 20, 16, 5, 3.5, PINE, seed + 9, .3);
  if (bort) {
    // the bort: a hollow cut into the trunk, closed with a board, and notches to climb by
    R(x, 11, 33, 6, 10, C.out); R(x, 12, 34, 4, 8, '#c9a06a'); R(x, 12, 37, 4, 1, '#a07a4c'); P(x, 14, 35, '#2b2230');
    for (let y = 44; y < 56; y += 3) R(x, 12, y, 3, 1, '#2b2230');
  }
  return { img: c, ox: -6 };
}
function makeFlax(seed) {
  // flax in flower: thin green stems with little sky-blue flowers
  const [c, x] = mk(16, 16);
  R(x, 0, 0, 16, 16, '#7fae5a');
  for (let X = 0; X < 16; X++) {
    const top = Math.floor(hash(X, seed, 70) * 4);
    for (let y = top; y < 16; y++) if ((y + X) % 2) P(x, X, y, '#5f9244');
    if (hash(X, seed, 71) < .45) { const y = top + Math.floor(hash(X, seed, 72) * 6); P(x, X, y, '#7aa8f0'); if (X < 15) P(x, X + 1, y, '#5b86d8'); }
    if (hash(X, seed, 73) < .3) { const y = 8 + Math.floor(hash(X, seed, 74) * 6); P(x, X, y, '#9cc0f8'); }
  }
  return c;
}
function makeTrain() {
  // the night train west: a blue carriage with a yellow stripe, waiting at the halt
  const [c, x] = mk(128, 44);
  R(x, 0, 38, 128, 2, '#5f5a52'); for (let X = 2; X < 128; X += 6) R(x, X, 40, 3, 3, '#7a5a3a');   // the rails
  R(x, 2, 6, 124, 32, C.out); R(x, 3, 7, 122, 30, '#2f5f9a'); R(x, 3, 7, 122, 3, '#4f86c6'); R(x, 3, 26, 122, 3, '#f3c84f');
  R(x, 5, 3, 118, 4, '#5f5a52'); R(x, 5, 3, 118, 1, '#8a8496');
  for (let X = 12; X < 112; X += 13) { R(x, X - 1, 12, 9, 10, C.out); R(x, X, 13, 7, 8, '#f6e7a0'); R(x, X, 13, 7, 2, '#fff6c8'); if (X % 2) R(x, X + 1, 16, 2, 5, '#c8383a'); }
  R(x, 112, 11, 10, 25, C.out); R(x, 113, 12, 8, 24, '#244a78'); R(x, 114, 14, 6, 6, '#f6e7a0');   // the door
  for (const X of [14, 30, 90, 106]) { R(x, X, 35, 9, 5, C.out); R(x, X + 2, 36, 5, 3, '#5f5a52'); }
  return c;
}
function makeMagpie(frame) {
  // a magpie, сорока: Baba Yaga's messenger. Black, white and very pleased with itself.
  return art([
    '..oo..........',
    '.okko.........',
    'yokeko........',
    '.okkkooo......',
    '..owwkkkoooooo',
    '..owwwkkkbbbbo',
    '...owwkkoooooo',
    '....oooo......',
    frame ? '....y..y......' : '...y..y.......'], { o: C.out, k: '#2b2230', e: '#fbf8f0', y: '#5f5a52', w: '#fbf8f0', b: '#3f6fc4' });
}
const SCARECROW = {};
function makeScarecrow(bits, alive) {
  // the опудало: a cross of sticks in the flax, dressed one garment at a time.
  // bits: 1 shirt, 2 trousers, 4 jacket, 8 scarf, 16 hat
  const k = bits + (alive ? 'a' : '');
  if (SCARECROW[k]) return SCARECROW[k];
  const [c, x] = mk(20, 30);
  R(x, 9, 6, 2, 24, C.wd2); R(x, 2, 11, 16, 2, C.wd2);                 // the sticks
  R(x, 6, 2, 8, 8, C.out); R(x, 7, 3, 6, 6, '#d6c7a8'); P(x, 8, 5, C.out); P(x, 11, 5, C.out);
  if (alive) { P(x, 8, 5, '#f6c93c'); P(x, 11, 5, '#f6c93c'); R(x, 9, 7, 2, 1, C.out); }
  else R(x, 8, 7, 4, 1, '#a07a4c');
  if (bits & 1) { R(x, 3, 10, 14, 4, C.out); R(x, 4, 11, 12, 2, '#f4efe2'); R(x, 6, 10, 8, 10, C.out); R(x, 7, 10, 6, 9, '#f4efe2'); for (let y = 12; y < 19; y += 2) P(x, 9, y, C.red); }
  if (bits & 2) { R(x, 7, 19, 6, 8, C.out); R(x, 8, 19, 2, 7, '#3f6fc4'); R(x, 10, 19, 2, 7, '#2d4f91'); }
  if (bits & 4) { R(x, 5, 10, 3, 10, '#8a5a35'); R(x, 12, 10, 3, 10, '#704829'); R(x, 2, 10, 4, 3, '#8a5a35'); R(x, 14, 10, 4, 3, '#704829'); }
  if (bits & 8) { R(x, 7, 9, 6, 2, C.red); R(x, 11, 10, 2, 5, C.red); P(x, 12, 14, C.red2); }
  if (bits & 16) { R(x, 4, 1, 12, 2, C.out); R(x, 5, 0, 10, 2, '#ecd28a'); R(x, 7, -1, 6, 2, '#ecd28a'); R(x, 4, 2, 12, 1, '#c9a75a'); }
  return (SCARECROW[k] = c);
}

// ─── The Carpathians ──────────────────────────────────────────────────────
// Map letters: s spruce (смерека) · G the old observatory on Pip Ivan (4x4)
const GONTA = ['#b0aca2', '#8e8a80', '#6e6a62', '#524e48', '#2e2b28'];   // shingle roofs, ґонта
const SPRUCE = ['#6a9a5a', '#4a7a46', '#33603a', '#22482e', '#16301f'];
function makeSpruce(seed) {
  // a Carpathian spruce, смерека: dark, narrow, in tiers
  const [c, x] = mk(26, 50);
  shadow(x, 13, 47, 8, 2.5);
  R(x, 12, 38, 3, 10, C.wd2);
  for (let t = 0; t < 5; t++) {
    const top = 2 + t * 8, w = 3 + t * 2.2;
    for (let y = top; y < top + 12 && y < 42; y++) {
      const half = Math.round(w * (y - top + 2) / 13);
      for (let X = 13 - half; X <= 13 + half; X++) {
        const edge = X === 13 - half || X === 13 + half || y === top + 11;
        const lit = X < 13 - half / 3;
        P(x, X, y, edge ? SPRUCE[4] : (hash(X, y, seed) < .12 ? SPRUCE[1] : lit ? SPRUCE[2] : SPRUCE[3]));
      }
    }
  }
  P(x, 13, 1, SPRUCE[4]); P(x, 13, 2, SPRUCE[2]);
  return { img: c, ox: -5 };
}
function makeSheep(frame) {
  return art([
    '....oooooo...',
    '..oowwwwwwo..',
    '.owwwwvwwwwoo',
    'owwvwwwwwwwkko',
    'owwwwwwvwwwkeo',
    '.owwwwwwwwwkko',
    '..oowwwwwwoo.',
    '...okoo.oko..',
    frame ? '...ok....ok..' : '....ok..ok...'], { o: C.out, w: '#efeae0', v: '#d6d0c2', k: '#3a3046', e: '#fbf8f0' });
}
function makeObservatory() {
  // the old observatory on Pip Ivan, "the White Elephant": a stone tower, its dome open to the sky
  const [c, x] = mk(64, 96);
  shadow(x, 32, 92, 30, 4);
  R(x, 4, 40, 56, 54, C.out); R(x, 5, 41, 54, 52, STONE[1]); R(x, 46, 41, 13, 52, STONE[2]);
  for (let y = 44; y < 92; y += 6) for (let X = 5 + ((y / 6) % 2) * 5; X < 58; X += 10) R(x, X, y, 1, 6, STONE[3]);
  for (let y = 44; y < 92; y += 6) R(x, 5, y, 54, 1, STONE[2]);
  R(x, 18, 10, 28, 32, C.out); R(x, 19, 11, 26, 31, STONE[0]); R(x, 38, 11, 7, 31, STONE[1]);
  for (let k = 0; k <= 10; k++) { const r = 14 * Math.sqrt(1 - Math.pow(k / 10, 1.8)); R(x, Math.round(32 - r), 10 - k, Math.round(r * 2), 1, k === 10 ? C.out : k > 6 ? '#e8eaf4' : '#c9ccd8'); }
  R(x, 30, 0, 6, 12, '#2b2230');                                        // the slot in the dome
  for (const wx of [12, 28, 44]) { R(x, wx, 52, 8, 12, C.out); R(x, wx + 1, 53, 6, 10, '#3a3046'); }
  R(x, 26, 72, 12, 22, C.out); R(x, 27, 73, 10, 21, '#2b2230');        // the doorway
  for (let i = 0; i < 9; i++) { const X = 8 + Math.floor(hash(i, 2, 90) * 48), Y = 42 + Math.floor(hash(i, 3, 90) * 48); P(x, X, Y, '#7d9a5a'); P(x, X + 1, Y, '#7d9a5a'); }
  for (const [X, Y] of [[22, 6], [40, 4], [12, 38]]) { R(x, X, Y, 6, 3, '#2b2230'); P(x, X + 5, Y - 1, '#fbf8f0'); }   // magpies on the dome
  return c;
}
function makeAshes(frame) {
  // a dead fire: grey ash in a ring of stones, a thread of smoke
  const [c, x] = mk(16, 24);
  for (const [X, Y] of [[1, 18], [4, 21], [9, 21], [13, 18], [12, 15], [3, 15]]) { R(x, X, Y, 3, 3, C.out); R(x, X, Y, 2, 2, STONE[1]); }
  R(x, 4, 17, 8, 4, '#6e6a62'); R(x, 5, 17, 6, 2, '#8e8a80'); P(x, 7, 18, '#3a3046');
  for (let k = 0; k < 4; k++) P(x, 7 + ((k + frame) % 2), 13 - k * 3, 'rgba(200,200,210,.6)');
  return c;
}
function makeNest() {
  // the old magpie's nest: a great round heap of woven twigs and broom bristles
  const [c, x] = mk(44, 26);
  shadow(x, 22, 22, 20, 3.5);
  for (let y = 0; y < 26; y++) for (let X = 0; X < 44; X++) {
    const d = Math.hypot((X + .5 - 22) / 20, (y + .5 - 15) / 9);
    if (d >= 1) continue;
    const hollow = Math.hypot((X + .5 - 22) / 14, (y + .5 - 11) / 4) < 1;
    const twig = (X * 3 + y * 7 + Math.floor(hash(X >> 2, y, 95) * 5)) % 6 < 2;
    P(x, X, y, d > .9 ? C.out : hollow ? (hash(X, y, 96) < .2 ? '#4b2f1c' : '#3a2416') : twig ? '#a8743f' : hash(X, y, 97) < .15 ? '#d6b878' : '#6b4426');
  }
  for (let k = 0; k < 10; k++) { const X = 4 + Math.floor(hash(k, 1, 98) * 36), Y = 8 + Math.floor(hash(k, 2, 98) * 14); line(x, X, Y, X + 4 - (k % 3) * 3, Y - 3, k % 2 ? '#8a5a32' : '#d6b878'); }
  return c;
}
