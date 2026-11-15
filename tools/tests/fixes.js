// small fixes from the November review: apostrophes typed in spelling, glosses that gave the answer away, vocatives
const check = ok;
start();
// 1.1 spell м'ясо from the keyboard with a plain ' key
const i = v().WORDS.findIndex(w => w[0] === 'м’ясо');
check(i >= 0, 'м’ясо is a word');
v().S.w[i] = [3, 0, 1, 1, 0];
v().openQuiz({ mode: 'lesson', ids: [i], label: 'TEST', done: () => {} }); tick(1);
for (let g = 0; g < 5 && v().Q && v().Q.phase !== 'q'; g++) { key('z'); tick(1); }
check(v().Q.type === 'spell', 'a level-3 spellable word is spelled');
for (const ch of 'м\'ясо') { key(ch); tick(1); }
check(v().Q.phase === 'res' && v().Q.score === 1, 'typing м\'ясо with a straight apostrophe spells it');
key('z'); tick(1);
// 1.4 the prompt never shows Ukrainian
for (const lv of ['B2', 'C1', 'A2', 'B1']) { v().setLevel(lv); const a = v().WORDS.filter(w => /[а-яіїєґ]/i.test(w[2].length <= 60 ? w[2] : w[3]));
  const lk = a.filter(w => /[а-яіїєґ]/i.test(v().promptGloss(w)) || !v().promptGloss(w).trim()); check(lk.length === 0, `${lv} prompt glosses: ${a.length} had Ukrainian, ${lk.length} leak`); }
v().setLevel('A1');
const all = v().WORDS.filter(w => /[а-яіїєґ]/i.test(w[2].length <= 60 ? w[2] : w[3]));
const leaks = all.filter(w => /[а-яіїєґ]/i.test(v().promptGloss(w)) || !v().promptGloss(w).trim());
check(all.length > 0 && leaks.length === 0, `prompt glosses: ${all.length} had Ukrainian, ${leaks.length} still leak or are empty ${leaks.slice(0, 3).map(w => w[0]).join(' ')}`);
log('звати asks:', v().promptGloss(v().WORDS.find(w => w[0] === 'звати')));
// 1.6 vocatives
const VOC = [['Ігор', 'm', 'Ігорю'], ['Яків', 'm', 'Якове'], ['Федір', 'm', 'Федоре'], ['Антін', 'm', 'Антоне'], ['Тиміш', 'm', 'Тимоше'], ['Ничипір', 'm', 'Ничипоре'],
  ['Зоя', 'f', 'Зоє'], ['Майя', 'f', 'Майє'], ['Адель', 'f', 'Адель'], ['Нінель', 'f', 'Нінель'], ['Рут', 'f', 'Рут'], ['Естер', 'f', 'Естер'], ['Любов', 'f', 'Любове'],
  ['Андрій', 'm', 'Андрію'], ['Оксана', 'f', 'Оксано'], ['Марія', 'f', 'Маріє'], ['Ілля', 'm', 'Ілле'], ['Петро', 'm', 'Петре'], ['Олег', 'm', 'Олегу'], ['Тарас', 'm', 'Тарасе'], ['Ольга', 'f', 'Ольго']];
for (const [n, sx, want] of VOC) { v().S.sex = sx; const got = v().vocative(n); check(got === want, `vocative ${n} → ${got}${got === want ? '' : ' (want ' + want + ')'}`); }
// 1.5 no wrong option shares a sense with the answer, at A1 and B2
for (const lv of ['A1', 'B2']) {
  v().setLevel(lv);
  const W = v().WORDS, find = ua => W.findIndex(w => w[0].split(/\s*[=,]\s*/).includes(ua));
  for (const [a, b] of [['довго', 'давно'], ['вчити', 'вчитися']]) { const i = find(a), j = find(b); if (i >= 0 && j >= 0) check(v().clashes(i, j), `${lv}: ${a} and ${b} clash`); }
  let bad = 0, n = 0;
  for (const i of v().ACTIVE.slice(0, 400)) for (const key of [3, 1]) { const d = v().distractors(i, 3, key); n++; if (d.length !== 3 || d.some(j => v().clashes(i, j))) bad++; }
  check(bad === 0, `${lv}: ${n} option sets, ${bad} with a clashing or missing option`);
}
v().setLevel('A1');
// 1.2 a word that isn't due yet doesn't climb on a right answer; a due one does
{ const i = v().ACTIVE[5], S = v().S;
  S.w[i] = [2, 1e9, 1, 1, 0]; v().grade(i, true); check(S.w[i][0] === 2 && S.w[i][1] === 1e9, 'not-due word keeps level and due time');
  S.w[i] = [2, 0, 1, 1, 0]; v().grade(i, true); check(S.w[i][0] === 3, 'due word climbs');
  delete S.w[i]; v().grade(i, true); check(S.w[i][0] === 1, 'new word is caught'); }
log(fails.length ? 'FAILURES ' + fails.length : 'ALL PASS');
done();
