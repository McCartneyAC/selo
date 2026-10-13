
const TS = 16, VW = 15, VH = 11, SW = VW * TS, SH = VH * TS;
let MAP = null, MW = 0, MH = 0;
const MAPVIEW = location.hash.startsWith('#map');

const C = {
  out: '#2b2230',
  g0: '#b4e07a', g1: '#86c35a', g2: '#64a448', g3: '#467d3a', g4: '#2f5a31',
  p0: '#efd8a8', p1: '#dcb882', p2: '#c49a66', p3: '#a07a4c',
  w0: '#cdeefa', w1: '#7cc0e8', w2: '#4f9bd8', w3: '#3f82c2', bank: '#7b6440',
  wall: '#f6f1e3', wall2: '#e2dac6', wall3: '#c3b9a3',
  wd0: '#c99258', wd1: '#9e6a3c', wd2: '#704829', wd3: '#4b2f1c',
  red: '#cc3b3d', red2: '#8f2430', pink: '#ec88ac', pink2: '#c4507c',
  yel: '#f6c93c', yel2: '#d88e1d', org: '#ec8b2e', org2: '#b75b1c',
  glass: '#29475e', glass2: '#9cc6de',
  gold: '#f3c84f', gold2: '#b98626', dome: '#4fa07c', dome1: '#86cfa6', dome2: '#2e6c56',
  skin: '#f6d0a8', skin2: '#dba57d',
  leaf0: '#a6dc74', leaf1: '#72b452', leaf2: '#4b8a40', leaf3: '#346b36', leafO: '#21452a',
  soil: '#7c5434', soil2: '#5f3f27', cab0: '#c9eaa4', cab1: '#8cc56c', cab2: '#5a9550',
};
const THATCH = ['#f1d07c', '#d6a54f', '#ab7833', '#7d5426', '#4f3419'];
const REED   = ['#d2c296', '#ae9c72', '#8a7857', '#685940', '#3f3626'];
const TRIMS  = { K: ['#4174c8', '#2b4f8f'], L: ['#4c9c66', '#2f6b45'], M: ['#bf5640', '#82352a'] };

// ─── Little drawing kit ───────────────────────────────────────────────────
function hash(a, b, s) {
  let h = Math.imul((a | 0) ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul((b | 0) + 0x632be5ab, 0xc2b2ae35) ^ Math.imul((s | 0) + 1, 0x27d4eb2f);
  h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; h = Math.imul(h, 0x297a2d39); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}
function mk(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d'); x.imageSmoothingEnabled = false; return [c, x];
}
function P(x, X, Y, col) { x.fillStyle = col; x.fillRect(X, Y, 1, 1); }
function R(x, X, Y, w, h, col) { x.fillStyle = col; x.fillRect(X, Y, w, h); }
function line(x, x0, y0, x1, y1, col, t = 1) {
  x.fillStyle = col;
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let e = dx + dy;
  for (;;) {
    x.fillRect(x0, y0, t, t);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * e;
    if (e2 >= dy) { e += dy; x0 += sx; }
    if (e2 <= dx) { e += dx; y0 += sy; }
  }
}
function flipH(src) {
  const [c, x] = mk(src.width, src.height);
  x.translate(src.width, 0); x.scale(-1, 1); x.drawImage(src, 0, 0); return c;
}
// A leafy (or straw) mass lit from the upper left, shaded in 2×2 clumps, outlined.
function blob(x, cx, cy, rx, ry, pal, seed, lumpy = 0.16) {
  const x0 = Math.floor(cx - rx - 2), x1 = Math.ceil(cx + rx + 2), y0 = Math.floor(cy - ry - 2), y1 = Math.ceil(cy + ry + 2);
  const W = x1 - x0 + 1, m = new Uint8Array(W * (y1 - y0 + 1));
  for (let Y = y0; Y <= y1; Y++) for (let X = x0; X <= x1; X++) {
    const dx = (X + .5 - cx) / rx, dy = (Y + .5 - cy) / ry;
    const n = (hash(X >> 1, Y >> 1, seed) - .5) * lumpy * 2;
    if (Math.hypot(dx, dy) + n < 1) m[(Y - y0) * W + (X - x0)] = 1;
  }
  const at = (X, Y) => X >= x0 && X <= x1 && Y >= y0 && Y <= y1 && m[(Y - y0) * W + (X - x0)] === 1;
  for (let Y = y0; Y <= y1; Y++) for (let X = x0; X <= x1; X++) {
    if (!at(X, Y)) continue;
    let col;
    if (!at(X - 1, Y) || !at(X + 1, Y) || !at(X, Y - 1) || !at(X, Y + 1)) col = pal[4];
    else {
      const bx = (X >> 1) * 2 + 1, by = (Y >> 1) * 2 + 1;
      const l = -(bx - cx) / rx * .55 - (by - cy) / ry * .85 + (hash(X >> 1, Y >> 1, seed + 3) - .5) * .7;
      col = l > .55 ? pal[0] : l > 0 ? pal[1] : l > -.55 ? pal[2] : pal[3];
    }
    P(x, X, Y, col);
  }
  return at;
}
function shadow(x, cx, cy, rx, ry) {
  x.fillStyle = 'rgba(30,48,26,.28)';
  for (let Y = Math.floor(cy - ry); Y <= cy + ry; Y++) for (let X = Math.floor(cx - rx); X <= cx + rx; X++) {
    const dx = (X + .5 - cx) / rx, dy = (Y + .5 - cy) / ry;
    if (dx * dx + dy * dy <= 1) x.fillRect(X, Y, 1, 1);
  }
}
// Pixel-string art: each character is a palette key, '.' is transparent.
function art(rows, pal) {
  const [c, x] = mk(rows[0].length, rows.length);
  rows.forEach((r, Y) => { for (let X = 0; X < r.length; X++) { const col = pal[r[X]]; if (col) P(x, X, Y, col); } });
  return c;
}

// ─── Tiles laid into the ground ───────────────────────────────────────────
const T = (x, y) => (x < 0 || y < 0 || x >= MW || y >= MH) ? 'F' : MAP[y][x];
const isWater = c => c === '~' || c === '#' || c === 'd' || c === 'z' || c === 'n' || c === '*' || c === '^' || c === '<';
const isPathish = c => c === '=' || c === '#' || c === ':';

function makeFlowers(seed) {
  const [c, x] = mk(16, 16);
  const kinds = [[C.red, C.out], ['#fbf8f0', C.yel], ['#6f8fe8', '#3c55b0'], [C.yel, C.yel2]];
  for (let i = 0; i < 3; i++) {
    const fx = 2 + Math.floor(hash(seed, i, 21) * 11), fy = 2 + Math.floor(hash(seed, i, 22) * 11);
    const [pet, mid] = kinds[Math.floor(hash(seed, i, 23) * kinds.length)];
    P(x, fx, fy + 2, C.g3);
    P(x, fx - 1, fy, pet); P(x, fx + 1, fy, pet); P(x, fx, fy - 1, pet); P(x, fx, fy + 1, pet); P(x, fx, fy, mid);
  }
  return c;
}
function makeTallGrass() {
  const [c, x] = mk(16, 16);
  const CL = [
    '........',
    '..a..a..',
    '.aba.ba.',
    '.bcbabca',
    'abccbcdb',
    'bcdccddc',
    'cddcdddc',
    'dddddddd'];
  const pal = { a: C.g0, b: C.g1, c: C.g2, d: C.g3 };
  R(x, 0, 0, 16, 16, C.g3);
  const clump = (ox, oy) => CL.forEach((r, Y) => { for (let X = 0; X < 8; X++) { const k = r[X]; if (k !== '.' && ox + X >= 0 && ox + X < 16) P(x, ox + X, oy + Y, pal[k]); } });
  clump(0, 0); clump(8, 0); clump(-4, 8); clump(4, 8); clump(12, 8);
  return c;
}
function makeWheat(seed) {
  const [c, x] = mk(16, 16);
  R(x, 0, 0, 16, 16, THATCH[2]);
  for (const band of [0, 8]) for (let X = 0; X < 16; X++) {
    if ((X + band / 8) % 2) { R(x, X, band + 4, 1, 4, THATCH[3]); continue; }
    const top = band + Math.floor(hash(X, band, seed) * 3);
    for (let Y = top; Y < band + 8; Y++) P(x, X, Y, Y - top < 3 ? ((Y - top) % 2 ? THATCH[1] : THATCH[0]) : THATCH[2]);
  }
  return c;
}
function makeCabbageBed(seed) {
  const [c, x] = mk(16, 16);
  for (const [cx, cy] of [[4, 4], [11, 4], [4, 12], [11, 12]]) {
    const ox = cx + (hash(seed, cx, 30) > .5 ? 1 : 0);
    blob(x, ox, cy, 3.4, 2.8, [C.cab0, C.cab1, C.cab1, C.cab2, C.leaf3], seed + cx, .1);
    P(x, ox - 1, cy - 1, C.cab0);
  }
  return c;
}
function makeBridge() {
  const [c, x] = mk(16, 16);
  R(x, 0, 2, 16, 12, C.wd0);
  for (let X = 3; X < 16; X += 4) R(x, X, 3, 1, 10, C.wd1);
  R(x, 0, 12, 16, 1, C.wd1);
  R(x, 0, 0, 16, 2, C.wd2); R(x, 0, 0, 16, 1, C.wd1);
  R(x, 0, 14, 16, 2, C.wd3); R(x, 0, 14, 16, 1, C.wd2);
  R(x, 1, 0, 2, 3, C.wd3); R(x, 9, 0, 2, 3, C.wd3);
  return c;
}
function makeForestTree(seed, trunk) {
  const [c, x] = mk(20, 22);
  if (trunk) { R(x, 8, 15, 4, 6, C.wd2); R(x, 8, 15, 1, 6, C.wd1); }
  blob(x, 10, 9, 9.6, 8.6, [C.leaf1, C.leaf2, C.leaf3, '#285433', '#1b3a24'], seed, .2);
  return c;
}

// paved: whatever stands in the street (lamps, trees, houses) stands on cobbles, not grass
const GROUND_CH = new Set(['.', ',', '"', 'w', 'f', 'u', 'r', 'p', 'g', '=', ':', ';', 'F', '-', 'ц', 'с', 'ї']);
function buildGround(G, paved) {
  G = G || { g0: C.g0, g1: C.g1, g2: C.g2, g3: C.g3, g4: C.g4 };
  const [c, x] = mk(MW * TS, MH * TS);
  const img = x.createImageData(MW * TS, MH * TS), d = img.data;
  const rgb = {};
  const toRGB = h => rgb[h] || (rgb[h] = [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
  const edge = (X, y, o) => {
    let e = 99;
    if (o.n) e = Math.min(e, y); if (o.s) e = Math.min(e, 15 - y);
    if (o.w) e = Math.min(e, X); if (o.e) e = Math.min(e, 15 - X);
    if (o.n && o.w) e = Math.min(e, (X + y) >> 1);
    if (o.n && o.e) e = Math.min(e, (15 - X + y) >> 1);
    if (o.s && o.w) e = Math.min(e, (X + 15 - y) >> 1);
    if (o.s && o.e) e = Math.min(e, (30 - X - y) >> 1);
    return e;
  };
  const grassBase = (wx, wy) => { const h = hash(wx, wy, 1); return h < .03 ? G.g0 : h < .06 ? G.g2 : G.g1; };

  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
    const ch = T(tx, ty);
    const nb = { n: T(tx, ty - 1), s: T(tx, ty + 1), w: T(tx - 1, ty), e: T(tx + 1, ty) };
    const kind = isWater(ch) ? 'water' : ch === '=' ? 'path' : ch === ':' || (paved && !GROUND_CH.has(ch)) ? 'cobble' : ch === ';' ? 'sand' : ch === 'F' ? 'forest' : ch === 'g' ? 'soil'
      : ch === 'ц' ? 'cliff' : ch === 'с' ? 'steps' : ch === 'ї' ? 'salt' : 'grass';
    const wOpen = { n: !isWater(nb.n), s: !isWater(nb.s), w: !isWater(nb.w), e: !isWater(nb.e) };
    const pOpen = { n: !isPathish(nb.n), s: !isPathish(nb.s), w: !isPathish(nb.w), e: !isPathish(nb.e) };
    const tufts = [0, 1, 2].map(i => [Math.floor(hash(tx, ty, i * 3 + 1) * 13), Math.floor(hash(tx, ty, i * 3 + 2) * 14)]);
    for (let y = 0; y < 16; y++) for (let X = 0; X < 16; X++) {
      const wx = tx * 16 + X, wy = ty * 16 + y;
      let col;
      if (kind === 'water') {
        const e = edge(X, y, wOpen);
        const Wc = G.w || [C.w0, C.w1, C.w2, C.w3];
        if (e < 1) col = Wc[0];
        else if (e < 2) col = Wc[1];
        else if (e >= 4 && hash(wx >> 3, wy >> 2, 8) < .35) col = Wc[3];
        else col = hash(wx >> 2, wy, 6) < .06 ? Wc[1] : Wc[2];
        if (ch === '*' && hash(wx >> 1, wy, 14) < .35) col = (wy + (wx >> 2)) % 3 ? Wc[0] : '#fbf8f0';   // white water
      } else if (kind === 'cobble') {
        // cobbles, set in rows with each row shifted half a stone
        const row = wy >> 2, sx = (wx + (row & 1) * 3) % 6, sy = wy & 3;
        col = sx === 5 || sy === 3 ? '#6f6a64' : hash((wx + (row & 1) * 3) / 6 | 0, row, 15) < .3 ? '#b7aea0' : '#9e968a';
        if (sx === 0 && sy === 0) col = '#cbc3b5';
      } else if (kind === 'cliff') {
        // a face of white limestone: lit along the top, darker and streaked further down, in shadow at the foot
        let up = 0, down = 0;
        while (up < 6 && T(tx, ty - up - 1) === 'ц') up++;
        while (down < 6 && T(tx, ty + down + 1) === 'ц') down++;
        const f = (up * 16 + y) / ((up + down + 1) * 16), h = hash(wx, wy, 18);
        const ramp = ['#f0e8d6', '#e4dac4', '#d6caae', '#c4b696', '#ac9c7e', '#93836a'];
        let k = Math.min(5, Math.floor(f * 4.6 + (h < .2 ? 1 : 0)));
        if (hash(wx >> 1, wy >> 3, 19) < .18) k = Math.min(5, k + 1);          // vertical cracks
        if ((wy + Math.floor(hash(wx >> 3, 0, 17) * 4)) % 7 === 0) k = Math.min(5, k + 1);   // the layers of old sea bed
        col = ramp[k];
        if (up === 0 && y < 2) col = isWater(nb.n) ? '#8f8268' : y ? '#f8f2e4' : G.g3;
        if (up === 0 && y >= 2 && y < 4 && hash(wx, wy, 23) < .35) col = G.g2;      // grass hanging over the edge
        if (down === 0 && y > 13) col = isWater(nb.s) ? '#5e5444' : '#7a6e58';
        if ((nb.w !== 'ц' && X < 1) || (nb.e !== 'ц' && X > 14)) col = '#9a8c72';
        if (hash(tx, ty, 24) < .12 && Math.hypot(X - 8, y - 9) < 3 + hash(tx, ty, 25) * 2) col = hash(wx, wy, 26) < .5 ? G.g2 : G.g3;   // a bush clinging on
      } else if (kind === 'steps') {
        // broad granite steps going down to the sea
        const r = wy % 5;
        col = r === 0 ? '#8f877a' : r === 1 ? '#ece6d8' : hash(wx, wy, 20) < .08 ? '#bcb4a4' : '#d6cfc0';
        if ((nb.w !== 'с' && X < 2) || (nb.e !== 'с' && X > 13)) col = X === 0 || X === 15 ? '#6f6a64' : '#b7aea0';
      } else if (kind === 'salt') {
        const h = hash(wx, wy, 21);
        col = h < .06 ? '#ffffff' : h < .14 ? '#e4e0da' : h < .2 ? '#f4dfe4' : '#f2f0ec';
        const bankD = Math.min(isWater(nb.n) ? y : 99, isWater(nb.s) ? 15 - y : 99, isWater(nb.w) ? X : 99, isWater(nb.e) ? 15 - X : 99);
        if (bankD < 2) col = '#e8d4da';
      } else if (kind === 'sand') {
        const h = hash(wx, wy, 16);
        col = h < .06 ? '#c9b07a' : h < .12 ? '#f2e2b4' : '#e4cf98';
        const bankD = Math.min(isWater(nb.n) ? y : 99, isWater(nb.s) ? 15 - y : 99, isWater(nb.w) ? X : 99, isWater(nb.e) ? 15 - X : 99);
        if (bankD < 2) col = '#c9b07a';
      } else if (kind === 'path') {
        const e = edge(X, y, pOpen);
        if (e < 2 || (e === 2 && hash(wx, wy, 9) < .3)) col = grassBase(wx, wy);
        else if (e === 2) col = C.p2;
        else { const h = hash(wx, wy, 4); col = h < .05 ? C.p0 : h < .09 ? C.p2 : h < .1 ? C.p3 : C.p1; }
      } else if (kind === 'forest') {
        col = G.g4;
      } else if (kind === 'soil') {
        col = (y % 4 === 3) ? C.soil2 : (hash(wx, wy, 12) < .08 ? C.soil2 : C.soil);
      } else {
        col = grassBase(wx, wy);
        for (const [ax, ay] of tufts) {
          if (y === ay && (X === ax || X === ax + 2)) col = G.g0;
          if (y === ay + 1 && X >= ax && X <= ax + 2) col = G.g2;
        }
        const bankD = Math.min(isWater(nb.n) ? y : 99, isWater(nb.s) ? 15 - y : 99, isWater(nb.w) ? X : 99, isWater(nb.e) ? 15 - X : 99);
        if (bankD < 1) col = C.bank; else if (bankD < 2) col = G.g3;
        if (nb.n === 'F' && y < 3) col = y < 2 ? G.g3 : G.g2;
      }
      const [r, g, b] = toRGB(col), i = (wy * MW * TS + wx) * 4;
      d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255;
    }
  }
  x.putImageData(img, 0, 0);

  const flowers = [0, 1, 2, 3].map(makeFlowers), tall = makeTallGrass(), wheat = [makeWheat(1), makeWheat(2)];
  const flax = [makeFlax(1), makeFlax(2)];
  const bridge = makeBridge(), cab = [makeCabbageBed(3), makeCabbageBed(4)];
  const fern = [makeFern(1, G), makeFern(2, G)], shrooms = [makeMushrooms(1), makeMushrooms(2)], poppies = [makePoppies(1), makePoppies(2)], reeds = makeReeds();
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
    const ch = T(tx, ty), px = tx * 16, py = ty * 16, v = Math.floor(hash(tx, ty, 40) * 4);
    if (ch === ',') x.drawImage(flowers[v], px, py);
    else if (ch === '"') x.drawImage(tall, px, py);
    else if (ch === 'w') x.drawImage(wheat[v & 1], px, py);
    else if (ch === '-') x.drawImage(flax[v & 1], px, py);
    else if (ch === 'g') x.drawImage(cab[v & 1], px, py);
    else if (ch === '#') x.drawImage(bridge, px, py);
    else if (ch === 'f') x.drawImage(fern[v & 1], px, py);
    else if (ch === 'u') x.drawImage(shrooms[v & 1], px, py);
    else if (ch === 'p') x.drawImage(poppies[v & 1], px, py);
    else if (ch === 'r') x.drawImage(reeds, px, py);
  }
  // the forest wall, back rows first so nearer crowns overlap
  const crowns = [0, 1, 2].map(s => makeForestTree(s + 50, false)), edged = [0, 1, 2].map(s => makeForestTree(s + 50, true));
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
    if (T(tx, ty) !== 'F') continue;
    const v = Math.floor(hash(tx, ty, 41) * 3), open = T(tx, ty + 1) !== 'F' && ty + 1 < MH;
    x.drawImage(open ? edged[v] : crowns[v], tx * 16 - 2, ty * 16 - 4 + (open ? 0 : (hash(tx, ty, 42) * 3 | 0)));
  }
  return { canvas: c, over: { '"': tall, w: wheat[0], f: fern[0], r: reeds, '-': flax[0] } };
}

// ─── Buildings and things ─────────────────────────────────────────────────
function makeKhata(trim, roof, seed, logs) {
  const [c, x] = mk(64, 64);
  // whitewashed walls
  R(x, 5, 36, 54, 26, C.wall); R(x, 55, 36, 4, 26, C.wall2);
  R(x, 5, 39, 54, 3, C.wall3); R(x, 5, 42, 54, 1, C.wall2);
  // or bare logs, for a kurin at the Sich
  if (logs) for (let y = 36; y < 56; y++) R(x, 5, y, 54, 1, y % 4 === 3 ? C.wd3 : y % 4 === 0 ? C.wd0 : C.wd1);
  // the prizba: a clay bench-plinth round the house, with a painted line above it
  R(x, 5, 56, 54, 6, '#c99560'); R(x, 5, 56, 54, 1, '#a87443'); R(x, 55, 57, 4, 5, '#b5824f');
  R(x, 5, 55, 54, 1, trim[0]);
  R(x, 4, 36, 1, 26, C.out); R(x, 59, 36, 1, 26, C.out); R(x, 4, 62, 56, 1, C.out);
  // windows with painted surrounds
  for (const wx of [12, 45]) {
    R(x, wx - 1, 42, 13, 1, trim[0]); R(x, wx + 4, 41, 3, 1, trim[0]); P(x, wx + 5, 40, trim[0]);
    R(x, wx, 44, 11, 10, trim[0]); R(x, wx + 1, 45, 9, 8, C.glass);
    R(x, wx + 5, 45, 1, 8, trim[0]); R(x, wx + 1, 48, 9, 1, trim[0]);
    P(x, wx + 2, 46, C.glass2); P(x, wx + 3, 46, C.glass2); P(x, wx + 2, 47, C.glass2); P(x, wx + 7, 49, C.glass2);
    R(x, wx - 1, 54, 13, 1, trim[1]);
    // embroidered towel (rushnyk) hanging inside one window
    if (wx === 12) { R(x, wx + 7, 45, 2, 3, '#fbf8f0'); P(x, wx + 7, 46, C.red); }
  }
  // door
  R(x, 32, 41, 12, 21, trim[0]); R(x, 33, 42, 10, 20, C.wd1);
  R(x, 36, 42, 1, 20, C.wd2); R(x, 39, 42, 1, 20, C.wd2); R(x, 33, 42, 10, 1, C.wd2);
  P(x, 41, 52, C.out); P(x, 41, 51, C.gold);
  R(x, 31, 61, 14, 1, '#a87443');
  // thatched roof, hipped, with a fat rolled eave
  for (let y = 8; y <= 41; y++) {
    const t = (y - 8) / 33, l = Math.round(20 - t * 19), r = Math.round(43 + t * 19);
    for (let X = l; X <= r; X++) {
      let col;
      if (X === l || X === r || y === 41) col = roof[4];
      else if (y >= 38) col = ((X + (y & 1)) % 3 === 0) ? roof[3] : roof[1];
      else if (y <= 10) col = roof[2];
      else {
        const s = hash(X, Math.floor((y + hash(X, 0, seed) * 4) / 3), seed);
        col = s < .22 ? roof[0] : s < .72 ? roof[1] : roof[2];
        if (y > 33 && s > .6) col = roof[3];
      }
      P(x, X, y, col);
    }
  }
  R(x, 20, 7, 24, 1, roof[4]);
  // chimney
  R(x, 36, 1, 7, 1, C.out); R(x, 36, 2, 1, 8, C.out); R(x, 42, 2, 1, 8, C.out);
  R(x, 37, 2, 5, 8, C.wall); R(x, 40, 2, 2, 8, C.wall2); R(x, 37, 2, 5, 1, C.wall3);
  return c;
}

function makeChurch(o = {}) {
  const [c, x] = mk(80, 112);
  const D = Object.assign({ dome: C.dome, dome1: C.dome1, dome2: C.dome2, wall: C.wall, wall2: C.wall2, wall3: C.wall3, trim: '#d9cfbb' }, o);
  const dome = (cx, base, Rr, H) => {
    for (let k = 0; k <= H; k++) {
      const t = k / H, r = Rr * Math.pow(1 - t, .7) * (1 + 1.6 * t), y = base - k;
      const l = Math.ceil(cx - r), rr = Math.floor(cx + r);
      for (let X = l; X <= rr; X++) {
        const rel = (X - cx) / Math.max(r, 1);
        let col = rel < -.45 ? D.dome1 : rel > .35 ? D.dome2 : D.dome;
        if (X === l || X === rr || k === H) col = C.out;
        P(x, X, y, col);
      }
    }
    const top = base - H;
    R(x, Math.round(cx - .5), top - 4, 1, 4, C.gold2);
    // three-barred cross
    const cxp = Math.round(cx - .5), cy = top - 13;
    R(x, cxp, cy, 1, 10, C.gold);
    R(x, cxp - 1, cy + 2, 3, 1, C.gold); R(x, cxp - 3, cy + 4, 7, 1, C.gold);
    P(x, cxp - 2, cy + 8, C.gold); P(x, cxp - 1, cy + 8, C.gold); P(x, cxp + 1, cy + 7, C.gold); P(x, cxp + 2, cy + 7, C.gold);
  };
  // nave
  R(x, 9, 70, 62, 41, C.out); R(x, 10, 70, 60, 40, D.wall); R(x, 62, 70, 8, 40, D.wall2);
  R(x, 10, 104, 60, 6, D.trim); R(x, 10, 104, 60, 1, D.wall3);
  for (let y = 63; y <= 70; y++) { const ov = Math.round((y - 63) * .5); R(x, 12 - ov, y, 56 + ov * 2, 1, y === 70 ? D.dome2 : (y < 65 ? D.dome1 : D.dome)); }
  R(x, 11, 63, 58, 1, C.out);
  // side towers with small domes
  for (const tx of [12, 54]) {
    R(x, tx - 1, 49, 16, 15, C.out); R(x, tx, 50, 14, 14, D.wall); R(x, tx + 10, 50, 4, 14, D.wall2);
    R(x, tx + 5, 53, 3, 7, C.glass); P(x, tx + 6, 52, C.glass);
    R(x, tx - 1, 48, 16, 2, C.gold2);
    dome(tx + 6.5, 47, 7, 13);
  }
  // central drum and dome
  R(x, 25, 40, 30, 24, C.out); R(x, 26, 41, 28, 23, D.wall); R(x, 48, 41, 6, 23, D.wall2);
  for (const wx of [31, 44]) { R(x, wx, 46, 4, 11, C.glass); R(x, wx + 1, 45, 2, 1, C.glass); P(x, wx + 1, 48, C.glass2); }
  R(x, 25, 38, 30, 3, C.gold2); R(x, 25, 38, 30, 1, C.gold);
  dome(39.5, 37, 13, 22);
  // nave windows and arched door
  for (const wx of [17, 59]) { R(x, wx, 78, 5, 14, C.glass); R(x, wx + 1, 77, 3, 1, C.glass); P(x, wx + 1, 80, C.glass2); }
  R(x, 33, 86, 14, 24, C.gold2); R(x, 34, 84, 12, 2, C.gold2); R(x, 36, 83, 8, 1, C.gold2);
  R(x, 35, 87, 10, 23, C.wd1); R(x, 36, 86, 8, 1, C.wd1); R(x, 39, 87, 2, 23, C.wd2);
  // an icon above the door
  R(x, 37, 76, 6, 6, C.gold2); R(x, 38, 77, 4, 4, '#5a77b5'); R(x, 39, 78, 2, 2, C.skin);
  return c;
}

function makeTree(kind, seed) {
  if (kind === 'C') {           // cherry
    const [c, x] = mk(32, 34);
    shadow(x, 16, 31, 11, 3);
    R(x, 14, 20, 4, 12, C.wd2); R(x, 14, 20, 1, 12, C.wd1); P(x, 13, 31, C.wd2); P(x, 18, 31, C.wd2);
    const at = blob(x, 16, 12, 13, 10.5, [C.leaf0, C.leaf1, C.leaf2, C.leaf3, C.leafO], seed);
    for (let i = 0; i < 14; i++) {
      const X = 6 + Math.floor(hash(seed, i, 60) * 20), Y = 5 + Math.floor(hash(seed, i, 61) * 14);
      if (at(X, Y) && at(X + 1, Y + 1) && at(X - 1, Y) && at(X, Y + 2)) { P(x, X, Y, C.red); P(x, X, Y + 1, C.red2); P(x, X + 1, Y + 1, C.red2); }
    }
    return { img: c, ox: -8 };
  }
  if (kind === 'Y') {           // willow
    const [c, x] = mk(40, 46);
    shadow(x, 20, 43, 15, 3);
    R(x, 18, 22, 4, 23, C.wd2); R(x, 18, 22, 1, 23, C.wd1); R(x, 21, 22, 1, 23, C.wd3);
    const pal = ['#c4e48a', '#97c862', '#6ba046', '#4b7e3a', '#2d4d2a'];
    blob(x, 20, 13, 17, 11, pal, seed, .14);
    for (let X = 4; X <= 36; X += 2) {
      if (hash(X, seed, 62) < .2) continue;
      const k = (X - 20) / 17; if (Math.abs(k) >= 1) continue;
      const y0 = Math.floor(13 + 11 * Math.sqrt(1 - k * k)) - 3, len = 8 + Math.floor(hash(X, seed, 63) * 14);
      for (let y = y0; y < Math.min(y0 + len, 42); y++) P(x, X, y, (y - y0) % 3 === 0 ? pal[3] : pal[2]);
      P(x, X, Math.min(y0 + len, 42), pal[1]);
    }
    return { img: c, ox: -12 };
  }
  // poplar
  const [c, x] = mk(20, 58);
  shadow(x, 10, 55, 6, 2.5);
  R(x, 9, 44, 2, 13, C.wd2);
  blob(x, 10, 24, 7, 22, [C.leaf1, C.leaf2, C.leaf3, '#285433', '#1b3a24'], seed, .12);
  return { img: c, ox: -2 };
}

function makeWell() {
  const [c, x] = mk(40, 56);
  shadow(x, 9, 54, 9, 2.5);
  // the post, forked at the top
  R(x, 25, 20, 3, 36, C.wd2); R(x, 25, 20, 1, 36, C.wd1);
  P(x, 24, 18, C.wd2); P(x, 24, 19, C.wd2); P(x, 28, 18, C.wd2); P(x, 28, 19, C.wd2);
  // the sweep: a long pole on a pivot, counterweight at the far end
  line(x, 3, 6, 38, 28, C.wd3, 2); line(x, 3, 5, 38, 27, C.wd1, 1);
  R(x, 33, 26, 7, 6, C.out); R(x, 34, 27, 5, 4, '#8d8577'); R(x, 34, 27, 2, 1, '#aaa294');
  // rope and bucket
  R(x, 4, 8, 1, 30, '#5a4636');
  R(x, 1, 37, 7, 6, C.out); R(x, 2, 38, 5, 4, C.wd0); R(x, 2, 40, 5, 1, C.wd2);
  // the well box
  R(x, 0, 41, 16, 15, C.out);
  R(x, 1, 42, 14, 4, C.wd0); R(x, 3, 43, 10, 2, '#203546');
  R(x, 1, 46, 14, 9, C.wd1);
  for (let y = 48; y < 55; y += 3) R(x, 1, y, 14, 1, C.wd2);
  R(x, 1, 46, 14, 1, C.wd2); R(x, 12, 46, 3, 9, C.wd2);
  return c;
}

function makeHaystack(seed) {
  const [c, x] = mk(32, 30);
  shadow(x, 16, 27, 15, 3);
  R(x, 15, 0, 2, 8, C.wd2);
  const pal = THATCH;
  for (let y = 4; y < 29; y++) for (let X = 0; X < 32; X++) {
    const a = Math.hypot((X + .5 - 16) / 14.5, (y + .5 - 19) / 10), b = Math.hypot((X + .5 - 16) / 8, (y + .5 - 11) / 7.5);
    if (Math.min(a, b) >= 1 || y > 27) continue;
    const edge = Math.min(a, b) > .9 || y === 27;
    const s = hash(X, Math.floor((y + hash(X, 1, seed) * 3) / 2), seed);
    const lit = -(X - 16) / 16 * .5 - (y - 14) / 14 * .7;
    P(x, X, y, edge ? pal[4] : s < .18 ? pal[0] : lit + s * .5 > .25 ? pal[1] : lit > -.45 ? pal[2] : pal[3]);
  }
  return c;
}

function makeSunflower(frame) {
  const [c, x] = mk(16, 32);
  R(x, 7, 12, 2, 20, C.leaf2); R(x, 7, 12, 1, 20, C.leaf1);
  blob(x, 4.5, 20, 3.5, 2, [C.leaf0, C.leaf1, C.leaf2, C.leaf3, C.leafO], 70, .05);
  blob(x, 11.5, 25, 3.5, 2, [C.leaf0, C.leaf1, C.leaf2, C.leaf3, C.leafO], 71, .05);
  const hx = 8 + frame, hy = 8;
  for (let Y = 0; Y < 16; Y++) for (let X = 0; X < 16; X++) {
    const dx = X + .5 - hx, dy = Y + .5 - hy, d = Math.hypot(dx, dy);
    if (d <= 2.9) P(x, X, Y, (X + Y) % 2 ? '#6b3e1f' : '#4b2a15');
    else if (d <= 3.6) P(x, X, Y, '#4b2a15');
    else {
      const a = Math.atan2(dy, dx), petal = (Math.cos(a * 10) + 1) / 2;
      if (d <= 5 + petal * 1.6) P(x, X, Y, d > 5 + petal * 1.6 - 1 ? C.yel2 : (petal > .5 ? C.yel : '#f9dc6a'));
    }
  }
  return c;
}

function makeMallows() {
  const [c, x] = mk(16, 28);
  blob(x, 8, 24, 6, 3, [C.leaf0, C.leaf1, C.leaf2, C.leaf3, C.leafO], 80, .1);
  const cols = [[C.pink, C.pink2], ['#fbf8f0', C.pink], [C.red, C.red2]];
  [[5, 3, 0], [11, 6, 1]].forEach(([sx, top, k]) => {
    R(x, sx, top, 1, 22 - top, C.leaf2);
    for (let y = top; y < 20; y += 4) {
      const [a, b] = cols[(k + y / 4 | 0) % 3], fx = sx + ((y / 4 | 0) % 2 ? 1 : -1);
      R(x, fx - 1, y, 3, 3, a); P(x, fx, y + 1, b);
    }
  });
  return c;
}

function makePumpkins() {
  const [c, x] = mk(16, 16);
  blob(x, 12, 4, 3.5, 2.5, [C.leaf0, C.leaf1, C.leaf2, C.leaf3, C.leafO], 81, .1);
  for (const [cx, cy, rx, ry] of [[6, 10, 5.5, 4.2], [12.5, 12.5, 3.5, 2.8]]) {
    for (let Y = 0; Y < 16; Y++) for (let X = 0; X < 16; X++) {
      const d = Math.hypot((X + .5 - cx) / rx, (Y + .5 - cy) / ry);
      if (d >= 1) continue;
      const rib = Math.abs(((X + .5 - cx) / rx * 2.2) % 1) < .18;
      P(x, X, Y, d > .86 ? C.org2 : rib ? C.org2 : (X < cx - 1 && Y < cy ? '#f6a64b' : C.org));
    }
    R(x, Math.round(cx), Math.round(cy - ry) - 1, 1, 2, C.leaf3);
  }
  return c;
}

function makeBeehive() {
  const [c, x] = mk(16, 20);
  shadow(x, 8, 19, 7, 1.5);
  R(x, 3, 17, 2, 3, C.wd3); R(x, 11, 17, 2, 3, C.wd3);
  R(x, 1, 6, 14, 12, C.out); R(x, 2, 7, 12, 10, C.wd0);
  R(x, 2, 10, 12, 1, C.wd1); R(x, 2, 13, 12, 1, C.wd1); R(x, 11, 7, 3, 10, C.wd1);
  R(x, 5, 15, 6, 1, C.out);
  for (let y = 1; y < 7; y++) { const w = 2 + (y - 1) * 2.4 | 0; R(x, 8 - w / 2 | 0, y, w, 1, y === 1 ? C.out : C.wd2); }
  R(x, 0, 6, 16, 1, C.wd3);
  return c;
}

function makeStork(frame) {
  // a white stork (leleka) on a cartwheel nest atop a pole
  const [c, x] = mk(24, 64);
  R(x, 11, 22, 2, 42, '#857360'); R(x, 11, 22, 1, 42, '#a08c74');
  shadow(x, 12, 62, 4, 1.5);
  const body = [
    '.......oo...',
    '......owwo..',
    '.rrrrrowew..',
    '......owo...',
    '......owo...',
    '.....owwo...',
    '....owwwwo..',
    '...owwwwwwo.',
    '..okkwwwwwo.',
    '..okkkwwwo..',
    '...okkkoo...'];
  const beakUp = [
    '...r...oo...',
    '....r.owwo..',
    '.....rowew..'];
  const rows = frame ? beakUp.concat(body.slice(3)) : body;
  x.drawImage(art(rows, { o: C.out, w: '#fbf8f0', e: C.out, r: '#e0503a', k: '#2b2230' }), 6, 4);
  for (let X = 1; X < 23; X++) for (let y = 14; y < 21; y++) {
    const d = Math.hypot((X + .5 - 12) / 11, (y + .5 - 17) / 3.6);
    if (d < 1) P(x, X, y, d > .8 ? '#4b3524' : hash(X, y, 90) < .5 ? '#8a6a45' : '#6b4f33');
  }
  P(x, 0, 15, '#6b4f33'); P(x, 23, 18, '#6b4f33'); P(x, 2, 20, '#4b3524');
  return c;
}

function makeSign() {
  const [c, x] = mk(16, 20);
  R(x, 7, 10, 2, 10, C.wd2);
  R(x, 1, 2, 14, 10, C.out); R(x, 2, 3, 12, 8, C.wd0); R(x, 2, 10, 12, 1, C.wd1);
  R(x, 4, 5, 8, 1, C.wd2); R(x, 4, 7, 6, 1, C.wd2);
  return c;
}

function makeFence(h, v, pot) {
  const [c, x] = mk(16, 22);
  const weaveH = () => {
    R(x, 0, 7, 16, 1, C.wd3); R(x, 0, 20, 16, 1, C.wd3);
    for (let y = 8; y < 20; y++) {
      const band = (y - 8) / 3 | 0, r = (y - 8) % 3, seg = ((Math.floor((y > 0 ? 0 : 0) + 0) + ((0) >> 2)) & 1);
      for (let X = 0; X < 16; X++) {
        const s = ((X + (band % 2) * 4) >> 2) & 1;
        P(x, X, y, r === 0 ? (s ? C.wd0 : C.wd1) : r === 1 ? (s ? C.wd1 : C.wd2) : (s ? C.wd2 : C.wd3));
      }
    }
  };
  const post = X => { R(x, X, 4, 2, 18, C.wd2); P(x, X, 4, C.wd1); P(x, X, 3, C.wd2); R(x, X, 5, 1, 15, C.wd1); };
  if (h) { weaveH(); post(2); post(12); }
  if (v) {
    for (let y = 2; y < 22; y++) { R(x, 6, y, 4, 1, ((y >> 1) & 1) ? C.wd1 : C.wd2); P(x, 6, y, C.wd3); P(x, 9, y, C.wd3); }
    post(7);
  }
  if (!h && !v) post(7);
  if (pot) {
    post(7);
    R(x, 5, 0, 6, 5, C.out); R(x, 6, 1, 4, 4, '#b8582f'); R(x, 6, 1, 1, 3, '#d9804a');
    R(x, 7, 5, 2, 1, '#8a3c20');
  }
  return c;
}

// ─── People ───────────────────────────────────────────────────────────────
// Front and back views are drawn as a left half and mirrored; the side view faces left.
const DOWN_HALF = [
  '........', '....oooo', '..oohhhh', '.ohhhhhh', '.ohhhhhh', '.ohhhhss', '.ohsssss', '.ohssess',
  '.oSssess', '..oSssss', '...oooor', '..owwwwr', '.osowwwr', '.ooxxxxx', '..oppppo', '..obbbo.'];
const UP_HALF = [
  '........', '....oooo', '..oohhhh', '.ohhhhhh', '.ohhhhhh', '.ohhhhhh', '.ohhhhhh', '.ohhhhhh',
  '.oHhhhhh', '..oHhhhh', '...ooooo', '..owwwww', '.osowwww', '.ooxxxxx', '..oppppo', '..obbbo.'];
const SIDE = [
  '................',
  '.....ooooo......',
  '...oohhhhhoo....',
  '..ohhhhhhhhhho..',
  '.ohhhhhhhhhhhho.',
  '.ohhhhhhhhhhhho.',
  '.osshhhhhhhhhho.',
  'osseshhhhhhhhho.',
  'ossesshhhhhhho..',
  '.osssssShhhhho..',
  '..ooSsooooooo...',
  '....orwwwwwo....',
  '....owwWwwwo....',
  '....oxxsxxxo....',
  '.....oppppo.....',
  '....obbbbo......'];
const mirror = half => half.map(r => r + [...r].reverse().join(''));
const rev = r => [...r].reverse().join('');

function buildPerson(pal, mods = []) {
  const skirt = mods.includes('skirt');
  const views = { down: mirror(DOWN_HALF), up: mirror(UP_HALF), left: SIDE.slice() };
  for (const dir in views) {
    let rows = views[dir].map(r => [...r]);
    if (skirt) {
      if (dir === 'left') { rows[14] = [...'....oppppppo....']; rows[15] = [...'....obbo.obo....']; }
      else { rows[14] = [...'.oppppppppppppo.']; rows[15] = [...'...obbo..obbo...']; }
    }
    if (mods.includes('dots')) rows = rows.map((r, y) => r.map((k, X) => (k === 'h' && y < 6 && (X + y) % 3 === 0) ? 'D' : k));
    if (mods.includes('vinok')) {
      const cyc = ['R', 'Y', 'R', 'U', 'G'];
      for (const y of [2, 3]) rows[y] = rows[y].map((k, X) => (k === 'h' || k === 'H') ? cyc[(X + y) % 5] : k);
      if (dir === 'up') for (let y = 9; y < 14; y++) for (const X of [6, 9]) rows[y][X] = cyc[(y + X) % 5];
    }
    if (mods.includes('hat')) {
      for (let y = 1; y <= 3; y++) rows[y] = rows[y].map(k => (k === 'h' || k === 'H') ? 'T' : k);
      rows[0] = rows[1].map(k => k === 'o' ? '.' : k).map(() => '.');
      rows[4] = [...'oTTTTTTTTTTTTTTo'];
      rows[5] = rows[5].map((k, X) => (X === 0 || X === 15) ? '.' : k);
      rows[3] = rows[3].map(k => k === 'T' ? 't' : k);
    }
    if (mods.includes('moustache')) {
      if (dir === 'down') { for (let X = 4; X <= 11; X++) rows[9][X] = 'm'; rows[10][4] = 'm'; rows[10][11] = 'm'; }
      if (dir === 'left') { rows[9][2] = 'm'; rows[9][3] = 'm'; rows[9][4] = 'm'; rows[10][2] = 'm'; }
    }
    // a kozak's chub: shaved head, one long lock on top
    if (mods.includes('chub')) for (let y = 1; y <= 6; y++) rows[y] = rows[y].map((k, X) => (k === 'h' || k === 'H') ? ((X === 7 || X === 8) && y < 4 ? 'h' : 's') : k);
    if (mods.includes('horns')) { if (dir === 'left') { rows[1][8] = 'j'; rows[0][8] = 'j'; } else { rows[1][4] = 'j'; rows[0][4] = 'j'; rows[1][11] = 'j'; rows[0][11] = 'j'; } }
    if (mods.includes('glasses') && dir === 'down') for (const X of [4, 6, 7, 8, 9, 11]) rows[7][X] = 'g';
    if (mods.includes('glasses') && dir === 'left') { rows[7][2] = 'g'; rows[7][4] = 'g'; rows[7][5] = 'g'; }
    // a mavka seen from behind is a hollow tree: bark, moss and nothing else
    if (mods.includes('bark') && dir === 'up') rows = rows.map((r, y) => r.map((k, X) => (k === '.' || k === 'o' || y < 2) ? k : (y < 5 && (X + y) % 4 === 0 ? 'G' : (X * 3 + y) % 5 < 2 ? 'k' : 'K')));
    views[dir] = rows.map(r => r.join(''));
  }
  const base = { h: '#5b3a29', H: '#3c2519', o: C.out, e: C.out, s: C.skin, S: C.skin2, w: '#fbf8f0', W: '#cfc8d8', r: C.red, x: '#b8323a',
    p: '#34477a', P: '#26355c', b: '#7a3b22', T: '#ecd28a', t: '#c9a75a', m: '#d8d4cc', R: C.red, Y: C.yel, U: '#5b7fe0', G: C.leaf1, D: '#f6e7c4', g: '#4a3a30', K: '#8a6a45', k: '#5b432c', j: '#e8dcc0' };
  const pl = Object.assign({}, base, pal);
  const step = (rows, dir) => {
    const r = rows.slice();
    if (dir === 'left') {
      if (skirt) r[15] = '...obbo..obbo...';
      else { r[14] = '....oppoppo.....'; r[15] = '...obbo.obbo....'; }
      return r;
    }
    if (skirt) { r[15] = '...obbo.........'; return r; }
    r[14] = '..obbbo.' + rows[14].slice(8); r[15] = '........' + rows[15].slice(8);
    return r;
  };
  const out = {};
  for (const dir of ['down', 'up', 'left']) {
    const s = views[dir], a = step(s, dir), b = dir === 'left' ? a.map((row, i) => i === 13 ? '....oxsxxxxo....' : row) : a.map(rev);
    out[dir] = [art(s, pl), art(a, pl), art(b, pl)];
  }
  out.right = out.left.map(flipH);
  return out;
}

function makeGoose(frame) {
  return art([
    '..oo........',
    '.owwo.......',
    'yowewo......',
    '..owwo......',
    '..owwo...o..',
    '..owwwoooWo.',
    '.owwwwwwwWo.',
    '.owwwwwwWWo.',
    '..oWWWWWWo..',
    frame ? '...oooooo...' : '..ccoooocc..'], { o: C.out, w: '#fbf8f0', W: '#d6d2cc', e: C.out, y: C.org, c: C.w0 });
}

