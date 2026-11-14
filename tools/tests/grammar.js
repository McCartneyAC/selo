// The grammar lessons in the home region, and asking in the right case
start({});
go('school', 6, 7); meet('lida'); talk([1, 1]); log('lesson open:', quizOpen()); quiz(); talk(); log('zirka', v().S.f.zirka);
meet('lida'); talk([1]); quiz(3); talk(); log('zirka after a poor try still', v().S.f.zirka);
go('marsh', 10, 8); meet('yaryna'); talk([2]); log('aches open:', quizOpen()); quiz(); talk(); log('znakh', v().S.f.znakh);
// the scarecrow: asking for сорочка instead of сорочку gets you giggled at, not the shirt
badges(7); go('polissia', 22, 30); meet('marko'); talk();
go('weaver', 5, 6); meet('hafiia');
for (let g = 0; g < 600 && dlgOpen(); g++) { tick(2); if (askOpen()) { const bs = [...document.querySelectorAll('#ask button')]; let i = bs.findIndex(b => b.textContent === 'сорочка'); if (i < 0) i = bs.findIndex(b => /Старий одяг|Old clothes/.test(b.textContent)); if (i < 0) i = 0; for (let k = 0; k < i; k++) key('ArrowDown'); key('z'); } else key('z'); }
log('shirt after asking for сорочка:', v().S.f.opudx || 0);
done();
