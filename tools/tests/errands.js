// Errands across the map, the threads that pay off, and the road rushnyk
start({}); badges(15);
// a delivery: Kyrylo at the Sich sends a letter to his mother at the Kalynivka market
go('khortytsia', 30, 20); meet('kyrylo'); talk([0]); log('kyrylo errand', v().S.e.kyrylo, 'letter', !!v().S.items.synlyst);
go('kalynivka', 7, 15); meet('olena'); talk(); quiz(); talk(); log('kyrylo errand', v().S.e.kyrylo, 'letter gone', !v().S.items.synlyst);
// a fetch: Teklia at the rapids wants Yaryna's balm
go('lotsman', 5, 6); meet('paraska2'); talk([0]); go('marsh', 10, 8); meet('yaryna'); talk(); log('balm', !!v().S.items.maz);
go('lotsman', 5, 6); meet('paraska2'); talk(); quiz(); talk(); log('teklia', v().S.e.teklia);
// Baba Motria and her grandson Oles
go('church', 6, 8); meet('motria'); talk([0]); go('cafe', 5, 6); meet('oles'); talk(); quiz(); talk(); go('church', 6, 8); meet('motria'); talk(); log('motria', v().S.e.motria);
// the domovyk only asks after Kupala
v().S.f.dom = 1; go('hrytsenko', 5, 6); meet('domovyk'); talk([1]); log('domovyk before kupala', v().S.e.hrytsenko || 0);
v().S.f.kupala = 1; meet('domovyk'); talk([0]); log('domovyk after kupala', v().S.e.hrytsenko, 'crust', !!v().S.items.okraiets);
go('lviv', 15, 14); meet('daryna'); talk(); quiz(); talk(); log('hrytsenko', v().S.e.hrytsenko);
// tato's postcards, and the call
go('home', 4, 2); v().player.dir = 'up'; key('z'); tick(2); talk(); log('postcards seen', v().S.f.tatoCards);
v().S.f.lviv = 1; go('poshtamt', 2, 4); meet('booth'); talk([4]); log('quiz for tato', quizOpen()); quiz(); talk(); log('dzvin', v().S.f.dzvin);
// Lukash's tune
v().S.f.opud = 2; go('polissia', 12, 20); meet('lukash'); talk(); log('lukash flag', v().S.f.lukash);
go('forest', 11, 13); meet('mavka'); talk(); log('mavka told', v().S.f.lukash);
// the one in the rock, the нявка, and Palahna's tale
go('bir', 35, 23); meet('rock'); talk(); go('chornohora', 17, 20); meet('nyavka'); talk(); go('babahouse', 5, 6); meet('palahna'); talk([1]); meet('palahna'); talk([1]);
// all far errands done: the last one sends you to Baba Paraska for the road rushnyk
for (const e of v().ERRANDS) if (e.region && e.id !== 'fima') v().S.e[e.id] = 2;
go('odesa', 9, 8); meet('fima'); talk([0]); go('kavarnia', 6, 6); meet('pan-zenon'); talk(); quiz(); talk(); log('rushnyk flag', v().S.f.rushnyk);
go('mykola', 5, 6); meet('paraska'); talk([1]); meet('paraska'); talk(); log('rushnyk', v().S.f.rushnyk, !!v().S.items.rushnyk);
log(v().questText());
done();
