const L = (en, ua) => [en, ua];   // a line of dialogue in English and Ukrainian

// ─── Areas ────────────────────────────────────────────────────────────────
// Rows come from tools/mapgen.py. Exits are edge tiles: step on one and you
// arrive at (tx, ty) in the other area.
const MAPS = /*MAPS*/null;

const AREAS = {
  vyshneve: {
    name: 'Vyshneve', ua: 'Вишневе', zone: 0, grass: '"w', music: 'village',
    exits: [
      { x: 8, y: 0, to: 'forest', tx: 20, ty: 32, dir: 'up' },
      { x: 17, y: 31, to: 'steppe', tx: 17, ty: 1, dir: 'down' },
      { x: 43, y: 16, to: 'kalynivka', tx: 1, ty: 12, dir: 'right' },
      { x: 0, y: 16, to: 'khutir', tx: 38, ty: 15, dir: 'left' },
    ],
    houses: {
      '5,10': 'Did Mykola\'s house. Through the window you can see a rushnyk draped over the icon in the corner.',
      '22,10': 'Halyna\'s house. It smells of borshch and fresh dill.',
      '5,19': 'Nobody answers.\nBehind the stove, something shuffles, then goes very quiet.',
      '20,18': 'Your house. Mama has gone to the market. The cat is asleep on the pich, as usual.',
    },
    signs: {
      '18,15': 'NORTH: the forest, and the Church of the Pokrova.\nSOUTH: the steppe. WEST: the khutir.\nEAST: the bridge, and Kalynivka.',
      '15,17': 'ВИШНЕВЕ\nVyshneve. Population 212 people and 1 stork.',
    },
  },
  forest: {
    name: 'The Old Forest', ua: 'Старий ліс', zone: 8, grass: 'f', dark: true, music: 'forest',
    G: { g0: '#8cc26a', g1: '#5d9a49', g2: '#4b843f', g3: '#356a36', g4: '#24482b' },
    exits: [{ x: 20, y: 33, to: 'vyshneve', tx: 8, ty: 1, dir: 'down' }, { x: 0, y: 14, to: 'marsh', tx: 38, ty: 14, dir: 'left' }, { x: 39, y: 24, to: 'lake', tx: 1, ty: 15, dir: 'right' }],
    houses: {}, signs: { '13,11': 'NORTH: the pine forest, and Polissia beyond it.\nSOUTH: Vyshneve.' },
  },
  steppe: {
    name: 'The Steppe', ua: 'Степ', zone: 2, grass: 'w"p', music: 'steppe',
    G: { g0: '#c6dc7a', g1: '#9cc25e', g2: '#7eaa4c', g3: '#5c8a40', g4: '#3a6234' },
    exits: [{ x: 17, y: 0, to: 'vyshneve', tx: 17, ty: 30, dir: 'up' }, { x: 0, y: 19, to: 'fair', tx: 38, ty: 15, dir: 'left' }, { x: 43, y: 24, to: 'ferry', tx: 1, ty: 15, dir: 'right' }],
    houses: { '34,10': 'The miller\'s house. Flour on the doorstep, flour on the cat.' },
    signs: { '19,18': 'NORTH: Vyshneve. WEST: the Sorochyntsi fair.\nEAST: the windmill, and the road to the Dnipro.' },
  },
  kalynivka: {
    name: 'Kalynivka', ua: 'Калинівка', zone: 3, grass: 'r"', music: 'kalynivka',
    exits: [{ x: 0, y: 12, to: 'vyshneve', tx: 42, ty: 16, dir: 'left' }, { x: 19, y: 0, to: 'lake', tx: 20, ty: 28, dir: 'up' }, { x: 36, y: 29, to: 'ferry', tx: 20, ty: 1, dir: 'down' }],
    houses: {
      '4,7': 'The Bondarenko house. Somebody inside is practising the bandura. Badly.',
      '10,7': 'The post office, which is also somebody\'s kitchen.',
      '26,7': 'Nobody home. A note on the door says ПОВЕРНУСЯ ЗАВТРА: back tomorrow.',
      '31,14': 'The fisherman\'s house. Nets drying, a smell of river.',
      '21,3': 'The village school. Chalk dust and the sound of somebody declining nouns.',
    },
    signs: {
      '16,11': 'КАЛИНІВКА\nKalynivka. Famous for its kalyna, its pond, and its opinions.',
      '2,11': 'WEST: Vyshneve. NORTH: the lake. SOUTH: the Dnipro crossing.',
    },
  },
};
Object.assign(AREAS, {
  khutir: { name: 'The khutir', ua: 'Хутір', zone: 1, grass: '"w,', music: 'khutir',
    G: { g0: '#b8e07a', g1: '#8cc55c', g2: '#6aa64a', g3: '#4a7f3c', g4: '#305c32' },
    exits: [{ x: 39, y: 15, to: 'vyshneve', tx: 1, ty: 16, dir: 'right' }, { x: 20, y: 0, to: 'marsh', tx: 20, ty: 28, dir: 'up' }, { x: 20, y: 29, to: 'fair', tx: 20, ty: 1, dir: 'down' }],
    houses: { '6,7': 'Hryhoriy\'s house. It smells of wax and honey, and a dog is snoring somewhere inside.' },
    signs: { '19,14': 'ХУТІР ЗАТИШНИЙ\nThe Zatyshnyi khutir. Honey sold. Dog friendly. Wolf not.' } },
  fair: { name: 'Sorochyntsi Fair', ua: 'Сорочинський ярмарок', zone: 4, grass: '",', music: 'fair',
    exits: [{ x: 20, y: 0, to: 'khutir', tx: 20, ty: 28, dir: 'up' }, { x: 39, y: 15, to: 'steppe', tx: 1, ty: 19, dir: 'right' }],
    houses: { '4,4': 'Vakula\'s forge. The anvil is still warm.', '30,4': 'An inn: корчма. Somebody inside is singing badly about a red coat.', '4,22': 'A potter\'s house. Jugs on every windowsill.' },
    signs: { '21,14': 'СОРОЧИНСЬКИЙ ЯРМАРОК\nThe Sorochyntsi Fair. Mind your purse. Mind the devil.' } },
  lake: { name: 'The lake', ua: 'Озеро', zone: 5, grass: 'r"', music: 'lake',
    exits: [{ x: 0, y: 15, to: 'forest', tx: 38, ty: 24, dir: 'left' }, { x: 20, y: 29, to: 'kalynivka', tx: 19, ty: 1, dir: 'down' }],
    houses: { '4,18': 'A fisherman\'s house, nets drying on the fence.', '30,22': 'Old Panas lives here. The door is open; he\'s out on the water.' },
    signs: { '9,16': 'ОЗЕРО\nThe lake. Swimming at your own risk. The rusalky are not lifeguards.' } },
  ferry: { name: 'The Dnipro crossing', ua: 'Переправа', zone: 6, grass: '"w', music: 'ferry',
    exits: [{ x: 0, y: 15, to: 'steppe', tx: 42, ty: 24, dir: 'left' }, { x: 20, y: 0, to: 'kalynivka', tx: 36, ty: 28, dir: 'up' }],
    houses: { '14,9': 'The ferryman\'s house. A ledger on the windowsill lists everyone he has ever carried across.' },
    signs: { '18,14': 'ПЕРЕПРАВА\nThe Dnipro crossing. Ferry runs when Semen is sober.' } },
  marsh: { name: 'The marsh', ua: 'Болото', zone: 7, grass: 'r"', music: 'marsh', mist: true,
    G: { g0: '#a6c48a', g1: '#7da26a', g2: '#62874f', g3: '#46683c', g4: '#2e4a2e', w: ['#a8c4b4', '#6f9488', '#4f7268', '#3e5e56'] },
    exits: [{ x: 39, y: 14, to: 'forest', tx: 1, ty: 14, dir: 'right' }, { x: 20, y: 29, to: 'khutir', tx: 20, ty: 1, dir: 'down' }],
    houses: { '4,4': 'Yaryna\'s hut. Bundles of herbs hang under the eaves, and something bubbles inside.' },
    signs: { '21,13': 'БОЛОТО\nThe marsh. Do not follow the lights.' } },
});
// ─── The wider country ────────────────────────────────────────────────────
// Version 2 is a journey across Ukraine: 25 places, each keeping 40 words. Places still being built are `planned`.
const REGIONS = [['Poltava', 'Полтавщина'], ['Zaporizhzhia', 'Запоріжжя'], ['Kyiv', 'Київ'], ['Polissia', 'Полісся'],
  ['The Carpathians', 'Карпати'], ['Podillia', 'Поділля'], ['The Black Sea', 'Причорномор’я'], ['Galicia', 'Галичина']];
const ABOUT = {
  vyshneve: 'Home. Cherry orchards, a well with a creaking sweep, and everyone you have ever known.',
  khutir: 'A farm on its own, with bees, hens and a dog called Sirko.',
  steppe: 'Wheat to the horizon, a windmill, and a kurhan older than anyone.',
  kalynivka: 'A village with a pond, a school, and opinions.',
  fair: 'Sorochyntsi fair: a market, a festival and a fight, all at once.',
  lake: 'Reeds, a pier, and the Berehynia on calm days.',
  ferry: 'The Dnipro crossing, where Kozak Mamai sits under his oak.',
  marsh: 'Mist, wandering lights, and Yaryna the herbalist.',
  forest: 'The old forest. Mavka, the chuhaister, and a hut on hen\'s legs.',
};
const far = (name, ua, region, about) => ({ name, ua, region, about, planned: true, zone: null, grass: '', exits: [], houses: {}, signs: {} });
Object.assign(AREAS, {
  khortytsia: far('Khortytsia', 'Хортиця', 1, 'The island in the Dnipro where the Zaporozhian Sich stood. Freedom, war and peace.'),
  rapids: far('The rapids', 'Пороги', 1, 'The Dnipro rapids, where only a lotsman can steer a boat through. Words for doing things.'),
  podil: far('Podil', 'Поділ', 2, 'Kyiv\'s old merchant quarter by the river: trams, streets and courtyards.'),
  lavra: far('The Lavra', 'Лавра', 2, 'The monastery of the caves, its golden domes above the Dnipro. Faith, feasts and memory.'),
  polissia: far('A Polissia village', 'Поліське село', 3, 'Wooden houses among the marshes and pines. Linen, looms and clothes.'),
  bir: far('The pine forest', 'Бір', 3, 'Tall pines where the bortnyk climbs for wild honey. Up, down, inside, between.'),
  verkhovyna: far('Verkhovyna', 'Верховина', 4, 'A Hutsul village in the mountains. Trembitas, songs and dancing.'),
  polonyna: far('The polonyna', 'Полонина', 4, 'The high summer pasture: sheep, bryndza and a fire that never goes out.'),
  chornohora: far('Chornohora', 'Чорногора', 4, 'The highest ridge of the Carpathians, where the molfar reads the days and the weather.'),
  synevyr: far('Lake Synevyr', 'Синевир', 4, 'The sea-eye of the Carpathians, made of a girl\'s tears for her love. Love and feelings.'),
  kamianets: far('Kamianets', 'Кам’янець', 5, 'A castle on a rock in a river bend. What things are like: big, small, red, round.'),
  dniester: far('The Dniester canyon', 'Дністер', 5, 'Raftsmen, orchards and cliffs. Work and jobs.'),
  odesa: far('Odesa', 'Одеса', 6, 'The port by the sea, where everybody talks and nobody agrees.'),
  vylkove: far('Vylkove', 'Вилкове', 6, 'A town of canals in the Danube delta. The little words that hold sentences together.'),
  liman: far('The salt liman', 'Лиман', 6, 'Pink salt lakes by the sea, where the chumaks loaded their carts. Numbers and counting.'),
  lviv: far('Lviv', 'Львів', 7, 'Coffee houses, trams and telephones. Modern life.'),
});
for (const id of ['vyshneve', 'khutir', 'steppe', 'kalynivka', 'fair', 'lake', 'ferry', 'marsh', 'forest']) Object.assign(AREAS[id], { region: 0, about: ABOUT[id] });
// The places built so far beyond the home region. Their `far` entry above keeps the name, region and blurb.
const built = (id, o) => Object.assign(AREAS[id], { planned: false }, o);
built('khortytsia', { zone: 9, grass: '",', music: 'sich', sich: true,
  exits: [{ x: 0, y: 26, to: 'ferry', tx: 23, ty: 15, dir: 'left' }, { x: 11, y: 0, to: 'rapids', tx: 10, ty: 30, dir: 'up' }],
  houses: { '15,7': 'The Uman kurin. Somebody inside is snoring like a cannon.', '15,12': 'The Poltava kurin. It smells of kulish, millet porridge.',
    '30,7': 'The Myrhorod kurin. A pair of boots dries on the doorstep.', '30,12': 'The Pereiaslav kurin. Locked: they\'re all out fishing.' },
  signs: { '25,23': 'ЗАПОРОЗЬКА СІЧ\nThe Zaporozhian Sich. Free kozaks only. Leave your fear at the gate.' } });
built('rapids', { zone: 10, grass: '"w,', music: 'rapids',
  exits: [{ x: 10, y: 31, to: 'khortytsia', tx: 11, ty: 1, dir: 'down' }],
  houses: { '3,4': 'A lotsman\'s house. Oars lean against the wall, taller than the door.', '3,14': 'Kindrat the lotsman\'s hut. The door is open.',
    '13,22': 'A lotsman\'s house. A child\'s drawing of a boat is pinned to the door.' },
  signs: { '11,10': 'ПОРОГИ\nThe Dnipro rapids. Nine of them, one after another. Only a lotsman takes a boat down. Ask for Kindrat.' } });
built('podil', { zone: 11, grass: '",', music: 'kyiv', paved: true,
  exits: [{ x: 37, y: 33, to: 'lavra', tx: 22, ty: 1, dir: 'down' }, { x: 4, y: 0, to: 'uzviz', tx: 8, ty: 32, dir: 'up' }],
  houses: { '11,3': 'A bakery. The smell of fresh bubliky comes out of the door and grabs you by the nose.', '16,3': 'A café: кав\'ярня. The door is open.',
    '27,3': 'Flats. Seven doorbells, seven names, one cat on the windowsill.', '32,3': 'A chemist\'s: аптека. Closed for lunch.',
    '11,21': 'A bookshop: книгарня. The door is open.', '16,21': 'The tram depot office. Timetables and a samovar.',
    '27,21': 'Flats. Mykyta the cabbie lives on the second floor.', '32,21': 'A music school. Somebody is practising scales on the piano, badly but bravely.' },
  signs: { '33,9': 'ТРАМВАЙ\nTram stop: Kontraktova Square.', '13,15': 'МАРШРУТКА\nMinibus stop. Route: Podil · Kalynivka · and back.' } });
AREAS.forest.exits.push(...[11, 12].map(x => ({ x, y: 0, to: 'bir', tx: 20, ty: 32, dir: 'up' })));
built('bir', { zone: 14, grass: '",f', music: 'bir',
  G: { g0: '#b8d47a', g1: '#8cb85c', g2: '#6a9a4a', g3: '#4a7a3c', g4: '#2a4a2c' },
  exits: [{ x: 20, y: 33, to: 'forest', tx: 12, ty: 1, dir: 'down' }, { x: 20, y: 0, to: 'polissia', tx: 22, ty: 32, dir: 'up' }],
  houses: { '5,5': 'Okhrim the bortnyk\'s hut. Smoke and honey. The door is open.' },
  signs: { '21,30': 'БІР\nThe pine forest. Mind the borts: the bees are wild and so is the bortnyk.' } });
built('polissia', { zone: 13, grass: '"-,', music: 'polissia', houses2: 'logKhata', church: 'wood',
  exits: [{ x: 22, y: 33, to: 'bir', tx: 20, ty: 1, dir: 'down' }],
  houses: { '4,8': 'Hafiia the weaver\'s house. The clack of a loom comes through the wall. The door is open.', '11,8': 'Lukash\'s house. His mother has scrubbed the doorstep white. The door is open.',
    '25,13': 'A log house with blue shutters. A cradle rocks on the porch, all by itself. Probably the wind.', '14,15': 'Did Prokip\'s house. Fishing nets, and a pike\'s head nailed over the door.',
    '34,13': 'Fedir the fisherman\'s house. Eels are smoking in the chimney.' },
  signs: { '23,31': 'ПОЛІССЯ\nA Polissia village: pines, flax, a lake, and a train twice a week.', '27,5': 'ПОЛУСТАНОК\nThe railway halt. Trains west: when Svitlana says so.' } });
// the Carpathians: Synevyr is the way in; the Hutsul ґазда at the pass decides who goes further
const MOUNTAIN_G = { g0: '#b4dc84', g1: '#86bc62', g2: '#669e4c', g3: '#487c3e', g4: '#2c5030' };
built('synevyr', { zone: 18, grass: '",', music: 'synevyr', houses2: 'hutsulKhata', G: MOUNTAIN_G, hops: [[22, 12]],
  exits: [{ x: 43, y: 14, to: 'verkhovyna', tx: 1, ty: 16, dir: 'right' }],
  houses: { '4,24': 'Baba Palahna\'s house. Ivanka is staying here for the summer. The door is open.', '30,24': 'A forester\'s house. Antlers over the door, and a cat asleep on the antlers.' },
  signs: { '25,20': 'СИНЕВИР\nLake Synevyr, the sea-eye of the Carpathians. 989 metres up, 24 deep, made of a girl\'s tears.', '24,31': 'АВТОБУС\nTo the railway station, and the night train back to Polissia. Ask Ferents.' } });
built('verkhovyna', { zone: 15, grass: '",', music: 'hutsul', houses2: 'hutsulKhata', church: 'wood', G: MOUNTAIN_G,
  exits: [{ x: 0, y: 16, to: 'synevyr', tx: 42, ty: 14, dir: 'left' }, { x: 22, y: 0, to: 'polonyna', tx: 22, ty: 32, dir: 'up' }],
  houses: { '6,8': 'Did Yura\'s house. A trembita three metres long lies along the eaves, like a sleeping snake.', '12,19': 'The korchma. Somebody inside is tuning a fiddle, badly. The door is open.',
    '26,8': 'Vasylyna\'s house. A pair of tsymbaly hammers hangs on the door. The door is open.', '21,24': 'The bride\'s house. Rushnyky in every window, and a smell of baking that could knock you over.' },
  signs: { '40,16': 'EAST: over the Cheremosh to Kosiv and Kolomyia.\nThe spring flood took the road. Everybody says it will be mended next year. Everybody said that last year.',
    '2,17': 'ВЕРХОВИНА\nVerkhovyna, the Hutsul capital. WEST: Synevyr. NORTH: the polonyna.', '24,17': 'ҐРАЖДА\nThe wedding is this way. (The wedding is always this way.)' } });
built('polonyna', { zone: 16, grass: '",', music: 'polonyna', houses2: 'hutsulKhata', G: { g0: '#c8e890', g1: '#9cd06a', g2: '#7cb456', g3: '#5a9044', g4: '#36602e' },
  exits: [{ x: 22, y: 33, to: 'verkhovyna', tx: 22, ty: 1, dir: 'down' }, { x: 43, y: 9, to: 'chornohora', tx: 1, ty: 26, dir: 'right' }],
  houses: { '18,8': 'The kolyba: the shepherds\' hut. Smoke leaks out between the logs. The door is open.' },
  signs: { '9,24': 'ПОЛОНИНА\nThe summer pasture. Sheep have right of way.', '23,31': 'SOUTH: Verkhovyna. EAST: up to Chornohora.' } });
built('chornohora', { zone: 17, grass: '",', music: 'chornohora', houses2: 'hutsulKhata', mist: true, G: { g0: '#c4d4a8', g1: '#9cae84', g2: '#82966c', g3: '#647a54', g4: '#3c4e36' },
  exits: [{ x: 0, y: 26, to: 'polonyna', tx: 42, ty: 9, dir: 'left' }],
  houses: { '8,21': 'The molfar\'s hut. Bundles of herbs hang in the doorway, and something hums inside. The door is open.' },
  signs: { '4,25': 'ЧОРНОГОРА\nChornohora, the black mountains. UP: Pip Ivan, 2028 metres.', '26,10': 'ПІП ІВАН\nThe summit, and the old observatory. Turn back in bad weather. (The weather is always bad.)' } });
built('lavra', { zone: 12, grass: '",', music: 'lavra',
  exits: [{ x: 22, y: 0, to: 'podil', tx: 37, ty: 32, dir: 'up' }],
  houses: { '11,14': 'The monks\' cells. The door is open.' },
  signs: { '24,22': 'БЛИЖНІ ПЕЧЕРИ\nThe Near Caves. Go quietly. Take a candle.' } });
// Podillia: west from the fair to Kamianets, south down to the Dniester at Bakota, and up the river into the mountains
const PODILLIA_G = { g0: '#c4e08a', g1: '#96c464', g2: '#74a64e', g3: '#54843e', g4: '#335a30' };
AREAS.fair.exits.push({ x: 0, y: 16, to: 'kamianets', tx: 42, ty: 15, dir: 'left' });
AREAS.verkhovyna.exits.push({ x: 8, y: 33, to: 'dniester', tx: 1, ty: 18, dir: 'down' });
AREAS.fair.signs['3,15'] = 'WEST: Podillia. Kamianets, three days by cart.\nThe carters only take people who have seen a bit of the world.';
AREAS.verkhovyna.signs['9,30'] = 'SOUTH: down the Cheremosh to the Dniester, and Podillia.';
built('kamianets', { zone: 19, grass: '",', music: 'kamianets', G: Object.assign({ w: ['#d4efe4', '#8ccab8', '#559e8e', '#3f8072'] }, PODILLIA_G),
  exits: [{ x: 43, y: 15, to: 'fair', tx: 1, ty: 16, dir: 'right' }, { x: 27, y: 33, to: 'dniester', tx: 22, ty: 1, dir: 'down' }],
  hops: [[36, 15]],
  houses: {}, look: { '@': 'An old town house of Kamianets: thick walls, a vaulted cellar, and a balcony with geraniums.', '~': 'Far below, the Smotrych runs round the rock like a moat. Nobody built that; the river did.' },
  signs: { '36,14': 'АВТОСТАНЦІЯ\nThe bus station. Buses to Lviv: ask Pan Roman.', '25,29': 'ФЕСТИВАЛЬ ПОВІТРЯНИХ КУЛЬ\nThe balloon festival. Launch at dawn, weather and colours permitting.',
    '12,17': 'ЗАМКОВИЙ МІСТ\nThe Castle Bridge. WEST: the fortress. EAST: the old town.', '21,18': 'КАМ\'ЯНЕЦЬ\nKamianets, the town on the rock. Ten centuries, eleven towers, one bridge in. The Turks said only God could take it.' } });
built('dniester', { zone: 20, grass: '",', music: 'dniester', G: Object.assign({ w: ['#d4efe4', '#8ccab8', '#559e8e', '#3f8072'] }, PODILLIA_G), hops: [[37, 21]],
  exits: [{ x: 22, y: 0, to: 'kamianets', tx: 27, ty: 32, dir: 'up' }, { x: 0, y: 18, to: 'verkhovyna', tx: 8, ty: 32, dir: 'left' }],
  houses: { '3,15': 'Did Yakiv\'s house. Oars over the door and a smell of tar.', '9,15': 'A house with blue shutters. Somebody\'s typewriter is clacking inside, very angrily.',
    '23,15': 'The office of the Bakota cooperative: orchards, rafts and tourists. A notice on the door: ПЛАН НА ЛІТО. Under it, in pencil: «який план?»', '14,15': 'The café on the shore: «Над Дністром». Borshch, varenyky, and the best view in Podillia.' },
  signs: { '21,17': 'ДНІСТЕР · БАКОТА\nThe Dniester canyon at Bakota. WEST: up the river to the mountains. UP: Kamianets.', '40,16': 'БАКОТСЬКИЙ СКЕЛЬНИЙ МОНАСТИР\nThe Bakota rock monastery, cut into the cliff in the 1100s. Quiet, please.' } });
// the Black Sea: the chumak road south from the steppe to the salt, then along the shore to Odesa, then by boat to the Danube
const SEA_G = { g0: '#d4e08c', g1: '#b4c86a', g2: '#96ac54', g3: '#788c44', g4: '#4a5a32' };
AREAS.steppe.exits.push({ x: 18, y: 31, to: 'liman', tx: 22, ty: 1, dir: 'down' });
AREAS.steppe.signs['19,29'] = 'ЧУМАЦЬКИЙ ШЛЯХ\nThe chumak road, SOUTH to the sea and the salt. Two weeks by ox. Take a song.';
built('liman', { zone: 23, grass: '",', music: 'liman', G: Object.assign({ w: ['#fbe4ea', '#f0b4c4', '#e08ca4', '#c86e8a'] }, SEA_G),
  exits: [{ x: 22, y: 0, to: 'steppe', tx: 18, ty: 30, dir: 'up' }, { x: 43, y: 9, to: 'odesa', tx: 1, ty: 8, dir: 'right' }],
  houses: { '4,22': 'The salt master\'s house, whitewashed with salt and lime. The door is open.' },
  look: { '~': 'The liman: a salt lake by the sea, pink as a sweet. The water is so salty you could float in it reading a newspaper.' },
  signs: { '23,8': 'ЧУМАЦЬКИЙ ШЛЯХ\nThe chumak road. NORTH: the steppe, and home. EAST: Odesa.', '40,10': 'ОДЕСА →\nOdesa. Sea, port, opera, opinions.' } });
built('odesa', { zone: 21, grass: '",', music: 'odesa', paved: true, G: Object.assign({ w: ['#dcf2fa', '#86c8e8', '#4a92cc', '#346fae'] }, SEA_G),
  exits: [{ x: 0, y: 8, to: 'liman', tx: 42, ty: 9, dir: 'left' }],
  hops: [[18, 26]],
  houses: {}, look: { '@': 'An Odesa house: a courtyard behind it, washing on lines across the courtyard, and from every window, somebody\'s opinion.', '~': 'The Black Sea: Чорне море. It isn\'t black. Nobody in Odesa will tell you why it\'s called that, because everybody has a different reason.' },
  signs: { '24,13': 'ПОТЬОМКІНСЬКІ СХОДИ\nThe Potemkin Stairs: 192 steps down to the port. From the top you see only the landings; from the bottom, only the steps.', '14,25': 'МОРСЬКИЙ ВОКЗАЛ\nThe sea terminal. Boats to Vylkove and the Danube: ask Captain Hryhorovych.', '2,9': 'ОДЕСА\nOdesa. Population: one million, and every one of them a comedian.' } });
built('vylkove', { zone: 22, grass: '",', music: 'vylkove', houses2: 'vylkoveKhata', G: Object.assign({ w: ['#dceadc', '#a2c4a8', '#6e9e8a', '#557f6e'] }, SEA_G),
  exits: [], hops: [[20, 26]],
  houses: { '4,22': 'Did Fedot\'s house. A boat is pulled up by the door like a dog asleep. The door is open.', '3,5': 'A reed-roofed house. A cat is fishing from the doorstep, seriously.',
    '8,5': 'The post office: Пошта. Shut. A note says: «Пішла по воді». Gone by water.', '17,5': 'A house with a garden of tomatoes on a raft.', '23,5': 'A house with blue shutters and a boat for every child.',
    '34,5': 'The Lipovan baker\'s. Smells of bread and kvass.', '3,14': 'A fisherman\'s house. Nets on every fence, and a sturgeon drawn on the door.', '17,14': 'A house painted sky blue, on purpose, so the sky won\'t feel lonely.',
    '34,14': 'Nastia the postwoman\'s house. Her boat isn\'t here.', '19,22': 'A house where somebody is practising the accordion.', '35,22': 'A house on stilts. When the Danube rises, it doesn\'t mind.' },
  signs: { '17,24': 'ПРИСТАНЬ\nThe pier. The boat for Odesa leaves when the captain finishes his tea.', '39,24': '0 КМ\nKilometre zero. Here the Danube ends, after 2,850 kilometres and ten countries, and goes into the sea.' } });
// Lviv: the night train from the mountains, or the bus from Kamianets
built('lviv', { zone: 24, grass: '",', music: 'lviv', paved: true, town: 'lvivTown',
  exits: [], hops: [[20, 27]],
  houses: {}, look: { '@': 'A Lviv house on Rynok square. Every one of the 44 houses round the square is different, and every one of them has a café on the ground floor. That is the law. (It isn\'t the law.)', ']': 'One of the four fountains of Rynok square: Neptune, Diana, Amphitrite, Adonis. This one is Diana, and she looks as if she wants a coffee.' },
  signs: { '19,26': 'ТРАМВАЙ\nTram to the railway station. Trains to the mountains; buses to Kamianets.', '16,17': 'ПЛОЩА РИНОК\nRynok square, Lviv. The heart of the city since 1356. The ratusha tower: 65 metres, 408 steps.' } });
// St Andrew's Descent: not a place with words of its own, but part of Podil, so Podil's words live in its grass
AREAS.uzviz = { name: 'Andriyivskyi uzviz', ua: 'Андріївський узвіз', region: 2, zone: 11, grass: '",', music: 'kyiv',
  about: 'The cobbled street that winds from Podil up to St Andrew\'s church. Painters, junk and treasure.',
  exits: [7, 8, 9].map(x => ({ x, y: 33, to: 'podil', tx: 4, ty: 1, dir: 'down' })),
  houses: { '12,22': 'An old house with a carved door. Someone has hung a garland of dried apples and a horseshoe over it.',
    '16,22': 'A gallery. Paintings of the Dnipro, the Lavra, and a great many cats.', '13,13': 'A souvenir shop. Wooden spoons, magnets and very serious nesting dolls.',
    '17,13': 'A tiny theatre: «Колесо», the Wheel. Tonight: a comedy. Every night: a comedy.', '24,13': 'House No. 13. A cat sits on the step as if it owns the whole street. On the uzviz, it probably does.',
    '3,21': 'The Castle of Richard the Lionheart. It is not a castle, and Richard never came. Kyivans say it is haunted, and the wind in its chimneys howls at night.' },
  signs: { '10,31': 'АНДРІЇВСЬКИЙ УЗВІЗ\nSt Andrew\'s Descent. Up to St Andrew\'s church. Mind the cobbles.', '23,6': 'АНДРІЇВСЬКА ЦЕРКВА\nSt Andrew\'s church. They say the apostle Andrew stood on this hill and blessed the empty hills, and a city grew.' } };


const inside = (name, ua, to, x, y, tx, ty, music) => ({ name, ua, inside: true, zone: null, grass: '', music: music || 'village', houses: {}, signs: {},
  exits: [{ x, y, to, tx, ty, dir: 'down' }] });
Object.assign(AREAS, {
  home: inside('Your house', 'Твоя хата', 'vyshneve', 5, 7, 22, 21),
  mykola: inside('Did Mykola\'s house', 'Хата діда Миколи', 'vyshneve', 5, 7, 7, 13),
  halyna: inside('Halyna\'s house', 'Хата Галини', 'vyshneve', 5, 7, 24, 13),
  hrytsenko: inside('The Hrytsenko house', 'Хата Гриценків', 'vyshneve', 5, 7, 7, 22, 'forest'),
  church: inside('Church of the Pokrova', 'Покровська церква', 'vyshneve', 6, 9, 17, 7, 'prayer'),
  school: inside('Kalynivka school', 'Школа', 'kalynivka', 6, 8, 23, 6, 'kalynivka'),
  miller: inside('The miller\'s house', 'Хата мірошника', 'steppe', 5, 7, 36, 13, 'steppe'),
  beekeeper: inside('Hryhoriy\'s house', 'Хата Григорія', 'khutir', 5, 7, 8, 10, 'khutir'),
  forge: inside('Vakula\'s forge', 'Кузня', 'fair', 5, 7, 6, 7, 'fair'),
  inn: inside('The korchma', 'Корчма', 'fair', 5, 7, 32, 7, 'fair'),
  ferryman: inside('The ferryman\'s house', 'Хата перевізника', 'ferry', 5, 7, 16, 12, 'ferry'),
  panas: inside('Did Panas\'s house', 'Хата діда Панаса', 'lake', 5, 7, 32, 25, 'lake'),
  yaryna: inside('Yaryna\'s hut', 'Хатина Ярини', 'marsh', 5, 7, 6, 7, 'marsh'),
  bondarenko: inside('The Bondarenko house', 'Хата Бондаренків', 'kalynivka', 5, 7, 6, 10, 'kalynivka'),
  post: inside('The post office', 'Пошта', 'kalynivka', 5, 7, 12, 10, 'kalynivka'),
  kurin: inside('The Poltava kurin', 'Полтавський курінь', 'khortytsia', 7, 7, 17, 15, 'sich'),
  sichchurch: inside('The Sich church', 'Січова церква', 'khortytsia', 6, 9, 24, 10, 'prayer'),
  lotsman: inside('Kindrat\'s hut', 'Хата лоцмана', 'rapids', 5, 7, 5, 17, 'rapids'),
  cafe: inside('A café', 'Кав\'ярня', 'podil', 5, 7, 18, 6, 'kyiv'),
  bookshop: inside('The bookshop', 'Книгарня', 'podil', 5, 7, 13, 24, 'kyiv'),
  flat: inside('Mykyta\'s flat', 'Квартира Микити', 'podil', 5, 7, 29, 24, 'kyiv'),
  andrewchurch: inside('St Andrew\'s church', 'Андріївська церква', 'uzviz', 6, 9, 20, 6, 'prayer'),
  lavrachurch: inside('The Dormition cathedral', 'Успенський собор', 'lavra', 6, 9, 22, 11, 'prayer'),
  cell: inside('Brother Pimen\'s cell', 'Келія', 'lavra', 4, 6, 13, 17, 'prayer'),
  caves: Object.assign(inside('The Near Caves', 'Ближні печери', 'lavra', 17, 23, 21, 27, 'caves'), { cave: true }),
  weaver: inside('Hafiia\'s house', 'Хата ткалі', 'polissia', 5, 7, 6, 11, 'polissia'),
  lukash: inside('Lukash\'s house', 'Хата Лукаша', 'polissia', 5, 7, 13, 11, 'polissia'),
  polchurch: inside('The wooden church', 'Дерев\'яна церква', 'polissia', 6, 9, 20, 7, 'prayer'),
  bortnyk: inside('Okhrim\'s hut', 'Хата бортника', 'bir', 5, 7, 7, 8, 'bir'),
  babahouse: inside('Baba Palahna\'s house', 'Хата баби Палагни', 'synevyr', 5, 7, 6, 27, 'synevyr'),
  korchma2: inside('The korchma', 'Корчма', 'verkhovyna', 5, 7, 14, 22, 'kolomyika'),
  vasylyna: inside('Vasylyna\'s house', 'Хата Василини', 'verkhovyna', 5, 7, 28, 11, 'kolomyika'),
  hutchurch: inside('The wooden church', 'Дерев\'яна церква', 'verkhovyna', 6, 9, 12, 6, 'prayer'),
  kolyba: inside('The kolyba', 'Колиба', 'polonyna', 5, 7, 20, 11, 'polonyna'),
  observatory: Object.assign(inside('The old observatory', 'Обсерваторія «Білий слон»', 'chornohora', 6, 8, 30, 6, 'chornohora'), { stone: true }),
  molfarhut: inside('The molfar\'s hut', 'Хата мольфара', 'chornohora', 5, 7, 10, 24, 'chornohora'),
  svitlytsia: inside('The house with the horseshoe', 'Світлиця', 'uzviz', 6, 7, 14, 25, 'kyiv'),
  castle: Object.assign(inside('The castle yard', 'Замкове подвір\'я', 'kamianets', 7, 9, 6, 15, 'kamianets'), { stone: true }),
  bakota: Object.assign(inside('The Bakota rock monastery', 'Бакотський монастир', 'dniester', 10, 11, 37, 15, 'prayer'), { stone: true }),
  solevar: inside('The salt master\'s house', 'Хата солевара', 'liman', 5, 7, 6, 25, 'liman'),
  chovnyar: inside('Did Fedot\'s house', 'Хата діда Федота', 'vylkove', 5, 7, 6, 25, 'vylkove'),
  lipchurch: inside('St Nicholas\' church', 'Миколаївська церква', 'vylkove', 6, 9, 23, 17, 'prayer'),
  kavarnia: inside('The café «Під левом»', 'Кав\'ярня «Під левом»', 'lviv', 6, 7, 12, 7, 'lviv'),
  poshtamt: inside('The main post office', 'Поштамт', 'lviv', 7, 7, 36, 18, 'lviv'),
});
// doors you can walk through: the door tile, and where you come in
const DOORS = {
  vyshneve: { '22,20': ['home', 5, 6], '7,12': ['mykola', 5, 6], '24,12': ['halyna', 5, 6], '7,21': ['hrytsenko', 5, 6], '17,6': ['church', 6, 8] },
  kalynivka: { '23,5': ['school', 6, 7], '6,9': ['bondarenko', 5, 6], '12,9': ['post', 5, 6] },
  steppe: { '36,12': ['miller', 5, 6] },
  khutir: { '8,9': ['beekeeper', 5, 6] },
  fair: { '6,6': ['forge', 5, 6], '32,6': ['inn', 5, 6] },
  ferry: { '16,11': ['ferryman', 5, 6] },
  lake: { '32,24': ['panas', 5, 6] },
  marsh: { '6,6': ['yaryna', 5, 6] },
  khortytsia: { '17,14': ['kurin', 7, 6], '24,9': ['sichchurch', 6, 8] },
  rapids: { '5,16': ['lotsman', 5, 6] },
  podil: { '18,5': ['cafe', 5, 6], '13,23': ['bookshop', 5, 6], '29,23': ['flat', 5, 6] },
  lavra: { '22,10': ['lavrachurch', 6, 8], '13,16': ['cell', 4, 5], '21,26': ['caves', 17, 22], '22,26': ['caves', 17, 22] },
  polissia: { '6,10': ['weaver', 5, 6], '13,10': ['lukash', 5, 6], '20,6': ['polchurch', 6, 8] },
  bir: { '7,7': ['bortnyk', 5, 6] },
  synevyr: { '6,26': ['babahouse', 5, 6] },
  verkhovyna: { '14,21': ['korchma2', 5, 6], '28,10': ['vasylyna', 5, 6], '12,5': ['hutchurch', 6, 8] },
  polonyna: { '20,10': ['kolyba', 5, 6] },
  chornohora: { '10,23': ['molfarhut', 5, 6], '30,5': ['observatory', 6, 7] },
  uzviz: { '14,24': ['svitlytsia', 6, 6], '20,5': ['andrewchurch', 6, 8] },
  kamianets: { '6,14': ['castle', 7, 8] },
  dniester: { '37,14': ['bakota', 10, 10], '38,14': ['bakota', 10, 10] },
  liman: { '6,24': ['solevar', 5, 6] },
  vylkove: { '6,24': ['chovnyar', 5, 6], '23,16': ['lipchurch', 6, 8] },
  lviv: { '12,6': ['kavarnia', 6, 6], '36,17': ['poshtamt', 7, 6] },
};
// every outdoor place you can walk in, home region first
const AREA_IDS = Object.keys(AREAS).filter(id => !AREAS[id].inside && !AREAS[id].planned);

const LOOK = {
  Q: 'The Church of the Pokrova. Whitewashed walls, green domes. Someone regilds the crosses every Easter.',
  Z: 'You lower the bucket on the long sweep. The water is cold enough to make your teeth ache.',
  H: 'A haystack. It smells like the whole summer in one place.',
  N: 'The leleka clacks its beak at you.\nKle-ke-ke-ke.',
  B: 'The hive hums. In the old days you told the bees the family news, so they wouldn\'t take offence and fly away.',
  S: 'A sunflower: соняшник. Taller than you, heavy with seeds.',
  m: 'Mallows. Every khata has them by the door.',
  o: 'A fat pumpkin: гарбуз. A girl gives one to a suitor she is turning down. Hence the saying.',
  x: 'A wattle fence, woven from willow switches.',
  j: 'Clay pots drying upside down on the fence posts.',
  g: 'Cabbages in tidy rows. Halyna knows exactly how many there are.',
  C: 'A cherry tree: вишня. The fruit is dark and a little sour.',
  Y: 'A willow, верба, leans out over the water the way willows do.',
  P: 'A tall poplar. They line every road out of the village.',
  O: 'An oak: дуб. Older than the village, and it knows it.',
  R: 'A birch: береза. Its bark peels like paper.',
  A: 'The hut turns slowly on its hen\'s legs to look at you.\nХатко, хатко, стань до лісу задом, а до мене передом! It thinks about it, and turns its back.',
  V: 'Danylo\'s windmill: вітряк. The sails creak round and round.',
  b: 'A kamiana baba: a stone woman, older than anyone\'s grandmother\'s grandmother. She has seen a lot of steppe.',
  k: 'Kalyna: guelder rose. The berries are bitter until the first frost. It\'s in half the songs you know.',
  T: 'A market stall. Apples, pears, honey, jars of something pickled.',
  '~': 'Still water. Something big turns over under the surface.',
  F: 'The trees are thick and dark. Not this way.',
  wall: 'Whitewashed walls, warm from the sun. The thatch smells of dust.',
  v: 'An ox cart: віз. Chumaks crossed the whole steppe in these.',
  z: 'The ferry: пором. It creaks, but it floats.',
  h: 'Mamai\'s horse: кінь. It looks at you as if you owe it an apple.',
  n: 'A fishing boat: човен.',
  e: 'A heron: чапля. It stands on one leg and judges you.',
  $: 'A kozak grave on its mound, a rushnyk tied to the cross. Вічна пам\'ять: eternal memory.',
  '1': 'The pich: the great clay stove. You bake in it by day and sleep on top of it by night.',
  '2': 'A table under an embroidered cloth. There is always bread. Стіл: table.',
  '3': 'A bench along the wall, with a striped rug on it.',
  '4': 'A painted dowry chest: скриня. Full of embroidered shirts and secrets.',
  '5': 'A bed with a tower of pillows. Nobody sleeps on the top ones. They are for show.',
  '6': 'A school desk. Somebody has carved Т + О into it.',
  '7': 'A loom. The pattern is red and black: a rushnyk in the making.',
  '8': 'A spinning wheel. The wool smells of sheep.',
  '9': 'Thin beeswax candles flicker on a brass stand.',
  '0': 'A lectern with the old Gospel, open at a page of Church Slavonic.',
  q: 'Sacks of flour. Your nose itches.',
  U: 'Through the window: cherry trees and sky.',
  G: 'A rushnyk: an embroidered towel. Its patterns are older than the village.',
  J: 'A shelf of painted plates and clay jugs.',
  D: 'The blackboard says А Б В Г Ґ Д Е Є Ж. Someone has drawn a goose.',
  c: 'Cobwebs. Nobody has lived here for a while. Nobody human, anyway.',
  '|': 'The palisade of the Sich: oak logs, sharpened at the top. Частокіл.',
  '&': 'A kurin: the kozaks\' long barracks. A kurin is also the company of men who live in it. They all eat from one pot.',
  '@': 'A Kyiv house: tall windows, a balcony, and a cat on the sill.',
  '%': 'The Dormition cathedral: Успенський собор. The domes are covered in real gold.',
  '!': 'The Great Lavra Bell Tower. Дзвіниця. For a hundred years it was the tallest building in the land.',
  '(': 'A cannon: гармата. The kozaks give their cannons names, like dogs.',
  ')': 'A street lamp: ліхтар.',
  ']': 'Samson\'s fountain. They say whoever drinks from it will always come back to Kyiv.',
  '[': 'The way down into the caves: печери. Cool air breathes out of the door.',
  '<': 'A chaika: the kozaks\' longboat. Bundles of reeds along the sides keep it afloat even when it fills with water.',
  '{': 'A tram: трамвай. Kyiv had electric trams before any other city in the empire.',
  a: 'A chestnut tree: каштан. In May the whole city lights up with its white candles of flowers.',
  '^': 'A granite rock in the rapids. The water roars round it.',
  y: 'Granite: граніт. The bones of the land come up to the surface here.',
  l: 'The white wall of the Lavra, a metre thick.',
  '*': 'White water: the rapids. Nobody swims here. Nobody sensible.',
  t: 'A pine: сосна. Straight as a candle, and it smells of resin and sun.',
  I: 'A bort: a hollow cut high in a living pine for wild bees, closed with a board. Борть. The bortnyk climbs up with a rope.',
  W: 'The night train west: потяг. Blue and yellow, with a samovar in every carriage.',
  '-': 'Flax in flower: льон. Polissia linen starts here, sky-blue.',
  s: 'A spruce: смерека. The Hutsuls build everything from it: houses, churches, trembitas, cradles.',
  G: 'The old observatory on Pip Ivan. Built in the 1930s to watch the stars, burned in the war, and left to the wind. The Hutsuls call it Білий слон: the White Elephant.',
  'ц': 'A cliff of white limestone. Once, long ago, all of Podillia was the bottom of a warm sea; this is what the shells turned into.',
  'с': 'Steps. Сходи.',
  'ї': 'A crust of salt, white and crunchy underfoot. It crackles like frost.',
  'ж': 'The fortress of Kamianets: замок. Stone walls, eleven towers, and roofs like red pencils. Замок with the stress on the first syllable is a castle; on the second, замо́к, a lock.',
  'п': 'The cathedral of Peter and Paul. When the Turks held the town they built a minaret beside it, and when they left, the town put a golden Virgin Mary on top of the minaret. Nobody took anything down.',
  'р': 'The ratusha: the town hall. Ратуша. Its tower has a clock, a gallery, and, on a clear day, a view of half of Ukraine.',
  'о': 'The opera house: оперний театр. Built in 1887, and Odesa still thinks it is the most beautiful one in Europe. Odesa may be right.',
  'к': 'A ship: корабель. White, enormous, and smelling of paint and diesel.',
  'м': 'The lighthouse: маяк. At night it winks at the ships so they know where Odesa is. As if anyone could miss it.',
  'х': 'A heap of salt: сіль. White as a snowdrift, and if you lick it, which you just did, very salty.',
  'в': 'A pair of oxen in a yoke: воли. They look at you slowly, the way oxen look at everything.',
  'а': 'A white acacia: акація. In May the whole of Odesa smells of its flowers, and people stop in the street to sniff.',
  'я': 'An apple tree: яблуня. The apples are called яблука, and they are nearly ripe.',
  'л': 'A stone lion: лев. Lviv is the lion city, Львів, and there are thousands of lions: on doors, on roofs, on shields. This one looks bored.',
  'ч': 'A café table under an umbrella. A cup with coffee still in it. Its owner will be back. In Lviv, everyone always comes back for their coffee.',
};
// indoors some letters mean something else: in the church h and v are the iconostasis, outside they're the horse and the cart
const LOOK_IN = {
  h: 'The iconostasis: rows of saints in gold, looking at you kindly but firmly.',
  v: 'The royal doors. Only the priest goes through those.',
  Y: 'Books from floor to ceiling. Книжки. Some in Ukrainian, some in Latin, one in a language nobody can read.',
  o: 'A niche in the clay wall, with an icon and a tiny lamp. Monks lived and prayed down here for centuries.',
};
// outdoors these letters are new things; indoors they keep their old meanings
Object.assign(LOOK_IN, { k: 'A long wooden counter, polished by a hundred years of elbows.', I: 'The pokuttia, the icon corner: an icon draped with a rushnyk, and a little red lamp.', W: 'Whitewashed walls, with a painted border along the bottom.' });

// ─── Area assembly ────────────────────────────────────────────────────────
const SIZES = { G: [4, 4], W: [8, 2], K: [4, 3], L: [4, 3], M: [4, 3], Q: [5, 4], Z: [2, 1], H: [2, 1], A: [3, 2], V: [2, 2], T: [2, 1], v: [2, 1], z: [3, 2], h: [2, 1],
  '&': [4, 3], '@': [4, 3], '%': [5, 4], '!': [2, 2], ']': [2, 2], '[': [2, 1], '<': [3, 1], '{': [3, 1],
  'ж': [9, 5], 'п': [5, 4], 'р': [6, 5], 'о': [7, 4], 'к': [8, 3], 'м': [2, 2], 'х': [2, 1], 'в': [2, 1] };
const IN_SIZES = { '1': [3, 2], '2': [2, 1], '5': [1, 2], '7': [2, 1], r: [2, 1] };
const WALKABLE = new Set(['.', ',', '"', '=', '#', 'w', 'f', 'u', 'r', 'p', '_', '+', 'E', ':', ';', '-', 'с', 'ї']);
const WORLD = {};
let area = 'vyshneve', AR = AREAS.vyshneve, blocked, owner, objects, entities = [];
const idx = (x, y) => y * MW + x;

const SPR = {};
function buildSprites() {
  SPR.khata = { K: makeKhata(TRIMS.K, THATCH, 1), L: makeKhata(TRIMS.L, REED, 2), M: makeKhata(TRIMS.M, THATCH, 3) };
  SPR.church = makeChurch();
  SPR.well = makeWell();
  SPR.hay = [makeHaystack(1), makeHaystack(2)];
  SPR.trees = {
    C: [1, 2, 3].map(s => makeTree('C', s)), Y: [1, 2].map(s => makeTree('Y', s)), P: [1, 2].map(s => makeTree('P', s)),
    O: [1, 2, 3].map(makeOak), R: [1, 2, 3].map(makeBirch), k: [1, 2, 3].map(makeKalyna),
  };
  SPR.sun = [makeSunflower(0), makeSunflower(1)];
  SPR.mallows = makeMallows();
  SPR.pumpkins = makePumpkins();
  SPR.hive = makeBeehive();
  SPR.stork = [makeStork(0), makeStork(1)];
  SPR.sign = makeSign();
  SPR.goose = [makeGoose(0), makeGoose(1)];
  SPR.gooseR = SPR.goose.map(flipH);
  SPR.hut = [makeHut(0), makeHut(1)];
  SPR.mill = makeWindmill();
  SPR.sails = Array.from({ length: 8 }, (_, i) => makeSails(i * Math.PI / 16));
  SPR.baba = makeStoneBaba();
  SPR.stall = [makeStall(1), makeStall(2)];
  SPR.pich = makePich(); SPR.table = makeTable(); SPR.bench = makeBench(); SPR.chest = makeChest(); SPR.bed = makeBed();
  SPR.desk = makeDesk(); SPR.loom = makeLoom(); SPR.wheel = makeWheel(); SPR.candles = makeCandleStand(); SPR.lectern = makeLectern(); SPR.sacks = makeSacks();
  SPR.cat = [makeCat(0), makeCat(1)]; SPR.catR = SPR.cat.map(flipH);
  SPR.fire = [0, 1, 2].map(makeFire); SPR.fern = [makeFernFlower(0), makeFernFlower(1)];
  SPR.cart = makeCart(); SPR.raft = makeRaft(); SPR.horse = makeHorse(); SPR.boat = makeBoat(); SPR.heron = makeHeron(); SPR.cross = makeCross();
  SPR.dog = [makeDog(0), makeDog(1)]; SPR.dogR = SPR.dog.map(flipH); SPR.hen = [makeHen(0), makeHen(1)]; SPR.henR = SPR.hen.map(flipH);
  SPR.palisade = makePalisade(); SPR.chestnut = [1, 2, 3].map(makeChestnut); SPR.rock = [1, 2, 3].map(s => makeRock(s, true)); SPR.boulder = [4, 5].map(s => makeRock(s, false));
  SPR.whitewall = makeWhiteWall(); SPR.kurin = [makeKurin(4), makeKurin(5)]; SPR.town = [0, 1, 2, 3, 4].map(makeTownhouse);
  SPR.lavra = makeChurch(Object.assign({ wall: '#fbf8f0' }, GOLD_DOMES)); SPR.sichChurch = makeChurch(SICH_CHURCH); SPR.bells = makeBellTower();
  SPR.pigeon = [makePigeon(0), makePigeon(1)]; SPR.pigeonR = SPR.pigeon.map(flipH); SPR.reliquary = makeReliquary(); SPR.kalyta = makeKalyta();
  SPR.churches = { andrew: makeChurch(ANDREW_CHURCH), wood: makeChurch(WOOD_CHURCH) };
  SPR.pine = [1, 2, 3].map(s => makePine(s)); SPR.bort = makePine(4, true); SPR.train = makeTrain(); SPR.magpie = [makeMagpie(0), makeMagpie(1)]; SPR.magpieR = SPR.magpie.map(flipH);
  SPR.spruce = [1, 2, 3].map(makeSpruce); SPR.sheep = [makeSheep(0), makeSheep(1)]; SPR.sheepR = SPR.sheep.map(flipH); SPR.observatory = makeObservatory(); SPR.nest = makeNest(); SPR.ashes = [makeAshes(0), makeAshes(1)];
  SPR.hutsulKhata = { K: makeKhata([C.wd2, C.wd3], GONTA, 7, true), L: makeKhata(['#c8383a', C.wd3], GONTA, 8, true), M: makeKhata(['#e9b949', C.wd3], GONTA, 9, true) };
  SPR.logKhata = { K: makeKhata([C.wd2, C.wd3], REED, 4, true), L: makeKhata(['#c8383a', C.wd3], THATCH, 5, true), M: makeKhata(['#3f6fc4', C.wd3], REED, 6, true) };
  SPR.castle = [makeCastle(false), makeCastle(true)]; SPR.minaret = makeMinaret(); SPR.ratusha = { lviv: makeRatusha(['#efe2c4', '#d4c4a0', '#b4a07c'], ['#9cc8b8', '#5f9a84', '#3f7262']), kamianets: makeRatusha(['#f6eedc', '#ddd2b8', '#bcae90'], TILE_ROOF) };
  SPR.opera = makeOpera(); SPR.ship = makeShip(false); SPR.raketa = makeShip(true); SPR.lighthouse = makeLighthouse(); SPR.acacia = [1, 2, 3].map(makeAcacia); SPR.apple = [1, 2, 3].map(makeApple);
  SPR.salt = [makeSaltHeap(1), makeSaltHeap(2)]; SPR.oxen = makeOxen(); SPR.oxenR = flipH(SPR.oxen); SPR.lion = [makeLion(0), makeLion(1)]; SPR.cafe = [0, 1, 2].map(makeCafeTable);
  SPR.lvivTown = [0, 1, 2, 3, 4, 5, 6].map(makeLvivHouse); SPR.vylkoveKhata = { K: makeKhata(['#4f86c6', '#2f5f9a'], REED, 10), L: makeKhata(['#3f9ac8', '#2a6a92'], REED, 11), M: makeKhata(['#6a9ad8', '#3f6fa8'], REED, 12) };
  SPR.churches.lipovan = makeChurch(LIPOVAN_CHURCH);
  SPR.balloons = [['#e8463c', '#f6d03c'], ['#3f78d0', '#fbf8f0'], ['#4c9c66', '#f6a03c'], ['#9a5ac8', '#f6c8e0']].map(cl => [makeBalloon(cl, 0), makeBalloon(cl, 1)]);
  SPR.gull = [makeGull(0), makeGull(1)]; SPR.gullR = SPR.gull.map(flipH); SPR.pelican = [makePelican(0), makePelican(1)]; SPR.pelicanR = SPR.pelican.map(flipH);
  SPR.flamingo = [makeFlamingo(0), makeFlamingo(1)]; SPR.flamingoR = SPR.flamingo.map(flipH); SPR.booth = makeBooth(); SPR.counter = makeCounter(); SPR.lizard = [makeLizard(0), makeLizard(1)];
  SPR.cannon = makeCannon(); SPR.lamp = makeLamp(); SPR.fountain = makeFountain(); SPR.cave = makeCaveMouth(); SPR.chaika = makeChaika(); SPR.tram = makeTram();
  SPR.fence = {};
  for (const k of ['h', 'v', 'hv', '', 'hp', 'vp', 'hvp', 'p']) SPR.fence[k] = makeFence(k.includes('h'), k.includes('v'), k.includes('p'));
}

const isFence = c => c === 'x' || c === 'j';
function useMap(id) {
  MAP = MAPS[id]; MW = MAP[0].length; MH = MAP.length;
}
function buildArea(id) {
  useMap(id);
  const W = { blocked: new Uint8Array(MW * MH), owner: new Array(MW * MH).fill(null), objects: [], ents: [] };
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) if (!WALKABLE.has(T(tx, ty))) W.blocked[idx(tx, ty)] = 1;
  if (AREAS[id].inside) return buildInside(id, W);
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
    const ch = T(tx, ty), px = tx * 16, py = ty * 16, v = Math.floor(hash(tx, ty, 77) * 4);
    const add = (o, w = 1, h = 1) => {
      Object.assign(o, { tx, ty, w, h, ch, base: o.base != null ? o.base : (ty + h) * 16 });
      W.objects.push(o);
      for (let y = ty; y < ty + h; y++) for (let x = tx; x < tx + w; x++) { W.blocked[idx(x, y)] = 1; W.owner[idx(x, y)] = o; }
    };
    if (ch === 'K' || ch === 'L' || ch === 'M') add({ img: (AREAS[id].houses2 ? SPR[AREAS[id].houses2] : SPR.khata)[ch], x: px, y: py - 16 }, 4, 3);
    else if (ch === 't') { const t = SPR.pine[v % 3]; add({ img: t.img, x: px + t.ox, y: py + 16 - t.img.height }); }
    else if (ch === 'I') add({ img: SPR.bort.img, x: px + SPR.bort.ox, y: py + 16 - SPR.bort.img.height });
    else if (ch === 's') { const t = SPR.spruce[v % 3]; add({ img: t.img, x: px + t.ox, y: py + 16 - t.img.height }); }
    else if (ch === 'G') add({ img: SPR.observatory, x: px, y: py + 64 - 96 }, 4, 4);
    else if (ch === 'ж') add({ img: SPR.castle[0], pick: () => SPR.castle[kamStep() >= 2 ? 1 : 0], x: px, y: py + 80 - 132 }, 9, 5);
    else if (ch === 'п') add({ img: SPR.minaret, x: px, y: py + 64 - 150 }, 5, 4);
    else if (ch === 'р') add({ img: SPR.ratusha[id === 'lviv' ? 'lviv' : 'kamianets'], x: px, y: py + 80 - 176 }, 6, 5);
    else if (ch === 'о') add({ img: SPR.opera, x: px, y: py + 64 - 108 }, 7, 4);
    else if (ch === 'к') add({ img: id === 'vylkove' ? SPR.raketa : SPR.ship, x: px, y: py + 48 - 58, bob: true }, 8, 3);
    else if (ch === 'м') add({ img: SPR.lighthouse, x: px, y: py + 32 - 84 }, 2, 2);
    else if (ch === 'х') add({ img: SPR.salt[v & 1], x: px, y: py + 16 - 22 }, 2, 1);
    else if (ch === 'в') add({ img: v & 1 ? SPR.oxenR : SPR.oxen, x: px, y: py + 16 - 22 }, 2, 1);
    else if (ch === 'а') { const t = SPR.acacia[v % 3]; add({ img: t.img, x: px + t.ox, y: py + 16 - t.img.height }); }
    else if (ch === 'я') { const t = SPR.apple[v % 3]; add({ img: t.img, x: px + t.ox, y: py + 16 - t.img.height }); }
    else if (ch === 'л') add({ img: SPR.lion[tx & 1], x: px, y: py + 16 - 30 });
    else if (ch === 'ч') add({ img: SPR.cafe[(tx + ty) % 3], x: px, y: py + 16 - 32 });
    else if (ch === 'W') add({ img: SPR.train, x: px, y: py + 32 - 44 }, 8, 2);
    else if (ch === 'Q') add({ img: AREAS[id].church ? SPR.churches[AREAS[id].church] : AREAS[id].sich ? SPR.sichChurch : SPR.church, x: px, y: py + 64 - 112 }, 5, 4);
    else if (ch === '%') add({ img: SPR.lavra, x: px, y: py + 64 - 112 }, 5, 4);
    else if (ch === '&') add({ img: SPR.kurin[v & 1], x: px, y: py - 16 }, 4, 3);
    else if (ch === '@') { const set = SPR[AREAS[id].town || 'town'], img = set[(AREAS[id].town ? tx * 5 + ty * 3 : tx * 7 + ty * 3) % set.length]; add({ img, x: px, y: py + 48 - img.height }, 4, 3); }
    else if (ch === '!') add({ img: SPR.bells, x: px, y: py + 32 - 150 }, 2, 2);
    else if (ch === ']') add({ img: SPR.fountain, x: px, y: py + 32 - 48 }, 2, 2);
    else if (ch === '[') add({ img: SPR.cave, x: px, y: py + 16 - 32 }, 2, 1);
    else if (ch === '<') add({ img: SPR.chaika, x: px, y: py + 16 - 22, bob: true }, 3, 1);
    else if (ch === '{') add({ img: SPR.tram, x: px, y: py + 16 - 32 }, 3, 1);
    else if (ch === '(') add({ img: SPR.cannon, x: px - 2, y: py + 2 });
    else if (ch === ')') add({ img: SPR.lamp, x: px, y: py + 16 - 40 });
    else if (ch === '^') add({ img: SPR.rock[v % 3], x: px, y: py - 2 });
    else if (ch === 'y') add({ img: SPR.boulder[v & 1], x: px, y: py - 2 });
    else if (ch === '|') add({ img: SPR.palisade, x: px, y: py + 16 - 30 });
    else if (ch === 'l') add({ img: SPR.whitewall, x: px, y: py + 16 - 26 });
    else if (ch === 'a') { const t = SPR.chestnut[v % 3]; add({ img: t.img, x: px + t.ox, y: py + 16 - t.img.height }); }
    else if (ch === 'Z') add({ img: SPR.well, x: px, y: py + 16 - 56 }, 2, 1);
    else if (ch === 'H') add({ img: SPR.hay[v & 1], x: px, y: py + 16 - 30 }, 2, 1);
    else if (ch === 'A') add({ anim: 'hut', x: px - 4, y: py + 32 - 80 }, 3, 2);
    else if (ch === 'V') add({ anim: 'mill', x: px - 8, y: py + 32 - 88 }, 2, 2);
    else if (ch === 'T') add({ img: SPR.stall[v & 1], x: px, y: py + 16 - 30 }, 2, 1);
    else if (ch === 'v') add({ img: SPR.cart, x: px, y: py + 16 - 24 }, 2, 1);
    else if (ch === 'z') add({ img: SPR.raft, x: px, y: py + 32 - 32, base: (ty + 1) * 16 }, 3, 2);
    else if (ch === 'h') add({ img: SPR.horse, x: px, y: py + 16 - 21 }, 2, 1);
    else if (ch === 'n') add({ img: SPR.boat, x: px - 2, y: py + 4, bob: true }, 1, 1);
    else if (ch === 'e') add({ img: SPR.heron, x: px, y: py + 16 - 17 }, 1, 1);
    else if (ch === '$') add({ img: SPR.cross, x: px, y: py + 16 - 26 }, 1, 1);
    else if ('CYPORk'.includes(ch)) {
      const list = SPR.trees[ch], t = list[v % list.length];
      add({ img: t.img, x: px + t.ox, y: py + 16 - t.img.height });
    }
    else if (ch === 'S') add({ anim: 'sun', x: px, y: py + 16 - 32, phase: hash(tx, ty, 5) * 6 });
    else if (ch === 'm') add({ img: SPR.mallows, x: px, y: py + 16 - 28 });
    else if (ch === 'o') add({ img: SPR.pumpkins, x: px, y: py });
    else if (ch === 'B') add({ img: SPR.hive, x: px, y: py + 16 - 20, bees: true });
    else if (ch === 'N') add({ anim: 'stork', x: px - 4, y: py + 16 - 64 });
    else if (ch === 'b') add({ img: SPR.baba, x: px, y: py + 16 - 28 });
    else if (ch === 'i') add({ img: SPR.sign, x: px, y: py + 16 - 20 });
    else if (isFence(ch)) {
      const h = isFence(T(tx - 1, ty)) || isFence(T(tx + 1, ty)), vv = isFence(T(tx, ty - 1)) || isFence(T(tx, ty + 1));
      add({ img: SPR.fence[(h ? 'h' : '') + (vv ? 'v' : '') + (ch === 'j' ? 'p' : '')], x: px, y: py + 16 - 22 });
    }
  }
  W.ground = buildGround(AREAS[id].G, AREAS[id].paved);
  addPeople(id, W);
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) if (T(tx, ty) === 'd') W.ents.push(makeEntity({ tx, ty, dir: 'left', goose: true, water: true, wander: 3, name: 'Goose' }));
  W.motes = [];
  const fl = [];
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) if (',p'.includes(T(tx, ty)) || (AREAS[id].dark && T(tx, ty) === 'f')) fl.push([tx, ty]);
  for (let i = 0; i < (AREAS[id].dark ? 14 : 6) && fl.length; i++) {
    const [tx, ty] = fl[Math.floor(hash(i, 9, 200 + id.length) * fl.length)];
    W.motes.push({ cx: tx * 16 + 8, cy: ty * 16 + 4, r: 10 + i % 5 * 2, a: i, sp: .4 + hash(i, 1, 201) * .5, ph: i, x: 0, y: 0,
      col: AREAS[id].dark ? '#f3f0a0' : (i % 2 ? '#fbf8f0' : '#f6e27a'), glow: !!AREAS[id].dark });
  }
  return W;
}

function addPeople(id, W) {
  for (const n of NPCS[id] || []) { const e = makeEntity(n); if (!n.kind) e.frames = buildPerson(n.pal, n.mods); W.ents.push(e); }
}
function buildInside(id, W) {
  const sprite = { '1': SPR.pich, '2': SPR.table, '3': SPR.bench, '4': SPR.chest, '5': SPR.bed, '6': SPR.desk, '7': SPR.loom, '8': SPR.wheel, '9': SPR.candles, '0': SPR.lectern, q: SPR.sacks, r: SPR.reliquary, k: SPR.counter };
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
    const ch = T(tx, ty), img = sprite[ch];
    if (!img) continue;
    const [w, h] = IN_SIZES[ch] || [1, 1];
    const o = { img, x: tx * 16, y: (ty + h) * 16 - img.height, tx, ty, w, h, ch, base: (ty + h) * 16, candles: ch === '9' };
    W.objects.push(o);
    for (let y = ty; y < ty + h; y++) for (let x = tx; x < tx + w; x++) { W.blocked[idx(x, y)] = 1; W.owner[idx(x, y)] = o; }
  }
  W.ground = buildInterior(AREAS[id].cave, AREAS[id].stone);
  addPeople(id, W);
  W.motes = [];
  return W;
}

function enterArea(id, tx, ty, dir) {
  if (!WORLD[id]) WORLD[id] = buildArea(id);
  const W = WORLD[id];
  useMap(id);
  area = id; AR = AREAS[id];
  blocked = W.blocked; owner = W.owner; objects = W.objects; entities = W.ents; ground = W.ground;
  if (!entities.includes(player)) entities.unshift(player);
  for (const k of Object.keys(WORLD)) if (k !== id) { const i = WORLD[k].ents.indexOf(player); if (i >= 0) WORLD[k].ents.splice(i, 1); }
  Object.assign(player, { tx, ty, x: tx * 16, y: ty * 16, fx: tx, fy: ty, nx: tx, ny: ty, moving: false, dir });
  snapCamera();
  showAreaName();
  playMusic(areaMusic());
  onAreaEnter(id);
}
const areaMusic = () => (S.f.night && !AR.inside ? 'night' : AR.music);

// ─── Entities ─────────────────────────────────────────────────────────────
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };
function makeEntity(o) {
  return Object.assign({ x: o.tx * 16, y: o.ty * 16, moving: false, t: 0, step: 0, fx: o.tx, fy: o.ty, nx: o.tx, ny: o.ty, home: [o.tx, o.ty], timer: 1 + Math.random() * 3, talked: 0 }, o);
}
const player = makeEntity({ id: 'you', tx: 22, ty: 22, dir: 'down', frames: null, turnT: 0, bump: 0 });

// who is here right now: some people only come out at night, some only by day, some only once the story allows
const present = e => !(e.night && !S.f.night) && !(e.day && S.f.night) && !(e.when && !e.when());
function occupied(x, y, self) {
  return entities.some(e => e !== self && present(e) && ((e.tx === x && e.ty === y) || (e.moving && e.nx === x && e.ny === y)));
}
function canStand(x, y, self) {
  if (x < 0 || y < 0 || x >= MW || y >= MH) return false;
  if (self.water) return (T(x, y) === '~' || T(x, y) === 'd') && !occupied(x, y, self);
  if (self !== player && AR.exits.some(e => e.x === x && e.y === y)) return false;
  return !blocked[idx(x, y)] && !occupied(x, y, self);
}
function startMove(e, dir) {
  e.dir = dir;
  const [dx, dy] = DIRS[dir], nx = e.tx + dx, ny = e.ty + dy;
  if (!canStand(nx, ny, e)) return false;
  e.moving = true; e.t = 0; e.fx = e.tx; e.fy = e.ty; e.nx = nx; e.ny = ny; e.step++;
  return true;
}
function advance(e, dt, dur) {
  e.t += dt / dur;
  if (e.t >= 1) { e.t = 1; e.moving = false; e.tx = e.nx; e.ty = e.ny; }
  e.x = Math.round((e.fx + (e.nx - e.fx) * e.t) * 16);
  e.y = Math.round((e.fy + (e.ny - e.fy) * e.t) * 16);
}

// ─── Input ────────────────────────────────────────────────────────────────
const held = new Set();
let runHeld = false;
const KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
const order = [];
function press(d) { if (!held.has(d)) { held.add(d); order.push(d); } }
function release(d) { held.delete(d); const i = order.lastIndexOf(d); if (i >= 0) order.splice(i, 1); }
const heldDir = () => order.length ? order[order.length - 1] : null;
const isA = k => k === 'z' || k === 'Z' || k === ' ' || k === 'Enter';
const isB = k => k === 'x' || k === 'X' || k === 'Escape' || k === 'Backspace';
// Shortcuts go by where a key sits, not what it types, so they work in the Ukrainian layout too: C is С, Z is Я, X is Ч.
const keyOf = e => /^Key[A-Z]$/.test(e.code || '') ? e.code[3].toLowerCase() : e.key;
addEventListener('keydown', e => {
  unlockAudio();
  const k = keyOf(e);
  if (naming()) { if (e.key === 'Enter') { e.preventDefault(); submitName(); } return; }
  if (overlayKey({ key: k, raw: e.key, repeat: e.repeat })) { e.preventDefault(); return; }
  if (KEYMAP[k] && !talking()) { press(KEYMAP[k]); e.preventDefault(); return; }
  if (talking()) {
    if (k === 't') { flipLang(); e.preventDefault(); return; }
    if (KEYMAP[k]) { askMove(KEYMAP[k]); e.preventDefault(); return; }
    if (isA(k) && !e.repeat) { actionA(); e.preventDefault(); }
    return;
  }
  if (k === 'Shift' || k === 'x') runHeld = true;
  else if (k === 'c' || k === 'Tab') { openDex(); e.preventDefault(); }
  else if (isA(k)) { if (!e.repeat) actionA(); e.preventDefault(); }
});
addEventListener('keyup', e => {
  const k = keyOf(e);
  if (KEYMAP[k]) release(KEYMAP[k]);
  else if (k === 'Shift' || k === 'x') runHeld = false;
});
addEventListener('blur', () => { held.clear(); order.length = 0; runHeld = false; });

// ─── Dialogue ─────────────────────────────────────────────────────────────
const dlg = document.getElementById('dlg'), who = document.getElementById('who'), txt = document.getElementById('txt'), more = document.getElementById('more'), askEl = document.getElementById('ask');
const COLS = 34, LINES = 3;
// A conversation is a list of lines; a line is a string, or [English, Ukrainian].
// Each line is wrapped into pages in whichever language it is showing.
let lines = [], lineI = 0, pages = [], pageI = 0, shown = 0, onClose = null, ask = null, askI = 0, dlgLang = 'en', curSpeaker = null;
const SPEAKER_UA = { 'The stork': 7, 'The bees': 7, 'The domovyk': 7, 'Murko': 5, 'A goose': 5, 'Sirko': 5 };
const lineText = (l, lang) => Array.isArray(l) ? (lang === 'ua' && l[1] ? l[1] : l[0]) : l;
// A person's `ua` says how early they switch to Ukrainian, spread out so the whole country speaks it only once you hold all 25:
// 1 (children) at 6 pysanky, 5 at 12, 9 at 17, 13 at 22, 15 and up at 25.
const uaAt = ua => Math.min(25, Math.round(5 + ua * 4 / 3));
function speaksUA(name) {
  const mode = S.f.lang || 'auto';
  if (mode === 'en') return false;
  if (mode === 'ua') return true;
  const at = curSpeaker && curSpeaker.name === name ? curSpeaker.ua : SPEAKER_UA[name];
  return at != null && badgeCount() >= uaAt(at);
}
const langTag = document.getElementById('langTag');
function layoutLine() {
  const ua = dlgLang === 'ua';
  pages = wrap(lineText(lines[lineI], dlgLang), ua ? 40 : COLS); pageI = 0; shown = 0;
  dlg.classList.toggle('ua', ua);
  const l = lines[lineI], flippable = Array.isArray(l) && l[1];
  langTag.hidden = !flippable;
  langTag.textContent = ua ? 'T · ENG' : 'T · УКР';
}
function flipLang() {
  const l = lines[lineI];
  if (!talking() || !Array.isArray(l) || !l[1]) return;
  dlgLang = dlgLang === 'ua' ? 'en' : 'ua';
  layoutLine(); askEl.hidden = true; sfx('tick');
}
langTag.addEventListener('pointerdown', e => { e.stopPropagation(); flipLang(); });
const lastPage = () => lineI === lines.length - 1 && pageI === pages.length - 1;
function wrap(text, cols = COLS, lines = LINES) {
  const out = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const w of para.split(' ')) {
      if (line && (line + ' ' + w).length > cols) { out.push(line); line = w; } else line = line ? line + ' ' + w : w;
    }
    out.push(line);
  }
  const pg = [];
  for (let i = 0; i < out.length; i += lines) pg.push(out.slice(i, i + lines).join('\n'));
  return pg;
}
// say(name, pages, done, choice): choice = { options: ['Yes', 'No'], pick: i => ... } shown after the last page
function say(name, list, done, choice) {
  lines = list.length ? list : ['...']; lineI = 0; onClose = done || null; ask = choice || null; askI = 0;
  dlgLang = speaksUA(name) ? 'ua' : 'en';
  layoutLine();
  who.textContent = name || ''; dlg.hidden = false; more.hidden = true; txt.textContent = ''; askEl.hidden = true;
  held.clear(); order.length = 0;
}
const talking = () => !dlg.hidden;
function renderAsk() {
  askEl.hidden = false;
  askEl.innerHTML = '';
  ask.options.forEach((o, i) => {
    const b = document.createElement('button');
    b.textContent = lineText(o, dlgLang); b.className = i === askI ? 'sel' : '';
    b.addEventListener('click', ev => { ev.stopPropagation(); askI = i; pickAsk(); });
    askEl.appendChild(b);
  });
}
function askMove(d) {
  if (!ask || askEl.hidden) return;
  askI = (askI + (d === 'up' || d === 'left' ? -1 : 1) + ask.options.length) % ask.options.length;
  sfx('tick'); renderAsk();
}
function pickAsk() {
  const a = ask; ask = null; dlg.hidden = true; askEl.hidden = true;
  sfx('tick');
  a.pick(askI);
}
function actionA() {
  if (MAPVIEW || overlayOpen()) return;
  if (talking()) {
    const p = pages[pageI];
    if (shown < p.length) { shown = p.length; return; }
    if (ask && lastPage()) { pickAsk(); return; }
    pageI++; shown = 0;
    if (pageI >= pages.length) {
      lineI++;
      if (lineI >= lines.length) { dlg.hidden = true; const f = onClose; onClose = null; f && f(); }
      else layoutLine();
    }
    return;
  }
  if (player.moving || warp) return;
  const [dx, dy] = DIRS[player.dir], fx = player.tx + dx, fy = player.ty + dy;
  const npc = entities.find(e => e !== player && present(e) && e.tx === fx && e.ty === fy);
  if (npc) {
    curSpeaker = null;
    if (npc.goose) return animalTalk('goose') || say('', [L('Ha-ha-ha! The goose is not impressed.\n(Гуска: goose.)', 'Га-га-га! Гуска не вражена.')]);
    if (!npc.kind) npc.dir = OPPOSITE[player.dir];
    npc.busy = true; curSpeaker = npc;
    const release = () => { npc.busy = false; npc.timer = 2; };
    const hello = greeting(npc);
    if (hello) return say(npc.name, hello, () => talkTo(npc, release));
    return talkTo(npc, release);
  }
  const ch = T(fx, fy), o = owner[idx(fx, fy)] || null;
  const hook = STORY_LOOK[area + ':' + (o ? o.ch : ch)] || STORY_LOOK['*:' + (o ? o.ch : ch)];
  if (hook && hook(o)) return;
  if (o && 'KLM'.includes(o.ch)) {
    const house = AR.houses[o.tx + ',' + o.ty];
    if (fx === o.tx + 2 && fy === o.ty + 2 && house) return say('', [house]);
    return say('', [LOOK.wall]);
  }
  if (o && o.ch === 'Q' && fx === o.tx + 2 && fy === o.ty + 3) return say('', ['The door is open a crack. Inside, candles flicker in front of the iconostasis, and it smells of wax and lime blossom.']);
  if (ch === 'i') return say('', [AR.signs[fx + ',' + fy] || '...']);
  const key = o ? o.ch : (ch === 'd' ? '~' : ch);
  const look = (AR.inside && LOOK_IN[key]) || (AR.look && AR.look[key]) || LOOK[key];
  if (look) say('', [look]);
}

function talkTo(npc, release) {
  if (errandTalk(npc, release)) return;
  if (typeof npc.talk === 'function') return npc.talk(npc, release);
  const conv = npc.talk[npc.talked % npc.talk.length]; npc.talked++;
  say(npc.name, conv, release);
}

// ─── Rendering ────────────────────────────────────────────────────────────
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
let ground;
let camX = 0, camY = 0, time = 0;
const cloudShadows = [];
function makeCloudShadow(seed) {
  const [c, x] = mk(120, 60);
  x.fillStyle = 'rgba(24,30,64,0.10)';
  for (let Y = 0; Y < 60; Y++) for (let X = 0; X < 120; X++) {
    let inside = false;
    for (const [cx, cy, r] of [[40, 32, 26], [68, 26, 30], [92, 36, 20], [56, 40, 22]]) {
      if (Math.hypot(X - cx, (Y - cy) * 1.6) + (hash(X >> 2, Y >> 2, seed) - .5) * 6 < r) inside = true;
    }
    if (inside) x.fillRect(X, Y, 1, 1);
  }
  return c;
}

function drawEntity(e) {
  const sx = e.x - camX, sy = e.y - camY;
  if (sx < -32 || sy < -32 || sx > cv.width + 16 || sy > cv.height + 16) return;
  if (e.goose) {
    const set = (e.dir === 'right') ? SPR.gooseR : SPR.goose;
    ctx.drawImage(set[Math.floor(time * 2 + e.home[0]) % 2], sx + 2, sy + 3 + (Math.floor(time * 2 + e.home[1]) % 2));
    return;
  }
  if (e.kind === 'dog') { ctx.drawImage((e.dir === 'right' ? SPR.dogR : SPR.dog)[e.moving ? Math.floor(time * 6) % 2 : 0], sx, sy + 3); return; }
  if (e.kind === 'pigeon') { ctx.drawImage((e.dir === 'right' ? SPR.pigeonR : SPR.pigeon)[e.moving ? Math.floor(time * 8) % 2 : Math.floor(time * 1.3 + e.home[0]) % 2], sx + 2, sy + 5); return; }
  if (e.kind === 'nest') {   // the magpies' nest, glittering with stolen words while it's full
    ctx.drawImage(SPR.nest, sx - 14, sy - 6);
    if (e.full()) for (let k = 0; k < 9; k++) { if (Math.sin(time * 4 + k * 1.7) < 0) continue; ctx.fillStyle = k % 2 ? '#f3c84f' : '#fbf8f0'; ctx.fillRect(sx - 8 + ((k * 7) % 28), sy - 3 + ((k * 5) % 5), 2, 2); }
    return;
  }
  if (e.kind === 'sheep') { ctx.drawImage((e.dir === 'right' ? SPR.sheepR : SPR.sheep)[e.moving ? Math.floor(time * 6) % 2 : 0], sx + 1, sy + 5); return; }
  if (e.kind === 'ashes') { ctx.drawImage(SPR.ashes[Math.floor(time * 2) % 2], sx, sy - 8); return; }
  if (e.kind === 'magpie') { ctx.drawImage((e.dir === 'right' ? SPR.magpieR : SPR.magpie)[e.moving ? Math.floor(time * 8) % 2 : Math.floor(time * 2 + e.home[0]) % 2], sx + 1, sy + 6); return; }
  if (e.kind === 'scarecrow') { ctx.drawImage(makeScarecrow(e.bits(), e.alive()), sx - 2, sy - 14 + (e.alive() ? Math.round(Math.sin(time * 3) * 1) : 0)); return; }
  if (e.kind === 'kalyta') { ctx.drawImage(SPR.kalyta, sx, sy - 18 + Math.round(Math.sin(time * 1.5) * 1)); return; }
  if (e.kind === 'gull') { ctx.drawImage((e.dir === 'right' ? SPR.gullR : SPR.gull)[e.moving ? Math.floor(time * 6) % 2 : Math.floor(time * 1.1 + e.home[0]) % 2], sx + 1, sy + 7 - (e.moving ? 4 : 0)); return; }
  if (e.kind === 'pelican') { ctx.drawImage((e.dir === 'right' ? SPR.pelicanR : SPR.pelican)[Math.floor(time * 1.4 + e.home[0]) % 2], sx, sy + 3 + Math.round(Math.sin(time * 1.5 + e.home[1]))); return; }
  if (e.kind === 'flamingo') { ctx.drawImage((e.dir === 'right' ? SPR.flamingoR : SPR.flamingo)[Math.floor(time * .8 + e.home[0]) % 2], sx + 4, sy - 2); return; }
  if (e.kind === 'lizard') { ctx.drawImage(SPR.lizard[Math.floor(time * .7 + e.home[0]) % 2], sx + 1, sy + 7); return; }
  if (e.kind === 'booth') { ctx.drawImage(SPR.booth, sx, sy - 16); return; }
  if (e.kind === 'balloon') {   // tethered on the field; once Kamianets has its colours back, up they go
    const up = e.up(), lift = up ? 34 + Math.sin(time * .9 + e.home[0]) * 4 : 0, img = SPR.balloons[e.look][up && Math.floor(time * 2 + e.home[0]) % 3 === 0 ? 1 : 0];
    ctx.fillStyle = 'rgba(30,48,26,.28)'; ctx.fillRect(sx, sy + 12, 16, 4);
    if (up) { ctx.fillStyle = C.out; ctx.fillRect(sx + 7, Math.round(sy - 4 - lift), 1, Math.round(lift) + 16); }
    ctx.drawImage(img, sx - 7, Math.round(sy - 30 - lift));
    return;
  }
  if (e.kind === 'hen') { ctx.drawImage((e.dir === 'right' ? SPR.henR : SPR.hen)[e.moving ? Math.floor(time * 8) % 2 : 0], sx + 2, sy + 5); return; }
  if (e.kind === 'wisp') {
    const bx = sx + 8 + Math.round(Math.sin(time * 1.3 + e.home[0]) * 3), by = sy + 4 + Math.round(Math.cos(time * 1.7 + e.home[1]) * 2);
    ctx.fillStyle = 'rgba(180,230,255,.25)'; ctx.fillRect(bx - 3, by - 3, 7, 7);
    ctx.fillStyle = 'rgba(200,240,255,.6)'; ctx.fillRect(bx - 1, by - 1, 3, 3);
    ctx.fillStyle = '#f4fbff'; ctx.fillRect(bx, by, 1, 1);
    return;
  }
  if (e.kind === 'cat') { ctx.drawImage((e.dir === 'right' ? SPR.catR : SPR.cat)[Math.floor(time * 1.5) % 2], sx, sy + 2); return; }
  if (e.kind === 'fire') { ctx.drawImage(SPR.fire[Math.floor(time * 8) % 3], sx, sy - 8); return; }
  if (e.kind === 'fern') { ctx.drawImage(SPR.fern[Math.floor(time * 3) % 2], sx, sy - 4); return; }
  if (e.kind === 'page') {   // a lost page of the chronicle, glowing in the dark
    const by = sy + 3 + Math.round(Math.sin(time * 2 + e.home[0]) * 1.5);
    ctx.fillStyle = 'rgba(246,236,200,.25)'; ctx.fillRect(sx + 1, by - 2, 14, 14);
    ctx.fillStyle = C.out; ctx.fillRect(sx + 3, by, 10, 10); ctx.fillStyle = '#f6ecc8'; ctx.fillRect(sx + 4, by + 1, 8, 8);
    ctx.fillStyle = '#8a7a5a'; for (let k = 0; k < 3; k++) ctx.fillRect(sx + 5, by + 2 + k * 2, 6 - (k === 2 ? 2 : 0), 1);
    return;
  }
  if (e.ghost) ctx.globalAlpha = .72;
  if (e.submerged) {
    const fr = e.frames.down[0], bob = Math.round(Math.sin(time * 2) * 1);
    ctx.drawImage(fr, 0, 0, 16, 10, sx, sy + 2 + bob, 16, 10);
    ctx.fillStyle = C.w0; ctx.fillRect(sx + 1, sy + 12 + bob, 14, 1); ctx.fillStyle = C.w1; ctx.fillRect(sx + 3, sy + 13 + bob, 10, 1);
    ctx.globalAlpha = 1;
    return;
  }
  if (e.big) {
    let f = e.dancing ? Math.floor(time * 6) % 3 : 0;
    const dir = e.dancing ? ['down', 'left', 'up', 'right'][Math.floor(time * 3) % 4] : e.dir;
    ctx.fillStyle = 'rgba(30,48,26,.28)'; ctx.fillRect(sx - 2, sy + 12, 20, 4);
    ctx.drawImage(e.frames[dir][f], sx - 8, sy - 18, 32, 32);
    return;
  }
  ctx.fillStyle = 'rgba(30,48,26,.28)';
  ctx.fillRect(sx + 3, sy + 13, 10, 2); ctx.fillRect(sx + 4, sy + 12, 8, 4);
  const frames = e.frames[e.dir];
  let f = 0;
  if (e.moving && e.t < .5) f = (e.step % 2) + 1;
  if (e.bump > 0) f = Math.floor(e.bump * 8) % 2 + 1;
  ctx.drawImage(frames[f], sx, sy - 4 + (e.ghost ? Math.round(Math.sin(time * 2 + e.home[0]) * 1.5) : 0));
  ctx.globalAlpha = 1;
  if (e.alert > 0) {   // somebody's calling you: a (!) over your head
    const bx = sx + 4, by = sy - 17;
    ctx.fillStyle = C.out; ctx.fillRect(bx, by, 8, 11);
    ctx.fillStyle = '#fbf6ea'; ctx.fillRect(bx + 1, by + 1, 6, 9);
    ctx.fillStyle = '#c8383a'; ctx.fillRect(bx + 3, by + 2, 2, 4); ctx.fillRect(bx + 3, by + 7, 2, 2);
  }
  if (e.glow) { ctx.fillStyle = 'rgba(200,255,200,.12)'; ctx.fillRect(sx - 2, sy - 6, 20, 22); }
  // standing in tall grass, wheat, ferns or reeds: they hide your feet
  const tx = Math.round(e.x / 16), ty = Math.round(e.y / 16), over = ground.over[T(tx, ty)];
  if (over) ctx.drawImage(over, 0, 9, 16, 7, tx * 16 - camX, ty * 16 + 9 - camY, 16, 7);
}

function drawObject(o) {
  const sx = o.x - camX, sy = o.y - camY;
  if (sx > cv.width + 16 || sy > cv.height + 16 || sx + (o.img ? o.img.width : 90) < 0 || sy + (o.img ? o.img.height : 120) < 0) return;
  if (o.pick) o.img = o.pick();
  if (o.anim === 'sun') ctx.drawImage(SPR.sun[Math.sin(time * 1.3 + o.phase) > .3 ? 1 : 0], sx, sy);
  else if (o.anim === 'stork') ctx.drawImage(SPR.stork[(time % 7) < .6 && Math.floor(time * 8) % 2 ? 1 : 0], sx, sy);
  else if (o.anim === 'hut') ctx.drawImage(SPR.hut[Math.floor(time * .7) % 2], sx, sy);
  else if (o.anim === 'mill') {
    ctx.drawImage(SPR.mill, sx, sy);
    ctx.drawImage(SPR.sails[Math.floor(time * 4) % 8], sx + 24 - 32, sy + 26 - 32);
  }
  else ctx.drawImage(o.img, sx, sy + (o.bob ? Math.round(Math.sin(time * 1.6 + o.tx) * .8) : 0));
  if (o.candles) for (const k of [3, 6, 9, 12]) {
    ctx.fillStyle = Math.sin(time * 9 + k) > 0 ? '#fff3b0' : '#f6c93c';
    ctx.fillRect(sx + k, sy + 1 + (k % 2), 1, 2);
  }
  if (o.bees) {
    for (let i = 0; i < 2; i++) {
      const a = time * (2.2 + i) + i * 3;
      const bx = Math.round(sx + 8 + Math.cos(a) * (6 + i * 2)), by = Math.round(sy + 6 + Math.sin(a * 1.7) * 4);
      ctx.fillStyle = C.yel; ctx.fillRect(bx, by, 1, 1); ctx.fillStyle = C.out; ctx.fillRect(bx + 1, by, 1, 1);
    }
  }
}

// some places can lose their colour: AREA_GREY[area]() says how grey, 0 to 1
const AREA_GREY = {};
function render() {
  const grey = AREA_GREY[area] && !MAPVIEW ? AREA_GREY[area]() : 0, filt = grey > 0 ? `grayscale(${grey.toFixed(2)})` : '';
  if (cv.style.filter !== filt) cv.style.filter = filt;
  if (RUN) return drawRapids();
  const vw = cv.width, vh = cv.height;
  ctx.fillStyle = AR.inside ? IN0.void : C.g4; ctx.fillRect(0, 0, vw, vh);
  ctx.drawImage(ground.canvas, -camX, -camY);
  const t0x = Math.floor(camX / 16), t0y = Math.floor(camY / 16);
  for (let ty = t0y; ty <= t0y + vh / 16 + 1; ty++) for (let tx = t0x; tx <= t0x + vw / 16 + 1; tx++) {
    const ch = T(tx, ty);
    if (ch !== '~' && ch !== 'd' && ch !== '*') continue;
    for (let k = 0; k < 2; k++) {
      if (hash(tx, ty, 100 + k) > .7) continue;
      const ph = (time * .6 + hash(tx, ty, 110 + k)) % 1;
      const rx = tx * 16 + 3 + Math.floor(hash(tx, ty, 120 + k) * 8) + Math.floor(ph * 3), ry = ty * 16 + 3 + Math.floor(hash(tx, ty, 130 + k) * 10);
      ctx.fillStyle = AR.G && AR.G.w ? AR.G.w[ph < .75 ? 0 : 1] : ph < .75 ? C.w0 : C.w1;
      ctx.fillRect(rx - camX, ry - camY, ph < .5 ? 3 : 2, 1);
    }
  }
  for (const e of entities) if (e.goose && present(e)) drawEntity(e);
  const list = objects.map(o => [o.base, 0, o]);
  for (const e of entities) if (!e.goose && present(e)) list.push([e.y + 16, 1, e]);
  list.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  for (const [, kind, it] of list) kind ? drawEntity(it) : drawObject(it);
  const W = WORLD[area];
  for (const b of W.motes) {
    const sx = Math.round(b.x - camX), sy = Math.round(b.y - camY);
    if (b.glow) {
      const on = Math.sin(time * 2 + b.ph * 1.7) > -.2;
      if (!on) continue;
      ctx.fillStyle = 'rgba(243,240,160,.25)'; ctx.fillRect(sx - 1, sy - 1, 3, 3);
      ctx.fillStyle = b.col; ctx.fillRect(sx, sy, 1, 1);
      continue;
    }
    const open = Math.floor(time * 9 + b.ph) % 2;
    ctx.fillStyle = b.col;
    if (open) { ctx.fillRect(sx - 1, sy, 1, 1); ctx.fillRect(sx + 1, sy, 1, 1); ctx.fillRect(sx - 1, sy - 1, 1, 1); ctx.fillRect(sx + 1, sy - 1, 1, 1); }
    else ctx.fillRect(sx, sy - 1, 1, 1);
    ctx.fillStyle = C.out; ctx.fillRect(sx, sy, 1, 1);
  }
  if (!AR.dark && !AR.inside && !S.f.night) for (const c of cloudShadows) ctx.drawImage(c.img, Math.round(c.x - camX), Math.round(c.y - camY));
  if (AR.dark && !S.f.night) { ctx.fillStyle = 'rgba(12,34,30,.22)'; ctx.fillRect(0, 0, vw, vh); }
  if (AR.mist) { ctx.fillStyle = `rgba(200,220,215,${.13 + Math.sin(time * .4) * .03})`; ctx.fillRect(0, 0, vw, vh); }
  if (S.f.night || AR.cave) drawNight(vw, vh);
  if (warp) { ctx.fillStyle = `rgba(23,20,31,${Math.min(1, warp.fade)})`; ctx.fillRect(0, 0, vw, vh); }
}

// Night: everything dims except the light around you, fires, and the fern flower.
const nightCv = document.createElement('canvas');
function drawNight(vw, vh) {
  if (nightCv.width !== vw || nightCv.height !== vh) { nightCv.width = vw; nightCv.height = vh; }
  const n = nightCv.getContext('2d');
  n.globalCompositeOperation = 'source-over';
  n.clearRect(0, 0, vw, vh);
  n.fillStyle = AR.cave ? 'rgba(12,8,6,.94)' : AR.inside ? 'rgba(30,16,40,.4)' : 'rgba(8,10,40,.82)'; n.fillRect(0, 0, vw, vh);
  n.globalCompositeOperation = 'destination-out';
  const light = (x, y, r) => {
    const g = n.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,.95)'); g.addColorStop(.6, 'rgba(0,0,0,.5)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    n.fillStyle = g; n.fillRect(x - r, y - r, r * 2, r * 2);
  };
  light(player.x + 8 - camX, player.y + 6 - camY, AR.cave ? (has('lavracandle') ? 62 : 26) : 44);
  for (const o of objects) if (o.candles) light(o.x + 8 - camX, o.y + 4 - camY, 40);
  if (AR.cave) for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) if (T(tx, ty) === 'o') light(tx * 16 + 8 - camX, ty * 16 + 12 - camY, 14);
  for (const e of entities) if (present(e) && (e.kind === 'fire' || e.kind === 'fern' || e.glow)) light(e.x + 8 - camX, e.y + 4 - camY, e.kind === 'fire' ? 72 + Math.sin(time * 7) * 3 : 48);
  for (const b of WORLD[area].motes) if (b.glow) light(b.x - camX, b.y - camY, 6);
  ctx.drawImage(nightCv, 0, 0);
  for (const e of entities) if (present(e) && e.kind === 'fire') {
    const g = ctx.createRadialGradient(e.x + 8 - camX, e.y + 4 - camY, 0, e.x + 8 - camX, e.y + 4 - camY, 60);
    g.addColorStop(0, 'rgba(255,150,60,.22)'); g.addColorStop(1, 'rgba(255,150,60,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, vw, vh);
  }
}

// ─── Update ───────────────────────────────────────────────────────────────
let warp = null;
let areaLabelT = 0;
function snapCamera() {
  if (MAPVIEW) return;
  camX = MW * 16 <= SW ? Math.round((MW * 16 - SW) / 2) : Math.max(0, Math.min(MW * 16 - SW, player.x + 8 - SW / 2));
  camY = MH * 16 <= SH ? Math.round((MH * 16 - SH) / 2) : Math.max(0, Math.min(MH * 16 - SH, player.y + 8 - SH / 2));
}
function showAreaName() {
  const el = document.getElementById('areaName');
  el.innerHTML = `<b>${AR.ua}</b>${AR.name}`;
  el.hidden = false; areaLabelT = 2.6;
}
function tryDoor(d) {
  if (d !== 'up') return false;
  const door = (DOORS[area] || {})[player.tx + ',' + (player.ty - 1)];
  if (!door) return false;
  const [to, tx, ty] = door;
  if (DOOR_LOCK[to] && !DOOR_LOCK[to]()) return false;
  warp = { to: { to, tx, ty, dir: 'up' }, fade: 0, dir: 1 }; held.clear(); order.length = 0;
  sfx('door');
  return true;
}
function stepDone() {
  const ex = AR.exits.find(e => e.x === player.tx && e.y === player.ty);
  if (ex) {
    held.clear(); order.length = 0;
    if (!exitLock(ex)) warp = { to: ex, fade: 0, dir: 1 };
    return true;
  }
  const ch = T(player.tx, player.ty);
  if (AR.grass.includes(ch)) return onGrassStep(ch);
  return false;
}
function update(dt) {
  time += dt;
  if (RUN) { updateRapids(dt); return; }
  if (areaLabelT > 0) { areaLabelT -= dt; if (areaLabelT <= 0) document.getElementById('areaName').hidden = true; }
  if (warp) {
    warp.fade += dt * 4 * warp.dir;
    if (warp.dir > 0 && warp.fade >= 1) { const e = warp.to; enterArea(e.to, e.tx, e.ty, e.dir); warp.dir = -1; saveSoon(); }
    else if (warp.dir < 0 && warp.fade <= 0) { const then = warp.then; warp = null; then && then(); }
  }
  if (player.alert > 0) {
    player.alert -= dt;
    if (player.alert <= 0 && player.alertThen) { const f = player.alertThen; player.alertThen = null; f(); }
  }
  if (talking()) {
    const p = pages[pageI];
    if (shown < p.length) shown = Math.min(p.length, shown + dt * 45);
    const vis = p.slice(0, Math.floor(shown));
    if (txt.textContent !== vis) txt.textContent = vis;
    more.hidden = shown < p.length || (ask && lastPage());
    if (ask && lastPage() && shown >= p.length && askEl.hidden) renderAsk();
  } else if (!MAPVIEW && !overlayOpen() && !warp && !(player.alert > 0)) {
    const d = heldDir();
    const boots = has('boots'), dur = runHeld ? (boots ? .085 : .12) : (boots ? .16 : .23);
    if (player.bump > 0) player.bump -= dt;
    if (!player.moving) {
      if (d) {
        if (d !== player.dir && !player.wasMoving) { player.dir = d; player.turnT = .09; }
        else if (player.turnT <= 0 && player.bump <= 0) {
          if (!startMove(player, d) && !tryDoor(d)) player.bump = .25;
        }
      }
      player.turnT -= dt;
      player.wasMoving = false;
    }
    if (player.moving) {
      advance(player, dt, dur);
      if (!player.moving) {
        player.wasMoving = true;
        if (!stepDone()) {
          const nd = heldDir();
          if (nd) startMove(player, nd);
        } else { held.clear(); order.length = 0; }
      }
    }
  }
  for (const e of entities) {
    if (e === player || !present(e)) continue;
    if (e.moving) { advance(e, dt, e.goose ? .6 : .32); continue; }
    if (e.busy || !e.wander || overlayOpen()) continue;
    e.timer -= dt;
    if (e.timer <= 0) {
      e.timer = 1.5 + Math.random() * 3;
      const dirs = Object.keys(DIRS), d = dirs[Math.floor(Math.random() * 4)], [dx, dy] = DIRS[d];
      const nx = e.tx + dx, ny = e.ty + dy;
      if (Math.abs(nx - e.home[0]) <= e.wander && Math.abs(ny - e.home[1]) <= e.wander) startMove(e, d); else e.dir = d;
    }
  }
  for (const b of WORLD[area].motes) {
    b.a += dt * b.sp;
    b.x = b.cx + Math.cos(b.a) * b.r + Math.sin(b.a * 2.3) * 4;
    b.y = b.cy + Math.sin(b.a * 1.4) * b.r * .6 + Math.sin(time * 9 + b.ph) * 1.2;
  }
  for (const c of cloudShadows) {
    c.x += dt * 7; c.y += dt * 2.2;
    if (c.x > MW * 16 + 20) { c.x = -140; c.y = Math.random() * MH * 16 - 40; }
    if (c.y > MH * 16 + 20) c.y = -80;
  }
  snapCamera();
}

// ─── Layout ───────────────────────────────────────────────────────────────
const stage = document.getElementById('stage');
const touch = matchMedia('(pointer: coarse)').matches;
if (touch) document.body.classList.add('touch');
function layout() {
  const w = cv.width, h = cv.height;
  const availW = innerWidth - 32, availH = innerHeight - (touch ? 230 : 70);
  let s = Math.min(availW / w, availH / h);
  if (s >= 2) s = Math.floor(s);
  s = Math.max(.5, s);
  stage.style.width = w * s + 'px'; stage.style.height = h * s + 'px';
  stage.style.setProperty('--s', s);
}
addEventListener('resize', layout);

document.querySelectorAll('.dpad button').forEach(b => {
  const d = b.dataset.d;
  b.addEventListener('pointerdown', e => {
    e.preventDefault(); unlockAudio(); b.setPointerCapture(e.pointerId);
    if (overlayDir(d)) return;
    if (talking()) { askMove(d); return; }
    press(d); b.classList.add('on');
  });
  const up = () => { release(d); b.classList.remove('on'); };
  b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('lostpointercapture', up);
});
const btnA = document.getElementById('btnA'), btnB = document.getElementById('btnB'), btnS = document.getElementById('btnStart');
btnA.addEventListener('pointerdown', e => { e.preventDefault(); unlockAudio(); if (!overlayA()) actionA(); });
btnB.addEventListener('pointerdown', e => { e.preventDefault(); unlockAudio(); if (overlayB()) return; runHeld = true; btnB.classList.add('on'); });
['pointerup', 'pointercancel', 'pointerleave'].forEach(t => btnB.addEventListener(t, () => { runHeld = false; btnB.classList.remove('on'); }));
btnS.addEventListener('click', () => { unlockAudio(); if (!overlayOpen() && !talking()) openDex(); else overlayB(); });
document.getElementById('dlg').addEventListener('pointerdown', () => { if (talking() && !(ask && lastPage())) actionA(); });
