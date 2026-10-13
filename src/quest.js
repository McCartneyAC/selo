// ─── Things you carry ─────────────────────────────────────────────────────
const ITEMS = {
  bread: { ua: 'окраєць хліба', en: 'a crust of bread', desc: 'From the loaf on the table at home. For someone who lives behind a stove.' },
  candle: { ua: 'свічка', en: 'a beeswax candle', desc: 'From the church. It has burned before an icon, so it will light the way to things that don\'t want to be found.' },
  wreath: { ua: 'вінок', en: 'Oksana\'s wreath', desc: 'Cornflowers, poppies and periwinkle, still damp from a year at the bottom of the pond.' },
  fern: { ua: 'цвіт папороті', en: 'the fern flower', desc: 'It blooms one night a year. Whoever holds it understands the speech of animals.' },
  sopilka: { ua: 'сопілка', en: 'a reed flute', desc: 'The chuhaister\'s spare. It only knows dance tunes.' },
  ear: { ua: 'колосок', en: 'an ear of wheat', desc: 'The polyovyk\'s gift. Keep it, and the field will always know you.' },
  scale: { ua: 'луска', en: 'a fish scale', desc: 'From the vodyanyk\'s beard. Water will always carry you home.' },
  feather: { ua: 'перо лелеки', en: 'a stork feather', desc: 'Lost on purpose, she says.' },
  honey: { ua: 'стільник', en: 'a piece of honeycomb', desc: 'From the bees, who know every flower\'s name.' },
  beets: { ua: 'буряки', en: 'a bunch of beets', desc: 'From Halyna\'s garden, for Marichka\'s borshch.' },
  flour: { ua: 'борошно', en: 'a sack of flour', desc: 'From the miller\'s house, for Olena\'s pies.' },
  book: { ua: 'співаник', en: 'Lida\'s songbook', desc: 'Ostap borrowed it a year ago. Some of the pages have new verses in the margins.' },
  thread: { ua: 'червоні нитки', en: 'red embroidery thread', desc: 'From Olena\'s stall, for Baba Paraska\'s loom.' },
  salt: { ua: 'сіль', en: 'a bag of Crimean salt', desc: 'From Ivan the chumak, for Halyna\'s pickles.' },
  vyshyvanka: { ua: 'вишиванка', en: 'an embroidered shirt', desc: 'From the village, for all your help. Gold thread on white linen.' },
  honeypot: { ua: 'горщик меду', en: 'a pot of honey', desc: 'From Hryhoriy\'s hives, for Vakula\'s medovukha.' },
  fish: { ua: 'в\'язка риби', en: 'a string of fish', desc: 'From Panas the fisherman, for Kozak Mamai\'s supper.' },
  herbs: { ua: 'лікарські трави', en: 'healing herbs', desc: 'Yaryna\'s bundle of St John\'s wort and chamomile, for Baba Hanna\'s knees.' },
  sleeve: { ua: 'червоний рукав', en: 'a red sleeve', desc: 'Torn from a red svytka. It smells faintly of sulphur.' },
  boots: { ua: 'чоботи-скороходи', en: 'seven-league boots', desc: 'From Yaryna, for walking the whole road of verbs. You walk and run faster now.' },
  pipe: { ua: 'люлька', en: 'Mamai\'s pipe', desc: 'Carved cherry wood, cold for years. The otaman will know it.' },
  horseshoe: { ua: 'підкова', en: 'a horseshoe', desc: 'From Hnidko, Mamai\'s horse. Whistle at any signpost and he\'ll carry you anywhere you\'ve been.' },
  mapa: { ua: 'татова карта доріг', en: 'tato\'s road map', desc: 'Every road in Ukraine, with tato\'s pencil marks: the ferry, the buses, the night train. Look at the КРАЙ page in your словник.' },
  milkyway: { ua: 'Чумацький Шлях', en: 'the Chumak\'s Road', desc: 'Ivan\'s gift: the Milky Way. The chumaks followed it home across the steppe, and now you know all its verbs.' },
};
const has = id => !!(S.items && S.items[id]);
function give(id) {
  S.items = S.items || {}; S.items[id] = 1; sfx('item'); renderHud(); saveSoon();
  if (id === 'vyshyvanka') dressPlayer();
  return L(`[You put ${ITEMS[id].ua} in your торба: ${ITEMS[id].en}.]`, `[Ти кладеш у торбу: ${ITEMS[id].ua}.]`);
}
function take(id) { if (S.items) delete S.items[id]; saveSoon(); }
function dressPlayer() { player.frames = buildPerson(has('vyshyvanka') ? { r: C.gold, x: '#2d4f91' } : {}); }
const W_ = ua => WORDS.findIndex(w => w[0].split(/\s*[=,]\s*/).includes(ua));

// ─── The Kupala Night story ───────────────────────────────────────────────
// Oksana lost her wreath; the fern flower blooms once a year; the old house
// spirits know the way. Flags live in S.f: q1 heard about Kupala, q2 asked
// Baba Hanna, dom met the domovyk, night is Kupala night, chu the chuhaister
// let you pass, fern you found the flower.
// the Kupala story first, then every other thread that's under way
function questText() {
  const f = S.f;
  if (!f.book) return 'Find Ostap the kobzar by the church in Vyshneve.';
  const others = dumaText() + farText() + northText() + mountainText() + podilliaText() + seaText() + lvivText();
  if (f.night) return (!f.chu ? 'It\'s Kupala night! Go into the old forest and find the chuhaister on the western path.'
    : !f.fern ? 'The chuhaister has let you pass. Find the fern flower in the clearing beyond him.' : 'Go home to Vyshneve. Dawn is coming.');
  return kupalaText() + ` You know ${caughtCount()} of ${N} words, and you have ${badgeCount()} of ${NZ} pysanky.` + others
    + (badgeCount() === NZ && !f.yaga ? ' Baba Yaga is waiting in the forest.' : '');
}
function kupalaText() {
  const f = S.f;
  if (!f.q1) return 'Oksana, by the river in Vyshneve, keeps talking about Kupala night. Ask her about it.';
  if (!f.q2) return 'Ask Baba Hanna at the well about the fern flower.';
  if (!f.dom && !has('bread')) return 'The domovyk of the empty Hrytsenko house likes bread. There\'s a loaf on the table at home.';
  if (!f.dom) return 'Take the bread into the Hrytsenko house (south-west Vyshneve) and leave it by the stove.';
  if (!f.kupala) {
    const need = [];
    if (!has('wreath')) need.push('Oksana\'s wreath: the vodyanyk in the Kalynivka pond has it.');
    if (!has('candle')) need.push(`A candle from the dyak in the church. He wants you to know 40 words (you know ${caughtCount()}).`);
    return need.length ? 'For Kupala night you need: ' + need.join(' ') : 'Bring the wreath back to Oksana.';
  }
  return f.fern ? 'You understand the animals now. Talk to the stork, the bees, the geese, the dog and your cat.' : '';
}

function oksanaTalk(npc, done) {
  const n = npc.name, f = S.f;
  if (!f.book) return say(n, [L('On Kupala night the girls float their wreaths down the river. Вінок: a wreath.', 'На Купала дівчата пускають вінки за водою.'),
    L('Last year mine got caught on Taras\'s fishing line. Everyone laughed.', 'Торік мій вінок зачепився за вудку Тараса. Усі сміялися.'), L('I didn\'t.', 'А я ні.')], done);
  if (!f.q1) {
    f.q1 = 1; saveSoon();
    return say(n, [
      L('Kupala night is coming. Івана Купала: the shortest night of the year. We jump over the fire and float our wreaths down the river.', 'Скоро ніч на Івана Купала, найкоротша ніч року. Ми стрибаємо через вогонь і пускаємо вінки по річці.'),
      L('But I have no wreath. Last year mine got caught on Taras\'s line, and then the river took it.', 'Але в мене немає вінка. Торік він зачепився за вудку Тараса, а потім його забрала річка.'),
      L('And they say that on Kupala night the fern flower blooms, deep in the old forest. Whoever finds it can understand the animals. Nobody has found it in a hundred years.', 'А ще кажуть, що на Купала в старому лісі цвіте папороть. Хто знайде цвіт, той розумітиме мову тварин. Його ніхто не знаходив уже сто років.'),
      L('Ask Baba Hanna at the well. She knows all the old stories.', 'Спитай бабу Ганну біля криниці. Вона знає всі старі історії.')], done);
  }
  if (f.fern) return say(n, [L('You really found it? The цвіт папороті?', 'Ти справді його знайшов? Цвіт папороті?'), L('Then tell me what the stork says about me. No, don\'t. Yes, do.', 'Тоді скажи, що про мене каже лелека. Ні, не кажи. Ні, кажи.')], done);
  if (f.kupala) return say(n, [L('Meet us at the fire by the bridge! And then the forest. The chuhaister will be dancing.', 'Приходь до вогнища біля мосту! А потім у ліс. Там танцюватиме чугайстер.')], done);
  if (has('wreath') && has('candle') && f.dom) {
    take('wreath'); f.kupala = 1; f.night = 1; saveSoon();
    return say(n, [L('My wreath! From the bottom of the pond? You talked to the VODYANYK?', 'Мій вінок! Із дна ставу? Ти говорив з ВОДЯНИКОМ?'), L('Then nothing can stop us. Tonight is Kupala!', 'Тоді нас ніщо не зупинить. Сьогодні Купала!')], () => {
      sfx('night'); playMusic(areaMusic());
      say(n, [L('The sun is going down. Look!', 'Сонце сідає. Дивись!'),
        L('Meet us at the fire by the bridge. Then take your candle into the old forest. The chuhaister guards the path on the western side.', 'Приходь до вогнища біля мосту. А потім бери свічку і йди в старий ліс. Чугайстер стереже стежку на заході.')], done);
    });
  }
  if (has('wreath')) return say(n, [L('You found my wreath?! Give it to me when you\'re ready for Kupala night: you\'ll need a candle from the church, and the domovyk\'s blessing.', 'Ти знайшов мій вінок?! Віддаси, коли будеш готовий до Купала: тобі ще потрібна свічка з церкви і благословення домовика.')], done);
  say(n, [L('Did you ask Baba Hanna? I can\'t wait for Kupala.', 'Ти питав бабу Ганну? Я не можу дочекатися Купала.')], done);
}

function hannaTalk(npc, done) {
  const f = S.f;
  if (f.q1 && !f.q2) {
    f.q2 = 1; saveSoon();
    return say(npc.name, [
      L('The fern flower? Hm. Ask the one who has lived in this village longest. Not me.', 'Цвіт папороті? Гм. Спитай того, хто живе в селі найдовше. Не мене.'),
      L('The domovyk of the Hrytsenko house. The Hrytsenkos went to the city, but a domovyk never leaves his stove.', 'Домовика з хати Гриценків. Гриценки поїхали до міста, а домовик ніколи не покидає своєї печі.'),
      L('He won\'t talk to just anyone. Take him bread. Leave it by the pich. Then be polite.', 'Він не з кожним говорить. Віднеси йому хліба. Залиш біля печі. І будь чемним.')], done);
  }
  if (S.f.book && badgeCount() >= 1 && !has('mapa')) return say(npc.name, [L('Wait, sonechko. Your tato left this with me last time his lorry came through. His old road map. He said you\'d want it when you started going places.', 'Стривай, сонечко. Твій тато залишив мені це, коли востаннє проїжджав. Його стара карта доріг. Казав, що тобі знадобиться, коли почнеш мандрувати.'),
    L('Look, he\'s marked it all in pencil: where the ferry goes, where the buses go, the night train to the mountains. That man has driven every road in Ukraine.', 'Дивись, він усе позначив олівцем: куди йде пором, куди автобуси, нічний потяг у гори. Цей чоловік проїхав кожну дорогу в Україні.'),
    give('mapa'), L('[Open the словник (C) and look at the КРАЙ page: the map shows where you are, and how to get anywhere.]', '[Відкрий словник (C), сторінку КРАЙ: на карті видно, де ти, і як дістатися будь-куди.]')], done);
  return keeperTalk(0, [L('The zhuravel creaks, but it has never once dropped a bucket. Forty years I\'ve drawn water here. Вода: water.', 'Журавель скрипить, але жодного разу не впустив відра. Сорок років я тут набираю воду.'),
    ...(S.f.book && caughtCount() >= 20 ? [L('When I was small, my baba told me about Baba Yaga every winter night, and I was so frightened I loved it. Nobody tells children that tale any more. Funny, isn\'t it, that it\'s her taking our words now.', 'Коли я була мала, баба щозими розповідала мені про Бабу Ягу, і я так боялася, що аж любила. Тепер ніхто не розповідає дітям цієї казки. Дивно, правда, що тепер вона забирає наші слова.')] : [])])(npc, done);
}

const HOUSE_WORDS = ['хата', 'дім', 'стіл', 'вікно', 'двері', 'ліжко', 'хліб', 'ключ'].map(W_);
function domovykTalk(npc, done) {
  const lines = S.f.kupala ? [L('Kupala came and went, and the house is still standing. Good.', 'Купала минув, а хата стоїть. Добре.'), L('Come and practise house words with me whenever you like.', 'Приходь повторювати слова хати, коли захочеш.')]
    : [L('Three things open the chuhaister\'s path on Kupala night: a wreath that has been in the water, a candle that has burned in church, and someone who knows the words of the house.', 'Три речі відкривають стежку чугайстра на Купала: вінок, що побував у воді, свічка, що горіла в церкві, і той, хто знає слова хати.'),
      L('You know the words now. Go and find the other two.', 'Слова ти вже знаєш. Іди шукай решту.')];
  say(npc.name, lines, null, { options: [L('Practise house words', 'Повторити слова хати'), L('Thank you', 'Дякую')], pick: i => {
    if (i) return done();
    teach('The domovyk', HOUSE_WORDS, () => done());
  } });
}

function dyakTalk(npc, done) {
  const n = npc.name;
  if (has('candle') || S.f.kupala) return say(n, [L('Keep that candle out of the wind.', 'Бережи свічку від вітру.'),
    L('Церква: church. Пісня: song. We sing here every Sunday, if you want to learn the words.', 'Ми співаємо тут щонеділі. Хочеш вивчити слова?')], null,
    { options: [L('Teach me', 'Навчіть мене'), L('Not now', 'Не зараз')], pick: i => i ? done() : teach('The dyak', ['церква', 'пісня', 'співати', 'музика'].map(W_), () => done()) });
  if (caughtCount() < 40) return say(n, [L('A candle? A candle is for someone who knows what they are asking for.', 'Свічку? Свічка для того, хто знає, про що просить.'),
    L(`Come back when you know forty words. You know ${caughtCount()}.`, `Приходь, коли знатимеш сорок слів. Ти знаєш ${caughtCount()}.`)], done);
  say(n, [L('Forty words. You have been busy.', 'Сорок слів. Ти не сидів без діла.'), L('Here. A beeswax candle. Light it where it\'s darkest.', 'Ось воскова свічка. Запали її там, де найтемніше.'), give('candle')], done);
}

function vodyanykTalk(npc, done) {
  const n = npc.name;
  if (!S.f.q1) return say(n, [L('Blub. Who disturbs the vodyanyk? Go away, I\'m counting my fish.', 'Буль. Хто турбує водяника? Іди геть, я рахую рибу.')], done);
  if (has('wreath') || S.f.kupala) return say(n, [L('Blub. Mind that wreath. And mind the rusalky on Kupala night: they tickle.', 'Буль. Бережи вінок. І стережися русалок на Купала: вони лоскочуть.')], done);
  say(n, [L('Oksana\'s wreath? Oho. The river brought it to me last Kupala. A pretty thing.', 'Оксанин вінок? Ого. Річка принесла його мені торік на Купала. Гарна річ.'),
    L('I\'ll give it back to someone who knows the words of the water. Five words. Get four.', 'Я віддам його тому, хто знає слова води. П\'ять слів. Треба чотири.')], null, yesNo(go => {
    if (!go) return say(n, [L('Blub.', 'Буль.')], done);
    teach('The vodyanyk', ['вода', 'риба', 'річка', 'озеро', 'дощ'].map(W_), q => {
      if (q.stopped || q.score < 4) return say(n, [L(`${q.score} of 5. The water doesn't know you yet. Blub.`, `${q.score} з 5. Вода тебе ще не знає. Буль.`)], done);
      say(n, [L(`${q.score} of 5! Here.`, `${q.score} з 5! Тримай.`), give('wreath'),
        L('And take a scale from my beard, so the water always carries you home.', 'І візьми луску з моєї бороди, щоб вода завжди приносила тебе додому.'), give('scale')], done);
    }, 2);
  }));
}

function chuTalk(npc, done) {
  const n = npc.name;
  if (!S.f.night) return say(n, [L('HO! I am the чугайстер! I chase mavkas and dance till dawn.', 'ГО! Я чугайстер! Ганяю мавок і танцюю до світанку.'),
    L('The flower beyond me? It sleeps. Come back on Kupala night, little one. Then we\'ll see if you can dance.', 'Квітка за мною? Вона спить. Приходь на Купала, малий. Тоді побачимо, чи вмієш ти танцювати.')], done);
  npc.dancing = true;
  say(n, [L('HO-HO! Kupala night! The flower is waking!', 'ГО-ГО! Купальська ніч! Квітка прокидається!'),
    L('Nobody passes the chuhaister without dancing. My dance is words: the words of the night. Five of them. Get three.', 'Ніхто не пройде повз чугайстра без танцю. Мій танець — це слова ночі. П\'ять слів. Треба три.')], null, yesNo(go => {
    if (!go) { npc.dancing = false; return say(n, [L('Then sit and watch me dance!', 'Тоді сідай і дивись, як я танцюю!')], done); }
    teach('The chuhaister', ['ніч', 'місяць', 'зірка', 'вогонь', 'танцювати'].map(W_), q => {
      npc.dancing = false;
      if (q.stopped || q.score < 3) return say(n, [L(`${q.score} of 5! You dance like a cow on ice. Again!`, `${q.score} з 5! Танцюєш, як корова на льоду. Ще раз!`)], done);
      S.f.chu = 1; saveSoon();
      say(n, [L(`${q.score} of 5! HO! You dance like a chuhaister!`, `${q.score} з 5! ГО! Танцюєш, як справжній чугайстер!`),
        L('Go on. The flower is in the clearing beyond. Take this, for next year.', 'Іди. Квітка на галявині за мною. І візьми ось це, на наступний рік.'), give('sopilka')], done);
    }, 3);
  }));
}

function fernTalk(npc, done) {
  take('candle'); S.f.fern = 1; saveSoon();
  sfx('badge');
  say('', [L('The candle flares, and in its light a fern unfolds a flower that should not exist: red and gold, warm as a coal.', 'Свічка спалахує, і в її світлі папороть розкриває квітку, якої не буває: червону й золоту, теплу, як жарина.'),
    L('You pick it. The candle burns down to nothing.', 'Ти зриваєш її. Свічка догорає.'), give('fern'),
    L('All around you the forest starts to talk. An owl is complaining about mice. A hedgehog is complaining about the owl.', 'Довкола заговорив ліс. Сова скаржиться на мишей. Їжак скаржиться на сову.'),
    L('You can understand them. Go home: dawn is coming.', 'Ти їх розумієш. Іди додому: світає.')], done);
}

function polyovykTalk(npc, done) {
  const n = npc.name;
  const words = ['трава', 'земля', 'вітер', 'сонце', 'корова', 'кінь'].map(W_);
  if (has('ear')) return say(n, [L('The wheat is high. Go on, I\'ll be here till harvest.', 'Пшениця висока. Іди, я тут до жнив.')], null,
    { options: [L('Practise field words', 'Повторити слова поля'), L('Goodbye', 'До побачення')], pick: i => i ? done() : teach('The polyovyk', words, () => done(), 1) });
  say(n, [L('Shh! I am the польовик, the field\'s own spirit. At noon I walk in the wheat and count the ears.', 'Тсс! Я польовик, дух поля. Опівдні я ходжу пшеницею і рахую колоски.'),
    L('You can see me? Then learn the field\'s words. Get four of six and I\'ll give you something.', 'Ти мене бачиш? Тоді вивчи слова поля. Чотири з шести, і я тобі дещо дам.')], null, yesNo(go => {
    if (!go) return say(n, [L('Then mind where you step.', 'Тоді дивись під ноги.')], done);
    teach('The polyovyk', words, q => {
      if (q.stopped || q.score < 4) return say(n, [L(`${q.score} of 6. The wheat whispers that you'll do better tomorrow.`, `${q.score} з 6. Пшениця шепоче, що завтра вийде краще.`)], done);
      say(n, [L(`${q.score} of 6. Good.`, `${q.score} з 6. Добре.`), give('ear')], done);
    }, 1);
  }));
}

// talking to animals only works once you've held the fern flower
function animalTalk(kind, done) {
  if (!S.f.fern) return false;
  const HENS = {
    hen1: [L('Ko-ko! You understand me? Then understand THIS: I laid an egg. Яйце. An EGG.', 'Ко-ко! Ти мене розумієш? Тоді зрозумій ОЦЕ: я знесла яйце. ЯЙЦЕ.'), L('Grandpa will paint it and call it a pysanka, and nobody will remember who laid it.', 'Дідусь його розпише, назве писанкою, і ніхто не згадає, хто його зніс.')],
    hen2: [L('KO! I am the proudest hen on the khutir. Курка: hen. Півень: rooster. Курча: chick. I have eleven курчата.', 'КО! Я найгордовитіша курка на хуторі. Курка, півень, курча. У мене одинадцятеро курчат.'), L('...Ten. One is a duckling. We don\'t talk about it.', '...Десятеро. Одне — каченя. Ми про це не говоримо.')],
    hen3: [L('Ko. I am thinking about grain. Зерно.', 'Ко. Я думаю про зерно.'), L('Sirko says the wolf says there\'s a fox. Лисиця. I am thinking about that too.', 'Сірко каже, що вовк каже, що є лисиця. Я й про це думаю.')],
  };
  if (HENS[kind]) { say('A hen', HENS[kind], done); return true; }
  if (kind === 'cat' && !S.f.catLesson) {
    say('Murko', [L('Oh, so NOW you understand me.', 'О, то ТЕПЕР ти мене розумієш.'), L('I have been telling you for years. The milk is low. The bed is mine. The pich is mine.', 'Я роками тобі кажу. Молока мало. Ліжко моє. Піч моя.')],
      () => teach('Murko', ['молоко', 'кіт', 'ліжко'].map(W_), () => { S.f.catLesson = 1; saveSoon(); }));
    return true;
  }
  if (kind === 'cat') say('Murko', [L('Milk. Now. Please.', 'Молока. Зараз. Будь ласка.')]);
  else if (kind === 'dog') say('Sirko', [L('Woof! You understand me? Then you know the story: «Був собі пес Сірко». That\'s me. The wolf and I are friends now. Mostly.', 'Гав! Ти мене розумієш? Тоді ти знаєш казку «Був собі пес Сірко». Це я. Ми з вовком тепер друзі. Майже.')]);
  else say('A goose', [L('Ha-ha! You can hear us? Finally!', 'Га-га! Ти нас чуєш? Нарешті!'), L('We are the geese of this river. We bite. We are proud of it.', 'Ми гуси цієї річки. Ми щипаємося. І пишаємося цим.'), L('Гуска: goose. Гусак: gander. Learn it, or we bite you.', 'Гуска. Гусак. Вивчи, а то вщипнемо.')]);
  return true;
}

// ─── Lessons in the home region: Lida's verbs, Yaryna's aches ─────────────
const CONJ = [
  ['Я ___ книжку.', 'I\'m reading a book.', ['читаю', 'читаєш', 'читає'], 0, 'Читати, the first conjugation: я читаю, ти читаєш, він читає, ми читаємо, ви читаєте, вони читають.'],
  ['Ти ___ українською?', 'Do you speak Ukrainian?', ['говориш', 'говорю', 'говорить'], 0, 'Говорити, the second conjugation: я говорю, ти говориш, він говорить, ми говоримо, ви говорите, вони говорять.'],
  ['Вона гарно ___.', 'She sings beautifully.', ['співає', 'співаю', 'співаєш'], 0, 'Співати: вона співає.'],
  ['Ми ___ слова щодня.', 'We learn words every day.', ['вчимо', 'вчать', 'вчиш'], 0, 'Вчити: ми вчимо, ви вчите, вони вчать.'],
  ['Діти ___ в зошитах.', 'The children are writing in their exercise books.', ['пишуть', 'пише', 'пишемо'], 0, 'Писати: я пишу, ти пишеш, вони пишуть. The с becomes ш all the way through.'],
  ['Ви ___ каву чи чай?', 'Do you drink coffee or tea?', ['п\'єте', 'п\'ємо', 'п\'ють'], 0, 'Пити: я п\'ю, ти п\'єш, ми п\'ємо, ви п\'єте, вони п\'ють.'],
  ['Я ___ Андрія у вікно.', 'I can see Andriy through the window.', ['бачу', 'бачиш', 'бачить'], 0, 'Бачити, the second conjugation: я бачу, ти бачиш.'],
  ['Ти так гарно ___!', 'You draw so beautifully!', ['малюєш', 'малюю', 'малює'], 0, 'Verbs in -увати go -ую, -уєш: малювати → я малюю, ти малюєш.'],
  ['Вони ___ в Калинівці.', 'They live in Kalynivka.', ['живуть', 'живе', 'живемо'], 0, 'Жити: я живу, ти живеш, вони живуть.'],
  ['Що ти ___?', 'What are you doing?', ['робиш', 'робить', 'роблю'], 0, 'Робити: я роблю, ти робиш. After б, в, м, п, ф, the я form adds л: роблю, люблю.'],
  ['Я ___ українську мову.', 'I love the Ukrainian language.', ['люблю', 'любиш', 'любить'], 0, 'Любити: я люблю, ти любиш.'],
  ['Мій брат ___ до школи щодня.', 'My brother goes to school every day.', ['ходить', 'ходжу', 'ходиш'], 0, 'Ходити: я ходжу (д becomes дж for я), ти ходиш, він ходить.'],
];
function lidaTalk(npc, done) {
  const n = npc.name, test = keeperTalk(3, [L('Welcome to the Kalynivka school. Школа: school. Учитель, учителька: teacher.', 'Ласкаво просимо до калинівської школи.'),
    L('I teach the children their letters, and I test anybody who walks through that door.', 'Я вчу дітей абетки і перевіряю кожного, хто заходить у ці двері.')]);
  const chat = () => say(n, [L('A verb changes its ending for who\'s doing it: я читаю, ти читаєш. Learn the endings once, and a thousand verbs open up like a book.', 'Дієслово змінює закінчення залежно від того, хто діє: я читаю, ти читаєш. Вивчи закінчення раз, і тисяча дієслів відкриється, як книжка.')], done);
  if (!S.f.book) return test(npc, done);
  const lesson = () => say(n, [L('Today\'s lesson: the present tense. Two families of verbs. Читати: я читаю, ти читаєш, він читає. Говорити: я говорю, ти говориш, він говорить.', 'Сьогодні урок: теперішній час. Дві дієвідміни. Читати: я читаю, ти читаєш, він читає. Говорити: я говорю, ти говориш, він говорить.'),
    L('Ten sentences. Eight right, and you get a gold star in your словник.', 'Десять речень. Вісім правильних, і в словнику буде золота зірочка.')], () =>
    roadQuiz(shuffle(CONJ.slice()).slice(0, 10), 'УРОК', q => {
      if (q.stopped) return say(n, [L('The bell already? Fine. Homework: everything.', 'Уже дзвоник? Гаразд. Домашнє завдання: усе.')], done);
      if (q.score < 8) return say(n, [L(`${q.score} of 10. Look at the endings again: -ю, -єш, -є; -ю, -иш, -ить. Then come back.`, `${q.score} з 10. Подивися ще раз на закінчення: -ю, -єш, -є; -ю, -иш, -ить. І приходь знову.`)], done);
      const first = !S.f.zirka; S.f.zirka = 1; saveSoon(); sfx(first ? 'badge' : 'ok');
      say(n, [L(`${q.score} of 10! ${first ? '[Lida draws a gold star in the margin of your словник.] ' : ''}Молодець.`, `${q.score} з 10! ${first ? '[Ліда малює золоту зірочку на полях твого словника.] ' : ''}Молодець.`)], done);
    }, ['ТЕПЕРІШНІЙ ЧАС', 'Урок у школі', 'the present tense', 'Which ending fits?'], 3));
  say(n, [L('Yes? Quietly, the children are working.', 'Так? Тихенько, діти працюють.')], null, menu([L('Your test', 'Ваше випробування'), L('A lesson', 'Урок'), L('Just chatting', 'Просто поговорити')], i => i === 0 ? test(npc, done) : i === 1 ? lesson() : chat()));
}
const ACHES = [
  ['У мене ___ голова.', 'My head hurts.', ['болить', 'болять', 'болю'], 0, 'У мене болить + one thing that hurts. Literally: at me hurts the head.'],
  ['У баби Ганни ___ коліна.', 'Baba Hanna\'s knees hurt.', ['болять', 'болить', 'болі'], 0, 'Several things: болять. Коліна болять.'],
  ['Що в тебе ___?', 'What hurts?', ['болить', 'болять', 'хворий'], 0, 'Що в тебе болить? What every healer asks first.'],
  ['Учора в мене ___ зуб.', 'Yesterday my tooth hurt.', ['болів', 'боліла', 'болить'], 0, 'In the past it agrees with what hurt: зуб болів, голова боліла.'],
  ['Тобі ___ пити чай з ромашкою.', 'You need to drink chamomile tea.', ['треба', 'можна', 'болить'], 0, 'Тобі треба: you need to, you must. Кому + треба + the infinitive.'],
  ['Мені ___ полежати три дні.', 'I have to lie down for three days.', ['треба', 'хочу', 'болить'], 0, 'Мені треба полежати.'],
  ['Він ___: у нього грип.', 'He\'s ill: he has the flu.', ['хворий', 'хвора', 'хворе'], 0, 'Хворий (he), хвора (she). And у нього грип: he has the flu.'],
  ['Тобі вже ___?', 'Are you feeling better already?', ['краще', 'кращий', 'добрий'], 0, 'How you feel: мені + a word in -е or -о. Мені краще, мені погано.'],
];
function yarynaLesson(n, done) {
  say(n, [L('Before I give anybody medicine, they have to tell me what hurts. In Ukrainian the thing that hurts does the hurting: у мене болить голова. My head hurts me.', 'Перш ніж дати комусь ліки, мені треба знати, що болить. Українською болить сама річ: у мене болить голова.'),
    L('And then I tell them what to do: тобі треба. You need to.', 'А тоді я кажу, що робити: тобі треба.')], () =>
    roadQuiz(shuffle(ACHES.slice()), 'ЗНАХАРКА', q => {
      if (q.stopped) return say(n, [L('Off you go, then. Mind the bog.', 'То йди. Обережно, трясовина.')], done);
      if (q.score < 6) return say(n, [L(`${q.score} of 8. You'd have given the goat the cough medicine. Again.`, `${q.score} з 8. Ти дав би козі ліки від кашлю. Ще раз.`)], done);
      S.f.znakh = 1; saveSoon(); sfx('ok');
      say(n, [L(`${q.score} of 8. You could be a знахар yourself. Don't, though. The pay is herbs.`, `${q.score} з 8. Ти й сам міг би бути знахарем. Тільки не треба. Платять травами.`)], done);
    }, ['БОЛИТЬ', 'У знахарки', 'what hurts', 'Which form fits?'], 7));
}

// ─── Errands: carry things between people, learn their words ─────────────
const ERRANDS = [
  { id: 'beets', giver: 'marichka', source: 'halyna', item: 'beets', words: ['борщ', 'суп', 'картопля', 'сіль'],
    ask: L('Baba wants to make borshch, but our beets got eaten by a goat. Halyna in Vyshneve grows the best beets. Could you bring me some?', 'Бабуся хоче зварити борщ, але наші буряки з\'їла коза. У Галини у Вишневому найкращі буряки. Принесеш мені трохи?'),
    hand: L('Beets for Marichka\'s borshch? Of course. Take these, the dark red ones are the sweetest.', 'Буряки для Маріччиного борщу? Звісно. Бери, темно-червоні найсолодші.'),
    thanks: L('Beets! Now Baba can make borshch. Let me teach you some kitchen words while it cooks.', 'Буряки! Тепер бабуся зварить борщ. Поки він вариться, навчу тебе кухонних слів.') },
  { id: 'flour', giver: 'olena', source: 'fedora', item: 'flour', words: ['ринок', 'гроші', 'скільки', 'ціна', 'купувати', 'продавати'],
    ask: L('I\'m out of flour, and the market is tomorrow! Fedora, the miller\'s wife out on the steppe, always has some. Would you fetch me a sack?', 'У мене закінчилось борошно, а завтра ринок! У Федори, жінки мірошника в степу, завжди є. Принесеш мені мішечок?'),
    hand: L('Flour for Olena? She\'ll make pies and sell them back to us. Here.', 'Борошно для Олени? Вона спече пиріжки і продасть їх нам же. Тримай.'),
    thanks: L('Flour! Bless you. Here, learn how to haggle with me.', 'Борошно! Дай тобі Боже здоров\'я. Ось, навчу тебе торгуватися.') },
  { id: 'book', giver: 'lida', source: 'ostap', item: 'book', words: ['школа', 'вчитель', 'книжка', 'читати', 'писати', 'олівець', 'папір'],
    ask: L('Ostap the kobzar borrowed my songbook a year ago and never brought it back. Could you ask him for it?', 'Кобзар Остап позичив мій співаник рік тому і досі не повернув. Попросиш його?'),
    hand: L('Lida\'s songbook? Ah. I may have written a few verses in the margins. Tell her they\'re a gift.', 'Співаник Ліди? А. Я, здається, дописав кілька куплетів на полях. Скажи, що це подарунок.'),
    thanks: L('My songbook! With... new verses. Very well. Sit down, I\'ll give you a little lesson.', 'Мій співаник! З... новими куплетами. Гаразд. Сідай, проведу тобі невеличкий урок.') },
  { id: 'thread', giver: 'paraska', source: 'olena', item: 'thread', words: ['червоний', 'білий', 'чорний', 'синій', 'зелений'],
    ask: L('I\'ve run out of red thread, right in the middle of the tree of life. Olena sells it at the Kalynivka market. Would you go?', 'У мене закінчилися червоні нитки, просто посеред дерева життя. Олена продає їх на ринку в Калинівці. Сходиш?'),
    hand: L('Red thread for Baba Paraska? Free. She embroidered my wedding towel.', 'Червоні нитки для баби Параски? Безкоштовно. Вона вишила мені весільний рушник.'),
    thanks: L('Red thread! Now, every colour on a rushnyk has a name. Learn them.', 'Червоні нитки! Кожен колір на рушнику має назву. Вивчи їх.') },
  { id: 'salt', giver: 'halyna', source: 'ivan', item: 'salt', words: ['дорога', 'далеко', 'близько', 'хліб'],
    ask: L('It\'s pickling time and I\'m out of salt. Ivan the chumak is on the steppe road, back from Crimea. Would you get me a bag?', 'Час солити огірки, а в мене немає солі. Чумак Іван на степовій дорозі, щойно з Криму. Принесеш мені торбинку?'),
    hand: L('Salt for Halyna? Here. Crimean salt, the best there is. I walked a long road for it.', 'Сіль для Галини? Тримай. Кримська сіль, найкраща. Я за нею далеку дорогу пройшов.'),
    thanks: L('Salt! The cucumbers thank you. Here, some road words, since you\'ve been walking so much.', 'Сіль! Огірки тобі дякують. Ось тобі дорожні слова, ти ж стільки ходиш.') },
  { id: 'honey', giver: 'vakula', source: 'hryhoriy', item: 'honeypot', words: ['пити', 'їсти', 'чай', 'кава'],
    ask: L('I\'m making medovukha for Christmas, and I\'ve no honey. Hryhoriy at the khutir keeps the best bees in the country. Bring me a pot?', 'Я варю медовуху на Різдво, а меду немає. У Григорія на хуторі найкращі бджоли в краю. Принесеш горщик?'),
    hand: L('Honey for Vakula? Tell him not to drink it all at once.', 'Мед для Вакули? Скажи йому, щоб не випив усе одразу.'),
    thanks: L('Honey! Sit down, I\'ll teach you what to say at the table.', 'Мед! Сідай, навчу тебе, що кажуть за столом.') },
  { id: 'fish', giver: 'mamai', source: 'panas', item: 'fish', words: ['човен', 'море', 'острів', 'плавати'],
    ask: L('A kozak can live on songs, but not for ever. Panas the fisherman, at the lake, owes me a string of fish. Would you collect it?', 'Козак може жити піснями, але не вічно. Рибалка Панас на озері винен мені в\'язку риби. Забереш?'),
    hand: L('For Mamai? He\'ll pay me with a song, I suppose. Here.', 'Для Мамая? Він, мабуть, заплатить мені піснею. Тримай.'),
    thanks: L('Fish! Now listen: a kozak knows the words of the water.', 'Риба! А тепер слухай: козак знає слова води.') },
  { id: 'herbs', giver: 'hanna', source: 'yaryna', item: 'herbs', words: ['нога', 'рука', 'голова', 'лікар', 'хворий', 'здоровий', 'боліти'],
    ask: L('My knees ache when it rains. Yaryna in the marsh makes a balm that works. Would you fetch me her herbs?', 'Коли дощ, у мене болять коліна. Ярина з болота робить мазь, яка допомагає. Принесеш мені її трави?'),
    hand: L('For Hanna\'s knees? St John\'s wort and chamomile. Tell her to keep them warm.', 'Для Ганниних колін? Звіробій і ромашка. Скажи, щоб тримала їх у теплі.'),
    thanks: L('Herbs! My knees thank you. Here are the words for when something hurts.', 'Трави! Мої коліна тобі дякують. Ось слова на той випадок, коли щось болить.') },
  { id: 'sleeve', giver: 'chort', source: 'sirko', item: 'sleeve', words: ['шукати', 'знайти', 'загубити', 'сміятися'],
    ask: L('Psst. Every year I lose my red svytka at this fair, and every year I have to find it piece by piece. This year a dog ran off with the sleeve. A grey dog. From a khutir.', 'Псст. Щороку я гублю на цьому ярмарку свою червону свитку і щороку збираю її по шматочку. Цього року рукав забрав собака. Сірий. З хутора.'),
    hand: L('Woof! (Sirko drops a red sleeve at your feet. It smells of sulphur.)', 'Гав! (Сірко кладе біля твоїх ніг червоний рукав. Він пахне сіркою.)'),
    thanks: L('My sleeve! Hee hee. For that I\'ll teach you some words. Devilishly useful ones.', 'Мій рукав! Хі-хі. За це я навчу тебе кількох слів. Чортівськи корисних.') },
];
const errandState = id => (S.e && S.e[id]) || 0;   // 0 not offered, 1 under way, 2 done
// An errand either fetches (the giver asks, you get the thing from `source`, the giver thanks you)
// or delivers (the giver hands you the thing, and `to` thanks you). Errands with a `region` are out across the country.
const homeErrands = () => ERRANDS.filter(e => !e.region), farErrands = () => ERRANDS.filter(e => e.region);
function errandTalk(npc, done) {
  if (!S.f.book) return false;
  S.e = S.e || {};
  for (const e of ERRANDS) if (errandState(e.id) === 1 && npc.id === (e.to || e.giver) && has(e.item)) {
    take(e.item); S.e[e.id] = 2; S.f.thanks = (S.f.thanks || 0) + 1; saveSoon(); sfx('ok');
    say(npc.name, [e.thanks], () => teach(npc.name, e.words.map(W_), () => {
      if (homeErrands().every(h => errandState(h.id) === 2) && !has('vyshyvanka'))
        say(npc.name, [L('Everybody is talking about how helpful you are. The women of three villages made you something.', 'Усі говорять, який ти помічний. Жінки з трьох сіл вишили тобі дещо.'), give('vyshyvanka')], done);
      else if (e.region && farErrands().every(h => errandState(h.id) === 2) && !S.f.rushnyk) {
        S.f.rushnyk = 1; saveSoon();
        say(npc.name, [L('You know, people talk about you from the mountains to the sea. Somebody\'s grandmother back in your village has been asking after you. Baba Paraska, isn\'t it? Go and see her.', 'Знаєш, про тебе говорять від гір до моря. Якась бабуся з твого села про тебе розпитує. Баба Параска, здається? Зайди до неї.')], done);
      }
      else done();
    }));
    return true;
  }
  for (const e of ERRANDS) if (!e.to && errandState(e.id) === 1 && npc.id === e.source && !has(e.item)) {
    say(npc.name, [e.hand, give(e.item)], done);
    return true;
  }
  const offer = ERRANDS.find(e => npc.id === e.giver && errandState(e.id) === 0 && (!e.when || e.when()));
  if (offer) {
    say(npc.name, [offer.ask], null, { options: offer.to ? [L('I\'ll take it', 'Віднесу'), L('Not now', 'Не зараз')] : [L('I\'ll bring it', 'Принесу'), L('Not now', 'Не зараз')], pick: i => {
      if (i === 0 && offer.to) { S.e[offer.id] = 1; saveSoon(); say(npc.name, [offer.hand, give(offer.item)], done); }
      else if (i === 0) { S.e[offer.id] = 1; saveSoon(); say(npc.name, [L('Thank you! I\'ll be right here.', 'Дякую! Я буду тут.')], done); }
      else if (typeof npc.talk === 'function') npc.talk(npc, done);
      else { const conv = npc.talk[npc.talked % npc.talk.length]; npc.talked++; say(npc.name, conv, done); }
    } });
    return true;
  }
  return false;
}
function errandsText() {
  const open = ERRANDS.filter(e => errandState(e.id) === 1);
  const name = id => { for (const a in NPCS) { const n = NPCS[a].find(p => p.id === id); if (n) return n.name; } return id; };
  if (!open.length) return Object.keys(S.e || {}).length ? 'No errands under way. People around the villages may still need a hand.' : 'People in the villages may ask you to fetch things. Talk to everyone.';
  return open.map(e => e.to ? (has(e.item) ? `Take ${ITEMS[e.item].en} to ${name(e.to)}, from ${name(e.giver)}.` : '')
    : has(e.item) ? `Take ${ITEMS[e.item].en} to ${name(e.giver)}.` : `Get ${ITEMS[e.item].en} from ${name(e.source)} for ${name(e.giver)}.`).filter(Boolean).join(' ');
}

// ─── The Chumak's Road: verbs of motion with Ivan ─────────────────────────
// Five stages, after O.V. Kryvolapova's "Дієслова руху в українській мові"
// (2021). The sentences are new, set in this world. a = index of the right one.
const VM = [
  { title: L('One way, or many?', 'В один бік чи в різні?'), intro: [
    L('Ukrainian has pairs of motion verbs. Group 1, like йти and їхати: one direction, right now, one trip. Я йду до річки: I\'m walking to the river.', 'В українській мові дієслова руху мають пари. Група 1, як-от йти та їхати: в одному напрямку, зараз, один раз. Я йду до річки.'),
    L('Group 2, like ходити and їздити: back and forth, habits, round trips, and abilities. Я часто ходжу до річки: I often go to the river.', 'Група 2, як-от ходити та їздити: туди й назад, звички, поїздки з поверненням, уміння. Я часто ходжу до річки.'),
    L('On foot is йти/ходити. By cart, horse or bus is їхати/їздити. After любити, вміти, вчитися: always group 2.', 'Пішки: йти/ходити. Возом, конем чи автобусом: їхати/їздити. Після любити, вміти, вчитися — завжди група 2.')],
  items: [
    ['Дивись, Оксана ___ до річки.', 'Look, Oksana is walking to the river.', ['йде', 'ходить'], 0, 'Right now, one direction: йти.'],
    ['Щонеділі баба Ганна ___ до церкви.', 'Every Sunday Baba Hanna goes to church.', ['ходить', 'йде'], 0, 'A habit, there and back: ходити.'],
    ['Куди ти ___ зараз?', 'Where are you going now?', ['йдеш', 'ходиш'], 0, 'Now, one direction: йти.'],
    ['Мій брат любить ___ по лісу.', 'My brother loves walking in the forest.', ['ходити', 'йти'], 0, 'After любити: group 2.'],
    ['Завтра зранку ми ___ до Калинівки возом.', 'Tomorrow morning we\'re going to Kalynivka by cart.', ['їдемо', 'їздимо', 'йдемо'], 0, 'One trip, by cart: їхати.'],
    ['Іван часто ___ до Криму за сіллю.', 'Ivan often travels to Crimea for salt.', ['їздить', 'їде'], 0, 'Often, by cart: їздити.'],
    ['Учора ми ___ на ярмарок до міста.', 'Yesterday we went to the fair in town (and came back).', ['їздили', 'їхали'], 0, 'A finished round trip in the past: їздити.'],
    ['Коли я ___ додому, я побачив лелеку.', 'As I was walking home, I saw a stork.', ['йшов', 'ходив'], 0, 'In progress, one direction: йти.'],
    ['Маленькі діти вчаться ___.', 'Little children learn to walk.', ['ходити', 'йти'], 0, 'An ability, after вчитися: group 2.'],
    ['Я не люблю ___ возом: трясе!', 'I don\'t like riding in a cart: it\'s bumpy!', ['їздити', 'їхати'], 0, 'After любити: group 2.'],
  ] },
  { title: L('Running, flying, swimming', 'Бігти, летіти, плисти'), intro: [
    L('The same rule works for running, flying and swimming: бігти/бігати, летіти/літати, плисти/плавати.', 'Те саме правило для бігу, польоту і плавання: бігти/бігати, летіти/літати, плисти/плавати.'),
    L('Group 1 when something goes one way right now. Group 2 when it goes around, goes often, or when you talk about being able to.', 'Група 1, коли рух в одному напрямку зараз. Група 2, коли рух навколо, часто, або коли мова про вміння.')],
  items: [
    ['Дивись, лелека ___ до гнізда.', 'Look, the stork is flying to her nest.', ['летить', 'літає'], 0, 'One direction, now: летіти.'],
    ['Лелека весь день ___ над полем.', 'The stork flies over the field all day.', ['літає', 'летить'], 0, 'Round and round, all day: літати.'],
    ['Петрик ___ до мосту, бо запізнюється.', 'Petryk is running to the bridge because he\'s late.', ['біжить', 'бігає'], 0, 'One direction, now: бігти.'],
    ['Щоранку дід Микола ___ біля ставу.', 'Every morning Did Mykola goes running by the pond.', ['бігає', 'біжить'], 0, 'A habit, no one direction: бігати.'],
    ['Риба ___ у ставку.', 'Fish swim about in the pond.', ['плаває', 'пливе'], 0, 'Moving about: плавати.'],
    ['Дивись, гуска ___ до берега!', 'Look, the goose is swimming to the bank!', ['пливе', 'плаває'], 0, 'One direction, now: плисти.'],
    ['Ти вмієш ___?', 'Can you swim?', ['плавати', 'плисти'], 0, 'An ability, after вміти: group 2.'],
    ['Бджоли ___ від квітки до квітки.', 'Bees fly from flower to flower.', ['літають', 'летять'], 0, 'Many directions: літати.'],
    ['Куди ти ___ так швидко?', 'Where are you running so fast?', ['біжиш', 'бігаєш'], 0, 'Now, one direction: бігти.'],
    ['Мавка любить ___ в озері вночі.', 'Mavka loves swimming in the lake at night.', ['плавати', 'плисти'], 0, 'After любити: group 2.'],
  ] },
  { title: L('Carrying, leading, hauling', 'Нести, вести, везти'), intro: [
    L('Three more pairs take an object. нести/носити: carry in your hands. вести/водити: lead someone. везти/возити: haul by cart.', 'Ще три пари мають додаток. нести/носити — у руках. вести/водити — когось за собою. везти/возити — возом.'),
    L('Same rule: group 1 for one way, now; group 2 for habits and back-and-forth. And водити машину means to drive a car.', 'Правило те саме: група 1 — в один бік, зараз; група 2 — звички і туди-сюди. А водити машину — це керувати машиною.')],
  items: [
    ['Дивись, Галина ___ кошик буряків.', 'Look, Halyna is carrying a basket of beets.', ['несе', 'носить'], 0, 'One way, now, in her hands: нести.'],
    ['Щодня листоноша ___ листи по селу.', 'Every day the postman carries letters around the village.', ['носить', 'несе'], 0, 'Every day, all over: носити.'],
    ['Дивись, учителька ___ дітей до школи.', 'Look, the teacher is leading the children to school.', ['веде', 'водить'], 0, 'Leading, one way, now: вести.'],
    ['Тато вчиться ___ машину.', 'Dad is learning to drive a car.', ['водити', 'вести'], 0, 'водити машину: to drive.'],
    ['Зараз Іван ___ сіль з Криму.', 'Right now Ivan is hauling salt from Crimea.', ['везе', 'возить'], 0, 'By cart, one way, now: везти.'],
    ['Чумаки ___ сіль з Криму кожного літа.', 'The chumaks haul salt from Crimea every summer.', ['возять', 'везуть'], 0, 'Every summer: возити.'],
    ['Що це ти ___? Таке важке!', 'What\'s that you\'re carrying? It\'s so heavy!', ['несеш', 'носиш'], 0, 'In your hands, right now: нести.'],
    ['Баба Ганна ___ онуків до церкви щонеділі.', 'Baba Hanna takes her grandchildren to church every Sunday.', ['водить', 'веде'], 0, 'Every Sunday: водити.'],
    ['Дивись, віз ___ сіно до хати.', 'Look, the cart is carrying hay to the house.', ['везе', 'возить'], 0, 'By cart, one way, now: везти.'],
    ['Я завжди ___ з собою словник.', 'I always carry my dictionary with me.', ['ношу', 'несу'], 0, 'Always: носити.'],
  ] },
  { title: L('Setting off and arriving', 'Піти і прийти'), intro: [
    L('Prefixes give the verb a direction, and make it complete. по-/пі-: set off (піти, поїхати). при-: arrive (прийти, приїхати).', 'Префікси дають дієслову напрямок. по-/пі-: вирушити (піти, поїхати). при-: прибути (прийти, приїхати).'),
    L('ви-: out of (вийти). в-/у-: into (увійти). за-: drop in on the way (зайти).', 'ви-: назовні (вийти). в-/у-: всередину (увійти). за-: по дорозі (зайти).')],
  items: [
    ['Оксани немає вдома: вона ___ до баби Ганни.', 'Oksana isn\'t home: she\'s gone to Baba Hanna\'s.', ['пішла', 'прийшла', 'вийшла'], 0, 'Set off and still away: піти.'],
    ['Нарешті ти ___! Ми чекали.', 'You\'ve finally come! We were waiting.', ['прийшов', 'пішов', 'вийшов'], 0, 'Arrived here: прийти.'],
    ['Завтра зранку ми ___ до Калинівки, а ввечері повернемося.', 'Tomorrow morning we\'ll set off for Kalynivka, and come back in the evening.', ['поїдемо', 'приїдемо', 'виїдемо'], 0, 'Setting off, by cart: поїхати.'],
    ['Іван ___ додому з Криму вчора ввечері, і всі його зустрічали.', 'Ivan got home from Crimea last night, and everyone came to meet him.', ['приїхав', 'поїхав', 'виїхав'], 0, 'Arrived: приїхати.'],
    ['Петрик ___ з хати і побіг до річки.', 'Petryk came out of the house and ran to the river.', ['вийшов', 'увійшов', 'прийшов'], 0, 'ви- = out of.'],
    ['Ми ___ до церкви й запалили свічку.', 'We went into the church and lit a candle.', ['увійшли', 'вийшли', 'перейшли'], 0, 'у-/в- = into.'],
    ['Навесні лелеки ___ додому з Африки.', 'In spring the storks flew home from Africa.', ['прилетіли', 'полетіли', 'вилетіли'], 0, 'Arrived, flying: прилетіти.'],
    ['Кіт ___ з кімнати, коли побачив гостей.', 'The cat ran out of the room when it saw the guests.', ['вибіг', 'прибіг', 'забіг'], 0, 'Out of: вибігти.'],
    ['По дорозі додому я ___ до Галини на чай.', 'On my way home I dropped in at Halyna\'s for tea.', ['зайшов', 'вийшов', 'пішов'], 0, 'за- = drop in on the way.'],
    ['Коли ти ___ до Вишневого?', 'When did you arrive in Vyshneve?', ['приїхав', 'поїхав', 'виїхав'], 0, 'Arrived: приїхати.'],
  ] },
  { title: L('Across, around, past', 'Через, навколо, повз'), intro: [
    L('Last stretch of the road. під-: come up to (підійти). від-: move away from (відійти). пере-: across (перейти).', 'Остання частина дороги. під-: наблизитися (підійти). від-: віддалитися (відійти). пере-: через (перейти).'),
    L('об-: around (обійти). про-: past or through (пройти). з-: down from (з\'їхати).', 'об-: навколо (обійти). про-: повз або крізь (пройти). з-: донизу (з\'їхати).')],
  items: [
    ['Ми ___ річку по мосту.', 'We crossed the river by the bridge.', ['перейшли', 'підійшли', 'зайшли'], 0, 'пере- = across.'],
    ['Чугайстер ___ до мене і засміявся.', 'The chuhaister came up to me and laughed.', ['підійшов', 'відійшов', 'перейшов'], 0, 'під- = come up to.'],
    ['___ від вогню, бо обпечешся!', 'Step away from the fire, or you\'ll get burned!', ['Відійди', 'Підійди', 'Перейди'], 0, 'від- = away from.'],
    ['Ми ___ калюжу, щоб не замочити ноги.', 'We walked around the puddle so as not to get our feet wet.', ['обійшли', 'перейшли', 'зайшли'], 0, 'об- = around.'],
    ['Ми тихо ___ повз хату Гриценків.', 'We walked quietly past the Hrytsenko house.', ['пройшли', 'зайшли', 'перейшли'], 0, 'про- = past.'],
    ['Діти ___ з гірки на санчатах.', 'The children slid down the hill on sleds.', ['з\'їхали', 'виїхали', 'заїхали'], 0, 'з- = down from.'],
    ['Гуси ___ на другий берег.', 'The geese swam across to the other bank.', ['перепливли', 'підпливли', 'запливли'], 0, 'пере- = across.'],
    ['Пташка ___ до самого вікна.', 'The bird flew right up to the window.', ['підлетіла', 'відлетіла', 'перелетіла'], 0, 'під- = come up to.'],
    ['Віз ___ від хати й зник у степу.', 'The cart drove away from the house and disappeared into the steppe.', ['від\'їхав', 'під\'їхав', 'заїхав'], 0, 'від- = away from.'],
    ['Водяник ___ до берега і виставив голову.', 'The vodyanyk swam up to the bank and poked his head out.', ['підплив', 'відплив', 'переплив'], 0, 'під- = come up to.'],
  ] },
  { title: L('On the water', 'На воді'), teacher: 'semen', intro: [
    L('On the water it\'s плисти and плавати, with all the same prefixes: підплисти (come up to), відплисти (pull away), переплисти (across), приплисти (arrive), виплисти (out of).', 'На воді — плисти і плавати, з тими самими префіксами: підплисти, відплисти, переплисти, приплисти, виплисти.'),
    L('And the ferryman\'s favourite: перевозити / перевезти, to carry across.', 'І улюблене слово перевізника: перевозити / перевезти.')],
  items: [
    ['Щодня Семен ___ людей через Дніпро.', 'Every day Semen ferries people across the Dnipro.', ['перевозить', 'перевезе', 'привозить'], 0, 'Every day: imperfective перевозити.'],
    ['Учора Семен ___ через Дніпро цілий віз солі.', 'Yesterday Semen ferried a whole cart of salt across the Dnipro.', ['перевіз', 'вивіз', 'завіз'], 0, 'пере- = across.'],
    ['Дивись, човен ___ до берега.', 'Look, the boat is coming up to the bank.', ['підпливає', 'відпливає', 'перепливає'], 0, 'під- = come up to.'],
    ['Пором ___ від берега, і ми помахали рукою.', 'The ferry pulled away from the bank, and we waved.', ['відплив', 'підплив', 'приплив'], 0, 'від- = away from.'],
    ['Козак ___ Дніпро на коні.', 'The kozak swam his horse across the Dnipro.', ['переплив', 'приплив', 'виплив'], 0, 'пере- = across.'],
    ['Риба ___ з-під каменя.', 'A fish swam out from under the stone.', ['випливла', 'запливла', 'приплила'], 0, 'ви- = out of.'],
    ['Не ___ далеко, там глибоко!', 'Don\'t swim far out, it\'s deep there!', ['запливай', 'випливай', 'підпливай'], 0, 'за- = too far, beyond.'],
    ['Гуси ___ до нас, бо побачили хліб.', 'The geese swam up to us because they saw bread.', ['підпливли', 'відпливли', 'перепливли'], 0, 'під- = come up to.'],
    ['Нарешті ми ___ на острів!', 'We\'ve finally reached the island!', ['припливли', 'відпливли', 'перепливли'], 0, 'при- = arrive.'],
    ['Дід Панас щоранку ___ на човні по озеру.', 'Every morning Did Panas rows about the lake.', ['плаває', 'пливе'], 0, 'Around and about, every morning: плавати.'],
  ] },
  { title: L('Bringing and taking', 'Принести і віднести'), teacher: 'vakula', intro: [
    L('Carrying verbs take prefixes too. принести (bring), віднести (take away to someone), винести (carry out), занести (drop off on the way).', 'Дієслова нести, вести, везти теж мають префікси. принести, віднести, винести, занести.'),
    L('With вести you lead someone: привести, вивести, завести. With везти you bring by cart: привезти, відвезти, вивезти.', 'З вести ведеш когось: привести, вивести, завести. З везти — возом: привезти, відвезти, вивезти.')],
  items: [
    ['___ мені, будь ласка, води.', 'Please bring me some water.', ['Принеси', 'Віднеси', 'Винеси'], 0, 'при- = bring here.'],
    ['___ цей кошик бабі Ганні.', 'Take this basket to Baba Hanna.', ['Віднеси', 'Винеси', 'Перенеси'], 0, 'від- = take to someone else.'],
    ['Чумаки ___ на ярмарок сіль і рибу.', 'The chumaks brought salt and fish to the fair.', ['привезли', 'вивезли', 'перевезли'], 0, 'By cart, arriving here: привезти.'],
    ['Вакула ___ коня до кузні.', 'Vakula led the horse into the forge.', ['завів', 'вивів', 'перевів'], 0, 'за- with вести = lead in.'],
    ['Учителька ___ дітей на подвір\'я гратися.', 'The teacher led the children out into the yard to play.', ['вивела', 'привела', 'завела'], 0, 'ви- = out of.'],
    ['___ сміття з хати!', 'Take the rubbish out of the house!', ['Винеси', 'Принеси', 'Занеси'], 0, 'ви- = out of.'],
    ['Хто ___ сюди цього козла?', 'Who brought this goat here?', ['привів', 'вивів', 'відвів'], 0, 'Leading someone here: привести.'],
    ['Солопій ___ пшеницю на ярмарок продавати.', 'Solopiy brought his wheat to the fair to sell.', ['привіз', 'вивіз', 'відвіз'], 0, 'By cart, arriving here: привезти.'],
    ['Батько ___ сина до лікаря.', 'The father drove his son to the doctor.', ['відвіз', 'вивіз', 'перевіз'], 0, 'By cart, to somewhere else: відвезти.'],
    ['Не ___ мої речі з кімнати!', 'Don\'t carry my things out of the room!', ['винось', 'принось', 'віднось'], 0, 'ви- = out of.'],
  ] },
  { title: L('Reaching, and getting lost', 'Дійти і заблукати'), teacher: 'yaryna', intro: [
    L('до- means reaching the end: дійти, доїхати, долетіти. з- means off or down: зійти зі стежки, step off the path.', 'до- означає дійти до кінця: дійти, доїхати, долетіти. з- — геть або вниз: зійти зі стежки.'),
    L('And commands: біжи! (run!), ходімо! (let\'s go!), йди (go). After не, use the imperfective: не винось, не запливай.', 'І наказовий спосіб: біжи! ходімо! йди. Після не — недоконаний вид: не винось, не запливай.')],
  items: [
    ['Ми нарешті ___ до хатинки Ярини.', 'We finally made it to Yaryna\'s hut.', ['дійшли', 'обійшли', 'перейшли'], 0, 'до- = reach.'],
    ['Не ___ зі стежки, бо втопишся!', 'Don\'t step off the path, or you\'ll drown!', ['сходь', 'виходь', 'заходь'], 0, 'з- = off.'],
    ['Швидше! ___!', 'Faster! Run!', ['Біжи', 'Бігай', 'Ходи'], 0, 'One direction, now: бігти.'],
    ['___ додому, вже темно!', 'Let\'s go home, it\'s already dark!', ['Ходімо', 'Ходили', 'Ходять'], 0, 'Ходімо: let\'s go.'],
    ['Ми ___ до самого краю болота й повернулися.', 'We went as far as the very edge of the marsh and turned back.', ['дійшли', 'вийшли', 'увійшли'], 0, 'до- = as far as.'],
    ['Вогник ___ нас у саму трясовину.', 'The wisp led us right into the bog.', ['завів', 'вивів', 'перевів'], 0, 'за- with вести = lead in (and astray).'],
    ['Ярина ___ нас із болота на стежку.', 'Yaryna led us out of the marsh onto the path.', ['вивела', 'завела', 'підвела'], 0, 'ви- = out of.'],
    ['Коли ми ___ з болота, вже світало.', 'When we got out of the marsh, it was already dawn.', ['вийшли', 'зайшли', 'підійшли'], 0, 'ви- = out of.'],
    ['Не ___ так швидко, я не встигаю!', 'Don\'t walk so fast, I can\'t keep up!', ['йди', 'підійди', 'прийди'], 0, 'After не: imperfective йди.'],
    ['Чапля ___ з болота, коли ми підійшли.', 'The heron flew up out of the marsh when we came near.', ['вилетіла', 'прилетіла', 'долетіла'], 0, 'ви- = out of.'],
  ] },
];
// The road's later stretches are taught by others; each knows one stretch.
function roadTeacher(npc, stage, done, chat) {
  const n = npc.name, vm = S.f.vm || 0, st = VM[stage];
  if (vm < stage) return say(n, [L('Walk the earlier stretches of the road first. Ivan the chumak, on the steppe, starts everyone off.', 'Спершу пройди попередні відрізки шляху. Чумак Іван у степу всіх починає вчити.')], null,
    { options: [L('All right', 'Добре')], pick: () => chat() });
  if (vm > stage) return say(n, [L(`Want to go over "${st.title[0]}" again?`, `Хочеш ще раз пройти «${st.title[1]}»?`)], null, yesNo(go => go
    ? roadQuiz(shuffle(st.items.slice()).slice(0, 8), `ROAD ${stage + 1}/${VM.length}`, () => say(n, [L('The road remembers you.', 'Дорога тебе пам\'ятає.')], done)) : chat()));
  say(n, [L(`Ivan sent you? Then here is stretch ${stage + 1} of the road: ${st.title[0]}.`, `Тебе прислав Іван? Тоді ось відрізок ${stage + 1}: ${st.title[1]}.`), ...st.intro], null, yesNo(go => {
    if (!go) return chat();
    roadQuiz(shuffle(st.items.slice()).slice(0, 8), `ROAD ${stage + 1}/${VM.length}`, q => {
      if (q.stopped) return say(n, [L('We\'ll rest here.', 'Відпочинемо.')], done);
      if (q.score < 6) return say(n, [L(`${q.score} of 8. Not yet. Look at the rule again and try once more.`, `${q.score} з 8. Ще ні. Глянь на правило і спробуй ще раз.`)], done);
      S.f.vm = stage + 1; saveSoon(); sfx('badge');
      if (S.f.vm < VM.length) return say(n, [L(`${q.score} of 8! On down the road.`, `${q.score} з 8! Далі в дорогу.`)], done);
      say(n, [L(`${q.score} of 8! That's the whole road, every verb of it.`, `${q.score} з 8! Це весь шлях, до останнього дієслова.`),
        L('Take these. Seven-league boots. You\'ve earned them.', 'Візьми. Чоботи-скороходи. Ти їх заробив.'), give('boots')], done);
    });
  }));
}
function ivanTalk(npc, done) {
  const n = npc.name;
  const chat = () => say(n, [L('I haul salt from Crimea with two oxen and no patience.', 'Я вожу сіль з Криму на двох волах і без жодного терпіння.'),
    L('Сіль: salt. Дорога: road. Довга дорога: a long road.', 'Сіль. Дорога. Довга дорога.')], done);
  if (!S.f.book) return chat();
  const stage = S.f.vm || 0;
  if (stage >= 5 && stage < VM.length) return say(n, [L('You\'ve walked my road. But the road goes on: Semen the ferryman at the Dnipro, Vakula at the Sorochyntsi fair and Yaryna in the marsh know the rest.', 'Ти пройшов мою дорогу. Але шлях іде далі: перевізник Семен на Дніпрі, Вакула на Сорочинському ярмарку та Ярина на болоті знають решту.')], done);
  if (stage >= VM.length) return say(n, [L('You\'ve walked the whole Chumak\'s Road. Want to go over it again?', 'Ти пройшов увесь Чумацький Шлях. Хочеш пройти його ще раз?')], null, yesNo(go => {
    if (!go) return chat();
    const all = VM.flatMap(s => s.items);
    roadQuiz(shuffle(all.slice()).slice(0, 8), 'ROAD', () => say(n, [L('Still sharp. The road remembers you.', 'Ти все пам\'ятаєш. Дорога тебе не забула.')], done));
  }));
  const st = VM[stage];
  const opening = stage === 0 ? [
    L('You catch words like a fisherman. Good. But the hardest words in Ukrainian aren\'t nouns.', 'Ти ловиш слова, як рибалка. Добре. Але найважчі українські слова — не іменники.'),
    L('They\'re verbs of motion. Going, coming, carrying, crossing. I\'ve walked every road between here and Crimea, so I know them all.', 'Це дієслова руху. Іти, приходити, нести, переходити. Я пройшов усі дороги звідси до Криму, тож я їх усі знаю.'),
    L('Walk the Chumak\'s Road. Five stretches with me, and three more with friends further on. Eight sentences each; get six right and we go on.', 'Пройди Чумацький Шлях. П\'ять відрізків зі мною і ще три з друзями далі. По вісім речень; шість правильних, і йдемо далі.')]
    : [L(`Stretch ${stage + 1} of the road.`, `Відрізок ${stage + 1} шляху.`)];
  say(n, opening, null, { options: [L('Walk the road', 'Іти шляхом'), L('Just chatting', 'Просто поговорити')], pick: i => {
    if (i) return chat();
    say(n, [L(`Stretch ${stage + 1}: ${st.title[0]}`, `Відрізок ${stage + 1}: ${st.title[1]}`), ...st.intro], () => {
      roadQuiz(shuffle(st.items.slice()).slice(0, 8), `ROAD ${stage + 1}/${VM.length}`, q => {
        if (q.stopped) return say(n, [L('We\'ll rest here. The road will wait.', 'Відпочинемо тут. Дорога почекає.')], done);
        if (q.score < 6) return say(n, [L(`${q.score} of 8. Not yet. Have another look at the rule and try again.`, `${q.score} з 8. Ще ні. Глянь ще раз на правило і спробуй знову.`)], done);
        S.f.vm = stage + 1; saveSoon(); sfx('badge');
        if (S.f.vm < 5) return say(n, [L(`${q.score} of 8! On to the next stretch.`, `${q.score} з 8! Далі в дорогу.`)], done);
        say(n, [L(`${q.score} of 8! That\'s the whole road.`, `${q.score} з 8! Це весь шлях.`),
          L('You know what we chumaks call the Milky Way? Чумацький Шлях. The Chumak\'s Road. We followed it home across the steppe at night.', 'Знаєш, як ми, чумаки, називаємо Молочний Шлях? Чумацький Шлях. Ми йшли за ним додому через степ уночі.'),
          L('Now it\'s yours too. And the road goes on: Semen the ferryman, Vakula at the fair and Yaryna in the marsh know the rest.', 'Тепер він і твій. А шлях іде далі: перевізник Семен, Вакула на ярмарку та Ярина на болоті знають решту.'), give('milkyway')], done);
      });
    });
  } });
}
function roadQuiz(items, label, done, head, zone) {
  openQuiz({ mode: 'road', label, road: items, ids: items.map((_, k) => k), zone: zone != null ? zone : 2, done, head });
}

// ─── The Kozak's Duma: Mamai, the kurhan, and the one who sleeps in it ─────
// S.f.duma: 1 carrying Mamai's pipe, 2 the kamiana baba taught you to call, 3 the otaman has spoken, 4 Mamai gave you the horseshoe.
function dumaText() {
  const d = S.f.duma || 0;
  if (d === 1) return ' Take Mamai\'s pipe to the kamiana baba on the kurhan in the steppe.';
  if (d === 2) return ' The otaman has risen at the foot of the kurhan. Talk to him.';
  if (d === 3) return ' Take the otaman\'s message back to Kozak Mamai at the Dnipro crossing.';
  return '';
}
function mamaiTalk(npc, done) {
  const n = npc.name, d = S.f.duma || 0;
  const test = () => keeperTalk(6, [L('Sit. A kozak sits under an oak with his bandura and his horse, and the whole world goes past. That\'s me on every painting.', 'Сідай. Козак сидить під дубом із бандурою і конем, а повз нього йде весь світ. Це я на кожній картині.'),
    L('Козак: a free man. Воля: freedom. Remember those two.', 'Козак — вільна людина. Воля. Запам\'ятай ці два слова.')])(npc, done);
  if (!S.f.book) return test();
  if (d === 3) {
    S.f.duma = 4; saveSoon(); sfx('badge');
    return say(n, [L('You spoke with Hnat? With my otaman? What did he say?', 'Ти говорив з Гнатом? З моїм отаманом? Що він сказав?'),
      L('"Saddle the horse." Ha! So the old wolf hasn\'t changed.', '«Сідлай коня». Ха! Старий вовк не змінився.'),
      L('And Baba Yaga is behind it all. Of course she is. Then this is a war, of a kind. Not with sabres. With words.', 'І за всім стоїть Баба Яга. Звісно. Тоді це війна, своєрідна. Не шаблями. Словами.'),
      L('A kozak can\'t ride to that war. But you can. Take this horseshoe. Whistle at any signpost and Hnidko will come for you, and carry you anywhere you\'ve been.', 'Козак на таку війну не поїде. А ти можеш. Візьми підкову. Свисни біля будь-якого дороговказу, і Гнідко прийде по тебе й повезе куди завгодно, де ти вже був.'),
      give('horseshoe')], done);
  }
  const chat = () => say(n, [L('Козак: a free man. Воля: freedom. Remember those two.', 'Козак — вільна людина. Воля. Запам\'ятай ці два слова.')], done);
  const duma = () => {
    if (d === 0) {
      S.f.duma = 1; saveSoon();
      return say(n, [L('Hnidko? He\'s been restless all summer. Pacing, pulling at his rope, looking at the steppe. Horses know things.', 'Гнідко? Він ціле літо неспокійний. Ходить, смикає вуздечку, дивиться на степ. Коні все знають.'),
        L('Out on the steppe there\'s a kurhan, a burial mound older than anyone, with a stone baba on top. My otaman sleeps in it. Hnat. We rode together forty years.', 'У степу є курган, могила, старша за всіх, а на ній кам\'яна баба. Там спить мій отаман. Гнат. Ми сорок років їздили разом.'),
        L('Since the words started running, the dead have been uneasy. Somebody needs to go and ask them why. I can\'t. A kozak who sits for the paintings doesn\'t get up.', 'Відколи слова почали тікати, мертвим неспокійно. Хтось має піти й спитати чому. Я не можу. Козак, якого малюють, не встає.'),
        L('Take my люлька, my pipe. Hnat will know it. The stone baba keeps the kurhan; ask her how to call him.', 'Візьми мою люльку. Гнат її впізнає. Кам\'яна баба стереже курган, спитай її, як його покликати.'),
        give('pipe')], done);
    }
    if (d < 3) return say(n, [L('The kurhan is south of the windmill road, with the stone baba on top. Hnidko is waiting to hear.', 'Курган на південь від дороги до вітряка, на ньому кам\'яна баба. Гнідко чекає звістки.')], done);
    say(n, [L('Hnidko likes you. That\'s rarer than a pysanka. Go on, ride.', 'Ти подобаєшся Гнідкові. Це рідше, ніж писанка. Їдь.')], done);
  };
  say(n, [L('Sit, sit. What is it?', 'Сідай, сідай. Що таке?')], null, { options: [L('Your test', 'Ваше випробування'), d ? L('The kurhan', 'Курган') : L('Your horse', 'Ваш кінь'), L('Just chatting', 'Просто поговорити')],
    pick: i => i === 0 ? test() : i === 1 ? duma() : chat() });
}
// The kamiana baba teaches you to call the dead properly: the vocative case, кличний відмінок.
const VOC = [
  ['___, прокинься!', 'Otaman, wake up!', ['Отамане', 'Отаман', 'Отамана'], 0, 'A hard consonant takes -е: отаман → отамане.'],
  ['___ отамане!', 'Father otaman! (how kozaks addressed their leader)', ['Батьку', 'Батько', 'Батька'], 0, '-ко becomes -ку: батько → батьку.'],
  ['___, де твій кінь?', 'Kozak, where is your horse?', ['Козаче', 'Козак', 'Козака'], 0, 'к softens to ч: козак → козаче.'],
  ['Добрий день, ___!', 'Good day, friend!', ['друже', 'друг', 'друга'], 0, 'г softens to ж: друг → друже.'],
  ['Слава тобі, ___!', 'Glory to you, brother!', ['брате', 'брат', 'брата'], 0, 'брат → брате.'],
  ['Дякую, ___ Ганно!', 'Thank you, Baba Hanna!', ['бабо', 'баба', 'бабу'], 0, 'Feminine -а becomes -о.'],
  ['___, ходи додому!', 'Petryk, come home!', ['Петрику', 'Петрик', 'Петрика'], 0, 'Names in -ик take -у: Петрик → Петрику.'],
  ['___, я тебе чую.', 'Mama, I hear you.', ['Мамо', 'Мама', 'Маму'], 0, 'мама → мамо.'],
  ['___, де твій кінь?', 'Mamai, where is your horse?', ['Мамаю', 'Мамай', 'Мамая'], 0, '-й becomes -ю: Мамай → Мамаю.'],
  ['Спи спокійно, ___.', 'Sleep peacefully, grandfather.', ['діду', 'дід', 'діда'], 0, 'дід → діду.'],
  ['___, не плач!', 'Sister, don\'t cry!', ['Сестро', 'Сестра', 'Сестру'], 0, 'Feminine -а becomes -о.'],
  ['Добрий вечір, ___!', 'Good evening, sir!', ['пане', 'пан', 'пана'], 0, 'пан → пане.'],
];
function babaTalk() {
  const n = 'The kamiana baba', d = S.f.duma || 0;
  if (!S.f.book || d === 0) return false;
  const lesson = (after) => roadQuiz(shuffle(VOC.slice()).slice(0, 8), 'КЛИЧНИЙ', after, ['КЛИЧНИЙ ВІДМІНОК', 'Кам\'яна баба', 'the vocative case', 'How do you call them?']);
  if (d >= 2) {
    say(n, [d >= 4 ? L('Stone remembers. So do you, now.', 'Камінь пам\'ятає. І ти тепер теж.') : L('He is listening. Go round to the foot of the kurhan.', 'Він слухає. Обійди курган до підніжжя.')], null,
      { options: [L('Practise calling', 'Повторити кличний'), L('Goodbye', 'До побачення')], pick: i => i ? null : lesson(() => say(n, [L('...', '...')])) });
    return true;
  }
  say(n, [L('The stone is warm. Then, very slowly, it speaks.', 'Камінь теплий. А тоді, дуже повільно, він заговорює.'),
    L('Two thousand years I have stood on this kurhan. Scythians raised me. Kozaks tied their horses to me. I have heard every word this steppe ever said.', 'Дві тисячі років я стою на цьому кургані. Мене поставили скіфи. Козаки прив\'язували до мене коней. Я чула кожне слово, яке казав цей степ.'),
    L('That pipe is Mamai\'s. You want the otaman. The dead don\'t answer to "hey, you". You must call them properly.', 'Ця люлька — Мамаєва. Тобі потрібен отаман. Мертві не відповідають на «гей, ти». Їх треба кликати як слід.'),
    L('When you call someone in Ukrainian, the name changes. Отаман becomes Отамане! Мама becomes Мамо! That is the кличний відмінок, the vocative case.', 'Коли кличеш когось українською, ім\'я змінюється. Отаман стає «Отамане!», мама — «Мамо!». Це кличний відмінок.'),
    L('Hard consonants take -е. Feminine -а becomes -о. -й and -ь become -ю. Show me eight, get six right, and I will wake him.', 'Тверді приголосні беруть -е. Жіноче -а стає -о. -й та -ь стають -ю. Покажи мені вісім, шість правильних, і я його розбуджу.')], null, yesNo(go => {
    if (!go) return say(n, [L('Stone can wait.', 'Камінь почекає.')]);
    lesson(q => {
      if (q.stopped || q.score < 6) return say(n, [L(`${q.score} of 8. The dead would not hear that. Again, when you are ready.`, `${q.score} з 8. Мертві такого не почують. Ще раз, коли будеш готовий.`)]);
      S.f.duma = 2; saveSoon(); sfx('night');
      say(n, [L(`${q.score} of 8. Good. Now call.`, `${q.score} з 8. Добре. Тепер клич.`),
        L(`You stand on the kurhan and call: "Отамане! Батьку отамане!"`, 'Ти стаєш на кургані й кличеш: «Отамане! Батьку отамане!»'),
        L('The wind drops. The grass at the foot of the mound bends, as if somebody heavy has just sat up in it.', 'Вітер стихає. Трава біля підніжжя кургану хилиться, ніби хтось важкий щойно сів у ній.')]);
    });
  }));
  return true;
}
const MEMORY_WORDS = ['пам’ять', 'дід', 'батько', 'мати', 'родина', 'брат', 'життя', 'смерть', 'воля', 'слава'].map(W_);
function otamanTalk(npc, done) {
  const n = npc.name, d = S.f.duma || 0;
  if (d >= 3) return say(n, [d >= 4 ? L('Sleep comes easier now. Say the words for me, little kozak. Say them every day.', 'Тепер спиться легше. Кажи слова за мене, козаченьку. Кажи їх щодня.')
    : L('Tell Mamai: saddle the horse.', 'Скажи Мамаєві: сідлай коня.')], null,
    { options: [L('Practise words of memory', 'Повторити слова пам\'яті'), L('Goodbye', 'Прощавайте')], pick: i => i ? done() : teach(n, MEMORY_WORDS, () => done()) });
  say(n, [L('Who calls me with the old words? ...That pipe. Mamai! The old goat is still sitting under his oak, then.', 'Хто кличе мене старими словами? ...Ця люлька. Мамай! Старий цап і досі сидить під своїм дубом.'),
    L('You want to know why the dead can\'t sleep. Listen. The dead live in the words the living say about them. Дід. Батько. Брат. Every time a word is forgotten, one of us goes dark.', 'Ти хочеш знати, чому мертві не сплять. Слухай. Мертві живуть у словах, які про них кажуть живі. Дід. Батько. Брат. Щоразу, як забувають слово, хтось із нас гасне.'),
    L('And somebody is making sure they are forgotten. In the old forest lives a woman with a bone leg. Every word that nobody says, she sweeps up and feeds to her stove, and her hut grows fat on them.', 'А хтось дбає, щоб їх забували. У старому лісі живе жінка з кістяною ногою. Кожне слово, якого ніхто не каже, вона вимітає і кидає в піч, і її хатинка від них гладшає.'),
    L('Baba Yaga. I fought Turks and Poles and once, a bear. I never fought anything that frightened me like a quiet village.', 'Баба Яга. Я бився з турками, з ляхами, а раз — із ведмедем. Але ніщо не лякало мене так, як тихе село.'),
    L('You can\'t fight her with a sabre. You fight her by remembering. Learn these words. Words of memory. Then she can\'t have them.', 'Шаблею її не переможеш. Її перемагають пам\'яттю. Вивчи ці слова. Слова пам\'яті. Тоді вони їй не дістануться.')],
  () => teach(n, MEMORY_WORDS, () => {
    take('pipe'); S.f.duma = 3; saveSoon(); sfx('badge');
    say(n, [L('Good. Give Mamai back his pipe... no, I\'ll keep it. He owes me one. Tell him this: saddle the horse.', 'Добре. Віддай Мамаєві люльку... ні, залишу собі. Він мені винен. А йому скажи: сідлай коня.'),
      L('[The otaman takes the pipe. For a moment a thin thread of smoke rises from it.]', '[Отаман бере люльку. На мить з неї піднімається тоненька цівка диму.]')], done);
  }));
}
// With the horseshoe, any signpost will bring Hnidko.
const RIDE_AREAS = AREA_IDS;
function rideTarget(id) {
  const k = Object.keys(AREAS[id].signs)[0];
  if (k) { const [x, y] = k.split(',').map(Number); return [x, y + 1]; }
  for (const a of AREA_IDS) { const e = AREAS[a].exits.find(e => e.to === id); if (e) return [e.tx, e.ty]; }
  return [10, 10];
}
function rideMenu(page) {
  const been = id => (S.been && S.been[id]) || ZONE_AREA.some((a, z) => a === id && S.f['b' + z]);
  const places = RIDE_AREAS.filter(id => id !== area && been(id));
  if (!places.length) return say('', [L('Hnidko looks at you. You haven\'t been anywhere else yet.', 'Гнідко дивиться на тебе. Ти ще ніде більше не був.')]);
  const per = 4, slice = places.slice(page * per, page * per + per), more = places.length > (page + 1) * per;
  const opts = slice.map(id => L(AREAS[id].name, AREAS[id].ua));
  if (more) opts.push(L('More…', 'Далі…'));
  opts.push(L('Stay here', 'Лишитися'));
  say('Hnidko', [L('Where to?', 'Куди?')], null, { options: opts, pick: i => {
    if (i < slice.length) {
      const id = slice[i], [tx, ty] = rideTarget(id);
      sfx('door');
      warp = { to: { to: id, tx, ty, dir: 'down' }, fade: 0, dir: 1, then: () => {
        if (canStand(player.tx, player.ty, player)) return;
        for (let r = 1; r < 5; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++)
          if (canStand(tx + dx, ty + dy, player)) return Object.assign(player, { tx: tx + dx, ty: ty + dy, x: (tx + dx) * 16, y: (ty + dy) * 16, fx: tx + dx, fy: ty + dy, nx: tx + dx, ny: ty + dy });
      } };
    } else if (more && i === slice.length) rideMenu(page + 1);
  } });
}

// looking at things: some of them have more to say once the story gets there
const STORY_LOOK = {
  'home:2': () => {
    if (!S.f.book || has('bread') || S.f.dom) return false;
    say('', [L('A round loaf under the embroidered cloth. You break off a crust. Mama won\'t mind. Probably.', 'Під вишитим рушником лежить паляниця. Ти відламуєш окраєць. Мама не сваритиметься. Мабуть.'), give('bread')]);
    return true;
  },
  'home:5': () => {
    if (!S.f.night) return false;
    say('', [L('Your bed. Sleep until morning?', 'Твоє ліжко. Спати до ранку?')], null, yesNo(go => {
      if (!go) return;
      S.f.night = 0; saveSoon(); playMusic(areaMusic());
      say('', [S.f.fern ? L('You sleep with the fern flower under your pillow, and dream in every language there is.', 'Ти спиш із цвітом папороті під подушкою і бачиш сни всіма мовами світу.')
        : L('You sleep. Kupala comes round again next year... but Oksana will float her wreath without you. (Talk to her to try again.)', 'Ти спиш. Купала буде й наступного року... (Поговори з Оксаною, щоб спробувати ще раз.)')]);
      if (!S.f.fern) { S.f.kupala = 0; S.f.chu = 0; S.items.wreath = 1; }
    }));
    return true;
  },
  'hrytsenko:1': () => {
    if (S.f.dom) return false;
    if (!has('bread')) { say('', [L('Behind the stove, two small eyes blink at you, then vanish.', 'З-за печі на тебе блимають двоє маленьких очей і зникають.'), L('Something in here is hungry.', 'Хтось тут голодний.')]); return true; }
    take('bread'); S.f.dom = 1; saveSoon();
    say('', [L('You leave the crust of bread by the pich.', 'Ти кладеш окраєць хліба біля печі.'),
      L('A small hairy old man climbs out from behind the stove, sniffs the bread, and looks at you for a long time.', 'З-за печі вилазить маленький волохатий дідок, нюхає хліб і довго на тебе дивиться.')], () => {
      say('The domovyk', [
        L('Bread. Real bread. Nobody has left me bread since the Hrytsenkos went to the city.', 'Хліб. Справжній хліб. Ніхто не залишав мені хліба, відколи Гриценки поїхали до міста.'),
        L('A domovyk doesn\'t leave his stove. So I stayed, and the house got quiet, and the words started to leave. That\'s why they\'re all out in the grass, you know. Nobody was saying them.', 'Домовик не покидає своєї печі. Тож я лишився, хата затихла, і слова почали тікати. Ось чому вони всі в траві. Їх ніхто не казав.'),
        L('And some nights a broom came scratching at the door, looking for the ones that hadn\'t got away yet. I didn\'t open. A domovyk knows whose broom that is.', 'А деякими ночами в двері шкрябала мітла, шукала ті, що ще не втекли. Я не відчинив. Домовик знає, чия то мітла.'),
        L('You want the fern flower. Of course you do. First, learn the words of the house, so the house will vouch for you.', 'Ти хочеш цвіт папороті. Звісно. Спершу вивчи слова хати, щоб хата за тебе поручилася.')], () => {
        teach('The domovyk', HOUSE_WORDS, () => say('The domovyk', [
          L('Good. Now listen: three things open the chuhaister\'s path on Kupala night.', 'Добре. Тепер слухай: три речі відкривають стежку чугайстра на Купала.'),
          L('A wreath that has been in the water. A candle that has burned in church. And someone who knows the words of the house. That\'s you, now.', 'Вінок, що побував у воді. Свічка, що горіла в церкві. І той, хто знає слова хати. Тепер це ти.'),
          L('The vodyanyk in the Kalynivka pond keeps what the river takes. The dyak in our church keeps the candles. Go.', 'Водяник у калинівському ставку береже все, що забирає річка. Дяк у нашій церкві береже свічки. Іди.')]));
      });
    });
    return true;
  },
  'vyshneve:N': () => {
    if (!S.f.fern) return false;
    if (has('feather')) { say('The stork', [L('Kle-kle. I\'m busy. The children need feeding.', 'Кле-кле. Я зайнята. Дітей треба годувати.')]); return true; }
    say('The stork', [L('Kle-kle-kle! So you can hear us now.', 'Кле-кле-кле! То ти нас тепер чуєш.'),
      L('From up there I see everything. At night the hut on hen\'s legs walks to the edge of the old forest and looks at the villages. The quiet ones first.', 'Згори я бачу все. Уночі хатинка на курячих ніжках виходить на узлісся і дивиться на села. Спершу на тихі.'),
      L('I have flown to Africa and back twenty times. I know the words for everything up there. Listen.', 'Я двадцять разів літала до Африки і назад. Я знаю слова для всього, що там, нагорі. Слухай.')], () =>
      teach('The stork', ['небо', 'птах', 'весна', 'літо'].map(W_), () => say('The stork', [L('Good. Take a feather. I lose them on purpose.', 'Добре. Візьми пір\'їнку. Я гублю їх навмисне.'), give('feather')])));
    return true;
  },
  'steppe:b': () => babaTalk(),
  '*:i': () => {
    if (!has('horseshoe') || AR.inside) return false;
    const sign = AR.signs[player.tx + DIRS[player.dir][0] + ',' + (player.ty + DIRS[player.dir][1])] || '...';
    say('', [sign], null, { options: [L('Whistle for Hnidko', 'Свиснути Гнідкові'), L('Walk on', 'Іти далі')], pick: i => { if (!i) { sfx('tick'); rideMenu(0); } } });
    return true;
  },
  '*:e': () => {
    if (!S.f.fern) return false;
    say('The heron', [L('Shh. I\'m fishing. Чапля: heron. Риба: fish. Жаба: frog. Those are the only words a heron needs.', 'Тсс. Я рибалю. Чапля. Риба. Жаба. Чаплі більше слів не треба.'),
      L('Stand on one leg and keep still, and things come to you. Fish. Words. It works for both.', 'Стань на одну ногу й не ворушись, і все прийде само. Риба. Слова. Працює для обох.')]);
    return true;
  },
  'ferry:h': () => {
    if (!S.f.fern) return false;
    say('Hnidko', [L('Pfff. You can understand me? Then listen. Mamai talks about war all day. I would rather talk about apples.', 'Пфф. Ти мене розумієш? Тоді слухай. Мамай цілий день говорить про війну. А я б краще про яблука.'),
      L('Яблуко. Say it. Яблуко. ...You don\'t have one, do you.', 'Яблуко. Скажи. Яблуко. ...У тебе його немає, правда?')]);
    return true;
  },
  'ferryman:4': () => { say('', [L('Semen\'s ledger. Hundreds of names in a careful hand. One page has been torn out, and the edge is scorched.', 'Книга Семена. Сотні імен, акуратним почерком. Одну сторінку вирвано, і край обпалений.')]); return true; },
  'panas:4': () => { say('', [L('A box of fish hooks, and a letter from Panas\'s son in Kyiv, read so many times it has gone soft as cloth.', 'Коробка гачків і лист від Панасового сина з Києва, перечитаний стільки разів, що став м\'який, як полотно.')]); return true; },
  'yaryna:q': () => { say('', [L('Bundles of herbs, each labelled in Yaryna\'s hand. ВІД ЗУБНОГО БОЛЮ: for toothache. ВІД ПРИСТРІТУ: against the evil eye.', 'В\'язки трав, кожна підписана Ярининою рукою. ВІД ЗУБНОГО БОЛЮ. ВІД ПРИСТРІТУ.'),
    L('And one big bundle of wormwood, полин, tied with red thread: ВІД КІСТЯНОЇ НОГИ. Against the bone leg.', 'І великий жмут полину, перев\'язаний червоною ниткою: ВІД КІСТЯНОЇ НОГИ.')]); return true; },
  '*:B': () => {
    if (!S.f.fern) return false;
    if (has('honey')) { say('The bees', [L('Bzz-bzz. Busy, busy, busy.', 'Дз-дз. Робота, робота, робота.')]); return true; }
    say('The bees', [L('Bzzz... you understand us? Good. In the old days people told us their news. Nobody tells us anything any more.', 'Дзз... ти нас розумієш? Добре. Колись люди розповідали нам новини. Тепер нам ніхто нічого не каже.'),
      L('We know the name of every flower. Learn some.', 'Ми знаємо назву кожної квітки. Вивчи кілька.')], () =>
      teach('The bees', ['мед', 'квітка', 'жовтий', 'зелений'].map(W_), () => say('The bees', [L('Bzz. Take some honeycomb. Tell us your news sometimes.', 'Дзз. Візьми стільник. І розповідай нам іноді новини.'), give('honey')])));
    return true;
  },
};

// some doors only open when the story says so
const DOOR_LOCK = {
  hrytsenko: () => {
    if (has('bread') || S.f.dom) return true;
    say('', [S.f.q2 ? L('The door is shut tight. Baba Hanna said to bring bread.', 'Двері щільно зачинені. Баба Ганна казала принести хліба.') : AREAS.vyshneve.houses['5,19']]);
    return false;
  },
};

// Some roads are closed until the story opens them: EXIT_LOCK['from>to'] returns true to stop you.
const EXIT_LOCK = {};
// You can't leave Vyshneve before Ostap has given you the словник: like every hero, you get called back.
function exitLock(ex) {
  const lock = EXIT_LOCK[area + '>' + ex.to];
  if (lock && lock(ex)) return true;
  if (area !== 'vyshneve' || S.f.book) return false;
  sfx('tick'); player.alert = .7;
  player.alertThen = () => say('Petryk', [L(`${myName()}! Wait! Where are you going?`, `${myVoc()}! Стій! Куди це ти?`),
    L('Ostap the kobzar has been looking for you all morning! He\'s by the church. Come on, I\'ll take you!', 'Кобзар Остап шукає тебе цілий ранок! Він біля церкви. Ходімо, я тебе відведу!')], () => {
    warp = { to: { to: 'vyshneve', tx: 16, ty: 9, dir: 'up' }, fade: 0, dir: 1, then: () => {
      const ostap = entities.find(e => e.id === 'ostap');
      if (!ostap) return;
      ostap.dir = 'down'; ostap.busy = true; curSpeaker = ostap;
      ostapTalk(ostap, () => { ostap.busy = false; });
    } };
  });
  return true;
}

// called whenever you arrive somewhere
function onAreaEnter(id) {
  if (!AREAS[id].inside) { S.been = S.been || {}; S.been[id] = 1; }
  if (id === 'vyshneve' && S.f.night && S.f.fern) {
    S.f.night = 0; saveSoon(); playMusic(areaMusic());
    say('', [L('The sun comes up over Vyshneve. Somewhere a rooster is very pleased with himself.', 'Над Вишневим сходить сонце. Десь дуже собою задоволений півень.'),
      L('And across the river, you can hear the stork talking to her children.', 'А за річкою чути, як лелека розмовляє зі своїми дітьми.')]);
  }
}
