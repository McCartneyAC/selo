# Checks src/lessons.js: every word a character teaches at each level is in play at that level, and each lesson has
# as many words as the scene's own list (the quests' pass marks count on it).  usage: python3 -X utf8 tools/tests/lessons.py
import json, os, re, sys
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
src = open(os.path.join(root, 'src', 'lessons.js'), encoding='utf-8').read()
a1 = json.load(open(os.path.join(root, 'data', 'words.json'), encoding='utf-8'))
levels = json.load(open(os.path.join(root, 'data', 'levels.json'), encoding='utf-8'))
A1N = dict(domovyk=8, dyak=4, vodyanyk=5, chuhaister=5, polyovyk=6, murko=3, memory=10, stork=4, bees=4, mavka=6, lisovyk=5,
           rusalka=6, berehynia=5)
# the errands' A1 words, straight from their source
for f in ('quest.js', 'errands.js'):
    for m in re.finditer(r"\{ id: '([^']+)'[^\n]*?words: \[([^\]]*)\]", open(os.path.join(root, 'src', f), encoding='utf-8').read()):
        A1N['e:' + m.group(1)] = len(re.findall(r"'[^']+'", m.group(2)))
bad = 0
table = {}
for m in re.finditer(r"^\s*'?([\w:]+)'?: \{ (A1: .*?) \},?$", src, re.M | re.S):
    key = m.group(1)
    table[key] = dict(re.findall(r"(A1|A2|B1|B2|C1): '([^']*)'", m.group(2)))
for key in A1N:
    if key not in table: print('no lesson table for', key); bad += 1
for key, lv in table.items():
    if set(lv) != {'A1', 'A2', 'B1', 'B2', 'C1'}: print(key, 'missing levels', set(lv)); bad += 1
    for L, s in lv.items():
        act = a1 if L == 'A1' else [a1[r] if r >= 0 else levels[L]['new'][-r - 1] for r, z in levels[L]['list']]
        forms = set(a for w in act for a in re.split(r'\s*[=,]\s*', w[0]))
        ws = s.split(' ')
        if key in A1N and len(ws) != A1N[key]: print(f'{key} {L}: {len(ws)} words, A1 has {A1N[key]}'); bad += 1
        if len(set(ws)) != len(ws): print(f'{key} {L}: a word twice'); bad += 1
        for w in ws:
            if w not in forms: print(f'{key} {L}: {w} is not in play'); bad += 1
print(len(table), 'lessons ×', 5, 'levels;', 'all good' if not bad else f'{bad} problems')
sys.exit(1 if bad else 0)
