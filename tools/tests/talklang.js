// the telling follows the level: which language Baba Hanna (early) and Pani Ilona (late) open in, at 0 and at 10 pysanky
const WANT = { A1: ['en', 'en', 'en', 'en'], A2: ['en', 'ua', 'en', 'en'], B1: ['ua', 'ua', 'ua', 'ua'], B2: ['ua', 'ua', 'ua', 'ua'], C1: ['ua', 'ua', 'ua', 'ua'] };
const opens = (area, x, y, id) => { go(area, x, y); meet(id); const l = v().dlgLang; for (let g = 0; g < 300 && (dlgOpen() || quizOpen()); g++) { if (askOpen()) key('ArrowUp'); key('z'); tick(1); } return l; };
for (const lv in WANT) {
  v().setLevel(lv); localStorage.clear(); start(); v().S.f.tNote = 1;
  const got = [];
  for (const n of [0, 10]) {
    for (let z = 0; z < 25; z++) delete v().S.f['b' + z]; badges(n);
    got.push(opens('vyshneve', 13, 16, 'hanna'), opens('kavarnia', 10, 5, 'ilona'));
  }
  const want = [WANT[lv][0], WANT[lv][2], WANT[lv][1], WANT[lv][3]];
  ok(got.join() === want.join(), `${lv}: hanna/ilona at 0 and 10 pysanky open in ${got.join(' ')} (want ${want.join(' ')})`);
}
// the one-time T note, at B1, before the first line
v().setLevel('B1'); localStorage.clear(); start(); delete v().S.f.tNote;
go('vyshneve', 13, 16); meet('hanna'); tick(200); ok(/Натисни T/.test(v().dlgText) && v().S.f.tNote === 1, 'B1: the first conversation opens with the T note');
for (let g = 0; g < 300 && dlgOpen(); g++) { if (askOpen()) key('ArrowUp'); key('z'); tick(1); }
meet('hanna'); ok(!/Натисни T/.test(v().dlgText), 'B1: the T note shows once');
done();
