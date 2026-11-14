// Lviv: the bus from Kamianets, Ilona and the magpies, the calls from the poshtamt, the tram back
const hold = (k, n) => { dispatchEvent(new KeyboardEvent('keydown', { key: k })); for (let i = 0; i < (n || 30); i++) tick(1); dispatchEvent(new KeyboardEvent('keyup', { key: k })); for (let i = 0; i < 30; i++) tick(1); };
const wait = n => { for (let i = 0; i < (n || 40); i++) tick(1); };
start(); badges(14);
go('kamianets', 36, 15); meet('roman'); talk([0]); wait(); log('bus with 14:', v().area);
badges(15); meet('roman'); talk([0]); wait(); log('bus with 15:', v().area, v().player.tx, v().player.ty);
log('magpies:', v().WORLD.lviv.ents.filter(e => e.kind === 'magpie' && e.when()).length);
// into the café by its door
go('lviv', 12, 7); v().player.dir = 'up'; hold('ArrowUp', 20); log('in', v().area);
meet('ilona'); talk([1, 1]); log('lviv', v().S.f.lviv);
go('lviv', 36, 18); v().player.dir = 'up'; hold('ArrowUp', 20); log('in', v().area);
meet('booth'); talk([0]); quiz(); talk(); log('dzvin', v().S.f.dzvin);
meet('booth2'); talk([0]); quiz(1); talk(); log('dzvin after a miss', v().S.f.dzvin);
for (let k = 0; k < 3; k++) { meet('booth'); talk([0]); quiz(); talk(); }
log('dzvin', v().S.f.dzvin);
meet('booth'); talk([1]); 
go('kavarnia', 6, 6); meet('ilona'); talk([1, 1]); log('lviv', v().S.f.lviv, 'coffee', !!v().S.items.kava, 'magpies left:', v().WORLD.lviv.ents.filter(e => e.kind === 'magpie' && e.when()).length);
meet('ilona'); talk([1, 0]); log('test offered');
// the tram, and Ferents's bus the other way
go('lviv', 20, 27); meet('zirka'); talk([0]); wait(); log('tram to', v().area, v().player.tx, v().player.ty);
meet('ferents'); talk([1]); wait(); log('Ferents to', v().area, v().player.tx, v().player.ty);
log(v().questText());
done();
