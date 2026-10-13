// ─── Shooting the rapids: a mini-game ─────────────────────────────────────
// Kindrat sits in the bow and shouts which way to steer, in Ukrainian only. The rocks hide under
// the foam until the last moment, so the words are all you have. Three lanes: left, middle, right.
const RAPIDS = ['Кодацький', 'Сурський', 'Лоханський', 'Дзвонецький', 'Ненаситець', 'Вовнизький', 'Будилівський', 'Лишній', 'Вільний'];
const CALLS = [
  ['Ліворуч!', 'Вліво!', 'Бери ліворуч!', 'Лівіше!', 'Не праворуч — ліворуч!', 'Ліворуч, швидко!'],
  ['Прямо!', 'Посередині!', 'Тримай прямо!', 'Не повертай!', 'Ні ліворуч, ні праворуч!', 'Рівно!'],
  ['Праворуч!', 'Вправо!', 'Бери праворуч!', 'Правіше!', 'Не ліворуч — праворуч!', 'Праворуч, швидко!'],
];
const LANE_X = [64, 120, 176], BOAT_Y = 136;
let RUN = null;
function shootRapids(done) {
  RUN = { done, k: 0, hearts: 3, lane: 1, boatX: LANE_X[1], phase: 'ready', t: 0, scroll: 0, rows: [], calls: 0, splash: 0, msg: '' };
  startRapid();
  held.clear(); order.length = 0;
  hud.hidden = true; document.getElementById('areaName').hidden = true; areaLabelT = 0;
  playMusic('rapidsRun');
}
function startRapid() {
  const R = RUN;
  R.phase = 'ready'; R.t = 0; R.rows = []; R.calls = 0;
  R.need = RUN.k === 4 ? 6 : 3 + (RUN.k > 5 ? 1 : 0);   // Ненаситець is longest
  R.speed = 1 + RUN.k * .09 + (RUN.k === 4 ? .15 : 0);
  R.msg = RUN.k === 0 ? 'Готовий? Греби!' : RUN.k === 8 ? 'Останній! Греби!' : 'Греби!';
}
function rapidsKey(e) {
  const R = RUN, k = e.key, d = KEYMAP[k];
  if (R.phase === 'end') { if (isA(k)) finishRapids(); return true; }
  if (isB(k)) { R.phase = 'end'; R.ok = false; R.msg = 'Пливемо до берега...'; return true; }
  if (R.phase === 'ready') { if (isA(k)) { R.phase = 'run'; R.t = 0; R.msg = ''; sfx('tick'); } return true; }
  if (d === 'left') R.lane = Math.max(0, R.lane - 1);
  else if (d === 'right') R.lane = Math.min(2, R.lane + 1);
  return true;
}
function finishRapids() {
  const R = RUN; RUN = null;
  renderHud(); playMusic(areaMusic());
  R.done({ ok: !!R.ok, passed: R.k });
}
function updateRapids(dt) {
  const R = RUN;
  R.t += dt;
  R.scroll += dt * (R.phase === 'run' ? 70 * R.speed : 18);
  R.boatX += (LANE_X[R.lane] - R.boatX) * Math.min(1, dt * 14);
  if (R.splash > 0) R.splash -= dt;
  if (R.phase !== 'run') return;
  // a new row of rocks rolls in, and Kindrat shouts which lane is clear
  const gap = 2.3 / R.speed;
  if (R.calls < R.need && (!R.rows.length || R.rows[R.rows.length - 1].y > 22 + 60 / R.speed) && R.t > .4) {
    const safe = rnd(3);
    R.rows.push({ y: -18, safe, call: CALLS[safe][rnd(Math.min(CALLS[safe].length, 2 + R.k))], seed: rnd(1000) });
    R.calls++; R.t = 0;
  }
  for (const row of R.rows) {
    row.y += dt * (BOAT_Y + 18) / gap;
    if (!row.done && row.y >= BOAT_Y - 4) {
      row.done = true;
      if (R.lane !== row.safe) { R.hearts--; R.splash = .5; sfx('no'); } else sfx('tick');
      if (R.hearts <= 0) { R.phase = 'end'; R.ok = false; R.msg = 'Перевернулися! We capsized!'; return; }
    }
  }
  R.rows = R.rows.filter(r => r.y < SH + 20);
  if (R.calls >= R.need && !R.rows.length) {
    R.k++; sfx('ok');
    if (R.k >= RAPIDS.length) { R.phase = 'end'; R.ok = true; R.msg = 'Вільний! Ми вільні!'; sfx('badge'); return; }
    startRapid();
  }
}
function drawRapids() {
  const R = RUN, vw = cv.width, vh = cv.height;
  // the river, its banks, and the white water streaming past
  ctx.fillStyle = C.w2; ctx.fillRect(0, 0, vw, vh);
  for (let i = 0; i < 40; i++) {
    const x = 28 + (hash(i, 1, 400) * (vw - 56)) | 0, y = ((hash(i, 2, 401) * (vh + 40) + R.scroll * (1 + hash(i, 3, 402))) % (vh + 40)) - 20 | 0;
    ctx.fillStyle = i % 3 ? C.w1 : C.w0; ctx.fillRect(x, y, 2 + (i % 4) * 2, 1);
    if (R.phase === 'run' && i % 2) { ctx.fillStyle = '#fbf8f0'; ctx.fillRect(x + 3, y + 3, 3, 1); }
  }
  for (const [x0, dir] of [[0, 1], [vw, -1]]) for (let y = -16; y < vh + 16; y += 4) {
    const w = 22 + Math.round(Math.sin((y + R.scroll) / 23) * 4 + hash(0, (y + R.scroll) / 4 | 0, 403) * 3);
    ctx.fillStyle = '#e4cf98'; ctx.fillRect(dir > 0 ? 0 : vw - w, (y + R.scroll % 4) | 0, w, 4);
    ctx.fillStyle = C.g2; ctx.fillRect(dir > 0 ? 0 : vw - w + 8, (y + R.scroll % 4) | 0, w - 8, 4);
  }
  // rocks: under the foam until they're almost on you
  for (const row of R.rows) {
    const reveal = row.y > BOAT_Y - 52;
    for (let l = 0; l < 3; l++) {
      if (l === row.safe) continue;
      const x = LANE_X[l] - 16, y = row.y | 0;
      if (reveal) { ctx.drawImage(SPR.rock[(row.seed + l) % 3], x, y - 4); ctx.drawImage(SPR.rock[(row.seed + l + 1) % 3], x + 16, y - 2); }
      ctx.fillStyle = reveal ? 'rgba(251,248,240,.45)' : '#fbf8f0';
      for (let k = 0; k < 7; k++) ctx.fillRect(x + (hash(row.seed, k + l * 9, 404) * 28 | 0), y + (hash(row.seed, k + l * 9, 405) * 12 | 0), 5, 2);
    }
  }
  // the chaika, seen from above, with Kindrat in the bow
  const bx = Math.round(R.boatX), by = BOAT_Y;
  ctx.fillStyle = C.out; ctx.fillRect(bx - 8, by - 12, 16, 30); ctx.fillRect(bx - 6, by - 16, 12, 4); ctx.fillRect(bx - 3, by - 19, 6, 3);
  ctx.fillStyle = '#c9b070'; ctx.fillRect(bx - 7, by - 11, 14, 28); ctx.fillRect(bx - 5, by - 15, 10, 4); ctx.fillRect(bx - 2, by - 18, 4, 3);
  ctx.fillStyle = C.wd1; ctx.fillRect(bx - 5, by - 9, 10, 24);
  ctx.fillStyle = C.wd3; for (let y = by - 6; y < by + 14; y += 5) ctx.fillRect(bx - 5, y, 10, 1);
  ctx.fillStyle = '#3f6f95'; ctx.fillRect(bx - 2, by - 11, 4, 4); ctx.fillStyle = '#8a8a8a'; ctx.fillRect(bx - 2, by - 12, 4, 2);   // Kindrat
  ctx.fillStyle = '#fbf8f0'; ctx.fillRect(bx - 2, by + 8, 4, 4); ctx.fillStyle = '#5a3a22'; ctx.fillRect(bx - 2, by + 7, 4, 2);    // you
  const oar = Math.sin(time * 9) * 3 | 0;
  ctx.fillStyle = C.wd2; ctx.fillRect(bx - 16, by + 2 + oar, 9, 2); ctx.fillRect(bx + 7, by + 2 - oar, 9, 2);
  if (R.splash > 0) { ctx.fillStyle = 'rgba(251,248,240,.8)'; ctx.fillRect(bx - 14, by - 20, 28, 10); }
  // the shouting, the name of the rapid, and the boat's planks left
  const call = R.rows.filter(r => !r.done).map(r => r.call)[0];
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(43,34,48,.82)'; ctx.fillRect(0, 0, vw, 16);
  ctx.font = 'bold 9px monospace'; ctx.fillStyle = '#f3e6b0';
  ctx.fillText(`ПОРІГ ${Math.min(R.k + 1, 9)}/9 · ${RAPIDS[Math.min(R.k, 8)].toUpperCase()}`, vw / 2 - 20, 8);
  ctx.textAlign = 'right'; ctx.fillStyle = '#e05a4f'; ctx.fillText('♥'.repeat(Math.max(0, R.hearts)) + '♡'.repeat(3 - Math.max(0, R.hearts)), vw - 4, 8);
  ctx.textAlign = 'center';
  const big = R.msg || call;
  if (big) {
    ctx.font = 'bold 15px sans-serif';
    const w = ctx.measureText(big).width + 16;
    ctx.fillStyle = C.out; ctx.fillRect(vw / 2 - w / 2 - 1, 23, w + 2, 24); ctx.fillStyle = '#fbf8f0'; ctx.fillRect(vw / 2 - w / 2, 24, w, 22);
    ctx.fillStyle = C.out; ctx.fillText(big, vw / 2, 36);
  }
  ctx.fillStyle = 'rgba(43,34,48,.82)'; ctx.fillRect(0, vh - 12, vw, 12);
  ctx.font = 'bold 8px monospace'; ctx.fillStyle = '#fbf8f0';
  const hint = R.phase === 'ready' ? 'Z: ГРЕБИ (ROW)   X: TO THE BANK' : R.phase === 'end' ? 'Z: CONTINUE' : '← →: STEER   X: TO THE BANK';
  ctx.fillText(hint, vw / 2, vh - 6);
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
}
