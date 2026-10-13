// ─── The Black Sea: the salt liman, Odesa and Vylkove ─────────────────────
// Getting there: the chumak road south from the steppe, once you hold SEA_NEED pysanky (Ivan the chumak sees you off).
// The liman's road goes on east to Odesa, and from Odesa's port a boat goes to Vylkove on the Danube.
const SEA_NEED = 13;
Object.assign(ITEMS, {
  maznytsia: { ua: 'мазниця', en: 'a chumak\'s tar pot', desc: 'The chumaks greased their wheels from it. They say you could smell a chumak a mile away, and hear him singing two.' },
  mushlia: { ua: 'мушля', en: 'a seashell from Odesa', desc: 'From Titka Sonia. Hold it to your ear and you hear the sea. Listen longer and you hear the sea telling jokes.' },
  posylky: { ua: 'посилки', en: 'a sack of parcels', desc: 'Nastia\'s post, with every address washed off. You know who they\'re for only by asking.' },
  pero: { ua: 'перо пелікана', en: 'a pelican feather', desc: 'Found floating at kilometre zero, where the Danube runs into the sea. Long, white and faintly pink.' },
});
EXIT_LOCK['steppe>liman'] = () => {
  if (badgeCount() >= SEA_NEED) return false;
  turnBack();
  say('Ivan the chumak', [L('That\'s the chumak road, south to the sea and the salt. Two weeks with oxen, and they don\'t hurry for anybody.', 'Це чумацький шлях, на південь, до моря й солі. Два тижні з волами, а воли ні для кого не поспішають.'),
    L(`Come back with ${SEA_NEED} pysanky and I'll know you can stand the road. You have ${badgeCount()}.`, `Приходь, коли матимеш ${SEA_NEED} писанок, тоді я знатиму, що ти витримаєш дорогу. У тебе ${badgeCount()}.`)]);
  return true;
};

// ─── The liman: the chumaks who forgot how to count ───────────────────────
// S.f.sil: 1 Opanas told you, 2 the salt is counted and the carts are loaded.
const silStep = () => S.f.sil || 0;
const SALT_COUNT = [
  ['У валці дванадцять ___.', 'There are twelve carts in the train.', ['возів', 'вози', 'віз'], 0, 'From five up (and 11 to 19): the genitive plural. Дванадцять возів.'],
  ['На першому возі — один ___.', 'On the first cart, one sack.', ['мішок', 'мішки', 'мішків'], 0, 'One: the noun stays singular. Один мішок, одна гривня.'],
  ['На другому — два ___.', 'On the second, two sacks.', ['мішки', 'мішок', 'мішків'], 0, 'Two, three, four: the nominative plural. Два мішки, три мішки.'],
  ['А на третьому — п\'ять ___.', 'And on the third, five sacks.', ['мішків', 'мішки', 'мішок'], 0, 'Five and up: the genitive plural. П\'ять мішків.'],
  ['На кожен віз — сорок мішків ___.', 'Forty sacks of salt to each cart.', ['солі', 'сіль', 'сіллю'], 0, 'A sack of what? The genitive: сіль → мішок солі.'],
  ['Сім і вісім — це ___.', 'Seven and eight make fifteen.', ['п\'ятнадцять', 'п\'ятдесят', 'п\'ять'], 0, 'П\'ять, п\'ятнадцять, п\'ятдесят: five, fifteen, fifty.'],
  ['Мішок коштує дев\'ять ___.', 'A sack costs nine hryvnias.', ['гривень', 'гривні', 'гривня'], 0, 'One гривня, two гривні, five гривень.'],
  ['Два мішки — вісімнадцять гривень, а не дві ___!', 'Two sacks is eighteen hryvnias, not two!', ['гривні', 'гривень', 'гривня'], 0, 'Дві гривні: two to four take the nominative plural. And it\'s дві, not два, for a feminine word.'],
  ['Скільки ___ на небі? Мільярд!', 'How many stars are there in the sky? A billion!', ['зірок', 'зірки', 'зірка'], 0, 'Скільки (how many) + the genitive plural: зірка → зірок.'],
  ['У нас три ___, і всі голодні.', 'We have three chumaks, and they\'re all hungry.', ['чумаки', 'чумаків', 'чумак'], 0, 'Три чумаки: two to four take the nominative plural.'],
  ['Шість волів і ще шість — це дванадцять ___.', 'Six oxen and six more make twelve oxen.', ['волів', 'воли', 'віл'], 0, 'Віл, воли, волів: one ox, two oxen, twelve oxen.'],
  ['Півгодини — це ___ хвилин.', 'Half an hour is thirty minutes.', ['тридцять', 'тринадцять', 'три'], 0, 'Три, тринадцять, тридцять: three, thirteen, thirty.'],
];
function opanasTalk(npc, done) {
  const n = npc.name, s = silStep();
  const test = () => keeperTalk(23, [L('Numbers. One to a billion, and all the ones in between. Один, два, сто, мільйон. A salt master who can\'t count is just a man standing next to a heap.', 'Числа. Від одного до мільярда, і всі, що між ними. Один, два, сто, мільйон. Солевар, який не вміє рахувати, — це просто чоловік, що стоїть біля купи.')])(npc, done);
  const chat = () => say(n, [L('Сіль: salt. The sea comes into the liman, the sun drinks the water, and the salt stays behind. We rake it up, the chumaks load it, and all Ukraine eats it on its bread.', 'Сіль. Море заходить у лиман, сонце випиває воду, а сіль лишається. Ми її згрібаємо, чумаки вантажать, і вся Україна їсть її з хлібом.'),
    L('Why is the water pink? Tiny creatures that live in the salt. The flamingos eat them and go pink too. If you ate enough of them, so would you.', 'Чому вода рожева? Через крихітних істот, що живуть у солі. Фламінго їх їдять і теж рожевіють. Якби ти їх наївся, то й ти порожевів би.')], done);
  const count = () => {
    if (s === 0) {
      S.f.sil = 1; saveSoon();
      return say(n, [L('You\'ve come down the chumak road? Then you\'ve come to the right place and at the wrong time.', 'Ти прийшов чумацьким шляхом? Тоді ти прийшов у правильне місце, але в поганий час.'),
        L('The chumaks are loading for home. Twelve carts. Or is it twenty? Nobody knows. Two nights ago a flock of magpies flew over the camp, and in the morning every chumak had lost his numbers. They count one, two, a lot.', 'Чумаки вантажаться додому. Дванадцять возів. Чи двадцять? Ніхто не знає. Дві ночі тому над табором пролетіла зграя сорок, і зранку кожен чумак загубив свої числа. Рахують: один, два, багато.'),
        L('I can\'t sell salt to a man who can\'t count it. He\'d pay me "a lot", and I\'d give him "a lot", and we\'d both go home cheated.', 'Я не можу продати сіль чоловікові, який її не порахує. Він заплатить мені «багато», я дам йому «багато», і обидва поїдемо додому ошукані.'),
        L('Help me count it into the carts? I say the sums, you say the numbers, loud, so the chumaks hear.', 'Допоможеш порахувати сіль у вози? Я кажу, що додаємо, а ти кажеш числа, голосно, щоб чумаки чули.'),
        L('And mind the sacks: they change with the number. Один мішок. Два, три, чотири мішки. П\'ять мішків, and so on up to a billion.', 'І пильнуй мішки: вони змінюються з числом. Один мішок. Два, три, чотири мішки. П\'ять мішків, і так аж до мільярда.')], () => count2());
    }
    if (s === 1) return count2();
    say(n, [L('Counted, loaded, paid for. Every chumak can count to a billion again, and some of them won\'t stop.', 'Пораховано, навантажено, заплачено. Кожен чумак знову рахує до мільярда, а деякі ніяк не зупиняться.')], done);
  };
  const count2 = () => say(n, [L('Ready to count?', 'Готовий рахувати?')], null, yesNo(go => {
    if (!go) return say(n, [L('The salt will wait. Salt is very good at waiting.', 'Сіль почекає. Сіль дуже добре вміє чекати.')], done);
    roadQuiz(shuffle(SALT_COUNT.slice()).slice(0, 8), 'СІЛЬ', q => {
      if (q.stopped || q.score < 6) return say(n, [L(`${q.score} of 8. The chumaks are looking at each other. Again, from the first cart.`, `${q.score} з 8. Чумаки перезираються. Ще раз, з першого воза.`)], done);
      S.f.sil = 2; saveSoon(); sfx('badge');
      say('', [L(`[${q.score} of 8. As you call out each number, the chumaks repeat it after you, louder and louder, until the whole camp is shouting sums at the oxen.]`, `[${q.score} з 8. Кожне число, яке ти кажеш, чумаки повторюють за тобою, щораз голосніше, аж поки весь табір не кричить волам суми.]`)], () =>
        say(n, [L('Twelve carts, forty sacks each, four hundred and eighty sacks! I can sleep tonight.', 'Дванадцять возів, по сорок мішків, чотириста вісімдесят мішків! Сьогодні я засну.'),
          L('Take this, from the chumaks: a мазниця, a tar pot. They grease their wheels from it so the carts don\'t squeak all the way to Poltava. It squeaks a bit itself.', 'Візьми, від чумаків: мазницю. З неї мажуть колеса, щоб вози не скрипіли аж до Полтави. Сама вона трохи скрипить.'), give('maznytsia'),
          L('The magpies came from the east, from Odesa, and went on west. Somebody\'s collecting.', 'Сороки прилетіли зі сходу, від Одеси, і полетіли далі на захід. Хтось збирає.')], done));
    }, ['СІЛЬ', 'Рахуємо сіль', 'counting the salt', 'How many?'], 23);
  }));
  if (!S.f.book) return chat();
  say(n, [L('Добрий день! Mind the salt, it gets in your boots.', 'Добрий день! Обережно, сіль набивається в чоботи.')], null, menu([L('Your test', 'Ваше випробування'), L('The salt', 'Сіль'), L('Just chatting', 'Просто поговорити')], i => i === 0 ? test() : i === 1 ? count() : chat()));
}

// ─── Odesa: Humorina, and the jokes that lost their endings ───────────────
// S.f.odesa: 1 Sonia told you, 2 Odesa laughs again. S.f.humor: bits, who has their punchline back (1 Fima, 2 the captain, 4 Mania, 8 Lyova).
const odStep = () => S.f.odesa || 0;
const humor = () => S.f.humor || 0;
const humorCount = () => [1, 2, 4, 8].filter(b => humor() & b).length;
const JOKES = {
  fima: [1, [L('«Фімо, чому одесити завжди відповідають питанням на питання?» And then I stop. I know there\'s an end. I can feel it, like a tooth.', '«Фімо, чому одесити завжди відповідають питанням на питання?» І тут я зупиняюся. Я знаю, що там є кінець. Я його відчуваю, як зуб.')],
    [['— Чому одесити відповідають питанням на питання? — А що, ___ є інший спосіб?', '"Why do Odesans answer a question with a question?" "What, is there actually another way?"', ['насправді', 'нарешті', 'наприклад'], 0, 'насправді: actually, in fact, really.'],
      ['— Фімо, ви знаєте, котра година? — ___, знаю. А вам навіщо?', '"Fima, do you know what time it is?" "Of course I know. What do you want it for?"', ['Звичайно', 'Мабуть', 'Може'], 0, 'звичайно: of course, certainly. Also "usual": звичайний.']]],
  captain: [2, [L('«Капітане, скільки років вашому кораблю?» Then something. Something about a puddle. My crew used to fall off the deck laughing at this one.', '«Капітане, скільки років вашому кораблю?» А далі щось. Щось про калюжу. Моя команда падала з палуби від сміху.')],
    [['— Скільки років вашому кораблю? — Він ___ старий, що пам\'ятає, як море було калюжею.', '"How old is your ship?" "It\'s so old it remembers when the sea was a puddle."', ['такий', 'точно', 'добре'], 0, 'такий: such, so. Такий старий: so old.'],
      ['— Капітане, коли ми вже поїдемо? — Коли я ___ доп\'ю чай.', '"Captain, when are we leaving?" "When I finally finish my tea."', ['нарешті', 'наприклад', 'насправді'], 0, 'нарешті: finally, at last.']]],
  mania: [4, [L('«Маню, вода холодна?» And then... and then nothing. There\'s supposed to be a penguin in it somewhere.', '«Маню, вода холодна?» А тоді... а тоді нічого. Там десь мав бути пінгвін.')],
    [['— Маню, вода холодна? — Ну як вам ___? Для пінгвіна — тепла.', '"Mania, is the water cold?" "Well, how shall I put it? For a penguin, it\'s warm."', ['сказати', 'питати', 'називатися'], 0, 'казати, сказати: to say, to tell. Як вам сказати: how shall I put it.'],
      ['— Це ваш чоловік спить на пляжі? — Мій. Він ___ відпочиває від відпочинку.', '"Is that your husband asleep on the beach?" "Mine. He\'s just resting from his holiday."', ['просто', 'точно', 'однаково'], 0, 'просто: simply, just. Also: easy, simple.']]],
  lyova: [8, [L('«Льово, скільки сходинок на Потьомкінських сходах?» Униз — сто дев\'яносто дві. А вгору... Вгору... I\'ve forgotten. Me! Lyova!', '«Льово, скільки сходинок на Потьомкінських сходах?» Униз — сто дев\'яносто дві. А вгору... Вгору... Я забув. Я! Льова!')],
    [['— Скільки сходинок на сходах? — Униз — сто дев\'яносто дві. А вгору, ___, тисяча.', '"How many steps are there on the stairs?" "Going down, a hundred and ninety-two. Going up, obviously, a thousand."', ['очевидно', 'нарешті', 'натомість'], 0, 'очевидно: obviously.'],
      ['— Льово, ви чули ___? — Ні. А що, вже є що чути?', '"Lyova, have you heard the news?" "No. Why, is there already something to hear?"', ['новини', 'розмову', 'корабель'], 0, 'новина, новини: news.']]],
};
function joker(id, chat, after) {
  return (npc, done) => {
    const n = npc.name, [bit, stuck, qs] = JOKES[id];
    if (humor() & bit) return say(n, after, done);
    if (!S.f.book || !odStep()) return say(n, chat, done);
    say(n, stuck, null, menu([L('Finish the joke', 'Закінчити жарт'), L('Not now', 'Не зараз')], i => {
      if (i) return done();
      roadQuiz(qs.slice(), 'ЖАРТ', q => {
        if (q.stopped || q.score < 2) return say(n, [L('No... that\'s not funny. That\'s just words. Again?', 'Ні... це не смішно. Це просто слова. Ще раз?')], done);
        S.f.humor = humor() | bit; saveSoon(); sfx('ok');
        say('', [L(`[${n} laughs so hard it takes a whole minute to stop. Somebody across the street laughs too, without knowing why. ${humorCount()} of 4.]`, `[${n} так регоче, що ніяк не може зупинитися. Хтось через дорогу теж сміється, сам не знаючи чому. ${humorCount()} з 4.]`)], () => say(n, after, done));
      }, ['ЖАРТ', 'Гуморина', 'Humorina', 'How does the joke end?'], 21);
    }));
  };
}
function soniaTalk(npc, done) {
  const n = npc.name, o = odStep();
  const test = () => keeperTalk(21, [L('Talk. The sea, ships, and all the little words you need for a proper conversation: звичайно, мабуть, насправді, ого. In Odesa we don\'t talk to say something. We talk to talk.', 'Розмова. Море, кораблі і всі маленькі слова, без яких немає справжньої розмови: звичайно, мабуть, насправді, ого. В Одесі ми говоримо не для того, щоб щось сказати. Ми говоримо, щоб говорити.')])(npc, done);
  const chat = () => say(n, [L('Тітка Соня, that\'s me. Fish, forty years at the Pryvoz. Бички, скумбрія, камбала. I know every fish in the Black Sea by name, and most of them by their mothers\' names.', 'Тітка Соня, це я. Риба, сорок років на Привозі. Бички, скумбрія, камбала. Я знаю кожну рибу в Чорному морі на ім\'я, а більшість ще й на ім\'я їхніх мам.')], done);
  const humorina = () => {
    if (o === 0) {
      S.f.odesa = 1; saveSoon();
      return say(n, [L('Ой, хто це до нас прийшов! You\'re not from here, I can tell. You\'re not talking. In Odesa everybody talks. Well. Except this week.', 'Ой, хто це до нас прийшов! Ти не тутешній, я бачу. Ти мовчиш. В Одесі всі говорять. Ну. Крім цього тижня.'),
        L('It\'s Humorina: the first of April, the day Odesa tells jokes. And nobody can finish one. A broom went over the opera at night, low, with magpies behind it, and in the morning every joke in the city had lost its ending.', 'Зараз Гуморина: перше квітня, день, коли Одеса розповідає жарти. І ніхто не може жодного закінчити. Уночі над оперою низько пролетіла мітла, а за нею сороки, і зранку кожен жарт у місті загубив кінець.'),
        L('A city of comedians with no punchlines is just a city of people in hats.', 'Місто коміків без кінцівок — це просто місто людей у капелюхах.'),
        L('Four of the best are stuck halfway: Uncle Fima by the opera, Lyova at the top of the stairs, Captain Hryhorovych down at the port, and Mania on the beach. Help them finish. Then Odesa can laugh, and I can sell fish in peace.', 'Четверо найкращих застрягли на півдорозі: дядько Фіма біля опери, Льова нагорі сходів, капітан Григорович у порту і Маня на пляжі. Допоможи їм закінчити. Тоді Одеса зможе сміятися, а я спокійно продаватиму рибу.')], done);
    }
    if (o === 1 && humorCount() < 4) return say(n, [L(`${humorCount()} of 4 jokes have their endings back. Fima at the opera, Lyova on the stairs, the captain at the port, Mania on the beach.`, `${humorCount()} з 4 жартів мають кінцівки. Фіма біля опери, Льова на сходах, капітан у порту, Маня на пляжі.`)], done);
    if (o === 1) {
      S.f.odesa = 2; saveSoon(); sfx('badge');
      return say('', [L('[It starts at the Pryvoz: one laugh, then a stall, then the whole market. It runs up the streets, down the stairs and out along the beach, until the gulls are laughing too and the ships in the port are hooting.]', '[Починається на Привозі: один сміх, потім ціла ятка, потім увесь ринок. Сміх біжить угору вулицями, униз сходами й далі вздовж пляжу, аж поки не регочуть і чайки, а кораблі в порту гудуть.]')], () =>
        say(n, [L('Ну, нарешті! Odesa is Odesa again. Here, take this: a мушля, a shell. Hold it to your ear and you\'ll hear the sea. Listen longer and you\'ll hear it telling jokes.', 'Ну, нарешті! Одеса знову Одеса. На, візьми: мушлю. Приклади до вуха, і почуєш море. Послухай довше, і почуєш, як воно розповідає анекдоти.'), give('mushlia'),
          L('And listen: those magpies weren\'t just stealing. They were carrying. Sacks of words, laughing in the sacks. Flying west. Whoever wants that many words wants them for something.', 'І послухай: ті сороки не просто крали. Вони несли. Мішки слів, і слова в мішках сміялися. Летіли на захід. Кому треба стільки слів, той має для них якусь справу.')], done));
    }
    return say(n, [L('Ой, you again! Want some fish? No? Then a joke. What\'s the difference between a seagull and a tourist? The seagull at least says thank you.', 'Ой, знову ти! Риби хочеш? Ні? Тоді анекдот. Чим чайка відрізняється від туриста? Чайка хоча б каже дякую.')], done);
  };
  if (!S.f.book) return chat();
  say(n, [L('Що ви хочете? Fish? Advice? Both are fresh.', 'Що ви хочете? Рибу? Пораду? І те, і те свіже.')], null, menu([L('Your test', 'Ваше випробування'), L('Humorina', 'Гуморина'), L('Just chatting', 'Просто поговорити')], i => i === 0 ? test() : i === 1 ? humorina() : chat()));
}
function captainTalk(npc, done) {
  const n = npc.name, joke = joker('captain', [L('Captain Hryhorovych, of the passenger ship «Ракета». I\'ve been on the Black Sea forty years, and on the land only on Sundays.', 'Капітан Григорович, з пасажирського корабля «Ракета». Сорок років на Чорному морі, а на суші — тільки в неділю.')],
    [L('A puddle! Ha! Корабель: a ship. Море: the sea. Капітан: me.', 'Калюжею! Ха! Корабель. Море. Капітан — це я.')]);
  const boat = () => say(n, [L('To Vylkove, on the Danube? Four hours down the coast. Sit on the left, you\'ll see the dolphins. Sit on the right, you\'ll see the people on the left looking at dolphins.', 'До Вилкового, на Дунай? Чотири години вздовж берега. Сідай ліворуч, побачиш дельфінів. Сідай праворуч, побачиш людей ліворуч, що дивляться на дельфінів.')], null, yesNo(go => {
    if (!go) return say(n, [L('We leave when I finish my tea.', 'Відпливаємо, коли я доп\'ю чай.')], done);
    say('', [L('[The «Ракета» rises up on its wings and skims south along the coast. Dolphins, then reeds, then a brown wide river and a town where the streets are made of water.]', '[«Ракета» піднімається на крилах і мчить на південь уздовж берега. Дельфіни, потім очерет, потім широка бура ріка і місто, де вулиці — з води.]')], () => travel('vylkove', 20, 26, 'up'));
  }));
  if (!S.f.book) return say(n, [L('Ahoy. The boat to Vylkove leaves when I finish my tea.', 'Агов. Корабель до Вилкового відпливає, коли я доп\'ю чай.')], done);
  say(n, [L('Ahoy! What\'ll it be?', 'Агов! Що треба?')], null, menu([L('The boat to Vylkove', 'Корабель до Вилкового'), ...(odStep() === 1 && !(humor() & 2) ? [L('Your joke', 'Ваш жарт')] : []), L('Nothing', 'Нічого')], i => i === 0 ? boat() : i === 1 && odStep() === 1 && !(humor() & 2) ? joke(npc, done) : done()));
}

// ─── Vylkove: the post that lost its addresses ────────────────────────────
// S.f.posh: 1 Nastia gave you the parcels, 2 every one delivered, 3 Did Fedot rowed you to kilometre zero. S.f.posb: bits, who's had theirs.
const poshStep = () => S.f.posh || 0;
const posb = () => S.f.posb || 0;
const poshCount = () => [1, 2, 4, 8, 16].filter(b => posb() & b).length;
const PARCELS = {
  kuzma: [1, L('a fishing net', 'рибальська сітка'), [['Це посилка ___?', 'Is this parcel for Kuzma?', ['Кузьмі', 'Кузьма', 'Кузьмою'], 0, 'Кому? (to whom) The dative: Кузьма → Кузьмі. Names in -а take -і.'],
    ['Сітка не моя. Хоча... дружина замовила її для мене. Отже, вона ___!', 'The net isn\'t mine. Although... my wife ordered it for me. So it IS mine!', ['моя', 'мій', 'моє'], 0, 'Мій, моя, моє: my. It matches the thing: мій човен, моя сітка, моє весло.']]],
  vasyl: [2, L('sheet music', 'ноти'), [['Ноти ___? Так, мені!', 'Sheet music for Savva? Yes, for me!', ['Савві', 'Савва', 'Савву'], 0, 'Кому? Савва → Савві. And я → мені.'],
    ['Я ___ граю на акордеоні: уранці, удень і вночі.', 'I always play the accordion: in the morning, in the afternoon and at night.', ['завжди', 'рідко', 'майже'], 0, 'Завжди: always. Часто: often. Іноді: sometimes. Рідко: rarely.']]],
  twins: [4, L('a kite', 'повітряний змій'), [['Це вам, ___?', 'Is this for you, twins?', ['близнятам', 'близнята', 'близнят'], 0, 'Кому? The dative plural ends in -ам or -ям: близнята → близнятам. And ви → вам.'],
    ['Змій для Сашка чи для Наталки? — Він ___! Ми ділимося.', 'Is the kite for Sashko or Natalka? "It\'s ours! We share."', ['наш', 'наша', 'наше'], 0, 'Наш, наша, наше: our. Змій is masculine: наш змій.']]],
  avdotia: [8, L('a flour sieve', 'сито'), [['Посилка ___ з пекарні!', 'A parcel for Avdotia at the bakery!', ['Авдоті', 'Авдотя', 'Авдотю'], 0, 'Кому? Авдотя → Авдоті: -я becomes -і.'],
    ['Сито? Так, я замовляла, ___ борошно було біле-біле.', 'A sieve? Yes, I ordered it, so that the flour would be white as white.', ['щоб', 'якщо', 'хоча'], 0, 'Щоб: so that, in order to. Якщо: if. Хоча: although.']]],
  ulita: [16, L('a pair of glasses', 'окуляри'), [['Посилка ___, від сестри.', 'A parcel for Baba Ulita, from her sister.', ['бабі Уліті', 'баба Уліта', 'бабу Уліту'], 0, 'Кому? Баба Уліта → бабі Уліті.'],
    ['___ так довго? Я три тижні чекаю! — Бо на посилці не було адреси, бабусю.', '"Why so long? I\'ve been waiting three weeks!" "Because there was no address on the parcel, granny."', ['Чому', 'Де', 'Коли'], 0, 'Чому: why? Де: where? Коли: when?']]],
};
function parcelTalk(id, chat, thanks) {
  return (npc, done) => {
    const n = npc.name, [bit, what, qq] = PARCELS[id];
    if (posb() & bit) return say(n, thanks, done);
    if (poshStep() !== 1) return say(n, chat, done);
    say(n, [L(`Is that a parcel? From the post? Is it for me? I've been waiting for ${what[0]}.`, `Це посилка? З пошти? Це мені? Я чекаю: ${what[1]}.`)], null, menu([L('Look in the sack', 'Пошукати в мішку'), L('Not now', 'Не зараз')], i => {
      if (i) return done();
      roadQuiz(qq.slice(), 'ПОШТА', q => {
        if (q.stopped || q.score < qq.length) return say(n, [L('Hm. Wait. That doesn\'t sound right. Ask me again?', 'Гм. Стривай. Щось не те. Спитай ще раз?')], done);
        S.f.posb = posb() | bit; saveSoon(); sfx('item');
        say(n, [...thanks, L(`[${poshCount()} of 5 parcels delivered.]`, `[${poshCount()} з 5 посилок доставлено.]`)], done);
      }, ['ПОШТА', 'Чия посилка?', 'whose parcel?', 'Which word fits?'], 22);
    }));
  };
}
function nastiaTalk(npc, done) {
  const n = npc.name, p = poshStep();
  if (!S.f.book) return say(n, [L('Пошта: the post. In Vylkove the postwoman has a boat instead of a bicycle. That\'s me.', 'Пошта. У Вилковому листоноша має човен замість велосипеда. Це я.')], done);
  if (p === 0) {
    S.f.posh = 1; saveSoon();
    return say(n, [L('You\'re off the boat from Odesa? Can you read? Good. Can you read THIS?', 'Ти з одеського корабля? Читати вмієш? Добре. А ЦЕ прочитаєш?'),
      L('[She holds up a parcel. Where the address should be, there\'s just a pale smudge.]', '[Вона показує посилку. Там, де мала бути адреса, тільки бліда пляма.]'),
      L('Two nights ago a black wind came up the Danube, with rain like nails, and in the morning every address on every parcel had been washed off. Not the ink. The words.', 'Дві ночі тому Дунаєм прийшов чорний вітер, з дощем, як цвяхи, і зранку з кожної посилки зникла адреса. Не чорнило. Слова.'),
      L('I know what\'s in them. I don\'t know whose they are. Take the sack round the canals and ask. People will tell you, if you listen to the little words: мій, твій, наш, його, її.', 'Я знаю, що в них. Не знаю, чиї вони. Візьми мішок, пройдися каналами й поспитай. Люди скажуть, якщо слухати маленькі слова: мій, твій, наш, його, її.'),
      L('And ask it properly. A parcel goes TO somebody: кому? That\'s the dative. Кузьма → Кузьмі, Авдотя → Авдоті, ви → вам, я → мені.', 'І питай правильно. Посилку несуть КОМУСЬ: кому? Це давальний відмінок. Кузьма → Кузьмі, Авдотя → Авдоті, ви → вам, я → мені.'),
      give('posylky')], done);
  }
  if (p === 1 && poshCount() < 5) return say(n, [L(`${poshCount()} of 5 delivered. Kuzma the fisherman, Savva with the accordion, the twins, Avdotia at the bakery, and Baba Ulita, who is waiting for her glasses and will tell you so.`, `${poshCount()} з 5 доставлено. Рибалка Кузьма, Савва з акордеоном, близнята, Авдотя з пекарні і баба Уліта, яка чекає на окуляри і тобі про це скаже.`)], done);
  if (p === 1) {
    S.f.posh = 2; take('posylky'); saveSoon(); sfx('badge');
    return say(n, [L('All of them? Even Ulita\'s? You\'re a better postman than I am, and I\'ve got a boat.', 'Усі? Навіть Улітині? Ти кращий листоноша, ніж я, а в мене ж човен.'),
      L('Go and see Did Fedot, by his house on the south canal. He said if anybody sorted out the post, he\'d take them to kilometre zero. He only offers that to people he likes.', 'Сходи до діда Федота, біля його хати на південному каналі. Він казав, що як хтось розбереться з поштою, він повезе його на нульовий кілометр. Він пропонує таке тільки тим, хто йому до вподоби.')], done);
  }
  say(n, [L('Пошта is working, the canals are full, and Ulita can see. A good week.', 'Пошта працює, канали повні, а Уліта бачить. Добрий тиждень.')], done);
}
function fedotTalk(npc, done) {
  const n = npc.name, p = poshStep();
  const test = () => keeperTalk(22, [L('The little words. І, а, але, або; мій, твій, його, її; де, коли, чому, як. They\'re like the bridges here: nobody notices them, and without them you can\'t get anywhere.', 'Маленькі слова. І, а, але, або; мій, твій, його, її; де, коли, чому, як. Вони як наші містки: ніхто їх не помічає, а без них нікуди не дійдеш.')])(npc, done);
  const chat = () => say(n, [L('Човняр: a boatman. In Vylkove you don\'t walk to the neighbours, you row. Every child gets a boat before a bicycle. Some never get a bicycle at all. What for?', 'Човняр. У Вилковому до сусідів не ходять, а веслують. Кожна дитина має човна раніше, ніж велосипед. Дехто велосипеда так і не має. А навіщо?'),
    L('My grandfather\'s grandfather came here three hundred years ago, from the north, for the old faith. We still keep it. And our beards.', 'Дід мого діда прийшов сюди триста років тому, з півночі, заради старої віри. Ми її досі тримаємо. І бороди теж.')], done);
  const zero = () => {
    if (p < 2) return say(n, [L('Kilometre zero? That\'s for people who\'ve helped. Nastia\'s post is in a mess. Start there.', 'Нульовий кілометр? Це для тих, хто допоміг. У Насті з поштою біда. Почни з неї.')], done);
    if (p >= 3) return say(n, [L('You\'ve been to the end of the Danube. Most people never see the end of anything.', 'Ти був на кінці Дунаю. Більшість людей ніколи не бачить кінця нічого.')], done);
    S.f.posh = 3; saveSoon(); sfx('night');
    say('', [L('[Did Fedot rows you out of the canals, past the last reed houses, down the widest arm of the Danube. The banks drop away. Then there are no banks at all.]', '[Дід Федот вивозить тебе з каналів, повз останні очеретяні хати, найширшим рукавом Дунаю. Береги відступають. А тоді берегів зовсім немає.]'),
      L('[A post sticks out of the water with a sign: 0 km. Behind you, the river. In front, the sea. Pelicans sit on the water like a fleet of white boats, and one of them yawns.]', '[З води стирчить стовп із табличкою: 0 км. Позаду ріка. Попереду море. На воді сидять пелікани, як флотилія білих човнів, і один позіхає.]')], () =>
      say(n, [L('Here the Danube ends. It started in the Black Forest, crossed ten countries, and here it just... stops, and becomes the sea. Everything ends somewhere. That\'s not sad. That\'s where the sea starts.', 'Тут кінчається Дунай. Почався в Шварцвальді, пройшов десять країн, а тут просто... зупиняється й стає морем. Усе десь кінчається. Це не сумно. Там починається море.'),
        L('[A feather floats up against the boat. Fedot fishes it out and hands it to you without a word.]', '[До човна підпливає перо. Федот виловлює його й мовчки дає тобі.]'), give('pero')], done));
  };
  if (!S.f.book) return chat();
  say(n, [L('Христос посеред нас. Sit, if you like boats.', 'Христос посеред нас. Сідай, якщо любиш човни.')], null, menu([L('Your test', 'Ваше випробування'), L('Kilometre zero', 'Нульовий кілометр'), L('Just chatting', 'Просто поговорити')], i => i === 0 ? test() : i === 1 ? zero() : chat()));
}
function tolikTalk(npc, done) {
  say(npc.name, [L('Back to Odesa? The «Ракета» goes when the captain says. He\'s on the other end, so he\'s said.', 'Назад до Одеси? «Ракета» відпливає, коли скаже капітан. Він на тому кінці, отже, вже сказав.')], null, yesNo(go => {
    if (!go) return say(npc.name, [L('I\'ll be here, scraping something.', 'Я тут буду, щось шкрябатиму.')], done);
    say('', [L('[The «Ракета» lifts up on its wings, and the reed roofs of Vylkove fall away behind you. By evening, the opera and the stairs.]', '[«Ракета» піднімається на крилах, і очеретяні дахи Вилкового лишаються позаду. Надвечір — опера і сходи.]')], () => travel('odesa', 18, 26, 'up'));
  }));
}

// ─── The people ───────────────────────────────────────────────────────────
const P_SEA = (shirt, trousers) => ({ h: '#5a3a22', H: '#3a2414', w: '#f4f1e6', W: '#d6d0c2', r: shirt, x: '#3f6fc4', p: trousers, P: shade(trousers), b: '#2b2230' });
const P_STRIPES = Object.assign(P_SEA('#f4f1e6', '#2b2230'), { r: '#3f6fc4', x: '#f4f1e6' });
const P_LIPOVAN = (shirt) => ({ h: '#7a5a3a', H: '#5a3a22', w: shirt, W: shade(shirt), r: shirt, x: '#2b2230', p: '#2b2230', P: '#1a141e', b: '#2b2230' });
Object.assign(NPCS, {
  liman: [
    { id: 'opanas', name: 'Opanas the salt master', ua: 13, tx: 14, ty: 12, dir: 'down', pal: Object.assign(P_SEA('#f4f1e6', '#5a5a4a'), { h: '#d8d4cc', H: '#a9a49b' }), mods: ['hat', 'moustache'], talk: opanasTalk },
    { id: 'maksym', name: 'Maksym the chumak', ua: 13, tx: 8, ty: 8, dir: 'down', pal: { h: '#2b2230', H: '#1a141e', w: '#e8e2d2', W: '#c9c0ae', r: '#3a2a22', x: '#c8383a', p: '#5a4a3a', P: '#463a2e', b: '#2b2230' }, mods: ['hat', 'moustache', 'chub'],
      talk: (npc, done) => say(npc.name, silStep() >= 2 ? [L('Чотириста вісімдесят! Four hundred and eighty sacks. I\'ve counted them nine times. I\'m going to count them again.', 'Чотириста вісімдесят! Я перерахував дев\'ять разів. Зараз іще раз перерахую.')]
        : [L('How many carts do we have? One, two... a lot. How many oxen? A lot. How many days to Poltava? Oh, a LOT.', 'Скільки в нас возів? Один, два... багато. Скільки волів? Багато. Скільки днів до Полтави? О, БАГАТО.')], done) },
    { id: 'fedko', name: 'Fedko', ua: 13, tx: 14, ty: 5, dir: 'left', pal: P_SEA('#e8794a', '#5a4a3a'),
      talk: [[L('I\'m minding the oxen. Воли: oxen. Віл: one ox. They don\'t need minding. They just stand there and think about grass.', 'Я пасу волів. Воли. Віл — один. Їх не треба пасти. Вони просто стоять і думають про траву.')],
        [L('At night the chumaks lie on their backs and look at the Чумацький Шлях, the Milky Way, and tell me it\'s made of salt they spilled. I don\'t believe them. I sort of do.', 'Уночі чумаки лежать горілиць, дивляться на Чумацький Шлях і кажуть мені, що він із солі, яку вони розсипали. Я не вірю. Трохи вірю.')]] },
    { id: 'campfire', kind: 'fire', tx: 9, ty: 6, talk: (n, done) => say('', [L('The chumaks\' fire. A pot of куліш, millet porridge with bacon, bubbles over it, and nobody is quite sure how many spoons to bring.', 'Чумацьке вогнище. Над ним булькає казан кулешу, а скільки нести ложок, ніхто точно не знає.')], done) },
    ...[[30, 19], [33, 22], [27, 23], [35, 18], [24, 20]].map(([tx, ty], k) => ({ id: 'flamingo' + k, kind: 'flamingo', tx, ty, dir: k % 2 ? 'left' : 'right', water: true, wander: 2,
      talk: (n, done) => say('', [S.f.fern ? L(['Фламінго: a flamingo. We stand on one leg because two is showing off.', 'We\'re pink because we eat the little pink things in the salt. You are what you eat. Look at you: you must eat words.', 'The magpies flew over and tried to steal our pink. Ha. It\'s inside.'][k % 3], ['Фламінго. Ми стоїмо на одній нозі, бо на двох — це вихваляння.', 'Ми рожеві, бо їмо маленьких рожевих істот у солі. Ти — те, що ти їси. Подивися на себе: ти, мабуть, їси слова.', 'Сороки прилітали й хотіли вкрасти наш рожевий колір. Ха. Він усередині.'][k % 3])
        : L('A flamingo, standing on one leg in the pink water. It looks at you down its very long nose.', 'Фламінго стоїть на одній нозі в рожевій воді. Дивиться на тебе вздовж свого дуже довгого дзьоба.')], done) })),
  ],
  solevar: [{ id: 'yavdokha', name: 'Baba Yavdokha', ua: 13, tx: 4, ty: 4, dir: 'down', pal: Object.assign(P_SEA('#c8383a', '#2b2230'), { h: '#e8e4da', H: '#bdb6a8' }), mods: ['skirt'],
    talk: [[L('Opanas has counted salt for forty years. Ask him how many children we have and he has to think. Three. It\'s three.', 'Опанас сорок років рахує сіль. А спитай, скільки в нас дітей, — мусить подумати. Троє. Їх троє.'),
      L('Salt keeps everything: cucumbers, fish, cabbage. My mother said it keeps words too. Salt your words, she said, and they\'ll last.', 'Сіль береже все: огірки, рибу, капусту. Мама казала, що й слова теж. Посоли свої слова, казала, і вони збережуться.')]] }],
  odesa: [
    { id: 'sonia', name: 'Titka Sonia the fishwife', ua: 13, tx: 7, ty: 16, dir: 'down', pal: Object.assign(P_SEA('#e86a8a', '#3a3046'), { h: '#c87a3a', H: '#a85a2a' }), mods: ['skirt', 'dots'], talk: soniaTalk },
    { id: 'fima', name: 'Uncle Fima', ua: 13, tx: 9, ty: 7, dir: 'down', pal: P_CITY('#5a5a6a', '#3a3046'), mods: ['hat', 'glasses'],
      talk: joker('fima', [L('Фіма. I sit by the opera and think. Today I\'m thinking: why does a city by the sea need an opera? Then I hear the opera, and I stop thinking.', 'Фіма. Я сиджу біля опери і думаю. Сьогодні думаю: навіщо місту біля моря опера? А тоді чую оперу і перестаю думати.')],
        [L('"What, is there actually another way?" Ha! Ha! My mother told me that one. Her mother told her. Nobody in this city has ever answered a question, and we\'re proud of it.', '«А що, насправді є інший спосіб?» Ха! Ха! Мені його мама розповіла. А їй її мама. Ніхто в цьому місті ще не відповів на жодне питання, і ми цим пишаємося.')]) },
    { id: 'lyova', name: 'Lyova', ua: 13, tx: 25, ty: 13, dir: 'down', pal: P_CITY('#e9b949', '#3a3046'), mods: ['hat'],
      talk: joker('lyova', [L('Льова. I show tourists the stairs. From the top, you see only the landings. From the bottom, only the steps. It\'s an optical trick. So is my price.', 'Льова. Я показую туристам сходи. Згори видно тільки майданчики. Знизу — тільки сходинки. Це оптичний обман. Моя ціна теж.')],
        [L('A thousand! Going up! Ha! I tell it to every tourist at the bottom, and they still go up. That\'s the joke. That\'s the whole joke.', 'Тисяча! Угору! Ха! Я розповідаю це кожному туристові внизу, і вони все одно йдуть угору. Це і є жарт. Увесь жарт.')]) },
    { id: 'captain', name: 'Captain Hryhorovych', ua: 13, tx: 18, ty: 25, dir: 'down', pal: P_STRIPES, mods: ['hat', 'moustache'], talk: captainTalk },
    { id: 'mania', name: 'Mania', ua: 13, tx: 33, ty: 24, dir: 'down', pal: P_SEA('#e8463c', '#e8463c'), mods: ['skirt', 'hat'],
      talk: joker('mania', [L('Маня. I come to the beach every day of the year. In January too. The sea likes company.', 'Маня. Я приходжу на пляж щодня, увесь рік. У січні теж. Море любить компанію.')],
        [L('"For a penguin, it\'s warm!" Ha! And my husband, look at him. He\'s been resting since 1987. He\'s very good at it.', '«Для пінгвіна — тепла!» Ха! А мій чоловік, подивися на нього. Він відпочиває з 1987 року. Дуже добре в нього виходить.')]) },
    { id: 'manyahusband', name: 'Mania\'s husband', ua: 13, tx: 35, ty: 25, dir: 'down', pal: P_SEA('#f4f1e6', '#3f6fc4'), mods: ['moustache'],
      talk: [[L('Zzz. Пляж: the beach. Zzz. Відпочинок: rest. Zzz.', 'Хррр. Пляж. Хррр. Відпочинок. Хррр.')]] },
    ...[[27, 25], [31, 26], [36, 22], [10, 24], [5, 22]].map(([tx, ty], k) => ({ id: 'gull' + k, kind: 'gull', tx, ty, dir: k % 2 ? 'left' : 'right', wander: 3,
      talk: (n, done) => say('', [S.f.fern ? L(['Чайка: a gull. Give me your bread. No? Then give me somebody else\'s.', 'In Odesa even the gulls talk. We talk the most. Have you got a fish? Have you got half a fish?', 'Ha-ha-ha! I\'m not laughing at you. I\'m laughing NEAR you.'][k % 3], ['Чайка. Дай хліба. Ні? Тоді дай чийсь чужий.', 'В Одесі навіть чайки говорять. А ми найбільше. Маєш рибу? Маєш півриби?', 'Ха-ха-ха! Я не з тебе сміюся. Я сміюся ПОРУЧ із тобою.'][k % 3])
        : L('A seagull: чайка. It looks at your pockets, then at you, then back at your pockets.', 'Чайка. Дивиться на твої кишені, потім на тебе, потім знову на кишені.')], done) })),
  ],
  vylkove: [
    { id: 'fedot', name: 'Did Fedot the boatman', ua: 13, tx: 8, ty: 25, dir: 'down', pal: Object.assign(P_LIPOVAN('#c8383a'), { h: '#d8d4cc', H: '#a9a49b' }), mods: ['moustache', 'hat'], talk: fedotTalk },
    { id: 'nastia', name: 'Nastia the postwoman', ua: 13, tx: 18, ty: 24, dir: 'down', pal: P_CITY('#3f6fc4', '#3a3046'), mods: ['skirt', 'hat'], talk: nastiaTalk },
    { id: 'tolik', name: 'Tolik the deckhand', ua: 13, tx: 23, ty: 24, dir: 'down', pal: P_STRIPES, mods: ['hat'], talk: tolikTalk },
    { id: 'kuzma', name: 'Kuzma the fisherman', ua: 13, tx: 7, ty: 17, dir: 'down', pal: P_LIPOVAN('#5a6a4a'), mods: ['hat', 'moustache'],
      talk: parcelTalk('kuzma', [L('Риба: fish. Осетер: a sturgeon. Оселедець: a herring. Дунайський оселедець is the best herring in the world, and I would know: I\'ve eaten all the others.', 'Риба. Осетер. Оселедець. Дунайський оселедець — найкращий у світі, і я знаю, бо їв усі інші.')],
        [L('A new net! My wife ordered it. She says the old one has more holes than net. She\'s right, but don\'t tell her.', 'Нова сітка! Дружина замовила. Каже, у старій більше дірок, ніж сітки. Вона права, тільки їй не кажи.')]) },
    { id: 'vasyl-v', name: 'Savva', ua: 13, tx: 23, ty: 24, dir: 'down', pal: P_LIPOVAN('#7a3e8a'), mods: ['moustache'],
      talk: parcelTalk('vasyl', [L('Акордеон! I play it every day. The neighbours have learned to swim faster.', 'Акордеон! Граю щодня. Сусіди навчилися швидше плавати.')],
        [L('New music! Now I can play something the neighbours haven\'t heard before. They\'ll be so pleased. [He doesn\'t sound sure.]', 'Нові ноти! Тепер зіграю щось, чого сусіди ще не чули. Вони так зрадіють. [Він каже це не дуже впевнено.]')]) },
    { id: 'sashko', name: 'Sashko and Natalka', ua: 13, tx: 39, ty: 17, dir: 'down', pal: P_SEA('#e8794a', '#3f6fc4'),
      talk: parcelTalk('twins', [L('We\'re twins. Близнюки. I\'m older. By eleven minutes. She says that doesn\'t count. It counts.', 'Ми близнюки. Я старший. На одинадцять хвилин. Вона каже, що це не рахується. Рахується.')],
        [L('Our kite! We\'re going to fly it over the Danube, all the way to Romania! [Natalka:] Not all the way.', 'Наш змій! Ми запустимо його над Дунаєм, аж до Румунії! [Наталка:] Не аж до.')]) },
    { id: 'natalka', name: 'Sashko and Natalka', ua: 13, tx: 40, ty: 17, dir: 'down', pal: P_SEA('#e86a8a', '#e86a8a'), mods: ['skirt'],
      talk: parcelTalk('twins', [L('I\'m Natalka. He\'s eleven minutes older and he never lets me forget it.', 'Я Наталка. Він на одинадцять хвилин старший і ніколи не дає мені про це забути.')],
        [L('A kite! It\'s red. Червоний. I wanted blue, but he wanted red, and he\'s older. By eleven minutes.', 'Змій! Червоний. Я хотіла синій, а він хотів червоний, а він старший. На одинадцять хвилин.')]) },
    { id: 'avdotia', name: 'Avdotia the baker', ua: 13, tx: 37, ty: 8, dir: 'down', pal: Object.assign(P_LIPOVAN('#f4efe2'), { h: '#c8a060', H: '#a8804a' }), mods: ['skirt'],
      talk: parcelTalk('avdotia', [L('Хліб: bread. Квас: kvass. I bake every morning at four. The whole of Vylkove smells of my bread by five, and by six they\'re all at my door.', 'Хліб. Квас. Я печу щоранку о четвертій. О п\'ятій усе Вилкове пахне моїм хлібом, а о шостій усі вже під моїми дверима.')],
        [L('My sieve! Now my bread will be white as a pelican. Come at six. I\'ll keep you one.', 'Моє сито! Тепер мій хліб буде білий, як пелікан. Приходь о шостій. Я тобі відкладу.')]) },
    { id: 'ulita', name: 'Baba Ulita', ua: 13, tx: 20, ty: 17, dir: 'down', pal: Object.assign(P_LIPOVAN('#2b2230'), { h: '#e8e4da', H: '#bdb6a8' }), mods: ['skirt'],
      talk: parcelTalk('ulita', [L('Who\'s that? Come closer. Closer. I can\'t see a thing without my glasses, and my glasses are in the post, and the post can\'t find me.', 'Хто це? Підійди ближче. Ближче. Я без окулярів нічого не бачу, а окуляри на пошті, а пошта не може мене знайти.')],
        [L('My glasses! Oh. Oh my. Is that what you look like? Is that what I look like? Is that what the Danube looks like? Goodness, it\'s big.', 'Мої окуляри! Ой. Ой-ой. То ось який ти? А я ось яка? А Дунай ось який? Божечки, який великий.')]) },
    ...[[36, 29], [39, 30], [41, 28], [33, 31]].map(([tx, ty], k) => ({ id: 'pelican' + k, kind: 'pelican', tx, ty, dir: k % 2 ? 'left' : 'right', water: true, wander: 2,
      talk: (n, done) => say('', [S.f.fern ? L(['Пелікан: a pelican. My beak holds more than my stomach. That\'s not a joke, it\'s biology.', 'We came from Africa for the summer. The fish here are excellent. The people are noisy.', 'A broom went over the delta and we all ducked. Pelicans don\'t duck, normally. We\'re pelicans.'][k % 3], ['Пелікан. У мій дзьоб влазить більше, ніж у шлунок. Це не жарт, це біологія.', 'Ми прилетіли з Африки на літо. Риба тут чудова. Люди галасливі.', 'Над дельтою пролетіла мітла, і ми всі пригнулися. Пелікани взагалі не пригинаються. Ми ж пелікани.'][k % 3])
        : L('A pelican, floating like a boat with a face. Its beak could hold a bucket.', 'Пелікан пливе, як човен з обличчям. У його дзьоб влізло б відро.')], done) })),
  ],
  chovnyar: [{ id: 'fedotwife', name: 'Baba Anfisa', ua: 13, tx: 4, ty: 4, dir: 'down', pal: Object.assign(P_LIPOVAN('#4f86c6'), { h: '#e8e4da', H: '#bdb6a8' }), mods: ['skirt'],
    talk: [[L('Fedot has rowed every inch of the delta. Ask him the way anywhere, he\'ll tell you. Ask him the way to the kitchen, he\'s lost.', 'Федот проплив кожен сантиметр дельти. Спитай у нього дорогу куди завгодно, скаже. Спитай дорогу до кухні, загубиться.')]] }],
  lipchurch: [{ id: 'otets-v', name: 'Father Nikon', ua: 13, tx: 3, ty: 6, dir: 'right', pal: P_MONK, mods: ['moustache'],
    talk: [[L('We are Old Believers, the Lipovans. We cross ourselves with two fingers, the old way, and sing from books with no notes, only little hooks. Знамена.', 'Ми старообрядці, липовани. Хрестимося двома пальцями, по-старому, і співаємо з книжок, де замість нот маленькі гачки. Знамена.'),
      L('Our forefathers came here three hundred years ago and kept their words the way the delta keeps its water: very carefully, and everywhere.', 'Наші предки прийшли сюди триста років тому й берегли свої слова так, як дельта береже воду: дуже дбайливо і всюди.')]] }],
});

// what to do next, by the sea: added to the "What now?" page
function seaText() {
  const f = S.f, been = id => !!(S.been && S.been[id]), out = [];
  if (badgeCount() >= SEA_NEED && !been('liman')) out.push('The chumak road south from the steppe is open now: the sea.');
  if (silStep() === 1) out.push('Help Opanas the salt master count the salt into the chumaks\' carts, at the liman.');
  if (odStep() === 1) out.push(humorCount() < 4 ? `Help Odesa's jokers finish their jokes (${humorCount()} of 4): Fima by the opera, Lyova on the stairs, the captain at the port, Mania on the beach.` : 'Tell Titka Sonia at the Pryvoz that the jokes have their endings.');
  if (poshStep() === 1) out.push(poshCount() < 5 ? `Deliver Nastia's parcels round the canals of Vylkove (${poshCount()} of 5).` : 'Tell Nastia the postwoman that every parcel is delivered.');
  if (poshStep() === 2) out.push('Ask Did Fedot the boatman in Vylkove about kilometre zero.');
  return out.length ? ' ' + out.join(' ') : '';
}
