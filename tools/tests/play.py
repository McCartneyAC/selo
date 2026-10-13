# Plays scripted scenarios against index.html#debug in headless Chromium and prints what happened.
# usage: play.py scenario.js [shot.png]   (the scenario runs after load, with the helpers below; it calls done() at the end)
import subprocess, sys, os
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
scenario = open(sys.argv[1], encoding='utf-8').read()
html = open(os.path.join(root, 'index.html'), encoding='utf-8').read()
harness = """<script>
window.onerror = (m, s, l, c, e) => console.log('ERROR ' + m + ' @' + l + (e && e.stack ? ' ' + e.stack.split('\\n').slice(1, 3).join(' | ') : ''));
const v = () => window.__vy;
const log = (...a) => console.log('LOG ' + a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' '));
const key = (k, code) => { dispatchEvent(new KeyboardEvent('keydown', { key: k, code: code || '' })); dispatchEvent(new KeyboardEvent('keyup', { key: k, code: code || '' })); };
const tick = n => v().tick(n || 1);
const dlgOpen = () => !document.getElementById('dlg').hidden;
const askOpen = () => !document.getElementById('ask').hidden;
const quizOpen = () => !document.getElementById('battle').hidden;
const said = [];
// read the dialogue through, choosing option `pick` (a number or a list of numbers, one per question) as questions come up
function talk(picks) {
  picks = [].concat(picks == null ? [] : picks);
  let last = '';
  for (let guard = 0; guard < 600 && dlgOpen(); guard++) {
    tick(2);
    if (askOpen()) {
      const p = picks.length ? picks.shift() : 0;
      for (let i = 0; i < p; i++) key('ArrowDown');
      said.push('   [' + [...document.querySelectorAll('#ask button')].map(b => b.textContent).join(' | ') + '] -> ' + p);
      key('z'); continue;
    }
    key('z'); tick(1);
    const t = (document.getElementById('who').textContent || '*') + ': ' + document.getElementById('txt').textContent.replace(/\\n/g, ' ');
    if (t !== last) { said.push(t); last = t; }
  }
}
// answer the open quiz: right answers unless told how many to get wrong
function quiz(wrong) {
  wrong = wrong || 0;
  for (let guard = 0; guard < 200 && quizOpen(); guard++) {
    const Q = v().Q;
    if (!Q) break;
    if (Q.phase === 'q') {
      if (Q.type === 'spell') { const t = Q.spell.target; for (const ch of t) key(ch); continue; }
      const right = Q.opts.indexOf(Q.i), pick = wrong > 0 ? (right + 1) % Q.opts.length : right;
      if (wrong > 0) wrong--;
      key(String(pick + 1));
    } else key('z');
    tick(1);
  }
}
// stand next to somebody in this area, facing them, and press Z
function meet(id) {
  const area = Object.keys(v().WORLD).find(a => v().WORLD[a].ents.includes(v().player));
  const npc = v().WORLD[area].ents.find(n => n.id === id);
  if (!npc) { log('no such person here: ' + id + ' in ' + area); return false; }
  for (const [dx, dy, dir] of [[0, 1, 'up'], [0, -1, 'down'], [1, 0, 'left'], [-1, 0, 'right']]) {
    const x = npc.tx + dx, y = npc.ty + dy;
    if (!v().canStand(x, y, v().player)) continue;
    Object.assign(v().player, { tx: x, ty: y, x: x * 16, y: y * 16, fx: x, fy: y, nx: x, ny: y, dir, moving: false });
    key('z'); tick(1); return true;
  }
  log('cannot get next to ' + id); return false;
}
function go(id, x, y) { v().enterArea(id, x, y, 'down'); tick(2); }
function start(f) { const S = v().S; S.name = 'Андрій'; S.f.intro = 1; S.f.book = 1; Object.assign(S.f, f || {}); v().beginGame(); tick(2); }
function badges(n) { for (let z = 0; z < n; z++) v().S.f['b' + z] = 1; }
function done() { for (const l of said) console.log('SAY ' + l); console.log('DONE'); }
window.addEventListener('load', () => setTimeout(() => { try { /*SCENARIO*/ } catch (e) { console.log('ERROR ' + e.message + ' ' + (e.stack || '').split('\\n').slice(1, 3).join(' | ')); done(); } }, 1200));
</script>""".replace('/*SCENARIO*/', scenario)
path = os.path.join(root, '_play.html')
open(path, 'w', encoding='utf-8').write(html + harness)
r = subprocess.run(['chromium', '--headless=new', '--disable-gpu', '--enable-logging=stderr', '--virtual-time-budget=20000', '--dump-dom', 'file://' + path + '#debug'],
                   capture_output=True, text=True, timeout=180)
if len(sys.argv) > 2:   # and a screenshot of how things stand at the end
    subprocess.run(['chromium', '--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=20000', '--window-size=900,700',
                    '--screenshot=' + sys.argv[2], 'file://' + path + '#debug'], capture_output=True, timeout=180)
os.remove(path)
out = []
for l in r.stderr.splitlines():
    if 'CONSOLE' in l and 'AudioContext' not in l:
        m = l.split('"', 1)[-1].rsplit('", source', 1)[0]
        out.append(m.encode().decode('unicode_escape').encode('latin-1', 'replace').decode('utf-8', 'replace') if '\\u' in m else m)
print('\n'.join(out))
