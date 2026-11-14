// saves (version 3) keep progress by the word itself: a B1 save written by word comes back as the right words,
// saving writes words not numbers, and an old version 2 save is left alone but lends its name
localStorage.setItem('vyshneve-save-v2', JSON.stringify({ v: 2, t: 1, name: 'Оксана', sex: 'f', f: {}, w: { 5: [3, 0, 1, 1, 0] }, items: {} }));
localStorage.setItem('vyshneve-save-v3-B1', JSON.stringify({ v: 3, t: 5, name: 'Тарас', f: { intro: 1, book: 1 }, w: { 'верба': [4, 0, 2, 2, 0], 'пшениця': [2, 0, 1, 1, 0], 'не-слово': [5, 0, 1, 1, 0] }, items: {} }));
v().switchLevel(1);                        // A1 -> A2: a level with no save of its own borrows the v2 name
setTimeout(() => {
log('A2:', v().LEVEL, '| name borrowed from v2:', v().S.name, v().S.sex, '| v2 words ignored:', Object.keys(v().S.w).length);
v().switchLevel(1);                        // A2 -> B1
setTimeout(() => {
  const S = v().S, W = v().WORDS;
  log('B1 loaded:', v().LEVEL, S.name, '| words:', Object.keys(S.w).map(i => W[i][0] + '=' + S.w[i][0] + (v().inPlay(+i) ? '' : ' NOT IN PLAY')).join(', '));
  v().beginGame(); tick(2); talk();
  v().S.w[v().ACTIVE[0]] = [1, 0, 1, 1, 0];
  v().saveNow();
  const disk = JSON.parse(localStorage.getItem('vyshneve-save-v3-B1'));
  log('on disk: v', disk.v, '| keys are words:', Object.keys(disk.w).every(k => isNaN(+k)), '|', Object.keys(disk.w).join(', '));
  log('v2 save untouched:', JSON.parse(localStorage.getItem('vyshneve-save-v2')).name);
  done();
}, 1500);
}, 1500);
