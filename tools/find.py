# Looks up words in data/words.json: prints word:index:zone, or word:- when missing.
import json, sys
w = json.load(open('data/words.json', encoding='utf-8'))
idx = {}
for i, x in enumerate(w):
    for a in x[0].replace('=', ',').split(','):
        idx.setdefault(a.strip().lower(), i)
want = open(sys.argv[1], encoding='utf-8').read().split()
sys.stdout.buffer.write((' '.join(f'{k}:{idx[k]}:z{w[idx[k]][5]}' if k in idx else f'{k}:-' for k in want) + '\n').encode())
