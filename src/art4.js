// ─── Things of the wider country: carts, the ferry, boats, birds, beasts ──
function makeCart() {
  // a chumak's ox cart (віз), loaded with sacks
  const [c, x] = mk(32, 24);
  shadow(x, 16, 22, 15, 2);
  R(x, 2, 8, 28, 9, C.out); R(x, 3, 9, 26, 7, C.wd0); for (let X = 7; X < 29; X += 5) R(x, X, 9, 1, 7, C.wd1);
  for (const [X, col] of [[6, '#e8e0cc'], [13, '#d9cfb8'], [20, '#e8e0cc']]) { R(x, X, 3, 7, 7, C.out); R(x, X + 1, 4, 5, 5, col); }
  for (const cx of [7, 24]) {
    for (let a = 0; a < 24; a++) { const t = a / 24 * Math.PI * 2; P(x, Math.round(cx + Math.cos(t) * 4.5), Math.round(18 + Math.sin(t) * 4.5), C.wd3); }
    line(x, cx - 4, 18, cx + 4, 18, C.wd2); line(x, cx, 14, cx, 22, C.wd2); R(x, cx - 1, 17, 2, 2, C.wd3);
  }
  line(x, 30, 13, 31, 16, C.wd2);
  return c;
}
function makeRaft() {
  // the Dnipro ferry: a plank raft with a rail, riding on the water
  const [c, x] = mk(48, 32);
  R(x, 1, 6, 46, 24, C.out); R(x, 2, 7, 44, 22, C.wd0);
  for (let X = 5; X < 46; X += 5) R(x, X, 7, 1, 22, C.wd1);
  R(x, 2, 7, 44, 2, C.wd2); R(x, 2, 27, 44, 2, C.wd2);
  for (const X of [4, 23, 42]) R(x, X, 0, 2, 8, C.wd2);
  R(x, 4, 1, 40, 1, C.wd1);
  R(x, 1, 30, 46, 1, C.w0);
  return c;
}
function makeHorse() {
  // Mamai's horse, waiting under the oak
  return art([
    '...........oo...................',
    '..........ohho..................',
    '.........ohhhho.................',
    '........ohhhhho.................',
    '.......ohhehhhoo................',
    '......ohhhhhhhhmo...............',
    '.....ohhhhoohhhmmo..............',
    '.....oooo..ohhhhmmooooooooo.....',
    '............ohhhhhhhhhhhhhhoo...',
    '............ohhhhhhhhhhhhhhhmo..',
    '...........ohhhhhhhhhhhhhhhhhmo.',
    '...........ohhhhsssssshhhhhhhmo.',
    '...........ohhhhrrrrrrhhhhhhhhmo',
    '............ohhhhhhhhhhhhhhhho.m',
    '.............ohhhhhhhhhhhhhho..m',
    '.............ohho.ohho.ohhohho..',
    '.............ohho.ohho.ohho.oho.',
    '.............ohho..oho..oho..oho',
    '.............ohho..oho..oho..oho',
    '.............oddo..odo..odo..odo',
    '.............oooo..ooo..ooo..ooo'], { o: C.out, h: '#8a5a35', m: '#3a2a22', e: C.out, s: '#c8383a', r: '#e6c26a', d: '#4b2f1c' });
}
function makeBoat() {
  const [c, x] = mk(20, 12);
  R(x, 1, 4, 18, 6, C.out); R(x, 2, 5, 16, 4, C.wd1); R(x, 2, 5, 16, 1, C.wd0); R(x, 0, 3, 3, 3, C.out); R(x, 17, 3, 3, 3, C.out);
  R(x, 4, 6, 12, 2, C.wd2); line(x, 6, 0, 13, 6, C.wd3);
  R(x, 1, 10, 18, 1, C.w0);
  return c;
}
function makeHeron() {
  return art([
    '....oo..........',
    '...owgo.........',
    'yyyogwo.........',
    '....ogo.........',
    '....ogo.........',
    '....ogo.........',
    '...ogggo........',
    '..ogggggoo......',
    '..oggggggdo.....',
    '..ogggggddo.....',
    '...oggggdo......',
    '....ooooo.......',
    '.....o.o........',
    '.....o.o........',
    '.....o.o........',
    '.....o.o........',
    '....oo.oo.......'], { o: C.out, g: '#b8c0cc', w: '#fbf8f0', d: '#6a7280', y: '#e6c26a' });
}
function makeCross() {
  // a kozak grave on its mound: a weathered wooden cross with a rushnyk tied on
  const [c, x] = mk(16, 26);
  shadow(x, 8, 24, 7, 2);
  R(x, 7, 2, 3, 22, C.out); R(x, 8, 2, 1, 22, C.wd1);
  R(x, 2, 7, 13, 3, C.out); R(x, 3, 8, 11, 1, C.wd1);
  R(x, 4, 14, 9, 2, C.out); R(x, 5, 14, 7, 1, C.wd1);
  R(x, 10, 9, 3, 9, '#fbf8f0'); P(x, 10, 16, C.red); P(x, 12, 16, C.red); P(x, 11, 17, C.red);
  return c;
}
function makeDog(frame) {
  return art([
    '.oo.....oo......',
    'obbo...obbo.....',
    '.obboooobo......',
    '.obgggggbo......',
    'obgeggggego.....',
    'obggggnggggoooo.',
    '.obggggggggggggo',
    '..oogggggggggggo',
    '....ogggggggggo.',
    '....ogggggggggo.',
    '....ogo.ogo.ogo.',
    frame ? '....oo..ogo.oo..' : '....ogo.oo..ogo.',
    '....oo...o...oo.'], { o: C.out, g: '#b8b0a0', b: '#6b5a4a', e: C.out, n: '#2b2230' });
}
function makeHen(frame) {
  return art([
    '...rr.......',
    '..owwo......',
    'yowewo......',
    '..owwo...oo.',
    '..obbbooobbo',
    '.obbbbbbbbbo',
    '.obbbbbbbbo.',
    '..obbbbbbo..',
    '...oooooo...',
    frame ? '....y..y....' : '...y....y...'], { o: C.out, w: '#c4762e', b: '#a8582a', e: C.out, y: C.org, r: C.red });
}
