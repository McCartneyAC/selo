// Polissia: Mavka's gate, the borts, the scarecrow
const hold = (k, n) => { dispatchEvent(new KeyboardEvent('keydown', { key: k })); for (let i = 0; i < (n || 30); i++) tick(1); dispatchEvent(new KeyboardEvent('keyup', { key: k })); for (let i = 0; i < 30; i++) tick(1); };
start(); badges(5);
go('forest', 11, 2); v().player.dir = 'up'; hold('ArrowUp', 40); talk(); log('with 5 pysanky:', v().area, v().player.tx, v().player.ty);
badges(7); go('forest', 11, 2); v().player.dir = 'up'; hold('ArrowUp', 40); log('with 7:', v().area, v().player.tx, v().player.ty);
// the borts
meet('okhrim'); talk([1]); log('bort', v().S.f.bort);
const look = (x, y, dir) => { const [dx, dy] = { up: [0, 1], down: [0, -1], left: [1, 0], right: [-1, 0] }[dir]; Object.assign(v().player, { tx: x + dx, ty: y + dy, x: (x + dx) * 16, y: (y + dy) * 16, dir, moving: false }); key('z'); tick(1); talk(); };
look(10, 7, 'right'); look(29, 6, 'up'); look(33, 21, 'left'); look(18, 22, 'up'); look(10, 21, 'right');
log('borts found', v().S.f.borts); meet('okhrim'); talk([1]); quiz(); talk(); log('bort', v().S.f.bort, 'honey', !!v().S.items.wildhoney);
// the village and the scarecrow
go('polissia', 22, 30); log('arrived:', v().area);
meet('marko'); talk(); log('opud', v().S.f.opud);
meet('scarecrow'); talk();
meet('lukash'); talk([0]); log('lukash first pick ->', v().S.f.opudx);
const pickRight = (id, word) => { meet(id); for (let g = 0; g < 600 && dlgOpen(); g++) { tick(2); if (askOpen()) { const bs = [...document.querySelectorAll('#ask button')]; let i = bs.findIndex(b => b.textContent === word); if (i < 0) i = bs.findIndex(b => /Старий одяг|Old clothes/.test(b.textContent)); if (i < 0) i = 0; for (let k = 0; k < i; k++) key('ArrowDown'); key('z'); } else key('z'); } };
pickRight('lukash', 'шарф'); pickRight('prokip', 'шапку'); pickRight('fedir-p', 'куртку');
go('lukash', 5, 6); pickRight('lukashmama', 'штани');
go('weaver', 5, 6); pickRight('hafiia', 'сорочку');
log('clothes', v().S.f.opudx);
go('polissia', 22, 30); meet('scarecrow'); talk(); quiz(); talk(); for (let k = 0; k < 6 && quizOpen(); k++) { quiz(); talk(); }
log('opud', v().S.f.opud, 'worn', v().S.f.opudd, 'sash', !!v().S.items.poias, 'magpies here', v().WORLD.polissia.ents.filter(e => e.kind === 'magpie' && (!e.when || e.when())).length);
meet('scarecrow'); talk(); meet('svitlana'); talk();
log(v().questText());
done();
