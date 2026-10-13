// ─── Lviv: coffee, trams, and the magpies on the wires ────────────────────
// Getting there: Pan Roman's bus from Kamianets, or the night train from the mountains (Ferents's bus to the station),
// once you hold LVIV_NEED pysanky. Pani Zirka's tram takes you back to the station.
const LVIV_NEED = 15;
Object.assign(ITEMS, {
  kava: { ua: 'банка львівської кави', en: 'a jar of Lviv coffee', desc: 'From Pani Ilona, for Ostap the kobzar. "A duma is a long song," she said. "He\'ll need to stay awake for it."' },
});

// ─── The calls ────────────────────────────────────────────────────────────
// The magpies sit on every wire in Lviv and pick the words off them as they pass. The old telephones at the post office run
// under the ground, where no magpie can perch: call your friends from there, and ask them to stand with you when you face her.
// S.f.lviv: 1 Ilona told you, 2 every call is made. S.f.dzvin: bits, who you've called (1 Baba Hanna, 2 Mykyta, 4 Ivanka, 8 Lukash).
const lvStep = () => S.f.lviv || 0;
const dzvin = () => S.f.dzvin || 0;
const dzvinCount = () => [1, 2, 4, 8].filter(b => dzvin() & b).length;
const PHONE_CALLS = [
  { bit: 1, who: 'Baba Hanna', where: L('Vyshneve', 'Вишневе'),
    hello: [L('Алло? Алло! Who\'s this? Speak up, the line is crackling like a pich.', 'Алло? Алло! Хто це? Говори голосніше, у трубці тріщить, як у печі.')],
    qs: [['Алло! Хто ___?', 'Hello! Who\'s calling?', ['дзвонить', 'подзвонить', 'дзвонив'], 0, 'Right now, in progress: the imperfective дзвонить. Хто дзвонить?: who\'s calling?'],
      ['Наступного разу ___ мені листа, як колись!', 'Next time, write me a letter, like in the old days!', ['напиши', 'пиши', 'написав'], 0, 'One letter, one time: the perfective напиши. Пиши means keep writing, write often.']],
    yes: [L('From Lviv? Look at you, ringing your baba from Lviv. Of course I\'ll come. When you go into the forest, the whole of Vyshneve will be behind you.', 'Зі Львова? Ти подивися, бабі зі Львова дзвонить. Звісно, прийду. Коли підеш у ліс, усе Вишневе стоятиме за тобою.'),
      L('And we won\'t be quiet. You\'ve never heard Vyshneve when it isn\'t quiet. The hut will fall off its legs.', 'І мовчати не будемо. Ти ще не чув, яке Вишневе, коли воно не мовчить. Хатинка з ніг упаде.')] },
  { bit: 2, who: 'Mykyta the cabbie', where: L('Kyiv', 'Київ'),
    hello: [L('Таксі, слухаю! Oh, it\'s you! I\'m on the Podil embankment with a fare in the back. Quick, quick.', 'Таксі, слухаю! О, це ти! Я на подільській набережній, у мене пасажир. Швидко, швидко.')],
    qs: [['Мій мобільний зараз ___, кажи швидко!', 'My mobile is about to die, say it quickly!', ['сяде', 'сідає', 'сів'], 0, 'Any second now, once: the perfective future сяде. (A phone сідає when its battery runs down.)'],
      ['Добре, я тобі ___ адресу, а ти скажи коли.', 'All right, I\'ll send you the address, and you tell me when.', ['надішлю', 'надсилаю', 'надіслав'], 0, 'Once, in the future: the perfective надішлю. Надсилаю: I\'m sending, I send.']],
    yes: [L('The old forest by Vyshneve? I know it, my father told me. I\'ll be there, and I\'ll bring half of Podil in the taxi. It\'s a very full taxi.', 'Старий ліс біля Вишневого? Знаю, тато розповідав. Я там буду, і привезу пів Подолу в таксі. Дуже повне таксі.')] },
  { bit: 4, who: 'Ivanka', where: L('the mountains', 'гори'),
    hello: [L('Алло?! I can hardly hear you! I\'m standing on the fence at Baba Palahna\'s, it\'s the only place the phone works.', 'Алло?! Я тебе ледве чую! Я стою на паркані в баби Палагни, тільки тут телефон ловить.')],
    qs: [['Нині в нас немає ___, тільки трембіта!', 'Today we\'ve no internet, only the trembita!', ['інтернету', 'інтернет', 'інтернетом'], 0, 'Немає + the genitive: інтернет → інтернету.'],
      ['___ мені наступного разу, коли буде гарна погода!', 'Call me next time, when the weather\'s good!', ['Подзвони', 'Дзвони', 'Дзвонила'], 0, 'One call: the perfective подзвони. Дзвони means call often, keep calling.']],
    yes: [L('Of course I\'ll come! And I\'ll bring Mytro, and Mytro will bring his trembita. A trembita is louder than any broom.', 'Звісно, прийду! І приведу Митра, а Митро принесе трембіту. Трембіта гучніша за будь-яку мітлу.'), ...hu('файний')] },
  { bit: 8, who: 'Lukash', where: L('Polissia', 'Полісся'),
    hello: [L('Алло? This is the Polissia village telephone. There\'s one. It\'s in the shop. This is Lukash. Who\'s that?', 'Алло? Це телефон поліського села. Він один. Він у крамниці. Це Лукаш. Хто це?')],
    qs: [['Я так довго ___, що хтось подзвонить!', 'I waited so long for someone to call!', ['чекав', 'почекав', 'чекаю'], 0, 'A long wait, a process: the imperfective чекав. Почекав is to wait a while and be done.'],
      ['Тільки кажи ___: за мною черга з п\'яти бабусь.', 'Only keep it short: there\'s a queue of five grannies behind me.', ['коротко', 'короткий', 'коротка'], 0, 'How? An adverb, ending in -о: коротко, довго, швидко. Короткий is the adjective.']],
    yes: [L('I\'ll come, and I\'ll bring the sopilka. And if I play it in the old forest, Mavka will hear. Then she\'ll come too.', 'Прийду, і візьму сопілку. А як заграю в старому лісі, Мавка почує. Тоді й вона прийде.')] },
];
function boothTalk(npc, done) {
  if (!S.f.book || !lvStep()) return say('', [L('An old telephone booth of polished oak. The receiver is heavy and black, and the dial clicks round like a clock.', 'Стара телефонна будка з полірованого дуба. Слухавка важка й чорна, а диск клацає, як годинник.')], done);
  const left = PHONE_CALLS.filter(c => !(dzvin() & c.bit));
  if (!left.length) return say('', [L('The booth is quiet. Everyone you called is coming.', 'Будка мовчить. Усі, кому ти дзвонив, прийдуть.')], done);
  say('', [L('[You lift the heavy receiver. Who will you call?]', '[Ти знімаєш важку слухавку. Кому подзвонити?]')], null, menu([...left.map(c => L(`${c.who} (${c.where[0]})`, `${c.who} (${c.where[1]})`)), L('Nobody yet', 'Поки нікому')], i => {
    if (i >= left.length) return done();
    const c = left[i];
    sfx('tick');
    say('', [L('[Brrr. Brrr. Brrr. A click.]', '[Дррр. Дррр. Дррр. Клац.]')], () => say(c.who, c.hello, () =>
      roadQuiz(c.qs.slice(), 'ДЗВІНОК', q => {
        if (q.stopped || q.score < 2) return say(c.who, [L('Алло? Алло? You\'re breaking up... [The line goes dead. Try again.]', 'Алло? Алло? Тебе не чути... [Зв\'язок обірвався. Спробуй ще.]')], done);
        S.f.dzvin = dzvin() | c.bit; saveSoon(); sfx('ok');
        say('', [c.tell || L('[You tell them: when you have the last pysanka, you will go into the old forest to face her. And she can\'t touch a word spoken aloud. Will they be there, and speak?]', '[Ти кажеш: коли в тебе буде остання писанка, ти підеш у старий ліс, до неї. А слова, сказаного вголос, їй не дістати. Чи будуть вони там, чи говоритимуть?]')],
          () => say(c.who, [...c.yes, ...(c.tell ? [] : [L(`[${dzvinCount()} of 4 called.]`, `[${dzvinCount()} з 4 дзвінків.]`)])], done));
      }, ['ДЗВІНОК', 'Телефонна розмова', 'a telephone call', 'What do they say?'], 24)));
  }));
}
function ilonaTalk(npc, done) {
  const n = npc.name, s = lvStep();
  const test = () => keeperTalk(24, [L('Modern life: phones, screens, letters and emails, football, cafés. Телефон, інтернет, кава. Everybody thinks it\'s new. Lviv has had all of it for a hundred years, except the internet, and we had cafés first.', 'Сучасне життя: телефони, екрани, листи, футбол, кав\'ярні. Телефон, інтернет, кава. Усі думають, що це нове. У Львові все це є вже сто років, крім інтернету, а кав\'ярні в нас були найперші.')])(npc, done);
  const chat = () => say(n, [L('Кава: coffee. Кав\'ярня: a café. In Lviv we don\'t ask whether you want coffee. We ask what kind. And then we bring you the kind we think you want.', 'Кава. Кав\'ярня. У Львові не питають, чи хочеш ти кави. Питають, якої. А тоді приносять ту, якої, на нашу думку, ти хочеш.'),
    L('They say the first café in Lviv was opened by a man called Kulchytskyi, who saved Vienna from the Turks and was paid in sacks of coffee beans. Nobody else knew what they were. He did.', 'Кажуть, що першу кав\'ярню відкрив Кульчицький, той, що врятував Відень від турків, а йому заплатили мішками кавових зерен. Ніхто не знав, що це таке. А він знав.')], done);
  const wires = () => {
    if (s === 0) {
      S.f.lviv = 1; saveSoon();
      return say(n, [L('Look out of the window. No, at the wires. And the roofs. And the lions. Сороки: magpies. Hundreds. They came last week, and they haven\'t made a sound since.', 'Подивися у вікно. Ні, на дроти. І на дахи. І на левів. Сороки. Сотні. Прилетіли минулого тижня і відтоді жодного разу не скрекотнули.'),
        L('They\'re listening. Every phone call, every email, every letter that goes down a wire: they pick the words off it, like caterpillars off a leaf. People in Lviv say «алло» and the other end hears «кра».', 'Вони слухають. Кожен дзвінок, кожен лист, що йде дротом: вони знімають з нього слова, як гусінь із листка. Люди у Львові кажуть «алло», а на тому кінці чують «кра».'),
        L('You\'ve heard what the molfar says? She can sweep up any word lying about, but not one spoken aloud. A word on a wire hasn\'t got a mouth. That\'s why they\'re here.', 'Ти чув, що каже мольфар? Вона може вимести кожне слово, що лежить без діла, але не те, що сказане вголос. А слово на дроті рота не має. Тому вони тут.'),
        L('So we do it the old way. At the poshtamt, the main post office over there, there are telephones from before the war, and their wires run under the street. No magpie can perch underground.', 'Тож зробимо по-старому. У поштамті, он там, є телефони ще з довоєнних часів, і їхні дроти йдуть під вулицею. Під землею жодна сорока не сяде.'),
        L('Call your friends from there. Tell them where you\'ll be when you face her, and ask them to be there too. Speaking. All of them, all at once, out loud.', 'Подзвони звідти друзям. Скажи, де ти будеш, коли підеш до неї, і попроси їх теж бути там. Говорити. Усім, усім разом, уголос.'),
        L('On the phone you\'ll need the future. Done once: the perfective, я подзвоню, я надішлю, я прийду. Going on: the imperfective, я дзвонитиму, я буду чекати.', 'По телефону тобі знадобиться майбутній час. Один раз і до кінця — доконаний: я подзвоню, я надішлю, я прийду. Довго, без кінця — недоконаний: я дзвонитиму, я буду чекати.')], done);
    }
    if (s === 1 && dzvinCount() < 4) return say(n, [L(`${dzvinCount()} of 4 calls made. The booth is in the poshtamt, east side of the square.`, `${dzvinCount()} з 4 дзвінків. Будка в поштамті, на східному боці площі.`)], done);
    if (s === 1) {
      S.f.lviv = 2; saveSoon(); sfx('badge');
      return say('', [L('[As Pani Ilona looks out of the window, every magpie in Lviv lifts off at once: off the wires, the roofs, the lions\' heads. For a moment the sky over Rynok is black. Then they\'re gone, east, towards the old forest.]', '[Поки пані Ілона дивиться у вікно, усі сороки Львова злітають одночасно: з дротів, із дахів, з левових голів. На мить небо над Ринком чорне. А тоді їх нема: полетіли на схід, до старого лісу.]')], () =>
        say(n, [L('She\'s calling them home. She knows, then. Good. Let her know.', 'Вона кличе їх додому. Отже, знає. Добре. Хай знає.'),
          L('Take this, for Ostap the kobzar, when you see him: a jar of Lviv coffee. A duma is a long song, and he\'ll need to stay awake to write yours.', 'Візьми це для кобзаря Остапа, коли його побачиш: банку львівської кави. Дума — довга пісня, і йому треба не спати, щоб написати твою.'), give('kava')], done));
    }
    say(n, [L('The wires are empty and the phones work. People keep ringing each other just to say «алло» and hear «алло» back.', 'Дроти порожні, телефони працюють. Люди дзвонять одне одному тільки для того, щоб сказати «алло» і почути «алло».')], done);
  };
  if (!S.f.book) return chat();
  say(n, [L('Доброго дня! Сідайте. Coffee is coming whether you like it or not.', 'Доброго дня! Сідайте. Кава буде, хочете ви чи ні.')], null, menu([L('Your test', 'Ваше випробування'), L('The magpies', 'Сороки'), L('Just chatting', 'Просто поговорити')], i => i === 0 ? test() : i === 1 ? wires() : chat()));
}

// ─── Getting about: the tram to the station, and the trains and buses from it ─
function zirkaTalk(npc, done) {
  const n = npc.name;
  say(n, [L('Трамвай до вокзалу: the tram to the station. From there, the night train to the mountains or the bus to Kamianets. Where to?', 'Трамвай до вокзалу. Звідти нічний потяг у гори або автобус до Кам\'янця. Куди?')], null,
    menu([L('The mountains (Synevyr)', 'У гори (Синевир)'), L('Kamianets', 'Кам\'янець'), L('Nowhere, thanks', 'Нікуди, дякую')], i => {
      if (i === 2) return say(n, [L('Then mind the rails. The tram doesn\'t stop for daydreamers.', 'Тоді стережися рейок. Трамвай для мрійників не зупиняється.')], done);
      if (i === 0) return say('', [L('[The tram clanks to the station. All night the train climbs south into the mountains, and at dawn Ferents\'s bus is waiting.]', '[Трамвай деренчить до вокзалу. Цілу ніч потяг дереться на південь, у гори, а на світанку вже чекає Ференців автобус.]')], () => travel('synevyr', 22, 30, 'up'));
      say('', [L('[The tram to the station, then Pan Roman\'s bus, east all day. At dusk, the towers of Kamianets on their rock.]', '[Трамвай до вокзалу, далі автобус пана Романа, цілий день на схід. Надвечір — вежі Кам\'янця на своїй скелі.]')], () => travel('kamianets', 36, 15, 'up'));
    }));
}
// Ferents at Synevyr takes the train either way now: back to Polissia, or on to Lviv
function ferentsLviv(npc, done) {
  const n = npc.name;
  if (badgeCount() < LVIV_NEED) return ferentsTalk(npc, done);
  say(n, [L('Автобус to the station. From there, the night train east to Polissia, or north to Lviv. Which?', 'Автобус на вокзал. Звідти нічний потяг на схід, на Полісся, або на північ, до Львова. Куди?')], null,
    menu([L('Polissia', 'Полісся'), L('Lviv', 'Львів'), L('Neither', 'Нікуди')], i => {
      if (i === 2) return say(n, [L('I\'ll be here. The bus is my house.', 'Я буду тут. Автобус — мій дім.')], done);
      if (i === 0) return say('', [L('[The bus rattles down to the valley. That night the train carries you east, out of the mountains, and in the morning the pines of Polissia are at the window.]', '[Автобус деренчить у долину. Уночі потяг везе тебе на схід, геть із гір, а зранку за вікном уже сосни Полісся.]')], () => travel('polissia', 32, 6, 'down'));
      say('', [L('[Down to the valley, then all night north on the train. In the morning: Lviv station, a tram, and the bells of Rynok square.]', '[У долину, а тоді цілу ніч потягом на північ. Зранку — львівський вокзал, трамвай і дзвони площі Ринок.]')], () => travel('lviv', 20, 27, 'up'));
    }));
}
for (const e of NPCS.synevyr) if (e.id === 'ferents') e.talk = ferentsLviv;

// ─── The people ───────────────────────────────────────────────────────────
Object.assign(NPCS, {
  kavarnia: [{ id: 'ilona', name: 'Pani Ilona', ua: 15, tx: 10, ty: 3, dir: 'down', pal: Object.assign(P_CITY('#8a5a35', '#2b2230'), { h: '#2b2230', H: '#1a141e' }), mods: ['skirt', 'glasses'], talk: ilonaTalk },
    { id: 'pan-zenon', name: 'Pan Zenon', ua: 15, tx: 4, ty: 4, dir: 'left', pal: Object.assign(P_CITY('#5a5a6a', '#3a3046'), { h: '#d8d4cc', H: '#a9a49b' }), mods: ['moustache', 'hat'],
      talk: [[L('I\'ve been sitting at this table since 1974. Fifty years of coffee. My doctor says it\'s bad for me. My doctor is dead. I\'m still here.', 'Я сиджу за цим столиком з 1974 року. П\'ятдесят років кави. Мій лікар каже, що це шкідливо. Мій лікар уже помер. А я ось тут.')],
        [L('Курити: to smoke. I gave it up. Seven times. Each time was very successful.', 'Курити. Я кинув. Сім разів. Щоразу дуже успішно.')]] }],
  poshtamt: [
    { id: 'booth', kind: 'booth', tx: 2, ty: 2, talk: boothTalk },
    { id: 'booth2', kind: 'booth', tx: 12, ty: 2, talk: boothTalk },
    { id: 'halia-p', name: 'Pani Stefa the clerk', ua: 15, tx: 7, ty: 2, dir: 'down', pal: P_CITY('#3f6fc4', '#3a3046'), mods: ['skirt', 'glasses'],
      talk: [[L('Поштамт: the main post office. Stamps, parcels, telegrams. And the old booths. People laugh at them. This week nobody\'s laughing.', 'Поштамт. Марки, посилки, телеграми. І старі будки. Люди з них сміються. Цього тижня ніхто не сміється.')]] },
  ],
  lviv: [
    { id: 'zirka', name: 'Pani Zirka the tram driver', ua: 15, tx: 22, ty: 26, dir: 'down', pal: P_CITY('#c8383a', '#3a3046'), mods: ['skirt', 'hat'], talk: zirkaTalk },
    { id: 'taras-l', name: 'Nazar', ua: 15, tx: 16, ty: 20, dir: 'down', pal: P_CITY('#e9b949', '#3f6fc4'),
      talk: [[L('Футбол! I\'m going to be a footballer. Футболіст. Our команда, our team, is the best in Lviv. There are two of us.', 'Футбол! Я буду футболістом. Наша команда найкраща у Львові. Нас двоє.')],
        [L('Have you got a м\'яч? A ball? I kicked mine into a fountain. Diana has it now. She won\'t give it back.', 'Маєш м\'яча? Я свій копнув просто у фонтан. Тепер він у Діани. Вона не віддає.')]] },
    { id: 'daryna', name: 'Daryna', ua: 15, tx: 14, ty: 13, dir: 'left', pal: P_CITY('#4c9c66', '#3a3046'), mods: ['skirt', 'glasses'],
      talk: (npc, done) => say(npc.name, lvStep() >= 2 ? [L('The internet works again! My emails go where they\'re sent. Інтернет, ноутбук, лист. Модерне життя!', 'Інтернет знову працює! Листи йдуть, куди їх надсилають. Інтернет, ноутбук, лист. Модерне життя!')]
        : [L('Ноутбук: a laptop. I\'m writing an email to my sister in Kharkiv. I send it, and she gets: «кра кра кра». She thinks I\'ve gone mad.', 'Ноутбук. Пишу листа сестрі в Харків. Надсилаю, а вона отримує: «кра кра кра». Думає, що я збожеволіла.')], done) },
    { id: 'lion-man', name: 'Pan Yurii', ua: 15, tx: 20, ty: 17, dir: 'up', pal: P_CITY('#7a5a8a', '#3a3046'), mods: ['moustache'],
      talk: [[L('Лев: a lion. Lviv is named after Lev, a prince, the son of King Danylo. So the city is named after a lion, because the prince was. Everything here is a lion. My cat thinks she is a lion.', 'Лев. Львів названо на честь князя Лева, сина короля Данила. Отже, місто названо на честь лева, бо так звали князя. Тут усе — леви. Моя кішка думає, що вона левиця.')]] },
    ...[[13, 9], [29, 9], [20, 20], [28, 25], [8, 18], [31, 13]].map(([tx, ty], k) => ({ id: 'lvivmagpie' + k, kind: 'magpie', tx, ty, dir: k % 2 ? 'left' : 'right', wander: 1, when: () => lvStep() < 2,
      talk: (n, done) => say('', [S.f.fern ? L('...', '...') : L('A magpie, perched very still, its head on one side. It\'s listening to the wires. It doesn\'t make a sound.', 'Сорока сидить нерухомо, схиливши голову набік. Слухає дроти. Ані звуку.'),
        ...(S.f.fern ? [L('[Even with the fern flower, you hear nothing. It isn\'t saying anything. It\'s only listening.]', '[Навіть із цвітом папороті ти нічого не чуєш. Вона нічого не каже. Вона тільки слухає.]')] : [])], done) })),
  ],
});

// what to do next, in Lviv: added to the "What now?" page
function lvivText() {
  const been = id => !!(S.been && S.been[id]), out = [];
  if (badgeCount() >= LVIV_NEED && !been('lviv')) out.push('You can get to Lviv now: Pan Roman\'s bus from Kamianets, or the night train from Synevyr.');
  if (lvStep() === 1) out.push(dzvinCount() < 4 ? `Call your friends from the old telephone booths in Lviv's poshtamt (${dzvinCount()} of 4).` : 'Tell Pani Ilona in her café that everybody\'s coming.');
  return out.length ? ' ' + out.join(' ') : '';
}
