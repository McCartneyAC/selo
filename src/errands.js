// ─── Neighbours all over the country ──────────────────────────────────────
// Errands that join one place to another: a son at the Sich and his mother at the market, a grandson in Kyiv and his
// grandmother in Vyshneve, two old raftsmen, two old chess players. And the threads the story pays off later:
// tato's blank postcards, the Hrytsenkos who left, Lukash's tune for Mavka, and the old woman nobody tells tales about.
Object.assign(ITEMS, {
  synlyst: { ua: 'лист від Кирила', en: 'Kyrylo\'s letter', desc: 'Folded into a triangle, the way soldiers fold letters. For his mother, Olena, at the Kalynivka market.' },
  maz: { ua: 'мазь від болю', en: 'Yaryna\'s balm', desc: 'Smells of pine tar and something that might be bear. For Kindrat\'s back.' },
  polyn: { ua: 'жмут полину', en: 'a bundle of wormwood', desc: 'Tied with red thread and labelled ВІД КІСТЯНОЇ НОГИ. For Pani Solomiia in Kyiv.' },
  proskura: { ua: 'проскура', en: 'a little blessed loaf', desc: 'From the Lavra, stamped with a cross. Baba Ulyana carried it for her old friend Hanna.' },
  miach: { ua: 'новий м\'яч', en: 'a new football', desc: 'From Brother Mytrofan, the Lavra bell-ringer, for his grandson in Lviv. Wrapped in brown paper, and in a prayer.' },
  farba: { ua: 'тюбик фарби', en: 'a tube of ultramarine', desc: 'Marian\'s, from Kamianets, owed to Halia on the uzviz since 2009.' },
  tsviakhy: { ua: 'цвяхи', en: 'a bag of nails', desc: 'Forged by Vakula. For the fence Lukash keeps not mending.' },
  matka: { ua: 'бджолина матка', en: 'a queen bee in a little cage', desc: 'From Hryhoriy\'s calmest hive. She hums as if she\'s thinking it over.' },
  morsil: { ua: 'морська сіль', en: 'a bag of sea salt', desc: 'From the pink liman. For Baba Palahna\'s bryndza.' },
  toporets: { ua: 'топірець', en: 'a Hutsul axe-cane', desc: 'Carved with a pattern of little suns. Did Yakiv left it in Verkhovyna forty years ago, and Lesyk has kept it ever since.' },
  gerdan: { ua: 'ґердан', en: 'a beaded necklace', desc: 'Red, blue and yellow beads, strung by a shepherd boy on long evenings. For Ivanka. Don\'t tell anyone.' },
  rescuemed: { ua: 'дикий мед', en: 'a jar of wild honey', desc: 'From Okhrim\'s borts, for the mountain rescuers\' tea on Chornohora.' },
  vesrushnyk: { ua: 'весільний рушник', en: 'a wedding rushnyk', desc: 'Woven by Baba Paraska in Vyshneve: two birds, a tree of life, and a great deal of red. For Did Stakh\'s granddaughter.' },
  khid: { ua: 'шаховий хід', en: 'a chess move', desc: 'A postcard with one line on it: «Кінь на f3». Uncle Fima\'s move, forty years in the playing. For Pan Zenon in Lviv.' },
  noty: { ua: 'ноти коломийки', en: 'a kolomyika, written down', desc: 'In Vasylyna\'s hand. For Savva, who has played every tune in the delta three thousand times.' },
  oseledets: { ua: 'дунайський оселедець', en: 'a Danube herring', desc: 'The best herring in the world, according to everyone who sells it.' },
  kavakyiv: { ua: 'пачка львівської кави', en: 'a packet of Lviv coffee', desc: 'From Pani Ilona, to settle an argument with a barista in Kyiv. It will not settle it.' },
  sharf: { ua: 'в\'язаний шарф', en: 'a knitted scarf', desc: 'Baba Motria knitted it in July, for her grandson in Kyiv. He will need it in July, she says.' },
  okraiets: { ua: 'теплий окраєць', en: 'a crust of bread, still warm', desc: 'From the Hrytsenko house in Vyshneve. The domovyk warmed it on his own stove. For any Hrytsenko you meet.' },
  rushnyk: { ua: 'рушник-дорога', en: 'the road rushnyk', desc: 'Baba Paraska wove a sign from every place you helped into one long rushnyk: a sun from the mountains, a wave from the sea, a dome from Kyiv. A rushnyk is a road. This one leads home.' },
});

ERRANDS.push(
  { id: 'kyrylo', region: 1, giver: 'kyrylo', to: 'olena', item: 'synlyst', words: ['син', 'батьки', 'родина', 'брат', 'сестра'],
    ask: L('You\'re from up the Dnipro? Near Kalynivka? My mama sells apples at the market there. Olena. I came to the Sich without saying goodbye properly. Would you take her a letter?', 'Ти з-над Дніпра? Біля Калинівки? Моя мама продає яблука там на ринку. Олена. Я пішов на Січ, як слід не попрощавшись. Віднесеш їй листа?'),
    hand: L('Tell her I\'m eating. Tell her that first.', 'Скажи їй, що я їм. Це скажи першим.'),
    thanks: L('From Kyrylo? My Kyrylo? [She reads it three times.] He says he\'s eating. He\'s lying. ...He says he misses my pears. Sit, sit, let me teach you family words, since you\'ve brought my family back.', 'Від Кирила? Від мого Кирила? [Вона читає тричі.] Пише, що їсть. Бреше. ...Пише, що скучає за моїми грушами. Сідай, сідай, навчу тебе слів про родину, раз ти мені родину повернув.') },
  { id: 'teklia', region: 1, giver: 'paraska2', source: 'yaryna', item: 'maz', words: ['спина', 'плече', 'рука', 'нога', 'біль'],
    ask: L('Kindrat won\'t say it, so I will: his back is finished. Forty years bent over an oar. They say a herbalist in the marsh up past Vyshneve makes a balm that works. Would you fetch it?', 'Кіндрат не скаже, тож скажу я: спина в нього зовсім погана. Сорок років над веслом. Кажуть, знахарка на болоті за Вишневим робить мазь, яка допомагає. Принесеш?'),
    hand: L('For a lotsman\'s back? Rub it in at night, and tell him to stop lifting boats.', 'Для спини лоцмана? Втирати на ніч. І хай перестане піднімати човни.'),
    thanks: L('Yaryna\'s balm! He\'ll pretend he doesn\'t need it and use the whole jar. Here, the words for where it hurts.', 'Мазь від Ярини! Він удаватиме, що вона йому не потрібна, і вимаже всю банку. Ось тобі слова про те, де болить.') },
  { id: 'solomiia', region: 2, giver: 'solomiia', source: 'yaryna', item: 'polyn', words: ['страх', 'боятися', 'небезпечний', 'обережно', 'тихо'],
    ask: L('You know Yaryna, in the marsh by Vyshneve? She ties up wormwood against the bone leg. Bring me a bundle, dear. The new one at Lysa Hora can\'t stand the smell, and I would like her to leave.', 'Ти знаєш Ярину з болота біля Вишневого? Вона в\'яже полин проти кістяної ноги. Принеси мені жмут, серденько. Та нова на Лисій Горі не терпить цього запаху, а я хочу, щоб вона забралася.'),
    hand: L('For Solomiia? Ha. Tell her it works better if you mean it.', 'Для Соломії? Ха. Скажи їй, що він краще діє, коли від щирого серця.'),
    thanks: L('Wormwood, with the red thread! I\'ll hang it over the door and see who comes knocking. Now listen: the words for being frightened. You\'ll want them, where you\'re going.', 'Полин, із червоною ниткою! Повішу над дверима, і подивимось, хто прийде стукати. А тепер слухай: слова про страх. Вони тобі знадобляться там, куди ти йдеш.') },
  { id: 'ulyana', region: 2, giver: 'ulyana', to: 'hanna', item: 'proskura', words: ['Бог', 'молитися', 'Великдень', 'Різдво', 'подарунок'],
    ask: L('You\'re from Vyshneve? Then you know Hanna, at the well. We were girls together. Take her this from me: a proskura from the Lavra. Tell her I walked all the way, and my knees say hello.', 'Ти з Вишневого? Тоді ти знаєш Ганну біля криниці. Ми дівчатами разом були. Віднеси їй від мене проскуру з Лаври. Скажи, що я прийшла пішки, і мої коліна передають привіт.'),
    hand: L('Carry it carefully. Don\'t eat it on the way. I know what children are.', 'Неси обережно. Не з\'їж по дорозі. Я знаю, які ті діти.'),
    thanks: L('From Ulyana? She walked to the Lavra? On those knees? [Hanna laughs, and wipes her eyes, and laughs.] Sixty years ago she stole my ribbon. Now she sends me bread. Sit, I\'ll teach you the words for the feasts.', 'Від Уляни? Вона дійшла до Лаври? На тих колінах? [Ганна сміється, витирає очі і знову сміється.] Шістдесят років тому вона вкрала мою стрічку. А тепер шле мені хліб. Сідай, навчу тебе слів про свята.') },
  { id: 'mytrofan', region: 2, giver: 'fedir', to: 'taras-l', item: 'miach', words: ['м’яч', 'футбол', 'команда', 'спорт', 'гра'],
    ask: L('My grandson in Lviv, Nazar, kicked his ball into a fountain. His mother told me. He didn\'t, because he never rings. Would you take him a new one? Maybe then he\'ll ring. Bells always ring when you pull them.', 'Мій онук у Львові, Назар, копнув м\'яча просто у фонтан. Мені сказала його мама. Не він, бо він ніколи не дзвонить. Віднесеш йому новий? Може, тоді подзвонить. Дзвони завжди дзвонять, якщо їх смикнути.'),
    hand: L('Tell him his grandfather can still kick. Not well, but far.', 'Скажи, що дід ще вміє бити по м\'ячу. Не влучно, але далеко.'),
    thanks: L('From Did Mytrofan?! A real one, with the pentagons! [Nazar hugs the ball. Then, more slowly, he looks towards the poshtamt.] ...I\'ll ring him on Sunday. I always mean to. Here, football words. You\'ll need them in Lviv.', 'Від діда Митрофана?! Справжній, із п\'ятикутниками! [Назар обіймає м\'яча. А тоді, повільніше, дивиться в бік поштамту.] ...У неділю подзвоню йому. Я завжди збираюся. Ось тобі футбольні слова. У Львові без них ніяк.') },
  { id: 'halia', region: 2, giver: 'halia-uz', source: 'marian', item: 'farba', words: ['фарба', 'малювати', 'картина', 'мистецтво', 'колір'],
    ask: L('Marian, a painter in Kamianets, borrowed my ultramarine in 2009. If you ever go west, remind him. Painters never give anything back, except opinions.', 'Мар\'ян, художник із Кам\'янця, позичив у мене ультрамарин у 2009 році. Як будеш на заході, нагадай йому. Художники нічого не повертають, крім думок.'),
    hand: L('Halia\'s ultramarine! I\'ve been meaning to... since 2009. Here. Tell her the castle is grateful.', 'Ультрамарин Галі! Я все збирався... з 2009 року. Тримай. Скажи, що замок їй вдячний.'),
    thanks: L('He gave it back?! It\'s half empty. He used it on the sky over his castle, I can tell. Fine. Sit down, I\'ll teach you how painters talk.', 'Він повернув?! Половини нема. Він намалював ним небо над своїм замком, я бачу. Гаразд. Сідай, навчу тебе, як говорять художники.') },
  { id: 'lukashfence', region: 3, giver: 'lukashmama', source: 'vakula', when: () => opudStep() !== 1, item: 'tsviakhy', words: ['дах', 'двері', 'стіна', 'підлога', 'будувати'],
    ask: L('The fence. Every year I ask, every year Lukash plays the sopilka at it. If I had proper nails, real smithy nails, I\'d mend it myself. They say there\'s a blacksmith at the Sorochyntsi fair who forges them like music.', 'Тин. Щороку прошу, щороку Лукаш грає на нього на сопілці. Якби мені справжніх цвяхів, кованих, я б сама полагодила. Кажуть, на Сорочинському ярмарку є коваль, що кує їх, як музику.'),
    hand: L('Nails for a fence in Polissia? Take them. And tell whoever plays the sopilka to hold the hammer the other way round.', 'Цвяхи для тину на Поліссі? Бери. І скажи тому, хто грає на сопілці, щоб молоток тримав іншим кінцем.'),
    thanks: L('Real nails! Now there\'s no excuse. [From somewhere by the lake, a sopilka starts up, very innocently.] Here: house words. The house will be standing long after the fence falls down again.', 'Справжні цвяхи! Тепер жодних відмовок. [Десь біля озера дуже невинно заграла сопілка.] Ось тобі слова про хату. Хата стоятиме, коли тин знову впаде.') },
  { id: 'lev', region: 3, giver: 'lev', source: 'hryhoriy', item: 'matka', words: ['мед', 'квітка', 'рослина', 'дерево', 'літати'],
    ask: L('Okhrim won\'t ask, he\'s too proud, so I will. His wild bees are angry since the broom went over. A calm queen would settle them. They say a beekeeper down south on a khutir breeds the calmest bees in Ukraine.', 'Охрім не попросить, гордий, то попрошу я. Його дикі бджоли злі, відколи пролетіла мітла. Спокійна матка їх угамувала б. Кажуть, на хуторі на півдні є пасічник, у якого найспокійніші бджоли в Україні.'),
    hand: L('A queen for wild bees? Hm. Tell Okhrim she\'s from my best hive, and that I want to hear how they get on. A bortnyk and a beekeeper, writing letters. Whatever next.', 'Матку для диких бджіл? Гм. Скажи Охрімові, що вона з мого найкращого вулика, і що я хочу знати, як вони там. Бортник і пасічник листуються. Що далі буде.'),
    thanks: L('From Hryhoriy? A queen in a cage? Okhrim will growl and then take her up the tallest pine like a bride. Thank you. Here: the words of the bees.', 'Від Григорія? Матка в клітці? Охрім побурчить, а тоді понесе її на найвищу сосну, як молоду. Дякую. Ось тобі бджолині слова.') },
  { id: 'palahna', region: 4, giver: 'palahna', source: 'opanas', item: 'morsil', words: ['сіль', 'сир', 'молоко', 'готувати', 'смачний'],
    ask: L('Our mountain salt is bitter this year. For bryndza you want sea salt, from the pink lakes by the sea. My grandmother swore by it. If your road ever goes down to the sea, dytyno, bring me a bag.', 'Цьогоріч наша гірська сіль гірка. Для бриндзи треба морської солі, з рожевих озер біля моря. Моя баба на неї клялася. Як твоя дорога колись піде до моря, дитино, принеси мені торбинку.'),
    hand: L('Sea salt for the mountains? Take it. Salt goes everywhere. That\'s what the chumaks were for.', 'Морська сіль у гори? Бери. Сіль усюди йде. Для того й були чумаки.'),
    thanks: L('Pink salt! Now my bryndza will be the envy of the valley. Sit, I\'ll teach you kitchen words while the milk turns.', 'Рожева сіль! Тепер моїй бриндзі вся долина заздритиме. Сідай, поки молоко скисає, навчу тебе кухонних слів.') },
  { id: 'lesyk', region: 4, giver: 'bokorash', to: 'yakiv', item: 'toporets', words: ['працювати', 'допомагати', 'знати', 'вміти', 'допомога'],
    ask: L('Down the river, at Bakota, there\'s an old raftsman, Yakiv. Forty years ago we took timber down the Cheremosh together, and he left his топірець on my wall. Take it to him. Tell him the river still knows his name.', 'Униз по річці, у Бакоті, є старий плотогон, Яків. Сорок років тому ми разом гнали ліс Черемошем, і він залишив свій топірець у мене на стіні. Віднеси йому. Скажи, що річка досі пам\'ятає його ім\'я.'),
    hand: L('Mind the edge. It\'s still sharp. So is Yakiv, if I know him.', 'Обережно з лезом. Досі гостре. Як і Яків, якщо я його знаю.'),
    thanks: L('My топірець! From Lesyk? He\'s still alive, the old goat? [Yakiv turns it over and over in his hands.] We were boys on that river. Sit, sit. I\'ll teach you the words a raftsman lives by.', 'Мій топірець! Від Лесика? Живий ще, старий цап? [Яків крутить його в руках.] Ми хлопцями були на тій річці. Сідай, сідай. Навчу тебе слів, якими живе плотогон.') },
  { id: 'vasylko', region: 4, giver: 'vasylko', to: 'ivanka', item: 'gerdan', words: ['кохання', 'милий', 'подобатися', 'мрія', 'усміхатися'],
    ask: L('You know Ivanka? At Synevyr? With the... the plaits? I made her something. Don\'t say it\'s from me. Well, say it\'s from me. But quietly.', 'Ти знаєш Іванку? На Синевирі? Таку... з косами? Я їй дещо зробив. Не кажи, що від мене. Ну, скажи, що від мене. Але тихо.'),
    hand: L('Three hundred and four beads. I counted. I count everything.', 'Триста чотири намистини. Я рахував. Я все рахую.'),
    thanks: L('A ґердан? From... Vasylko? The one who counts sheep? [She goes very red and puts it on immediately.] Don\'t tell anyone I smiled. Here, I\'ll teach you some words, and you can forget them on the way back.', 'Ґердан? Від... Василька? Того, що рахує овець? [Вона дуже червоніє і одразу його вдягає.] Не кажи нікому, що я всміхалася. Ось, навчу тебе кількох слів, а ти забудь їх по дорозі назад.') },
  { id: 'liudmyla', region: 4, giver: 'nadiia', source: 'okhrim', item: 'rescuemed', words: ['погода', 'холодний', 'вітер', 'сніг', 'хмара'],
    ask: L('Up here we drink tea with honey all night, to keep awake on watch. We\'re out. Somebody told me there\'s a bortnyk in Polissia with wild honey that could wake the dead. Could you?', 'Тут нагорі ми цілу ніч п\'ємо чай із медом, щоб не спати на чергуванні. Мед закінчився. Мені казали, що на Поліссі є бортник, у якого дикий мед мертвого розбудить. Принесеш?'),
    hand: L('For the rescuers on Chornohora? Take it. Honey belongs to whoever is cold.', 'Для рятувальників на Чорногорі? Бери. Мед належить тому, кому холодно.'),
    thanks: L('Wild honey! It smells of pines. We\'ll have the warmest watch on the ridge. Here: weather words. Up here they change every ten minutes, so learn them fast.', 'Дикий мед! Пахне соснами. У нас буде найтепліше чергування на хребті. Ось слова про погоду. Тут вона міняється щодесять хвилин, тож вчи швидко.') },
  { id: 'stakh', region: 5, giver: 'stakh', source: 'paraska', item: 'vesrushnyk', words: ['весілля', 'обручка', 'одружуватися', 'молодий', 'гарний'],
    ask: L('My granddaughter marries in the autumn, and every bride needs a rushnyk to stand on. I want one from Poltava, woven the old way. My mother came from there. They say a Baba Paraska weaves the best ones.', 'Восени онука виходить заміж, а кожній молодій треба рушник, щоб на нього стати. Хочу полтавський, тканий по-старому. Моя мама звідти родом. Кажуть, найкращі тче якась баба Параска.'),
    hand: L('A wedding rushnyk for Podillia? Take this one: two birds and a tree of life. Tell the girl to step on it first, before the groom. Then she\'ll be in charge.', 'Весільний рушник на Поділля? Бери оцей: два птахи і дерево життя. Скажи дівчині, щоб першою на нього стала, раніше за молодого. Тоді вона буде головна.'),
    thanks: L('From Poltava! Look at the red in it. My mother\'s rushnyk was just like this. [Did Stakh is quiet for a moment.] Here, wedding words. You\'ll be dancing at one soon enough.', 'З Полтави! Подивися, яке червоне. У моєї мами був такий самий. [Дід Стах на мить замовкає.] Ось тобі весільні слова. Скоро й сам на весіллі танцюватимеш.') },
  { id: 'fima', region: 6, giver: 'fima', to: 'pan-zenon', item: 'khid', words: ['грати', 'думати', 'колись', 'довго', 'останній'],
    ask: L('Forty years I play chess by post with a man in Lviv, Pan Zenon. One move a letter. Since spring my letters come back blank. You\'re going west? Take him my move. Tell him: I\'m still thinking, and he should be worried.', 'Сорок років я граю в шахи поштою з одним паном у Львові, паном Зеноном. Один хід — один лист. З весни мої листи вертаються порожні. Ти йдеш на захід? Віднеси йому мій хід. Скажи: я ще думаю, і хай він хвилюється.'),
    hand: L('Кінь на f3. Don\'t look at it. Don\'t tell anybody. Go.', 'Кінь на f3. Не дивися. Нікому не кажи. Іди.'),
    thanks: L('Fima\'s move? At last! Кінь на f3. [Pan Zenon goes pale, then laughs until he coughs.] The old devil. That\'s mate in nine. Or me in nine. Sit, I\'ll tell you about a game that has lasted longer than most marriages.', 'Хід Фіми? Нарешті! Кінь на f3. [Пан Зенон блідне, а тоді сміється, аж кашляє.] Старий чорт. Це мат за дев\'ять ходів. Або мені за дев\'ять. Сідай, розповім тобі про гру, яка тривала довше за більшість шлюбів.') },
  { id: 'savva', region: 6, giver: 'vasyl-v', source: 'vasylyna', item: 'noty', words: ['музика', 'пісня', 'співати', 'слухати', 'танцювати'],
    ask: L('I have played every tune in the delta three thousand times. The neighbours have started to row away when they see me. Up in the mountains they have songs nobody here has heard. Kolomyiky. Would you bring me one, written down?', 'Я зіграв кожну мелодію в дельті по три тисячі разів. Сусіди вже відпливають, коли мене бачать. А в горах є пісні, яких тут ніхто не чув. Коломийки. Принесеш мені одну, записану?'),
    hand: L('A kolomyika for the Danube? Here, I\'ve written one out. Tell him to play it fast, or it\'s not a kolomyika, it\'s a lament.', 'Коломийку на Дунай? Ось, я записала. Скажи, хай грає швидко, бо інакше це не коломийка, а плач.'),
    thanks: L('A kolomyika! [Savva plays it at once, too slowly, then too fast, then just right. Across the canal somebody\'s window opens, and stays open.] Sit, I\'ll teach you music words.', 'Коломийка! [Савва одразу її грає, спершу надто повільно, потім надто швидко, а тоді якраз. Через канал відчиняється чиєсь вікно і так і лишається відчиненим.] Сідай, навчу тебе музичних слів.') },
  { id: 'maksym', region: 6, giver: 'maksym', source: 'kuzma', item: 'oseledets', words: ['риба', 'кілограм', 'половина', 'кілька', 'скільки'],
    ask: L('Two weeks home to Poltava with nothing but salt and kulish. I dream of fish. They say the herring at Vylkove, on the Danube, is the best in the world. Bring me one and I\'ll count it, very carefully.', 'Два тижні додому до Полтави, і тільки сіль та куліш. Мені сниться риба. Кажуть, у Вилковому, на Дунаї, найкращий оселедець у світі. Принеси мені одного, і я його порахую, дуже уважно.'),
    hand: L('A herring for a chumak? Here. Tell him to eat it, not count it.', 'Оселедець для чумака? Тримай. Скажи, хай їсть, а не рахує.'),
    thanks: L('One herring! Один оселедець! I\'ll eat half today and half tomorrow. Here: shopping words, and how much of everything.', 'Один оселедець! Половину з\'їм сьогодні, половину завтра. Ось тобі слова для базару: скільки чого.') },
  { id: 'ilona', region: 7, giver: 'ilona', to: 'oles', item: 'kavakyiv', words: ['кафе', 'кава', 'чай', 'чашка', 'цукор'],
    ask: L('A barista in Kyiv, Oles, has been telling people that Kyiv coffee is as good as ours. I don\'t argue. I send coffee. Would you take him a packet?', 'Один бариста в Києві, Олесь, розповідає, що київська кава не гірша за нашу. Я не сперечаюся. Я надсилаю каву. Віднесеш йому пачку?'),
    hand: L('Tell him to make it slowly. And to apologise quickly.', 'Скажи, хай заварює повільно. А перепрошує швидко.'),
    thanks: L('From Pani Ilona, in Lviv? [Oles smells the packet and closes his eyes.] ...Fine. FINE. Don\'t tell anybody in Kyiv. Sit, I\'ll teach you how to order in any café in Ukraine.', 'Від пані Ілони, зі Львова? [Олесь нюхає пачку і заплющує очі.] ...Гаразд. ГАРАЗД. Тільки нікому в Києві не кажи. Сідай, навчу тебе замовляти в будь-якій кав\'ярні України.') },
  { id: 'motria', region: 2, giver: 'motria', to: 'oles', item: 'sharf', words: ['дзвонити', 'телефон', 'баба', 'скоро', 'сьогодні'],
    ask: L('My grandson Oles works in a café in Kyiv, on Podil. He hasn\'t rung since Easter. If you ever go to Kyiv, take him this. I knitted it in July. He\'ll need it.', 'Мій онук Олесь працює в кав\'ярні в Києві, на Подолі. Не дзвонив від Великодня. Як будеш колись у Києві, віднеси йому оце. Я в\'язала в липні. Йому знадобиться.'),
    hand: L('And tell him his baba is not angry. Tell him that twice.', 'І скажи, що баба не сердиться. Скажи двічі.'),
    thanks: L('From Baba Motria? [Oles holds up the scarf. It is very long, and very orange.] She knitted it in July. Of course she did. ...I\'ll ring her tonight. I\'ve been meaning to for half a year. Here, I\'ll teach you the words for it, so neither of us forgets.', 'Від баби Мотрі? [Олесь піднімає шарф. Він дуже довгий і дуже помаранчевий.] В\'язала в липні. Ну звісно. ...Сьогодні ж увечері їй подзвоню. Пів року збираюся. Ось, навчу тебе потрібних слів, щоб ніхто з нас не забув.') },
  { id: 'hrytsenko', region: 7, giver: 'domovyk', to: 'daryna', item: 'okraiets', when: () => !!S.f.kupala, words: ['дім', 'додому', 'хата', 'повертатися', 'скоро'],
    ask: L('You go about the whole country now. If ever you meet a Hrytsenko, any Hrytsenko, give them this. Tell them the stove is still warm. Tell them the house remembers their voices.', 'Ти тепер ходиш по всьому краю. Як колись зустрінеш когось із Гриценків, будь-кого, дай їм оце. Скажи, що піч досі тепла. Скажи, що хата пам\'ятає їхні голоси.'),
    hand: L('[The domovyk breaks a crust from your bread, warms it on his own stove, and wraps it in a corner of rushnyk.] Don\'t let it go cold.', '[Домовик відламує окраєць від твого хліба, гріє його на своїй печі й загортає в краєчок рушника.] Не дай йому вистигнути.'),
    thanks: L('Hrytsenko? Yes, that\'s us. Grandma\'s house in Vyshneve... it\'s still standing? The stove is still warm? [Daryna holds the crust in both hands, like a letter.] We always said we\'d go back. This summer. All of us. I promise the house. Here, the words for going home.', 'Гриценко? Так, це ми. Бабусина хата у Вишневому... вона ще стоїть? Піч досі тепла? [Дарина тримає окраєць обома руками, як лист.] Ми завжди казали, що повернемося. Цього літа. Усі. Обіцяю хаті. Ось тобі слова про дорогу додому.') },
);

// ─── Small threads, and what changes once they're tied ────────────────────
const findNpc = id => { for (const a in NPCS) { const n = NPCS[a].find(p => p.id === id); if (n) return n; } return null; };
const after = id => errandState(id) === 2;
// Baba Motria stops praying for the telephone once Oles has had his scarf
findNpc('motria').talk = (npc, done) => say(npc.name, after('motria') ? [L('He rang! Oles rang! Forty minutes. He told me about coffee for thirty-nine of them. I didn\'t mind.', 'Подзвонив! Олесь подзвонив! Сорок хвилин. Тридцять дев\'ять із них розповідав про каву. Я не заперечувала.')]
  : [L('Shh. I\'m praying for rain. And for my grandson to call. Mostly for my grandson to call.', 'Тсс. Я молюся за дощ. І щоб онук подзвонив. Найбільше — щоб онук подзвонив.')], done);
findNpc('fedir').talk = (npc, done) => say(npc.name, after('mytrofan') ? [L('Nazar rang. On a Sunday, as promised. Well, on a Tuesday. But he rang. The big bell has been ringing louder all week.', 'Назар подзвонив. У неділю, як обіцяв. Ну, у вівторок. Але подзвонив. Великий дзвін цілий тиждень дзвонить гучніше.')]
  : [L('Дзвін: a bell. Дзвіниця: a bell tower. Дзвонити: to ring. And also: to phone. My grandson says he will дзвонити me every Sunday. He doesn\'t.', 'Дзвін. Дзвіниця. Дзвонити. А ще так кажуть про телефон. Онук обіцяє дзвонити щонеділі. Не дзвонить.'),
    L('When the big bell rings, the whole of Kyiv hears it. Lately the magpies sit on it and it rings quieter.', 'Коли дзвонить великий дзвін, його чує весь Київ. Останнім часом на ньому сидять сороки, і він дзвонить тихіше.')], done);
// Baba Paraska weaves the road rushnyk once the whole country has had your help
const paraskaChat = findNpc('paraska').talk;
findNpc('paraska').talk = (npc, done) => {
  if (S.f.rushnyk !== 1) { const conv = paraskaChat[npc.talked % paraskaChat.length]; npc.talked++; return say(npc.name, conv, done); }
  S.f.rushnyk = 2; saveSoon(); sfx('badge');
  say(npc.name, [L('There you are. Sit. People write to me from all over: a bortnyk, a salt master, a monk, a man in Lviv who plays chess by post. All about you.', 'Ось і ти. Сідай. Мені пишуть звідусіль: бортник, солевар, монах, якийсь пан у Львові, що грає в шахи поштою. І всі про тебе.'),
    L('So I wove it all into one rushnyk. A sun for the mountains, a wave for the sea, a dome for Kyiv, a pine for Polissia, a tower for Kamianets, a lion for Lviv.', 'Тож я виткала все це в один рушник. Сонце за гори, хвилю за море, баню за Київ, сосну за Полісся, вежу за Кам\'янець, лева за Львів.'),
    L('A rushnyk is a road, sonechko. You lay it down before somebody, and they walk on it home. Keep it. You\'ll know when to lay it down.', 'Рушник — то дорога, сонечко. Стелиш його перед кимось, і він ним іде додому. Бережи. Ти знатимеш, коли його постелити.'), give('rushnyk')], done);
};

// ─── Tato ─────────────────────────────────────────────────────────────────
// Tato drives a lorry the length of Ukraine. His postcards still come; since spring their backs are blank.
STORY_LOOK['home:J'] = () => {
  say('', [L('A shelf of painted plates. Behind them, a row of postcards from tato, who drives a lorry the length of Ukraine: the Lavra, the Potemkin Stairs, the castle at Kamianets, Lviv\'s Rynok square, the Carpathians in snow.', 'Полиця з мальованими тарілками. За ними ряд листівок від тата, який водить вантажівку через усю Україну: Лавра, Потьомкінські сходи, замок у Кам\'янці, площа Ринок у Львові, Карпати в снігу.'),
    L('You turn them over. The old ones are covered in his big square handwriting. Since spring, the backs are blank. Every one. As if the words fell off on the way.', 'Ти перевертаєш їх. Старі списані його великим квадратним почерком. А з весни звороти порожні. Усі. Ніби слова випали по дорозі.')]);
  S.f.tatoCards = 1; saveSoon();
  return true;
};
findNpc('nadia').talk.push([L('Your tato\'s postcards come through here too, sonechko. Odesa, Lviv, Kamianets. The pictures are all there. The backs are blank. I\'m sorry.', 'Татові листівки теж ідуть через мене, сонечко. Одеса, Львів, Кам\'янець. Картинки всі є. А звороти порожні. Мені шкода.'),
  L('Whatever is eating the words out of the letters, it isn\'t the post. I\'ve checked the post. The post is fine.', 'Хоч би що там виїдало слова з листів, це не пошта. Я перевіряла пошту. З поштою все гаразд.')]);
PHONE_CALLS.push({ bit: 16, who: 'Tato', where: L('on the road', 'у дорозі'),
  hello: [L('Алло? Алло, who is it? I\'m at a petrol station outside Kharkiv, the line\'s terrible... [A long pause.] It\'s you? It\'s really you?', 'Алло? Алло, хто це? Я на заправці під Харковом, зв\'язок жахливий... [Довга пауза.] Це ти? Справді ти?')],
  qs: [['Я ___ тобі щотижня! Ти не отримував?', 'I write to you every week! Haven\'t you been getting them?', ['пишу', 'напишу', 'написав'], 0, 'Every week, a habit: the imperfective пишу.'],
    ['Я ___ додому, щойно розвантажуся.', 'I\'ll set off for home as soon as I\'ve unloaded.', ['поїду', 'їду', 'їздив'], 0, 'Once, in the future: the perfective поїду. Їду means I\'m on my way right now.']],
  tell: L('[You tell him: his postcards still come, every one. The pictures are there. Since spring, the backs are blank.]', '[Ти кажеш йому: листівки приходять, усі. Картинки є. А з весни звороти порожні.]'),
  yes: [L('Blank? All of them? I wrote every week. About the road, about you... [He is quiet for a long time.] Then I\'ll say it instead. Out loud. I\'m coming home. I\'ll drive all night if I have to.', 'Порожні? Усі? Я ж писав щотижня. Про дорогу, про тебе... [Він довго мовчить.] Тоді я скажу. Уголос. Я їду додому. Їхатиму всю ніч, якщо треба.')] });

// ─── Lukash's tune, and Mavka ─────────────────────────────────────────────
// Lukash asks you to tell Mavka he still plays the same tune. She answers.
const lukashTalk = findNpc('lukash').talk;
findNpc('lukash').talk = (npc, done) => { if ((opudStep() !== 1 || gotClothes() & 8) && S.f.book && !S.f.lukash) { S.f.lukash = 1; saveSoon(); } lukashTalk(npc, done); };
const mavkaTalk = findNpc('mavka').talk;
findNpc('mavka').talk = (npc, done) => {
  if (S.f.lukash !== 1) return mavkaTalk(npc, done);
  S.f.lukash = 2; saveSoon();
  say(npc.name, [L('You\'ve come from Polissia? From the lake with the willow? ...Who sent you?', 'Ти з Полісся? Від озера з вербою? ...Хто тебе прислав?'),
    L('[You tell her: Lukash still plays the same tune, in the evenings, in case the wind carries it.]', '[Ти кажеш їй: Лукаш досі грає ту саму мелодію, вечорами, раптом вітер донесе.]'),
    L('[All the leaves around her turn over at once, silver side up, the way leaves turn before rain. For a long moment she says nothing at all.]', '[Усе листя довкола неї разом перевертається сріблястим боком догори, як перед дощем. Довгу мить вона нічого не каже.]'),
    L('The same one. He remembers it. Then I can\'t leave the forest now, not while the old woman sweeps it. But tell him... no. I\'ll tell him myself. When the forest is safe, I\'ll come and hear it.', 'Ту саму. Він її пам\'ятає. Я не можу покинути ліс зараз, поки стара його мете. Але скажи йому... ні. Я сама скажу. Коли в лісі буде безпечно, я прийду і послухаю.')], done);
};

// ─── The one who sits in the rock ─────────────────────────────────────────
// From Lesya Ukrainka's «Лісова пісня»: whoever has stopped wanting anything, he takes into the rock, where they forget.
const P_ROCK = { h: '#8a8478', H: '#5f5a50', w: '#7a756a', W: '#5f5a50', r: '#6a655a', x: '#4a463e', p: '#6a655a', P: '#4a463e', b: '#3a3630', s: '#a8a294', S: '#8a8478', m: '#c4bfb2' };
NPCS.bir.push({ id: 'rock', name: 'The one who sits in the rock', ua: 9, tx: 35, ty: 22, dir: 'left', ghost: true, pal: P_ROCK, mods: ['moustache'],
  talk: (npc, done) => say(npc.name, [
    L('Sit down. You look tired. Everyone who comes this way is tired. I am the one who sits in the rock: Той, що в скалі сидить.', 'Сідай. Ти втомлений. Сюди всі приходять втомлені. Я Той, що в скалі сидить.'),
    L('In the rock it is quiet. Nobody wants anything. Nobody remembers anything. Words are heavy; you can put them down here, all of them, and rest.', 'У скелі тихо. Ніхто нічого не хоче. Ніхто нічого не пам\'ятає. Слова важкі; їх можна покласти тут, усі, і відпочити.'),
    L('No? Pity. I\'ll tell you something, then, for nothing. The old woman with the bone leg comes closer to my rock every year.', 'Ні? Шкода. Тоді скажу тобі дещо, задарма. Стара з кістяною ногою щороку підходить ближче до моєї скелі.'),
    L('Once every child in the land knew her name and screamed it in the dark. Now nobody tells her tale. She is getting quiet, like the ones who come to me. She eats words so she won\'t be forgotten.', 'Колись кожна дитина в краю знала її ім\'я і кричала його в темряві. Тепер ніхто не розповідає про неї казок. Вона тихне, як ті, що приходять до мене. Вона їсть слова, щоб її не забули.'),
    L('It won\'t work. Eating words never works. Only being told works. ...Off you go. The rock will wait. The rock always waits.', 'Не допоможе. Їсти слова ніколи не допомагає. Допомагає тільки, коли про тебе розповідають. ...Іди. Скеля почекає. Скеля завжди чекає.')], done) });

// ─── Ivan and Marichka: «Тіні забутих предків» ────────────────────────────
// Baba Palahna is named for her grandmother, who married Ivan Paliichuk after he lost Marichka to the Cheremosh.
const palahnaChat = findNpc('palahna').talk;
let palahnaN = 0;
findNpc('palahna').talk = (npc, done) => (palahnaN++ % 2 === 0) ? palahnaChat(npc, done) : say(npc.name, [
  L('My grandmother was a Palahna too. She married Ivan Paliichuk, from over the ridge, a widower, they said, though he\'d never married the girl.', 'Моя баба теж була Палагна. Вона вийшла за Івана Палійчука, з-за хребта. Вдівець, казали, хоча він ту дівчину так і не взяв.'),
  L('Marichka. Their families had a feud, like ours always do. She drowned in the Cheremosh while he was away on the polonyna. He played the floyara for her every night after that, all his life.', 'Марічка. Їхні роди ворогували, як у нас завжди. Вона втопилася в Черемоші, поки він був на полонині. І він усе життя грав їй на флоярі щовечора.'),
  L('And on Chornohora, in the mist, a нявка would call him in Marichka\'s voice. Іване! Іване! That\'s how they get you: by your own name, said the right way.', 'А на Чорногорі, в тумані, нявка кликала його Марічиним голосом. Іване! Іване! Отак вони й ловлять: твоїм власним ім\'ям, сказаним як слід.')], done);
const P_NYAVKA = { h: '#2b2230', H: '#1a141e', w: '#eef4f0', W: '#cfdcd4', r: '#c8383a', x: '#c8383a', p: '#eef4f0', P: '#cfdcd4', b: '#cfdcd4', s: '#e4ecec', S: '#c4d0d0' };
NPCS.chornohora.push({ id: 'nyavka', name: 'A girl in the mist', ua: 9, tx: 17, ty: 19, dir: 'down', ghost: true, wander: 1, pal: P_NYAVKA, mods: ['skirt', 'dots'],
  talk: (npc, done) => say(npc.name, [
    L(`${myName()}! ${myName()}, come here, come off the path, there are berries...`, `${myVoc()}! ${myVoc()}, ходи сюди, зійди зі стежки, тут ягоди...`),
    L('[She knows your name, and says it properly, the vocative and all. From the front she is a pretty girl in a Hutsul sleeve. When she turns, there is nothing behind her but mist and a rotten stump.]', '[Вона знає твоє ім\'я і каже його правильно, кличним відмінком. Спереду вона гарна дівчина в гуцульській сорочці. А як обертається, за нею тільки туман і трухлявий пень.]'),
    L('...No? You know what I am. A нявка. I called a shepherd once, in the voice of a drowned girl. He nearly came. The chuhaister had to drag him back.', '...Ні? Ти знаєш, хто я. Нявка. Колись я кликала одного вівчаря голосом утопленої дівчини. Він мало не прийшов. Чугайстер мусив його відтягти.'),
    L('Stay on the plai, then. And tell the old woman in your forest that we in the mountains still know how to call a person by name. She\'s forgetting how.', 'Тоді тримайся плаю. І скажи старій у вашому лісі, що ми в горах іще вміємо кликати людину на ім\'я. А вона це забуває.')], done) });

// ─── Seeds: nobody tells tales about Baba Yaga any more ───────────────────
findNpc('solomiia').talk.push([L('She was the worst of us once, you know. Every child in Ukraine knew her and was frightened in the nicest way. Now? Cartoons. Nobody tells her tale any more.', 'Колись вона була найстрашніша з нас, знаєш. Кожна дитина в Україні її знала і боялася найприємнішим чином. А тепер? Мультики. Ніхто вже не розповідає про неї казок.'),
  L('A witch nobody is afraid of is just an old woman with a broom. She knows it. Fear makes people stupid, dear. Even witches.', 'Відьма, якої ніхто не боїться, — просто стара з мітлою. Вона це знає. Страх робить людей дурними, серденько. Навіть відьом.')]);
findNpc('olia').talk.push([L('Up on that hill, they say, Kyrylo Kozhumiaka the tanner beat a dragon that took a princess a day. He harnessed it to a plough and made it plough a furrow all the way to the sea. The Змієві вали, the Serpent\'s Walls.', 'Кажуть, на тому пагорбі Кирило Кожум\'яка, чинбар, переміг змія, що брав по царівні на день. Запріг його в плуга і проорав борозну аж до моря. Змієві вали.'),
  L('I paint dragons sometimes. They never sit still.', 'Я іноді малюю зміїв. Вони ніколи не сидять спокійно.')]);
