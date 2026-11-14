start(); badges(5);
// the rapids: steer by the shouted word
go('rapids', 12, 14); meet('kindrat'); talk([1, 0]);
log('RUN open:', !!v().RUN);
let frames = 0;
while (v().RUN && frames < 20000) {
  const R = v().RUN;
  if (R.phase === 'ready') key('z');
  if (R.phase === 'end') { log('end:', R.msg, 'k', R.k, 'hearts', R.hearts); key('z'); break; }
  const row = R.rows.find(r => !r.done);
  if (row) { if (R.lane > row.safe) key('ArrowLeft'); else if (R.lane < row.safe) key('ArrowRight'); }
  tick(1); frames++;
}
log('frames', frames); talk(); log('porohy', v().S.f.porohy, 'oar', !!v().S.items.oar);
// to Kyiv on the маршрутка
go('kalynivka', 14, 13); meet('vasyl'); talk([0, 0]); for (let i = 0; i < 40; i++) tick(1); log('area:', v().area, v().player.tx, v().player.ty);
// Did Panas's letter
go('lake', 19, 21); meet('panas'); talk(); log('panas', v().S.f.panas, 'letter', !!v().S.items.letter);
go('podil', 24, 18); log('mykyta at stand?', v().WORLD.podil.ents.some(e => e.id === 'mykyta' && (!e.when || e.when())));
meet('ruslan'); talk(); log('panas', v().S.f.panas);
meet('nina'); talk(); log('panas', v().S.f.panas);
go('bookshop', 5, 6); meet('iryna'); talk(); log('panas', v().S.f.panas);
go('cafe', 5, 6); meet('mykyta-cafe'); talk(); quiz(); talk(); log('panas', v().S.f.panas, 'ticket', !!v().S.items.ticket);
go('podil', 24, 18); meet('mykyta'); talk([1]);
meet('solomiia'); talk();
// the Lavra and the caves
go('lavra', 22, 12); go('cell', 4, 5); meet('pimen'); talk([1]); log('litopys', v().S.f.litopys);
go('lavra', 22, 25); v().player.dir = 'up'; Object.assign(v().player, { tx: 21, ty: 27, x: 336, y: 432 }); key('ArrowUp'); for (let i = 0; i < 30; i++) tick(1); log('without candle, area:', v().area); talk();
meet('ahafia'); talk(); log('candle', !!v().S.items.lavracandle);
go('caves', 17, 22);
for (let k = 0; k < 5; k++) { if (meet('page' + k)) { talk(); quiz(); talk(); } }
log('pages', v().S.f.pages); meet('nestor'); talk(); log('litopys', v().S.f.litopys, 'quill', !!v().S.items.quill);
go('cell', 4, 5); meet('pimen'); talk([1]); log('litopys', v().S.f.litopys);
done();
