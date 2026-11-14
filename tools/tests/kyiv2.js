// Kyiv, the second pass: walk up the road into the caves, meet the saints, climb the uzviz, bite the kalyta
const hold = (k, n) => { dispatchEvent(new KeyboardEvent('keydown', { key: k })); for (let i = 0; i < (n || 30); i++) tick(1); dispatchEvent(new KeyboardEvent('keyup', { key: k })); for (let i = 0; i < 30; i++) tick(1); };
start(); badges(5);
go('lavra', 22, 27); v().player.dir = 'up';
hold('ArrowUp'); talk(); log('no candle, straight up the road. area:', v().area);
meet('ahafia'); talk(); log('candle without the quest:', !!v().S.items.lavracandle);
go('lavra', 22, 27); v().player.dir = 'up'; hold('ArrowUp'); log('up the road with a candle. area:', v().area, v().player.tx, v().player.ty);
meet('ioan'); talk();
Object.assign(v().player, { tx: 12, ty: 21, x: 192, y: 336, dir: 'down' }); key('z'); tick(1); talk();
log('pages visible before the quest:', v().WORLD.caves.ents.filter(e => e.kind === 'page' && (!e.when || e.when())).length);
// up Andriyivskyi uzviz
go('podil', 4, 2); v().player.dir = 'up'; hold('ArrowUp', 40); log('up the uzviz. area:', v().area, v().player.tx, v().player.ty);
meet('vira'); talk(); meet('uzpigeon0'); talk();
go('uzviz', 14, 25); v().player.dir = 'up'; hold('ArrowUp'); log('into the house. area:', v().area);
meet('motrona'); talk(); meet('kopystka'); talk([0]); quiz(2); talk(); log('kalyta after laughing twice:', v().S.f.kalyta);
meet('kopystka'); talk([0]); quiz(); talk(); log('kalyta:', v().S.f.kalyta, 'item:', !!v().S.items.kalyta);
log('what now:', v().questText());
go('podil', 18, 8); v().S.f.fern = 1; meet('pigeon1'); talk();
done();
