# Turns folk tunes written in ABC notation into chiptune note data for the game, merged into data/music.json.
# The melody comes from the ABC; the bass is our own: for each bar we pick the chord (I, IV, V; in minor i, iv, V, III, VII)
# that best fits the melody notes, and play root and fifth under it.
# usage: abc.py tunes_dir data/music.json      (tunes_dir/<id>.abc, one tune per file; see TUNES below)
import json, os, re, sys

TUNES = {
    # id: (file, transpose in semitones, which P: part to take or None for all, tempo in quarter notes a minute)
    # (Q: fields in these transcriptions disagree about what they count, so the tempo is set by ear for each dance)
    'sich': ('viyskova.abc', 0, None, 112),
    'rapidsTune': ('metelytsya.abc', 0, None, 132),
    'kyivTune': ('kyieva_luben.abc', 0, None, 116),
    'polissiaTune': ('maty_na_selo.abc', 0, None, 84),
    'bir': ('po_dorozi_zhuk.abc', 0, None, 104),
    'synevyr': ('soloveyko.abc', 0, None, 96),
    'kolomyika': ('kolomiyka.abc', 0, 'Vocal Melody', 132),
    'arkan': ('arkan.abc', 0, None, 120),
    'opryshky': ('opryshky.abc', 0, None, 72),
    'podillia': ('kolomiyka_podilia.abc', 0, None, 112),
    'monastyr': ('na_hori_monastyr.abc', 0, None, 76),
    'chumak': ('chumak.abc', 0, None, 104),
    'kateryna': ('kucheryava_kateryna.abc', 0, None, 84),
    'bilekrylo': ('bile_krylo.abc', 0, None, 80),
    'hramofon': ('hramofon.abc', 0, None, 88),
    'koval': ('koval.abc', 0, None, 112),
    'poltava': ('poltavskiy.abc', 0, None, 120),
    'pereyaslavko': ('pereyaslavko.abc', 0, None, 96),
    'berehynia': ('berehom.abc', 0, None, 96),
    'chabany': ('chabanskoho_kozachka.abc', 0, None, 120),
}

MODES = {'maj': 0, 'major': 0, 'ion': 0, 'min': 9, 'minor': 9, 'm': 9, 'aeo': 9, 'mix': 7, 'dor': 2, 'phr': 4, 'lyd': 5, 'loc': 11}
LETTER = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
SHARPS = 'FCGDAEB'


def key_sig(k):
    """K: field -> (dict letter -> accidental, tonic pitch class, minor?)"""
    k = k.split('%')[0].strip()
    m = re.match(r'([A-G])([#b]?)\s*([A-Za-z]*)', k)
    if not m: return {}, 0, False
    tonic = (LETTER[m.group(1)] + (1 if m.group(2) == '#' else -1 if m.group(2) == 'b' else 0)) % 12
    mode = m.group(3).lower()[:3] if m.group(3) else 'maj'
    if m.group(3) == 'm' or mode == 'min': mode = 'min'
    off = MODES.get(mode, 0)
    major = (tonic - off) % 12                       # the relative major
    order = [7, 2, 9, 4, 11, 6, 1]                    # major keys by number of sharps: G D A E B F# C#
    flats = [5, 10, 3, 8, 1, 6, 11]                   # F Bb Eb Ab Db Gb Cb
    acc = {}
    if major in order: n = order.index(major) + 1; acc = {SHARPS[i]: 1 for i in range(n)}
    elif major in flats: n = flats.index(major) + 1; acc = {'BEADGCF'[i]: -1 for i in range(n)}
    return acc, tonic, off == 9 or mode in ('dor', 'phr')


def parse(text, part=None):
    """header fields, and the music lines (with any mid-tune K:/L:/M: changes) of the chosen P: part"""
    head, body, cur_part = {}, [], None
    for line in text.replace('&gt;', '>').replace('&lt;', '<').replace('&amp;', '&').splitlines():
        line = line.split('%')[0].rstrip()
        if not line.strip(): continue
        m = re.match(r'^([A-Za-z]):\s*(.*)$', line)
        if m:
            f, v = m.group(1), m.group(2)
            if f == 'P': cur_part = v.strip(); continue
            if body and f in 'KLM':
                if part is None or cur_part == part: body.append(('field', f, v))
                continue
            head.setdefault(f, v)
            continue
        if part is None or cur_part == part: body.append(('music', line.rstrip('\\')))
    return head, body


def frac(s, default=1.0):
    """an ABC length suffix -> multiplier"""
    if not s: return default
    if '/' in s:
        a, b = s.split('/', 1)
        num = float(a) if a else 1.0
        den = float(b) if b else 2.0 * (2 ** (s.count('/') - 1)) if s.replace('/', '') == a else float(b)
        if s.endswith('/') and not b: den = 2 ** s.count('/')
        return num / den
    return float(s)


TOKEN = re.compile(r'''(\{[^}]*\})|("[^"]*")|(![^!]*!)|(\[[1-9])|(\|[1-9])|(:\|\]|:\||\|:|::|\|\]|\|\||\[\||\|)|(\(\d)|([()~.HLMOPSTuv-])|(\[[^\]]+\][\d/]*)|((?:\^\^|\^|__|_|=)?[A-Ga-gz][,']*[\d/]*)|([<>]+)|(\s+)''')


def notes_of(head, body, transpose):
    L = frac(head.get('L', '1/8').strip())
    acc, tonic, minor = key_sig(head.get('K', 'C'))
    events, bars = [], []             # events: (start in quarters, len, pitch or None)
    t = 0.0
    seq = []                          # flattened tokens with structure markers
    for kind, *rest in body:
        if kind == 'field':
            f, v = rest
            if f == 'L': L = frac(v.strip())
            if f == 'K': acc, tonic, minor = key_sig(v)
            continue
        line = rest[0]
        for m in TOKEN.finditer(line):
            g = m.groups()
            if g[0] or g[1] or g[2]: continue
            if g[3] or g[4]: seq.append(('volta', int((g[3] or g[4])[1]))); continue
            if g[5]: seq.append(('bar', g[5])); continue
            if g[6]: seq.append(('tuplet', int(g[6][1]))); continue
            if g[8]:                                 # a chord: keep its top note, with its own length
                inner = re.findall(r"((?:\^\^|\^|__|_|=)?[A-Ga-g][,']*)([\d/]*)", g[8])
                if inner: seq.append(('note', inner[-1][0], inner[-1][1]))
                continue
            if g[9]:
                mm = re.match(r"((?:\^\^|\^|__|_|=)?)([A-Ga-gz])([,']*)([\d/]*)", g[9])
                seq.append(('note', mm.group(1) + mm.group(2) + mm.group(3), mm.group(4)))
                continue
            if g[10]: seq.append(('broken', g[10])); continue
    # a chord's length is written after its closing bracket: find "]2" patterns
    # (we approximate: chord tokens take the length that follows them in the source, handled by the regex above as '')
    # expand repeats: split into bars, then walk
    bars_tok, cur = [], []
    for tok in seq:
        cur.append(tok)
        if tok[0] == 'bar': bars_tok.append(cur); cur = []
    if cur: bars_tok.append(cur)
    order, start, i, played_volta = [], 0, 0, set()
    # simple repeat expansion: |: ... :| with optional |1 ... :|2 ...
    out_tokens = []
    section = []
    k = 0
    while k < len(seq):
        tok = seq[k]
        if tok == ('bar', '|:') or tok == ('bar', '[|'):
            out_tokens.extend(section); section = []; k += 1; continue
        if tok[0] == 'bar' and tok[1] in (':|', ':|]', '::'):
            # play the section twice; first time with volta 1, second time skip volta 1 and take what follows
            first = [x for x in section]
            v1 = next((j for j, x in enumerate(section) if x == ('volta', 1)), None)
            if v1 is not None:
                out_tokens.extend(section)                     # first time through, ending 1
                out_tokens.extend(section[:v1])                # second time: up to the first ending
                # then ending 2 follows in the source after this bar
            else:
                out_tokens.extend(section); out_tokens.extend(section)
            section = []
            k += 1
            if tok[1] == '::': pass
            continue
        section.append(tok); k += 1
    out_tokens.extend(section)
    # now play
    pending_acc = {}
    tuplet, tup_left, broken_next = 1.0, 0, 1.0
    last = None
    for tok in out_tokens:
        if tok[0] == 'bar': pending_acc = {}; bars.append(t); continue
        if tok[0] in ('volta',): continue
        if tok[0] == 'tuplet': n = tok[1]; tuplet = {2: 3 / 2, 3: 2 / 3, 4: 3 / 4, 5: 2 / 5, 6: 2 / 3, 7: 2 / 7}.get(n, 1); tup_left = n; continue
        if tok[0] == 'broken':
            if last is None: continue
            s, d, p = events[last]
            dots = len(tok[1])
            f = 1 - 0.5 ** dots
            if tok[1][0] == '>': events[last] = (s, d * (1 + f), p); t = s + d * (1 + f); broken_next = 1 - f
            else: events[last] = (s, d * (1 - f), p); t = s + d * (1 - f); broken_next = 1 + f
            continue
        if tok[0] == 'note':
            n, ln = tok[1], tok[2]
            mm = re.match(r"((?:\^\^|\^|__|_|=)?)([A-Ga-gz])([,']*)", n)
            a, letter, octs = mm.groups()
            dur = L * 4 * frac(ln) * tuplet * broken_next
            broken_next = 1.0
            if tup_left: tup_left -= 1; tuplet = tuplet if tup_left else 1.0
            if letter == 'z': events.append((t, dur, None)); last = len(events) - 1; t += dur; continue
            up = letter.upper()
            p = 60 + LETTER[up] + (12 if letter.islower() else 0) + 12 * octs.count("'") - 12 * octs.count(',')
            if a:
                v = {'^': 1, '^^': 2, '_': -1, '__': -2, '=': 0}[a]
                pending_acc[(up, p // 12)] = v
            v = pending_acc.get((up, p // 12), acc.get(up, 0))
            events.append((t, dur, p + v + transpose)); last = len(events) - 1
            t += dur
    return events, t, tonic, minor


def bassline(events, total, tonic, minor, beats_per_bar):
    """our own bass: per bar, the best-fitting chord of the key, root on the downbeat and the fifth halfway"""
    deg = [(0, 'maj'), (5, 'maj'), (7, 'maj')] if not minor else [(0, 'min'), (5, 'min'), (7, 'maj'), (3, 'maj'), (10, 'maj')]
    out, b = [], 0.0
    while b < total - 1e-6:
        ns = [(s, d, p) for s, d, p in events if p is not None and s < b + beats_per_bar and s + d > b]
        best, score = deg[0], -1
        for root, q in deg:
            r = (tonic + root) % 12
            tones = {r, (r + (4 if q == 'maj' else 3)) % 12, (r + 7) % 12}
            sc = sum(d * (1.5 if abs(s - b) < 1e-6 else 1) for s, d, p in ns if p % 12 in tones) + (0.01 if root == 0 else 0)
            if sc > score: best, score = (root, q), sc
        r = (tonic + best[0]) % 12
        low = 36 + r if r <= 7 else 24 + r + 12 - 12
        half = beats_per_bar / 2
        out.append((round(b, 3), round(half * .9, 3), low))
        out.append((round(b + half, 3), round(half * .9, 3), low + 7))
        b += beats_per_bar
    return out


def convert(path, transpose=0, part=None, bpm=None):
    text = open(path, encoding='utf-8').read()
    head, body = parse(text, part)
    events, total, tonic, minor = notes_of(head, body, transpose)
    m = re.match(r'(\d+)/(\d+)', head.get('M', '2/4').replace('C', '4/4'))
    bpb = int(m.group(1)) * 4 / int(m.group(2)) if m else 2
    q = head.get('Q', '').strip()
    tempo = bpm or (int(re.findall(r'\d+', q)[-1]) if re.findall(r'\d+', q) else 120)
    total = -(-total // bpb) * bpb
    mel = [[round(s, 3), round(d, 3), p] for s, d, p in events if p is not None]
    # keep the melody in the pulse channel's sweet spot
    while mel and sum(n[2] for n in mel) / len(mel) < 66: mel = [[s, d, p + 12] for s, d, p in mel]
    while mel and sum(n[2] for n in mel) / len(mel) > 80: mel = [[s, d, p - 12] for s, d, p in mel]
    bass = [list(x) for x in bassline([(s, d, p) for s, d, p in mel], total, tonic, minor, bpb)]
    # short dance tunes: play them twice per loop, the second time an octave up, like a band taking the tune again
    while total < 40:
        mel = mel + [[round(s + total, 3), d, p + 12 if p + 12 <= 88 else p] for s, d, p in mel]
        bass = bass + [[round(s + total, 3), d, p] for s, d, p in bass]
        total *= 2
    return {'bpm': tempo, 'len': total, 'mel': mel, 'bass': bass}


if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    data = json.load(open(dst, encoding='utf-8')) if os.path.exists(dst) else {}
    for tid, (f, tr, part, bpm) in TUNES.items():
        p = os.path.join(src, f)
        if not os.path.exists(p): print('missing', f); continue
        data[tid] = convert(p, tr, part, bpm)
        d = data[tid]
        print(f'{tid:14} {f:28} bpm {d["bpm"]:4} beats {d["len"]:6} notes {len(d["mel"]):4} range {min(n[2] for n in d["mel"])}-{max(n[2] for n in d["mel"])}')
    json.dump(data, open(dst, 'w', encoding='utf-8'), separators=(',', ':'))
    print('bytes', os.path.getsize(dst))
