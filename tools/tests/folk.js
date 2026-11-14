// folk beings stay hidden until their custom is done: Mavka, the lisovyk, the rusalky, Berehynia, the devil, Baba Yaga
const here = id => { const e = v().WORLD[v().area].ents.find(n => n.id === id); const S = v().S;
  return !!e && !(e.when && !e.when()) && !(e.night && !S.f.night) && !(e.day && S.f.night); };
const fk = k => v().S.f['fk_' + k] || 0;
start();
go('forest', 12, 16); log('forest at first: mavka', here('mavka'), 'trace', here('fk-mavka'), '| lisovyk', here('lisovyk'), '| yaga', here('yaga'), 'hut voice', here('fk-yaga'));
meet('fk-mavka'); talk(); log('mavka trace seen:', fk('mavka'));
go('school', 8, 5); meet('lida'); talk(); log('sopilka from Lida:', !!v().S.items.vsopilka);
go('forest', 12, 16); meet('fk-mavka'); talk([0]); quiz(); talk(); log('mavka out:', fk('mavka'), here('mavka'), 'trace gone:', !here('fk-mavka'));
meet('fk-lis'); talk(); go('vyshneve', 10, 14); meet('mykola'); talk(); log('mykola tip:', v().S.f.fk_listip);
go('forest', 20, 28); meet('fk-lis'); talk([0]); quiz(); talk(); log('lisovyk out:', fk('lis'), here('lisovyk'));
meet('fk-yaga'); talk(); log('hut voice ok; yaga still hidden:', !here('yaga'));
// rusalky, at night
v().S.f.night = 1; go('vyshneve', 28, 18); log('night: rusalka', here('rusalka1'), 'trace', here('fk-rusalka1'));
meet('fk-rusalka1'); talk(); meet('hanna'); talk(); log('hanna tip:', v().S.f.fk_rustip);
meet('halyna'); talk(); log('wormwood:', !!v().S.items.polynok, 'rusalka now', here('rusalka1'));
meet('rusalka1'); talk([1]); log('parsley -> still', fk('rus'));
meet('rusalka1'); talk([0]); quiz(); talk(); log('wormwood -> rus', fk('rus'));
// Berehynia, by day
v().S.f.night = 0; go('lake', 20, 14); log('lake: berehynia', here('berehynia'), 'trace', here('fk-ber'));
meet('fk-ber'); talk(); go('vyshneve', 30, 9); meet('oksana'); talk();
log('ribbon:', !!v().S.items.strichka);
go('lake', 20, 14); meet('fk-ber'); talk([0]); quiz(); talk(); log('berehynia out:', fk('ber'), here('berehynia'));
// the devil
go('fair', 20, 16); log('fair: devil', here('chort')); meet('solopiy'); talk(); log('sleeve errand', v().S.e && v().S.e.sleeve);
go('khutir', 17, 12); meet('sirko'); talk(); log('sleeve:', !!v().S.items.sleeve);
go('fair', 26, 18); log('devil now', here('chort')); meet('chort'); talk(); quiz(); talk(); log('errand', v().S.e.sleeve, 'devil gone', !here('chort'));
// all 25 and the hut turns
badges(25); go('forest', 30, 12); log('25 pysanky: yaga', here('yaga'), 'hut voice', here('fk-yaga'));
done();
