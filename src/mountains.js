// ─── The Carpathians: Synevyr and Hutsulshchyna ───────────────────────────
// Getting there: Svitlana's night train from the Polissia halt, once you hold CARPATHIANS_NEED pysanky.
// Synevyr is the way in. The ґазда at the pass lets nobody further who can't answer him in Hutsul.
const CARPATHIANS_NEED = 9;
Object.assign(ITEMS, {
  sloza: { ua: 'сльоза Синевиру', en: 'a drop of Synevyr', desc: 'Lake water in a tiny bottle, from Syn and Vyr. It is always a little warmer than it should be.' },
  drymba: { ua: 'дримба', en: 'a jaw harp', desc: 'From the wedding musicians. You hold it to your teeth and twang it, and it sounds like a bee telling a joke.' },
  bryndza: { ua: 'грудка бриндзи', en: 'a lump of bryndza', desc: 'Sheep\'s cheese from the polonyna, salty and crumbly. Stepan wrapped it in a leaf.' },
  zhyvavatra: { ua: 'жива ватра', en: 'the living fire', desc: 'Fire the molfar made the old way, by rubbing wood on wood. It burns in a clay pot and never goes out.' },
  kalendar: { ua: 'гуцульський календар', en: 'the molfar\'s calendar stick', desc: 'A stick notched with every day of the year. The feast days have little crosses. It still smells of magpie.' },
});

// ─── Hutsul words: a bonus page of the словник ────────────────────────────
// [word, English, a note]. You hear them in the mountains; each new one goes in the ГОВІРКА page.
const DIALECT = [
  ['ґазда', 'the master of a house', 'A Hutsul who keeps his household well. "A proper ґазда" is the highest praise there is.'],
  ['ґаздиня', 'the mistress of a house', 'She runs the house, the garden, the money and, quietly, the ґазда.'],
  ['ґражда', 'a Hutsul homestead', 'House, barn and sheds built round a yard and closed in like a little fortress, against wolves and winter.'],
  ['ватра', 'a fire, a campfire', 'On the polonyna the shepherds keep a living fire burning all summer long.'],
  ['кресаня', 'a Hutsul hat', 'Black felt, a narrow brim, and feathers or a band of beads.'],
  ['бриндза', 'sheep\'s cheese', 'Salty and crumbly, kept all winter in a wooden бербениця.'],
  ['трембіта', 'the trembita', 'A wooden horn three or four metres long. It calls the shepherds, announces weddings and mourns the dead.'],
  ['файний', 'fine, beautiful, good', 'Файно: nicely. Hutsuls say it about everything they like.'],
  ['леґінь', 'a young man, a lad', 'An unmarried young man. Standard Ukrainian: хлопець.'],
  ['ади', 'look!', 'Hutsul for дивись!'],
  ['нині', 'today', 'Нині = сьогодні.'],
  ['колиба', 'a shepherds\' hut', 'On the polonyna, where the shepherds sleep and make cheese.'],
  ['ватаг', 'the head shepherd', 'He runs the polonyna all summer: sheep, men and fire.'],
  ['бануш', 'banush', 'Cornmeal cooked in cream over the fire, eaten with bryndza and crackling.'],
  ['бербениця', 'a wooden keg', 'For keeping bryndza through the winter.'],
  ['кептар', 'a sheepskin waistcoat', 'Embroidered, with tassels and little mirrors.'],
  ['черес', 'a wide leather belt', 'A Hutsul man\'s belt, as wide as a hand, with brass studs.'],
  ['ґердан', 'a beaded necklace', 'A band of tiny glass beads, worn by Hutsul girls.'],
  ['плай', 'a mountain path', 'A path along a ridge, worn by sheep and people.'],
  ['мольфар', 'a molfar', 'A Hutsul sorcerer who talks to the weather. Not a witch: witches are somebody else.'],
];
const dialIdx = w => DIALECT.findIndex(d => d[0] === w);
const heardDial = w => !!(S.d && S.d[w]);
// the first time you hear Hutsul words, a note says what they mean
function hu(...ws) {
  const out = [];
  for (const w of ws) {
    if (heardDial(w)) continue;
    S.d = S.d || {}; S.d[w] = 1;
    const d = DIALECT[dialIdx(w)];
    out.push(L(`[A Hutsul word: ${w}, ${d[1]}. It goes on the ГОВІРКА page of your словник.]`, `[Гуцульське слово: ${w}. Воно тепер у твоєму словнику, на сторінці ГОВІРКА.]`));
  }
  if (out.length) saveSoon();
  return out;
}
function renderDial(scroll) {
  dxList.innerHTML = '';
  D.rows.forEach((k, n) => {
    const b = document.createElement('button'); b.type = 'button';
    const known = heardDial(DIALECT[k][0]);
    b.className = 'dx-row' + (known ? '' : ' unk') + (n === D.sel ? ' sel' : '');
    b.innerHTML = `<span class="n">${String(k + 1).padStart(2, '0')}</span><span class="w">${known ? esc(DIALECT[k][0]) : '???'}</span><span></span>`;
    b.addEventListener('click', () => { D.sel = n; renderDex(false); });
    dxList.appendChild(b);
  });
  if (scroll) { const s = dxList.querySelector('.sel'); if (s) s.scrollIntoView({ block: 'nearest' }); }
  const k = D.rows[D.sel], d = DIALECT[k];
  dxCard.innerHTML = heardDial(d[0]) ? `<div class="nm">${esc(d[0])}</div><div class="en">${esc(d[1])}</div><div class="ex">${esc(d[2])}</div><div class="meta">Гуцульська говірка: Hutsul dialect. A bonus word, not one of the 1,000.</div>`
    : `<div class="nm">???</div><div class="meta">A Hutsul word you haven't heard yet. ${Object.keys(S.d || {}).length} of ${DIALECT.length} heard. Listen to the people of the mountains.</div>`;
}

// ─── Ivanka teaches, the ґазда tests ──────────────────────────────────────
// S.f.hutsul: 1 Ivanka taught you, 2 Mytro let you through the pass
const HUTSUL_TEST = [
  ['Ади, який ___ леґінь прийшов!', 'Look, what a fine lad has come!', ['файний', 'бриндза', 'ватра'], 0, 'файний: fine, handsome, good.'],
  ['Я тут ___, а це моя ґражда.', 'I\'m the master here, and this is my homestead.', ['ґазда', 'кресаня', 'трембіта'], 0, 'ґазда: the master of a household.'],
  ['Увечері вівчарі палять ___.', 'In the evening the shepherds light a fire.', ['ватру', 'кресаню', 'ґражду'], 0, 'ватра: a fire. Палити ватру: to light a fire.'],
  ['На голові в нього ___ з пір\'ям.', 'On his head, a Hutsul hat with feathers.', ['кресаня', 'бриндза', 'ватра'], 0, 'кресаня: a Hutsul hat.'],
  ['Нині на полонині їмо бануш із ___.', 'Today on the polonyna we\'re eating banush with sheep\'s cheese.', ['бриндзою', 'трембітою', 'ґраждою'], 0, 'бриндза: sheep\'s cheese.'],
  ['Як заграє ___, чути на всі гори.', 'When the trembita plays, every mountain hears it.', ['трембіта', 'кресаня', 'ґазда'], 0, 'трембіта: the long wooden horn.'],
  ['Наша ___ — як фортеця: хата, стайня і двір за одним муром.', 'Our homestead is like a fortress: house, stable and yard behind one wall.', ['ґражда', 'ватра', 'бриндза'], 0, 'ґражда: a Hutsul homestead.'],
  ['Той ___ ще не жонатий, дівки за ним бігають.', 'That lad isn\'t married yet; the girls run after him.', ['леґінь', 'бриндза', 'ватра'], 0, 'леґінь: a young man, a lad.'],
];
function ivankaTalk(npc, done) {
  const n = npc.name, h = S.f.hutsul || 0;
  const lesson = () => [L('Ґазда: the master of the house. Ґражда: his homestead, closed in like a fortress.', 'Ґазда — господар. Ґражда — його обійстя, закрите, як фортеця.'),
    L('Ватра: a fire. Кресаня: his hat. Бриндза: sheep\'s cheese. Трембіта: the long horn.', 'Ватра — вогонь. Кресаня — капелюх. Бриндза — овечий сир. Трембіта — довгий ріг.'),
    L('Файний: fine, lovely. And леґінь: a lad. That\'s what he\'ll call you, if he likes you.', 'Файний — гарний. А леґінь — хлопець. Так він тебе назве, якщо ти йому сподобаєшся.')];
  if (h >= 2) return say(n, [L('Mytro let you through? Файно! Say hello to Verkhovyna for me. Tell my mama I\'m eating.', 'Митро тебе пропустив? Файно! Передавай привіт Верховині. Скажи мамі, що я їм.')], done);
  if (h === 1) return say(n, [L('Forgot already? Here, again:', 'Уже забув? Ось іще раз:'), ...lesson(), L('Then go and talk to Mytro at the pass, east of the lake.', 'А тоді йди до Митра на перевалі, на схід від озера.')], done);
  if (!S.f.book) return say(n, [L('I\'m Ivanka, from Verkhovyna. I\'m staying with my baba for the summer. It\'s very quiet. The lake cries a bit at night.', 'Я Іванка, з Верховини. Гощу в баби на літо. Тут дуже тихо. Озеро вночі трохи плаче.')], done);
  S.f.hutsul = 1; saveSoon();
  say(n, [L('You want to go over the pass to Verkhovyna? Then you\'ll have to get past Mytro. He\'s a ґазда from our village, and he\'s stubborn as a goat.', 'Хочеш через перевал на Верховину? Тоді тобі треба пройти повз Митра. Він ґазда з нашого села, і впертий, як цап.'),
    L('He won\'t let a stranger through unless they answer him in his own speech. Гуцульська говірка: the Hutsul way of talking. It\'s Ukrainian, only older, and with more mountains in it.', 'Він не пропускає чужих, поки ті не відповідять його мовою. Гуцульська говірка. Це українська, тільки старша, і в ній більше гір.'),
    L('I\'ll teach you the words he\'ll use. Listen:', 'Я навчу тебе слів, які він казатиме. Слухай:'), ...lesson(),
    ...hu('ґазда', 'ґражда', 'ватра', 'кресаня', 'бриндза', 'трембіта', 'файний', 'леґінь'),
    L('Now go and talk to him. He\'s at the pass, east of the lake. And don\'t laugh at his hat.', 'А тепер іди до нього. Він на перевалі, на схід від озера. І не смійся з його кресані.')], done);
}
function mytroTalk(npc, done) {
  const n = npc.name, h = S.f.hutsul || 0;
  if (h >= 2) return say(n, [L('Файно, леґіню! Go on, Verkhovyna is that way. Tell them Mytro sent you.', 'Файно, леґіню! Іди, Верховина он там. Скажи, що тебе Митро прислав.')], done);
  if (h === 0) return say(n, ['Ади! Ци ти ґазда, ци ні? Відки йдеш, леґіню? Нині плай мокрий, ватра на полонині погасла, а ти тут ходиш...',
    L('[You catch about one word in five. The girl by the lake, Ivanka, might help.]', '[Ти розумієш хіба одне слово з п\'яти. Може, допоможе дівчина біля озера, Іванка.]'), ...hu('ади', 'нині', 'плай')], done);
  say(n, [L('So. You want to go up to Verkhovyna. Talk to me the way we talk, and you\'ll pass. Eight words. Get six right.', 'Ну. Хочеш на Верховину. Говори зі мною по-нашому, і пройдеш. Вісім слів. Шість правильних.'), ...hu('ади', 'нині', 'плай')], null, yesNo(go => {
    if (!go) return say(n, [L('Then stand there. The mountains are patient.', 'То стій. Гори терплячі.')], done);
    roadQuiz(shuffle(HUTSUL_TEST.slice()), 'ГОВІРКА', q => {
      if (q.stopped) return say(n, [L('Giving up? A Hutsul never gives up. He just has a rest.', 'Здаєшся? Гуцул ніколи не здається. Він просто відпочиває.')], done);
      if (q.score < 6) return say(n, [L(`${q.score} of 8. Ha! You talk like a lowlander. Go back to Ivanka.`, `${q.score} з 8. Ха! Говориш, як долинянин. Вертайся до Іванки.`)], done);
      S.f.hutsul = 2; saveSoon(); sfx('badge');
      say(n, [L(`${q.score} of 8! Ади, файний леґінь! You talk like you were born in a ґражда.`, `${q.score} з 8! Ади, файний леґінь! Говориш, ніби в ґражді народився.`),
        L('Go through. And every Hutsul word you hear up there, keep it. They\'re getting rare. Somebody\'s been sweeping them away.', 'Іди. І кожне гуцульське слово, що почуєш там, бережи. Їх меншає. Хтось їх вимітає.')], done);
    }, ['ГОВІРКА', 'Гуцульська говірка', 'Hutsul words', 'Which word fits?'], 18);
  }));
}
EXIT_LOCK['synevyr>verkhovyna'] = () => {
  if ((S.f.hutsul || 0) >= 2) return false;
  turnBack();
  const m = entities.find(e => e.id === 'mytro');
  if (m) { curSpeaker = m; mytroTalk(m, () => {}); }
  return true;
};

// ─── Syn and Vyr ──────────────────────────────────────────────────────────
// Vyr, a count's daughter, loved Syn, a shepherd. Her father had a rock dropped on him. She wept, and her tears became the lake.
// S.f.synvyr: 1 Vyr gave you her message, 2 you said it to Syn, 3 you brought his answer back, 4 they're together.
const VYR_WORDS = [
  ['Скажи йому, що я його досі ___.', 'Tell him I still love him.', ['кохаю', 'кохала', 'кохав'], 0, 'Still, now: the present tense. Я кохаю. Кохати: to love, as in love.'],
  ['Без нього я ___ така сумна.', 'Without him I was so sad.', ['була', 'був', 'було'], 0, 'The past tense agrees with who is speaking. A woman: я була. A man: я був.'],
  ['Я так ___, що з моїх сліз стало озеро.', 'I cried so much that my tears became a lake.', ['плакала', 'плакав', 'плакало'], 0, 'A woman says я плакала. Past tense: -в for him, -ла for her, -ло for it, -ли for them.'],
  ['Мені без нього ___.', 'I\'m sad without him.', ['сумно', 'сумна', 'сумний'], 0, 'How you feel: мені + a word in -о. Мені сумно, мені холодно, мені добре.'],
  ['Я хочу бути разом із ___.', 'I want to be together with him.', ['ним', 'він', 'його'], 0, 'З (with) + the instrumental: він → з ним. Ти з нею, ми з ними.'],
];
const SYN_WORDS = [
  ['Скажи їй, що я її ___ і досі.', 'Tell her I love her still.', ['люблю', 'любив', 'любила'], 0, 'Still, now: the present. Я люблю. (Любити is for people, places and borshch; кохати only for people.)'],
  ['Коли вона була поруч, я ___ щасливий.', 'When she was near, I was happy.', ['був', 'була', 'були'], 0, 'A man says я був. She says я була.'],
  ['Я щодня ___ її усмішку, як сонце.', 'Every day I remembered her smile, like the sun.', ['згадував', 'згадувала', 'згадувало'], 0, 'He: згадував. She would say згадувала.'],
  ['Мені з нею завжди було ___.', 'With her I always felt good.', ['добре', 'добрий', 'добра'], 0, 'Мені + -о for a feeling: мені добре. In the past: мені було добре.'],
  ['Хай прийде, і ми знову ___ сміятися.', 'Let her come, and we\'ll laugh again.', ['будемо', 'були', 'було'], 0, 'One way to make the future: буду, будеш, будемо + the infinitive. Ми будемо сміятися.'],
];

const synStep = () => S.f.synvyr || 0;
function vyrTalk(npc, done) {
  const n = npc.name, s = synStep();
  if (!S.f.book) return say(n, [L('[A girl made of mist stands at the water\'s edge, looking at the island.]', '[Біля води стоїть дівчина з туману й дивиться на острів.]')], done);
  if (s === 0) {
    S.f.synvyr = 1; saveSoon();
    return say(n, [L('You can see me? Then you\'re the first in three hundred years. I am Vyr.', 'Ти мене бачиш? Тоді ти перший за триста років. Я Вир.'),
      L('My father was a count, and I loved a shepherd, Syn. My father didn\'t like that. His men dropped a rock on Syn, up on the slope.', 'Мій батько був графом, а я кохала пастуха, Синя. Батькові це не сподобалося. Його люди скинули на Синя камінь, там, на схилі.'),
      L('I cried until the valley filled. This lake is my tears. He lies under the island, and I can\'t cross my own tears to him.', 'Я плакала, доки долина не наповнилася. Це озеро — мої сльози. Він лежить під островом, а я не можу перейти через свої власні сльози до нього.'),
      L('His raft is by the shore. Row over and tell him my words. In Ukrainian, the way I said them: he never learned anything else.', 'Його пліт біля берега. Попливи і скажи йому мої слова. Українською, як я їх сказала: іншої мови він так і не вивчив.'),
      L('Tell him: I still love him. Without him I was so sad. I cried so much my tears became a lake. I\'m sad without him. I want to be together with him.', 'Скажи йому: я його досі кохаю. Без нього я була така сумна. Я так плакала, що з моїх сліз стало озеро. Мені без нього сумно. Я хочу бути разом із ним.'),
      L('[Say it as SHE said it. A woman says я була, я плакала. A man would say я був, я плакав.]', '[Перекажи так, як сказала ВОНА. Жінка каже: я була, я плакала. Чоловік сказав би: я був, я плакав.]')], done);
  }
  if (s === 1) return say(n, [L('Tell him. Please. The raft is south of the island.', 'Скажи йому. Прошу. Пліт на південь від острова.'),
    L('I still love him. Without him I was so sad. I cried so much my tears became a lake. I\'m sad without him. I want to be together with him.', 'Я його досі кохаю. Без нього я була така сумна. Я так плакала, що з моїх сліз стало озеро. Мені без нього сумно. Я хочу бути разом із ним.')], done);
  if (s === 2) return say(n, [L('You\'ve seen him? What did he say? Tell me exactly.', 'Ти його бачив? Що він сказав? Скажи точно.')], () =>
    roadQuiz(SYN_WORDS.slice(), 'СИН', q => {
      if (q.stopped) return done();
      if (q.score < 4) return say(n, [L(`That doesn't sound like Syn. ${q.score} of 5. Go and ask him again, and listen properly.`, `Це не схоже на Синя. ${q.score} з 5. Попливи й спитай іще раз, і слухай уважно.`)], () => { S.f.synvyr = 1; saveSoon(); done(); });
      S.f.synvyr = 3; saveSoon(); sfx('ok');
      say(n, [L('He still... after three hundred years.', 'Він досі... через триста років.'),
        L('Then take me across. You\'re alive: the water will let you carry me. Go to the raft, and I\'ll be with you.', 'Тоді перевези мене. Ти живий, і вода дозволить тобі мене перевезти. Іди до плоту, а я буду з тобою.')], done);
    }, ['СИН', 'Синові слова', 'Syn\'s answer', 'What did Syn say?'], 18));
  if (s === 3) return say(n, [L('To the raft. I\'m right behind you.', 'До плоту. Я за тобою.')], done);
  done();
}
function synTalk(npc, done) {
  const n = npc.name, s = synStep();
  const test = () => keeperTalk(18, [L('Love, friends, feelings. Кохання, друзі, щастя, сум. I had three hundred years to think about every one of them.', 'Кохання, друзі, щастя, сум. Я мав триста років, щоб подумати про кожне з них.')])(npc, done);
  const chat = () => say(n, [L('I am Syn. I was a shepherd. I had a sopilka, a dog and a girl who was far too good for me.', 'Я Синь. Я був пастухом. Мав сопілку, собаку і дівчину, занадто добру для мене.')], done);
  const msg = () => {
    if (s !== 1) return chat();
    say(n, [L('You\'ve come from the shore? From... her? What did she say?', 'Ти з берега? Від... неї? Що вона сказала?')], () =>
      roadQuiz(VYR_WORDS.slice(), 'ВИР', q => {
        if (q.stopped) return done();
        if (q.score < 4) return say(n, [L(`${q.score} of 5. That isn't how she talks. Go back and hear her again.`, `${q.score} з 5. Вона так не говорить. Вертайся й послухай її ще раз.`)], done);
        S.f.synvyr = 2; saveSoon(); sfx('ok');
        say(n, [L('[The ghost is quiet for a long time. The water round the island goes very still.]', '[Привид довго мовчить. Вода довкола острова зовсім затихає.]'),
          L('Then tell her this: I love her still. When she was near, I was happy. Every day I remembered her smile, like the sun. With her I always felt good. Let her come, and we\'ll laugh again.', 'Тоді скажи їй: я її люблю і досі. Коли вона була поруч, я був щасливий. Я щодня згадував її усмішку, як сонце. Мені з нею завжди було добре. Хай прийде, і ми знову будемо сміятися.'),
          L('[Say it as HE said it. He\'s a man, so: я був, я згадував. Vyr would say я була.]', '[Перекажи так, як сказав ВІН. Він чоловік, тож: я був, я згадував. Вир сказала б: я була.]'),
          L('[Remember it exactly. She\'ll want to know.]', '[Запам\'ятай точно. Вона захоче знати.]')], done);
      }, ['ВИР', 'Слова Вир', 'Vyr\'s words', 'What did Vyr say?'], 18));
  };
  if (!S.f.book) return chat();
  const opts = [L('Your test', 'Ваше випробування'), L('Vyr\'s message', 'Слова Вир'), L('Row back', 'Пливти назад')];
  say(n, [L(s >= 4 ? 'We\'re together. Thank you. What do you need?' : 'A living person, on my island. What do you need?', s >= 4 ? 'Ми разом. Дякую. Чого тобі треба?' : 'Жива людина на моєму острові. Чого тобі треба?')], null,
    menu(opts, i => i === 0 ? test() : i === 1 ? msg() : (done(), rowBack())));
}
const onIsland = () => area === 'synevyr' && player.ty <= 12 && player.tx >= 19 && player.tx <= 25;
function rowTo(x, y, dir, then) { sfx('door'); warp = { to: { to: 'synevyr', tx: x, ty: y, dir }, fade: 0, dir: 1, then }; }
function rowBack() { rowTo(22, 20, 'down'); }
// the first time you land, say how to get off again
function islandNote() {
  if (S.f.islandNote) return;
  S.f.islandNote = 1; saveSoon();
  say('', [L('[The raft bumps against the island. To row back, face the raft behind you, south, and press Z.]', '[Пліт тикається в острів. Щоб пливти назад, повернися до плоту на півдні й натисни Z.]')]);
}
STORY_LOOK['synevyr:z'] = () => {
  if (onIsland()) { say('', [L('The raft, moored at the island. Row back to the shore?', 'Пліт біля острова. Пливти назад до берега?')], null, yesNo(go => go && rowBack())); return true; }
  const withVyr = synStep() === 3;
  say('', [withVyr ? L('Syn\'s raft. Vyr is standing on it already, light as mist. Row to the island?', 'Пліт Синя. Вир уже стоїть на ньому, легка, як туман. Пливти до острова?')
    : L('A raft of spruce logs, tied to a stake: Syn\'s raft, they say. Row to the island?', 'Пліт зі смерекових колод, прив\'язаний до кілка. Кажуть, це Синів пліт. Пливти до острова?')], null, yesNo(go => {
    if (!go) return;
    rowTo(22, 12, 'up', withVyr ? reunion : islandNote);
  }));
  return true;
};
STORY_LOOK['synevyr:y'] = () => {
  if (!onIsland()) return false;
  say('', [L('A grey stone, half sunk in the island. They say it\'s the one the count\'s men rolled down on Syn. Moss has grown over it like a blanket.', 'Сірий камінь, наполовину в землі. Кажуть, це той, що графові люди скотили на Синя. Мох укрив його, як ковдра.')]);
  return true;
};
STORY_LOOK['synevyr:~'] = () => {
  if (!onIsland()) return false;
  say('', [L('Row back to the shore?', 'Пливти назад до берега?')], null, yesNo(go => go && rowBack()));
  return true;
};
function reunion() {
  S.f.synvyr = 4; saveSoon(); sfx('night');
  say('', [L('[Vyr steps off the raft onto the island. Syn turns round.]', '[Вир сходить із плоту на острів. Синь обертається.]')], () =>
    say('Vyr', [L('Синю.', 'Синю.')], () =>
      say('Syn', [L('Вир. You came.', 'Вир. Ти прийшла.')], () =>
        say('', [L('[For a long moment neither of them says anything. Then they both laugh, at exactly the same time, as if three hundred years were a joke only they had heard.]', '[Довгу мить обоє мовчать. А тоді обоє сміються, рівно в одну мить, ніби триста років — це жарт, який чули тільки вони.]'),
          L('[The lake brightens from the middle outwards, blue as an eye.]', '[Озеро світлішає від середини до берегів, синє, як око.]')], () =>
          say('Vyr', [L('Take this: a drop of the lake. My tears. They\'re not sad any more.', 'Візьми: краплю озера. Мої сльози. Вони вже не сумні.'), give('sloza'),
            L('One more thing. The night the magpies flew over, they were carrying something heavy, east to Chornohora. Words, thousands of them. Somebody\'s filling a nest.', 'І ще одне. Тієї ночі, як летіли сороки, вони несли щось важке, на схід, на Чорногору. Слова, тисячі. Хтось наповнює гніздо.')], done)))));
  function done() {}
}

// the bus to the station, and the night train back
function ferentsTalk(npc, done) {
  say(npc.name, [L('Автобус: the bus. Mine goes to the station, and the night train goes to Polissia. Shall we?', 'Автобус. Мій їде на вокзал, а нічний потяг — на Полісся. Їдемо?')], null, yesNo(go => {
    if (!go) return say(npc.name, [L('I\'ll be here. I\'m always here. The bus is my house.', 'Я буду тут. Я завжди тут. Автобус — мій дім.')], done);
    say('', [L('[The bus rattles down to the valley. That night the train carries you east, out of the mountains, and in the morning the pines of Polissia are at the window.]', '[Автобус деренчить у долину. Уночі потяг везе тебе на схід, геть із гір, а зранку за вікном уже сосни Полісся.]')], () => travel('polissia', 32, 6, 'down'));
  }));
}
function trainTalk(npc, done) {
  const n = npc.name;
  const chat = () => say(n, [L('Потяг: the train. Провідниця: the conductor, that\'s me. Tea in a glass holder, clean sheets, and no singing after midnight.', 'Потяг. Провідниця — це я. Чай у підсклянниках, чисті простирадла і ніяких пісень після півночі.')], done);
  if (!S.f.book) return chat();
  if (badgeCount() < CARPATHIANS_NEED) return say(n, [L('The night train west, to the mountains. I don\'t let tourists on. Tourists sing.', 'Нічний потяг на захід, у гори. Туристів я не пускаю. Туристи співають.'),
    L(`Come back with ${CARPATHIANS_NEED} pysanky and I'll find you a berth. You have ${badgeCount()}.`, `Приходь, коли матимеш ${CARPATHIANS_NEED} писанок, і я знайду тобі полицю. У тебе ${badgeCount()}.`)], done);
  say(n, [L('To the mountains? Ticket... no ticket. Fine. Sit by the window. Tea is twelve hryvnias, sugar is free.', 'У гори? Квиток... нема квитка. Гаразд. Сідай біля вікна. Чай дванадцять гривень, цукор безкоштовно.')], null, yesNo(go => {
    if (!go) return say(n, [L('The train leaves when I blow the whistle. I haven\'t blown it.', 'Потяг рушає, коли я свищу. Я ще не свистіла.')], done);
    say('', [L('[All night the train rocks west. Somewhere past midnight the land starts to rise. At dawn there are mountains at the window, and fog in the valleys like milk in a bowl.]', '[Цілу ніч потяг гойдається на захід. Десь після півночі земля починає підійматися. На світанку за вікном гори, а в долинах туман, як молоко в мисці.]'),
      L('[A bus, a winding road, and a last walk up through the spruces. Then, all at once, the lake.]', '[Автобус, звивиста дорога, і ще трохи пішки вгору між смереками. І раптом — озеро.]')], () => travel('synevyr', 22, 30, 'up'));
  }));
}

// ─── Verkhovyna: the wedding without music ────────────────────────────────
// S.f.ves: 1 Petro asked you, 2 the wedding has its music. S.f.muz: bits, which musicians remember their tune.
const MUSICIANS = {
  mykhailo: [1, [['Ой заграй ми, скрипалику, на своїй ___,', 'Oh play for me, fiddler, on your fiddle,', ['скрипці', 'гітарі', 'фортепіано'], 0, 'скрипка: a fiddle. Скрипаль: a fiddler.'],
    ['Бо я хочу ___ з леґінем до ранку.', 'Because I want to dance with my lad till morning.', ['танцювати', 'малювати', 'слухати'], 0, 'танцювати: to dance. Танець, танці: a dance, dances.']]],
  vasylyna: [2, [['Як заграють цимбали, ноги самі ___.', 'When the tsymbaly play, your feet dance by themselves.', ['танцюють', 'малюють', 'слухають'], 0, 'цимбали: a hammered dulcimer, the heart of a Hutsul band.'],
    ['А як ___ співачка, плачуть навіть гори.', 'And when the singer sings, even the mountains weep.', ['заспіває', 'намалює', 'послухає'], 0, 'співати, заспівати: to sing. Співачка: a singer.']]],
  hryts: [4, [['Нині в нас ___, гуляє все село!', 'Today we have a wedding, and the whole village is celebrating!', ['весілля', 'концерт', 'серіал'], 0, 'весілля: a wedding.'],
    ['Хай ця ___ весела на всі гори лине.', 'Let this merry song fly over all the mountains.', ['пісня', 'газета', 'картина'], 0, 'пісня, пісні: a song, songs.']]],
};
const muzBits = () => S.f.muz || 0;
function musicianTalk(id, intro, chat) {
  return (npc, done) => {
    const n = npc.name, [bit, verse] = MUSICIANS[id];
    if ((S.f.ves || 0) !== 1 || (muzBits() & bit)) return say(n, chat, done);
    say(n, intro, null, yesNo(go => {
      if (!go) return say(n, [L('Then I\'ll sit here and be quiet. It\'s all I can do.', 'Тоді я посиджу тут і помовчу. Більше нічого не вмію.')], done);
      roadQuiz(verse.slice(), 'КОЛОМИЙКА', q => {
        if (q.stopped || q.score < 2) return say(n, [L('No, that\'s not it. It doesn\'t scan. Try again.', 'Ні, не так. Не лягає в такт. Спробуй ще.')], done);
        S.f.muz = muzBits() | bit; saveSoon(); sfx('ok');
        say(n, [L('That\'s it! That\'s the tune! [The music comes back all at once, like water into a dry stream.] I\'ll be at the wedding.', 'Оце воно! Оце мелодія! [Музика вертається одразу, як вода в сухий потік.] Я буду на весіллі.')], done);
      }, ['КОЛОМИЙКА', 'Гуцульська пісня', 'a kolomyika', 'Which word finishes the verse?'], 15);
    }));
  };
}
function petroTalk(npc, done) {
  const n = npc.name, v = S.f.ves || 0;
  if (v >= 2) return say(n, [L('Best wedding in a hundred years! Even the trembita cried. Come and dance the аркан!', 'Найкраще весілля за сто років! Навіть трембіта плакала. Ходи танцювати аркан!')], done);
  if (!S.f.book) return say(n, [L('I\'m getting married! Today! Probably!', 'Я женюся! Нині! Мабуть!'), ...hu('нині')], done);
  if (v === 0) {
    S.f.ves = 1; saveSoon();
    return say(n, [L('Слава Ісусу Христу! I\'m Petro, and today I marry Paraska. Or I would, if we had any music.', 'Слава Ісусу Христу! Я Петро, і нині я женюся з Параскою. Женився б, якби була музика.'),
      L('Last night a wind came down off Chornohora, cold as a cellar. In the morning our троїсті музики had forgotten every tune they ever knew. The fiddler, the tsymbaly, the drum.', 'Минулої ночі з Чорногори прийшов вітер, холодний, як льох. Зранку наші троїсті музики забули всі мелодії, які знали. Скрипка, цимбали, бубон.'),
      L('A Hutsul wedding without music isn\'t a wedding. It\'s just a lot of people eating. Help them remember, please.', 'Гуцульське весілля без музики — не весілля. Це просто багато людей, що їдять. Допоможи їм згадати, прошу.'),
      L('Mykhailo the fiddler is in the korchma. Vasylyna and her tsymbaly are at home, by the north road. Hryts the drummer is asleep by the river, probably.', 'Скрипаль Михайло в корчмі. Василина з цимбалами вдома, біля північної дороги. Бубніст Гриць спить біля річки, мабуть.'),
      ...hu('кептар', 'черес')], done);
  }
  if (muzBits() !== 7) return say(n, [L(`${[1, 2, 4].filter(b => muzBits() & b).length} of 3 musicians have their tunes back. Mykhailo in the korchma, Vasylyna at home, Hryts by the river.`, `${[1, 2, 4].filter(b => muzBits() & b).length} з 3 музик згадали мелодії. Михайло в корчмі, Василина вдома, Гриць біля річки.`)], done);
  S.f.ves = 2; saveSoon(); sfx('badge');
  say(n, [L('They\'re all here? All three? Then... Did Yura! The trembita!', 'Усі тут? Усі троє? Тоді... Діду Юро! Трембіту!')], () =>
    say('', [L('[Did Yura lifts the trembita, and a long low note rolls across the valley and up every slope. Somewhere on the polonyna, the sheep look up.]', '[Дід Юра підносить трембіту, і довгий низький звук котиться долиною і на кожен схил. Десь на полонині вівці підводять голови.]'),
      L('[Then the fiddle, the tsymbaly and the drum all start at once, and the whole village is suddenly dancing the аркан round the fire, arms on each other\'s shoulders, faster and faster.]', '[А тоді скрипка, цимбали й бубон починають разом, і все село раптом танцює аркан довкола ватри, руки одне одному на плечі, швидше і швидше.]')], () =>
      say('Paraska', [L('Thank you! Here, from the musicians: a дримба. Put it to your teeth and twang it. Everybody\'s first try sounds like a goat.', 'Дякуємо! Ось тобі від музик: дримба. Приклади до зубів і бринькни. У всіх перший раз виходить, як у кози.'), give('drymba'), ...hu('ґердан')], done)));
}
function yuraTalk(npc, done) {
  const n = npc.name;
  const test = () => keeperTalk(15, [L('Music, songs, dances, weddings. Пісня, танець, скрипка, весілля. A Hutsul is born to music, marries to music and is buried to music.', 'Музика, пісні, танці, весілля. Пісня, танець, скрипка, весілля. Гуцул під музику народжується, під музику жениться і під музику його ховають.')])(npc, done);
  const chat = () => say(n, [L('Трембіта: three metres of spruce struck by lightning. Only that kind sings properly.', 'Трембіта — це три метри смереки, в яку влучила блискавка. Тільки така співає як слід.'),
    L('It calls the shepherds down from the polonyna. It says: a wedding. It says: somebody has died. It doesn\'t say anything twice.', 'Вона кличе вівчарів із полонини. Вона каже: весілля. Вона каже: хтось помер. Двічі вона нічого не каже.'), ...hu('трембіта', 'ґазда')], done);
  if (!S.f.book) return chat();
  say(n, [L('Слава Ісусу! What do you want, леґіню?', 'Слава Ісусу! Чого хочеш, леґіню?')], null, menu([L('Your test', 'Ваше випробування'), L('Just chatting', 'Просто поговорити')], i => i === 0 ? test() : chat()));
}

// ─── The polonyna: the fire that went out ─────────────────────────────────
// S.f.vatra: 1 Stepan told you, 2 the living fire burns again, 3 you've cooked the shepherds' supper
const SUPPER = [
  ['Нині на вечерю — бануш із ___.', 'Tonight, for supper: banush with bryndza.', ['бриндзою', 'бриндза', 'бриндзу'], 0, 'З (with) + the instrumental: бриндза → з бриндзою.'],
  ['Помішуй кашу дерев\'яною ___.', 'Stir the porridge with a wooden spoon.', ['ложкою', 'ложка', 'ложку'], 0, 'What you do something with takes the instrumental, no preposition: ложка → ложкою.'],
  ['Бриндзу ріж гострим ___.', 'Cut the bryndza with a sharp knife.', ['ножем', 'ніж', 'ножа'], 0, 'Ніж → ножем. Masculine nouns take -ом or -ем.'],
  ['Їж ___, а не руками!', 'Eat with a fork, not with your hands!', ['виделкою', 'виделка', 'виделку'], 0, 'Виделка → виделкою. And the plural: руки → руками.'],
  ['Додай трохи ___, але не багато.', 'Add a little salt, but not much.', ['солі', 'сіль', 'сіллю'], 0, 'Трохи (a little) and багато (a lot) take the genitive: сіль → солі.'],
  ['Накрий казан ___, щоб не вистиг.', 'Cover the pot with a lid so it doesn\'t go cold.', ['кришкою', 'кришка', 'кришку'], 0, 'With what? Кришка → кришкою.'],
  ['Ватаг вечеряє з ___.', 'The vatah has supper with the shepherds.', ['вівчарями', 'вівчарі', 'вівчарів'], 0, 'З (together with) + the instrumental plural: вівчарі → з вівчарями.'],
  ['Ох і смачна ___! Як у мами!', 'What a delicious dish! Like mum\'s!', ['страва', 'страву', 'стравою'], 0, 'Just naming it: the nominative, the dictionary form. Смачна страва. Смачного!: enjoy your meal!'],
];
const vatraStep = () => S.f.vatra || 0;
function stepanTalk(npc, done) {
  const n = npc.name, v = vatraStep();
  const test = () => keeperTalk(16, [L('Food. Breakfast, lunch, supper, and what\'s on the spoon. Сніданок, обід, вечеря. Up here you think about food the whole day.', 'Їжа. Сніданок, обід, вечеря, і що на ложці. Тут нагорі про їжу думаєш цілий день.')])(npc, done);
  const chat = () => say(n, [L('I\'m the ватаг: the head shepherd. Three hundred sheep, eight shepherds, two dogs and one fire. The fire is the most important.', 'Я ватаг. Триста овець, восьмеро вівчарів, двоє псів і одна ватра. Ватра найважливіша.'), ...hu('ватаг', 'колиба')], done);
  const fire = () => {
    if (v === 0) {
      S.f.vatra = 1; saveSoon();
      return say(n, [L('Look at it. Our ватра. We lit it in May the old way, wood on wood, and it\'s meant to burn till we go down in September. If it goes out, the summer goes wrong.', 'Подивися. Наша ватра. Ми запалили її в травні по-старому, деревом об дерево, і вона мала горіти, доки не зійдемо у вересні. Як погасне, усе літо піде шкереберть.'),
        L('Two nights ago a black wind came over from Chornohora, smelling of soot and brooms. In the morning: ash. The sheep won\'t eat, the milk won\'t turn, and we\'ve had no hot supper since.', 'Дві ночі тому з Чорногори налетів чорний вітер, пахло сажею і мітлами. Зранку — попіл. Вівці не їдять, молоко не кисне, і гарячої вечері відтоді нема.'),
        L('A match won\'t do. It has to be living fire, made the old way. Only the molfar on Chornohora still knows how. East, up the plai.', 'Сірник не годиться. Треба живої ватри, по-старому. Це вміє тільки мольфар на Чорногорі. На схід, угору плаєм.'), ...hu('ватра', 'мольфар', 'плай')], done);
    }
    if (v === 1) return say(n, [has('zhyvavatra') ? L('You have it? The living fire? Then put it in the ashes, quick!', 'Маєш? Живу ватру? То клади її в попіл, швидко!') : L('The molfar\'s hut is on Chornohora, east of here. Bring the living fire.', 'Хата мольфара на Чорногорі, на схід звідси. Принеси живу ватру.')], done);
    if (v === 2) return say(n, [L('The fire\'s back, and the boys are starving. Help me with the supper? I\'ll tell you what to do, you hand me the right things.', 'Ватра горить, а хлопці голодні. Поможеш із вечерею? Я казатиму, що робити, а ти подавай, що треба.'),
      L('[With a spoon, with a knife, with cheese: with takes the instrumental. Ложка → ложкою, ніж → ножем, бриндза → з бриндзою.]', '[Ложкою, ножем, з бриндзою: «чим?» і «з чим?» — орудний відмінок.]')], null, yesNo(go => {
      if (!go) return say(n, [L('Then the boys eat grass, like the sheep.', 'Тоді хлопці їстимуть траву, як вівці.')], done);
      roadQuiz(shuffle(SUPPER.slice()).slice(0, 6), 'ВЕЧЕРЯ', q => {
        if (q.stopped) return say(n, [L('Leaving the pot? It\'ll burn.', 'Кидаєш казан? Пригорить.')], done);
        if (q.score < 5) return say(n, [L(`${q.score} of 6. You put sugar in the banush. Again, from the start.`, `${q.score} з 6. Ти поклав у бануш цукор. Ще раз, спочатку.`)], done);
        S.f.vatra = 3; saveSoon(); sfx('badge');
        say(n, [L(`${q.score} of 6! Смачного, boys!`, `${q.score} з 6! Смачного, хлопці!`),
          L('[Eight shepherds eat in silence, which on a polonyna means it\'s very good.]', '[Восьмеро вівчарів їдять мовчки, а на полонині це означає, що дуже смачно.]'),
          L('Take some bryndza. From the бербениця, the good one. You\'ve earned it.', 'Візьми бриндзи. З бербениці, з доброї. Ти заробив.'), give('bryndza'), ...hu('бануш', 'бербениця', 'бриндза')], done);
      }, ['ВЕЧЕРЯ', 'Бануш із бриндзою', 'the shepherds\' supper', 'What does Stepan need?'], 16);
    }));
    say(n, [L('The fire\'s burning and the boys are fed. The summer\'s put right.', 'Ватра горить, хлопці ситі. Літо знову як слід.')], done);
  };
  if (!S.f.book) return chat();
  say(n, [L('Слава Ісусу! What is it?', 'Слава Ісусу! Що таке?')], null, menu([L('Your test', 'Ваше випробування'), L('The fire', 'Ватра'), L('Just chatting', 'Просто поговорити')], i => i === 0 ? test() : i === 1 ? fire() : chat()));
}
function ashesTalk(npc, done) {
  if (vatraStep() === 1 && has('zhyvavatra')) {
    take('zhyvavatra'); S.f.vatra = 2; saveSoon(); sfx('item');
    return say('', [L('You tip the molfar\'s pot into the ashes. For a moment nothing. Then a small red tongue, then a big yellow one, and the ватра is burning again.', 'Ти висипаєш мольфарів горщик у попіл. Мить — нічого. Тоді маленький червоний язичок, тоді великий жовтий, і ватра знову горить.'),
      L('All across the polonyna the sheep lift their heads and start, at last, to eat.', 'По всій полонині вівці підводять голови і нарешті починають їсти.')], done);
  }
  say('', [L('Grey ash in a ring of stones, cold as a cellar. A thread of smoke still comes out of it, as if it hasn\'t quite given up.', 'Сірий попіл у колі з каміння, холодний, як льох. З нього ще тягнеться цівка диму, ніби він не зовсім здався.')], done);
}

// ─── Chornohora: the magpies' nest, and the days they stole ───────────────
// S.f.soroka: 1 the molfar told you, 2 you emptied the nest, 3 the molfar has given you the living fire
const DAYS = [
  ['Після понеділка йде ___.', 'After Monday comes Tuesday.', ['вівторок', 'вівторка', 'вівторку'], 0, 'Just naming the day: the nominative. (Після понеділка: після takes the genitive.)'],
  ['Приходь у ___!', 'Come on Thursday!', ['четвер', 'четверга', 'четвергом'], 0, 'On a day: у or в + the accusative. У четвер, у п\'ятницю, у неділю.'],
  ['Ми підемо на полонину в ___.', 'We\'ll go up to the polonyna on Saturday.', ['суботу', 'субота', 'суботі'], 0, 'В + the accusative: субота → у суботу.'],
  ['Сніг випав у ___.', 'Snow fell in January.', ['січні', 'січень', 'січня'], 0, 'In a month: у + the locative. Січень → у січні.'],
  ['У ___ цвітуть сади і співають солов\'ї.', 'In May the orchards bloom and the nightingales sing.', ['травні', 'травень', 'травня'], 0, 'У + the locative: травень → у травні. Травень, from трава: the month of grass.'],
  ['Діти йдуть до школи першого ___.', 'Children go to school on the first of September.', ['вересня', 'вересень', 'вересні'], 0, 'A date: the day and the month both in the genitive. Першого вересня.'],
  ['Мій день народження — п\'ятого ___.', 'My birthday is on the fifth of March.', ['березня', 'березень', 'березні'], 0, 'Dates: п\'ятого березня. Both in the genitive.'],
  ['Обідаємо о ___.', 'We have lunch at one o\'clock.', ['першій', 'перша', 'першої'], 0, 'At what time? О + the locative: о першій, о другій, о п\'ятій.'],
  ['Зараз ___ година.', 'It\'s one o\'clock now.', ['перша', 'першій', 'першої'], 0, 'What time is it? The nominative: перша година, друга година, п\'ята година.'],
  ['Тиждень має сім ___.', 'A week has seven days.', ['днів', 'дні', 'день'], 0, 'After five and up: the genitive plural. Сім днів. (Two to four: два дні.)'],
  ['Листя падає в ___.', 'The leaves fall in November.', ['листопаді', 'листопад', 'листопада'], 0, 'У + the locative: листопад → у листопаді. Листопад: the falling of the leaves.'],
];
const sorokaStep = () => S.f.soroka || 0;
function molfarTalk(npc, done) {
  const n = npc.name, s = sorokaStep();
  const test = () => keeperTalk(17, [L('Time. Days, months, hours, today and tomorrow. Час, день, тиждень, рік. A molfar\'s whole job is knowing what time it is. Most people only think they know.', 'Час. Дні, місяці, години, сьогодні і завтра. Уся робота мольфара — знати, котра година. Більшість людей тільки думає, що знає.')])(npc, done);
  const chat = () => say(n, [L('Мольфар. I talk to the weather. Sometimes it listens. I can call rain, turn hail, find a lost cow. Not a lost sock. Socks are beyond anybody.', 'Мольфар. Я розмовляю з погодою. Іноді вона слухає. Можу накликати дощ, відвести град, знайти загублену корову. Не шкарпетку. Шкарпетки нікому не під силу.'), ...hu('мольфар')], done);
  const days = () => {
    if (s === 0) {
      S.f.soroka = 1; saveSoon();
      return say(n, [L('You feel it? The weather doesn\'t know what day it is. Snow in the morning, then cuckoos. The clouds are waiting for Monday, and Monday doesn\'t come.', 'Відчуваєш? Погода не знає, який нині день. Зранку сніг, потім зозулі. Хмари чекають понеділка, а понеділок не приходить.'),
        L('My calendar stick is gone. Every day of the year notched in it, every feast. The magpies took it, up to the White Elephant on Pip Ivan, with all the other words they\'ve been stealing.', 'Мій календар пропав. Палиця, на ній зарубка на кожен день року, кожне свято. Його забрали сороки, нагору, до Білого слона на Піп Івані, разом з усіма іншими словами, які вони крадуть.'),
        L('They\'re keeping them there for their mistress. You know who. She\'s coming for them herself before winter.', 'Вони бережуть їх там для своєї господині. Знаєш для кого. Вона сама по них прийде до зими.'),
        L('Go up. The old magpie on the nest is vain and likes a game. Play hers, and win the days back.', 'Іди нагору. Стара сорока на гнізді марнославна і любить ігри. Зіграй у її гру й виграй дні назад.'), ...hu('ади', 'нині')], done);
    }
    if (s === 1) return say(n, [L('Up the path, to the top, and in through the door of the White Elephant. Mind the wind.', 'Угору стежкою, на вершину, і в двері Білого слона. Стережися вітру.')], done);
    if (s === 2) {
      S.f.soroka = 3; take('kalendar'); saveSoon(); sfx('badge');
      return say(n, [L('My calendar! And the days are moving again. Listen: that\'s Tuesday, coming over the ridge.', 'Мій календар! І дні знову рушили. Слухай: то вівторок іде через хребет.'),
        L('You\'ll be wanting something for this. Stepan on the polonyna lost his fire, didn\'t he? The wind told me. Here.', 'Ти, певно, щось за це хочеш. У Степана на полонині погасла ватра, правда ж? Вітер мені сказав. Ось.'),
        L('[The molfar takes two dry sticks and spins one in the other, muttering, faster and faster. Smoke, a spark, and he drops the flame into a clay pot.]', '[Мольфар бере дві сухі палиці й крутить одну в другій, бурмочучи, швидше і швидше. Дим, іскра, і він кидає вогник у глиняний горщик.]'),
        give('zhyvavatra'),
        L('And hear this, because I saw it in the smoke. When you have won the last pysanka, she\'ll be waiting in the old forest by your village. She can sweep up any word that\'s lying about.', 'І послухай, бо я бачив це в диму. Коли здобудеш останню писанку, вона чекатиме в старому лісі біля твого села. Вона може вимести будь-яке слово, що валяється без діла.'),
        L('But a word that\'s spoken aloud, she can\'t touch. Remember that. Speak.', 'Але слово, сказане вголос, їй не дістати. Запам\'ятай. Говори.')], done);
    }
    return say(n, [L('The days are in their places. Go carefully, and speak.', 'Дні на своїх місцях. Іди обережно і говори.')], done);
  };
  if (!S.f.book) return chat();
  say(n, [L('You came up here on foot? In this weather? Sit.', 'Ти прийшов сюди пішки? У таку погоду? Сідай.')], null, menu([L('Your test', 'Ваше випробування'), L('The lost days', 'Загублені дні'), L('Just chatting', 'Просто поговорити')], i => i === 0 ? test() : i === 1 ? days() : chat()));
}
function queenTalk(npc, done) {
  const n = npc.name, s = sorokaStep();
  if (s >= 2) return done();
  if (s === 0) return say(n, [L('Кра-кра! Shiny, isn\'t it? My nest. Every word in it was somebody\'s once. Now they\'re mine. Well. Hers.', 'Кра-кра! Блищить, правда? Моє гніздо. Кожне слово в ньому колись було чиєсь. Тепер моє. Ну. Її.')], done);
  say(n, [L('The molfar sent you? For his little stick? Ha! I\'m sitting on all of his days. Mondays, Mays, hours and minutes. Warm as eggs.', 'Тебе мольфар прислав? По його паличку? Ха! Я сиджу на всіх його днях. Понеділки, травні, години й хвилини. Теплі, як яйця.'),
    L('I like games. Here\'s one: I pull out a day, you tell me where it goes. Get eight of ten and they\'re yours. Miss, and I keep them for my mistress.', 'Я люблю ігри. Ось тобі гра: я витягаю день, а ти кажеш, куди він іде. Вісім із десяти — і вони твої. Схибиш — лишаю для господині.'),
    L('And the shape has to fit the nest, or it falls out. On Thursday: у четвер. In May: у травні. On the first of September: першого вересня. At one o\'clock: о першій. Кра!', 'І форма мусить пасувати до гнізда, а то випаде. У четвер. У травні. Першого вересня. О першій. Кра!')], null, yesNo(go => {
    if (!go) return say(n, [L('Run along, then. Кра!', 'Ну то біжи. Кра!')], done);
    roadQuiz(shuffle(DAYS.slice()), 'ГНІЗДО', q => {
      if (q.stopped) return say(n, [L('Giving up already? Typical.', 'Уже здаєшся? Так і знала.')], done);
      if (q.score < 8) return say(n, [L(`${q.score} of 10! Not enough. They stay with me. Кра-кра-кра!`, `${q.score} з 10! Замало. Вони лишаються в мене. Кра-кра-кра!`)], done);
      S.f.soroka = 2; give('kalendar'); saveSoon(); sfx('badge');
      say(n, [L(`${q.score} of 10?! Thief! Cheat! Ugh. Take them.`, `${q.score} з 10?! Злодій! Шахрай! Тьху. Забирай.`),
        L('[The nest bursts open. Days, months and hours fly out like sparrows, and away over the ridge in every direction. A notched stick falls at your feet.]', '[Гніздо розлітається. Дні, місяці й години пурхають, як горобці, і летять через хребет на всі боки. До твоїх ніг падає палиця з зарубками.]'),
        L('She\'ll hear about this. She\'s not going to send magpies any more. She\'s going to come herself. To the old forest. To your village. Кра!', 'Вона про це дізнається. Більше вона сорок не посилатиме. Прийде сама. До старого лісу. До твого села. Кра!'),
        L('[The old magpie flaps off east, towards home, very fast.]', '[Стара сорока летить на схід, у бік дому, дуже швидко.]')], done);
    }, ['ГНІЗДО', 'Сорочине гніздо', 'the magpies\' nest', 'Where does this day go?'], 17);
  }));
}

// ─── The people ───────────────────────────────────────────────────────────
const P_HUTSUL = (shirt, trousers) => ({ h: '#2b2230', H: '#1a141e', w: '#f4efe2', W: '#d6cdb8', r: shirt, x: '#c8383a', p: trousers, P: shade(trousers), b: '#3a2a22', T: '#2b2230', t: '#c8383a' });
const P_GHOST = { h: '#cfe8ea', H: '#a8d0d4', w: '#e8f4f4', W: '#cfe4e6', r: '#a8d0d4', x: '#8abcc2', p: '#e8f4f4', P: '#cfe4e6', b: '#a8d0d4', s: '#f0fafa', S: '#d8ecee', m: '#f0fafa' };
Object.assign(NPCS, {
  synevyr: [
    { id: 'vyr', name: 'Vyr', ua: 9, tx: 10, ty: 12, dir: 'right', ghost: true, glow: true, when: () => synStep() < 4, pal: Object.assign({}, P_GHOST, { h: '#e9d89a', H: '#c9b878' }), mods: ['skirt'], talk: vyrTalk },
    { id: 'syn', name: 'Syn', ua: 9, tx: 22, ty: 11, dir: 'down', ghost: true, glow: true, pal: P_GHOST, mods: ['hat'], talk: synTalk },
    { id: 'vyr2', name: 'Vyr', ua: 9, tx: 21, ty: 11, dir: 'right', ghost: true, glow: true, when: () => synStep() >= 4, pal: Object.assign({}, P_GHOST, { h: '#e9d89a', H: '#c9b878' }), mods: ['skirt'],
      talk: [[L('Three hundred years I cried. Now I can\'t stop laughing. He\'s terrible at jokes.', 'Триста років я плакала. А тепер не можу перестати сміятися. Він жахливо розповідає анекдоти.')]] },
    { id: 'ivanka', name: 'Ivanka', ua: 9, tx: 8, ty: 28, dir: 'up', pal: P_HUTSUL('#e8794a', '#c8383a'), mods: ['skirt', 'dots'], talk: ivankaTalk },
    { id: 'mytro', name: 'Mytro the ґазда', ua: 18, tx: 40, ty: 13, dir: 'down', pal: P_HUTSUL('#c8383a', '#c8383a'), mods: ['hat', 'moustache'], talk: mytroTalk },
    { id: 'ferents', name: 'Ferents the driver', ua: 9, tx: 23, ty: 30, dir: 'left', pal: P_CITY('#7a8a5a', '#3a3046'), mods: ['hat', 'moustache'], talk: ferentsTalk },
  ],
  babahouse: [{ id: 'palahna', name: 'Baba Palahna', ua: 9, tx: 4, ty: 4, dir: 'down', pal: Object.assign({}, P_HUTSUL('#e8794a', '#2b2230'), { h: '#e8e4da', H: '#bdb6a8' }), mods: ['skirt', 'dots'],
    talk: (npc, done) => say(npc.name, [L('Сідай, дитино. I\'m the ґаздиня here. Ivanka is my granddaughter; she\'s teaching you to talk like us? Good. Somebody has to.', 'Сідай, дитино. Я тут ґаздиня. Іванка — моя внучка; вчить тебе говорити по-нашому? Добре. Хтось мусить.'),
      L('My grandmother used to say the lake was Vyr\'s tears. My mother said so too. I say: drink it, it\'s very good water.', 'Моя баба казала, що озеро — це сльози Вир. Мама теж так казала. А я кажу: пий, дуже добра вода.'), ...hu('ґаздиня')], done) }],
  verkhovyna: [
    { id: 'yura', name: 'Did Yura the trembitar', ua: 9, tx: 10, ty: 13, dir: 'down', pal: Object.assign({}, P_HUTSUL('#c8383a', '#c8383a'), { h: '#d8d4cc', H: '#a9a49b' }), mods: ['hat', 'moustache'], talk: yuraTalk },
    { id: 'petro', name: 'Petro the groom', ua: 9, tx: 18, ty: 28, dir: 'down', pal: P_HUTSUL('#c8383a', '#3a3046'), mods: ['hat'], talk: petroTalk },
    { id: 'paraska-v', name: 'Paraska the bride', ua: 9, tx: 21, ty: 28, dir: 'down', pal: P_HUTSUL('#e8794a', '#2b2230'), mods: ['skirt', 'vinok'],
      talk: (npc, done) => say(npc.name, (S.f.ves || 0) >= 2 ? [L('Petro can\'t dance. Nobody told him. Don\'t tell him.', 'Петро не вміє танцювати. Ніхто йому не сказав. Не кажи.')]
        : [L('My wreath, my ґердан, my embroidered sleeves. Everything is ready except the music. I\'m not getting married in silence.', 'Вінок, ґердан, вишиті рукави. Усе готово, крім музики. Я не піду до шлюбу в тиші.'), ...hu('ґердан')], done) },
    { id: 'hryts', name: 'Hryts the drummer', ua: 9, tx: 31, ty: 24, dir: 'right', pal: P_HUTSUL('#3f6fc4', '#3a3046'), mods: ['hat'],
      talk: musicianTalk('hryts', [L('Zzz... Eh? The wedding? I can\'t. I\'ve forgotten how the song goes. The drum just goes «бум». No song. Just «бум».', 'Хррр... А? Весілля? Не можу. Я забув, як іде пісня. Бубон тільки «бум». Без пісні. Просто «бум».'), L('Help me remember the words, and the beat comes back?', 'Поможеш згадати слова, і ритм вернеться?')],
        [L('Бубон: a drum. Бубніст: a drummer. Бум.', 'Бубон. Бубніст. Бум.')]) },
    { id: 'wedfire', kind: 'fire', tx: 20, ty: 30, when: () => (S.f.ves || 0) >= 2, talk: (n, done) => say('', [L('The wedding fire. Everybody is dancing round it, and so, suddenly, are you.', 'Весільна ватра. Довкола неї всі танцюють, і раптом ти теж.')], done) },
    ...[[17, 29], [23, 27]].map(([tx, ty], k) => ({ id: 'guest' + k, name: k ? 'A guest' : 'Another guest', ua: 9, tx, ty, dir: 'down', wander: 1, when: () => (S.f.ves || 0) >= 2, pal: P_HUTSUL(k ? '#4c9c66' : '#e9b949', '#2b2230'), mods: k ? ['skirt'] : ['hat'],
      talk: [[L('Аркан! Arms on shoulders, kick, and round! Faster!', 'Аркан! Руки на плечі, нога, і по колу! Швидше!')]] })),
  ],
  korchma2: [{ id: 'mykhailo', name: 'Mykhailo the fiddler', ua: 9, tx: 5, ty: 4, dir: 'down', pal: P_HUTSUL('#4c9c66', '#3a3046'), mods: ['hat', 'moustache'],
    talk: musicianTalk('mykhailo', [L('My fiddle and I have played forty weddings. This morning I picked it up and... nothing. My fingers don\'t know where to go.', 'Ми зі скрипкою грали на сорока весіллях. А сьогодні я взяв її і... нічого. Пальці не знають, куди йти.'),
      L('It always starts with a kolomyika. If I could just remember the words... Will you help?', 'Завжди починається з коломийки. Якби я тільки згадав слова... Поможеш?')],
      [L('Скрипка: the fiddle. The Hutsuls say the fiddle is the devil\'s instrument, which is why it\'s so good at weddings.', 'Скрипка. Гуцули кажуть, що скрипка — чортів інструмент, тому вона така добра на весіллях.')]) }],
  vasylyna: [{ id: 'vasylyna', name: 'Vasylyna', ua: 9, tx: 4, ty: 4, dir: 'down', pal: P_HUTSUL('#7a3e8a', '#2b2230'), mods: ['skirt', 'dots'],
    talk: musicianTalk('vasylyna', [L('Цимбали: strings on a box, and you hit them with little hammers. I\'ve played them since I was six. And today I can\'t find a single tune.', 'Цимбали: струни на скриньці, і б\'єш по них молоточками. Граю з шести років. А нині не можу знайти жодної мелодії.'),
      L('The words of a song hold the tune, like a ґражда holds the sheep. Help me put the words back?', 'Слова пісні тримають мелодію, як ґражда тримає овець. Поможеш повернути слова?')],
      [L('I sing too. Співачка: a singer. My mother says I sing like a nightingale. My brother says like a goat. Both are mountain animals.', 'Я ще й співаю. Співачка. Мама каже, що я співаю, як соловейко. Брат каже, як коза. Обоє гірські тварини.')]) }],
  hutchurch: [{ id: 'otets', name: 'Father Ilarion', ua: 9, tx: 3, ty: 6, dir: 'right', pal: P_MONK, mods: ['moustache'],
    talk: [[L('Hutsul churches are built of spruce, in a cross, with five domes stepping up like the mountains. Not a nail in them.', 'Гуцульські церкви будують зі смереки, хрестом, з п\'ятьма банями, що підіймаються, як гори. Жодного цвяха.'),
      L('The Hutsuls say: God made the mountains, and then the Hutsuls, so that somebody would sing in them.', 'Гуцули кажуть: Бог створив гори, а тоді гуцулів, щоб хтось у них співав.')]] }],
  polonyna: [
    { id: 'stepan', name: 'Stepan the vatah', ua: 9, tx: 16, ty: 13, dir: 'right', pal: Object.assign({}, P_HUTSUL('#5a4a3a', '#5a4a3a'), { w: '#efeae0', W: '#d6d0c2' }), mods: ['hat', 'moustache'], talk: stepanTalk },
    { id: 'vatra-ash', kind: 'ashes', tx: 18, ty: 13, when: () => vatraStep() < 2, talk: ashesTalk },
    { id: 'vatra', kind: 'fire', tx: 18, ty: 13, when: () => vatraStep() >= 2, talk: (n, done) => say('', [L('The living fire, burning again. The shepherds keep one eye on it all the time, the way you watch a baby.', 'Жива ватра знову горить. Вівчарі весь час одним оком на неї поглядають, як на немовля.')], done) },
    { id: 'vasylko', name: 'Vasylko', ua: 9, tx: 25, ty: 16, dir: 'left', pal: P_HUTSUL('#efeae0', '#5a4a3a'),
      talk: [[L('I\'m the youngest shepherd. I count the sheep. Three hundred and four. Three hundred and five. Hang on, that one\'s a dog.', 'Я наймолодший вівчар. Я рахую овець. Триста чотири. Триста п\'ять. Стоп, то пес.')]] },
    { id: 'burko', kind: 'dog', name: 'Burko', tx: 26, ty: 13, dir: 'left', wander: 2,
      talk: (n, done) => say('', [S.f.fern ? L('Woof! I\'m a shepherd too. I do all the work and they get all the bryndza.', 'Гав! Я теж вівчар. Я роблю всю роботу, а вони їдять усю бриндзу.') : L('A big shaggy sheepdog. He looks at you, then at the sheep, and decides you\'re less trouble.', 'Великий кошлатий вівчур. Дивиться на тебе, потім на овець, і вирішує, що з тобою менше клопоту.')], done) },
    ...[[28, 20], [30, 21], [33, 20], [29, 23], [32, 23], [34, 22], [31, 19], [27, 22]].map(([tx, ty], k) => ({ id: 'sheep' + k, kind: 'sheep', tx, ty, dir: k % 2 ? 'left' : 'right', wander: 2,
      talk: (n, done) => say('', [S.f.fern ? L(['Бе-е. The grass is better on the other side of the fence. It\'s always better on the other side.', 'Бе-е. Is it supper time? It\'s always supper time.', 'Бе-е. I saw the broom. It flew over at night and the dogs hid.'][k % 3], ['Бе-е. По той бік огорожі трава краща. Завжди краща.', 'Бе-е. Уже вечеря? Завжди вечеря.', 'Бе-е. Я бачила мітлу. Вона пролетіла вночі, і пси сховалися.'][k % 3])
        : L('Бе-е-е. A sheep: вівця. It goes on chewing.', 'Бе-е-е. Вівця. Жує далі.')], done) })),
  ],
  kolyba: [{ id: 'ilko', name: 'Did Ilko', ua: 9, tx: 5, ty: 4, dir: 'down', pal: Object.assign({}, P_HUTSUL('#efeae0', '#5a4a3a'), { h: '#d8d4cc', H: '#a9a49b' }), mods: ['moustache'],
    talk: (npc, done) => say(npc.name, [L('I make the cheese. Milk, a bit of rennet, a lot of patience. Then into the бербениця with salt, and it keeps till spring.', 'Я роблю сир. Молоко, трохи кляґу, багато терпіння. Тоді в бербеницю з сіллю, і стоїть до весни.'),
      L('Without the fire the milk won\'t set. Without the fire nothing works up here.', 'Без ватри молоко не згортається. Без ватри тут нагорі ніщо не робиться.'), ...hu('бербениця', 'колиба', 'бриндза')], done) }],
  chornohora: [
    { id: 'nadiia', name: 'Liudmyla the weather-watcher', ua: 9, tx: 27, ty: 9, dir: 'right', pal: P_CITY('#c8383a', '#3a3046'), mods: ['hat'],
      talk: (npc, done) => say(npc.name, [L('I\'m from the mountain rescue. We\'re fixing up the old observatory, so there\'ll be a warm room up here and somebody watching the sky again.', 'Я з гірської рятувальної служби. Ми відновлюємо стару обсерваторію, щоб тут знову була тепла кімната і хтось дивився на небо.'),
        L('Weather on Chornohora: four seasons a day. Take a hat. Take two.', 'Погода на Чорногорі: чотири пори року за день. Візьми шапку. Візьми дві.'), ...hu('плай')], done) },
  ],
  observatory: [
    { id: 'nest', kind: 'nest', tx: 6, ty: 3, full: () => sorokaStep() < 2,
      talk: (n, done) => say('', [sorokaStep() < 2 ? L('A nest as big as a cart, woven from twigs, wire and broom bristles. Words glitter all through it like bits of glass: days, months, names. Thousands of them.', 'Гніздо завбільшки з віз, сплетене з гілок, дроту і щетини з мітли. У ньому, як скельця, блищать слова: дні, місяці, імена. Тисячі.')
        : L('The empty nest. A few twigs, a lot of broom bristles, and not one word left in it.', 'Порожнє гніздо. Кілька гілочок, багато щетини з мітли, і жодного слова.')], done) },
    { id: 'queen', name: 'The old magpie', ua: 9, kind: 'magpie', tx: 7, ty: 4, dir: 'left', when: () => sorokaStep() < 2, talk: queenTalk },
  ],
  molfarhut: [{ id: 'molfar', name: 'The molfar', ua: 9, tx: 5, ty: 4, dir: 'down', pal: Object.assign({}, P_HUTSUL('#2b2230', '#2b2230'), { h: '#d8d4cc', H: '#a9a49b', w: '#3a3046', W: '#2b2230' }), mods: ['hat', 'moustache'], talk: molfarTalk }],
});

// what to do next, in the mountains: added to the "What now?" page
function mountainText() {
  const f = S.f, been = id => !!(S.been && S.been[id]), out = [];
  if (badgeCount() >= CARPATHIANS_NEED && !been('synevyr')) out.push('Svitlana\'s night train leaves the Polissia halt for the mountains now.');
  if (synStep() === 1) out.push('Row out to the island on Lake Synevyr and tell Syn what Vyr said.');
  if (synStep() === 2) out.push('Bring Syn\'s answer back to Vyr, on the shore of Synevyr.');
  if (synStep() === 3) out.push('Take Vyr across to the island on Syn\'s raft.');
  if (f.hutsul === 1) out.push('Answer Mytro the ґазда at the pass east of Synevyr, in Hutsul.');
  if (f.ves === 1) out.push(`Help Verkhovyna's wedding musicians remember their songs (${[1, 2, 4].filter(b => muzBits() & b).length} of 3), then tell Petro.`);
  if (vatraStep() === 1) out.push(has('zhyvavatra') ? 'Put the living fire in the polonyna\'s cold ashes.' : 'Ask the molfar on Chornohora for living fire, for Stepan\'s polonyna.');
  if (vatraStep() === 2) out.push('Help Stepan cook the shepherds\' supper on the polonyna.');
  if (sorokaStep() === 1) out.push('Win the molfar\'s days back from the old magpie at the observatory on Pip Ivan.');
  if (sorokaStep() === 2) out.push('Take the calendar stick back to the molfar in his hut on Chornohora.');
  return out.length ? ' ' + out.join(' ') : '';
}
