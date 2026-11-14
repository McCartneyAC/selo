// walk to the Polissia road the way a player would: from the forest's western path, up the road, with and without enough pysanky
const hold = (k, n) => { dispatchEvent(new KeyboardEvent('keydown', { key: k })); for (let i = 0; i < (n || 30); i++) tick(1); dispatchEvent(new KeyboardEvent('keyup', { key: k })); for (let i = 0; i < 30; i++) tick(1); };
start(); badges(5);
go('forest', 12, 18); v().player.dir = 'up'; hold('ArrowUp', 600); talk(); log('5 pysanky, walking up from the path:', v().area, v().player.tx, v().player.ty);
badges(9); go('forest', 12, 18); v().player.dir = 'up'; hold('ArrowUp', 600); log('9 pysanky:', v().area, v().player.tx, v().player.ty);
v().player.dir = 'down'; hold('ArrowDown', 60); log('and back down:', v().area, v().player.tx, v().player.ty);
done();
