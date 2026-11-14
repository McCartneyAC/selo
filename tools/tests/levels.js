// levels: choose B1 on the title screen, play the opening, check a keeper's 75% threshold and that A1 stays apart
log('title level:', v().LEVEL, v().N, document.getElementById('lvName').textContent);
key('ArrowRight', 'ArrowRight');
setTimeout(() => {
  key('ArrowRight', 'ArrowRight');
  setTimeout(() => {
    log('now:', v().LEVEL, 'words', v().N, 'zone sizes', v().ZONES.map(z => z.length).join(','), 'trial need z9', v().trialNeed(9));
    log('title:', document.getElementById('titleLead').textContent, '|', document.getElementById('titleSave').textContent);
    key('z'); tick(2); key('Enter'); tick(2); talk();
    go('vyshneve', 16, 10); meet('ostap'); talk(); log('first wild word:', v().Q && v().WORDS[v().Q.ids[0]][0]); quiz(); talk();
    log('caught:', Object.keys(v().S.w).length, 'book', v().S.f.book);
    const z9 = v().ZONES[9], need = v().trialNeed(9);
    for (const i of z9.slice(0, need - 1)) v().S.w[i] = [2, 0, 1, 1, 0];
    badges(3); go('khortytsia', 23, 18); meet('ivansirko'); talk([0, 0]); log('one short, trial open?', quizOpen());
    v().S.w[z9[need - 1]] = [2, 0, 1, 1, 0];
    meet('ivansirko'); talk([0, 0]); log('at need, trial open?', quizOpen()); quiz(); talk(); log('Sich pysanka:', v().S.f.b9);
    // an A1 word does not count towards B1
    const slovo = v().WORDS.findIndex(w => w[0] === 'дім'); v().S.w[slovo] = [2, 0, 1, 1, 0];
    log('A1 дім in play at B1?', v().ACTIVE.includes(slovo));
    log('save key used:', Object.keys(localStorage).filter(k => k.startsWith('vyshneve')).join(' '));
    done();
  }, 300);
}, 300);
