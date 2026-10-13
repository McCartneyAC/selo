// ─── The endgame: Baba Yaga, and what the words are for ───────────────────
// With all 25 pysanky, Baba Yaga's hut is waiting in the old forest. You make the hut turn round with the old words, your
// friends come and speak aloud, and Baba Yaga tests everything you learned on the road: one question from every place.
// Then the twist the whole country has been whispering about: nobody tells her tale any more. You tell it to her.
// The words fly home, the quiet houses light up, and Ostap sings the duma of what you did.
// S.f.fin: 1 inside the hut, 2 the road's grammar recalled, 3 the words recalled; S.f.yaga: 1 done.
Object.assign(ITEMS, {
  zolota: { ua: 'золота писанка', en: 'the golden pysanka', desc: 'Baba Yaga\'s own, from the back of her stove. Gold on black, and in the pattern, if you look closely, every place you have been.' },
  bandura: { ua: 'Остапова бандура', en: 'Ostap\'s bandura', desc: 'For catching all thousand words. Ostap says you play like a goose with a cold. He says it fondly.' },
});
// a little chain of scenes: each step gets the function that runs the next
function scenes(steps, done) {
  let k = 0;
  const next = () => { const f = steps[k++]; if (f) f(next); else if (done) done(); };
  next();
}
const scene = (who, lines) => next => say(who, lines, next);

// ─── Turning the hut round ────────────────────────────────────────────────
const HUT = [
  ['Хатко, хатко, ___ до лісу задом, а до мене передом!', 'Little hut, little hut, stand with your back to the forest and your front to me!', ['стань', 'стоїш', 'стала'], 0, 'A command: стати → стань! Like the lotsman\'s греби! and стій!'],
  ['Хатко, хатко, стань до ___ задом!', 'Little hut, stand with your back to the forest!', ['лісу', 'ліс', 'лісі'], 0, 'До + the genitive: ліс → до лісу.'],
  ['...а до ___ передом!', '...and your front to me!', ['мене', 'я', 'мені'], 0, 'До + the genitive again: я → до мене.'],
  ['Стань до лісу ___, а до мене передом!', 'Stand with your back to the forest, and your front to me!', ['задом', 'зад', 'заду'], 0, 'How? The instrumental, no preposition: зад → задом, перед → передом.'],
];

// ─── The road's grammar: one question from every place that taught one ────
const RAPIDS_IMP = [
  ['Лоцман кричить: «___!» — і ти гребеш.', 'The lotsman shouts "Row!", and you row.', ['Греби', 'Гребти', 'Гребе'], 0, 'A command to one person: гребти → греби!'],
  ['«___ ліворуч, там камінь!»', '"Don\'t go left, there\'s a rock there!"', ['Не йди', 'Не йти', 'Не йде'], 0, 'Не + the imperative: не йди!'],
];
const FINAL_SOURCES = [
  ['СТЕП', 'Кличний відмінок', 'the kamiana baba', () => VOC],
  ['ЧУМАЦЬКИЙ ШЛЯХ', 'Дієслова руху', 'Ivan the chumak', () => VM.flatMap(s => s.items)],
  ['КАЛИНІВКА', 'Теперішній час', 'Lida\'s school', () => CONJ],
  ['БОЛОТО', 'Болить і треба', 'Yaryna the herbalist', () => ACHES],
  ['ХОРТИЦЯ', 'Давальний і родовий', 'the letter to Baba Yaga', () => LETTER],
  ['ПОРОГИ', 'Наказовий спосіб', 'Kindrat the lotsman', () => RAPIDS_IMP],
  ['ПОДІЛ', 'Де? Чим?', 'finding Mykyta', () => PODIL_TELL],
  ['ЛАВРА', 'Минулий час', 'the chronicle', () => PAGES],
  ['УЗВІЗ', 'Майбутній час', 'Pani Motrona\'s wax', () => WAX],
  ['ПОЛІССЯ', 'Знахідний відмінок', 'the scarecrow', () => CLOTHES.map(c => c[2])],
  ['БІР', 'Прийменники', 'Okhrim\'s swarms', () => SWARM_WHERE],
  ['СИНЕВИР', 'Рід у минулому часі', 'Syn and Vyr', () => VYR_WORDS.concat(SYN_WORDS)],
  ['ПЕРЕВАЛ', 'Гуцульська говірка', 'Mytro the ґазда', () => HUTSUL_TEST],
  ['ПОЛОНИНА', 'Орудний відмінок', 'the shepherds\' supper', () => SUPPER],
  ['ЧОРНОГОРА', 'Дати й час', 'the magpie\'s nest', () => DAYS],
  ['КАМ\'ЯНЕЦЬ', 'Узгодження прикметників', 'the colours', () => Object.values(COLOUR_WORDS).flatMap(c => c[2]).concat(FLAG)],
  ['ДНІСТЕР', 'Працювати ким', 'the people of Bakota', () => Object.values(JOBS).flatMap(j => j[1])],
  ['ЛИМАН', 'Числівники', 'counting the salt', () => SALT_COUNT],
  ['ОДЕСА', 'Слова-зв\'язки', 'the jokes of Humorina', () => Object.values(JOKES).flatMap(j => j[2])],
  ['ВИЛКОВЕ', 'Кому?', 'Nastia\'s parcels', () => Object.values(PARCELS).flatMap(p => p[2])],
  ['ЛЬВІВ', 'Доконаний вид', 'the telephone calls', () => PHONE_CALLS.flatMap(c => c.qs)],
];
function finalItems() {
  return FINAL_SOURCES.map(([place, topic, who, list]) => {
    const pool = list(), it = pool[Math.floor(Math.random() * pool.length)];
    return [it[0], it[1], it[2], it[3], it[4], [place, topic, who]];
  });
}
// who and what helps you when she makes the forest go silent; each one lowers how many you need
function helpers() {
  const out = [];
  if (dzvin() & 1) out.push(L('Baba Hanna and the whole of Vyshneve, at the gate, saying their words out loud', 'Баба Ганна і все Вишневе біля воріт, що вголос кажуть свої слова'));
  if (dzvin() & 2) out.push(L('Mykyta and half of Podil, who came in his taxi, all talking at once', 'Микита і пів Подолу, що приїхали його таксі й говорять усі разом'));
  if (dzvin() & 4) out.push(L('Ivanka, and Mytro\'s trembita, which is louder than any broom', 'Іванка і трембіта Митра, гучніша за будь-яку мітлу'));
  if (dzvin() & 8) out.push(L('Lukash\'s sopilka, and Mavka, who came out of the trees to hear it', 'Сопілка Лукаша і Мавка, що вийшла з-за дерев її послухати'));
  if (has('dzvinok')) out.push(L('the little bell of Bakota: whoever hears it remembers', 'дзвоник із Бакоти: хто його почує, той згадує'));
  if (has('mushlia')) out.push(L('the shell from Odesa, still laughing', 'мушля з Одеси, яка досі сміється'));
  if (has('rushnyk')) out.push(L('Baba Paraska\'s road rushnyk, laid down at the door', 'рушник-дорога баби Параски, постелений біля дверей'));
  return out;
}
const finalNeed = () => Math.max(14, 19 - helpers().length);

// ─── Her tale ─────────────────────────────────────────────────────────────
const KAZKA = [
  ['Жила-___ собі Баба Яга.', 'Once upon a time there lived Baba Yaga.', ['була', 'був', 'були'], 0, 'Жила-була: how Ukrainian tales begin. The past tense, feminine.'],
  ['Жила вона в старому ___.', 'She lived in the old forest.', ['лісі', 'ліс', 'лісом'], 0, 'Де? У + the locative: ліс → у лісі.'],
  ['Її хатка стояла на курячих ___.', 'Her hut stood on hen\'s legs.', ['ніжках', 'ніжки', 'ніжками'], 0, 'На + the locative plural: ніжки → на ніжках.'],
  ['Літала вона в ступі, а слід замітала ___.', 'She flew in a mortar and swept away her tracks with a broom.', ['мітлою', 'мітла', 'мітлу'], 0, 'With what? The instrumental: мітла → мітлою.'],
  ['Усі діти в Україні ___ її і боялися.', 'All the children in Ukraine knew her, and were afraid.', ['знали', 'знала', 'знав'], 0, 'They, in the past: -ли. Знали.'],
  ['Бабусі розповідали ___ про неї казки.', 'Grandmothers told them tales about her.', ['їм', 'вони', 'їх'], 0, 'Розповідати кому? The dative: вони → їм.'],
  ['А потім люди ___ про неї забувати.', 'And then people began to forget her.', ['почали', 'почала', 'почнуть'], 0, 'They began, once: the perfective past, почали.'],
  ['Але ми її ___ і розповідатимемо далі!', 'But we will remember her, and go on telling her tale!', ['пам\'ятатимемо', 'пам\'ятали', 'пам\'ятаємо'], 0, 'The future: пам\'ятатимемо = будемо пам\'ятати.'],
  ['І ___ їй: «Бабо Яго, ти наша!»', 'And we\'ll say to her: "Baba Yaga, you\'re ours!"', ['скажемо', 'сказали', 'кажемо'], 0, 'Once, in the future: скажемо. And Бабо Яго: the vocative.'],
  ['Тут і казці ___.', 'And here the tale ends.', ['кінець', 'кінця', 'кінцем'], 0, 'How Ukrainian tales end: Тут і казці кінець.'],
];
function tellTale(again, done, quit) {
  roadQuiz(KAZKA.slice(), 'КАЗКА', q => {
    if (q.stopped) return again ? done() : quit();
    if (q.score < 8) return say('Baba Yaga', [L(`${q.score} of 10. You got muddled. Never mind. Start again from the beginning, slowly. I\'m not going anywhere.`, `${q.score} з 10. Заплутався. Нічого. Почни знову спочатку, повільно. Я нікуди не йду.`)], () => again ? done() : tellTale(false, done, quit));
    done(q);
  }, ['КАЗКА', 'Казка про Бабу Ягу', 'her own tale', 'Tell it properly']);
}

// ─── The finale ───────────────────────────────────────────────────────────
const preYaga = yagaTalk;
function finaleTalk(npc, done) {
  const Y = 'Baba Yaga';
  if (S.f.yaga) return postYaga(npc, done);
  if (badgeCount() < NZ) return preYaga(npc, done);
  const f = S.f.fin || 0;
  const hut = next => scenes([
    scene(Y, [L(`${NZ} pysanky. So it's true what the magpies say.`, `${NZ} писанок. Отже, сороки правду кажуть.`),
      L('Look at my hut, little dove. Look how big it\'s grown. Every word nobody said, I swept up, and it burns so warm in the pich, and the hut grows on every one.', 'Подивися на мою хатинку, голубчику. Подивися, яка виросла. Кожне слово, якого ніхто не казав, я вимела, і воно так тепло горить у печі, а хатинка росте від кожного.'),
      L('When the last word is forgotten, it will stand up and walk over the whole country, and everything will be quiet. Lovely and quiet.', 'Коли забудуть останнє слово, вона встане і піде через увесь край, і стане тихо. Гарно й тихо.'),
      L('Come in, then, if you can. The hut doesn\'t open for just anybody.', 'Заходь, якщо зможеш. Хатинка не відчиняється будь-кому.')]),
    scene('', [L('[The hut is as tall as the church now. Through the gaps between its logs, words glow like coals. It has turned its back on you, and its door faces the forest.]', '[Хатинка тепер заввишки з церкву. Крізь щілини між колодами жевріють слова, як жарини. Вона стоїть до тебе задом, дверима до лісу.]'),
      L('[There\'s an old way to speak to a hut on hen\'s legs. Every Ukrainian grandmother knows it. Say it properly.]', '[До хатки на курячих ніжках є давній спосіб звернутися. Кожна українська бабуся його знає. Скажи як слід.]')]),
    nx => roadQuiz(HUT.slice(), 'ХАТКА', q => {
      if (q.stopped || q.score < 3) return say(Y, [L('Ha! It didn\'t understand a word. Neither did I. Try again when you\'ve remembered how grandmothers talk.', 'Ха! Вона ні слова не зрозуміла. Я теж. Спробуй ще, коли згадаєш, як говорять бабусі.')], done);
      nx();
    }, ['ХАТКА', 'Хатко, хатко...', 'the old words for a hut', 'Say it properly']),
    scene('', [has('maznytsia') ? L('[The hut tries to turn, and its hen\'s legs creak and stick, dry as old fence posts. You take out the chumaks\' tar pot and grease them. With a long, grateful squeak, the hut turns round to face you.]', '[Хатинка пробує обернутися, а курячі ніжки скриплять і застрягають, сухі, як старий тин. Ти дістаєш чумацьку мазницю і мастиш їх. З довгим вдячним скрипом хатинка обертається до тебе передом.]')
      : L('[The hut creaks round to face you, very slowly, complaining the whole way.]', '[Хатинка дуже повільно, скрипучи, обертається до тебе передом і всю дорогу бурчить.]'),
      has('kluch') ? L('[On the door hangs a lock as big as a cartwheel: замо́к. You hold up Pan Bohdan\'s key, the one that fits both за́мок and замо́к. It turns.]', '[На дверях висить замо́к, завбільшки з колесо. Ти дістаєш ключ пана Богдана, той, що підходить і до за́мку, і до замка́. Він повертається.]')
      : L('[The door is locked. But the hut has been spoken to properly for the first time in a hundred years, and it opens the door itself, a little sulkily.]', '[Двері замкнені. Але до хатинки вперше за сто років звернулися як слід, і вона сама, трохи надувшись, відчиняє двері.]')]),
    nx => { S.f.fin = 1; saveSoon(); nx(); },
  ], next);
  const inside = next => S.f.finTry ? scenes([nx => { playMusic('carol'); nx(); }, scene(Y, [L(`Back again? The stove is warm. Same rules: twenty-one words, ${finalNeed()} right.`, `Знову ти? Піч тепла. Ті самі правила: двадцять одне слово, ${finalNeed()} правильних.`)])], next) : scenes([
    nx => { playMusic('carol'); S.f.finTry = 1; nx(); },
    scene('', [L('[Inside it is hot as a bathhouse. The great pich takes up half the hut, and in its mouth, thousands of words are burning: names, songs, days of the week, the colours of Kamianets.]', '[Усередині гаряче, як у лазні. Велика піч займає пів хати, і в її челюстях горять тисячі слів: імена, пісні, дні тижня, кольори Кам\'янця.]'),
      L('[Baba Yaga lifts her broom, and sweeps it once across the floor.]', '[Баба Яга піднімає мітлу і раз мете нею по підлозі.]'),
      L('[Silence falls over the whole forest. You open your mouth, and nothing comes out.]', '[Над усім лісом западає тиша. Ти відкриваєш рота, і не можеш нічого сказати.]')]),
    ...(helpers().length ? [scene('', [L('[And then, outside, somebody starts to talk. Then somebody else. They came, the way they promised, and they are speaking out loud:]', '[А тоді надворі хтось починає говорити. Потім ще хтось. Вони прийшли, як обіцяли, і говорять уголос:]'),
      ...helpers().map(h => L(`[${h[0]}.]`, `[${h[1]}.]`)),
      L('[Your voice comes back.]', '[До тебе повертається голос.]')])] : [scene('', [L('[You remember what the molfar said: she can\'t touch a word that\'s spoken aloud. You push, and push, and your voice comes back.]', '[Ти згадуєш, що казав мольфар: слова, сказаного вголос, їй не дістати. Ти силкуєшся, силкуєшся, і голос повертається.]')])]),
    scene(Y, [L('So. You can talk. Everybody can talk. But can you talk PROPERLY? Every word in my stove came from somewhere. I\'ll pull one out from every place you\'ve been, and you tell me where it goes.', 'Ну. Говорити ти вмієш. Говорити всі вміють. А ПРАВИЛЬНО вмієш? Кожне слово в моїй печі звідкись узялося. Я витягну по одному з кожного місця, де ти був, а ти скажеш, куди воно йде.'),
      L(`Twenty-one of them. Get ${finalNeed()} right${helpers().length ? ' (your noisy friends are helping, I can hear them)' : ''}, and they go free. Fewer, and they go back on the fire.`, `Двадцять одне. ${finalNeed()} правильних${helpers().length ? ' (твої галасливі друзі допомагають, я їх чую)' : ''}, і вони вільні. Менше — і назад у вогонь.`)]),
  ], next);
  const roadRound = next => roadQuiz(finalItems(), 'УСЯ ДОРОГА', q => {
    if (q.stopped || q.score < finalNeed()) return say(Y, [L(`${q.score} of 21. Not enough! Back in the stove they go. Go home, practise on the road, and come back. I\'ll keep the fire going.`, `${q.score} з 21. Замало! Назад у піч. Іди, повправляйся в дорозі, і вертайся. Я підтримуватиму вогонь.`)], done);
    S.f.fin = 2; saveSoon(); sfx('badge');
    say('', [L(`[${q.score} of 21. With every answer a word leaps out of the stove and flies up the chimney: a case from the Sich, a verb from the Chumak's Road, a colour from Kamianets, a number from the salt liman.]`, `[${q.score} з 21. З кожною відповіддю слово вистрибує з печі й летить у комин: відмінок із Січі, дієслово з Чумацького Шляху, колір із Кам\'янця, число з лиману.]`)], () =>
      say(Y, [L('That\'s the grammar. Clever child. Now the words themselves. Fifteen. Get thirteen.', 'Це граматика. Розумне дитя. А тепер самі слова. П\'ятнадцять. Тринадцять правильних.')], next));
  }, ['УСЯ ДОРОГА', 'Від Вишневого до Львова', 'the whole road', 'Which form fits?']);
  const wordRound = next => startTrial(null, 15, q => {
    if (q.stopped || q.score < 13) return say(Y, [L(`${q.score} of 15. So close, and so cold. Go and catch some more, and come back.`, `${q.score} з 15. Так близько, і так холодно. Іди злови ще, і вертайся.`)], done);
    S.f.fin = 3; saveSoon(); sfx('badge'); next();
  });
  const twist = next => scenes([
    scene('', [L('[The last words burst out of the stove and up the chimney, and the fire sinks to a little red glow.]', '[Останні слова вириваються з печі й летять у комин, і вогонь опадає до маленької червоної жаринки.]'),
      L('[Baba Yaga sits down on the bench by the cold stove. Suddenly she looks very small, and very old, and not frightening at all.]', '[Баба Яга сідає на лаву біля холодної печі. Раптом вона здається дуже маленькою, дуже старою і зовсім не страшною.]')]),
    scene(Y, [L('Well. That\'s that, then. You know what was really in that stove, little dove? Me.', 'Ну. От і все. А знаєш, що насправді було в тій печі, голубчику? Я.'),
      L('Once every child in this land knew my name. They screamed it in the dark under the covers, and loved it. Every grandmother told my tale on winter nights. I was the most frightening thing in Ukraine, and I was so proud.', 'Колись кожна дитина в цьому краю знала моє ім\'я. Кричала його в темряві під ковдрою, і любила. Кожна бабуся розповідала про мене казку зимовими вечорами. Я була найстрашніша в Україні, і так цим пишалася.'),
      L('Then nobody told it any more. I got quieter, and quieter, and the one who sits in the rock started looking at me like a neighbour. So I took your words to keep warm. If I was going to be forgotten, I wasn\'t going alone.', 'А потім її перестали розповідати. Я тихла й тихла, а той, що в скалі сидить, почав дивитися на мене, як на сусідку. Тож я забирала ваші слова, щоб гріли. Якщо вже мене забудуть, то не саму.')]),
    scene('', [L('[You remember what the one in the rock said: eating words never works. Only being told works.]', '[Ти згадуєш, що казав той, що в скалі: їсти слова ніколи не допомагає. Допомагає тільки, коли про тебе розповідають.]'),
      L('[So you sit down beside her, and you tell her her own tale. Properly. In Ukrainian.]', '[Тож ти сідаєш поруч і розповідаєш їй її ж казку. Як слід. Українською.]')]),
    nx => tellTale(false, nx, done),
    scene('', [has('quill') ? L('[And as you tell it, you write it down with Nestor\'s quill, on a page from the Lavra. Whatever is written with that quill, no magpie can steal.]', '[І поки розповідаєш, записуєш її Несторовим пером на сторінці з Лаври. Що написано тим пером, того жодна сорока не вкраде.]')
      : L('[And as you tell it, you can feel it settling somewhere, the way a song settles in you once you\'ve sung it twice.]', '[І поки розповідаєш, відчуваєш, як вона десь осідає, так, як пісня осідає в тобі, коли проспіваєш її двічі.]')]),
    scene(Y, [L('«Бабо Яго, ти наша.» Ha. Hah. Nobody has called me theirs in three hundred years.', '«Бабо Яго, ти наша.» Ха. Ха. Мене ніхто не називав своєю триста років.'),
      L('Go on, then. Go home. Say your words every day, out loud. And come back and tell me my tale sometimes. With the frightening bits. Especially the frightening bits.', 'Іди вже. Іди додому. Кажи свої слова щодня, уголос. І приходь іноді розповісти мені мою казку. Зі страшними місцями. Особливо зі страшними.'),
      L('[She reaches into the back of the cold stove and takes out an egg, black, with gold lines on it.] Here. Mine. Every place you\'ve been is drawn on it. Don\'t drop it.', '[Вона сягає в глибину холодної печі й дістає яйце, чорне, із золотими лініями.] Тримай. Моя. На ній намальоване кожне місце, де ти був. Не впусти.'), give('zolota')]),
    nx => { S.f.yaga = 1; S.f.fin = 4; saveSoon(); sfx('night'); nx(); },
    scene('', [L('[You step out into the yard. The hut stands up, stretches one leg and then the other, and walks off into the deep forest, smaller with every step.]', '[Ти виходиш на подвір\'я. Хатинка встає, потягується однією ніжкою, тоді другою, і йде в глиб лісу, з кожним кроком менша.]'),
      L('[Then, after some thought, it walks back again, because it likes it here.]', '[А тоді, подумавши, вертається, бо їй тут подобається.]')]),
  ], next);
  const steps = [];
  if (f < 1) steps.push(hut);
  if (f < 2) steps.push(inside, roadRound);
  if (f < 3) steps.push(wordRound);
  steps.push(twist, homecoming);
  scenes(steps, done);
}
findNpc('yaga').talk = finaleTalk;

// ─── The words go home ────────────────────────────────────────────────────
function homecoming(done) {
  const e = id => errandState(id) === 2, f = S.f;
  const montage = [
    L('[All night long the words fly out over the forest, back to the villages, like sparks, like swallows coming home.]', '[Цілу ніч слова летять над лісом назад до сіл, як іскри, як ластівки, що вертаються додому.]'),
    L('[In Vyshneve, the quiet houses light up one by one. Somebody laughs in a kitchen that hasn\'t heard a laugh in years.]', '[У Вишневому одна за одною світяться тихі хати. Хтось сміється на кухні, де роками не сміялися.]'),
    ...(e('hrytsenko') ? [L('[A car stops outside the Hrytsenko house. Daryna and her parents carry their bags in, and behind the stove, something small and hairy cries into a crust of bread.]', '[Біля хати Гриценків зупиняється машина. Дарина з батьками заносять речі, а за піччю щось маленьке й волохате плаче в окраєць хліба.]')] : []),
    ...(f.panas >= 5 ? [L('[On the lake, Did Panas is teaching Zoryana to fish. The fish are avoiding both of them.]', '[На озері дід Панас вчить Зоряну рибалити. Риба обходить обох.]')] : []),
    ...(e('kyrylo') ? [L('[At the Kalynivka market, Olena reads Kyrylo\'s letter aloud to anybody who will stand still.]', '[На калинівському ринку Олена вголос читає Кирилового листа кожному, хто зупиниться.]')] : []),
    ...(e('motria') ? [L('[In the church, Baba Motria\'s telephone rings. She doesn\'t pretend to be surprised.]', '[У церкві в баби Мотрі дзвонить телефон. Вона не вдає, що здивована.]')] : []),
    L('[In Kyiv the great Lavra bell rings out louder than it has in years, and on Lysa Hora the witches shriek again, which Pani Solomiia says is very healthy.]', '[У Києві великий лаврський дзвін б\'є гучніше, ніж за багато років, а на Лисій Горі відьми знову верещать, що пані Соломія вважає дуже корисним.]'),
    ...(f.lukash === 2 ? [L('[By the lake in Polissia, Lukash plays the same tune as always. This time, Mavka is sitting beside him.]', '[Біля поліського озера Лукаш грає ту саму мелодію, що й завжди. Цього разу поруч сидить Мавка.]')] : []),
    L('[In the mountains a trembita sounds over every ridge, and on Lake Synevyr two ghosts are laughing at a joke only they know.]', '[У горах трембіта лунає над усіма хребтами, а на Синевирі двоє привидів сміються з жарту, який знають тільки вони.]'),
    L('[The balloons rise over Kamianets. In Odesa somebody finishes a joke. In Lviv, every telephone rings at once, and every one of them says «алло».]', '[Над Кам\'янцем піднімаються кулі. В Одесі хтось закінчує жарт. У Львові всі телефони дзвонять одночасно, і кожен каже «алло».]'),
    (dzvin() & 16) ? L('[And at dawn, a pair of headlights comes up the road into Vyshneve: a lorry, mud to the windows, and tato at the wheel, who drove all night, as he promised.]', '[А на світанку дорогою до Вишневого піднімаються фари: вантажівка, заляпана болотом аж до вікон, і тато за кермом, що їхав усю ніч, як обіцяв.]')
      : L('[And at dawn, a lorry comes up the road into Vyshneve, mud to the windows. Tato, home at last. In his pocket, a postcard from Odesa, and on the back, for the first time since spring, his big square handwriting.]', '[А на світанку дорогою до Вишневого їде вантажівка, заляпана болотом аж до вікон. Тато, нарешті вдома. У кишені листівка з Одеси, а на звороті вперше з весни його великий квадратний почерк.]'),
  ];
  say('', montage, () => {
    sfx('door');
    warp = { to: { to: 'vyshneve', tx: 16, ty: 10, dir: 'up' }, fade: 0, dir: 1, then: () => {
      playMusic('steppe');
      const ostap = entities.find(n => n.id === 'ostap');
      if (ostap) { ostap.dir = 'down'; curSpeaker = ostap; }
      say('Ostap the kobzar', [L('There you are. The whole village is here. Sit down. I wrote it. I drank all of Lviv\'s coffee and I wrote it all night.', 'Ось і ти. Усе село тут. Сідай. Я написав. Випив усю львівську каву і писав цілу ніч.'),
        L('[Ostap tunes his bandura, and the whole of Vyshneve goes quiet. Not the old quiet. The good kind.]', '[Остап настроює бандуру, і все Вишневе затихає. Не тією, старою тишею. Доброю.]')], () =>
        singDuma(() => summary(done)));
    } };
  });
}
// the duma: what you did, as Ostap sings it, built from what you actually did. Дитя is neuter, so the verbs end in -ло.
function dumaLines() {
  const f = S.f, e = id => errandState(id) === 2, n = myName(), v = myVoc();
  const D = [
    [true, 'Oh, in the Poltava land, in the village of Vyshneve, where the stork stands on her pole and the sweep creaks over the well,', 'Ой на Полтавщині, у Вишневому селі, де лелека на стовпі, а журавель над криницею,'],
    [true, `there lived a child, ${n} by name, with a словник, and nothing in it but empty pages.`, `жило-було дитя, ${n} на ім\'я, і мало воно словник, а в словнику — порожні сторінки.`],
    [f.fern, 'On Kupala night it found the fern flower, and ever since, it has understood the birds and the beasts.', 'У ніч на Купала цвіт папороті знайшло, і відтоді звірину й птаство розуміло.'],
    [(f.duma || 0) >= 4, 'It woke the dead otaman on the kurhan with the proper word: «Отамане! Батьку отамане!»', 'Мертвого отамана на кургані правильним словом розбудило: «Отамане! Батьку отамане!»'],
    [(f.vm || 0) >= VM.length, 'It walked the whole Chumak\'s Road, every verb of it, and the Milky Way is its own now.', 'Увесь Чумацький Шлях пройшло, до останнього дієслова, і Чумацький Шлях тепер його.'],
    [(f.lyst || 0) >= 3, 'With the Zaporozhians it wrote Baba Yaga a letter, and the whole Sich laughed till the cannon fired by itself.', 'Із запорожцями Бабі Язі листа писало, і вся Січ так реготала, що гармата сама вистрілила.'],
    [f.porohy, 'It shot all nine rapids in a chaika, and the Insatiable did not eat it.', 'Дев\'ять порогів на чайці пройшло, і Ненаситець його не з\'їв.'],
    [(f.panas || 0) >= 5, 'It carried a father\'s letter to his son, right across Kyiv.', 'Батьків лист синові через увесь Київ донесло.'],
    [(f.litopys || 0) >= 3, 'In the dark caves it found the chronicle\'s lost pages, and Nestor gave it his own quill.', 'У темних печерах загублені сторінки літопису знайшло, і Нестор йому своє перо віддав.'],
    [(f.opud || 0) >= 2, 'In Polissia it dressed a scarecrow, and the magpies fled the flax.', 'На Поліссі опудало вбрало, і сороки з льону полетіли.'],
    [(f.synvyr || 0) >= 4, 'It brought Syn and Vyr together across a lake of tears.', 'Синя й Вир через озеро сліз докупи звело.'],
    [(f.ves || 0) >= 2, 'It gave a Hutsul wedding back its music, and the trembita sounded over every mountain.', 'Гуцульському весіллю музику повернуло, і трембіта заграла на всі гори.'],
    [(f.soroka || 0) >= 2, 'It won the days and months back from the old magpie on Pip Ivan.', 'У старої сороки на Піп Івані дні й місяці виграло.'],
    [(f.kam || 0) >= 2, 'It gave Kamianets back its colours, and the flag went up over the castle.', 'Кам\'янцю кольори повернуло, і прапор над замком піднявся.'],
    [(f.dnister || 0) >= 2, 'On the Dniester it gave people back their work.', 'На Дністрі людям їхню роботу повернуло.'],
    [(f.sil || 0) >= 2, 'It counted the chumaks\' salt, all the way to a billion and back.', 'Чумакам сіль порахувало, аж до мільярда і назад.'],
    [(f.odesa || 0) >= 2, 'In Odesa it found the jokes their endings, and half the city roared.', 'В Одесі жартам кінці знайшло, і пів міста реготало.'],
    [(f.posh || 0) >= 2, 'In Vylkove it delivered every parcel, each to whom it belonged.', 'У Вилковому всі посилки рознесло, кожну — кому треба.'],
    [(f.lviv || 0) >= 2, 'In Lviv it rang its friends from under the ground.', 'У Львові з-під землі друзям подзвонило.'],
    [(f.rushnyk || 0) >= 2, 'From the mountains to the sea it helped the neighbours, and Baba Paraska wove it a road rushnyk.', 'Від гір до моря сусідам допомагало, і баба Параска рушник-дорогу йому виткала.'],
    [true, 'And then it came into the old forest, to the hut on hen\'s legs, and beat the old woman not with a sabre, but with words:', 'А тоді прийшло воно в старий ліс, до хатки на курячих ніжках, і не шаблею, а словом стару перемогло:'],
    [true, 'it told Baba Yaga her very own tale, and the words flew out of the stove, home, to the quiet houses.', 'розповіло Бабі Язі її ж таки казку, і слова з печі полетіли додому, по тихих хатах.'],
    [true, `So glory to you, ${n}, for many years! Say your words every day, good people, out loud: for while a word is spoken, nobody can sweep it away.`, `Тож слава тобі, ${v}, на многая літа! Кажіть свої слова щодня, люди добрі, уголос, — бо поки слово сказане, його ніхто не вимете.`],
  ];
  return D.filter(d => d[0]).map(d => L(d[1], d[2]));
}
function singDuma(done) {
  const ostap = entities.find(n => n.id === 'ostap');
  if (ostap) curSpeaker = Object.assign({}, ostap, { ua: 0 });   // the duma is sung in Ukrainian, whatever the setting (T flips it)
  say('Ostap the kobzar', dumaLines(), done);
}
// ─── What you know now ────────────────────────────────────────────────────
const TOPICS = [
  ['кличний відмінок', 'the vocative', () => (S.f.duma || 0) >= 2], ['дієслова руху', 'verbs of motion', () => (S.f.vm || 0) >= VM.length],
  ['теперішній час', 'the present tense', () => S.f.zirka], ['у мене болить, треба', 'aches, and must', () => S.f.znakh],
  ['давальний і родовий', 'the dative and the genitive', () => (S.f.lyst || 0) >= 2], ['наказовий спосіб', 'the imperative', () => S.f.porohy],
  ['місцевий і орудний', 'where, and how you travel', () => (S.f.panas || 0) >= 5], ['минулий час', 'the past tense', () => (S.f.litopys || 0) >= 2],
  ['майбутній час', 'the future tense', () => (S.f.kalyta || 0) >= 2], ['знахідний відмінок', 'the accusative', () => (S.f.opud || 0) >= 2],
  ['прийменники: де? куди?', 'prepositions', () => (S.f.bort || 0) >= 2], ['рід у минулому часі', 'the past tense by gender', () => (S.f.synvyr || 0) >= 3],
  ['орудний відмінок', 'the instrumental', () => (S.f.vatra || 0) >= 3], ['дати й час', 'dates and times', () => (S.f.soroka || 0) >= 2],
  ['узгодження прикметників', 'adjective agreement', () => (S.f.kam || 0) >= 2], ['працювати ким', 'jobs, in the instrumental', () => (S.f.dnister || 0) >= 2],
  ['числівники з іменниками', 'numbers with nouns', () => (S.f.sil || 0) >= 2], ['слова-зв\'язки', 'the little talking words', () => (S.f.odesa || 0) >= 2],
  ['кому? давальний', 'to whom: the dative', () => (S.f.posh || 0) >= 2], ['доконаний вид', 'the perfective', () => (S.f.lviv || 0) >= 2],
  ['гуцульська говірка', 'Hutsul speech', () => (S.f.hutsul || 0) >= 2],
];
function summary(done) {
  const c = caughtCount(), m = masteredCount(), t = TOPICS.filter(x => x[2]());
  const all = c >= N && !has('bandura');
  say('', [L(`[You caught ${c} of ${N} words, and mastered ${m}. You hold all ${NZ} pysanky, and the golden one.]`, `[Ти зловив ${c} з ${N} слів, і ${m} вивчив назавжди. У тебе всі ${NZ} писанок, і ще золота.]`),
    L(`[On the road you learned ${t.length} of ${TOPICS.length} pieces of Ukrainian grammar: ${t.map(x => x[1]).join(' · ')}.]`, `[У дорозі ти вивчив ${t.length} з ${TOPICS.length} тем української граматики: ${t.map(x => x[0]).join(' · ')}.]`),
    L(`[You heard ${Object.keys(S.d || {}).length} of ${DIALECT.length} Hutsul words, and read ${Object.keys(S.cs || {}).length} of ${CSL.length} words of Church Slavonic. You helped ${ERRANDS.filter(x => errandState(x.id) === 2).length} of ${ERRANDS.length} neighbours.]`, `[Ти почув ${Object.keys(S.d || {}).length} з ${DIALECT.length} гуцульських слів і прочитав ${Object.keys(S.cs || {}).length} з ${CSL.length} церковнослов\'янських. Ти допоміг ${ERRANDS.filter(x => errandState(x.id) === 2).length} з ${ERRANDS.length} сусідів.]`),
    ...(all ? [L('[Ostap puts his bandura into your hands. "All thousand. You\'re a кобзар now. Play like a goose with a cold, if you like. It\'s yours."]', '[Остап кладе тобі в руки свою бандуру. «Усі тисяча. Тепер ти кобзар. Грай, як гусак із нежитем, якщо хочеш. Вона твоя.»]'), give('bandura')]
      : [L(`[There are still ${N - c} words out there in the grass. Ostap says he\'ll give his bandura to whoever catches all thousand.]`, `[У траві ще ${N - c} слів. Остап каже, що віддасть свою бандуру тому, хто зловить усі тисячу.]`)]),
    L('ВИШНЕВЕ · Designed by Andrew, built with Claude, in October 2026.', 'ВИШНЕВЕ · Задумав Андрій, збудував Claude, у жовтні 2026 року.'),
    L('The thousand words and their voices: «1000 Ukrainian Words 2.0», Ukrainian Lessons. The verbs of motion follow O. V. Kryvolapova. The order of the grammar follows the Peace Corps Ukraine language manuals.', 'Тисяча слів і їхні голоси: «1000 Ukrainian Words 2.0», Ukrainian Lessons. Дієслова руху — за О. В. Криволаповою. Порядок граматики — за підручниками Корпусу Миру в Україні.'),
    L('The tunes are traditional Ukrainian melodies, many from Orest Lechnowsky\'s transcriptions, with Leontovych\'s Щедрик and Lysenko\'s Молитва за Україну. The stories belong to Gogol, Lesya Ukrainka, Kotsiubynsky, Nestor the Chronicler, and the grandmothers who told them first.', 'Мелодії — українські народні, багато в записах Ореста Лехновського, а ще Щедрик Леонтовича і Молитва за Україну Лисенка. Історії належать Гоголю, Лесі Українці, Коцюбинському, Несторові Літописцю і бабусям, які розповіли їх першими.'),
    L('Дякую! Thank you for playing. Keep saying your words, out loud, every day. There are still some out there in the grass.', 'Дякую, що грали! Кажіть свої слова уголос, щодня. У траві їх ще трохи лишилося.')], done);
}

// ─── After the end ────────────────────────────────────────────────────────
function postYaga(npc, done) {
  say(npc.name, [L('Well, little dove? Have you come to tell me my tale? With the frightening bits?', 'Ну, голубчику? Прийшов розповісти мені мою казку? Зі страшними місцями?')], null,
    menu([L('Tell her tale', 'Розповісти казку'), L('Not today', 'Не сьогодні')], i => {
      if (i) return say(npc.name, [L('Then say your words somewhere else. Loudly. I\'m listening for quiet houses. ...For old times\' sake.', 'Тоді кажи свої слова деінде. Голосно. Я прислухаюся до тихих хат. ...За старою пам\'яттю.')], done);
      tellTale(true, q => say(npc.name, q && q.score >= 8 ? [L('[She listens with her eyes shut, and at the frightening bits she grins with all three of her teeth.]', '[Вона слухає, заплющивши очі, а на страшних місцях усміхається всіма трьома зубами.]'), L('Again next week. Bring a candle. It\'s better with a candle.', 'Наступного тижня ще раз. Принеси свічку. Зі свічкою краще.')] : [L('Next time, then.', 'Тоді наступного разу.')], done));
    }));
}
// Ostap: the coffee from Lviv, and afterwards, the duma whenever you like
const ostapBefore = findNpc('ostap').talk;
findNpc('ostap').talk = (npc, done) => {
  if (has('kava')) {
    take('kava'); S.f.kava = 1; saveSoon();
    return say(npc.name, [L('Is that... coffee? From Lviv? From Ilona? Oh, you wonderful child.', 'Це... кава? Зі Львова? Від Ілони? Ох, ти ж моє золото.'),
      L('Now I can stay awake long enough to write your duma. Only a duma needs an ending, and I haven\'t got one. That part, you\'ll have to bring me yourself.', 'Тепер я не спатиму, доки не напишу твою думу. Тільки думі потрібен кінець, а в мене його нема. Цю частину тобі доведеться принести самому.')], done);
  }
  if (!S.f.yaga) return ostapBefore(npc, done);
  say(npc.name, [L('Sit, sit. What\'ll it be?', 'Сідай, сідай. Що будемо?')], null, menu([L('Your duma', 'Моя дума'), L('Practise words', 'Повправлятися'), L('Goodbye', 'До побачення')],
    i => i === 0 ? singDuma(done) : i === 1 ? ostapBefore(npc, done) : done()));
};

// ─── Who's here now ───────────────────────────────────────────────────────
// at the finale, the friends you rang from Lviv wait in the hut's yard; afterwards, people are home
const atFinale = bit => () => badgeCount() >= NZ && !S.f.yaga && !!(dzvin() & bit);
const finaleCheer = lines => (n, done) => say(n.name, lines, done);
NPCS.forest.push(
  { id: 'fin-hanna', name: 'Baba Hanna', ua: 5, tx: 26, ty: 7, dir: 'right', pal: P_HANNA, mods: ['skirt', 'dots'], when: atFinale(1),
    talk: finaleCheer([L('We\'re here, sonechko! The whole of Vyshneve! And we\'re not being quiet!', 'Ми тут, сонечко! Усе Вишневе! І мовчати не будемо!')]) },
  { id: 'fin-mykyta', name: 'Mykyta the cabbie', ua: 5, tx: 34, ty: 8, dir: 'left', pal: P_CITY('#e9b949', '#3a3046'), mods: ['hat'], when: atFinale(2),
    talk: finaleCheer([L('Taxi\'s at the edge of the forest, with half of Podil in it. They won\'t stop talking. Perfect.', 'Таксі на узліссі, а в ньому пів Подолу. Ніхто не замовкає. Чудово.')]) },
  { id: 'fin-ivanka', name: 'Ivanka', ua: 9, tx: 27, ty: 9, dir: 'right', pal: P_HUTSUL('#e8794a', '#c8383a'), mods: ['skirt', 'dots'], when: atFinale(4),
    talk: finaleCheer([L('Ади! I brought Mytro, and Mytro brought the trembita. Go on in. We\'ll be loud.', 'Ади! Я привела Митра, а Митро приніс трембіту. Іди. Ми будемо гучні.')]) },
  { id: 'fin-mytro', name: 'Mytro the ґазда', ua: 18, tx: 26, ty: 8, dir: 'up', pal: P_HUTSUL('#c8383a', '#c8383a'), mods: ['hat', 'moustache'], when: atFinale(4),
    talk: finaleCheer([L('[Mytro lifts the trembita to his lips and waits for his moment, like a man about to fire a cannon.]', '[Митро підносить трембіту до вуст і чекає свого моменту, як чоловік біля гармати.]')]) },
  { id: 'fin-lukash', name: 'Lukash', ua: 7, tx: 33, ty: 9, dir: 'left', pal: P_LUKASH, when: atFinale(8),
    talk: finaleCheer([L('I\'ve got the sopilka. When it goes quiet in there, I\'ll play. Somebody might hear.', 'Сопілка зі мною. Коли там стане тихо, я заграю. Може, хтось почує.')]) },
);
NPCS.home.push({ id: 'tato', name: 'Tato', ua: 3, tx: 6, ty: 5, dir: 'down', when: () => !!S.f.yaga, pal: P_CITY('#3f6fc4', '#3a3046'), mods: ['moustache', 'hat'],
  talk: (n, done) => say(n.name, [L('Сідай біля мене, дитино. I drove the whole of Ukraine this year and didn\'t say a word to anybody. Now you talk. In Ukrainian. Tell me everything.', 'Сідай біля мене, дитино. Я цього року об\'їздив усю Україну і ні з ким слова не сказав. Тепер ти говори. Українською. Розкажи мені все.'),
    L('A ghost at Synevyr? A kozak who writes letters? A magpie that plays games? ...I\'ve driven past every one of those places, and I never stopped.', 'Привид на Синевирі? Козак, що пише листи? Сорока, яка грає в ігри? ...Я повз усі ці місця проїжджав і жодного разу не зупинився.'),
    L('Next spring, you\'re coming with me. You can do the talking.', 'Наступної весни поїдеш зі мною. Говоритимеш ти.')], done) });
NPCS.hrytsenko.push({ id: 'daryna-home', name: 'Daryna', ua: 15, tx: 6, ty: 5, dir: 'down', when: () => !!S.f.yaga && errandState('hrytsenko') === 2, pal: P_CITY('#4c9c66', '#3a3046'), mods: ['skirt', 'glasses'],
  talk: (n, done) => say(n.name, [L('We came back! The stove was warm, just like you said. Somebody ate half the pyrohy in the night. Mama says mice. I say domovyk.', 'Ми повернулися! Піч була тепла, як ти й казав. Хтось уночі з\'їв пів пирогів. Мама каже — миші. Я кажу — домовик.')], done) });
NPCS.polissia.push({ id: 'mavka-p', name: 'Mavka', ua: 7, tx: 13, ty: 19, dir: 'left', when: () => !!S.f.yaga && S.f.lukash === 2, pal: findNpc('mavka').pal, mods: ['skirt', 'vinok', 'bark'],
  talk: (n, done) => say(n.name, [L('He still plays it wrong in the middle. I haven\'t told him. I like it wrong.', 'Він досі грає неправильно посередині. Я йому не кажу. Мені подобається неправильно.')], done) });
