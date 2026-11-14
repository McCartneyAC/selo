// The Carpathians: the train, Syn and Vyr, the Hutsul pass, the wedding, the fire, the magpies' nest
const hold = (k, n) => { dispatchEvent(new KeyboardEvent('keydown', { key: k })); for (let i = 0; i < (n || 30); i++) tick(1); dispatchEvent(new KeyboardEvent('keyup', { key: k })); for (let i = 0; i < 30; i++) tick(1); };
const wait = n => { for (let i = 0; i < (n || 40); i++) tick(1); };
const at = (x, y, dir) => { Object.assign(v().player, { tx: x, ty: y, x: x * 16, y: y * 16, dir, moving: false }); key('z'); tick(1); };
start(); badges(7);
go('polissia', 33, 6); meet('svitlana'); talk([0]); wait(); log('train with 7:', v().area);
badges(9); meet('svitlana'); talk([0]); wait(); log('train with 9:', v().area, v().player.tx, v().player.ty);
// the pass is shut
go('synevyr', 42, 14); v().player.dir = 'right'; hold('ArrowRight'); talk(); log('pass before Ivanka:', v().area);
meet('ivanka'); talk(); log('hutsul', v().S.f.hutsul, 'heard', Object.keys(v().S.d || {}).length);
meet('mytro'); talk([0]); quiz(3); talk(); log('hutsul after 5/8:', v().S.f.hutsul);
meet('mytro'); talk([0]); quiz(); talk(); log('hutsul:', v().S.f.hutsul);
// Syn and Vyr
meet('vyr'); talk(); log('synvyr', v().S.f.synvyr);
at(22, 20, 'up'); talk([0]); wait(); talk(); log('on the island?', v().player.tx, v().player.ty);
meet('syn'); talk([1]); quiz(); talk(); log('synvyr', v().S.f.synvyr);
meet('syn'); talk([2]); wait(); log('rowed back to', v().player.tx, v().player.ty);
meet('vyr'); talk(); quiz(); talk(); log('synvyr', v().S.f.synvyr);
at(22, 20, 'up'); talk([0]); wait(); talk(); log('synvyr', v().S.f.synvyr, 'sloza', !!v().S.items.sloza, 'vyr on the island:', v().WORLD.synevyr.ents.some(e => e.id === 'vyr2' && e.when()));
// over the pass
go('synevyr', 42, 14); v().player.dir = 'right'; hold('ArrowRight'); log('over the pass:', v().area, v().player.tx, v().player.ty);
// the wedding
meet('petro'); talk(); log('ves', v().S.f.ves);
go('korchma2', 5, 6); meet('mykhailo'); talk([0]); quiz(); talk();
go('vasylyna', 5, 6); meet('vasylyna'); talk([0]); quiz(); talk();
go('verkhovyna', 30, 24); meet('hryts'); talk([0]); quiz(); talk();
meet('petro'); talk(); log('ves', v().S.f.ves, 'muz', v().S.f.muz, 'drymba', !!v().S.items.drymba);
// the fire and the nest
go('polonyna', 22, 30); meet('stepan'); talk([1]); log('vatra', v().S.f.vatra);
go('molfarhut', 5, 6); meet('molfar'); talk([1]); log('soroka', v().S.f.soroka);
go('chornohora', 30, 7); v().player.dir = 'up'; dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' })); wait(30); dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' })); wait(30); log('walked into the observatory:', v().area); meet('queen'); talk([0]); quiz(); talk(); log('soroka', v().S.f.soroka);
go('molfarhut', 5, 6); meet('molfar'); talk([1]); log('soroka', v().S.f.soroka, 'fire', !!v().S.items.zhyvavatra);
go('polonyna', 18, 14); meet('vatra-ash'); talk(); log('vatra', v().S.f.vatra);
meet('stepan'); talk([1, 0]); quiz(); talk(); log('vatra', v().S.f.vatra, 'bryndza', !!v().S.items.bryndza);
log('Hutsul words heard:', Object.keys(v().S.d).length, 'of 20');
v().openDex(); tick(1); for (let i = 0; i < 6; i++) { const b = [...document.querySelectorAll('#dxTabs button')]; const g = b.find(x => x.textContent.startsWith('ГОВІРКА')); if (g) { g.click(); break; } }
log('dex:', document.getElementById('dxCard').textContent.slice(0, 80));
log(v().questText());
done();
