#!/usr/bin/env python3
"""Gloss workflow, resumable.

  python3 tools/puls/gloss.py todo [N]  -> the next N (default 300) lemmas with no gloss yet, in game-level order
  python3 tools/puls/gloss.py status    -> how many are glossed, per game level

Claude writes glosses by hand into local/puls_corpus/gloss/chunk_NNN.tsv, one line per lemma:
  uk <TAB> english <TAB> domain <TAB> flags
flags: c = cognate/internationalism, m = medium confidence, l = low confidence, s:<stressed form> = stress override
A chunk only counts once its last line is '#END', so a file half-written when the power cut can just be redone.
Every lemma is glossed here; nothing is taken from any other word list.
"""
import csv, glob, os, re, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'local', 'puls_corpus'))
GAME = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'data'))
GL = os.path.join(ROOT, 'gloss')
ORDER = {'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5}

def norm(s): return re.sub(r"[’ʼ`´‘]", "'", s.replace('́', '')).strip().lower()

def lemmas():
    L = list(csv.DictReader(open(os.path.join(ROOT, 'lemmas.csv'), encoding='utf-8')))
    for r in L: r['game_level'] = r['puls_level']      # every level is PULS's own level
    return L

def glossed():
    g = {}
    for p in sorted(glob.glob(os.path.join(GL, 'chunk_*.tsv'))):
        txt = open(p, encoding='utf-8').read()
        if not txt.rstrip().endswith('#END'): print('incomplete, ignored:', p, file=sys.stderr); continue
        for line in txt.splitlines():
            if not line.strip() or line.startswith('#'): continue
            parts = line.split('\t')
            if len(parts) < 3: print('bad line', p, line, file=sys.stderr); continue
            g[parts[0]] = parts + [''] * (4 - len(parts))
    return g

def needing():
    g = glossed()
    L = [r for r in lemmas() if r['uk'] not in g]
    return sorted(L, key=lambda r: (ORDER[r['game_level']], r['uk'].lower()))

if __name__ == '__main__':
    os.makedirs(GL, exist_ok=True)
    if sys.argv[1] == 'status':
        L, g = lemmas(), glossed()
        for lv in ORDER:
            rows = [r for r in L if r['game_level'] == lv]
            print(lv, len(rows), 'words;', sum(1 for r in rows if r['uk'] in g), 'glossed;', sum(1 for r in rows if r['uk'] not in g), 'to go')
        n = len(glob.glob(os.path.join(GL, 'chunk_*.tsv')))
        print('next chunk file:', f'chunk_{n:03d}.tsv')
    elif sys.argv[1] == 'todo':
        n = int(sys.argv[2]) if len(sys.argv) > 2 else 300
        for r in needing()[:n]:
            print('\t'.join([r['uk'], r['pos_all'], r['game_level'] + ('' if r['game_level'] == r['puls_level'] else '<' + r['puls_level']), r['guidewords']]))
