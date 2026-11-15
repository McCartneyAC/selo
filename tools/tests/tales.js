// level tales: at each level only that level's person offers; 6/6 gives the keepsake, 4/6 doesn't; "Not now" still reaches their usual talk
const SPOTS = { A1: ['vyshneve', 'petryk'], A2: ['polissia', 'svitlana'], B1: ['vyshneve', 'mykola'], B2: ['post', 'nadia'], C1: ['kavarnia', 'ilona'] };
const ITEM = { A1: 'soroche', A2: 'pidsklianyk', B1: 'svyshchyk', B2: 'marka', C1: 'horniatko' };
const check = ok;
// static: every item has three distinct options and the right one first
const T = v().TALES;
for (const lv in T) {
  const items = T[lv].t.items;
  check(items.length === 6, lv + ' has six items');
  check(items.every(it => it[2].length === 3 && new Set(it[2]).size === 3 && it[3] === 0 && it[0].includes('___')), lv + ' items: three distinct options, answer first, a blank');
  check(!!v().ITEMS[ITEM[lv]], lv + ' keepsake registered');
}
// offers: only the level's own person, and only once the словник and pysanky are in hand
const talkTo = (area, id) => { const [x, y] = { vyshneve: [10, 14], polissia: [34, 7], post: [6, 5], kavarnia: [10, 5] }[area]; go(area, x, y); said.length = 0; meet(id); };
const firstAsk = () => { for (let g = 0; g < 80 && dlgOpen() && !askOpen(); g++) { key('z'); tick(1); } return askOpen() ? [...document.querySelectorAll('#ask button')].map(b => b.textContent).join('|') : ''; };
// close whatever is open, taking the last ("no") option at any question, and let any warp finish
const quitDlg = () => { for (let g = 0; g < 200 && (dlgOpen() || quizOpen()); g++) { if (quizOpen()) { key('x'); tick(1); continue; } if (askOpen()) key('ArrowUp'); key('z'); tick(1); } for (let g = 0; g < 120 && v().warp; g++) tick(1); };
for (const lv of ['A1', 'A2', 'B1', 'B2', 'C1']) {
  v().setLevel(lv); localStorage.clear();
  start(); v().S.f.tale = 0; badges(25);
  for (const other of Object.keys(SPOTS)) {
    const [area, id] = SPOTS[other];
    talkTo(area, id); const ask = firstAsk();
    const offers = /Not now|Не зараз/.test(ask) && /help|Поможу/.test(ask);
    check(other === lv ? offers : !offers, `${lv}: ${id} ${other === lv ? 'offers' : 'does not offer'}`);
    if (offers) { for (let i = 0; i < 1; i++) key('ArrowDown'); key('z'); tick(2); }   // Not now
    if (offers) check(dlgOpen() && v().S.f.tale === 1, `${lv}: Not now falls through to ${id}'s usual talk (${(v().dlgText || '').slice(0, 40)})`);
    quitDlg();
  }
  const [area, id] = SPOTS[lv];
  // 4 of 6: no keepsake
  talkTo(area, id); firstAsk(); key('z'); tick(2); talk(); quiz(2); talk(); quitDlg();
  check(v().S.f.tale === 1 && !v().S.items[ITEM[lv]], `${lv}: 4/6 keeps tale at 1, no keepsake`);
  check(/help/.test(v().questText()), `${lv}: What now? names the person (${v().questText().match(/[^.]*help[^.]*/)})`);
  // 6 of 6
  talkTo(area, id); firstAsk(); key('z'); tick(2); talk(); quiz(); talk(); quitDlg();
  check(v().S.f.tale === 2 && !!v().S.items[ITEM[lv]], `${lv}: 6/6 sets tale 2 and gives ${ITEM[lv]}`);
  check(!/could use your help/.test(v().questText()), `${lv}: hint gone once done`);
  // afterwards: no more offers, and the after line turns up
  const seen = [], heard = [];
  for (let k = 0; k < 2; k++) {
    talkTo(area, id);
    for (let g = 0; g < 60 && dlgOpen() && !askOpen(); g++) { key('z'); tick(1); heard.push(v().dlgText); }
    seen.push(askOpen() ? [...document.querySelectorAll('#ask button')].map(b => b.textContent).join('|') : ''); quitDlg();
  }
  const after = T[lv].t.after.map(x => x.replace(/\{\{[^}]*\}\}/g, '').slice(0, 18));
  check(seen.every(a => !/Поможу|help/.test(a)), `${lv}: no offer after done`);
  check(heard.some(h => after.some(a => h.includes(a))), `${lv}: the after line turns up in ${id}'s talk`);
}
// the pysanka gate at B1: 2 pysanky is too few
v().setLevel('B1'); localStorage.clear(); start(); v().S.f.tale = 0;
for (let z = 0; z < 25; z++) delete v().S.f['b' + z]; badges(2);
talkTo('vyshneve', 'mykola'); check(!/Поможу|help/.test(firstAsk()), 'B1: no offer with 2 pysanky'); quitDlg();
log(fails.length ? 'FAILURES ' + fails.length : 'ALL PASS');
done();
