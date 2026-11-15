// ─── Level tales: one small side quest that exists only at its own level ──
// Somebody the player already knows has a fresh problem at each level, solved with a six-sentence grammar round.
// S.f.tale: 0 not offered, 1 offered (or failed, or put off), 2 done. One tale per save, since a save is one level.
ITEMS.soroche = { ua: 'сороче перо', en: 'a magpie feather', desc: 'Black, with a green shine. Petryk says it is lucky. Petryk says that about everything.' };

const TALE_A1 = {
  offer: () => [
    L(`${myName()}! Come and look! The magpies dropped things when they flew over. A hat, a ribbon, a spoon and a whole CAT. Well, the cat walked here by itself.`,
      `${myVoc()}! Ходи глянь! Сороки погубили речі, коли летіли. Капелюх, стрічку, ложку і цілого КОТА. Ну, кіт сам прийшов.`),
    L('I want to give it all back, but I can\'t say who has what. Will you help?', 'Хочу все повернути, але не вмію сказати, у кого що є. Поможеш?')],
  note: L('[У мене є: I have. Literally, "at me there is". У мене немає + the genitive: I don\'t have. Petryk starts each sentence; you finish it.]',
    '[У мене є. У мене немає + родовий відмінок. Петрик починає речення, а ти закінчуєш.]'),
  head: ['ЗНАХІДКИ', 'У кого що є?', 'who has what', 'Finish the sentence'],
  items: [
    ['У мене ___ кіт. Тепер є!', 'I have a cat. Now I do!', ['є', 'немає', 'маю'], 0, 'У мене є: "at me there is". Є never changes: у мене є, у тебе є, у нас є.'],
    ['У діда Миколи немає ___.', 'Did Mykola has no hat.', ['капелюха', 'капелюх', 'капелюхом'], 0, 'Немає + the genitive: капелюх → капелюха.'],
    ['В Оксани немає ___.', 'Oksana has no ribbon.', ['стрічки', 'стрічка', 'стрічку'], 0, 'Feminine -а becomes -и in the genitive: стрічка → стрічки. (And у becomes в before a vowel: в Оксани.)'],
    ['У баби Ганни немає ___.', 'Baba Hanna has no spoon.', ['ложки', 'ложка', 'ложку'], 0, 'Ложка → немає ложки.'],
    ['Я ___ брата, а він має мене.', 'I have a brother, and he has me.', ['маю', 'має', 'є'], 0, 'Мати, to have: я маю, ти маєш, він має. Both ways are good Ukrainian: у мене є брат, я маю брата.'],
    ['А в тебе ___ словник? — Є!', 'And do you have a dictionary? "I do!"', ['є', 'немає', 'маєш'], 0, 'У тебе є…? A question is the same words with a question in your voice.'],
  ],
  retry: L('No, no. Now Did Mykola has the spoon again. Once more?', 'Ні, ні. Тепер у діда Миколи знову ложка. Ще раз?'),
  thanks: [
    L('Now everybody has everything! Except the cat. Nobody has the cat. The cat has us.', 'Тепер у всіх усе є! Крім кота. Кота ні в кого немає. Це ми є в кота.'),
    L('Here. A magpie dropped this too. It\'s lucky. Probably.', 'Тримай. Це теж сорока загубила. Воно щасливе. Мабуть.')],
  after: L('The cat sleeps on my bed now. I have a cat. У мене є кіт! I checked the grammar.', 'Кіт тепер спить на моєму ліжку. У мене є кіт! Я перевірив граматику.'),
};

ITEMS.pidsklianyk = { ua: 'підсклянник', en: 'a tea-glass holder', desc: 'Railway issue, nickel, with a locomotive on it. Tea tastes of trains in it.' };

const TALE_A2 = {
  offer: [
    L('Oh, it\'s you! Good. I have a whole carriage of people in the wrong slippers.', 'О, це ти! Добре. У мене повний вагон людей у чужих капцях.'),
    L('The black wind went through the train in the night, and now nobody can tell their own things from anybody else\'s. Will you help me sort them out before the mountains?',
      'Уночі вагоном пройшов чорний вітер, і тепер ніхто не відрізнить свого від чужого. Поможеш розібратися, поки не доїхали до гір?')],
  note: L('[Свій means one\'s own: it points back to whoever is doing the action. Я беру свою валізу, він бере свою валізу. But його валіза is some other man\'s.]',
    '[Свій показує на того, хто діє. Я беру свою валізу, він бере свою валізу. А «його валіза» — це валіза іншого чоловіка.]'),
  head: ['ВАГОН', 'Своє чи чуже?', 'one\'s own, or somebody else\'s', 'Whose is it?'],
  items: [
    ['Я не можу знайти ___ валізу.', 'I can\'t find my suitcase.', ['свою', 'свій', 'своє'], 0, 'Свій agrees with the thing: свій квиток, свою валізу, своє місце.'],
    ['Пан Марко шукає ___ капці.', 'Pan Marko is looking for his (own) slippers.', ['свої', 'його', 'її'], 0, 'His own: свої. Його капці would belong to some other man.'],
    ['Пані Ірина взула ___ капці, і тепер пан Марко босий.', 'Pani Iryna put on his slippers, and now Pan Marko is barefoot.', ['його', 'свої', 'свій'], 0, 'Not her own, but his: його. Свої would mean she is wearing her own, and nobody would be barefoot.'],
    ['Кожен пасажир має ___ місце.', 'Every passenger has their own seat.', ['своє', 'свій', 'свою'], 0, 'Місце is neuter: своє місце.'],
    ['Це ___ квиток, а не твій.', 'This is my ticket, not yours.', ['мій', 'свій', 'своя'], 0, 'Свій needs an owner who is doing something in the sentence. Here nobody is doing anything: it\'s just мій.'],
    ['Діти, візьміть ___ речі й не губіть!', 'Children, take your things and don\'t lose them!', ['свої', 'своє', 'своя'], 0, 'Речі is plural: свої речі.'],
  ],
  retry: L('Now two people are in one bunk and they\'re both sure of it. Again?', 'Тепер двоє на одній полиці, і обоє певні, що вона їхня. Ще раз?'),
  thanks: [
    L('Everyone in their own slippers, on their own bunk. You\'d make a conductor.', 'Усі у своїх капцях, на своїх полицях. З тебе {{вийшов би провідник|вийшла б провідниця}}.'),
    L('Take this. It has been round Ukraine more times than I have.', 'Візьми. Він об\'їхав Україну більше разів, ніж я.')],
  after: L('Tea? In your own glass holder, mind. I\'m counting mine.', 'Чаю? Тільки у свій підсклянник. Свої я рахую.'),
};

ITEMS.svyshchyk = { ua: 'свищик', en: 'a cherry-wood whistle', desc: 'Did Mykola carved it when he was nine. It still works. He says he would have made a better one, if.' };

const TALE_B1 = {
  offer: [
    L('Sit a minute. At my age a man talks mostly in якби. If I were, if I had.', 'Посидь хвилинку. У моєму віці чоловік говорить здебільшого на «якби». Якби я був, якби я мав.'),
    L('Listen to an old man\'s ifs, and finish them for me when I lose the end. I always lose the end.', 'Послухай дідові «якби» й докажи за мене, коли я загублю кінець. Я завжди гублю кінець.')],
  note: L('[An unreal "if": якби + the past form in one half, the past form + б or би in the other. Би after a consonant, б after a vowel: він пішов би, я б пішов, вона пішла б.]',
    '[Нереальна умова: якби + форма минулого часу, а в другій половині — форма минулого часу + б або би. Би після приголосного, б після голосного: він пішов би, я б пішов, вона пішла б.]'),
  head: ['ЯКБИ', 'Дідові «якби»', 'the conditional', 'How does it end?'],
  items: [
    ['Якби я ___ молодий, я б пішов із тобою.', 'If I were young, I would go with you.', ['був', 'буду', 'є'], 0, 'After якби: the past form. Якби я був.'],
    ['Якби в мене були крила, я ___, як лелека.', 'If I had wings, I would fly like the stork.', ['літав би', 'літаю', 'літатиму'], 0, 'The past form + би: літав би. Би, because літав ends in a consonant.'],
    ['Я б ___ до Києва, але хто нагодує курей?', 'I would go to Kyiv, but who would feed the hens?', ['поїхав', 'поїду', 'їду'], 0, 'Б wants the past form beside it: я б поїхав.'],
    ['Якби не дощ, ми ___ на лавці.', 'If it weren\'t for the rain, we would be sitting on the bench.', ['сиділи б', 'сидимо', 'сидітимемо'], 0, 'Сиділи ends in a vowel, so б: сиділи б.'],
    ['Якщо завтра буде сонце, я ___ тин.', 'If it\'s sunny tomorrow, I\'ll mend the fence.', ['полагоджу', 'полагодив би', 'лагодив'], 0, 'This one is real: it may well be sunny. A real "if" is якщо + the plain future, with no би.'],
    ['Ганно, чи не ___ ти мені чаю?', 'Hanna, would you make me some tea?', ['зробила б', 'зробив би', 'зробили б'], 0, 'Би also softens a request. The verb agrees with Hanna: зробила б.'],
  ],
  retry: L('No... that isn\'t how it ended. Or is it? Let\'s go through them again.', 'Ні... воно не так кінчалося. Чи так? Ану ще раз.'),
  thanks: [
    L('That\'s all of them. You know, якби you hadn\'t come by, I would have said them to the stork. She never finishes them either.',
      'Оце й усі. Знаєш, якби ти не {{зайшов|зайшла}}, я б казав їх лелеці. А вона теж ніколи не доказує.'),
    L('Here. I made it when I was nine.', 'Тримай. Я зробив його, коли мені було дев\'ять.')],
  after: L('Якби я мав ще один свищик, я б і його тобі дав. But there was only ever the one.', 'Якби я мав ще один свищик, я б і його тобі дав. Але він завжди був один.'),
};

ITEMS.marka = { ua: 'поштова марка', en: 'a postage stamp', desc: 'A stork carrying a letter. Pani Nadia says it has been valid since before she was born.' };

const TALE_B2 = {
  offer: [
    L('Look at my door. Every notice has lost its ending. „Пошту зачин...“ Closed? Closing? By whom?', 'Глянь на мої двері. У кожного оголошення зник кінець. „Пошту зачин...“ Зачинено? Зачиняють? Хто?'),
    L('First the letters came blank, and now the notices are going. Help me write them again, properly, the way an office speaks.', 'Спершу листи приходили порожні, а тепер зникають і оголошення. Поможи написати їх знову, як слід, по-канцелярському.')],
  note: L('[Forms in -но and -то say that something has been done without saying who did it. The thing stays in the accusative: пошту зачинено, лист надіслано.]',
    '[Форми на -но, -то кажуть, що щось зроблено, і не кажуть ким. Предмет стоїть у знахідному відмінку: пошту зачинено, лист надіслано.]'),
  head: ['ОГОЛОШЕННЯ', 'Зроблено!', 'forms in -но and -то', 'Which ending?'],
  items: [
    ['Пошту ___ на обід.', 'The post office is closed for lunch.', ['зачинено', 'зачинена', 'зачинений'], 0, 'Пошту is in the accusative, so nothing can agree with it: only зачинено fits.'],
    ['Лист ___ учора.', 'The letter was sent yesterday.', ['надіслано', 'надіслана', 'надіслане'], 0, 'Надіслати → надіслано. Nobody is named; the letter is simply sent.'],
    ['Посилку вже ___.', 'The parcel has already been received.', ['отримано', 'отримана', 'отриманий'], 0, 'Отримати → отримано. Посилку: accusative.'],
    ['Вікно ___ ще вчора.', 'The window was washed yesterday.', ['помито', 'помита', 'помитий'], 0, 'Some verbs take -то: помити → помито, відкрити → відкрито, взяти → взято.'],
    ['Двері ___ о дев\'ятій.', 'The doors were opened at nine.', ['відчинено', 'відчинена', 'відчинений'], 0, 'Відчинити → відчинено. Doors are відчинені, never відкриті, if Pani Nadia has anything to say about it.'],
    ['Це лист, ___ моєю бабусею.', 'This is a letter written by my grandmother.', ['написаний', 'написано', 'написана'], 0, 'When you do say who did it, use the participle that agrees with the noun: лист, написаний бабусею. The -но form doesn\'t take a doer.'],
  ],
  retry: L('No. Now the notice says the post office has washed the window shut. Again.', 'Ні. Тепер в оголошенні написано, що пошта замила вікно. Ще раз.'),
  thanks: [
    L('Зачинено, надіслано, отримано. Beautiful. Nobody did any of it, and all of it is done. That is an office.', 'Зачинено, надіслано, отримано. Краса. Ніхто нічого не робив, а все зроблено. Оце і є установа.'),
    L('For you. Don\'t lick it, it\'s older than both of us.', 'Це тобі. Не лижи, вона старша за нас обох.')],
  after: L('Notice: gratitude expressed. Подяку висловлено.', 'Оголошення: подяку висловлено.'),
};

ITEMS.horniatko = { ua: 'горнятко', en: 'a little coffee cup', desc: 'Горнятко is what Lviv calls a cup. This one says «Під левом» on the side and has a chip Pani Ilona calls character.' };

const TALE_C1 = {
  offer: [
    L('Sit. I need somebody with a whole dictionary in their head.', 'Сідай. Мені треба когось із цілим словником у голові.'),
    L('Since the magpies settled on the wires, my guests hear every saying the straight way. I told Pan Zenon he was catching crows, and he went outside to look for them.',
      'Відколи сороки посідали на дроти, мої гості чують кожен вислів навпростець. Я сказала панові Зенону, що він ловить ґав, а він вийшов надвір їх шукати.'),
    L('Help me put the crooked meanings back.', 'Поможи повернути висловам їхній кривий зміст.')],
  note: L('[A фразеологізм means something its words don\'t. Ловити ґав is to gape about and miss things; nobody catches a crow.]',
    '[Фразеологізм означає не те, що його слова. Ловити ґав — це бути неуважним і все пропускати; ніхто ніяких ґав не ловить.]'),
  head: ['ВИСЛОВИ', 'Криво, але зрозуміло', 'idioms', 'Which saying fits?'],
  items: [
    ['Він цілий день нічого не робить, тільки ___.', 'He does nothing all day but idle about.', ['б\'є байдики', 'пече раків', 'ловить облизня'], 0, 'Бити байдики: to loaf, to do nothing useful.'],
    ['Не ___, бо проґавиш трамвай!', 'Stop gaping about, or you\'ll miss the tram!', ['лови ґав', 'бий байдики', 'печи раків'], 0, 'Ловити ґав: to gape, to be inattentive. Проґавити, to miss something, is the same crow.'],
    ['Коли її спитали про Зенона, вона ___: почервоніла по самі вуха.', 'When they asked her about Zenon, she blushed to the tips of her ears.', ['спекла рака', 'зловила ґаву', 'побила байдики'], 0, 'Пекти раків, спекти рака: to blush. A boiled crayfish is very red.'],
    ['Грошей у мене ___.', 'I\'ve next to no money.', ['як кіт наплакав', 'як сніг на голову', 'як з гуски вода'], 0, 'Як кіт наплакав: as much as a cat could cry. Hardly any.'],
    ['Він приїхав без дзвінка, ___.', 'He turned up without calling, out of the blue.', ['як сніг на голову', 'як кіт наплакав', 'як з гуски вода'], 0, 'Як сніг на голову: sudden and unexpected.'],
    ['Скільки їй не кажи, їй усе ___.', 'However often you tell her, it\'s water off a duck\'s back.', ['як з гуски вода', 'як кіт наплакав', 'як сніг на голову'], 0, 'Як з гуски вода: nothing sticks. In Ukrainian the bird is a goose.'],
  ],
  retry: L('No. Now Pan Zenon is outside with a net. Once more.', 'Ні. Тепер пан Зенон стоїть надворі з сачком. Ще раз.'),
  thanks: [
    L('There. Now we can talk like people again: crooked, with flourishes, and understood by everyone.', 'Ну от. Тепер знову можна говорити по-людськи: криво, з викрутасами і всім зрозуміло.'),
    L('Take a горнятко with you. On the house, which is a saying too.', 'Візьми горнятко. За рахунок закладу. Це, до речі, теж вислів.')],
  after: L('Pan Zenon came back in. He says he caught nothing. I told him that was rather the point.', 'Пан Зенон повернувся. Каже, нічого не зловив. Я сказала, що в тому й річ.'),
};
const TALES = {
  A1: { npc: 'petryk', where: 'Petryk in Vyshneve', need: 1, zone: 0, item: 'soroche', t: TALE_A1 },
  A2: { npc: 'svitlana', where: 'Svitlana the conductor at the Polissia halt', need: 0, zone: 13, item: 'pidsklianyk', t: TALE_A2 },
  B1: { npc: 'mykola', where: 'Did Mykola in Vyshneve', need: 3, zone: 0, item: 'svyshchyk', t: TALE_B1 },
  B2: { npc: 'nadia', where: 'Pani Nadia at the Kalynivka post office', need: 5, zone: 3, item: 'marka', t: TALE_B2 },
  C1: { npc: 'ilona', where: 'Pani Ilona at «Під левом» in Lviv', need: 0, zone: 24, item: 'horniatko', t: TALE_C1 },
};
const taleState = () => S.f.tale || 0;
const taleReady = cfg => !!S.f.book && badgeCount() >= cfg.need;
function taleText() {
  const cfg = TALES[LEVEL];
  return cfg && taleState() === 1 ? ` ${cfg.where} could use your help.` : '';
}
for (const lv in TALES) {
  const cfg = TALES[lv], npc = findNpc(cfg.npc), t = cfg.t;
  let afterTurn = 0;
  wrapTalk(npc, (n, done) => {
    if (LEVEL !== lv) return false;
    if (taleState() === 2) {
      // the after line joins the person's rotation: every other visit, ahead of their usual talk
      if (afterTurn++ % 2) return false;
      say(n.name, [t.after], () => talkOn(n, done));
      return true;
    }
    if (!taleReady(cfg)) return false;
    const offer = typeof t.offer === 'function' ? t.offer() : t.offer;
    const lines = taleState() === 1 ? offer.slice(-1) : offer;
    S.f.tale = 1; saveSoon();
    say(n.name, lines, null, menu([L('I\'ll help', 'Поможу'), L('Not now', 'Не зараз')], i => {
      if (i) return talkOn(n, done);
      say('', [t.note], () => roadQuiz(t.items.slice(), t.head[0], q => {
        if (q.stopped) return done();
        if (q.score < 5) return say(n.name, [t.retry], done);
        S.f.tale = 2; saveSoon(); sfx('badge');
        say(n.name, [...t.thanks, give(cfg.item)], done);
      }, t.head, cfg.zone));
    }));
    return true;
  });
}
