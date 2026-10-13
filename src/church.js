// ─── Church Slavonic: the old Gospel on every lectern ─────────────────────
// Each church, cell and cave chapel with a lectern has its Gospel (or Psalter) open at a well-known verse.
// Reading it teaches three Church Slavonic words for the ЦЕРКВА page of the словник: a bonus, like the Hutsul words.
const CSL = [   // [word, English, Ukrainian, a note]
  ['начало', 'beginning', 'початок', 'Въ началѣ бѣ Слово: in the beginning was the Word. The first line of John\'s Gospel.'],
  ['бѣ', 'was', 'був, було', 'An old past tense of бути. The letter ѣ (ять) is read as і in Ukrainian: that\'s why Slavonic хлѣбъ is Ukrainian хліб.'],
  ['къ', 'to, towards', 'до, к', 'Слово бѣ къ Богу: the Word was with God. The hard sign ъ at the end of a word is silent.'],
  ['блаженъ', 'blessed, happy', 'щасливий, блаженний', 'The first word of the Psalter. Ukrainian keeps it as блаженний.'],
  ['мужъ', 'a man', 'чоловік, муж', 'Ukrainian still says муж for a man of standing: a statesman is державний муж.'],
  ['иже', 'who, which', 'який, що', 'A relative pronoun. You\'ll hear it in the Lord\'s Prayer too: Отче нашъ, иже еси.'],
  ['азъ', 'I', 'я', 'The old name of the letter А was also азъ. To know something from азъ to ижиця is to know it from A to Z.'],
  ['есмь', 'am', 'є, я є', 'Азъ есмь: I am. Ukrainian lost these forms and keeps just є for everyone.'],
  ['свѣтъ', 'light', 'світло', 'Азъ есмь свѣтъ міру: I am the light of the world. Ѣ again reads as і: свѣтъ, світ, світло.'],
  ['отче', 'father! (calling)', 'батьку, отче', 'The vocative of отець, just like the kamiana baba taught you. Ukrainian priests are still called отче.'],
  ['еси', 'art (you are)', 'ти є', 'Иже еси на небесѣхъ: who art in heaven. The old verb бути had a form for every person.'],
  ['имя', 'name', 'ім\'я', 'Да святится имя Твое: hallowed be Thy name. Ukrainian ім\'я comes from the same word.'],
  ['насущный', 'daily, needful', 'щоденний, насущний', 'Хлѣбъ нашъ насущный: our daily bread. Ukrainian keeps насущний: насущна потреба, a vital need.'],
  ['даждь', 'give!', 'дай', 'An old imperative of дати. Compare Ukrainian дай.'],
  ['днесь', 'today', 'сьогодні, нині', 'Днесь: this day. The Hutsuls say нині, which is the same idea, from the same old roots.'],
  ['путь', 'way, road', 'шлях, дорога', 'Азъ есмь путь, и истина, и животъ. Ukrainian путь and путівник (a guidebook) come from it.'],
  ['истина', 'truth', 'істина, правда', 'Ukrainian keeps it as істина, a grand word for the truth.'],
  ['животъ', 'life', 'життя', 'A false friend! In Ukrainian живіт is the belly, but in Slavonic животъ is life itself.'],
  ['ищите', 'seek!', 'шукайте', 'Ищите, и обрящете: seek, and ye shall find. An imperative, to more than one person.'],
  ['обрящете', 'you will find', 'знайдете', 'A future, done once: the perfective, like знайдете.'],
  ['толцыте', 'knock!', 'стукайте', 'Толцыте, и отверзется вамъ: knock, and it shall be opened unto you.'],
  ['помилуй', 'have mercy', 'помилуй, змилуйся', 'Господи, помилуй: Lord, have mercy. The words you hear most often in any Ukrainian church.'],
  ['мя', 'me', 'мене', 'An old short form of мене, the way ся is the short form of себе. That ся still lives on in Ukrainian, at the end of сміятися.'],
  ['велицѣй', 'great (in the locative)', 'великій', 'По велицѣй милости Твоей: according to Thy great mercy. Locative, like у великій хаті.'],
  ['кротцыи', 'the meek, the gentle', 'лагідні, покірні', 'Блажени кротцыи: blessed are the meek.'],
  ['яко', 'for, because, as', 'бо, як', 'Ukrainian як comes from the same word.'],
  ['тіи', 'they, those', 'ті, вони', 'Яко тіи наслѣдятъ землю: for they shall inherit the earth.'],
  ['пріидите', 'come!', 'прийдіть', 'An imperative to many: come, all of you. Ukrainian прийдіть.'],
  ['вси', 'all', 'всі, усі', 'Вси труждающіися: all you who labour.'],
  ['упокою', 'I will give rest', 'заспокою', 'И азъ упокою вы: and I will give you rest. Ukrainian спокій, rest and peace, is the same root.'],
];
// where each Gospel lies open, the verse, and the three words it teaches
const GOSPEL = {
  church: ['Въ началѣ бѣ Слово, и Слово бѣ къ Богу, и Богъ бѣ Слово.', 'In the beginning was the Word, and the Word was with God, and the Word was God. (John 1:1)', ['начало', 'бѣ', 'къ']],
  sichchurch: ['Блаженъ мужъ, иже не иде на совѣтъ нечестивыхъ.', 'Blessed is the man that walketh not in the counsel of the ungodly. (Psalm 1:1)', ['блаженъ', 'мужъ', 'иже']],
  andrewchurch: ['Азъ есмь свѣтъ міру.', 'I am the light of the world. (John 8:12)', ['азъ', 'есмь', 'свѣтъ']],
  lavrachurch: ['Отче нашъ, иже еси на небесѣхъ, да святится имя Твое.', 'Our Father, which art in heaven, hallowed be Thy name. (Matthew 6:9)', ['отче', 'еси', 'имя']],
  polchurch: ['Хлѣбъ нашъ насущный даждь намъ днесь.', 'Give us this day our daily bread. (Matthew 6:11)', ['насущный', 'даждь', 'днесь']],
  hutchurch: ['Азъ есмь путь, и истина, и животъ.', 'I am the way, the truth, and the life. (John 14:6)', ['путь', 'истина', 'животъ']],
  lipchurch: ['Ищите, и обрящете; толцыте, и отверзется вамъ.', 'Seek, and ye shall find; knock, and it shall be opened unto you. (Matthew 7:7)', ['ищите', 'обрящете', 'толцыте']],
  cell: ['Помилуй мя, Боже, по велицѣй милости Твоей.', 'Have mercy upon me, O God, according to Thy great mercy. (Psalm 51:1)', ['помилуй', 'мя', 'велицѣй']],
  caves: ['Блажени кротцыи, яко тіи наслѣдятъ землю.', 'Blessed are the meek: for they shall inherit the earth. (Matthew 5:5)', ['кротцыи', 'яко', 'тіи']],
  bakota: ['Пріидите ко Мнѣ вси труждающіися и обремененніи, и Азъ упокою вы.', 'Come unto me, all ye that labour and are heavy laden, and I will give you rest. (Matthew 11:28)', ['пріидите', 'вси', 'упокою']],
};
const csIdx = w => CSL.findIndex(c => c[0] === w);
const heardCS = w => !!(S.cs && S.cs[w]);
STORY_LOOK['*:0'] = () => {
  const g = GOSPEL[area];
  if (!g) return false;
  const fresh = g[2].filter(w => !heardCS(w));
  const first = !Object.keys(S.cs || {}).length;
  S.cs = S.cs || {}; for (const w of g[2]) S.cs[w] = 1; saveSoon();
  say('', [L('The old Gospel lies open on the lectern, in Church Slavonic: the old language of the liturgy, a cousin of Ukrainian, written with letters Ukrainian has since let go, like ѣ and ъ.', 'На аналої відкрите старе Євангеліє, церковнослов\'янською: давньою мовою богослужіння, родичкою української, з літерами, яких українська вже не вживає, як-от ѣ та ъ.'),
    L(`${g[0]}\n(${g[1]})`, `${g[0]}\n(${g[1]})`),
    ...(first ? [L('[Ѣ (ять) reads as і, the way Ukrainian says it: хлѣбъ, хліб. Ъ at the end of a word is silent. Read slowly, and much of it sounds like Ukrainian spoken by a very old grandfather.]', '[Ѣ (ять) читається як і, по-українському: хлѣбъ — хліб. Ъ у кінці слова не вимовляється. Читай повільно, і багато що звучатиме, як українська дуже старого дідуся.]')] : []),
    ...fresh.map(w => { const c = CSL[csIdx(w)]; return L(`[Church Slavonic: ${c[0]}, "${c[1]}" (in Ukrainian: ${c[2]}). It goes on the ЦЕРКВА page of your словник.]`, `[Церковнослов\'янське слово: ${c[0]} — ${c[2]}. Воно тепер у словнику, на сторінці ЦЕРКВА.]`); }),
    ...(fresh.length ? [] : [L('[You have read this verse before. The words are already in your словник.]', '[Цей вірш ти вже читав. Слова вже є у словнику.]')])]);
  return true;
};
function renderCS(scroll) {
  dxList.innerHTML = '';
  D.rows.forEach((k, n) => {
    const b = document.createElement('button'); b.type = 'button';
    const known = heardCS(CSL[k][0]);
    b.className = 'dx-row' + (known ? '' : ' unk') + (n === D.sel ? ' sel' : '');
    b.innerHTML = `<span class="n">${String(k + 1).padStart(2, '0')}</span><span class="w">${known ? esc(CSL[k][0]) : '???'}</span><span></span>`;
    b.addEventListener('click', () => { D.sel = n; renderDex(false); });
    dxList.appendChild(b);
  });
  if (scroll) { const s = dxList.querySelector('.sel'); if (s) s.scrollIntoView({ block: 'nearest' }); }
  const c = CSL[D.rows[D.sel]];
  const where = Object.keys(GOSPEL).find(a => GOSPEL[a][2].includes(c[0]));
  dxCard.innerHTML = heardCS(c[0]) ? `<div class="nm">${esc(c[0])}</div><div class="en">${esc(c[1])} · ${esc(c[2])}</div><div class="ex">${esc(c[3])}</div><div class="meta">Церковнослов'янська: Church Slavonic. A bonus word, not one of the 1,000. From the Gospel in ${esc(AREAS[where].name)}.</div>`
    : `<div class="nm">???</div><div class="meta">A Church Slavonic word you haven't read yet. ${Object.keys(S.cs || {}).length} of ${CSL.length} read. Every church with a lectern has its Gospel open at a different verse.</div>`;
}
