// lessons: at every level, each character's lesson is all words in play there, the same size as at A1; then the
// vodyanyk's wreath (five words, get four) played for real at C1, and the domovyk at A1 still teaching хата.
const keys = Object.keys(v().LESSONS);
for (const L of ['A1', 'A2', 'B1', 'B2', 'C1']) {
  v().setLevel(L);
  let bad = [];
  for (const k of keys) {
    const ids = v().lessonWords(k, ['вода', 'риба']);
    if (L !== 'A1' && (ids.length !== v().LESSONS[k][L].split(' ').length || !ids.every(v().inPlay))) bad.push(k);
  }
  log(L, 'words', v().N, '| lessons not all in play:', bad.length ? bad.join(',') : 'none', '| domovyk:', v().lessonWords('domovyk', ['хата', 'дім']).map(i => v().WORDS[i][0]).join(' '));
}
v().setLevel('C1');
start({ q1: 1 });
go('kalynivka', 20, 18);
meet('vodyanyk'); talk([0]);
log('vodyanyk lesson open at C1:', quizOpen(), 'words:', v().Q && v().Q.ids.map(i => v().WORDS[i][0]).join(' '));
quiz(1); talk(); log('one wrong -> wreath', !!v().S.items.wreath, 'scale', !!v().S.items.scale);
log('lesson words now caught and counting:', v().LESSONS.vodyanyk.C1.split(' ').length, '->', Object.keys(v().S.w).filter(i => v().inPlay(+i) && v().S.w[i][0] >= 1).length);
done();
