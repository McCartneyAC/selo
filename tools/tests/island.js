// Syn's island: row over, then get back off by the raft moored there
const wait = n => { for (let i = 0; i < (n || 40); i++) tick(1); };
const at = (x, y, dir) => { Object.assign(v().player, { tx: x, ty: y, x: x * 16, y: y * 16, dir, moving: false }); key('z'); tick(1); };
start(); badges(9);
go('synevyr', 22, 20); at(22, 20, 'up'); talk([0]); wait(); talk(); log('on the island:', v().player.tx, v().player.ty);
at(22, 12, 'down'); talk([0]); wait(); log('back on the shore:', v().player.tx, v().player.ty);
at(22, 20, 'up'); talk([0]); wait(); log('second trip, any note?', dlgOpen());
done();
