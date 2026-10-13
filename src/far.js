// ─── Beyond the home region: Zaporizhzhia and Kyiv ────────────────────────
// Getting there: Semen's ferry runs downriver to the Sich once you hold SICH_NEED pysanky;
// Vasyl's маршрутка runs from Kalynivka to Kyiv once you hold KYIV_NEED.
const SICH_NEED = 3, KYIV_NEED = 5;
Object.assign(ITEMS, {
  letter: { ua: 'лист від тата', en: 'Did Panas\'s letter', desc: 'Folded small, smelling of the lake. On the front, in big careful letters: МИКИТІ. For Mykyta.' },
  tooth: { ua: 'вовчий зуб', en: 'a wolf\'s tooth', desc: 'From Ivan Sirko, the kharakternyk. Words come to whoever carries it, the way wolves come to the moon. (Wild words find you more often.)' },
  oar: { ua: 'весло', en: 'the lotsman\'s oar', desc: 'Kindrat\'s spare oar. Carved on the blade: «Греби, і Бог допоможе». Row, and God will help.' },
  ticket: { ua: 'квиток', en: 'a tram ticket', desc: 'From Mykyta. Punched once, good for ever, he says.' },
  lavracandle: { ua: 'тонка свічка', en: 'a thin wax candle', desc: 'From Sister Ahafia at the caves. It burns slowly and doesn\'t mind the dark.' },
  quill: { ua: 'перо літописця', en: 'the chronicler\'s quill', desc: 'Nestor\'s. Whatever is written with it, the magpies can\'t steal.' },
});
const travel = (to, tx, ty, dir) => { sfx('door'); warp = { to: { to, tx, ty, dir: dir || 'down' }, fade: 0, dir: 1 }; };
const menu = (opts, pick) => ({ options: opts, pick });

// ─── Getting there ────────────────────────────────────────────────────────
function semenTalk(npc, done) {
  const n = npc.name;
  const chat = () => say(n, [L('Пором: the ferry. Перевізник: the ferryman. I carry everyone across, and nobody ever asks how I am.', 'Пором. Перевізник. Я всіх перевожу, а мене ніхто не питає, як я.')], done);
  const sich = () => {
    if (badgeCount() < SICH_NEED) return say(n, [L('Downriver to the Sich? Ha. The kozaks don\'t let just anybody land on Khortytsia.', 'Униз до Січі? Ха. Козаки не пускають на Хортицю будь-кого.'),
      L(`Come back with ${SICH_NEED} pysanky and I'll take you. You have ${badgeCount()}.`, `Приходь, коли матимеш ${SICH_NEED} писанки, і я тебе повезу. У тебе ${badgeCount()}.`)], done);
    say(n, [L('Downriver to Khortytsia, then. Hold on to something. The Dnipro is wide down there, and proud of it.', 'Тоді вниз, на Хортицю. Тримайся. Дніпро там широкий і пишається цим.')], () => travel('khortytsia', 6, 26, 'right'));
  };
  if (!S.f.book) return chat();
  say(n, [L('Where to?', 'Куди?')], null, menu([L('The road', 'Шлях'), L('Down to the Sich', 'До Січі'), L('Just chatting', 'Просто поговорити')],
    i => i === 0 ? roadTeacher(npc, 5, done, chat) : i === 1 ? sich() : chat()));
}
function vasylTalk(npc, done) {
  const n = npc.name, inKyiv = area === 'podil';
  if (inKyiv) return say(n, [L('Back to Kalynivka? Hop in. Mind the chickens, somebody\'s bringing them to their sister.', 'Назад до Калинівки? Сідай. Обережно з курками, хтось везе їх сестрі.')], null,
    yesNo(go => go ? travel('kalynivka', 14, 12, 'down') : say(n, [L('I leave when the bus is full. Or when I\'m bored.', 'Я їду, коли маршрутка повна. Або коли мені нудно.')], done)));
  if (!S.f.book) return say(n, [L('Маршрутка: a minibus. Mine goes to Kyiv. Well, it goes towards Kyiv. Mostly it gets there.', 'Маршрутка. Моя їде до Києва. Ну, в бік Києва. Здебільшого доїжджає.')], done);
  if (badgeCount() < KYIV_NEED) return say(n, [L('To Kyiv? In the city they talk fast and they don\'t wait for you. You\'d be lost by the first tram stop.', 'До Києва? У місті говорять швидко й нікого не чекають. Ти загубишся вже на першій зупинці.'),
    L(`Win ${KYIV_NEED} pysanky first. You have ${badgeCount()}.`, `Спершу здобудь ${KYIV_NEED} писанок. У тебе ${badgeCount()}.`)], done);
  say(n, [L('To Kyiv? Sit down, pay later. Next stop: Podil.', 'До Києва? Сідай, заплатиш потім. Наступна зупинка: Поділ.')], null,
    yesNo(go => go ? travel('podil', 13, 17, 'down') : say(n, [L('Suit yourself.', 'Як хочеш.')], done)));
}

// ─── Khortytsia: the Sich, and the letter to Baba Yaga ────────────────────
// S.f.lyst: 1 Sirko read you her letter, 2 the reply is written, 3 Sirko gave you the wolf's tooth
const LETTER = [
  ['Запорозькі козаки — ___.', 'From the Zaporozhian kozaks, to Baba Yaga.', ['Бабі Язі', 'Баба Яга', 'Бабу Ягу'], 0, 'Кому? To whom: the dative. Баба Яга → Бабі Язі (г softens to з before -і).'],
  ['Ти, ___, не героїня, а стара мітла!', 'You, Baba Yaga, are no heroine, just an old broom!', ['Бабо Яго', 'Баба Яга', 'Бабі Язі'], 0, 'Calling someone: the vocative. Баба Яга → Бабо Яго!'],
  ['Ми не боїмося ні тебе, ні твоєї ___.', 'We fear neither you nor your army.', ['армії', 'армія', 'армію'], 0, 'Боятися (to fear) takes the genitive: чого? армія → армії.'],
  ['У тебе немає ___, тільки піч і мітла.', 'You have no friends, only a stove and a broom.', ['друзів', 'друзі', 'друзям'], 0, 'Немає (there is no) + the genitive: друзі → друзів.'],
  ['Наші слова — наша ___, і ми їх не віддамо.', 'Our words are our freedom, and we won\'t give them up.', ['воля', 'волю', 'волі'], 0, 'X is Y: both in the nominative, the dictionary form. Воля.'],
  ['Ми не віддамо ___ жодного слова.', 'We won\'t give you a single word.', ['тобі', 'ти', 'тебе'], 0, 'Віддати кому? The dative: ти → тобі. (After не: жодного слова, the genitive again.)'],
  ['Іди до своєї ___ і сиди тихо.', 'Go back to your hut and sit quietly.', ['хатинки', 'хатинка', 'хатинці'], 0, 'До (to, up to) + the genitive: хатинка → до хатинки.'],
  ['Козаки б\'ються без ___.', 'Kozaks fight without fear.', ['страху', 'страх', 'страхом'], 0, 'Без (without) + the genitive: страх → без страху.'],
  ['Слава ___ і козакам!', 'Glory to the Sich and to the kozaks!', ['Січі', 'Січ', 'Січчю'], 0, 'Слава кому? The dative: Січ → Січі, козаки → козакам.'],
  ['Пишемо ___ відповідь, як колись султанові.', 'We write you an answer, as we once wrote to the sultan.', ['тобі', 'тебе', 'ти'], 0, 'Писати кому? The dative: тобі. Masculine nouns often take -ові: султан → султанові.'],
  ['Ми переможемо тебе, як перемогли ___.', 'We\'ll beat you the way we beat the sultan.', ['султана', 'султан', 'султанові'], 0, 'Перемогти кого? The accusative. For people and animals it looks like the genitive: султан → султана.'],
  ['Писали козаки вільної ___.', 'Written by the kozaks of the free Sich.', ['Січі', 'Січ', 'Січчю'], 0, 'Козаки чого? Of something: the genitive. Вільна Січ → вільної Січі.'],
];
function sirkoTalk(npc, done) {
  const n = npc.name, l = S.f.lyst || 0;
  const test = () => keeperTalk(9, [L('Sich words: freedom, war and peace. Воля, війна, мир. A kozak needs all three, and in that order.', 'Січові слова: воля, війна, мир. Козакові потрібні всі три, і саме в такому порядку.')])(npc, done);
  const chat = () => say(n, [
    L('They call me a характерник. A kozak who knows a few tricks. They say I can turn into a wolf.', 'Мене називають характерником. Козак, що знає кілька хитрощів. Кажуть, я вмію перекидатися на вовка.'),
    L('Don\'t believe everything kozaks say. ...Mostly don\'t.', 'Не вір усьому, що кажуть козаки. ...Здебільшого не вір.'),
    ...(l >= 3 ? [L('The magpie took our reply away to the old forest. If I know the old woman, she won\'t answer in writing.', 'Сорока понесла нашу відповідь у старий ліс. Якщо я знаю ту стару, вона відповідатиме не листом.'),
      L('Her friends meet on Lysa Hora, above Kyiv. If you go to Kyiv, keep your ears open there.', 'Її подруги збираються на Лисій Горі над Києвом. Як будеш у Києві, слухай уважно.')] : [])], done);
  if (!S.f.book) return chat();
  const letter = () => {
    if (l === 0) {
      S.f.lyst = 1; saveSoon();
      return say(n, [L('You came at the right time. A magpie brought us a letter this morning. Listen to this.', 'Ти прийшов саме вчасно. Сьогодні вранці сорока принесла нам листа. Послухай.'),
        L('"I, Baba Yaga, mistress of the Old Forest, keeper of the stove, ruler of the broom, command you, Zaporozhians: hand over your words. All of them. Without a fight. And you shall live quietly. So quietly."',
          '«Я, Баба Яга, господиня Старого лісу, хранителька печі, володарка мітли, наказую вам, запорожцям: віддайте мені свої слова. Усі. Без бійки. І будете жити тихо. Так тихо.»'),
        L('Ha! Once the Turkish sultan wrote to us like that. We answered him so well that people still laugh about it.', 'Ха! Колись турецький султан писав нам так само. Ми йому так відповіли, що люди досі сміються.'),
        L('We\'ll answer her the same way. Pylyp the pysar is at the table on the maidan. But the words keep running off his page. Help him find them.', 'Відповімо й їй так само. Писар Пилип за столом на майдані. Але слова тікають з його сторінки. Допоможи йому їх знайти.')], done);
    }
    if (l === 1) return say(n, [L('Pylyp is at the table on the maidan, chewing his pen. Go and help him.', 'Пилип за столом на майдані, гризе перо. Іди допоможи.')], done);
    if (l === 2) {
      S.f.lyst = 3; saveSoon(); sfx('badge');
      return say(n, [L('The reply is done? Read it out! Loud, so the whole Sich hears.', 'Відповідь готова? Читай! Голосно, щоб уся Січ чула.'),
        L('[You read it out. The kozaks laugh so hard that one falls off the bench, and the cannon by the gate goes off on its own.]', '[Ти читаєш уголос. Козаки сміються так, що один падає з лави, а гармата біля брами стріляє сама.]'),
        L('The magpie will take it back. Good. Let her read it by the light of her own stove.', 'Сорока понесе її назад. Добре. Хай читає при світлі своєї печі.'),
        L('You\'re a kozak now, in the way that counts. Take this. A wolf\'s tooth. Words come to whoever carries it, the way wolves come to the moon.', 'Тепер ти козак, і саме так, як треба. Візьми. Вовчий зуб. Слова приходять до того, хто його носить, як вовки до місяця.'),
        give('tooth')], done);
    }
    return chat();
  };
  say(n, [L(`Pugu, ${myName()}! What do you need?`, `Пугу, ${myVoc()}! Чого тобі треба?`)], null,
    menu([L('Your test', 'Ваше випробування'), L('The letter', 'Лист'), L('Just chatting', 'Просто поговорити')], i => i === 0 ? test() : i === 1 ? letter() : chat()));
}
function pysarTalk(npc, done) {
  const n = npc.name, l = S.f.lyst || 0;
  const write = again => roadQuiz(shuffle(LETTER.slice()).slice(0, 10), 'ЛИСТ', q => {
    if (again) return say(n, [L(`${q.score} of 10. Still funny.`, `${q.score} з 10. Досі смішно.`)], done);
    if (q.stopped) return say(n, [L('Stopping? The ink will dry.', 'Зупиняєшся? Чорнило висохне.')], done);
    if (q.score < 8) return say(n, [L(`${q.score} of 10. If we send that, she\'ll laugh at US. Again, when you\'re ready.`, `${q.score} з 10. Якщо таке пошлемо, сміятиметься вона з НАС. Ще раз, коли будеш готовий.`)], done);
    S.f.lyst = 2; saveSoon(); sfx('ok');
    say(n, [L(`${q.score} of 10! Look at that. "Запорозькі козаки — Бабі Язі". A masterpiece.`, `${q.score} з 10! Ти диви. «Запорозькі козаки — Бабі Язі». Шедевр.`),
      L('Take it to the koshovyi. He\'ll want to read it out himself. Well, he\'ll want YOU to read it out.', 'Віднеси кошовому. Він захоче сам прочитати. Ну, захоче, щоб ТИ прочитав.')], done);
  }, ['ЛИСТ', 'Запорожці — Бабі Язі', 'the kozaks\' reply', 'Which word fits?'], 9);
  if (l === 1) return say(n, [L('Ah, the otaman sent you. Good. Every time I write a word, it gets up and walks off the page. Some witch\'s trick.', 'А, тебе отаман прислав. Добре. Щойно напишу слово, воно встає і йде зі сторінки. Якісь відьмині штучки.'),
    L('And worse: they come back in the wrong shape. I write «Баба Яга» and it should be «Бабі Язі». A letter goes TO somebody: кому? That\'s the dative.', 'І гірше: вони вертаються не в тій формі. Пишу «Баба Яга», а треба «Бабі Язі». Лист пишуть КОМУСЬ: кому? Це давальний відмінок.'),
    L('And after без, до, немає and боятися, it\'s the genitive: чого? армія → армії, страх → страху. Get the shapes right, or the old woman will laugh at us.', 'А після без, до, немає і боятися — родовий: чого? армія → армії, страх → страху. Добери правильні форми, бо стара ще й посміється з нас.'),
    L('You find the words, I\'ll write them fast before they escape. Ten lines. Get eight right.', 'Ти знаходиш слова, а я швидко пишу, поки не втекли. Десять рядків. Вісім правильних.')], null, yesNo(go => go ? write(false) : say(n, [L('I\'ll keep chewing my pen.', 'А я ще погризу перо.')], done)));
  if (l >= 2) return say(n, [L('People will laugh at that letter for three hundred years. Want to read it through again?', 'Із цього листа сміятимуться триста років. Хочеш перечитати?')], null, yesNo(go => go ? write(true) : done()));
  say(n, [L('I\'m the pysar: the scribe. Every kozak can fight. I can spell.', 'Я писар. Кожен козак уміє битися. А я вмію писати.'),
    L('Писати: to write. Лист: a letter. Перо: a pen, or a feather. Same thing, for me.', 'Писати. Лист. Перо. Для мене це одне й те саме.')], done);
}

// ─── The rapids: Kindrat the lotsman ──────────────────────────────────────
function kindratTalk(npc, done) {
  const n = npc.name;
  const test = () => keeperTalk(10, [L('Doing words. Grab, pull, push, jump, stand, sit. On the river you have no time for anything else.', 'Слова дії. Хапай, тягни, штовхай, стрибай, стій, сиди. На річці ні на що інше часу немає.')])(npc, done);
  const chat = () => say(n, [L('Лоцман: a river pilot. Nine rapids between here and the sea, and I know every stone in them by name.', 'Лоцман. Дев\'ять порогів звідси до моря, і я знаю кожен камінь у них на ім\'я.'),
    L('The worst is Ненаситець. The insatiable one. It eats boats and doesn\'t say thank you.', 'Найгірший — Ненаситець. Він їсть човни і не каже дякую.')], done);
  const run = () => {
    const first = !S.f.porohy;
    say(n, [L('Get in the chaika. You steer, I watch. Under the foam you won\'t see the rocks. I will.', 'Сідай у чайку. Ти кермуєш, я дивлюся. Під піною ти каменів не побачиш. А я побачу.'),
      L('So listen. I shout, you steer. Ліворуч: left. Праворуч: right. Прямо: straight on. And if I say НЕ, it means NOT. I\'ll only shout in Ukrainian. No time for anything else.',
        'Тож слухай. Я кричу, ти кермуєш. Ліворуч. Праворуч. Прямо. А коли я кажу НЕ, це означає НЕ. Кричатиму тільки українською. На інше часу немає.')], null, yesNo(go => {
      if (!go) return say(n, [L('The river will wait. It\'s good at that.', 'Річка почекає. Вона це вміє.')], done);
      shootRapids(r => {
        if (!r.ok) return say(n, [L(`We swam the last bit. ${r.passed} of 9 rapids. Dry off and try again.`, `Останній шматок ми пливли. ${r.passed} з 9 порогів. Обсохни і спробуй ще раз.`)], done);
        if (!first) return say(n, [L('All nine again! The river knows you now.', 'Знову всі дев\'ять! Річка тебе вже знає.')], done);
        S.f.porohy = 1; saveSoon(); sfx('badge');
        say(n, [L('All nine! Ненаситець too! Nobody does that the first time. Nobody.', 'Усі дев\'ять! І Ненаситець теж! Ніхто так не робить із першого разу. Ніхто.'),
          L('Halfway down, in the foam, I saw a broom go by. Tumbling, end over end. Somebody\'s been sweeping the river.', 'На півдорозі, в піні, я бачив мітлу. Крутилася, перекидалася. Хтось замітав річку.'),
          L('Take my spare oar. You\'ve earned it.', 'Візьми моє запасне весло. Ти його заробив.'), give('oar')], done);
      });
    }));
  };
  if (!S.f.book) return chat();
  say(n, [L('Well, landlubber?', 'Ну що, сухопутний?')], null, menu([L('Your test', 'Ваше випробування'), L('Shoot the rapids', 'Пройти пороги'), L('Just chatting', 'Просто поговорити')],
    i => i === 0 ? test() : i === 1 ? run() : chat()));
}

// ─── Podil: Did Panas's letter ────────────────────────────────────────────
// S.f.panas: 1 carrying the letter, 2 the taxi rank sent you to the tram, 3 the tram driver sent you to the bookshop,
// 4 the bookseller sent you to the café, 5 Mykyta has read it
const panasStep = () => S.f.panas || 0;
function panasTalk(npc, done) {
  const n = npc.name, p = panasStep();
  if (p >= 5) return say(n, [L('Mykyta came home on Sunday! With his little girl! She was scared of the Berehynia, and then she wanted to live in the lake.', 'Микита в неділю приїхав! З донечкою! Вона злякалася Берегині, а потім захотіла жити в озері.'),
    L('Sixty years I\'ve fished here, and that was the best catch.', 'Шістдесят років я тут рибалю, і це найкращий улов.')], done);
  if (p >= 1) return say(n, [L('Did you find him? Kyiv is big, but he\'ll be at the taxi rank by the fountain. He always was.', 'Ти його знайшов? Київ великий, але він буде на стоянці таксі біля фонтану. Завжди там був.')], done);
  if (!S.f.book) return say(n, [L('Sixty years I\'ve fished this lake. The fish know me. They avoid me.', 'Шістдесят років я ловлю рибу на цьому озері. Риба мене знає. І обходить.')], done);
  say(n, [L('My son Mykyta drives a taxi in Kyiv. One letter in a year. I\'ve read it so many times it\'s gone soft.', 'Мій син Микита возить таксі в Києві. Один лист за рік. Я перечитав його стільки разів, що він став м\'який.'),
    L('If you ever go to Kyiv, give him this. I\'m no good at writing. I just wrote: come home, the fish miss you. The fish don\'t. I do.', 'Якщо колись поїдеш до Києва, передай йому оце. Я не вмію писати. Я просто написав: приїжджай, риба скучає. Риба не скучає. Я скучаю.'),
    give('letter')], () => { S.f.panas = 1; saveSoon(); done(); });
}
function mykytaTalk(npc, done) {
  const n = npc.name, p = panasStep();
  const test = () => keeperTalk(11, [L('City words. Street, tram, building, traffic lights. Вулиця, трамвай, будинок. You learn them fast or you get run over.', 'Міські слова. Вулиця, трамвай, будинок. Їх вчиш швидко, або тебе переїдуть.')])(npc, done);
  const chat = () => say(n, [L('Taxi, taxi! Where to? Anywhere in Kyiv, as long as it\'s Podil.', 'Таксі, таксі! Куди їдемо? Куди завгодно в Києві, аби на Поділ.'),
    L('I came here from the villages at eighteen. My father still fishes on a lake near Vyshneve. Says the fish avoid him.', 'Я приїхав сюди із села у вісімнадцять. Мій батько досі рибалить на озері біля Вишневого. Каже, риба його обходить.')], done);
  if (!S.f.book) return chat();
  say(n, [L('Taxi?', 'Таксі?')], null, menu([L('Your test', 'Ваше випробування'), L('Just chatting', 'Просто поговорити')], i => i === 0 ? test() : chat()));
}
// Mykyta asks how you found him: tell him, with the right case for where and how
const PODIL_TELL = [
  ['Я приїхав до Києва ___.', 'I came to Kyiv by minibus.', ['маршруткою', 'маршрутка', 'маршрутку'], 0, 'How did you travel? The instrumental: маршрутка → маршруткою. Їхати трамваєм, автобусом, потягом.'],
  ['Тебе не було на ___ таксі.', 'You weren\'t at the taxi rank.', ['стоянці', 'стоянка', 'стоянку'], 0, 'Де? (where) на + the locative: стоянка → на стоянці. (к becomes ц before -і.)'],
  ['Водійка трамвая сказала, що ти був у ___.', 'The tram driver said you were at the bookshop.', ['книгарні', 'книгарня', 'книгарню'], 0, 'Де? у + the locative: книгарня → у книгарні.'],
  ['А пані Ірина сказала, що ти п\'єш каву в ___.', 'And Pani Iryna said you were drinking coffee in the café.', ['кав\'ярні', 'кав\'ярня', 'кав\'ярню'], 0, 'у + the locative: кав\'ярня → у кав\'ярні.'],
  ['Я їхав сюди ___ через увесь Поділ.', 'I rode here by tram right across Podil.', ['трамваєм', 'трамвай', 'трамваю'], 0, 'By what? The instrumental: трамвай → трамваєм.'],
];
function mykytaCafeTalk(npc, done) {
  const n = npc.name;
  if (!has('letter')) return say(n, [L('Day off. Coffee, a book for my daughter, and nobody saying "taxi".', 'Вихідний. Кава, книжка для доньки, і ніхто не каже «таксі».')], done);
  say(n, [L('You\'re from Vyshneve? You came all this way? How did you even find me? Tell me. Slowly. In Ukrainian, like at home.', 'Ти з Вишневого? Ти приїхав аж сюди? Як ти мене взагалі знайшов? Розкажи. Повільно. Українською, як удома.'),
    L('[Where you were: де? takes the locative, у книгарні, на стоянці. How you travelled: чим? takes the instrumental, трамваєм, маршруткою.]', '[Де? — місцевий відмінок: у книгарні, на стоянці. Чим? — орудний: трамваєм, маршруткою.]')], () =>
    roadQuiz(PODIL_TELL.slice(), 'ПОДІЛ', q => {
      if (q.stopped || q.score < 4) return say(n, [L(`${q.score} of 5. Hold on, you've lost me. Where were you? Tell me again.`, `${q.score} з 5. Стривай, я заплутався. Де ти був? Розкажи ще раз.`)], done);
      take('letter'); S.f.panas = 5; saveSoon(); sfx('ok');
      say(n, [L('All that, for... a letter? From my тато?', 'І все це заради... листа? Від мого тата?'),
    L('[Mykyta reads it. Then he reads it again. Then he looks out of the window for a long time.]', '[Микита читає. Потім читає ще раз. Потім довго дивиться у вікно.]'),
    L('"Come home, the fish miss you." Ha. The fish.', '«Приїжджай, риба скучає.» Ха. Риба.'),
    L('I stopped writing because I couldn\'t find the words. In the city it got so quiet inside me. As if somebody had swept them out.', 'Я перестав писати, бо не міг знайти слів. У місті всередині мене стало так тихо. Ніби хтось їх вимів.'),
    L('I\'m going home on Sunday. Me and Zoryana. Take this: a tram ticket. Punched once, good for ever.', 'У неділю поїду додому. Я і Зоряна. Візьми: квиток на трамвай. Прокомпостований раз, дійсний назавжди.'),
    give('ticket'), L('And come and find me at the taxi rank. I test everyone on city words. Even my passengers.', 'І приходь до мене на стоянку таксі. Я всіх перевіряю на міські слова. Навіть пасажирів.')], done);
    }, ['ПОДІЛ', 'Як ти мене знайшов?', 'how you found Mykyta', 'Where? How?'], 11));
}
// the people of Podil point the way: in Ukrainian only. You'll have to understand them.
function clueTalk(step, next, line, fallback) {
  return (npc, done) => {
    const p = panasStep();
    if (p < step || p >= 5) return say(npc.name, fallback, done);
    if (p === step) { S.f.panas = next; saveSoon(); }
    const firstClue = !S.f.clueNote;
    S.f.clueNote = 1;
    say(npc.name, [line, ...(firstClue ? [L('[Kyivans talk fast, and only in Ukrainian. Listen carefully.]', '[Кияни говорять швидко і тільки українською. Слухай уважно.]')] : [])], done);
  };
}

// ─── The Lavra: the chronicle and the caves ───────────────────────────────
// S.f.litopys: 1 Pimen asked for help, 2 every page found and Nestor has spoken, 3 Pimen has his chronicle back.
// S.f.pages: one bit per page found in the caves.
const PAGES = [
  ['Нестор ___ літопис тут, у цих печерах.', 'Nestor wrote the chronicle here, in these caves.', ['писав', 'пише', 'писатиме'], 0, 'The past tense: писати → він писав. He -в, she -ла, it -ло, they -ли.'],
  ['На Великдень ми завжди ___ писанки.', 'At Easter we always painted pysanky.', ['розписували', 'розписуємо', 'розписуватимемо'], 0, 'We, in the past: -ли. Ми розписували.'],
  ['Колись на Різдво всі ___ колядки.', 'Long ago, at Christmas, everybody sang carols.', ['співали', 'співають', 'співатимуть'], 0, 'Колись: once, long ago. The past tense: вони співали.'],
  ['Княгиня Ольга ___ в Києві.', 'Princess Olha lived in Kyiv.', ['жила', 'жив', 'живе'], 0, 'She, in the past: -ла. Вона жила. (He: він жив.)'],
  ['Хто не ___ минулого, той не має майбутнього.', 'Whoever doesn\'t remember the past has no future.', ['пам\'ятає', 'пам\'ятав', 'пам\'ятала'], 0, 'A saying is true at any time, so it\'s in the present: пам\'ятає. Пам\'ять: memory.'],
];
const pageFound = k => !!((S.f.pages || 0) & (1 << k));
const pagesFound = () => PAGES.filter((_, k) => pageFound(k)).length;
function pimenTalk(npc, done) {
  const n = npc.name, l = S.f.litopys || 0;
  const test = () => keeperTalk(12, [L('My words are the big ones. Life, memory, truth, the feasts. Життя, пам\'ять, правда. They don\'t fit in your pocket, but you can carry them.', 'Мої слова великі. Життя, пам\'ять, правда, свята. У кишеню не влізуть, але нести їх можна.')])(npc, done);
  const chat = () => say(n, [L('Літопис: a chronicle. Monks in this Lavra have written down what happened, year by year, for nine hundred years.', 'Літопис. Монахи цієї Лаври записують, що сталося, рік за роком, уже дев\'ятсот років.'),
    L('The first was Nestor. He lies in the caves below us. Some nights I think I hear his pen.', 'Першим був Нестор. Він лежить у печерах під нами. Деякими ночами мені здається, що я чую його перо.')], done);
  const chronicle = () => {
    if (l === 0) {
      S.f.litopys = 1; saveSoon();
      return say(n, [L('The chronicle is going blank. Not fading: emptying. A word here, a line there. This morning a whole year was gone.', 'Літопис порожніє. Не вицвітає, а порожніє. Тут слово, там рядок. Сьогодні вранці зник цілий рік.'),
        L('On the windowsill I found a magpie feather. Black and white. It smelled of smoke.', 'На підвіконні я знайшов сорочине перо. Чорне з білим. Пахло димом.'),
        L('And look what\'s left: «Нестор пише», as if he were still alive. The chronicle is all past tense, and it\'s losing its endings. Він писав, вона жила, вони співали.', 'І глянь, що лишилося: «Нестор пише», ніби він досі живий. Літопис увесь у минулому часі, а закінчення губляться. Він писав, вона жила, вони співали.'),
        L('The words have fled somewhere dark and quiet, where nobody would think to look. The caves. Go down with a candle and bring back the pages. Sister Ahafia at the cave door has candles.', 'Слова втекли кудись у темне й тихе місце, де ніхто не шукатиме. У печери. Спустися зі свічкою і принеси сторінки. У сестри Агафії біля входу до печер є свічки.')], done);
    }
    if (l === 1) return say(n, [L(`You've found ${pagesFound()} of ${PAGES.length} pages. The caves are under the hill, south of the walls.`, `Ти знайшов ${pagesFound()} з ${PAGES.length} сторінок. Печери під пагорбом, на південь від мурів.`)], done);
    if (l === 2) {
      S.f.litopys = 3; saveSoon(); sfx('badge');
      return say(n, [L('You found them all? And... Nestor spoke to you?', 'Ти знайшов усі? І... Нестор говорив з тобою?'),
        L('[Pimen lays the pages in the chronicle. One by one the empty lines fill with ink, as if someone is writing them very fast.]', '[Пимен кладе сторінки в літопис. Порожні рядки один за одним наповнюються чорнилом, ніби хтось дуже швидко пише.]'),
        L('Then I\'ll write this down too: in this year a young traveller from Vyshneve went into the dark and brought back the words.', 'Тоді я запишу й це: цього року юний мандрівник із Вишневого спустився в темряву і виніс звідти слова.')], done);
    }
    return chat();
  };
  say(n, [L('Peace to you. What is it?', 'Мир тобі. Що таке?')], null, menu([L('Your test', 'Ваше випробування'), L('The chronicle', 'Літопис'), L('Just chatting', 'Просто поговорити')],
    i => i === 0 ? test() : i === 1 ? chronicle() : chat()));
}
function ahafiaTalk(npc, done) {
  const n = npc.name;
  if (!has('lavracandle')) return say(n, (S.f.litopys || 0) >= 1 ? [L('Brother Pimen sent you down? Then take a candle. It\'s dark as the inside of a pich down there.', 'Брат Пимен посилає тебе вниз? Тоді візьми свічку. Там темно, як у печі.'), give('lavracandle')]
    : [L('Going down to the saints? Good. Everybody should, once. But not in the dark: take a candle.', 'Ідеш до святих? Добре. Кожен має хоч раз піти. Тільки не в темряві: візьми свічку.'),
      L('Go quietly, and say hello to Brother Ioan. He has been down there so long he knows every niche by name.', 'Іди тихо і привітайся з братом Іоаном. Він там так давно, що знає кожну нішу на ім\'я.'), give('lavracandle')], done);
  say(n, [L('Свічка: a candle. Печера: a cave. Light one for somebody you remember.', 'Свічка. Печера. Запали одну за того, кого пам\'ятаєш.')], done);
}
function pageTalk(k) {
  return (npc, done) => {
    const it = PAGES[k];
    say('', [L('A page lies in the dust, glowing faintly. One word on it has gone, and the line is waiting.', 'На порохах лежить сторінка, ледь світиться. Одного слова на ній бракує, і рядок чекає.')], () =>
      roadQuiz([it], 'ЛІТОПИС', q => {
        if (q.score < 1) return say('', [L('The page flutters out of your hand and settles again a little further on. Try again.', 'Сторінка випурхує з рук і лягає трохи далі. Спробуй ще раз.')], done);
        S.f.pages = (S.f.pages || 0) | (1 << k); saveSoon(); sfx('item');
        say('', [L(`The word settles back into its line. [Pages found: ${pagesFound()} of ${PAGES.length}]`, `Слово повертається на своє місце. [Знайдено сторінок: ${pagesFound()} з ${PAGES.length}]`)], done);
      }, ['ЛІТОПИС', 'Сторінка', 'the chronicle', 'Which word is missing?'], 12));
  };
}
function nestorTalk(npc, done) {
  const n = npc.name;
  if ((S.f.litopys || 0) >= 2) return say(n, [L('Write it all down. A people that remembers can\'t be swept away.', 'Записуй усе. Народ, який пам\'ятає, не можна вимести.')], done);
  if (pagesFound() < PAGES.length) return say(n, [L('...', '...'), L(`[A figure in a monk's habit, made of candlelight. He points back into the passages. ${PAGES.length - pagesFound()} pages are still lost.]`,
    `[Постать у чернечій рясі, зіткана зі світла свічки. Він показує назад, у ходи. Ще ${PAGES.length - pagesFound()} сторінок загублено.]`)], done);
  S.f.litopys = 2; saveSoon(); sfx('night');
  say(n, [L('You found them. Every one. I am Nestor, who first wrote down where this land came from.', 'Ти їх знайшов. Усі. Я Нестор, той, хто першим записав, звідки пішла ця земля.'),
    L('I have seen her before, the one with the bone leg. In the year Kyiv burned, she came through the smoke with her broom, sweeping up the names of the dead.', 'Я вже бачив її, ту, що з кістяною ногою. У рік, коли горів Київ, вона йшла крізь дим зі своєю мітлою і вимітала імена загиблих.'),
    L('We hid them here, in the dark, and wrote them down. She can burn a city. She cannot burn what is remembered.', 'Ми сховали їх тут, у темряві, і записали. Вона може спалити місто. Але не може спалити те, що пам\'ятають.'),
    L('Take my quill. Whatever is written with it, the magpies can\'t steal. Now go up into the light and give Pimen his pages.', 'Візьми моє перо. Що ним написано, того сороки не вкрадуть. А тепер іди нагору, до світла, і віддай Пименові сторінки.'),
    give('quill')], done);
}

// ─── The people ───────────────────────────────────────────────────────────
const P_KOZAK = { h: '#2b2230', H: '#1a141e', w: '#fbf8f0', W: '#d6d0c2', r: '#c8383a', x: '#c49a3e', p: '#3f6fc4', P: '#2d4f91', b: '#7a3b22' };
const P_MONK = { h: '#3a3046', H: '#241c28', w: '#2b2230', W: '#1a141e', r: '#2b2230', x: '#3a3046', p: '#2b2230', P: '#1a141e', b: '#1a141e' };
const P_CITY = (coat, trousers) => ({ h: '#5a3a22', H: '#3a2414', w: coat, W: shade(coat), r: coat, x: '#3a3046', p: trousers, P: shade(trousers), b: '#2b2230' });
Object.assign(NPCS, {
  khortytsia: [
    { id: 'ivansirko', name: 'Ivan Sirko', ua: 7, tx: 23, ty: 16, dir: 'down', pal: Object.assign({}, P_KOZAK, { h: '#d8d4cc', H: '#a9a49b', r: '#7a1f28', p: '#7a1f28', P: '#4f141a' }), mods: ['moustache', 'chub'], talk: sirkoTalk },
    { id: 'pysar', name: 'Pylyp the pysar', ua: 5, tx: 27, ty: 17, dir: 'left', pal: Object.assign({}, P_KOZAK, { r: '#3a6a3a', p: '#5a4a3a' }), mods: ['moustache', 'chub'], talk: pysarTalk },
    { id: 'holota', name: 'Kozak Holota', ua: 5, tx: 20, ty: 17, dir: 'right', wander: 1, pal: Object.assign({}, P_KOZAK, { w: '#d6c7a8', p: '#8a5a35' }), mods: ['moustache', 'chub'],
      talk: [[L('Голота: "the poor". I own a sabre, a pipe and a song. Rich!', 'Голота — це бідняк. У мене є шабля, люлька і пісня. Багач!'),
        L('The Sich has one law: nobody asks where you came from. Закон: law. Only where you\'re going.', 'На Січі один закон: ніхто не питає, звідки ти прийшов. Тільки куди йдеш.')],
        [L('Пугу-пугу! That\'s how kozaks call to each other in the steppe, like owls. If somebody answers "козак з лугу", he\'s one of us.', 'Пугу-пугу! Так козаки перекликаються в степу, як сови. Якщо відповідають «козак з лугу», це свій.')]] },
    { id: 'kyrylo', name: 'Kyrylo', ua: 3, tx: 30, ty: 19, dir: 'left', wander: 2, pal: Object.assign({}, P_KOZAK, { h: '#c4762e', H: '#9a5420', r: '#3f6fc4', p: '#c8383a', P: '#8f2430' }),
      talk: [[L('I came to the Sich last spring. Before you\'re a kozak you\'re a молодик: a new one. You cook, you row, you listen.', 'Я прийшов на Січ минулої весни. Поки не козак, ти молодик. Вариш, веслуєш, слухаєш.'),
        L('Next year they\'ll shave my head and leave the чуб. Then I\'ll look like a real kozak. Mama will cry.', 'Наступного року мені поголять голову й залишать чуб. Тоді буду як справжній козак. Мама плакатиме.')]] },
    { id: 'sichdog', kind: 'dog', name: 'Sirko\'s dog', tx: 21, ty: 12, dir: 'right', wander: 2,
      talk: (n, done) => say('', [S.f.fern ? L('Woof. I am the otaman\'s dog. He is named after nobody. The dogs of Ukraine are named after HIM.', 'Гав. Я пес отамана. Його ні на чию честь не названо. Це собак в Україні називають на його честь.')
        : L('A big grey dog. He looks at you as if he\'s heard about you.', 'Великий сірий пес. Дивиться на тебе так, ніби вже про тебе чув.')], done) },
  ],
  kurin: [{ id: 'pavlo', name: 'Pavlo the cook', ua: 5, tx: 5, ty: 6, dir: 'up', pal: Object.assign({}, P_KOZAK, { w: '#efe8d8', r: '#efe8d8', p: '#5a4a3a' }), mods: ['moustache', 'chub'],
    talk: [[L('Куліш! Millet porridge with a bit of fat and a lot of hunger. Breakfast, lunch and supper.', 'Куліш! Пшоно, трошки сала і багато голоду. Сніданок, обід і вечеря.'),
      L('A kurin eats from one pot. That\'s what a kurin is: a pot with men round it.', 'Курінь їсть з одного казана. Курінь — це казан, а довкола нього козаки.')]] }],
  sichchurch: [{ id: 'netiaha', name: 'Kozak Netiaha', ua: 5, tx: 6, ty: 6, dir: 'up', pal: Object.assign({}, P_KOZAK, { r: '#2b2230', p: '#2b2230' }), mods: ['moustache', 'chub'],
    talk: [[L('Покрова: the Protection of the Mother of God. The kozaks\' feast, in October. She holds her veil over the Sich.', 'Покрова — козацьке свято, у жовтні. Богородиця тримає свій покров над Січчю.'),
      L('Kozaks fight, drink and swear. But in here, they take their hats off.', 'Козаки б\'ються, п\'ють і лаються. Але тут вони знімають шапки.')]] }],
  rapids: [
    { id: 'kindrat', name: 'Kindrat the lotsman', ua: 5, tx: 12, ty: 12, dir: 'down', pal: { h: '#8a8a8a', H: '#6a6a6a', w: '#e8e2d2', r: '#3f6f95', x: '#3f6f95', p: '#4a4a5a', b: '#3a2a22' }, mods: ['hat', 'moustache'], talk: kindratTalk },
    { id: 'danylko', name: 'Danylko', ua: 1, tx: 18, ty: 8, dir: 'right', pal: { h: '#e8c46a', H: '#c49a3e', w: '#fbf8f0', p: '#6a6a3a', b: '#7a3b22' },
      talk: [[L('Tato is a lotsman. When I\'m big, I\'ll be a lotsman. Tato says first I have to learn to swim. And to listen.', 'Тато — лоцман. Коли виросту, теж буду лоцманом. Тато каже, спершу треба навчитися плавати. І слухати.')],
        [L('Ліворуч, праворуч, прямо! I practise on the goats. They don\'t listen either.', 'Ліворуч, праворуч, прямо! Я тренуюся на козах. Вони теж не слухають.')]] },
  ],
  lotsman: [{ id: 'paraska2', name: 'Teklia', ua: 3, tx: 5, ty: 4, dir: 'down', pal: P_OLENA, mods: ['skirt', 'dots'],
    talk: [[L('Nine rapids, nine names. Кодацький, Сурський, Лоханський, Дзвонецький, Ненаситець, Вовнизький, Будилівський, Лишній, Вільний.', 'Дев\'ять порогів, дев\'ять імен. Кодацький, Сурський, Лоханський, Дзвонецький, Ненаситець, Вовнизький, Будилівський, Лишній, Вільний.'),
      L('Дзвонецький rings like a bell. Вовнизький is the wolf. And the last one is Вільний: free. Because after it, you are.', 'Дзвонецький дзвенить, як дзвін. Вовнизький — то вовк. А останній — Вільний. Бо після нього ти вільний.')]] }],
  podil: [
    ...[[18, 8], [20, 8], [21, 6], [17, 6], [19, 9]].map(([tx, ty], k) => ({ id: 'pigeon' + k, kind: 'pigeon', tx, ty, dir: k % 2 ? 'left' : 'right', wander: 2, talk: pigeonTalk })),
    { id: 'mykyta', name: 'Mykyta the cabbie', ua: 5, tx: 23, ty: 16, dir: 'down', when: () => !(panasStep() >= 1 && panasStep() < 5), pal: P_CITY('#e9b949', '#3a3046'), mods: ['hat'], talk: mykytaTalk },
    { id: 'ruslan', name: 'Ruslan, a taxi driver', ua: 5, tx: 25, ty: 17, dir: 'left', pal: P_CITY('#4f86c6', '#3a3046'), mods: ['hat', 'moustache'],
      talk: clueTalk(1, 2, 'Микити сьогодні немає. У нього вихідний. Спитай у водійки трамвая, вона все знає.', [L('Taxi rank: стоянка таксі. Mykyta is our best driver. And our loudest.', 'Стоянка таксі. Микита наш найкращий водій. І найгучніший.')]) },
    { id: 'nina', name: 'Nina the tram driver', ua: 5, tx: 32, ty: 11, dir: 'left', pal: P_CITY('#c8383a', '#3a3046'), mods: ['skirt'],
      talk: clueTalk(2, 3, 'Микита? Так, бачила. Він пішов до книгарні, біля парку. Купує книжку для доньки.', [L('Трамвай: a tram. Зупинка: a stop. Квиток: a ticket. Next stop, Kontraktova!', 'Трамвай. Зупинка. Квиток. Наступна зупинка — Контрактова!')]) },
    { id: 'solomiia', name: 'Pani Solomiia', ua: 5, tx: 19, ty: 7, dir: 'down', wander: 1, pal: { h: '#e8e4da', H: '#bdb6a8', w: '#2b2230', W: '#1a141e', r: '#7a3e8a', x: '#4f2459', p: '#2b2230', P: '#1a141e', b: '#1a141e' }, mods: ['skirt'],
      talk: [[L('I feed the pigeons. Голуби. They tell me things. Pigeons are terrible gossips.', 'Я годую голубів. Вони мені все розказують. Голуби — жахливі пліткарі.'),
        L('Do you see that hill over there? Лиса Гора. Bald Mountain. On Kupala night the witches of Kyiv used to fly there and dance. My sisters and I.', 'Бачиш он ту гору? Лиса Гора. На Купала київські відьми злітались туди танцювати. Я з сестрами.'),
        L('Now somebody new runs the gatherings. She has a bone leg and no manners, and she makes everybody whisper. Witches don\'t whisper, dear. We shriek.', 'Тепер там заправляє якась нова. З кістяною ногою і без манер, і всіх змушує шепотіти. Відьми не шепочуть, серденько. Ми верещимо.')],
        [L('Her magpies fly from Lysa Hora every night, over the Lavra and away west. Carrying something. Words, my pigeons say.', 'Її сороки щоночі летять з Лисої Гори, над Лаврою, і далі на захід. Щось несуть. Слова, кажуть мої голуби.')]] },
    { id: 'olia', name: 'Olia the painter', ua: 3, tx: 4, ty: 7, dir: 'right', pal: { h: '#c4762e', H: '#9a5420', w: '#4c9c66', W: '#2f6b45', r: '#4c9c66', x: '#e9b949', p: '#3a3046', P: '#241c28', b: '#2b2230' }, mods: ['skirt'],
      talk: [[L('Андріївський узвіз: St Andrew\'s Descent. Painters, books, junk and treasure, all the way up the hill.', 'Андріївський узвіз. Художники, книжки, мотлох і скарби, аж до верху пагорба.'),
        L('I paint the chestnuts. Каштани. Every May I think I\'ve got them right, and every May they\'re whiter than my paint.', 'Я малюю каштани. Щотравня мені здається, що вийшло, і щотравня вони біліші за мою фарбу.')]] },
    { id: 'vasyl-k', name: 'Vasyl the driver', ua: 5, tx: 13, ty: 16, dir: 'up', pal: P_CITY('#5a5a3a', '#3a3046'), mods: ['hat', 'moustache'], talk: vasylTalk },
  ],
  cafe: [
    { id: 'mykyta-cafe', name: 'Mykyta', ua: 5, tx: 3, ty: 3, dir: 'down', when: () => panasStep() >= 1 && panasStep() < 5, pal: P_CITY('#e9b949', '#3a3046'), mods: ['hat'], talk: mykytaCafeTalk },
    { id: 'oles', name: 'Oles the barista', ua: 3, tx: 9, ty: 3, dir: 'left', pal: P_CITY('#fbf8f0', '#3a3046'),
      talk: [[L('Кава: coffee. З молоком: with milk. Без цукру: without sugar. Ще одну: one more.', 'Кава. З молоком. Без цукру. Ще одну.'),
        L('People in Lviv say Kyiv doesn\'t know coffee. People in Kyiv say Lviv doesn\'t know anything else.', 'У Львові кажуть, що Київ не знає кави. У Києві кажуть, що Львів більше нічого не знає.')]] },
  ],
  bookshop: [{ id: 'iryna', name: 'Pani Iryna', ua: 5, tx: 7, ty: 3, dir: 'down', pal: P_HANNA, mods: ['skirt', 'glasses'],
    talk: clueTalk(3, 4, 'Так, Микита був тут. Купив казки для доньки. Тепер він п\'є каву в кав\'ярні, на півночі, біля церкви.',
      [L('Книгарня: a bookshop. Бібліотека: a library. The difference: here you pay, there you whisper.', 'Книгарня. Бібліотека. Різниця: тут платиш, там шепочеш.')]) }],
  flat: [{ id: 'zoryana', name: 'Zoryana', ua: 1, tx: 4, ty: 4, dir: 'down', pal: { h: '#3a2a22', H: '#241812', w: '#fbf8f0', r: '#e9b949', x: '#e9b949', p: '#4f86c6', P: '#3a68a4', b: '#7a3b22' }, mods: ['skirt'],
    talk: [[L(panasStep() >= 5 ? 'We\'re going to Grandpa\'s on Sunday! He has a lake! And a Berehynia in it!' : 'My grandpa lives by a lake, far away. I\'ve never been there. Tato says it\'s too far. It isn\'t, is it?',
      panasStep() >= 5 ? 'У неділю ми їдемо до дідуся! У нього є озеро! І в ньому Берегиня!' : 'Мій дідусь живе біля озера, далеко. Я там ніколи не була. Тато каже, що далеко. Це ж не далеко, правда?')]] }],
  lavra: [
    { id: 'ahafia', name: 'Sister Ahafia', ua: 5, tx: 23, ty: 27, dir: 'left', pal: Object.assign({}, P_MONK, { s: '#f6d0a8' }), mods: ['skirt'], talk: ahafiaTalk },
    { id: 'fedir', name: 'Brother Mytrofan', ua: 5, tx: 28, ty: 8, dir: 'down', pal: P_MONK, mods: ['moustache'],
      talk: [[L('Дзвін: a bell. Дзвіниця: a bell tower. Дзвонити: to ring. And also: to phone. My grandson says he will дзвонити me every Sunday. He doesn\'t.', 'Дзвін. Дзвіниця. Дзвонити. А ще так кажуть про телефон. Онук обіцяє дзвонити щонеділі. Не дзвонить.'),
        L('When the big bell rings, the whole of Kyiv hears it. Lately the magpies sit on it and it rings quieter.', 'Коли дзвонить великий дзвін, його чує весь Київ. Останнім часом на ньому сидять сороки, і він дзвонить тихіше.')]] },
    { id: 'ulyana', name: 'Baba Ulyana', ua: 3, tx: 18, ty: 13, dir: 'right', wander: 1, pal: { h: '#3f6fc4', H: '#2d4f91', w: '#efe8d8', r: C.red, x: C.red, p: '#3a2e3e', b: '#3a2a22' }, mods: ['skirt', 'dots'],
      talk: [[L('I walked here from Poltava. Прочанка: a pilgrim. My knees say it was further than that.', 'Я прийшла сюди пішки з Полтави. Я прочанка. Коліна кажуть, що було далі.'),
        L('Великдень: Easter. You say «Христос воскрес!» and the answer is «Воістину воскрес!». Practise. Baba Hanna will test you.', 'На Великдень кажуть «Христос воскрес!», а відповідають «Воістину воскрес!». Повправляйся. Баба Ганна перевірить.')]] },
  ],
  cell: [{ id: 'pimen', name: 'Brother Pimen', ua: 7, tx: 5, ty: 3, dir: 'left', pal: Object.assign({}, P_MONK, { h: '#d8d4cc', H: '#a9a49b' }), mods: ['moustache'], talk: pimenTalk }],
  lavrachurch: [{ id: 'serhiy', name: 'Brother Serhiy', ua: 5, tx: 5, ty: 6, dir: 'up', pal: P_MONK,
    talk: [[L('Успіння: the Dormition. The falling asleep of the Mother of God. This church is named for it.', 'Успіння Богородиці. Цей собор названий на його честь.'),
      L('It has been blown up, burned and rebuilt. It keeps coming back. Like a word you can\'t forget.', 'Його підривали, палили і відбудовували. Він щоразу повертається. Як слово, яке не можна забути.')]] }],
  caves: [
    { id: 'nestor', name: 'Nestor the chronicler', ua: 7, tx: 25, ty: 4, dir: 'down', ghost: true, glow: true, when: () => (S.f.litopys || 0) >= 1,
      pal: { h: '#f6ecc8', H: '#e0d4a8', w: '#f6ecc8', W: '#e0d4a8', r: '#e0d4a8', x: '#c9b888', p: '#f6ecc8', P: '#e0d4a8', b: '#c9b888', s: '#fbf6e2', S: '#efe4c4', m: '#fbf6e2' }, mods: ['moustache'], talk: nestorTalk },
    { id: 'ioan', name: 'Brother Ioan', ua: 5, tx: 16, ty: 20, dir: 'right', pal: Object.assign({}, P_MONK, { h: '#8a8a8a', H: '#6a6a6a' }), mods: ['moustache'], talk: ioanTalk },
    ...[[10, 5], [4, 13], [14, 21], [24, 3], [20, 7]].map(([tx, ty], k) => ({ id: 'page' + k, kind: 'page', glow: true, tx, ty, when: () => (S.f.litopys || 0) >= 1 && !pageFound(k), talk: pageTalk(k) })),
  ],
});
NPCS.kalynivka.push({ id: 'vasyl', name: 'Vasyl the driver', ua: 5, tx: 14, ty: 11, dir: 'down', pal: P_CITY('#5a5a3a', '#3a3046'), mods: ['hat', 'moustache'], talk: vasylTalk });
NPCS.ferry.find(n => n.id === 'semen').talk = semenTalk;
NPCS.lake.find(n => n.id === 'panas').talk = panasTalk;

Object.assign(STORY_LOOK, {
  'khortytsia:T': () => { say('', [L('A table on the maidan, spread with paper, ink and somebody\'s supper. This is where the Sich writes its letters.', 'Стіл на майдані: папір, чорнило і чиясь вечеря. Тут Січ пише свої листи.')]); return true; },
  'khortytsia:O': () => { say('', [L('The Zaporizhzhian oak. Seven hundred years old. They say Bohdan Khmelnytsky read his letters under it, and the kozaks swore their oaths.', 'Запорізький дуб. Йому сімсот років. Кажуть, під ним Богдан Хмельницький читав листи, а козаки складали присягу.')]); return true; },
  'khortytsia:h': () => { say('', [L('A kozak horse grazing outside the palisade. Кінь. It doesn\'t look up.', 'Козацький кінь пасеться за частоколом. Навіть голови не піднімає.')]); return true; },
  'khortytsia:z': () => { say('', [L('Semen\'s ferry, waiting to take you back upriver. Walk to the end of the pier when you want to go.', 'Пором Семена чекає, щоб повезти тебе вгору по річці. Коли захочеш, іди на край пристані.')]); return true; },
  'rapids:<': () => { say('', [L('Kindrat\'s chaika, rocking in the current. He won\'t let you take it without him. Talk to Kindrat.', 'Чайка Кіндрата гойдається на течії. Без нього він тебе на ній не пустить. Поговори з Кіндратом.')]); return true; },
});
Object.assign(DOOR_LOCK, {
  caves: () => {
    if (has('lavracandle')) return true;
    say('', [L('It\'s pitch dark down there. Sister Ahafia, by the cave door, keeps candles.', 'Там непроглядна темрява. У сестри Агафії біля входу до печер є свічки.')]);
    return false;
  },
});

// what to do next, out in the wider country: added to the "What now?" page
function farText() {
  const f = S.f, been = id => !!(S.been && S.been[id]), out = [];
  if (badgeCount() >= SICH_NEED && !been('khortytsia')) out.push('Semen the ferryman will take you downriver to the Sich now.');
  if (badgeCount() >= KYIV_NEED && !been('podil')) out.push('Vasyl\'s маршрутка leaves Kalynivka for Kyiv now.');
  if (f.lyst === 1) out.push('Help Pylyp the pysar, on the Sich maidan, write the kozaks\' reply to Baba Yaga.');
  if (f.lyst === 2) out.push('Take the finished reply to Ivan Sirko.');
  if (been('rapids') && !f.porohy) out.push('Kindrat the lotsman will take you down the nine rapids.');
  if (panasStep() >= 1 && panasStep() < 5) out.push('Find Mykyta in Kyiv and give him his father\'s letter. Ask around Podil.');
  if (f.litopys === 1) out.push(`Find the chronicle's lost pages in the Lavra caves (${pagesFound()} of ${PAGES.length}).`);
  if (f.litopys === 2) out.push('Take the pages back to Brother Pimen, in his cell in the Lavra.');
  if (f.kalyta === 1) out.push('Bite the kalyta at Pani Motrona\'s, up Andriyivskyi uzviz, without laughing at Kopystka\'s jokes.');
  return out.length ? ' ' + out.join(' ') : '';
}

// ─── Kyiv, more of it: the caves, the pigeons, Andriyivskyi uzviz ─────────
// the saints of the Near Caves, each in their niche
const SAINTS = {
  '6,19': [L('St Antony of the Caves. He came from Mount Athos, dug a cave in this hill with his own hands, and the Lavra grew round it like a pearl round a grain of sand.', 'Преподобний Антоній Печерський. Він прийшов з Афону, власноруч викопав печеру в цьому пагорбі, і довкола неї виросла Лавра, як перлина довкола піщинки.')],
  '12,22': [L('Illia the bohatyr, who sat on a stove for thirty-three years and then got up and saved Kyiv. He was a monk here at the end. Chernihiv people say he was from Morovsk, by the Desna, and call him Муровець.', 'Ілля, богатир зі старих переказів: тридцять три роки сидів на печі, а потім устав і врятував Київ. Наприкінці він був тут ченцем. На Чернігівщині кажуть, що він родом із Моровська над Десною, і звуть його Муровець.'),
    L('His right hand is folded the old way, for the sign of the cross. Brother Ioan says he still keeps watch.', 'Його права рука складена по-старому, для хресного знамення. Брат Іоан каже, що він досі вартує.')],
  '20,19': [L('Nestor the Chronicler. «Повість минулих літ»: the Tale of Bygone Years. Where the land of Rus came from, who first ruled in Kyiv. He wrote it down so nobody could sweep it away.', 'Нестор Літописець. «Повість минулих літ»: звідки пішла Руська земля, хто в Києві почав першим княжити. Він записав це, щоб ніхто не зміг вимести.')],
  '26,19': [L('Alipiy the icon painter. The story goes that once, when he was ill, an angel finished his icon for him. Nobody could tell which part was the angel\'s.', 'Аліпій, іконописець. Кажуть, коли він захворів, ангел дописав за нього ікону. Ніхто не міг сказати, яку частину писав ангел.')],
  '5,12': [L('Agapit the healer. He treated everybody for nothing, rich and poor, with herbs and prayer. Лікар: a doctor. Yaryna in the marsh would have liked him.', 'Агапіт, безмездний лікар. Лікував усіх задарма, багатих і бідних, травами й молитвою. Ярина з болота його б полюбила.')],
  '28,7': [L('Marko the gravedigger. They say that when a dead monk\'s grave wasn\'t ready, Marko asked him to wait a day, and the dead man waited.', 'Марко Гробокопач. Кажуть, коли могила для померлого ченця ще не була готова, Марко попросив його почекати день, і мертвий почекав.')],
};
Object.assign(STORY_LOOK, {
  'caves:r': o => { say('', SAINTS[o.tx + ',' + o.ty] || [L('A saint\'s coffin under a gilded lid.', 'Рака святого під позолоченим віком.')]); return true; },
  'caves:9': () => { say('', [L('Thin candles stuck in sand. Somebody lights one, and the dark steps back a little.', 'Тоненькі свічки в піску. Хтось запалює одну, і темрява трохи відступає.')]); return true; },
});
function ioanTalk(npc, done) {
  const n = npc.name;
  say(n, [L('Shh. Welcome. These are the Near Caves: Ближні печери. The Far Caves are across the ravine. Both go further than anybody has walked.', 'Тсс. Ласкаво просимо. Це Ближні печери. Дальні — за яром. І ті, й ті йдуть далі, ніж будь-хто ходив.'),
    L('Up the passage is our underground church. Left and right, the saints rest in their niches. Look at them, and I\'ll tell you who they are. Well, they\'ll tell you.', 'Угору ходом — наша підземна церква. Ліворуч і праворуч у нішах спочивають святі. Подивися на них, і я розповім, хто вони. Ну, вони самі розкажуть.'),
    ...((S.f.litopys || 0) === 1 ? [L('You\'re looking for pages? I\'ve seen them drifting about like moths. Five, I think. And in the east cell, some nights, a light that isn\'t a candle.', 'Шукаєш сторінки? Я бачив, як вони пурхають, мов метелики. П\'ять, здається. А в східній келії деякими ночами світиться щось, що не свічка.')] : [])], done);
}
// the pigeons of Podil: Pani Solomiia's gossips
const PIGEON_NEWS = [
  [L('Гуль-гуль! The magpies are back on the Lavra bell tower. Rude birds. They never coo.', 'Гуль-гуль! Сороки знову на дзвіниці Лаври. Невиховані птахи. Ніколи не воркують.')],
  [L('Гуль. A magpie dropped a word on Kontraktova square this morning. A tram ran over it. Ouch.', 'Гуль. Сьогодні вранці сорока впустила слово на Контрактовій. Його переїхав трамвай. Ой.')],
  [L('Гуль-гуль-гуль. They fly west at night, the magpies, over the pine forests. Polissia, the swallows say. And further, to the mountains.', 'Гуль-гуль-гуль. Уночі сороки летять на захід, над сосновими лісами. На Полісся, кажуть ластівки. І далі, в гори.')],
  [L('Гуль! Did you bring seeds? No? Then why are you talking to a pigeon?', 'Гуль! Ти приніс насіння? Ні? То чого ж ти розмовляєш із голубом?')],
];
function pigeonTalk(npc, done) {
  if (!S.f.fern) return say('', [L('Гуль-гуль. A pigeon: голуб. It looks at you with one orange eye, then the other, in case the first was wrong.', 'Гуль-гуль. Голуб дивиться на тебе одним помаранчевим оком, потім другим, раптом перше помилилося.')], done);
  S.f.pigeon = ((S.f.pigeon || 0) + 1) % PIGEON_NEWS.length; saveSoon();
  say('A pigeon', PIGEON_NEWS[S.f.pigeon], done);
}

// ─── St Andrew's Eve: bite the kalyta without laughing ────────────────────
// S.f.kalyta: 1 Motrona told you about it, 2 you bit the kalyta and she poured the wax
const KALYTA_JOKES = [
  ['Мій кіт живе на ___, бо там сонце.', 'My cat lives on the balcony, because that\'s where the sun is.', ['балконі', 'вокзалі', 'перехресті'], 0, 'балкон: a balcony.'],
  ['Я так довго чекав ___, що став дідом.', 'I waited so long for the tram that I became a grandpa.', ['трамвая', 'ліжка', 'ключа'], 0, 'трамвай: a tram.'],
  ['Наш ___ такий старий, що ним їздив ще князь Володимир.', 'Our bus is so old that Prince Volodymyr rode in it.', ['автобус', 'кухня', 'спальня'], 0, 'автобус: a bus.'],
  ['Я загубив ___ від квартири. Тепер живу на сходах.', 'I lost the key to my flat. Now I live on the stairs.', ['ключ', 'літак', 'офіс'], 0, 'ключ: a key. (It also means a spring of water.)'],
  ['Моя теща хропе так, що сусіди думають, що це ___.', 'My mother-in-law snores so loudly the neighbours think it\'s a lorry.', ['вантажівка', 'бібліотека', 'кімната'], 0, 'вантажівка: a lorry, a truck.'],
  ['У ___ ніхто не говорить, тому я там сплю.', 'Nobody talks in the library, so that\'s where I sleep.', ['бібліотеці', 'аеропорту', 'метро'], 0, 'бібліотека: a library.'],
  ['Таксист Микита знає кожну ___ у Києві, і кожну яму на ній.', 'Mykyta the cabbie knows every street in Kyiv, and every pothole in it.', ['вулицю', 'стелю', 'шину'], 0, 'вулиця: a street.'],
  ['Я купив ___, але не вмію їздити. Тепер ми просто гуляємо разом.', 'I bought a bicycle, but I can\'t ride it. Now we just go for walks together.', ['велосипед', 'готель', 'вокзал'], 0, 'велосипед: a bicycle.'],
];
const WAX = [
  ['Мітла летить на захід, і ти ___ за нею.', 'The broom is flying west, and you will follow it.', ['підеш', 'пішов', 'йдеш'], 0, 'The future of a single journey: піти → ти підеш. (Пішов is the past; йдеш is now.)'],
  ['Ти ___ гори, море і великі міста.', 'You will see mountains, the sea and big cities.', ['побачиш', 'бачив', 'бачиш'], 0, 'Perfective verbs make the future by themselves: побачити → ти побачиш.'],
  ['Ти ___ багато нових слів.', 'You will learn a lot of new words.', ['вивчиш', 'вивчив', 'вчиш'], 0, 'вивчити → ти вивчиш. The other future: ти будеш вчити, for something ongoing.'],
  ['А потім ти ___ додому з усіма писанками.', 'And then you will come home with all the pysanky.', ['повернешся', 'повернувся', 'повертаєшся'], 0, 'повернутися → ти повернешся. The -ся stays at the end.'],
];
ITEMS.kalyta = { ua: 'шматок калити', en: 'a piece of the kalyta', desc: 'Honey, poppy seeds and a bite mark. You won it without laughing. Nearly without laughing.' };
function motronaTalk(npc, done) {
  const n = npc.name, k = S.f.kalyta || 0;
  if (k >= 2) return say(n, [L('The wax showed a broom, a hut on hen\'s legs and a pysanka. I\'ve been pouring wax for fifty years and I\'ve never seen such a busy future.', 'Віск показав мітлу, хатинку на курячих ніжках і писанку. П\'ятдесят років ллю віск, а такого клопітного майбутнього не бачила.'),
    L('Go west, like the magpies. But come back for Andriy\'s Eve. We\'ll need somebody who doesn\'t laugh.', 'Іди на захід, як сороки. Але вертайся на Андрія. Нам потрібен хтось, хто не сміється.')], done);
  if (k === 0) { S.f.kalyta = 1; saveSoon(); }
  const nameDay = myName() === 'Андрій' ? [L('Андрій? Then this is your evening! St Andrew\'s Eve is your іменини, your name day. З іменинами!', 'Андрій? Тоді це твій вечір! На Андрія — твої іменини. З іменинами!')] : [];
  say(n, [L('Come in, come in! Tonight is Андріївські вечорниці: St Andrew\'s Eve. In the villages it\'s in December. On the uzviz, it\'s whenever I say.', 'Заходь, заходь! Сьогодні Андріївські вечорниці. У селах їх справляють у грудні. На узвозі — коли я скажу.'),
    ...nameDay,
    L('See the kalyta, hanging over the table? A honey loaf. You ride up to it on the poker and bite it. Without laughing.', 'Бачиш калиту над столом? Медовий корж. Під\'їжджаєш до неї верхи на кочерзі й кусаєш. Не сміючись.'),
    L('Kopystka the pysar will try to make you laugh. If you laugh, he paints a soot moustache on you. Talk to him when you\'re ready.', 'Писар Копистка намагатиметься тебе розсмішити. Засмієшся — намалює тобі сажею вуса. Поговори з ним, коли будеш готовий.')], done);
}
function kopystkaTalk(npc, done) {
  const n = npc.name, k = S.f.kalyta || 0;
  if (k === 0) return say(n, [L('I\'m the pysar. I write down who laughed. Ask the хазяйка, Pani Motrona, what that means.', 'Я писар. Я записую, хто засміявся. Спитай хазяйку, пані Мотрону, що це означає.')], done);
  const ride = again => roadQuiz(shuffle(KALYTA_JOKES.slice()).slice(0, 6), 'КАЛИТА', q => {
    if (q.stopped) return say(n, [L('Climbing off the poker? Coward. A cheerful coward.', 'Злазиш із кочерги? Боягуз. Веселий боягуз.')], done);
    if (q.score < 5) return say(n, [L(`${q.score} of 6. You laughed! [Kopystka paints a soot moustache on you, very carefully.]`, `${q.score} з 6. Засміявся! [Копистка дуже старанно малює тобі сажею вуса.]`),
      L('Wash your face and try again. The kalyta isn\'t going anywhere. It\'s tied on.', 'Умийся і спробуй ще. Калита нікуди не дінеться. Вона прив\'язана.')], done);
    if (again) return say(n, [L(`${q.score} of 6, and not even a smile. You\'re no fun at all. Have another bite.`, `${q.score} з 6, і навіть не всміхнувся. З тобою нецікаво. Кусай ще.`)], done);
    S.f.kalyta = 2; saveSoon(); sfx('badge');
    say(n, [L(`${q.score} of 6! Not a single laugh. [You bite the kalyta. Honey and poppy seeds.]`, `${q.score} з 6! Жодного смішка. [Ти кусаєш калиту. Мед і мак.]`), give('kalyta')], () =>
      say('Pani Motrona', [L('Now the girls\' part: we pour wax into water, and the shape tells your future. Let\'s see yours.', 'А тепер дівоча частина: ллємо віск у воду, і фігура покаже долю. Подивимося на твою.'),
        L('[The wax hisses in the bowl. It twists into a broom... then a little hut standing on two thin legs... and at the bottom, an egg. Many eggs, all in a row.]', '[Віск шипить у мисці. Він скручується в мітлу... потім у маленьку хатку на двох тоненьких ніжках... а на дні яйце. Багато яєць, одне за одним.]'),
        L('The future is said in the future tense, so read it with me. One thing, done once: ти підеш, ти побачиш, ти повернешся.', 'Майбутнє кажуть у майбутньому часі, тож читай зі мною. Одна справа, зроблена раз: ти підеш, ти побачиш, ти повернешся.')], () =>
        roadQuiz(WAX.slice(), 'ВІСК', q => say('Pani Motrona', [q.score >= 3 ? L(`${q.score} of 4. You read wax like an old woman. That\'s a compliment.`, `${q.score} з 4. Ти читаєш віск, як стара баба. Це комплімент.`) : L(`${q.score} of 4. Crooked reading. The wax doesn\'t mind; it knows what it said.`, `${q.score} з 4. Криво прочитав. Воскові байдуже: він знає, що сказав.`),
          L('So: the broom flies west, over the forests, and you\'ll follow it. And you\'ll come home with every one of those eggs.', 'Отже: мітла летить на захід, над лісами, і ти підеш за нею. І повернешся додому з усіма тими яйцями.')], done),
        ['ВІСК', 'Майбутнє у воску', 'your future in the wax', 'What will happen?'], 11)));
  }, ['КАЛИТА', 'Не смійся!', 'Kopystka\'s jokes', 'Which word finishes the joke?'], 11);
  if (k >= 2) return say(n, [L('Back for more? I have new jokes. Well, the same jokes, told louder.', 'Ще хочеш? У мене нові жарти. Ну, ті самі, тільки голосніше.')], null, yesNo(go => go ? ride(true) : done()));
  say(n, [L('So. You climb on the poker, ride up to the kalyta and say: «Добрий день, пане Калито!». And I tell you jokes. Every joke has a word missing. You find it, and you don\'t laugh.', 'Отже. Сідаєш на кочергу, під\'їжджаєш до калити і кажеш: «Добрий день, пане Калито!». А я розповідаю жарти. У кожному бракує слова. Ти його знаходиш і не смієшся.'),
    L('Six jokes. Get five right with a straight face, and you bite.', 'Шість жартів. П\'ять правильних із серйозним обличчям, і можеш кусати.')], null, yesNo(go => go ? ride(false) : say(n, [L('The poker will wait.', 'Кочерга почекає.')], done)));
}
const P_KYIV_ART = { h: '#2b2230', H: '#1a141e', w: '#e8794a', W: '#b0472e', r: '#e8794a', x: '#3a3046', p: '#3a3046', P: '#241c28', b: '#2b2230' };
Object.assign(NPCS, {
  uzviz: [
    { id: 'vira', name: 'Pani Vira', ua: 5, tx: 24, ty: 8, dir: 'left', pal: { h: '#2b2230', H: '#1a141e', w: '#7a3e8a', W: '#4f2459', r: '#e9b949', x: '#c8383a', p: '#2b2230', P: '#1a141e', b: '#1a141e' }, mods: ['skirt', 'dots'],
      talk: [[L('Cards, coffee grounds, wax, palms. Ворожка: a fortune-teller. I tell the future, sonechko. The present I leave to the trams.', 'Карти, кавова гуща, віск, долоні. Я ворожка. Я кажу майбутнє, сонечко. А теперішнє лишаю трамваям.'),
        L('Your cards are all brooms and magpies, flying west. Polissia first: pines, marshes, linen. Then the mountains. Then home, and an old woman in a hut.', 'У твоїх картах самі мітли й сороки, і всі летять на захід. Спершу Полісся: сосни, болота, льон. Потім гори. А потім додому, до старої в хатинці.')],
        [L('From up here you can see Lysa Hora on a clear day. I don\'t look. It\'s rude to stare at your relatives.', 'Звідси в ясний день видно Лису Гору. Я не дивлюся. Негарно витріщатися на родичів.')]] },
    { id: 'yurko', name: 'Yurko the busker', ua: 3, tx: 12, ty: 26, dir: 'down', pal: { h: '#c4762e', H: '#9a5420', w: '#fbf8f0', r: '#3f6fc4', x: '#3f6fc4', p: '#3a3046', P: '#241c28', b: '#7a3b22' },
      talk: [[L('I play the bandura on the uzviz. Ostap the kobzar taught me. He said I play with my heart. He meant: not with my fingers.', 'Я граю на бандурі на узвозі. Мене навчив кобзар Остап. Він сказав, що я граю серцем. Мав на увазі: не пальцями.'),
        L('Up at the top, in the house with the horseshoe, Pani Motrona keeps St Andrew\'s Eve. Go in. There\'s honey cake, if you can keep a straight face.', 'Нагорі, в хаті з підковою, пані Мотрона справляє Андріївські вечорниці. Заходь. Там є медовий корж, якщо втримаєшся від сміху.')]] },
    { id: 'halia-uz', name: 'Halia the painter', ua: 3, tx: 22, ty: 20, dir: 'left', pal: P_KYIV_ART, mods: ['skirt'],
      talk: [[L('Картина: a painting. Художник, художниця: a painter. Фарба: paint. Olia at the bottom paints chestnuts. I paint the people who stop to look at her chestnuts.', 'Картина. Художниця. Фарба. Оля внизу малює каштани. А я малюю людей, які зупиняються подивитися на її каштани.')]] },
    { id: 'behemoth', name: 'Pan Kotskyi', ua: 9, kind: 'cat', tx: 26, ty: 17, dir: 'left',
      talk: (n, done) => say('', S.f.fern ? [L('Purr. I am Пан Коцький. You know the tale? A fox brought me into the forest and told the wolf, the bear and the boar I was a terrible lord. They hid in the bushes. I said «Мяу!» over the meat, and they heard «Мало! Мало!» and ran for their lives.', 'Мрр. Я Пан Коцький. Знаєш казку? Лисичка привела мене в ліс і сказала вовкові, ведмедеві й кабанові, що я страшний пан. Вони сховалися в кущах. Я сказав над м\'ясом «Мяу!», а вони почули «Мало! Мало!» і втекли.'),
        L('The old woman in the hut used to be frightened of nobody. Now she is frightened of being forgotten. I could have told her: be a little bit terrible, and they will tell tales about you for ever.', 'Стара в хатинці колись нікого не боялася. А тепер боїться, що її забудуть. Я міг би їй сказати: будь трошки страшним, і про тебе вічно розповідатимуть казки.')]
        : [L('A huge black cat on the step of No. 13, sitting like a lord. It looks at you as if it knows a tale about you.', 'Величезний чорний кіт на ґанку будинку №13, сидить, як пан. Дивиться на тебе так, ніби знає про тебе казку.')], done) },
    ...[[16, 7], [22, 9], [17, 5]].map(([tx, ty], k) => ({ id: 'uzpigeon' + k, kind: 'pigeon', tx, ty, dir: k % 2 ? 'left' : 'right', wander: 2, talk: pigeonTalk })),
  ],
  svitlytsia: [
    { id: 'motrona', name: 'Pani Motrona', ua: 5, tx: 9, ty: 5, dir: 'left', pal: Object.assign({}, P_HANNA, { h: '#e8e4da', H: '#bdb6a8', r: '#c8383a' }), mods: ['skirt', 'dots'], talk: motronaTalk },
    { id: 'kopystka', name: 'Kopystka the pysar', ua: 5, tx: 3, ty: 4, dir: 'right', pal: Object.assign({}, P_KOZAK, { w: '#efe8d8', r: '#2b2230' }), mods: ['moustache', 'hat'], talk: kopystkaTalk },
    { id: 'kalyta', kind: 'kalyta', tx: 6, ty: 2, dir: 'down',
      talk: (n, done) => say('', [L('The kalyta, turning slowly on its red ribbon. It smells of honey and poppy seed. Talk to Pani Motrona about it.', 'Калита повільно крутиться на червоній стрічці. Пахне медом і маком. Поговори про неї з пані Мотроною.')], done) },
  ],
  andrewchurch: [{ id: 'liuba', name: 'Pani Liuba', ua: 5, tx: 3, ty: 6, dir: 'right', pal: P_HANNA, mods: ['skirt'],
    talk: [[L('The apostle Andrew, Андрій Первозванний, the First-Called, came up the Dnipro and stood on this hill. He said: on these hills a great city will shine. And here we are, shining.', 'Апостол Андрій Первозванний прийшов угору Дніпром і став на цьому пагорбі. Він сказав: на цих горах засяє велике місто. І ось ми сяємо.'),
      L('Андрій is the name of everybody born near his day, the thirteenth of December. Half of Ukraine has a cousin Andriy.', 'Андрій — ім\'я всіх, хто народився біля його дня, тринадцятого грудня. У половини України є двоюрідний брат Андрій.')]] }],
});
