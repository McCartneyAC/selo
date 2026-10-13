// a brand-new game: title, name, intro, Ostap, the first word
key('z'); tick(2); log('naming:', !document.getElementById('nameBox').hidden);
key('Enter'); tick(2); talk(); log('intro read; name:', v().S.name, 'area:', v().area);
go('vyshneve', 16, 10); meet('ostap'); talk(); log('quiz open for the first word:', quizOpen()); quiz(); talk(); log('book:', v().S.f.book, 'caught:', Object.keys(v().S.w).length);
// a keeper in a new region tests you once you know 30 of their words
const z9 = []; v().WORDS.forEach((w, i) => { if (w[5] === 9) z9.push(i); });
for (const i of z9.slice(0, 30)) v().S.w[i] = [2, 0, 1, 1, 0];
badges(3); go('khortytsia', 23, 18); meet('ivansirko'); talk([0, 0]); log('trial open:', quizOpen()); quiz(); talk(); log('Sich pysanka:', v().S.f.b9);
done();
