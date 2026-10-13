// Podillia: the fair's west road, Kamianets and its colours, the Dniester and the jobs, the raft to Bakota, the river road to the mountains
const hold = (k, n) => { dispatchEvent(new KeyboardEvent('keydown', { key: k })); for (let i = 0; i < (n || 30); i++) tick(1); dispatchEvent(new KeyboardEvent('keyup', { key: k })); for (let i = 0; i < 30; i++) tick(1); };
const wait = n => { for (let i = 0; i < (n || 40); i++) tick(1); };
const at = (x, y, dir) => { Object.assign(v().player, { tx: x, ty: y, x: x * 16, y: y * 16, fx: x, fy: y, nx: x, ny: y, dir, moving: false }); key('z'); tick(1); };
start(); badges(10);
// the west road out of the fair, from the fair square
go('fair', 10, 16); hold('ArrowLeft', 200); talk(); log('west with 10:', v().area, v().player.tx);
badges(11); go('fair', 10, 16); hold('ArrowLeft', 200); log('west with 11:', v().area, v().player.tx, v().player.ty);
log('grey on arrival:', document.getElementById('cv').style.filter);
// walk in over the bridge to the square
hold('ArrowLeft', 160); log('walked to', v().player.tx, v().player.ty);
meet('bohdan'); talk([1]); log('kam', v().S.f.kam);
meet('ruzha'); talk([0]); quiz(); talk(); log('farby', v().S.f.farby, document.getElementById('cv').style.filter);
meet('marian'); talk([0]); quiz(2); talk(); log('farby after 3/5:', v().S.f.farby);
meet('marian'); talk([0]); quiz(); talk(); log('farby', v().S.f.farby);
meet('tetianka'); talk([0]); quiz(); talk(); log('farby', v().S.f.farby);
meet('bohdan'); talk([1, 0]); quiz(); talk(); log('kam', v().S.f.kam, 'key', !!v().S.items.kluch, 'filter:', JSON.stringify(document.getElementById('cv').style.filter));
log('balloons up:', v().WORLD.kamianets.ents.filter(e => e.kind === 'balloon').every(e => e.up()));
// into the castle through the gate
go('kamianets', 6, 15); v().player.dir = 'up'; hold('ArrowUp', 20); log('castle?', v().area);
// south to the Dniester
go('kamianets', 27, 31); hold('ArrowDown', 60); log('south:', v().area, v().player.tx, v().player.ty);
meet('yakiv'); talk([1]); log('dnister', v().S.f.dnister);
at(15, 21, 'down'); talk(); log('raft before the crew:', v().area, v().player.tx);
for (const id of ['oksana', 'petro', 'stepan', 'iryna', 'halyna']) { meet('dn-' + id + '-w'); talk([0]); quiz(); talk(); }
log('robota', v().S.f.robota, 'fixed ones present:', v().WORLD.dniester.ents.filter(e => ['dn-oksana', 'dn-petro', 'dn-stepan', 'dn-iryna', 'dn-halyna'].includes(e.id) && e.when()).length);
meet('yakiv'); talk([1]); log('dnister', v().S.f.dnister);
at(15, 21, 'down'); talk([0]); wait(); talk(); log('rafted to', v().area, v().player.tx, v().player.ty);
v().player.dir = 'up'; go('dniester', 37, 15); v().player.dir = 'up'; hold('ArrowUp', 20); log('in', v().area);
meet('iov'); talk(); log('dnister', v().S.f.dnister, 'bell', !!v().S.items.dzvinok);
go('dniester', 37, 21); at(37, 21, 'down'); talk([0]); wait(); log('back to', v().player.tx, v().player.ty);
// up the river road: shut until Mytro has passed you
go('dniester', 2, 18); hold('ArrowLeft', 60); talk(); log('west without Mytro:', v().area);
v().S.f.hutsul = 2; go('dniester', 2, 18); hold('ArrowLeft', 60); log('west with Mytro:', v().area, v().player.tx, v().player.ty);
log(v().questText());
done();
