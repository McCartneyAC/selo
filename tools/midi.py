# Minimal MIDI reader: prints each track's notes so the melody line can be picked out.
# Notes come out as (start beat, length in beats, MIDI pitch).
import struct, sys, json


def vlq(b, i):
    v = 0
    while True:
        c = b[i]; i += 1
        v = (v << 7) | (c & 0x7f)
        if not c & 0x80: return v, i


def read(path):
    b = open(path, 'rb').read()
    assert b[:4] == b'MThd'
    fmt, ntr, div = struct.unpack('>HHH', b[8:14])
    i, tracks, tempo = 14, [], 500000
    for _ in range(ntr):
        assert b[i:i + 4] == b'MTrk'
        ln = struct.unpack('>I', b[i + 4:i + 8])[0]; j, end = i + 8, i + 8 + ln
        t, run, on, notes, name = 0, None, {}, [], ''
        while j < end:
            d, j = vlq(b, j); t += d
            st = b[j]
            if st & 0x80: j += 1; run = st
            else: st = run
            if st == 0xff:
                typ = b[j]; ln2, j = vlq(b, j + 1); data = b[j:j + ln2]; j += ln2
                if typ == 0x51: tempo = int.from_bytes(data, 'big')
                if typ == 0x03: name = data.decode('latin-1')
            elif st in (0xf0, 0xf7):
                ln2, j = vlq(b, j); j += ln2
            else:
                hi = st & 0xf0
                if hi in (0xc0, 0xd0): j += 1; continue
                a, v = b[j], b[j + 1]; j += 2
                if hi == 0x90 and v > 0: on[a] = t
                elif hi == 0x80 or (hi == 0x90 and v == 0):
                    s = on.pop(a, None)
                    if s is not None: notes.append((round(s / div, 3), round((t - s) / div, 3), a))
        tracks.append({'name': name, 'notes': sorted(notes)})
        i = end
    return {'bpm': round(60e6 / tempo), 'tracks': tracks}


if __name__ == '__main__':
    m = read(sys.argv[1])
    print('bpm', m['bpm'])
    for k, tr in enumerate(m['tracks']):
        ns = tr['notes']
        if not ns: continue
        print(k, tr['name'], len(ns), 'notes', 'range', min(n[2] for n in ns), max(n[2] for n in ns), 'first', ns[:6])
