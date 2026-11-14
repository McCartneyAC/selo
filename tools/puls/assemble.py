#!/usr/bin/env python3
"""Join lemmas + glosses + themes + stress + gender into local/puls_corpus/puls_corpus.{csv,json}. Safe to rerun.

Stress: ukrainian-word-stress in dictionary-only mode (skips ambiguous words), with s:<form> overrides from the
gloss chunks. Gender: pymorphy3 (uk) for nouns: m/f/n, pl for plural-only, blank if unknown.
"""
import csv, json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from gloss import lemmas, glossed, ROOT

ACUTE = '́'

def main():
    from ukrainian_word_stress import Stressifier, StressSymbol
    from ukrainian_word_stress.stressify_ import Disambiguation
    import pymorphy3
    st = Stressifier(stress_symbol=StressSymbol.CombiningAcuteAccent, disambiguation=Disambiguation.Dictionary)
    morph = pymorphy3.MorphAnalyzer(lang='uk')
    G = glossed()
    themes = {}
    for r in csv.DictReader(open(os.path.join(ROOT, 'puls_themes.csv'), encoding='utf-8')):
        themes.setdefault(r['entry_id'], set()).add(r['theme_label'])
    out = []
    for r in lemmas():
        g = G.get(r['uk'])
        if g:
            en, domain, flags = g[1], g[2], g[3]
        else:
            print('MISSING gloss', r['uk'], file=sys.stderr); continue
        fl = flags.split()
        stressed = next((f[2:] for f in fl if f.startswith('s:')), None)
        if not stressed:
            stressed = st(r['uk'])
        gender = ''
        if 'noun' in r['pos_all'].split(';'):
            head = r['forms'].split(';')[0].split(',')[0].strip().lower()
            ps = [p for p in morph.parse(head) if p.tag.POS == 'NOUN']
            if ps:
                t = ps[0].tag
                gender = {'masc': 'm', 'femn': 'f', 'neut': 'n'}.get(str(t.gender), 'pl' if str(t.number) == 'plur' else '')
                if r['pair'] == 'gender': gender = 'm/f'
        th = sorted(set().union(*[themes.get(i, set()) for i in r['source_row_ids'].split(';')]))
        out.append({
            'uk': r['uk'], 'uk_stressed': stressed if ACUTE in stressed else '', 'en': en,
            'pos': r['pos_all'], 'gender': gender,
            'aspect_pair': r['forms'] if r['pair'] == 'aspect' else '',
            'game_level': r['game_level'], 'puls_level': r['puls_level'], 'puls_levels_all': r['puls_levels_all'],
            'domain': domain, 'cognate': 1 if 'c' in fl else 0,
            'gloss_confidence': 'low' if 'l' in fl else 'medium' if 'm' in fl else 'high',
            'gloss_source': 'claude', 'provenance': 'puls',
            'themes': ';'.join(th), 'guidewords': r['guidewords'],
            'puls_lexeme_id': r['puls_lexeme_id'], 'source_row_ids': r['source_row_ids'],
        })
    cols = list(out[0].keys())
    with open(os.path.join(ROOT, 'puls_corpus.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=cols); w.writeheader(); w.writerows(out)
    json.dump(out, open(os.path.join(ROOT, 'puls_corpus.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    from collections import Counter
    print('rows', len(out))
    print('by game level', dict(sorted(Counter(o['game_level'] for o in out).items())))
    print('stressed', sum(1 for o in out if o['uk_stressed']), 'gendered nouns', sum(1 for o in out if o['gender']),
          'of', sum(1 for o in out if 'noun' in o['pos'].split(';')))
    print('confidence', dict(Counter(o['gloss_confidence'] for o in out)), 'cognates', sum(o['cognate'] for o in out))
    print('themed', sum(1 for o in out if o['themes']))
    dup = [k for k, v in Counter(o['uk'].lower() for o in out).items() if v > 1]
    print('duplicate uk:', dup[:20], len(dup))
    print('Russian-only letters:', [o['uk'] for o in out if re.search('[ыэъё]', o['uk'].lower())])

if __name__ == '__main__':
    main()
