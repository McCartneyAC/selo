// ─── Words ────────────────────────────────────────────────────────────────
// From the "1000 Ukrainian Words" Anki deck (tools/words.py). Each entry:
// [ua, ua with stress marks, en, short en, spellable form or '', zone, [[example ua, example en], ...]]
const WORDS = /*WORDS*/null;
const CLIPS = /*CLIPS*/null;          // each word's pronunciation: a small mp3, base64
const TUNES = /*MUSIC*/null;          // folk tunes as note lists: see tools/music.py
const N = WORDS.length;
// 25 places, 40 words each, grouped by theme (tools/themes.py): the nine home villages around Vyshneve,
// then the journey across Ukraine
const ZONE_AREA = ['vyshneve', 'khutir', 'steppe', 'kalynivka', 'fair', 'lake', 'ferry', 'marsh', 'forest',
  'khortytsia', 'rapids', 'podil', 'lavra', 'polissia', 'bir', 'verkhovyna', 'polonyna', 'chornohora', 'synevyr',
  'kamianets', 'dniester', 'odesa', 'vylkove', 'liman', 'lviv'];
const NZ = ZONE_AREA.length;
const ZONES = ZONE_AREA.map((_, z) => WORDS.map((w, i) => w[5] === z ? i : -1).filter(i => i >= 0));
const BADGES = [
  { name: 'Cherry pysanka', keeper: 'Baba Hanna', col: ['#cc3b3d', '#fbf8f0'] },
  { name: 'Honey pysanka', keeper: 'Hryhoriy the beekeeper', col: ['#f0b440', '#5a3a1a'] },
  { name: 'Wheat pysanka', keeper: 'Danylo the miller', col: ['#f3c84f', '#3f6fc4'] },
  { name: 'Kalyna pysanka', keeper: 'Lida the teacher', col: ['#e8794a', '#4c9c66'] },
  { name: 'Fair pysanka', keeper: 'Vakula the blacksmith', col: ['#d8473f', '#2b2230'] },
  { name: 'Water pysanka', keeper: 'Berehynia', col: ['#6fb2e0', '#fbf8f0'] },
  { name: 'Kozak pysanka', keeper: 'Kozak Mamai', col: ['#b8323a', '#f3c84f'] },
  { name: 'Marsh pysanka', keeper: 'Yaryna the herbalist', col: ['#6fae9a', '#c9a8e0'] },
  { name: 'Fern pysanka', keeper: 'Mavka', col: ['#4c9c66', '#f3e6b0'] },
  { name: 'Sich pysanka', keeper: 'the koshovyi otaman', col: ['#c8383a', '#2b2230'] },
  { name: 'Rapids pysanka', keeper: 'the lotsman', col: ['#7aa8c8', '#f4f1e6'] },
  { name: 'Kyiv pysanka', keeper: 'the Podil cabbie', col: ['#e9b949', '#4f86c6'] },
  { name: 'Dome pysanka', keeper: 'the chronicler monk', col: ['#f3c84f', '#fbf8f0'] },
  { name: 'Linen pysanka', keeper: 'the Polissia weaver', col: ['#d6c7a8', '#c8383a'] },
  { name: 'Pine pysanka', keeper: 'the bortnyk', col: ['#6f9a5a', '#c9a06a'] },
  { name: 'Trembita pysanka', keeper: 'the trembita player', col: ['#3a6a8a', '#f0b440'] },
  { name: 'Polonyna pysanka', keeper: 'the vivchar', col: ['#9cc46a', '#f4f1e6'] },
  { name: 'Mountain pysanka', keeper: 'the molfar', col: ['#8a8fb0', '#e8eaf4'] },
  { name: 'Synevyr pysanka', keeper: 'Syn', col: ['#4f9aa8', '#cfe8ea'] },
  { name: 'Castle pysanka', keeper: 'the castle keeper', col: ['#c9a46a', '#d8473f'] },
  { name: 'Canyon pysanka', keeper: 'the raftsman', col: ['#7cbf8a', '#e8d8b0'] },
  { name: 'Sea pysanka', keeper: 'the Odesa fisherwoman', col: ['#6fb2e0', '#f6e7c4'] },
  { name: 'Delta pysanka', keeper: 'the Vylkove boatman', col: ['#8fc2b0', '#f3c84f'] },
  { name: 'Salt pysanka', keeper: 'the salt master', col: ['#eef0f2', '#d87a8a'] },
  { name: 'Coffee pysanka', keeper: 'the coffee-house owner', col: ['#8a5a35', '#f0dcc0'] },
];
const TRIAL_NEED = 30;
// minutes until a word comes back, by level reached: 1 catch … 5 mastered
const INTERVAL = [0, 2, 15, 120, 1440, 5760];
const nowMin = () => Math.floor(Date.now() / 60000);
const plainUa = s => s.replace(/́/g, '');
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const exHTML = s => esc(s).replace(/\{([^}]*)\}/g, '<b>$1</b>');
const rnd = n => Math.floor(Math.random() * n);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ─── Save ─────────────────────────────────────────────────────────────────
// Kept in this artifact's database under your private path (so it follows you
// between devices), and mirrored in this browser.
const SAVE_KEY = 'vyshneve-save-v2';   // version 2, the 25-place country, starts fresh
const freshSave = () => ({ v: 2, t: 0, map: 'vyshneve', tx: 22, ty: 22, dir: 'down', f: { grid9: 1 }, w: {}, items: {} });
let S = freshSave();
let store = null, saveTimer = null;
// S.w[id] = [level (0 seen, 1-5 caught), due minute, times seen, right, wrong]
const lvl = i => (S.w[i] ? S.w[i][0] : -1);
const caught = i => lvl(i) >= 1;
const caughtCount = () => Object.keys(S.w).filter(k => S.w[k][0] >= 1).length;
const masteredCount = () => Object.keys(S.w).filter(k => S.w[k][0] >= 5).length;
const dueList = () => { const n = nowMin(); return Object.keys(S.w).map(Number).filter(i => S.w[i][0] >= 1 && S.w[i][1] <= n).sort((a, b) => S.w[a][1] - S.w[b][1]); };
const zoneCaught = z => ZONES[z].filter(caught).length;
const badgeCount = () => ZONE_AREA.filter((_, z) => S.f['b' + z]).length;

// a playtest save lives in its own slot in this browser only, so the real one is never touched
let PLAYTEST = false;
const saveKey = () => PLAYTEST ? 'vyshneve-playtest' : SAVE_KEY;
function readLocal() { try { const j = localStorage.getItem(saveKey()); return j ? JSON.parse(j) : null; } catch { return null; } }
function writeLocal() { try { localStorage.setItem(saveKey(), JSON.stringify(S)); } catch { /* private window */ } }
function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 2000); }
function saveNow() {
  clearTimeout(saveTimer);
  if (!started) return;
  Object.assign(S, { t: Date.now(), map: area, tx: player.tx, ty: player.ty, dir: player.dir });
  writeLocal();
  if (store && !PLAYTEST) store.set({ v: 2, t: S.t, json: JSON.stringify(S) }).catch(() => { /* offline or read-only: the local copy stands */ });
}
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveNow(); });
async function loadSave() {
  let best = readLocal();
  const claude = window.claude;
  if (claude && typeof claude.use === 'function') {
    try {
      const timeout = new Promise(r => setTimeout(() => r(null), 6000));
      const [db, user] = await Promise.race([Promise.all([claude.use('db'), claude.use('user')]), timeout.then(() => [null, null])]);
      const uid = user ? await user.id() : null;
      if (db && uid) {
        store = db.doc('data/users/' + uid + '/save2');
        const snap = await Promise.race([store.get(), timeout]);
        if (snap && snap.exists) {
          const d = snap.data();
          const remote = d && typeof d.json === 'string' ? JSON.parse(d.json) : null;
          if (remote && (!best || (remote.t || 0) > (best.t || 0))) best = remote;
        }
      }
    } catch { store = null; }
  }
  if (best && best.v === 2) S = Object.assign(freshSave(), best);
}

// ─── Sound ────────────────────────────────────────────────────────────────
let actx = null, master = null, musicBus = null;
function unlockAudio() {
  if (!actx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { actx = new AC(); } catch { return; }
    master = actx.createGain(); master.connect(actx.destination);
    musicBus = actx.createGain(); musicBus.gain.value = S.f.music === 0 ? 0 : .55; musicBus.connect(master);
    if (pendingTune) { const t = pendingTune; pendingTune = null; playMusic(t); }
  }
  if (actx.state === 'suspended') actx.resume().catch(() => {});
}
const soundOn = () => S.f.mute !== 1;
let soundTrouble = '';
// each word is its own clip, decoded the first time it's needed
const clipCache = new Map();
function clipBuffer(i) {
  if (clipCache.has(i)) return clipCache.get(i);
  const b64 = CLIPS[i];
  if (!b64) return Promise.resolve(null);
  const bin = atob(b64), u = new Uint8Array(bin.length);
  for (let k = 0; k < bin.length; k++) u[k] = bin.charCodeAt(k);
  const p = new Promise(res => {
    try { actx.decodeAudioData(u.buffer, res, () => { soundTrouble = 'This browser could not decode the word recordings.'; res(null); }); }
    catch { soundTrouble = 'This browser could not decode the word recordings.'; res(null); }
  });
  clipCache.set(i, p);
  if (clipCache.size > 300) clipCache.delete(clipCache.keys().next().value);
  return p;
}
function preloadWord(i) { if (actx) clipBuffer(i); }
async function playWord(i) {
  if (!soundOn() || !CLIPS[i]) return;
  unlockAudio();
  if (!actx) { soundTrouble = 'This browser has no Web Audio.'; return; }
  const buf = await clipBuffer(i);
  if (!buf) {
    // last resort: let the browser's own audio element try
    try { await new Audio('data:audio/mpeg;base64,' + CLIPS[i]).play(); soundTrouble = ''; } catch { soundTrouble = soundTrouble || 'Sound is blocked here.'; }
    return;
  }
  ducking();
  const src = actx.createBufferSource(); src.buffer = buf; src.connect(master); src.start();
}
// the music steps back while a word is spoken
function ducking() {
  if (!musicBus || S.f.music === 0) return;
  const t = actx.currentTime;
  musicBus.gain.cancelScheduledValues(t); musicBus.gain.setValueAtTime(.15, t); musicBus.gain.linearRampToValueAtTime(.55, t + 1.6);
}
function sfx(kind) {
  if (!actx || !soundOn()) return;
  const notes = { tick: [[880, .03]], wild: [[523, .06], [659, .06], [784, .06], [1047, .12]], ok: [[659, .08], [784, .08], [1047, .18]],
    no: [[330, .12], [247, .22]], level: [[784, .07], [988, .07], [1175, .07], [1568, .22]], badge: [[523, .1], [659, .1], [784, .1], [1047, .1], [784, .1], [1047, .35]],
    door: [[196, .05], [147, .08]], item: [[784, .08], [988, .08], [1319, .2]], night: [[392, .2], [330, .2], [262, .2], [196, .5]] }[kind];
  if (!notes) return;
  let t = actx.currentTime + .01;
  for (const [f, d] of notes) {
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'square'; o.frequency.value = f;
    g.gain.setValueAtTime(.045, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + d + .02);
    t += d * .9;
  }
}

// ─── Music: folk tunes on a pretend Game Boy ──────────────────────────────
// A pulse-wave lead, a triangle bass and a little noise for drums.
const MUSIC = {
  village: { tune: 'village', drums: 1 }, steppe: { tune: 'meadow', drums: 1 }, kalynivka: { tune: 'kalynivka', drums: 1 },
  forest: { tune: 'forest', drums: 0, speed: .85 }, carol: { tune: 'forest', drums: 0, speed: .6, soft: 1 }, night: { tune: 'night', drums: 0 },
  prayer: { tune: 'prayer', drums: 0, soft: 1 },
  // the rest of the home region, each with its own tune now
  khutir: { tune: 'poltava', drums: 0, speed: .9, soft: 1 }, fair: { tune: 'koval', drums: 1 },
  lake: { tune: 'berehynia', drums: 0, soft: 1 }, ferry: { tune: 'pereyaslavko', drums: 0 }, marsh: { tune: 'forest', drums: 0, speed: .65, soft: 1 },
  quiz: { tune: 'steppe', drums: 1, speed: 1.35 }, rapidsRun: { tune: 'rapidsTune', drums: 1, speed: 1.3 },
  // further afield: a folk tune from each region (tools/abc.py; the melodies are traditional, the bass is ours)
  sich: { tune: 'sich', drums: 1 }, rapids: { tune: 'rapidsTune', drums: 1 },
  kyiv: { tune: 'kyivTune', drums: 1 }, lavra: { tune: 'prayer', drums: 0, soft: 1 },
  synevyr: { tune: 'synevyr', drums: 0, soft: 1 }, hutsul: { tune: 'arkan', drums: 1 }, kolomyika: { tune: 'kolomyika', drums: 1 },
  polonyna: { tune: 'chabany', drums: 1 }, chornohora: { tune: 'opryshky', drums: 0, soft: 1 },
  kamianets: { tune: 'podillia', drums: 1 }, dniester: { tune: 'monastyr', drums: 0, soft: 1 }, liman: { tune: 'chumak', drums: 0, soft: 1 },
  odesa: { tune: 'kateryna', drums: 1 }, vylkove: { tune: 'bilekrylo', drums: 0, soft: 1 }, lviv: { tune: 'hramofon', drums: 1 },
  polissia: { tune: 'polissiaTune', drums: 0, soft: 1 }, bir: { tune: 'bir', drums: 0, soft: 1 }, caves: { tune: 'prayer', drums: 0, speed: .7, soft: 1 },
};
let music = null, pendingTune = null, pulseWave = null, noiseBuf = null;
const tunePos = {};   // beat each tune had reached when it last stopped
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function playMusic(id) {
  if (!actx) { pendingTune = id; return; }
  if (music && music.id === id) return;
  if (music) {
    const old = music; old.gain.gain.setTargetAtTime(0, actx.currentTime, .15); setTimeout(() => old.gain.disconnect(), 900); clearInterval(old.timer);
    tunePos[old.id] = ((actx.currentTime - old.loopStart) / old.spb) % old.len;
  }
  music = null;
  const cfg = MUSIC[id], tune = cfg && TUNES[cfg.tune];
  if (!tune) return;
  if (!pulseWave) {
    const n = 32, re = new Float32Array(n), im = new Float32Array(n);
    for (let k = 1; k < n; k++) im[k] = 2 / (k * Math.PI) * Math.sin(k * Math.PI * .25);   // a 25% pulse
    pulseWave = actx.createPeriodicWave(re, im);
    noiseBuf = actx.createBuffer(1, actx.sampleRate * .2, actx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const gain = actx.createGain(); gain.gain.value = 0; gain.connect(musicBus); gain.gain.setTargetAtTime(cfg.soft ? .6 : 1, actx.currentTime, .3);
  const spb = 60 / (tune.bpm * (cfg.speed || 1));
  const events = [...tune.mel.map(n => [n[0], n[1], n[2], 0]), ...tune.bass.map(n => [n[0], n[1], n[2], 1])];
  if (cfg.drums) for (let b = 0; b < tune.len; b++) events.push([b, .1, 0, b % 2 ? 3 : 2]), events.push([b + .5, .05, 0, 4]);
  events.sort((a, b) => a[0] - b[0]);
  // pick up where this tune left off, so short quizzes don't replay the same opening bars
  const pos = Math.max(0, tunePos[id] || 0), k = events.findIndex(e => e[0] >= pos);
  const m = { id, gain, events, k: k < 0 ? 0 : k, loopStart: actx.currentTime + .1 - (k < 0 ? 0 : pos) * spb, spb, len: tune.len };
  m.timer = setInterval(() => schedule(m), 60);
  music = m; schedule(m);
}
function schedule(m) {
  const horizon = actx.currentTime + .35;
  for (;;) {
    if (m.k >= m.events.length) { m.k = 0; m.loopStart += m.len * m.spb; }
    const [b, d, p, ch] = m.events[m.k], t = m.loopStart + b * m.spb;
    if (t > horizon) break;
    m.k++;
    if (t < actx.currentTime - .05) continue;
    const dur = Math.max(.05, d * m.spb * .92);
    if (ch <= 1) {
      const o = actx.createOscillator(), g = actx.createGain();
      if (ch === 0) o.setPeriodicWave(pulseWave); else o.type = 'triangle';
      o.frequency.value = mtof(ch === 1 ? Math.min(p, 52) - (p > 52 ? 12 : 0) : p);
      const v = ch === 0 ? .05 : .09;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .006);
      g.gain.setValueAtTime(v * .8, t + dur * .6); g.gain.linearRampToValueAtTime(0, t + dur);
      o.connect(g); g.connect(m.gain); o.start(t); o.stop(t + dur + .02);
    } else {
      const src = actx.createBufferSource(), g = actx.createGain(), f = actx.createBiquadFilter();
      src.buffer = noiseBuf; f.type = ch === 4 ? 'highpass' : 'bandpass'; f.frequency.value = ch === 2 ? 180 : ch === 3 ? 1800 : 7000;
      const v = ch === 2 ? .12 : ch === 3 ? .045 : .015, len = ch === 4 ? .03 : .08;
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + len);
      src.connect(f); f.connect(g); g.connect(m.gain); src.start(t); src.stop(t + len + .01);
    }
  }
}

// ─── Little pictures for the HUD ──────────────────────────────────────────
function makePysanka(col, dim) {
  const [c, x] = mk(7, 9);
  const rows = ['..ooo..', '.oaaao.', 'oabbbao', 'occccco', 'occccco', 'oabbbao', 'oaaaaao', '.oaaao.', '..ooo..'];
  rows.forEach((r, y) => [...r].forEach((k, X) => {
    if (k === '.') return;
    P(x, X, y, k === 'o' ? C.out : dim ? '#5a5466' : k === 'a' ? col[0] : k === 'b' ? col[1] : (X % 2 ? col[0] : col[1]));
  }));
  return c;
}
function makeBook() {
  const [c, x] = mk(8, 8);
  R(x, 0, 1, 8, 7, C.out); R(x, 1, 1, 6, 6, '#c8383a'); R(x, 1, 6, 6, 1, '#fbf8f0'); R(x, 3, 3, 2, 1, C.gold); R(x, 2, 2, 4, 1, '#e05a4f');
  return c;
}
const hud = document.getElementById('hud');
function renderHud() {
  if (!S.f.book) { hud.hidden = true; return; }
  hud.hidden = false;
  const due = dueList().length;
  hud.innerHTML = '';
  if (PLAYTEST) hud.appendChild(Object.assign(document.createElement('span'), { className: 'due', textContent: 'TEST' }));
  hud.appendChild(Object.assign(makeBook(), { className: 'px book' }));
  hud.appendChild(Object.assign(document.createElement('span'), { textContent: caughtCount() + '/' + N }));
  if (due) hud.appendChild(Object.assign(document.createElement('span'), { className: 'due', textContent: '↻' + due, title: due + ' words ready to practise' }));
  const b = badgeCount();
  if (b) {
    hud.appendChild(Object.assign(makePysanka(BADGES[0].col), { className: 'px' }));
    hud.appendChild(Object.assign(document.createElement('span'), { textContent: b + '/' + NZ }));
  }
}
hud.addEventListener('click', () => { unlockAudio(); if (!overlayOpen() && !talking()) openDex(); });
setInterval(() => { if (started) renderHud(); }, 30000);

// ─── Encounters ───────────────────────────────────────────────────────────
let stepsSince = 0;
function onGrassStep() {
  if (!S.f.book) {
    if (!S.f.warned && area === 'vyshneve') {
      S.f.warned = 1;
      say('Ostap (from the church)', [L('Hey! Don\'t go wading into the grass empty-handed. Come and see me by the church first.', 'Гей! Не лізь у траву з порожніми руками. Спершу зайди до мене біля церкви.')]);
      return true;
    }
    return false;
  }
  stepsSince++;
  if (stepsSince < 4 || Math.random() > (has('tooth') ? .16 : .11)) return false;
  stepsSince = 0;
  const pick = pickWild(AR.zone);
  if (pick == null) return false;
  sfx('wild');
  openQuiz({ mode: 'wild', ids: [pick] });
  return true;
}
function pickWild(zone) {
  const due = dueList();
  if (due.length && Math.random() < .4) return due[0];
  const pool = ZONES[zone], wild = pool.filter(i => !caught(i));
  if (wild.length) {
    const seen = wild.filter(i => S.w[i]);
    if (seen.length && Math.random() < .3) return seen[rnd(seen.length)];
    return wild[rnd(wild.length)];
  }
  const sorted = pool.slice().sort((a, b) => lvl(a) - lvl(b) || S.w[a][1] - S.w[b][1]);
  return sorted[rnd(Math.min(10, sorted.length))];
}

// ─── The quiz ─────────────────────────────────────────────────────────────
// mode: 'wild' (one word, catch it), 'lesson' (Ostap: practise due words),
// 'trial' (a keeper's test: pass to win a pysanka).
const bEl = document.getElementById('battle'), bInfo = document.getElementById('bInfo'), bMsg = document.getElementById('bMsg'),
  bOpts = document.getElementById('bOpts'), bHint = document.getElementById('bHint'), bProg = document.getElementById('bProg'),
  bSpirit = document.getElementById('bSpirit');
let Q = null;

function qType(i) {
  const L = lvl(i), sp = !!WORDS[i][4];
  if (L < 1) return 'ua2en';
  if (L === 1) return 'en2ua';
  if (L === 2) return 'ua2en';
  if (L === 3 || L === 4) return sp ? 'spell' : 'en2ua';
  return ['ua2en', 'en2ua', sp ? 'spell' : 'en2ua'][rnd(3)];
}
// Wrong answers that look like the right one: rank every word by edit distance
// from the target's Ukrainian form, then pick at random among the closest 5
// (15 suited kartochky.html's 8,000 words; 1,000 needs a tighter circle).
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  let prev = new Array(n + 1), cur = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j], cur[j - 1], prev[j - 1]);
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}
const nearCache = new Map();
function nearest(i) {
  if (nearCache.has(i)) return nearCache.get(i);
  const t = WORDS[i][0].toLowerCase(), en = WORDS[i][3].toLowerCase();
  const list = [];
  for (let j = 0; j < N; j++) if (j !== i && WORDS[j][3].toLowerCase() !== en && WORDS[j][0] !== WORDS[i][0]) list.push([levenshtein(t, WORDS[j][0].toLowerCase()), j]);
  list.sort((a, b) => a[0] - b[0]);
  const near = list.map(p => p[1]);
  nearCache.set(i, near);
  return near;
}
function distractors(i, n, key) {
  const out = [], seen = new Set([WORDS[i][key]]);
  const near = nearest(i), NEAR = 5;
  for (const j of [...shuffle(near.slice(0, NEAR)), ...near.slice(NEAR)]) {
    if (out.length >= n) break;
    if (seen.has(WORDS[j][key])) continue;
    seen.add(WORDS[j][key]); out.push(j);
  }
  while (out.length < n) { const j = rnd(N); if (j !== i && !seen.has(WORDS[j][key])) { seen.add(WORDS[j][key]); out.push(j); } }
  return out;
}
function openQuiz(cfg) {
  playMusic('quiz');
  Q = Object.assign({ k: 0, score: 0, phase: 'intro', sel: 0 }, cfg);
  bEl.hidden = false; bEl.dataset.zone = cfg.zone != null ? cfg.zone : AR.zone;
  held.clear(); order.length = 0;
  nextQuestion(true);
}
function closeQuiz() {
  bEl.hidden = true;
  const q = Q; Q = null;
  renderHud(); saveSoon();
  playMusic(areaMusic());
  if (q && q.done) q.done(q);
}
function spiritFor(i, cls, zone) {
  const img = makeSpirit(i, zone != null ? zone : WORDS[i][5]);
  const x = bSpirit.getContext('2d'); x.clearRect(0, 0, 16, 16); x.drawImage(img, 0, 0);
  bSpirit.className = 'px'; void bSpirit.offsetWidth; bSpirit.className = 'px ' + (cls || '');
}
function pips(i) {
  const L = Math.max(0, lvl(i));
  return `<span class="pips${L >= 5 ? ' star' : ''}">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= L ? 'on' : ''}"></i>`).join('')}</span>`;
}
function renderInfo(i, reveal) {
  // while a question is open, only show the word if the question itself shows it
  const known = reveal || (caught(i) && !!Q && Q.type === 'ua2en');
  bInfo.innerHTML = `№ ${String(i + 1).padStart(3, '0')} ${pips(i)}<span class="nm">${known ? esc(WORDS[i][1]) : '? ? ?'}</span>${lvl(i) >= 5 ? '★ mastered' : caught(i) || reveal ? 'level ' + Math.max(1, lvl(i)) : 'wild word'}`;
}
function nextQuestion(first) {
  if (Q.k >= Q.ids.length) return finishQuiz();
  if (Q.mode === 'road') return roadAsk();
  const i = Q.ids[Q.k];
  Q.i = i; Q.type = qType(i); Q.sel = 0; Q.phase = 'intro';
  preloadWord(i);
  spiritFor(i, 'enter');
  renderInfo(i, false);
  bProg.textContent = Q.mode === 'wild' ? '' : `${Q.label || (Q.mode === 'trial' ? 'TRIAL' : 'LESSON')} ${Q.k + 1}/${Q.ids.length}` + (Q.mode === 'trial' ? `  ✓${Q.score}` : '');
  bOpts.innerHTML = '';
  if (Q.mode === 'wild' && first) {
    bMsg.innerHTML = caught(i) ? 'A familiar word is back. Do you still know it?' : 'A wild word appeared!';
    bHint.textContent = 'Z: CATCH IT   X: RUN';
    if (Q.type === 'ua2en') playWord(i);
  } else if (Q.teacher && !caught(i)) {
    // a new word from a teacher: hear it and see it first, then show you know it
    const w = WORDS[i], ex = w[6][0];
    Q.phase = 'teach';
    renderInfo(i, true);
    bMsg.innerHTML = `${esc(Q.teacher)} teaches you a word:<span class="big">${esc(w[1])}</span><span class="en">${esc(w[2])}</span>${ex ? `<span class="ex">${exHTML(ex[0])}<br><i>${esc(ex[1])}</i></span>` : ''}`;
    bHint.textContent = 'Z: GOT IT   R: HEAR IT AGAIN';
    playWord(i);
  } else { askQuestion(); return; }
}
function askQuestion() {
  const i = Q.i, w = WORDS[i];
  Q.phase = 'q';
  renderInfo(i, false);
  bHint.textContent = Q.type === 'spell' ? 'TYPE OR TAP LETTERS   ⌫ UNDO   X: GIVE UP' : '1–4 OR ARROWS + Z   X: ' + (Q.mode === 'wild' ? 'RUN' : 'STOP');
  if (Q.type === 'ua2en') {
    bMsg.innerHTML = `<span class="big">${esc(w[1])}</span>What does it mean?`;
    Q.opts = shuffle([i, ...distractors(i, 3, 3)]);
    renderOpts(j => esc(WORDS[j][3]), false);
    if (Q.mode !== 'wild' || Q.k > 0) playWord(i);
  } else if (Q.type === 'en2ua') {
    const en = w[2].length <= 60 ? w[2] : w[3];
    bMsg.innerHTML = `How do you say <span class="en">${esc(en)}</span>`;
    Q.opts = shuffle([i, ...distractors(i, 3, 0)]);
    renderOpts(j => esc(WORDS[j][1]), true);
  } else {
    const en = w[2].length <= 60 ? w[2] : w[3];
    const target = [...w[4]];
    const extra = lvl(i) >= 4 ? 4 : 2, ALPHA = 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюя';
    const letters = target.slice();
    while (letters.length < target.length + extra) letters.push(ALPHA[rnd(ALPHA.length)]);
    Q.spell = { target, tiles: shuffle(letters.map((ch, k) => ({ ch, k, used: false }))), got: [] };
    bMsg.innerHTML = `Spell it in Ukrainian: <span class="en">${esc(en)}</span>`;
    renderSpell();
  }
}
function renderOpts(label, ua) {
  bOpts.innerHTML = '';
  Q.opts.forEach((j, n) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'opt' + (ua ? ' ua' : '') + (n === Q.sel ? ' sel' : '');
    b.innerHTML = `<span class="k">${n + 1}</span>${label(j)}`;
    b.addEventListener('click', () => { Q.sel = n; answer(Q.opts[n] === Q.i); });
    bOpts.appendChild(b);
  });
}
function renderSpell() {
  const sp = Q.spell;
  bOpts.innerHTML = '';
  const slots = document.createElement('div'); slots.className = 'slots';
  sp.target.forEach((_, k) => { const s = document.createElement('span'); s.textContent = sp.got[k] ? sp.got[k].ch : ''; slots.appendChild(s); });
  const tiles = document.createElement('div'); tiles.className = 'tiles';
  sp.tiles.forEach((t, n) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tile' + (t.used ? ' used' : '') + (n === Q.sel ? ' sel' : ''); b.textContent = t.ch;
    b.addEventListener('click', () => pushTile(n));
    tiles.appendChild(b);
  });
  const undo = document.createElement('button'); undo.type = 'button'; undo.className = 'tile wide'; undo.textContent = '⌫';
  undo.addEventListener('click', popTile);
  tiles.appendChild(undo);
  bOpts.append(slots, tiles);
}
function pushTile(n) {
  const sp = Q.spell, t = sp.tiles[n];
  if (!t || t.used) return;
  t.used = true; sp.got.push(t); sfx('tick');
  if (sp.got.length === sp.target.length) return answer(sp.got.map(g => g.ch).join('') === sp.target.join(''));
  renderSpell();
}
function popTile() { const t = Q.spell.got.pop(); if (t) { t.used = false; renderSpell(); } }
function grade(i, right) {
  const n = nowMin(), e = S.w[i] || [0, n, 0, 0, 0];
  e[2]++;
  const before = e[0];
  if (right) { e[0] = Math.min(5, Math.max(1, e[0] + 1)); e[3]++; e[1] = n + INTERVAL[e[0]] * (before >= 5 ? 2 : 1); }
  else { if (e[0] >= 1) e[0] = Math.max(1, e[0] - 1); e[4]++; e[1] = n + 1; }
  S.w[i] = e;
  return { before, after: e[0] };
}
function whenText(min) {
  if (min < 60) return min + ' min';
  if (min < 1440) return Math.round(min / 60) + ' h';
  return Math.round(min / 1440) + ' days';
}
// the Chumak's Road: choose the verb of motion that fits the sentence
function roadAsk() {
  const it = Q.road[Q.k];
  Q.phase = 'q'; Q.type = 'road'; Q.sel = 0; Q.i = it[3];
  spiritFor(3000 + Q.k * 7, 'enter', 2);
  const head = Q.head || ['ДІЄСЛОВА РУХУ', 'Чумацький Шлях', 'verbs of motion', 'Which verb fits?'];
  bInfo.innerHTML = `${esc(it[5] ? it[5][0] : head[0])}<span class="nm">${esc(it[5] ? it[5][1] : head[1])}</span>${esc(it[5] ? it[5][2] : head[2])}`;
  bProg.textContent = `${Q.label} · ${Q.k + 1}/${Q.ids.length}  ✓${Q.score}`;
  bMsg.innerHTML = `${esc(head[3])}<span class="mid">${esc(it[0]).replace('___', '<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>')}</span><span class="en">${esc(it[1])}</span>`;
  Q.opts = shuffle(it[2].map((_, j) => j));
  renderOpts(j => esc(it[2][j]), true);
  bHint.textContent = `1–${it[2].length} OR ARROWS + Z   X: STOP`;
}
function roadAnswer(right) {
  const it = Q.road[Q.k];
  Q.phase = 'res';
  if (right) Q.score++;
  sfx(right ? 'ok' : 'no');
  const full = esc(it[0]).replace('___', `<b>${esc(it[2][it[3]])}</b>`);
  bMsg.innerHTML = `${right ? '<span class="ok">Right!</span>' : '<span class="no">Not quite.</span>'}<span class="mid">${full}</span><span class="en">${esc(it[1])}</span><span class="ex">${esc(it[4])}</span>`;
  bOpts.innerHTML = '';
  bProg.textContent = `${Q.label} · ${Q.k + 1}/${Q.ids.length}  ✓${Q.score}`;
  bHint.textContent = 'Z: ' + (Q.k + 1 < Q.ids.length ? 'NEXT' : 'CONTINUE');
}
function answer(right) {
  if (Q.phase !== 'q') return;
  if (Q.mode === 'road') return roadAnswer(right);
  Q.phase = 'res';
  const i = Q.i, w = WORDS[i], wasCaught = caught(i);
  const { before, after } = grade(i, right);
  if (right) Q.score++;
  if (Q.mode === 'trial') bProg.textContent = `TRIAL ${Q.k + 1}/${Q.ids.length}  ✓${Q.score}`;
  const ex = w[6][0];
  const exLine = ex ? `<span class="ex">${exHTML(ex[0])}<br><i>${esc(ex[1])}</i></span>` : '';
  let head;
  if (right && !wasCaught) { head = `<span class="ok">Caught!</span> It's in your словник.`; sfx('ok'); spiritFor(i, 'caught'); }
  else if (right) { head = after >= 5 && before < 5 ? `<span class="ok">★ Mastered!</span>` : `<span class="ok">Right!</span> Level ${after}. Back in ${whenText(INTERVAL[after])}.`; sfx(after > before ? 'level' : 'ok'); }
  else if (!wasCaught) { head = `<span class="no">It slipped away!</span> It'll be back.`; sfx('no'); spiritFor(i, 'flee'); }
  else { head = `<span class="no">Not quite.</span> Back to level ${after}.`; sfx('no'); }
  renderInfo(i, true);
  bMsg.innerHTML = `${head}<span class="big">${esc(w[1])}</span><span class="en">${esc(w[2])}</span>${exLine}`;
  bOpts.innerHTML = '';
  bHint.textContent = 'Z: ' + (Q.k + 1 < Q.ids.length ? 'NEXT' : 'CONTINUE') + '   R: HEAR IT AGAIN';
  playWord(i);
  renderHud(); saveSoon();
}
function finishQuiz() {
  closeQuiz();
}
function quizKey(e) {
  const k = e.key;
  if (Q.phase === 'teach') {
    if (k === 'r' || k === 'R') { playWord(Q.i); return true; }
    if (isA(k)) { renderInfo(Q.i, false); askQuestion(); return true; }
    if (isB(k)) { flee(); return true; }
    return true;
  }
  if (Q.phase === 'intro') {
    if (isA(k)) { askQuestion(); return true; }
    if (isB(k)) { flee(); return true; }
    return true;
  }
  if (Q.phase === 'res') {
    if ((k === 'r' || k === 'R') && Q.mode !== 'road') { playWord(Q.i); return true; }
    if (isA(k)) { Q.k++; if (Q.k >= Q.ids.length) closeQuiz(); else nextQuestion(false); }
    return true;
  }
  if (Q.type === 'spell') {
    // spelling reads the letter you typed, not the key's place: in the Ukrainian layout X types ч
    const sp = Q.spell, raw = e.raw || e.key;
    if (raw === 'Backspace') { popTile(); return true; }
    if (raw === 'Escape' || ((raw === 'x' || raw === 'X') && !e.repeat)) { flee(); return true; }
    const ch = raw.toLowerCase();
    if (ch.length === 1 && /[а-яіїєґ'ʼ]/.test(ch)) {
      const n = sp.tiles.findIndex(t => !t.used && t.ch === ch);
      if (n >= 0) pushTile(n);
      return true;
    }
    const total = sp.tiles.length;
    if (KEYMAP[raw] === 'left' || KEYMAP[raw] === 'up') { Q.sel = (Q.sel - 1 + total) % total; renderSpell(); return true; }
    if (KEYMAP[raw] === 'right' || KEYMAP[raw] === 'down') { Q.sel = (Q.sel + 1) % total; renderSpell(); return true; }
    if (isA(raw)) { pushTile(Q.sel); return true; }
    return true;
  }
  if (/^[1-4]$/.test(k)) { if (+k > Q.opts.length) return true; Q.sel = +k - 1; answer(Q.opts[Q.sel] === Q.i); return true; }
  const d = KEYMAP[k];
  if (d) {
    const col = Q.sel % 2, row = Q.sel >> 1;
    if (d === 'left' || d === 'right') Q.sel = row * 2 + (1 - col); else Q.sel = (1 - row) * 2 + col;
    Q.sel = Math.min(Q.sel, Q.opts.length - 1);
    if (Q.mode === 'road') { const it = Q.road[Q.k]; renderOpts(j => esc(it[2][j]), true); }
    else renderOpts(Q.type === 'ua2en' ? j => esc(WORDS[j][3]) : j => esc(WORDS[j][1]), Q.type !== 'ua2en');
    return true;
  }
  if (isA(k)) { answer(Q.opts[Q.sel] === Q.i); return true; }
  if (isB(k)) { flee(); return true; }
  return true;
}
function flee() {
  if (Q.mode === 'wild') {
    bMsg.innerHTML = Q.phase === 'intro' ? 'You got away safely.' : 'You let it go.';
    spiritFor(Q.i, 'flee');
    Q.phase = 'res'; Q.k = Q.ids.length; bOpts.innerHTML = ''; bHint.textContent = 'Z: CONTINUE';
    return;
  }
  Q.stopped = true; Q.k = Q.ids.length; closeQuiz();
}

// ─── The словник ──────────────────────────────────────────────────────────
const dex = document.getElementById('dex'), dxList = document.getElementById('dxList'), dxCard = document.getElementById('dxCard'),
  dxTabs = document.getElementById('dxTabs'), dxCount = document.getElementById('dxCount'), dxSound = document.getElementById('dxSound');
const TABS = [['ТОРБА', 'bag'], ['ALL', null], ['TO PRACTISE', 'due'], ['ТУТ', 'here'], ['КРАЙ', 'land'], ['ГОВІРКА', 'dial'], ['ЦЕРКВА', 'cs']];
let D = { tab: 1, sel: 0, rows: [] };
function openDex() {
  if (!S.f.book) return say('', ['You don\'t have a словник yet. Ostap the kobzar is waiting by the church.']);
  dex.hidden = false; held.clear(); order.length = 0;
  renderDex(true);
}
function closeDex() { dex.hidden = true; }
function dexRows() {
  const t = TABS[D.tab][1];
  if (t === 'bag') return bagRows();
  if (t === 'due') return dueList();
  if (t === 'here') return AR.zone != null ? ZONES[AR.zone] : [];
  if (t === 'land') return ZONE_AREA.map((_, z) => z);
  if (t === 'dial') return DIALECT.map((_, k) => k);
  if (t === 'cs') return CSL.map((_, k) => k);
  if (t == null) return WORDS.map((_, i) => i);
  return ZONES[t];
}
function renderDex(scroll) {
  D.rows = dexRows();
  if (D.sel >= D.rows.length) D.sel = Math.max(0, D.rows.length - 1);
  dxCount.textContent = `${caughtCount()}/${N} · ★${masteredCount()} · ↻${dueList().length}`;
  dxCount.title = `${caughtCount()} of ${N} words caught, ${masteredCount()} mastered, ${dueList().length} to practise`;
  dxSound.textContent = soundOn() ? 'SOUND ON' : 'SOUND OFF';
  dxMusic.textContent = S.f.music === 0 ? 'MUSIC OFF' : 'MUSIC ON';
  dxLang.textContent = { auto: 'TALK: AUTO', en: 'TALK: ENG', ua: 'TALK: УКР' }[S.f.lang || 'auto'];
  dxTabs.innerHTML = '';
  TABS.forEach(([label, v], n) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = label + (v === 'here' && AR.zone != null ? ` ${zoneCaught(AR.zone)}/${ZONES[AR.zone].length}` : v === 'land' ? ` ◆${badgeCount()}` : '');
    if (n === D.tab) b.className = 'on';
    b.addEventListener('click', () => { D.tab = n; D.sel = 0; renderDex(true); });
    dxTabs.appendChild(b);
  });
  if (TABS[D.tab][1] === 'bag') return renderBag(scroll);
  if (TABS[D.tab][1] === 'land') return renderLand(scroll);
  if (TABS[D.tab][1] === 'dial') return renderDial(scroll);
  if (TABS[D.tab][1] === 'cs') return renderCS(scroll);
  dxList.innerHTML = '';
  if (!D.rows.length) dxList.innerHTML = `<div class="dx-row"><span></span><span class="w">${TABS[D.tab][1] === 'due' ? 'Nothing to practise yet.' : TABS[D.tab][1] === 'here' ? 'No wild words live indoors.' : ''}</span></div>`;
  const frag = document.createDocumentFragment();
  D.rows.forEach((i, n) => {
    const b = document.createElement('button'); b.type = 'button';
    const known = caught(i);
    b.className = 'dx-row' + (known ? '' : ' unk') + (n === D.sel ? ' sel' : '');
    b.innerHTML = `<span class="n">${String(i + 1).padStart(3, '0')}</span><span class="w">${known ? esc(WORDS[i][1]) : (S.w[i] ? '· seen ·' : '???')}</span>${known ? pips(i) : '<span></span>'}`;
    b.addEventListener('click', () => { D.sel = n; renderDex(false); if (caught(i)) playWord(i); });
    frag.appendChild(b);
  });
  dxList.appendChild(frag);
  if (scroll) { const el = dxList.children[D.sel]; if (el) el.scrollIntoView({ block: 'nearest' }); }
  renderCard();
}
function renderCard() {
  const i = D.rows[D.sel];
  dxCard.innerHTML = '';
  if (i == null) return;
  const w = WORDS[i], e = S.w[i];
  const sp = Object.assign(makeSpirit(i, w[5]), { className: 'px' });
  if (!caught(i)) {
    sp.style.filter = 'brightness(0) opacity(.25)';
    dxCard.append(sp);
    dxCard.insertAdjacentHTML('beforeend', `<div class="nm">№ ${String(i + 1).padStart(3, '0')}</div><div class="meta">Not caught yet. It lives in ${AREAS[ZONE_AREA[w[5]]].name}${e ? ', and you have met it ' + e[2] + (e[2] === 1 ? ' time' : ' times') : ''}.</div>`);
    return;
  }
  dxCard.append(sp);
  const due = e[1] - nowMin();
  dxCard.insertAdjacentHTML('beforeend', `<div class="nm">${esc(w[1])}</div><div class="en">${esc(w[2])}</div>` +
    w[6].map(([a, b]) => `<div class="ex">${exHTML(a)}<br><i>${esc(b)}</i></div>`).join('') +
    `<div class="meta">${pips(i)} ${e[0] >= 5 ? '★ mastered' : 'level ' + e[0]} · right ${e[3]}, wrong ${e[4]}<br>${due <= 0 ? 'Ready to practise now' : 'Next practice in ' + whenText(due)} · from ${AREAS[ZONE_AREA[w[5]]].name}</div>`);
  const play = document.createElement('button'); play.type = 'button'; play.textContent = '▶ HEAR IT';
  play.addEventListener('click', () => { unlockAudio(); playWord(i); });
  dxCard.appendChild(play);
}
dxSound.addEventListener('click', () => { unlockAudio(); S.f.mute = soundOn() ? 1 : 0; saveSoon(); renderDex(false); if (soundOn()) playWord(D.rows[D.sel] != null && TABS[D.tab][1] !== 'bag' ? D.rows[D.sel] : 777); });
const dxMusic = document.getElementById('dxMusic'), dxLang = document.getElementById('dxLang');
// who speaks Ukrainian: AUTO lets each person switch as you win pysanky
dxLang.addEventListener('click', () => { S.f.lang = { auto: 'ua', ua: 'en', en: 'auto' }[S.f.lang || 'auto']; saveSoon(); renderDex(false); });
dxMusic.addEventListener('click', () => {
  unlockAudio(); S.f.music = S.f.music === 0 ? 1 : 0; saveSoon();
  if (musicBus) musicBus.gain.setTargetAtTime(S.f.music === 0 ? 0 : .55, actx.currentTime, .1);
  renderDex(false);
});
// the land: every place, its words, and its pysanka
// ─── Tato's road map: where everything is, and how to get there ──────────
// Baba Hanna gives it to you with your first pysanka. On the КРАЙ page it draws the country and says how each place is reached.
const ROUTE = {
  vyshneve: 'Home.', khutir: 'West of Vyshneve.', steppe: 'South of Vyshneve.', kalynivka: 'East of Vyshneve, over the bridge.',
  fair: 'South of the khutir, or west along the steppe road.', lake: 'North of Kalynivka, or east through the old forest.',
  ferry: 'South of Kalynivka, or east along the steppe road.', marsh: 'North of the khutir, or west through the old forest.', forest: 'North of Vyshneve.',
  khortytsia: 'Semen\'s ferry at the Dnipro crossing goes downriver to the Sich once you hold 3 pysanky.', rapids: 'North across Khortytsia from the Sich.',
  podil: 'Vasyl\'s маршрутка leaves the Kalynivka post office for Kyiv once you hold 5 pysanky.', lavra: 'South of Podil, along the river.',
  bir: 'North out of the old forest, once Mavka lets you through (7 pysanky).', polissia: 'North through the pine forest.',
  synevyr: 'Svitlana\'s night train from the Polissia halt, once you hold 9 pysanky.', verkhovyna: 'East from Synevyr, over the pass, once Mytro has heard you speak Hutsul. Or up the river road from the Dniester.',
  polonyna: 'North of Verkhovyna.', chornohora: 'East of the polonyna, up the plai.',
  kamianets: 'The Sorochyntsi fair\'s west road, once you hold 11 pysanky.', dniester: 'South of Kamianets, down into the canyon.',
  liman: 'The chumak road, south from the steppe, once you hold 13 pysanky.', odesa: 'East along the shore from the salt liman.',
  vylkove: 'Captain Hryhorovych\'s «Ракета» from Odesa\'s port.', lviv: 'Pan Roman\'s bus from Kamianets, or Ferents\'s bus and the night train from Synevyr, once you hold 15 pysanky.',
};
// [longitude, latitude]; the home villages sit round Poltava the way they sit round Vyshneve
const GEO = { vyshneve: [34.5, 49.6], forest: [34.5, 50.2], steppe: [34.5, 49.0], khutir: [33.8, 49.6], kalynivka: [35.2, 49.6], lake: [35.2, 50.2],
  marsh: [33.8, 50.2], fair: [33.8, 49.0], ferry: [35.2, 49.0], khortytsia: [35.1, 47.8], rapids: [35.2, 48.3], podil: [30.5, 50.6], lavra: [30.6, 50.2],
  bir: [28.6, 51.0], polissia: [28.0, 51.5], synevyr: [23.7, 48.6], verkhovyna: [24.8, 48.1], polonyna: [24.3, 48.4], chornohora: [24.5, 47.8],
  kamianets: [26.6, 48.7], dniester: [27.1, 48.4], liman: [31.4, 46.7], odesa: [30.7, 46.4], vylkove: [29.6, 45.4], lviv: [24.0, 49.8] };
const BORDER = [[22.1, 48.4], [22.9, 49.0], [22.6, 49.6], [24.1, 50.8], [23.6, 51.5], [25.5, 51.9], [27.5, 51.6], [30.5, 51.5], [31.8, 52.1], [33.5, 52.3], [34.4, 51.7],
  [35.4, 51.0], [36.2, 50.4], [38.0, 49.9], [39.8, 49.6], [40.2, 48.9], [39.7, 47.8], [38.2, 47.1], [37.0, 46.9], [35.5, 46.4], [34.6, 46.1], [35.5, 45.4], [36.6, 45.4],
  [35.4, 44.7], [33.8, 44.4], [32.5, 45.4], [33.5, 46.0], [32.0, 46.4], [31.5, 46.6], [30.8, 46.5], [30.2, 45.8], [29.7, 45.2], [28.2, 45.5], [28.9, 46.4], [29.9, 46.7],
  [29.6, 47.4], [29.2, 47.9], [28.2, 48.2], [27.5, 48.5], [26.6, 48.3], [25.0, 47.8], [23.2, 48.0]];
const DNIPRO = [[30.5, 51.6], [30.5, 50.4], [31.6, 49.8], [33.0, 49.1], [34.6, 48.5], [35.1, 47.8], [33.6, 46.8], [32.4, 46.6]];
function drawCountry(sel) {
  const W = 184, H = 112, [c, x] = mk(W, H);
  const px = ([lo, la]) => [Math.round((lo - 22) / 18.3 * (W - 8) + 4), Math.round((52.4 - la) / 8.1 * (H - 8) + 4)];
  x.imageSmoothingEnabled = false;
  x.fillStyle = '#cfe4ef'; x.fillRect(0, 0, W, H);
  x.beginPath(); BORDER.forEach((p, i) => { const [a, b] = px(p); i ? x.lineTo(a, b) : x.moveTo(a, b); }); x.closePath();
  x.fillStyle = '#efe6d0'; x.fill(); x.strokeStyle = '#2b2230'; x.lineWidth = 1; x.stroke();
  x.beginPath(); DNIPRO.forEach((p, i) => { const [a, b] = px(p); i ? x.lineTo(a, b) : x.moveTo(a, b); }); x.strokeStyle = '#5f94bf'; x.stroke();
  const been = id => !!(S.been && S.been[id]);
  for (const id of Object.keys(GEO)) {
    const [a, b] = px(GEO[id]), z = AREAS[id].zone;
    x.fillStyle = '#2b2230'; x.fillRect(a - 2, b - 2, 5, 5);
    x.fillStyle = S.f['b' + z] ? '#e9b949' : been(id) ? '#fbf6ea' : '#a89f8a'; x.fillRect(a - 1, b - 1, 3, 3);
    if (id === sel) { x.strokeStyle = '#c8383a'; x.strokeRect(a - 3.5, b - 3.5, 8, 8); }
  }
  const here = AREAS[area] && (AREAS[area].inside ? AREAS[AREAS[area].exits[0].to] : AREAS[area]);
  const hid = Object.keys(AREAS).find(k => AREAS[k] === here);
  if (GEO[hid]) { const [a, b] = px(GEO[hid]); x.fillStyle = '#c8383a'; x.fillRect(a - 1, b - 7, 3, 3); x.fillRect(a, b - 4, 1, 2); }
  return c;
}
function renderLand(scroll) {
  dxList.innerHTML = '';
  let region = null;
  D.rows.forEach((z, n) => {
    const a = AREAS[ZONE_AREA[z]];
    if (a.region !== region) { region = a.region; dxList.insertAdjacentHTML('beforeend', `<div class="dx-row dx-region"><span></span><span class="w">${esc(REGIONS[region][1])} · ${esc(REGIONS[region][0])}</span><span></span></div>`); }
    const b = document.createElement('button'); b.type = 'button';
    b.className = 'dx-row' + (a.planned ? ' unk' : '') + (n === D.sel ? ' sel' : '');
    b.innerHTML = `<span class="n">${S.f['b' + z] ? '◆' : '◇'}</span><span class="w">${esc(a.ua)}</span><span class="n">${zoneCaught(z)}/${ZONES[z].length}</span>`;
    b.addEventListener('click', () => { D.sel = n; renderDex(false); });
    dxList.appendChild(b);
  });
  if (scroll) { const s = dxList.querySelector('.sel'); if (s) s.scrollIntoView({ block: 'nearest' }); }
  const z = D.rows[D.sel], a = AREAS[ZONE_AREA[z]], b = BADGES[z], have = zoneCaught(z);
  dxCard.innerHTML = '';
  const id = ZONE_AREA[z];
  if (has('mapa')) dxCard.append(Object.assign(drawCountry(id), { className: 'px mapc' }));
  else dxCard.append(Object.assign(makePysanka(b.col, !S.f['b' + z]), { className: 'px' }));
  dxCard.insertAdjacentHTML('beforeend', `<div class="nm">${esc(a.ua)}</div><div class="en">${esc(a.name)}, ${esc(REGIONS[a.region][0])}</div>` +
    (has('mapa') ? `<div class="ex"><b>How to get there:</b> ${esc(ROUTE[id] || '')}</div>` : (z === 0 ? '' : '<div class="meta">You have no map yet. Baba Hanna at the well in Vyshneve might have one.</div>')) +
    `<div class="ex">${esc(a.about || '')}</div>` +
    `<div class="meta">${have} of ${ZONES[z].length} words caught. ${S.f['b' + z] ? `You hold the ${esc(b.name)}.` : have >= TRIAL_NEED ? `Ready: ${esc(b.keeper)} will test you.` : `${esc(b.keeper[0].toUpperCase() + b.keeper.slice(1))} tests you at ${TRIAL_NEED}.`}` +
    `${a.planned ? '<br>Nobody has walked that road yet. (Coming in a later version.)' : ''}</div>`);
}
// the bag: pysanky, what you're carrying, and what to do next
function bagRows() {
  const rows = [{ quest: true }, { errands: true }];
  for (let z = 0; z < NZ; z++) if (S.f['b' + z]) rows.push({ badge: z });
  for (const id of Object.keys(ITEMS)) if (S.items && S.items[id]) rows.push({ item: id });
  return rows;
}
function renderBag(scroll) {
  dxList.innerHTML = '';
  D.rows.forEach((r, n) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'dx-row' + (n === D.sel ? ' sel' : '');
    const label = r.quest ? '<span class="n">★</span><span class="w">What now?</span>' :
      r.errands ? '<span class="n">★</span><span class="w">Errands and the road</span>' :
      r.badge != null ? `<span class="n">◆</span><span class="w">${esc(BADGES[r.badge].name)}</span>` :
      `<span class="n">•</span><span class="w">${esc(ITEMS[r.item].ua)}</span>`;
    b.innerHTML = label + '<span></span>';
    b.addEventListener('click', () => { D.sel = n; renderDex(false); });
    dxList.appendChild(b);
  });
  if (D.rows.length === 2) dxList.insertAdjacentHTML('beforeend', '<div class="dx-row"><span></span><span class="w" style="color:#b3a890">The bag is empty.</span></div>');
  const r = D.rows[D.sel];
  dxCard.innerHTML = '';
  if (!r) return;
  if (r.quest) {
    dxCard.insertAdjacentHTML('beforeend', `<div class="nm">What now?</div><div class="en">${esc(questText())}</div>` +
      (soundTrouble ? `<div class="meta">Sound: ${esc(soundTrouble)}</div>` : ''));
    return;
  }
  if (r.errands) {
    const road = S.f.vm || 0;
    dxCard.insertAdjacentHTML('beforeend', `<div class="nm">Errands</div><div class="en">${esc(errandsText())}</div>` +
      `<div class="meta">Errands done: ${Object.values(S.e || {}).filter(v => v === 2).length} of ${ERRANDS.length}</div>` +
      `<div class="nm">Чумацький Шлях</div><div class="en">${road >= VM.length ? 'You have walked the whole road with Ivan.' : road ? `Ivan the chumak's road of verbs of motion: stretch ${road + 1} of ${VM.length} next.` : 'Ivan the chumak, on the steppe road, knows every verb of motion. Ask him about the road.'}</div>`);
    return;
  }
  if (r.badge != null) {
    const c = Object.assign(makePysanka(BADGES[r.badge].col), { className: 'px' });
    dxCard.append(c);
    dxCard.insertAdjacentHTML('beforeend', `<div class="nm">${esc(BADGES[r.badge].name)}</div><div class="en">Писанка: a decorated egg. From ${esc(BADGES[r.badge].keeper)}, for knowing the words of ${esc(AREAS[ZONE_AREA[r.badge]].name)}.</div>`);
    return;
  }
  const it = ITEMS[r.item];
  dxCard.append(Object.assign(makeItemIcon(r.item), { className: 'px' }));
  dxCard.insertAdjacentHTML('beforeend', `<div class="nm">${esc(it.ua)}</div><div class="en">${esc(it.en)}</div><div class="ex">${esc(it.desc)}</div>`);
}
document.getElementById('dxClose').addEventListener('click', closeDex);
function dexKey(e) {
  const d = KEYMAP[e.key];
  if (isB(e.key) || e.key === 'c' || e.key === 'Tab') { closeDex(); return true; }
  if (d === 'up' || d === 'down') { D.sel = Math.max(0, Math.min(D.rows.length - 1, D.sel + (d === 'up' ? -1 : 1))); renderDex(true); return true; }
  if (d === 'left' || d === 'right') { D.tab = (D.tab + (d === 'left' ? -1 : 1) + TABS.length) % TABS.length; D.sel = 0; renderDex(true); return true; }
  if (isA(e.key)) { const i = D.rows[D.sel]; if (TABS[D.tab][1] !== 'bag' && i != null && caught(i)) playWord(i); return true; }
  return true;
}

// ─── Overlay routing (keyboard and touch) ─────────────────────────────────
const titleEl = document.getElementById('title');
let started = false, titleReady = false;
const overlayOpen = () => !titleEl.hidden || !bEl.hidden || !dex.hidden || naming() || !!RUN;
function overlayKey(e) {
  if (naming()) { if (isA(e.key)) submitName(); return true; }
  if (!titleEl.hidden) { if (isA(e.key) && titleReady) beginGame(); else if (titleReady) cheatKey(e.key); return true; }
  if (!bEl.hidden && Q) return quizKey(e);
  if (RUN) return rapidsKey(e);
  if (!dex.hidden) return dexKey(e);
  return false;
}
function overlayDir(d) {
  const map = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
  return overlayOpen() ? (overlayKey({ key: map[d] }), true) : false;
}
function overlayA() { return overlayOpen() ? (overlayKey({ key: 'z' }), true) : false; }
function overlayB() { return overlayOpen() ? (overlayKey({ key: 'x' }), true) : false; }
// ─── Your name ────────────────────────────────────────────────────────────
const nameEl = document.getElementById('nameBox'), nameIn = document.getElementById('nameIn');
const DEFAULT_NAME = 'Андрій';
const naming = () => !nameEl.hidden;
let afterName = null;
function askName(done) {
  afterName = done; nameEl.hidden = false;
  nameIn.value = S.name || DEFAULT_NAME;
  setTimeout(() => { nameIn.focus(); nameIn.select(); }, 0);
}
function submitName() {
  const n = nameIn.value.replace(/\s+/g, ' ').trim().slice(0, 16);
  S.name = n || DEFAULT_NAME;
  nameEl.hidden = true; nameIn.blur(); sfx('tick'); saveSoon();
  const f = afterName; afterName = null; f && f();
}
document.getElementById('nameOk').addEventListener('click', e => { e.stopPropagation(); submitName(); });
nameIn.addEventListener('pointerdown', e => e.stopPropagation());

titleEl.addEventListener('click', () => { unlockAudio(); if (titleReady) beginGame(); });

// ─── Lessons and trials ───────────────────────────────────────────────────
function startLesson(done) {
  const due = dueList().slice(0, 10);
  if (!due.length) return false;
  openQuiz({ mode: 'lesson', ids: due, zone: AR.zone || 0, done });
  return true;
}
// someone teaches you particular words: new ones are shown first, then asked
function teach(teacher, ids, done, zone) {
  openQuiz({ mode: 'lesson', label: 'LESSON', teacher, ids: ids.filter(i => i >= 0), zone: zone != null ? zone : (AR.zone || 0), done });
}
function startTrial(zone, count, done) {
  const pool = zone == null ? WORDS.map((_, i) => i).filter(caught) : ZONES[zone].filter(caught);
  const ids = shuffle(pool.slice().sort((a, b) => lvl(a) - lvl(b)).slice(0, Math.max(count * 3, 30))).slice(0, count);
  openQuiz({ mode: 'trial', ids, zone: zone == null ? 3 : zone, done });
}
function nextDueText() {
  const n = nowMin(), next = Object.values(S.w).filter(e => e[0] >= 1).map(e => e[1] - n).sort((a, b) => a - b)[0];
  return next == null ? '' : next <= 0 ? 'now' : whenText(next);
}

// ─── Playtesting: type HOPAK on the title screen ──────────────────────────
// Switches to a separate playtest save with 15 pysanky (home, the Sich, Kyiv and Polissia), Hnidko's horseshoe and every built place visited,
// so every road out is open (the mountains, Podillia, the sea, Lviv) and the horse rides anywhere. Typing it again goes back to the real save.
let cheatBuf = '';
function cheatKey(k) {
  if (k.length !== 1) return;
  cheatBuf = (cheatBuf + k.toLowerCase()).slice(-5);
  const finale = cheatBuf.endsWith('yaga');   // (no Z in it: Z starts the game)
  if (cheatBuf !== 'hopak' && !finale) return;
  cheatBuf = '';
  PLAYTEST = finale ? true : !PLAYTEST; sfx('badge');
  if (!PLAYTEST) { S = freshSave(); return loadSave().then(() => { document.getElementById('titleSave').textContent = `Your словник: ${caughtCount()} of ${N} words caught.`; }); }
  S = Object.assign(freshSave(), readLocal() || {});
  S.name = S.name || DEFAULT_NAME;
  Object.assign(S.f, { intro: 1, book: 1, duma: Math.max(4, S.f.duma || 0) });
  for (let z = 0; z < (finale ? NZ : 15); z++) S.f['b' + z] = 1;
  // YAGA: all 25, ready for the old forest, with 300 words caught (once each) for her trial
  if (finale) for (let i = 0; i < 300; i++) if (!S.w[i]) S.w[i] = [1, nowMin() + 99999, 1, 1, 0];
  S.items = Object.assign(S.items || {}, { horseshoe: 1, mapa: 1 });
  S.been = S.been || {}; for (const id of AREA_IDS) S.been[id] = 1;
  writeLocal();
  document.getElementById('titleSave').textContent = finale ? 'PLAYTEST SAVE: all 25 pysanky. Baba Yaga is waiting in the old forest. Your real save is untouched. (HOPAK to go back.)'
    : 'PLAYTEST SAVE: 15 pysanky, and Hnidko comes to any signpost. Your real save is untouched. (HOPAK again to go back.)';
}
