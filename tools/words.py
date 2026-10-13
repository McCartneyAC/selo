# Turns the extracted Anki notes (words.json from the deck) into the game's word table, data/words.json.
# Each entry: [ua, ua_stressed, en, en_short, spell, zone, examples]
import json, re, sys, random
ACUTE = '́'
src = json.load(open(sys.argv[1], encoding='utf-8'))


def plain(s): return s.replace(ACUTE, '')


def alts(ua): return [a.strip() for a in re.split(r'\s*=\s*|,\s*', ua) if a.strip()]


# The deck pairs some verbs with a "for a while" по- perfective; give the usual resultative partner instead.
ASPECT = {
    'читати, почитати': ('читати, прочитати', 'чита́ти, прочита́ти'),
    'пити, попити': ('пити, випити', 'пи́ти, ви́пити'),
    'співати, поспівати': ('співати, заспівати', 'співа́ти, заспіва́ти'),
    'пливти, припливти': ('пливти = плисти, попливти', 'пливти́ = плисти́, попливти́'),
    'чекати, почекати': ('чекати, почекати = зачекати', 'чека́ти, почека́ти = зачека́ти'),
}
out = []
for i, w in enumerate(src):
    exs = [[re.sub(ACUTE + '+', ACUTE, a), b] for a, b in w['ex']]
    bold = [t for a, _ in exs for t in re.findall(r'\{([^}]*)\}', a)]

    def stress(word):
        # take the stress from the example sentences, through inflection: авто́бусом → авто́бус
        lw = word.lower()
        if sum(ch in 'аеєиіїоуюя' for ch in lw) <= 1: return word
        best = None
        for t in bold:
            for tok in re.split(r'[\s,.!?;:()«»"—–-]+', t):
                if ACUTE not in tok: continue
                p = plain(tok).lower()
                pos = tok.index(ACUTE) - 1
                cp = 0
                while cp < min(len(p), len(lw)) and p[cp] == lw[cp]: cp += 1
                if pos < cp and cp >= max(2, len(lw) - 2) and (best is None or cp > best[0]): best = (cp, pos)
        if not best: return word
        return word[:best[1] + 1] + ACUTE + word[best[1] + 1:]

    parts = re.split(r'(\s*=\s*|,\s*)', w['ua'])
    stressed = ''.join(p if re.fullmatch(r'\s*=\s*|,\s*', p) else stress(p) for p in parts)
    en = w['en']
    short = re.sub(r'\([^)]*\)', '', en)
    short = re.sub(r'\d\)\s*', '', short)
    short = re.sub(r'\s+', ' ', short).strip(' ;,')
    short = re.sub(r'\s*;\s*', '; ', short)
    if len(short) > 40: short = short[:38].rsplit(' ', 1)[0].rstrip(',;') + '…'
    first = alts(w['ua'])[0].lower()
    spell = first if re.fullmatch(r"[а-яіїєґ'ʼ]{2,10}", first) else ''
    ua = w['ua']
    if ua in ASPECT: ua, stressed = ASPECT[ua]
    out.append([ua, stressed, en, short, spell, 0, exs])

# a first rough zoning by word length; tools/themes.py --write then sorts the words into the 25 themed places
rnd = random.Random(5)
order = sorted(range(len(out)), key=lambda i: len(plain(alts(out[i][0])[0])) + rnd.random() * 4)
ZONES = 9
for rank, i in enumerate(order): out[i][5] = rank * ZONES // len(out)
SLOVO = next(i for i, w in enumerate(out) if w[0] == 'слово')
if out[SLOVO][5] != 0:
    j = next(i for i in order if out[i][5] == 0)
    out[SLOVO][5], out[j][5] = 0, out[SLOVO][5]
json.dump(out, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('zones', [sum(1 for w in out if w[5] == z) for z in range(ZONES)], 'spellable', sum(1 for w in out if w[4]),
      'stressed', sum(1 for w in out if ACUTE in w[1]))
