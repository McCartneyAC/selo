// ─── World assembly ───────────────────────────────────────────────────────
const SIZES = { K: [4, 3], L: [4, 3], M: [4, 3], Q: [5, 4], Z: [2, 1], H: [2, 1] };
const WALKABLE = new Set(['.', ',', '"', '=', '#', 'w']);
const blocked = new Uint8Array(MW * MH);
const owner = new Array(MW * MH).fill(null);
const objects = [];
const idx = (x, y) => y * MW + x;

const SPR = {};
function buildSprites() {
  SPR.khata = { K: makeKhata(TRIMS.K, THATCH, 1), L: makeKhata(TRIMS.L, REED, 2), M: makeKhata(TRIMS.M, THATCH, 3) };
  SPR.church = makeChurch();
  SPR.well = makeWell();
  SPR.hay = [makeHaystack(1), makeHaystack(2)];
  SPR.trees = { C: [1, 2, 3].map(s => makeTree('C', s)), Y: [1, 2].map(s => makeTree('Y', s)), P: [1, 2].map(s => makeTree('P', s)) };
  SPR.sun = [makeSunflower(0), makeSunflower(1)];
  SPR.mallows = makeMallows();
  SPR.pumpkins = makePumpkins();
  SPR.hive = makeBeehive();
  SPR.stork = [makeStork(0), makeStork(1)];
  SPR.sign = makeSign();
  SPR.goose = [makeGoose(0), makeGoose(1)];
  SPR.gooseR = SPR.goose.map(flipH);
  SPR.fence = {};
  for (const k of ['h', 'v', 'hv', '', 'hp', 'vp', 'hvp', 'p']) SPR.fence[k] = makeFence(k.includes('h'), k.includes('v'), k.includes('p'));
}

const isFence = c => c === 'x' || c === 'j';
function buildWorld() {
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
    const ch = T(tx, ty);
    if (!WALKABLE.has(ch) && ch !== '.') blocked[idx(tx, ty)] = 1;
  }
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
    const ch = T(tx, ty), px = tx * 16, py = ty * 16, v = Math.floor(hash(tx, ty, 77) * 4);
    const add = (o, w = 1, h = 1) => {
      o.tx = tx; o.ty = ty; o.w = w; o.h = h; o.ch = ch; o.base = (ty + h) * 16;
      objects.push(o);
      for (let y = ty; y < ty + h; y++) for (let x = tx; x < tx + w; x++) { blocked[idx(x, y)] = 1; owner[idx(x, y)] = o; }
      return o;
    };
    if (ch === 'K' || ch === 'L' || ch === 'M') add({ img: SPR.khata[ch], x: px, y: py - 16 }, 4, 3);
    else if (ch === 'Q') add({ img: SPR.church, x: px, y: py + 64 - 112 }, 5, 4);
    else if (ch === 'Z') add({ img: SPR.well, x: px, y: py + 16 - 56 }, 2, 1);
    else if (ch === 'H') add({ img: SPR.hay[v & 1], x: px, y: py + 16 - 30 }, 2, 1);
    else if (ch === 'C' || ch === 'Y' || ch === 'P') {
      const list = SPR.trees[ch], t = list[v % list.length];
      add({ img: t.img, x: px + t.ox, y: py + 16 - t.img.height });
    }
    else if (ch === 'S') add({ anim: 'sun', x: px, y: py + 16 - 32, phase: hash(tx, ty, 5) * 6 });
    else if (ch === 'm') add({ img: SPR.mallows, x: px, y: py + 16 - 28 });
    else if (ch === 'o') add({ img: SPR.pumpkins, x: px, y: py });
    else if (ch === 'B') add({ img: SPR.hive, x: px, y: py + 16 - 20, bees: true });
    else if (ch === 'N') add({ anim: 'stork', x: px - 4, y: py + 16 - 64 });
    else if (ch === 'i') add({ img: SPR.sign, x: px, y: py + 16 - 20 });
    else if (isFence(ch)) {
      const h = isFence(T(tx - 1, ty)) || isFence(T(tx + 1, ty)), vv = isFence(T(tx, ty - 1)) || isFence(T(tx, ty + 1));
      const key = (h ? 'h' : '') + (vv ? 'v' : '') + (ch === 'j' ? 'p' : '');
      add({ img: SPR.fence[key], x: px, y: py + 16 - 22 });
    }
  }
}

// ─── What things say ──────────────────────────────────────────────────────
const HOUSES = {
  '5,10': { name: 'Did Mykola\'s house', door: 'Did Mykola\'s house. Through the window you can see a rushnyk draped over the icon in the corner.' },
  '22,10': { name: 'Halyna\'s house', door: 'Halyna\'s house. It smells of borshch and fresh dill.' },
  '5,19': { name: 'The Hrytsenko house', door: 'Nobody answers.\nBehind the stove, something shuffles, then goes very quiet.' },
  '20,18': { name: 'Your house', door: 'Your house. Mama has gone to the market. The cat is asleep on the pich, as usual.' },
};
const SIGNS = {
  '18,15': 'NORTH: the Church of the Pokrova.\nEAST: the bridge over the Vyshnivka.',
  '15,17': 'ВИШНЕВЕ\nVyshneve. Population 212 people and 1 stork.',
};
const LOOK = {
  Q: 'The Church of the Pokrova. Whitewashed walls, green domes. Someone regilds the crosses every Easter.',
  Z: 'You lower the bucket on the long sweep. The water is cold enough to make your teeth ache.',
  H: 'A haystack. It smells like the whole summer in one place.',
  N: 'The leleka clacks its beak at you.\nKle-ke-ke-ke.',
  B: 'The hive hums. In the old days you told the bees the family news, so they wouldn\'t take offence and fly away.',
  S: 'A sunflower, taller than you, heavy with seeds.',
  m: 'Mallows. Every khata has them by the door.',
  o: 'A fat pumpkin. A girl gives one to a suitor she is turning down. Hence the saying.',
  x: 'A wattle fence, woven from willow switches.',
  j: 'Clay pots drying upside down on the fence posts.',
  g: 'Cabbages in tidy rows. Halyna knows exactly how many there are.',
  C: 'A cherry tree. The fruit is dark and a little sour.',
  Y: 'A willow leans out over the water, the way they always do.',
  P: 'A tall poplar. They line every road out of the village.',
  '~': 'The Vyshnivka, slow and green. Something big turns over under the surface.',
  F: 'The forest is thick and dark. Not today.',
  wall: 'Whitewashed walls, warm from the sun. The thatch smells of dust.',
};

const NPCS = [
  { id: 'hanna', name: 'Baba Hanna', tx: 13, ty: 14, dir: 'right',
    pal: { h: C.red, H: C.red2, w: '#efe8d8', W: '#c9c0ae', r: '#2d4f91', x: '#3a6a3a', p: '#4a3656', b: '#3a2a22' }, mods: ['skirt', 'dots'],
    talk: [
      ['Ah, you\'re up. The zhuravel creaks, but it has never once dropped a bucket.', 'Forty years I\'ve drawn water here. The well knows my voice.'],
      ['If someone calls your name by the river after dark, don\'t answer.', 'That\'s all I\'ll say about it.']] },
  { id: 'mykola', name: 'Did Mykola', tx: 8, ty: 13, dir: 'down',
    pal: { h: '#d8d4cc', H: '#a9a49b', w: '#efe8d8', p: '#5a4a3a', P: '#433628', b: '#3a2a22', x: C.red }, mods: ['hat', 'moustache'],
    talk: [
      ['See the stork across the river? Every spring she comes back to that pole. St. George\'s Day, give or take.', 'A house the leleka chooses doesn\'t burn. That isn\'t superstition. That\'s forty years of watching.']] },
  { id: 'oksana', name: 'Oksana', tx: 30, ty: 7, dir: 'down', wander: 2,
    pal: { h: '#7a4a22', H: '#563216', w: '#fbf8f0', r: C.red, x: C.red, p: '#b8323a', P: '#8f2430', b: '#3a2a22' }, mods: ['skirt', 'vinok'],
    talk: [
      ['On Kupala night the girls float their wreaths down the Vyshnivka.', 'Last year mine got caught on Taras\'s fishing line. Everyone laughed.', 'I didn\'t.']] },
  { id: 'petryk', name: 'Petryk', tx: 12, ty: 16, dir: 'left', wander: 3,
    pal: { h: '#e8c46a', H: '#c49a3e', w: '#fbf8f0', p: '#6a6a3a', b: '#7a3b22' },
    talk: [
      ['Race you to the bridge!', '...You have to actually run, you know. Hold Shift.'],
      ['My cousin says a mavka lives in the forest.', 'From the front she\'s the prettiest girl you ever saw. From behind there\'s nothing. Just leaves and bark.']] },
  { id: 'ostap', name: 'Ostap the kobzar', tx: 16, ty: 8, dir: 'down',
    pal: { h: '#d8d4cc', H: '#a9a49b', w: '#5a4a6a', W: '#433656', r: C.gold, x: C.gold2, p: '#3a3046', b: '#2b2230' }, mods: ['moustache'],
    talk: [
      ['Sit a while. I\'ve carried these dumas from Chyhyryn to the Danube.', 'Bring me a story I\'ve never heard, and I\'ll sing it back to you better than you told it.']] },
  { id: 'halyna', name: 'Halyna', tx: 26, ty: 12, dir: 'right',
    pal: { h: '#4c9c66', H: '#2f6b45', w: '#fbf8f0', r: C.red, x: '#2f6b45', p: '#3a4f7a', b: '#3a2a22' }, mods: ['skirt', 'dots'],
    talk: [
      ['Beets, cabbage, garlic, dill. A garden is a pantry you have to argue with.', 'Leave a crust of bread behind the stove tonight. The domovyk gets moody when the house is busy.']] },
  { id: 'taras', name: 'Taras', tx: 30, ty: 15, dir: 'right',
    pal: { h: '#3a2a22', H: '#241812', w: '#e8e2d2', r: '#2d4f91', x: '#2d4f91', p: '#4a4a5a', b: '#3a2a22' }, mods: ['hat'],
    talk: [
      ['Shh. The carp are thinking.'],
      ['When the vodyanyk takes your hook, you say thank you and tie on another.', 'You don\'t argue with the owner of the river.']] },
];

const INTRO = [
  'Vyshneve. A village of cherry orchards somewhere in the Poltava steppe.',
  'It is July. The storks are home and the sunflowers are taller than you.',
  'Walk with the arrow keys. Press Z or Space to talk to people and look at things.',
];

// ─── Entities ─────────────────────────────────────────────────────────────
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const entities = [];
function makeEntity(o) {
  return Object.assign({ x: o.tx * 16, y: o.ty * 16, moving: false, t: 0, step: 0, fx: o.tx, fy: o.ty, nx: o.tx, ny: o.ty, home: [o.tx, o.ty], timer: 1 + Math.random() * 3, talked: 0 }, o);
}
const player = makeEntity({ id: 'you', tx: 22, ty: 22, dir: 'down', frames: null, turnT: 0, bump: 0 });

function occupied(x, y, self) {
  return entities.some(e => e !== self && ((e.tx === x && e.ty === y) || (e.moving && e.nx === x && e.ny === y)));
}
function canStand(x, y, self) {
  if (x < 0 || y < 0 || x >= MW || y >= MH) return false;
  if (self.water) return (T(x, y) === '~' || T(x, y) === 'd') && !occupied(x, y, self);
  return !blocked[idx(x, y)] && !occupied(x, y, self);
}
function startMove(e, dir) {
  e.dir = dir;
  const [dx, dy] = DIRS[dir], nx = e.tx + dx, ny = e.ty + dy;
  if (!canStand(nx, ny, e)) return false;
  e.moving = true; e.t = 0; e.fx = e.tx; e.fy = e.ty; e.nx = nx; e.ny = ny; e.step++;
  return true;
}
function advance(e, dt, dur) {
  e.t += dt / dur;
  if (e.t >= 1) { e.t = 1; e.moving = false; e.tx = e.nx; e.ty = e.ny; }
  e.x = Math.round((e.fx + (e.nx - e.fx) * e.t) * 16);
  e.y = Math.round((e.fy + (e.ny - e.fy) * e.t) * 16);
}

// ─── Input ────────────────────────────────────────────────────────────────
const held = new Set();
let runHeld = false;
const KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
const order = [];
function press(d) { if (!held.has(d)) { held.add(d); order.push(d); } }
function release(d) { held.delete(d); const i = order.lastIndexOf(d); if (i >= 0) order.splice(i, 1); }
const heldDir = () => order.length ? order[order.length - 1] : null;
addEventListener('keydown', e => {
  if (KEYMAP[e.key]) { press(KEYMAP[e.key]); e.preventDefault(); }
  else if (e.key === 'Shift' || e.key === 'x' || e.key === 'X') runHeld = true;
  else if (e.key === 'z' || e.key === 'Z' || e.key === ' ' || e.key === 'Enter') { if (!e.repeat) actionA(); e.preventDefault(); }
});
addEventListener('keyup', e => {
  if (KEYMAP[e.key]) release(KEYMAP[e.key]);
  else if (e.key === 'Shift' || e.key === 'x' || e.key === 'X') runHeld = false;
});
addEventListener('blur', () => { held.clear(); order.length = 0; runHeld = false; });

// ─── Dialogue ─────────────────────────────────────────────────────────────
const dlg = document.getElementById('dlg'), who = document.getElementById('who'), txt = document.getElementById('txt'), more = document.getElementById('more');
const COLS = 34, LINES = 3;
let pages = [], pageI = 0, shown = 0, onClose = null;
function wrap(text) {
  const out = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const w of para.split(' ')) {
      if (line && (line + ' ' + w).length > COLS) { out.push(line); line = w; } else line = line ? line + ' ' + w : w;
    }
    out.push(line);
  }
  const pg = [];
  for (let i = 0; i < out.length; i += LINES) pg.push(out.slice(i, i + LINES).join('\n'));
  return pg;
}
function say(name, list, done) {
  pages = list.flatMap(wrap); pageI = 0; shown = 0; onClose = done || null;
  who.textContent = name || ''; dlg.hidden = false; more.hidden = true; txt.textContent = '';
}
const talking = () => !dlg.hidden;
function actionA() {
  if (MAPVIEW) return;
  if (talking()) {
    const p = pages[pageI];
    if (shown < p.length) { shown = p.length; return; }
    pageI++; shown = 0;
    if (pageI >= pages.length) { dlg.hidden = true; const f = onClose; onClose = null; f && f(); }
    return;
  }
  if (player.moving) return;
  const [dx, dy] = DIRS[player.dir], fx = player.tx + dx, fy = player.ty + dy;
  const npc = entities.find(e => e !== player && e.tx === fx && e.ty === fy);
  if (npc) {
    if (npc.goose) return say('', ['Ha-ha-ha! The goose is not impressed.']);
    npc.dir = { up: 'down', down: 'up', left: 'right', right: 'left' }[player.dir];
    npc.busy = true;
    const conv = npc.talk[npc.talked % npc.talk.length]; npc.talked++;
    return say(npc.name, conv, () => { npc.busy = false; npc.timer = 2; });
  }
  const ch = T(fx, fy), o = owner[idx(fx, fy)] || null;
  if (o && SIZES[o.ch] && 'KLM'.includes(o.ch)) {
    const house = HOUSES[o.tx + ',' + o.ty];
    if (fx === o.tx + 2 && fy === o.ty + 2 && house) return say('', [house.door]);
    return say('', [LOOK.wall]);
  }
  if (o && o.ch === 'Q' && fx === o.tx + 2 && fy === o.ty + 3) return say('', ['The door is open a crack. Inside, candles flicker in front of the iconostasis, and it smells of wax and lime blossom.']);
  if (ch === 'i') return say('', [SIGNS[fx + ',' + fy] || '...']);
  const key = o ? o.ch : (ch === 'd' ? '~' : ch);
  if (LOOK[key]) say('', [LOOK[key]]);
}

// ─── Ambient life ─────────────────────────────────────────────────────────
const butterflies = [];
const cloudShadows = [];
function makeCloudShadow(seed) {
  const [c, x] = mk(120, 60);
  x.fillStyle = 'rgba(24,30,64,0.10)';
  for (let Y = 0; Y < 60; Y++) for (let X = 0; X < 120; X++) {
    let inside = false;
    for (const [cx, cy, r] of [[40, 32, 26], [68, 26, 30], [92, 36, 20], [56, 40, 22]]) {
      if (Math.hypot(X - cx, (Y - cy) * 1.6) + (hash(X >> 2, Y >> 2, seed) - .5) * 6 < r) inside = true;
    }
    if (inside) x.fillRect(X, Y, 1, 1);
  }
  return c;
}

// ─── Rendering ────────────────────────────────────────────────────────────
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
let ground, people = {};
let camX = 0, camY = 0, time = 0;

function drawEntity(e) {
  const sx = e.x - camX, sy = e.y - camY;
  if (e.goose) {
    const set = (e.dir === 'right') ? SPR.gooseR : SPR.goose;
    ctx.drawImage(set[Math.floor(time * 2 + e.home[0]) % 2], sx + 2, sy + 3 + (Math.floor(time * 2 + e.home[1]) % 2));
    return;
  }
  ctx.fillStyle = 'rgba(30,48,26,.28)';
  ctx.fillRect(sx + 3, sy + 13, 10, 2); ctx.fillRect(sx + 4, sy + 12, 8, 4);
  const frames = e.frames[e.dir];
  let f = 0;
  if (e.moving && e.t < .5) f = (e.step % 2) + 1;
  if (e.bump > 0) f = Math.floor(e.bump * 8) % 2 + 1;
  ctx.drawImage(frames[f], sx, sy - 4 - (f ? 1 : 0) + 1 * (f ? 1 : 0));
  // standing in tall grass or wheat: the stalks hide your feet
  const tx = Math.round(e.x / 16), ty = Math.round(e.y / 16), ch = T(tx, ty);
  if (ch === '"' || ch === 'w') {
    const src = ch === '"' ? ground.tall : ground.wheat;
    ctx.drawImage(src, 0, 9, 16, 7, tx * 16 - camX, ty * 16 + 9 - camY, 16, 7);
  }
}

function drawObject(o) {
  const sx = o.x - camX, sy = o.y - camY;
  if (sx > cv.width + 16 || sy > cv.height + 16 || sx + 90 < 0 || sy + 120 < 0) return;
  if (o.anim === 'sun') ctx.drawImage(SPR.sun[Math.sin(time * 1.3 + o.phase) > .3 ? 1 : 0], sx, sy);
  else if (o.anim === 'stork') ctx.drawImage(SPR.stork[(time % 7) < .6 && Math.floor(time * 8) % 2 ? 1 : 0], sx, sy);
  else ctx.drawImage(o.img, sx, sy);
  if (o.bees) {
    for (let i = 0; i < 2; i++) {
      const a = time * (2.2 + i) + i * 3;
      const bx = Math.round(sx + 8 + Math.cos(a) * (6 + i * 2)), by = Math.round(sy + 6 + Math.sin(a * 1.7) * 4);
      ctx.fillStyle = C.yel; ctx.fillRect(bx, by, 1, 1); ctx.fillStyle = C.out; ctx.fillRect(bx + 1, by, 1, 1);
    }
  }
}

function render() {
  const vw = cv.width, vh = cv.height;
  ctx.fillStyle = C.g4; ctx.fillRect(0, 0, vw, vh);
  ctx.drawImage(ground.canvas, camX, camY, vw, vh, 0, 0, vw, vh);
  // ripples on the river
  const t0x = Math.floor(camX / 16), t0y = Math.floor(camY / 16);
  for (let ty = t0y; ty <= t0y + vh / 16 + 1; ty++) for (let tx = t0x; tx <= t0x + vw / 16 + 1; tx++) {
    const ch = T(tx, ty);
    if (ch !== '~' && ch !== 'd') continue;
    for (let k = 0; k < 2; k++) {
      if (hash(tx, ty, 100 + k) > .7) continue;
      const ph = (time * .6 + hash(tx, ty, 110 + k)) % 1;
      const rx = tx * 16 + 3 + Math.floor(hash(tx, ty, 120 + k) * 8) + Math.floor(ph * 3), ry = ty * 16 + 3 + Math.floor(hash(tx, ty, 130 + k) * 10);
      const len = ph < .5 ? 3 : 2;
      ctx.fillStyle = ph < .75 ? C.w0 : C.w1;
      ctx.fillRect(rx - camX, ry - camY, len, 1);
    }
  }
  // geese ride on the water under everything else
  for (const e of entities) if (e.goose) drawEntity(e);
  const list = objects.map(o => [o.base, 0, o]);
  for (const e of entities) if (!e.goose) list.push([e.y + 16, 1, e]);
  list.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  for (const [, kind, it] of list) kind ? drawEntity(it) : drawObject(it);
  // butterflies
  for (const b of butterflies) {
    const sx = Math.round(b.x - camX), sy = Math.round(b.y - camY), open = Math.floor(time * 9 + b.ph) % 2;
    ctx.fillStyle = b.col;
    if (open) { ctx.fillRect(sx - 1, sy, 1, 1); ctx.fillRect(sx + 1, sy, 1, 1); ctx.fillRect(sx - 1, sy - 1, 1, 1); ctx.fillRect(sx + 1, sy - 1, 1, 1); }
    else { ctx.fillRect(sx, sy - 1, 1, 1); }
    ctx.fillStyle = C.out; ctx.fillRect(sx, sy, 1, 1);
  }
  for (const c of cloudShadows) ctx.drawImage(c.img, Math.round(c.x - camX), Math.round(c.y - camY));
}

// ─── Update ───────────────────────────────────────────────────────────────
function update(dt) {
  time += dt;
  if (talking()) {
    const p = pages[pageI];
    if (shown < p.length) {
      shown = Math.min(p.length, shown + dt * 45);
      txt.textContent = p.slice(0, Math.floor(shown));
    }
    more.hidden = shown < p.length;
  } else if (!MAPVIEW) {
    const d = heldDir();
    const dur = runHeld ? .12 : .23;
    if (player.bump > 0) player.bump -= dt;
    if (!player.moving) {
      if (d) {
        if (d !== player.dir && !player.wasMoving) { player.dir = d; player.turnT = .09; }
        else if (player.turnT <= 0 && player.bump <= 0) {
          if (!startMove(player, d)) player.bump = .25;
        }
      }
      player.turnT -= dt;
      player.wasMoving = false;
    }
    if (player.moving) {
      advance(player, dt, dur);
      if (!player.moving) {
        player.wasMoving = true;
        const nd = heldDir();
        if (nd && startMove(player, nd)) player.wasMoving = true;
      }
    }
  }
  for (const e of entities) {
    if (e === player) continue;
    if (e.moving) { advance(e, dt, e.goose ? .6 : .32); continue; }
    if (e.busy || !e.wander) continue;
    e.timer -= dt;
    if (e.timer <= 0) {
      e.timer = 1.5 + Math.random() * 3;
      const dirs = Object.keys(DIRS), d = dirs[Math.floor(Math.random() * 4)], [dx, dy] = DIRS[d];
      const nx = e.tx + dx, ny = e.ty + dy;
      if (Math.abs(nx - e.home[0]) <= e.wander && Math.abs(ny - e.home[1]) <= e.wander) startMove(e, d); else e.dir = d;
    }
  }
  for (const b of butterflies) {
    b.a += dt * b.sp;
    b.x = b.cx + Math.cos(b.a) * b.r + Math.sin(b.a * 2.3) * 4;
    b.y = b.cy + Math.sin(b.a * 1.4) * b.r * .6 + Math.sin(time * 9 + b.ph) * 1.2;
  }
  for (const c of cloudShadows) {
    c.x += dt * 7; c.y += dt * 2.2;
    if (c.x > MW * 16 + 20) { c.x = -140; c.y = Math.random() * MH * 16 - 40; }
    if (c.y > MH * 16 + 20) c.y = -80;
  }
  if (!MAPVIEW) {
    camX = Math.max(0, Math.min(MW * 16 - SW, player.x + 8 - SW / 2));
    camY = Math.max(0, Math.min(MH * 16 - SH, player.y + 8 - SH / 2));
  }
}

// ─── Layout ───────────────────────────────────────────────────────────────
const stage = document.getElementById('stage');
const touch = matchMedia('(pointer: coarse)').matches;
if (touch) document.body.classList.add('touch');
function layout() {
  const w = cv.width, h = cv.height;
  const availW = innerWidth - 32, availH = innerHeight - (touch ? 230 : 70);
  let s = Math.min(availW / w, availH / h);
  if (s >= 2) s = Math.floor(s);
  s = Math.max(.5, s);
  stage.style.width = w * s + 'px'; stage.style.height = h * s + 'px';
  stage.style.setProperty('--s', s);
}
addEventListener('resize', layout);

// touch pad
document.querySelectorAll('.dpad button').forEach(b => {
  const d = b.dataset.d;
  b.addEventListener('pointerdown', e => { e.preventDefault(); b.setPointerCapture(e.pointerId); press(d); b.classList.add('on'); });
  const up = () => { release(d); b.classList.remove('on'); };
  b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('lostpointercapture', up);
});
const btnA = document.getElementById('btnA'), btnB = document.getElementById('btnB');
btnA.addEventListener('pointerdown', e => { e.preventDefault(); actionA(); });
btnB.addEventListener('pointerdown', e => { e.preventDefault(); runHeld = true; btnB.classList.add('on'); });
['pointerup', 'pointercancel', 'pointerleave'].forEach(t => btnB.addEventListener(t, () => { runHeld = false; btnB.classList.remove('on'); }));
stage.addEventListener('pointerdown', () => { if (talking()) actionA(); });

