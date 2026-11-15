# Builds the game's word tables from the PULS corpus (local/puls_corpus/puls_corpus.csv): every level is PULS's own level,
# each sorted into the 25 places by theme; a place may hold from half to 1.6 times its share, so themes stay together.
# usage: python3 tools/levels.py
#
# data/words.json  = the A1 words, the base table the build inlines: [entry, ...]
# data/levels.json = { "A2": { "new": [entries], "list": [[-(k+1), zone], ...] }, ... }  (each level's words follow A1's)
#   entry = [ua, ua stressed, en, short en, spellable form or '', zone, examples (none)]
# data/levels_tts.json = per level, exactly the text tools/puls/tts.py speaks for each entry
import csv, json, math, os, re
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
ACUTE = '́'
LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']
NZ = 25
# 0 vyshneve 1 khutir 2 steppe 3 kalynivka 4 fair 5 lake 6 ferry 7 marsh 8 forest 9 khortytsia 10 rapids 11 podil
# 12 lavra 13 polissia 14 bir 15 verkhovyna 16 polonyna 17 chornohora 18 synevyr 19 kamianets 20 dniester 21 odesa
# 22 vylkove 23 liman 24 lviv
DOMAIN = {'family': 0, 'animals': 1, 'weather': 2, 'school': 3, 'grammar': 3, 'money': 4, 'sport': 5, 'travel': 6,
          'body': 7, 'health': 7, 'law': 8, 'military': 9, 'politics': 9, 'motion': 10, 'city': 11, 'religion': 12,
          'home': 13, 'clothing': 13, 'nature': 14, 'art': 15, 'music': 15, 'food': 16, 'time': 17, 'emotion': 18,
          'abstract': 19, 'work': 20, 'communication': 21, 'number': 23, 'tech': 24, 'science': 24, 'other': 22}
THEME = {'Будинок, квартира, дім': 13, 'Граматичні терміни': 3, 'Дії': 10, 'Етикетні формули': 0, 'Захоплення і дозвілля': 5,
         'Злочин': 8, 'Їжа й напої': 16, 'Кольори': 19, 'Комунікація': 21, 'Країни, національності, мови': 6,
         'Людина: зовнішність': 7, 'Людина: характер': 18, 'Меблі, інтер’єр': 13, 'Мистецтво і розваги': 15,
         'Місто: заклади, будівлі, споруди': 11, 'Місто: об’єкти і місця': 11, 'Навчання й освіта': 3,
         'Одяг, взуття та аксесуари': 13, 'Опис речей': 19, 'Особисті почуття, думки та досвід': 18, 'Погода': 2,
         'Покупки': 4, 'Політика': 9, 'Послуги': 20, 'Природа': 14, 'Робота, професії': 20, 'Рослини': 14,
         'Свята і святкування': 12, 'Спорт': 5, 'Стосунки': 0, 'Тварини': 1, 'Технології й засоби комунікації': 24,
         "Тіло й здоров'я": 7, 'Транспорт, поїздки, подорожі': 6, 'Фінанси': 4, 'Час': 17, 'Числа': 23}
# what a word with no other home falls back on, by part of speech
POS = {'verb': 10, 'verb_impf': 10, 'verb_pf': 10, 'adj': 19, 'adv': 22, 'prep': 22, 'conj': 22, 'part': 22,
       'pron': 22, 'intj': 21, 'num': 23, 'noninfl': 22, 'noun': 19}

# where a place's overflow goes: its two nearest neighbours in meaning
NEAR = {0: (18, 21), 1: (16, 14), 2: (14, 17), 3: (22, 24), 4: (16, 20), 5: (14, 13), 6: (11, 10), 7: (18, 0),
        8: (9, 18), 9: (8, 12), 10: (6, 20), 11: (6, 4), 12: (15, 9), 13: (5, 15), 14: (2, 1), 15: (12, 21),
        16: (1, 4), 17: (2, 23), 18: (0, 19), 19: (22, 18), 20: (4, 24), 21: (0, 3), 22: (19, 3), 23: (17, 4), 24: (20, 3)}

def norm(s): return re.sub(r"[’ʼ`´‘']", "'", s.replace(ACUTE, '')).strip().lower()
def disp(s): return s.replace("'", '’')   # the game writes the apostrophe as ’

def short_en(en):
    s = re.sub(r'\([^)]*\)', '', en); s = re.sub(r':.*$', '', s)
    s = re.sub(r'\s+', ' ', s); s = re.sub(r'\s+([,;])', r'\1', s); s = re.sub(r'([,;])(?:\s*[,;])+', r'\1', s).strip(' ;,')
    s = re.sub(r'\s*;\s*', '; ', s)
    # one sense once: "warmer; warmer" → "warmer", "cube; cube; block" → "cube; block"
    seen, keep = set(), []
    for grp in s.split('; '):
        parts = [p for p in grp.split(', ') if p.lower() not in seen and not seen.add(p.lower())]
        if parts: keep.append(', '.join(parts))
    s = '; '.join(keep)
    if len(s) > 40: s = s[:38].rsplit(' ', 1)[0].rstrip(',;') + '…'
    return s or en[:40]

# a few words that belong to one place whatever their theme says: the old forest keeps the forest
PIN = {'ліс': 8, 'дерево': 8, 'гриб': 8, 'ягода': 8, 'стежка': 8, 'дуб': 8, 'сосна': 8, 'лісовий': 8, 'папороть': 8, 'вовк': 8, 'ведмідь': 8, 'сова': 8}

def prefs(r, home_zone):
    score = [0.0] * NZ
    if home_zone is not None: score[home_zone] += 3
    if norm(r['uk'].split(',')[0]) in PIN: score[PIN[norm(r['uk'].split(',')[0])]] += 10
    if r['domain'] in DOMAIN: score[DOMAIN[r['domain']]] += 2
    for t in filter(None, r['themes'].split(';')):
        if t in THEME: score[THEME[t]] += 1.5
    pos = r['pos'].split(';')[0]
    score[POS.get(pos, 22)] += 0.5
    if pos.startswith('verb') and r['domain'] not in ('motion',): score[10] += 0.3
    if pos == 'adj': score[19] += 0.3
    out = score[:]
    for z in range(NZ):
        for nb in NEAR[z]: out[nb] += 0.45 * score[z]
    return out

def hash_(k): return (k * 2654435761) % 4294967296

def balance(items, size, lo=0.5, hi=1.6):
    """items: [(key, score[25])]. Each word goes to the place that suits it best; a place may hold between lo and hi times
    the mean. Only what spills over the ceiling moves out, and an underfull place pulls in the words that lose least by moving."""
    mean = size / NZ
    floor, ceil = math.ceil(lo * mean), math.floor(hi * mean)
    order = {k: sorted(range(NZ), key=lambda z: -s[z]) for k, s in items}
    S = dict(items)
    zone, members = {}, [[] for _ in range(NZ)]
    for k, _ in items:
        z = order[k][0]; zone[k] = z; members[z].append(k)
    def move(k, a, b): members[a].remove(k); members[b].append(k); zone[k] = b
    for _ in range(100):
        moved = False
        for z in range(NZ):                      # too many: the least attached go to their next best place with room
            over = len(members[z]) - ceil
            if over <= 0: continue
            def alt(k): return next((a for a in order[k] if a != z and len(members[a]) < ceil), None)
            for k in sorted(members[z], key=lambda k: (S[k][z] - S[k][alt(k)] if alt(k) is not None else 99, hash_(k)))[:over]:
                a = alt(k)
                if a is not None: move(k, z, a); moved = True
        for z in range(NZ):                      # too few: take the words that mind least, from places that can spare them
            short = floor - len(members[z])
            if short <= 0: continue
            cand = [k for y in range(NZ) if y != z and len(members[y]) > floor for k in members[y]]
            for k in sorted(cand, key=lambda k: (S[k][zone[k]] - S[k][z], hash_(k))):
                if short <= 0: break
                if len(members[zone[k]]) > floor: move(k, zone[k], z); short -= 1; moved = True
        if not moved: break
    assert all(floor <= len(m) <= ceil for m in members), [len(m) for m in members]
    return zone

def stress_fixes():
    """tools/puls/stress_fix.txt: headword -> (shown or None to keep the corpus form, spoken or None for as shown)"""
    out = {}
    for line in open(os.path.join(root, 'tools', 'puls', 'stress_fix.txt'), encoding='utf-8'):
        if not line.strip() or line.startswith('#'): continue
        uk, shown, spoken = [x.strip() for x in (line.rstrip('\n') + '|').split('|')[:3]]
        mark = lambda t: re.sub(r'([аеєиіїоуюяАЕЄИІЇОУЮЯ])\+', '\\1' + ACUTE, t) if t and t not in ('=', '?') else None
        shown, spoken = mark(shown), mark(spoken)
        for t in (shown, spoken):
            assert t is None or norm(t) == norm(uk), ('stress_fix.txt: the marked form does not spell the headword', uk, t)
        out[uk] = (shown, spoken)
    return out

def main():
    rows = list(csv.DictReader(open(os.path.join(root, '..', 'local', 'puls_corpus', 'puls_corpus.csv'), encoding='utf-8')))
    global FIX
    FIX = stress_fixes()
    unknown = set(FIX) - {r['uk'] for r in rows}
    assert not unknown, ('stress_fix.txt names words the corpus does not have', sorted(unknown))
    out, tts = {}, {}
    for L in LEVELS:
        new, items, said = [], [], []
        for r in (r for r in rows if r['game_level'] == L):
            uk = disp(r['uk']); st = disp(r['uk_stressed'] or r['uk'])
            shown, spoken = FIX.get(r['uk'], (None, None))
            if shown: st = disp(shown)
            said_text = spoken or shown or r['uk_stressed'] or r['uk']
            first = norm(uk.split(',')[0])
            spell = first.replace("'", '’') if re.fullmatch(r"[а-яіїєґ']{2,10}", first) else ''
            new.append([uk, st, r['en'], short_en(r['en']), spell, 0, []])
            said.append(said_text)                       # exactly the text tools/puls/tts.py speaks
            items.append((-len(new), prefs(r, None)))
        zone = balance(items, len(items))
        for k, w in enumerate(new): w[5] = zone[-(k + 1)]
        if L == 'A1': json.dump(new, open(os.path.join(root, 'data', 'words.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
        else: out[L] = {'new': new, 'list': [[-(k + 1), w[5]] for k, w in enumerate(new)]}
        tts[L] = said
        sizes = [sum(1 for w in new if w[5] == z) for z in range(NZ)]
        print(L, len(new), 'words; per place', min(sizes), '-', max(sizes), '; trial needs', math.ceil(.75 * min(sizes)), '-', math.ceil(.75 * max(sizes)))
        print('   ', ' '.join(f'{z}:{n}' for z, n in enumerate(sizes)))
    json.dump(tts, open(os.path.join(root, 'data', 'levels_tts.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    json.dump(out, open(os.path.join(root, 'data', 'levels.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

main()
