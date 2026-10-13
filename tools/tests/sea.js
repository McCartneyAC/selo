// The Black Sea: the chumak road, the salt liman, Odesa's Humorina, the boat to Vylkove and the parcels
const hold = (k, n) => { dispatchEvent(new KeyboardEvent('keydown', { key: k })); for (let i = 0; i < (n || 30); i++) tick(1); dispatchEvent(new KeyboardEvent('keyup', { key: k })); for (let i = 0; i < 30; i++) tick(1); };
const wait = n => { for (let i = 0; i < (n || 40); i++) tick(1); };
start(); badges(12);
// south from the steppe crossroads
go('steppe', 18, 20); hold('ArrowDown', 200); talk(); log('south with 12:', v().area, v().player.ty);
badges(13); go('steppe', 18, 20); hold('ArrowDown', 200); log('south with 13:', v().area, v().player.tx, v().player.ty);
meet('opanas'); talk([1]); log('sil', v().S.f.sil, v().quizOpen);
talk([0]); quiz(); talk(); log('sil', v().S.f.sil, 'tar pot', !!v().S.items.maznytsia);
go('solevar', 5, 6); meet('yavdokha'); talk();
// east along the road to Odesa
go('liman', 40, 9); hold('ArrowRight', 60); log('east:', v().area, v().player.tx, v().player.ty);
meet('sonia'); talk([1]); log('odesa', v().S.f.odesa);
meet('fima'); talk([0]); quiz(1); talk(); log('humor after a miss:', v().S.f.humor);
meet('fima'); talk([0]); quiz(); talk();
meet('lyova'); talk([0]); quiz(); talk();
meet('mania'); talk([0]); quiz(); talk();
meet('captain'); talk([1]); quiz(); talk(); log('humor', v().S.f.humor);
meet('sonia'); talk([1]); log('odesa', v().S.f.odesa, 'shell', !!v().S.items.mushlia);
// down the stairs, and the boat
go('odesa', 21, 14); hold('ArrowDown', 160); log('bottom of the stairs:', v().player.tx, v().player.ty);
meet('captain'); talk([0, 0]); wait(); log('boat to', v().area, v().player.tx, v().player.ty);
meet('nastia'); talk(); log('posh', v().S.f.posh, 'sack', !!v().S.items.posylky);
for (const id of ['kuzma', 'vasyl-v', 'sashko', 'avdotia', 'ulita']) { meet(id); talk([0]); quiz(); talk(); }
log('posb', v().S.f.posb);
meet('natalka'); talk(); 
meet('nastia'); talk(); log('posh', v().S.f.posh);
meet('fedot'); talk([1]); log('posh', v().S.f.posh, 'feather', !!v().S.items.pero);
go('vylkove', 23, 17); v().player.dir = 'up'; hold('ArrowUp', 20); log('church?', v().area);
go('vylkove', 6, 25); v().player.dir = 'up'; hold('ArrowUp', 20); log('house?', v().area);
go('vylkove', 22, 25); meet('tolik'); talk([0]); wait(); log('back to', v().area, v().player.tx, v().player.ty);
log(v().questText());
done();
