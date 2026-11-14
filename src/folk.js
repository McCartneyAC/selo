// ─── Folk beings keep out of sight ────────────────────────────────────────
// In the tales the old beings don't stand about where anyone can see them. You meet them by knowing the custom:
// you wake Mavka with a sopilka, turn your shirt inside out for the lisovyk, carry wormwood past the rusalky,
// tie a ribbon on Berehynia's willow, and the devil only turns up when you hold a piece of his red svytka.
// Until then there's a trace where they live (a light, a laugh, ribbons on a willow), and someone in the villages
// knows what to do. Baba Yaga stays inside her hut, with its back to the road, until you hold every pysanka.
// S.f['fk_' + k]: 1 you found the trace, 2 they're out. Saves from before keep the keepers whose pysanky they won.
const fk = k => S.f['fk_' + k] || 0;
const fkSet = (k, v) => { if (fk(k) < v) { S.f['fk_' + k] = v; saveSoon(); } };
const mavkaOn = () => fk('mavka') >= 2 || !!S.f.b8 || !!S.f.yaga;
const berOn = () => fk('ber') >= 2 || !!S.f.b5;
const lisOn = () => fk('lis') >= 2;
const rusOn = () => fk('rus') >= 2 || has('polynok');
const yagaOn = () => badgeCount() >= NZ || !!S.f.yaga;

Object.assign(ITEMS, {
  vsopilka: { ua: 'вербова сопілка', en: 'a willow sopilka', desc: 'Lida\'s, from the school cupboard. In Лісова пісня, Mavka wakes in spring when Lukash plays one.' },
  polynok: { ua: 'гілочка полину', en: 'a sprig of wormwood', desc: 'From behind Halyna\'s garden, bitter as anything. Rusalky can\'t abide the smell.' },
  strichka: { ua: 'червона стрічка', en: 'a red ribbon', desc: 'From Oksana\'s wreath, for tying on the willow over the lake.' },
});
// a folk hint goes before anything else the person has to say, errands included
const wrapTalk = (npc, f) => { const prev = npc.first; npc.first = (n, done) => (prev && prev(n, done)) || f(n, done); };
const folkWords = (key, list) => lessonWords(key, list);

// ── Mavka, asleep in the willow by the forest lake ──
NPCS.forest.find(n => n.id === 'mavka').when = mavkaOn;
NPCS.forest.push({ id: 'fk-mavka', name: 'A green light', ua: 7, kind: 'wisp', tx: 11, ty: 12, when: () => !mavkaOn(), talk: (n, done) => {
  fkSet('mavka', 1);
  if (!has('vsopilka')) return say('', [L('[A green light drifts over the water by an old willow. In the bark, if you look at it sideways, there is almost a face. It is asleep.]', '[Над водою біля старої верби пливе зелений вогник. У корі, якщо глянути скоса, ніби видно обличчя. Воно спить.]'),
    ...(S.f.book ? [L('[Lida the teacher reads the Forest Song with the children at Kalynivka. She would know who sleeps in a willow.]', '[Учителька Ліда читає з дітьми «Лісову пісню» в Калинівці. Вона знає, хто спить у вербі.]')] : [])], done);
  say('', [L('[The green light hangs by the willow, waiting.]', '[Зелений вогник висить біля верби й чекає.]')], null, { options: [L('Play the sopilka', 'Заграти на сопілці'), L('Leave it be', 'Не чіпати')], pick: i => {
    if (i) return done();
    take('vsopilka');
    say('', [L('[You play the only tune you know, twice, badly. The willow creaks. Leaves open along its branches, though it isn\'t spring. A girl with green hair steps out of the trunk, yawning.]', '[Ти граєш єдину мелодію, яку знаєш, двічі й погано. Верба рипить. На гілках розгортається листя, хоч зараз і не весна. Зі стовбура виходить дівчина із зеленим волоссям і позіхає.]')],
      () => say('Mavka', [L('Who\'s playing? ...You\'re not Lukash. You play like a goose with a cold.', 'Хто це грає? ...Ти не Лукаш. Граєш, як гусак із нежитем.'),
        L('But it\'s spring when somebody plays for me, so it\'s spring. Thank you. Here are the words I woke up with.', 'Але коли мені грають, тоді й весна. Тож тепер весна. Дякую. Ось слова, з якими я прокинулась.')],
        () => teach('Mavka', folkWords('mavka', ['весна', 'спати', 'прокидатися', 'грати', 'музика', 'зелений']), () => { fkSet('mavka', 2); done(); }, 8)));
  } });
} });
wrapTalk(findNpc('lida'), (npc, done) => {
  if (fk('mavka') !== 1 || mavkaOn() || has('vsopilka')) return false;
  say(npc.name, [L('A green light by the willow in the old forest? Then she\'s asleep. Mavka.', 'Зелений вогник біля верби в старому лісі? Тоді вона спить. Мавка.'),
    L('In Lesya Ukrainka\'s Лісова пісня, Mavka sleeps the winter away in a willow, and wakes in spring when Lukash plays his sopilka. Сопілка: a little wooden flute.', 'У «Лісовій пісні» Лесі Українки Мавка зимує у вербі й прокидається навесні, коли Лукаш грає на сопілці.'),
    L('Take this one from the school cupboard. The children have played it to death. Play it at the willow, and mind your manners when she wakes.', 'Візьми оцю зі шкільної шафи. Діти на ній уже все переграли. Заграй біля верби, і будь чемний, коли вона прокинеться.'),
    give('vsopilka')], done);
  return true;
});

// ── The lisovyk, leading you round in circles ──
NPCS.forest.find(n => n.id === 'lisovyk').when = lisOn;
NPCS.forest.push({ id: 'fk-lis', name: 'Somebody in the trees', ua: 7, kind: 'wisp', tx: 20, ty: 26, when: () => !lisOn(), talk: (n, done) => {
  fkSet('lis', 1);
  if (!S.f.fk_listip) return say('', [L('[Somebody whistles in the trees, then laughs. You walk on, and there is the same mossy stump again. And again. And again.]', '[Хтось свистить між деревами, а тоді сміється. Ти йдеш далі, а там знову той самий замшілий пень. І знову. І знову.]'),
    ...(S.f.book ? [L('[Did Mykola in Vyshneve has walked these woods for sixty years. He might know who is having fun with you.]', '[Дід Микола з Вишневого ходить цим лісом шістдесят років. Він, мабуть, знає, хто з тебе жартує.]')] : [])], done);
  say('', [L('[The mossy stump again. Somebody snorts with laughter behind it.]', '[Знову замшілий пень. За ним хтось пирскає від сміху.]')], null, { options: [L('Turn your shirt inside out', 'Вивернути сорочку навиворіт'), L('Keep walking', 'Іти далі')], pick: i => {
    if (i) return done();
    say('', [L('[You pull your shirt off, turn it навиворіт, seams out, and put it back on. The laughing stops. The stump stands up. It has a beard of moss and very bright eyes.]', '[Ти знімаєш сорочку, вивертаєш її навиворіт, швами назовні, і вдягаєш знову. Сміх стихає. Пень підводиться. У нього борода з моху й дуже ясні очі.]')],
      () => say('The lisovyk', [L('Oh, who taught you that? Mykola. It\'s always Mykola.', 'Ой, хто тебе навчив? Микола. Завжди той Микола.'),
        L('I was only walking you in circles. It keeps the paths warm. Since you\'ve caught me, have some of my words.', 'Я тебе тільки по колу водив. Щоб стежки не холонули. Раз уже ти мене {{впіймав|впіймала}}, бери мої слова.')],
        () => teach('The lisovyk', folkWords('lisovyk', ['ліс', 'дерево', 'сорочка', 'сміятися', 'старий']), () => { fkSet('lis', 2); done(); }, 8)));
  } });
} });
wrapTalk(findNpc('mykola'), (npc, done) => {
  if (fk('lis') !== 1 || lisOn() || S.f.fk_listip) return false;
  S.f.fk_listip = 1; saveSoon();
  say(npc.name, [L('Going round in circles in the old forest? Past the same stump? Ha. That\'s the lisovyk having his fun.', 'Ходиш по колу в старому лісі? Повз той самий пень? Ха. Це лісовик із тебе бавиться.'),
    L('Turn your shirt inside out. Навиворіт. Then he can\'t fool you any more, and he has to show himself. My father taught me that, and his father him.', 'Виверни сорочку навиворіт. Тоді він тебе вже не обдурить і мусить показатися. Мене батько навчив, а його дід.')], done);
  return true;
});

// ── The rusalky, laughing in the reeds by Vyshneve at night ──
for (const id of ['rusalka1', 'rusalka2']) {
  const r = NPCS.vyshneve.find(n => n.id === id);
  r.when = rusOn;
  NPCS.vyshneve.push({ id: 'fk-' + id, name: 'Laughter in the reeds', ua: 5, kind: 'wisp', tx: r.tx, ty: r.ty, night: true, when: () => !rusOn(), talk: (n, done) => {
    fkSet('rus', 1);
    say('', [L('[Laughter in the reeds, and a splash. Nobody there. Wet footprints run up out of the river and back in again: small, bare feet.]', '[В очереті сміх і плюскіт. Нікого. Мокрі сліди виходять із річки й вертаються назад: маленькі, босі.]'),
      ...(S.f.book ? [L('[Baba Hanna would know who swims here at night.]', '[Баба Ганна знає, хто тут купається вночі.]')] : [])], done);
  } });
  wrapTalk(r, (npc, done) => {
    if (fk('rus') >= 2) return false;
    say(npc.name, [L('Hee hee. A living one. Tell us, then, little one: полин чи петрушка? Wormwood or parsley?', 'Хі-хі. Живий. Ану скажи нам, серденько: полин чи петрушка?')], null,
      { options: [L('Полин (wormwood)', 'Полин'), L('Петрушка (parsley)', 'Петрушка')], pick: i => {
        if (i) return say(npc.name, [L('Петрушка? Ой ти ж моя душечко!', 'Петрушка? Ой ти ж моя душечко!'),
          L('[Cold wet fingers find your ribs. You laugh until you can\'t breathe, and run.]', '[Холодні мокрі пальці знаходять твої ребра. Ти регочеш, аж дух забиває, і тікаєш.]')], done);
        say(npc.name, [L('Полин?! Під тином згинь!', 'Полин?! Під тином згинь!'),
          L('...Oh, put it away, it stinks. Fine. We\'ll be good. We only wanted somebody to talk to. Nobody comes down to the river at night any more.', '...Ой, сховай, воно смердить. Гаразд. Ми будемо чемні. Ми тільки хотіли з кимсь поговорити. Уночі до річки вже ніхто не ходить.')],
          () => teach(npc.name, folkWords('rusalka', ['ніч', 'вода', 'річка', 'місяць', 'дівчина', 'боятися']), () => { fkSet('rus', 2); done(); }, 0));
      } });
    return true;
  });
}
wrapTalk(findNpc('hanna'), (npc, done) => {
  if (fk('rus') !== 1 || rusOn() || S.f.fk_rustip) return false;
  S.f.fk_rustip = 1; saveSoon();
  say(npc.name, [L('Laughing in the reeds at night? Rusalky, poor things. Girls the river took. In Rusalka week they come out to swing on the willows.', 'Сміються вночі в очереті? Русалки, бідолашні. Дівчата, яких забрала річка. На Русальному тижні вони виходять гойдатися на вербах.'),
    L('If one asks you «Полин чи петрушка?», say полин. Wormwood. Say петрушка and she\'ll tickle you till the cocks crow.', 'Якщо котра спитає: «Полин чи петрушка?», кажи «полин». Скажеш «петрушка», і вона залоскоче тебе до перших півнів.'),
    L('Halyna grows wormwood behind her garden. Carry a sprig, and they\'ll show themselves to you. But they won\'t dare touch you.', 'Галина вирощує полин за городом. Носи з собою гілочку, і вони тобі покажуться. Але торкнутися не посміють.')], done);
  return true;
});
wrapTalk(findNpc('halyna'), (npc, done) => {
  if (!S.f.fk_rustip || rusOn() || has('polynok')) return false;
  say(npc.name, [L('Wormwood? For the rusalky, I suppose. Hanna\'s been telling stories again. Полин: wormwood. Bitter as a mother-in-law.', 'Полину? Для русалок, мабуть. Ганна знову розповідає казки. Гіркий, як свекруха.'),
    L('Here. Don\'t put it in the soup.', 'Тримай. Тільки в борщ не клади.'), give('polynok')], done);
  return true;
});

// ── Berehynia, under the willow with the ribbons ──
findNpc('berehynia').when = berOn;
NPCS.lake.push({ id: 'fk-ber', name: 'The ribbon willow', ua: 7, kind: 'wisp', tx: 20, ty: 11, when: () => !berOn(), talk: (n, done) => {
  fkSet('ber', 1);
  if (!has('strichka')) return say('', [L('[On the old willow over the water hang ribbons, dozens of them, red and blue and faded white. Each one is knotted round a wish.]', '[На старій вербі над водою висять стрічки, десятки стрічок, червоні, сині й вибілені сонцем. На кожній зав\'язане бажання.]'),
    ...(S.f.book ? [L('[Oksana always wears ribbons in her wreath. She might know whose willow this is.]', '[Оксана завжди носить стрічки у вінку. Може, вона знає, чия це верба.]')] : [])], done);
  say('', [L('[The ribbons stir, though there is no wind.]', '[Стрічки ворушаться, хоч вітру немає.]')], null, { options: [L('Tie Oksana\'s ribbon on the willow', 'Зав\'язати Оксанину стрічку на вербі'), L('Not now', 'Не зараз')], pick: i => {
    if (i) return done();
    take('strichka');
    say('', [L('[You tie the red ribbon on a low branch and wish for the people at home. The water goes still as glass. A woman rises out of it with her arms raised, just like the one embroidered on every rushnyk.]', '[Ти зав\'язуєш червону стрічку на низькій гілці й бажаєш добра своїм удома. Вода завмирає, як скло. З неї підводиться жінка з піднятими руками, точнісінько як та, що вишита на кожному рушнику.]')],
      () => say('Berehynia', [L('You asked kindly. People used to come every spring. Now it\'s only Oksana, and you.', 'Ти {{попросив|попросила}} по-доброму. Колись люди приходили щовесни. Тепер тільки Оксана і ти.'),
        L('Here are the words I keep for them: the house, the children, the mother.', 'Ось слова, які я бережу для них: дім, діти, мати.')],
        () => teach('Berehynia', folkWords('berehynia', ['дім', 'діти', 'мати', 'червоний', 'хата']), () => { fkSet('ber', 2); done(); }, 5)));
  } });
} });
wrapTalk(findNpc('oksana'), (npc, done) => {
  if (fk('ber') !== 1 || berOn() || has('strichka')) return false;
  say(npc.name, [L('The willow with the ribbons? That\'s Berehynia\'s. She keeps the water, and the home, and everyone who\'s kind to both.', 'Верба зі стрічками? Це Берегинина. Вона береже воду, і дім, і всіх, хто до них добрий.'),
    L('You tie a ribbon on her willow and ask her to watch over your family. If she likes you, she comes up out of the water to say so. Стрічка: a ribbon. Here, a red one from my wreath.', 'Зав\'язуєш стрічку на її вербі й просиш, щоб берегла твою родину. Якщо ти їй до вподоби, вона вийде з води й сама скаже. Ось, тримай червону з мого вінка.'),
    give('strichka')], done);
  return true;
});

// ── The devil at the fair turns up only for his red svytka ──
// Solopiy's rumour starts the errand; Sirko has the sleeve; the devil appears while you carry it, and vanishes with it.
findNpc('chort').when = () => has('sleeve');
ERRANDS.find(e => e.id === 'sleeve').thanks = L('My sleeve! Hee hee. For that I\'ll teach you some words. Devilishly useful ones. [And with a pop and a smell of sulphur, he is gone.]', 'Мій рукав! Хі-хі. За це я навчу тебе кількох слів. Чортівськи корисних. [І з тихим «пах» і запахом сірки він зникає.]');
wrapTalk(findNpc('solopiy'), (npc, done) => {
  if (!S.f.book || errandState('sleeve') !== 0) return false;
  S.e = S.e || {}; S.e.sleeve = 1; saveSoon();
  say(npc.name, [L('Wheat for sale! Ten sacks! And a mare! Well, the mare\'s mostly for sale.', 'Продаю пшеницю! Десять мішків! І кобилу! Ну, кобилу майже продаю.'),
    L('They say there\'s a devil at this fair, looking for the pieces of his red svytka. Every year! Nonsense, of course.', 'Кажуть, на цьому ярмарку чорт шукає шматки своєї червоної свитки. Щороку! Дурниці, звісно.'),
    L('...Only, Hryhoriy\'s dog Sirko came running from the khutir yesterday with something red in his teeth, and the whole road smelled of sulphur. If you find anything red, don\'t bring it near my wheat.', '...Тільки вчора Григоріїв пес Сірко прибіг із хутора з чимсь червоним у зубах, і на всю дорогу смерділо сіркою. Як знайдеш щось червоне, до моєї пшениці не підноси.')], done);
  return true;
});

// ── Baba Yaga: the hut stands with its back to you until the end ──
NPCS.forest.find(n => n.id === 'yaga').when = yagaOn;
NPCS.forest.push({ id: 'fk-yaga', name: 'A voice from the hut', ua: 7, kind: 'wisp', tx: 30, ty: 8, when: () => !yagaOn(), talk: (n, done) => {
  say('', [L('[The hut stands with its back to the road, the way huts do in the tales, up on two great scaly hen\'s legs. The windows are dark. Something inside is breathing.]', '[Хатинка стоїть до дороги задом, як і належить у казках, на двох величезних лускатих курячих ніжках. Вікна темні. Усередині хтось дихає.]'),
    L(`[In the tales you say: Хатко, хатко, стань до лісу задом, а до мене передом. Not yet. You have ${badgeCount()} pysanky of ${NZ}.]`, `[У казках кажуть: «Хатко, хатко, стань до лісу задом, а до мене передом». Ще ні. Писанок у тебе ${badgeCount()} з ${NZ}.]`)],
    () => yagaTalk(n, done));
} });
