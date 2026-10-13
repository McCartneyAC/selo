// ─── Polissia: the pine forest and the village ────────────────────────────
// Getting there: north out of the old forest, once Mavka lets you through (POLISSIA_NEED pysanky).
const POLISSIA_NEED = 7;
Object.assign(ITEMS, {
  sorochka: { ua: 'стара сорочка', en: 'an old linen shirt', desc: 'From Hafiia the weaver. Patched at the elbows, embroidered at the collar. For the scarecrow.' },
  shtany: { ua: 'старі штани', en: 'old trousers', desc: 'Lukash\'s late father\'s. His mother handed them over as if they were a medal.' },
  kurtka: { ua: 'стара куртка', en: 'an old jacket', desc: 'From Fedir the fisherman. It smells of smoked eel and always will.' },
  sharf: { ua: 'червоний шарф', en: 'a red scarf', desc: 'From Lukash. Magpies hate red, he says. He may have made that up.' },
  shapka: { ua: 'солом\'яна шапка', en: 'a straw hat', desc: 'Did Prokip\'s. He has worn it to every wedding since 1961.' },
  poias: { ua: 'тканий пояс', en: 'a woven sash', desc: 'Red and white Polissia weaving, from Hafiia\'s loom. Tie it on, and the road holds you up.' },
  wildhoney: { ua: 'дикий мед', en: 'wild honey', desc: 'Dark honey from the borts of the pine forest. It tastes of heather, resin and summer.' },
});
// a gate on the way out of a place: return true to stop you, and turn you back
const turnBack = () => {
  const [dx, dy] = DIRS[player.dir], x = player.tx - dx, y = player.ty - dy;
  Object.assign(player, { tx: x, ty: y, x: x * 16, y: y * 16, fx: x, fy: y, nx: x, ny: y, moving: false, dir: OPPOSITE[player.dir] });
};
EXIT_LOCK['forest>bir'] = () => {
  if (badgeCount() >= POLISSIA_NEED) return false;
  turnBack();
  say('Mavka', [L('The pines up north are my sisters\' forest. Polissia. I was born there, in a willow by a lake.', 'Сосни на півночі — ліс моїх сестер. Полісся. Я народилася там, у вербі над озером.'),
    L(`They don't open the path for just anybody. Come back with ${POLISSIA_NEED} pysanky. You have ${badgeCount()}.`, `Вони не відкривають стежки будь-кому. Вертайся, коли матимеш ${POLISSIA_NEED} писанок. У тебе ${badgeCount()}.`)]);
  return true;
};

// ─── The scarecrow: dress it, and the magpies fly off ─────────────────────
// S.f.opud: 1 the children asked you, 2 the scarecrow is up and talking.
// S.f.opudx: garments you've been given (bits), S.f.opudd: garments it's wearing (bits)
const CLOTHES = [   // item, bit, the dressing line
  ['sorochka', 1, ['Спершу вдягаємо опудалу ___.', 'First we put the shirt on the scarecrow.', ['сорочку', 'сорочка', 'сорочкою'], 0, 'Вдягати що? The accusative: feminine -а becomes -у. Сорочка → сорочку.']],
  ['shtany', 2, ['Потім ___, бо в нього мерзнуть ноги.', 'Then the trousers, because its legs are cold.', ['штани', 'штанів', 'штанями'], 0, 'Штани is plural and not alive, so the accusative looks just like the nominative: штани.']],
  ['kurtka', 4, ['Поверх сорочки вдягаємо ___.', 'Over the shirt we put on the jacket.', ['куртку', 'куртка', 'куртки'], 0, 'Куртка → куртку: feminine -а becomes -у.']],
  ['sharf', 8, ['На шию зав\'язуємо ___.', 'Round its neck we tie the scarf.', ['шарф', 'шарфа', 'шарфом'], 0, 'Masculine things don\'t change in the accusative: шарф → шарф. (Living ones do: бачу кота, бачу Лукаша.)']],
  ['shapka', 16, ['А на голову вдягаємо ___!', 'And on its head we put the hat!', ['шапку', 'шапка', 'шапці'], 0, 'Шапка → шапку. And на голову: на + the accusative, because that\'s where the hat goes.']],
];
const opudStep = () => S.f.opud || 0;
const gotClothes = () => S.f.opudx || 0, wornClothes = () => S.f.opudd || 0;
const MISSING_UA = { sorochka: 'сорочка', shtany: 'штани', kurtka: 'куртка', sharf: 'шарф', shapka: 'шапка' };
const GIVE_UA = { sorochka: 'сорочку', shtany: 'штани', kurtka: 'куртку', sharf: 'шарф', shapka: 'шапку' };   // what you ask for: дай сорочку
function missingLine() {
  const left = CLOTHES.filter(([, b]) => !(gotClothes() & b)).map(([id]) => MISSING_UA[id]);
  return left.length ? 'Опудалу ще треба: ' + left.join(', ') + '.' : 'Усе є! Тепер одягни опудало. Воно стоїть посеред льону.';
}
function kidsTalk(npc, done) {
  const n = npc.name, o = opudStep();
  if (o >= 2) return say(n, [L('The magpies are gone! And the scarecrow tells jokes now. Bad ones. We love it.', 'Сороки полетіли! А опудало тепер розповідає анекдоти. Погані. Ми його любимо.')], done);
  if (o === 1) return say(n, [missingLine(), L('[The children only speak Ukrainian. Polissia children are like that.]', '[Діти говорять тільки українською.]')], done);
  if (!S.f.book) return say(n, [L('We\'re guarding the flax! From the magpies! With sticks!', 'Ми стережемо льон! Від сорок! Палицями!')], done);
  S.f.opud = 1; saveSoon();
  say(n, [L('The magpies are eating the flax! Not the seeds: the words. Mama says the flax remembers every song that was sung over it, and the magpies peck the songs out.', 'Сороки їдять льон! Не насіння, а слова. Мама каже, льон пам\'ятає кожну пісню, яку над ним співали, а сороки їх виклювують.'),
    L('We need an опудало. A scarecrow. We\'ve got the sticks. We haven\'t got any clothes for it.', 'Нам треба опудало. Палиці є. Одягу нема.'),
    'Опудалу треба: сорочка, штани, куртка, шарф і шапка. Старий одяг є в тітки Гафії, у мами Лукаша, у дядька Федора, у Лукаша і в діда Прокопа.',
    L('[They told you in Ukrainian. Ask the neighbours, and take only what the scarecrow needs.]', '[Вони сказали українською. Спитай сусідів і бери тільки те, що потрібно опудалу.]'),
    L('[When you ask for something, it takes the accusative: дай сорочку, дай шапку, дай куртку. Feminine -а becomes -у. Masculine things and plurals stay as they are: дай шарф, дай штани.]', '[Коли просиш щось, кажи у знахідному відмінку: дай сорочку, дай шапку, дай куртку. Жіноче -а стає -у. Чоловічий рід і множина не змінюються: дай шарф, дай штани.]')], done);
}
// a neighbour with two old things to give: one is what the scarecrow needs
function clothesOffer(id, decoy, ask, chat) {
  return (npc, done) => {
    const n = npc.name, it = CLOTHES.find(c => c[0] === id), right = GIVE_UA[id], bit = it[1];
    if (opudStep() !== 1 || (gotClothes() & bit)) return chat(npc, done);
    const plain = MISSING_UA[id], opts = shuffle([right, decoy, ...(plain !== right ? [plain] : []), 'Нічого, дякую']);
    say(n, [ask, 'Що тобі дати?'], null, menu(opts, i => {
      const pick = opts[i];
      if (pick === right) {
        S.f.opudx = gotClothes() | bit; saveSoon();
        return say(n, [L('Here. Tell it to stand up straight.', 'Тримай. Скажи йому, хай стоїть рівно.'), give(id)], done);
      }
      if (pick === plain && plain !== right) return say(n, [L(`«Дай ${plain}»? [From the field the children shout: «${right[0].toUpperCase() + right.slice(1)}! Дай ${right}!» Asking for something takes the accusative.]`, `«Дай ${plain}»? [Діти з поля кричать: «${right[0].toUpperCase() + right.slice(1)}! Дай ${right}!»]`)], done);
      if (pick === decoy) return say(n, [L(`The ${decoy}? For a scarecrow? [The children shout from the field: «Ні! Не ${decoy}!»]`, `${decoy[0].toUpperCase() + decoy.slice(1)}? Для опудала? [Діти кричать з поля: «Ні! Не ${decoy}!»]`)], done);
      say(n, [L('Come back when you know what you need.', 'Приходь, коли знатимеш, що треба.')], done);
    }));
  };
}
function scarecrowTalk(npc, done) {
  const o = opudStep();
  if (o >= 2) return say('The scarecrow', [
    [L('Опудало: a scarecrow. That\'s me. I scare crows, magpies and, on Saturdays, the priest\'s goat.', 'Опудало — це я. Я лякаю ворон, сорок, а по суботах — попову козу.')],
    [L('A magpie told me something before she flew. «All the words to the mountains. To Chornohora.» Then she said something rude about my hat.', 'Сорока дещо сказала, перш ніж полетіти. «Усі слова — до гір. На Чорногору.» А потім сказала щось грубе про мій капелюх.')],
    [L('Тісний: tight. This jacket is тісний. Fedir is thinner than he looks. Or I am fatter. Товстий.', 'Тісний. Ця куртка тісна. Федір худіший, ніж здається. Або я товстіший.')]][(S.f.opudTalk = ((S.f.opudTalk || 0) + 1) % 3)], done);
  if (o === 0 || !gotClothes()) return say('', [L('A cross of sticks in the flax, with a sack for a head. It isn\'t frightening anybody.', 'Хрест із палиць посеред льону, замість голови мішок. Нікого не лякає.')], done);
  const next = CLOTHES.find(([, b]) => !(wornClothes() & b));
  if (!(gotClothes() & next[1])) return say('', [L('You dress the scarecrow as far as you can. The children wanted it done in order, and the next thing isn\'t in your bag yet.', 'Ти вдягаєш опудало, скільки можеш. Діти хотіли все по черзі, а наступної речі в торбі ще нема.'), missingLine()], done);
  roadQuiz([next[2]], 'ОПУДАЛО', q => {
    if (q.stopped) return done();
    if (q.score < 1) return say('', [L('The children giggle. «Ні-і-і! Не так!» Try again.', 'Діти хихочуть. «Ні-і-і! Не так!» Спробуй ще.')], done);
    S.f.opudd = wornClothes() | next[1]; take(next[0]); saveSoon();
    if (wornClothes() !== 31) return scarecrowTalk(npc, done);
    S.f.opud = 2; saveSoon(); sfx('badge');
    say('', [L('You put the hat on last, and step back.', 'Ти останньою вдягаєш шапку і відступаєш.'),
      L('The scarecrow\'s sack face wrinkles. Two yellow eyes open in it. It is Polissia, after all.', 'Мішкове обличчя опудала морщиться. На ньому розплющуються двоє жовтих очей. Це ж Полісся.')], () =>
      say('The scarecrow', [L('КИШ! КИШ, сороки! Get out of my flax!', 'КИШ! КИШ, сороки! Геть із мого льону!'),
        L('[The magpies explode out of the flax and flap away west. One drops a strip of birch bark as she goes.]', '[Сороки вибухають із льону й летять на захід. Одна впускає смужку берести.]'),
        L('On the bark, scratched in a spiky hand: «Господиня каже: усі слова — до гір. На Чорногору.» The Mistress says: all the words to the mountains. To Chornohora.', 'На бересті гострим почерком: «Господиня каже: усі слова — до гір. На Чорногору.»')], () =>
        say('Marko and Hanusia', [L('It\'s alive! It\'s ALIVE! Mama! Hafiia! Everybody!', 'Воно живе! ЖИВЕ! Мамо! Тітко Гафіє! Усі сюди!'),
          L('Hafiia sent this for you, for when it was done. She said you\'d do it. She says that about everybody, but she meant it this time.', 'Тітка Гафія передала тобі це, на той випадок, як упораєшся. Вона сказала, що ти зможеш. Вона так про всіх каже, але цього разу мала на увазі.'),
          give('poias')], done)));
  }, ['ОПУДАЛО', 'Одягни опудало', 'dress the scarecrow', 'What goes on next?'], 13);
}
function magpieTalk(npc, done) {
  if (!S.f.fern) return say('', [L('Кра-кра! A magpie: сорока. It has something shiny in its beak. A word, maybe.', 'Кра-кра! Сорока. У дзьобі щось блищить. Може, слово.')], done);
  say('A magpie', [[L('The Mistress will have every word by winter. Every one! And then it will be ever so quiet.', 'До зими Господиня матиме всі слова. Усі! І тоді стане так тихо.')],
    [L('Shiny, shiny. A word is the shiniest thing there is. Don\'t you know that?', 'Блискуче, блискуче. Слово — найблискучіше, що є. Ти не знав?')]][npc.tx % 2], done);
}

// ─── The borts: find where the swarm went ─────────────────────────────────
// S.f.bort: 1 Okhrim asked you, 2 you found all four and brought him the news. S.f.borts: bits, which you've found.
const BORTS = { '29,6': 0, '33,21': 1, '18,22': 2, '10,21': 3 };
const BORT_CLUES = ['Перший рій сів у борті між двома березами. Це на сході, за стежкою.', 'Другий — у борті за великим каменем, біля озера.',
  'Третій — посеред галявини, серед вересу.', 'А четвертий — через струмок, на тому боці, під старим дубом.'];
// Okhrim wants it exact before he climbs: where is each swarm? Prepositions, and the case each one takes.
const SWARM_WHERE = [
  ['Перший рій сидить у борті між ___.', 'The first swarm is in a bort between two birches.', ['березами', 'берези', 'березах'], 0, 'Між (between) + the instrumental: берези → між березами.'],
  ['Другий — за великим ___.', 'The second is behind the big stone.', ['каменем', 'камінь', 'каменю'], 0, 'За (behind) + the instrumental: камінь → за каменем.'],
  ['Він біля ___.', 'It\'s by the lake.', ['озера', 'озеро', 'озером'], 0, 'Біля (by, near) + the genitive: озеро → біля озера.'],
  ['Третій — посеред ___.', 'The third is in the middle of the clearing.', ['галявини', 'галявина', 'галявиною'], 0, 'Посеред (in the middle of) + the genitive: галявина → посеред галявини.'],
  ['Четвертий — під старим ___.', 'The fourth is under the old oak.', ['дубом', 'дуб', 'дуба'], 0, 'Під (under) + the instrumental, for where something is: дуб → під дубом.'],
  ['Щоб до нього дійти, треба перейти через ___.', 'To get to it, you have to cross the stream.', ['струмок', 'струмка', 'струмком'], 0, 'Через (across, through) + the accusative: струмок → через струмок.'],
  ['Бджоли сидять у ___.', 'The bees are sitting in the bort. (Where?)', ['борті', 'борть', 'бортю'], 0, 'Де? (where) у + the locative: борть → у борті.'],
  ['Рій полетів у ___.', 'The swarm flew into the bort. (Where to?)', ['борть', 'борті', 'бортю'], 0, 'Куди? (where to) у + the accusative: у борть. Same preposition, different question, different case.'],
  ['Я лізу на ___.', 'I climb up the pine. (Where to?)', ['сосну', 'сосні', 'сосна'], 0, 'Куди? на + the accusative: на сосну.'],
  ['Я сиджу на ___ і беру мед.', 'I sit up in the pine and take the honey. (Where?)', ['сосні', 'сосну', 'сосна'], 0, 'Де? на + the locative: на сосні.'],
];
const bortsFound = () => [0, 1, 2, 3].filter(k => (S.f.borts || 0) & (1 << k)).length;
function okhrimTalk(npc, done) {
  const n = npc.name, b = S.f.bort || 0;
  const test = () => keeperTalk(14, [L('Little words. Up, down, in, out, between, behind. In the forest that\'s all you need: where is it, and how do I get there.', 'Маленькі слова. Вгору, вниз, у, з, між, за. У лісі більше нічого не треба: де воно і як туди дійти.')])(npc, done);
  const chat = () => say(n, [L('Бортник: a wild-honey man. I don\'t keep bees. The bees keep me. I just climb up and ask.', 'Бортник. Я не тримаю бджіл. Це бджоли тримають мене. Я просто вилажу і питаю.'),
    L('Борть: a hollow in a living tree. My grandfather cut some of these. His grandfather cut the others.', 'Борть — дупло в живому дереві. Деякі вирубав мій дід. Решту — його дід.')], done);
  const swarm = () => {
    if (b >= 2) return say(n, [L('Four swarms, four borts, and honey for the winter. You have good ears.', 'Чотири рої, чотири борті, і мед на зиму. У тебе добрі вуха.')], done);
    if (b === 1 && bortsFound() < 4) return say(n, [`Знайдено: ${bortsFound()} з 4.`, ...BORT_CLUES.filter((_, k) => !((S.f.borts || 0) & (1 << k)))], done);
    if (b === 1) return say(n, [L('All four? Then tell me exactly where, so I don\'t climb the wrong tree at my age. In the forest the little words do all the work: між, за, під, біля, через. And each one wants its own case.', 'Усі чотири? Тоді скажи точно де, щоб я на старість не поліз не на те дерево. У лісі всю роботу роблять маленькі слова: між, за, під, біля, через. І кожне хоче свого відмінка.'),
      L('And mind де and куди. Де? Where something is: у борті, на сосні. Куди? Where it\'s going: у борть, на сосну.', 'І пильнуй, де і куди. Де? — у борті, на сосні. Куди? — у борть, на сосну.')], () =>
      roadQuiz(shuffle(SWARM_WHERE.slice()).slice(0, 8), 'БОРТІ', q => {
        if (q.stopped || q.score < 6) return say(n, [L(`${q.score} of 8. I\'d end up in a ditch. Say it again, slowly.`, `${q.score} з 8. Я б опинився в канаві. Скажи ще раз, повільно.`)], done);
        S.f.bort = 2; saveSoon(); sfx('badge');
        say(n, [L(`${q.score} of 8. Then I know where to climb. Here: the first honey of the year goes to whoever found it. That\'s the law of the bir.`, `${q.score} з 8. Тепер я знаю, куди лізти. Тримай: перший мед року — тому, хто знайшов. Такий закон бору.`), give('wildhoney'),
          L('While you were looking, did you see a broom in the sky? The bees came home angry last night. Something big flew over, heading for the mountains.', 'Поки шукав, не бачив у небі мітли? Бджоли вчора повернулися злі. Щось велике пролетіло над нами, в бік гір.')], done);
      }, ['БОРТІ', 'Де рої?', 'where the swarms are', 'Which form fits?'], 14));
    S.f.bort = 1; saveSoon();
    say(n, [L('My bees swarmed this morning. Four swarms, off into the pines, and my eyes aren\'t what they were. I saw where they went, but I can\'t see the borts any more.', 'Мої бджоли сьогодні вироїлися. Чотири рої, у сосни, а очі вже не ті. Я бачив, куди вони полетіли, але самих бортей уже не бачу.'),
      L('I\'ll tell you where. You go and look. Listen: I\'ll say it in Ukrainian, because that\'s what the bees understand.', 'Я скажу, де. А ти піди і подивися. Слухай: скажу українською, бо бджоли розуміють тільки її.'),
      ...BORT_CLUES, L('[Look at a bort, and you\'ll hear whether the bees are inside. Come back when you\'ve found all four.]', '[Подивися на борть, і почуєш, чи там бджоли. Повертайся, коли знайдеш усі чотири.]')], done);
  };
  if (!S.f.book) return chat();
  say(n, [L('Quietly. You\'ll frighten the bees.', 'Тихенько. Бджіл налякаєш.')], null, menu([L('Your test', 'Ваше випробування'), L('The swarms', 'Рої'), L('Just chatting', 'Просто поговорити')],
    i => i === 0 ? test() : i === 1 ? swarm() : chat()));
}
STORY_LOOK['bir:I'] = o => {
  const k = BORTS[o.tx + ',' + o.ty];
  if ((S.f.bort || 0) !== 1) { say('', [LOOK.I]); return true; }
  if (k == null) { say('', [L('You put your ear to the trunk. Нічого. Nothing but the wind in the hollow. Not this one.', 'Ти прикладаєш вухо до стовбура. Нічого. Тільки вітер у дуплі. Не ця.')]); return true; }
  if ((S.f.borts || 0) & (1 << k)) { say('', [L('Дззз. Your swarm, settling in. They don\'t want to be disturbed twice.', 'Дззз. Твій рій обживається. Двічі їх турбувати не треба.')]); return true; }
  S.f.borts = (S.f.borts || 0) | (1 << k); saveSoon(); sfx('item');
  say('', [L(`ДЗЗЗЗ! The whole trunk hums. The swarm is in here, hanging in the hollow like a bunch of grapes. [Found ${bortsFound()} of 4.]`, `ДЗЗЗЗ! Увесь стовбур гуде. Рій тут, висить у дуплі, як гроно винограду. [Знайдено ${bortsFound()} з 4.]`)]);
  return true;
};

// ─── The people ───────────────────────────────────────────────────────────
const P_POLISSIA = (shirt, skirt) => ({ h: '#e8c46a', H: '#c49a3e', w: '#f4efe2', W: '#d6cdb8', r: shirt, x: shirt, p: skirt, P: shade(skirt), b: '#7a5a3a' });
const P_LUKASH = { h: '#c4762e', H: '#9a5420', w: '#f4efe2', W: '#d6cdb8', r: '#c8383a', x: '#c8383a', p: '#5a6a4a', P: '#46543a', b: '#7a5a3a' };
const P_LISOVYK = { h: '#5d7a3a', H: '#3f5a2a', w: '#6a5a3a', W: '#4a3e28', r: '#5d7a3a', x: '#3f5a2a', p: '#4a3e28', P: '#33291a', b: '#33291a', s: '#c9b48a', S: '#a8946a', m: '#8aa86a' };
const hafiiaChat = (npc, done) => say(npc.name, [L('Ткаля: a weaver. Полотно: linen cloth. From flax to shirt is a whole year: you pull it, soak it, beat it, comb it, spin it, weave it. Then somebody spills borshch on it.', 'Ткаля. Полотно. Від льону до сорочки — цілий рік: брати, мочити, тіпати, чесати, прясти, ткати. А тоді хтось проллє на неї борщ.'),
  L('Every Polissia shirt has its pattern. Red for life, black for the earth. Mine have a little magpie on the hem this year. A dead one.', 'На кожній поліській сорочці свій візерунок. Червоне — життя, чорне — земля. На моїх цього року біля поділу сорока. Мертва.')], done);
const hafiiaTest = keeperTalk(13, [L('My words are the ones you wear and the ones you live in: shirt, coat, hat, table, chair, sleep, wake up. Сорочка, пальто, шапка, стіл.', 'Мої слова — ті, що носиш, і ті, у яких живеш: сорочка, пальто, шапка, стіл, стілець, спати, прокидатися.')]);
const hafiiaGive = clothesOffer('sorochka', 'сукню', 'Сорочка для опудала? Маю стару сорочку і стару сукню.', hafiiaChat);
function hafiiaTalk(npc, done) {
  if (!S.f.book) return hafiiaChat(npc, done);
  const opts = [L('Your test', 'Ваше випробування'), L('Just chatting', 'Просто поговорити')];
  if (opudStep() === 1 && !(gotClothes() & 1)) opts.splice(1, 0, L('Old clothes', 'Старий одяг'));
  say(npc.name, [L('Come in, sit, don\'t touch the loom.', 'Заходь, сідай, тільки верстата не чіпай.')], null, menu(opts, i => i === 0 ? hafiiaTest(npc, done) : opts.length === 3 && i === 1 ? hafiiaGive(npc, done) : hafiiaChat(npc, done)));
}
Object.assign(NPCS, {
  bir: [
    { id: 'okhrim', name: 'Okhrim the bortnyk', ua: 7, tx: 9, ty: 8, dir: 'down', pal: { h: '#d8d4cc', H: '#a9a49b', w: '#d6c7a8', W: '#b0a080', r: '#7a5a3a', x: '#5a4a3a', p: '#5a4a3a', P: '#463a2e', b: '#3a2a22' }, mods: ['moustache', 'hat'], talk: okhrimTalk },
    { id: 'lev', name: 'Uncle Lev', ua: 5, tx: 23, ty: 13, dir: 'down', pal: { h: '#8a8a8a', H: '#6a6a6a', w: '#f4efe2', W: '#d6cdb8', r: '#3a6a3a', x: '#3a6a3a', p: '#5a5a4a', P: '#46463a', b: '#3a2a22' }, mods: ['moustache'],
      talk: [[L('Дядько Лев. I\'m Lukash\'s uncle. I\'ve lived by this forest seventy years, and it\'s let me, which is the main thing.', 'Дядько Лев. Я дядько Лукаша. Сімдесят років живу біля цього лісу, і він мені дозволяє, а це головне.'),
        L('In the forest, you don\'t go in. You go between: між соснами. You don\'t go up a tree, you go up along it. The forest is all little words.', 'У лісі ти не заходиш, а йдеш між соснами. На дерево не лізеш, а вздовж нього вгору. Ліс — це самі маленькі слова.')],
        [L('Mavka? Of course I know Mavka. She grew up in the willow by our lake. Then she went south to the old forest. Lukash still plays for her in the evenings, in case the wind carries it.', 'Мавку? Звісно, знаю. Вона виросла у вербі над нашим озером. Потім пішла на південь, у старий ліс. Лукаш досі грає їй вечорами, раптом вітер донесе.')]] },
    { id: 'lisovyk', name: 'The lisovyk', ua: 9, tx: 15, ty: 21, dir: 'down', pal: P_LISOVYK, mods: ['moustache', 'bark'],
      talk: (n, done) => say(n.name, S.f.fern ? [L('Лісовик: the forest\'s master. I keep the trees from wandering off. They would, you know.', 'Лісовик. Я господар лісу. Стежу, щоб дерева не порозходилися. А вони б могли.'),
        L('Last night a broom came over, low, and every pine bent away from it. The old woman doesn\'t sweep the floor. She sweeps the land. Words first.', 'Минулої ночі низько пролетіла мітла, і всі сосни від неї відхилилися. Та стара не підлогу мете. Вона мете землю. Спершу — слова.')]
        : [L('An old man, mossy as a stump, sits under the oak. He blinks slowly at you, the way trees would blink if they could.', 'Під дубом сидить дід, порослий мохом, як пень. Повільно кліпає на тебе, як кліпали б дерева, якби вміли.')], done) },
  ],
  bortnyk: [{ id: 'horpyna', name: 'Baba Horpyna', ua: 5, tx: 4, ty: 5, dir: 'right', pal: P_POLISSIA('#c8383a', '#5a4a3a'), mods: ['skirt'],
    talk: [[L('Мед: honey. Віск: wax. Вулик: a hive, the kind you keep. Борть: the kind the bees keep. Okhrim says that last bit about forty times a day.', 'Мед. Віск. Вулик. Борть. Охрім каже про останнє разів сорок на день.')]] }],
  polissia: [
    { id: 'marko', name: 'Marko and Hanusia', ua: 13, tx: 25, ty: 18, dir: 'down', pal: P_POLISSIA('#3f6fc4', '#5a5a4a'), talk: kidsTalk },
    { id: 'hanusia', name: 'Marko and Hanusia', ua: 13, tx: 27, ty: 18, dir: 'down', pal: P_POLISSIA('#c8383a', '#c8383a'), mods: ['skirt'], talk: kidsTalk },
    { id: 'scarecrow', kind: 'scarecrow', tx: 32, ty: 23, dir: 'down', bits: () => wornClothes(), alive: () => opudStep() >= 2, talk: scarecrowTalk },
    ...[[29, 21], [35, 22], [31, 26], [37, 25]].map(([tx, ty], k) => ({ id: 'magpie' + k, kind: 'magpie', tx, ty, dir: k % 2 ? 'left' : 'right', wander: 2, when: () => opudStep() < 2, talk: magpieTalk })),
    { id: 'lukash', name: 'Lukash', ua: 7, tx: 12, ty: 19, dir: 'left', pal: P_LUKASH,
      talk: clothesOffer('sharf', 'шкарпетки', 'Для опудала? Ха. Маю червоний шарф і старі шкарпетки. Обирай.', (npc, done) => say(npc.name, [
        L('Сопілка: a reed flute. I play it by the lake in the evenings. Mama says it\'s a waste of time. The frogs disagree.', 'Сопілка. Граю на ній вечорами біля озера. Мама каже, що це марна трата часу. Жаби не погоджуються.'),
        L('There was a girl once, from the willow by the lake. Mavka. She went south, to the old forest by Vyshneve. If you see her, tell her I still play the same tune.', 'Колись була дівчина з верби над озером. Мавка. Вона пішла на південь, у старий ліс біля Вишневого. Як побачиш її, скажи, що я граю ту саму мелодію.')], done)) },
    { id: 'prokip', name: 'Did Prokip', ua: 5, tx: 13, ty: 18, dir: 'right', pal: { h: '#d8d4cc', H: '#a9a49b', w: '#f4efe2', W: '#d6cdb8', r: '#3f6fc4', x: '#3f6fc4', p: '#4a4a5a', P: '#3a3a46', b: '#3a2a22' }, mods: ['moustache'],
      talk: clothesOffer('shapka', 'взуття', 'Опудалу щось на голову? Маю солом\'яну шапку і старе взуття.', (npc, done) => say(npc.name, [
        L('Вранці: in the morning. Ввечері: in the evening. Вдома: at home. At my age, all three are the same place.', 'Вранці. Ввечері. Вдома. У моєму віці це все одне й те саме місце.'),
        L('A train comes twice a week. West, to the mountains, all night long. Svitlana on the platform decides who gets on. Not the timetable. Svitlana.', 'Двічі на тиждень приходить потяг. На захід, у гори, цілу ніч. Хто сідає, вирішує Світлана на пероні. Не розклад. Світлана.')], done)) },
    { id: 'fedir-p', name: 'Fedir the fisherman', ua: 5, tx: 13, ty: 22, dir: 'left', pal: { h: '#5a3a22', H: '#3a2414', w: '#d6c7a8', W: '#b0a080', r: '#5a6a4a', x: '#5a6a4a', p: '#4a4a5a', P: '#3a3a46', b: '#2b2230' }, mods: ['hat'],
      talk: clothesOffer('kurtka', 'костюм', 'Старий одяг? Маю куртку, вона пахне вугрем. І костюм, з весілля. Шкода костюма.', (npc, done) => say(npc.name, [
        L('Polissia is half water. The other half is mosquitoes. In between, there\'s us.', 'Полісся — наполовину вода. А друга половина — комарі. А між ними — ми.')], done)) },
    { id: 'svitlana', name: 'Svitlana the conductor', ua: 7, tx: 34, ty: 5, dir: 'down', pal: P_CITY('#2f5f9a', '#2f5f9a'), mods: ['skirt', 'hat'], talk: (n, done) => trainTalk(n, done) },
  ],
  lukash: [{ id: 'lukashmama', name: 'Lukash\'s mother', ua: 7, tx: 6, ty: 4, dir: 'down', pal: P_POLISSIA('#2b2230', '#2b2230'), mods: ['skirt'],
    talk: clothesOffer('shtany', 'спідницю', 'Опудало? Ну. Від покійного чоловіка лишилися штани. І моя стара спідниця. Що треба?', (npc, done) => say(npc.name, [
      L('My son plays the sopilka by the lake instead of mending the fence. Like his father. Like his uncle. Like every man in Polissia.', 'Мій син грає на сопілці біля озера, замість того щоб лагодити тин. Як батько. Як дядько. Як усі чоловіки на Поліссі.')], done)) }],
  weaver: [{ id: 'hafiia', name: 'Hafiia the weaver', ua: 7, tx: 5, ty: 4, dir: 'right', pal: P_POLISSIA('#c8383a', '#2b2230'), mods: ['skirt', 'dots'], talk: hafiiaTalk }],
  polchurch: [{ id: 'vasyl-p', name: 'Father Mefodii', ua: 5, tx: 3, ty: 6, dir: 'right', pal: P_MONK, mods: ['moustache'],
    talk: [[L('This church was built without a single nail. Oak and pine, fitted like a puzzle. Three hundred years, and it hasn\'t creaked once. Well, once.', 'Цю церкву збудували без жодного цвяха. Дуб і сосна, складені, як головоломка. Триста років, і жодного разу не рипнула. Ну, один раз.')]] }],
});
// what to do next, up north: added to the "What now?" page
function northText() {
  const f = S.f, been = id => !!(S.been && S.been[id]), out = [];
  if (badgeCount() >= POLISSIA_NEED && !been('bir')) out.push('The path north out of the old forest is open now: Polissia.');
  if (opudStep() === 1) out.push(gotClothes() === 31 ? 'Dress the scarecrow in the Polissia flax field.' : 'Collect old clothes for the Polissia children\'s scarecrow. They told you what it needs (in Ukrainian).');
  if (f.bort === 1) out.push(bortsFound() < 4 ? `Find Okhrim's four swarms in the pine forest (${bortsFound()} of 4).` : 'Tell Okhrim the bortnyk you\'ve found all four swarms.');
  return out.length ? ' ' + out.join(' ') : '';
}
