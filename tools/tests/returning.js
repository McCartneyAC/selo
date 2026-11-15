// a player who has finished another level is remembered by Ostap and Baba Hanna, and keeps name and sex
localStorage.clear();
localStorage.setItem('vyshneve-save-v3-A1', JSON.stringify({ v: 3, t: 5, name: 'Оксана', sex: 'f', f: { intro: 1, book: 1, yaga: 1 }, w: {}, items: {} }));
v().setLevel('B1');
v().loadSave().then(() => {
  ok(v().RETURNED === 'A1' && v().S.name === 'Оксана' && v().S.sex === 'f', `B1 save sees the finished A1 game (${v().RETURNED}, ${v().S.name}, ${v().S.sex})`);
  const S = v().S; S.f.intro = 1; S.f.tNote = 1; v().beginGame(); tick(2);
  const heard = [];
  const read = () => { for (let g = 0, idle = 0; g < 2000 && idle < 30; g++) { if (!dlgOpen() && !quizOpen()) { idle++; tick(1); continue; } idle = 0; if (quizOpen()) { key('x'); tick(1); continue; } if (askOpen()) key('ArrowUp'); key('z'); tick(1); heard.push(v().dlgText); } };
  go('vyshneve', 16, 10); meet('ostap'); read();
  ok(heard.some(h => /пам'ятаю/.test(h)), 'Ostap remembers');
  talk(); quiz(); talk();
  heard.length = 0; S.f.book = 1;
  go('vyshneve', 13, 16); meet('hanna'); read();
  ok(heard.some(h => /Знову до нас/.test(h)), 'Baba Hanna remembers, once');
  heard.length = 0; meet('hanna'); read(); ok(!heard.some(h => /Знову до нас/.test(h)), 'and only once');
  // nothing finished elsewhere: no such lines
  localStorage.clear(); v().setLevel('A2');
  v().loadSave().then(() => { ok(v().RETURNED === null, 'a first-time player is not "returning"'); done(); });
});
