#!/usr/bin/env python3
"""Parse saved PULS pages (local/puls_corpus/raw) into CSVs. Safe to rerun.

entries_raw.csv  - one row per entry id (meaning-N / phrase-N / ...), from the full crawl
puls_themes.csv  - (theme_id, theme_label, entry_id, lexeme_id)
Prints checks: page/row counts, duplicates, level distribution, and agreement
with the per-level crawls.
"""
import csv, glob, os, re, sys
from collections import Counter, defaultdict
from bs4 import BeautifulSoup

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'local', 'puls_corpus'))
RAW = os.path.join(ROOT, 'raw')

def parse_page(path):
    s = BeautifulSoup(open(path, encoding='utf-8').read(), 'lxml')
    out = []
    for tr in s.select('tr.entry'):
        td = tr.find_all('td')
        a = td[0].find('a')
        href = a['href'] if a else ''
        m = re.match(r'/lexemes/(\d+)#(\w+?)_(\d+)$', href)
        if not m:
            print('WARN unparsed href', path, href, file=sys.stderr); continue
        lex, kind, num = m.groups()
        out.append({
            'id': f'{kind}-{num}', 'lexeme_id': lex, 'href': href,
            'label': (a.get_text(strip=True) if a else td[0].get_text(strip=True)),
            'guideword': td[1].get_text(' ', strip=True),
            'level': td[2].get_text(strip=True),
            'pos': td[3].get_text(' ', strip=True),
            'type': td[4].get_text(' ', strip=True),
        })
    return out

def topic_labels():
    s = BeautifulSoup(open(os.path.join(RAW, 'all__p0001.html'), encoding='utf-8').read(), 'lxml')
    d = s.select_one("[data-filters--multi-option-filter-key-value='topic']")
    return {o['data-option']: o.get_text(strip=True) for o in d.select('[data-option]')}

def main():
    groups = defaultdict(list)
    for p in sorted(glob.glob(os.path.join(RAW, '*.html'))):
        groups[os.path.basename(p).split('__')[0]].append(p)
    allrows, seen, dup = [], {}, 0
    for p in groups['all']:
        for r in parse_page(p):
            if r['id'] in seen:
                dup += 1
                if seen[r['id']] != r: print('WARN conflicting dup', r['id'], file=sys.stderr)
                continue
            seen[r['id']] = r; allrows.append(r)
    print(f"all: {len(groups['all'])} pages, {len(allrows)} unique entries, {dup} repeated across pages")
    print('missing level:', sum(1 for r in allrows if not r['level']))
    print('types:', dict(Counter(r['type'] for r in allrows)))
    print('levels (meanings):', dict(sorted(Counter(r['level'] for r in allrows if r['type'] == 'значення').items())))
    print('levels (all):', dict(sorted(Counter(r['level'] for r in allrows).items())))
    # cross-check with per-level crawls
    for lv in ['A1', 'A2', 'B1', 'B2', 'C1']:
        ids = {r['id'] for p in groups.get('level-' + lv, []) for r in parse_page(p)}
        mine = {r['id'] for r in allrows if r['level'] == lv}
        print(f'level {lv}: crawl {len(ids)}, full list {len(mine)}, only-in-crawl {len(ids - mine)}, only-in-full {len(mine - ids)}')
        for i in ids - mine:
            print('  adding from level crawl', i, file=sys.stderr)
        for p in groups.get('level-' + lv, []):
            for r in parse_page(p):
                if r['id'] not in seen: seen[r['id']] = r; allrows.append(r)
    with open(os.path.join(ROOT, 'entries_raw.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=list(allrows[0].keys())); w.writeheader(); w.writerows(allrows)
    labels = topic_labels()
    trows = []
    for key, pages in groups.items():
        if not key.startswith('topic-'): continue
        tid = key.split('-', 1)[1]
        for p in pages:
            for r in parse_page(p):
                trows.append({'theme_id': tid, 'theme_label': labels.get(tid, ''), 'entry_id': r['id'], 'lexeme_id': r['lexeme_id']})
    with open(os.path.join(ROOT, 'puls_themes.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=['theme_id', 'theme_label', 'entry_id', 'lexeme_id']); w.writeheader(); w.writerows(trows)
    print(f'themes: {len({t["theme_id"] for t in trows})} of {len(labels)} fetched, {len(trows)} rows, '
          f'{len({t["entry_id"] for t in trows})} distinct entries tagged')

if __name__ == '__main__':
    main()
