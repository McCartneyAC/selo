# Turns folk-tune MIDI files (8notes.com) into chiptune note data for the game: data/music.json.
# For each tune: the melody line, a bass line taken from the lowest piano notes, and the loop length.
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from midi import read

src = sys.argv[1]
TUNES = {
    # id: (file, melody track, bass track, transpose, tempo, first beat, last beat or None)
    'village': ('38035.mid', 1, 2, 0, 132, 16, None),     # Ти ж мене підманула
    'steppe': ('38108.mid', 1, 2, 0, 96, 0, None),       # Вербовая дощечка
    'kalynivka': ('38045.mid', 1, 2, 0, 120, 30, None),   # Ой, Марічко
    'forest': ('2811.mid', 1, 1, -12, 150, 0, None),     # Щедрик
    'night': ('38046.mid', 1, 2, 0, 96, 103.5, None),        # Ніч яка місячна
    'meadow': ('59466.mid', 1, 2, 0, 104, 20, None),      # Ой у лузі червона калина
    'prayer': ('38047.mid', 1, 1, 0, 66, 0, None),       # Молитва за Україну (Lysenko)
}
out = {}
for tid, (f, mt, bt, tr, bpm, b0, b1) in TUNES.items():
    m = read(os.path.join(src, f))
    tracks = m['tracks']
    mel = [n for n in tracks[mt]['notes'] if n[2] > 0]
    if mt == bt:  # one piano track: melody is the top voice, bass the bottom
        by = {}
        for n in mel: by.setdefault(n[0], []).append(n)
        top = [max(v, key=lambda n: n[2]) for v in by.values()]
        bot = [min(v, key=lambda n: n[2]) for v in by.values() if min(v, key=lambda n: n[2])[2] < 60]
        mel, bass = sorted(top), sorted(bot)
    else:
        bass_src = [n for n in tracks[bt]['notes'] if n[2] < 55]
        by = {}
        for n in bass_src: by.setdefault(n[0], []).append(n)
        bass = sorted(min(v, key=lambda n: n[2]) for v in by.values())
    # keep the melody monophonic: highest note wins at any start
    seen = {}
    for n in mel:
        if n[0] not in seen or n[2] > seen[n[0]][2]: seen[n[0]] = n
    mel = sorted(seen.values())
    end = b1 or max(n[0] + n[1] for n in mel + bass)
    end = b0 + -(-(end - b0) // 4) * 4
    clip = lambda ns: [[round(s - b0, 3), round(d, 3), p + tr] for s, d, p in ns if b0 <= s < end]
    out[tid] = {'bpm': bpm, 'len': end - b0, 'mel': clip(mel), 'bass': clip(bass)}
    print(tid, f, 'beats', end - b0, 'mel', len(out[tid]['mel']), 'bass', len(out[tid]['bass']))
json.dump(out, open(sys.argv[2], 'w'), separators=(',', ':'))
print('bytes', os.path.getsize(sys.argv[2]))
