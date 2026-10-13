// ─── Boot ─────────────────────────────────────────────────────────────────
function beginGame() {
  if (started) return;
  started = true; titleEl.hidden = true; unlockAudio();
  const id = MAPS[S.map] ? S.map : 'vyshneve';
  enterArea(id, S.tx, S.ty, S.dir);
  if (!canStand(player.tx, player.ty, player)) enterArea('vyshneve', 22, 22, 'down');
  renderHud(); dressPlayer();
  const hello = () => {
    if (!S.f.intro) { S.f.intro = 1; say('', INTRO()); saveSoon(); }
    else if (dueList().length) say('', [`Welcome back, ${myName()}. ${caughtCount()} words in your словник, and ${dueList().length} of them ready to practise.`]);
  };
  if (!S.name) askName(hello); else hello();
}

function start(data) {
  buildSprites();
  player.frames = buildPerson({});
  for (let i = 0; i < 3; i++) cloudShadows.push({ img: makeCloudShadow(i), x: i * 260 - 100, y: i * 170 - 40 });
  const mapArea = location.hash.startsWith('#map') ? (location.hash.slice(5) || 'vyshneve') : null;
  enterArea(mapArea && MAPS[mapArea] ? mapArea : 'vyshneve', 22, 22, 'down');
  document.getElementById('areaName').hidden = true;
  if (MAPVIEW) { titleEl.hidden = true; cv.width = MW * 16; cv.height = MH * 16; camX = 0; camY = 0; }
  layout();
  let last = performance.now();
  const loop = now => {
    const dt = Math.max(0, Math.min(.05, (now - last) / 1000)); last = now;
    update(dt); render();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  if (MAPVIEW) return;
  if (data && data.S) { S = data.S; titleReady = true; beginGame(); return; }
  loadSave().then(() => {
    const c = caughtCount();
    document.getElementById('titleSave').textContent = S.f.intro ? `Your словник: ${c} of ${N} words caught.` : 'A new словник, with all its pages empty.';
    document.getElementById('titleGo').hidden = false;
    document.getElementById('titleGo').textContent = touch ? 'TAP TO BEGIN' : 'PRESS Z TO BEGIN';
    titleReady = true;
  });
}
const hot = window.claude && window.claude.hot;
if (hot && typeof hot.snapshot === 'function') hot.snapshot(() => (started ? { S: Object.assign(S, { map: area, tx: player.tx, ty: player.ty, dir: player.dir }) } : {}));
if (hot && typeof hot.ready === 'function') hot.ready(start); else start((hot && hot.data) || {});
// A handle for automated checks: open the page with #debug.
if (location.hash === '#debug') window.__vy = { get S() { return S; }, player, enterArea, openQuiz, openDex, say, beginGame, grade, clipBuffer, playWord, unlockAudio,
  get soundTrouble() { return soundTrouble; }, questText, tick: (n, dt) => { for (let i = 0; i < n; i++) { update(dt || 1 / 60); render(); } },
  get warp() { return warp; }, get talking() { return talking(); }, get overlay() { return overlayOpen(); }, get music() { return music && music.id; },
  get actx() { return actx; }, canStand, WORDS, get area() { return area; }, get RUN() { return RUN; }, AREAS, NPCS, MAPS, WORLD, ZONES, DOORS, ERRANDS, VM, WALKABLE, get Q() { return Q; }, get dlgText() { return txt.textContent; }, get dlgLang() { return dlgLang; } };
