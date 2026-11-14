# Encodes each level's word voices (the Piper WAV masters in local/puls_corpus/tts/) into clips-<level>.json:
# a list of base64 mp3s, one per entry in levels.json[level].new, '' where a clip is missing.
# The A1 words go into data/clips.json instead, which the build inlines.
# usage: python3 tools/clips.py [bitrate, default 24k]      (resumable: encoded mp3s are cached in local/puls_corpus/mp3/)
import base64, hashlib, json, os, subprocess, sys
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
TTS, MP3 = os.path.join(root, '..', 'local', 'puls_corpus', 'tts'), os.path.join(root, '..', 'local', 'puls_corpus', 'mp3')
rate = sys.argv[1] if len(sys.argv) > 1 else '24k'
os.makedirs(MP3, exist_ok=True)
said = json.load(open(os.path.join(root, 'data', 'levels_tts.json'), encoding='utf-8'))
for L, texts in said.items():
    out, missing = [], 0
    for t in texts:
        h = hashlib.sha1(t.encode('utf-8')).hexdigest()[:16]
        wav, mp3 = os.path.join(TTS, h + '.wav'), os.path.join(MP3, f'{h}-{rate}.mp3')
        if not os.path.exists(mp3) and os.path.exists(wav):
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-ac', '1', '-ar', '22050', '-b:a', rate, mp3 + '.tmp.mp3'], check=True)
            os.replace(mp3 + '.tmp.mp3', mp3)
        if os.path.exists(mp3): out.append(base64.b64encode(open(mp3, 'rb').read()).decode())
        else: out.append(''); missing += 1
    path = os.path.join(root, 'data', 'clips.json') if L == 'A1' else os.path.join(root, f'clips-{L}.json')
    json.dump(out, open(path, 'w'), separators=(',', ':'))
    print(L, len(out), 'clips,', missing, 'missing,', os.path.getsize(path) // 1024, 'KB')
