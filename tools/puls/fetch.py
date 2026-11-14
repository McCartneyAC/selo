#!/usr/bin/env python3
"""Polite, resumable fetcher for puls.peremova.org/entries (CC BY-NC-SA 4.0).

Every page is saved to local/puls_corpus/raw/ under a name derived from its
query, written to a .tmp file and renamed, so a power cut leaves either a whole
page or nothing. Rerunning skips pages already on disk. One request at a time,
about 1.5 s apart, backing off on errors, and stopping on 401/403 or repeated 429s.

Jobs:
  all      - /entries?page=1..N (default order)
  levels   - /entries?level[]=X&page=.. for A1..C1 (cross-check the counts)
  topics   - /entries?topic[]=ID&page=.. for each theme in the filter list
Usage: python3 tools/puls/fetch.py all levels topics
"""
import os, re, sys, time, urllib.request, urllib.error, urllib.parse

BASE = 'https://puls.peremova.org/entries'
UA = 'selo-vocab/1.0 (personal language-learning use; one request at a time)'
RAW = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'local', 'puls_corpus', 'raw')
RAW = os.path.abspath(RAW)
DELAY = 1.5
LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']

def fname(params):
    slug = '_'.join(f'{k.strip("[]")}-{v}' for k, v in params if k != 'page') or 'all'
    page = dict(params).get('page', '1')
    return os.path.join(RAW, f'{slug}__p{int(page):04d}.html')

_last = [0.0]
def get(params):
    path = fname(params)
    if os.path.exists(path):
        return open(path, encoding='utf-8').read(), False
    url = BASE + '?' + urllib.parse.urlencode(params)
    tries = 0
    while True:
        wait = _last[0] + DELAY - time.time()
        if wait > 0: time.sleep(wait)
        _last[0] = time.time()
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                html = r.read().decode('utf-8')
            break
        except urllib.error.HTTPError as e:
            if e.code in (401, 403):
                sys.exit(f'STOP: HTTP {e.code} on {url}')
            tries += 1
            if e.code == 429:
                ra = int(e.headers.get('Retry-After', '60'))
                if tries > 3: sys.exit(f'STOP: repeated 429 on {url}')
                print(f'429, waiting {ra}s', flush=True); time.sleep(ra); continue
            if tries > 5: sys.exit(f'STOP: HTTP {e.code} x{tries} on {url}')
            time.sleep(2 ** tries)
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            tries += 1
            if tries > 6: sys.exit(f'STOP: network error {e} on {url}')
            print(f'network error {e}, retry {tries}', flush=True); time.sleep(5 * tries)
    tmp = path + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f: f.write(html)
    os.replace(tmp, path)
    return html, True

def rows(html): return html.count("<tr class='entry'>")

def last_page(html):
    nums = [int(n) for n in re.findall(r'[?&;]page=(\d+)', html)]
    return max(nums) if nums else 1

def crawl(base_params, label):
    html, _ = get(base_params + [('page', '1')])
    n = last_page(html)
    got = rows(html)
    for p in range(2, n + 1):
        html, new = get(base_params + [('page', str(p))])
        got += rows(html)
        if new and p % 10 == 0: print(f'{label}: page {p}/{n}', flush=True)
    print(f'{label}: {n} pages, {got} rows', flush=True)

def topic_ids():
    html, _ = get([('page', '1')])
    return re.findall(r"data-option='(\d+)'", html)

if __name__ == '__main__':
    os.makedirs(RAW, exist_ok=True)
    jobs = sys.argv[1:] or ['all', 'levels', 'topics']
    if 'all' in jobs: crawl([], 'all')
    if 'levels' in jobs:
        for lv in LEVELS: crawl([('level[]', lv)], lv)
    if 'topics' in jobs:
        for t in topic_ids(): crawl([('topic[]', t)], 'topic ' + t)
    print('DONE', flush=True)
