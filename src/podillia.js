// ─── Podillia: Kamianets and the Dniester canyon ──────────────────────────
// Getting there: the fair's west road, once you hold PODILLIA_NEED pysanky. From the Dniester the river road
// goes on up into the mountains (if Mytro has passed you), and from Kamianets a bus goes to Lviv.
const PODILLIA_NEED = 11;
Object.assign(ITEMS, {
  kluch: { ua: 'ключ від замку', en: 'the key to the castle', desc: 'Pan Bohdan\'s iron key, as long as your forearm. За́мок is a castle and замо́к is a lock, and this key fits both.' },
  dzvinok: { ua: 'дзвоник з Бакоти', en: 'the little bell of Bakota', desc: 'Found on the shore under the drowned village. Brother Iov says whoever hears it remembers something they had forgotten.' },
});
EXIT_LOCK['fair>kamianets'] = () => {
  if (badgeCount() >= PODILLIA_NEED) return false;
  turnBack();
  say('Yosyp the carter', [L('West? To Podillia? Three days in a cart, with me singing the whole way. You\'re not ready for that.', 'На захід? На Поділля? Три дні возом, і я всю дорогу співаю. Ти до такого ще не готовий.'),
    L(`Come back with ${PODILLIA_NEED} pysanky and I'll know you've seen a bit of the world. You have ${badgeCount()}.`, `Приходь, коли матимеш ${PODILLIA_NEED} писанок, тоді я знатиму, що ти трохи бачив світу. У тебе ${badgeCount()}.`)]);
  return true;
};
EXIT_LOCK['verkhovyna>dniester'] = () => {
  if (badgeCount() >= PODILLIA_NEED) return false;
  turnBack();
  say('', [L(`The road follows the river down out of the mountains, towards Podillia. A Hutsul raftsman sitting on a log shakes his head: "Down there they speak fast and walk faster. Come back with ${PODILLIA_NEED} pysanky." You have ${badgeCount()}.`,
    `Дорога йде вздовж річки вниз, з гір, на Поділля. Гуцул-бокораш, що сидить на колоді, хитає головою: «Там внизу швидко говорять і ще швидше ходять. Вертайся, коли матимеш ${PODILLIA_NEED} писанок». У тебе ${badgeCount()}.`)]);
  return true;
};
EXIT_LOCK['dniester>verkhovyna'] = () => {
  if ((S.f.hutsul || 0) >= 2) return false;
  turnBack();
  say('Did Yakiv', [L('Up the river? That\'s Hutsul country. They won\'t let a lowlander in unless Mytro the ґазда has tested him, and Mytro sits on the pass by Lake Synevyr.', 'Угору по річці? То гуцульський край. Долинянина вони не пустять, поки його не перевірив ґазда Митро, а Митро сидить на перевалі біля Синевиру.'),
    L('Go round by the lake, get his word, and the river road is yours.', 'Іди в обхід, через озеро, здобудь його слово, і річкова дорога твоя.')]);
  return true;
};

// ─── Kamianets: the town that lost its colours ────────────────────────────
// The magpies stole the words for colours, and a thing you can't name, you stop seeing.
// S.f.kam: 1 Bohdan told you, 2 the flag is up and the colours are back. S.f.farby: bits, who has their words back (1 Ruzha, 2 Marian, 4 Olia).
const kamStep = () => S.f.kam || 0;
const farby = () => S.f.farby || 0;
const farbyCount = () => [1, 2, 4].filter(b => farby() & b).length;
AREA_GREY.kamianets = AREA_GREY.castle = () => kamStep() >= 2 ? 0 : Math.max(.12, 1 - farbyCount() * .29);
const COLOUR_WORDS = {
  ruzha: [1, 3, [
    ['Ця троянда ___.', 'This rose is red.', ['червона', 'червоний', 'червоне'], 0, 'Троянда is feminine, so червона. An adjective matches its noun: -ий for him, -а for her, -е for it, -і for them.'],
    ['Цей мак теж ___.', 'This poppy is red too.', ['червоний', 'червона', 'червоне'], 0, 'Мак is masculine: червоний.'],
    ['А ромашки ___, як сніг.', 'And the daisies are white as snow.', ['білі', 'біла', 'білий'], 0, 'Ромашки is plural: білі.'],
    ['Небо над квітами ___.', 'The sky over the flowers is blue.', ['синє', 'синій', 'синя'], 0, 'Небо is neuter: синє. Синій is a soft adjective: синій, синя, синє, сині.'],
  ]],
  marian: [2, 4, [
    ['Замок ___: на всю скелю.', 'The castle is huge: it covers the whole rock.', ['величезний', 'величезна', 'величезне'], 0, 'Замок is masculine: величезний.'],
    ['Вежі ___, як свічки.', 'The towers are round, like candles.', ['круглі', 'кругла', 'круглий'], 0, 'Вежі is plural: круглі.'],
    ['Ця вежа ___ за ту.', 'This tower is taller than that one.', ['вища', 'висока', 'вищий'], 0, 'Taller: високий → вищий (вища, for a feminine вежа). Than: за + the accusative, or ніж.'],
    ['Міст ___: два вози не розминуться.', 'The bridge is narrow: two carts can\'t pass on it.', ['вузький', 'вузька', 'вузьке'], 0, 'Міст is masculine: вузький.'],
    ['А місто внизу ___, як на долоні.', 'And the town below is small, as if on the palm of your hand.', ['маленьке', 'маленький', 'маленька'], 0, 'Місто is neuter: маленьке.'],
  ]],
  olia: [4, 4, [
    ['Моя улюблена куля ___ з жовтим.', 'My favourite balloon is red and yellow.', ['червона', 'червоний', 'червоне'], 0, 'Куля is feminine: червона.'],
    ['Ось та куля ___, як баклажан.', 'That balloon there is purple, like an aubergine.', ['фіолетова', 'фіолетовий', 'фіолетове'], 0, 'Фіолетова куля.'],
    ['Синя куля ___ за червону.', 'The blue balloon is bigger than the red one.', ['більша', 'велика', 'більший'], 0, 'Bigger: великий → більший (більша for куля). Some comparatives are irregular: малий → менший, добрий → кращий.'],
    ['А зелена — ___ з усіх!', 'And the green one is the smallest of all!', ['найменша', 'менша', 'маленька'], 0, 'The most: най- + the comparative. Менша → найменша.'],
    ['Гаряче повітря ___, тому куля летить.', 'Hot air is light, so the balloon flies.', ['легке', 'легкий', 'легка'], 0, 'Повітря is neuter: легке.'],
  ]],
};
const FLAG = [
  ['Наш прапор має два ___.', 'Our flag has two colours.', ['кольори', 'кольорів', 'колір'], 0, 'After два, три, чотири: the nominative plural. Два кольори. (П\'ять кольорів.)'],
  ['Верх прапора ___, як небо.', 'The top of the flag is blue, like the sky.', ['синій', 'синя', 'синє'], 0, 'Верх is masculine: синій. Some say блакитний, sky blue. Ukrainians argue about it happily.'],
  ['А низ ___, як пшениця.', 'And the bottom is yellow, like wheat.', ['жовтий', 'жовта', 'жовте'], 0, 'Низ is masculine: жовтий. Жовто-блакитний: yellow and blue.'],
  ['Ця смуга синя, а ця — ___.', 'This stripe is blue, and this one is yellow.', ['жовта', 'жовтий', 'жовте'], 0, 'Смуга is feminine: жовта.'],
  ['Піднімемо його на ___ вежу!', 'Let\'s raise it on the highest tower!', ['найвищу', 'найвища', 'найвищий'], 0, 'На + the accusative (where to), and the adjective follows its noun: найвища вежа → на найвищу вежу.'],
];
function colourHelper(id, intro, after, chat) {
  return (npc, done) => {
    const n = npc.name, [bit, need, qs] = COLOUR_WORDS[id];
    if (farby() & bit) return say(n, after, done);
    if (!S.f.book || !kamStep()) return say(n, [...chat, ...(S.f.book ? [L('[The whole town is grey. Pan Bohdan, the castle keeper by the bridge, will know why.]', '[Усе місто сіре. Пан Богдан, кастелян біля мосту, знає чому.]')] : [])], done);
    say(n, intro, null, yesNo(go => {
      if (!go) return say(n, [L('Then I\'ll stand here in the grey.', 'Тоді я постою тут, у сірому.')], done);
      roadQuiz(qs.slice(), 'КОЛІР', q => {
        if (q.stopped || q.score < need) return say(n, [L(`${q.score} of ${qs.length}. No, it\'s still grey. Let\'s try again.`, `${q.score} з ${qs.length}. Ні, усе ще сіре. Спробуймо ще.`)], done);
        S.f.farby = farby() | bit; saveSoon(); sfx('ok');
        say(n, [L('Oh! There! Do you see it?', 'Ой! Ось! Бачиш?'),
          L(`[A little colour seeps back into Kamianets, like tea into hot water. ${farbyCount()} of 3.]`, `[Трохи кольору вертається в Кам'янець, як чай у гарячу воду. ${farbyCount()} з 3.]`), ...after], done);
      }, ['КОЛІР', 'Кольори Кам\'янця', 'the colours of Kamianets', 'What is it like?'], 19);
    }));
  };
}
function bohdanTalk(npc, done) {
  const n = npc.name, k = kamStep();
  const test = () => keeperTalk(19, [L('What things are like: big and small, long and short, every colour there is. Великий, малий, червоний, круглий. A castle keeper has to describe his castle to every visitor, a hundred times a day.', 'Які речі бувають: великі й малі, довгі й короткі, усіх кольорів. Великий, малий, червоний, круглий. Кастелян мусить описувати свій замок кожному гостеві, сто разів на день.')])(npc, done);
  const chat = () => say(n, [L('I\'m the кастелян: the castle keeper. Eleven towers, one bridge, nine hundred years, and a leaking roof on the Papal tower.', 'Я кастелян. Одинадцять веж, один міст, дев\'ятсот років і дірявий дах на Папській вежі.'),
    L('A sultan came here once with an army. He looked up at the walls and asked who had built such a place. "God himself," they told him. "Then let God take it," said the sultan, and went home.', 'Колись сюди прийшов султан із військом. Подивився на мури й спитав, хто збудував таке місце. «Сам Бог», — сказали йому. «Тоді хай Бог його і бере», — сказав султан і пішов додому.')], done);
  const colours = () => {
    if (k === 0) {
      S.f.kam = 1; saveSoon();
      return say(n, [L('Welcome to Kamianets. Or what\'s left of it. Look around you. What colour is anything?', 'Ласкаво просимо до Кам\'янця. Чи того, що від нього лишилося. Подивися довкола. Якого кольору хоч щось?'),
        L('Three nights ago a broom flew low over the town, and a flock of magpies behind it. They sat on every roof all night, and at dawn they flew off west. They took the colour words with them. Not the paint. The words.', 'Три ночі тому над містом низько пролетіла мітла, а за нею зграя сорок. Цілу ніч вони сиділи на кожному даху, а на світанку полетіли на захід. І забрали з собою слова про кольори. Не фарбу. Слова.'),
        L('Nobody in town can name a colour now. And a thing you can\'t name, you stop seeing. So: grey. All of it.', 'Тепер ніхто в місті не може назвати жодного кольору. А що не можеш назвати, того перестаєш бачити. Тому все сіре. Геть усе.'),
        L('You still have the words, though, don\'t you? Help people find them again. Ruzha sells flowers on the square. Marian is painting the castle from the bridge, in grey. Little Tetianka is at the balloon field, south across the canyon, crying at the balloons.', 'Але в тебе ж слова є, правда? Допоможи людям їх знайти. Ружа продає квіти на площі. Мар\'ян малює замок з мосту, сірим. Маленька Тетянка на полі з повітряними кулями, на південь за каньйоном, плаче над кулями.'),
        L('When they can see again, come back to me. We\'ll put the flag up.', 'Коли вони знову бачитимуть, приходь до мене. Піднімемо прапор.'),
        L('And mind the endings. A colour follows its thing: червоний замок, червона вежа, червоне небо, червоні дахи.', 'І пильнуй закінчення. Колір іде за своєю річчю: червоний замок, червона вежа, червоне небо, червоні дахи.')], done);
    }
    if (k === 1 && farbyCount() < 3) return say(n, [L(`${farbyCount()} of 3. Ruzha on the square, Marian by the bridge, Tetianka at the balloons.`, `${farbyCount()} з 3. Ружа на площі, Мар'ян біля мосту, Тетянка біля куль.`)], done);
    if (k === 1) return say(n, [L('You can see it coming back? Then the flag. It\'s in my pocket, folded up for three days, grey as a dishcloth. Tell me what it\'s like, and I\'ll run it up the tower.', 'Бачиш, як вертається? Тоді прапор. Він три дні складений у мене в кишені, сірий, як ганчірка. Скажи мені, який він, і я підніму його на вежу.')], null, yesNo(go => {
      if (!go) return say(n, [L('When you\'re ready. The tower isn\'t going anywhere. It hasn\'t for nine hundred years.', 'Коли будеш готовий. Вежа нікуди не дінеться. Дев\'ятсот років не ділася.')], done);
      roadQuiz(FLAG.slice(), 'ПРАПОР', q => {
        if (q.stopped || q.score < 4) return say(n, [L(`${q.score} of 5. That\'s somebody else\'s flag. Again.`, `${q.score} з 5. Це чийсь інший прапор. Ще раз.`)], done);
        S.f.kam = 2; saveSoon(); sfx('badge');
        say('', [L('[Pan Bohdan runs up the gatehouse stairs. A moment later the flag climbs the pole, and the wind takes it.]', '[Пан Богдан біжить сходами на надбрамну вежу. За мить прапор повзе вгору по щоглі, і його підхоплює вітер.]'),
          L('[Blue at the top, like the sky. Yellow underneath, like wheat. And as everybody in Kamianets looks up at it, the colour runs back into the whole town at once: red roofs, green trees, white stone, the river far below as green as a bottle.]', '[Угорі синій, як небо. Унизу жовтий, як пшениця. І поки весь Кам\'янець дивиться на нього, колір вертається в усе місто одразу: червоні дахи, зелені дерева, білий камінь, а далеко внизу річка, зелена, як пляшка.]'),
          L('[Down on the balloon field, the burners roar. One by one, the balloons go up.]', '[Унизу на полі гудуть пальники. Одна за одною кулі піднімаються в небо.]')], () =>
          say(n, [L('Look at that. Look at it! I\'d forgotten how red my roofs are.', 'Ти подивись. Подивись! Я й забув, які червоні в мене дахи.'),
            L('Take this: the key to the castle. Ключ від замку. Замок, with the stress at the front, is a castle. Замок, with the stress at the back, is a lock. This key does both.', 'Візьми: ключ від замку. За́мок, з наголосом на початку, — це фортеця. Замо́к, з наголосом у кінці, — це те, що замикають. Цей ключ підходить до обох.'), give('kluch'),
            L('The magpies flew west, towards Lviv. If they\'re stealing whole kinds of words now, she must be getting ready for something.', 'Сороки полетіли на захід, у бік Львова. Якщо вони вже крадуть цілі роди слів, то вона до чогось готується.')], done));
      }, ['ПРАПОР', 'Прапор над замком', 'the flag over the castle', 'What is the flag like?'], 19);
    }));
    say(n, [L('The flag\'s up and the town has its colours. Go and look at the balloons; they won\'t stay up forever.', 'Прапор угорі, і місто має свої кольори. Іди подивися на кулі: вони не висітимуть там вічно.')], done);
  };
  if (!S.f.book) return chat();
  say(n, [L('Слава Україні! What can the castle do for you?', 'Слава Україні! Чим замок може тобі допомогти?')], null, menu([L('Your test', 'Ваше випробування'), L('The colours', 'Кольори'), L('Just chatting', 'Просто поговорити')], i => i === 0 ? test() : i === 1 ? colours() : chat()));
}
function romanTalk(npc, done) {
  const n = npc.name;
  if (!S.f.book || badgeCount() < LVIV_NEED) return say(n, [L('Автобус до Львова: the bus to Lviv. Five hours, and the road goes up and down like a song.', 'Автобус до Львова. П\'ять годин, і дорога то вгору, то вниз, як пісня.'),
    ...(S.f.book ? [L(`I only take people with ${LVIV_NEED} pysanky. Lviv is a fussy city. You have ${badgeCount()}.`, `Я беру тільки тих, у кого ${LVIV_NEED} писанок. Львів — вибагливе місто. У тебе ${badgeCount()}.`)] : [])], done);
  say(n, [L('Lviv? Get in. Window seat. Don\'t open the window.', 'До Львова? Сідай. Біля вікна. Вікна не відчиняй.')], null, yesNo(go => {
    if (!go) return say(n, [L('I leave when I leave.', 'Я їду, коли їду.')], done);
    say('', [L('[The bus climbs out of the canyon and rolls west all afternoon, past fields, churches, more fields. At dusk the towers of Lviv rise up ahead, and a tram rings.]', '[Автобус вибирається з каньйону й цілий день котиться на захід, повз поля, церкви, і знову поля. Надвечір попереду виростають вежі Львова, і дзеленчить трамвай.]')],
      () => travel('lviv', 20, 27, 'up'));
  }));
}

// ─── The Dniester: everybody woke up as somebody else ─────────────────────
// A black wind blew the job words about, and they came down on the wrong people.
// S.f.dnister: 1 Yakiv told you, 2 the crew's back and the raft can go, 3 Brother Iov gave you the bell. S.f.robota: bits, who knows their job again.
const dnStep = () => S.f.dnister || 0;
const robota = () => S.f.robota || 0;
const robotaCount = () => [1, 2, 4, 8, 16].filter(b => robota() & b).length;
const JOBS = {
  oksana: [1, [['Ви не офіціантка. Ви працюєте ___!', 'You\'re not a waitress. You work as a journalist!', ['журналісткою', 'журналістка', 'журналістку'], 0, 'Працювати ким? The instrumental: журналістка → журналісткою. Many job words have a feminine form in -ка.'],
    ['Я вже ___ статтю! Ось вона.', 'I\'ve already written the article! Here it is.', ['написала', 'писала', 'пишу'], 0, 'Finished, with a result: the perfective написала. Писала means was writing, maybe still unfinished.']]],
  petro: [2, [['Ви не юрист. Ви працюєте ___!', 'You\'re not a lawyer. You work as a waiter!', ['офіціантом', 'офіціант', 'офіціанта'], 0, 'Працювати ким? Офіціант → офіціантом.'],
    ['Я щодня ___ гостям борщ.', 'Every day I bring the guests borshch.', ['приношу', 'принесу', 'приніс'], 0, 'Every day, a habit: the imperfective приношу. Принесу is once, in the future.']]],
  stepan: [4, [['Вам потрібен документ з печаткою? Ви працюєте ___!', 'You need a document with a stamp? You work as a lawyer!', ['юристом', 'юрист', 'юриста'], 0, 'Працювати ким? Юрист → юристом.'],
    ['Юрист щодня ___ контракти.', 'A lawyer reads contracts every day.', ['читає', 'прочитає', 'прочитав'], 0, 'Every day, a process: the imperfective читає. Прочитає means he will read one through to the end.']]],
  iryna: [8, [['Ви хочете знати чому? Ви працюєте ___!', 'You want to know why? You work as a scientist!', ['науковицею', 'науковиця', 'науковицю'], 0, 'Науковиця → науковицею. Feminine -ця and -я become -ею.'],
    ['Науковиця робить досліди і чекає на ___.', 'A scientist does experiments and waits for the result.', ['результат', 'результату', 'результатом'], 0, 'Чекати на + the accusative: на результат.']]],
  halyna: [16, [['План, терміни, наради? Ви працюєте ___!', 'Plans, deadlines, meetings? You work as the boss!', ['начальницею', 'начальниця', 'начальницю'], 0, 'Начальниця → начальницею.'],
    ['Начальниця вже ___ план на літо.', 'The boss has already written the plan for the summer.', ['написала', 'писала', 'пише'], 0, 'Вже + a finished result: the perfective написала.']]],
};
// each of them twice: where the wind left them, and where they belong
function mixedUp(id, name, wrong, right, pal, mods, confused, fixed) {
  const [bit] = JOBS[id];
  const talk = (npc, done) => {
    const n = npc.name;
    if (robota() & bit) return say(n, fixed, done);
    if (!S.f.book || !dnStep()) return say(n, [...confused, ...(S.f.book ? [L('[Something isn\'t right with the people here. Did Yakiv the raftsman, down by the river, will know what has happened.]', '[З людьми тут щось не так. Дід Яків, плотогон біля річки, знає, що сталося.]')] : [])], done);
    say(n, confused, null, menu([L('Tell them who they are', 'Сказати, хто вони'), L('Leave them be', 'Не чіпати')], i => {
      if (i) return done();
      roadQuiz(JOBS[id][1].slice(), 'РОБОТА', q => {
        if (q.stopped || q.score < 2) return say(n, [L('Me? No... I don\'t think so. Are you sure?', 'Я? Ні... Не думаю. Ти певен?')], done);
        S.f.robota = robota() | bit; saveSoon(); sfx('ok');
        say(n, [L('[They blink, as if waking up.]', '[Кліпає, ніби прокидається.]'), ...fixed, L(`[${robotaCount()} of 5 have their jobs back.]`, `[${robotaCount()} з 5 знову мають свою роботу.]`)], done);
      }, ['РОБОТА', 'Хто ким працює?', 'who does what', 'Who are they really?'], 20);
    }));
  };
  return [
    { id: 'dn-' + id + '-w', name, ua: 11, tx: wrong[0], ty: wrong[1], dir: wrong[2], pal, mods, when: () => !(robota() & bit), talk },
    { id: 'dn-' + id, name, ua: 11, tx: right[0], ty: right[1], dir: right[2], pal, mods, when: () => !!(robota() & bit), talk },
  ];
}
function yakivTalk(npc, done) {
  const n = npc.name, d = dnStep();
  const test = () => keeperTalk(20, [L('Work. Jobs, tools, plans, and what has to be done first and what after. Робота, план, спочатку, потім. A raft is just logs until somebody does the work.', 'Робота. Професії, інструменти, плани, і що треба зробити спочатку, а що потім. Робота, план, спочатку, потім. Пліт — це просто колоди, поки хтось не попрацює.')])(npc, done);
  const chat = () => say(n, [L('Плотогон: a raftsman. When I was young I was a бокораш on the Cheremosh, up in the mountains. We tied logs into rafts and rode them down to the Dniester, standing up, singing. Now I take tourists and apples to Bakota. Sitting down.', 'Плотогон. Замолоду я був бокорашем на Черемоші, у горах. Ми в\'язали колоди в плоти і спускалися на них аж до Дністра, стоячи, з піснею. А тепер вожу туристів і яблука до Бакоти. Сидячи.')], done);
  const crew = () => {
    if (d === 0) {
      S.f.dnister = 1; saveSoon();
      return say(n, [L('You\'ve come at a bad time. Look at this village. Look at it.', 'Ти прийшов у поганий час. Подивися на це село. Ти тільки подивися.'),
        L('Two nights ago a black wind came down the canyon, smelling of brooms. In the morning everybody woke up as somebody else. The words for their jobs blew about in the night and came down on the wrong people.', 'Дві ночі тому каньйоном пронісся чорний вітер, пахло мітлами. Зранку всі прокинулися кимось іншим. Слова про їхню роботу вітер поносив уночі й поклав не на тих людей.'),
        L('Myroslava the journalist is waiting tables at the café. Ihor the waiter is in the office reading contracts. Zakhar the lawyer is up to his knees in the river. Khrystyna the scientist is up in the orchard giving orders to the apple trees. And Orysia, our boss, is on the cliff path interviewing a lizard.', 'Журналістка Мирослава розносить страви в кафе. Офіціант Ігор сидить в офісі й читає контракти. Юрист Захар стоїть по коліна в річці. Науковиця Христина в саду наказує яблуням. А Орися, наша начальниця, на стежці над урвищем бере інтерв\'ю в ящірки.'),
        L('To say what somebody does, Ukrainian uses the instrumental: Ким ви працюєте? Я працюю лікарем. Вона працює журналісткою.', 'Щоб сказати, ким людина працює, кажуть в орудному відмінку: Ким ви працюєте? Я працюю лікарем. Вона працює журналісткою.'),
        L('Talk to them. Listen to what they\'re good at, and tell them who they really are. Kindly. Then I\'ll have a crew, and we can float the raft down to Bakota.', 'Поговори з ними. Послухай, що в них виходить, і скажи їм, хто вони насправді. Лагідно. Тоді в мене буде команда, і ми спустимо пліт до Бакоти.')], done);
    }
    if (d === 1 && robotaCount() < 5) return say(n, [L(`${robotaCount()} of 5 have their jobs back. The café, the office, the river, the orchard, the cliff path.`, `${robotaCount()} з 5 знову при своїй роботі. Кафе, офіс, річка, сад, стежка над урвищем.`)], done);
    if (d === 1) {
      S.f.dnister = 2; saveSoon(); sfx('badge');
      return say(n, [L('Everybody where they belong! Orysia\'s already written a plan, Khrystyna wants to measure the river, and Zakhar has made us all sign something.', 'Усі на своїх місцях! Орися вже написала план, Христина хоче виміряти річку, а Захар змусив усіх щось підписати.'),
        L('So: the raft. Brother Iov at the Bakota monastery has been waiting for his apples all week. Step onto the raft when you\'re ready, and we\'ll go.', 'Отже, пліт. Брат Іов у Бакотському монастирі цілий тиждень чекає на свої яблука. Ставай на пліт, коли будеш готовий, і рушаймо.')], done);
    }
    return say(n, [L('The raft goes to Bakota whenever you like. The river always goes the same way, which is the nice thing about rivers.', 'Пліт іде до Бакоти, коли захочеш. Річка завжди тече в один бік, і це в річках найкраще.')], done);
  };
  if (!S.f.book) return chat();
  say(n, [L('Добрий день! What do you need?', 'Добрий день! Чого тобі треба?')], null, menu([L('Your test', 'Ваше випробування'), L('The village', 'Село'), L('Just chatting', 'Просто поговорити')], i => i === 0 ? test() : i === 1 ? crew() : chat()));
}
const atBakota = () => area === 'dniester' && player.tx >= 34;
STORY_LOOK['dniester:z'] = () => {
  if (atBakota()) {
    say('', [L('Did Yakiv\'s raft, tied up under the monastery. Float back up to the village? (Yakiv poles; you hold the apples.)', 'Пліт діда Якова, прив\'язаний під монастирем. Пливти назад до села? (Яків штовхає жердиною, ти тримаєш яблука.)')], null,
      yesNo(go => go && (sfx('door'), warp = { to: { to: 'dniester', tx: 15, ty: 21, dir: 'up' }, fade: 0, dir: 1 })));
    return true;
  }
  if (dnStep() < 2) { say('', [L('A raft of pine logs, loaded with baskets of apples. It needs a crew, and today nobody in the village knows what their job is.', 'Пліт із соснових колод, навантажений кошиками яблук. Йому потрібна команда, а сьогодні ніхто в селі не знає, яка в нього робота.')]); return true; }
  say('', [L('The raft, loaded with apples for Bakota. Float down the river?', 'Пліт, повний яблук для Бакоти. Пливти вниз по річці?')], null, yesNo(go => {
    if (!go) return;
    say('', [L('[Did Yakiv pushes off with his pole. The cliffs slide past, white and enormous, swallows going in and out of holes in the rock. He sings a raftsman\'s song from the Cheremosh, very low, so as not to disturb the river.]', '[Дід Яків відштовхується жердиною. Повз пропливають скелі, білі й величезні, ластівки влітають і вилітають із дірок у камені. Він співає бокораську пісню з Черемошу, дуже тихо, щоб не турбувати річку.]')], () => {
      sfx('door'); warp = { to: { to: 'dniester', tx: 37, ty: 21, dir: 'up' }, fade: 0, dir: 1 };
    });
  }));
  return true;
};
function iovTalk(npc, done) {
  const n = npc.name;
  if (dnStep() >= 3) return say(n, [L('Ring it when you need it. You\'ll know when.', 'Подзвони, коли буде треба. Ти знатимеш коли.')], done);
  if (dnStep() < 2 || !S.f.book) return say(n, [L('Монастир: a monastery. Monks cut these cells out of the rock eight hundred years ago, with chisels, one handful at a time. It\'s quiet. Stay as long as you like.', 'Монастир. Ченці вирубали ці келії в скелі вісімсот років тому, зубилами, по жмені за раз. Тут тихо. Будь скільки хочеш.')], done);
  S.f.dnister = 3; saveSoon(); sfx('night');
  say(n, [L('Apples! Yakiv remembered. And he brought a guest.', 'Яблука! Яків не забув. І привіз гостя.'),
    L('Sit. You see the water down there, so wide and still? Under it is the old village of Bakota. Houses, gardens, a church. In 1981 they built a dam downriver, and the water came up and covered it all. The people moved away. The church bell went under with the church.', 'Сідай. Бачиш он там воду, таку широку й тиху? Під нею старе село Бакота. Хати, садки, церква. У 1981 році внизу по річці збудували греблю, і вода піднялася й укрила все. Люди виїхали. Дзвін пішов під воду разом із церквою.'),
    L('On quiet nights you can still hear it ringing under the river. And sometimes the river gives a little of it back. I found this on the shore last spring.', 'Тихими ночами ще й досі чути, як він дзвонить під водою. А іноді річка дещо з нього повертає. Оцей я знайшов на березі минулої весни.'),
    give('dzvinok'),
    L('Whoever hears it remembers something they had forgotten. A name, a song, a word. I think you\'ll need that, where you\'re going.', 'Хто його почує, той згадає щось забуте. Ім\'я, пісню, слово. Думаю, тобі це знадобиться там, куди ти йдеш.'),
    L('The black wind that went through the village went on west. Towards Lviv, where the wires are.', 'Чорний вітер, що пройшов через село, подався далі на захід. До Львова, де дроти.')], done);
}

// ─── The people ───────────────────────────────────────────────────────────
const P_PODILLIA = (shirt, skirt) => ({ h: '#5a3a22', H: '#3a2414', w: '#f4efe2', W: '#d6cdb8', r: shirt, x: '#c8383a', p: skirt, P: shade(skirt), b: '#3a2a22' });
Object.assign(NPCS, {
  kamianets: [
    { id: 'bohdan', name: 'Pan Bohdan the castle keeper', ua: 11, tx: 8, ty: 15, dir: 'left', pal: Object.assign(P_CITY('#5a6a4a', '#3a3046'), { h: '#d8d4cc', H: '#a9a49b' }), mods: ['moustache', 'hat'], talk: bohdanTalk },
    { id: 'ruzha', name: 'Ruzha the flower seller', ua: 11, tx: 22, ty: 19, dir: 'down', pal: P_PODILLIA('#c8383a', '#3f6fc4'), mods: ['skirt', 'dots'],
      talk: colourHelper('ruzha', [L('My flowers! I know they\'re beautiful. People still buy them. But nobody can say what they are any more. "A grey one, please. No, the other grey one."', 'Мої квіти! Я знаю, що вони гарні. Люди ще купують. Але ніхто вже не може сказати, які вони. «Дайте сіру. Ні, іншу сіру».'),
        L('You know the words? Then help me, quick, before I sell a funeral bunch for a wedding.', 'Ти знаєш слова? То допоможи, швидко, поки я не продала похоронний букет на весілля.')],
        [L('Ружа: that\'s my name. An old word for a rose. My mother had a sense of humour. Buy a red one for somebody.', 'Ружа: це моє ім\'я. Старе слово, означає троянда. Мама мала почуття гумору. Купи комусь червону.')],
        [L('Flowers! Квіти! Grey ones, today. All of them grey. I don\'t know what\'s happened to them.', 'Квіти! Сірі, сьогодні. Усі сірі. Не знаю, що з ними сталося.')]) },
    { id: 'marian', name: 'Marian the painter', ua: 11, tx: 4, ty: 18, dir: 'up', pal: P_CITY('#7a5a8a', '#3a3046'), mods: ['hat', 'glasses'],
      talk: colourHelper('marian', [L('I\'ve painted this castle every summer for thirty years. This morning I squeezed out my paints and... they all look the same. I\'ve forgotten what it\'s LIKE.', 'Я малюю цей замок щоліта тридцять років. Сьогодні зранку видавив фарби і... вони всі однакові. Я забув, ЯКИЙ він.'),
        L('Describe it for me? Big, small, round, square: the shapes first. If I can say the shapes, I\'ll find the colours.', 'Опиши його мені? Великий, малий, круглий, квадратний: спочатку форми. Якщо я назву форми, то знайду й кольори.')],
        [L('Red roofs, white walls, a green river. I can see it all again. This one is going to be my best painting. They always are.', 'Червоні дахи, білі мури, зелена річка. Я знову все бачу. Ця картина буде моя найкраща. Вони завжди такі.')],
        [L('Художник: a painter. I\'m painting the castle. In grey. It\'s very... modern.', 'Я художник. Малюю замок. Сірим. Дуже... сучасно.')]) },
    { id: 'tetianka', name: 'Tetianka', ua: 11, tx: 16, ty: 29, dir: 'down', pal: P_PODILLIA('#e9b949', '#c8383a'), mods: ['skirt', 'vinok'],
      talk: colourHelper('olia', [L('It\'s the balloon festival! But the pilots won\'t go up. They say they can\'t tell which balloon is whose, because they\'re all grey. That\'s silly. Mine was the best one.', 'Сьогодні фестиваль куль! А пілоти не хочуть летіти. Кажуть, не розберуть, чия куля чия, бо всі сірі. Це дурниця. Моя була найкраща.'),
        L('Help me tell them? I can\'t remember any of the words. I just remember it was beautiful.', 'Допоможеш їм пояснити? Я не пам\'ятаю жодного слова. Пам\'ятаю тільки, що було гарно.')],
        [L('They can see them now! When the flag goes up, they\'ll launch. Pan Bohdan promised.', 'Тепер вони їх бачать! Коли піднімуть прапор, полетять. Пан Богдан обіцяв.')],
        [L('Повітряна куля: a hot-air balloon. I want to go in one when I\'m big. Bigger. Bigger than this.', 'Повітряна куля. Я хочу полетіти, коли виросту. Більшою. Більшою, ніж зараз.')]) },
    { id: 'roman', name: 'Pan Roman the driver', ua: 11, tx: 37, ty: 14, dir: 'down', pal: P_CITY('#3f6fc4', '#3a3046'), mods: ['hat', 'moustache'], talk: romanTalk },
    { id: 'stakh', name: 'Did Stakh', ua: 11, tx: 30, ty: 12, dir: 'down', pal: Object.assign(P_PODILLIA('#f4efe2', '#5a5a4a'), { h: '#d8d4cc', H: '#a9a49b' }), mods: ['moustache'],
      talk: [[L('That minaret? The Turks built it, when they held the town. When they left, we didn\'t pull it down. We put the Mother of God on top instead. That\'s Kamianets for you: nobody throws anything away.', 'Той мінарет? Його збудували турки, коли тримали місто. Коли вони пішли, ми його не розібрали. Поставили натомість на верх Богородицю. Отакий він, Кам\'янець: тут нічого не викидають.')],
        [L('Kamianets means "the stone one". Кам\'яний: made of stone. The town is on a rock, the castle is on a rock, and my wife says my head is made of rock. Everything fits.', 'Кам\'янець — від «камінь». Кам\'яний. Місто на скелі, замок на скелі, а дружина каже, що в мене й голова кам\'яна. Усе сходиться.')]] },
    ...[[8, 29, 0], [21, 29, 1], [33, 29, 2], [38, 30, 3]].map(([tx, ty, k]) => ({ id: 'balloon' + k, kind: 'balloon', tx, ty, look: k, up: () => kamStep() >= 2,
      talk: (n, done) => say('', [kamStep() >= 2 ? L('The balloon hangs high over the canyon on its rope, its burner roaring now and then like a sleepy dragon. Somebody up there waves.', 'Куля висить високо над каньйоном на мотузці, і пальник час від часу гуде, як сонний дракон. Хтось нагорі махає рукою.')
        : L('A hot-air balloon, laid out on the grass and half filled, grey as a cloud. The pilot is sitting in the basket with his head in his hands.', 'Повітряна куля, розкладена на траві й наполовину надута, сіра, як хмара. Пілот сидить у кошику, обхопивши голову руками.')], done) })),
  ],
  castle: [{ id: 'lesia', name: 'Lesia the guide', ua: 11, tx: 9, ty: 4, dir: 'down', pal: P_CITY('#c8383a', '#3a3046'), mods: ['skirt'],
    talk: [[L('This is the castle yard. Over there is the Papal tower, where they kept Ustym Karmaliuk, the Robin Hood of Podillia. He took from the rich and gave to the poor, and escaped from prison four times.', 'Це замкове подвір\'я. Он там Папська вежа, де тримали Устима Кармалюка, подільського Робіна Гуда. Він брав у багатих і віддавав бідним і чотири рази тікав із в\'язниці.'),
      L('The well over there is forty metres deep. If you drop a coin in, you have to come back to Kamianets. Most people drop two, to be sure.', 'Криниця он там сорок метрів завглибшки. Якщо кинеш туди монету, мусиш повернутися до Кам\'янця. Більшість кидає дві, про всяк випадок.')]] }],
  dniester: [
    { id: 'yakiv', name: 'Did Yakiv the raftsman', ua: 11, tx: 13, ty: 21, dir: 'right', pal: Object.assign(P_PODILLIA('#3f6fc4', '#5a5a4a'), { h: '#d8d4cc', H: '#a9a49b' }), mods: ['hat', 'moustache'], talk: yakivTalk },
    ...mixedUp('oksana', 'Myroslava', [14, 20, 'down'], [20, 15, 'left'], P_CITY('#e8794a', '#3a3046'), ['skirt', 'glasses'],
      [L('Борщ! Who ordered borshch? Nobody? Then tell me, how do you FEEL about borshch? When did you first eat it? I have so many questions about this soup. I want to write them all down and tell the whole country.', 'Борщ! Хто замовляв борщ? Ніхто? Тоді скажи, що ти ВІДЧУВАЄШ до борщу? Коли ти вперше його скуштував? У мене стільки питань про цей суп. Хочу все записати й розповісти всій країні.')],
      [L('Of course! Журналістка. I write for the Podillia newspaper. And there\'s a story here: «Village Wakes Up Wrong». Can I quote you?', 'Ну звісно! Журналістка. Я пишу для подільської газети. І тут є історія: «Село прокинулося не тим». Можна тебе процитувати?')]),
    ...mixedUp('petro', 'Ihor', [26, 19, 'down'], [16, 20, 'up'], P_CITY('#f4efe2', '#2b2230'), ['moustache'],
      [L('Paragraph four, clause two... the contract would like some bread with that? A little salt? Can I bring the contract a glass of water? It looks so dry. I just want everyone to be fed. Even the papers.', 'Пункт четвертий, підпункт другий... контрактові принести до цього хліба? Трохи солі? Можна принести контрактові склянку води? Він такий сухий. Я просто хочу, щоб усі були нагодовані. Навіть папери.')],
      [L('Офіціант! That\'s me. Table for one? The borshch is today\'s, the varenyky are yesterday\'s, and the view is free.', 'Офіціант! Це я. Столик на одного? Борщ сьогоднішній, вареники вчорашні, а краєвид безкоштовно.')]),
    ...mixedUp('stepan', 'Zakhar', [28, 21, 'down'], [24, 19, 'down'], P_CITY('#2b2230', '#2b2230'), ['glasses'],
      [L('I\'m doing science. Measuring the Dniester. Result: wet. Every time. But it doesn\'t feel official. I want it written down, signed, stamped, and witnessed by two people and a notary.', 'Я займаюся наукою. Міряю Дністер. Результат: мокрий. Щоразу. Але це якось неофіційно. Хочу, щоб це записали, підписали, поставили печатку й засвідчили двоє людей і нотаріус.')],
      [L('Юрист. A lawyer. Of course. Now, about this wind: who signed for it? Nobody? Then it\'s illegal, and I\'ll be writing to someone.', 'Юрист. Звісно. Отже, щодо цього вітру: хто за нього розписався? Ніхто? Тоді він незаконний, і я комусь напишу.')]),
    ...mixedUp('iryna', 'Khrystyna', [9, 8, 'down'], [29, 20, 'left'], P_CITY('#4c9c66', '#3a3046'), ['skirt'],
      [L('You! Apple tree! Grow faster! I want results by Friday! ...Although. Why is this one bigger than that one? The soil? The sun? I\'d love to measure them both. I could do an experiment...', 'Ти! Яблуне! Рости швидше! Результати до п\'ятниці! ...Хоча. Чому ця більша за ту? Ґрунт? Сонце? Я б залюбки виміряла обидві. Могла б провести дослід...')],
      [L('Науковиця! I work for the national park: Подільські Товтри. I study the river and the cliffs. The rock here was a coral reef once, in a warm sea. Wonderful, isn\'t it? I think everything is wonderful.', 'Науковиця! Я працюю в національному парку «Подільські Товтри». Вивчаю річку і скелі. Тутешній камінь колись був кораловим рифом у теплому морі. Чудово, правда? Мені все здається чудовим.')]),
    ...mixedUp('halyna', 'Orysia', [21, 9, 'left'], [27, 17, 'down'], P_PODILLIA('#7a3e8a', '#2b2230'), ['skirt', 'glasses'],
      [L('Interviewing this lizard. It won\'t answer a single question. It just looks at me. In my old job, which I don\'t remember, I\'d have given it a plan and a deadline, and it would have answered by Monday.', 'Беру інтерв\'ю в цієї ящірки. Не відповідає на жодне питання. Тільки дивиться. На старій роботі, якої я не пам\'ятаю, я б дала їй план і термін, і до понеділка вона б відповіла.')],
      [L('Начальниця. The boss of the Bakota cooperative. Thank you. Now, everybody: meeting, five minutes, by the raft. Bring a pen.', 'Начальниця. Голова бакотського кооперативу. Дякую. Отже, всі: нарада, за п\'ять хвилин, біля плоту. З ручками.')]),
    { id: 'lizard', kind: 'lizard', name: 'The lizard', tx: 20, ty: 9, dir: 'left', when: () => !(robota() & 16),
      talk: (n, done) => say('', [S.f.fern ? L('Ящірка: a lizard. That\'s me. I\'m not answering any more questions. Speak to my lawyer. Oh. He\'s in the river.', 'Ящірка. Це я. Більше ні на які питання не відповідаю. Говоріть із моїм юристом. Ой. Він у річці.')
        : L('A green lizard on a warm stone. It has clearly been asked too many questions today.', 'Зелена ящірка на теплому камені. Видно, що сьогодні їй поставили забагато питань.')], done) },
  ],
  bakota: [{ id: 'iov', name: 'Brother Iov', ua: 11, tx: 15, ty: 5, dir: 'left', pal: P_MONK, mods: ['moustache'], talk: iovTalk }],
  fair: (NPCS.fair || []).concat([{ id: 'yosyp', name: 'Yosyp the carter', ua: 5, tx: 4, ty: 17, dir: 'down', pal: P_PODILLIA('#c8a060', '#5a4a3a'), mods: ['hat', 'moustache'],
    talk: (npc, done) => say(npc.name, badgeCount() >= PODILLIA_NEED
      ? [L('West to Podillia? The road\'s that way. Kamianets is on a rock, in a river, behind a bridge. You can\'t miss it. People do, but you can\'t.', 'На захід, на Поділля? Дорога он туди. Кам\'янець на скелі, у річці, за мостом. Не проминеш. Люди проминають, а ти не проминеш.')]
      : [L('I\'m from Podillia. We have apples, castles, a canyon and the best cherries in Ukraine. Don\'t tell anyone in Vyshneve I said that.', 'Я з Поділля. У нас яблука, замки, каньйон і найкращі вишні в Україні. Тільки не кажи у Вишневому, що я так сказав.')], done) }]),
});
// the river road down from Verkhovyna: a Hutsul raftsman, a бокораш, says where it goes
NPCS.verkhovyna.push({ id: 'bokorash', name: 'Lesyk the bokorash', ua: 9, tx: 9, ty: 29, dir: 'left', pal: P_HUTSUL('#4c9c66', '#3a3046'), mods: ['hat'],
  talk: [[L('Бокораш: a raftsman. We tie logs together and ride them down the Cheremosh, out of the mountains. This road goes the same way, only drier. Down to the Dniester, to Podillia.', 'Бокораш. Ми зв\'язуємо колоди й спускаємося на них Черемошем, із гір. Ця дорога йде туди ж, тільки сухіша. Униз, до Дністра, на Поділля.'), ...hu('леґінь')]] });

// what to do next, in Podillia: added to the "What now?" page
function podilliaText() {
  const f = S.f, been = id => !!(S.been && S.been[id]), out = [];
  if (badgeCount() >= PODILLIA_NEED && !been('kamianets')) out.push('The fair\'s west road is open now: Podillia.');
  if (kamStep() === 1) out.push(farbyCount() < 3 ? `Give Kamianets its colour words back: Ruzha on the square, Marian by the castle bridge, Tetianka at the balloon field (${farbyCount()} of 3).` : 'Tell Pan Bohdan at the castle gate that the colours are coming back.');
  if (dnStep() === 1) out.push(robotaCount() < 5 ? `Tell the people of Bakota who they really are (${robotaCount()} of 5).` : 'Tell Did Yakiv the raftsman his crew is back.');
  if (dnStep() === 2) out.push('Float Did Yakiv\'s raft down the Dniester to the Bakota monastery.');
  return out.length ? ' ' + out.join(' ') : '';
}
