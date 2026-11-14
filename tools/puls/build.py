#!/usr/bin/env python3
"""entries_raw.csv -> lemmas.csv (one row per headword or merged pair) + phrases.csv.

- Meanings (type значення) make up the corpus. Phrases, idioms, proverbs and question or exclamation formulas
  go to phrases.csv. Short multi-word meanings with no ?/! (під час, так само) stay in the corpus, because the
  game teaches such entries (час від часу, пральна машина).
- Headwords are normalised: stress removed, apostrophes -> ', trimmed, lowercased for the key (display form kept).
- Several meanings/POS per headword collapse to the lowest level, with all levels and POS kept.
- Aspect pairs and masc/fem pairs: candidates from rules, filtered by pairs_review.json (accept/reject lists
  I wrote by hand after reading pairs_candidates.csv).
"""
import csv, json, os, re, unicodedata
from collections import defaultdict

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'local', 'puls_corpus'))
ORDER = {'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6}
POS = {'іменник': 'noun', 'прикметник': 'adj', 'дієслово (недок.)': 'verb_impf', 'дієслово (док.)': 'verb_pf',
       'дієслово': 'verb', 'прислівник': 'adv', 'числівник': 'num', 'частка': 'part', 'займенник': 'pron',
       'вигук': 'intj', 'прийменник': 'prep', 'сполучник': 'conj', 'незмінюване слово': 'noninfl', '': ''}

def norm(s):
    s = unicodedata.normalize('NFC', s).replace('́', '')
    s = re.sub(r"[’ʼ`´‘]", "'", s)
    return re.sub(r'\s+', ' ', s).strip()

def key(s): return norm(s).lower()

def lvl_min(levels): return min(levels, key=lambda l: ORDER.get(l, 9))

PF_PREFIX = ['по', 'з', 'зі', 'с', 'на', 'про', 'ви', 'за', 'о', 'об', 'у', 'в', 'при', 'роз', 'під', 'від', 'пере', 'до']

def aspect_candidates(impf, pf):
    """Yield (impf, pf) guesses: prefixed perfective, or a secondary imperfective in -ува-/-ва-/-я-."""
    imps = set(impf)
    for p in pf:
        for pre in PF_PREFIX:
            if p.startswith(pre) and p[len(pre):] in imps: yield p[len(pre):], p, 'prefix-' + pre
        stem = p[:-3] if p.endswith(('ити', 'іти', 'ати', 'яти', 'ути')) else None
        if not stem: continue
        for suf in ['увати', 'ювати', 'ати', 'яти', 'вати', 'ївати', 'ювати']:
            for cand in {stem + suf, stem[:-1] + suf}:
                if cand in imps and cand != p: yield cand, p, 'suffix'
        # alternations: -ити -> -ляти (зробити? no), вирішити/вирішувати handled; відповісти/відповідати
    # irregular common pairs the rules miss (I wrote these by hand)

FEM = [lambda m: m + 'ка', lambda m: m + 'иця', lambda m: m[:-1] + 'иця', lambda m: m + 'киня',
       lambda m: m[:-1] + 'ка', lambda m: m[:-2] + 'ка', lambda m: m[:-2] + 'иця', lambda m: m + 'ня', lambda m: m[:-1] + 'ня']

def main():
    rows = list(csv.DictReader(open(os.path.join(ROOT, 'entries_raw.csv'), encoding='utf-8')))
    phrases, lem = [], {}
    for r in rows:
        lab = norm(r['label'].replace('\n', ' '))
        is_phrase = r['type'] != 'значення' or re.search(r'[?!]', lab) or len(lab.split()) > 3
        if is_phrase:
            phrases.append({**r, 'label': lab}); continue
        k = lab.lower()
        L = lem.setdefault(k, {'uk': lab, 'levels': [], 'pos': [], 'guidewords': [], 'ids': [], 'lexemes': []})
        if L['uk'][0].islower() and lab[0].isupper(): pass
        L['levels'].append(r['level']); L['ids'].append(r['id'])
        if POS.get(r['pos'], r['pos']) not in L['pos']: L['pos'].append(POS.get(r['pos'], r['pos']))
        if r['guideword'] and r['guideword'] not in L['guidewords']: L['guidewords'].append(r['guideword'])
        if r['lexeme_id'] not in L['lexemes']: L['lexemes'].append(r['lexeme_id'])
    # pair candidates
    impf = [k for k, L in lem.items() if 'verb_impf' in L['pos']]
    pf = [k for k, L in lem.items() if 'verb_pf' in L['pos']]
    cands = {}
    for a, b, why in aspect_candidates(impf, pf): cands[(a, b)] = ('aspect', why)
    nouns = {k for k, L in lem.items() if 'noun' in L['pos']}
    for m in nouns:
        for f in FEM:
            g = f(m)
            if g != m and g in nouns and len(m) >= 3: cands[(m, g)] = ('gender', '')
    with open(os.path.join(ROOT, 'pairs_candidates.csv'), 'w', newline='', encoding='utf-8') as fh:
        w = csv.writer(fh); w.writerow(['a', 'b', 'kind', 'rule', 'level_a', 'level_b'])
        for (a, b), (kind, why) in sorted(cands.items()):
            w.writerow([a, b, kind, why, lvl_min(lem[a]['levels']), lvl_min(lem[b]['levels'])])
    review_path = os.path.join(os.path.dirname(__file__), 'pairs_accept.json')
    review = json.load(open(review_path, encoding='utf-8'))
    # only hand-accepted pairs merge; the rule candidates were just a reading list
    pairs = [tuple(x) for x in review['accept'] if x[0] in lem and x[1] in lem]
    print('accepted pairs present in PULS:', len(pairs), 'of', len(review['accept']))
    # merge: a word joins at most one pair; the first member is the display head (impf / masc)
    used, out = set(), []
    for a, b in pairs:
        if a in used or b in used: continue
        used |= {a, b}
        A, B = lem[a], lem[b]
        out.append({'uk': f"{A['uk']}, {B['uk']}", 'forms': f"{A['uk']};{B['uk']}", 'pair': 'aspect' if 'verb_pf' in B['pos'] else 'gender',
                    'levels': A['levels'] + B['levels'], 'pos': A['pos'] + [p for p in B['pos'] if p not in A['pos']],
                    'guidewords': A['guidewords'] + B['guidewords'], 'ids': A['ids'] + B['ids'], 'lexemes': A['lexemes'] + B['lexemes']})
    for k, L in lem.items():
        if k not in used: out.append({**L, 'forms': L['uk'], 'pair': ''})
    for o in out:
        o['puls_level'] = lvl_min(o['levels'])
        o['puls_levels_all'] = ';'.join(sorted(set(o['levels']), key=ORDER.get))
    out.sort(key=lambda o: (ORDER[o['puls_level']], o['uk'].lower()))
    with open(os.path.join(ROOT, 'lemmas.csv'), 'w', newline='', encoding='utf-8') as fh:
        w = csv.writer(fh)
        w.writerow(['uk', 'forms', 'pair', 'pos_all', 'puls_level', 'puls_levels_all', 'guidewords', 'puls_lexeme_id', 'source_row_ids'])
        for o in out:
            w.writerow([o['uk'], o['forms'], o['pair'], ';'.join(o['pos']), o['puls_level'], o['puls_levels_all'],
                        ' | '.join(o['guidewords']), ';'.join(o['lexemes']), ';'.join(o['ids'])])
    with open(os.path.join(ROOT, 'phrases.csv'), 'w', newline='', encoding='utf-8') as fh:
        w = csv.DictWriter(fh, fieldnames=list(phrases[0].keys())); w.writeheader(); w.writerows(phrases)
    from collections import Counter
    print('meanings in corpus:', sum(len(o['ids']) for o in out), ' phrases parked:', len(phrases))
    print('pair candidates:', len(cands), ' merged pairs:', sum(1 for o in out if o['pair']))
    print('lemmas by level:', dict(sorted(Counter(o['puls_level'] for o in out).items(), key=lambda x: ORDER[x[0]])))
    bad = [o['uk'] for o in out if re.search('[ыэъё]', o['uk'].lower())]
    print('Russian-only letters:', bad)

if __name__ == '__main__':
    main()
