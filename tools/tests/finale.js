// The endgame: the hut, the friends, the whole road, the words, her tale, the homecoming and the duma
start({ duma: 4, fern: 1, lyst: 3, porohy: 1, panas: 5, litopys: 3, opud: 2, synvyr: 4, ves: 2, vatra: 3, soroka: 3, kam: 2, dnister: 3, sil: 2, odesa: 2, posh: 3, lviv: 2, vm: 8, zirka: 1, znakh: 1, bort: 2, kalyta: 2, hutsul: 2, dzvin: 31, lukash: 2 });
badges(25);
for (let i = 0; i < 200; i++) v().S.w[i] = [3, 99999999, 1, 1, 0];
Object.assign(v().S.items, { kava: 1, maznytsia: 1, kluch: 1, dzvinok: 1, mushlia: 1, quill: 1 });
go('vyshneve', 16, 10); meet('ostap'); talk(); log('coffee given', !v().S.items.kava, v().S.f.kava);
go('forest', 30, 10);
log('friends in the yard', v().WORLD.forest.ents.filter(e => /^fin-/.test(e.id) && e.when()).map(e => e.id).join(','));
const run = (wrongRoad) => { for (let k = 0; k < 14; k++) { talk(); if (quizOpen()) { const road = v().Q && v().Q.label === 'УСЯ ДОРОГА'; quiz(road ? wrongRoad : 0); if (road) wrongRoad = 0; } tick(10); if (!dlgOpen() && !quizOpen() && !v().warp) break; } };
meet('yaga'); run(8); log('after failing the road: fin', v().S.f.fin, 'yaga', v().S.f.yaga);
meet('yaga'); run(0); for (let k = 0; k < 20 && (v().warp || dlgOpen() || quizOpen()); k++) { tick(20); talk(); if (quizOpen()) quiz(); }
log('fin', v().S.f.fin, 'yaga', v().S.f.yaga, 'golden', !!v().S.items.zolota, 'area', v().area);
const s = said.join('\n'); log('hut turned with tar:', /grease/.test(s), 'key:', /cartwheel/.test(s), 'helpers:', (s.match(/^\*: \[(Baba Hanna|Mykyta|Ivanka|Lukash|the little bell|the shell|Baba Paraska)/mg) || []).length, 'duma:', /Ненаситець|Insatiable/.test(s), 'tato:', /drove all night|їхав усю ніч/.test(s));
// afterwards: Yaga wants her tale, tato is home, Ostap will sing again
go('forest', 30, 10); meet('yaga'); talk([0]); log('tale quiz', quizOpen()); quiz(); talk();
go('home', 5, 6); log('tato home', v().WORLD.home.ents.some(e => e.id === 'tato' && e.when()));
// Church Slavonic on the lectern
go('church', 6, 6); v().player.dir = 'up'; key('z'); tick(2); talk(); log('church slavonic read', Object.keys(v().S.cs || {}).join(','));
done();
