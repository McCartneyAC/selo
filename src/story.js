// ─── People and what they say ─────────────────────────────────────────────
// Every line is a pair: [English, Ukrainian]. Each person starts speaking
// Ukrainian as your pysanky grow, later for those with a higher `ua` (see uaAt; press T to flip any line).
const P_HANNA = { h: C.red, H: C.red2, w: '#efe8d8', W: '#c9c0ae', r: '#2d4f91', x: '#3a6a3a', p: '#4a3656', b: '#3a2a22' };
const yesNo = (pick) => ({ options: [L('Yes', 'Так'), L('Not now', 'Не зараз')], pick: i => pick(i === 0) });

// A keeper tests you on their area's words; eight of ten wins their pysanka.
function keeperTalk(zone, lines) {
  return (npc, done) => {
    const name = npc.name, b = BADGES[zone], have = zoneCaught(zone), where = AREAS[ZONE_AREA[zone]];
    if (!S.f.book) return say(name, lines, done);
    if (have < TRIAL_NEED) return say(name, [...lines, L(`When you know ${TRIAL_NEED} words from ${where.name}, come back and I'll test you. You know ${have} so far.`,
      `Коли знатимеш ${TRIAL_NEED} слів звідси, з місця ${where.ua}, приходь, і я тебе перевірю. Поки що ти знаєш ${have}.`)], done);
    const intro = S.f['b' + zone] ? [L(`You already have my ${b.name}. Want to be tested again anyway? Good for the memory.`, 'Ти вже маєш мою писанку. Хочеш, перевірю ще раз? Це корисно для пам\'яті.')]
      : [L(`You know ${have} words from ${where.name}. Let's see if they stuck.`, `Ти знаєш ${have} слів. Подивимось, чи вони запам\'яталися.`),
        L('Ten words. Get eight right and my pysanka is yours.', 'Десять слів. Вісім правильних, і моя писанка твоя.')];
    say(name, intro, null, yesNo(go => {
      if (!go) { say(name, [L('Whenever you\'re ready.', 'Коли будеш готовий.')], done); return; }
      startTrial(zone, 10, q => {
        if (q.stopped) { say(name, [L('Stopping already? Come back when you\'re ready.', 'Вже зупиняєшся? Приходь, коли будеш готовий.')], done); return; }
        if (q.score >= 8) {
          const first = !S.f['b' + zone];
          S.f['b' + zone] = 1; sfx('badge'); renderHud(); saveSoon();
          say(name, [L(`${q.score} out of 10!`, `${q.score} з 10!`),
            first ? L(`Take this: the ${b.name}. [You received the ${b.name}!]`, `Візьми: це моя писанка. [Ти отримав писанку: ${b.name}!]`) : L('Still sharp. Good.', 'Пам\'ять гостра. Добре.'),
            ...(first && badgeCount() === NZ ? [L(`That's all ${NZ}. Now go into the old forest and find Baba Yaga. She'll want to see what you know.`, `Це всі ${NZ}. Тепер іди в старий ліс і знайди Бабу Ягу. Вона захоче побачити, що ти знаєш.`)] : [])], done);
        } else say(name, [L(`${q.score} out of 10. Not yet.`, `${q.score} з 10. Ще ні.`), L('Catch some more, practise with Ostap, and try me again.', 'Злови ще слів, повправляйся з Остапом і приходь знову.')], done);
      });
    }));
  };
}

function ostapTalk(npc, done) {
  const name = npc.name;
  if (!S.f.book) {
    return say(name, [
      L(`Ah, ${myName()}, there you are. Sit, sit. Listen.`, `А, ${myVoc()}, ось ти де. Сідай, сідай. Слухай.`),
      L('Words are like swallows. Leave them alone too long and they fly south.', 'Слова як ластівки. Залишиш їх надовго, і вони полетять на південь.'),
      L('A thousand Ukrainian words are loose in this country. The easy ones live in the grass round Vyshneve. Harder ones in the wheat of the steppe and the reeds at Kalynivka. The hardest live in the old forest, where Mavka walks and Baba Yaga keeps her hut.',
        'Тисяча українських слів розбіглася по цьому краю. Легкі живуть у траві біля Вишневого. Важчі в пшениці в степу та в очереті в Калинівці. А найважчі в старому лісі, де ходить Мавка і де стоїть хатинка Баби Яги.'),
      L('Take this. A словник: a dictionary. Every word you catch, it remembers. Every word you start to forget, it tells you about.', 'Візьми. Це словник. Він пам\'ятає кожне слово, яке ти зловиш. І нагадує про кожне, яке ти починаєш забувати.'),
      L('[You received the СЛОВНИК! Press C to open it.]', '[Ти отримав СЛОВНИК! Натисни C, щоб його відкрити.]'),
      L('Now, there\'s one sitting right here on the bench. Look. Catch it!', 'Он одне сидить просто тут, на лавці. Дивись. Лови його!'),
    ], () => {
      S.f.book = 1; renderHud(); saveSoon(); sfx('badge');
      openQuiz({ mode: 'wild', ids: [WORDS.findIndex(w => w[0] === 'слово')], done: () => {
        say(name, [
          caughtCount() ? L('Good! Сло́во means "word". Only 999 to go.', 'Добре! «Слово» означає word. Залишилось лише 999.') : L('It got away. Never mind, it\'ll be back. They always come back.', 'Утекло. Нічого, воно повернеться. Вони завжди повертаються.'),
          L('Words you catch will get rusty. When they do, they\'ll turn up again in the grass, or come and practise with me.', 'Слова, які ти зловиш, з часом іржавіють. Тоді вони знову з\'являться в траві. Або приходь до мене повправлятися.'),
          L('Every place keeps forty words, and a keeper who will test you once you know thirty of them. Nine places are around Vyshneve. Sixteen more are out across Ukraine, from the Sich to the Carpathians to the sea. Baba Hanna, here at the well, is the first keeper.',
            'Кожне місце береже сорок слів, і там є хранитель, який перевірить тебе, коли знатимеш тридцять із них. Дев\'ять місць довкола Вишневого. Ще шістнадцять — по всій Україні, від Січі до Карпат і до моря. Баба Ганна тут біля криниці — перша.'),
          L('Win every pysanka, and then... well. Then Baba Yaga will want a word with you. Some say she\'s the reason the words ran off in the first place.', 'Здобудеш усі писанки, і тоді... Тоді з тобою захоче поговорити Баба Яга. Кажуть, це через неї слова й розбіглися.'),
          L('Oh, and Kupala night is coming. Oksana by the river will tell you all about it. She tells everybody.', 'А ще наближається ніч на Івана Купала. Оксана біля річки тобі все розкаже. Вона всім розказує.'),
          L('North through the meadow is the forest, south down the road is the steppe, west is the khutir, and over the bridge to the east is Kalynivka. Beyond them, the country goes on. Go on.', 'На північ через луг — ліс, на південь дорогою — степ, на захід — хутір, а через міст на схід — Калинівка. А за ними край тягнеться далі. Іди.'),
        ], done);
      } });
    });
  }
  const due = dueList().length, c = caughtCount();
  if (c >= 60 && !S.f.ostapYaga) {
    S.f.ostapYaga = 1; saveSoon();
    return say(name, [L('Sit a moment. Do you know what the children used to beg me for, when I played in the villages? Not the dumas. The tale of Baba Yaga. Every time.', 'Посидь хвилинку. Знаєш, що в мене колись діти випрошували, коли я грав по селах? Не думи. Казку про Бабу Ягу. Щоразу.'),
      L('Nobody has asked for it in twenty years. I\'ve nearly forgotten how it goes. ...And now she\'s the one sweeping up the words. I\'ve been wondering whether those two things know each other.', 'Двадцять років ніхто не просив. Я вже й забувати став, як вона йде. ...А тепер це вона вимітає слова. Я все думаю, чи не знайомі ці дві речі між собою.')], done);
  }
  const report = c >= N ? L('All thousand. I\'m writing a duma about you, you know.', 'Усі тисяча. Я пишу про тебе думу, щоб ти знав.') :
    c >= 500 ? L(`${c} words! The village talks of nothing else.`, `${c} слів! Усе село тільки про це й говорить.`) :
    c >= 100 ? L(`${c} words caught, ${masteredCount()} mastered. Now you're getting somewhere.`, `${c} слів спіймано, ${masteredCount()} вивчено назавжди. Ось тепер справа йде.`) :
    L(`${c} words caught. A good start. Keep going.`, `${c} слів спіймано. Добрий початок. Продовжуй.`);
  if (!due) return say(name, [report, L('Nothing needs practice right now.' + (nextDueText() ? ` The next word gets rusty in ${nextDueText()}.` : ''), 'Зараз нічого не треба повторювати.'),
    L('Go and catch some more.', 'Іди злови ще.')], done);
  say(name, [report, L(`${due} ${due === 1 ? 'word is' : 'words are'} getting rusty. Shall we practise?`, `Кілька слів (${due}) почали іржавіти. Повправляємось?`)], null, yesNo(go => {
    if (!go) return say(name, [L('They\'ll wait. Not forever, though.', 'Вони почекають. Але не вічно.')], done);
    startLesson(q => say(name, [q.stopped ? L('We\'ll pick it up later.', 'Продовжимо пізніше.')
      : L(`${q.score} of ${q.ids.length}. ${q.score === q.ids.length ? 'Perfect!' : 'The ones you missed will come round again soon.'}`, `${q.score} з ${q.ids.length}. ${q.score === q.ids.length ? 'Чудово!' : 'Ті, що ти пропустив, скоро повернуться.'}`)], done));
  }));
}

function yagaTalk(npc, done) {
  const name = npc.name;
  if (S.f.yaga) return say(name, [L('You again? Go home and say your words. Loudly, every day. I\'m listening for quiet houses.', 'Знову ти? Іди додому і кажи свої слова. Голосно, щодня. Я прислухаюся до тихих хат.')], done);
  if (badgeCount() < NZ) return say(name, [
    L('Fu-fu-fu! I smell a human. A small one, with a book.', 'Фу-фу-фу! Людським духом пахне. Маленьким, з книжкою.'),
    L('So you\'re the one catching my words. Do you know how long it took to sweep them out of all those quiet houses?', 'То це ти ловиш мої слова? Знаєш, скільки часу я вимітала їх із тих тихих хат?'),
    ...((S.f.duma || 0) >= 3 ? [L('And keep that dead kozak out of my business. Talking to the dead! Whatever next.', 'І скажи тому мертвому козакові не пхати носа в мої справи. З мертвими розмовляє! Що далі?')] : []),
    L(`Come back when you have all ${NZ} pysanky, if you dare. You have ${badgeCount()}.`, `Приходь, коли матимеш усі ${NZ} писанок, якщо наважишся. У тебе ${badgeCount()}.`),
    L('Until then, shoo. The hut doesn\'t like visitors.', 'А поки що киш звідси. Хатинка не любить гостей.')], done);
  say(name, [L(`${NZ} pysanky. So it's true what the magpies say.`, `${NZ} писанок. Отже, сороки правду кажуть.`),
    L('A word nobody says is nobody\'s word. So I took them. They burn so warm in the pich, little dove, and the hut grows bigger on every one.', 'Слово, якого ніхто не каже, нічиє. Тож я їх забрала. Вони так тепло горять у печі, голубчику, а хатинка росте від кожного.'),
    L('When the last word is forgotten, the hut will walk over the whole country, and it will be quiet. Lovely and quiet.', 'Коли забудуть останнє слово, хатинка піде через увесь край, і стане тихо. Гарно й тихо.'),
    L('Fifteen words. Get thirteen right and the words in my stove go free. Get fewer and... well, the stove is already lit.', 'П\'ятнадцять слів. Тринадцять правильних, і слова з моєї печі вільні. Менше... ну, піч уже розпалена.')], null, yesNo(go => {
    if (!go) return say(name, [L('Scared? Clever. Come back when you\'re ready.', 'Боїшся? Розумно. Приходь, коли будеш готовий.')], done);
    startTrial(null, 15, q => {
      if (q.stopped || q.score < 13) return say(name, [q.stopped ? L('Running away? Wise.', 'Тікаєш? Мудро.') : L(`${q.score} out of 15. Not enough!`, `${q.score} з 15. Замало!`),
        L('Go home, practise, come back. I\'ll keep the stove warm.', 'Іди додому, вчися, повертайся. Я тримаю піч теплою.')], done);
      S.f.yaga = 1; sfx('badge'); saveSoon();
      say(name, [L(`${q.score} out of 15. No. NO!`, `${q.score} з 15. Ні. НІ!`),
        L('The stove door bangs open. Words pour out of the chimney like sparks, thousands of them, and fly off over the trees towards the villages.', 'Дверцята печі розчахуються. Слова вилітають із комина, як іскри, тисячі їх, і летять над лісом до сіл.'),
        L('You really did learn them. In my day the heroes just hit things. This is much worse.', 'Ти справді їх вивчив. За моїх часів богатирі просто все били. А це набагато гірше.'),
        L('Go on, then. Tell that old kobzar he can write his duma. But say your words, every day. The moment a house goes quiet, I\'ll be back with my broom.', 'Іди вже. Скажи тому старому кобзареві, що він може писати свою думу. Але кажи свої слова щодня. Щойно якась хата затихне, я повернуся з мітлою.'),
        L('[Baba Yaga gave you a crust of rye bread and a jar of something purple. You have finished the trials. Keep catching: there are still words out there.]',
          '[Баба Яга дала тобі шматок житнього хліба і баночку чогось фіолетового. Ти пройшов усі випробування. Лови далі: там ще є слова.]')], done);
    });
  }));
}

const P_OKSANA = { h: '#7a4a22', H: '#563216', w: '#fbf8f0', r: C.red, x: C.red, p: '#b8323a', P: '#8f2430', b: '#3a2a22' };
const P_RUSALKA = { h: '#5aa07a', H: '#3d7a5a', w: '#eef4f0', W: '#cfdcd4', r: '#9cc4a0', x: '#9cc4a0', p: '#eef4f0', P: '#cfdcd4', b: '#cfdcd4', s: '#e4ecec', S: '#c4d0d0' };
const P_HALYNA = { h: '#4c9c66', H: '#2f6b45', w: '#fbf8f0', r: C.red, x: '#2f6b45', p: '#3a4f7a', b: '#3a2a22' };
const P_OLENA = { h: '#e8794a', H: '#b0472e', w: '#fbf8f0', r: C.red, x: '#3a6a3a', p: '#7a3e8a', P: '#4f2459', b: '#3a2a22' };

const NPCS = {
  vyshneve: [
    { id: 'hanna', name: 'Baba Hanna', ua: 5, tx: 13, ty: 14, dir: 'right', pal: P_HANNA, mods: ['skirt', 'dots'], talk: hannaTalk },
    { id: 'mykola', name: 'Did Mykola', ua: 5, tx: 8, ty: 13, dir: 'down',
      pal: { h: '#d8d4cc', H: '#a9a49b', w: '#efe8d8', p: '#5a4a3a', P: '#433628', b: '#3a2a22', x: C.red }, mods: ['hat', 'moustache'],
      talk: [
        [L('See the stork across the river? Лелека. Every spring she comes back to that pole.', 'Бачиш лелеку за річкою? Щовесни вона повертається на той стовп.'),
          L('A house the leleka chooses doesn\'t burn. That isn\'t superstition. That\'s forty years of watching.', 'Хата, яку обрала лелека, не горить. Це не забобон. Це сорок років спостережень.')],
        [L('Добрий день! Good day! That one you should know already.', 'Добрий день! Це ти вже маєш знати.')]] },
    { id: 'oksana', name: 'Oksana', ua: 3, tx: 30, ty: 7, dir: 'down', wander: 2, day: true, pal: P_OKSANA, mods: ['skirt', 'vinok'], talk: oksanaTalk },
    { id: 'fire', kind: 'fire', tx: 37, ty: 15, night: true, talk: (n, done) => say('', [L('The Kupala fire. Sparks go up to join the stars. People take turns jumping over it, for luck.', 'Купальське вогнище. Іскри летять до зірок. Люди по черзі стрибають через вогонь на щастя.')], done) },
    { id: 'oksana-n', name: 'Oksana', ua: 3, tx: 36, ty: 14, dir: 'right', night: true, pal: P_OKSANA, mods: ['skirt', 'vinok'], talk: oksanaTalk },
    { id: 'petryk-n', name: 'Petryk', ua: 1, tx: 38, ty: 14, dir: 'left', night: true, pal: { h: '#e8c46a', H: '#c49a3e', w: '#fbf8f0', p: '#6a6a3a', b: '#7a3b22' },
      talk: [[L('I jumped over the fire three times! My eyebrows are fine. Mostly.', 'Я тричі перестрибнув через вогонь! Брови цілі. Майже.')],
        [L('Go to the forest! Go! I\'d come too but Mama said no.', 'Іди в ліс! Іди! Я б теж пішов, але мама не пускає.')]] },
    { id: 'rusalka1', name: 'A rusalka', ua: 5, tx: 30, ty: 22, dir: 'right', night: true, ghost: true, pal: P_RUSALKA, mods: ['skirt'],
      talk: [[L('Come and swim with us... the water is warm on Kupala night...', 'Ходи до нас плавати... на Купала вода тепла...'),
        L('...No? Then tell us: what is the word for water? We forget, down there.', '...Ні? Тоді скажи нам: як буде water? Ми там, на дні, забуваємо.'),
        L('Вода. Yes. Вода...', 'Вода. Так. Вода...')]] },
    { id: 'rusalka2', name: 'A rusalka', ua: 5, tx: 29, ty: 20, dir: 'right', night: true, ghost: true, pal: P_RUSALKA, mods: ['skirt'],
      talk: [[L('Hee hee. We only tickle people who don\'t know any words.', 'Хі-хі. Ми лоскочемо тільки тих, хто не знає жодного слова.'), L('You know some words. Lucky.', 'А ти знаєш слова. Пощастило.')]] },
    { id: 'petryk', name: 'Petryk', ua: 1, tx: 12, ty: 16, dir: 'left', wander: 3, pal: { h: '#e8c46a', H: '#c49a3e', w: '#fbf8f0', p: '#6a6a3a', b: '#7a3b22' },
      talk: [
        [L('Race you to the bridge! ...You have to actually run, you know. Hold X.', 'Наввипередки до мосту! ...Треба бігти по-справжньому. Тримай X.')],
        [L('My cousin says a mavka lives in the forest.', 'Мій двоюрідний брат каже, що в лісі живе мавка.'), L('From the front she\'s the prettiest girl you ever saw. From behind she\'s a hollow tree. Brrr.', 'Спереду вона найгарніша дівчина на світі. А ззаду порожнє дерево. Бррр.')],
        [L('I caught "кіт" yesterday. It means cat. I\'m going to catch "собака" next. Dog!', 'Я вчора зловив слово «кіт». Наступне буде «собака»!')]] },
    { id: 'ostap', name: 'Ostap the kobzar', ua: 7, tx: 16, ty: 8, dir: 'down',
      pal: { h: '#d8d4cc', H: '#a9a49b', w: '#5a4a6a', W: '#433656', r: C.gold, x: C.gold2, p: '#3a3046', b: '#2b2230' }, mods: ['moustache'], talk: ostapTalk },
    { id: 'halyna', name: 'Halyna', ua: 3, tx: 26, ty: 12, dir: 'right', pal: P_HALYNA, mods: ['skirt', 'dots'],
      talk: [[L('Beets, cabbage, garlic, dill. A garden is a pantry you have to argue with. Город: a vegetable garden.', 'Буряк, капуста, часник, кріп. Город — це комора, з якою треба сперечатися.'),
        L('Leave a crust of bread behind the stove tonight. The domovyk gets moody when the house is busy.', 'Залиш сьогодні вночі шматочок хліба за піччю. Домовик сердиться, коли в хаті метушня.')]] },
    { id: 'taras', name: 'Taras', ua: 3, tx: 30, ty: 15, dir: 'right',
      pal: { h: '#3a2a22', H: '#241812', w: '#e8e2d2', r: '#2d4f91', x: '#2d4f91', p: '#4a4a5a', b: '#3a2a22' }, mods: ['hat'],
      talk: (npc, done) => S.f.q1 && !S.f.kupala && !has('wreath')
        ? say(npc.name, [L('Oksana\'s wreath? It snagged on my line, and then the current took it. Sorry.', 'Оксанин вінок? Він зачепився за мою вудку, а потім його забрала течія. Вибач.'),
          L('Everything the river takes ends up with the vodyanyk, in the Kalynivka pond. He\'s a grump. Be polite.', 'Усе, що забирає річка, потрапляє до водяника в калинівському ставку. Він буркотун. Будь ввічливий.')], done)
        : say(npc.name, [L('Shh. The риба is thinking. The fish.', 'Тсс. Риба думає.'),
          L('When the vodyanyk takes your hook, you say thank you and tie on another. You don\'t argue with the owner of the river.', 'Коли водяник забирає гачок, кажеш «дякую» і прив\'язуєш інший. З господарем річки не сперечаються.')], done) },
  ],
  forest: [
    { id: 'mavka', name: 'Mavka', ua: 7, tx: 11, ty: 12, dir: 'right',
      pal: { h: '#5aa05a', H: '#3d7a44', w: '#f4f1e6', W: '#cfd8c4', r: '#5aa05a', x: '#3d7a44', p: '#e8efe0', P: '#c4cfb8', b: '#6b4f33', s: '#eef0d8', S: '#c9cfa8' },
      mods: ['skirt', 'vinok', 'bark'],
      talk: keeperTalk(8, [L('You walked all the way in here? Brave. Or lost.', 'Ти зайшов аж сюди? Сміливий. Або заблукав.'),
        L('Don\'t look behind me. Nobody likes it when people look behind me.', 'Не дивись мені за спину. Ніхто не любить, коли дивляться мені за спину.'),
        L('The old woman in the hut sends her broom out at night. It sweeps up every word it finds lying about. I hide mine in the ferns.', 'Стара з хатинки ночами посилає свою мітлу. Вона вимітає кожне слово, яке знайде. Я ховаю свої в папороті.'),
        L('I keep the forest\'s words. Ліс, папороть, гриб... forest, fern, mushroom.', 'Я бережу слова лісу. Ліс, папороть, гриб...'),
        L('Keep away from the old woman\'s hut. At night she sweeps the paths with her broom, and in the morning there are fewer words in the forest.', 'Тримайся подалі від хатинки старої. Уночі вона мете стежки мітлою, а вранці в лісі менше слів.')]) },
    { id: 'yaga', name: 'Baba Yaga', ua: 7, tx: 30, ty: 8, dir: 'down', wander: 1,
      pal: { h: '#3a2e3e', H: '#241c28', w: '#6b5a4a', W: '#4b3f34', r: '#7a3e8a', x: '#3a2e3e', p: '#4b3a2a', P: '#33281d', b: '#2b2230', s: '#e6d6b0', S: '#c4b088' },
      mods: ['skirt', 'dots'], talk: yagaTalk },
    { id: 'chu', name: 'The chuhaister', ua: 7, tx: 8, ty: 22, dir: 'down', big: true, when: () => !S.f.chu,
      pal: { h: '#e8e4da', H: '#bdb6a8', w: '#d6d0c2', W: '#b5ad9c', r: '#bdb6a8', x: '#8a8272', p: '#d6d0c2', P: '#b5ad9c', b: '#6b5a4a', s: '#c9a888', S: '#a8876a' }, mods: ['moustache'],
      talk: chuTalk },
    { id: 'fernflower', kind: 'fern', tx: 9, ty: 27, night: true, glow: true, when: () => S.f.chu && !S.f.fern, talk: fernTalk },
    { id: 'lisovyk', name: 'The lisovyk', ua: 7, tx: 20, ty: 26, dir: 'left', wander: 2,
      pal: { h: '#6b8f4a', H: '#4a6a32', w: '#7a6a4a', W: '#5a4a32', r: '#3d7a44', x: '#4a3a2a', p: '#5a4a32', b: '#3a2a22', s: '#c9b48a', S: '#a8916a' }, mods: ['moustache'],
      talk: [
        [L('I am the lisovyk, the forest\'s own old man. Don\'t whistle in here, and don\'t take more mushrooms than you need.', 'Я лісовик, господар лісу. Не свисти тут і не бери більше грибів, ніж треба.')],
        [L('The ferns are full of hard words. Long ones. They bite.', 'У папороті повно важких слів. Довгих. Вони кусаються.'), L('If you lose your way, turn your shirt inside out. Works every time.', 'Якщо заблукаєш, виверни сорочку навиворіт. Завжди допомагає.')],
        [L('The hut on hen\'s legs has started walking at night. Right up to the edge of the trees, to look at the villages.', 'Хатинка на курячих ніжках почала ходити ночами. Аж до узлісся, щоб подивитися на села.'), L('It never used to do that. I don\'t like it.', 'Раніше такого не було. Мені це не подобається.')]] },
  ],
  steppe: [
    { id: 'danylo', name: 'Danylo the miller', ua: 5, tx: 38, ty: 9, dir: 'left',
      pal: { h: '#f4f1e6', H: '#cfc8b8', w: '#f4f1e6', W: '#d6d0c2', r: '#c8b88a', x: '#a89a72', p: '#cfc8b8', P: '#aaa292', b: '#6b4f33' }, mods: ['hat', 'moustache'],
      talk: keeperTalk(2, [L('Wind, wheat, flour, bread. Вітер, пшениця, борошно, хліб. That\'s the whole steppe in four words.', 'Вітер, пшениця, борошно, хліб. Ось увесь степ у чотирьох словах.'), L('Well, and sky. Небо.', 'Ну, і небо.')]) },
    { id: 'ivan', name: 'Ivan the chumak', ua: 5, tx: 21, ty: 18, dir: 'down',
      pal: { h: '#2b2230', H: '#1a141e', w: '#e8e2d2', r: C.red, x: C.red, p: '#3a4f7a', P: '#2a3a5c', b: '#2b2230' }, mods: ['hat', 'moustache'], talk: ivanTalk },
    { id: 'polyovyk', name: 'The polyovyk', ua: 7, tx: 8, ty: 6, dir: 'down', day: true,
      pal: { h: '#f1d07c', H: '#d6a54f', w: '#e6c26a', W: '#c99a45', r: '#ab7833', x: '#7d5426', p: '#d6a54f', P: '#ab7833', b: '#7d5426', s: '#e8d0a0', S: '#c9a87a' }, mods: ['moustache'],
      talk: polyovykTalk },
    { id: 'marichka', name: 'Marichka', ua: 1, tx: 26, ty: 20, dir: 'up', wander: 2,
      pal: { h: '#c4762e', H: '#9a5420', w: '#fbf8f0', r: '#3f6fc4', x: '#3f6fc4', p: '#3f6fc4', P: '#2d4f91', b: '#7a3b22' }, mods: ['skirt'],
      talk: [[L('I\'m looking for poppies. Мак. My baba makes makivnyk with the seeds.', 'Я шукаю мак. Моя бабуся пече з насіння маківник.'),
        L('The wheat\'s full of words, by the way. You walk through it and they jump out at you.', 'До речі, пшениця повна слів. Ідеш через неї, а вони вистрибують.')]] },
  ],
  kalynivka: [
    { id: 'pupil', name: 'Ivasyk', ua: 1, tx: 25, ty: 7, dir: 'down', pal: { h: '#3a2a22', H: '#241812', w: '#fbf8f0', p: '#3a4f7a', b: '#3a2a22' },
      talk: [[L('Lida the teacher is inside the school. She tests everybody. Even grown-ups. Even the goat.', 'Вчителька Ліда в школі. Вона всіх перевіряє. Навіть дорослих. Навіть козу.')]] },
    { id: 'vodyanyk', name: 'The vodyanyk', ua: 7, tx: 21, ty: 15, dir: 'left', water: true, submerged: true,
      pal: { h: '#3d8a64', H: '#2a6a4a', s: '#9cc4a0', S: '#7aa480', w: '#5a8a6a', W: '#3d6a4a', r: '#3d8a64', x: '#2a5a3a', p: '#3d6a4a', b: '#2a4a3a', m: '#4f9a6e' }, mods: ['moustache'],
      talk: vodyanykTalk },
    { id: 'olena', name: 'Olena', ua: 3, tx: 7, ty: 14, dir: 'down', pal: P_OLENA, mods: ['skirt', 'dots'],
      talk: [
        [L('Яблука! Груші! Мед! Apples! Pears! Honey!', 'Яблука! Груші! Мед!'), L('Скільки? How much? For you, nothing. You\'re too thin.', 'Скільки? Для тебе нічого. Ти занадто худий.')],
        [L('Kalyna berries are bitter until the first frost. Then they\'re sweet. Like people.', 'Калина гірка до перших морозів. А потім солодка. Як люди.')]] },
    { id: 'stepan', name: 'Stepan', ua: 3, tx: 21, ty: 14, dir: 'down',
      pal: { h: '#8a8a8a', H: '#6a6a6a', w: '#e8e2d2', r: '#2d4f91', x: '#4a4a5a', p: '#4a4a5a', b: '#3a2a22' }, mods: ['hat'],
      talk: [
        [L('The reeds round the став... the pond... are full of words. Middling hard. Like the carp.', 'Очерет навколо ставу повний слів. Середньої складності. Як короп.')],
        [L('Озеро is a lake. Став is a pond. Річка is a river. Калюжа is a puddle. I\'ve fished all four.', 'Озеро, став, річка, калюжа. Я рибалив у всіх чотирьох.')]] },
    { id: 'kalyna', name: 'Kalyna', ua: 1, tx: 14, ty: 10, dir: 'right', wander: 2,
      pal: { h: '#3a2a22', H: '#241812', w: '#fbf8f0', r: C.red, x: C.red, p: C.red, P: C.red2, b: '#3a2a22' }, mods: ['skirt', 'vinok'],
      talk: [[L('I\'m named after the bush. Everyone here is named after something. My brother is named after a goose.', 'Мене назвали на честь кущика. Тут усіх назвали на честь чогось. Мого брата — на честь гуски.'),
        L('...His name is Гусак. He hates it.', '...Його звуть Гусак. Він це ненавидить.')]] },
  ],
  khutir: [
    { id: 'hryhoriy', name: 'Hryhoriy the beekeeper', ua: 5, tx: 29, ty: 8, dir: 'down',
      pal: { h: '#8a8a8a', H: '#6a6a6a', w: '#efe8d8', r: '#c49a3e', x: '#c49a3e', p: '#5a5a3a', b: '#3a2a22' }, mods: ['hat', 'moustache'],
      talk: keeperTalk(1, [L('Bees don\'t sting people who are calm. Be calm. Calmer. That\'s it.', 'Бджоли не жалять спокійних людей. Будь спокійний. Ще спокійніше. Отак.'),
        L('A khutir is a farm on its own, far from the village. Quiet. The bees like it, and so do I.', 'Хутір — це господарство окремо від села. Тихо. Бджолам подобається, і мені теж.')]) },
    { id: 'zlata', name: 'Zlata', ua: 1, tx: 12, ty: 9, dir: 'down', wander: 2, pal: { h: '#e8c46a', H: '#c49a3e', w: '#fbf8f0', r: C.red, x: C.red, p: '#3f6fc4', P: '#2d4f91', b: '#7a3b22' }, mods: ['skirt', 'vinok'],
      talk: [[L('Did you know the story of Sirko? He was too old to guard the house, so the wolf helped him. Now they\'re friends.', 'Ти знаєш казку про Сірка? Він постарів і не міг стерегти хату, і вовк йому допоміг. Тепер вони друзі.')],
        [L('The hens lay eggs and Grandpa paints them. Писанки!', 'Кури несуть яйця, а дідусь їх розписує. Писанки!')]] },
    { id: 'sirko', name: 'Sirko', ua: 5, kind: 'dog', tx: 17, ty: 10, dir: 'left', wander: 3, talk: (n, done) => animalTalk('dog') || say('', [L('Woof! (Sirko wags his tail at you.)', 'Гав! (Сірко махає хвостом.)')], done) },
    { id: 'hen1', kind: 'hen', tx: 6, ty: 11, dir: 'left', wander: 2, talk: (n, done) => animalTalk('hen1', done) || say('', [L('Ko-ko-ko. (A hen: курка.)', 'Ко-ко-ко.')], done) },
    { id: 'hen2', kind: 'hen', tx: 11, ty: 11, dir: 'right', wander: 2, talk: (n, done) => animalTalk('hen2', done) || say('', [L('Ko-ko-ko-KO! (She is very proud of something.)', 'Ко-ко-ко-КО!')], done) },
    { id: 'hen3', kind: 'hen', tx: 13, ty: 8, dir: 'left', wander: 2, talk: (n, done) => animalTalk('hen3', done) || say('', [L('Ko. (This hen is having a quiet day.)', 'Ко.')], done) },
  ],
  fair: [
    { id: 'vakula', name: 'Vakula the blacksmith', ua: 5, tx: 8, ty: 7, dir: 'down',
      pal: { h: '#2b2230', H: '#1a141e', w: '#e8e2d2', W: '#c9c0ae', r: '#3a2a22', x: '#3a2a22', p: '#3a3046', b: '#2b2230', s: '#e8b88a', S: '#c8946a' }, mods: ['moustache'],
      talk: (npc, done) => {
        const chat = () => say(npc.name, [L('Once I flew to St Petersburg on a devil\'s back to fetch the Empress\'s slippers for my sweetheart. Nobody believes me.', 'Колись я літав до Петербурга на чортові, щоб дістати черевички цариці для коханої. Ніхто не вірить.')], done);
        say(npc.name, [L('Vakula, blacksmith. What do you need?', 'Вакула, коваль. Чого тобі?')], null, { options: [L('Your test', 'Ваше випробування'), L('The road', 'Шлях'), L('Just chatting', 'Просто поговорити')],
          pick: i => i === 0 ? keeperTalk(4, [L('A fair is a market, a festival and a fight, all at once.', 'Ярмарок — це водночас базар, свято і бійка.')])(npc, done) : i === 1 ? roadTeacher(npc, 6, done, chat) : chat() });
      } },
    { id: 'chort', name: 'A devil', ua: 7, tx: 29, ty: 18, dir: 'left', wander: 1,
      pal: { h: '#2b2230', H: '#1a141e', w: '#c8383a', W: '#8f2430', r: '#2b2230', x: '#2b2230', p: '#2b2230', P: '#1a141e', b: '#1a141e', s: '#3a2e3e', S: '#241c28' }, mods: ['horns'],
      talk: [[L('Shh! I\'m not here. I\'m a... merchant. Selling... things.', 'Тсс! Мене тут немає. Я... купець. Продаю... речі.'),
        L('Fine. I\'m a чорт. A devil. Don\'t tell the priest.', 'Гаразд. Я чорт. Тільки попові не кажи.')]] },
    { id: 'solopiy', name: 'Solopiy Cherevyk', ua: 5, tx: 16, ty: 14, dir: 'down',
      pal: { h: '#8a5a35', H: '#6a4226', w: '#e8e2d2', r: C.red, x: '#c49a3e', p: '#5a4a3a', b: '#3a2a22' }, mods: ['hat', 'moustache'],
      talk: [[L('Wheat for sale! Ten sacks! And a mare! Well, the mare\'s mostly for sale.', 'Продаю пшеницю! Десять мішків! І кобилу! Ну, кобилу майже продаю.'),
        L('They say there\'s a devil at this fair, looking for his red coat. Nonsense. ...Have you seen anything red?', 'Кажуть, на цьому ярмарку чорт шукає свою червону свитку. Дурниці. ...Ти не бачив нічого червоного?')]] },
    { id: 'khivria', name: 'Khivria', ua: 5, tx: 24, ty: 16, dir: 'left', wander: 1,
      pal: { h: '#3f6fc4', H: '#2d4f91', w: '#efe8d8', r: C.red, x: C.red, p: '#7a3e8a', P: '#4f2459', b: '#3a2a22' }, mods: ['skirt', 'dots'],
      talk: [[L('Solopiy! Stop chatting and sell that wheat!', 'Солопію! Годі балакати, продавай пшеницю!'), L('...Not you, dear. You can stay. Buy something.', '...Не ти, любчику. Ти лишайся. Купи щось.')]] },
  ],
  lake: [
    { id: 'berehynia', name: 'Berehynia', ua: 7, tx: 20, ty: 11, dir: 'down', water: true, glow: true,
      pal: { h: '#e8c46a', H: '#c49a3e', w: '#fbf8f0', W: '#d8e4ec', r: C.red, x: C.red, p: '#fbf8f0', P: '#d8e4ec', b: '#c4d0d8', s: '#f6e2c8', S: '#dcc4a4' }, mods: ['skirt', 'vinok'],
      talk: keeperTalk(5, [L('I am Берегиня, the one who guards the shore. And the home, and the children, and anyone who is kind to water.', 'Я Берегиня. Я бережу берег. І дім, і дітей, і кожного, хто добрий до води.'),
        L('People embroider me on their rushnyky, with my arms raised. Have you seen?', 'Люди вишивають мене на рушниках, з піднятими руками. Бачив?')]) },
    { id: 'panas', name: 'Did Panas', ua: 5, tx: 19, ty: 20, dir: 'up',
      pal: { h: '#d8d4cc', H: '#a9a49b', w: '#e8e2d2', r: '#2d4f91', x: '#4a4a5a', p: '#4a4a5a', b: '#3a2a22' }, mods: ['hat', 'moustache'],
      talk: [[L('Sixty years I\'ve fished this lake. The fish know me. They avoid me.', 'Шістдесят років я ловлю рибу на цьому озері. Риба мене знає. І обходить.')],
        [L('The Berehynia stands at the end of the pier when the water is calm. Be respectful.', 'Коли вода спокійна, Берегиня стоїть на кінці кладки. Будь шанобливим.')]] },
  ],
  ferry: [
    { id: 'mamai', name: 'Kozak Mamai', ua: 5, tx: 10, ty: 7, dir: 'down',
      pal: { h: '#2b2230', H: '#1a141e', w: '#fbf8f0', W: '#d6d0c2', r: '#c8383a', x: '#c49a3e', p: '#c8383a', P: '#8f2430', b: '#c49a3e' }, mods: ['moustache', 'chub'],
      talk: mamaiTalk },
    { id: 'semen', name: 'Semen the ferryman', ua: 5, tx: 25, ty: 15, dir: 'left',
      pal: { h: '#6a4226', H: '#4a2e18', w: '#e8e2d2', r: '#2d4f91', x: '#2d4f91', p: '#4a4a5a', b: '#3a2a22' }, mods: ['hat', 'moustache'],
      talk: (npc, done) => roadTeacher(npc, 5, done, () => say(npc.name, [L('Пором: the ferry. Перевізник: the ferryman. I carry everyone across, and nobody ever asks how I am.', 'Пором. Перевізник. Я всіх перевожу, а мене ніхто не питає, як я.')], done)) },
  ],
  marsh: [
    { id: 'yaryna', name: 'Yaryna the herbalist', ua: 5, tx: 10, ty: 6, dir: 'down',
      pal: { h: '#3a2a22', H: '#241812', w: '#e8e2d2', W: '#c9c0ae', r: '#3d8a64', x: '#3d8a64', p: '#4a3a5a', P: '#33284a', b: '#2b2230' }, mods: ['skirt', 'dots'],
      talk: (npc, done) => {
        const chat = () => say(npc.name, [L('Знахарка: a healer. Some people say відьма: a witch. I say: do you want the medicine or not?', 'Знахарка. Дехто каже — відьма. А я кажу: тобі ліки потрібні чи ні?')], done);
        say(npc.name, [L('Mind the bog. What brings you?', 'Обережно, трясовина. Чого прийшов?')], null, { options: [L('Your test', 'Ваше випробування'), L('The road', 'Шлях'), L('What hurts', 'Що болить'), L('Just chatting', 'Просто поговорити')],
          pick: i => i === 0 ? keeperTalk(7, [L('Every plant in this marsh has a name and a use. So does every word.', 'Кожна рослина на болоті має назву і користь. І кожне слово теж.')])(npc, done) : i === 1 ? roadTeacher(npc, 7, done, chat) : i === 2 ? yarynaLesson(npc.name, done) : chat() });
      } },
    { id: 'blud1', name: 'A wandering light', ua: 7, kind: 'wisp', tx: 30, ty: 17, wander: 3,
      talk: [[L('Follow me... follow meee... I know a shortcut...', 'Іди за мною... за мноооою... я знаю коротку дорогу...'), L('(It\'s a блуд. It leads travellers astray. Don\'t follow it.)', '(Це блуд. Він заводить подорожніх у трясовину. Не йди за ним.)')]] },
    { id: 'blud2', name: 'A wandering light', ua: 7, kind: 'wisp', tx: 9, ty: 20, wander: 3,
      talk: [[L('Hee hee. This way. No, that way. No...', 'Хі-хі. Сюди. Ні, туди. Ні...')]] },
    { id: 'blud3', name: 'A wandering light', ua: 7, kind: 'wisp', tx: 31, ty: 10, wander: 2,
      talk: [[L('Шшш... the marsh remembers everyone who got lost in it.', 'Шшш... болото пам\'ятає всіх, хто в ньому заблукав.')]] },
  ],
  // indoors
  home: [{ id: 'murko', name: 'Murko', ua: 5, kind: 'cat', tx: 3, ty: 5, dir: 'left', talk: (n, done) => animalTalk('cat') || say('', [L('Мяу. (Murko the cat is not interested in you.)', 'Мяу. (Котові Мурку ти нецікавий.)')], done) }],
  mykola: [{ id: 'paraska', name: 'Baba Paraska', ua: 3, tx: 5, ty: 4, dir: 'down', pal: { h: '#3f6fc4', H: '#2d4f91', w: '#efe8d8', r: C.red, x: C.red, p: '#3a2e3e', b: '#3a2a22' }, mods: ['skirt', 'dots'],
    talk: [[L('I weave rushnyky. Every pattern means something. This one is the tree of life.', 'Я тчу рушники. Кожен візерунок щось означає. Оцей — дерево життя.'),
      L('Mykola talks about storks all day. I talk about thread. Between us we know everything.', 'Микола цілий день говорить про лелек. Я про нитки. Разом ми знаємо все.')]] }],
  halyna: [{ id: 'andriy', name: 'Andriy', ua: 1, tx: 6, ty: 4, dir: 'down', pal: { h: '#7a4a22', H: '#563216', w: '#fbf8f0', p: '#5a5a3a', b: '#7a3b22' },
    talk: [[L('Mama says I can\'t go to the forest until I know a hundred words.', 'Мама каже, що я не піду в ліс, поки не знатиму сто слів.'), L('I know "борщ". And "ні". That\'s two.', 'Я знаю «борщ». І «ні». Це два.')]] }],
  hrytsenko: [{ id: 'domovyk', name: 'The domovyk', ua: 7, tx: 4, ty: 2, dir: 'down', when: () => S.f.dom,
    pal: { h: '#8a6a45', H: '#5b432c', w: '#7a5a3a', W: '#5b432c', r: '#8a6a45', x: '#3a2a1a', p: '#6b4f33', P: '#4b3524', b: '#3a2a1a', s: '#e6c8a0', S: '#c4a07a', m: '#c9c4b8' }, mods: ['moustache'],
    talk: domovykTalk }],
  church: [
    { id: 'dyak', name: 'Pan Yosyp, the dyak', ua: 5, tx: 5, ty: 6, dir: 'down', pal: { h: '#6b6b6b', H: '#4a4a4a', w: '#2b2230', W: '#1a141e', r: C.gold, x: C.gold2, p: '#2b2230', b: '#1a141e' }, mods: ['moustache'], talk: dyakTalk },
    { id: 'motria', name: 'Baba Motria', ua: 3, tx: 8, ty: 7, dir: 'up', pal: { h: '#2b2230', H: '#1a141e', w: '#e8e2d2', r: '#2b2230', x: '#2b2230', p: '#3a2e3e', b: '#2b2230' }, mods: ['skirt'],
      talk: [[L('Shh. I\'m praying for rain. And for my grandson to call. Mostly for my grandson to call.', 'Тсс. Я молюся за дощ. І щоб онук подзвонив. Найбільше — щоб онук подзвонив.')]] },
  ],
  school: [
    { id: 'lida', name: 'Lida the teacher', ua: 5, tx: 8, ty: 3, dir: 'down',
      pal: { h: '#4a2e22', H: '#2e1c14', w: '#fbf8f0', r: '#2d4f91', x: '#2d4f91', p: '#4a4a6a', P: '#34344e', b: '#2b2230' }, mods: ['skirt', 'glasses'],
      talk: (npc, done) => lidaTalk(npc, done) },
    { id: 'kid1', name: 'Sofiyka', ua: 1, tx: 4, ty: 5, dir: 'up', pal: { h: '#c4762e', H: '#9a5420', w: '#fbf8f0', r: C.red, x: C.red, p: '#3f6fc4', P: '#2d4f91', b: '#7a3b22' }, mods: ['skirt', 'vinok'],
      talk: [[L('Я люблю школу! I love school! ...Is that right? Lida says it\'s right.', 'Я люблю школу! ...Правильно? Ліда каже, що правильно.')]] },
    { id: 'kid2', name: 'Bohdan', ua: 1, tx: 8, ty: 5, dir: 'up', pal: { h: '#e8c46a', H: '#c49a3e', w: '#fbf8f0', p: '#6a6a3a', b: '#7a3b22' },
      talk: [[L('I drew the goose on the blackboard. Don\'t tell.', 'Це я намалював гуску на дошці. Не кажи нікому.')]] },
  ],
  miller: [{ id: 'fedora', name: 'Fedora', ua: 3, tx: 5, ty: 4, dir: 'down', pal: { h: '#f4f1e6', H: '#cfc8b8', w: '#fbf8f0', r: C.red, x: '#c8b88a', p: '#a89a72', b: '#6b4f33' }, mods: ['skirt'],
    talk: [[L('Danylo grinds the flour, I bake the bread. Хліб: bread. Борошно: flour.', 'Данило меле борошно, а я печу хліб.'),
      L('There is always flour in this house. In the bread, in the beds, in my hair.', 'У цій хаті завжди є борошно. У хлібі, в ліжках, у моєму волоссі.')]] }],
};

// ─── People in the other villages' houses ─────────────────────────────────
Object.assign(NPCS, {
  beekeeper: [{ id: 'odarka', name: 'Baba Odarka', ua: 3, tx: 4, ty: 4, dir: 'down', pal: { h: '#e8e4da', H: '#bdb6a8', w: '#efe8d8', r: '#c49a3e', x: '#c49a3e', p: '#5a5a3a', b: '#3a2a22' }, mods: ['skirt', 'dots'],
    talk: [[L('Hryhoriy paints the pysanky, I do the wax. Писанка: from писати, to write. You write on an egg with wax.', 'Григорій розписує писанки, а я з воском. Писанка — від слова писати.'),
      L('Every pattern is a wish. Wheat for bread, waves for water, a star for luck.', 'Кожен візерунок — це побажання. Колоски на хліб, хвилі на воду, зірка на щастя.')],
      [L('In the old days a pysanka by the door kept evil from the house. Even a bone-legged evil.', 'Колись писанка біля дверей берегла хату від зла. Навіть від кістяноногого.')]] }],
  forge: [{ id: 'hnatko', name: 'Hnatko', ua: 1, tx: 7, ty: 5, dir: 'left', pal: { h: '#2b2230', H: '#1a141e', w: '#e8e2d2', p: '#3a3046', b: '#2b2230', s: '#e8b88a', S: '#c8946a' },
    talk: [[L('I\'m Vakula\'s apprentice. Коваль: blacksmith. Кузня: the forge. Молот: hammer. I\'m not allowed to touch the молот.', 'Я учень Вакули. Коваль, кузня, молот. Мені не можна чіпати молот.')],
      [L('Vakula says a devil came in last winter to warm his hands. Vakula painted him on the church wall to annoy him.', 'Вакула каже, що взимку сюди заходив чорт погріти руки. Вакула намалював його на стіні церкви, щоб подратувати.')]] }],
  inn: [
    { id: 'khymka', name: 'Pani Khymka', ua: 3, tx: 7, ty: 4, dir: 'down', pal: P_OLENA, mods: ['skirt'],
      talk: [[L('Welcome to the корчма. Борщ, вареники, узвар. What\'ll it be? Nothing? Then sit and listen to the gossip, it\'s free.', 'Ласкаво просимо до корчми. Борщ, вареники, узвар. Що будеш? Нічого? Тоді сідай і слухай плітки, це безкоштовно.')],
        [L('Вареники: dumplings. With cherries, with potato, with cabbage. Never with gossip.', 'Вареники з вишнями, з картоплею, з капустою. Тільки не з плітками.')]] },
    { id: 'traveller', name: 'A traveller', ua: 5, tx: 3, ty: 4, dir: 'down', pal: { h: '#6a4226', H: '#4a2e18', w: '#c9c0ae', r: '#5a4a3a', x: '#5a4a3a', p: '#4a4a5a', b: '#3a2a22' }, mods: ['hat', 'moustache'],
      talk: [[L('I came through the old forest last night. Don\'t laugh. A hut walked across the road in front of my cart. On hen\'s legs.', 'Учора вночі я їхав через старий ліс. Не смійся. Перед моїм возом через дорогу перейшла хата. На курячих ніжках.'),
        L('And from the chimney came a sound like a whole village whispering. Then nothing. I drove here without stopping.', 'А з комина чувся звук, ніби ціле село шепоче. А потім тиша. Я їхав сюди без зупинки.')]] },
  ],
  ferryman: [{ id: 'kylyna', name: 'Kylyna', ua: 3, tx: 4, ty: 4, dir: 'down', pal: P_HALYNA, mods: ['skirt'],
    talk: [[L('Semen\'s ledger? Look at it if you like. Everyone he has ever carried across.', 'Семенова книга? Подивися, якщо хочеш. Усі, кого він перевіз.'),
      L('Except one page. One night an old woman came to the river in a ступа, a mortar, rowing with a pestle. She didn\'t need a ferry. She wanted the ledger. All those names.', 'Крім однієї сторінки. Якось уночі до річки приплила стара в ступі, гребучи товкачем. Пором їй був не потрібен. Їй потрібна була книга. Усі ті імена.'),
      L('Semen burned that page himself rather than give it to her. Names are words too, you know.', 'Семен сам спалив ту сторінку, аби їй не віддати. Імена — це теж слова.')]] }],
  panas: [],
  yaryna: [],
  bondarenko: [{ id: 'mykhas', name: 'Mykhas', ua: 1, tx: 5, ty: 4, dir: 'down', pal: { h: '#c4762e', H: '#9a5420', w: '#fbf8f0', p: '#3a4f7a', b: '#7a3b22' },
    talk: [[L('I\'m learning the bandura. Ostap says I play like a goose with a cold.', 'Я вчуся грати на бандурі. Остап каже, що я граю, як гусак із нежитем.'), L('Бандура. Струна: string. Пісня: song. Дума: a long sad song about kozaks.', 'Бандура. Струна. Пісня. Дума — довга сумна пісня про козаків.')]] }],
  post: [{ id: 'nadia', name: 'Pani Nadia', ua: 3, tx: 6, ty: 3, dir: 'down', pal: P_HANNA, mods: ['skirt', 'glasses'],
    talk: [[L('Пошта: post office. Лист: a letter. Марка: a stamp. Конверт: an envelope.', 'Пошта. Лист. Марка. Конверт.'),
      L('Strange thing. Letters from the villages past the forest come with the envelopes sealed and the pages blank. As if the words fell out on the way.', 'Дивна річ. Листи із сіл за лісом приходять заклеєні, а сторінки порожні. Ніби слова випали по дорозі.')]] }],
});
NPCS.steppe.push({ id: 'otaman', name: 'Otaman Hnat', ua: 7, tx: 24, ty: 17, dir: 'down', ghost: true, when: () => (S.f.duma || 0) >= 2,
  pal: { h: '#c9d4dc', H: '#9aa8b4', w: '#dfe8ee', W: '#b8c4cc', r: '#9aa8b4', x: '#7a8894', p: '#b8c4cc', P: '#98a4ac', b: '#7a8894', s: '#e4ecf0', S: '#c4d0d8', m: '#eef4f8' },
  mods: ['moustache', 'chub'], talk: otamanTalk });

const INTRO = () => [
  `Good morning, ${myName()}.`,
  'Vyshneve. A village of cherry orchards somewhere in the Poltava steppe.',
  'They say a thousand Ukrainian words live wild in this country: in the grass, in the wheat, in the reeds, in the old forest.',
  'Ostap the kobzar is waiting for you by the church, north up the road.\n(Arrows walk. Z talks. X runs. T flips a line between English and Ukrainian.)',
];

// ─── Your name, and the people who know it ────────────────────────────────
const myName = () => S.name || DEFAULT_NAME;
// The vocative (кличний відмінок): Ukrainian changes a name when you call someone by it.
// Андрій → Андрію, Оксана → Оксано, Тарас → Тарасе, Марко → Марку, Олег → Олегу, Галя → Галю.
function vocative(name) {
  if (!/^[А-ЩЬЮЯҐЄІЇа-щьюяґєії'ʼ’-]+$/.test(name)) return name;
  const rules = [[/лля$/, 'лле'], [/ія$/, 'іє'], [/([бвгґджзклмнпрстфхцчшщ])я$/, '$1ю'], [/а$/, 'о'], [/ій$/, 'ію'], [/й$/, 'ю'], [/ь$/, 'ю'],
    [/([кгх])о$/, '$1у'], [/о$/, 'е'], [/([кгх])$/, '$1у'], [/([бвґджзлмнпрстфцчшщ])$/, '$1е']];
  for (const [re, to] of rules) if (re.test(name)) return name.replace(re, to);
  return name;
}
const myVoc = () => vocative(myName());
// the people of Vyshneve know you: the first time you speak each day, they say your name
const GREET = {
  hanna: (n, v) => L(`${n}! Good morning, sonechko. Come and drink some well water.`, `${v}! Доброго ранку, сонечко. Ходи, напийся водички з криниці.`),
  mykola: (n, v) => L(`Ah, ${n}! Добрий день.`, `А, ${v}! Добрий день.`),
  oksana: (n, v) => L(`${n}! Привіт! I was just thinking about you.`, `Привіт, ${v}! Я якраз про тебе думала.`),
  petryk: (n, v) => L(`${n}! ${n}! Guess what!`, `${v}! ${v}! Вгадай що!`),
  halyna: (n, v) => L(`${n}! Tell your mama I've got dill for her.`, `${v}! Перекажи мамі, що в мене є для неї кріп.`),
  taras: (n, v) => L(`Hey, ${n}. Quietly, now.`, `Здоров, ${v}. Тільки тихенько.`),
  paraska: (n, v) => L(`${n}, come in, come in. Mind the loom.`, `${v}, заходь, заходь. Обережно, верстат.`),
  andriy: (n, v) => n === DEFAULT_NAME ? L('Hey, we have the same name! Тезко! That\'s what you call someone with your name.', 'Гей, у нас однакові імена! Тезко!')
    : L(`Hi, ${n}.`, `Привіт, ${v}.`),
  dyak: (n, v) => L(`Слава Ісусу Христу, ${n}. (A church greeting. The answer is "Слава навіки!": glory forever.)`, `Слава Ісусу Христу, ${v}. (Відповідають: «Слава навіки!»)`),
  motria: (n, v) => L(`${n}? Come here, let me look at you.`, `${v}? Ходи сюди, дай на тебе подивитися.`),
};
function greeting(npc) {
  const g = GREET[npc.id];
  if (!g || npc.greeted || !S.f.intro) return null;
  npc.greeted = true;
  const n = myName(), v = vocative(n), out = [g(n, v)];
  if (!S.f.vocNote && v !== n) {
    S.f.vocNote = 1; saveSoon();
    out.push(L(`[${n} becomes ${v} when somebody calls you. That's the vocative case, кличний відмінок: Оксана → Оксано, Тарас → Тарасе.]`,
      `[Коли до тебе звертаються, ${n} стає ${v}. Це кличний відмінок: Оксана → Оксано, Тарас → Тарасе.]`));
  }
  return out;
}

